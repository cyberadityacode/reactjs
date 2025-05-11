export const SeriesCard = (props) => {
  console.log("Check Props- ", props);
  // destructuring
  const { img_url, name, rating, description, genre, watch_url } = props.data;
  const buttonStyle = {
    padding: "1.2rem 2.4rem",
    border: "none",
    fontSize: "1.6rem",
    backgroundColor: "var(--btn-hover-bg-color)",
    color: "var(--bg-color)",
  };

  return (
    <li className="card">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src={img_url} width="200px" height="200px" alt="" />
      </div>
      <div className="card-content">
        <h2 style={{ textAlign: "center" }}>Name: {name} </h2>
        <h3 style={{fontSize:'1.5rem', fontWeight:'bold'}}>Rating: {rating}</h3>
        <p>Summary: {description}</p>
        <p>Genre {genre.join(", ")}</p>
        {/* <button>{ age>=18 ? "Watch Now": "Don't Watch"} </button> */}
        {/* <button>{ canWatch} </button> */}
        <a target="_blank" href={watch_url}>
          <button style={buttonStyle}>Watch Now </button>
        </a>
      </div>
    </li>
  );
};
