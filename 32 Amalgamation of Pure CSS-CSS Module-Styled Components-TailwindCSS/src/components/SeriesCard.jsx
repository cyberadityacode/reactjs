import styles from "./Netflix.module.css";
import styled from "styled-components";


  const ButtonWatchNow = styled.button`
    padding: 1.2rem 2.4rem;
    border: none;
    font-size: 1.6rem;
    background-color: ${(props) =>
       props.$rating >= 8.5 ? "#7dcea0" : "#f7dc6f"};
    color: var(--bg-color);
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
    transform: scale(1.03);
  }
`;

const Rating = styled.h3`
    font-size : 1.6rem;
    color:#7dcea0;
    text-transform: capitalize;
`

export const SeriesCard = (props) => {
  console.log("Check Props- ", props);
  // destructuring
  const { img_url, name, rating, description, genre, watch_url } = props.data;
  // const buttonStyle = {}


  // conditional css class
  const ratingClass = rating >= 8.5 ? styles.super_hit : styles.average;

  return (
    <li className={styles.card}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src={img_url} width="200px" height="200px" alt="" />
      </div>
      <div className="flex flex-col gap-6 ">
        <h2>Name: {name} </h2>
        <Rating>
          Rating:{" "}
          <span className={`${styles.rating} ${ratingClass}`}>{rating}</span>{" "}
        </Rating>
        <p className=" underline">Summary: {description}</p>
        <p>Genre {genre.join(", ")}</p>
        <a target="_blank" rel="noreferrer"  href={watch_url}>
          {/* <button style={buttonStyle}>Watch Now </button> */}
          <ButtonWatchNow $rating={rating}>Watch Now </ButtonWatchNow>
        </a>
      </div>
    </li>
  );
};
