import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { fetchPosts } from '../API/TraditionalAPI';

export default function FetchRQ() {

  const getPostsData =async()=>{
    try{
      const res = await fetchPosts();
      console.log(res.data);

      return res.status===200? res.data: []
    }catch(error){
      console.error(error)
      return [];
    }
  }
  const {data} =  useQuery({
    queryKey: ['posts'], //reminds me of useState
    queryFn: getPostsData, //reminds me of useEffect
  })

  return (
    <div>
      <h1>React Query Way to Fetch Data</h1>
      <ul>
        {data?.map((currentPost) => {
          return <li key={currentPost.id}>{currentPost.body}</li>;
        })}
      </ul>
    </div>
  )
}
