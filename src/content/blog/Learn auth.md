---
author: "Bibek Bhusal"
pubDatetime: 2026-02-18T12:00:00Z
title: "Learning Authentication: RBAC, ABAC, OAuth, and OIDC"
featured: false
tags:
  - "authentication"
  - "rbac"
  - "abac"
  - "oauth"
  - "oidc"
description: "A guide to authentication and authorization fundamentals, covering RBAC vs ABAC, OAuth flows, and OpenID Connect (OIDC) with examples and comparisons."
ogImage: ""
readingTime: "7 min"
---

# Learning Authentication: RBAC, ABAC, OAuth, and OIDC

This blog delves into key concepts in authentication and authorization, comparing RBAC and ABAC, explaining OAuth flows, and detailing how OIDC builds upon OAuth for identity management.

## RBAC vs ABAC

### Role Based Access Control

Access is granted based on predefined roles assigned to users

#### Core Idea

User -> Role -> Permissions

#### Role Example

- Role: Admin -> Can create, read, update, delete users
- Role: Editor -> Can update content
- Role: Viewer -> Can only read

#### Pros

- Simple mental model
- Fast authorization checks
- Easy auditing
  > Auditing here refers to the act of reviewing and tracking the access control activities and permissions assigned to different users or roles.

#### Cons

- Role explosion (too many roles over time)
- Now flexible for dynamic conditions
- Hard to handle context based rules

### Attribute Based Access Control

Access is granted based on attributes and policies.

#### Core Idea

Access decision = function(user attributes, resource attributes, action, environment)

#### Attributes Examples

- User: department = HR, clearance=3
- Resource: type = document, sensitivity = 2
- Environment: time = 9 AM, location = office

#### Policy Example

- Allow access if `user.department == resource.department AND user.clearance >= resource.sensitivity`

#### Pros

- Highly flexible
- Avoids role explosion
- Fine-grained control
- Supports dynamic policies

#### Cons

- Harder to debug
- Policy management complexity
- Performance [[Overhead | overhead]] (additional computational resources required to evaluate access control decisions based on dynamic attributes, policies, and context).

## OAuth

OAuth is an authentication framework. It's about giving a third-party app permission to act on your behalf without giving them your password.

### OAuth Flow

#### Authorization

The user logs into Google and gives your app permission

#### The Code

Googles sends temporary Authorization code to your backend

#### The Exchange

Your backend sends that code and your client secret (the secret to confirm your server's identity the request was made from your server)

#### The Handshake

Google sends 2 important tokens:

- Access Token: Short-lived token to get data (email, name) from Google
- Refresh Token: Long-lived, to get a new Access Token when the old one dies.

**How they gain access to your system:**
Once we have the user's email from Google, we can check the database:

- If the user exists: You log them in
- If the user is new: We create a new account for them
- The session: You then issue your own session cookie or JWT. The user is now "logged in" to our app, independent of Google connection.

## OIDC

OpenID Connect (OIDC) is an identity layer built on top of OAuth 2.0.
OAuth is for Authorization (what you can access)
OIDC is fro Authentication (what your identity is)
What OIDC adds on Top of OAuth

1. ID Token (JWT)
2. UserInfo endpoint
3. Standard identity scopes (openid, profile, email)
4. Discovery document
5. Standardized login flow

### How OpenID Connect Work ?

OIDC follows this standarized flow:

- Initiation: A user attempts to login into an application and selects a "Sign into with ..." option.
- Redirect: The application redirects the user to OpenID Provider(OP) with an `openid` scope request.
- Authentication: The user logs into OP directly (e.g., entering a password on google's site), ensuring their credentials never touch the relying party (the application)
- Token Issuance: Upon success, the OP sends an ID Token (and usually an Access Token) back to the RP.
- Validation: The RP validates the ID Token tho confirm the user's identity and then grants access.
