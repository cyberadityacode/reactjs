## Working with Event Handler

```
    import React from 'react';

    function MyComponent() {
    const handleClick = () => {
        console.log('Button clicked!');
    };

    return <button onClick={handleClick}>Click Me</button>;
    }

    export default MyComponent;
```

>  Using JSX Event Handlers (Recommended in most cases)
React provides synthetic event handlers that work like native DOM events but are cross-browser compatible.
