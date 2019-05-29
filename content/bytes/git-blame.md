---
layout: byte
title: How to blame in git
type: bytes
tag: [git]
description: How to blame in git from command line.
date: 2016-01-20T00:00:00-00:00
draft: false
---
Git blame from the command line.

Command format:

```bash
git blame -L<LINE_NUMBER>,+<NUMBER_OF_LINES> [<COMMIT>] -- <FILE>
```

Git blame a file:

```bash
git blame -L100,+10 -- file.txt
```

Git blame on a specific commit:

```bash
git blame -L100,+10 fe25b6d^ -- file.txt
```
