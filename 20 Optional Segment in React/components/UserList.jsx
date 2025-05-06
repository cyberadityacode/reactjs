import { Link } from "react-router"

export default function UserList() {

    const usersData = [
        {id:1, username : "alpha"},
        {id:2, username : "beta"},
        {id:3, username : "gamma"},
        {id:4, username : "delta"},
        {id:5, username : "eplison"},
        {id:6, username : "zeta"},
        {id:7, username : "eta"},
    ]

  return (
    <>
    <div className="text-3xl mb-3">User List Page</div>
    {
        usersData.map((item)=>(
            <div key={item.id} className="ml-4">
                <h3 className="text-xl"><Link to={"/users/"+item.id} > {item.username}</Link></h3>
            </div>
        ))
    }


<div className="text-3xl mb-3">Another List with name in URL</div>
    {
        usersData.map((item)=>(
            <div key={item.id} className="ml-4">
                <h3 className="text-xl"><Link to={"/users/"+item.id +"/"+item.username} > {item.username}</Link></h3>
            </div>
        ))
    }
    </>
    )
}
