window.addEventListener("load", function () {
  let userChoice = "easy";
  const URL = window.location.search;
  let urlParams = new URLSearchParams(URL);
  userChoice = urlParams.get("userChoice") || "easy";
  console.log(userChoice);

  const canvas = document.getElementById("canvas1");
  const CANVAS_WIDTH = (canvas.width = 1000);
  const CANVAS_HEIGHT = (canvas.height = 600);

  // const dpr = window.devicePixelRatio || 1;
  // canvas.width = CANVAS_WIDTH * dpr;
  // canvas.height = CANVAS_HEIGHT * dpr;

  const ctx = canvas.getContext("2d");
  // ctx.scale(dpr, dpr);

  let gameOver = false;
  let gameSpeed = 1;
  let gap = 200;
  let score = 0;
  let obstacles = [];

  // this handles key-presses after game-over
  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && gameOver) {
      gameOver = false;
      gameSpeed = 1;
      gap = 200;
      score = 0;
      obstacles = [];

      player1.restart();
      [layer1, layer2, layer3].forEach((layer) => layer.restart());

      const contentMask = document.querySelector(".content-mask");
      const gameOverContainer = document.querySelector(".game-over-container");

      contentMask.classList.add("make-disappear");
      gameOverContainer.classList.add("make-disappear");

      animate(0);
    } else if (e.key === "Escape") {
      //! CODE TO GO BACK TO HOME PAGE!
      this.window.location.href = "/index.html";
    }
  });

  class Player {
    constructor() {
      this.spriteWidth = 34;
      this.spriteHeight = 24;

      this.width = 68;
      this.height = 48;

      this.x = 100;
      this.y = CANVAS_HEIGHT / 2 - this.height / 2;

      this.vy = 0;
      this.weight = 0.45;

      this.imageUpFlap = document.getElementById("redbird-upflap");
      this.imageMidFlap = document.getElementById("redbird-midflap");
      this.imageDownFlap = document.getElementById("redbird-downflap");

      this.imageToDraw = this.imageUpFlap;

      this.frameX = 0;

      this.fps = 20;
      this.spriteTimeInterval = 1000 / this.fps;
      this.timeSinceLastSprite = 0;

      window.addEventListener("keydown", (e) => {
        if (e.key === " ") {
          this.vy = 8;
        }
      });
    }

    restart() {
      this.x = 100;
      this.y = CANVAS_HEIGHT / 2 - this.height / 2;

      this.vy = 0;

      this.frameX = 0;
      this.timeSinceLastSprite = 0;
    }

    draw() {
      // ctx.fillStyle = "blue";
      // ctx.strokeRect(this.x, this.y, this.width, this.height);

      if (this.frameX == 0) this.imageToDraw = this.imageUpFlap;
      else if (this.frameX == 1) this.imageToDraw = this.imageMidFlap;
      else if (this.frameX == 2) this.imageToDraw = this.imageDownFlap;

      ctx.drawImage(
        this.imageToDraw,
        0,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }

    update(obstacles, deltaTime) {
      //updating the sprite frame:
      this.timeSinceLastSprite += deltaTime;
      if (this.timeSinceLastSprite >= this.spriteTimeInterval) {
        this.frameX = this.frameX + 1;
        if (this.frameX >= 3) this.frameX = 0;

        this.timeSinceLastSprite = 0;
      }

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

  class PlayerHard {
    constructor() {
      this.spriteWidth = 34;
      this.spriteHeight = 24;

      this.width = 68;
      this.height = 48;

      this.x = 100;
      this.y = CANVAS_HEIGHT / 2 - this.height / 2;

      this.vy = 5;

      this.imageUpFlap = document.getElementById("redbird-upflap");
      this.imageMidFlap = document.getElementById("redbird-midflap");
      this.imageDownFlap = document.getElementById("redbird-downflap");

      this.imageToDraw = this.imageUpFlap;

      this.frameX = 0;

      this.fps = 20;
      this.spriteTimeInterval = 1000 / this.fps;
      this.timeSinceLastSprite = 0;

      this.generateParticleCounter = 0; // when this becomes equal to targetValue, a new particle is generated
      this.generateParticleTargetValue = 4;
      window.addEventListener("keydown", (e) => {
        if (e.key === " ") {
          this.vy = -this.vy;
        }
      });
    }

    restart() {
      this.x = 100;
      this.y = CANVAS_HEIGHT / 2 - this.height / 2;

      this.vy = 0;

      this.frameX = 0;
      this.timeSinceLastSprite = 0;
    }

    draw() {
      // ctx.fillStyle = "blue";
      // ctx.strokeRect(this.x, this.y, this.width, this.height);

      if (this.frameX == 0) this.imageToDraw = this.imageUpFlap;
      else if (this.frameX == 1) this.imageToDraw = this.imageMidFlap;
      else if (this.frameX == 2) this.imageToDraw = this.imageDownFlap;

      ctx.drawImage(
        this.imageToDraw,
        0,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }

    update(obstacles, deltaTime) {
      //updating the sprite frame:
      this.timeSinceLastSprite += deltaTime;
      if (this.timeSinceLastSprite >= this.spriteTimeInterval) {
        this.frameX = this.frameX + 1;
        if (this.frameX >= 3) this.frameX = 0;

        this.timeSinceLastSprite = 0;
      }

      //updating the particles:
      this.generateParticleCounter += 1;
      if (this.generateParticleCounter == this.generateParticleTargetValue) {
        this.generateParticleCounter = 0;
        Particle.particles.push(new Particle(this.x, this.y + this.height / 2));
      }

      //checking for collissions:
      obstacles.forEach((obstacle) => {
        if (this.collissionIsDetected(obstacle)) gameOver = true;
        this.incrementScore(obstacle);
      });

      //update velocity and position
      this.y -= this.vy;

      if (this.y > canvas.height - this.height) {
        this.y = canvas.height - this.height;
      }

      if (this.y <= 0) {
        this.y = 0;
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

  class Particle {
    static particles = [];
    constructor(x, y) {
      this.x = x;
      this.y = y;

      this.vx = -3 + Math.random() * 1.5;
      this.vy = -0.5 + Math.random() * 2;

      this.radius = 0;
      this.maxRadius = 35;

      this.markedForDeletion = false;

      this.incrementCounter = 0;
      this.targetValue = 5;

      this.color = "gray";
    }

    draw() {
      ctx.save();

      ctx.globalAlpha = 1 - this.radius / this.maxRadius; // the opacity of all the elements
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fill();

      ctx.restore();
    }

    update() {
      this.incrementCounter++;
      if (this.incrementCounter == this.targetValue) {
        this.incrementCounter = 0;
        this.radius += 5;
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.radius >= this.maxRadius || this.x < 0)
        this.markedForDeletion = true;
    }
  }

  function handleParticles() {
    Particle.particles = Particle.particles.filter(
      (particle) => !particle.markedForDeletion
    );

    console.log(Particle.particles);

    Particle.particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
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
    constructor(imageId, speedModifier) {
      this.image = document.getElementById(imageId);

      this.speedModifier = speedModifier;

      this.x = 0;
      this.y = 0;

      this.originalHeight = 324;
      this.originalWidth = 576;

      this.adjustedHeight = canvas.height;
      this.adjustedWidth =
        (canvas.height / this.originalHeight) * this.originalWidth;
    }

    restart() {
      this.x = 0;
      this.y = 0;
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

  const layer1 = new BGLayer("layer1", 0.3);
  const layer2 = new BGLayer("layer2", 0.35);
  const layer3 = new BGLayer("layer3", 0.6);

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

  async function handleGameOver() {
    const contentMask = document.querySelector(".content-mask");
    const gameOverContainer = document.querySelector(".game-over-container");

    contentMask.classList.remove("make-disappear");
    gameOverContainer.classList.remove("make-disappear");

    const scoreMessage = document.querySelector(".score-message");
    scoreMessage.innerText = `Your Score: ${score}`;

    await createPostRequest(score);
  }

  async function createPostRequest(score) {
    // global
    let response = await fetch("https://project-flappy-bird-backend.onrender.com/globalScore", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        score: score,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      alert("Login to add score to global leaderboards");
      return;
    }

    response = await fetch("https://project-flappy-bird-backend.onrender.com/user/addScore", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        score: score,
      }),
      credentials: "include",
    });
  }

  let player1 = userChoice == "easy" ? new Player() : new PlayerHard();
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

    handleObstaclesNew();

    player1.draw();
    player1.update(obstacles, deltaTime);

    handleParticles();

    displayScore();

    if (!gameOver) requestAnimationFrame(animate);
    else handleGameOver();
  }
  animate(0);
});
