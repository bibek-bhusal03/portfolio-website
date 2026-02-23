---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: Proper Error Handling in Express.js
featured: false
tags:
  - express
  - error-handling
  - nodejs
  - best-practices
description: Why ad-hoc error handling fails and how to implement centralized, consistent, secure error handling in Express using custom error classes and middleware.
ogImage: ""
readingTime: "4 min"
---

## Problems with Ad-hoc Error Handling

### Inconsistent Responses

Error format varies across controllers:

```ts
// One route
res.status(404).json({ error: "User not found" });

// Another route
res.status(500).json({ message: "Internal server error" });
```

Frontend developers must handle multiple shapes.

### Unmaintainable

Changing error format, logging, or status codes requires updating every controller.

### Insecure

Stack traces, database errors, or internal details leak to clients.

### Hard to Debug

Error logic scattered → searching multiple files to understand behavior.

## Correct Approach

Treat errors as data, not control flow.  
Business logic throws domain errors → infrastructure layer translates to HTTP responses.

Goals:

- Consistent response format
- Single place to change behavior
- No repeated try/catch blocks
- No leaked sensitive information

### Step 1: Define Custom Error Classes

```ts
abstract class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = "Invalid request") {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// Add more as needed: ForbiddenError (403), ConflictError (409), etc.
```

### Step 2: Throw Errors in Business Logic

```ts
async function getUser(id: string) {
  const user = await userRepo.findById(id);
  if (!user) {
    throw new NotFoundError("User does not exist");
  }
  return user;
}
```

No need for try/catch in controllers unless you want custom recovery.

### Step 3: Centralized Error-Handling Middleware

Place this **after all routes**:

```ts
// Must have 4 parameters — Express recognizes it as error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Handle known application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Log unexpected errors (console, Winston, Sentry, etc.)
  console.error(err);

  // Generic fallback for unknown errors
  return res.status(500).json({
    error: "Internal server error",
  });
});
```

### Optional Enhancements

```ts
// Development-only detailed response
if (process.env.NODE_ENV !== "production") {
  return res.status(500).json({
    error: "Internal server error",
    message: err.message,
    stack: err.stack,
  });
}
```

Or use a library like `express-async-errors` to avoid try/catch in async routes entirely.

With this pattern:

- Uniform error responses
- One place to update format/logging
- No sensitive data leakage
- Cleaner controllers
- Easier debugging and maintenance---
  author: Bibek Bhusal
  pubDatetime: 2025-05-08T16:07:00Z
  title: Proper Error Handling in Express.js
  featured: false
  tags:
- express
- error-handling
- nodejs
- best-practices
  description: Why ad-hoc error handling fails and how to implement centralized, consistent, secure error handling in Express using custom error classes and middleware.
  ogImage: ""
  readingTime: "4 min"

---

# Proper Error Handling in Express.js

## Problems with Ad-hoc Error Handling

### Inconsistent Responses

Error format varies across controllers:

```ts
// One route
res.status(404).json({ error: "User not found" });

// Another route
res.status(500).json({ message: "Internal server error" });
```

Frontend developers must handle multiple shapes.

### Unmaintainable

Changing error format, logging, or status codes requires updating every controller.

### Insecure

Stack traces, database errors, or internal details leak to clients.

### Hard to Debug

Error logic scattered → searching multiple files to understand behavior.

## Correct Approach

Treat errors as data, not control flow.  
Business logic throws domain errors → infrastructure layer translates to HTTP responses.

Goals:

- Consistent response format
- Single place to change behavior
- No repeated try/catch blocks
- No leaked sensitive information

### Step 1: Define Custom Error Classes

```ts
abstract class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = "Invalid request") {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// Add more as needed: ForbiddenError (403), ConflictError (409), etc.
```

### Step 2: Throw Errors in Business Logic

```ts
async function getUser(id: string) {
  const user = await userRepo.findById(id);
  if (!user) {
    throw new NotFoundError("User does not exist");
  }
  return user;
}
```

No need for try/catch in controllers unless you want custom recovery.

### Step 3: Centralized Error-Handling Middleware

Place this **after all routes**:

```ts
// Must have 4 parameters — Express recognizes it as error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Handle known application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Log unexpected errors (console, Winston, Sentry, etc.)
  console.error(err);

  // Generic fallback for unknown errors
  return res.status(500).json({
    error: "Internal server error",
  });
});
```

### Optional Enhancements

```ts
// Development-only detailed response
if (process.env.NODE_ENV !== "production") {
  return res.status(500).json({
    error: "Internal server error",
    message: err.message,
    stack: err.stack,
  });
}
```

Or use a library like `express-async-errors` to avoid try/catch in async routes entirely.

With this pattern:

- Uniform error responses
- One place to update format/logging
- No sensitive data leakage
- Cleaner controllers
- Easier debugging and maintenance
