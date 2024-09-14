const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let balls = []; // Tablica przechowująca  kulki
let animationFrame; // Numer klatki animacji
let isRunning = false; // Czy animacja działa

// liczba kulek, odległość, przyciski
const ballCountInput = document.getElementById('ballCount');
const distanceInput = document.getElementById('distance');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');


class Ball {
  constructor(x, y, radius, dx, dy) {
    // Ustawienia początkowe pozycja, promień, prędkość
    this.x = x; 
    this.y = y;
    this.radius = radius;
    this.dx = dx; // Prędkość X
    this.dy = dy; // Prędkość Y
  }

  // Rysowanie kulki
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Rysuj okrąg
    ctx.fillStyle = 'blue'; // Kolor
    ctx.fill(); // Z okręgu robi kule
    ctx.closePath();
  }

  // Ruch kulki
  move() {
    // Odbicie poziom
    if (this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius) {
      this.dx = -this.dx; // Zmiana kierunku na przeciwny
    }
    // Odbicie pion
    if (this.y + this.dy > canvas.height - this.radius || this.y + this.dy < this.radius) {
      this.dy = -this.dy; // Zmiana kierunku na przeciwny
    }
    // Aktualizacja pozycji kulki
    this.x += this.dx;
    this.y += this.dy;
  }

  // Czy inne kulka jest blisko
  isCloseTo(otherBall, distance) {
    const dx = this.x - otherBall.x; // Odległość X
    const dy = this.y - otherBall.y; // Odleglosc Y
    // Zwraca info czy ogleglosc jest mniejsza od ustawionej
    return Math.sqrt(dx * dx + dy * dy) < distance;
  }
}

// Rysuje kulki i linie
function drawBalls() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear
  
  // Iteracja przez ilość kulek
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw(); 
    balls[i].move(); 

    // Sprawdza bliskosc kulek i rysuje linie
    for (let j = i + 1; j < balls.length; j++) {
      if (balls[i].isCloseTo(balls[j], distanceInput.value)) {
        ctx.beginPath();
        ctx.moveTo(balls[i].x, balls[i].y); // Początek
        ctx.lineTo(balls[j].x, balls[j].y); // Koniec
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'; // Kolor / przezroczystość lini
        ctx.stroke(); // Rysuje linie
      }
    }
  }
}

// Funkcja tworząca kulki
function createBalls() {
  const ballCount = parseInt(ballCountInput.value); // Pobierz liczbę kulek
  balls = []; 
  for (let i = 0; i < ballCount; i++) {
    const radius = 5; 
    const x = Math.random() * (canvas.width - 2 * radius) + radius;
    const y = Math.random() * (canvas.height - 2 * radius) + radius; 
    const dx = (Math.random() - 0.5) * 4; 
    const dy = (Math.random() - 0.5) * 4; 
    balls.push(new Ball(x, y, radius, dx, dy)); 
  }
}

function startAnimation() {
  if (!isRunning) { 
    isRunning = true; 
    animationFrame = requestAnimationFrame(animate); 
  }
}

function stopAnimation() {
  cancelAnimationFrame(animationFrame); 
  isRunning = false; 
}

function animate() {
  drawBalls(); 
  animationFrame = requestAnimationFrame(animate);
}

startButton.addEventListener('click', () => {
  stopAnimation();
  createBalls(); 
  startAnimation();
});

resetButton.addEventListener('click', () => {
  stopAnimation();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

createBalls();
