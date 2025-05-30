// create axios instance
import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// fetch function for http get request

export const fetchData = async (pageNumber) => {
  try {
    const res = await api.get(`/posts?_start=${pageNumber}&_limit=3`);
    console.log(res.data);

    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.error(error);
  }
};

// Fetch individual data
export const fetchIndividualData = async (id) => {
  try {
    const res = await api.get("/posts/" + id);
    console.log(res.data);

    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.error(error);
  }
};

//delete individual post

export const deletePost = async (id) => {
  try {
    const res = await api.delete(`/posts/${id}`);
    console.log(res);
    return res.status === 200 ? res : [];
  } catch (error) {
    console.error(error);
  }
};

// Update individual post

export const updatePost = async (id) => {
  try {
    const resUpdate = await api.patch("/posts/" + id, {
      title: "Updated the Title",
    });
    return resUpdate.status === 200 ? resUpdate : [];
  } catch (error) {
    console.error(error);
  }
};

// fetchUsers for infinite scrolling

export const fetchUsers = async ({ pageParam = 1 }) => {
  try {
    const resInfinite = await axios.get(
      `https://api.github.com/users?per_page=10&page=${pageParam}`
    );
    return resInfinite.data;
  } catch (error) {
    console.error(error);
  }
};
