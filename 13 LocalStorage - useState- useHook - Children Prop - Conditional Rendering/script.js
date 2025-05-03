import React from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import App from "./components/App"

const root = createRoot(document.querySelector('#root'))

const fetchLocalStorage = parseInt(localStorage.getItem('countValue'))

console.log(fetchLocalStorage);
console.log(typeof fetchLocalStorage);

const localValue = isNaN(fetchLocalStorage) ? 0: fetchLocalStorage

// console.log(localValue);
root.render(<App localStorageValue = {localValue} />)