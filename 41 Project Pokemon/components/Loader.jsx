import React from "react";

export default function Loader() {
  return (
    <>
      
      <div className="w-10 h-10 border-4 border-t-green-500 border-gray-300 rounded-full animate-spin mx-auto"></div>

      {/* <div className="w-10 h-10 border-4 border-gray-400 rounded-full bg-red-400 animate-bounce
      " ></div> */}
      <div className="parent-card">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="pokemon-card animate-pulse flex flex-wrap"
          >
            <img
              //   src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
              src={null} className="bg-slate-400"
              alt=""
            />
            <h3>loading...</h3>
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
