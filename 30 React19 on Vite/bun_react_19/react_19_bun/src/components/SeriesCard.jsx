export const SeriesCard = (props) => {
  console.log('Check Props- ',props);
  // destructuring
  const {img_url,name, rating,description,genre, watch_url} = props.data


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "500px",
        height: "650px",
        border: "1px solid red",
        padding: "10px",
        fontFamily: "cursive",
        fontSize: "18px",
        textAlign: "justify",
        margin: "10px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src={img_url} width="200px" height="200px" alt="" />
      </div>
      <h2 style={{ textAlign: "center" }}>Name: {name} </h2>
      <h3>Rating: {rating}</h3>
      <p>Summary: {description}</p>
      <p>Genre {genre}</p>
      {/* <button>{ age>=18 ? "Watch Now": "Don't Watch"} </button> */}
      {/* <button>{ canWatch} </button> */}
      <a target="_blank" href={watch_url}>
        <button>Watch Now </button>
      </a>
    </div>
  );
};
