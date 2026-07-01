---
title: Payment Setup
description: Configure payment gateways for the Lychee webshop.
sidebar:
  order: 3
  badge:
    text: Pro
    variant: caution
---

The webshop supports multiple payment methods. Configure them by adding the appropriate environment variables to your `.env` file or `docker-compose.yaml`.

## Sandbox Mode

By default, all payment gateways run in **test/sandbox mode** for safety.
Set the following to `false` when you are ready to accept real payments:

```ini
OMNIPAY_TEST_MODE=true
```

:::caution
Always test your checkout flow in sandbox mode before switching to live. Verify that orders are created, payments are recorded, and fulfillment works as expected.
:::

## PayPal

1. Create a [PayPal Developer](https://developer.paypal.com/) account.
2. Create a REST API app to obtain your credentials.
3. Add the following to your `.env`:

```ini
PAYPAL_CLIENT_ID=your-client-id
PAYPAL_SECRET=your-secret
```

4. Restart Lychee (or your Docker container).

## Mollie

1. Create a [Mollie](https://www.mollie.com/) account.
2. Retrieve your API key and profile ID from the Mollie dashboard.
3. Add the following to your `.env`:

```ini
MOLLIE_API_KEY=your-api-key
MOLLIE_PROFILE_ID=your-profile-id
```

4. Restart Lychee.

## Offline Payments

Offline payments are available without any additional configuration. When a visitor checks out with the offline option, the order is created with a **pending** status. You then:

1. Collect payment through your own means (bank transfer, cash, etc.).
2. Open the order in the admin panel.
3. Click **Mark as paid** to confirm the payment and trigger fulfillment.
