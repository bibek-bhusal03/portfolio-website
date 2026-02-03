---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: Custom Events in Node.js
featured: false
tags:
  - nodejs
  - events
  - eventemitter
description: Guide to Node.js custom events using EventEmitter — core concepts, examples, performance impacts, best practices, and handling high-concurrency scenarios.
ogImage: ""
readingTime: "5 min"
---

# Custom Events in Node.js

Node.js is event-driven and relies on the event loop for asynchronous operations. The core of its event system is the `EventEmitter` class from the `events` module.

## Core Concepts

- **Events** — Named signals (e.g., `"userLoggedIn"`).
- **Listeners/Handlers** — Functions executed when an event occurs.
- **Emitter** — Object that emits events.

### Basic Example

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

## Performance Impact of Different Approaches

### EventEmitter vs Direct Function Calls

| Factor     | Direct Call | EventEmitter            |
| ---------- | ----------- | ----------------------- |
| Speed      | Faster      | Slower                  |
| Overhead   | Minimal     | Extra abstraction layer |
| Decoupling | Tight       | Loose                   |
| Scaling    | Low         | High                    |

#### When to Use EventEmitter

- Multiple components need to react to the same event.
- You want extensibility (plugins, hooks).

#### When to Avoid EventEmitter

- Performance-critical hot paths (called many times per second).
- Simple one-to-one logic.

### Synchronous vs Asynchronous Listeners

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

### Too Many Listeners

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

## Handling Thousands of Concurrent Connections

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

### Best Practices for High Concurrency

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
