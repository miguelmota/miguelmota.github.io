---
layout: blog-post
title: How Unix programmers at restaurants search menus for their favorite plate
type: blog
tag: [unix, linux, command-line, comedy]
description: How Unix programmers at restaurants search menus for their favorite plate.
date: 2018-12-13T00:00:00-00:00
draft: false
---

A Unix programmer heads over to the local diner to get something to eat for lunch. He, or Bob as he prefers, knows better than to manually scan the entire menu with his eyeballs because it's inefficient. Bob knows that there's a better way to automate the process in searching for what he wants to eat.

Last time he was here he had a pretty good pasta-and-shrimp plate for under 10 bucks.

Bob wonder's if this same dish is still available. He pops open his laptop running Linux and scrapes the restaurant website menu table into a plain text file.

The `menu.txt` file:

```text
the menu

steak burrito $11.95
pasta and shrimp $9.75
caesar salad $6.50
```

Now that Bob has the menu, he does a `grep` search for the pasta-and-shrimp plate:

```bash
$ cat menu.txt | grep shrimp

pasta and shrimp $9.75
```

So far so good. He filters for the price column by using `awk` and the `NF` variable (which is the number of columns fields available) in order to get the last column containing the prices:

```bash
$ cat menu.txt | grep shrimp | awk '{print $NF}'

$9.75
```

The starvation is kicking in and he's typing furiously by now. Bob proceeds with `sed` to turn the dollar amount into an integer by replacing everything except for what's inbetween the dollar symbol and decimal period. He'll use a capturing group and replace the contents with the first capture group `\1`:

```bash
$ cat menu.txt | grep shrimp | awk '{print $NF}' | sed -E 's/\$([0-9]+)\..*/\1/g'

9
```

Finally, using the handy `test` command and the less-than flag `-lt`, Bob can check whether the price is less than `10` with the help of `xargs` to pipe the value as the first argument to `test`:

```bash
$ cat menu.txt | grep shrimp | awk '{print $NF}' | sed -E 's/\$([0-9]+)\..*/\1/g' | xargs -I {} test {} -lt 10

```

But wait there's no output! Actually, `test` returns an exit status code of `0` if the condition passes or `1` if no match.

Bob simply echo's *Available* if the previous command was successful by using `&&`, otherwise he'll echo *:(* by using the double pipe `||` if it was not successful:

```bash
$ cat menu.txt | grep shrimp | awk '{print $NF}' | sed -E 's/\$([0-9]+)\..*/\1/g' | xargs -I {} test {} -lt 10 && echo 'Available!' || echo ':('

Available!
```

Voila! there it is, the desired pasta-and-shrimp plate is still the under ten bucks. Bob is happy and proceeds to order his favorite dish.

(hope you liked this intro post to unix pipes and bash commands!)

## Update (i)

Follow the comments on [Reddit](https://www.reddit.com/r/programming/comments/a5sg9k/how_unix_programmers_at_restaurants_search_menus/).

## Update (ii)

Yes you can do it in one line such as:

```bash
awk -F '$' '/shrimp/ {printf "%s- %.2f\n", $1, $NF}' < menu.txt
```

but that isn't the point of this intro to pipes post 🙂
