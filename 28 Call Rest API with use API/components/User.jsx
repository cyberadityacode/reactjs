import { use } from "react"

export default function User({userResource}) {
  const userData = use(userResource)
  console.log(userData.users);
  return (
    <div>
        <h1>Username is adityadubey</h1>
        {userData.users.map((user)=> (
          <p key={user.id}>{user.firstName}</p>
        ))}
    </div>
  )
}
