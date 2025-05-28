import axios from "axios"

const api = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com"
})

// Fetch Data 

export const fetchPosts =()=>{
    return api.get("/posts")
}