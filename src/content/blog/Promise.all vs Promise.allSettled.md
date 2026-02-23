---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: Promise.all vs Promise.allSettled
featured: false
tags:
  - javascript
  - promises
  - async
  - web development
description: Understanding the differences between Promise.all and Promise.allSettled, including behavior, failure handling, and real-world usage.
ogImage: ""
readingTime: "3 min"
---

# Promise.all vs Promise.allSettled

---

## How does Promise.allSettled work?

`Promise.allSettled` method takes promises as input and returns a single promise. This returned promise is fulfilled when all the input promises settle, with an array of objects with 2 keys, status (status of the promise, resolved or rejected) & value (the rejected reason or resolved value) or if the promsie is rejected the key is reason.

```ts
[
  { status: "fulfilled", value: 1 },
  { status: "rejected", reason: Error("Failed") },
];
```

---

So the difference between them in terms of rejecting promises is that:

- Promise.all throws an error (or rejects) if even one promise fails and returns the rejected reason for it while Promise.allSettled doesn't reject even if a promise fails.
- Promise.all will only run successfully if and only if all the promises are fulfilled or resolved successfully while Promise.allSettled will work even if a promise fails.
- With promise.all you would not know which other promises might have succeeded if one fails. But promise.allSettled returns result of all promises regardless of their outcome.

---

## When to use promise.all and promise.allSettled?

For promise.all we use it for tasks that are dependent of each other, if one task fails then we do not want to proceed. But for promise.allSettled, we use it for tasks that are independent of each other, even if one fails we want to handle all of them and show successfull results. For example, in a dashboard where some widgets can load independently, you might want to use Promise.Settled so that available data is displayed even if some sources fail.

---

# References

[How does Promise.all() method differs from Promise.allSettled() method in JavaScript ? - GeeksforGeeks](https://www.geeksforgeeks.org/javascript/how-does-promise-all-method-differs-from-promise-allsettled-method-in-javascript/)
[Promise.allSettled() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
[Understanding Promise.all() and Promise.allSettled(): When to Use Each | by Vikrant Bhadauria | Medium](https://medium.com/@vikrantbhadauria/understanding-promise-all-and-promise-allsettled-when-to-use-each-226b10f36d10)
[Promise.all vs. allSettled: Essential JS Error Handling Differences - ReviewInsights.com](https://openillumi.com/en/en-js-promise-all-vs-allsettled-difference/)
