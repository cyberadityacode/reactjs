# UnControlled React Components

An uncontrolled component uses the DOM directly to manage its value — usually accessed via ref

# Controlled React Components

A controlled component is a form element whose value is controlled by React state. You use state and onChange handlers to manage user input.

> React is in charge.

The moment you add value attribute to the jsx input field without an Event Handler like onChange. You will encounter beautiful warning.

You can't even write anything to form field.
```

A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

```

Add onChange handler to your input field to resolve issue and to enable react state to take full control on input field.