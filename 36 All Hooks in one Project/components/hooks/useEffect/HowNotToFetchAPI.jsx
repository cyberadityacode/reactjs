import React, { useState } from "react";

export default function HowNotToFetchAPI() {
  const [apiData, setApiData] = useState([]);
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((res) => res.json())
    .then((data) => {
      //   setApiData(data);  //You will witness network tab bleeding with thousand requests.
      /* Because the moment setApiData alters the value of apiData, our component gets re-rendered, it sets another value of apiData and makes a call to our API, and recursively, it'll continue to bleed network request tab.
In this case, it's better to abstain from consequentialism and embrace deontology. */
    })
    .catch((err) => console.log(err));

  return (
    <div>
      <ul>
        data
        {apiData.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
