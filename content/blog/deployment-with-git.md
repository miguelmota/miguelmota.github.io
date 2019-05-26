---
layout: blog-post
title: Deployment with Git
type: blog
tags: [Git, SSH, deployment]
description: Setting up git hooks for effortless deployment.
date: 2014-03-14T00:00:00-00:00
draft: false
---
A [Git hook](http://git-scm.com/docs/githooks.html) allows you to execute custom scripts when an action occurs, such as when a commit or push is performed. Before I discovered git hooks, my deployment process consisted of pushing changes to my remote repository, SSH'ing into the server, navigating to the site directory, pulling the changes, and restarting the webserver. It wasn't efficient at all and a waste of time doing that several times a day. I'll explain how to set up a simple git hook making the deployment process a bit more effortless, but first I want to give credit to this [how-to](http://toroid.org/ams/git-website-howto) article which got me started.

In this example we'll be deploying the *production* branch but it can be whatever branch name you want, and our site name will be called *foo*.

## On the server

Initialize an empty git repo. This will act as the mediator.

```bash
mkdir -p /opt/git/foo.git
cd /opt/git/tracfone.git
git init --bare # no source files, only version control
```

Create a [`post-receive`](http://git-scm.com/book/en/Customizing-Git-Git-Hooks) hook which gets called after a *push* is complete.

```bash
vim /opt/git/foo.git/hooks/post-receive
```

```bash
#!/bin/bash

SITE_NAME="Foo"
SITE_PATH="/var/www/foo.com"
BRANCH="production"

echo "**** $SITE_NAME [post-receive] hook received."

while read oldrev newrev ref
do
  branch_received=`echo $ref | cut -d/ -f3`

  echo "**** Received [$branch_received] branch."

  # Making sure we received the branch we want.
  if [ $branch_received = $BRANCH ]; then
    cd $SITE_PATH

    # Unset to use current working directory.
    unset GIT_DIR

    echo "**** Pulling changes."
    git pull origin $BRANCH

    # Instead of pulling we can also do a checkout.
    : '
    echo "**** Checking out branch."
    GIT_WORK_TREE=$SITE_PATH git checkout -f $BRANCH
    '

    # Or we can also do a fetch and reset.
    : '
    echo "**** Fetching and reseting."
    git fetch --all
    git reset --hard origin/$BRANCH
    '

  else
    echo "**** Invalid branch, aborting."
    exit 0

  fi
done

# [Restart/reload webserver stuff here]

echo "**** Done."

exec git-update-server-info
```

([hook gist](https://gist.github.com/miguelmota/9595095))

Make sure to make the hook executable.

```bash
chmod u+rwx /opt/git/foo.git/hooks/post-receive
```

## On the client

Add the remote url.

```bash
git remote add production ssh://<username@<server ip>/opt/git/foo.git
```

Push the *production* branch.

```bash
git push production +production:refs/heads/production

# Afterwards you can simply do
git push production
```

It's also possible to deploy to multiple servers, just add the remote urls in `.git/config`.

```bash
[remote "production"]
  url = ssh://<username>@<server 1 ip>/opt/git/foo.git
  url = ssh://<username>@<server 2 ip>/opt/git/foo.git
```

By default git will push all branches to the remotes but we can have it push the current branch only.

```bash
git config --global push.default current
```

## Conclusion

Git hooks can help automate your deployment process. Checkout the list of client and server-side [Git hooks](http://git-scm.com/book/en/Customizing-Git-Git-Hooks) available.
