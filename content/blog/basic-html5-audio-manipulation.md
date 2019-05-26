---
layout: blog-post
title: Basic HTML5 Audio Manipulation
type: blog
tags: [HTML5, JavaScript, audio, demo]
description: Simple HTML5 audio controls using JavaScript.
date: 2013-07-07T00:00:00-00:00
draft: false
---
Using JavaScript, we can create an audio object and manipulate it very easily. Below is some code ([gist](https://gist.github.com/miguelmota/5942938)) to help you get started. You can `play`, `stop`, `pause`, and `loop` the audio.

```html
<!-- Audio Control Buttons -->
<button id="play-button">Play</button>
<button id="stop-button">Stop</button>
<button id="pause-button">Pause</button>
<button id="loop-button">Loop</button>
```

```javascript
// Basic HTML5 audio manipulation
(function () {

	'use strict';

	// Set namespace.
	var NS = {};

	// Control buttons.
	NS.playButton = document.getElementById('play-button');
	NS.stopButton = document.getElementById('stop-button');
	NS.pauseButton = document.getElementById('pause-button');
	NS.loopButton = document.getElementById('loop-button');

	// State variables.
	NS.looping = false;
	NS.paused = false;

	// Check for audio support.
	if ('Audio' in window) {

		// Create new audio object.
		NS.audio = new Audio();

		// Check for ogg support.
		if (!!(NS.audio.canPlayType && NS.audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''))) {
			NS.audio.src = 'media/rimshot.ogg';

		// Check for mp3 support.
		} else if (!!(NS.audio.canPlayType && NS.audio.canPlayType('audio/mpeg;').replace(/no/, ''))) {
			NS.audio.src = 'media/rimshot.mp3';

		// Check for mp4 support.
		} else if (!!(NS.audio.canPlayType && NS.audio.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, ''))) {
			NS.audio.src = 'media/rimshot.m4a';

		// Set default source to mp3.
		} else {
			NS.audio.src = 'media/rimshot.mp3';
		}

		// Reset audio to beginning.
		NS.resetAudio = function () {
			NS.audio.pause();
			NS.audio.currentTime = 0;
		};

		// Play button click listener.
		NS.playButton.onclick = function (e) {
			e.preventDefault();

			// Reset audio and play.
			NS.resetAudio();
			NS.audio.play();
		};

		// Stop button click listener.
		NS.stopButton.onclick = function (e) {
			e.preventDefault();

			// Reset audio.
			NS.resetAudio();
		};

		// Pause button click listener.
		NS.pauseButton.onclick = function (e) {
			e.preventDefault();

			// Toggle off paused state and play audio.
			if (NS.paused) {
				NS.audio.play();
				NS.paused = false;
				this.innerText = 'Pause';

			// Toggle on paused state and pause audio.
			} else {
				NS.audio.pause();
				NS.paused = true;
				this.innerText = 'Resume';
			}
		};

		// Loop button click listener.
		NS.loopButton.onclick = function (e) {
			e.preventDefault();

			// Toggle off looping stated and reset audio.
			if (NS.looping) {
				NS.resetAudio();
				NS.looping = false;
				this.innerText = 'Loop';

			// Toggle on looping state and play audio.
			} else {
				NS.resetAudio();
				NS.audio.play();
				NS.looping = true;
				this.innerText = 'Stop Looping';
			}

		};

		// Audio ended event listener.
		NS.audio.addEventListener('ended', function() {
			// Reset after audio has ended.
			NS.resetAudio();
			NS.pauseButton.innerText = 'Pause';

			// If looping, replay audio after it has ended.
			if (NS.looping) {
				this.play();
			}
		}, false);


	// No audio support.
	} else {
		alert('Your browser does not support the audio element.');
	}

})();
```

Check out the simple demo.

[View the demo »](demo)

[HTML5 Doctor](http://html5doctor.com/html5-audio-the-state-of-play/) has a great article on HTML5 audio. I recommend you check it out for more detailed information.