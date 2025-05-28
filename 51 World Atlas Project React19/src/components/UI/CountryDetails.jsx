import React, { useEffect, useState, useTransition } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getCountryDetails } from "../../api/PostAPI";

export default function CountryDetails() {
  const params = useParams();
  const [isPending, startTransaction] = useTransition();
  const [countries, setCountries] = useState(null);

  const navigate = useNavigate();

  const handleGoBack = ()=>{
    navigate(-1);
  }
  useEffect(() => {
    startTransaction(async () => {
      const res = await getCountryDetails(params.id);
      if (res.status === 200) {
        setCountries(res.data[0]);
        console.log(res.data);
        console.log("Capital name is ", res.data[0].capital);
      }
    });
  }, [params.id]);

  if (isPending) return <h1>Loading Country Details...</h1>;

  // console.log("state object is filled - ", countries);
  // Conditional rendering: render only if countries has valid data
  if (!countries) return null;
  return (
    <section className="card country-details-card container">
      <div className="container-card bg-white-box">
        <div className="country-image grid grid-two-cols">
          <img src={countries.flags?.svg} alt={countries.flags?.alt} />

          <div className="country-content">
            <p className="card-title">{countries.name?.official}</p>
            <div className="infoContainer">
              <p>
                <span className="card-description">Native Names:</span>
                {Object.keys(countries.name?.nativeName)
                  .map((key) => countries.name?.nativeName[key]?.common)
                  .join(", ")}
              </p>
              <p>
                <span className="card-description">Population: </span>
                {countries.population?.toLocaleString()}
              </p>
              <p>
                <span className="card-description">Region: </span>
                {countries.region}
              </p>
              <p>
                <span className="card-description">Sub-Region: </span>
                {countries.subregion}
              </p>
              <p>
                <span className="card-description">Currency: </span>
                {Object.keys(countries.currencies)}
              </p>
            </div>
              <p>
                <span className="card-description">Borders: </span>
                {countries.borders.join(", ")}
              </p>
               <button onClick={handleGoBack}>Go Back</button>
          </div>
         
        </div>
        {/* <h1>{countries.name?.common}</h1> */}
      </div>
    </section>
  );
}
