---
layout: byte
title: How to use Ansible to deploy with git
type: bytes
tags: [Ansible, git]
description: A basic Ansible example on deploying with git.
date: 2014-06-13T00:00:00-00:00
draft: false
---

Basic [Ansible](https://docs.ansible.com/) example on deploying with git.

`vars.yml`

```yaml
---
# Update this to your own settings
project_name: test
project_root: /var/www/test
project_repo: git@github.com:miguelmota/test-repo.git
```

`handlers.yml`:

```yaml
---
-   name: restart web server
    action: command echo "do something"
    sudo_user: root
```

`deploy.yml`:

```yaml
---
-   hosts: servers
    vars_files:
        - vars.yml
    gather_facts: false
    sudo: true
    sudo_user: root
    user: root

    tasks:
        - name: Pull sources from the repository.
          git: repo={{project_repo}} dest={{project_root}} version={{branch}}
          notify:
            - restart web server

    handlers:
      - include : handlers.yml
```

`hosts`:

```
# Replace 0.0.0.0 with your server ip

[remote:children]
production
staging

[servers:children]
production
staging
local

[production]
0.0.0.0 nickname=production vm=0 branch=stable

[staging]
0.0.0.0 nickname=staging vm=0 branch=staging

[local]
localhost nickname=local vm=0 branch=development
```

`ansible`:

```bash
#!/bin/bash

# Run with:
# ./ansible --limit staging deploy.yml

/usr/bin/env ansible-playbook -i hosts "$@"
```

On github at [miguelmota/ansible-example](https://github.com/miguelmota/ansible-example).
