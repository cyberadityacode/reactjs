import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { NavLink, Route, Routes } from "react-router";

export default function UserEdit() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const url = 'http://localhost:3000/users/'+id;

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async ()=>{
    try{
        console.log(id);
        
        let response = await fetch(url)
        response = await response.json()
        console.log(response);
        setName(response.name)
        setAge(response.age)
        setEmail(response.email)


    }catch(Error ){
        console.log(Error);
    }
  }

  const updateUserData =async ()=>{
    try{
        console.log(name, age, email);
        let response = await fetch(url, 
            {   
                method:"PUT", 
                headers: {
                    "Content-Type": "application/json",
                }, 
                body:JSON.stringify({name, age,email})
            })
        response = await response.json()
        console.log(response);
        if (response){
            alert('user data updation')
            navigate('/')
        }
        
    }catch(Error){
        console.log(Error);
    }



  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-100">
        <h1 className="font-bold">Update User</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name.."
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          placeholder="Enter Age"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email.."
        />
        <button
          onClick={() => updateUserData()}
          className="p-2 mt-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-800 active:scale-105"
        >
          Update User
        </button>

        {responseMessage && (
          <h1 className="mt-2 text-green-600 font-semibold">
            {responseMessage}
          </h1>
        )}
      </div>
    </>
  );
}
