---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: Utility Types in TypeScript
featured: false
tags:
  - typescript
  - utility-types
  - advanced-typescript
description: Overview of built-in TypeScript utility types (Partial, Required, Readonly, Pick, Omit) and how to create custom ones using mapped types.
ogImage: ""
readingTime: "5 min"
---

# Utility Types in TypeScript

Utility types are predefined "type functions" that transform existing types to create new ones. They come built-in with TypeScript and solve common type manipulation problems.

## Common Built-in Utility Types

### Partial<T>

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

### Required<T>

Makes all properties of a type required (opposite of `Partial`).

```ts
interface ICar {
  company?: string;
  color: string;
}

type TCompleteCar = Required<ICar>;
// Result: { company: string; color: string; }
```

### Readonly<T>

Makes all properties of a type immutable (read-only).

```ts
interface IConfig {
  creds: string;
  secret_key: string;
}

type TReadonlyConfig = Readonly<IConfig>;
// Result: { readonly creds: string; readonly secret_key: string; }
```

### Pick<T, K>

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

### Omit<T, K>

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

## How Utility Types Work – Mapped Types

Most utility types are built using **mapped types**.

A mapped type loops over the keys of an existing type and transforms each property according to a rule.

Basic pattern:

```ts
type Transformed<T> = {
  [Property in keyof T /* transformation */]: T[Property];
};
```

## Creating Custom Utility Types

### Custom Pick

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

### Custom Omit (using `as` clause)

```ts
type MyOmit<T, K extends keyof T> = {
  [Property in keyof T as Property extends K ? never : Property]: T[Property];
};
```

- `as` clause lets you filter or rename keys
- `never` removes the property (TypeScript excludes keys mapped to `never`)

### Generate Event Handler Properties

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
//   onClick:  (event: MouseEvent) => void;
//   onFocus:  (event: FocusEvent) => void;
//   onInput:  (event: InputEvent) => void;
// }
```

### Deep Partial (recursive optional)

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

## References

[Building Custom TypeScript Utility Types: A Beginner's Guide to Advanced Patterns](https://www.explainthis.io/en/swe/typescript/12-advanced-utility-types)
