---
layout: blog-post
title: Deployment with Git
category: blog
tags: [Git, SSH, deployment]
short_url: mig.gs/gUva
description: Setting up git hooks for effortless deployment.
---

A [Git hook](http://git-scm.com/docs/githooks.html) allows you to execute custom scripts when an action occurs, such as when a commit or push is performed. Before I discovered git hooks, my deployment process consisted of pushing changes to my remote repository, SSH'ing into the server, navigating to the site directory, pulling the changes, and restarting the webserver. It wasn't efficient at all and a waste of time doing that several times a day. I'll explain how to set up a simple git hook making the deployment process a bit more effortless, but first I want to give credit to this [how-to](http://toroid.org/ams/git-website-howto) article which got me started.

In this example we'll be deploying the `production` branch but it can be whatever branch name you want, and our site name will be called `foo`.

## On the server

Initialize an empty git repo.

{% highlight bash %}
mkdir -p /opt/git/foo.git
cd /opt/git/tracfone.git
git init --bare # no source files, only version control
{% endhighlight%}

Create a [`post-receive`](http://git-scm.com/book/en/Customizing-Git-Git-Hooks) hook which gets called after a `push` is complete.

{% highlight bash %}
vim /opt/git/foo.git/hooks/post-receive
{% endhighlight%}

<script src="https://gist.github.com/miguelmota/9595095.js"></script>

([hook gist](https://gist.github.com/miguelmota/9595095))

Make sure to make the hook executable.

{% highlight bash %}
chmod u+rwx /opts/git/foo.git/hooks/post-receive
{% endhighlight %}

## On the client

Add a remote.

{% highlight bash %}
git remote add production ssh://<username@<server ip>/opt/git/foo.git
git push production +production:refs/heads/production

# Afterwards you can simply do
git push production
{% endhighlight %}

It's also possible to deploy to multiple servers, just add the remote urls in `.git/config`.

{% highlight bash %}
[remote "production"]
  url = ssh://<username>@<server 1 ip>/opt/git/foo.git
  url = ssh://<username>@<server 2 ip>/opt/git/foo.git
{% endhighlight %}

By default git will push all branches to the remotes but we can have it push the current branch only.

{% highlight bash %}
git config --global push.default current
{% endhighlight %}

## Conclusion

Git hooks can help automate your deployment process. Checkout the list of client and server-side [Git hooks](http://git-scm.com/book/en/Customizing-Git-Git-Hooks) available.
