---
layout: blog-post
title: Alexa Voice Service (AVS) with cURL
category: blog
tags: [AVS, Alexa, Amazon, cURL]
description: Learn how to interact with Alexa Voice Service (AVS) RESTful API with cURL.
---
The [Alexa Voice Service (AVS)](https://developer.amazon.com/avs) is an Amazon service which lets you interact with [Alexa](https://developer.amazon.com/alexa) by sending requests in audio format. This means that we can create our own [Amazon Echo](https://en.wikipedia.org/wiki/Amazon_Echo) by just having a microphone and a speaker available. The easiest way to get started is with a *hello world* example using [cURL](https://en.wikipedia.org/wiki/CURL).

But before we jump to it cURL we have to generate our test audio first.

## Generate sample audio

The audio **MUST** be ***mono channel***, ***sampled at 16k Hz***, and ***signed 16 bit PCM encoding***. Otherwise AVS will send back a blank response.

We can use the program [Audacity](http://audacityteam.org/) to create sample audio to test with. Here I have highlighted the properties we need to configure.

[![]({{ page.url }}/audacity-mono-16khz.png)]({{ page.url }}/audacity-mono-16khz.png)

[![]({{ page.url }}/audacity-export-16bit-pcm.png)]({{ page.url }}/audacity-export-16bit-pcm.png)

Save the audio with extension `.wav`.

### Testing WAV audio

On Mac OSX there is a command line player available through the `play` command. You can simply pipe the audio data to it.

```bash
$ cat hello.wav | play -
-: (wav)

  Encoding: Signed PCM
  Channels: 1 @ 16-bit
  Samplerate: 16000Hz
  Replaygain: off
  Duration: 00:00:01.44

In:100%  00:00:01.44 [00:00:00.00] Out:63.3k [   -==|==-   ] Hd:0.0 Clip:1
play WARN rate: rate clipped 1 samples; decrease volume?
Done.
```

You can see that the audio sample rate and encoding are exactly what we need.

There is a fantastic tool available called [sox](http://sox.sourceforge.net/sox.html) for transforming audio. You can use sox to downsample and change to mono like in this example:

```bash
cat hello_stero.wav | sox - -c 1 -r 16000 -e signed -b 16 hello.wav
```

## Creating cURL request

The [AVS Speechrecognizer Requests API](https://developer.amazon.com/public/solutions/alexa/alexa-voice-service/rest/speechrecognizer-requests) page shows an example of what kind of request we should send. As you can see it is a multipart request with one of the parts being the binary audio data.

```
POST /v1/avs/speechrecognizer/xxxxxxxxxxxx HTTP/1.1

Host: access-alexa-na.amazon.com
Authorization: Bearer xxxxxxxxxxxx
Content-Type: multipart/form-data; boundary=boundary_term
Transfer-Encoding: chunked

--boundary_term
Content-Disposition: form-data; name="request"
Content-Type: application/json; charset=UTF-8

{
    "messageHeader": {
        "deviceContext": [
            {
                "name": "playbackState",
                "namespace": "AudioPlayer"
                "payload": {
                    "streamId": "xxxxxxxxxxxx",
                    "offsetInMilliseconds": xxxxxxxxxxxx,
                    "playerActivity": "xxxxxxxxxxxx"
                }
            },
            {
                ...
            },
            ...
        ]
    },
    "messageBody": {
        "profile": "alexa-close-talk",
        "locale": "en-us",
        "format": "audio/L16; rate=16000; channels=1"
    }
}

--boundary_term
Content-Disposition: form-data; name="audio"
Content-Type: audio/L16; rate=16000; channels=1

...encoded_audio_data...

--boundary_term--
```

Here I have created this is a basic bash script that composes the cURL command. I walk us through the steps in the comments to hopefully make more sense:

```bash
############################################################
# First we creat a bunch of variables to hold data.
############################################################

# Auth token (replace with yours)
TOKEN="Atza|IQEBLjAsAhR..."

# Boundary
BOUNDARY="BOUNDARY1234"
BOUNDARY_DASHES="--"

# Newline characters
NEWLINE='\r\n';

# Metadata headers
METADATA_CONTENT_DISPOSITION="Content-Disposition: form-data; name=\"metadata\"";
METADATA_CONTENT_TYPE="Content-Type: application/json; charset=UTF-8";

# Metadata JSON body
METADATA="{\
\"messageHeader\": {},\
\"messageBody\": {\
\"profile\": \"alexa-close-talk\",\
\"locale\": \"en-us\",\
\"format\": \"audio/L16; rate=16000; channels=1\"\
}\
}"

# Audio headers
AUDIO_CONTENT_TYPE="Content-Type: audio/L16; rate=16000; channels=1";
AUDIO_CONTENT_DISPOSITION="Content-Disposition: form-data; name=\"audio\"";

# Audio filename (replace with yours)
AUDIO_FILENAME="hello.wav"

############################################################
# Then we start composing the body using the variables.
############################################################

# Compose the start of the request body
POST_DATA_START="
${BOUNDARY_DASHES}${BOUNDARY}${NEWLINE}${METADATA_CONTENT_DISPOSITION}${NEWLINE}\
${METADATA_CONTENT_TYPE}\
${NEWLINE}${NEWLINE}${METADATA}${NEWLINE}${NEWLINE}${BOUNDARY_DASHES}${BOUNDARY}${NEWLINE}\
${AUDIO_CONTENT_DISPOSITION}${NEWLINE}${AUDIO_CONTENT_TYPE}${NEWLINE}"

# Compose the end of the request body
POST_DATA_END="${NEWLINE}${NEWLINE}${BOUNDARY_DASHES}${BOUNDARY}${BOUNDARY_DASHES}${NEWLINE}"

# Now we create a request body file to hold everything including the binary audio data.

# Write metadata to body file
echo -e $POST_DATA_START > multipart_body.txt

# Append binary audio data to body file
cat $AUDIO_FILENAME >> multipart_body.txt

# Append closing boundary to body file
echo -e $POST_DATA_END >> multipart_body.txt

############################################################
# Finally we get to compose the cURL request command
# passing it the generated request body file as the multipart body.
############################################################

# Compose cURL command and write to output file
curl -X POST \
  -H "Authorization: Bearer ${TOKEN}"\
  -H "Content-Type: multipart/form-data; boundary=${BOUNDARY}"\
  --data-binary @foo.txt\
  https://access-alexa-na.amazon.com/v1/avs/speechrecognizer/recognize\
  > response.txt
```

Save the contents to `request.sh`, make it executable, and run it:

```bash
$ chmod aug+x request.sh

$ ./request.sh
```

If all went well we should get a response similar to this one:

```
--a7ed2d26-a20f-474a-b4be-a589e1130d1e
Content-Type: application/json

{"messageHeader":{},"messageBody":{"directives":[{"namespace":"SpeechSynthesizer","name":"speak","payload":{"contentIdentifier":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#KnowledgePrompt.ab324d01-e5de-4945-8606-a1f03fdc7df0","audioContent":"cid:KnowledgePrompt.ab324d01-e5de-4945-8606-a1f03fdc7df0_1560908845"}}]}}
--a7ed2d26-a20f-474a-b4be-a589e1130d1e
Content-ID: <KnowledgePrompt.ab324d01-e5de-4945-8606-a1f03fdc7df0_1560908845>
Content-Type: audio/mpeg

...encoded_audio_data...
--a7ed2d26-a20f-474a-b4be-a589e1130d1e--
```
