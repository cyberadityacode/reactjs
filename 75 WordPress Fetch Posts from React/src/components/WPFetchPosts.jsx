import React, { useEffect, useState } from "react";
import { fetchWPPosts } from "../api/wpFetch";

export default function WPFetchPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetchWPPosts();
        console.log(response);
        setPosts(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to Load Posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      {posts.map((post) => {
        const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
        const featuredImage = featuredMedia?.source_url;

        return (
          <div key={post.id}>
            {featuredImage && (
              <img
                src={featuredImage}
                style={{
                  width: "300px",
                  height: "300px",
                  objectFit: "cover",
                  display: "block",
                }}
                alt=""
              />
            )}

            {/* <h2>{post?.title.rendered}</h2> */}
            <h2 dangerouslySetInnerHTML={{ __html: post?.title?.rendered }} />
            <span dangerouslySetInnerHTML={{ __html: post?.date }} />
            <p dangerouslySetInnerHTML={{ __html: post?.excerpt?.rendered }}/>
          </div>
        );
      })}
    </div>
  );
}
