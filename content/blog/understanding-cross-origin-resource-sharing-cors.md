---
layout: blog-post
title: Understanding Cross-Origin Resource Sharing (CORS)
type: blog
tag: [http, cors, webdev, JavaScript, tutorial]
description: A deep dive into Cross-Origin Resource Sharing (CORS)
date: 2019-09-20T00:00:00-00:00
draft: false
---

*Cross-Origin Resource Sharing* ([CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)) is a way of making HTTP requests from one place to another. Historically browsers have only allowed requests in JavaScript to be made from the same domain enforced by the same-origin policy which prevents cross-origin type of requests.

CORS gives the server authority of who can make requests and what type of requests are allowed. Browsers are the clients that enforce CORS policies.

The server can configure:

- Which domains are allowed to make the HTTP request
- Which HTTP methods are allowed (GET, POST, PUT, DELETE, etc).
- Which headers are allowed on the request.
- Whether or not requests may include cookie information.
- Which response headers the client can read.

Intro TLDR;

> **CORS allows for restricted resources on a server to be accessed by a client on a different host.**

#### We'll be covering all that things that you need to know about CORS beyond `Access-Control-Allow-Origin: *` in this tutorial. Yes there's a lot to learn!

## Same-Origin vs Cross-Origin

For simplification purposes, a *same-origin* request is like 2 people in a house communicating.

![Same-origin communication example](t13focfa7t6umqlwx3ve.png)

There's no communication barrier between the Alice and Bob since they are in the same house (the same origin).

**VS**

A *cross-origin* request is like having 2 different houses and a person from one house communicating from a person on the other house.

![Cross-origin communication example](imfzw6o5hb8isupbz92i.png)

Since Bob wants to communicate with Charlie who lives in a different house then it's considered cross-origin communication because the homes live in different origins. And since Bob is initiating the call then the house Charlie is in needs to approve Bobs call.

TLDR;

> **A same-origin request is when the request is made from a host to the same host while a cross-origin request is when the request is made from a host to a different host.**

### Same-origin request

As an example, let's first make a same-origin request. We'll create a simple server offering an endpoint for the client and serving an HTML page. *Throughout this this tutorial we'll be using Node.js and the [express](https://expressjs.com/) server for simplicity sake.*

File `server.js`

```js
const express = require('express')
const app = express()
const port = 8000

app.use(express.static(__dirname))
app.get('/api/posts', (req, res) => {
  res.json([
    {id: 1, content: 'foo'},
    {id: 1, content: 'bar'},
  ])
})
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
```

File `index.html`

```html

<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <script>
    (async () => {
      const res = await fetch('http://localhost:8000/api/posts')

      console.log(await res.json())
    })()
  </script>
</body>
</html>
```

```bash
$ node server.js
listening on port 8000
```

