---
layout: byte
title: How to open a Terminal tab programatically
type: bytes
tag: [Node.js, Terminal, OS X]
description: Open a Terminal tab programatically in Node.js.
date: 2014-10-20T00:00:00-00:00
draft: false
---
Open a Terminal tab programatically in Node.js.

`index.js`:

```javascript
var exec = require('child_process').exec;
var through = require('through');
var os = require('os');
var child;

var args = process.argv;

function openTab(cmd, cb) {
  if (os.platform() !== 'darwin') {
    throw new Error('No support for this operating system but feel free to fork the repo and add it :)');
  }

  var open = ['osascript -e \'tell application "Terminal" to activate\' ',
           '-e \'tell application "System Events" to tell process "Terminal" to keystroke "t"',
           'using command down\' ',
           '-e \'tell application "Terminal" to do script',
           '"', cmd, '"',
           'in selected tab of the front window\''].join('');

  child = exec(open, function(error, stdout, stderr) {
    if (error) {

    }

    if (cb && typeof cb === 'function') {
      cb.call(null, arguments);
    }

  });

  child.on('exit', function(code) {

  });
}

process.stdin.setEncoding('utf8');

process.stdin.pipe(through(function(buf) {
  openTab(buf.toString());
  process.exit(0);
}, function() {
}));

if (args.length > 2) {
  openTab(args.slice(2).join(' '));
  process.exit(0);
}

module.exports = {
  open: openTab
};
```

Usage:

```javascript
var terminalTab = require('./index');

terminalTab.open('echo hello; sleep 2 && exit');
```

Passing args in command line:

```bash
node index.js 'echo hello'
```

Piping args in command line:

```bash
echo 'echo hello' | node index.js
```

On github at [miguelmota/terminal-tab](https://github.com/miguelmota/terminal-tab)
