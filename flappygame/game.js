const game = document.getElementById("game");
const pipes_HTML = document.getElementById("pipes");
const score_HTML = document.getElementById("score");
const high_score_HTML = document.getElementById("high_score");

let birds = [];
let pipes = [];
let game_over = false;
let score = 0;
let bird;
let closestPipe;
let gameInteralId;

score_HTML.innerText = score;

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

window.onload = function () {
  let playerName = prompt("Enter your username");
  document.getElementById("player-name").innerHTML = playerName + " (YOU)";

  localStorage.removeItem("high_score");
  high_score_HTML.innerText = 0;
}

class Bird {
  constructor(isPlayable) {
    this.x = 100;
    this.y = 100;

    this.sketch = document.createElement("div");
    this.sketch.classList.add("bird");
    this.sketch.style.top = this.y + "px";
    this.sketch.style.left = this.x + "px";
    game.appendChild(this.sketch);

    this.isFlapping = false;

    birds.push(this);
  }
  flap() {
    if (this.y <= 0) {
      return;
    }
    this.isFlapping = true;
    let jumpingDistance = 75;
    if (this.y < jumpingDistance) {
      jumpingDistance = this.y;
    }

    let iteration = 0;
    let deceleration = 0.02;
    const flappingIntervalId = setInterval(() => {
      this.isFlapping = true;

      let newY = this.y - (jumpingDistance / 50 - iteration * deceleration);
      this.coordinates = [this.x, newY];
      if (++iteration >= jumpingDistance) {
        this.isFlapping = false;
        this.fall();
        clearInterval(flappingIntervalId);
      }
    }, 1);
  }
  fall() {
    if (this.isFlapping) return;
    if (this.y >= 460) return;
    let iteration = 0;
    let acceleration = 0.02;
    const fallIntervalId = setInterval(() => {
      let newY = this.y + iteration * acceleration;
      this.coordinates = [this.x, newY];
      iteration++;
      if (this.y >= 460 || this.isFlapping) {
        iteration = 0;
        clearInterval(fallIntervalId);
      }
    }, 1);
  }

  kill() {
    birds = birds.filter((bird) => bird !== this);
    this.sketch.remove();
  }

  set coordinates([x, y]) {
    this.x = x;
    this.y = y;
    this.sketch.style.top = this.y + "px";
    this.sketch.style.left = this.x + "px";
  }
}

class Pipe {
  constructor(options) {
    let shift = randomNumber(15, 40);
    let y = (shift / 100) * 1150;

    this.y = -y + 500;

    this.sketch = document.createElement("div");
    this.sketch.classList.add("pipe");
    pipes.push(this);

    this.x = (pipes.length - 1) * 350 + 250;
    if (options && options.initial) this.x += 500;

    let topPipe = document.createElement("div");
    let bottomPipe = document.createElement("div");
    let passage = document.createElement("div");

    topPipe.classList.add("collision");
    bottomPipe.classList.add("collision");
    passage.classList.add("passage");

    this.sketch.appendChild(topPipe);
    this.sketch.appendChild(passage);
    this.sketch.appendChild(bottomPipe);

    this.sketch.style.left = `${this.x}px`;
    this.sketch.style.transform = `translateY(${-shift}%)`;

    pipes_HTML.appendChild(this.sketch);
  }

  delete() {
    this.sketch.remove();
  }
}

function start() {
  document.getElementById("restart").style.display = 'none';
  document.getElementById("game-over").style.display = 'none';
  birds = [];
  pipes = [];
  game_over = false;
  score = 0;
  score_HTML.innerText = score;

  bird = new Bird(true);

  let high_score = JSON.parse(localStorage.getItem("high_score")) || 0;
  high_score_HTML.innerText = high_score;

  pipes_HTML.innerHTML = '';

  pipes = [];

  for (let i = 0; i < 4; i++) {
    new Pipe({ initial: true });
  }

  clearInterval(gameInteralId);
  gameInteralId = setInterval(() => {
    for (let i = 0; i < birds.length; i++) {
      if (birds[i].y <= 0) {
        birds[i].coordinates = [birds[i].x, 0];
      } else if (birds[i].y + 40 >= 500) {
        birds[i].coordinates = [birds[i].x, 460];
      }
    }

    closestPipe = pipes[0];
    if (closestPipe.x + 100 < bird.x) {
      closestPipe = pipes[1];
    }

    for (let i = 0; i < pipes.length; i++) {
      pipes[i].x -= 1;
      pipes[i].sketch.style.left = pipes[i].x + "px";

      if (pipes[i].x === 0 && birds.includes(bird)) {
        score++;
        score_HTML.innerText = score;
      }
      if (pipes[i].x + 100 <= 0) {
        pipes[i].delete();
        pipes.splice(i, 1);
        new Pipe();
        i--;
      }

      if (bird.x - pipes[i].x <= 100 && bird.x + 60 - pipes[i].x >= 0) {
        if (
          !(bird.y - pipes[i].y <= 150 && bird.y - pipes[i].y >= 0) ||
          bird.y - pipes[i].y >= 110
        ) {
          bird.kill();
        }
      }
      if (bird?.y + 40 >= 500) {
        bird?.kill();
      }

      game_over = birds.length === 0;
    }
    if (game_over) {
      handleGameOver();
      return;
    }
  }, 1);
}

document.addEventListener("keydown", (e) => {
  if (e.key === " " && !game_over) {
    bird.flap();
    playJumpSound();
  }
});

document.addEventListener("pointerdown", () => {
  if (!game_over) {
    bird.flap();
    playJumpSound();
  }
});

function handleGameOver() {
  clearInterval(gameInteralId);
  pipes = [];
  pipes_HTML.innerHTML = '';
  document.getElementById("game-over").style.display = 'block';
  playGameOverSound();
  alert("Game Over! Your score: " + score);
  document.getElementById("restart").style.display = 'block';

  let high_score = JSON.parse(localStorage.getItem("high_score")) || 0;
  if (score > high_score) {
    high_score = score;
    localStorage.setItem("high_score", JSON.stringify(high_score));
    high_score_HTML.innerText = high_score;
  }
}

document.getElementById("restart").addEventListener("click", () => {
  bird.kill();
  start();
});

start();

const jumpSound = document.getElementById("jumpSound");
const gameOverSound = document.getElementById("gameOverSound");

function playJumpSound() {
  jumpSound.currentTime = 0;
  jumpSound.play();
}

function playGameOverSound() {
  gameOverSound.currentTime = 0;
  gameOverSound.play();
}
