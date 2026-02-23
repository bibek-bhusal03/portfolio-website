---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: Child Process vs Worker Threads in Node.js
featured: false
tags:
  - nodejs
  - concurrency
  - worker-threads
  - child-process
description: Comparison of child processes and worker threads in Node.js — memory usage, performance, communication, use cases, and practical examples.
ogImage: ""
readingTime: "5 min"
---

# Child Process vs Worker Threads in Node.js

Both child processes and worker threads enable concurrency in Node.js, but they differ significantly in architecture, resource usage, performance, and ideal use cases.

## Worker Threads

Worker threads (from the `worker_threads` module) run JavaScript in parallel threads within the **same Node.js process**.

### Key Features

- **Shared memory** — Threads share the same memory space via `SharedArrayBuffer`, enabling fast data transfer.
- **Lightweight** — No separate process overhead; lower memory and startup cost.
- **Best for CPU-bound tasks** — Ideal for heavy computation (data processing, image manipulation, crypto, complex calculations).

### Basic Worker Thread Example

```js
const { Worker, isMainThread, parentPort } = require("worker_threads");

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on("message", msg => console.log(`Message from worker: ${msg}`));
  worker.postMessage("Hello Worker");
} else {
  parentPort.on("message", msg => {
    parentPort.postMessage(`Received: ${msg}`);
  });
}
```

### Worker Thread for CPU-Intensive Task (Fibonacci)

**main.js**

```js
const { Worker } = require("worker_threads");

function runWorker(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker.js", { workerData: data });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", code => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

runWorker(45).then(result => {
  console.log("Fibonacci result:", result);
});
```

**worker.js**

```js
const { parentPort, workerData } = require("worker_threads");

function fib(n) {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}

const result = fib(workerData);
parentPort.postMessage(result);
```

## Child Processes

Child processes (from the `child_process` module) spawn **separate operating system processes**, each with its own V8 instance and memory space.

### Key Features

- **Separate memory** — Complete isolation; crash in child does not affect parent.
- **High overhead** — More memory, higher startup time, context switching cost.
- **Best for I/O-bound or isolated tasks** — Running shell commands, external binaries, legacy scripts, or tasks needing strong isolation.

### Child Process Example (Fork + Fibonacci)

**main.js**

```js
const { fork } = require("child_process");

const child = fork("child.js");

child.on("message", msg => console.log(`Result from child: ${msg}`));
child.on("exit", code => console.log("Child exited with code", code));

child.send(40);
```

**child.js**

```js
process.on("message", n => {
  function fib(x) {
    return x <= 1 ? x : fib(x - 1) + fib(x - 2);
  }

  const result = fib(n);
  process.send(result);
  process.exit(0);
});
```

## Quick Comparison

| Feature             | Worker Threads                  | Child Processes                |
| ------------------- | ------------------------------- | ------------------------------ |
| Memory space        | Shared (same process)           | Separate (new process)         |
| Startup overhead    | Low                             | High                           |
| Communication speed | Very fast (SharedArrayBuffer)   | Slower (IPC / serialization)   |
| Isolation           | Limited                         | Full (process-level)           |
| Fault tolerance     | Thread crash can affect process | Child crash isolated           |
| Best for            | CPU-intensive tasks             | I/O, shell commands, isolation |
| Resource usage      | Lightweight                     | Heavy                          |

Use **worker threads** for parallel JavaScript computation within one process.  
Use **child processes** when you need isolation, external programs, or different runtime environments.
