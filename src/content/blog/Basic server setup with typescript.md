---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: Basic server setup with express
featured: false
tags:
  - express
  - nodejs
  - web development
description: Step-by-step guide to setting up a basic Express.js server with TypeScript configuration and development tools.
ogImage: ""
readingTime: "3 min"
---

# Basic server setup with express
This blog helps setup backend with typescript for Nodejs projects.

## Step 1: Install package for typescript & types for nodejs.

```shell
npm install @types/node typescript
```

This installs package called express from npm repository. This automatically adds `package.json` & `node_modules` folder in the project folder. In `package.json` file you can see:

```js
{
  "dependencies": {
        "typescript": "^5.8.3",
		"@types/node": "^22.15.3",
  }
}
```

Meaning: The project depends on `typescript` & `@types/node` package to run. (in typescript)5 is major version, 8 is minor verson, 3 is patch version.`^` means when installing this package it can automatically upgrade it's version not containing breaking changes. Version from 5.8.3 up to any version but not including 6.0.0

## Step 2: Initialize config file for typescript.

```shell
npx tsc --init
```

Meaning: tsc is a typescript compiler. In above command, it initializes `tsconfig.json` file (a configuration file for typescript)

## Step 3: Install tsx

`npm install tsx --save-dev` To install tsx locally. `npm install tsx -g` To install globally.

```js
npm install tsx --save-dev // saves locally
npm install tsx -g // saves globally
```

## Step 4: Configure package.json

in package.json

```js
  "scripts": {
    "dev": "tsx —watch src/main.ts"
  }
```

## Step 5: Install express

```js
npm install express @types/express
```
