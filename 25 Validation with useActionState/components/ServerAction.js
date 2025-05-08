import { userAuthentication } from "../src/lib/users";

export default async function ServerAction(prevState, formData) {
  const userName = formData.get('username')
  const password = formData.get('password')

  if(!userAuthentication(userName,password)){
    await new Promise((resolve) =>{
      setTimeout(resolve,2000)
    })
    console.log('doest match dude');
    return `User ${userName} or Password is incorrect `
  }else{
    console.log('cool buddy');
    await new Promise((resolve) =>{
      setTimeout(resolve,2000)
    })
    return `Login Successfull ${userName} ji`
  }
}
