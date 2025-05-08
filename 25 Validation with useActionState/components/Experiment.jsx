import React from 'react'
import {users, findUser, isUserExist, addUser} from '../src/lib/users'

export default function Experiment() {

  console.log(users);
  const findUserDetail  = findUser('aditya', 'ad1077')
  console.log('User Details are as followed: ',findUserDetail);
  
  // check if user Exist or Not.
  const isUserFound = isUserExist('aditya', 'ad1077')
  console.log('Is User Found: ',isUserFound);

  //add user

  console.log('dubeyji - ', addUser('dubeyji','dc1077'));
  console.log('dubeyji2 - ', addUser('dubeyji','dc1077'));
  
  return (
    <div>Experiment</div>
  )
}
