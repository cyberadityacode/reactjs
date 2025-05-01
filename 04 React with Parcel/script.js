import {user} from './data.js'
import React from 'react';
import ReactDOM from "react-dom/client";
// HMR - Hot Module Replacement
if(module.hot){
    module.hot.accept();
}

console.log('hello world-', user.username);
console.log(React);

const h1 = <h1>Hello World!</h1>
const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(h1)