import axios from 'axios';

//create axios instance

const api = axios.create({
    baseURL: "https://restcountries.com/v3.1"
})

// http get

export const getCountryData = ()=>{
    return api.get("/all?fields=name,population,region,capital,flags");
}

// http get Country Details

export const getCountryDetails= (name)=>{
    return api.get(`/name/${name}?fullText=true&fields=name,population,region,subregion,capital,tld,currencies,language,borders,flags`)
}