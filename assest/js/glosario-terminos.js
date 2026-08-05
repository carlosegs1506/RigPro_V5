let currentSlide = 0;
const carousel = document.querySelector('.carousel');
const carouselContainer = document.querySelector('.carousel-container');
const slides = document.querySelectorAll('.carousel-item');
const progress = document.querySelector('.progress');
const contador = document.querySelector('.carousel-contador');
const btnPrev = document.querySelector('.carousel-prev');
const btnNext = document.querySelector('.carousel-next');
const totalSlides = slides.length;

function ajustarAltura() {
  // Cada término tiene un largo de texto muy distinto (desde una línea hasta
  // varios párrafos) — se ajusta la altura del carrusel a la diapositiva
  // actual para que ninguna definición quede cortada por el overflow:hidden
  // del contenedor.
  const alturaSlideActual = slides[currentSlide].scrollHeight;
  carouselContainer.style.height = `${alturaSlideActual}px`;
}

function updateCarousel() {
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
  progress.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
  if (contador) {
    contador.textContent = `${currentSlide + 1} / ${totalSlides}`;
  }
  ajustarAltura();
}

function irASiguiente() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function irAAnterior() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

function detenerAutoplay() {
  clearInterval(autoplayInterval);
}

if (btnNext) {
  btnNext.addEventListener('click', () => {
    detenerAutoplay();
    irASiguiente();
  });
}

if (btnPrev) {
  btnPrev.addEventListener('click', () => {
    detenerAutoplay();
    irAAnterior();
  });
}

// Gestos táctiles
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const difference = touchStartX - touchEndX;

  if (Math.abs(difference) > swipeThreshold) {
    detenerAutoplay();
    if (difference > 0) {
      irASiguiente();
    } else {
      irAAnterior();
    }
  }
}

// Autoplay: se detiene definitivamente en cuanto el usuario interactúa
// (botones, swipe), en vez de reactivarse solo — para no interrumpir la
// lectura de una definición larga con un avance automático a mitad de camino.
let autoplayInterval = setInterval(irASiguiente, 6000);

window.addEventListener('resize', ajustarAltura);
window.addEventListener('load', ajustarAltura);

updateCarousel();
