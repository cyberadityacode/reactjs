import React from "react";

export default function NoPokemonFound() {
  return (
    <>
      <div className="parent-card">
        {[...Array(1)].map((_, index) => (
          <div
            key={index}
            className="pokemon-card animate-pulse flex flex-wrap"
          >
            <img
              //   src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
              src="pokeball2.jpg"
              className="bg-white"
              alt=""
            />
            <h3>No Pokemon Found...</h3>
            <div className="pokemon-zone">...</div>
            <div className="pokemon-card-details">
              <span>Height : </span>
              <span>Weight : </span>
              <span>Speed :</span>
              <span>Experience : </span>
              <span>Attack : </span>
              <span>Abilities : </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
