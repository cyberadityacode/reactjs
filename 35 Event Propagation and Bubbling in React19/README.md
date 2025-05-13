# Event Propagation in React

> Event Capturing - Top to Botton Event Propagation [onClickCapture]

```jsx
<button onClickCapture={handleChildClick} className="p-3 bg-gray-700 text-white font-bold rounded active:scale-105 " >
            Child Click
          </button>
```

Event Bubbling - Bottom to Top Event Propagation [onClick]

```jsx
<button onClick={handleChildClick} className="p-3 bg-gray-700 text-white font-bold rounded active:scale-105 " >
            Child Click
          </button>
```