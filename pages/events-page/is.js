"use strict";

// Wrap everything in a single DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', function() {
  // ===== 1. Blur Functionality =====
  let timeout;
  const overlay = document.getElementById("overlay");
  
  function triggerBlur() {
    document.body.classList.add("blur-active");
    overlay?.classList.add("active");
  }

  function resetTimer() {
    clearTimeout(timeout);
    document.body.classList.remove("blur-active");
    overlay?.classList.remove("active");
    timeout = setTimeout(triggerBlur, 5000);
  }

  ['mousemove', 'scroll', 'keydown'].forEach(event =>
    window.addEventListener(event, resetTimer)
  );
  resetTimer();

  // ===== 2. Sticky Header =====
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", function() {
      header.classList.toggle("sticky", window.scrollY > 0);
    });
  }

  // ===== 3. Scroll to Top =====
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    function toggleScrollTop() {
      window.scrollY > 100 ? 
        scrollTop.classList.add('active') : 
        scrollTop.classList.remove('active');
    }

    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    toggleScrollTop();
    window.addEventListener('scroll', toggleScrollTop);
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
      slides[currentSlide].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
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
        slideInterval = setInterval(autoAdvance, 10000);
        updateNavDots();
      }
    }

    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', startSlider);
    
    startSlider();
  }
});