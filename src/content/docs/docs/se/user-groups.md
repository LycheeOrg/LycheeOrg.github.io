---
title: User Groups
description: Organize users into groups with shared permissions and delegated administration.
sidebar:
  order: 3
  badge:
    text: SE
    variant: tip
---

User Groups let you share albums with a whole set of users at once, and update their access collectively, instead of sharing with — and maintaining — each user individually.

## How it works

- A group has a name, an optional description, and a member list. Every member holds one of two roles: `member` or `admin`.
- Only a Lychee administrator can create or delete a group itself.
- Group **admins** can rename the group, edit its description, and add, remove, or re-role its members — without needing full Lychee admin rights. This is the delegation the "Group administration" feature refers to.
- A group's member list is only visible to Lychee admins and to that group's own members; other users can't see who belongs to a group they aren't in.

## Sharing with groups

- When sharing an album, you can pick a group the same way you'd pick an individual user — the share-target search lists both users and groups together, with a distinct icon for groups.
- A group share grants exactly the same set of permissions as an individual [user share](/docs/usage/sharing/): full-photo access, download, upload, edit, and delete, configured per group per album.
- Every member of the group inherits the album's access through the group; there's no way to override the grant for a single member within that group's share.

## Use Cases

- **Family groups** — share family albums with all family members at once
- **Team access** — give project teams access to relevant photo collections
- **Client groups** — manage client access to their photos in a photography business

## Creating Groups

Groups themselves are created and deleted from the admin panel by a Lychee administrator. From there, membership and group details can either stay with the admin or be handed off to a group admin, who can manage members without needing broader Lychee admin rights.
