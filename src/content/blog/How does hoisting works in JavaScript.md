---
author: Bibek Bhusal
pubDatetime: 2025-06-30T15:45:00Z
title: Hoisting and Temporal Dead Zone in JavaScript
featured: false
tags:
  - javascript
  - web development
  - hoisting
  - temporal dead zone
description: Understanding JavaScript hoisting behavior with var, let, and const declarations, and exploring the concept of Temporal Dead Zone in modern JavaScript.
ogImage: "" 
readingTime: "4 min"
---

# Hoisting in JavaScript

## Hoisting of variables in JavaScript
The process of moving variable declaration to the top of their respective scope is known as hoisting. In JavaScript, variables are hoisted depending upon how the variables are declared.


**Var**:
Variables declared using var are hoisted to the top of their respective scope (block / function) with the default value for variable declared using var i.e undefined. Eg:

```js
console.log("Printing number before initilization", number);
var number = 10;
console.log("Number after", number);
//Printing number before initilization undefined
//Number after 10
```

**let or const**: 
Variable declared using let or const are also hoisted to the top of their respective scope (block/function) but they not initialized with any default value like undefined hence it will throw error.

```js
console.log("Printing number before initilization", number);
// ReferenceError: Cannot access 'number' before initialization
let number = 10;
console.log("Number after", number);
```

In previous error it gave 'printing before initilization undefined' but now it shows 'ReferenceError: Cannot access 'number' before initialization'. How does it now (when we are using let/const) know we have declared the variable? because of hoisting.

## Hoisting of function

The process of moving function declaration in the file while executing is known as hoisting.

# Temporal Dead Zone

This is the name for a period of time when variables declared using let or const are not accessible and shows reference error if accessed. In this period, JavaScript Engine knows about the variables due to hoisting, but as they are not initialized with any default value (like undefined) but cannot access them until they are declared.

```js
console.log(number)
// ReferenceError: Cannot access 'number' before initialization
let number = 10
console.log(number)
```

Here, number variable is in temporal dead zone where JavaScript knows of its existence due to hoisting but it cannot be accessed due to it being not initialized.

## References

[Hoisting in JavaScript with let and const – and How it Differs from var](https://www.freecodecamp.org/news/javascript-let-and-const-hoisting/)

[Var, Let, Const: Hoisting and Temporal Dead Zone in JavaScript | by Jérémy Levy | Medium](https://medium.com/@jeremy_levy/var-let-const-hoisting-and-temporal-dead-zone-in-javascript-d26e2207c823)