// create axios instance
import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// fetch function for http get request

export const fetchData = async () => {
  try {
    const res = await api.get("/posts?_start=0&_limit=3");
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
