import React, { StrictMode } from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './components/App';



const root = createRoot(document.querySelector('#root'));

root.render(
    <BrowserRouter>
        <StrictMode>
            <App />
        </StrictMode>
    </BrowserRouter>

);