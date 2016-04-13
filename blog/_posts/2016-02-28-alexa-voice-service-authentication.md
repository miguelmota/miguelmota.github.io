---
layout: blog-post
title: Alexa Voice Service (AVS) Authentication
category: blog
tags: [AVS, Alexa, Amazon, authentication, cURL]
description: Tutorial on how to authenticate with Alexa Voice Service.
---
Here I am going to walk you through on how to retrieve an access token in order to be able to interact with the [Alexa Voice Service](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-voice-service) by using cURL. I have been getting a lot of requests on how to do this step from people reading the [Alexa Voice Service with cURL](/blog/alexa-voice-service-with-curl/) blog post.

## Set up AVS Device Type

If you haven't already, go into the [Alexa Developer Console](https://developer.amazon.com/edw/home.html#/avs/list) and register a new *Device* as *Product Type*:

[![]({{ page.url }}/register-product-type.jpg)]({{ page.url }}/register-product-type.jpg)

Next give your device a unique *Device Type ID*. I am using `test_device` in this example:

[![]({{ page.url }}/device-type-info.jpg)]({{ page.url }}/device-type-info.jpg)

Select the *Alexa Voice Service Sample App Security Profile* as the Security Profile, and take note of the *Client ID* and *Client Secret* since we will be using that later.

[![]({{ page.url }}/security-profile.jpg)]({{ page.url }}/security-profile.jpg)

In *Web Settings* we can configure the *Allowed Return URLs*. For this example the default `https://localhost:9745/authresponse` URL is fine. Take note of it since we will be using it later.

[![]({{ page.url }}/web-settings.jpg)]({{ page.url }}/web-settings.jpg)

Fill out the info required in *Device Details* page:

[![]({{ page.url }}/device-details.jpg)]({{ page.url }}/device-details.jpg)

We do not need *Amazon Music* for this example:

[![]({{ page.url }}/amazon-music.jpg)]({{ page.url }}/amazon-music.jpg)

## Retrieve Auth Code

Here we are going to generate the authentication URL which should be opened in a browser and then be prompted to login with Amazon. The user will then be redirected to the redirect URI we have configured after logging in. The redirect URI will contain the authentication `code` as a URL parameter which we will be using later to retrieve our access token.

Here is a bash script to generate the authentication URL. Configure the setting variables to your own. The device serial number can be anything we want.

`auth_code.sh`:

```bash
CLIENT_ID="amzn1.application-oa2-client.796ab90fc5844fdbb8efc1739..."
DEVICE_TYPE_ID="test_device"
DEVICE_SERIAL_NUMBER=123
REDIRECT_URI="https://localhost:9745/authresponse"
RESPONSE_TYPE="code"
SCOPE="alexa:all"
SCOPE_DATA="{\"alexa:all\": {\"productID\": \"$DEVICE_TYPE_ID\", \"productInstanceAttributes\": {\"deviceSerialNumber\": \"${DEVICE_SERIAL_NUMBER}\"}}}"

function urlencode() {
  perl -MURI::Escape -ne 'chomp;print uri_escape($_),"\n"'
}

AUTH_URL="https://www.amazon.com/ap/oa?client_id=${CLIENT_ID}&scope=$(echo $SCOPE | urlencode)&scope_data=$(echo $SCOPE_DATA | urlencode)&response_type=${RESPONSE_TYPE}&redirect_uri=$(echo $REDIRECT_URI | urlencode)"

open ${AUTH_URL}
```

Make the script executable:

```bash
$ chmod aug+x auth_code.sh
```

Run the script:

```bash
$ ./auth_code.sh
```

We will be asked to log in with Amazon:

[![]({{ page.url }}/login.jpg)]({{ page.url }}/login.jpg)

Once logged in, we will be redirected to the redirect URI we have set earlier.

Browser url should look like this:

```text
https://localhost:9745/authresponse?code=ANcUMLaDrkMtCwUSrIqc&scope=alexa%3Aall
```

