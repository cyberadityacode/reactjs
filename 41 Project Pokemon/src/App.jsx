import React, { useEffect, useState } from "react";
import PokemonCard from "../components/PokemonCard";
import Loader from "../components/Loader";
import NoPokemonFound from "../components/NoPokemonFound";

export default function App() {
  const API = "https://pokeapi.co/api/v2/pokemon?limit=50";
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchPokemon = async () => {
    setError(null); // clear previous error
    setLoading(true); // ensure fresh load
    try {
      const res = await fetch(API);
      if (!res.ok) {
        throw new Error("not able to load api");
      }
      const data = await res.json();
      // console.log(data);
      // console.log(data.count);
      // console.log(data.results[0]); //bulbasaur

      const detailedPokemonData = data.results.map(async (currentPokemon) => {
        // console.log(currentPokemon.url);
        const res = await fetch(currentPokemon.url);
        if (!res.ok) {
          throw new Error("Pokemon is not willing to communicate with you!");
        }
        const data = await res.json();
        // console.log('booom... ',data);
        return data;
      });
      // console.log(detailedPokemonData); //24 promises returned

      // Promise.all takes promises in args, it will return data iff all promises fulfilled, in any case, even if 1 promise reject, it wont provide result
      const detailedResponse = await Promise.all(detailedPokemonData);
      // console.log(detailedResponse);
      setPokemon(detailedResponse);
    } catch (error) {
      setError(error);
      console.error("caching error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    // console.log(search);
    console.log(searchPokemonByName);
  }, [search]);

  const handlePokemonSearch = (event) => {
    // const {name, value} = event.target;
    setSearch(event.target.value);
  };

  const searchPokemonByName = pokemon.filter((currentPokemon) =>
    currentPokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return <h1>ufff.... {error.message}</h1>;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <h1>Let's Catch Pokemon</h1>
      <div className="search-component sticky top-0 z-10 bg-white">
        <input
          name="search"
          type="text"
          placeholder="Search Pokemon..."
          value={search}
          onChange={handlePokemonSearch}
          className="search-pokemon"
        />
      </div>

      <div className="parent-card">
        {searchPokemonByName.length > 0 ? (
          searchPokemonByName.map((poke) => (
            // {pokemon && pokemon.map((poke) => (
            // <li key={poke.id}>{poke.name}</li>
            <PokemonCard key={poke.id} pokemonData={poke} />
          ))
        ) : (
          <NoPokemonFound />
        )}
      </div>
    </>
  );
}
