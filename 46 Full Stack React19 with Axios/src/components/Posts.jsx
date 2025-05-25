import React, { useCallback, useEffect, useState } from "react";
import { deletePost, getPost } from "../api/PostAPI";

export default function Posts() {
  const [data, setData] = useState([]);
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
  const deleteSelectedPost = async (id) => {
    try {
      const res = await deletePost(id);
      if (res.status === 200) {
        setData((prevData)=> prevData.filter(post=> post.id !==id));
      }else{
        console.log("Cannot Delete Data!", res.status);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeletePost = useCallback(
    (id) => () => {
      deleteSelectedPost(id);
    },
    []
  );
  return (
    <div className=" container mx-auto p-4 ">
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
              <button>Edit</button>
              <button onClick={handleDeletePost(currentData.id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
