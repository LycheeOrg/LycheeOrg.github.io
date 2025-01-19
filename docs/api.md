<style>
.docs_main ul:not(:first-of-type) {
    margin: 0 0 0;
}
</style>
The current API provide the following entry points:
See:

- [routes/api_v2.php](https://github.com/LycheeOrg/Lychee/blob/master/routes/api_v2.php)
- [routes/web-admin-v2.php](https://github.com/LycheeOrg/Lychee/blob/master/routes/web-admin-v2.php)
- [routes/web_v2.php](https://github.com/LycheeOrg/Lychee/blob/master/routes/web_v2.php)

Note that for all request, **'Accept: application/json' is mandatory** and that without mention of the contrary **'Content-Type: application/json' is also mandatory**.

As of version 4.8.1, the api documentation is moved directly inside your own Lychee instance. It is accessible at the url `https://yourLycheeInstance.org/docs/api`.
It is also possible to see it on our demo website: [https://lychee-demo.fly.dev/docs/api](https://lychee-demo.fly.dev/docs/api)