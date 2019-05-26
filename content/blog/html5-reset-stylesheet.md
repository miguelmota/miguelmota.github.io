---
layout: blog-post
title: HTML5 Reset Stylesheet
type: blog
tags: [HTML5, CSS]
description: A useful HTML5 reset stylesheet.
date: 2011-08-09T00:00:00-00:00
draft: false
---
I couldn't find an HTML5 reset stylesheet that suited my needs so I decided to modify [HTML5 Doctors'](http://html5doctor.com/html-5-reset-stylesheet/) CSS reset a bit.

Here is the [gist](https://gist.github.com/miguelmota/5039687):

```css
html, body, div, span, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
abbr, address, cite, code,
del, dfn, em, img, ins, kbd, q, samp,
small, strong, sub, sup, var,
b, i,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, figcaption, figure,
footer, header, hgroup, menu, nav, section, summary,
time, mark, audio, video {
    background: transparent;
    border: 0;
    font-size: 100%;
    margin: 0;
    outline: 0;
    padding: 0;
    vertical-align: baseline;
}
body {
    line-height: 1;
}
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
    display: block;
}
ol, ul {
    list-style: none;
}
h1, h2, h3, h4, h5, h6 {
    font-size: 100%;
    font-weight: normal;
}
blockquote, q {
    quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
    content: '';
    content: none;
}
:focus {
    outline: 0;
}
a {
    text-decoration: none;
}
ins {
    text-decoration: none;
}
mark {
    font-style: italic;
    font-weight: bold;
}
del {
    text-decoration: line-through;
}
abbr[title], dfn[title] {
    border-bottom: 1px dotted;
    cursor: help;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}
caption, th, td {
    font-weight: normal;
    text-align: left;
}
hr {
    border: 0;
    border-top: 1px solid #ccc;
    display: block;
    height: 1px;
    margin: 1em 0;
    padding: 0;
}
input, select {
    vertical-align: middle;
}
```

What CSS reset do you use?