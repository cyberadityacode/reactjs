import React, { useEffect, useState } from "react";
import { getDataFromAPI } from "../api/getDataFromAPI";
// https://jsonplaceholder.typicode.com/comments
export default function AccordianBackup() {
  const [isActive, setIsACtive] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const apiData = await getDataFromAPI();
      setData(apiData);
    };
    fetchData();
  }, []);

  
  return (
    <div className="flex flex-col gap-3  h-lvh justify-center items-center">
      <div className="flex w-2/3 justify-around flex-col p-5 mx-3 gap-3 border rounded ">
        <div className="flex justify-between">
          <h1 className="font-bold">Heading of Accordian</h1>
          <button
            onClick={() => setIsACtive(!isActive)}
            className={`w-10  p-1 border rounded-full active:scale-105  cursor-pointer ${
              isActive ? "hover:bg-red-300" : "hover:bg-green-300"
            }`}
          >
            {isActive ? "✖" : "✔"}
          </button>
        </div>
        <p
          className={`overflow-hidden transition-all ease-in-out duration-700 ${
            isActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem,
          eveniet.
        </p>
      </div>

      <div className="flex w-2/3 justify-around flex-col p-5 mx-3 gap-3 border rounded ">
        <div className="flex justify-between">
          <h1 className="font-bold">Heading of Accordian</h1>
          <button
            onClick={() => setIsACtive(!isActive)}
            className={`w-10  p-1 border rounded-full active:scale-105  cursor-pointer ${
              isActive ? "hover:bg-red-300" : "hover:bg-green-300"
            }`}
          >
            {isActive ? "✖" : "✔"}
          </button>
        </div>
        <p
          className={`overflow-hidden transition-all ease-in-out duration-700 ${
            isActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem,
          eveniet.
        </p>
      </div>
    </div>
  );
}
