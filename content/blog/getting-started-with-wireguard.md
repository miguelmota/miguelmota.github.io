---
layout: blog-post
title: Getting Started with WireGuard
type: blog
tag: [WireGuard, VPN, Linux, Tutorial]
description: Learn how to set up a WireGuard VPN tunnel
date: 2020-04-05T00:00:00-00:00
draft: false
---
[WireGuard](https://www.wireguard.com/) is a relatively new VPN tunnel protocol that aims to be very fast and easy to setup. It follows the [Unix Philosophy](https://homepage.cs.uri.edu/~thenry/resources/unix_art/ch01s06.html) closely in that it only _does one thing_ (creating secured VPN tunnels) and _does it well_.

If you've ever set up an VPN service such as [OpenVPN](https://github.com/OpenVPN/openvpn) before then you know that it can get complicated because of all the steps you have to go through such as generating certificate authorities, issuing server and client keys and certificates, setting up multiple configuration files, configuring firewall rules, setting up route traffic forwarding, etc. which can either be dreadful or daunting. WireGuard is changing all that by simplifying the process of getting up and running in no time and allowing for easy configuration to connect multiple clients (peers).

### Why use WireGuard?

- A VPN protects you from man in the middle attacks.
- Protect your privacy against ISPs that snoop into your traffic.
- Get around internet censorship in countries.

Advantages of WireGuard over other VPNs:

- It's kernel-based which reduces attack surface and can be ran in virtually any device.
- Establishes connections in less than 100ms.
- Uses modern and improved [cryptographic standards](https://en.wikipedia.org/wiki/WireGuard#Protocol).
- Easy to configure and deploy as SSH.
- Simple handshake occurring every few minutes to ensure connection secrecy.
- IP roaming support meaning you can change wifi networks or disconnect from wifi or celluar  and the VPN tunnel connection won't be lost. *It just works!*

### What we'll be going over

This post assumes that you've never installed a VPN service before and we'll be using an Ubuntu machine since it's the most popular distro.

This post is pretty verbose! but you can skip to the [TLDR;](#tldr) to see the final scripts and configuration files used if you're familiar with the concepts already.

The steps outlined in this post are:

1. [Setting up a server](#setting-up-a-server)
2. [Installing WireGuard on server](#installing-wireguard-on-server)
3. [Generating server keys](#generating-server-keys)
4. [Creating server configuration file](#creating-server-configuration-file)
5. [Enabling IP forwarding on server](#enabling-ip-forwarding-on-server)
6. [Installing WireGuard on client](#installing-wireguard-on-client)
7. [Generating client keys](#generating-client-keys)
8. [Creating client configuration file](#creating-client-configuration-file)
9. [Setting client info on server config](#setting-client-info-on-server-config)
10. [Starting WireGuard service on server](#starting-wireguard-service-on-server)
11. [Starting WireGuard service on client](#starting-wireguard-service-on-client)
12. [Connecting a mobile client to server](#connecting-a-mobile-client-to-server)
13. [Generating vanity addresses](#generating-vanity-addresses)

Please note that in WireGuard land there is no "server" and "client" in the traditional sense. Rather, computers and devices connected to each other are known as "peers". For simplicity sake, we'll be using "server" to mean the hosted server that will be forwarding all our traffic to, and we'll be using "client" to refer to the home computer that forwards all it's traffic to the server.

## Setting up a server

I'll be using a free tier EC2 micro instance from AWS for the example (and tearing down it afterwards). If you have an AWS account you can launch a new instance by going to:

EC2 → Launch Instance → t2.micro with Ubuntu → Review and Launch → Launch

In this example I'm running Ubuntu 18.04 (Bionic Beaver).

## Installing WireGuard on server

To install wireguard on Ubuntu <19.04 run the following comands:

1. `sudo add-apt-repository ppa:wireguard/wireguard`
2. `sudo apt-get update`
3. `sudo apt-get install wireguard`

If your server is using a different distro then look at the WireGuard [installation instructions](https://www.wireguard.com/install/).

```bash
ubuntu@ip-172-30-0-233:~$ sudo add-apt-repository ppa:wireguard/wireguard
 WireGuard is a novel VPN that runs inside the Linux Kernel. This is the Ubuntu packaging for WireGuard. More info may be found at its website, listed below.

More info: https://www.wireguard.com/
Packages: wireguard wireguard-tools wireguard-dkms

Install with: $ apt install wireguard
 More info: https://launchpad.net/~wireguard/+archive/ubuntu/wireguard
Press [ENTER] to continue or Ctrl-c to cancel adding it.

<truncated>

Fetched 18.5 MB in 4s (4840 kB/s)

ubuntu@ip-172-30-0-233:~$ sudo apt-get update
Hit:1 http://us-east-1.ec2.archive.ubuntu.com/ubuntu bionic InRelease
Hit:2 http://us-east-1.ec2.archive.ubuntu.com/ubuntu bionic-updates InRelease
Hit:3 http://us-east-1.ec2.archive.ubuntu.com/ubuntu bionic-backports InRelease
Hit:4 http://security.ubuntu.com/ubuntu bionic-security InRelease
Hit:5 http://ppa.launchpad.net/wireguard/wireguard/ubuntu bionic InRelease
Reading package lists... Done

ubuntu@ip-172-30-0-233:~$ sudo apt-get install wireguard
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following additional packages will be installed:

<truncated>

update-alternatives: using /usr/bin/g++ to provide /usr/bin/c++ (c++) in auto mode
Setting up build-essential (12.4ubuntu1) ...
Setting up wireguard-dkms (1.0.20200401-1ubuntu1~18.04) ...
Loading new wireguard-1.0.20200401 DKMS files...
Building for 4.15.0-1057-aws
Building initial module for 4.15.0-1057-aws
Done.

wireguard:
Running module version sanity check.
 - Original module
   - No original module exists within this kernel
 - Installation
   - Installing to /lib/modules/4.15.0-1057-aws/updates/dkms/

depmod...

DKMS: install completed.
Setting up wireguard (1.0.20200319-0ppa1~18.04) ...
Processing triggers for libc-bin (2.27-3ubuntu1) ...
Processing triggers for man-db (2.8.3-2ubuntu0.1) ...
```

Let's launch a shell as `root` with ` sudo -s` to avoid having to type sudo every time from now on:

```bash
ubuntu@ip-172-30-0-233:~$ sudo -s
root@ip-172-30-0-233:~#
```

Run `wg` to check if installation was successful which should _not_ output anything if everything is OK:

```bash
root@ip-172-30-0-233:/etc/wireguard/keys# wg
root@ip-172-30-0-233:/etc/wireguard/keys#
```

The two WireGuard commands we'll be using are:

- `wg` for configuring WireGuard interfaces.
- `wg-quick` for starting and stopping WireGuard VPN tunnels.

## Generating server keys

WireGuard configuration files will live under `/etc/wireguard/` so let's create a directory named `keys` there to store the keys we'll generate:

```bash
root@ip-172-30-0-233:~# mkdir /etc/wireguard/keys
```

Go into the `/etc/wireguard/keys/` directory:

```bash
root@ip-172-30-0-233:~# cd /etc/wireguard/keys
```

Set the directory user mask to `077` by running `umask 077`.  A umask of 077 allows read, write, and execute permissions for the file's owner (root in this case), but prohibits read, write, and execute permissions for everyone else and makes sure credentials don't leak in a race condition:

```bash
root@ip-172-30-0-233:/etc/wireguard/keys# umask 077
```

WireGuard uses asymmetric public/private Curve25519 key pairs for authentication between client and server.

Use the `wg genkey` command to generate a private key. We can generate both the private and public key at once by piping the private key output to `tee` to save it to file but also to forward the private key to `wg publickey` which derived the public key from a private key and the save it to a file.

So the command to run is `wg genkey | tee privatekey | wg pubkey > publickey` to generate the key pair at once:


```bash
root@ip-172-30-0-233:/etc/wireguard/keys# wg genkey | tee privatekey | wg pubkey > publickey
```

If we do an `ls` we see there's a `privatekey` and `publickey` file:

```bash
root@ip-172-30-0-233:/etc/wireguard/keys# ls
privatekey  publickey
```

Outputting the contents of the private key file shows us the random key it generated in base64 format:

```bash
root@ip-172-30-0-233:/etc/wireguard/keys# cat privatekey
wIObajifv6U2emcZsAGNZbbWzkyrs84EEyr+bgmlB3M=
```

Likewise the public key it derived from the private key is in base64 format:

```
root@ip-172-30-0-233:/etc/wireguard/keys# cat publickey
H6StMJOYIjfqhDvG9v46DSX9UlQl52hOoUm7F3COxC4=
```

We'll be needing the private key for the WireGuard server configuration, and the public key for the client configuration.

### Creating server configuration file

Go into the `/etc/wireguard/` directory and create a new file `wg0.conf`. WireGuard will create a new network interface named the same as the filename so it's common convention to denote the first WireGuard network interface as `wg0` for context:

```bash
root@ip-172-30-0-233:/etc/wireguard# touch /etc/wireguard/wg0.conf
```

Open up the server configuration file `/etc/wireguard/wg0.conf` in your favorite editor:

```bash
root@ip-172-30-0-233:/etc/wireguard# vim /etc/wireguard/wg0.conf
```

Paste the following configuration into the new config file:

```ini
[Interface]
PrivateKey = <server private key>
Address = 10.0.0.1/24
ListenPort = 51820
```

The config files are in standard [INI](https://en.wikipedia.org/wiki/INI_file) format.

Replace the `PrivateKey` value with the private key content you generated earlier:

```ini
[Interface]
PrivateKey = wIObajifv6U2emcZsAGNZbbWzkyrs84EEyr+bgmlB3M=
Address = 10.0.0.1/24
ListenPort = 51820
```

The address `10.0.0.1` was chosen because it's an available private subnet on the server. If your server is using that IP range already, then pick a different address like `192.168.2.1` to avoid conflicts.

The `[Interface]` section is for configuration the new WireGuard interface we are creating.

- `PrivateKey` is your server's private key.
- `Address` is the private network IP address that we're assigning to for this network interface.
- `ListenPort` is the host port to run the service on. This port will need to be publicly accessible. The port `51820` is the default port.

Make sure to enable the port `51820` for `UDP` traffic. If using EC2 then you should allow it under the Security Group for the EC2 instance.

If your server is behind a NAT (which in our case it is because it's on EC2 behind a VPC) then all traffic needs to be forwarded from the default interface to the WireGuard interface.

To find out the name of the default interface run `ip route`:

```bash
root@ip-172-30-0-233:/etc/wireguard/keys# ip route | grep default | awk '{print $5}'
eth0
```

Now add forwarding rules for forwarding in the server configuration file using the `PostUp` and `PostDown` config settings where `PostUp` value command is ran when the WireGuard service starts and `PostDown` value command runs when the service is shutting down.

```ini
[Interface]
PrivateKey = wIObajifv6U2emcZsAGNZbbWzkyrs84EEyr+bgmlB3M=
Address = 10.0.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
```

The three iptable rules are:

- `iptables -A FORWARD -i %i -j ACCEPT` for allowing inbound traffic received by the interface.
- `iptables -A FORWARD -o %i -j ACCEPT` for allowing outbound traffic from the interface.
- `iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE` for masking the private IP address of the interface with the external IP address of the default interface.

## Enabling IP forwarding on server

By default IP forwarding is disabled meaning that if the interface receives a packet that wasn't intended for it then it'll reject it. Since we need to pass on packets from one interface to another then we need to allow IP forwarding.

 Open up the file `/etc/sysctl.conf` for editing:

```bash
root@ip-172-30-0-233:/etc/wireguard# vim /etc/sysctl.conf
```

Allow forwarding of IP packets by uncommenting out the line `net.ipv4.ip_forward=1` near line 28:

```ini
# Uncomment the next line to enable packet forwarding for IPv4
net.ipv4.ip_forward=1
```

Run `sysctl -p` for the changes to take effect without requiring a reboot:

```bash
root@ip-172-30-0-233:/etc/wireguard# sysctl -p
net.ipv4.ip_forward = 1
```

Confirm that IP forwarding is enabled by outputting the contents of `/proc/sys/net/ipv4/ip_forward` which should return `1`:

```bash
root@ip-172-30-0-233:/etc/wireguard# cat /proc/sys/net/ipv4/ip_forward
1
```

The server is almost fully configured. It's only now missing information about the client so let's set up the client next.

## Installing WireGuard on client

Jump back to your client machine and install WireGuard. My client machine is running Arch linux but the process will be the same for most linux distros. If you're running Ubuntu on the client then do the same install steps you did on the server above or look at the official WireGuard [installation instructions](https://www.wireguard.com/install/).

Ubuntu WireGuard install instructions:

```bash
$ sudo add-apt-repository ppa:wireguard/wireguard
$ sudo apt-get update
$ sudo apt-get install wireguard
```

If running Arch like I am, then these are the WireGuard install instructions:

```
$ sudo pacman -S wireguard-tools wireguard-dkms
```

Let's launch a shell as `root` with ` sudo -s` to avoid having to type sudo every time from now on:

```bash
$ sudo -s
[root@archlinux ~]#
```

## Generating client keys

The process of generating WireGuard keys on the client is the same as how it's done on the server. Create the directory `/etc/wireguard/keys` and set the user mask to `077`.

```bash
[root@archlinux ~]# mkdir /etc/wireguard/keys
[root@archlinux ~]# umask 077
```

Generate a private and public key pair for the client using the same command as we did on the server:

```bash
[root@archlinux keys]# wg genkey | tee privatekey | wg pubkey > publickey
```

Output the key contents which we'll be needing soon in our configuration files:

```bash
[root@archlinux keys]# cat privatekey
cAqmevIKScn5l4Jg1F69KEIty6gVb8wGNqNlApvzc0c=
[root@archlinux keys]# cat publickey
vi4TCAo8TNRkpf4ZpiMsp3YHaOLrcouSDkrm4wJxezw=
```

## Creating client configuration file

On the client create the configuration `/etc/wireguard/wg0.conf`:

```bash
[root@archlinux keys]# vim /etc/wireguard/wg0.conf
```

Paste the configuration into your client configuration file:

```ini
[Interface]
Address = 10.0.0.2/32
PrivateKey = <client private key>
```

Replace the `PrivateKey` value with your client's private key:

```ini
[Interface]
Address = 10.0.0.2/32
PrivateKey = cAqmevIKScn5l4Jg1F69KEIty6gVb8wGNqNlApvzc0c=
```

Set the DNS to Cloudflare's public DNS resolver `1.1.1.1` which is fast and secure:

```ini
[Interface]
Address = 10.0.0.2/32
PrivateKey = cAqmevIKScn5l4Jg1F69KEIty6gVb8wGNqNlApvzc0c=
DNS = 1.1.1.1
```

The `[Interface]` section is for configuration the new WireGuard interface we are creating.

- `Address` is the private network IP address that we're assigning to for this network interface.
- `PrivateKey` is your client's private key.
- `DNS` is the DNS resolve to use.

## Setting server peer on client config

The next step is to set information about the server in the client configuration file under the `[Peer]` section:

```ini
[Interface]
Address = 10.0.0.2/32
PrivateKey = cAqmevIKScn5l4Jg1F69KEIty6gVb8wGNqNlApvzc0c=
DNS = 1.1.1.1

[Peer]
PublicKey = <server public key>
Endpoint = <server public ip>:51820
AllowedIPs = 0.0.0.0/0
```

Replace the `PublicKey` value to your server's public key and set the `Endpoint` to be your server's public IP address:

```ini
[Interface]
Address = 10.0.0.2/32
PrivateKey = cAqmevIKScn5l4Jg1F69KEIty6gVb8wGNqNlApvzc0c=
DNS = 1.1.1.1

[Peer]
PublicKey = H6StMJOYIjfqhDvG9v46DSX9UlQl52hOoUm7F3COxC4=
Endpoint = 54.225.123.18:51820
AllowedIPs = 0.0.0.0/0
```

Because our server is behind a NAT, we'll also need to set `PersistentKeepalive` to keep the connection alive:

```ini
[Interface]
Address = 10.0.0.2/32
PrivateKey = cAqmevIKScn5l4Jg1F69KEIty6gVb8wGNqNlApvzc0c=
DNS = 1.1.1.1

[Peer]
PublicKey = H6StMJOYIjfqhDvG9v46DSX9UlQl52hOoUm7F3COxC4=
Endpoint = 54.225.123.18:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

The `[Peer]` section is for configuration information about the peer it's connecting to, which in this case it's the client connection to the server.

- `PublicKey` is the public key of the server.
- `Endpoint` is your server's public IP and port the server's interface is listening, configured with `ListenPort` in the server's config.
- `AllowedIPs` is the IP range to allow forwarding from. Setting it to `0.0.0.0/0` will forward all traffic over the tunnel.
- `PersistentKeepalive` is the interval to periodically send keepalive packets to the server.

If you're not sure what your server's public address is, you can do an IP lookup by doing a DNS query request to `myip.opendns.com`:

```bash
root@ip-172-30-0-233:/etc/wireguard# dig +short myip.opendns.com @resolver1.opendns.com
54.225.123.18
```

If your server is an EC2 instance, you get query the metadata endpoint to get the public IP address:

```bash
root@ip-172-30-0-233:/etc/wireguard# curl http://169.254.169.254/latest/meta-data/public-ipv4
54.225.123.18
```

## Setting client peer on server config

Go back into the server and edit the config. We're going to add information about the client so that the server and client can authenticate with each other.

```bash
root@ip-172-30-0-233:/etc/wireguard/keys# vim /etc/wireguard/wg0.conf
```

Add the `[Peer]` section to the server config:

```ini
[Interface]
PrivateKey = wIObajifv6U2emcZsAGNZbbWzkyrs84EEyr+bgmlB3M=
Address = 10.0.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey = <client public key>
AllowedIPs = 10.0.0.2/32
```

Replace the `PublicKey` value with your client's public key:

```ini
[Interface]
PrivateKey = wIObajifv6U2emcZsAGNZbbWzkyrs84EEyr+bgmlB3M=
Address = 10.0.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey = vi4TCAo8TNRkpf4ZpiMsp3YHaOLrcouSDkrm4wJxezw=
AllowedIPs = 10.0.0.2/32
```

The `[Peer]` section is for configuration information about the peer it's connecting to, which in this case it's the servers connection to the client.

- `PublicKey` is the client's public key.
- `AllowedIPs` are allowed client IP addresses.

## Starting WireGuard service on server

Now that the server has the client peer information we can start the WireGuard service with `wg-quick up wg0` on the server:

```bash
root@ip-172-30-0-233:/etc/wireguard/keys# wg-quick up wg0
[#] ip link add wg0 type wireguard
[#] wg setconf wg0 /dev/fd/63
[#] ip -4 address add 10.0.0.1/24 dev wg0
[#] ip link set mtu 8921 up dev wg0
[#] iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

To start WireGuard across reboots you'll need to _enable_ the service to add it to the systemd init system by running `systemctl enable wg-quick@wg0.service`:

```bash
root@ip-172-30-0-233:/etc/wireguard/keys# systemctl enable wg-quick@wg0.service
Created symlink /etc/systemd/system/multi-user.target.wants/wg-quick@wg0.service → /lib/systemd/system/wg-quick@.service.
```

Check the status by running `systemctl status wg-quick@wg0.service` and if you see _Active: active (exited)_ then if everything is good so far:

```bash
root@ip-172-30-0-233:/etc/wireguard/keys# systemctl status wg-quick@wg0.service
● wg-quick@wg0.service - WireGuard via wg-quick(8) for wg0
   Loaded: loaded (/lib/systemd/system/wg-quick@.service; indirect; vendor preset: enabled)
   Active: active (exited) since Thu 2020-04-02 06:35:22 UTC; 1s ago
     Docs: man:wg-quick(8)
           man:wg(8)
           https://www.wireguard.com/
           https://www.wireguard.com/quickstart/
           https://git.zx2c4.com/wireguard-tools/about/src/man/wg-quick.8
           https://git.zx2c4.com/wireguard-tools/about/src/man/wg.8
  Process: 10730 ExecStart=/usr/bin/wg-quick up wg0 (code=exited, status=0/SUCCESS)
 Main PID: 10730 (code=exited, status=0/SUCCESS)

Apr 02 06:35:21 ip-172-30-0-233 systemd[1]: Starting WireGuard via wg-quick(8) for wg0...
Apr 02 06:35:22 ip-172-30-0-233 wg-quick[10730]: [#] ip link add wg0 type wireguard
Apr 02 06:35:22 ip-172-30-0-233 wg-quick[10730]: [#] wg setconf wg0 /dev/fd/63
Apr 02 06:35:22 ip-172-30-0-233 wg-quick[10730]: [#] ip -4 address add 10.0.0.1/24 dev wg0
Apr 02 06:35:22 ip-172-30-0-233 wg-quick[10730]: [#] ip link set mtu 8921 up dev wg0
Apr 02 06:35:22 ip-172-30-0-233 wg-quick[10730]: [#] iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; ipt
Apr 02 06:35:22 ip-172-30-0-233 systemd[1]: Started WireGuard via wg-quick(8) for wg0.
```

Verify that new iproute rules have been applied with `iptables -L -n`:

```bash
root@ip-172-30-0-233:/etc/wireguard# iptables -L -n
Chain INPUT (policy ACCEPT)
target     prot opt source               destination

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination
```

Running the command `ifconfig` shows the new network interface `wg0` with the internal IP address we specified `10.0.0.1`:

```bash
root@ip-172-30-0-233:/etc/wireguard# ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9001
        inet 172.30.0.233  netmask 255.255.255.0  broadcast 172.30.0.255
        inet6 fe80::1097:5bff:fe30:d57  prefixlen 64  scopeid 0x20<link>
        ether 12:97:5b:30:0d:57  txqueuelen 1000  (Ethernet)
        RX packets 1151269  bytes 524679242 (524.6 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1022229  bytes 345390292 (345.3 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 526  bytes 48787 (48.7 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 526  bytes 48787 (48.7 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

wg0: flags=209<UP,POINTOPOINT,RUNNING,NOARP>  mtu 8921
        inet 10.0.0.1  netmask 255.255.255.0  destination 10.0.0.1
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 1000  (UNSPEC)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```


## Starting WireGuard service on client

First take note of your current public IP address on the client machine:

```bash
[root@archlinux wireguard]# dig +short myip.opendns.com @resolver1.opendns.com
65.88.88.4
```

After we start the WireGuard service on the client then the public IP address will be resolved to the server's public IP address.

Start the WireGuard service using `wg-quick` just like we did previously on the server:

```bash
[root@archlinux wireguard]# wg-quick up wg0
```

Now that WireGuard is running, check the public IP address again of the client and it should now be the public IP address of the server:

```bash
[root@archlinux wireguard]# dig +short myip.opendns.com @resolver1.opendns.com
54.225.123.18
```

Success! WireGuard is correctly configured and the peers are connected.

## Connecting a mobile client to server

Download the WireGuard app for [iOS](https://apps.apple.com/us/app/wireguard/id1441195209) or [Android](https://play.google.com/store/apps/details?id=com.wireguard.android&hl=en_US) on your device.

For this example we'll create a second client (an iPhone) to connect to the WireGuard server. The same steps will need to be followed from when we setup the first client. Since we can't generate the client keys directly on the device, then we'll need to generate them on the server and securely transfer the configuration and key information into the WireGuard app.

Run `wg genkey` but specify different filenames this time to distinguish them from the server keys:

```bash
root@ip-172-30-0-233:/etc/wireguard# cd /etc/wireguard/keys
root@ip-172-30-0-233:/etc/wireguard/keys# wg genkey | tee iphone_privatekey | wg pubkey > iphone_publickey
root@ip-172-30-0-233:/etc/wireguard/keys# cat iphone_privatekey
kFnMqMSiAluwb/xWgemXhjLh/II/sb92OoYCbh7yaWw=
root@ip-172-30-0-233:/etc/wireguard/keys# cat iphone_publickey
cKIxzfp5ESpdM34vT2Qk/S7yvprOff6Le4YnyOTI4B8=
```

Open up the server config `/etc/wireguard/wg0.conf` in your favorite editor:

```bash
root@ip-172-30-0-233:/etc/wireguard/keys# vim /etc/wireguard/wg0.conf
```

Add the second peer section and include the client's public key and IP address:

```ini
[Interface]
PrivateKey = wIObajifv6U2emcZsAGNZbbWzkyrs84EEyr+bgmlB3M=
Address = 10.0.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PrivateKey = wIObajifv6U2emcZsAGNZbbWzkyrs84EEyr+bgmlB3M=
AllowedIPs = 10.0.0.2/32

[Peer]
PublicKey = cKIxzfp5ESpdM34vT2Qk/S7yvprOff6Le4YnyOTI4B8=
AllowedIPs = 10.0.0.3/32
```

Create a new configuration file for the iPhone client on the server. We'll name it `wgo-iphone.conf`:

```bash
root@ip-172-30-0-233:/etc/wireguard/keys# vim /etc/wireguard/wg0-iphone.conf
```

Paste client configuration but remember to use a different private IP that differs from the first client.

```ini
[Interface]
PrivateKey = kFnMqMSiAluwb/xWgemXhjLh/II/sb92OoYCbh7yaWw=
Address = 10.0.0.3/32
DNS = 1.1.1.1

[Peer]
PublicKey = H6StMJOYIjfqhDvG9v46DSX9UlQl52hOoUm7F3COxC4=
Endpoint = 54.225.123.18:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

Install [qrencode](https://github.com/fukuchi/libqrencode) on the server to generate a QRCode from the configuration file.

You'll be scanning this qrcode in the WireGuard app to download the configuration. This is a safer way to transport credentials since the keys and configuration files don't need to be zipped and moved.

Generate the text based qrcode image in your terminal with `qrencode -t ansiutf8 < wg0-iphone.conf`

```bash
root@ip-172-30-0-233:/etc/wireguard# qrencode -t ansiutf8 < wg0-iphone.conf
<qrcode image>
```

In the WireGuard app go to: Add a tunnel  → Create from QRCode

Scan the qrcode code generated in the terminal and make sure to _Allow_ the VPN configuration in the settings popup.

Enable the VPN by toggling on the switch.

Visit [ipchicken.com](https://ipchicken.com/) in the browser to verify the public iP address has changed.

## Generating vanity addresses

It's easy to lose track of which keys belong to which devices since they all look like random strings. To make it easier to associate keys to devices you can use this [vanity address generator](https://github.com/warner/wireguard-vanity-address) to generate public keys that contain a custom array of characters.

For example, we'll generate a key pair where the public key starts with "iPho" to denote that it's a key pair to be used on the iPhone client.

First install the vanity address generator with [cargo](https://crates.io/):

```bash
$ cargo install wireguard-vanity-address
```

Now just specify the list of characters that you want in the public key base64 output:

```bash
$ wireguard-vanity-address ipho
searching for 'ipho' in pubkey[0..10], one of every 149796 keys should match
one trial takes 83.6 us, CPU cores available: 8
est yield: 1.6 seconds per key, 638.83e-3 keys/s
hit Ctrl-C to stop
private YPpudjAoVCnaPUJdcEVhj5Ttedq7WP1ozL+ZdtuTC1g=  public cHklbipHoMS9CA8XlRdKMBOOIfQC28Ut8SVyYsqmox0=
private kD6FSIZehv1DKJ28MKJQcmSDdd69U3s4s11ymtP1Ekc=  public iPHoaaQye7+OJNq/TfOvXjMr99pq9ADDDlGynRQ6KQ8=
private aEJ33LXCeipouhiAoQjfMjtwrHPfZDvKLguE8XlawnY=  public iPHoEoUy4WgkUXr4e47IkA06IZqVI/AqHNS2RZlGhHM=
^C
```

It'll keep generating until you manually stop it when you see a key pair that you like.

## TLDR;

Here's a summary of the server and client configuration and commands used in this post:

### Server

Server commands:

```bash
sudo -s
apt-get install wireguard
mkdir -p /etc/wireguard/keys
cd /etc/wireguard/keys
umask 077
wg genkey | tee privatekey | wg pubkey > publickey
vim /etc/wireguard/wg0.conf # see server config below
vim /etc/sysctl.conf # uncomment line "net.ipv4.ip_forward=1"
sysctl -p
wg-quick up wg0
systemctl enable wg-quick@wg0.service
```

Server config `/etc/wireguard/wg0.conf`:

```ini
[Interface]
PrivateKey = <server private key>
Address = 10.0.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey = <client public key>
AllowedIPs = 10.0.0.2/32
```

### Client

Client commands:

```bash
sudo -s
apt-get install wireguard
mkdir -p /etc/wireguard/keys
cd /etc/wireguard/keys
umask 077
wg genkey | tee privatekey | wg pubkey > publickey
vim /etc/wireguard/wg0.conf # see client config below
wg-quick up wg0
```

Client config `/etc/wireguard/wg0.conf`:

```ini
[Interface]
PrivateKey = <client private key>
Address = 10.0.0.2/32
DNS = 1.1.1.1

[Peer]
PublicKey = <server public key>
Endpoint = <server public ip>:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

## Resources
- [WireGuard site](https://www.wireguard.com/)
- [WireGuard vanity address generator](https://github.com/warner/wireguard-vanity-address)
- [WireGuard for iOS](https://apps.apple.com/us/app/wireguard/id1441195209)
- [WireGuard for Android](https://play.google.com/store/apps/details?id=com.wireguard.android&hl=en_US)
- [libqrencode](https://github.com/fukuchi/libqrencode)
