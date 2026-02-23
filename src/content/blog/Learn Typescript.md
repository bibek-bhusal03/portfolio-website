---
author: Bibek Bhusal
pubDatetime: 2026-02-17T17:05:00Z
title: Learn TypeScript
featured: false
tags:
  - typescript
  - generics
  - type-safety
  - utility-types
  - advanced-typescript
  - type
  - interface
description: Comprehensive guide to advanced TypeScript features, including generics for reusability and type safety, built-in and custom utility types, a detailed comparison of type aliases versus interfaces, structural typing and duck typing, tuples, unknown vs any types, and record vs index signatures.
ogImage: ""
readingTime: "20 min"
---

This guide covers key advanced concepts in TypeScript to help you build more flexible, maintainable, and type-safe code.

## Generics

Generic types allow you to create flexible and reusable components in TypeScript.

### Why Generics Are Powerful

#### Code Reusability

Generics let you write functions, classes, or interfaces that work with multiple data types without duplicating code.

```ts
function identify<T>(input: T): T {
  return input;
}
console.log(identify<string>("hello"));
```

#### Type Safety

Generics preserve full type checking while allowing the component to work with different types.

#### Avoiding Redundancy

You avoid writing nearly identical functions or classes for each specific type.

### Basic Syntax

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

### Constraints

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

#### References for Generics

