import React, { useState } from "react";
import axios from "axios";

const AdSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const accessToken = "2132750950540775|aRv7nR2mQgEF62kHCbsO46C8VLI"; // Replace this with your actual token

  const handleSearch = async () => {
    if (!keyword) return;

    setLoading(true);
    setError("");
    setAds([]);

    try {
      const response = await axios.get("https://graph.facebook.com/v19.0/ads_archive", {
        params: {
          access_token: accessToken,
          ad_type: "POLITICAL_AND_ISSUE_ADS",
          ad_reached_countries: "IN",
          search_terms: keyword,
          limit: 10,
        },
      });

      setAds(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch ads.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>🔍 Facebook Ads Library Search</h2>
      <input
        type="text"
        placeholder="Enter keyword (e.g. education)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
      />
      <button onClick={handleSearch} style={{ padding: "0.5rem 1rem" }}>
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {ads.map((ad, idx) => (
        <div key={idx} style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
          <p><strong>Page:</strong> {ad.page_name}</p>
          <p><strong>Created On:</strong> {ad.ad_creation_time}</p>
          <p><strong>Ad Text:</strong> {ad.ad_creative_body?.slice(0, 150)}...</p>
          <a href={ad.ad_snapshot_url} target="_blank" rel="noopener noreferrer">
            View Ad
          </a>
        </div>
      ))}
    </div>
  );
};

export default AdSearch;
