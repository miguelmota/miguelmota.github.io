---
layout: blog-post
title: Alexa Voice Service (AVS) Authentication
category: blog
tags: [AVS, Alexa, Amazon, authentication, cURL]
description: Tutorial on how to authenticate with Alexa Voice Service.
---
Here I am going to explain how to generate an authentication token to use with [Alexa Voice Service](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-voice-service). I have been getting a lot of requests on how to do this step from people reading the [Alexa Voice Service with cURL](/blog/alexa-voice-service-with-curl/) blog post.

If you haven't already, go into the [Alexa dev portal](https://developer.amazon.com/edw/home.html#/avs/list) and create a new *Product Type*.

Here is a bash script to generate the authentication url and open it in a browser.

`auth.sh`:

```bash
CLIENT_ID="amzn1.application-oa2-client.796ab90fc5844fdbb8efc1739..."
DEVICE_ID="test_device"
DEVICE_SERIAL_NUMBER=123
REDIRECT_URI="https://localhost:9745/authresponse"
RESPONSE_TYPE="code"
SCOPE="alexa:all"
SCOPE_DATA="{\"alexa:all\": {\"productID\": \"$DEVICE_ID\", \"productInstanceAttributes\": {\"deviceSerialNumber\": \"${DEVICE_SERIAL_NUMBER}\"}}}"

function urlencode() {
  perl -MURI::Escape -ne 'chomp;print uri_escape($_),"\n"'
}

AUTH_URL="https://www.amazon.com/ap/oa?client_id=${CLIENT_ID}&scope=$(echo $SCOPE | urlencode)&scope_data=$(echo $SCOPE_DATA | urlencode)&response_type=${RESPONSE_TYPE}&redirect_uri=$(echo $REDIRECT_URI | urlencode)"

open ${AUTH_URL}
```

Make the script executable:

```bash
$ chmod aug+x auth.sh
```

Run the script:

```bash
$ ./auth.sh
```

You will be asked to log in. Once logged in you will be redirected to the redirect URI you have set.

Browser url should look like this.

```text
https://localhost:9745/authresponse?code=ANcUMLaDrkMtCwUSrIqc&scope=alexa%3Aall
```

Get the `code` parameter value.

Now we trade in that code token for an authentication token in order to make requests to the Alexa Voice Service API.

`token.sh`:

```bash
CLIENT_ID="amzn1.application-oa2-client.796ab90fc5844fdbb8efc1739..."
CLIENT_SECRET="1e3a306483c78510d4cdeb05e0a522f7ec3c1629ae1d53c325bfc..."
CODE="ANcUMLaDrkMtCwUSrIqc"
GRANT_TYPE="authorization_code"

curl -X POST --data "grant_type=${GRANT_TYPE}&code=${CODE}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}" https://api.amazon.com/auth/o2/token

```

Make the script executable and run it. You should now have a token.

```bash
{"access_token":"Atza|IQEBLjAsAhRN1wbDKtAXQ3OyvBspG_jUfn_EtQIUDGVeSG4qNMd9cFD8GOTKCYfQGF82Vd3sbhduBM8Y0_7YfLMmsrWEa5-QX_YvAqDXKszGmunesOPCLFdSlwmfRI6x5RhFRtraVlE6iIjWWus5qm8So4R2WpAls5fVJVpLrEvDt_fn4jpbNG1TTJizHOrpZRuAMd72HDGSYVarzI48BiyjMFZfxRj1TnlGz2rHiKEXTFuTYVkuUNjYseVpMhyzdhw6e_KCZUm-H7Ux9XJ5t0grYlkAjAgb2cpFP8_2NTtJ35kOmV5xKar3J2bfL894CqgTSqAMhidCVlcrAR4TBB52LG4jV29bUwzaht9uN3Mu982qjHpzhlS7ZE6ecfseGM4vbTMYyGlGn3zX7cwg6FVS8w","refresh_token":"Atzr|IQEBLjAsAhQIShi_1Jd-lnnoqHG_vZCoO307PgIUNyEfeDoAFuLIhyBVLAvZBSqexSUiPqEwBYVHRhOwaTbrHEAOcdGuTwW2U_f-BghCMzsbaLadcdFqTPaKeVEoUyCN5Msf3P44lKGZsbteRKteFD4fhAiUGtajvVG_OnDyl3Bcokuv-ApmVgLFwBE5ZpEXhD6f5An-9_ATLy4goMrZAyQoXRiCQseEmytL3B2RWt2NmNKTgAv3pSCXqbX3xbLHeP1vXnMKI8CjVUqSF910J9pIOYT_cD4hJf80WqHCCXPLqpi2BreUOcwvSwNdM4SVc1tnzzN1LCbDLAyCOTXf8CO-3BwtOcOE9MJ2wiiW9EMD9jp051pC1MgRadGRZ42X43fhIozLhXf4J-DVeSZapOa6Cw","token_type":"bearer","expires_in":3600}
```
