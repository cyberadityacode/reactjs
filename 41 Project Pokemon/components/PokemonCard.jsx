import React from "react";

export default function PokemonCard({ pokemonData }) {
  const {
    id,
    name,
    height,
    weight,
    base_experience,
    sprites,
    types,
    abilities,
    stats,
  } = pokemonData;

  //    console.log(sprites.other["official-artwork"].front_default);
  return (
    <>
      <div key={id} className="pokemon-card">
        <img
          //   src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
          src={sprites.other["official-artwork"].front_default}
          alt=""
        />
        <h3>{name}</h3>
        <div className="pokemon-zone">
          {types.map((currentType) => currentType.type.name).join(", ")}
        </div>
        <div className="pokemon-card-details">
          <span>Height : {height}</span>
          <span>Weight : {weight}</span>
          <span>Speed : {stats[5].base_stat}</span>
          <span>Experience : {base_experience}</span>
          <span>Attack : {stats[1].base_stat}</span>
          <span>
            Abilities:
            {abilities
              .map((currentAbility) => currentAbility.ability.name)
              .join(", ")}
          </span>
        </div>
      </div>
    </>
  );
}
