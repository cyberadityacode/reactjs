import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue in many setups (Vite, Webpack, etc.)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});
const fallbackPosition = {
  lat: 51.505,
  lng: -0.09,
};
function LocationMarker({ setFinalPosition }) {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    map
      .locate()
      .on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      })
      .on("locationerror", function (e) {
        setPosition(fallbackPosition);
        map.flyTo(fallbackPosition, map.getZoom());
        setFinalPosition(fallbackPosition);
      });
  }, [map, setFinalPosition]);

  return position ? (
    <Marker position={position}>
      <Popup>
        {position === fallbackPosition ? "Default Location" : "You are here"}
      </Popup>
    </Marker>
  ) : null;
}

export default function OpenStreetMap() {
  const [finalPosition, setFinalPosition] = useState(fallbackPosition);
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker setFinalPosition={setFinalPosition} />
    </MapContainer>
  );
}
