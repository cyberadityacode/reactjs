import React, { useEffect } from "react";
import { getPost } from "./api/PostAPI";
import Posts from "./components/Posts";

export default function App() {
  return (
    <section className="flex "><Posts /></section>
  );
}
