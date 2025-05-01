import React from "react";
import {createRoot} from "react-dom/client";

import "./output.css";
import App from "./app";
import AppleCounter from "./components/AppleCounter";


const h1 = <h1 className="text-3xl" >hello from react element</h1>

const containerParent = 
                        <div className="flex items-center w-full min-h-screen container justify-around">
                            <div id="basket-1">
                                <h2 className="text-3xl">10 Apples</h2>
                                <p className="text-sm text-center">Basket 1</p>
                            </div>
                            <div id="arrows">
                                <button className="mx-3 p-4 bg-blue-500 font-bold text-white rounded hover:bg-blue-700 active:scale-105"><i className="fa-solid fa-arrow-left"></i></button>
                                <button className="p-4 bg-green-500 font-bold text-white rounded hover:bg-green-700 active:scale-105"><i className="fa-solid fa-arrow-right"></i></button>
                            </div>
                            <div id="basket-2">
                                <h2 className="text-3xl">0 Apples</h2>
                                <p className="text-sm text-center">Basket 2</p>
                            </div>
                        </div>

const root = createRoot(document.querySelector('#root'))
root.render(<AppleCounter />)