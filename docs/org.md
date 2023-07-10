## Introduction

Lychee was originally developed by [electerious][1] ([Tobias Reich][2]). Lychee aims to be a great looking and easy-to-use photo-management-system that nearly anyone can use on their web server.

Since April 1st, 2018 this project has moved to it's own Organisation (LycheeOrg) where people are able to submit their fixes to it. We, the Organisation owners, want to thank electerious (Tobias Reich) for the opportunity to make this project live on.

## Schedule releases & Roadmap

We do not have schedule for releases such as every 6 months. Our releases should never contain breaking changes. That being said, we do not provide backward compatibility or hotfix for older versions. The `master` branch is the bleeding edge of Lychee. It contains the latest bugfixes and newest features. Once a sufficient number of hotfixes or new features has been merged into `master` we create a new release.

Generally, we follow semantic versioning: Major.minor.patch.

- Major releases provide a breaking change or significant refactoring of the full project (_e.g._, migration to a new front-end).
- minor releases have a database structural update or provide a notable change.
- patches for the rest.

## Security

In order to ensure maximum security some actions on Lychee are restricted by an admin authentication. The username and password are stored hashed with bcrypt in the database.

However as precaution, we provide a server-side command to easily erase those two data from the database in order to recover admin access. We consider this command safe as it requires a command line access to the server. A user gaining such rights is outside of our security scope as the server would be compromised.

## LycheeOrg

LycheeOrg is a GitHub organization of enthusiast developers determined to keep this project alive.
There is no commitment in time to the project. We understand that each member has their personal life and dedicate time as they see fit to the project.

If you start to contribute by opening multiple Pull Requests and adding more code to the database, it is likely you will be asked to join us.

There is no governance model. We currently have three admins: [d4715][3], [ildyria][4], [LudovicRousseau][5]. Decisions are made after discussions.

[1]: https://github.com/electerious
[2]: https://electerious.com
[3]: https://github.com/d7415
[4]: https://github.com/ildyria
[5]: https://github.com/LudovicRousseau
