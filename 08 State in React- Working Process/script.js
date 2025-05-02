import react, {useState} from 'react'   
import {createRoot} from 'react-dom/client'
import App from './components/App';

console.log("hi from script");

// it enables hot reload, but for me it prevents parcel abrupt crash on html alteration
if (module.hot) {
  module.hot.accept();
}

const root = createRoot(document.querySelector('#root'))
root.render(<App />)
