---
layout: blog-post
title: Responsive Video
category: blog
tags: [JavaScript, responsive, video]
description: A simple script to make videos responsive.
---
Dealing with responsive video can be quite troublesome.

Here is a simple [script](https://gist.github.com/miguelmota/5424416) you might find useful:

```javascript
(function() {
    // Responsive Video
    function responsiveVideo(selector) {
        // Get videos
        var videos = document.querySelectorAll(selector);

        // Loop through videos
        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];

            // Get aspect ratio
            var videoRatio = (video.height / video.width) * 100;

            // Stretch video
            video.style.position = "absolute";
            video.style.top = 0;
            video.style.left = 0;
            video.setAttribute("width","100%");
            video.setAttribute("height","100%");

            // Add a wrapper to contain video
            var wrapper = document.createElement("div");
            wrapper.className = "video-wrap";
            wrapper.style.width = "100%";
            wrapper.style.position = "relative";
            wrapper.style.paddingTop = videoRatio + "%";

            // Add it to the DOM
            var parentNode = video.parentNode;
            parentNode.insertBefore(wrapper, video);
            wrapper.appendChild(video);
        }
    }

    // Initialize. Make sure it's after DOMContentLoaded.
    responsiveVideo(".video");
})();
```

This will work with HTML5 video, and embeded video such as YouTube or Vimeo.

[View Demo »]({{ page.url }}/demo)

If you found this helpful or found an easier solution, please comment.
