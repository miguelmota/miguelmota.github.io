---
layout: blog-post
title: Getting Started with Secure Scuttlebutt (SSB)
type: blog
tag: [Scuttlebutt, p2p, decentralization, social network, off-grid]
description: Getting Started with Secure Scuttlebutt (SSB)
date: 2019-02-24T00:00:00-00:00
draft: false
---

Scuttlebutt was started in May 2014 by Dominic Tarr (dominictarr) as an alternative offline-first invite-only social network that allows users to gain total control of their data and privacy. Secure Scuttlebutt (ssb) was released shortly after which puts privacy at the forefront with more encryption features.

If you’re wondering where the heck the name Scuttlebutt came from:

> This 19th century term for a gossip comes from the nautical Scuttlebutt: “a barrel of water kept on deck, with a hole for a cup”. The nautical slang is from sailors’ habits of gathering by the scuttlebutt to gossip, akin to watercooler gossip.

![Sailors gathering around the scuttlebutt. ([source](https://twitter.com/IntEtymology/status/998879578851508224))](scuttlebutt.jpeg)

*Sailors gathering around the scuttlebutt. ([source](https://twitter.com/IntEtymology/status/998879578851508224))*

Dominic came across the term scuttlebutt from a [research paper](https://www.cs.cornell.edu/home/rvr/papers/flowgossip.pdf) he read.

In distributed systems, [gossiping](https://en.wikipedia.org/wiki/Gossip_protocol) is a process for relaying messages in peer-to-peer fashion; messages get spread around analogous to “word of mouth”.

**Secure Scuttlebutt is a database of immutable append-only feeds, optimized for efficient replication for peer-to-peer protocols.** **Every user has an append-only immutable log that they can write to.** They write to the log by signing messages with their private key. Think of a user feed as their own logbook, like a [ship’s log](https://en.wikipedia.org/wiki/Logbook) (or Captain’s log for those Star Trek fans), where they’re the only one’s allowed to write to it, but have the ability to allow other friends or colleagues to read to their logbook if they so wish so.

Each message has a sequence number and the message must also reference the previous message by its ID. The ID is a hash of the message and signature. The data structure resembles that of a linked-list. It’s essentially an append-only log of signed JSON. **Every item added to a user log is called a message.**

**The user logs are known as a feed and a user can follow other user feeds to receive their updates.** Each user is responsible for storing their own feed. When Alice subscribes to Bob’s feed, Bob downloads the feed log from Alice. Bob can verify the feed log actually belongs to Alice by verifying the signatures. Bob can verify the signatures by using Alice’s public key.

![High-level structure of a feed](feed_structure.png)

*High-level structure of a feed*

**Pubs are relay servers known as “super peers”. Pubs connect users users and gossip updates to other users connected to the Pub. A Pub is analogous to a real-life pub where people go to meet and socialize.** To join a Pub the user must be invited first. A user can request an invite code from a Pub; the Pub will simply generate a new invite code, but some Pubs might require additional verification in the form of email verification or with some Pubs you must ask for a code in a public forum or chat. Pubs may also map user aliases such as emails or username to public key ID’s to easier reference peers.

After the Pub has sent the invite code to the user, the user will redeem the code which means that Pub will follow back the user which allows the user see messages posted by other members of the Pub as well as have the Pub relay messages by the user to other members of the Pub.

Besides relaying messages between peers, Pubs can also store the messages. If Alice is offline and Bob broadcasts a feed updates, then Alice will miss the update. If Alice goes online but Bob is offline then there’s no way for her to fetch Bob’s feed. But with a Pub, Alice can fetch the feed from the Pub even if Bob is offline because the Pub is storing the messages. **Pubs are useful because as soon a peer goes online they can sync up with the Pub to receive the feeds of their potentially offline friends.**

A user can optionally run their own Pub server and open it to the public or only allow only their friends to join if they wish. They can also join a public Pub. Here’s a list of [public Pubs](https://github.com/ssbc/ssb-server/wiki/Pub-Servers) anyone can join**. **We’ll explain how to join one later in this guide. **An important thing to note is that Secure Scuttlebutt in an invite-only social network meaning you must be “pulled-in” to join social circles.** If you respond to messages, the recipients will not be notified unless they are following you back. A goal of SSB is to create isolated “islands” of peer networks, unlike a public network where anyone can message anyone.

![Perspectives of participants](participants.png)

*Perspectives of participants*

### Scuttlebot

The Pub software is known as the Scuttlebutt server ([ssb-server](https://github.com/ssbc/ssb-server)) but is also referred to as “Scuttlebot” and sboton the command-line. The SSB server adds networking behavior to the Scuttlebutt database (SSB). We’ll be using Scuttlebot through out this tutorial.

## Getting familiar with the CLI

We’ll start out by using the CLI for publishing messages to our feed to get our feet wet. **Install the npm package [`scuttlebot`](https://www.npmjs.com/package/scuttlebot) globally to access the `sbot` CLI:**

```bash
$ npm install -g scuttlebot
```

Now we’ll start a local Pub server. The Pub is responsible for storing our messages. **Run the `sbot server` command to start a local Pub (relay server):**

```bash
$ sbot server

scuttlebot 13.2.2 /Users/mota/.ssb logging.level:notice
my key ID: OKcgAu1yl8qf+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519
```

This generate a new [Ed25519](https://ed25519.cr.yp.to/) key pair that is used as your identity. **A user identity is also called a feed ID and are used for subscribing to feeds.** Identity secrets are stored in the location **`~/.ssb/secret`**:

```bash
$ cat ~/.ssb/secret

# this is your SECRET name.
# this name gives you magical powers.
# with it you can mark your messages so that your friends can verify
# that they really did come from you.
#
# if any one learns this name, they can use it to destroy your identity
# NEVER show this to anyone!!!

{
  "curve": "ed25519",
  "public": "OKcgAu1yl8qf+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519",
  "private": "[REDACTED]...........................................................................A==.ed25519",
  "id": "[@OKcgAu1yl8qf](http://twitter.com/OKcgAu1yl8qf)+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519"
}

# WARNING! It's vital that you DO NOT edit OR share your secret name
# instead, share your public name
# your public name: [@OKcgAu1yl8qf](http://twitter.com/OKcgAu1yl8qf)+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519
```

Each user has an asymmetric private-public key pair. **The user’s public key ID starts with the `@` symbol.** Keys and hashes are base64 encoded.

Private keys and hashes will have a tag append to the string, such `.ed25519` to denote that it used the Ed25519 algorithm for the public-private key system and you’ll see `.sha256` for content hash IDs. An example private key looks like this:

```text
ZAO3BHvpYzXISgLlsbLUGp3CGCXaBmdvEMy2gLdXxyFBDRztv0szhQWUz5Ah44gk+BTC3KjYQH50usXiT3JofQ==.ed25519
```

Use the `whoami` command to display the public identity currently being used:

```bash
$ sbot whoami

{
  "id": "[@OKcgAu1yl8qf](http://twitter.com/OKcgAu1yl8qf)+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519"
}
```

We know who we are now, so let’s publish a message post. **Use the `sbot publish` command to post a new message using the CLI:**

```bash
$ sbot publish --type post --text "Hello, world"

{
  "key": "%UQkdk9g5Mw62do5/PCiStnyclq2Dhi1NhUe/IzbBik8=.sha256",
  "value": {
    "previous": null,
    "sequence": 1,
    "author": "[@OKcgAu1yl8qf](http://twitter.com/OKcgAu1yl8qf)+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519",
    "timestamp": 1550907704334,
    "hash": "sha256",
    "content": {
      "type": "post",
      "text": "Hello, world"
    },
    "signature": "dFGH/TyVsuipIYiPsYGql5sAcAypDUldEIeLRphTOz3G+Kb5lyqpFwf6KlcbX5SZcJlMzJKflHarpchiClKjBQ==.sig.ed25519"
  },
  "timestamp": 1550907704335
}
```

This generates a new message. **Message IDs start with the `%` symbol.** Because this is the first message (known as the genesis) it doesn’t reference a previous message.

When the user publishes a second post, we can see that it references the previous message ID and the sequence nonce is incremented.

```bash
$ sbot publish --type post --text "Hello, mars"

{
  "key": "%X/ge1np2pJPsPs1F4t5C8mj4VmeGX2jkkJFdlj+s/5o=.sha256",
  "value": {
    "previous": "%UQkdk9g5Mw62do5/PCiStnyclq2Dhi1NhUe/IzbBik8=.sha256",
    "sequence": 2,
    "author": "[@OKcgAu1yl8qf](http://twitter.com/OKcgAu1yl8qf)+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519",
    "timestamp": 1550981145641,
    "hash": "sha256",
    "content": {
      "type": "post",
      "text": "Hello, mars"
    },
    "signature": "HACmQOWZl6AMEsv++Co/SPcPa2GI4YIRiSDeir6rPI6Lyawvq80C65N/u2LaImLf7GIgQKalqXESEYBbFh1bCA==.sig.ed25519"
  },
  "timestamp": 1550981145642
}
```

All messages added to the user feed log are signed. The signature is used to derive the signing public key to verify the actual signer.

**List a user’s feed referenced by their public key ID:**

```bash
$ sbot createUserStream --id [@OKcgAu1yl8qf](http://twitter.com/OKcgAu1yl8qf)+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519

{
  "key": "%UQkdk9g5Mw62do5/PCiStnyclq2Dhi1NhUe/IzbBik8=.sha256",
  "value": {
    "previous": null,
    "sequence": 1,
    "author": "[@OKcgAu1yl8qf](http://twitter.com/OKcgAu1yl8qf)+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519",
    "timestamp": 1550907704334,
    "hash": "sha256",
    "content": {
      "type": "post",
      "text": "Hello, world"
    },
    "signature": "dFGH/TyVsuipIYiPsYGql5sAcAypDUldEIeLRphTOz3G+Kb5lyqpFwf6KlcbX5SZcJlMzJKflHarpchiClKjBQ==.sig.ed25519"
  },
  "timestamp": 1550907704335
}

{
  "key": "%X/ge1np2pJPsPs1F4t5C8mj4VmeGX2jkkJFdlj+s/5o=.sha256",
  "value": {
    "previous": "%UQkdk9g5Mw62do5/PCiStnyclq2Dhi1NhUe/IzbBik8=.sha256",
    "sequence": 2,
    "author": "[@OKcgAu1yl8qf](http://twitter.com/OKcgAu1yl8qf)+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519",
    "timestamp": 1550981145641,
    "hash": "sha256",
    "content": {
      "type": "post",
      "text": "Hello, mars"
    },
    "signature": "HACmQOWZl6AMEsv++Co/SPcPa2GI4YIRiSDeir6rPI6Lyawvq80C65N/u2LaImLf7GIgQKalqXESEYBbFh1bCA==.sig.ed25519"
  },
  "timestamp": 1550981145642
}
```

For receiving messages in realtime when they’re published, use the `--live` flag.

The CLI is great for simple messaging but most likely you’ll be creating applications on top of Secure Scuttlebutt so you’ll need to use the Node.js SSB client.

## Using the Node.js client libraries

There’s multiple libraries involved with Secure Scuttlebutt. The first one we’ll get familiar with is the client library.

**Use the [`ssb-client`](https://www.npmjs.com/package/ssb-client) NPM module to send messages from Node.js:**

```bash
npm install ssb-client
```

While `sbot server` is still running, insatiate a new client instance:

```javascript
const ssbClient = require('ssb-client')

ssbClient((err, sbot) => {

   // do stuff

   // close client when no longer doing stuff
   sbot.close()
})
```

Use `sbot.close()` to close the client connection when your program is done.

**An example of how to publish a new message with `sbot.publish({type,text},cb)` using the client:**

```javascript
const ssbClient = require('ssb-client')

// run `$ sbot server` first
ssbClient((err, sbot) => {

  sbot.publish({
    type: 'post',
    text: 'hello, world'
  }, (err, message) => {
    console.log(message)

    sbot.close()
  })
})
```

**To query for a published message, use `sbot.get(messageID)` to return a message referenced by it’s message ID:**

```javascript
const ssbClient = require('ssb-client')

// run `$ sbot server` first
ssbClient((err, sbot) => {

  sbot.get('%UQkdk9g5Mw62do5/PCiStnyclq2Dhi1NhUe/IzbBik8=.sha256',
  (err, message) => {
    console.log(message)

    sbot.close()
  })
})
```

Just as we did in the CLI, **we can pull a user feed by using the [`pull-stream`](https://www.npmjs.com/package/pull-stream) NPM module and reference the feed by the user’s public key ID:**

```javascript
const ssbClient = require('ssb-client')
const pull = require('pull-stream')

// run `$ sbot server` first
ssbClient((err, sbot) => {
  pull(
    sbot.createUserStream({
      id: '[@OKcgAu1yl8qf](http://twitter.com/OKcgAu1yl8qf)+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519'
    }),
    pull.collect((err, messages) => {
      console.log(messages)

      sbot.close()
    })
  )
})
```

**To create a new feed, use the [`ssb-feed`](https://www.npmjs.com/package/ssb-feed) NPM module**. In this example we’ll programmatically **create a new identity using the [`ssb-keys`](https://www.npmjs.com/package/ssb-keys) NPM module** to act as a second user and and then publish to this new feed:

```javascript
const ssbClient = require('ssb-client')
const ssbFeed = require('ssb-feed')
const ssbKeys = require('ssb-keys')

// run `$ sbot server` first
ssbClient((err, sbot) => {

  // create a new public/private key pair
  const identity = ssbKeys.generate()

  // create the new feed using the new identity
  const alice = ssbFeed(sbot, identity)

  // post to the new feed
  alice.publish({
    type: 'post',
    text: 'hello world, I am alice'
  }, (err, message) => {
    console.log(message)

    sbot.close()
  })

})
```

So far we have learned all the basics which include creating identities, publishing messages, and subscribing to messages.

Next we’ll learn how to publish private messages for particular recipients and how to decrypt private message when we’re the recipient.

### Private Messages

Private messages are encrypted with the recipients public keys and then decrypted with their respective private key.

**To use the privacy features we must first install the [`ssb-private`](https://www.npmjs.com/package/ssb-private) plugin:**

```bash
$ sbot plugins.install ssb-private
```

Scuttlebot is extensible via plugins. Here’s a[ list of available plugins](https://www.npmjs.com/search?q=scuttlebot%20plugin) on NPM.

**An example of using `sbot.publish({type,text,recp},cb)` to publish a private message that only a specified recipient user can decrypt:**

```javascript
const ssbClient = require('ssb-client')

// run `$ sbot server` first
ssbClient((err, sbot) => {

  // Post encrypted message to feed
  // requires `$ sbot plugins.install ssb-private`
  sbot.publish(
    {
      type: 'post',
      text: 'This is a secret message to Alice',

      // recipient PKs:
      recps: [
        // Our own key (so that we can read the message):
        '@OKcgAu1yl8qf+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519',

        // Bob's public key ID:
        '@qoyx+Qi9vIAb3k9emOGTNzMgWHwiRsof6NPT9fs3Jp0=.ed25519'
      ]
     },
    // callback:
    (err, privateMessage) => {

      // privateMsg.value.content is an encrypted string
      console.log(privateMessage)

      sbot.close()
    })
})
```

The output will looks like a standard messages but **the content property will be encrypted and end in `.box` to denote that it’s a private message. SSB uses a format called [Private Box](https://ssbc.github.io/docs/ssb/end-to-end-encryption.html) for encryption.** Scuttlebutt will auto-box any messages with the recipients field.

```json
{
  "key": "%eNZaaVwWYLeeLWeyMQlzlJ62+xfbgQJQMKkpRs53zBg=.sha256",
  "value": {
    "previous": "%UQkdk9g5Mw62do5/PCiStnyclq2Dhi1NhUe/IzbBik8=.sha256",
    "sequence": 3,
    "author": "[@OKcgAu1yl8qf](http://twitter.com/OKcgAu1yl8qf)+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519",
    "timestamp": 1550993893131,
    "hash": "sha256",
    "content": "4qBBWCD0u3/t4USOYHOiuOJBjmpmzPmpizS8PFnrGkc3PiixVUPl8GzL3dXp/sVoqXx/u3B2dmj0FII4nGe+LomeaZ9MKqhiadro1FA5g9WRuQIY6dnzwCZKNuD8VzH9vAYI3pXLDBDJ38ZM4+Is38ms09J5ajxs0XPST+bZy1+0aWrCAdgDjNUeEl5lx1uX1hlCtmBc59Y2/YMQs/m8qvo7nrlGdTspkVwJlwVBMztbNYWY9ol5NWtsgg7/KocwmlaqUcYifXWRlRPVZpIVdanmDDDbOD6qiSgV36lxZHlzbnHyxwn1vnJBRaDmDaSgWmiTDigFv9+v/EzwDe1P3jxjyYYL20Chyerh6UnLaIzYCXOlCP+4C4F8ykIIhhY3E+FKoTz9Rr5lN0SJDawTkD1uE/AprVVu6efBbKSNFNC8lO8w5dckpszYYaiO95/BaYNUFMLOF0U95CKmY9A=.box",
    "signature": "gdnR+HLq2ZabrWhrVmoZTNhfnlejw00M/vDleXAY0EWPtGhA7wNk0Fe1tqG46BVwu/rfjF9RF+iB8xI4t/fwCQ==.sig.ed25519"
  },
  "timestamp": 1550993893131.001
}
```

**Alice can decrypt the message content using the `sbot.private.unbox(privateMessage,callback)` method:**

```javascript
const ssbClient = require('ssb-client')

// run `$ sbot server` first
ssbClient((err, sbot) => {
  if (err) {
    console.error(err)
    return
  }

  sbot.get('%x1EWM6z2+4r6pzDBjS0K9Fpoh9VcNVzVYkY1nivkDxI=.sha256',
  (err, privateMessage) => {

    sbot.private.unbox(
      privateMessage.content,
      function (err, content) {

        // 'content' is now an object
        // (if you were a recipient)
        console.log(content)

        sbot.close()
      }
    )
  })
})
```

The decrypted output will read:

```javascript
{ type: 'post', text: 'This is a secret message to Alice' }
```

### Blobs

A blob is arbitrary binary data that can be stored and referred in Scuttlebutt feed messages as attachments.

We’ll upload a file `data.txt` that contains the text content hello world .

**Here’s how to upload a file using the CLI with the blobs plugin:**

```bash
$ cat data.txt | sbot blobs.add

&qUiQTy8PR5uPgZdpSzAYSw0u0cHNKh7A+4XSmaGSpEc=.sha256
```

**The returned blob ID is a SHA256 hash of the contents and start with the `&` symbol.** Because it’s a content hash you’ll always get the same hash for the same content.

**Here’s how to retrieve the blob content using the CLI** (make sure to use double quotes around the blob ID):

```bash
$ sbot blobs.get "&qUiQTy8PR5uPgZdpSzAYSw0u0cHNKh7A+4XSmaGSpEc=.sha256"

hello world
```

To upload a blob using Node.js, it requires the [`pull-stream`](https://www.npmjs.com/package/pull-stream) NPM module. **Here’s an example of uploading a blob using from Node.js:**

```javascript
const ssbClient = require('ssb-client')
const pull = require('pull-stream')

// run `$ sbot server` first
ssbClient((err, sbot) => {
  pull(
    pull.values('hello world'),
    sbot.blobs.add((err, hash) => {
      console.log(hash) // "&uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=.sha256"

      sbot.close()
    })
  )
})
```

**Similarly, here’s how to download a blob using Node.js:**

```javascript
const ssbClient = require('ssb-client')
const pull = require('pull-stream')

// run `$ sbot server` first
ssbClient((err, sbot) => {
  const hash = '&uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=.sha256'

  pull(
    sbot.blobs.get(hash),
    pull.collect((err, values) => {

      const data = values.join('')
      console.log(data) // "hello world"

    })
  )

  sbot.close()
})
```

We had to join the values because the data is in 65,536 byte chunks.

**Now we can “attach” a file in our message post by referencing the link blob ID with additional metadata under the `mentions` array:**

```javascript
const ssbClient = require('ssb-client')
const fs = require('fs')

// run `$ sbot server` first
ssbClient((err, sbot) => {
  const filename = 'data.txt'
  const {size} = fs.statSync(filename)

  sbot.publish({
    type: 'post',
    text: 'this is a post with a link to a file',
    mentions: [{
      name: filename,
      link: '&qUiQTy8PR5uPgZdpSzAYSw0u0cHNKh7A+4XSmaGSpEc=.sha256',
      size: size,
      type: 'text/plain'
    }]
  }, (err, message) => {
    console.log(message)

    sbot.close()
  })
})
```

This outputs the signed message:

```json
{
  "key": "%6keqfucW/o7wxrMzsWNp712jvtWIznW2x6nL2wqG/l4=.sha256",
  "value": {
    "previous": "%zWulymrc0zJzGxSlBFmgNOTQo4xe7H92Iqahj+Cw6xo=.sha256",
    "sequence": 26,
    "author": "[@OKcgAu1yl8qf](http://twitter.com/OKcgAu1yl8qf)+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519",
    "timestamp": 1551052280699,
    "hash": "sha256",
    "content": {
      "type": "post",
      "text": "this is a post with a link to a file",
      "mentions": [
        {
          "name": "data.txt",
          "link": "&qUiQTy8PR5uPgZdpSzAYSw0u0cHNKh7A+4XSmaGSpEc=.sha256",
          "size": 12,
          "type": "text/plain"
        }
      ]
    },
    "signature": "w5IKhstI5i0qYmVZVPbpN+b4e9AhmwUyg2fdCIaDr23xhKcir0zke0fP4IQHqOEzUivSPbBeH6oYMgRsWx/bAw==.sig.ed25519"
  },
  "timestamp": 1551052280700
}
```

Here’s a oneliner to get the file size in bytes using the command-line:

```bash
$ stat -f%z data.txt
12
```

**An important thing to note is that peers that follow you will automatically download all references to blobs so it’s best to not upload large files or too many or risk being unfollowed!**

## Joining a Public Pub server

Now let’s see how we can connect to a public Pub. If you recall, a Pub is a relayer who’s always online and relays messages between peers for cases when there’s requests for feeds but their respective peers are offline.

To join a public Pub all you need an invite code. For this example, we’ll use the [*ssb.organicdesign.pub](https://ssb.organicdesign.pub/)* Pub server which you can simply generate an invite code from their [webpage](https://ssb.organicdesign.pub/).

**The invite code contains the Pub’s domain name, port, and public key.** The invite code will look in this format:

```text
ssb.organicdesign.pub:8008:[@XgC5wDA2EW](http://twitter.com/XgC5wDA2EW)++ufaDrjRDHXA7Dyd1ce5bTenCm2u6PZU=.ed25519~ZaYS08O0YyLLgy56Z8GPB6N/kKxXHAL+qd34uCI4iHQ=
```

**Use `invite.accept` from the sbot CLI to accept the invite:**

```bash
$ sbot invite.accept ssb.organicdesign.pub:8008:[@XgC5wDA2EW](http://twitter.com/XgC5wDA2EW)++ufaDrjRDHXA7Dyd1ce5bTenCm2u6PZU=.ed25519~ZaYS08O0YyLLgy56Z8GPB6N/kKxXHAL+qd34uCI4iHQ=

[
  {
    "key": "%qKOg33mCqebklSyVEZ20lHh/FjxuCs8Nz9VvmeAFvYA=.sha256",
    "value": {
      "previous": "%x1EWM6z2+4r6pzDBjS0K9Fpoh9VcNVzVYkY1nivkDxI=.sha256",
      "sequence": 22,
      "author": "[@OKcgAu1yl8qf](http://twitter.com/OKcgAu1yl8qf)+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519",
      "timestamp": 1550998546912,
      "hash": "sha256",
      "content": {
        "type": "contact",
        "following": true,
        "autofollow": true,
        "contact": "[@XgC5wDA2EW](http://twitter.com/XgC5wDA2EW)++ufaDrjRDHXA7Dyd1ce5bTenCm2u6PZU=.ed25519"
      },
      "signature": "hVmy4ml2JeHOsyhChQEWCc4lHfOLIWl3tC2P0NIl6RXa3pt4o4qbjCDobsqk7toSHI4O5DPldkXHdyLmUmILBw==.sig.ed25519"
    },
    "timestamp": 1550998546912.001
  },
  {
    "key": "%1bs8lGruDjcqxWZT5CJpFxS5LcaQpsioJq9sbH6YFFU=.sha256",
    "value": {
      "previous": "%qKOg33mCqebklSyVEZ20lHh/FjxuCs8Nz9VvmeAFvYA=.sha256",
      "sequence": 23,
      "author": "[@OKcgAu1yl8qf](http://twitter.com/OKcgAu1yl8qf)+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ=.ed25519",
      "timestamp": 1550998546913,
      "hash": "sha256",
      "content": {
        "type": "pub",
        "address": {
          "host": "ssb.organicdesign.pub",
          "port": 8008,
          "key": "[@XgC5wDA2EW](http://twitter.com/XgC5wDA2EW)++ufaDrjRDHXA7Dyd1ce5bTenCm2u6PZU=.ed25519"
        }
      },
      "signature": "1lgtm/VSU9YwikpofJeQymxiEqvIxSVEsZ1C1IR9qXiw++rxq7jV66X4rIKrPysvrTtYDb0Xb5L5SPhIDg+ABQ==.sig.ed25519"
    },
    "timestamp": 1550998546914
  }
]
```

If you see the output, accepting an invite means creating a message with a type of `pub` instead of `post` and providing the invite code information. **The Pub will now automatically follow the user which means the Pub will receive update stream from the user to gossip to all the Pub’s connected peers.**

Things that you need to in order to connect to peers are their IP address, port, and public key. The url to advertise presence is in the format `{net}:{IP}:{PORT}~shs:{PUBLIC_KEY}` .

**Here’s how to get the presence address of the Pub server:**

```bash
$ sbot getAddress
```

Outputs:

```text
"ws://localhost:8989~shs:OKcgAu1yl8qf+i3tCj5jFBkwPApN0/+vEkq0aGR9mjQ="
```

Highly recommend taking a look at all the commands and features sbot provides:

```bash
$ sbot --help
Secure-scuttlebutt API server

Commands:
  get                  Get a message by its hash-id.
  createFeedStream     (feed) Fetch messages ordered by their claimed timestamps.
  createLogStream      (log) Fetch messages ordered by the time received.
  messagesByType       (logt) Retrieve messages with a given type, ordered by receive-time.
  createHistoryStream  (hist) Fetch messages from a specific user, ordered by sequence numbers.
  createUserStream     Fetch messages from a specific user, ordered by sequence numbers.
  createWriteStream    write a number of messages to the local store.
will error if messages are not valid, but will accept
messages that the sbot doesn't replicate.
  links                Get a stream of messages, feeds, or blobs that are linked to/from an id.
  add                  Add a well-formed message to the database.
  publish              Construct a message using sbot's current user, and add it to the DB.
  getAddress           Get the address of the server. Default scope is public.
  getLatest            Get the latest message in the database by the given feedid.
  latest               Get the seq numbers of the latest messages of all users in the database.
  latestSequence       Get the sequence and local timestamp of the last received message from
a given

`feedId`

.
  whoami               Get information about the current sbot user.
  progress             returns an object reflecting the progress state of various plugins.
the return value is a

`{}`

with subobjects showing

`{start,current,target}`

to represent progress. Currently implemented are

`migration`

(legacy->flume)
migration progress and

`indexes`

(index regeneration).
  status               returns an object reflecting the status of various ssb operations,
such as db read activity, connection statuses, etc, etc. The purpose is to provide
an overview of how ssb is working.
  version              return the current version number of the running server

friends.all          Fetch the graph structure.
  friends.hops         List the degrees-of-connection of all known feeds from the given feed.
  friends.createFriendStream Live-stream the ids of feeds which meet the given hops query. If

`meta`

option is set, then will return steam of

`{id, hops}`
  friends.get          Get the edge between two different feeds.

gossip.peers         Get the current peerlist.
  gossip.add           Add an address to the peer table.
  gossip.remove        Remove an address from the peer table.
  gossip.ping          used internally by the gossip plugin to measure latency and clock skew
  gossip.connect       Add an address to the peer table, and connect immediately.
  gossip.changes       Listen for gossip events.
  gossip.reconnect     Tell sbot to reinitiate gossip connections now.
  gossip.enable        Update the config to enable a gossip type.
  gossip.disable       Update the config to disable a gossip type.

invite.create        Create a new invite code.
  invite.accept        Use an invite code.
  invite.use           Use an invite code created by this sbot instance (advanced function).

plugins.install      Install a plugin to Scuttlebot.
  plugins.uninstall    Uninstall a plugin from Scuttlebot.
  plugins.enable       Update the config to enable a plugin.
  plugins.disable      Update the config to disable a plugin.

replicate.changes    Listen to replicate events.
  replicate.upto       returns {} of feeds to replicate, with sequences
  replicate.request    request a given feed, either as request(id) to replicate that feed,
or request(id, false) to disable replication.
```

## Patchwork — An SSB GUI

**[Patchwork](https://github.com/ssbc/patchwork) is the decentralized messaging and sharing app built on top of SSB**. The scuttlebutt protocol itself doesn’t maintain set of feeds a user is interested in so a client is necessary to maintains list of peer feeds that their respective user is interesting in and following.

![Source: [scuttlebutt.nz](https://www.scuttlebutt.nz/getting-started)](patchwork.jpeg)

*Source: [scuttlebutt.nz](https://www.scuttlebutt.nz/getting-started)*

**When you install and run Patchwork you are only able to see and communicate with peers in your local area network. To access out of your LAN you need to connect to a Pub.** A pub is invite only and they relay messages between you and peers outside of your LAN and between other Pubs.

Remember, you have to follow someone to get messages from them. This reduces spam messaging towards users. Users only see replies from people they follow. Data is synced on disk for it to work offline but can sync directly with peers in your LAN over wifi or bluetooth.

## Conclusion

We went over creating identities, publishing unencrypted and encrypted messages, connecting to Pubs, and using the command-line interface, Node.js client, and brief overview of the Patchwork GUI. Secure Scuttlebutt is an offline-first decentralized messaging protocol for peer-to-peer communication.

To recap, SSB uses content-hash linking. To indicate the type of ID a symbol is prepended to the link:

- `@` for feeds
- `%` for messages
- `&` for blobs

Each ID has a tag appended to indicate the key or hash algorithm used.

Feeds are a log of user messages much like a diary. A user can publish public or private messages to their log. The recipients of the private messages must be specified at the time of creation of the message. Only the recipients can “unbox” the private message.

Pubs (“super peers”) are always online relay servers that a user must join via an invite code. Once joined, the user can connect to other peers connected to the same Pub. The Pub relays messages between peers and stores feeds on disk in order to provide consistency and availability of feeds to peers since a peer might be offline when another peer requests their feed.

Alice must be following Bob in order for Alice to receive replies Bob. SSB is a pull-based system.

Things I didn’t really cover but you can easily figure out on your own as an exercise:

- following/unfollowing users
- updating your user profile
- announcing a Pub server
- creating invite codes
- different publishing types

Highly recommend additional reading and resources listed below.

**References:**

- **[Scuttlebot](http://ssbc.github.io/scuttlebot/):** A p2p log store and relay server.
- **[Secure Scuttlebutt](http://ssbc.github.io/secure-scuttlebutt/):** a global database protocol.
- **[Patchwork](http://ssbc.github.io/patchwork/):** a social messaging app built on Scuttlebot and SSB.
- **[Scuttlebutt Protocol Guide](https://ssbc.github.io/scuttlebutt-protocol-guide/):** how Scuttlebutt works.
- **[Scuttlebutt Documentation](https://ssbc.github.io/docs/):** documentation and guides.
- **[Scuttlebutt Handbook](https://www.scuttlebutt.nz/):** principles, concepts, and FAQ.

**Related projects:**

- **[GNUnet](https://gnunet.org/):** network protocol stack for building distributed and privacy-preserving applications.
- **[Secushare](https://secushare.org/):** protected messaging and social networking on top of GNUnet.
- **[Retroshare](https://retroshare.cc/):** peer-to-peer communication network built on top of GPG.
- **[Freenet](https://freenetproject.org/author/freenet-project-inc.html):** censorship-resistant peer-to-peer communication and publishing.
- **[ZeroNet](https://zeronet.io/):** decentralized websites using Bitcoin crypto and BitTorrent.
- **[Diaspora](https://diasporafoundation.org/):** social network consisting of many individual federated servers.
- **[Mastodon](https://joinmastodon.org/):** federated self-hosted microblogging social network.
- **[Matrix](https://matrix.org):** open protocol for real-time communication.
- **[Cabal](https://cabal-club.github.io/):** experimental peer-to-peer community chat platform.
- **[GunDB](https://github.com/amark/gun):** realtime, offline-first, mutable graph database engine.
- **[OrbitDB](https://github.com/orbitdb/orbit-db):** IPFS-backed distributed peer-to-peer database.
