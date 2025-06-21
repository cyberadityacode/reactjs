import React, { useState, useEffect } from "react";
import cities from "../data/in.json"; // adjust path accordingly

export default function KundaliForm() {
  const [formData, setFormData] = useState({
    username: "",
    date: "",
    tob: "",
    place: "",
    lat: "",
    lon: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = cities.filter((city) =>
        city.city.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered.slice(0, 5)); // limit to top 5 suggestions
    } else {
      setFilteredCities([]);
    }
  }, [searchTerm]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "place") {
      setSearchTerm(e.target.value);
    }
  };

  const handlePlaceSelect = (cityObj) => {
    setFormData({
      ...formData,
      place: `${cityObj.city}, ${cityObj.admin_name}`,
      lat: cityObj.lat,
      lon: cityObj.lng,
    });
    setSearchTerm("");
    setFilteredCities([]);
  };

  const handleKundaliSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // send formData to backend API

    fetch("http://localhost/php/kundali/kundali.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Kundali Data:", data);
        // You can format and display it
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>Kundali Form</h1>
      <form onSubmit={handleKundaliSubmit}>
        <div>
          <label htmlFor="username">Name:</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label htmlFor="date">DOB:</label>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="tob">Time:</label>
          <input
            type="time"
            name="tob"
            id="tob"
            value={formData.tob}
            onChange={handleChange}
          />
        </div>
        <div style={{ position: "relative" }}>
          <label htmlFor="place">Place:</label>
          <input
            type="search"
            name="place"
            id="place"
            value={formData.place}
            onChange={handleChange}
            placeholder="Enter Place of Birth"
            autoComplete="off"
          />
          {filteredCities.length > 0 && (
            <ul
              style={{
                position: "absolute",
                zIndex: 10,
                backgroundColor: "white",
                border: "1px solid #ccc",
                listStyle: "none",
                padding: "5px",
                marginTop: "0",
                width: "100%",
              }}
            >
              {filteredCities.map((city, index) => (
                <li
                  key={index}
                  style={{ cursor: "pointer", padding: "5px" }}
                  onClick={() => handlePlaceSelect(city)}
                >
                  {city.city}, {city.admin_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit">Create Kundali</button>
      </form>
    </div>
  );
}
