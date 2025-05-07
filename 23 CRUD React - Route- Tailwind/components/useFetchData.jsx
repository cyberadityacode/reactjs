import React, { useEffect, useState } from "react";

export default function useFetchData(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Can't Fetch Data at this moment");

        const json = await response.json();
        setData(json);
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  return <div>
    <h1>User Data via JSON server with API and Loader</h1>
    {
        data.map((user)=>{
            <ul key={user.id} className="">
                <li>{user.username}</li>
                <li>{user.age}</li>
                <li>{user.email}</li>
            </ul>
        })
    }
  </div>;
}
