// Research Page JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeAnimations();
    initializeCategoryFilter();
    initializeMetricsCounter();
    initializeNewsletterForm();
    initializeCanvasAnimations();
    
    // Initialize footer with tesseract animation
    initializeFooter();
});

// Navigation Functions
function initializeNavigation() {
    const menuButton = document.getElementById('menuButton');
    const overlayClose = document.getElementById('overlayClose');
    const menuOverlay = document.getElementById('menuOverlay');
    const homeNavbar = document.getElementById('homeNavbar');
    const researchNavbar = document.getElementById('researchNavbar');
    
    // Menu toggle functionality
    if (menuButton) {
        menuButton.addEventListener('click', toggleMenu);
    }
    
    if (overlayClose) {
        overlayClose.addEventListener('click', closeMenu);
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function(e) {
            if (e.target.classList.contains('overlay-background')) {
                closeMenu();
            }
        });
    }
    
    // Dual navbar scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        const scrollThreshold = 200;
        
        if (homeNavbar && researchNavbar) {
            if (currentScrollY > scrollThreshold) {
                // Hide home navbar, show research navbar
                homeNavbar.classList.add('hidden');
                researchNavbar.classList.add('visible');
            } else {
                // Show home navbar, hide research navbar
                homeNavbar.classList.remove('hidden');
                researchNavbar.classList.remove('visible');
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Smooth scrolling for research navbar links
    const researchNavLinks = document.querySelectorAll('.research-navbar .nav-link[data-section]');
    researchNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 120;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.research-navbar .nav-link[data-section]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

function toggleMenu() {
    const overlay = document.getElementById('menuOverlay');
    const btn = document.getElementById('menuButton');
    
    if (overlay && btn) {
        const isActive = overlay.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }
}

function openMenu() {
    const overlay = document.getElementById('menuOverlay');
    const btn = document.getElementById('menuButton');
    
    if (overlay && btn) {
        overlay.classList.add('active');
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
}

function closeMenu() {
    const overlay = document.getElementById('menuOverlay');
    const btn = document.getElementById('menuButton');
    
    if (overlay && btn) {
        overlay.classList.remove('active');
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.section-header, .featured-card, .categories-filter, .research-card, .item-card, .metric-card, .collaboration-content'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Staggered animation for research cards
    const researchCards = document.querySelectorAll('.research-card');
    researchCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Staggered animation for item cards
    const itemCards = document.querySelectorAll('.item-card');
    itemCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });
    
    // Staggered animation for metric cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Category Filter Functions
function initializeCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const researchCards = document.querySelectorAll('.research-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter research cards
            filterResearchCards(category, researchCards);
        });
    });
}

function filterResearchCards(category, cards) {
    cards.forEach((card, index) => {
        const cardCategories = card.getAttribute('data-category');
        const shouldShow = category === 'all' || cardCategories.includes(category);
        
        if (shouldShow) {
            // Show card with animation
            setTimeout(() => {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                
                requestAnimationFrame(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            }, index * 50);
        } else {
            // Hide card
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Metrics Counter Functions
function initializeMetricsCounter() {
    const metricValues = document.querySelectorAll('.metric-value');
    let countersAnimated = false;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters(metricValues);
            }
        });
    }, observerOptions);
    
    const metricsSection = document.querySelector('.metrics-section');
    if (metricsSection) {
        observer.observe(metricsSection);
    }
}

function animateCounters(elements) {
    elements.forEach((element, index) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        // Add delay for staggered effect
        setTimeout(() => {
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format number with commas for large numbers
                const formatted = Math.floor(current).toLocaleString();
                element.textContent = formatted;
            }, 16);
        }, index * 200);
    });
}

// Newsletter Form Functions
function initializeNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    const input = document.getElementById('newsletterEmail');
    const button = form?.querySelector('.newsletter-btn');
    const spinner = form?.querySelector('.newsletter-spinner');
    const btnText = button?.querySelector('.btn-text');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!input.value || !isValidEmail(input.value)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            if (button && spinner && btnText) {
                button.disabled = true;
                btnText.style.display = 'none';
                spinner.style.display = 'inline-block';
            }
            
            // Simulate API call
            setTimeout(() => {
                // Reset form
                form.reset();
                
                // Reset button state
                if (button && spinner && btnText) {
                    button.disabled = false;
                    btnText.style.display = 'inline';
                    spinner.style.display = 'none';
                }
                
                showNotification('Thank you for subscribing to our newsletter!', 'success');
            }, 2000);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: '#ffffff',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #2ed573, #1e90ff)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ff4757, #ff6b7a)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #5cc2ff, #9b6bff)';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Footer initialization with tesseract animation
