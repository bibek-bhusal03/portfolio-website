---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: Difference between callbacks, promises, and async await
featured: false
tags:
  - javascript
  - async
  - promises
  - web development
description: Understanding the differences between callbacks, promises, and async/await in JavaScript with examples and performance considerations.
ogImage: ""
readingTime: "5 min"
---

# Difference between callbacks, promises, and aync await

---

## What is callback?

If we pass a function as a parameter to another function then the function we passed is called callback function. We use this callback function to perform asynchronous operations.

**Problem with callback function**

### Example of callback hell:

```js
function task1(callback) {
  setTimeout(() => {
    console.log("Task One completed");
    callback();
  });
}

function task2(callback) {
  setTimeout(() => {
    console.log("Task Two completed");
    callback();
  });
}

task1(function () {
  task2(function () {
    console.log("Both tasks completed");
  });
});
```

---

## What is promise?

Promise is a JavaScript object returned by an asynchronous operation representing its progress.

Promise in JavaScript is similar to promise in real life. In real life, promise guarantees that you will do something in the future.

Promise in JavaScript also represents eventual completion or rejection of a task.

Promise hides the timing of operation inside them. From the outside, we don't need to know how it works or when it will finish executing.

Because of that we can combine Promises in a clean and predictable way.

Once the promise is resolved, it becomes immutable value which can be passed to other party and know that it cannot be modified by malicious actor.

Promise uses [[Revealing constructor]] pattern

```js
const p = new Promise(function () {});
```

A Promise takes a function which is immediately executed (not async deferred, as callbacks to then(...) are) and it takes 2 parameters which we have named as resolve and reject. These reject and resolve are functions JavaScript engine gives us to control what happens to promise: whether it fulfills or rejects.

We don't necessarily need to pass anything to these functions. They can simple work as flow control mechanism.

---

### A wierd behaviour of promise:

```ts
var p3 = new Promise(function (resolve, reject) {
  resolve("B");
});

var p1 = new Promise(function (resolve, reject) {
  resolve(p3);
});

var p2 = new Promise(function (resolve, reject) {
  resolve("A");
});

p1.then(function (v) {
  v.then(function (d) {
    //throws error because v is "B" not a promise
    console.log(d);
  });
  console.log(v);
});

p2.then(function (v) {
  console.log(v);
});
```

**Why did this (inside p1's then) throw error?**

Because If a promise resolves to another promise `resolve(somePromise)` then this promise is not fulfilled with `somePromise` promise but adopts the state of the `somePromise`. So, when `somePromise` is resolved then this promise will also resolve with same value. In short:

> If you resolve outer Promise with another Promise, the outer Promise adopts the state and value of inner promise.

**What does the JS engine do here?**

JS engine sees that the resolve's value is a Promise, then it:
"Adopts the state of P3 instead of fulfilling immediately" queue a follow task to settle when p3 settles.

---

## What is async and await?

Async is a keyword used before function keyword, which wraps this result in `promise.resolve(returnedValue)` or `promise.reject(returnedValue)`.

Await is a keyword which takes a promise and waits untils it resolves and return a value.

Basically, async await is a cleaner way to work with promises.

### Differences between async/await and promise

- Async/await uses try/catch to handle error while promise uses .catch
- In Promise, we chain callbacks and in async/await we stop until promise resolves
- Async/await pauses execution of function till promise resolves while promise doesn't

### Example of error handling in async/await:

```js
async function foo() {
  try {
    const res = await fetch("bad-url");
    const data = await res.json();
  } catch (err) {
    console.error("Async/await error:", err);
  }
}
```

---

## When does async/await cause performance issues?

### When we unnecessarily serialize

Even if each tasks are independent, await forces sequenctial execution. This problem is more pronounced when we use async/await syntax (though it can occur with plain promises too), because it makes it easier to accidently serialize things that could run concurrently, because the code looks synchronous.

### Hot loops

When using await inside a loop creates a bottleneck:

```ts
for (const item of items) {
  await process(item); // runs one at a time which is painfully slow
}
```

Better:

```ts
await Promise.all(item.map(process));
```

---

# References

[Callbacks vs Promises vs Async/Await - GeeksforGeeks](https://www.geeksforgeeks.org/javascript/callbacks-vs-promises-vs-async-await/)
[Callbacks vs. Promises vs. Async/Await: Detailed Comparison | by Karnika Gupta | Women in Technology | Medium](https://medium.com/womenintechnology/callbacks-vs-promises-vs-async-await-detailed-comparison-d1f6ae7c778a)
[notes/topics/javascript/async.md at master · 8483/notes · GitHub](https://github.com/8483/notes/blob/master/topics/javascript/async.md)
[The Pitfalls of Async/Await in JavaScript | Lakindu Hewawasam | Bits and Pieces | Bits and Pieces](https://blog.bitsrc.io/pitfalls-of-async-await-in-javascript-7c0678fbc282) (for promise definition)
