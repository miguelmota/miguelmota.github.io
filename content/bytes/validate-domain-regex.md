---
layout: byte
title: Regex to validate domain name
type: bytes
tags: [JavaScript, regex]
description: How to validate a domain name using a regular expression.
date: 2015-01-04T00:00:00-00:00
draft: false
---
Using a regular expression to check if it is a valid domain.

```javascript
function isValidDomain(v) {
  if (!v) return false;
  var re = /^(?!:\/\/)([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$/gi;
  return re.test(v);
}
```

Usage

```javascript
isValidDomain('example.com') // true
isValidDomain('foo.example.com') // true
isValidDomain('bar.foo.example.com') // true
isValidDomain('exa-mple.co.uk') // true
isValidDomain('exa_mple.com') // false
isValidDomain('example') // false
isValidDomain('ex*mple.com') // false
isValidDomain(3434) // false
```

On github at [miguelmota/is-valid-domain](https://github.com/miguelmota/is-valid-domain)