[What are generics in TypeScript - why use them, how do they work with code examples - DEV Community](https://dev.to/codeparrot/what-are-generics-in-typescript-why-use-them-how-do-they-work-with-code-examples-4hl1)

## Utility Types

Utility types are predefined "type functions" that transform existing types to create new ones. They come built-in with TypeScript and solve common type manipulation problems.

### Common Built-in Utility Types

#### Partial<T>

Makes all properties of a type optional.

```ts
interface IUser {
  name: string;
  age: string;
  address: string;
}
type TPartialUser = Partial<IUser>;
// Result: { name?: string; age?: string; address?: string; }
```

#### Required<T>

Makes all properties of a type required (opposite of `Partial`).

```ts
interface ICar {
  company?: string;
  color: string;
}
type TCompleteCar = Required<ICar>;
// Result: { company: string; color: string; }
```

#### Readonly<T>

Makes all properties of a type immutable (read-only).

```ts
interface IConfig {
  creds: string;
  secret_key: string;
}
type TReadonlyConfig = Readonly<IConfig>;
// Result: { readonly creds: string; readonly secret_key: string; }
```

#### Pick<T, K>

Creates a new type by selecting a subset of properties.

```ts
interface ICollege {
  title: string;
  address: string;
  university_affiliated: string;
}
type TICollege = Pick<ICollege, "title" | "address">;
// Result: { title: string; address: string; }
```

#### Omit<T, K>

Creates a new type by removing specified properties.

```ts
interface ICollege {
  title: string;
  address: string;
  university_affiliated: string;
}
type TICollege = Omit<ICollege, "university_affiliated">;
// Result: { title: string; address: string; }
```

### How Utility Types Work – Mapped Types

Most utility types are built using **mapped types**.

A mapped type loops over the keys of an existing type and transforms each property according to a rule.

Basic pattern:

```ts
type Transformed<T> = {
  [Property in keyof T /* transformation */]: T[Property];
};
```

### Creating Custom Utility Types

#### Custom Pick

```ts
type MyPick<T, K extends keyof T> = {
  [Property in K]: T[Property];
};
type TUser = {
  id: string;
  name: string;
  address: string;
  password: string;
};
type PublicUser = MyPick<TUser, "id" | "name" | "address">;
// Result: { id: string; name: string; address: string; }
```

#### Custom Omit (using `as` clause)

```ts
type MyOmit<T, K extends keyof T> = {
  [Property in keyof T as Property extends K ? never : Property]: T[Property];
};
```

- `as` clause lets you filter or rename keys

- `never` removes the property (TypeScript excludes keys mapped to `never`)

#### Generate Event Handler Properties

```ts
type EventMap = {
  click: MouseEvent;
  focus: FocusEvent;
  input: InputEvent;
};
type EventHandlers = {
  [EventName in keyof EventMap as `on${Capitalize<string & EventName>}`]: (
    event: EventMap[EventName]
  ) => void;
};
// Result:
// {
// onClick: (event: MouseEvent) => void;
// onFocus: (event: FocusEvent) => void;
// onInput: (event: InputEvent) => void;
// }
```

#### Deep Partial (recursive optional)

```ts
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
interface AppConfig {
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
  api: {
    version: string;
    timeout: number;
  };
}
type PartialConfig = DeepPartial<AppConfig>;
```

Now all properties at any depth are optional.

#### References for Utility Types

[Building Custom TypeScript Utility Types: A Beginner's Guide to Advanced Patterns](https://www.explainthis.io/en/swe/typescript/12-advanced-utility-types)

## Record vs Index Signature

### Record Utility Type

It `Record<K, V>` is a declarative, explicit way to say:

'I want a object where the set of keys is exactly K and each key maps to value of V'

```ts
type Role = 'admin' | 'user'
type permission = Record<Role, string[]>
```

Here, record constructs a type with a set of properties K of type T. It gives us strongly typed keys. TypesScript will ensure all keys in Role exist as keys and now other keys sneaks in. It is great for finite key sets.

### Index Signatures

They are a bit looser, they say:

'I want a object whose key can be string (or number/symbol), and each values looks like V'

```ts
type permission = {
  [role: string] : string[]
```

These are great for unknown / arbitrary keys.

The differences are:

- Record enforces fixed key set but index signature don't.

- Record is great for finite set of keys but not for unknown or arbitrary keys.

## Structural Typing Model

Typescript uses structural typing model which means compatibility of types depends upon it's structure ( i.e. properties and methods) rather than their explicit names or declaration

### Duck Typing

Structural typing model has another name, duck typing. The main principle behind the name is:

_if it walks like a duck and quacks like a duck, it's a duck_

## Tuple

Tuple extends the capability of array in typescript. With tuple, we can create special kind of arrays with elements of fixed type with respect to an index or position. With tuples we can define data types that be stored in every position of in an array.

- fixed lengthed sequence which allows to define an ordered collection of elements

- uses: to represent sequence of values such as rgb colors, coordinates (x, y). This fixed lenght ensures the value has right numbers of elements in the tuples.

## Unknown vs Any

We give unknown type to those data whose data type we don't know yet. We cannot assign unknown type to other type before type narrowing.

We use it when working with external data like user input, api response, etc.

For eg:

```ts
let x : any = 4;
let y : unknown = 8
let s1: string = x;
let s2: string = y;
// s2 shows error 'unknown' not assignable to string
```

First we have to narrow the type of y before we can safely assign it. For eg:

```ts
let x : any = 4;
let y : unknown = 8
if(typeof y ==='string') {
  let s2: string = y; //work perfectly now
}
let s1: string = x;
```

We use any type when we do not care about type safety or just don't know the type. Like when prototyping or when migrating old JS code to TS.

## Type vs Interface: Key Differences

Main difference lies in flexibility and usage.

### Type Merging

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

### Extends vs Intersection

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

### Handling Property Conflicts When Extending

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

### Prefer `extends` over Intersection

TypeScript usually displays the structure of interfaces clearly in error messages, even when many interfaces are combined.

With intersections like `A = B & C;` and then `D = A & E;`, TypeScript can struggle to display the combined type, making error messages harder to understand.

TypeScript caches the evaluated relationship between interfaces, which can be referenced later. Intersections are re-evaluated every time they are used, which can lead to performance issues in large codebases.

### Implementing Classes

Classes can implement either interfaces or type aliases, but cannot implement a union type.

### Type Alias Use Cases

Type aliases are mainly used to create aliases for primitive data types (string, number, boolean) as well as complex types.

#### When to Prefer Type over Interface

##### Aliasing Primitive Types

Interfaces cannot alias primitive types; they can only describe object shapes.

```ts
type Address = string;
```

##### Using Union Types

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

##### Defining Functions

Type aliases provide shorter, more readable syntax for function types.

```ts
type AddFn = (num1: number, num2: number) => number;
interface IAdd {
  (num1: number, num2: number): number;
}
```

### Quick Reference: Type vs Interface

| Feature | Type | Interface |
| -------------------- | --------------------- | ------------------- |
| Primitive aliasing | Yes | No |
| Union types | Yes | No |
| Intersection (`&`) | Yes | Yes (via extends) |
| Declaration merging | No | Yes |
| Function overloading | Better | Errors on conflicts |
| Class implementation | Yes | Yes |
| Error messages | Complex | Clearer |
| Performance | Re-evaluated each use | Cached |

#### References for Type vs Interface

[Types vs. interfaces in TypeScript - LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/)
