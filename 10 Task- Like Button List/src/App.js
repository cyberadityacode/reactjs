import React from "react";
import Post from "./Post";

export default function App() {
  // Array of post titles
  const posts = [
    "HTML is Body",
    "CSS is Beauty",
    "JS is Awesome",
    "React is Amazing",
  ];

  return (
    <div>
      <h1>Post List</h1>
      {
        posts.map((title, index) => (
          <Post key={index} title={title} />
        ))
      }
    </div>
  );
}
