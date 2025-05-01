import { createRoot } from "react-dom/client";
import "./style.css";
// import {products} from "products.json"
// const h1 = <h1>Hello Root Element 1</h1>
const currentDollorToRupeesRate = 82;
// const cards =
function Card(key, title, image, brandName, productPrice) {
  // return  [1,2,3].map((id) =>(
  return (
    <div key={key} className="card">
      <img src={image} alt={brandName} />
      <div className="card-content">
        <h3>{title}</h3>
        <p>{brandName}</p>
        <p>
          <b>
            Price ₹{" "}
            {Math.floor(
              productPrice * currentDollorToRupeesRate
            ).toLocaleString()}
          </b>
        </p>
      </div>
    </div>
  );
  //   ))
}

const root = createRoot(document.querySelector("#root"));

// root.render([cards,cards]);
// root.render(<div className="container">{Card()}</div>);

// Show loading text initially
root.render(<h2 className="loader">Loading...</h2>);

fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    const container2 = data.products.map((product) => {
      // console.log(product);
      return Card(
        product.id,
        product.title,
        product.thumbnail,
        product.brand,
        product.price
      );
    });
    console.log(container2);
    root.render(<div className="container">{container2}</div>);
  });
