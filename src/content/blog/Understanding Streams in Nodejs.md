---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: Understanding Streams in Nodejs
featured: false
tags:
  - nodejs
  - streams
description: Complete guide to Node.js streams types, pipe method, backpressure, flowing vs paused modes, and practical examples for reading, writing, and streaming files
ogImage: ""
readingTime: "6 min"
---

# Understanding Streams in Node.js

Streams handle data piece by piece (in chunks) instead of loading everything into memory at once. They are essential for efficient I/O operations, especially with large files, network data, or real-time processing.

## Types of Streams

### Readable Stream

Sources of data you can read from (files, HTTP requests, etc.).  
Emits `'data'` events when chunks are available and `'end'` when finished.

### Writable Stream

Destinations to write data to (files, HTTP responses, etc.).

### Duplex Stream

Can be both read from and written to (TCP sockets, WebSockets).

### Transform Stream

Special duplex streams that modify data as it passes through (compression with zlib, CSV parsing, etc.).

#### PassThrough Stream

A transform stream that passes data through unchanged. Useful for testing or as a simple proxy.

**Why use streams?**

- Automatically handle **backpressure** — if the consumer is slow, the producer pauses.
- Memory efficient for large data.
- Enable pause/resume control.
- Support real-time processing.

## The `.pipe()` Method

`.pipe()` connects a readable stream to a writable (or transform) stream.  
It automatically handles backpressure: pauses the source when the destination is full.

```js
readable.pipe(writable);
```

## Stream Operating Modes

- **Flowing mode** — data flows automatically as soon as it is available (default after adding a `'data'` listener).
- **Paused mode** — you must explicitly call `.read()` to pull data.

## When to Use Streams Instead of `fs.readFile` / `fs.writeFile`

Use streams when:

- Files are large (> few hundred MB)
- You need to process data as it arrives
- You want pause/resume capability
- You are dealing with network responses/requests
- Memory usage must stay low

`fs.readFile` and `fs.writeFile` load the entire file into memory → risk of OOM errors on big files.

## Reading Files with Streams

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

## Writing Files with Streams

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

## Copying Files with `.pipe()`

```js
import fs from "node:fs";

const source = fs.createReadStream("./assets/users.json");
const dest = fs.createWriteStream("./assets/user2.json");

source.pipe(dest); // handles backpressure automatically

source.on("end", () => {
  console.log("File copy completed.");
});
```

## Streaming an Image from S3 Bucket to Frontend

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

## References

[How to Use Node.js Streams for Efficient File Handling](https://jsdev.space/howto/nodejs-streams-efficient-file-handling/)
