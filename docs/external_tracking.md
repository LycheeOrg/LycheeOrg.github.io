This guide will help you to set up Matomo, Google Analytics or other analytics tools with Lychee.

## Set up for Matomo

> ⚠️ Make sure to use your actual values for domain and siteId

### Allow loading tracking script

Set the following env vars:

```ini
SECURITY_HEADER_SCRIPT_SRC_ALLOW=https://analytics.example.com/matomo.js
SECURITY_HEADER_CSP_CONNECT_SRC=https://analytics.example.com/matomo.js
```

### Add custom JavaScript

Add the following to Settings > Custom JS

```javascript
var _paq = window._paq = window._paq || [];
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function () {
    var u = "https://analytics.example.com/";
    _paq.push(['setTrackerUrl', u + 'matomo.php']);
    _paq.push(['setSiteId', '<site-id>']);
    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.src = u + 'matomo.js';
    s.parentNode.insertBefore(g, s);
})();

navigation.addEventListener("navigate", function (e) {
    _paq.push(['setDocumentTitle', document.title]);
    _paq.push(['trackPageView']);
});
```

## Set up for Google Analytics

> ⚠️ Make sure to replace &lt;your-tracking-id&gt; with the actual value

### Allow loading tracking script

Set the following env vars:

```ini
SECURITY_HEADER_SCRIPT_SRC_ALLOW=https://www.googletagmanager.com/gtag/js?id=<your-tracking-id>
SECURITY_HEADER_CSP_CONNECT_SRC=https://www.googletagmanager.com/gtag/js?id=<your-tracking-id>
```

### Add custom JavaScript

Add the following to Settings > Custom JS

```javascript
(function () {
  var u = "https://www.googletagmanager.com/gtag/js";
  var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
  g.async = true;
  g.src = u + '?id=<your-tracking-id>';
  s.parentNode.insertBefore(g, s);
})();

window.dataLayer = window.dataLayer || [];
function gtag(){
    dataLayer.push(arguments);
}

function trackPageView() {
  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location
  });
}

gtag('js', new Date());
gtag('config', '<your-tracking-id>', {
  send_page_view: false
});
trackPageView();

navigation.addEventListener("navigate", function (e) {
  trackPageView()
});
```
## Set up for Umami Analytics

> ⚠️ Make sure to use your actual values for DOMAIN SCRIPT URL and <WEBSITE_ID>

### Allow loading tracking script

Set the following env vars:

```ini
SECURITY_HEADER_SCRIPT_SRC_ALLOW=https://umami.example.com/script.js
SECURITY_HEADER_CSP_CONNECT_SRC=https://umami.example.com/script.js
```

### Add custom JavaScript

Add the following to Settings > Custom JS

```javascript
(function() {
    var d = document, s = d.createElement('script'), g = d.getElementsByTagName('script')[0];
    s.defer = true;
    s.src = 'https://umami.example.com/script.js';
    s.setAttribute('data-website-id', '<WEBSITE_ID>');
    g.parentNode.insertBefore(s, g);
})();

navigation.addEventListener("navigate", function (e) {
    if (window.umami && typeof umami.trackView === 'function') {
        umami.trackView(document.title, window.location.pathname);
    }
});
```

## Other tools / custom tracking

### Configuration adjustments

To make the frontend load the tracking script you need to change two environment variables:

- SECURITY_HEADER_SCRIPT_SRC_ALLOW to modify the
  header [`CSP: srcript-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)
- SECURITY_HEADER_CSP_CONNECT_SRC to modify the
  header [`CSP: connect-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/connect-src)

### Track view changes

Add your custom tracking code to Settings > Custom JS

As Lychee uses history based routing you need to track page changes on the `navigate event` like this:

```javascript
navigation.addEventListener("navigate", function (e) {
    // track page logic goes here
});
```

