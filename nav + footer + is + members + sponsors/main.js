"use strict";

// Wrap everything in a single DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', function() {

  // ===== 2. Sticky Header =====
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", function() {
      header.classList.toggle("sticky", window.scrollY > 0);
    });
  }

  // ===== 4. Image Slider =====
  const slider = document.querySelector('.slider');
  if (slider) {
    const slides = document.querySelectorAll('.slider img');
    const navDots = document.querySelectorAll('.slider-nav a');
    let currentSlide = 0;
    const slideCount = slides.length;
    let slideInterval;

    function autoAdvance() {
      if (slideCount === 0) return;
      currentSlide = (currentSlide + 1) % slideCount;
      // Replace scrollIntoView with direct scrolling of the slider container
      slider.scrollTo({
        left: slides[currentSlide].offsetLeft,
        behavior: 'smooth'
      });
      updateNavDots();
    }

    function updateNavDots() {
      navDots.forEach((dot, index) => {
        dot.style.opacity = index === currentSlide ? '1' : '0.75';
      });
    }

    function startSlider() {
      if (slideCount > 0) {
        slideInterval = setInterval(autoAdvance, 7500);
        updateNavDots();
      }
    }
    
    startSlider();
  }
  

});

