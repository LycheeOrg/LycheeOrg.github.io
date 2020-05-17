## Bug Reports
To encourage active collaboration, Lychee strongly encourages pull requests, not just bug reports. "Bug reports" may also be sent in the form of a pull request containing a failing test.

However, if you file a bug report, your issue should contain a title and a clear description of the issue. You should also include as much relevant information as possible to demonstrates the issue. We provide a template and expect it to be respected. Most bug report not following it will likely be closed. The goal of a bug report is to make it easy for yourself - and others - to replicate the bug and develop a fix.

Remember, bug reports are created in the hope that others with the same problem will be able to collaborate with you on solving it. Do not expect that the bug report will automatically see any activity or that others will jump to fix it. Creating a bug report serves to help yourself and others start on the path of fixing the problem. If you want to chip in, you can help out by fixing any bugs listed in our [issue trackers][1].

## Support Questions
Lychee's GitHub issue trackers are not intended to provide Lychee help or support. Please instead, contact us directly [here][2] on gitter.


## Core Development Discussion
You may propose new features or improvements of existing Lychee behavior in the issue board. If you propose a new feature, please be willing to implement at least some of the code that would be needed to complete the feature.

## Which Branch?

When submitting a new feature or fixing a bug, please create a new branch from master:

```
git checkout master
git pull master
git checkout -b <fix-issue-number>
```

Modify the desired files.

```
git add <files-you-modified>
git commit -m "<mesage-of-what-is-going-on>"
git push -u
```

You can then open a [pull request][3].

<!-- ## Security Vulnerabilities
If you discover a security vulnerability within Laravel, please send an email to Taylor Otwell at taylor@laravel.com. All security vulnerabilities will be promptly addressed. -->


## Coding Style
Our coding style is defined by the `.php-ps` file, it is mostly the Symfony style but we use tabs instead of spaces.

Before submitting a PR, we highly encourage you to do:
```
./vendor/bin/php-cs-fixer fix --config=.php_cs
```
This will ensure that the code is consistent with our style.

In order to make this less constraining, you can copy the `pre-commit` file in the root into the `.git/hooks` folder. This will execute the fixer to keep the consistency.

Our current configuration can be found [here](https://github.com/LycheeOrg/Lychee/blob/master/.php_cs).
For details about the options you can have a look at the [php-cs-fixer-configurator](https://mlocati.github.io/php-cs-fixer-configurator)

## PHPDoc
Below is an example of a valid Laravel documentation block. Note that the @param attribute is followed by two spaces, the argument type, two more spaces, and finally the variable name:

```
/**
 * Register a binding with the container.
 *
 * @param  string|array  $abstract
 * @param  \Closure|string|null  $concrete
 * @param  bool  $shared
 * @return void
 *
 * @throws \Exception
 */
public function bind($abstract, $concrete = null, $shared = false)
{
    //
}
```


## Code of Conduct
The Lychee code of conduct is the same as Laravel's code of conduct:

- Participants will be tolerant of opposing views.
- Participants must ensure that their language and actions are free of personal attacks and disparaging personal remarks.
- When interpreting the words and actions of others, participants should always assume good intentions.
- Behavior that can be reasonably considered harassment will not be tolerated.


[1]: https://github.com/LycheeOrg/Lychee/issues
[2]: https://gitter.im/LycheeOrg/Lobby
[3]: https://github.com/LycheeOrg/Lychee/pulls