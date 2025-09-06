const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const BALL_RADIUS = 10;
const PADDLE_COLOR = "#4FC3F7";
const BALL_COLOR = "#FFD600";

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 5 * (Math.random() > 0.5 ? 1 : -1),
  vy: 4 * (Math.random() > 0.5 ? 1 : -1),
  radius: BALL_RADIUS,
};

// Mouse movement controls left paddle
canvas.addEventListener('mousemove', function (e) {
  const rect = canvas.getBoundingClientRect();
  const scaleY = canvas.height / rect.height;
  let mouseY = (e.clientY - rect.top) * scaleY;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp within bounds
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Ball reset
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
  ball.vy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Draw functions
function drawPaddle(x, y) {
  ctx.fillStyle = PADDLE_COLOR;
  ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
}

function drawBall() {
  ctx.fillStyle = BALL_COLOR;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2, false);
  ctx.fill();
}

function drawNet() {
  ctx.strokeStyle = "#444";
  ctx.setLineDash([8, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet();
  drawPaddle(PLAYER_X, playerY);
  drawPaddle(AI_X, aiY);
  drawBall();
}

// Collision detection
function paddleCollision(paddleX, paddleY) {
  return (
    ball.x - ball.radius < paddleX + PADDLE_WIDTH &&
    ball.x + ball.radius > paddleX &&
    ball.y + ball.radius > paddleY &&
    ball.y - ball.radius < paddleY + PADDLE_HEIGHT
  );
}

// AI logic: follows the ball with a bit of delay
function updateAI() {
  const center = aiY + PADDLE_HEIGHT / 2;
  if (ball.y < center - 10) {
    aiY -= 4;
  } else if (ball.y > center + 10) {
    aiY += 4;
  }
  // Clamp within bounds
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Main game loop
function update() {
  // Move ball
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Wall collision (top/bottom)
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.vy *= -1;
  }

  // Paddle collision (player)
  if (
    paddleCollision(PLAYER_X, playerY) &&
    ball.vx < 0
  ) {
    ball.vx *= -1.1;
    // Add a bit of "english" depending on where it hits the paddle
    let intersect = (ball.y - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ball.vy += intersect * 3;
    ball.x = PLAYER_X + PADDLE_WIDTH + ball.radius; // Avoid sticking
  }

  // Paddle collision (AI)
  if (
    paddleCollision(AI_X, aiY) &&
    ball.vx > 0
  ) {
    ball.vx *= -1.1;
    let intersect = (ball.y - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ball.vy += intersect * 3;
    ball.x = AI_X - ball.radius; // Avoid sticking
  }

  // Score check (left or right out of bounds)
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    resetBall();
  }

  updateAI();
  draw();
  requestAnimationFrame(update);
}

draw();
update();