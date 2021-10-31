## Bug Reports
To encourage active collaboration, Lychee strongly encourages pull requests, not just bug reports. "Bug reports" may also be sent in the form of a pull request containing a failing test.

However, if you file a bug report, your issue should contain a title and a clear description of the issue. You should also include as much relevant information as possible to demonstrates the issue. We provide a template and expect it to be respected. Most bug report not following it will likely be closed. The goal of a bug report is to make it easy for yourself - and others - to replicate the bug and develop a fix.

Remember, bug reports are created in the hope that others with the same problem will be able to collaborate with you on solving it. Do not expect that the bug report will automatically see any activity or that others will jump to fix it. Creating a bug report serves to help yourself and others start on the path of fixing the problem. If you want to chip in, you can help out by fixing any bugs listed in our [issue trackers][1].

## Support Questions
Lychee's GitHub issue trackers are not intended to provide Lychee help or support. Please instead, contact us directly [here][2] on gitter.


## Security Vulnerabilities
Lychee uses a rolling release system, **we do not backport fixes to previously released versions**.
Those are the versions where we accept vulnerability reports.

| Version | Supported          |
| ------- | ------------------ |
| master  | 	 &#10004;      |
| latest release  |  &#10004;  |
| < 4.0   |      &#10005;      |

If you discover a security vulnerability within Lychee, please contact us directly on [gitter][2]. All security vulnerabilities will be promptly addressed.

## Core Development Discussion
You may propose new features or improvements of existing Lychee behavior in the [issue board][1]. If you propose a new feature, please be willing to implement at least some of the code that would be needed to complete the feature.


## How to properly submit a pull-request to Lychee?

Pull request need to respect a few simple constraints described below which make the life of everyone easier.

### Which Branch to use?
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

### Back-end and Front-end
As you may have noticed already we have two repositories to manage separately the front-end and the back-end.
This was necessary at times to ensure the parallel development of Lychee version 4 and Lychee version 3.
As a result, the process of submitting a PR which modified both sides (Lychee-front and Lychee) goes as follows:

* 1 &ndash; we take the 2 PR.
* 2 &ndash; we review them both.
* 3 &ndash; we merge on Lychee-front.
* 4 &ndash; switch Lychee-front to master, rebuild & commit on the Lychee PR.
* 5 &ndash; merge to Lychee master
* 6 &ndash; Enjoy!

### Our Coding Style
In order to ease the review of pull requests we adopt a uniform code style. Our Continuous Integration suite will 
fail if the later is not respected.

#### PHP

Our coding style is defined by the `.php-ps` file, it is mostly the Symfony style but we use tabs instead of spaces.

Before submitting a PR, we highly encourage you to do:
```
./vendor/bin/php-cs-fixer fix --config=.php_cs
# or
make formatting
```
This will ensure that the code is consistent with our style.

In order to make this less constraining, you can copy the `pre-commit` file in the root into the `.git/hooks` folder. This will execute the fixer to keep the consistency.

Our current configuration can be found [here](https://github.com/LycheeOrg/Lychee/blob/master/.php_cs).
For details about the options you can have a look at the [php-cs-fixer-configurator](https://mlocati.github.io/php-cs-fixer-configurator)

#### Javascript

Similarly to described above, you can format the code automatically with the command.
```
npm run format
```

### PHPDoc
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

In addition to code documentation, we highly encourage you to use the types system of php for the function arguments.
This will increase the trust and safety of the code.

### Illustrated example

As follows we present a simple pull request modifying the `readme.md`.

#### 1. Fork the repository.
![Screenshot](img/contribute1.png)
#### 2. select your own account as destination of the fork.
![Screenshot](img/contribute2.png)
#### 3. Create a new branch.

1. Click on the drop down menu.
2. Enter the name of the new branch.
3. Click **Create branch:...**.

![Screenshot](img/contribute3.png)
#### 4. Make sure the new branch is selected.
![Screenshot](img/contribute4.png)
#### 5. Edit the desired files.
![Screenshot](img/contribute5.png)
#### 6. Commit the changes.
If possible, provide a summary of the changes done by the commit in the description before clicking **Commit changes**.

![Screenshot](img/contribute6.png)
#### 7. Create a new pull request.
![Screenshot](img/contribute7.png)
#### 8. Fill-in and submit the pull request.

1. Make sure that the base repository is the one from `LycheeOrg` on the branch `master`.
2. Provide a good title to the changes you would like to be applied.
3. Add a description of the changes, motivations, what is being done. etc.
Also make sure that **Allow edit by the maintainers is being checked**.
This will allow us to fix the pull request if necessary.
4. Submit the pull request.

![Screenshot](img/contribute8.png)

#### 9. Wait for the team to get back at you and review the PR.
## Code of Conduct
The Lychee code of conduct is the same as Laravel's code of conduct:

- Participants will be tolerant of opposing views.
- Participants must ensure that their language and actions are free of personal attacks and disparaging personal remarks.
- When interpreting the words and actions of others, participants should always assume good intentions.
- Behavior that can be reasonably considered harassment will not be tolerated.


[1]: https://github.com/LycheeOrg/Lychee/issues
[2]: https://gitter.im/LycheeOrg/Lobby
[3]: https://github.com/LycheeOrg/Lychee/pulls

