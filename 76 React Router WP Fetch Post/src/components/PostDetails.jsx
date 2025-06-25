import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

export default function PostDetails() {
  const post = useLoaderData(); //loader in App.jsx
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      {featuredImage && (
        <img
          src={featuredImage}
          alt=""
          style={{ width: "100%", marginBottom: "20px" }}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
