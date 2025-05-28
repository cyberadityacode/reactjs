import React, { useEffect, useState } from "react";
import { fetchPosts } from "../API/TraditionalAPI";

export default function FetchOld() {
  const [post, setPost] = useState([]);

  useEffect(() => {
    const getPostsData = async () => {
      const res = await fetchPosts();
      if (res.status === 200) {
        console.log(res.data);
        setPost(res.data);
      } else {
        return <h1>Error Fetching Data</h1>;
      }
    };
    getPostsData();
  }, []);

  return (
    <div>
      <h1>Traditional Way to Fetch Data</h1>
      <ul>
        {post?.map((currentPost) => {
          return <li key={currentPost.id}>{currentPost.body}</li>;
        })}
      </ul>
    </div>
  );
}
