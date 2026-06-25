---
title: Order Management
description: Manage orders, fulfillment, and download links in the Lychee webshop.
sidebar:
  order: 4
  badge:
    text: Pro
    variant: caution
---

## Viewing Orders

Access the orders page from the **left menu** in Lychee. The orders list shows:

- **Pending orders** — awaiting payment or fulfillment
- **Completed orders** — paid and fulfilled

Each order displays the customer details, selected photos with their sizes, and the payment status.

## Fulfilling Orders

### Auto-fulfillment

When **auto-fulfillment** is enabled in the webshop settings and the customer ordered the _original_ size, Lychee automatically:

1. Generates a download URL pointing to the original file.
2. Makes the link available to the customer.

No manual action is needed for these orders.

### Manual Fulfillment

For custom sizes, prints, or when auto-fulfillment is disabled:

1. Open the order from the orders list.
2. Click the download link field for the order line.
3. Enter the URL where the customer can download the file (e.g. a link to an external service, a processed file, etc.).
4. The customer will see the download link on their order page.

## Marking Orders as Paid

For **offline payments** or when you need to manually confirm payment:

1. Open the order.
2. Click **Mark as paid**.
3. If auto-fulfillment is enabled, download links are generated automatically.

For **PayPal** and **Mollie** payments, the payment status is updated automatically via the payment gateway.

## Customer Download Experience

Once an order is fulfilled:

1. The customer receives a **shareable download link**.
2. Clicking the link opens a download page where they can retrieve their purchased photos.
3. Admins can copy the download link from the order details to share it directly.
