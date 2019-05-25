---
layout: byte
title: OpenSSL Cheatsheet
category: bytes
tags: [OpenSSL, TLS, SSL]
description: A cheatsheet of common OpenSSL commands.
---
A cheatsheet of common [OpenSSL](https://www.openssl.org/) commands.

Generate 512 bit RSA private key

```bash
openssl genrsa
```

Generate 1024 bit RSA private key

```bash
openssl genrsa 1024
```

Generate 1024 bit RSA private key and save to file

```bash
openssl genrsa -out private.key 1024
```

Check private key

```bash
openssl rsa -in private.key -check
```

Generate 1024 bit RSA private key with passphrase

```bash
openssl genrsa -des3 -out private.key 1024
```

Generate certificate authority (CA) key

```bash
openssl genrsa -out ca.key 1024
```

Generate a CA certificate signing request (CSR) using CA key

```bash
openssl req -new -key ca.key -out ca.csr
```

Generate a CA CSR using CA key and config file

config `openssl.cnf`

```text
[ req ]
prompt = no
distinguished_name = req_distinguished_name

[ req_distinguished_name ]
C = "US"                        # country
ST = "CA"                       # state
L = "LA"                        # locality
O = "Internet Widgits Pty Ltd"  # org name
OU = "IT"                       # org unit name
CN = "example.com"              # Common Name
emailAddress = "webmaster@example.com"
```

```bash
openssl req -config openssl.cnf -new -key ca.key -out ca.csr
```

Self-sign CA CSR for creation of the CA certificate (CRT)

```bash
openssl x509 -req -in ca.csr -out ca.crt -signkey ca.key
```

Self-sign CA CSR for creation of the CA certificate valid for 365 days

```bash
openssl req -new -key ca.key -out ca.csr -days 365
```

Check X.509 certificate

```bash
openssl x509 -in ca.crt -text
```

Generate new server private key

```bash
openssl genrsa -out example.com.key 1024
```

Generate new CSR using server private key

```bash
openssl req -new -key example.com.key -out example.com.csr
```

Generate new CSR with multiple domains using config

config `openssl.cnf`

```text
[ req ]
prompt = no
distinguished_name = req_distinguished_name
req_extensions = v3_req

[ req_distinguished_name ]
C = "US"                        # country
ST = "CA"                       # state
L = "LA"                        # locality
O = "Internet Widgits Pty Ltd"  # org name
OU = "IT"                       # org unit name
CN = "example.com"              # Common Name
emailAddress = "webmaster@example.com"

[ v3_req ]
subjectAltName = @alt_names

[alt_names]
DNS.1 = www.example.com
DNS.2 = www2.example.com
```

```bash
openssl req -config openssl.cnf -new -key example.com.key -out example.com.csr
```

Sign the server's certificate with CA certificate

```bash
openssl ca -in example.com.csr -cert ca.crt -keyfile ca.key -out example.com.crt
```

Check server CSR

```bash
openssl x509 -in example.com.crt -text
```

Verify chain of trust for certificate

```bash
openssl verify -CAfile ca.crt example.com.crt
```

Export certificate in PKCS#12 format

```bash
openssl pkcs12 -export -clcerts -in example.com.crt -inkey example.com.key -out example.com.p12
```

Check a PKCS#12 file (.pfx or .p12)

```bash
openssl pkcs12 -info -in example.com.p12
```

Convert CRT to PEM

```bash
openssl x509 -in ca.crt -out ca.pem -outform PEM
```

Convert PEM to DER

```bash
openssl x509 -outform der -in ca.pem -out ca.der
```

Convert PEM certificate and private key to PKCS#12 (.pfx .p12)

```bash
openssl pkcs12 -export -out example.com.pfx -inkey private.key -in example.com.crt -certfile ca.crt
```

Remove passphrase from private key

```
openssl rsa -in private.key -out new_private.key
```

Check an SSL connection. Prints all certificates including intermediates

```bash
openssl s_client -connect example.com:443
```

Print full chain of certificates for host

```bash
openssl s_client -connect example.com:443 -showcerts
```

Print public key of certificate

```bash
openssl s_client -connect example.com:443 | openssl x509 -pubkey -noout
```

Default `openssl.cnf` location in Mac OS X

```bash
/System/Library/OpenSSL/openssl.cnf
```

Generate new CA command in Mac OS X

```bash
/System/Library/OpenSSL/misc/CA.pl -newca
```
