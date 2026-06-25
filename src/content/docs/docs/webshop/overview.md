---
title: Webshop Overview
description: Sell photos directly from your Lychee gallery with integrated payment support.
sidebar:
  order: 1
  badge:
    text: Pro
    variant: caution
---

The **Webshop** module turns your Lychee gallery into a storefront, allowing visitors to purchase and download photos directly.
It is available in the **Pro** edition of Lychee, targeted at professional photographers and businesses.

## How It Works

1. **Admin** enables the webshop globally and configures products (sizes, prices) on specific albums.
2. **Visitors** browse the gallery, add photos to their basket, and check out.
3. **Admin** reviews orders, marks them as paid (or lets the payment gateway handle it), and fulfills downloads.

:::tip
The webshop pairs well with the [Watermarking](/docs/se/watermarking/) module — watermark the publicly visible photos and sell the originals.
:::

## Features

- **Custom sizes and pricing** — define multiple sizes (e.g. Digital, Print, Original) with individual prices per album
- **Shopping basket** — visitors select photos and sizes, then check out from a cart
- **Payment integrations** — Mollie, PayPal, and offline payments
- **Order management** — track pending and completed orders from the admin panel
- **Auto-fulfillment** — when selling the _original_ size, Lychee automatically generates a download link upon payment
- **Manual fulfillment** — for custom sizes or prints, set a download URL manually
- **Download links** — shareable, one-click download links for customers

## Sections

| Page | Description |
|------|-------------|
| [Configuration](/docs/webshop/configuration/) | Enable the webshop and set up products and prices |
| [Payment Setup](/docs/webshop/payments/) | Configure payment gateways (PayPal, Mollie) |
| [Order Management](/docs/webshop/orders/) | Manage orders, fulfillment, and download links |
