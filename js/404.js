// 404 Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation functionality
    // Get navigation elements
    const navLinks = document.querySelectorAll('.home-navbar .nav-link');
    const contactLink = document.querySelector('.home-navbar .nav-link[href="#contact"]');

    // Smooth scrolling for all navigation links with anchor hrefs
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle anchor links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Calculate offset to account for fixed navbar
                    const navbarHeight = document.querySelector('.home-navbar').offsetHeight;
                    const offsetTop = targetElement.offsetTop - navbarHeight - 20; // Extra 20px for breathing room
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Special handling for contact link
    if (contactLink) {
        contactLink.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            
            if (contactSection) {
                // Calculate offset to account for fixed navbar
                const navbarHeight = document.querySelector('.home-navbar').offsetHeight;
                const offsetTop = contactSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Keep home navbar visible (no scroll effect)
    const homeNavbar = document.getElementById('homeNavbar');
    if (homeNavbar) {
        homeNavbar.classList.remove('hidden');
    }

    // 404 Page Animations
    const errorContainer = document.querySelector('.error-container');
    const errorCode = document.querySelector('.error-code');
    const errorTitle = document.querySelector('.error-title');
    const errorMessage = document.querySelector('.error-message');
    const errorSubmessage = document.querySelector('.error-submessage');
    const backButton = document.querySelector('.back-button');

    // Initial state - hide elements
    if (errorContainer) {
        errorContainer.style.opacity = '0';
        errorContainer.style.transform = 'translateY(20px)';
    }

    // Animate elements in sequence
    setTimeout(() => {
        if (errorContainer) {
            errorContainer.style.transition = 'all 0.8s ease';
            errorContainer.style.opacity = '1';
            errorContainer.style.transform = 'translateY(0)';
        }
    }, 300);

    // Add subtle hover effects to error numbers
    const errorNumbers = document.querySelectorAll('.error-number');
    errorNumbers.forEach((number, index) => {
        number.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        number.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add click effect to back button
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            // Add loading state
            const originalText = this.textContent;
            this.textContent = 'Redirecting...';
            this.style.pointerEvents = 'none';
            
            // Reset after a short delay (in case of navigation)
            setTimeout(() => {
                this.textContent = originalText;
                this.style.pointerEvents = 'auto';
            }, 2000);
        });
    }

    // Animated background canvas
    const canvas = document.getElementById('geometricCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let animationId;

        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Initialize canvas
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Animation variables
        let time = 0;
        const particles = [];
        const particleCount = 30; // Reduced for subtlety

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3, // Slower movement
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 1.5 + 0.5, // Smaller particles
                opacity: Math.random() * 0.3 + 0.05 // More subtle
            });
        }

        // Animation loop
        function animate() {
            time += 0.005; // Slower animation
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(92, 194, 255, ${particle.opacity})`;
                ctx.fill();
                
                // Draw connections (more subtle)
                particles.forEach(otherParticle => {
                    const distance = Math.sqrt(
                        Math.pow(particle.x - otherParticle.x, 2) + 
                        Math.pow(particle.y - otherParticle.y, 2)
                    );
                    
                    if (distance < 80) { // Shorter connections
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(92, 194, 255, ${0.05 * (1 - distance / 80)})`; // More subtle
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
            
            animationId = requestAnimationFrame(animate);
        }

        // Start animation
        animate();

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
    }

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            history.back();
        } else if (e.key === 'Home' || e.key === 'h' || e.key === 'H') {
            window.location.href = '../Home/index.html';
        }
    });

    // Console message for developers
    console.log('%c🔍 404 - Page Not Found', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%cNavigation and 404 page loaded successfully!', 'color: #666; font-size: 14px;');
});
