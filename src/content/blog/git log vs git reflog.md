---
author: Bibek Bhusal
pubDatetime: 2025-04-16T11:46:00Z
title: Git log vs reflog
featured: false
tags:
  - web development
  - git
  - version control
  - development tools
description: Understanding the differences between git log and git reflog commands, their use cases, and how they help in tracking commit history and recovering lost commits.
ogImage: ""
readingTime: "3 min"
---

# Git log vs reflog

## What is git log?

Git log provides commit history reaching up to the provided reference (specified branch, or pathways). It can be customized to show complex information such as merge commits also.

> In git, reference means pointer to a commit. Here, 'a commit' could also mean group of commits like a branch(main, develop), a tag, remote branch(origin/main) or even special references like HEAD, HEAD~1 or a specific commit hash like **4d8e2a1**

> In git, tag is a label attached to a specific commit. It is done when important milestone is achieved (like new version is released), deployment points, hotfix snapshots. Labeling it makes it easier to reference the commit without having to remember 40 characters hash. They aren't automatically pushed to remote repository so following command is used to do so: `git push origin v1.0`

Syntax to see log of current branch:

```shell
git log
```

## What is git reflog?

Git reflog provides information of when head reference was updated like commits, rebase, resets, etc. It's local only and has limited time limit(90 days) and isn't pushed to remote repositories. It's main purpose is to recover lost commits (recovery of "lost"). Git does track when head reference was updated but it also maintains separate reflogs for each branch separately behind the scenes

Syntax to see reflog of certain branch:

```shell
git reflog show main
```

Syntax to see reflog(HEAD):

```shell
git reflog
```
