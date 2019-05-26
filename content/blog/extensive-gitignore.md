---
layout: blog-post
title: Extensive .gitignore
type: blog
tags: [git, gitignore]
description: An extensive and useful .gitignore.
date: 2013-04-04T00:00:00-00:00
draft: false
---
There are [.gitignore templates](https://github.com/github/gitignore)> suited for pretty much any project. I'm going to share the .gitignore that I recently been using for my web projects. It's and extended verison of [github's global .gitignore](https://help.github.com/articles/ignoring-files)>.

Here is the [gist](https://gist.github.com/miguelmota/5299533)>:

```
//this will affect all the git repos
git config --global core.excludesfile ~/.gitignore


//update files since .ignore won't if already tracked
git rm --cached <file>

# Compiled source #
###################
*.com
*.class
*.dll
*.exe
*.o
*.so

# Packages #
############
# it's better to unpack these files and commit the raw source
# git has its own built in compression methods
*.7z
*.dmg
*.gz
*.iso
*.jar
*.rar
*.tar
*.zip

# Logs and databases #
######################
*.log
*.sql
*.sqlite

# OS generated files #
######################
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
# Icon?
ehthumbs.db
Thumbs.db
.cache
.project
.settings
.tmproj
*.esproj
nbproject

# Numerous always-ignore extensions #
#####################################
*.diff
*.err
*.orig
*.rej
*.swn
*.swo
*.swp
*.vi
*~
*.sass-cache
*.grunt
*.tmp

# Dreamweaver added files #
###########################
_notes
dwsync.xml

# Komodo #
###########################
*.komodoproject
.komodotools

# Node #
#####################
node_modules

# Bower #
#####################
bower_components

# Folders to ignore #
#####################
.hg
.svn
.CVS
intermediate
publish
.idea
.graphics
_test
_archive
uploads
tmp

# Vim files to ignore #
#####################
.VimballRecord
.netrwhist
```