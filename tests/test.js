document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.hero-carousel');
    const cells = document.querySelectorAll('.hero-carousel__cell');
    let currentIndex = 0;
  
    // Function to show the current slide
    function showSlide(index) {
      cells.forEach((cell, i) => {
        cell.style.display = i === index ? 'block' : 'none';
      });
    }
  
    // Function to go to the next slide
    function nextSlide() {
      currentIndex = (currentIndex + 1) % cells.length;
      showSlide(currentIndex);
    }
  
    // Function to go to the previous slide
    function prevSlide() {
      currentIndex = (currentIndex - 1 + cells.length) % cells.length;
      showSlide(currentIndex);
    }
  
    // Optional: Add navigation buttons
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', prevSlide);
  
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', nextSlide);
  
    // Append buttons to the slider (optional)
    slider.insertAdjacentElement('beforebegin', prevButton);
    slider.insertAdjacentElement('beforebegin', nextButton);
  
    // Show the first slide initially
    showSlide(currentIndex);
  
    // Optional: Auto-play the slider
    let autoPlayInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
  
    // Optional: Pause auto-play on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    slider.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(nextSlide, 3000);
    });
  });