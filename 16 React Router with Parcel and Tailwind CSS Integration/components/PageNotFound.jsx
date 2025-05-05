import React from "react";
const pageNotFoundPhoto = new URL("../images/error404.jpg", import.meta.url);

export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-3xl">
      <div>
        <h1>Page Not Found</h1>
      </div>
      <div>
        <img className="size-70" src={pageNotFoundPhoto} alt="" />
      </div>
    </div>
  );
}
