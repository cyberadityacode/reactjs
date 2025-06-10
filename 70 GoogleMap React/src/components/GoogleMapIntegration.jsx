import React from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

export default function GoogleMapIntegration() {
  const position = { lat: 23.17, lng: 79.98 };

  const apiKey = import.meta.env.VITE_GOOGLEMAPAPI;
  const mapId = import.meta.env.VITE_MAPID; // Optional if you're not using styled maps

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: "100vh", width: "100%" }}>
        <Map
          center={position}
          zoom={9}
          mapId={mapId} // Remove this line if not using map styles
        />
      </div>
    </APIProvider>
  );
}
