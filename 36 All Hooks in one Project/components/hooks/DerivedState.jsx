import React from "react";

export default function DerivedState() {
  const users = [
    { username: "aditya", age: 31 },
    { username: "dubey", age: 32 },
    { username: "anotherName", age: 34 },
    { username: "someone", age: 28 },
  ];

  //total users
  const totalUsers = users.length;

  //Average Age
  const averageAge = users.reduce((accumulator, currentElement) => accumulator +currentElement.age, 0) / totalUsers


  return (<div>
    <h1>Derived State</h1>
    <p>Total Users : {totalUsers}</p>
    <p>Average Age : {averageAge}</p>
  </div>

  )
}
