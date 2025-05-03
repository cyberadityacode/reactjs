```jsx
<Component>
hi
</Component>
```

> we can access the hi with props.children

Summary: 
the children prop allows you to pass child elements directly into a component. It is used for:

1) Component Composition: Simplifies nesting components within each other.
2) Reusability: Enables the creation of reusable components that accept arbitrary content.
3) Layouts and Wrappers: Useful for creating components that wrap other elements.

You can access the children prop inside a component by using destructuring. children can be any valid React node, and you can conditionally render children based on logic.

## What's there for me?
1. Leveraged localStorage to set and getItem
2. useState to update the value of the component dynamically.
3. useHook to execute only when countValue changes — not on every render. (This helped to prevent NaN in this case)
4. Used Children Prop in Button Component.
