---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: AWS Services – ECS, Fargate, Lambda, S3, SNS, SQS, ELB
featured: false
tags:
  - aws
  - containers
  - serverless
  - orchestration
  - storage
  - messaging
description: Complete notes on container orchestration, Amazon ECS with Fargate, Elastic Load Balancer variants, AWS Lambda characteristics, S3 object storage, SNS pub/sub, and SQS queuing behavior.
ogImage: ""
readingTime: "8 min"
---

# AWS Services – ECS, Fargate, Lambda, S3, SNS, SQS, ELB

## Container Orchestration

Container orchestration is the automation of everything required to manage lifecycle of containers.

## ECS

Amazon Elastic Container Service (ECS) is a fully managed container orchestration service that allows you to deploy, manage, and scale containerized applications.

This is the brain (the orchestrator) that decides which containers run where and Fargate is the muscle (the compute) that actually provides the CPU and memory.

### Relationship between ECS and Fargate

- ECS is the software that manages your application's logic (deployment, scaling and health).
- Fargate is the Hardware (provides as a service) that gives your application a place to live.

### ECS and Fargate workflow

1. You tell ECS "I want to run 3 copies of my Web app".
2. ECS looks at your configuration and sees you chosen Fargate.
3. ECS calls Fargate and says "Hey, give me enough compute power to run these 3 container".
4. Fargate instantly provisions the exact CPU and RAM needed.
5. ECS places your container onto that "invisible" Fargate power and monitors them.

## Fargate

Fargate is the serverless compute engine. In old days, to run a container you would require a whole server, maintain it but with Fargate, the server is "invisible". You don't manage any hardware or operation systems. You simple hand over your container and say "I need to run this with this much power" and it will just work.

## ELB (Elastic Load Balancer)

ELB is a load balancing service which comes in three variants:

- Application load balancer
- Network load balancer
- Classic

### Application load balancer

This is a proper reverse proxy which sits between server and internet. This is Application layer (Layer 7) balancer.

When you connect to ALB, the connection actually terminates at the balancer. The ALB then opens your HTTP request, looks at the headers, the cookies, and the URL path (e.g. /images vs /login)

### Network load balancer

They are load balancer, but work by routing network packets rather than by proxying HTTP request. Its Transport layer (layer 4) balancer. The NLB is like a high speed railway switch. As the packets fly through lightning speed, the NLB just flicks a switch to send them to server A or server B.

It doesn't terminate the connection, it just changes the destination on the packet and passes it through.

## Lambda

This is a code runner. You upload some code and aws runs it for you.

While ec2 gives you operating system, file system, access to the server's hardware etc. lambda abstracts away everything and gives you a function interface that lets you run code in the cloud.

- Good for small snippets of code that doesn't change much.
- Can't be used as a backend because:
  - It runs only when called
  - State can disappear anytime
  - AWS controls its lifecycle
  - Bad fit for persistent connections
  - Hard timeout (max 15 min)
- Its best viewed as a plugin. Like a photoshop plugin can add certain effect like blurring a image etc. For eg: when user uploads a image in s3 triggers lambda "plugin" and then lambda resizes the image and puts it back. If we try to do everything in our server then our app's bundle size increases, instead lambda can make it fast and light.
- ALB can be configured to give a response to a given route but it cannot respond with image. But with lambda we can do so.

### Cons of using lambda function

- Cold start: After a period of inactivity, if you invoke it then it starts slower.
- If lambda decides to start running your function in new backend worker.
- Limited size of code bundle (250 MB) with dependencies.
- Its stateless nature. If you need state then have to use Dynamo DB or s3 which can be quite expensive (for eg. handling web socket connection)

### When to use lambda function?

When your code is small and rarely changes and you need to do something in responsive to something that happens in your AWS account. This can also define this in CloudFormation template so that it actually becomes part of the infrastructure.

## S3

Its a service by aws to upload things.

- supports unlimited storage and bandwidth (can can any number of parallel uploads / downloads)
- There are different classes or tier you can choose to put your files in each having their own benifits and drawbacks but default class used for frequently accessed data is good

### Object storage in s3

#### Why was object storage needed ?

Because traditional method of storing files wasn't possible with billions of data. Suppose you have 3 - 10 files, then navigating the tree of folders won't be a problem but what if its in billions ?

#### Introduction of object

Object is a self-contained unit in object storage, which has 3 parts:

- The data (payload) : The actual bits --the photo, the video or the log file.
- The Metadata (description): You can tag data with information like Department: Marketing, Project: Alpha, or Expiration: 2030.
- The ID (the key): A unique string used to identify a object uniquely.

### Commands

#### Create bucket

```bash
aws s3 mb s3://uploads-bucket
```

Here, mb means make bucket.  
s3://uploads-bucket(bucket name) this is the URI for bucket.

## SNS (Simple Notification Service)

SNS or simple notification system is used for broadcasting. It uses pub/sub (publisher / subscriber) model. When a message hits a SNS Topic, SNS immediately pushes it to all subscribers (Email, SMS, Lamda or SQS).

> Topic  
> Broadcasting channel. A logical access point where publishers sends messages and subscriber access those messages.

Without topic:  
Order service must call:

- email service
- billing service
- analytics service

This causes tight coupling.

And with SNS:  
Order service -> topic only

This is loosely coupled, scalable, event-driven.

### SQS vs SNS

SQS is pull service whereas SNS is push service.  
In pull service producer directly sends message without consumer needing to ask while in push service consumer asks for the message.

## SQS (Simple Queue Service)

It is a highly durable queue in the cloud. You put messages in one end and from another end its consumed. The messages are consumed in almost first-in-first-out order, but the ordering is not strict. This is because SQS queue is bunch of queue behind the scene. When we enqueue a message, it goes to a random queue, and when you poll, you poll a random queue. There's also chance of duplicate message in SQS, so consumer should be able to handle it.

### How can there be duplicate message in SQS ?

This is a distributed system, and to ensure SQS never goes down, AWS copies your messages on multiple servers. Lets understand by this scenario:

1. Your consumer polls for message.
2. It successfully consumes it, but you forgot to say to SQS that you have consumed it (may happen due to various reason like connection may flicker for a second)
3. SQS sees that you haven't acknowledged you successfully consumed the message hence it makes the message visible again.
4. Another consumes polls the message and gains the same message.

Hence, the consumer should be idempotent, able to handle duplicate messages.

### Key features of SQS

- There's no need for capacity management like s3
- No limit for how much message can be queued or consumed.
- If we really want strict ordering and exactly once delivery (no duplicates), SQS has a option to enable the property by marking your queue a FIFO.
- But these FIFO queue has a limit of 300 messages per second (so choose only when you know your usage won't pass this limit)
