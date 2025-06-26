import axios from "axios";

/* export const fetchWPPosts = async () => {
  return axios.get("http://localhost/wpaditya/wp-json/wp/v2/posts?_embed");
}; */
export const fetchWPPosts = async (search = "") => {
  const url = `http://localhost/wpaditya/wp-json/wp/v2/posts?search=${search}`;
  return await fetch(url)
    .then((res) => res.json())
    .then((data) => ({ data }));
};
