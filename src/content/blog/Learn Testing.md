---
author: "Bibek Bhusal"
pubDatetime: 2026-02-17
title: "Learning Software Testing: Unit, Integration, E2E, and API Testing"
featured: false
tags:
  - "testing"
  - "unit-testing"
  - "integration-testing"
  - "e2e-testing"
  - "api-testing"
description: "A guide to software testing fundamentals, covering unit tests, integration tests, end-to-end tests, and API testing strategies with examples."
ogImage: ""
readingTime: "8 min"
---

# Learning Software Testing: Unit, Integration, E2E, and API Testing

This blog explores key concepts in software testing, from isolated unit tests to comprehensive API validations. We'll cover the characteristics, best practices, and examples for each type.

## Unit Testing

A unit testing verifies one small piece of logic (a function/class) in isolation.
Here, unit means smallest testable behaviour, not the whole system.

### Features of Good Unit Testing

- Isolated (test only one unit. No DB, API, file system)
- Deterministic (same result every run)
- Fast (runs in millisecond)
- Clear intent (anyone reading can understand what behavior is verified)
- Test behaviour, not implementation (focuses on result, not internal variables)

### Features of Bad Unit Testing

- Tests on multiple things (hard to know what failed)
- Depends on DB/API
- Random values (fails sometimes)
- No assertion (verifies nothing)

```python
from math_utils import calculate_discount
import pytest
def test_calculate_correct_discount():
    assert calculate_discount(100, 10) == 90
```

```python
def calculate_discount(price, percent) -> float:
    if percent < 0 or percent > 100:
        raise ValueError("Invalid percent")
    return price - (price * percent) /100
```

How to test with mock

```python
import pytest
from utils.user_service import get_username
@pytest.mark.asyncio
async def test_get_username():
    async def fake_fetch(uid):
        return {"name": "Bibe"}

    name = await get_username(fake_fetch, "1")
    assert name == "Bibek"
```

```python
async def get_username(fetch_user, user_id: str):
    user = await fetch_user(user_id)
    return user["name"]
```

## Integration Testing

- In this, we test interactions between components.
- Its scope is API + database | API + external service
- Mocking is limited (e.g, real DB, mocked external services)
- Example: Test that API endpoint correctly saves to database

### Characteristics

- Verifies data flow between components
- Test business logic with real dependencies
- Isolate external systems with mocks/subs
- These are run in CI (Run tests on every PR and deployment) pipeline

## End-to-End (E2E) Tests

- Its purpose is to test complete user flows
- Its scope is UI -> API -> DB -> External services -> UI
- Its slower

### Characteristics

- Simulate real user scenarios
- Test entire system in production like environment
- Catch integration issues between all components

## API Testing

Test categories for apis:

### Functional

In this we test:

- Status codes
- Response structure
- Data structure
- Data accuracy

### Performance

In this, we test:

- Response time
- Throughput (how many request can an API handle per unit time)
- Load handling

### Security

In this, we test:

- Authentication
- Authorization
- Injection attacks

### Reliability

In this, we test:

- Error handling
- Rate limiting
- Retry logic

### Key API Testing Strategies

#### Positive Testing

Valid inputs with expected 2xx responses

#### Negative Testing

Invalid inputs, mal-informed data (4xx / 5xx)

#### Boundary Testing

Minimum/maximum values, pagination limits

#### Contract Testing

Ensuring API meets Open API specification

#### State Transition Testing

Multi-step workflows (e.g, create -> update -> delete)
