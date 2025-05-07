import React from "react";


// Parcel converts static files to a URL. If the import is failing, try:
const imageUrl = new URL('../images/logo.png', import.meta.url);

export default function Logo() {
    console.log('this is my image ',imageUrl);
  return (
    <div className="logo w-16 h-16">
      <img src={imageUrl} alt="" />
    </div>
  );
}
