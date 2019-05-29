---
layout: byte
title: How to send a Mulitpart POST using XMLHTTPRequest
type: bytes
tag: [JavaScript, XMLHttpRequest, binary]
description: How to send a Mulitpart POST using XMLHTTPRequest
date: 2016-04-10T00:00:00-00:00
draft: false
---
Here's an example of how to send a multipart POST containing binary data using XMLHTTPRequest:

```javascript
const xhr = new XMLHttpRequest();
const url = 'https://example.com';

// (assume dataView contains binary audio data)
const dataView = new DataView(buffer);

xhr.open('POST', url, true);
xhr.responseType = 'arraybuffer';
xhr.onload = (event) => {
  console.log(xhr.response);
};

xhr.onerror = (error) => {
	console.error(error);
};

const BOUNDARY = 'BOUNDARY1234';
const BOUNDARY_DASHES = '--';
const NEWLINE = '\r\n';
const AUDIO_CONTENT_TYPE = 'Content-Type: audio/L16; rate=16000; channels=1';
const AUDIO_CONTENT_DISPOSITION = 'Content-Disposition: form-data; name="audio"';

const postDataStart = [
  NEWLINE, BOUNDARY_DASHES, BOUNDARY, NEWLINE,
  AUDIO_CONTENT_DISPOSITION, NEWLINE, AUDIO_CONTENT_TYPE, NEWLINE, NEWLINE
].join('');

const postDataEnd = [NEWLINE, BOUNDARY_DASHES, BOUNDARY, BOUNDARY_DASHES, NEWLINE].join('');

const size = postDataStart.length + dataView.byteLength + postDataEnd.length;
const uint8Array = new Uint8Array(size);
let i = 0;

for (; i < postDataStart.length; i++) {
  uint8Array[i] = postDataStart.charCodeAt(i) & 0xFF;
}

for (let j = 0; j < dataView.byteLength; i++, j++) {
  uint8Array[i] = dataView.getUint8(j);
}

for (let j = 0; j < postDataEnd.length; i++, j++) {
  uint8Array[i] = postDataEnd.charCodeAt(j) & 0xFF;
}

const payload = uint8Array.buffer;

xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + BOUNDARY);
xhr.send(payload);
```

[Source](http://stackoverflow.com/questions/8262266/xmlhttprequest-multipart-related-post-with-xml-and-image-as-payload/10073841#10073841)
