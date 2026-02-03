---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: Express.js – What It Is and How It Works
featured: false
tags:
  - express
  - nodejs
  - web-framework
description: Introduction to Express.js, its role as a Node.js framework, middleware system, routing, and key concepts like Inversion of Control, req.body, and template rendering.
ogImage: ""
readingTime: "6 min"
---

# Express.js – What It Is and How It Works

Express is a minimal and flexible web framework for Node.js that simplifies building APIs, handling routes, processing requests, and managing middleware.

## What Is a Framework?

A framework provides a pre-built structure, libraries, and tools to build applications faster.  
Unlike libraries (which you call when needed), frameworks control the flow and call your code when appropriate — this is **Inversion of Control (IoC)**.

**Without a framework** (manual HTTP server):

```js
const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === "GET" && parsedUrl.pathname === "/users") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify([{ name: "Alice" }, { name: "Bob" }]));
  } else if (req.method === "POST" && parsedUrl.pathname === "/users") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const user = JSON.parse(body);
      res.writeHead(201);
      res.end("User created");
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000, () => console.log("Server running on port 3000"));
```

**With Express** (simplified pseudo-code):

```js
function express() {
  const middlewares = [];

  function app(req, res) {
    let index = 0;
    function next() {
      const middleware = middlewares[index++];
      if (!middleware) return res.status(404).end("Not Found");
      middleware(req, res, next);
    }
    next();
  }

  app.use = fn => middlewares.push(fn);

  app.get = (path, handler) => {
    app.use((req, res, next) => {
      if (req.method === "GET" && req.url === path) return handler(req, res);
      next();
    });
  };

  app.listen = (port, callback) => {
    require("http").createServer(app).listen(port, callback);
  };

  return app;
}
```

## Core Concepts in Express

### Inversion of Control (IoC)

You define handlers; Express decides when to call them.

```js
app.get("/users", (req, res) => {
  res.send("List of users");
});
```

Express controls flow: when a GET request to `/users` arrives, it invokes your handler.

### Middleware

Middleware functions have access to `req`, `res`, and `next`.  
They can modify request/response or pass control to the next middleware.

```js
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses form data
```

### req.body

`express.json()` → parses JSON payloads into `req.body`.  
`express.urlencoded()` → parses URL-encoded form data into `req.body`.

### Routing

Express provides simple routing methods:

```js
app.get("/users", (req, res) => {
  /* ... */
});
app.post("/users", (req, res) => {
  /* ... */
});
```

Route parameters:

```js
app.get("/users/:id", (req, res) => {
  const userId = req.params.id; // e.g., "123"
});
```

### Router

Create modular route handlers:

```js
const router = express.Router();
router.get("/books", (req, res) => {
  /* ... */
});
app.use("/api", router);
```

### Template Engines & res.render()

`res.render(view, locals)` renders HTML templates (e.g., Pug, EJS).

```js
app.set("view engine", "pug");
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});
```

### populate (in Mongoose)

`populate()` replaces referenced ObjectIds with actual documents.

```js
BookInstance.findById(id).populate("book");
```

### Debugging

`DEBUG=express:* node app.js` → shows detailed logs.

## Why Use Express?

- Reduces boilerplate compared to raw `http` module
- Provides robust middleware system
- Easy routing and request/response handling
- Huge ecosystem of middleware packages

You can build servers without Express, but it saves time and enforces clean structure.
