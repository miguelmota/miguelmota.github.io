docker-compose - syntatic signure for complex container linking commands

docker save b4112f6560c1 > dev.tar


docker save -o <save image to path> <image name>
docker load -i <path to image tar file>
docker run ubuntu:latest sh -c 'date && whoami'


a container is an application an all of its dependencies

subsequent modifications to a baseline docker image can be committed to a new container using commit

docker runs in 3 ways
 - as a daemon to manage LXC container on your linux host (docker -d)
 - as a cli which talks to the daemon's rest api (docker run)
 - as a client of reposititries ethat let you share what you've built (docker pull, docker commit)

containers serve to isolate processes which run in userspace on host's OS

http://scm.zoomquiet.io/data/20131004215734/index.html
