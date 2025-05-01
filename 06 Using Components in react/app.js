import React from "react";
import logo from './logo.png'

const logoImage = 'https://plus.unsplash.com/premium_photo-1675862969309-0b705fdcfc8f?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

console.log('image URL (from require):', logoImage);

export default function App() {
  return (<img src={logoImage} alt="Logo" />);
}

// function basketComponent(){
//   return 
// }