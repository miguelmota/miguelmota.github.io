---
layout: blog-post
title: Set up SSH keys
category: blog
tags: [SSH, git]
description: How to set up SSH private, public and authorized keys.
---

Having to type in a password in order to SSH into your server every single time is tedious and not the way to go. I will show you how to set up SSH keys so that you can elimate an extra step from your workflow.

## Generating keys

On your local maching, generate a new SSH key with the command:

```bash
# Generate new key.
ssh-keygen -t rsa
```

When asked for the file to save the key in, enter:

```bash
ssh-add id_rsa
```

Proceed by entering a passphrase. You will know when you are done when you see those funny symbols in a box at the end.

## Adding authorized key

The next step is to add the public key to your server.

```bash
# Make sure you have a .ssh directory on your server,
# if not SSH into it and create it: mkdir ~/.ssh/

# Concatenate public key to your server's authorized keys.
cat ~/.ssh/id_rsa.pub | ssh <your server username>@<your server ip address> "cat >> ~/.ssh/authorized_keys"

# Alternatively, you can run:
ssh-copy-id <your server username>@<your server ip address>
```

The first time you try to SSH it will ask you for your password, but then exit and try to SSH again. *Look Ma! No password!*

## Pulling from server

As you can imagine, you can push changes to a private repository, for example on [Bitbucket](https://bitbucket.org/), and then pull the changes straight to your server whenever you're ready. It's pretty simple, just repeat the steps on how to generate an SSH key but this while SSH'd into your server. Afterwards copy your public key and paste into the SSH key settings on your Bitbucket or Github, (or whatever) account. You can view your SSH public key with:

```bash
# View public SSH key.
cat ~/.ssh/id_rsa.pub
```

Assuming you have git already installed on your server, you can clone a repo and perform git pulls as you would on your local machine.

Hope this helped.
