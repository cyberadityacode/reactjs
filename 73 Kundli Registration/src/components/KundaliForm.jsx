import React, { useState, useEffect } from "react";
import cities from "../data/in.json"; // make sure path is correct
import IndianAstrology from "indian-astrology";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: "AIzaSyDUKoXd4PEaJ_iY8e3ZOwFN1fTkiQ9vpyk", // Replace with secure method in production
});

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
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = cities.filter((city) =>
        city.city.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered.slice(0, 5));
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

    fetch("http://localhost/php/kundali/kundali.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Kundali Data:", data);
      })
      .catch((err) => console.error(err));
  };

  const handlePrediction = async () => {
    if (!formData.date || !formData.tob) {
      alert("Please fill in Date of Birth and Time of Birth before prediction.");
      return;
    }

    const [year, month, day] = formData.date.split("-").map(Number);
    const [hour, minute] = formData.tob.split(":").map(Number);

    // Get moonDetails from IndianAstrology
    const moonDetails = IndianAstrology.getByDate(
      day,
      month,
      year,
      hour,
      minute,
      5,
      30,
      false
    );

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Act as an astrologer, what's your prediction for the native whose moon rashi is ${moonDetails.zodiacSign}, dasha is ${moonDetails.currentDasha}, and nakshatra is ${moonDetails.nakshatra}. Answer in json format.`,
      });

      console.log("Prediction:", response.text);
      setPrediction(response.text);
    } catch (error) {
      console.error("Error generating prediction:", error);
      alert("Failed to generate prediction.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
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
        <button type="submit" style={{ marginTop: "10px" }}>
          Create Kundali
        </button>
      </form>

      <button
        onClick={handlePrediction}
        style={{ marginTop: "10px", backgroundColor: "#444", color: "white" }}
      >
        Generate Prediction
      </button>

      {prediction && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            whiteSpace: "pre-wrap",
          }}
        >
          <h3>Prediction:</h3>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
}
