import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { fetchWPPosts } from "../api/wpFetch";
import { Link } from "react-router-dom";

export default function WPFetchPost() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = async (search = "") => {
    try {
      setLoading(true);
      const response = await fetchWPPosts(search);
      setPosts(response.data);
    } catch (error) {
      console.log(error);
      setError("error while fetching post");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPost();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchPost(value);
  };

  return (
    <>
      <div>
        <h1>Search Post</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Post..."
        />

        {loading && <p>Loading Posts...</p>}
        {error && <p>{error}</p>}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {posts.map((post) => {
          const featuredImage =
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

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

              <h2>
                <Link
                  to={`/post/${post.slug}`}
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
              </h2>
              <span dangerouslySetInnerHTML={{ __html: post.date }} />
              <p dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered }} />
            </div>
          );
        })}
      </div>
    </>
  );
}
