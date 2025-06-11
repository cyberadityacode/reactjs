import { useState } from "react";
import { fetchPincodeDetails } from "../api/apiPincode";
import OpenStreetMapOne from "./OpenStreetMapOne";

export default function PinCodeSearch() {
  const [pincode, setPincode] = useState("");
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const handlePinCode = (e) => {
    setPincode(e.target.value);
  };

  const handlePincodeSearch = async () => {
    console.log("I got your Pincode ", pincode);
    setLoading(true);
    try {
      const res = await fetchPincodeDetails(pincode);
      console.log(res);

      if (res.status === 200) {
        setResponse(res);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Incorrect PinCode")
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div className="search-panel">
          <h1>PinCode Search</h1>
          <label htmlFor="pincode">PinCode:</label>
          <input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            onChange={handlePinCode}
          />
          <button onClick={handlePincodeSearch}>Search</button>
          {errorMessage &&  <span style={{color:'red'}}>{errorMessage}</span> }
        </div>

        <div>
          {loading && <p>Loading...</p>}
          {!loading && response.data && (
            <>
              <p>Country: {response.data.country}</p>
              <p>Place Name: {response.data.places[0]["place name"]}</p>
              <p>Longitude: {response.data.places[0]["longitude"]}</p>
              <p>Latitude: {response.data.places[0]["latitude"]}</p>
              <p>State: {response.data.places[0]["state"]}</p>
            </>
          )}
        </div>
        <div>
          <select className="select-places" name="places" multiple>
            {!loading &&
              response.data &&
              response.data.places.map((place, index) => {
                return (
                  <option key={index} value={place}>
                    {place["place name"]}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
      <div>
              <OpenStreetMapOne responseData= {response.data} />

      </div>
    </>
  );
}
