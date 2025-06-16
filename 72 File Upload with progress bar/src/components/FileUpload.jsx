import React, { useState } from "react";
import axios from "axios";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
    setPercent(0);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost/php/16_FileUpload_PHP/uploadprogress.php",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // Smooth delay to simulate animation
            setTimeout(() => {
              setPercent(percent);
            }, 200); // 200ms delay
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setStatus(res.data.message);
    } catch (error) {
      console.error(error);
      setStatus(error.response?.data?.message || "Upload Failed");
    }
  };

  return (
    <div>
      <h1>React File Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <div style={{ marginTop: "15px", width: "100%", background: "#eee" }}>
        <div
          style={{
            width: percent + "%",
            backgroundColor: "green",
            height: "20px",
            color: "white",
            textAlign: "center",
          }}
        >
          {percent > 0 && percent + "%"}
        </div>
      </div>

      <p>{status}</p>
    </div>
  );
}
