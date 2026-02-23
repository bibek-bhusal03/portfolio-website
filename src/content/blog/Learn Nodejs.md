---
author: Bibek Bhusal
pubDatetime: 2026-02-17T17:05:00Z
title: Learn Node.js
featured: false
tags:
  - nodejs
  - javascript
  - runtime environment
  - web development
  - backend development
  - streams
  - events
  - eventemitter
description: Comprehensive guide to Node.js fundamentals, including core concepts, streams for efficient data handling, and custom events with EventEmitter for building scalable applications.
ogImage: ""
readingTime: "14 min"
---

# Learn Node.js

This guide covers essential Node.js concepts to help you build efficient and scalable server-side applications.

## Understanding Node.js - Definition and Core Concepts

### What is Node.js?

Node js is a program that has v8 engine installed which parses and runs your JavaScript inside a Node environment / execute the code for us.

Runtime environment is **the environment in which a program or application is executed**. It's the hardware and software infrastructure that supports the running of a particular codebase in real time.

### Components of Node.js

Node.js is made up of:

1. **V8 engine** for executing JavaScript.

2. **libuv** for handling asynchronous I/O operations.

3. **C++ code** that integrates V8 and libuv with the operating system.

4. **JavaScript core modules** that provide built-in functionality for common server-side tasks.

### Key Programming Concepts

**Scripting Language**: Scripting language is basically a language where instructions are written for a run time environment. They do not require the compilation step and are rather interpreted

**Client-side Scripting**: Client-side scripting is changing interface behaviors within a specific web page in response to input device actions, or at specified timing events. In this case, the dynamic behavior occurs within the. The client-side content is generated on the user's local computer system.

**Semantics**: "Semantics" refers to the meaning or interpretation of the core concepts and actions in a programming language. It's about understanding what various elements of the language do and how they interact.

### Difference between Node.js and Browser

Node.js and browsers are two distinct environments where JavaScript can be executed, each catering to different use cases. Node.js focuses on server-side development, while browsers enable client-side interactivity and dynamic web applications.

## Understanding Streams

Streams handle data piece by piece (in chunks) instead of loading everything into memory at once. They are essential for efficient I/O operations, especially with large files, network data, or real-time processing.

### Types of Streams

#### Readable Stream

Sources of data you can read from (files, HTTP requests, etc.).

Emits `'data'` events when chunks are available and `'end'` when finished.

#### Writable Stream

Destinations to write data to (files, HTTP responses, etc.).

#### Duplex Stream

Can be both read from and written to (TCP sockets, WebSockets).

#### Transform Stream

Special duplex streams that modify data as it passes through (compression with zlib, CSV parsing, etc.).

##### PassThrough Stream

A transform stream that passes data through unchanged. Useful for testing or as a simple proxy.

**Why use streams?**

- Automatically handle **backpressure** — if the consumer is slow, the producer pauses.

- Memory efficient for large data.

- Enable pause/resume control.

- Support real-time processing.

### The `.pipe()` Method

`.pipe()` connects a readable stream to a writable (or transform) stream.

It automatically handles backpressure: pauses the source when the destination is full.

```js
readable.pipe(writable);
```

### Stream Operating Modes

- **Flowing mode** — data flows automatically as soon as it is available (default after adding a `'data'` listener).

- **Paused mode** — you must explicitly call `.read()` to pull data.

### When to Use Streams Instead of `fs.readFile` / `fs.writeFile`

Use streams when:

- Files are large (> few hundred MB)

- You need to process data as it arrives

- You want pause/resume capability

- You are dealing with network responses/requests

- Memory usage must stay low

`fs.readFile` and `fs.writeFile` load the entire file into memory → risk of OOM errors on big files.

### Reading Files with Streams

```js
import fs from "node:fs";
let content = "";
const reader = fs.createReadStream("./assets/users.json", {
  start: 5, // start from byte 5
  end: 20, // stop at byte 20
  highWaterMark: 10, // buffer size: 10 bytes per chunk
});
reader.on("open", () => console.log("File opened"));
reader.on("data", chunk => {
  content += chunk;
  reader.pause(); // manually pause
  console.log("Pausing for 1.5s...");
  setTimeout(() => {
    reader.resume();
  }, 1500);
});
reader.on("end", () => {
  console.log("Finished reading:");
  console.log(content);
});
reader.on("close", () => console.log("File closed"));
reader.on("error", err => console.error("Read error:", err));
```

### Writing Files with Streams

