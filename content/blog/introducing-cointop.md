---
layout: blog-post
title: Introducing cointop – An interactive terminal app for tracking cryptocurrencies
type: blog
tag: [terminal, tui, command-line, cryptocurrencies]
description: Cointop is an interactive terminal based UI application for tracking cryptocurrencies in real-time.
date: 2018-05-15T00:00:00-00:00
draft: false
---
**[cointop](https://github.com/miguelmota/cointop)** is a fast and lightweight interactive terminal based UI application for tracking and monitoring cryptocurrency coin stats in real-time.

The interface is inspired by [`htop`](https://en.wikipedia.org/wiki/Htop) and shortcut keys are inspired by [`vim`](https://en.wikipedia.org/wiki/Vim_(text_editor)).

<figure>
  <a href="cointop-in-action.gif" target="_blank"><img src="cointop-in-action.gif" alt=""></a>
	<figcaption>
  Cointop in action
	</figcaption>
</figure>

## Features

- Quick sort shortcuts
- Custom key bindings configuration
- Vim inspired shortcut keys
- Fast pagination
- Charts for coins and global market graphs
- Quick chart date range change
- Fuzzy searching for finding coins
- Currency conversion
- Save and view favorite coins
- Portfolio tracking of holdings
- 256-color support
- Custom colorschemes
- Help menu
- Offline cache
- Supports multiple coin stat APIs
- Works on macOS, Linux, and Windows
- It's very lightweight; can be left running indefinitely

## Try it out

```bash
brew install cointop
```

For other platforms, check out the [releases](https://github.com/miguelmota/cointop/releases) page or read the installation instructions in the [README](https://github.com/miguelmota/cointop).

The Go build size is ~8MB but packed with [UPX](https://upx.github.io/) it's only a ~3MB executable binary. It only uses ~15MB of memory so you can run it on a Raspberry Pi Zero if you wanted to (one reason why cointop was built using Go instead of Node.js or Python).

cointop is [open-source](https://github.com/miguelmota/cointop) and released under the [Apache 2.0 license](https://github.com/miguelmota/cointop/#license).
