---
author: Bibek Bhusal
pubDatetime: 2025-01-27T00:00:00Z
title: GitHub Basics - A Complete Guide to Version Control
featured: false
tags:
  - git
  - github
  - web development
  - version control
  - branching
description: Comprehensive guide to GitHub fundamentals including branching, merging, rebasing, cherry-picking, and navigating commit history with practical examples.
ogImage: ""
readingTime: "6 min"
---

## Introduction to GitHub

GitHub is a cloud-based platform where you can store and manage your code versions. While git stores your code locally, github enables you to store your git repository online.

## Branching Basics

### What is a Branch?

A branch is like a separate workspace for your code. It's a way to work on specific features or fixes without messing up the main or "master" version.

### Creating new branch

```bash
git branch newbranch
```

It creates new branch but we're still in the main branch.
To create new branch and to move into that branch use the following command:

```bash
git checkout -b feature
```

Feature = name of the new branch

---

## Branches and merging

Merging in git creates a special commit with 2 unique parents. If there are 2 unique commits in different branch:

1. main
2. bugfix

No two contain the entirety of our work. Now, to merge these we use:

```bash
git merge bugfix
```

This merges bugfix branch with main branch.

---

## Git rebase

Rebasing is a Git operation that combines a sequence of commits into a new base commit. This process involves changing the commit history, unlike merging, which creates a new commit that ties together the histories of two branches.

Rebase essentially takes a set of commits, copies them, and plops(drops) them somewhere.
Say you are in bug-fix branch:

```bash
git rebase main
```

This command copies commits in bug-fix onto main branch.

## Reversing changes in git

We use 2 commands for doing so:

1. revert
2. reset

```bash
git revert HEAD
```

```bash
git reset HEAD~1
```

Reset doesn't work in non-local settings as we can't reset the history in all machines.

## Git cherry-pick

It's a very straight-forward way of saying you would like to copy a series of commit below your current location(Head).

```bash
git cherry-pick <commit1> <commit2> <...>
```

## Git interactive rebase

It means git rebase but with `-i` option. Its great for: to know which commits are to be rebased.

---

## Moving around in commits

### Head

Head is a pointer that points to the branch on which new code/data will be or are commited.
Head is symbolic name for the currently checked out commit. It's essentially what commit you're working on top of.

---

Using hashes to move around in commit is tedious:

```bash
git checkout c1
```

`c1 = hash`
Hashing is tedious, hard to remember.
So we use:

### Relative refs

Use `^` to move one commit upwards.
Use `~<num>` to move number times upwards in commit.

Example use case of it:

```bash
git branch -f main HEAD~4
```

Here `-f` refers to force move branch.

## How to push

```bash
git push -u origin bibek/cruduser
```

This pushes the `bibek/cruduser` under develop branch.

## Forking

Forking refers to creating a personal copy of someone else's project or repository. This is often done on platforms like GitHub.

When you fork a repository, you create a separate copy of the project under your GitHub account. You can then make changes to your fork without affecting the original project.

Forking is commonly used in open-source collaboration, allowing developers to contribute to a project without directly modifying the original codebase.

---

If you still have confusion regarding GitHub then I also have a video explaining it.
[GitHub tutorial for beginners](https://www.youtube.com/watch?v=jPMb2-CTflU)
