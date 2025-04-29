## Imperative programming is a style of programming where you tell the computer how to do something, step-by-step.

> You give explicit instructions about:

1. what to do

2. in what order

3. how to change the program's state (variables, memory, etc.)

In imperative code, you are like a teacher telling a student exactly each step to solve a math problem, not just what the final answer should be.
---

`In JavaScript (imperative style):`
```
    let numbers = [1, 2, 3, 4, 5];
    let doubled = [];

    for (let i = 0; i < numbers.length; i++) {
        doubled.push(numbers[i] * 2);
    }

    console.log(doubled);  // [2, 4, 6, 8, 10] 
```

> Here you are saying:

1. Create an empty array.

2. Loop over each number.

3. Multiply by 2.

4. Push into the new array.

You're telling the computer exactly what to do at each step.

## Declarative programming is where you focus on what you want — not how to get it.

```
    const numbers = [1, 2, 3, 4, 5];
    const doubled = numbers.map(num => num * 2);

    console.log(doubled);  // [2, 4, 6, 8, 10]
```

Here you are describing: "I want to map this array and double each value" — but you are not manually controlling loops, pushes, etc.

Style | Meaning | Example
Imperative | How to do it | "Go to the kitchen, open the fridge, grab the milk, pour it into a cup."
Declarative | What you want | "Please give me a glass of milk."


1. Most traditional languages (C, Java, JavaScript, Python) support imperative programming.

2. Imperative programming is good for when you need full control over the system (performance, memory management, etc.).

3. It can become more complex if the steps are large and deeply nested (because you have to manage everything yourself).

Keywords often found in Imperative Programming:
for, while loops

if, else

variable mutation (let, var)

step-by-step procedures