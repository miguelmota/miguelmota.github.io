---
layout: blog-post
title: Getting started with Service Workers
category: blog
tags: [JavaScript, HTML5, Service Workers]
description: Learn how to use the Service Workers API to cache files.
---
[Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) enables the ability to cache files for offline use, serve as a network proxy, enable the ability for push notification, and even background data sync. [AppCache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache) was an attempt to solve this problem but it made many assumptions about intended uses and in the end just caused more [fustration](http://alistapart.com/article/application-cache-is-a-douchebag) than anything, so it became deprecated. Service Workers is AppCache's successor, which greatly superceeds it by giving the developer a lot more granular control.

I will be walking you through a quick tutorial on using service workers for caching assets.

## Offline First

With an offline first approach, the browser can serve up a cached version of your site first before reaching out to the network for more data. It's the same approach that native mobile application use which gives the impression that the app is ready to use as soon as you open it.


## Service Worker Lifecycle

- First the service worker must be registered. The application must be served under `HTTPS` otherwise it will not register, unless it is on localhost.
- When registered successfully the service worker is executed in it's own [context](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope). It is similar to the main thread context except there is no DOM access.
- The browser will proceed to install assets to the cache specified by the service worker.
- If install is successful then the service worker is activated and can control pages.

## Registering Service Worker

We register the service worker with [serviceWorkerContainer.register()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register) and pass the path of the service worker file.

The service worker path needs to be relative to the site's origin, rather than the directory it is in. the service worker file must be hosted under the same origin therefore it cannot be from a different origin.

```javascript
// Feature detection for service worker
if ('serviceWorker' in navigator) {

  // Service worker to register for this site
  navigator.serviceWorker.register('/scripts/service-worker.js', {

    // Constrain access to a certain path
    scope: '/'
  }).then((serviceWorkerRegistration) => {
    console.log(`Service worker registered with scope ${serviceWorkerRegistration.scope}`);
  }).catch((error) => {
    console.log(`Service worker registration error: ${error}`);
  });
}
```

Here `scope` constrains the service worker to only control the specified contents under that path. The `scope` property is optional and defaults to the entire site.

## Caching Files

Service Workers come with a storage API called [cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache). The API persists the cached files until we tell it not to cache.

In `service-worker.js`:

```javascript
this.addEventListener('install', (event) => {
  event.waitUntil(

    // Open a cache store called `v1`
    caches.open('v1').then((cache) => {

      // Cache all these files
      return cache.addAll([
        '/',
        '/index.html',
        '/styles/index.css',
        '/scripts/index.js',
        '/images/js.png',
        '/images/not-found.png'
      ]);
    })
  );
});
```

The `install` event is fired when it has successfully completed the install.

Here [`event.waitUntil()`](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil) takes a promise which is used to determine if all the files successfully installed. The service worker will only install if every file is properly cached.

The [caches.open()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/open) method takes a name for the cache, and returns a promise for the created cache.

If it was able to successfully create the cache then we add assets using [cache.addAll()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/addAll) which takes an array of file paths relative to the origin.

If all the promises resolve then the service worker activates.

If any of these promises get rejected then the service worker will not install.

## Serving Cached Files

To make use of the cache we need to serve the cached files when there is a request to the file.

In `service-worker.js`:

```javascript
this.addEventListener('fetch', (event) => {
  event.respondWith(

    // Return cached file if it exists
    caches.match(event.request).catch(() => {

      // Otherwise make network request to fetch file
      return fetch(event.request);
    });
  );
});
```

The `fetch` event is fired whenever the resource under the service worker's scope is fetched.

We use `event.respondWith()` to hijack the HTTP response and be able to serve something else.

The [`catches.match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match) method takes filenames to retrieve from it's cache, which in this case `event.request` is the request object. If the cache is a miss then we want to go ahead and make an HTTP request to retrieve the file using the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API, otherwise the `caches.match` promise will be rejected and the resource will come up as not found in the network.

## Saving New Files to Cache

After we fetch a file that is not in the cache we can store it in the cache so future requests can avoid making the round-trip to the network.

```javascript
this.addEventListener('fetch', (event) => {
  event.respondWith(

    // Return cached file if it exists
    caches.match(event.request).catch(() => {

      // Otherwise make network request to fetch file
      return fetch(event.request);
    }).then((response) => {

      // If fetch successful then cache it
      if (response.ok) {
        caches.open('v1').then((cache) => {
          cache.put(event.request, response);
        });
        return response.clone();
      }

      // Otherwise reject to proceed to catch callback
      return Promise.reject();
    }).catch(() => {

      // Serve default file
      return caches.match('/images/not-found.png');
    })
  );
});
```

As you can see we have augmented our code from before.

If the fetch was successful then We open the cache and store the new file using [`cache.put()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/put) which takes a request object and a [response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object.

Response objects can only be read once so we need to clone it with [response.clone()](https://developer.mozilla.org/en-US/docs/Web/API/Response/clone) and use the original response for the cache.

If fetch failed then we serve the user a default image.

## Sending and Receiving Messages

Service workers provide a [clients](https://developer.mozilla.org/en-US/docs/Web/API/Clients) object which represents a container for service worker [client](https://developer.mozilla.org/en-US/docs/Web/API/Client) objects. Clients are open pages currently controlled by the service worker.

To broadcast a message from the service worker to all the pages we use [`postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/Client/postMessage).

In `service-worker.js`:

```javascript
// Broadcast to all open clients
self.clients.matchAll().then((clients) => {
  clients.map((client) => {
    return client.postMessage('This is message is from service worker.');
  })
});
```

Bind to the [`messsage`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/onmessage) event on the main to thread to receive the messages from service worker:

```javascript
navigator.serviceWorker.addEventListener('message', (event) => {
  console.log(`Received message from service worker: ${event.data}`);
});
```

Now to send message from the main thread to service worker we follow the same pattern.

In main thread:

```javascript
navigator.serviceWorker.controller.postMessage('This is a message from main thread.');
```

Make sure to post messages only after the service worker has been activated, other the controller object will be `null`.

To receive message in `service-worker.js`:

```javascript
self.addEventListener('message', (event) => {
  console.log(`Received message from main thread: ${event.data}`);
});
```

### Direct messages

If we want to send messages to the service worker but only respond to the sender rather than broadcasting then it gets a bit complex.

```javascript
function sendMessage(message) {
  return new Promise((resolve, reject) => {

    // Create a new message channel object
    const messageChannel = new MessageChannel();

    // Bind to `message` listener
    messageChannel.port1.onmessage = (event) => {
      resolve(`Received direct message from service worker: ${event.data}`);
    };

    // Send the message
    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2])
  });
}
```

First we need to create a new [MessageChannel](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel) object. A message channel is basically a pipe with a port on each end.

Then we bind a listener to the message event on the first message channel port. When posting a message we pass a reference to second port of message channel that the service woker can reply to the specific client.


In `service-worker.js`:

```javascript
self.addEventListener('message', (event) => {
  console.log(`Received message from main thread: ${event.data}`);

  // ports[0] is a reference of `port2` that we passed
  event.ports[0].postMessage(`Got message! Sending direct message back - "${event.data}"`);
});
```

## Debugging Service Workers

To debug in Google Chrome head to `chrome://inspect/#service-workers` in the browser url bar. There it will display service worker activity such as requests and storage. To start and stop service workers as well as see detailed information head to `chrome://serviceworker-internals`.

## Conclusion

Service workers give you granular control over caching, the ability to hijack requests, and notify clients with messages. Hope you found this guide useful. Check out the example code on github at [miguelmota/service-worker-example](https://github.com/miguelmota/service-worker-example).