If you visit [http://localhost:8000/](http://localhost:8000/) you can see the request was successful. Nothing crazy and expected because it's from the same origin.

![No CORS Error](im6fdmddwo2efdawwpkp.png)

### Cross-origin request

Now to show a cross-origin request let's spin up a new server to server the HTML file listening on a different port.

File `server2.js`

```js
const express = require('express')
const app = express()
const port = 9000

app.use(express.static(__dirname))
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
```

```bash
$ node server.js
listening on port 8000
```

```bash
$ node server2.js
listening on port 9000
```

Let's see what happens when we visit the second server's webpage at [http://localhost:9000/](http://localhost:9000/)

![CORS Error](zn3ea6vxrxjn5vunipn1.png)

The browser threw the error:

```
Access to fetch at 'http://localhost:8000/api/posts' from origin 'http://localhost:9000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

To demonstrate why this happened, let's see how the browser and server communicate with a simple chat example.

**Browser:** "hello server **http://127.0.0.1:8000** please give me the data at /api/posts and let me know if the client at **http://localhost:9000** can access it. Here's the HTTP message:"

```
Get /api/posts HTTTP1.1
User-Agent: Chrome
Host: 127.0.0.1:8000
Accept: */*
Origin: http://localhost:9000
```

**Server:** "here is the data, and the client cannot have access because I don't have the origin **http://localhost:9000** as an allowed origin to access the data."

```
HTTP/1.1 200 OK
```

The server responds with the data but the browser will not give it to the JavaScript client unless the server says that the client is allowed based on their origin.

What server has to do to allow cross-origin requests is set the `Access-Control-Allow-Origin` response header.

So let's try again by setting up CORS on the server now by adding a new header to every request. We'll be adding the `Access-Control-Allow-Origin` with a wildcard `*` value which tells the browser that any origin can access the resource.

File `server.js`

```js
const express = require('express')
const app = express()
const port = 8000

app.use(express.static(__dirname))
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  next()
})
app.get('/api/posts', (req, res) => {
  res.json([
    {id: 1, content: 'foo'},
    {id: 1, content: 'bar'},
  ])
})
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
```

Restart the server:

```bash
$ node server.js
listening on port 8000
```

```bash
$ node server2.js
listening on port 9000
```

Side note: `server2.js` will not be changing throughout this tutorial so you can leave it running. We'll only be changing `server.js` from now on.

Ok, now let's see what happens when we visit the second server's webpage at [http://localhost:9000/](http://localhost:9000/)

![No CORS Error using allow origin header](eyo6rdkn0bip28n85iv8.png)

To demonstrate why it works now, let's see how the browser and server communicate with a simple chat example again.

**Browser:** "hello server **http://127.0.0.1:8000** please give me the data at /api/posts and let me know if the client at **http://localhost:9000** can access it. Here's the HTTP message:"

```
Get /api/posts HTTTP1.1
User-Agent: Chrome
Host: 127.0.0.1:8000
Accept: */*
Origin: http://localhost:9000
```

**Server:** "here is the data, and yes any client can have access:"

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
```

## Access-Control-Allow-Origin

The most important CORS headers are:

- The `Origin` request header
- The` Access-Control-Allow-Origin` response header

The origin is the host which is composed of the protocol, hostname, and port:

```
Origin = protocol + hostname + port
```

Example protocols:

- http
- https

Example hostnames:

- localhost
- example.com
- foo.example.com

Example ports:

- 80
- 443
- 8000

Example origins:

- http://localhost:3000
- https://example.com
- https://example.com:8000
- https://foo.example.com:8000

The value `null` can be used a valid value for `Origin` when the browser origin can't be determined such as when using an absolute file path like `file:///Users/alice/wwww/index.html`

Browsers don't allow changing the origin header otherwise the client can pretend to be someone else.

The value of the `Access-Control-Allow-Origin` header can either be a wildcard or an origin value.

Example of valid headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Origin: http://localhost:8000
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Origin: null
```

You can only have one value so having multiple values like this is not valid:

```
# Not valid values, can't have multiple!
Access-Control-Allow-Origin: http://localhost:8000, http://example.com
```

To support multiple origins, you'll have to replace the header value dynamically with the current origin who's making the request.

For example, you would first check if the origin is whitelisted and then set the header:

```js
if (whitelist.contains(req.get('origin')) {
  res.set('Access-Control-Allow-Origin', req.get('origin'))
}
```

For localhost entries you can use a regular expression to match all port numbers, for example

The regex `/^http://\/\/localhost(:\d+)?$/i` matches

```
http://localhost
http://localhost:1
http://localhost:10
http://localhost:100
http://localhost:1000
http://localhost:2000 etc
```

You can use a hardcoded whitelist, regular expressions, or database query. A blacklist is better than nothing but not recommended.

Steps for origin validation:

- Read value from `Origin` header
- Validate origin using whitelist
- Set origin to value of `Access-Control-Allow-Origin`

You can add `null` to your whitelist if you don't care that the origin is not set.

```
Access-Control-Allow-Origin: null
```

TLDR;

> **Use the `Access-Control-Allow-Origin` header to tell the browser which origins are allowed to access the data.**

## Preflight requests

For certain HTTP methods, the browser asks for permissions by doing what is known as a *[preflight request](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Preflighted_requests)*. If the browser approves the response from the preflight request then the actual request is made. If the browser doesn't approve the response from the preflight request then the actual request is never made.

HTTP methods that trigger a preflight request are:

- `PUT`
- `PATCH`
- `DELETE`
- `TRACE`

HTTP methods that don't trigger a preflight request are known as *[simple requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests)* which are:

- `HEAD`
- `GET`
- `POST`

A preflight request is a small request to the server from the browser before the main request and contains information such as which HTTP method is used and if any http headers are present. The server determines if the browser should send the actual request by returning a 2xx HTTP status code or return an error indicating that the client should not send the actual request.

**The preflight request protects servers from receiving cross-origin requests they may not want.** If a server is CORS-enabled it will know how to handle a preflight request and can respond accordingly. If the server doesn't understand or care about CORS then the server won't send the correct preflight response.

The preflight request uses the `OPTIONS` HTTP method.

**A preflight is triggered when:**

- The client request is using a method other than `GET`, `POST` or `HEAD` (which are known as *simple methods*)

- Client sets the `Content-Type` request header with values other than:
  - `application/x-www-form-urencoded`
  - `multipart/form-data`
  - `text/plain`

- Client sets additional request headers that are not:
  - `Accept`
  - `Accept-Language`
  - `Content-Language`

Preflight responses should be in the `200` range (HTTP code 204 is standard) and contain no body. Containing a body can also confuse developers.

Let make a `DELETE` request to demonstrate a preflight request. First we'll check if the request is a preflight request. And if it is then return the HTTP `204 No Content` status code.

File `server.js`

```js
const express = require('express')
const app = express()
const port = 8000

const isPreflight = (req) => {
  return (
    req.method === 'OPTIONS' &&
    req.headers['origin'] &&
    req.headers['access-control-request-method']
  )
}

app.use(express.static(__dirname))
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')

  if (isPreflight(req)) {
    res.status(204).end()
    return
  }

  next()
})
app.get('/api/posts', (req, res) => {
  res.json([
    {id: 1, content: 'foo'},
    {id: 1, content: 'bar'},
  ])
})
app.delete('/api/posts', (req, res) => {
  res.json({success: true})
})
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
```

File `index.html`

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <script>
    (async () => {
      const res = await fetch('http://localhost:8000/api/posts', {
        method: 'DELETE'
      })

      console.log(await res.json())
    })()
  </script>
</body>
</html>
```

Restart the server:

```bash
$ node server.js
listening on port 8000
```

```bash
$ node server2.js
listening on port 9000
```

Now let's see what happens when we visit the second server's webpage at [http://localhost:9000/](http://localhost:9000/)

![CORS Error when missing headers](ebwb7zz05vqbizeq1rr2.png)

We can see the error saying that the method `DELETE` is not allowed by CORS:

```
Access to fetch at 'http://localhost:8000/api/posts' from origin 'http://localhost:9000' has been blocked by CORS policy: Method DELETE is not allowed by Access-Control-Allow-Methods in preflight response.
```

Remember, that simple requests such as `GET`, `POST`, or `HEAD` don't initiate a preflight request and they are automatically allowed methods by CORS but methods such as `DELETE` or `PUT` need to be explicit allowed by the server.

To allow the `DELETE` method to be performed by the client we'll need to add the response header `Access-Control-Allow-Methods` in the preflight request.

File `server.js`

```js
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')

  if (isPreflight(req)) {
    res.set('Access-Control-Allow-Methods', 'DELETE') // Add this!
    res.status(204).end()
    return
  }

  next()
})
```

And now the the `DELETE` request works as expected:

![No CORS Error with allow method header](y24d3v1v33k2dectegp3.png)

Notice the different number of requests made in the two screenshots.

- In the first screenshot, the preflight request failed so the actual `DELETE` request was never made, creating only 1 request.

![Preflight fail](gr7jcon19nzvsh86tgf1.png)

- In the second screenshot, the preflight request succeeded so the actual `DELETE` request was made, creating 2 requests.

![Preflight success](9fod10sj5yor5kqrezar.png)

**To reject a preflight request:**

- Leave out the `Access-Control-Allow-Origin` header.
- Return a value in `Access-Control-Allow-Methods` that doesn't match `Access-Control-Request-Method` header.
- If preflight request has an `Access-Control-Request-Header`
  - Leave out the `Access-Control-Allow-Headers` header.
  - Return a value in the `Access-Control-Allow-Headers` header that doesn't match the `Access-Control-Request-Headers` header.

Both preflight response and actual response need the `Access-Control-Allow-Origin` header.

The browser may cache the preflight response from the first request to a resource from that origin to avoid sending additional queries all the time.

Preflights are stateless, meaning that the actual request doesn't contain any information connecting it to the preflight request.

Preflight requests will never follow redirects. If trying to make a preflight request but server tries to redirect then the preflight request will fail. You can manually inspect the `Location` header to see where the server is trying to redirect you to. Only simple CORS requests (GET, POST, HEAD) will follow redirects.

If redirect is the same server, then the `Origin` header will stay the same, otherwise it will be set to `null`.


TLDR;

> **A preflight request determines if the client is allowed to make the actual request based on what the server allows. The request must be an `OPTIONS` method, have the `Access-Control-Request-Method` header (such as `DELETE` or `PUT`), and contain the `Origin` header to be considered a preflight request.**

## Access-Control-Request-Method

The `Access-Control-Request-Method` is a single request header value that asks permission to use a specific HTTP method. This header is set by the browser when the client sends a non-simple method request.

The `Access-Control-Request-Method` is only sent in the preflight request.

The screenshot below shows the `Access-Control-Request-Method` request header in the preflight request and shows the response header `Access-Control-Allow-Methods` in the preflight response from when we did the `DELETE` request earlier.

![CORS preflight Access-Control-Request-Method](zkrggkd37s991aqv54hx.png)

Use accurate preflight headers to protect your server from unexpected requests. If your server only allows `GET` requests then don't put other headers in the `Access-Control-Allow-Methods` header.

TLDR;

> **The browser will send the `Access-Control-Request-Method` request header in the preflight request to let the server know it's intending to use the requested method in the actual request. If the server allows that method, then the browser will make the actual request.**

## Access-Control-Allow-Methods

The `Access-Control-Allow-Methods` is used in preflight requests to tell the client which methods are allowed with CORS.

For example, having the `Access-Control-Allow-Methods: DELETE` header indicates the server allows the client to make `DELETE` requests to the URL.

The `Access-Control-Allow-Methods` request header can have multiple values, for example:

```
Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE
```


Remember that `GET`, `POST`, and `HEAD` are simple methods and always allowed so having them in the header is redundant and unnecessary, but some people like having them in the header because it's more to clear to them and avoids confusion.

Example showing PUT and DELETE (in addition to simple methods) as allowed:

![Allowed methods](nozz6gpbg1kmr5y0j0ks.png)


TLDR;

> **The server should respond with the `Access-Control-Allow-Methods` response header to let the browser know which HTTP methods the client is allowed to make.**

## Access-Control-Request-Headers

The `Access-Control-Request-Headers` request header is sent in the preflight request to let the server know which headers the client will be sending in the actual response.

Let's try to send a custom header to the server.

File `index.html`

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <script>
    (async () => {
      const res = await fetch('http://localhost:8000/api/posts', {
        headers: new Headers({
          'My-Custom-Header': 'hello world'
        })
      })

      console.log(await res.json())
    })()
  </script>
</body>
</html>
```

Now let's see what happens when we visit the second server's webpage at [http://localhost:9000/](http://localhost:9000/)


![CORS Error when using custom header](zznneu3moks9y7ch9wqc.png)

The browser responds with the error:

```
Access to fetch at 'http://localhost:8000/api/posts' from origin 'http://localhost:9000' has been blocked by CORS policy: Request header field my-custom-header is not allowed by Access-Control-Allow-Headers in preflight response.
```

Since browsers enforce CORS policies, the headers that cannot be set by JavaScript are:

- `Accept-Charset`
- `Accept-Encoding`
- `Access-Control-Request-Headers`
- `Access-Control-Request-Method`
- `Connection`
- `Content-Length`
- `Cookie`
- `Cookie2`
- `Date`
- `DNT`
- `Expect`
- `Host`
- `Keep-Alive`
- `Origin`
- `Referer`
- `TE`
- `Trailer`
- `Transfer-Encoding`
- `Upgrade`
- `User-Agent`
- `Via`
- headers starting with `Proxy-` or `Sec-`

These headers can only be set by the browser because they have special meaning. The browser will simply ignore the value that you set for those headers.

For other headers, the server will have to give permission to the client to include custom request headers on the cross-origin request.

We can see that the browser asked permission to access the custom header in the preflight request with the header `Access-Control-Request-Headers`:

![Preflight request header](sagpfs8qoppl0elvotmu.png)

The server needs to whitelist approved custom request headers and if doesn't whitelist the request headers then the request will fail.

If doing a same-origin request, then the request can include any custom request header since the origin is trusted.

By default CORS only allows the client to read these response headers:

- `Cache-Control`
- `Content-Language`
- `Content-Type`
- `Expires`
- `Last-Modified`
- `Pragma`

If the server sets additional response headers then the client won't be able to see them. In order for the client to see additional response headers then the server to expose those headers which we'll go over in a bit.

So to have the server be able to accept the client's custom header, it needs to explicitly allow that header by setting the response header `Access-Control-Allow-Headers` in the preflight response.

File `server.js`

```js
const express = require('express')
const app = express()
const port = 8000

const isPreflight = (req) => {
  return (
    req.method === 'OPTIONS' &&
    req.headers['origin'] &&
    req.headers['access-control-request-method']
  )
}

app.use(express.static(__dirname))
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')

  if (isPreflight(req)) {
    res.set('Access-Control-Allow-Methods', 'DELETE')
    res.set('Access-Control-Allow-Headers', 'My-Custom-Header') // Add this!
    res.status(204).end()
    return
  }

  next()
})
app.get('/api/posts', (req, res) => {
  res.json([
    {id: 1, content: 'foo'},
    {id: 1, content: 'bar'},
  ])
})
app.delete('/api/posts', (req, res) => {
  res.json({success: true})
})
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
```

Restart the server:

```bash
$ node server.js
listening on port 8000
```

```bash
$ node server2.js
listening on port 9000
```

Now let's see what happens when we visit the second server's webpage at [http://localhost:9000/](http://localhost:9000/)

![No CORS error with allowed headers](xuat3puelnwijmjzvsea.png)

The preflight responds with the allowed headers so the browser proceeds to make the actual request sending the custom request header.

![Allow headers](dns7r2g7xr5p189plp4f.png)

Remember that headers starting with `Access-Control-Request-` are request headers by the browser asking for permission by the server and headers starting with `Access-Control-Allow-` are response headers sent by the server granting permissions to the browser.

`Access-Control-Allow-Headers` only needs to be present on preflight responses.

TLDR;

> **The browser sends a `Access-Control-Request-Headers` request header in the preflight request to let the server know that the actual request will request the specified headers. If the server denies those headers to be requested, then the actual request will not be sent.**

## Access-Control-Expose-Headers

The `Access-Control-Allow-Headers` header is used by the preflight to indicate which headers are allowed on the request while the `Access-Control-Expose-Headers` header is used by the actual response to indicate which response headers are visible to the client.

The client won't be able to read a a response header if the server doesn't set in the expose header.

Headers that are always exposed to the client are *simple headers* which are:

- `Cache-Control`
- `Content-Language`
- `Content-Type`
- `Expires`
- `Last-Modified`
- `Pragma`

As an example let's try to read all the response headers on the client:

File `index.html`

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <script>
    (async () => {
      const res = await fetch('http://localhost:8000/api/posts')

      console.log(Array.from(await res.headers.entries()))
    })()
  </script>
</body>
</html>
```

Now let's see what happens when we visit the second server's webpage at [http://localhost:9000/](http://localhost:9000/)

![Client headers](g6b7q3tzmz8866eskbnv.png)

Nothing surprising yet, we get back standard headers.

Let's set a custom response header on the server side.

```js
const express = require('express')
const app = express()
const port = 8000

const isPreflight = (req) => {
  return (
    req.method === 'OPTIONS' &&
    req.headers['origin'] &&
    req.headers['access-control-request-method']
  )
}

app.use(express.static(__dirname))
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')

  if (isPreflight(req)) {
    res.set('Access-Control-Allow-Methods', 'DELETE')
    res.set('Access-Control-Allow-Headers', 'My-Custom-Header')
    res.status(204).end()
    return
  } else {
    res.set('Timezone-Offset', '240') // Add this!
  }

  next()
})
app.get('/api/posts', (req, res) => {
  res.json([
    {id: 1, content: 'foo'},
    {id: 1, content: 'bar'},
  ])
})
app.delete('/api/posts', (req, res) => {
  res.json({success: true})
})
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
```

Now let's see what happens when we visit the second server's webpage at [http://localhost:9000/](http://localhost:9000/)

![Client headers](g6b7q3tzmz8866eskbnv.png)

Wait, we just see the same headers. The new header wasn't provided. Well this is because the server needs to set which headers are allowed to be read by the client with the `Access-Control-Expose-Headers` response header.

Let's add `Access-Control-Expose-Headers` as a regular response header to tell the browser that the client is allowed to read the custom header:

File `server.js`

```js
const express = require('express')
const app = express()
const port = 8000

const isPreflight = (req) => {
  return (
    req.method === 'OPTIONS' &&
    req.headers['origin'] &&
    req.headers['access-control-request-method']
  )
}

app.use(express.static(__dirname))
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')

  if (isPreflight(req)) {
    res.set('Access-Control-Allow-Methods', 'DELETE')
    res.set('Access-Control-Allow-Headers', 'My-Custom-Header')
    res.status(204).end()
    return
  } else {
    res.set('Access-Control-Expose-Headers', 'Timezone-Offset') // Add this!
    res.set('Timezone-Offset', '240')
  }

  next()
})
app.get('/api/posts', (req, res) => {
  res.json([
    {id: 1, content: 'foo'},
    {id: 1, content: 'bar'},
  ])
})
app.delete('/api/posts', (req, res) => {
  res.json({success: true})
})
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
```

Restart the server:

```bash
$ node server.js
listening on port 8000
```

```bash
$ node server2.js
listening on port 9000
```

Now let's see what happens when we visit the second server's webpage at [http://localhost:9000/](http://localhost:9000/)

![No CORS error reading custom headers](1c7606jebrmitrzh0e4n.png)

We can now read the custom header the server sent to the browser in the client.

TLDR;

> **Use `Access-Control-Expose-Headers` to allow the client to read additional non-simple headers.**


## Access-Control-Max-Age

The `Access-Control-Max-Age` header indicates how long in seconds a preflight response should stay cached. Let's tell the browser to cache preflight response for 2 minutes (120 seconds) by setting the header `Access-Control-Max-Age` in the preflight response.

File `server.js`


```js
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')

  if (isPreflight(req)) {
    res.set('Access-Control-Allow-Methods', 'DELETE')
    res.set('Access-Control-Allow-Headers', 'My-Custom-Header')
    res.set('Access-Control-Max-Age', '120') // Add this!
    res.status(204).end()
    return
  } else {
    res.set('Access-Control-Expose-Headers', 'Timezone-Offset')
    res.set('Timezone-Offset', '240')
  }

  next()
})
```

Restart the server:

```bash
$ node server.js
listening on port 8000
```

```bash
$ node server2.js
listening on port 9000
```

We can see the `Access-Control-Max-Age` header in the preflight response header:

![CORS Max Age](ewm3oj6rw5ldncvcwf6x.png)

Firefox doesn't allow items to be cached longer than 24 hours while Chrome, Opera, and Safari cache items for a maximum of 5 minutes. If the `Access-Control-Max-Age` isn't specified then Firefox doesn't cache the preflight while Chrome, Opera, and Safari cache the preflight for 5 seconds.

Maximize the `Access-Control-Max-Age` header for a better mobile experience by reducing number of network requests.

To prevent proxy servers from caching responses from one client and sending them to a different client, use the `Vary: Origin` response header to indicate that the `Access-Control-Allow-Origin` will differ and should not be cached

```
Vary: Origin
```

For example:

```js
if (isPreflight(req)) {
  if (whitelist.contains(req.get('origin'))) {
    res.set('Access-Control-Allow-Origin', req.get('origin'))
  }

  res.set('Vary', 'Origin')
} else {
  res.set('Access-Control-Allow-Origin', '*')
}
```

TDLR;

> **The `Access-Control-Max-Age` tells the browser how long in seconds to cache preflight responses for.**


## Access-Control-Allow-Credentials

The `Access-Control-Allow-Credentials` header is used to allow the client to send sensitive information like cookies in cross-origin requests.

Cookies require additional configuration for security and safety reason because they contain sensitive information. It would be dangerous to accidentally send personal information to a website on a different origin if opt-in was enabled all the time.

The JavaScript `document.cookie` API cannot read or write the value from another origin. Calling `document.cookie` only returns the clients own cookies and not the cross-origin cookies. Cookies themselves use the same-origin policy and each cookie has a path and a domain and only pages that match the path and domain can read the cookie.

Cookies work best in situations where:

- You want to authorize users within your own ecosystem of clients and servers.
- You know exactly which clients will be accessing your server.

Websites identify users through user credentials, with the most popular form being the cookie. Servers use cookies to store a unique identifier that identifies the use such as a session ID tied to a user ID.

The same-origin HTTP request will always contain the cookie but cross-origin doesn't contain cookie by default.

Enable the credentials option in the client side to send:

- Cookies
- Basic authentication
- Client-side SSL certs

Let's set a cookie on the server and read the cookie on the client. For this example let's do it on the GET request for the posts. The response header for the cookie will be a simple key/value that can be read from any path.

```
Set-Cookie: username=alice; Path=/
```

File `server.js`

```js
const express = require('express')
const app = express()
const port = 8000

