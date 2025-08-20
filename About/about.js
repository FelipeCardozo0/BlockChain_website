// About Page JavaScript - Matching Research Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initAnimatedBackground();
    initNavigation();
    initScrollAnimations();
    initMetricsCounter();
    initNewsletterForm();
    initMenuOverlay();
    updateCurrentYear();
});

// Animated Background
function initAnimatedBackground() {
    const canvas = document.getElementById('blockchainCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let connections = [];

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(92, 194, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const distance = Math.sqrt(
                    Math.pow(particle.x - otherParticle.x, 2) +
                    Math.pow(particle.y - otherParticle.y, 2)
                );

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(92, 194, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });

        animationId = requestAnimationFrame(animate);
    }

    animate();
}

// Navigation System
function initNavigation() {
    const homeNavbar = document.getElementById('homeNavbar');
    const aboutNavbar = document.getElementById('aboutNavbar');
    let lastScrollY = window.scrollY;

    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Hide/show home navbar
        if (currentScrollY > 100) {
            homeNavbar.classList.add('hidden');
        } else {
            homeNavbar.classList.remove('hidden');
        }

        // Show about navbar after scroll
        if (currentScrollY > 200) {
            aboutNavbar.classList.add('visible');
        } else {
            aboutNavbar.classList.remove('visible');
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.section-header, .mission-card, .principles-grid, .programs-grid, .teams-grid, .metrics-grid, .join-content'
    );

    animatedElements.forEach(el => observer.observe(el));
}

// Metrics Counter Animation
function initMetricsCounter() {
    const metricElements = document.querySelectorAll('.metric-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    metricElements.forEach(el => observer.observe(el));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 20);
}

// Newsletter Form
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('newsletterEmail').value;
        const button = form.querySelector('.newsletter-btn');
        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.btn-spinner');

        // Show loading state
        btnText.style.opacity = '0';
        spinner.style.opacity = '1';
        button.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Reset form
            form.reset();
            
            // Show success message
            btnText.textContent = 'Subscribed!';
            btnText.style.opacity = '1';
            spinner.style.opacity = '0';
            
            // Reset after 2 seconds
            setTimeout(() => {
                btnText.textContent = 'Subscribe';
                button.disabled = false;
            }, 2000);
        }, 1500);
    });
}

// Menu Overlay
function initMenuOverlay() {
    const menuButton = document.getElementById('menuButton');
    const menuOverlay = document.getElementById('menuOverlay');
    const overlayClose = document.getElementById('overlayClose');
    const overlayLinks = document.querySelectorAll('.overlay-link');

    if (!menuButton || !menuOverlay) return;

    // Toggle menu
    function toggleMenu() {
        const isActive = menuOverlay.classList.contains('active');
        
        if (isActive) {
            menuOverlay.classList.remove('active');
            menuButton.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            menuOverlay.classList.add('active');
            menuButton.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Event listeners
    menuButton.addEventListener('click', toggleMenu);
    overlayClose.addEventListener('click', toggleMenu);

    // Close menu when clicking overlay background
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            toggleMenu();
        }
    });

    // Close menu when clicking links
    overlayLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(toggleMenu, 300);
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            toggleMenu();
        }
    });
}

// Update current year in footer
function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-center .nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Footer blockchain animation
function initFooterBlockchain() {
    const canvas = document.getElementById('blockchainCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = 200; // Footer height
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Simple geometric animation
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 50;
        
        ctx.strokeStyle = 'rgba(92, 194, 255, 0.3)';
        ctx.lineWidth = 1;
        
        // Draw rotating squares
        for (let i = 0; i < 3; i++) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(time * 0.001 + i * Math.PI / 3);
            
            ctx.beginPath();
            ctx.rect(-radius/2, -radius/2, radius, radius);
            ctx.stroke();
            
            ctx.restore();
        }
        
        time += 16;
        animationId = requestAnimationFrame(animate);
    }

    animate();
}

// Initialize footer animation when footer is visible
const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initFooterBlockchain();
            footerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

const footer = document.querySelector('.footer');
if (footer) {
    footerObserver.observe(footer);
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(updateActiveNavLink, 16));
