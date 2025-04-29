const basketOne = document.querySelector(".basket-1 span");
const basketTwo = document.querySelector(".basket-2 span");
const arrowRight = document.querySelector(".arrows #right");
const arrowLeft = document.querySelector(".arrows #left");

let totalApples = 10;
let secondBasketAppleCount = 0;
let firstBasketAppleCount = totalApples - secondBasketAppleCount;

basketOne.innerText = firstBasketAppleCount;
basketTwo.innerText = secondBasketAppleCount;

arrowRight.addEventListener("click", () => {
  if (firstBasketAppleCount > 0) {
    firstBasketAppleCount--;
    secondBasketAppleCount++;
    basketOne.innerText = firstBasketAppleCount;
    basketTwo.innerText = secondBasketAppleCount;
  }
});

arrowLeft.addEventListener("click", () => {
  if (secondBasketAppleCount > 0) {
    firstBasketAppleCount++;
    secondBasketAppleCount--;
    basketOne.innerText = firstBasketAppleCount;
    basketTwo.innerText = secondBasketAppleCount;
  }
});

// Example of imperative programming code

const arrayNumbers = [1,2,3,4,5]
const doubleNumbers =[]

// objective is to double the arrayNumbers and store into doubleNumbers

for(let i=0; i<arrayNumbers.length; i++){
  doubleNumbers.push(arrayNumbers[i]*2)
}
console.log(doubleNumbers);

// this code is very explicitly instructional creating array, looping, applying operations, then logging

/* 
To reduce the imperative nature of code, we have declarative coding
where it doesn't matter how you do it, rather what you do!
as in ethics we read, end justifies the means (teleological)
Consequentialism: teleology 
The "end justifies the means" philosophy is closely related to consequentialism, an ethical theory that judges the morality of an action based solely on its consequences. 
*/

// declarative programming code

const doubleDeclarativeNumbers = arrayNumbers.map(num => num*2)
console.log(doubleDeclarativeNumbers);

//here, I'm declaring that I want to map a given array to double the element value
//not cared about how looping functions internally and even pushing the values one by one
//just get the outcome... 

//React is much similar to taleological approach ( declarative programming)
/* Where we leverage components for code reusability. 
saving developers precious time and making our code execution fast */