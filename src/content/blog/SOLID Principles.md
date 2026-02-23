---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: SOLID Principles
featured: false
tags:
  - solid
  - clean-architecture
  - software-design
  - oop
description: Summary of the five SOLID principles - Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
ogImage: ""
readingTime: "6 min"
---

## Single Responsibility Principle (SRP)

A module should have one, and only one, reason to change.

Better phrasing: A module should be responsible to one, and only one, actor.

An **actor** is a user, stakeholder, or stakeholder group with distinct business interests.

### Symptoms of Violation

#### Accidental Duplication

Example: `Employee` class with:

- `calculatePay()` — used by CFO
- `reportHours()` — used by COO
- `save()` — used by CTO

Shared helper `regularHours()` changed for CFO breaks COO reports silently.

#### Merges

Frequent merge conflicts when different actors' teams edit the same file.

## Open-Closed Principle (OCP)

A software artifact should be open for extension but closed for modification.

Small requirement changes should not force large modifications.

Goal: protect high-level policies (business logic) from low-level changes (UI, database, frameworks).

Interactor (core business logic) should remain untouched by changes in database, controller, presenter, or view.

### OCP Example – Payment Processor

```ts
abstract class PaymentProcessor {
  abstract process(amount: number): void;
}

class CreditCardPaymentProcessor extends PaymentProcessor {
  process(amount: number): void {
    console.log(`Processing payment of ${amount} via credit card`);
  }
}

class PaypalPaymentProcessor extends PaymentProcessor {
  process(amount: number): void {
    console.log(`Processing payment of ${amount} via PayPal`);
  }
}

const creditCard = new CreditCardPaymentProcessor();
const paypal = new PaypalPaymentProcessor();

creditCard.process(100);
paypal.process(200);
```

New payment methods added via new subclasses — no changes to existing code.

## Liskov Substitution Principle (LSP)

Subtypes must be substitutable for their base types without breaking program correctness.

Derived class must preserve behavioral expectations (preconditions, postconditions, invariants) of the base class.

## Interface Segregation Principle (ISP)

Clients should not be forced to depend on methods they do not use.

Large ("fat") interfaces should be split into smaller, client-specific ones.

### ISP Example

Bad:

```ts
interface OrderService {
  orderBurger(quantity: number): void;
  orderFries(quantity: number): void;
  orderCombo(burgers: number, fries: number): void;
}
```

Better:

```ts
interface BurgerOrderService {
  orderBurger(quantity: number): void;
}

interface FriesOrderService {
  orderFries(quantity: number): void;
}

interface ComboOrderService {
  orderCombo(burgers: number, fries: number): void;
}
```

## Dependency Inversion Principle (DIP)

High-level modules should not depend on low-level modules. Both should depend on abstractions.

Abstractions should not depend on details. Details should depend on abstractions.

Enables swapping implementations (e.g., database change) without modifying business logic.

Foundation for achieving OCP and SRP in practice.
