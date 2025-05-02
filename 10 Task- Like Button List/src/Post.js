import React, { useState } from 'react'

export default function Post({title}) {
    // Adding state for like count using useState
    const [likes,setLikes] = useState(0);

    // Handler for Increasing the count of likes
    const handleLike = ()=>{
        setLikes(likes+1);
    }
  return (
    <div>
        <h2>{title}</h2>
        <p> &#x2665;&#xfe0f; {likes} {likes===1 ? 'Like': 'Likes'}</p>
        <button onClick={handleLike}>Like</button>
    </div>
  )
}
