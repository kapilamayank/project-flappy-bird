const canvas = document.getElementById("canvas1");
const CANVAS_WIDTH = (canvas.width = 1200);
const CANVAS_HEIGHT = (canvas.height = 800);

const ctx = canvas.getContext("2d");

let gameOver = false;
let gameSpeed = 1;
let gap = 200;
let score = 0;
let obstacles = [];

class Player {
  constructor() {
    this.width = 50;
    this.height = 50;

    this.x = 100;
    this.y = CANVAS_HEIGHT / 2 - this.height / 2;

    this.vy = 0;
    this.weight = 0.45;

    window.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        this.vy = 8;
      }
    });
  }

  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(obstacles) {
    //checking for collissions:
    obstacles.forEach((obstacle) => {
      if (this.collissionIsDetected(obstacle)) gameOver = true;
      this.incrementScore(obstacle);
    });

    //update velocity and position
    this.vy -= this.weight;
    this.y -= this.vy;

    if (this.y > canvas.height - this.height) {
      this.y = canvas.height - this.height;
      this.vy = 0;
    }

    if (this.y <= 0) {
      this.y = 0;
      this.vy = 0;
    }
  }

  // to detect collission between the player and the obstacle
  collissionIsDetected(obstacle) {
    let obstacleUpperLowerLeftEdge = obstacle.x; // same for both
    let obstacleUpperLowerRightEdge = obstacle.x + obstacle.width; //same for both

    let obstacleUpperBottomEdge = obstacle.upperHeight;

    let obstacleLowerTopEdge = canvas.height - obstacle.lowerHeight;

    let playerLeftEdge = this.x;
    let playerRightEdge = this.x + this.width;
    let playerTopEdge = this.y;
    let playerBottomEdge = this.y + this.height;

    // console.log(
    //   obstacleUpperLowerLeftEdge,
    //   obstacleUpperLowerRightEdge,
    //   obstacleUpperBottomEdge,
    //   playerLeftEdge,
    //   playerRightEdge,
    //   playerTopEdge,
    //   playerBottomEdge
    // );

    if (
      playerLeftEdge > obstacleUpperLowerRightEdge ||
      playerRightEdge < obstacleUpperLowerLeftEdge ||
      (playerBottomEdge < obstacleLowerTopEdge &&
        playerTopEdge > obstacleUpperBottomEdge)
    ) {
      // no collission
    } else {
      gameOver = true;
    }
  }

  incrementScore(obstacle) {
    //player left edge beyond the right edge of the obstacle
    if (!obstacle.countedInScore && this.x > obstacle.x + obstacle.width) {
      score++;
      obstacle.countedInScore = true;
    }
  }
}

class Obstacle {
  constructor(gameSpeed, gap) {
    this.gap = gap; // gap between upper and lower
    this.speedX = gameSpeed;
    this.minHeight = 50;

    this.width = 100; // upper = lower

    this.upperHeight =
      this.minHeight +
      Math.random() * (canvas.height - this.gap - this.minHeight * 2);
    this.lowerHeight = canvas.height - this.upperHeight - this.gap;

    this.x = canvas.width; // upper = lower

    this.markedForDeletion = false;

    this.countedInScore = false;
  }

  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, 0, this.width, this.upperHeight); // upper
    ctx.fillRect(
      this.x,
      canvas.height - this.lowerHeight,
      this.width,
      this.lowerHeight
    ); // lower
  }

  update() {
    this.speedX = gameSpeed;
    this.x -= this.speedX;
    if (this.x < 0 - this.width) this.markedForDeletion = true;
  }
}

let timeSinceLastObstacle = 0;
let obstacleTimeInterval = 5000;

function handleObstacles(deltaTime) {
  timeSinceLastObstacle += deltaTime;

  if (timeSinceLastObstacle >= obstacleTimeInterval) {
    timeSinceLastObstacle = 0;
    obstacles.push(new Obstacle(gameSpeed, gap));
  }

  obstacles = obstacles.filter((obstacle) => !obstacle.markedForDeletion);
  console.log(obstacles);

  obstacles.forEach((obstacle) => {
    obstacle.update();
    obstacle.draw();
  });
}

let obstacleGapInterval = 300;
function handleObstaclesNew() {
  const lastObstacle = obstacles[obstacles.length - 1];

  if (!lastObstacle || lastObstacle.x < canvas.width - obstacleGapInterval) {
    obstacles.push(new Obstacle(gameSpeed, gap));
  }

  obstacles = obstacles.filter((obstacle) => !obstacle.markedForDeletion);

  obstacles.forEach((obstacle) => {
    obstacle.update();
    obstacle.draw();
  });
}

class BGLayer {
  constructor(imagePath, speedModifier) {
    this.image = new Image();
    this.image.src = imagePath;

    this.speedModifier = speedModifier;

    this.x = 0;
    this.y = 0;

    this.originalHeight = 324;
    this.originalWidth = 576;

    this.adjustedHeight = canvas.height;
    this.adjustedWidth =
      (canvas.height / this.originalHeight) * this.originalWidth;
  }

  update() {
    this.x = this.x - gameSpeed * this.speedModifier;

    if (this.x < 0 - this.adjustedWidth) this.x = 0;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.adjustedWidth,
      this.adjustedHeight
    );
    ctx.drawImage(
      this.image,
      this.x + this.adjustedWidth,
      this.y,
      this.adjustedWidth,
      this.adjustedHeight
    );
  }
}

const layer1 = new BGLayer("./resources/background/1.png", 0.35);
const layer2 = new BGLayer("./resources/background/2.png", 0.45);
const layer3 = new BGLayer("./resources/background/4.png", 0.65);

function displayScore() {
  ctx.fillStyle = "black";
  ctx.font = "bold 40px Impact";
  ctx.fillText(`Score: ${score}`, 40, 40);
}

function handleGameParameters() {
  gameSpeed = gameSpeed + score / 1000;

  if (score >= 10 && score < 15) {
    gap = 175;
  } else if (score >= 15 && score < 20) {
    gap = 150;
  } else if (score >= 20) {
    gap = 125;
  }
}

const player1 = new Player();

let lastTime = 0;

function animate(timeStamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  layer1.update();
  layer1.draw();

  layer2.update();
  layer2.draw();

  layer3.update();
  layer3.draw();

  handleGameParameters();

  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;

  // handleObstacles(deltaTime);
  handleObstaclesNew();

  player1.draw();
  player1.update(obstacles);

  displayScore();
  // console.log(obstacles);

  if (!gameOver) requestAnimationFrame(animate);
}
animate(0);

/*
  !NOTE : 
    ! INCREASING GAME DIFFICULTY 
*/
