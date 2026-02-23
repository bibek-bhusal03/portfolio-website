---
author: John doe
pubDatetime: 2025-03-31T07:40:00Z
title: Understanding Docker - From Containers to Production
featured: true
tags:
  - docker
  - containers
  - backend development
  - devops
description: A comprehensive guide to Docker containerization, covering containers, images, volumes, networking, and Docker Compose for consistent application deployment.
ogImage: "" # Add a valid image URL if available
readingTime: "8 min"
---

# Introduction

Imagine, you have a application that works perfectly in your machine but when you deploy it in production, it breaks . So the problem statement is:

**"How do you ensure your application runs consistently across different environments?"**

To solve this problem you may have thought of using Virtual Machines(or docker :) ).

> **What is a virtual Machine you may ask?**
> A Virtual machine(VM) emulates a computer operating system, allowing you to run multiple operating system in you machine.

Virtual Machine takes a lot of space(10-15 GB at minimum) hence only limited amount of Virtual Machines are able to run in a system determined by it's hardware capabilities.

Unlike virtual machines, which emulate entire operating systems and require significant resources, Docker containers isolate applications within the same host OS, reducing overhead and allowing for faster startup times and more efficient resource utilization.

So, we don't use virtual machines instead we use docker. But, before understanding docker we first need to understand the concept of container.

## What is a Container?

Container is a self-sufficient package of all things your application needs to run -such as runtime, code, system tools, libraries and settings. It's like a mini world that has all that you need to run your application in any machine. Containers share the host's kernel but run isolated from one another.

## What is docker?

Docker is a platform which helps in containerizing an application. Simply, docker helps us in creating, maintaining and deploying containers. It provides tools to package applications with all the dependencies they need, ensuring it runs smoothly across all devices.

### Docker lifecycle

To create container through docker, a process needs to be followed or simply how is the container created. Here's a step-by-step breakdown of how Docker containers are created:

**Dockerfile:** It is a text file which contains all the instructions you need to build Docker image, including what operating system to use, which dependencies to install and, how to configure the app. This is like a script for a Recipe.

```bash
## From specifies which image to use
FROM Ubuntu:latest

## WORKDIR specifies which folder contains source file
WORKDIR /app

## RUN specifies commands to run during build time
RUN apt-get update && apt-get install -y <package-name>

## CMD specifies command to run in runtime
CMD [<>, <>]
```

**Docker image:** If you run Dockerfile you get docker image. It has all the libraries, dependencies a application might need. It's like all the raw material required for cooking certain food.

**Docker container:** It's a running instance of a docker image. While docker image may be a blueprint, docker container is running instance of it or the actual house.

### Common terminologies in docker

**Registry**

Registry is a collection of docker images. Docker has its own public registry, Docker Hub, where you can find images of various kind. You can also create your own private registry to host your own images, ensuring security and control.

### Docker build stages

Docker multi stage build allows you to have multiple from statements in your Dockerfile. This allows you to use different base images and lets you isolate dependencies needed for building your application from those required for running it.

```bash
### Stage 1 ###
FROM golang:alpine as builder
WORKDIR /app
COPY ..
RUN go build -o myapp

### Stage 2 ###
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/myapp .
CMD ["./myapp"]
```

### Volume and docker bind

Generally, if you want to store or persist data, how do you do it? You can simply save it in a file on your machine or in a database. Your container is isolated from host(Here, by host I mean the machine our container is running in) file system. So, How to store or persist data in docker?

To do that we can either:

**bind our container** to a certain folder in our host machine and whatever we create or save in container persists in that folder. With a bind mount, changes you make in the container immediately reflect in the host's directory and vice versa.

```bash
docker run -it -v <host_path>:<container_path> <image-name> /bin/bash
```

or:

**create a volume** (a storage area somewhere in our pc or in any machine like aws's s3 bucket, database etc). Volumes are managed by Docker and offer advantages like better portability(easily transferrable from one machine to another) across different environments, easier backups. Different containers can share a same volume.

```bash
docker volume create <volume_name>
docker run -it -v <volume_name>:/data <image_name> /bin/bash
```

This create a volume and run it. What we save or create in our container's data folder will persist in the volume.

### Docker network

Every device on the internet has a unique identifier called an IP address, associated with them. Host machine also has a unique identifier. A container also need to have a unique identifier to communicate over the network. To configure network of container, Docker has 3 network configurations:

**Bridge Network:** By default networking is enabled in container. It has a bridge network by default. you can look that up by using command :

```bash
docker network ls
```

**Having same Ip as host:** A container can have same IP address as the host but if there are more than one containers in a host than it may create some unexpected complications as data packets travelling to the host machine will be confused as they won't know where to go and who should respond to this data packet. Hence, we need certain isolation between host and container and in between containers too.

```bash
docker run --network="host" <image_name> <command>
```

**User-defined network:** Say you have 3 containers: login container, logout, payment container. You want complete isolation between login container and payment container because you wouldn't want others to know sensitive information of your customers like their bank credentials. To achieve this: we can create a custom network and assign it to a container.

```bash
#this creates a custom network named my_bridge
docker network create -d bridge my_bridge

docker run -d --net=my_bridge --name <container_name> <image_name>
```

Also Docker automatically configures DNS for containers in a custom network, so they can resolve each other's names.

### Docker compose

Docker compose is a tool in docker used to create, shutdown or generally manage container in easy way.

**Problem statement:** "You have a application with different services. Whenever you're testing as a developer or as a tester you have to run the application in local machine. Now every time you have to run the application you have to open multiple services and have to remember correct docker commands to run them. This is tedious and not desired"

**Solution:** Docker compose. You have a single .yaml file which contains all the necessary information. And if you have to run the application you can use a single command to run all the services in the application `docker compose up`. And if you have to shut down all the services, we use single command `docker compose down`. This solves a huge headache. Now as a developer or tester you would have to remember a single command to test or develop.

Using Redis and Nginx we can create a example use case of docker compose. Refer Redis notes for this.

This blog covers all the basic things you would require while using docker, but if you want more in depth understanding of certain topics you can email me or comment. Thank you for taking the time to read it.
