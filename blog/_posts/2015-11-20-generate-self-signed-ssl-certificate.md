---
layout: blog-post
title: Generate Self-signed SSL Certificate
category: blog
tags: [SSL, TLS, RSA, HTTP, encryption, security, Node.js]
description:
---
Using HTTPS for your web application is a no-brainer, but sometimes it's not intuitively clear on how to get started on using SSL for your website.
I'm going to be going over step-by-step on generating a [self-signed certficate](https://en.wikipedia.org/wiki/Self-signed_certificate) and testing it out on a Node.js web server.

## Generating Private Key

First let's generate a private key. The private key is used to decrypted the data encrypted by the public key.
Only your server should have access to the private key.
The generated [RSA](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) key is 1024-bit [triple DES](https://en.wikipedia.org/wiki/Triple_DES) encrypted.
It will ask you for a passphrase so make sure you remember it.

```bash
openssl genrsa -des3 -out server.key 1024
```

The output:

```bash
Generating RSA private key, 1024 bit long modulus
...............................++++++
..........................++++++
e is 65537 (0x10001)
Enter pass phrase for server.key:
Verifying - Enter pass phrase for server.key:
```

This will create a `server.key` file.

Note that if you do not want to use a passphrase for your key, you can remove it from the encrypted key.

```bash
openssl rsa -in server.key -out server.key
```

## Generating a Certificate Signing Request

Next we need to issue a [Certificate Signing Request (CSR)](https://en.wikipedia.org/wiki/Certificate_signing_request), which is responsible for sending a message to a [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority) in order to apply for a [digital certificate](https://en.wikipedia.org/wiki/Public_key_certificate) which certifies the ownership of the public key.
It will ask you information for the certificate regarding your company and location. See the output after the command as an example.

```bash
openssl req -new -key server.key -out server.csr
```

The output:

```bash
Enter pass phrase for server.key:
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:CA
Locality Name (eg, city) []:Los Angeles
Organization Name (eg, company) [Internet Widgits Pty Ltd]:My Company
Organizational Unit Name (eg, section) []:Information Technology
Common Name (e.g. server FQDN or YOUR name) []:localhost
Email Address []:email@example.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:password
An optional company name []:My Company
```

This will create a `server.csr` file.

# Generating Certificate

Now we use the Certficate Signing Request file to self-sign a new [X.509](https://en.wikipedia.org/wiki/X.509) Certificate, valid for 365 days.

```bash
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

The output:

```bash
Signature ok
subject=/C=US/ST=CA/L=Los Angeles/O=My Company/OU=Information Technology/CN=localhost/emailAddress=email@example.com
Getting Private key
Enter pass phrase for server.key:
```

Sweet, we just created a new `server.crt` file.

## Using SSL Certificate with Node.js

Incorporating the Self-signed Certificate in Node.js in relatively straightfowward.
We map the file contents for the Private Key and the SSL Certificate in the `options` object for the node https server,
Try running the the example below.

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  // Private Key
  key: fs.readFileSync('./ssl/server.key'),

  // SSL Certficate
  cert: fs.readFileSync('./ssl/server.crt'),

  // Passphrase for Private Key, if you used one.
  passphrase: 's0m3P4sZw0rD',

  // Make sure an error is not emitted when the server certificate verification against the list of supplied CAs fails on connection.
  rejectUnauthorized: false
};

const server = https.createServer(options, handlRequest);

function handlRequest(req, res) {
  res.writeHead(200);
  res.end('Served over SSL.\n');
}

server.listen(9000);
```

Now open up your browser and head over to [https://localhost:9000](https://localhost:9000).
You should get a browser warning like this one saying that the certificate could not be validated.

[![]({{ page.url }}/connection-not-private-proceed.png)]({{ page.url }}/connection-not-private-proceed.png)

This is normal since we're using this for development purposes, so you can hit *Proceed to localhost*.


# Trusting The Certificate

You probably noticed the ugly red x over the https lock since the certificate could not be validated by a CA.

[![]({{ page.url }}/ssl-lock-x.png)]({{ page.url }}/ssl-lock-x.png)

In order to get the nice green lock we can tell our operating system to always trust this certificate.

If you're on Mac OSX; Open up the *Keychain Acess* app and on the left sidebar click on *System* under *Keychains* and click on *Certificates* under *Category*.

Drag the certficate `server.crt` into here.

[![]({{ page.url }}/system-keychain.png)]({{ page.url }}/system-keychain.png)

Now double-click on the certificate you just added and under *Trust* options, next to *When using this certficate* select the *Always Trust* option.

[![]({{ page.url }}/certificate-always-trust.png)]({{ page.url }}/certificate-always-trust.png)

Enter your password when prompted and restart your browser.

Voilà, green lock.

[![]({{ page.url }}/ssl-lock-ok.png)]({{ page.url }}/ssl-lock-ok.png)

# Conclusion

It is standard practice to use a SSL certificate for web applications even if not planning on sharing confidential data with visitors. Having encrypted communication ensures trust with the user accessing your site. Hope this guide helped you get started on using SSL while developing.


