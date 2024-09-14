// Pobranie elementów z HTML: canvas i kontekst rysowania 2D
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
    // Odbicie prion
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
    balls[i].draw(); // Rysowanie kulki
    balls[i].move(); // Przesunięcie kulki

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
  balls = []; // Wyczyszczenie tablicy kulek
  for (let i = 0; i < ballCount; i++) {
    const radius = 5; // Stały promień kulek
    const x = Math.random() * (canvas.width - 2 * radius) + radius; // Losowa pozycja X
    const y = Math.random() * (canvas.height - 2 * radius) + radius; // Losowa pozycja Y
    const dx = (Math.random() - 0.5) * 4; // Losowa prędkość w osi X
    const dy = (Math.random() - 0.5) * 4; // Losowa prędkość w osi Y
    balls.push(new Ball(x, y, radius, dx, dy)); // Dodaj kulkę do tablicy
  }
}

// Funkcja uruchamiająca animację
function startAnimation() {
  if (!isRunning) { // Sprawdzenie, czy animacja nie działa
    isRunning = true; // Ustawienie flagi animacji
    animationFrame = requestAnimationFrame(animate); // Uruchomienie animacji
  }
}

// Funkcja zatrzymująca animację
function stopAnimation() {
  cancelAnimationFrame(animationFrame); // Zatrzymaj animację
  isRunning = false; // Reset flagi animacji
}

// Funkcja odpowiadająca za kolejne klatki animacji
function animate() {
  drawBalls(); // Rysowanie kulek
  animationFrame = requestAnimationFrame(animate); // Kontynuowanie animacji
}

// Dodanie obsługi zdarzeń na przyciskach
startButton.addEventListener('click', () => {
  stopAnimation(); // Zatrzymaj poprzednią animację
  createBalls(); // Utwórz nowe kulki
  startAnimation(); // Uruchom animację
});

resetButton.addEventListener('click', () => {
  stopAnimation(); // Zatrzymaj animację
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Wyczyść ekran
});

// Utworzenie kulek po załadowaniu strony
createBalls();
