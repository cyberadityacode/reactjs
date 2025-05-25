import React, { useState } from "react";
import { addPost } from "../api/PostAPI";

export default function Form({ data, setData }) {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  const addPostData = async () => {
    try {
      console.log("add poissss");
      const res = await addPost(formData);
      console.log(res);
      if (res.status == 201) {
        console.log("Your Response- ", res);
        setData([...data, res.data]);
        setFormData({
          title: "",
          body: "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    //apply validation if you want
    addPostData();
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex justify-center mb-3 p-3 border">
        <input
          className="border p-3 mx-2"
          type="text"
          name="title"
          placeholder="enter title"
          value={formData.title}
          onChange={handleInputChange}
        />
        <input
          className="border p-3 mx-2"
          type="text"
          name="body"
          placeholder="enter post"
          value={formData.body}
          onChange={handleInputChange}
        />
        <button type="submit" className="border p-3 mx-2">
          Post
        </button>
      </div>
    </form>
  );
}
