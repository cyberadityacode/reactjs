import React from "react";

export default function FormGoogleSheet() {
  const handleSubmit = (e) => {
    e.preventDefault();

    const url = import.meta.env.VITE_URL;
    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `Name=${e.target.name.value}&Email=${e.target.email.value}`,
    })
      .then((res) => res.text())
      .then((data) => {
        alert(data);
      })
      .catch((err) => console.error(err));
    console.log("Submit");
  };
  return (
    <div>
      <h1 className="heading">Form with Google Sheet</h1>
      <form onSubmit={handleSubmit} className="parent-container">
        <input type="text" name="name" placeholder="enter name" />
        <input type="email" name="email" placeholder="enter email" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