const isPreflight = (req) => {
  return (
    req.method === 'OPTIONS' &&
    req.headers['origin'] &&
    req.headers['access-control-request-method']
  )
}

app.use(express.static(__dirname))
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')

  if (isPreflight(req)) {
    res.set('Access-Control-Allow-Methods', 'DELETE')
    res.set('Access-Control-Allow-Headers', 'My-Custom-Header')
    res.set('Access-Control-Max-Age', '120')
    res.status(204).end()
    return
  } else {
    res.set('Access-Control-Expose-Headers', 'Timezone-Offset')
    res.set('Timezone-Offset', '240')
  }

  next()
})
app.get('/api/posts', (req, res) => {
  res.set('Set-Cookie', 'username=alice; Path=/') // Add this!
  res.json([
    {id: 1, content: 'foo'},
    {id: 1, content: 'bar'},
  ])
})
app.delete('/api/posts', (req, res) => {
  res.json({success: true})
})
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
```

File `index.html`

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <script>
    (async () => {
      const res = await fetch('http://localhost:8000/api/posts')

      console.log(document.cookie)
    })()
  </script>
</body>
</html>
```

Restart the server:

```bash
$ node server.js
listening on port 8000
```

```bash
$ node server2.js
listening on port 9000
```

Now let's see what happens when we visit the second server's webpage at [http://localhost:9000/](http://localhost:9000/)

![No cookies read](2fbz7xbmt28eyrhmqibh.png)

Nothing was logged! That's because cookies are allowed to be read by default on cross-origin requests. We can tell the server that we wish to read the cookies by setting `credentials: 'include'` on the fetch request options.

In the JavaScript fetch call you'll need to set `credentials: 'include'` to send cookies on cross-origin requests. If using `XMLHttpRequest` then you need to set `withCredentials: true`.

File `index.html`

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <script>
    (async () => {
      const res = await fetch('http://localhost:8000/api/posts', {
        credentials: 'include'
      })

      console.log(document.cookie)
    })()
  </script>
</body>
</html>
```

Now let's see what happens when we visit the second server's webpage at [http://localhost:9000/](http://localhost:9000/)

![Cookies read wildcard error](zqwzz44lgxoaakz9xsnz.png)

We get the error:

```
Access to fetch at 'http://localhost:8000/api/posts' from origin 'http://localhost:9000' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
```

Which means that in order for the client to read cookies, the `Access-Control-Allow-Origin` cannot be a wildcard `*` and it has to be explicitly set to the origin that's allowed to read the cookies.

Easy enough we can dynamically set the allowed origin to be the origin in the request header. In real world application you would be more secure and set to a whitelist of origins allowed to read cookies.

File `server.js`

```js
app.use((req, res, next) => {
  // res.set('Access-Control-Allow-Origin', '*') // remove this!
  res.set('Access-Control-Allow-Origin', req.get('origin')) // Add this!

  if (isPreflight(req)) {
    res.set('Access-Control-Allow-Methods', 'DELETE')
    res.set('Access-Control-Allow-Headers', 'My-Custom-Header')
    res.set('Access-Control-Max-Age', '120')
    res.status(204).end()
    return
  } else {
    res.set('Access-Control-Expose-Headers', 'Timezone-Offset')
    res.set('Timezone-Offset', '240')
  }

  next()
})
```

Restart the server:

```bash
$ node server.js
listening on port 8000
```

```bash
$ node server2.js
listening on port 9000
```

Now let's see what happens when we visit the second server's webpage at [http://localhost:9000/](http://localhost:9000/)

![Cookies credentials header error](dex8qiv81v78hehdpiz2.png)

We get the following error:

```
Access to fetch at 'http://localhost:8000/api/posts' from origin 'http://localhost:9000' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'.
```

This is because the browser needs to know that the server allows cookies to be read from cross-origin requests.

To enable cookie support the server must have the `Access-Control-Allow-Credentials` header set to `true` in order to indicate that the client is allowed to read cookies as well as that the server allows to receive cookies.

The only only value that the header `Access-Control-Allow-Credentials` can have is `true`.

```
Access-Control-Allow-Credentials: true
```

File `server.js`

```js
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', req.get('origin'))

  if (isPreflight(req)) {
    res.set('Access-Control-Allow-Methods', 'DELETE')
    res.set('Access-Control-Allow-Headers', 'My-Custom-Header')
    res.set('Access-Control-Max-Age', '120')
    res.status(204).end()
    return
  } else {
    res.set('Access-Control-Expose-Headers', 'Timezone-Offset')
    res.set('Access-Control-Allow-Credentials', 'true') // Add this!
    res.set('Timezone-Offset', '240')
  }

  next()
})
```

Restart the server:

```bash
$ node server.js
listening on port 8000
```

```bash
$ node server2.js
listening on port 9000
```

Now let's see what happens when we visit the second server's webpage at [http://localhost:9000/](http://localhost:9000/)

![Cookies read by client](26nnxbosodhp7o9w907b.png)

The client can now read the cookies!

We can see ` Access-Control-Allow-Credentials` set to `true` and `Access-Control-Allow-Origin` set to the actual origin instead of the wildcard which both headers are required for cookies to be allowed on the client.

![Credentials include header](umue5jjw06ys0kptxh3e.png)

The `Access-Control-Allow-Credentials` header can be present on both the preflight and actual request but the cookie will only be sent on the actual request. The header is only needed on the non-preflight response.

TLDR;

> **Set the response header `Access-Control-Allow-Credentials: true` to allow the client to read sensitive information like cookies. Use `credentials: 'include' if using the fetch API or use `withCredentials: true` if using the XMLHttpRequest API. `Access-Control-Allow-Origin` can't be a wildcard when requesting credentials.**

