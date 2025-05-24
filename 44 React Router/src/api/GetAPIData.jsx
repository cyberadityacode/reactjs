import React from 'react'

export default async function GetAPIData() {

    try{
        // fetch('b943ea29-9030-4f81-b8f1-a4a0f8f40ad2')
        // https://www.omdbapi.com/?t=titanic&apikey=6e9a30a7
        // i=tt3896198&apikey=
    //    const response=  await fetch('https://www.omdbapi.com/?t=titanic&apikey=6e9a30a7')
    const response = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${import.meta.env.VITE_API_KEY}&s=titanic&page=1`)
       const data = response.json();

       return data
    }catch(error){
        console.error(error);
    }
 
}
