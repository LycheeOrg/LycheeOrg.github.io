## Rationale

If you have had a look at your logs, you will notice that you get quite a few requests to pages that do not exists such as 
`wp-admin.php` _etc._ Those are automatic queries done by vulnerability crawlers.
This kind of trafic does not provide any value to the user and does not concern us.
For this reason, Lychee provides an honeypot.

If a user/robot/script queries one of the selected urls (honey) used by those vulnerability scanners, it will get a 418 response code.
This response is logged in Nginx/Apache, and we use [fail2ban](https://www.fail2ban.org/) to get rid of subsequent requests. 

## What is Fail2ban?

Fail2ban is a small service that can be run on your server to dynamically block clients before a request is executed.
It uses firewall rules to do so. After a certain amount of time (e.g. 1 day), the blocking rule is removed.

> {note} It will also ban you from your own website if you do a bad request.

## Setting up Fail2Ban.

> {tip} **Fail2ban is not provided with Lychee**. It is an additional software that you will need to [install it yourself](https://www.fail2ban.org/wiki/index.php/Downloads).

### Setup the Filter

Create `/etc/fail2ban/filter.d/filter-honeypot.conf` with:

```ini
[Definition]
failregex = ^<HOST>.*"(GET|POST).*" (418) .*$
ignoreregex =
```

This defines which regex to use to filter the log files.
From this regex, we retrieve the host if the response matches code 418 which is returned by Lychee when the honey is touched.

### Setup the Jail

Then we need to create the jail in:
`/etc/fail2/ban/jail.d/honeypot.conf`

If you are using apache then the following will work:
```ini
[apache-honeypot]
enabled = true
filter = filter-honeypot
port = http,https
logpath = /var/log/apache2/access.log
maxretry = 1
```
In the case of Nginx:
```ini
[apache-honeypot]
enabled = true
filter = filter-honeypot
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 1
```

`maxretry` is set to 1 because we do not need to second guess those errors.
Fail2ban is also used to ban ssh attempts after multiple failures, in such case a higher number of retry is need.
As we interact with a honeypot, any behaviour touching it is therefore malicious, there are no false positive in our case
and we do not give the benefit of the doubt.