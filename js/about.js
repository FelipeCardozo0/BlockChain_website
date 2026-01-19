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
    const canvas = document.getElementById('footerTesseractCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let nodes = [];
    let connections = [];
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initializeNodes();
    }
    
    function initializeNodes() {
        nodes = [];
        connections = [];
        
        const nodeCount = Math.min(15, Math.floor(canvas.width / 80));
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 2,
                glow: Math.random() * 0.5 + 0.5,
                glowDirection: Math.random() > 0.5 ? 1 : -1
            });
        }
        
        // Create connections between nearby nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = Math.sqrt(
                    Math.pow(nodes[i].x - nodes[j].x, 2) + 
                    Math.pow(nodes[i].y - nodes[j].y, 2)
                );
                
                if (distance < 150) {
                    connections.push({
                        from: i,
                        to: j,
                        opacity: Math.max(0.1, 1 - distance / 150),
                        flow: Math.random()
                    });
                }
            }
        }
    }
    
    function updateNodes() {
        nodes.forEach(node => {
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
            
            // Keep within bounds
            node.x = Math.max(0, Math.min(canvas.width, node.x));
            node.y = Math.max(0, Math.min(canvas.height, node.y));
            
            // Update glow
            node.glow += node.glowDirection * 0.01;
            if (node.glow > 1 || node.glow < 0.3) {
                node.glowDirection *= -1;
            }
        });
        
        // Update connection flow
        connections.forEach(connection => {
            connection.flow += 0.02;
            if (connection.flow > 1) connection.flow = 0;
        });
    }
    
    function drawNodes() {
        nodes.forEach(node => {
            const gradient = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.radius * 3
            );
            
            gradient.addColorStop(0, `rgba(92, 194, 255, ${node.glow})`);
            gradient.addColorStop(0.5, `rgba(92, 194, 255, ${node.glow * 0.5})`);
            gradient.addColorStop(1, 'rgba(92, 194, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Core node
            ctx.fillStyle = `rgba(247, 201, 72, ${node.glow})`;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    function drawConnections() {
        connections.forEach(connection => {
            const fromNode = nodes[connection.from];
            const toNode = nodes[connection.to];
            
            if (!fromNode || !toNode) return;
            
            // Base connection line
            const gradient = ctx.createLinearGradient(
                fromNode.x, fromNode.y,
                toNode.x, toNode.y
            );
            
            gradient.addColorStop(0, `rgba(92, 194, 255, ${connection.opacity * 0.3})`);
            gradient.addColorStop(0.5, `rgba(92, 194, 255, ${connection.opacity * 0.6})`);
            gradient.addColorStop(1, `rgba(92, 194, 255, ${connection.opacity * 0.3})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.stroke();
            
            // Flowing particle effect
            if (!prefersReducedMotion) {
                const flowX = fromNode.x + (toNode.x - fromNode.x) * connection.flow;
                const flowY = fromNode.y + (toNode.y - fromNode.y) * connection.flow;
                
                const flowGradient = ctx.createRadialGradient(
                    flowX, flowY, 0,
                    flowX, flowY, 4
                );
                
                flowGradient.addColorStop(0, 'rgba(247, 201, 72, 0.8)');
                flowGradient.addColorStop(1, 'rgba(247, 201, 72, 0)');
                
                ctx.fillStyle = flowGradient;
                ctx.beginPath();
                ctx.arc(flowX, flowY, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!prefersReducedMotion) {
            updateNodes();
        }
        
        drawConnections();
        drawNodes();
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resizeCanvas);
    };
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
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Simulate loading
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                submitButton.textContent = 'Subscribed!';
                submitButton.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                    form.reset();
                }, 2000);
            }, 1500);
        });
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
