const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const startSound = document.getElementById("startSound");
const eatSound = document.getElementById("eatSound");

const snakeBodyRadius = 0;
const snakeHeadRadius = 10;
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "#fefefe";
const snakeColor = "green";
const snakeBorder = "white";
const snakeHeadColor = "blue";
const snakeHeadBorder = "darkblue";
const foodColor = "red";
const unitSize = 25;

let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

const upBtn = document.querySelector(".up");
const downBtn = document.querySelector(".down");
const leftBtn = document.querySelector(".left");
const rightBtn = document.querySelector(".right");

upBtn.addEventListener("click", () => setDirection("UP"));
downBtn.addEventListener("click", () => setDirection("DOWN"));
leftBtn.addEventListener("click", () => setDirection("LEFT"));
rightBtn.addEventListener("click", () => setDirection("RIGHT"));

gameStart();

function gameStart(){
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    startSound.currentTime = 0;
    startSound.play(); // Play start sound
    nextTick();
};

function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 90);
    } else {
        displayGameOver();
    }
};

function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
};

function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};

function moveSnake(){
    const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity};
    snake.unshift(head);

    // Check if food eaten
    if(snake[0].x === foodX && snake[0].y === foodY){
        score += 1;
        scoreText.textContent = score;
        createFood();
        eatSound.currentTime = 0;
        eatSound.play(); // Play eat sound
    } else {
        snake.pop();
    }
};

function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    
    for (let i = 0; i < snake.length; i++) {
        const snakePart = snake[i];
        if(i === 0){
            ctx.fillStyle = snakeHeadColor;
            ctx.strokeStyle = snakeHeadBorder;
        }
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
        if(i === 0){
            ctx.fillStyle = snakeColor;
            ctx.strokeStyle = snakeBorder;
        }
    }
};

function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
    const goingUp = (yVelocity === -unitSize);
    const goingDown = (yVelocity === unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);

    switch(true){
        case (keyPressed === LEFT && !goingRight):
            xVelocity = -unitSize; yVelocity = 0; break;
        case (keyPressed === UP && !goingDown):
            xVelocity = 0; yVelocity = -unitSize; break;
        case (keyPressed === RIGHT && !goingLeft):
            xVelocity = unitSize; yVelocity = 0; break;
        case (keyPressed === DOWN && !goingUp):
            xVelocity = 0; yVelocity = unitSize; break;
    }
};

function checkGameOver(){
    if(snake[0].x < 0 || snake[0].x >= gameWidth || snake[0].y < 0 || snake[0].y >= gameHeight){
        running = false;
    }

    for(let i = 1; i < snake.length; i++){
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            running = false;
        }
    }
};

function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth/2, gameHeight/2);
    running = false;
};

function resetGame(){
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    gameStart();
};

function setDirection(direction){
    const goingUp = (yVelocity === -unitSize);
    const goingDown = (yVelocity === unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);

    switch(direction){
        case "UP":
            if(!goingDown){ xVelocity = 0; yVelocity = -unitSize; }
            break;
        case "DOWN":
            if(!goingUp){ xVelocity = 0; yVelocity = unitSize; }
            break;
        case "LEFT":
            if(!goingRight){ xVelocity = -unitSize; yVelocity = 0; }
            break;
        case "RIGHT":
            if(!goingLeft){ xVelocity = unitSize; yVelocity = 0; }
            break;
    }
}