We will not actually see a webpage since we don't have anything running on that port. That's fine since we're just testing and all we need is to get the `code` parameter value from the url. In a real world application we will need a web server with SSL enabled. My [Generate Self-Signed SSL Certificate](/blog/generate-self-signed-ssl-certificate/) blog post walks you through on how to generate an SSL certificate for testing purposes.

## Retrieve Access Token

Now we trade in that `code` token we got earlier for an access token in order to make requests to the Alexa Voice Service API.

Here is a bash script to do that. Configure the setting variables to your own. Remember to update the code to the `code` we got from the previous step.

`auth_token.sh`:

```bash
CLIENT_ID="amzn1.application-oa2-client.796ab90fc5844fdbb8efc1739..."
CLIENT_SECRET="1e3a306483c78510d4cdeb05e0a522f7ec3c1629ae1d53c325bfc..."
CODE="ANcUMLaDrkMtCwUSrIqc"
GRANT_TYPE="authorization_code"

curl -X POST --data "grant_type=${GRANT_TYPE}&code=${CODE}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}" https://api.amazon.com/auth/o2/token

```

Make the script executable and run it. We should now have an access token and refresh token returned in a JSON response.

```bash
{"access_token":"Atza|IQEBLjAsAhRN1wbDKtAXQ3OyvBspG_jUfn_EtQIUDGVeSG4qNMd9cFD8GOTKCYfQGF82Vd3sbhduBM8Y0_7YfLMmsrWEa5-QX_YvAqDXKszGmunesOPCLFdSlwmfRI6x5RhFRtraVlE6iIjWWus5qm8So4R2WpAls5fVJVpLrEvDt_fn4jpbNG1TTJizHOrpZRuAMd72HDGSYVarzI48BiyjMFZfxRj1TnlGz2rHiKEXTFuTYVkuUNjYseVpMhyzdhw6e_KCZUm-H7Ux9XJ5t0grYlkAjAgb2cpFP8_2NTtJ35kOmV5xKar3J2bfL894CqgTSqAMhidCVlcrAR4TBB52LG4jV29bUwzaht9uN3Mu982qjHpzhlS7ZE6ecfseGM4vbTMYyGlGn3zX7cwg6FVS8w","refresh_token":"Atzr|IQEBLjAsAhQIShi_1Jd-lnnoqHG_vZCoO307PgIUNyEfeDoAFuLIhyBVLAvZBSqexSUiPqEwBYVHRhOwaTbrHEAOcdGuTwW2U_f-BghCMzsbaLadcdFqTPaKeVEoUyCN5Msf3P44lKGZsbteRKteFD4fhAiUGtajvVG_OnDyl3Bcokuv-ApmVgLFwBE5ZpEXhD6f5An-9_ATLy4goMrZAyQoXRiCQseEmytL3B2RWt2NmNKTgAv3pSCXqbX3xbLHeP1vXnMKI8CjVUqSF910J9pIOYT_cD4hJf80WqHCCXPLqpi2BreUOcwvSwNdM4SVc1tnzzN1LCbDLAyCOTXf8CO-3BwtOcOE9MJ2wiiW9EMD9jp051pC1MgRadGRZ42X43fhIozLhXf4J-DVeSZapOa6Cw","token_type":"bearer","expires_in":3600}
```

## Retrieve Access Token from Refresh Token

The refresh token is used to retrieve another fresh access token after it has expired.

`refresh_token.sh`:

```
REFRESH="Atzr|IQEBLjAsAhQIShi_1Jd-lnnoqHG_vZCoO307P..."
CLIENT_ID="amzn1.application-oa2-client.796ab90fc5844fdbb8efc1739..."
CLIENT_SECRET="1e3a306483c78510d4cdeb05e0a522f7ec3c1629ae1d53c325bfc..."
GRANT_TYPE="refresh_token"
REDIRECT_URI="https://localhost:9745/authresponse"

curl -X POST --data "grant_type=${GRANT_TYPE}&refresh_token=${REFRESH}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}" https://api.amazon.com/auth/o2/token
```

The JSON response will contain the new access token and refresh token.

## Conclusion

Now we can use our access token to make call to the Alexa Voice Service API.
