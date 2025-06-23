import axios from "axios";

// create axios instance

const api = axios.create({
  baseURL: "http://localhost/wpaditya/wp-json",
});

// function to fetch WP Post use ?_embed query to get featured Image

export const fetchWPPosts = () => {
  return api.get("/wp/v2/posts?_embed");
};