function initializeFooter() {
    // Update current year
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize tesseract animation for footer
    initializeFooterTesseractAnimation();
    
    // Initialize newsletter signup
    initializeNewsletterSignup();
}

// Canvas Animation Functions
function initializeCanvasAnimations() {
    // Hero background animation
    const heroCanvas = document.querySelector('.animated-background #blockchainCanvas');
    if (heroCanvas) {
        initializeBlockchainAnimation(heroCanvas);
    }
    
    // Footer background animation - now handled by tesseract animation
    // const footerCanvas = document.querySelector('.footer #blockchainCanvas');
    // if (footerCanvas) {
    //     initializeFooterAnimation(footerCanvas);
    // }
}

function initializeBlockchainAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    let animationId;
    let nodes = [];
    let connections = [];
    
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    }
    
    function createNodes() {
        nodes = [];
        const nodeCount = Math.min(20, Math.floor(canvas.width / 100));
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width / window.devicePixelRatio,
                y: Math.random() * canvas.height / window.devicePixelRatio,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 2,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    function updateNodes() {
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x <= 0 || node.x >= canvas.width / window.devicePixelRatio) {
                node.vx *= -1;
            }
            if (node.y <= 0 || node.y >= canvas.height / window.devicePixelRatio) {
                node.vy *= -1;
            }
            
            // Keep within bounds
            node.x = Math.max(0, Math.min(canvas.width / window.devicePixelRatio, node.x));
            node.y = Math.max(0, Math.min(canvas.height / window.devicePixelRatio, node.y));
        });
    }
    
    function drawNodes() {
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(92, 194, 255, ${node.opacity})`;
            ctx.fill();
        });
    }
    
    function drawConnections() {
        connections = [];
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (150 - distance) / 150 * 0.2;
                    
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(155, 107, 255, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        updateNodes();
        drawConnections();
        drawNodes();
        
        animationId = requestAnimationFrame(animate);
    }
    
    function init() {
        resizeCanvas();
        createNodes();
        animate();
    }
    
    // Initialize
    init();
    
    // Handle resize
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        init();
    });
    
    // Pause animation when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    });
    
    observer.observe(canvas);
}

function initializeFooterAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    }
    
    function createParticles() {
        particles = [];
        const particleCount = Math.min(50, Math.floor(canvas.width / 50));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width / window.devicePixelRatio,
                y: Math.random() * canvas.height / window.devicePixelRatio,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.3 + 0.1,
                hue: Math.random() * 60 + 180 // Blue to purple range
            });
        }
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width / window.devicePixelRatio;
            if (particle.x > canvas.width / window.devicePixelRatio) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height / window.devicePixelRatio;
            if (particle.y > canvas.height / window.devicePixelRatio) particle.y = 0;
        });
    }
    
    function drawParticles() {
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 70%, 70%, ${particle.opacity})`;
            ctx.fill();
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        updateParticles();
        drawParticles();
        
        animationId = requestAnimationFrame(animate);
    }
    
    function init() {
        resizeCanvas();
        createParticles();
        animate();
    }
    
    // Initialize
    init();
    
    // Handle resize
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        init();
    });
    
    // Pause animation when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    });
    
    observer.observe(canvas);
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    const target = e.target.closest('a[href^="#"]');
    if (target) {
        e.preventDefault();
        const href = target.getAttribute('href');
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
            const headerHeight = 80; // Account for fixed header
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close menu with Escape key
    if (e.key === 'Escape') {
        const overlay = document.getElementById('menuOverlay');
        if (overlay && overlay.classList.contains('active')) {
            closeMenu();
        }
    }
    
    // Category filter keyboard navigation
    if (e.target.classList.contains('category-btn')) {
        const buttons = Array.from(document.querySelectorAll('.category-btn'));
        const currentIndex = buttons.indexOf(e.target);
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            buttons[currentIndex - 1].focus();
        } else if (e.key === 'ArrowRight' && currentIndex < buttons.length - 1) {
            e.preventDefault();
            buttons[currentIndex + 1].focus();
        }
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll performance
const optimizedScroll = debounce(function() {
    // Any heavy scroll operations would go here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScroll);

// Preload critical resources
function preloadResources() {
    // Preload important images or fonts if needed
    const criticalImages = [
        '../Images/Logo/Logo_Official.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadResources();
