---
layout: byte
title: How to encrypt with GPG
type: bytes
tag: [PGP, GPG, encryption]
description: Use GPG to encrypt and decrypt files.
date: 2016-02-21T00:00:00-00:00
draft: false
---
Here are example of how to encrypt, decrypt, and manage [PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) keys using [GPG](https://www.gnupg.org/).

## Generate a new key pair

```bash
$ gpg --gen-key

gpg (GnuPG) 1.4.19; Copyright (C) 2015 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
   (1) RSA and RSA (default)
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
Your selection? 1
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048) 4096
Requested keysize is 4096 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 0
Key does not expire at all
Is this correct? (y/N) y

You need a user ID to identify your key; the software constructs the user ID
from the Real Name, Comment and Email Address in this form:
    "Heinrich Heine (Der Dichter) <heinrichh@duesseldorf.de>"

Real name: Foo Bar
Email address: foobar@example.com
Comment:
You selected this USER-ID:
    "Foo Bar <foobar@example.com>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
You need a Passphrase to protect your secret key.

We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
....+++++
............+++++
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
..............................+++++
....+++++
gpg: key 6E2433CE marked as ultimately trusted
public and secret key created and signed.

gpg: checking the trustdb
gpg: 3 marginal(s) needed, 1 complete(s) needed, PGP trust model
gpg: depth: 0  valid:   2  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 2u
pub   4096R/6E2433CE 2016-02-22
      Key fingerprint = AD72 5FDF F03E BE2C 6B98  D274 1C9E 60B6 6E24 33CE
uid                  Foo Bar <foobar@example.com>
sub   4096R/CBB7C136 2016-02-22
```

## Export public key

```bash
$ gpg --armor --export foobar@example.com

-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: GnuPG v1

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
=/l1M
-----END PGP PUBLIC KEY BLOCK-----
```

# Export private key

```bash
$ gpg --list-keys foobar@example.com

pub   4096R/6E2433CE 2016-02-22
uid                  Foo Bar <foobar@example.com>
sub   4096R/CBB7C136 2016-02-22

$ gpg --export-secret-keys -a 6E2433CE

-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: GnuPG v1

lQc+BFbKYNoBEACdPJFfPvbYJjGpJGQThRlDmuEyRHh9cn0gvPvj0jqgw77EFS+S
UmdC1/oARJyW9b/22+hfMmPUKYYR8Eq25BA+UNp2uBuzVzq2nFHQx+jqFsqQFiTa
G4Uuc80HR9GPc3H4eh3R1KFXwhYtCrJ3DZcrh04kT3So/a5SfLiLlQKyf4l2EYvp
XWP48qGlYXZLgiIslrcL+uKNYJGymmMKLJuLVuV3IQhSgCAJMTBsUIf1r+yd8ZVp
BeQuhgexFWBn9blevPGKIR8O6njQjlpAJEAY7xvoZA5aRHLMZwuK5CFazLJGR6PW
GyFtcvnrKeMuOpuPuoqHhczcLDPYpon1P/NFTA3tE8RRAWe1H/P7+oXooOzO/evu
014v1UAxzymY2ALHG8fEuUzLpcBavrar+pTitndjLl6tBoooBhwxLOoRyQ1Hjfg8
3oRSykiIPZqoi2cwQFva/JfO7ASGjHf4kxHhTj6oArCkbE8CgeKJxwszMeRirnD9
rJ9P8hSQjlvqzblr0NuRiUXTHJHdG2MmufOSHObkrWdYcLRQTaZgNNFQUJEyttau
bnzptek4MlRuT8Hm/Y7thcQ7l8sxKkBam/1ZmFJWmiiZH5pVfrIiL99ItDAB7LRT
...
Q8PEGLEyrSBmUF2k7RMDqoURXX/coERRbQOKMlSaaXw6n6+CeYon+Z+MgcwwymYo
JTCyxYCRjI4ZVDtgYVtFoMiwHsHnJNl4bmJAB81g8jgdIKNwavs1r514A1jeuc0K
dwlpwD3boCqCF28OJ2FKmGRSLyhtTfP9VU4W9QZIpyTte4OxsPa9jaB/TexFnrto
GAYnBejuKmW7NuCqSpHncxymbpiZe4wN58Ut3XOgA+RlJyaduXE5Q8FTXOYwfgU1
sx6JBRyBpsFOSweo81Ni1N+g0OnDZvnGhyjpqXAE2+5uEyS2VVLUDJIoMcx7suf6
l6fmIh343phlSGKSC5PO3N9OxxCLj+iM9QTm4Nei9oS6UyOYGnoGWZiQgFoeK4mV
PlxWSoLawz7NEph1gjpNcSP+ApIWn18nAlmiepncuXQ0VqkC9/aoeOfEsFmnTPV+
yMr7b0F7RUiYRqvDvU/632i8ZyZYOEAtN9K4mz0Fkg510K0xQLnsz/E7S61PBKQY
Z1hnupveYmVYo2fyUw==
=lVOn
-----END PGP PRIVATE KEY BLOCK-----
```

## Import public key

```bash
$ gpg --import public_key.asc

gpg: key 48678FC5: public key "bazqux@example.com" imported
gpg: Total number processed: 1
gpg:               imported: 1  (RSA: 1)
```

You can also downloads public keys from a registry, such as [pgp.mit.edu](http://pgp.mit.edu/).

```bash
$ gpg --keyserver pgp.mit.edu --search-keys bazqux@example.com

gpg: searching for "bazqux@example.com" from hkp server pgp.mit.edu
(1)     bazqux@example.com
          2048 bit RSA key 48678FC5, created: 2016-02-22
Keys 1-1 of 1 for "bazqux@example.com".  Enter number(s), N)ext, or Q)uit > 1
gpg: requesting key 48678FC5 from hkp server pgp.mit.edu
gpg: DBG: armor-keys-failed (KEY 0x45BB8556CF64F42FCF948DDABA96600148678FC5 BEGIN
) ->0
gpg: DBG: armor-keys-failed (KEY 0x45BB8556CF64F42FCF948DDABA96600148678FC5 END
) ->0
gpg: key 48678FC5: "bazqux@example.com" not changed
gpg: Total number processed: 1
gpg:              unchanged: 1
```

## List keys

```bash
$ gpg --list-keys foobar@example.com

pub   4096R/6E2433CE 2016-02-22
uid                  Foo Bar <foobar@example.com>
sub   4096R/CBB7C136 2016-02-22
```

## Upload keys to registry

```bash
$ gpg --send-keys --keyserver pgp.mit.edu 6E2433CE

gpg: sending key 6E2433CE to hkp server pgp.mit.edu
```

## Encrypt a message

`mysecretmessage.txt`:

```text
my secret message
```

```bash
$ gpg --encrypt --sign --armor -u foobar@example -r bazqux@example.com -r foobar@example.com mysecretmessage.txt

You need a passphrase to unlock the secret key for
user: "Foo Bar <foobar@example.com>"
4096-bit RSA key, ID 6E2433CE, created 2016-02-22

gpg: 48678FC5: There is no assurance this key belongs to the named user

pub  2048R/48678FC5 2016-02-22 bazqux@example.com
 Primary key fingerprint: 45BB 8556 CF64 F42F CF94  8DDA BA96 6001 4867 8FC5

It is NOT certain that the key belongs to the person named
in the user ID.  If you *really* know what you are doing,
you may answer the next question with yes.

Use this key anyway? (y/N) y
```

Generates `mysecretmessage.txt.asc`:

```text
-----BEGIN PGP MESSAGE-----
Version: GnuPG v1

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
=2y1c
-----END PGP MESSAGE-----
```

Only recipients can read message hence you also have to add yourself. The message is encrypted for each recipient.

The `-u` flag specifies the sender.

## Decrypt a message

```bash
$ gpg mysecretmessage.txt.asc

You need a passphrase to unlock the secret key for
user: "Foo Bar <foobar@example.com>"
4096-bit RSA key, ID CBB7C136, created 2016-02-22 (main key ID 6E2433CE)

gpg: encrypted with 2048-bit RSA key, ID 48678FC5, created 2016-02-22
      "bazqux@example.com"
gpg: encrypted with 4096-bit RSA key, ID CBB7C136, created 2016-02-22
      "Foo Bar <foobar@example.com>"
gpg: Signature made Sun Feb 21 22:13:18 2016 PST using RSA key ID 6E2433CE
gpg: Good signature from "Foo Bar <foobar@example.com>"
gpg: WARNING: message was not integrity protected
```

# Refresh keys

```bash
$ gpg --refresh-keys

gpg: refreshing 3 keys from hkp://keys.gnupg.net
gpg: requesting key DFC74351 from hkp server keys.gnupg.net
gpg: requesting key 6E2433CE from hkp server keys.gnupg.net

gpg: requesting key 48678FC5 from hkp server keys.gnupg.net
gpg: DBG: armor-keys-failed (KEY 0xEAE55F653B605D4B1B7E9D450A619621DFC74351 BEGIN
) ->0
gpg: DBG: armor-keys-failed (KEY 0xEAE55F653B605D4B1B7E9D450A619621DFC74351 END
) ->0
gpg: DBG: armor-keys-failed (KEY 0x45BB8556CF64F42FCF948DDABA96600148678FC5 BEGIN
) ->0
gpg: key 6E2433CE: "Foo Bar <foobar@example.com>" not changed
gpg: DBG: armor-keys-failed (KEY 0x45BB8556CF64F42FCF948DDABA96600148678FC5 END
) ->0
gpg: key 48678FC5: "bazqux@example.com" not changed
gpg: Total number processed: 3
gpg:              unchanged: 3
```

Refresh from key server:

```bash
$ gpg --refresh-keys --keyserver pgp.mit.edu

gpg: refreshing 3 keys from hkp://pgp.mit.edu
gpg: requesting key DFC74351 from hkp server pgp.mit.edu
gpg: requesting key 6E2433CE from hkp server pgp.mit.edu
gpg: requesting key 48678FC5 from hkp server pgp.mit.edu
gpg: DBG: armor-keys-failed (KEY 0xEAE55F653B605D4B1B7E9D450A619621DFC74351 BEGIN
) ->0
gpg: DBG: armor-keys-failed (KEY 0xEAE55F653B605D4B1B7E9D450A619621DFC74351 END
) ->0
gpg: DBG: armor-keys-failed (KEY 0x45BB8556CF64F42FCF948DDABA96600148678FC5 BEGIN
) ->0
gpg: key 6E2433CE: "Foo Bar <foobar@example.com>" not changed
gpg: DBG: armor-keys-failed (KEY 0x45BB8556CF64F42FCF948DDABA96600148678FC5 END
) ->0
gpg: key 48678FC5: "bazqux@example.com" not changed
gpg: Total number processed: 3
gpg:              unchanged: 3
```


## Get fingerprint

Get fingerprint of public key to verify that the key is correct. The person who you're trying to contact can send you their fingerprint to compare.

```bash
$ gpg --fingerprint bazqux@example.com

pub   2048R/48678FC5 2016-02-22
      Key fingerprint = 45BB 8556 CF64 F42F CF94  8DDA BA96 6001 4867 8FC5
      uid                  bazqux@example.com
```

# Sign key

Sign key to verify that you trust that person.

```bash
$ gpg --sign-key -u foobar@example.com bazqux@example.com

pub  2048R/48678FC5  created: 2016-02-22  expires: never       usage: SCEA
                     trust: unknown       validity: unknown
[ unknown] (1). bazqux@example.com


pub  2048R/48678FC5  created: 2016-02-22  expires: never       usage: SCEA
                     trust: unknown       validity: unknown
 Primary key fingerprint: 45BB 8556 CF64 F42F CF94  8DDA BA96 6001 4867 8FC5

     bazqux@example.com

Are you sure that you want to sign this key with your
key "Foo Bar <foobar@example.com>" (6E2433CE)

Really sign? (y/N) y

You need a passphrase to unlock the secret key for
user: "Foo Bar <foobar@example.com>"
4096-bit RSA key, ID 6E2433CE, created 2016-02-22
```

## Revoke signed key

```bash
$ gpg --edit-key bazqux@example.com

gpg (GnuPG) 1.4.19; Copyright (C) 2015 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.


pub  2048R/48678FC5  created: 2016-02-22  expires: never       usage: SCEA
                     trust: unknown       validity: full
[  full  ] (1). bazqux@example.com

gpg> revsig
You have signed these user IDs on key 48678FC5:
     bazqux@example.com
   signed by your key DFC74351 on 2016-02-22

user ID: "bazqux@example.com"
signed by your key DFC74351 on 2016-02-22
Create a revocation certificate for this signature? (y/N) y
You are about to revoke these signatures:
     bazqux@example.com
   signed by your key DFC74351 on 2016-02-22
Really create the revocation certificates? (y/N) y
Please select the reason for the revocation:
  0 = No reason specified
  4 = User ID is no longer valid
  Q = Cancel
Your decision? 4
Enter an optional description; end it with an empty line:
>
Reason for revocation: User ID is no longer valid
(No description given)
Is this okay? (y/N) y

You need a passphrase to unlock the secret key for
user: "Foo Bar <foobar@example.com>"
4096-bit RSA key, ID DFC74351, created 2016-02-22


pub  2048R/48678FC5  created: 2016-02-22  expires: never       usage: SCEA
                     trust: unknown       validity: full
[  full  ] (1). bazqux@example.com

gpg> save
```

Then reissue public key with revoked signature.

```bash
$ gpg --export --armor bazqux@example.com
```

## Generate revokation certificate

Create a revokation certificate to use in case of a security breach.

```bash
$ gpg --gen-revoke foobar@example.com

sec  4096R/6E2433CE 2016-02-22 Foo Bar <foobar@example.com>

Create a revocation certificate for this key? (y/N) y
Please select the reason for the revocation:
  0 = No reason specified
  1 = Key has been compromised
  2 = Key is superseded
  3 = Key is no longer used
  Q = Cancel
(Probably you want to select 1 here)
Your decision? 0
Enter an optional description; end it with an empty line:
>
Reason for revocation: No reason specified
(No description given)
Is this okay? (y/N) y

You need a passphrase to unlock the secret key for
user: "Foo Bar <foobar@example.com>"
4096-bit RSA key, ID 6E2433CE, created 2016-02-22

ASCII armored output forced.
Revocation certificate created.

Please move it to a medium which you can hide away; if Mallory gets
access to this certificate he can use it to make your key unusable.
It is smart to print this certificate and store it away, just in case
your media become unreadable.  But have some caution:  The print system of
your machine might store the data and make it available to others!
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: GnuPG v1
Comment: A revocation certificate should follow

iQIfBCABAgAJBQJWymF7Ah0AAAoJEByeYLZuJDPOsQwQAIqn5AAysKmyRg78r01/
Fb7j5VYgsQIqD6QEYa2xLihbZ7NLZQo3IEgQXCmX2e/ADN8I2V3hRypNoLz5wJsu
NnjDkXSXo703UiaLmbwYeKqPSmPVZkNRZhSjXYfnfdUDiEgn0SNamXNV4fntf67o
bb2Sf+TK7sI+yKsiKGvi/MITVTcPlnybJajjrMkBlBMHw2l04wQxqLd/gWCidACR
Hy2GnNAiSnr6rnGevxlWnQXHf5/zvp0vjVUQHJAbKndMRGV82bgADJH0JjjR6gCR
WaL8OAVRJqsm+Lk3C7myhW1G1ltAcsIOdxvBSZdbdDwq18IUdWoEBVcNMCsOWqMK
W8GZhboL4VbmYVj3sMlJFid1iReIxql2wfoHndghiSEBl4kJUNlckzsgY9GeA3Hv
iDyc6zJqNl3VGCIqsd5WfYjBMDIw4wrp41Y6KcnrX8q/tfb2+7pvFP69cqYMKsic
CnQa8hCMvK6FKtWpMalHoaJxf+x2gkrak5WI9TsF/WBmDmlZp512XvGpS8jGWzFT
0wM7LoPM6nDwqOjzDRztZzAyzo7B42OYiWz3FpfmkoTAb4a4aECE2s4EJyK9FF87
XS5G++7Tm9xznYZgbqFvGRu1sGFu8wu9wKE75OftcVF9hZBIU8kN907OeSY7m5J8
dnCcRSMzogNCdOFE81XcMoIo
=44Jq
-----END PGP PUBLIC KEY BLOCK-----
```

Import revokation certificate to revoke key:

```bash
$ gpg --import revoke_cert.asc

gpg: key 6E2433CE: "Foo Bar <foobar@example.com>" revocation certificate imported
gpg: Total number processed: 1
gpg:    new key revocations: 1
gpg: 3 marginal(s) needed, 1 complete(s) needed, PGP trust model
gpg: depth: 0  valid:   2  signed:   1  trust: 0-, 0q, 0n, 0m, 0f, 2u
gpg: depth: 1  valid:   1  signed:   0  trust: 1-, 0q, 0n, 0m, 0f, 0u
```

## Delete key

```bash
$ gpg --expert --delete-key 6E2433CE

gpg (GnuPG) 1.4.19; Copyright (C) 2015 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.


pub  4096R/6E2433CE 2016-02-22 Foo Bar <foobar@example.com>

Delete this key from the keyring? (y/N) y
```
