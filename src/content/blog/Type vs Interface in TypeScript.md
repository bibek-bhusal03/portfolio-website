---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: Type vs Interface in TypeScript
featured: false
tags:
  - typescript
  - type
  - interface
description: Detailed comparison of type aliases and interfaces in TypeScript, covering merging, extending, unions, performance, and best use cases.
ogImage: ""
readingTime: "5 min"
---

# Type vs Interface in TypeScript: Key Differences

Main difference lies in flexibility and usage.

## Type Merging

In type aliases, use the intersection operator `&` to merge types.

```ts
type InputType = {
  inputNumber: number;
  inputString: string;
};

type User = {
  id: string;
  name: string;
};

// type merging with intersection operator
function printUserInput(input: InputType & User) {
  console.log(input);
}

printUserInput({
  id: "23r4",
  inputNumber: 334,
  inputString: "wow",
  name: "harey",
});
```

In interfaces, use declaration merging.

```ts
interface Client {
  name: string;
}

interface Client {
  age: number;
}
```

Declaration merging is particularly useful when extending a third-party library's type definition to fit the needs of a particular project.

## Extends vs Intersection

Interface can extend one or more interfaces using the `extends` keyword. A new interface inherits all properties and methods of an existing interface while adding new ones.

```ts
interface VIPClient extends Client {
  benefits: string[];
}
```

To achieve similar results with type aliases, use the intersection operator:

```ts
type VIPClient = Client & { benefits: string[] };
```

## Handling Property Conflicts When Extending

Interfaces detect property or method name conflicts at compile time and throw an error if the same name is used with incompatible types.

Type intersections merge properties without throwing errors. This makes type aliases better for function overloading.

```ts
type Person = {
  getPermission: (id: string) => string;
};

type Staff = Person & {
  getPermission: (id: string[]) => string[];
};
```

The above example works perfectly with type aliases but causes an error with interfaces.

## Prefer `extends` over Intersection

TypeScript usually displays the structure of interfaces clearly in error messages, even when many interfaces are combined.

With intersections like `A = B & C;` and then `D = A & E;`, TypeScript can struggle to display the combined type, making error messages harder to understand.

TypeScript caches the evaluated relationship between interfaces, which can be referenced later. Intersections are re-evaluated every time they are used, which can lead to performance issues in large codebases.

## Implementing Classes

Classes can implement either interfaces or type aliases, but cannot implement a union type.

## Type Alias Use Cases

Type aliases are mainly used to create aliases for primitive data types (string, number, boolean) as well as complex types.

### When to Prefer Type over Interface

#### Aliasing Primitive Types

Interfaces cannot alias primitive types; they can only describe object shapes.

```ts
type Address = string;
```

#### Using Union Types

Union types describe data that can be one of several types. They can combine primitive, complex, or literal types. Only type aliases support union types directly.

```ts
interface CarBattery {
  power: number;
}

interface Engine {
  type: string;
}

type HybridCar = Engine | CarBattery;
```

#### Defining Functions

Type aliases provide shorter, more readable syntax for function types.

```ts
type AddFn = (num1: number, num2: number) => number;

interface IAdd {
  (num1: number, num2: number): number;
}
```

## Quick Reference: Type vs Interface

| Feature              | Type                  | Interface           |
| -------------------- | --------------------- | ------------------- |
| Primitive aliasing   | Yes                   | No                  |
| Union types          | Yes                   | No                  |
| Intersection (`&`)   | Yes                   | Yes (via extends)   |
| Declaration merging  | No                    | Yes                 |
| Function overloading | Better                | Errors on conflicts |
| Class implementation | Yes                   | Yes                 |
| Error messages       | Complex               | Clearer             |
| Performance          | Re-evaluated each use | Cached              |

## References

[Types vs. interfaces in TypeScript - LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/)
