import axios from "axios";

export const fetchWPPosts = async () => {
  return axios.get("http://localhost/wpaditya/wp-json/wp/v2/posts?_embed");
};
