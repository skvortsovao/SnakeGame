// SETTING UP THE CANVAS AND THE INITIAL GAME VARIABLES
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const box = 30; //size of each square
let snake = [{x:10*box, y:10*box}]; //initial snake position where it is located on coordinates (300, 300) - center
let direction = "RIGHT";
const scoreSpan = document.querySelector("#score span");
const scoreHighSpan = document.querySelector("#high-score span");
let highScore = localStorage.getItem("high-score") || 0; //get high score from local storage or set it to 0 if not found
let score = 0;
let game;
scoreSpan.textContent = score;
scoreHighSpan.textContent = highScore; //display the high score in the HTML span
const button = document.querySelector("#start-button");
const gameOver = document.querySelector("#game-over");
let food = { //object, not ARRAY
x: Math.floor(Math.random() * (canvas.width /box)) *box,
y: Math.floor(Math.random() * (canvas.height /box)) *box,
};
/* Math.random(): This function generates a random decimal number between 0 (inclusive) and 1 (exclusive). 
For example, it might generate numbers like  0.45, or 0.12 

canvas.width: represents the total width of the game area (e.g.,  600 in this case). 
Dividing it by  box (the size of each square, e.g., 30px) gives the total number of squares that fit horizontally on the grid. 
If the canvas is 600 pixels wide and each square is 30 pixels, this will result in 20 .
The same logic applies to  for the vertical grid squares.

Math.random()*(canvas.width/box): This multiplies the random decimal from Math.random() by the total number of grid squares. 
For example: If  Math.random() generates  0.5 and the canvas has  20 grid squares, the result will be 0.5*20 = 10.
This ensures the food is placed within the bounds of the grid.

Math.floor(): Since the random position needs to snap to a specific grid square (not a fraction of a square), 
we use  Math.floor() to round the result down to the nearest whole number. For instance:If the calculation gives 10.8, 
Math.floor() makes it 10.

*box: Finally, multiplying by  (the size of each square, e.g., 30px) converts the grid position into pixel 
coordinates that fit the canvas. For example:If the result is  10 (grid position), multiplying it by 30px places the food at .300px */

//CONTROL THE SNAKE MOVEMENT
document.addEventListener("keydown", changeDirection);
function changeDirection(event){
    if(event.key === "ArrowUp" && direction !== "DOWN"){
        direction = "UP";
    }
    if(event.key === "ArrowDown" && direction !== "UP"){
        direction = "DOWN";
    }
    if(event.key === "ArrowLeft" && direction !== "RIGHT"){
        direction = "LEFT";
    }
    if(event.key === "ArrowRight" && direction !== "LEFT"){
        direction = "RIGHT";
    }
}

//DRAW THE GAME
//This function updates the game screen
function drawGame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //this cleares the entire canvas. 
    //draw the food
    ctx.fillStyle = "red"; //This sets the fill color for the next shapes I draw.
    ctx.fillRect(food.x, food.y, box, box);
    //draw the snake
    ctx.fillStyle = "green";
    ctx.strokeStyle = "black"; //This sets the stroke color for the next shapes I draw.
    snake.forEach((segment)=> ctx.fillRect(segment.x, segment.y, box,box));
    //move the snake
    let head = {...snake[0]};
    if(direction === "UP"){
        head.y -= box;
    }
    if(direction === "DOWN"){
        head.y += box;
    }
    if(direction === "LEFT"){
        head.x -= box;
    }
    if(direction === "RIGHT"){
        head.x += box;
    }
  snake.unshift(head);
  //check if the snake eats food
  if(head.x === food.x && head.y === food.y){
    food = {
        x: Math.floor(Math.random() * (canvas.width /box)) *box,
        y: Math.floor(Math.random() * (canvas.height /box)) *box,
    };
    score++;
    scoreSpan.textContent = score; //update visible increasing
    if(score > highScore){ //check if the current score is greater than the high score
        highScore = score; //update high score
        localStorage.setItem("high-score", highScore); //save it in local storage
        scoreHighSpan.textContent = highScore; //display the updated high score in the HTML span
    }
    if(score >=5){
        clearInterval(game);
        game = setInterval(drawGame, 140);
    }
  }
  else{
    snake.pop(); //remove the tail if no food is eaten
  }
  //check collisions
  if(
    head.x < 0 || head.y <0 || head.x >= canvas.width || head.y>= canvas.height || 
    snake.slice(1).some((segment)=> segment.x === head.x && segment.y === head.y)
    /*  This piece of code checks if the snake's head has collided with any part of its own body. snake[0] is the head of the
    snake. slice created a new array that excludes the first segment (the head). So I work only with the body of the snake
    .some((segment)=>...) checks whether at least one element in the body array satisfies the condition inside the arrow function (=>)
    It stops checking as soon as it finds one match. 
    segment.x === head.x && segment.y === head.y : for each segment of the body it compares its x and y 
    coordinates to the head's x and y ccordinates. If both x and y match, this means the head has 
    collided with that particular segment of the body.
    */
  ){
    setTimeout(() => {
        clearInterval(game);
       gameOver.style.display = "block"; //show the game over message
       
    }, 300); // Delay of 300ms to allow final movement correction.

    
  }
}

button.addEventListener("click", () => {
    // Reset all game variables to their initial state
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;
    scoreSpan.textContent = score;
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
    gameOver.style.display = "none"; // Hide the game over message

    // Clear any previous interval before starting a new one
    clearInterval(game);
    game = setInterval(drawGame, 150); // Start the game loop again

});
