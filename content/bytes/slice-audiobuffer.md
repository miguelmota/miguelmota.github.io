---
layout: byte
title: How to slice an AudioBuffer
type: bytes
tag: [JavaScript, audio]
description: Slice out a portion of an AudioBuffer.
date: 2015-11-28T00:00:00-00:00
draft: false
---
Slice out a portion of an AudioBuffer.

```javascript
var audioContext = new (window.AudioContext || window.webkitAudioContext);

function AudioBufferSlice(buffer, begin, end, callback) {
  if (!(this instanceof AudioBufferSlice)) {
    return new AudioBufferSlice(buffer, begin, end, callback);
  }

  var error = null;

  var duration = buffer.duration;
  var channels = buffer.numberOfChannels;
  var rate = buffer.sampleRate;

  if (typeof end === 'function') {
    callback = end;
    end = duration;
  }

  // milliseconds to seconds
  begin = begin/1000;
  end = end/1000;

  if (begin < 0) {
    error = new RangeError('begin time must be greater than 0');
  }

  if (end > duration) {
    error = new RangeError('end time must be less than or equal to ' + duration);
  }

  if (typeof callback !== 'function') {
    error = new TypeError('callback must be a function');
  }

  var startOffset = rate * begin;
  var endOffset = rate * end;
  var frameCount = endOffset - startOffset;
  var newArrayBuffer;

  try {
    newArrayBuffer = audioContext.createBuffer(channels, endOffset - startOffset, rate);
    var anotherArray = new Float32Array(frameCount);
    var offset = 0;

    for (var channel = 0; channel < channels; channel++) {
      buffer.copyFromChannel(anotherArray, channel, startOffset);
      newArrayBuffer.copyToChannel(anotherArray, channel, offset);
    }
  } catch(e) {
    error = e;
  }

  callback(error, newArrayBuffer);
}
```

Usage:

```javascript
var audioContext = new AudioContext();
var analyser = audioContext.createAnalyser();
var source = audioContext.createBufferSource();
var url = 'https://example.com/audio.mp3';

var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.responseType = 'arraybuffer';
xhr.onerror = handleError;
xhr.onload = function() {
  if (xhr.status === 200) {
    handleBuffer(xhr.response);
  } else {
    console.error(xhr.statusText);
  }
};
xhr.send();

function handleError(error) {
  console.error(error);
}

function handleBuffer(audioData) {
  audioContext.decodeAudioData(audioData, decodeDone);
}

function decodeDone(buffer) {
  var begin = 50000;
  var end = begin + 20000;

  AudioBufferSlice(buffer, begin, end, function(error, slicedAudioBuffer) {
    if (error) {
      console.error(error);
    } else {
      source.buffer = slicedAudioBuffer;

      var gainNode = audioContext.createGain();
      gainNode.gain.value = 1;
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
    }
  });
}
```

On github at [miguelmota/audiobuffer-slice](https://github.com/miguelmota/audiobuffer-slice)
