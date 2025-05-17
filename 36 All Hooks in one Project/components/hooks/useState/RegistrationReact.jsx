import React, { useState } from "react";

export default function RegistrationReact() {
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    console.log("Form Submitted Successfully", userForm);
    setSubmitted(true);
    //reset to empty field after submit
    setUserForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
    });
  };
  return (
    <div className="container flex justify-center items-center ">
      <h1>Registration Form React19</h1>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name="firstName"
          value={userForm.firstName}
          onChange={handleInputChange}
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={userForm.lastName}
          onChange={handleInputChange}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={userForm.email}
          onChange={handleInputChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={userForm.password}
          onChange={handleInputChange}
        />
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          name="phone"
          placeholder="9876543210"
          pattern="[0-9]{10}"
          value={userForm.phone}
          onChange={handleInputChange}
        />
        <button type="submit" className="btn-submit">
          Register
        </button>
      </form>

      {submitted && (
        <p className="text-green-600">Thank you for registering!</p>
      )}
      <span>
        Hello My name is {userForm.firstName} {userForm.lastName}
        my email is {userForm.email} and my phone number is {userForm.phone}
      </span>
    </div>
  );
}
