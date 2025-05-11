export const SeriesCard = (props) => {
  console.log("Check Props- ", props);
  // destructuring
  const { img_url, name, rating, description, genre, watch_url } = props.data;
  const buttonStyle = {
    padding: "1.2rem 2.4rem",
    border: "none",
    fontSize: "1.6rem",
    backgroundColor: `${rating>=8.5 ? "#7dcea0":"#f7dc6f"}`,
    color: "var(--bg-color)",
    fontWeight: "bold",
    cursor: "pointer"
  };

  const ratingClass = rating>=8.5 ? "super_hit":"average"

  return (
    <li className="card">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src={img_url} width="200px" height="200px" alt="" />
      </div>
      <div className="card-content">
        <h2 >Name: {name} </h2>
        <h3 >Rating: <span className={`rating ${ratingClass}`}>{rating}</span> </h3>
        <p>Summary: {description}</p>
        <p>Genre {genre.join(", ")}</p>
        <a target="_blank" href={watch_url}>
          <button style={buttonStyle}>Watch Now </button>
        </a>
      </div>
    </li>
  );
};
