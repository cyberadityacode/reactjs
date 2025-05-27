import countryFacts from "../api/countryData.json";

export default function About() {
  return (
    <section className="section-about container">
      <h2 className="container-title">
        Here are the interesting Facts <br /> We're proud of...
      </h2>
      <div className="gradient-cards">
        {countryFacts.map((country) => {
          return (
            <div key={country.id} className="card">
              <div className="container-card bg-blue-box">
                <p className="card-title">{country.countryName}</p>
                <p>
                  <span className="card-description">Capital:{country.capital}</span>
                </p>
                <p>
                  <span className="card-description">
                    Population:{country.population}
                  </span>
                </p>
                <p>
                  <span className="card-description">
                    Interesting Fact:{country.interestingFact}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
