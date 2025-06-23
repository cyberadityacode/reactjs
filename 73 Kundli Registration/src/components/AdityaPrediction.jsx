import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: "AIzaSyDUKoXd4PEaJ_iY8e3ZOwFN1fTkiQ9vpyk", // In production, use env vars!
});

const promptD1 = `Act as a Vedic Astrologer and generate my D1 Chart (Rasi/Lagna Kundali) based on the following exact specifications:



- 🔢 Kundali Type: D1 Chart (Rasi / Lagna Kundali)

- 🔭 Astrology System: KP System / Nakshatra Nadi

- 🧭 Ayanamsa Type: KP New

- 🪐 Ayanamsa Value: 23° 40′ 34″

- 🕰 Sideral Time: 01:04:46

- 📍 Place of Birth: Jabalpur, Madhya Pradesh, India

- 📅 Date of Birth: 07 July 1993

- ⏰ Time of Birth: 06:15 AM IST (India Standard Time)

- 🗺 Chart Style: North Indian

- 🌗 House System: Whole Sign House system

- 🛠 Use Swiss Ephemeris or accurate astronomical calculation library for precision.

- 📦 Output should include:  

  - Planet  

  - Sign (Rashi)  

  - House  

  - Nakshatra  

  - Nakshatra Pada  

  - Degree in Sign  



Also clarify placement of Rahu and Ketu carefully as per KP New Ayanamsa and Whole Sign House logic. Don't confuse with tropical chart or Western houses. Use Sidereal zodiac (not tropical).



Return in clean JSON format. Mention any important Yogas or karmic observations briefly.
`;

export default function AdityaPrediction() {
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePrediction = async () => {
    setLoading(true);
    setPrediction("");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash", // or "gemini-1.5-pro" if available
        contents: [{ role: "user", parts: [{ text: promptD1 }] }],
      });

      //   const resultText = await response.text();
      console.log(response);
      //   setPrediction(resultText);
    } catch (error) {
      console.error("Error generating prediction:", error);
      alert("Failed to generate prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h2>D1 Chart Prediction</h2>
      <button onClick={handlePrediction} disabled={loading}>
        {loading ? "Generating..." : "Prediction Button"}
      </button>

      {loading && <p>🔄 Please wait... Calculating your D1 Chart</p>}

      {prediction && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            marginTop: "1rem",
            background: "#f7f7f7",
            padding: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          {prediction}
        </pre>
      )}
    </div>
  );
}
