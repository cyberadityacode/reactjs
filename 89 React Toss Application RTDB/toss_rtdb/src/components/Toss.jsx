import { onValue, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

export default function Toss() {
  const [result, setResult] = useState("No Toss Yet");
  const [loading, setLoading] = useState(true);

  //   Toss the coin and update the database
  const handleToss = () => {
    const tossResult = Math.random() < 0.5 ? "Heads" : "Tails";
    set(ref(db, "toss/"), {
      result: tossResult,
      timestamp: Date.now(),
    });
  };

  //   Listen for the changes in the toss
  useEffect(() => {
    const tossRef = ref(db, "toss/");
    onValue(tossRef, (snapshot) => {
      if (snapshot.exists()) {
        setResult(snapshot.val().result);
      } else {
        setResult("No Toss Yet");
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Coin Toss App</h1>
      <button
        onClick={handleToss}
        className={`px-6 py-3 rounded-lg text-lg transition ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Loading..." : "Toss Coin"}
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <h2 className="mt-6 text-2xl">Result: {result}</h2>
      )}
    </div>
  );
}
