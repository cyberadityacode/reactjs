import { createRoot } from "react-dom/client";
import "./style.css";
import { Children } from "react";
// import {products} from "products.json"
// const h1 = <h1>Hello Root Element 1</h1>
const currentDollorToRupeesRate = 82;
// const cards =
function Card(props) {
  // return  [1,2,3].map((id) =>(

  // destructuring es6 feature
  const { key, title, image, brandName, productPrice } = props;
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
      return Card({
        key: product.id,
        title: product.title,
        image: product.thumbnail,
        brandName: product.brand,
        productPrice: product.price,
      });
    });
    console.log(container2);
    root.render(<div className="container">{container2}</div>);
  });



// render needs react element as its argument
 /* 
  Since, React Element must have 4 properties-
  $$typeof : Symbol.for('react-element')
  type: 'h1',
  ref: null,
  props: {}
 */
