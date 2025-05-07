import React, { useEffect, useState } from "react";

export default function App() {
  const url = 'http://localhost:3000/users'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Can't Fetch Data at this moment");

        const json = await response.json();
        console.log('got ',json);
        setData(json);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    fetchData()
  }, []);
  console.log('here is data ', data);
  return <div className="w-full">
    <h1>User Data via JSON server with API and Loader</h1>

    <div className="grid grid-cols-3 gap-4 bg-gray-500 text-white font-bold p-2 text-center">
      <div>Username</div>
      <div>Age</div>
      <div>Email</div>
    </div>

    {
        !loading?
        data.map((d)=>(
            <div key={d.username} className="grid grid-cols-3 gap-4 border-b p-2 mr-3 text-center hover:bg-gray-100">
                <div>{d.username}</div>
                <div>{d.age}</div>
                <div>{d.email}</div>
                
            </div>
        ))
        :<h1>Loading data...</h1>
    }
  </div>;
}
