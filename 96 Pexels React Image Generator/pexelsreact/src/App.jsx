import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [photos, setPhotos] = useState([]);
  const [query, setQuery] = useState("nature");
  const PEXELS_API_KEY = import.meta.env.VITE_API_KEY;
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch(
          `https://api.pexels.com/v1/search?query=${query}&per_page=12`,
          {
            headers: {
              Authorization: PEXELS_API_KEY,
            },
          }
        );
        const data = await res.json();
        setPhotos(data.photos || []);
      } catch (err) {
        console.error("Error fetching from Pexels:", err);
      }
    }
    fetchPhotos();
  }, [query]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pexels Gallery</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search images..."
        style={{ padding: "8px", marginBottom: "20px", width: "250px" }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "12px",
        }}
      >
        {photos.map((p) => (
          <img
            key={p.id}
            src={p.src.medium}
            alt={p.photographer}
            style={{ width: "100%", borderRadius: "8px" }}
          />
        ))}
      </div>
    </div>
  );
}

export default App
