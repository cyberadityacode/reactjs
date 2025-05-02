const id = Symbol("myId")

let user = {
    username : "aditya",
    [id] : 1
}
console.log(id);
console.log(user[id]); //1
console.log(user); 

console.log(Object.keys(user)); //Symbol is not shown
/* 
✔ console.log(user) in DevTools shows the Symbol for debugging
✖ But JavaScript methods like Object.keys() ignore it by design
 */