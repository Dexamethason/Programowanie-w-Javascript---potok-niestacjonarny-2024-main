const box = document.querySelector('.box')

const slides = document.querySelector('.box');
const img = document.querySelectorAll('.box img');

const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const pauseButton = document.querySelector('.pause');

const dots = document.querySelectorAll('.dot');

let currentIndex = 0; 
const totalSlides = img.length;
let intervalId;

function updateSlider(index) {
  // Przesuwa slajdy
  slides.style.transform = `translateX(-${index * 800}px)`;
  // Resetuje kropki / doty
  dots.forEach(dot => dot.classList.remove('active'));
  // Ustawia klasę active dla aktualnej kropki / doty
  dots[index].classList.add('active');
}

function nextSlide() {
  // Przejście do następnego slajdu, modulo liczba slajdów (zapętla)
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlider(currentIndex); 
}
// Modullo by zapętlić
function prevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateSlider(currentIndex); 
}

function goToSlide(index) {
  currentIndex = index;
  updateSlider(currentIndex);
}

function startSlider() {
  intervalId = setInterval(nextSlide, 2_500);
}

function stopSlider() {
  clearInterval(intervalId);
}

function togglePause() {
  if (pauseButton.textContent === 'Pause') {
    stopSlider();
    pauseButton.textContent = 'Resume';
  } else {
    startSlider();
    pauseButton.textContent = 'Pause';
  }
}

// Slajd co 2.5 sekundy
setTimeout(startSlider);

nextButton.addEventListener('click', nextSlide);
prevButton.addEventListener('click', prevSlide);
pauseButton.addEventListener('click', togglePause);

// Nawigacja na click
dots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    const index = parseInt(e.target.dataset.slide); 
    goToSlide(index); 
  });
});

// Początkowa aktualizacja slidera
updateSlider(currentIndex);