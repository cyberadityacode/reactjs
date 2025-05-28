import { memo, useEffect, useState, useTransition } from "react";
import { getCountryData } from "../api/PostAPI";
import CountryCard from "../components/UI/CountryCard";
import SearchFilter from "../components/UI/SearchFilter";

function Country() {
  const [isPending, startTransaction] = useTransition();
  const [countries, setCountries] = useState([]);

  const [search, setSearch] = useState();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    startTransaction(async () => {
      const res = await getCountryData();
      console.log(res.data);
      setCountries(res.data);
      // console.log(countries);
    });
  }, []);

  if (isPending) return <h1>Loading...</h1>;

  console.log(search,filter);

  // Here is the main logic used in almost every search functionality

  const searchCountry = (country)=>{
    if(search){
      return country.name.common.toLowerCase().includes(search.toLowerCase())
    }else{
      return country;
    }

  }
  const filterRegion = (country) =>{
    if(filter==="all"){
      return country;
    }else{
      return country.region=== filter
    }
  }

  const filterCountries = countries.filter((country)=> searchCountry(country) && filterRegion(country))
  return (
    <section className="country-section">
      <SearchFilter
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        countries={countries} setCountries={setCountries}
      />
      <ul className="grid grid-four-cols">
        {filterCountries.map((country, index) => {
          return <CountryCard key={index} country={country} />;
        })}
      </ul>
    </section>
  );
}

export default Country;
