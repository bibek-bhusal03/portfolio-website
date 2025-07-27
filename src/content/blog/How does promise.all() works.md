---
author: Bibek Bhusal
pubDatetime: 2025-01-27T00:00:00Z
title: How does Promise.all() work?
featured: false
tags:
  - javascript
  - typescript
  - promises
  - async
  - programming
description: Understanding how Promise.all() works for handling multiple asynchronous operations efficiently and why it's better than sequential await statements.
ogImage: "" 
readingTime: "3 min"
---

# How does Promise.all() work?

If we use normal try-catch block to handle errors then it can catch only one time the error occurs and if other error occurs then it wouldn't be handled. So when we're doing multiple asynchronous operations then we use `Promise.all()`.

## The Problem with Sequential Promises

If we have multiple async operations to perform then we have to await them. We have to finish for one await statement to before moving on to execute other promise. Example:

```ts
async function demo() {
  const a = await new Promise((res) => setTimeout(res, 2000));
  const b = await new Promise((res) => setTimeout(res, 2000));
  const c = await new Promise((res) => setTimeout(res, 2000));
}
demo();
console.log("Sentence after promise");
```

When demo is called, first 'a' promise starts executing. It waits for 2 seconds before 'a' promise is resolved. Until 'a' is resolved function demo stops executing. Then it executes statement after demo() call i.e console.log. After 2 seconds, it starts executing 'b' promise and until it is resolved i.e till 2 seconds demo function's execution is paused.

## The Solution: Promise.all()

To resolve this issue we use `Promise.all()` method. Example:

```ts
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.resolve(3);
const results = await Promise.all([promise1, promise2, promise3]);
console.log(results); // [1, 2, 3]
```

Here, instead of waiting for one promise to finish before executing another promise, we use promise.all() method to start executing all promises at once. This makes executing code extremely fast. And if even one promise fails/rejects then Promise.all() throws an error.