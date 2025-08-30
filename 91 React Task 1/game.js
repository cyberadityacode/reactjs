// Number Guessing Game - Console Based
// Your task: Complete the functions below

console.log("🎮 Welcome to the Number Guessing Game!");
console.log("Open the console and follow the prompts to play.");

// TODO: Create a function to generate random number between min and max
function generateRandomNumber(min, max) {
    // Your code here
    // Hint: Use Math.random() and Math.floor()
}

// TODO: Create a function to validate user input
function isValidGuess(guess, min, max) {
    // Your code here
    // Check if guess is a number and within range
}

// TODO: Create a function to get user input
function getUserGuess() {
    // Your code here
    // Use prompt() to get user input
    // Validate the input using isValidGuess()
}

// TODO: Create a function to provide feedback
function provideFeedback(guess, targetNumber) {
    // Your code here
    // Return "too high", "too low", or "correct"
}

// TODO: Create the main game function
function playGame() {
    console.log("\n🎯 Starting new game...");
    console.log("I'm thinking of a number between 1 and 100.");
    
    // Your code here:
    // 1. Generate random number
    // 2. Initialize attempt counter
    // 3. Create game loop
    // 4. Get user guesses
    // 5. Provide feedback
    // 6. Check win condition
    // 7. Display final score
}

// TODO: Create a function to ask if player wants to play again
function playAgain() {
    // Your code here
    // Use confirm() or prompt() to ask user
}

// TODO: Create the main game loop
function startGame() {
    // Your code here
    // Call playGame() and playAgain() in a loop
}

// Start the game when the page loads
startGame();