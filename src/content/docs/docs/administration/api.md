---
title: "API"
description: "Lychee API documentation and entry points."
sidebar:
  order: 6
---

The current API provide the following entry points:
See:

- [routes/api_v2.php](https://github.com/LycheeOrg/Lychee/blob/master/routes/api_v2.php)
- [routes/web-admin-v2.php](https://github.com/LycheeOrg/Lychee/blob/master/routes/web-admin-v2.php)
- [routes/web_v2.php](https://github.com/LycheeOrg/Lychee/blob/master/routes/web_v2.php)

Note that for all request, **'Accept: application/json' is mandatory** and that without mention of the contrary **'Content-Type: application/json' is also mandatory**.

As of version 4.8.1, the api documentation is moved directly inside your own Lychee instance. It is accessible at the url `https://yourLycheeInstance.org/docs/api`.
It is also possible to see it on our demo website: [https://demo.lycheeorg.dev/docs/api](https://demo.lycheeorg.dev/docs/api)

## Authentication and CSRF

Lychee protects all stateful (cookie/session based) requests with Laravel's standard CSRF protection. This is what your browser uses automatically when you are logged in and is required for `POST`, `PUT`, `PATCH` and `DELETE` requests coming from a session.

When you script against the API (e.g. with `curl`, Python, or any external tool) you generally do not have a browser session or the associated CSRF cookie/header, so plain session-based requests will be rejected with a `419` error.

To avoid dealing with CSRF for such use cases, Lychee lets you authenticate with a personal **API token** instead. Any request that carries a valid `Authorization: Bearer <token>` header is treated as token-authenticated and skips CSRF verification entirely, regardless of the HTTP verb used.

### Generating a token

1. Log in to your Lychee instance and open **Settings → Profile**.
2. In the **API Token** section, click **Create token** (or **Reset token** if one already exists).
3. Copy the token immediately — for security reasons it is only ever shown once and cannot be retrieved again later.
4. You can revoke the token at any time from the same dialog with **Disable token**. Resetting the token also invalidates the previous one.

### Using the token

Send the token as a Bearer token in the `Authorization` header of your requests:

```bash
curl -X POST 'https://yourLycheeInstance.org/api/v2/Albums' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <your-token-here>'
```

:::caution
An API token grants full access to your account. Treat it like a password: never commit it to source control and revoke it immediately if you suspect it has leaked.
:::
