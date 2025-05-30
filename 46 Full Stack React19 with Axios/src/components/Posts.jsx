import React, { useCallback, useEffect, useState } from "react";
import { deletePost, getPost } from "../api/PostAPI";
import Form from "./Form";

export default function Posts() {
  const [data, setData] = useState([]);
  const [updateDataAPI, setUpdateDataAPI] = useState({});
  const getPostData = async () => {
    try {
      const res = await getPost();

      //Immediately Invoked Function Expression (IIFE) to allow throw inside the ternary.

      res.status === 200
        ? (() => {
            console.log(res.data);
            setData(res.data);
          })()
        : (() => {
            throw new Error("cannot fetch");
          })();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getPostData();
  }, []);

  // Curry Function -
  const deleteSelectedPost = useCallback(async (id) => {
    try {
      const res = await deletePost(id);
      if (res.status === 200) {
        setData((prevData) => prevData.filter((post) => post.id !== id));
      } else {
        console.log("Cannot Delete Data!", res.status);
      }
    } catch (error) {
      console.error(error);
    }
  });
  const handleDeletePost = useCallback(
    (id) => () => {
      deleteSelectedPost(id);
    },
    [deleteSelectedPost]
  );
  const updateSelectedPost = useCallback(async (currentData) => {
    try {
      console.log("update clicked", currentData);
      setUpdateDataAPI(currentData);
    } catch (error) {
      console.error(error);
    }
  }, []);
  const handleUpdatePost = useCallback(
    (currentData) => () => {
      updateSelectedPost(currentData);
    },
    []
  );
  return (
    <div className=" container mx-auto p-4 ">
      <section>
        <Form
          data={data}
          setData={setData}
          updateDataAPI={updateDataAPI}
          setUpdateDataAPI={setUpdateDataAPI}
        />
      </section>

      <ul className="list-decimal list-inside space-y-2">
        {data.map((currentData) => {
          return (
            <li key={currentData.id}>
              <p>
                <span>Title</span>: {currentData.title}
              </p>
              <p>
                <span>Post</span> : {currentData.body}
              </p>
              <button onClick={handleUpdatePost(currentData)}>Edit</button>
              <button onClick={handleDeletePost(currentData.id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
