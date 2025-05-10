import seriesData from "../api/seriesData.json";
import { SeriesCard } from "./SeriesCard";

export const NetflixSeries = () => {
  // const name = "Queen of Teers";
  // const rating = "8.2";
  // const summary =
  //   "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio error, delectus harum accusantium vitae quis cupiditate sunt exercitationem quaerat assumenda voluptates, id quo quas qui quibusdam at debitis. Vitae, aliquid!";
  // const age = 31;
  // /*  let canWatch = "Not Available"
  // if (age>=18) canWatch = "Watch Now";  */

  // const canWatch = () => {
  //   if (age >= 18) return "Watch Now";
  //   return "Not Available";
  // };

  // const returnGenre = () => {
  //   const genre = "RomCom";
  //   return genre;
  // };

  console.log(seriesData);
  return (
    <>
      {seriesData.map((curEl) => (
        <SeriesCard key={curEl.id}  data = {curEl} />
      ))}
    </>
  );
};
// export default NetflixSeries;

export const Footer = () => {
  return <p>copyright @adityadubey</p>;
};
