---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: Generics in TypeScript
featured: false
tags:
  - typescript
  - generics
  - type-safety
description: Introduction to generics in TypeScript — basic syntax, constraints, reusability and type safety.
ogImage: ""
readingTime: "4 min"
---

# Generics in TypeScript

Generic types allow you to create flexible and reusable components in TypeScript.

## Why Generics Are Powerful

### Code Reusability

Generics let you write functions, classes, or interfaces that work with multiple data types without duplicating code.

```ts
function identify<T>(input: T): T {
  return input;
}

console.log(identify<string>("hello"));
```

### Type Safety

Generics preserve full type checking while allowing the component to work with different types.

### Avoiding Redundancy

You avoid writing nearly identical functions or classes for each specific type.

## Basic Syntax of Generics

```ts
function identify<T>(value: T): T {
  return value;
}
```

The placeholder `<T>` (commonly used to mean "Type") represents any type.  
This allows functions, classes, or interfaces to operate on various types while maintaining type safety.

You can explicitly specify the type when calling:

```ts
identify<string>("hello"); // T = string
identify<number>(42); // T = number
identify<boolean>(true); // T = boolean
```

TypeScript often infers the type automatically:

```ts
identify("hello"); // inferred as string
```

## Generic Constraints

You can restrict the types a generic can accept using the `extends` keyword.

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const car = { name: "ferrari", year: 2023 };

console.log(getProperty(car, "year")); // 2023
console.log(getProperty(car, "name")); // "ferrari"

// console.log(getProperty(car, "color"));
// Error: Argument of type '"color"' is not assignable to parameter of type '"name" | "year"'
```

Explanation:

- `K extends keyof T` → K must be one of the keys of T
- `keyof T` produces a union of all property keys of type T
- For `T = { name: string; year: number }`, `keyof T = "name" | "year"`

This guarantees the key exists on the object, preventing runtime errors.

## References

[What are generics in TypeScript - why use them, how do they work with code examples - DEV Community](https://dev.to/codeparrot/what-are-generics-in-typescript-why-use-them-how-do-they-work-with-code-examples-4hl1)
