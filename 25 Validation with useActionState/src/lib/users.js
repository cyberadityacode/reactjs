export const users = [
    {
        username : "aditya",
        password : "ad1077"
    },
    {
        username : "cyberaditya",
        password : "dc1077"
    },
    {
        username : "react",
        password : "js"
    }
]

export const findUser = (username,password)=>
    users.find(user=> user?.username === username && user?.password === password) ?? {message:"I cant find user call nia"}

export const isUserExist = (username)=>
    users.some((isUser) => isUser?.username === username)

export const userAuthentication = (username, password)=>
    users.some((userAuth) => userAuth?.username ===username && userAuth?.password === password)

export const addUser = (username, password)=>
    isUserExist(username) 
        ? 
        {success: false, message: "user already exists"} 
        : (users.push({username,password}), {success:true, message:"User Added Successfully"})

