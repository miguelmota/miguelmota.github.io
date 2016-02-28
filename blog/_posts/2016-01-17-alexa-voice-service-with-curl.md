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

### Using SoX

There is a fantastic command line tool available called [SoX](http://sox.sourceforge.net/sox.html) for recording as well as converting audio to specified formats.

#### Recording audio

We can record audio right from our terminal like in this example:

```bash
$ sox -d -c 1 -r 16000 -e signed -b 16 hello.wav

Input File     : 'default' (coreaudio)
Channels       : 2
Sample Rate    : 44100
Precision      : 32-bit
Sample Encoding: 32-bit Signed Integer PCM

In:0.00% 00:00:01.72 [00:00:00.00] Out:25.8k [      |      ]        Clip:0
```

Alternatively, we can use the `rec` command instead of `sox -d`.

#### Playing audio

SoX comes with a `play` command for doing exactly what it says. Here an example where we pipe the audio contents:

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

We can see that the audio sample rate and encoding are exactly what we need.

#### Converting audio

We can use SoX to change the sample rate, encoding, and number of channels. Here is an example where we transform the audio into the format required by AVS:

```bash
$ cat hello_stero.wav | sox - -c 1 -r 16000 -e signed -b 16 hello.wav
```

The `-` means to use standard input (stdin) as the audio source.

### Using Audacity

We can use the program [Audacity](http://audacityteam.org/) to create sample audio to test with. Here I have highlighted the properties we need to configure.

[![]({{ page.url }}/audacity-mono-16khz.png)]({{ page.url }}/audacity-mono-16khz.png)

[![]({{ page.url }}/audacity-export-16bit-pcm.png)]({{ page.url }}/audacity-export-16bit-pcm.png)

Save the audio with extension `.wav`.

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

Here I have created this is a basic bash script that composes the cURL command. I walk us through the steps in the comments to clarify what is going on. Also if you have not already, you will need an authentication token which you can get by following this [Getting Started with Alexa Voice Service](https://developer.amazon.com/public/solutions/alexa/alexa-voice-service/getting-started-with-the-alexa-voice-service) guide.

```bash
############################################################
# First we creat a bunch of variables to hold data.
############################################################

# Auth token (replace with yours).
TOKEN="Atza|IQEBLjAsAhR..."

# Boundary name, must be unique so it does not conflict with any data.
BOUNDARY="BOUNDARY1234"
BOUNDARY_DASHES="--"

# Newline characters.
NEWLINE='\r\n';

# Metadata headers.
METADATA_CONTENT_DISPOSITION="Content-Disposition: form-data; name=\"metadata\"";
METADATA_CONTENT_TYPE="Content-Type: application/json; charset=UTF-8";

# Metadata JSON body.
METADATA="{\
\"messageHeader\": {},\
\"messageBody\": {\
\"profile\": \"alexa-close-talk\",\
\"locale\": \"en-us\",\
\"format\": \"audio/L16; rate=16000; channels=1\"\
}\
}"

# Audio headers.
AUDIO_CONTENT_TYPE="Content-Type: audio/L16; rate=16000; channels=1";
AUDIO_CONTENT_DISPOSITION="Content-Disposition: form-data; name=\"audio\"";

# Audio filename (replace with yours).
AUDIO_FILENAME="hello.wav"

############################################################
# Then we start composing the body using the variables.
############################################################

# Compose the start of the request body, which contains the metadata headers and
# metadata JSON body as the first part of the multipart body.
# Then it starts of the second part with the audio headers. The binary audio
# will come later as you will see.
POST_DATA_START="
${BOUNDARY_DASHES}${BOUNDARY}${NEWLINE}${METADATA_CONTENT_DISPOSITION}${NEWLINE}\
${METADATA_CONTENT_TYPE}\
${NEWLINE}${NEWLINE}${METADATA}${NEWLINE}${NEWLINE}${BOUNDARY_DASHES}${BOUNDARY}${NEWLINE}\
${AUDIO_CONTENT_DISPOSITION}${NEWLINE}${AUDIO_CONTENT_TYPE}${NEWLINE}"

# Compose the end of the request body, basically just adding the end boundary.
POST_DATA_END="${NEWLINE}${NEWLINE}${BOUNDARY_DASHES}${BOUNDARY}${BOUNDARY_DASHES}${NEWLINE}"

############################################################
# Now we create a request body file to hold everything including the binary audio data.
############################################################

# Write metadata to a file which will contain the multipart request body content.
echo -e $POST_DATA_START > multipart_body.txt

# Here we append the binary audio data to request body file
# by spitting out the contents. We do it this way so that
# the encoding do not get messed with.
cat $AUDIO_FILENAME >> multipart_body.txt

# Then we append closing boundary to request body file.
echo -e $POST_DATA_END >> multipart_body.txt

############################################################
# Finally we get to compose the cURL request command
# passing it the generated request body file as the multipart body.
############################################################

# Compose cURL command and write to output file.
curl -X POST \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: multipart/form-data; boundary=${BOUNDARY}" \
  --data-binary @multipart_body.txt \
  https://access-alexa-na.amazon.com/v1/avs/speechrecognizer/recognize \
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

As you can definitely tell, I am no bash expert but this does get the job done.

## Playing MP3 audio

The tool [mpg123](http://www.mpg123.de/) lets you play MP3 audio from the terminal. In order to extract the MP3 audio data from the response we need to use an HTTP message parser. Here is one that I wrote, [http-message-parser](https://github.com/miguelmota/http-message-parser), which lets you pipe the response and pipe out the parts that we want.

Pipe MP3 data to mpg123 player:

```bash
$ ./request.sh | http-message-parser --pick=multipart[1].body | mpg123 -

High Performance MPEG 1.0/2.0/2.5 Audio Player for Layers 1, 2 and 3
        version 1.22.4; written and copyright by Michael Hipp and others
        free software (LGPL) without any warranty but with best wishes

Playing MPEG stream 1 of 1: - ...

MPEG 2.0 layer III, 48 kbit/s, 24000 Hz mono

[0:02] Decoding of - finished.
```

## Update Jan 18 2016 - Easier way

I recently stumbled across a much cleaner way of initiating the request. Here it is:

`metadata.json`

```json
{
  "messageHeader": {},
  "messageBody": {
    "profile": "alexa-close-talk",
    "locale": "en-us",
    "format": "audio/L16; rate=16000; channels=1"
  }
}
```

`request.sh`

```bash
TOKEN="Atza|IQEBLjAsAhR..."

curl -i \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "metadata=<metadata.json;type=application/json; charset=UTF-8" \
  -F "audio=<hello.wav;type=audio/L16; rate=16000; channels=1" \
  -o response.txt \
  https://access-alexa-na.amazon.com/v1/avs/speechrecognizer/recognize \
```

The `-i` flag means to output the response headers. The `-H` flag specifies headers. The `-F` flag causes cURL to send a POST `multipart/form-data` request and `<` indicates that we want the contents of the file to sent instead of the actual file. Finally, `-o` specifies the output file.

