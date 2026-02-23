---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: Design Patterns in Node.js
featured: false
tags:
  - design-patterns
  - nodejs
  - software-architecture
description: Overview of design patterns in Node.js — creational, structural, behavioral categories with focus on Singleton, Factory, Builder, Adapter, Decorator, Facade, Proxy, Observer, Command, Chain of Responsibility, and Strategy pattern examples.
ogImage: ""
readingTime: "6 min"
---

# Design Patterns in Node.js

Design patterns are reusable blueprints that solve common recurring design problems in software development.

They fall into three main categories: **Creational**, **Structural**, and **Behavioral**.

## Creational Patterns

(Concerned with object creation mechanisms)

### Singleton

Ensures a class has only one instance and provides a global point of access.  
Useful when exactly one object should coordinate actions across the system (e.g., configuration manager, logger, database connection pool).

### Factory

Defines an interface for creating objects but lets subclasses decide which class to instantiate.  
Useful when the exact type of object is determined at runtime.

### Builder

Separates the construction of a complex object from its representation.  
Allows step-by-step construction of objects (useful for objects with many optional parameters).

## Structural Patterns

(Concerned with class and object composition)

### Adapter

Converts the interface of a class into another interface clients expect.  
Allows incompatible classes to work together (e.g., wrapping legacy APIs).

### Decorator

Attaches additional responsibilities to an object dynamically.  
Provides flexible alternative to subclassing for extending functionality.

### Facade

Provides a simplified interface to a complex subsystem.  
Hides internal complexity and makes the subsystem easier to use.

### Proxy

Provides a surrogate or placeholder for another object to control access to it.  
Common uses: lazy loading, access control, logging, caching.

## Behavioral Patterns

(Concerned with communication between objects)

### Observer

Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.  
Solves: "One event triggers many unrelated side effects".  
Guarantees loose coupling and easy extension.  
Node.js built-in: `EventEmitter` is the classic Observer implementation.

### Command

Encapsulates a request as an object, thereby allowing parameterization of clients with different requests, queuing, logging, and undoable operations.

### Chain of Responsibility

Passes a request along a chain of handlers. Each handler decides either to process the request or pass it to the next handler.

### Strategy

Defines a family of algorithms, encapsulates each one, and makes them interchangeable.  
Goal: Separate "what to do" (goal) from "how to do it" (implementation).  
Algorithms become interchangeable without changing the caller.

**Bad (tight coupling):**

```ts
function pay(amount: number, method: string) {
  if (method === "stripe") {
    stripe.charge(amount);
  } else if (method === "khalti") {
    khalti.pay(amount);
  } else if (method === "paypal") {
    paypal.send(amount);
  }
}
```

Adding a new payment method forces changes to the `pay` function.

**Good (Strategy + Dependency Inversion + Liskov Substitution):**

```ts
interface PaymentStrategy {
  pay(amount: number): Promise<void>;
}

class StripePayment implements PaymentStrategy {
  async pay(amount: number) {
    await stripe.charge(amount);
  }
}

class KhaltiPayment implements PaymentStrategy {
  async pay(amount: number) {
    await khalti.charge(amount);
  }
}

class PaymentService {
  constructor(private strategy: PaymentStrategy) {}

  async pay(amount: number) {
    return this.strategy.pay(amount);
  }
}

// Usage
const payment = new PaymentService(new StripePayment());
await payment.pay(100);
```

Benefits:

- Open for extension (add new strategy class)
- Closed for modification (core logic unchanged)
- Strategies interchangeable via dependency injection

## Uncaught Exceptions in Node.js

In asynchronous code (callbacks, promises), unhandled errors can bubble up to the event loop and crash the process.

**Problem:**  
Error context is lost → cannot handle in the same place it occurred → application crashes unpredictably.

**Solution:**  
Always handle errors in the same context where they occur.

```js
// Bad - uncaught rejection can crash process
someAsyncOperation().then(() => {
  // ...
});

// Good
someAsyncOperation()
  .then(() => {
    /* ... */
  })
  .catch(err => {
    console.error("Handled error:", err);
    // recover or log
  });
```

Use domains (legacy), `process.on('uncaughtException')` (last resort), or better: proper try/catch + `.catch()` everywhere.
