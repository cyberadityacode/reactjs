# How to create React Element? What is React Element

To, begin with lets just learn about CDN integration.

``` 
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

### What is crossorigin attribute in the script tag?

When you load a script from another website, your browser may need to know how much trust to give it. The crossorigin attribute tells the browser:

#### What to send when asking for the script:

1. crossorigin="anonymous":
Don’t send any personal info (like cookies). Just get the script safely.

2. crossorigin="use-credentials":
Send cookies or login info along with the request.

#### Why it matters:
1. It helps the browser follow security rules (called CORS) - .

2. It’s also needed if you use Subresource Integrity (integrity) to make sure the script hasn’t been changed or hacked.

```
    <script src="https://cdn.example.com/script.js"
        crossorigin="anonymous"></script>
``` 
default value is anonymous

> “Get this script from another site, but don’t send my cookies or login info.”

Leaving the attribute out completely, which means no CORS mode is set at all and the browser may not enforce any CORS checks or allow Subresource Integrity checks for cross-origin scripts.

 ### CORS = Cross-Origin Resource Sharing
#### What it is:
A browser rule that controls which websites can share resources (like scripts, images, data) with each other.

#### Why it matters:
It helps protect your website from loading data from untrusted sources (like attackers).

Simple example:

Your website is my-site.com.

You load a script from cdn.com.

CORS checks:
> "Does cdn.com allow my-site.com to use its script?"