## CSRF

CSRF tokens are an unguessable token shared between the client and the server to protect against [cross-site request forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery) (CSRF) attacks. The server serves the page to the client with the token as a header and the client sends the CSRF token on each request. If the server can't validate the token then the request is invalidated an rejected CSRf protection is needed when the client is requesting protected data using a cookie.

Spoofing `Origin` with cURL is possible and easy but spoofing with a cookie is harder because cURL doesn't have access to the browser cookie directly or remotely.

Where possible, consider same-origin requests instead of using CSRF since it's safer.

Use something other than a cookie to validate user if building a public API, such as using Oauth2 instead.

## Browser support

CORS is fully supported on:

- Chrome 3+
- Firefox 3.5+
- Safari 4+
- IE 10+
- Opera 12+
- iOS 3.2+
- Android 2.1+

## Conclusion

We covered a variety of headers around CORS, including:

- [`Access-Control-Allow-Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)
- [`Access-Control-Request-Method`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method)
- [`Access-Control-Request-Headers`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers)
- [`Access-Control-Allow-Headers`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)
- [`Access-Control-Allow-Methods`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods)
- [`Access-Control-Expose-Headers`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)
- [`Access-Control-Allow-Credentials`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)
- [`Access-Control-Max-Age`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age)

Questions to ask when adding CORS support:

  - Why does the server need to support cross-origin requests?
  - Is CORS being added to new service or existing?
  - Which client should have access to the site?
  - What browsers and devices will users be accessing the site from?
  - Which HTTP methods and headers is the server supporting?
  - Should the API support user-specific data?
  - Will cookies be used to authenticate the user?

TLDR;

> **Only allow cross-origin requests if you must absolutely have to and be very explicit about which origins, methods, headers, and credentials are allowed.**

Resources:

- [MDN - Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Wikipedia - Cross-origin resource sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
- [Webpage to test CORS requests](https://www.test-cors.org/)
- [Node.js CORS middleware](https://github.com/expressjs/cors)
- [CORS in Action](https://livebook.manning.com/book/cors-in-action/about-this-book/)
