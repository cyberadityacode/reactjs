import React, { useEffect, useState } from "react";
import { addPost, updatePost } from "../api/PostAPI";

export default function Form({
  data,
  setData,
  updateDataAPI,
  setUpdateDataAPI,
}) {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  let isEmpty = Object.keys(updateDataAPI).length === 0;

  //   get the updated Data and add into input field.

  useEffect(() => {
    updateDataAPI &&
      setFormData({
        title: updateDataAPI.title || "",
        body: updateDataAPI.body || "",
      });
  }, [updateDataAPI]);

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
  //updatePostData

  const updatePostData = async () => {
    try {
      const res = await updatePost(updateDataAPI.id, formData);
      console.log("update response from server: ", res);

      if (res.status === 200) {
        setData((prev) => {
          return prev.map((currEl) => {
            return currEl.id === res.data.id ? res.data : currEl;
          });
        });

        setFormData({
          title: "",
          body: "",
        });
        setUpdateDataAPI({})
      }
    } catch (error) {
      console.error(error);
    }
  };

  //   form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const action = e.nativeEvent.submitter.value;
    if (action === "Add") {
      console.log("Form Submitted", formData);
      //apply validation if you want
      addPostData();
    } else if (action === "Edit") {
      console.log("Data Updated Successfully!");
      updatePostData();
    }
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
        <button
          value={isEmpty ? "Add " : "Edit"}
          type="submit"
          className="border p-3 mx-2"
        >
          {isEmpty ? "Add " : "Edit"}
        </button>
      </div>
    </form>
  );
}