```js
import fs from "node:fs";
const writer = fs.createWriteStream("./output/log.txt");
writer.write("Event Start\n");
writer.write("Processing...\n");
writer.write("Event Complete\n");
writer.end(); // or writer.close() in older versions
writer.on("open", fd => console.log("Write stream opened, FD:", fd));
writer.on("finish", () => console.log("Write completed"));
writer.on("close", () => console.log("Write stream closed"));
writer.on("error", err => console.error("Write error:", err));
```

### Copying Files with `.pipe()`

```js
import fs from "node:fs";
const source = fs.createReadStream("./assets/users.json");
const dest = fs.createWriteStream("./assets/user2.json");
source.pipe(dest); // handles backpressure automatically
source.on("end", () => {
  console.log("File copy completed.");
});
```

### Streaming an Image from S3 Bucket to Frontend

Backend (Node.js + Express example):

```js
import { PassThrough } from "node:stream";
// assume you have a function that returns a readable S3 stream or presigned URL
app.get("/image/:key", async (req, res) => {
  const key = req.params.key;
  const url = await getPresignedDownloadUrl({ key }); // or directly get object stream
  // If you have a readable stream from S3
  const s3Stream = await getS3ObjectStream(key); // returns readable stream
  // Or if using presigned URL and fetching
  // const response = await fetch(url);
  // response.body.pipe(res);
  const passThrough = new PassThrough();
  s3Stream.pipe(passThrough);
  passThrough.pipe(res);
});
```

Frontend (fetch + blob):

```js
fetch("/image/123")
  .then(res => res.blob())
  .then(blob => {
    const imgUrl = URL.createObjectURL(blob);
    document.getElementById("myImage").src = imgUrl;
  });
```

```html
<img id="myImage" alt="Streamed image" />
```

#### References for Streams

[How to Use Node.js Streams for Efficient File Handling](https://jsdev.space/howto/nodejs-streams-efficient-file-handling/)

## Custom Events

Node.js is event-driven and relies on the event loop for asynchronous operations. The core of its event system is the `EventEmitter` class from the `events` module.

### Core Concepts

- **Events** — Named signals (e.g., `"userLoggedIn"`).

- **Listeners/Handlers** — Functions executed when an event occurs.

- **Emitter** — Object that emits events.

#### Basic Example

```js
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
// Register listener
myEmitter.on("greet", name => {
  console.log(`Hello ${name}`);
});
// Emit event
myEmitter.emit("greet", "Bibek");
```

### Performance Impact of Different Approaches

#### EventEmitter vs Direct Function Calls

| Factor | Direct Call | EventEmitter |
| ---------- | ----------- | ----------------------- |
| Speed | Faster | Slower |
| Overhead | Minimal | Extra abstraction layer |
| Decoupling | Tight | Loose |
| Scaling | Low | High |

##### When to Use EventEmitter

- Multiple components need to react to the same event.

- You want extensibility (plugins, hooks).

##### When to Avoid EventEmitter

- Performance-critical hot paths (called many times per second).

- Simple one-to-one logic.

#### Synchronous vs Asynchronous Listeners

EventEmitter executes listeners **synchronously** by default.

A slow listener blocks the event loop and all subsequent events.

**Bad (blocks event loop):**

```js
myEmitter.on("data", data => {
  // Heavy sync work
  parseHugeJSON(data);
});
```

**Good (non-blocking):**

```js
myEmitter.on("data", data => {
  setImmediate(() => {
    parseHugeJSON(data);
  });
});
```

#### Too Many Listeners

Default limit: 10 listeners per event. Exceeding it emits a warning (possible memory leak).

**Consequences:**

- Memory leaks

- Slower garbage collection

**Solutions:**

```js
// Remove limit (use carefully)
emitter.setMaxListeners(0);
// Best practices
emitter.once("event", handler); // Auto-removes after first trigger
emitter.removeListener("event", handler);
emitter.removeAllListeners("event");
```

### Handling Thousands of Concurrent Connections

Connections include:

- HTTP requests

- WebSocket clients

- TCP sockets

- Database connections

- Streaming clients

Each connection stays open, holds state, and emits many events.

**Bad pattern (blocks event loop):**

```js
socket.on("message", data => {
  parseHugeJSON(data); // Blocks everything
});
```

#### Best Practices for High Concurrency

1. **Queue heavy work**

   ```js
   socket.on("message", data => {
     taskQueue.push(() => parseHugeJSON(data));
   });
   ```

2. **Use streams for large data**

   - Process data in chunks instead of loading entirely into memory.

3. **Offload CPU-intensive work**

   - Use worker threads for parsing, encryption, etc.

4. **Keep listeners lightweight**

   - Only queue or schedule work; never do heavy sync operations.

Following these patterns allows a single Node.js process to handle tens of thousands of concurrent connections efficiently without blocking the event loop.
