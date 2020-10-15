---
layout: blog-post
title: Kubernetes explained like I'm five
type: blog
tag: [kubernetes, docker, ELI5]
description: Learn how to interact with Alexa Voice Service (AVS) RESTful API with cURL.
date: 2019-09-22T00:00:00-00:00
draft: false
---
_This was originally posted on ["Explain Kubernetes to me like I'm Five" on dev.to](https://dev.to/miguelmota/comment/filh)_

## ELI5: Kubernetes

Docker images: think of them as blueprints, for example a blueprint for creating a cow.

Docker daemon: think of it as corral for letting the cows run wild.

Docker swarm (and Kubernetes): think of it as a rancher that manages the cows.

Let's say you create many cows (docker containers) with the same blueprint (docker image) and let the cows do their thing in the corral (docker daemon).

You have all the dairy cows in one place but it's getting pretty crowded and they're eating all the stuff around them (resources) and you need to redistribute them to other areas or they will die.

You hire the rancher named Kubernetes and tell him of all the other corrals (nodes). The rancher checks each corrals capacities (resources) that they can handle. The rancher will take care of moving the cows around when the corrals are low on food to more abundant areas and the rancher will also take care of creating new cows for you if cows die for any reason.

The rancher is responsible optimizing your cattle ranch as efficient as possible and making it scale as long as you tell him of all the locations that he's allowed to move the cows to. You can also tell him to only grow the ranch to a certain size or to dynamically scale larger to produce more milk based on the dairy consumption demand by the population (auto-scaling).
