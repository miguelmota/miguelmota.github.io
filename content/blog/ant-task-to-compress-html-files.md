---
layout: blog-post
title: Ant task to compress HTML files
type: blog
tags: [HTML, Ant]
description: Tutorial on how to create an ant task to compress html files.
date: 2011-10-14T00:00:00-00:00
draft: false
---
I will show you how to compress your HTML files using the Java library [HtmlCompressor](http://code.google.com/p/htmlcompressor/).
So let's say your html code looks something like this:

```html
<!doctype html>
<html>
<head>
  <title>htmlcompressor</title>
</head>
<body>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida suscipit lectus.
  <!-- comment -->
</body>
</html>
```

After we compress it, it'll look like this:

```html
<!doctype html> <html> <head> <title>htmlcompressor</title> </head> <body> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida suscipit lectus. </body> </html>
```

Compressing your html files reduces it's size by ~20% by removing unnecessary white space, comments and stuff that it doesn't need in order to keep the structure of the content. The result is a smaller file size which equals to faster page load.

Ok, so first make sure you have [Google Project page](http://code.google.com/p/htmlcompressor/).
Create a directory in the root of your project called `lib` and drop the `.jar` in it. Then again in the root directory, create the xml file called `build.xml`. Include the following [gist](https://gist.github.com/miguelmota/4750373):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project default="compress-html">

  <target name="compress-html">
    <apply executable="java">
      <fileset dir="src" includes="**/*.html"/>
      <arg value="-jar"/>
      <arg path="lib/htmlcompressor-1.5.3.jar"/>
      <arg line="-t html"/>
      <srcfile/>
      <arg value="-o"/>
      <mapper type="glob" from="*" to="compressed/*"/>
      <targetfile/>
    </apply>
  </target>

</project>
```

What we did is created a project which will execute the `compress-html` target by default. In the target we are telling it to include all the `html` files in the root directory
and then output the compressed files in a new directory called `compressed`. the `-t` flag means `type` and `-o` means `output`. By default the filenames of the source files will be added to
the end fo the command, so we use `srcfile` to place it where we want it. `targetfile` is used to add the target filenames to the command or else they'll be left out. The `mapper` type `glob` means that it will substitue the `*` in the `to` pattern with the text that matches the `*` in the `from` pattern.

Now run the `build.xml` as an `Ant Build` and everything should go as planned. I hope this helped!
