---
layout: blog-post
title: Migrating from Jekyll to Hugo
type: blog
tags: [Jekyll, Hugo, Blog, Migration]
description: How to migrate your jekyll blog to hugo.
date: 2019-05-25T00:00:00-00:00
draft: true
---


```go
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"os"
	"regexp"
	"strings"
)

func main() {
	var src, dst string
	var dry bool
	flag.StringVar(&src, "src", "", "source")
	flag.StringVar(&dst, "dst", "", "destination")
	flag.BoolVar(&dry, "dry", false, "dry run")
	flag.Parse()

	if src == "" {
		src = "."
	}
	if dst == "" {
		dst = "."
	}
	if !strings.HasSuffix(src, "/") {
		src = src + "/"
	}
	if !strings.HasSuffix(dst, "/") {
		dst = dst + "/"
	}

	if _, err := os.Stat(src); os.IsNotExist(err) {
		panic("source directory does not exist")
	}

	if _, err := os.Stat(dst); os.IsNotExist(err) {
		if err := os.Mkdir(dst, os.ModePerm); err != nil {
			panic(err)
		}
	}

	files, err := ioutil.ReadDir(src)
	if err != nil {
		panic(err)
	}

	for _, file := range files {
		filename := file.Name()
		in := fmt.Sprintf("%s%s", src, filename)
		data, err := ioutil.ReadFile(in)
		if err != nil {
			panic(err)
		}

		re := regexp.MustCompile(`(\d{4})-(\d{2})-(\d{2}).*`)
		date := re.ReplaceAllString(filename, "$1-$2-$3")
		date = fmt.Sprintf("%sT00:00:00-00:00", date)

		re = regexp.MustCompile(`(\d{4}-\d{2}-\d{2})-(.*)`)
		newFilename := re.ReplaceAllString(filename, "$2")

		re = regexp.MustCompile(`---\n([\s\S]*)---\n([\s\S]*)`)
		matches := re.FindSubmatch(data)
		header := string(matches[1])
		body := string(matches[2])
		dateline := fmt.Sprintf("date: %s\n", date)
		draftline := "draft: false\n"
		header = fmt.Sprintf("%s%s%s", header, dateline, draftline)

		content := fmt.Sprintf("---\n%s---\n%s", header, body)
		content = strings.ReplaceAll(content, "{{ page.url }}", "{{ .Site.BaseURL }}")

		out := dst + newFilename
		fmt.Printf("%s -> %s\n", in, out)

		if !dry {
			if err := ioutil.WriteFile(out, []byte(content), 0644); err != nil {
				panic(err)
			}
		}
	}
}
```

```bash
$ go run main.go -src jekyll-blog/blog/_posts/ -dst hugo-blog/content/blog
jekyll-blog/blog/_posts/2011-03-30-hello-world.md -> hugo-blog/content/blog/hello-world.md
jekyll-blog/blog/_posts/2014-03-14-deployment-with-git.md -> hugo-blog/content/blog/deployment-with-git.md
...


```markdown
---
title: Hello World
category: blog
tags: [hello world]
----

Hello world
```


```markdown
---
title: Hello World
type: blog
tags: [hello world]
date: 2011-03-30T00:00:00-00:00
draft: false
----

Hello world
```

  {{ $css := resources.Get "css/style.css" }}
  {{ $style := $css | resources.Minify }}
  <link rel="stylesheet" href="{{ $style.Permalink }}">
