---
title: AES-Secured Links
description: Share photos using encrypted, tamper-proof links.
sidebar:
  order: 5
  badge:
    text: SE
    variant: tip
---

AES-Secured Links provide an additional layer of security for shared photo links by encrypting the URL parameters.

## How It Works

When enabled, photo and album sharing links are encrypted using AES encryption. This prevents:

- URL tampering to access unauthorized photos
- Enumeration of photo IDs
- Unauthorized direct access to image files

## Configuration

AES-secured links can be enabled in the Lychee settings panel. Once enabled, all generated sharing links use the encrypted format automatically.
