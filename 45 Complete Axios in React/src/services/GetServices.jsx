import axios from "axios";

// create an instance of axios

const api = axios.create({
    baseURL: "https://www.omdbapi.com/"
});

// create a function to call get method from api instance to receive data
// Create a get req function
/* api.get automatically concatenate base url */
export const getMovie = ()=>{
    // return api.get("?i=tt3896198&apikey=1c12799f&s=titanic&page=1");
    return api.get(`?i=tt3896198&apikey=${import.meta.env.VITE_API_KEY}&s=titanic&page=1`);
}