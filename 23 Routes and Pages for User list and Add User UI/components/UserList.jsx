import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function UserList() {
  const url = "http://localhost:3000/users";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Can't Fetch Data at this moment");

      const json = await response.json();
      console.log("got ", json);
      setData(json);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      console.dir(id); //string id of respective user
      const delResponse = await fetch(url + "/" + id, {
        method: "DELETE",
        body: JSON.stringify(id),
        headers: { "Content-type": "application/json" },
      });
      if (!delResponse.ok) throw new Error("Error in Deletion");

      const json = await delResponse.json();
      console.log("User Deleted ", id);
      setResponseMessage("User Deleted");
      fetchData()
      setTimeout(() => {
        setResponseMessage("");
      }, 3000);
    } catch (Error) {
      console.log("Error Occurred: ", Error);
    }
  };

  const editUser = async (id) =>{
    try{
        // console.log(id);
        navigate("/edit/"+id);
    }catch(Error){
      console.log("Error while updating");
    }
  };

  console.log("here is data ", data);
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-4 bg-gray-500 text-white font-bold p-2 text-center">
        <div>Username</div>
        <div>Age</div>
        <div>Email</div>
        <div>Action</div>
      </div>

      {!loading ? (
        data.map((d) => (
          <div
            key={d.id}
            className="grid grid-cols-4 gap-4 border-b p-2 mr-3 text-center hover:bg-gray-100"
          >
            <div>{d.name}</div>
            <div>{d.age}</div>
            <div>{d.email}</div>
            <div>
              <button
                onClick={() => deleteUser(d.id)}
                className="p-2 bg-red-500 text-white rounded active:scale-105 hover:bg-red-800"
              >
                Delete
              </button>
              <button
                onClick={() => editUser(d.id)}
                className="ml-2 px-3 p-2 bg-green-500 text-white rounded active:scale-105 hover:bg-green-800"
              >
                Edit
              </button>
            </div>
          </div>
        ))
      ) : (
        <h1>Loading data...</h1>
      )}
     
    </div>
  );
}
