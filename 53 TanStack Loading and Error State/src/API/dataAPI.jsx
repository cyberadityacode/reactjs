// create axios instance
import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// fetch function for http get request

export const fetchData = async () => {
  try {
    const res = await api.get("/posts");
    console.log(res.data);

    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.error(error);
  }
};
