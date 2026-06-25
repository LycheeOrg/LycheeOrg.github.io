---
title: Webshop Configuration
description: Enable the webshop and configure products, sizes, and prices on your albums.
sidebar:
  order: 2
  badge:
    text: Pro
    variant: caution
---

## Enabling the Webshop

1. Open the **Settings** panel in Lychee.
2. Locate the **Webshop** section and enable it globally.
3. Optionally enable **auto-fulfillment** — when turned on, orders for the _original_ size are automatically fulfilled with a download link once the payment is confirmed.

![Auto-fulfillment settings](/docs/img/webshop/admin-autofulfill-settings.png)

## Setting Up Products

Products (sizes and prices) are configured **per album**, not globally.

1. Navigate to the album you want to sell photos from.
2. Open the **album menu** (context menu).
3. Select the webshop configuration option.
4. Define the available sizes and their prices (e.g. _Digital Small — €5_, _Original — €15_).

![Admin webshop configuration](/docs/img/webshop/admin-config.png)

![Setting sizes and prices](/docs/img/webshop/admin-prices.png)

:::caution
The album must be **visible to non-admin users** (public or shared) for visitors to see the basket icon and make purchases.
:::

## How Visitors See It

When the webshop is active on an album:

- A **basket icon** appears in the top-right corner of each photo thumbnail on hover.

![Basket icon on thumbnail hover](/docs/img/webshop/guest-gallery.png)

- Clicking the basket icon opens a size/price selector.

![Size and price selector](/docs/img/webshop/guest-basket.png)

- Selected items are added to a **shopping cart** visible in the top-right corner of the page.

![Shopping cart](/docs/img/webshop/guest-cart.png)

- From the cart, visitors proceed to checkout.

![Checkout](/docs/img/webshop/guest-checkout.png)

- After payment, the visitor sees a confirmation page.

![Payment confirmation](/docs/img/webshop/guest-payment.png)

:::note
The basket icon appears on the **album/thumbnail view**, not when viewing a single photo in the photo viewer.
:::
