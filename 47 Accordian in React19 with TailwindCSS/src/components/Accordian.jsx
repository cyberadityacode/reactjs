import React, { useEffect, useState } from "react";
import { getDataFromAPI } from "../api/getDataFromAPI";

export default function Accordian() {
  const [activeId, setActiveId] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const apiData = await getDataFromAPI();
      setData(apiData);
    };
    fetchData();
  }, []);

  const handleButton = (id) => {
    setActiveId((prevId) => (prevId === id ? null : id));
  };
  return (
    <div className="flex flex-col gap-3  h-lvh justify-center items-center">
      {data &&
        data.slice(0, 4).map((currentElement) => {
          const isActive = activeId === currentElement.id;
          return (
            <div
              key={currentElement.id}
              className="flex w-2/3 justify-around flex-col p-5 mx-3 gap-3 border rounded "
            >
              <div className="flex justify-between">
                <h1 className="font-bold">{currentElement.name}</h1>
                <button
                  onClick={() => handleButton(currentElement.id)}
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
                {isActive && currentElement.body}
              </p>
            </div>
          );
        })}
    </div>
  );
}
