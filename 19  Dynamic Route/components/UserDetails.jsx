import { Link, useParams } from "react-router"

export default function UserDetails() {

    // using hook useParam to retrieve id from url parameter

    const paramData = useParams();
    console.log(paramData);
  return (
    <>
    <div>User Details</div>
    <div className="text-center">
        <h2 > User ID is : {paramData.id} </h2>
        <h2> <Link to="/users" >Back</Link> </h2>
    </div>
    </>
  )
}
