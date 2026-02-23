---
author: Bibek Bhusal
pubDatetime: 2025-01-27T00:00:00Z
title: Khalti Payment Gateway Integration Guide
featured: false
tags:
  - payment gateway
  - khalti
  - web development
  - api integration
  - fintech
description: Complete step-by-step guide to integrating Khalti payment gateway in your web application, covering setup, API requests, and payment verification.
ogImage: ""
readingTime: "6 min"
---

## Khalti Payment Gateway Integration Guide

Khalti provides payment gateway for web and SDKs for mobile application.

## Prerequisites

Before starting the integration, you'll need:

### Merchant Account

- **Sandbox**: Sign up at [test-admin.khalti.com](https://test-admin.khalti.com/) (use OTP `987654`). (can use dummy email and dummy phone number)
- **Production**: Use [admin.khalti.com](https://admin.khalti.com/).

### API Key

Get it from your Khalti merchant dashboard (sandbox/production).

## Step 1: Initiate Payment Request

Send a **POST** request to Khalti's API to start the payment process.

### API Endpoints

- **Sandbox**: `https://dev.khalti.com/api/v2/epayment/initiate/`
- **Production**: `https://khalti.com/api/v2/epayment/initiate/`

### Required Headers

You also have to have a extra headers, 'Authorization' whose value would be: key <your_secret_key>

```json
{
  "Authorization": "Key <put_your_secret_key_here>"
}
```

### Request Body Structure

And the body should have following structure and values:

```json
{
  "return_url": "https://your-website.com/payment-success",
  "website_url": "https://your-website.com",
  "amount": 1000,
  "purchase_order_id": "ORDER123",
  "purchase_order_name": "T-Shirt",
  "customer_info": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9800000000"
  },
  "merchant_name": "Your Store Name",
  "merchant_extra": "Additional metadata (optional)"
}
```

### Field Explanations

- **return_url** is the url the user will be redirected to when payment succeds, **website_url** is the base_url of your website
- **amount** is in paisa(needs a rupees to paisa converter)
- **purchase_order_id** is unique id we generate from our system, it can be anything(string, number), it would be great if it uniquely identifies the order in our system.
- **customer_info** is the information on user who is trying to pay or who we are trying to pay(it's optional)
- **merchant_name** is our organization's name & **merchant_extra** is additional information on our organization and is optional

### Successful Response

If the request is successful, we get the following response:

```json
{
  "pidx": "unique-payment-id",
  "payment_url": "https://pay.khalti.com/?pidx=...",
  "expires_at": "2023-12-31T23:59:59"
}
```

- **pidx** → is unique identifier provided by khalti(used to search certain payments through a api)
- **payment_url** → is the url where we should redirect our user to.

## Step 2: Handle Payment Callback

After the post request is sent to payment_url and if the payment succeeds then khalti redirects user to above's return_url with following get parameters:

- **`pidx`**: Unique payment ID (e.g., `bZQLD9wRVW04CdESSfuSsB`)
- **`status`**: `Completed`, `Pending`, `User canceled`, etc.
- **`transaction_id`**: Khalti's transaction ID (if successful).
- **`amount`**: Amount paid in paisa.

## Step 3: Verify Payment (Mandatory Step)

Use the **Lookup API** to confirm the payment status using the `pidx`.

### API Endpoints

- **Sandbox**: `https://dev.khalti.com/api/v2/epayment/lookup/`
- **Production**: `https://khalti.com/api/v2/epayment/lookup/`

### Verification Request

```json
{
  "pidx": "unique-payment-id-from-callback"
}
```

### Successful Verification Response

```json
{
  "pidx": "unique-payment-id",
  "total_amount": 1000,
  "status": "Completed",
  "transaction_id": "GFq9PFS7b2iYvL8Lir90Xe",
  "fee": 0,
  "refunded": false
}
```

## Summary

The Khalti payment integration process involves three main steps:

1. **Initiate Payment**: Send POST request with payment details
2. **Handle Callback**: Process the redirect from Khalti with payment status
3. **Verify Payment**: Confirm the payment status using the Lookup API

This verification step is crucial for security and ensures that the payment was actually completed successfully.
