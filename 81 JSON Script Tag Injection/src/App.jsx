import React from "react";

export default function App({ initialData }) {
  return (
    <div>
      <h1>Hello from React App,</h1>
      <p>username: {initialData?.username}</p>
      <p>Name: {initialData?.userdetails?.name}</p>
      <p>Age: {initialData?.userdetails?.age}</p>

      <p>Permissions: {initialData?.permissions.map(String).join(",")}</p>
    </div>
  );
}
