---
layout: blog-post
title: Intro to Redis
type: blog
tags: [Redis, CLI]
description: Simple explanations of Redis data structures.
date: 2014-01-23T00:00:00-00:00
draft: false
---
[**Redis**](http://redis.io/)> is an in-memory, key-value store that is fast. *Really fast*. Redis can hold hundreds of millions of keys in memory and handle tens of thousands of requests per second without breaking a sweat. It's useful for caching data, maintaining sessions, keeping counters, queues, publish/subscribe real time notifications, and so on. There are many use cases for Redis due to it's simple dictionary model that maps keys to values, but what one should be aware of is that it's focus is *not* long-term data persistance. The whole Redis database is loaded into memory so there is a chance of data loss due to the fact that Redis first stores new entries in memory and then writes it to disk in the background after a certain period of time or amount of new keys have been accumulated. For example, if there were to be a power failure you could potentially lose a minute or two worth of data, which can or may not be fatal depending on your application. Of course, you can configure the threshold to something more comfortable which I will go over later.

The majority of this post will be going over some of the data structures that Redis provides, such as **keys**, **hashes**, **lists**, and **sets**. Redis isn't meant to be an *all-in-one* database replacement. It has it's niche, it's simple and it can do certain *really* well. If you haven't already, I strongly suggest you read the [15 minute intro to Redis data types](http://redis.io/topics/data-types-intro)> on the Redis site. I'll also talk about sorting, multi-commands, and monitoring.

I would like to give credit to [The Little Redis Book](http://openmymind.net/2012/1/23/The-Little-Redis-Book/)> by [Karl Seguin](http://openmymind.net/)> for helping me gain a lot of the information on Redis and some of the examples I show below. It's definitely a good read and great resource.

## Installation

[The Redis quickstart guide](http://redis.io/topics/quickstart)> is good place to start. Installing Redis is straight forward. [Download](http://redis.io/download) the tarball, extract, and run `make`. If you're on a Mac you can simply do `brew install redis` with [Homebrew](http://brew.sh/).

After installation, start a redis instance with

```bash
redis-server {path to redis.conf}
```

and then fire up the command line client

```bash
redis-cli -p {port}
```

For the rest of the post we'll be working from the command-line interface.

## Keys

Keys can hold a single value, wether it be a string or numeric value. We create a key with the `set` command.

```bash
> set foo bar
OK
```

Retreive a key with the `get` command

```bash
> get foo
"bar"
```

Delete a key with `del`

```bash
> del foo
(integer) 1
> get foo
(nil)
```

Store a JSON string

```bash
> set users:foo "{name: foo, age: 21, hobbies: [baz, qux]}"
OK
> get users:foo
"{name: foo, age: 21, hobbies: [baz, qux]}"
```

Notice the colon in the key. The colon is just part of the key name, it doesn't have any special meaning to Redis. It's purpose is to visually group a set of related keys together.

If the value is a number you can incremented with the `incr</code > or `incrby` command. If the key doesn't exist it will simply create it.

```bash
> incr stats:views
(integer) 1
> incr stats:views
(integer) 2
> incrby stats:views 5
(integer) 7
```

With the `keys` command we can get a list of keys that match a wildcard.

```bash
> set foo:1 bar
OK
> set foobar:2 baz
OK
> set foooo:3 qux
OK
> keys foo*
1) "foo:1"
2) "foobar:2"
3) "foooo:3"
> keys foo?ar*
1) "foobar:2"
> keys foo*:[13]
1) "foo:1"
2) "foooo:3"
```

## Hashes

You can think of hashes a being a key-value pair, except that the value can be *multiple* key-value pairs. For example we can have a users hash that has multiple fields about the user

```bash
> hmset users:foo name "Foo" email foo@bar.com age 21
OK
> hmget users:foo email
1) "foo@bar.com"
> hmget users:foo email name
1) "foo@bar.com"
2) "Foo"
> hgetall users:foo
1) "email"
2) "foo@bar.com"
3) "age"
4) "21"
5) "name"
6) "Foo"
> hkeys users:foo
1) "email"
2) "age"
3) "name"
> hdel users:foo age
(integer) 1
> hset users:foo hobies [bar,qux]
(integer) 1
> hgetall users:foo
1) "email"
2) "foo@bar.com"
3) "name"
4) "Foo"
5) "hobies"
6) "[bar,qux]"
```

Quick overview of hash commands


`hmset`: set a hash<br>
`hmget`: get a value from key<br>
`hmgetall`: get all keys and values<br>
`hkeys`: get all keys<br>
`hdel`: delete a key<br>
`hset`: set a key and value<br>
`hmset`: set multiple key and value pairs<br>


Here's an example of way to do quick lookups for a user

```bash
> set users:1000 "{id: 1000, email: foo@bar.com}"
OK
> hset users:lookup:email foo@bar.com 1000
(integer) 1
> hget users:lookup:email foo@bar.com
"1000"
> get users:1000
"{id: 1000, email: foo@bar.com}"
```

## Lists

A list is a list of strings. Push items into a list with `lpush`

```bash
> lpush newusers foo
(integer) 1
> lpush newusers bar
(integer) 2
```

Use `lrange` to return a range

```bash
> lrange newusers 0 -1
1) "bar"
2) "foo"
```

A list can be sorted using the `sort` command

```bash
> rpush users:foo:guesses 5 9 10 2 4 10 19 2
(integer) 8
> sort users:foo:guesses
1) "2"
2) "2"
3) "4"
4) "5"
5) "9"
6) "10"
7) "10"
8) "19"
```

Keep the list trimmed with `ltrim`. For example, if we wanted to only keep a list of the latest 50 new users

```bash
> ltrim newusers 0 49
OK
```

## Sets

Sets are undorered collections of strings. A use case for sets would be keeping a collection of a user's friends. To add to a set use `sadd`

```bash
> sadd friends:foo bar baz qux
(integer) 3
> sadd friends:dexter bar qux deedee
(integer) 3
```

We can check if a member belongs to a set with `sismember`

```bash
> sismember friends:foo bob
(integer) 0
> sismember friends:dexter deedee
(integer) 1
```

With the `sinter` command we can return a list of members that *intersect* between sets. For example, if we wanted a list containing shared friends

```bash
> sinter friends:foo friends:dexter
1) "bar"
2) "qux"
```

We can also store the result into a new set with `sinterstore`

```bash
> sinterstore friends:foo_dexter friends:foo friends:dexter
(integer) 2
```

We can get members of a set with `smembers`

```bash
> smembers friends:foo_dexter
1) "bar"
2) "qux"
```

To store sorted sets use `zadd`. Sorted sets consists of key/member pairs, where the key is used for sorting. For example, having a sorted set containing sets of quiz scores

```bash
> zadd students:foo 70 quiz1 95 quiz2 60 quiz3 99 quiz4 20 quiz5
(integer) 5
```

We then get a count of scores between a range with `zcount`

```bash
> zcount students:foo 90 100
(integer) 2
```

To determine the rank of a member within the set we can use `zrank` (low to high) or `zrevrank` (high to low)

```bash
> zrank students:foo quiz3
(integer) 4
> zrevrank students:foo quiz3
(integer) 0
> zrevrank students:foo quiz1
(integer) 2
> zrevrank students:foo quiz2
(integer) 1
```

Remove a set with `zrem`

```bash
> zrem students:foo quiz5
(integer) 1
```

Sort by name descending alphabetically

```bash
> sadd friends:foo bar baz qux dexter deedee
(integer) 5
> sort friends:foo limit 0 3 desc alpha
1) "qux"
2) "dexter"
3) "deedee"
```

## Expiration

Keys can be set to expire (delete) after a number of seconds. We do this with the `expire` or `expireat` commands. `ttl` returns the Time To Live and `persist` removes the expiration.

```bash
> incr views
(integer) 1
> expire views 30
(integer) 1
> ttl views
(integer) 30
> expireat views 1420005600 # expire on 12:00a.m. December 31st, 2014
(integer) 0
> ttl views
(integer) 28529193
> persist views
(integer) -1
```

## Flush

Select database to use with `select` command

```bash
> select 1
OK
```

Clear current database with `flushdb`

```bash
> flushdb
OK
```

Clear all databases with `flushall`

```bash
> flushall
OK
```

## Subscribe / Publish

With redis you can have subscribers listen to a channel. Publishing a message will be received by all subscribers in the channel. You can subscribe to multiple channels as well.

```bash
> subscribe greeetings
```

```bash
> publish greetings "Hello, World"
```

Anyone subscried to the *greetings* channel will receive the "Hello, World" message.

## Multi

The `multi` command let's us queue commands (transaction block) and then execute with `exec` or discard the queue with `discard`

```bash
> multi
OK
> incrby counter 10
QUEUED
> incrby counter -10
QUEUED
> exec
1) (integer) 10
2) (integer) 0
```

Queued commands will always execute in the order they were set, so a use case for using the multi command would be when a command is dependent on the result of the previous command.

## Monitor

Watch incomming redis commands with `monitor`

```bash
> monitor
OK
```

Get recent logs

```bash
> config set slowlog-log-slower-than 0
OK
> slowlog get 2
```

Get config related to logging

```bash
> config get *log*
```

<!--
## More examples

Sort by severity example

```bash
> sadd watch:foo 12339 1382 338 9338
(integer) 4
> set severity:12339 3
OK
> set severity:1382 2
OK
> set severity:338 5
OK
> set severity:9338 4
sort watch:leto by severity:* desc
1) "338"
2) "9338"
3) "12339"
4) "1382"
```

Another example

```bash
hset bug:12339 severity 3
hset bug:12339 priority 1
hset bug:12339 details ”{id: 12339, ....}”
hset bug:1382 severity 2
hset bug:1382 priority 2
hset bug:1382 details ”{id: 1382, ....}”
```

```bash
sort watch:leto by bug:*->priority get bug:*->details
# store result
sort watch:leto by bug:*->priority get bug:*->details store watch_by_priority:leto
```

```bash
# don't use keys because it's slow
keys bug:1233:* # don't do this
# instead us hashes
hset bugs:1233 1 ”{id:1, account: 1233, subject: ’...’}”
hset bugs:1233 2 ”{id:2, account: 1233, subject: ’...’}”
```

## Scan

```bash
scan 0 match bugs:* count 2
> 1) ”3”
> 2) 1) ”bugs:125”
scan 3 match bugs:* count 2 # scan 3 because of previous next cursor
> 1) ”0” # 0 means end
> 2) 1) ”bugs:124”
```
-->

## Conclusion

Redis is an incredibly fast data store that does a few things *very* well. Definitely worth checking out and incorporating it in your next project for an easy caching solution.

Resources


- [The Little Redis Book](http://openmymind.net/2012/1/23/The-Little-Redis-Book/)> by [Karl Seguin](http://openmymind.net/)>
- [Try Redis](http://try.redis.io/)>
