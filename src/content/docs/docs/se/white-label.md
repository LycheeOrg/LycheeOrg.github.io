---
title: White Label
description: Remove all Lychee branding for a fully custom look.
sidebar:
  order: 6
  badge:
    text: SE
    variant: tip
---

The White Label option allows you to remove all mentions of Lychee from the user interface, presenting a fully branded experience to your users. It is ideal for professional photographers and businesses.

## Configuration

White label is configured via the `WHITE_LABEL_ENABLED` environment variable in your `.env` file:

```ini
WHITE_LABEL_ENABLED=true
```

| Option                 | Description                                      | Default |
|------------------------|--------------------------------------------------|---------|
| `WHITE_LABEL_ENABLED`  | Hide all Lychee branding from the UI             | `false` |

This removes the footer link, generator meta tag, misconfiguration warning, left-menu "Lychee" section, and login-form branding.

:::note
This setting only takes effect when a valid Lychee Supporter Edition (SE) licence is active. On non-SE installations the flag is ignored and Lychee branding remains visible.
:::

:::caution
If you are using the Docker image, changes to environment variables require a container restart, as the server loads and caches the configuration at startup.
:::
