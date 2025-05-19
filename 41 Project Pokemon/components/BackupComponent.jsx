import React from "react";

export default function BackupComponent() {
  return (
    <div className="text-3xl">
      <h1>Let's Catch Pokemon</h1>
      <div className="search-component">
        <input type="text" className="border rounded text-center" />
      </div>

      <div className="parent-card">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="pokemon-card">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
              alt=""
            />
            <h3>Bulbasaur</h3>
            <div className="pokemon-zone">Grass</div>
            <div className="pokemon-card-details">
              <span>Height : 1</span>
              <span>Weight : 69</span>
              <span>Speed : 45</span>
              <span>Experience : 64</span>
              <span>Attack : 49</span>
              <span>Abilities : overgrow</span>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}
