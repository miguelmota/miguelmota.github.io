---
layout: blog-post
title: Node.js and Nginx on Ubuntu
type: blog
tags: [Node.js, Nginx, Ubuntu]
description: Get Node.js and Nginx running on your Ubuntu server.
date: 2013-09-26T00:00:00-00:00
draft: false
---
In this tutorial I will show how to install and configure [Node.js](http://nodejs.org/) and [Nginx](http://nginx.org/) on you [Ubuntu](http://www.ubuntu.com/) server.

## Installing Dependencies

The only dependency we really need is the `build-essential` package in order to be able to compile the Node.js source code.

```bash
# Make sure to download the latest repos.
sudo apt-get update

# Required to run `make` command.
sudo apt-get install build-essential

# If you need to use https.
sudo apt-get install libssl-dev

# My favorite text editor.
sudo apt-get install vim

# Git to manage your repos.
sudo apt-get install git
```

## Installing Node.js

Head over to the [Node.js Downloads](http://nodejs.org/download/) page and copy the link to the source code tarball (node-&lt;version&gt;.tar.gz).

```bash
# Create and change into directory.
sudo mkdir /opt/node/
cd /opt/node/

# Download the Node.js tarball.
sudo wget http://nodejs.org/dist/v0.10.19/node-v0.10.19.tar.gz

# Extract the tarball.
sudo tar xvzf node-v0.10.19.tar.gz

# Do some cleaning up.
sudo mv node-v0.10.19/* .
sudo rm node-v0.10.19.tar.gz
sudo rm -r node-v0.10.19/

# Run `make` and `make install`.
# Be patient. Compiling from source takes a few minutes.
sudo make
sudo make install

# Running `make test` is a good idea.
sudo make test

# Check the version to see if it was properly installed.
node -v
```

If you get a version number then you're good to go.

## Setting up a Node.js webserver



```bash
# Create the directory to hold the sites.
sudo mkdir /var/www/
cd /var/www/

# Create our Hello World site.
sudo mkdir helloworld/
cd helloworld/

# Create a server file.
vim server.js
```

Paste in the simple code into server.js

```javascript
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(3000);
console.log('Server running at http://<your server ip address>:3000/');
```

Hit the <key>ESC</key> key then type in `:wq` to save and exit. Then run the webserver with:

```bash
# Run webserver.
node server.js
```

To always run in the background, check out the [Forever](https://github.com/nodejitsu/forever) node module.

```bash
# Install Forever module globally.
sudo npm install -g forever

# Start webserver.
# To view options, run: forever --help
forever start -l hello-world.log server.js

# View log file.
tail -f ~/.forever/hello-world.log
```

Open up a browser window and go to:

```bash
http://<your server ip address>:3000/
```

You should see the "Hello World" message.

If for whatever reason you don't know your server's IP address, run:

```bash
# Find server IP address
ifconfig eth0 | grep inet | awk '{ print $2 }'
```

## Installing Nginx

Nginx is good for serving static files, as well as a being a *load balancer*. And you can route multiple domains to your Node.js webserver. Let's install it now.

```bash
# Installing Nginx is a breeze.
sudo apt-get install nginx
```

Here are some useful Nginx commands.

```bash
# Self explanatory.
sudo service nginx {stop|start|restart|reload}

# Alternatively, you also do:
/etc/init.d/nginx {stop|start|restart|reload}
```

The default nginx configuation file is located under:

```bash
# Default nginx config file.
/etc/nginx/nginx.conf
```

Take note of the default log file locations, which you can view by using the `tail` command.

```bash
# View access logs.
tail -f /var/log/nginx/access.log

# View error logs.
tail -f /var/log/nginx/error.log
```

## Configuring Nginx server

To proxy the Node.js server to Nginx, a new webserver config needs to be created.

```bash
# Backup default config.
mv /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak

# Create new config.
vim /etc/nginx/sites-available/default
```

In the empty config file add the following settings ([gist](https://gist.github.com/miguelmota/6912559)):

```nginx
# The upstream module is the link between Node.js and Nginx.
# Upstream is used for proxying requests to other servers.
# All requests for / get distributed between any of the servers listed.
upstream helloworld {
  # Set up multiple Node.js webservers for load balancing.
  # max_fails refers to number of failed attempts
  # before server is considered inactive.
  # weight priorities traffic to server. Ex. weight=2 will recieve
  # twice as much traffic as server with weight=1
  server <your server ip>:3000 max_fails=0 fail_timeout=10s weight=1;
  # server <your server ip>:3001 max_fails=0 fail_timeout=10s weight=1;
  # server <your server ip>:3002 max_fails=0 fail_timeout=10s weight=1;
  # server <your server ip>:3003 max_fails=0 fail_timeout=10s weight=1;

  # Send visitors back to the same server each time.
  ip_hash;

  # Enable number of keep-alive connections.
  keepalive 512;
}

server {
  listen 80;
  listen [::]:80 default_server ipv6only=on;

  # Index files.
  index index.html;

  # Domain names.
  # Make sure to set the A Record on your domain's DNS settings to your server's IP address.
  # You can test if was set properly by using the `dig` command: dig yourdomain.com
  server_name yourdomain.com www.yourdomain.com;

  # Timeout for closing keep-alive connections.
  keepalive_timeout 10;

  # Enable gzip compression.
  gzip on;
  gzip_http_version 1.1;
  gzip_vary on;
  gzip_comp_level 6;
  gzip_proxied any;
  gzip_buffers 16 8k;
  gzip_disable "MSIE [1-6]\.(?!.*SV1)";

  # Max upload size.
  # client_max_body_size 16M;

  # Change access and error log files.
  # access_log /var/log/nginx/yourdomain.com/access.log;
  # error_log /var/log/nginx/yourdomain.com/error.log;

  # Custom error page.
  # error_page 404 maintenance.html;
  # error_page 500 502 503 504 maintenance.html;

  # location /maintenance.html {
  #  root /var/www;
  # }

  location / {
    # Set this to your upstream module.
    proxy_pass http://helloworld;
    # Headers to pass to proxy server.
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_set_header X-NginX-Proxy true;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_cache_bypass $http_upgrade;
    proxy_http_version 1.1;
    proxy_redirect off;
    # Go to next upstream after if server down.
    proxy_next_upstream error timeout http_500 http_502 http_503 http_504;
    proxy_connect_timeout 5s;
    # Gateway timeout.
    proxy_read_timeout 20s;
    proxy_send_timeout 20s;
    # Buffer settings.
    proxy_buffers 8 32k;
    proxy_buffer_size 64k;
  }

  # Enable caching of static files.
  # location ~* \.(css|js|ico|gif|jpe?g|png|svg)$ {
  #  expires 168h;
  #  add_header Pragma public;
  #  add_header Cache-Control "public, must-revalidate, proxy-revalidate";
  # }

  # Don't cache html files.
  # location ~* \.html$ {
  #  expires -1;
  # }

  # Serve static files without going through upstreams
  location ~ ^/(images/|img/|javascript/|js/|css/|stylesheets/|flash/|media/|static/|robots.txt|humans.txt|favicon.ico) {
    root /var/www/helloworld;
    access_log off;
    expires 1h;
  }


}
```

After you have saved the file and exited, test for any Nginx errors and then reload the config.

```bash
nginx -t

sudo service nginx reload
```

Nginx will let you know if you have any errors in your config. Fix them and reload once again.

If you're trying to reference multiple domains and got the following error:

```bash
Reloading nginx configuration: nginx: [emerg] could not build the server_names_hash, you should increase server_names_hash_bucket_size: 32
```

Uncomment this line in `/etc/nginx/nginx.conf`.

```bash
server_names_hash_bucket_size 64;
```

To test that gzip is working, execute:

```bash
curl --header "Accept-Encoding: gzip" -I http://yourdomain.com
```

You should see the line:

```bash
Content-Encoding: gzip
```

## Conclusion

If everything went smoothly, going to your domain will bring up the "Hello World" message. If not then let us know in the comments where you got stuck and I will try to help you out.

I by no means are a server expert, I'm only sharing what I've learned in the past few weeks, so feel free to add your input and thoughts.
