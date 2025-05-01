import { createRoot } from "react-dom/client";
import './style.css';

function imageCard(id, image, fn, ln) {
    return (
    <div key={id} className="img-card-1">
        <img src={image} alt="" />
        <h3>{fn +' ' + ln}</h3>
    </div>);
};

const root = createRoot(document.querySelector("#root"));
root.render(<div className="container">loading...</div>);

const fetchData = async () => {
  try {
    const response = await fetch("https://dummyjson.com/users");

    if (!response.ok) {
      throw new Error("HTTP Error Status : ", response.status);
    }

    const data = await response.json();
    console.log("Data Received ", data);

    /* 
    Since, data.users is a huge collection of individual user
    therefore, we are using map function to individually address user 
    and pass that individual user data elements to a function as an arguments

    */
    const container = data.users.map((user)=>{
        console.log('user fetched ',user);
        return imageCard(user.id, user.image, user.firstName, user.lastName)
    })
    console.log("container-", container);
    
    root.render(<div className="container">{container}</div>);
    
  } catch (err) {
    console.error("Error Fetch Data from an API- ", err);
  }

  
};

fetchData()