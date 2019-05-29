---
layout: blog-post
title: Screenshots with getUserMedia API
type: blog
tag: [HTML5, JavaScript, getUserMedia, demo]
description: Take webcam screenshots with the getUserMedia JavaScript API.
date: 2013-08-31T00:00:00-00:00
draft: false
---
With the `getUserMedia` API, it is now possible to access the user's webcam and microphone using just JavaScript. What this means is that we can finally get rid of those nasty Flash plugins and use this native approace instead. At the writing of this post, only Firefox 17+ and Chrome 21+ have [support for getUserMedia](http://caniuse.com/stream).

Give credit where credit is due. The code is heavily inspired by HTML5 Rocks' article *[Capturing Audio & Video in HTML5](http://www.html5rocks.com/en/tutorials/getusermedia/intro/)*.

[View the demo »](demo)

I tried explaining what the code does in the comments, but anyhow let me give a quick rundown of the code. First we create an object to hold everything that deals with the whole process of streaming and capturing. At the top, we grab our DOM elements and have an initialize function that checks for getUserMedia support. If there is support then call the gotStream function to start outputting the live stream into the video element. So that's that. There's a capture button binded to the capture method, which when called, will grab the current frame of the live video and draw that image onto the canvas element. We then turn the canvas image into a base 64 data url so that we can send it to our server, which will ultimately decode the data url and save it as a PNG image. Afterwards we simply return the saved image url. In the demo I am using PHP to decode the data url but any server side language will do I imagine.

```html
<!-- Video element (live stream) -->
<label>Video Stream</label>
<video autoplay id="video" width="640" height="480"></video>

<!-- Canvas element (screenshot) -->
<label>Screenshot (base 64 dataURL)</label>
<canvas id="canvas" width="640" height="480"></canvas>

<!-- Capture button -->
<button id="capture-btn">Capture!</button>

<!-- Image URL output -->
<label>Image URL</label>
<input type="text" id="image-url-input" disabled>
```

```javascript
(function() {

  // Our element ids.
  var options = {
    video: '#video',
    canvas: '#canvas',
    captureBtn: '#capture-btn',
    imageURLInput: '#image-url-input'
  };

  // Our object that will hold all of the functions.
  var App = {
    // Get the video element.
    video: document.querySelector(options.video),
    // Get the canvas element.
    canvas: document.querySelector(options.canvas),
    // Get the canvas context.
    ctx: canvas.getContext('2d'),
    // Get the capture button.
    captureBtn: document.querySelector(options.captureBtn),
    // This will hold the video stream.
    localMediaStream: null,
    // This will hold the screenshot base 64 data url.
    dataURL: null,
    // This will hold the converted PNG url.
    imageURL: null,
    // Get the input field to paste in the imageURL.
    imageURLInput: document.querySelector(options.imageURLInput),

    initialize: function() {
      var that = this;
      // Check if navigator object contains getUserMedia object.
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      // Check if window contains URL object.
      window.URL = window.URL || window.webkitURL;

      // Check for getUserMedia support.
      if (navigator.getUserMedia) {
        // Get video stream.
        navigator.getUserMedia({
          video: true
        }, this.gotStream, this.noStream);

        // Bind capture button to capture method.
        this.captureBtn.onclick = function () {
          that.capture();
        };
      } else {
        // No getUserMedia support.
        alert('Your browser does not support getUserMedia API.');
      }
    },

    // Stream error.
    noStream: function (err) {
      alert('Could not get camera stream.');
            console.log('Error: ', err);
    },

    // Stream success.
    gotStream: function (stream) {
      // Feed webcam stream to video element.
      // IMPORTANT: video element needs autoplay attribute or it will be frozen at first frame.
      if (window.URL) {
        video.src = window.URL.createObjectURL(stream);
      } else {
        video.src = stream; // Opera support.
      }

      // Store the stream.
      localMediaStream = stream;
    },

    // Capture frame from live video stream.
    capture: function () {
      var that = this;
      // Check if has stream.
      if (localMediaStream) {
        // Draw whatever is in the video element on to the canvas.
        that.ctx.drawImage(video, 0, 0);
        // Create a data url from the canvas image.
        dataURL = canvas.toDataURL('image/png');
        // Call our method to save the data url to an image.
        that.saveDataUrlToImage();
       }
    },

    saveDataUrlToImage: function () {
      var that = this;
      var options = {
        // Change this to your own url.
        url: 'http://example.com/dataurltoimage'
      };

      // Only place where we need jQuery to make an ajax request
      // to our server to convert the dataURL to a PNG image,
      // and return the url of the converted image.
      that.imageURLInput.value = 'Fetching url ...';
      $.ajax({
        url: options.url,
        type: 'POST',
        dataType: 'json',
        data: { 'data_url': dataURL },
        complete: function(xhr, textStatus) {
        // Request complete.
        },
        // Request was successful.
        success: function(response, textStatus, xhr) {
          console.log('Response: ', response);
          // Conversion successful.
          if (response.status_code === 200) {
            imageURL = response.data.image_url;
            // Paste the PNG image url into the input field.
            that.imageURLInput.value = imageURL;
                                                that.imageURLInput.removeAttribute('disabled');
          }
        },
        error: function(xhr, textStatus, errorThrown) {
          // Some error occured.
          console.log('Error: ', errorThrown);
          imageURLInput.value = 'An error occured.';
        }
      });
    }

  };

  // Initialize our application.
  App.initialize();

  // Expose to window object for testing purposes.
  window.App = App;

})();
```

```php
<?php
  // Data URL to image.

  // exit immediately if the data url was not passed.
  if (!isset($_REQUEST['data_url'])) {
    exit();
  }

  // Get the data url.
  $img = $_REQUEST['data_url'];

  // Clean up the data url string a bit.
  $img = str_replace('data:image/png;base64,', '', $img);
  $img = str_replace(' ', '+', $img);

  // Decode the image.
  $decodedImage = base64_decode($img);

  // Generate a random filename.
  $filename = md5(time()).'.png';

  // Save the file to the server and generate a response.
  if (file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/uploads/' . $filename, $decodedImage)) {
    $imageURL = 'http://' . $_SERVER['HTTP_HOST'] . '/uploads/' . $filename;
    $response = array(
      'status_code' => 200,
      'data' => array(
        'image_url' => $imageURL
      )
    );
  } else {
    $response = array(
      'status_code' => 500
    );
  }

  // Return JSON response.
  header("Content-Type: application/json");
  echo json_encode($response);
?>
```

Get this [gist.](https://gist.github.com/miguelmota/6403122)

[View the demo »](demo)

## Update 05 Jan 2015

Moved to a [repo on Github](https://github.com/miguelmota/getUserMedia-demo), with a [Node.js](http://nodejs.org/) server instead of PHP.

