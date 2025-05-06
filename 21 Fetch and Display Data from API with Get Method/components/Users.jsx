import React from "react";
import fetchUsers from "./useFetchUsers";
import useFetchUsers from "./useFetchUsers";
import { Link } from "react-router";

export default function Users() {
  const { data, loading, error } = useFetchUsers("https://dummyjson.com/users");

  if (loading) return <h1>Loading...</h1>;

  if (error) return <h1>Error Occured {error}</h1>;
  console.log("aditya data is here", data);
  return (
    <>
      <div>Users</div>
      <div className=" ">
        {data &&
          data.users.map((user) => (
            <ul key={user.id} className="ml-3 flex justify-around border-black border p-3 hover:bg-gray-400">
              <li className="text-justify" >
                {user.firstName} {user.lastName}
              </li>
              <li className="text-justify" >
                {user.email} 
              </li>
            </ul>
          ))}
      </div>
    </>
  );
}
