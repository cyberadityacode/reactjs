import axios from "axios";

// https://apilayer.net/api/live?access_key=8849ebab07a43fce51056fbc4cdf17c4&currencies=EUR,GBP,INR&source=USD&format=1

// create axious instance

const api = axios.create({
    // baseURL:"https://apilayer.net/api"
    baseURL:"https://timeapi.io/api"
})


// call http get request

export const fetchLiveData =async()=>{
    try{
        // const res = await api.get("/live?access_key=8849ebab07a43fce51056fbc4cdf17c4&currencies=EUR,GBP,INR&source=USD&format="+value)
        const res = await api.get("/timezone/zone?timeZone=Europe%2FAmsterdam")
        console.log('response data ',res);
        // console.log("Fetched at:", new Date().toLocaleTimeString(), data);
        return res.status ===200 ? res.data : []
    }catch(error){
        console.error(error);
    }

    
} 