# Inject Raw JSON as Inner Text of the root div


```html
<div id="root">
  {
    "user": "Aditya",
    "settings": {
      "notifications": true
    }
  }
</div>

```


This approach is valid, but you'll need to handle it carefully in your React entry file because:

1. JSON is being embedded as text, not an object.

2. React expects to render into the #root div, but you're storing JSON in it — so we need to read it first, then replace it.

Pro Tips
Clear the root (root.innerHTML = "") before rendering React — otherwise React might complain or misbehave because it expects an empty container.

Validate JSON — the JSON inside the HTML must be valid, including double quotes for all strings.

If HTML minifiers or browsers mess up the formatting, a safer alternative is:

```
<div id="root">
  <script type="application/json" id="initial-data">
    {
      "user": "Alice",
      "settings": { "notifications": true }
    }
  </script>
</div>


```

Then in JS:

```jsx
const rawJson = document.getElementById("initial-data").textContent;
const props = JSON.parse(rawJson);


```