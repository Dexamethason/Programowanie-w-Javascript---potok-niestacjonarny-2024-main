const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ball = { x: 0, y: 0, radius: 20 };
let hole = { x: 0, y: 0, radius: 30 };
let score = 0;
let gameTime = 60;
let gameStartTime;

let tilt = { x: 0, y: 0 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initGame() {
    resizeCanvas();
    resetBallAndHole();
    gameStartTime = Date.now();
    score = 0;
}

function resetBallAndHole() {
    // Kulka w połowie
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    // Losowość miejsca dziury zapewnia randomowy mnożnik między 0 a 1
    hole.x = Math.random() * (canvas.width - hole.radius * 2) + hole.radius;
    hole.y = Math.random() * (canvas.height - hole.radius * 2) + hole.radius;
}

// Kula
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

// Dziura
function drawHole() {
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

// Punkty
function drawScore() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Timer
function drawTime() {
    const timeLeft = Math.max(0, gameTime - Math.floor((Date.now() - gameStartTime) / 1000));
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Time: ${timeLeft}s`, 10, 60);
}

// Update kierunku
// Coś do poprawy bo działa jako tako ale lipa z czasem

// function updateOrientation(event) {
//     const sensitivity = 0.1;
    
//     // Y
//     tilt.y = (event.beta - 90) * sensitivity;
    
//     // X
//     if (Math.abs(event.gamma) > Math.abs(event.alpha)) {
//         tilt.x = event.gamma * sensitivity;
//     } else {
//         let adjustedAlpha = event.alpha;
//         if (adjustedAlpha > 180) adjustedAlpha -= 360;
//         tilt.x = event.gamma * sensitivity;
//     }
    
// }



//Poprawka tego co wyżej, niestety AI musiało pomóc

let previousTiltX = 0;
let previousTiltY = 0;

function updateOrientation(event) {
    const sensitivity = 0.35;
    const smoothingFactor = 0.9; 


    // Y
    let tiltY = (event.beta - 90) * sensitivity;
    
    // X
    let tiltX;
    if (Math.abs(event.gamma) > Math.abs(event.alpha)) {
        tiltX = event.gamma * sensitivity;
    } else {
        let adjustedAlpha = event.alpha;
        if (adjustedAlpha > 180) adjustedAlpha -= 360;
        tiltX = adjustedAlpha * sensitivity;
    }

    // Pomaga ogarnąć skakanie ale i tak nie w pełni
    tilt.x = previousTiltX * smoothingFactor + tiltX * (1 - smoothingFactor);
    tilt.y = previousTiltY * smoothingFactor + tiltY * (1 - smoothingFactor);

    // Limit -10 i 10 max
    tilt.x = Math.max(-10, Math.min(10, tilt.x)); // Limit X
    tilt.y = Math.max(-10, Math.min(10, tilt.y)); // Limit Y
}




// Update pozycji
function updateBallPosition() {
    const speed = 2;
    
    ball.x += tilt.x * speed;
    ball.y += tilt.y * speed;
    
    // Check czy wychodzi poza ekran
    // i "odbicie" jej po 2giej stronie 
    if (ball.x < -ball.radius) ball.x = canvas.width + ball.radius;  // Lewa
    if (ball.x > canvas.width + ball.radius) ball.x = -ball.radius;  // Prawa
    if (ball.y < -ball.radius) ball.y = canvas.height + ball.radius; // Góra
    if (ball.y > canvas.height + ball.radius) ball.y = -ball.radius; // Dół
    
    checkCollision();
}

// Czy kula wchodzi w dzure
function checkCollision() {
    const dx = ball.x - hole.x;
    const dy = ball.y - hole.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Jak dotyka to dolicza punkt
    if (distance < ball.radius + hole.radius) {
        score++;
        resetBallAndHole();
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateBallPosition();
    drawHole();
    drawBall();
    drawScore();
    drawTime();

    if (Date.now() - gameStartTime < gameTime * 1000) {
        requestAnimationFrame(gameLoop);
    } else {
        endGame();
    }
}

function endGame() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '48px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(`Koniec gry! Wynik: ${score}`, canvas.width / 2, canvas.height / 2);
}

window.addEventListener('deviceorientation', updateOrientation);
window.addEventListener('resize', resizeCanvas);




initGame();
gameLoop();