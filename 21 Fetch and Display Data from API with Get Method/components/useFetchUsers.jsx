import React, { useEffect, useState } from "react";

export default function useFetchUsers(url) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching users data via API");

        const response = await fetch(url)
        if(!response.ok) throw new Error("Failed to Fetch Data")

        const json = await response.json()
        setData(json)
      } catch (error) {
        console.log("Error fetching data", error);
        setError(error.message);
      }finally{
        setLoading(false);
      }
    };
    fetchData()
  }, [url]);

  return {data,loading,error}
}
