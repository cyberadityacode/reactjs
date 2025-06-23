import React from "react";
import astroreha from "astroreha";

export default function Astroreha() {
  const birthChart = astroreha.positioner.getBirthChart(
    "1993-07-07",
    "06:15:00",
    23.1667,
    79.9333,
    5.5
  );
  console.log(birthChart);
  return <div>Astroreha</div>;
}
