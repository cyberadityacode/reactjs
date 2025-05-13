import React, { useState } from "react";

export default function StateUsers() {
  /*     const users = [
        {username: "aditya", age: 31},
        {username: "dubey", age: 32},
        {username: "anotherName", age: 34},
        {username: "someone", age: 28},
    ] */
  const [users, setUsers] = useState([
    { username: "aditya", age: 31 },
    { username: "dubey", age: 32 },
    { username: "anotherName", age: 34 },
    { username: "someone", age: 28 },
  ]);

  return (
    <>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.username} is {user.age} years old.
          </li>
        ))}
      </ul>
    </>
  );
}
