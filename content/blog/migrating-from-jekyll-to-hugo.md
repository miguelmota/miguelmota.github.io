---
layout: blog-post
title: Migrating from Jekyll to Hugo
type: blog
tags: [Jekyll, Hugo, blog, migration]
description: How to migrate your jekyll blog to hugo.
date: 2019-05-25T00:00:00-00:00
draft: false
---

This post will go over how I migrated my [Jekyll](https://jekyllrb.com/) blog over to [Hugo](https://gohugo.io/). Some reason for moving to Hugo are:

- Faster compile time (it's the fastest static site generator)
- Awesome documentation
- Easier templating language
- No dealing with ruby versions and gems
- Write your own plugins in Go

### Getting started

First I created my hugo site:

```bash
hugo new site mysite
```

Then installed the [blank](https://themes.gohugo.io/blank/) theme:

```bash
cd themes/
git clone https://github.com/vimux/blank
```

Set the theme in `config.toml`:

```toml
theme = "blank"
```

### Migrating posts

The next part was copying over the jekyll posts to hugo. The only things I had to do was:

- remove the date from the jekyll post filename and add it to the hugo post header yaml. Example: `2011-03-30-hello-world.md` to `hello-world.md` and add `date: 2011-03-30T00:00:00-00:00` in the yaml.
- rename certain post header properties such as `category` to `type`.

To automate things I created a simple CLI script in Go:

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
	flag.StringVar(&src, "src", "", "source")
	flag.StringVar(&dst, "dst", "", "destination")
	flag.Parse()

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

		if err := ioutil.WriteFile(out, []byte(content), 0644); err != nil {
			panic(err)
		}
	}
}
```

The full code is on [github](https://github.com/miguelmota/go-jekyll-to-hugo).

Run the migration script and pass in the jekyll posts direcotry as the source and set the Hugo content directory as the destination:

```bash
$ go run main.go -src jekyll-blog/blog/_posts/ -dst hugo-blog/content/blog
jekyll-blog/blog/_posts/2011-03-30-hello-world.md -> hugo-blog/content/blog/hello-world.md
jekyll-blog/blog/_posts/2014-03-14-deployment-with-git.md -> hugo-blog/content/blog/deployment-with-git.md
...
```


It'll copy the posts and change the header structure from:


```markdown
---
title: Hello World
category: blog
tags: [hello world]
----

Hello world
```

to this structure:

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

You can run the hugo server to make sure things are working:

```bash
$ hugo serve

                   | EN
+------------------+----+
  Pages            | 46
  Paginator pages  |  0
  Non-page files   |  0
  Static files     | 79
  Processed images |  0
  Aliases          |  0
  Sitemaps         |  1
  Cleaned          |  0

Total in 60 ms
Watching for changes in /tmp/hugo-blog/{content,data,layouts,static,themes}
Watching for config changes in /tmp/hugo-blog/config.toml
Serving pages from memory
Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
```

What you'll also have to do is copy over you static assets into the hugo `static/` directory.

### Pages

Now to set up static pages, like an _about_ page, create a new folder in `content` named like the page:

```bash
mkdir content/about/
```

and add the file `content/about/_index.md` with the content:

```markdown
---
title: About
---
About me
```

You also have to add a new file under the layouts dir, `themes/blank/layouts/about/about.html`, with the template for the page:

```html
{{ partial "header.html" . }}
  <main>
    <article>
      <header>
        <h1>{{ .Title }}</h1>
      </header>
      <section>
        {{ .Content }}
      </section>
    </article>
  </main>
{{ partial "footer.html" . }}
```

Visiting [http://localhost:1313/about](http://localhost:1313/about) should work now

### Tags

Getting support for tags requires additional setup. Create a `tag.html` file, `themes/ananke/layouts/taxonomy/tag.html`, with the contents:

```html
<h1>Posts tagged "{{ .Title }}"</h1>
<ul>
  {{ range .Data.Pages }}
    <li>
      <a href="{{.RelPermalink}}">{{ .Title }}</a>
    </li>
  {{ end }}
</ul>
```

This page makes it able so that you can visit [http://localhost:1313/tags/hello-world](http://localhost:1313/tags/hello-world) to view all the posts with the tag _hello world_.

To display tags underneath each post, create the `tags.html` partial, `themes/blank/layouts/partials/tags.html`, with content:

```html
<ul>
  {{ range .Params.tags }}
    <li><a href="{{ "/tags/" | relLangURL }}{{ . | urlize }}">{{ . }}</a> </li>
  {{ end }}
</ul>
```

Now add the add the partial to `themes/blank/layouts/_default/single.html`:

```html
{{ partial "header.html" . }}
  <main>
    <article>
      <header>
        <h1>{{ .Title }}</h1>
        <time>{{ .Date.Format "02 Jan 2006" }}</time>
      </header>
      <section>
        {{ .Content }}
      </section>
      {{ partial "tags.html" . }}
    </article>
  </main>
{{ partial "footer.html" . }}
```

### Compression

You can further optimize your hugo site by compressing assets. Have your CSS in `themes/blank/assets/css/style.css` and  css call the minify helper function in your `header.html` partial to compress the CSS. Then set the `href` to the `.Permalink` variable:


```html
{{ $css := resources.Get "css/style.css" }}
{{ $style := $css | resources.Minify }}
<link rel="stylesheet" href="{{ $style.Permalink }}">
```

Compressing the HTML is easier than ever since all you have to do is use the `--minify` flag:

```bash
hugo --minify
```

### Conclusion

Hope this guide helped you in migrating from Jekyll to Hugo.
