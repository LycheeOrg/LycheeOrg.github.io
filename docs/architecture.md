### Brief introduction to Laravel

Laravel is a MVC (Model-View-Controller) framework for PHP. Its process is as follows.

1. A Request is made, it goes through the routes.
2. The route decide which controller is being applied.<br>
We apply a  middleware if requested (User Access verification mainly).
3. The controller makes calls to models which is hides the calls to the database through clever queries.
4. After applying logic, we return a view (template) or a JSON response.

The following figure illustrate the process.

![https://cdn.auth0.com/blog/laravel-auth/mvc-diagram.png](img/mvc-diagram.png)

A detailed description of the directory structure is provided [here](structure.html).

### Interesting readings

- [Laravel documentation](https://laravel.com/docs/7.x/) &mdash; a very detailed and nicely written.
- [Best Practices](https://github.com/alexeymezenin/laravel-best-practices) &mdash; we try to follow them on Lychee.
- [Dynamic Dependency Injection](http://pwm.github.io/dynamic-dependency-injection/) &mdash; Lychee and Laravel uses them a lot.
- [Request Validation](https://medium.com/@kamerk22/the-smart-way-to-handle-request-validation-in-laravel-5e8886279271) &mdash; We still need to see if this can be applied here.
