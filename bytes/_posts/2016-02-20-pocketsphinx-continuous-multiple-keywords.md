---
layout: byte
title: How to use multiple keywords in Pocketsphinx continuous mode
category: bytes
tags: [Pocketsphinx, speech recognition]
description: Use multiple keywords in Pocketsphinx continuous mode
---
Create a dictionary file containing all the words that will be used. You can use the [CMU Sphinx Pronouncing Dictionary](http://svn.code.sf.net/p/cmusphinx/code/trunk/cmudict/sphinxdict/) to get the phonemes for English dictionary words.

`keyphrase.dic`:

```text
CAT K AE T
DOG D AO G
FISH F IH SH
```

Create a keyphrase list file with a threshold for each phrase. Defaults to `1`. Lower thresholds increase the number of matches but might also increase the number of false alarms.

`keyphrase.list`:

```text
CAT /1e-15/
DOG /1e-15/
FISH /1e-12/
```

Run `pocketsphinx_continuous` command with microphone as input:

```bash
pocketsphinx_continuous -inmic yes -kws keyphrase.list -dict keyphrase.dic
```

Or you can you a specified audio file:

```bash
pocketsphinx_continuous -infile dog.wav -kws keyphrase.list -dict keyphrase.dict
```

Use [sox](http://sox.sourceforge.net/) to record audio files from the command line:

```bash
sox -d -c 1 -r 16000 -e signed -b 16 dog.wav
```
