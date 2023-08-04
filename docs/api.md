<style>
.docs_main ul:not(:first-of-type) {
    margin: 0 0 0;
}
</style>
The current API provide the following entry points:
See:

- [routes/web.php](https://github.com/LycheeOrg/Lychee/blob/master/routes/web.php)
- [routes/admin.php](https://github.com/LycheeOrg/Lychee/blob/master/routes/admin.php)

Note that for all request, **'Accept: application/json' is mandatory** and that without mention of the contrary **'Content-Type: application/json' is also mandatory**.

As of version 4.8.1, the api documentation is moved directly inside your own Lychee instance. It is accessible at the url `https://yourLycheeInstance.org/docs/api`.