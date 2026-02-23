---
author: Bibek Bhusal
pubDatetime: 2025-04-20T12:56:00Z
title: How to recover a lost commit using reflog?
featured: false
tags:
  - git
  - web development
  - version control
  - recovery
  - reflog
description: Step-by-step guide on recovering accidentally lost commits using git reflog, with practical examples and multiple recovery options.
ogImage: ""
readingTime: "3 min"
---

## The Problem Scenario

Say there are 3 commits in your repository.

```shell
commit 3(third)
commit 2(second)
commit 1(initial)
```

and you accidently reset to 2nd commit:

```shell
git reset --hard HEAD~1
```

## Finding the Lost Commit

you use reflog:

```shell
git reflog
```

it will show:

```shell
abcdef1 HEAD@{0}: reset: moving to HEAD~1
1234567 HEAD@{1}: commit: Add third line
```

Here, the second line tells you, HEAD@{1} was pointing to the commit you accidently lost. It's hash is like `1234567`. To recover this, we take following method:

## Recovery Options

**Option 1:** checkout to the commit and create branch.

```shell
git checkout 1234567
git checkout -b branch-with-recovered-third-commit
```

**Option 2:** move current branch to the lost commit:

```shell
git reset --hard 1234567
```

## Summary of Steps

To summarize the steps:

1. View reflog. `git reflog`
2. Locate the hash of lost commit(the one before your mistake).
3. Recover the lost commit. `git checkout <hash>` or `git reset --hard <hash>`
4. Preserve it. `git checkout -b recovered-branch`
