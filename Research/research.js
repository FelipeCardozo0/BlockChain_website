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
        '.section-header, .featured-card, .categories-filter, .research-card, .item-card, .metric-item, .collaboration-content'
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
    
    // Staggered animation for metric items
    const metricItems = document.querySelectorAll('.metric-item');
    metricItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
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

// Newsletter signup functionality for footer
function initializeNewsletterSignup() {
    const form = document.getElementById('newsletterForm');
    const input = document.getElementById('newsletterEmail');
    const button = form?.querySelector('.newsletter-btn');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = input.value.trim();
        if (!email) return;
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNewsletterToast('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        button.classList.add('loading');
        button.disabled = true;
        
        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email,
                    source: 'research-footer',
                    timestamp: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                showNewsletterToast('Successfully subscribed! Welcome to our community.', 'success');
                input.value = '';
            } else {
                throw new Error('Subscription failed');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            showNewsletterToast('Something went wrong. Please try again later.', 'error');
        } finally {
            button.classList.remove('loading');
            button.disabled = false;
        }
    });
    
    function showNewsletterToast(message, type) {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                top: 2rem;
                right: 2rem;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            `;
            document.body.appendChild(toastContainer);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.cssText = `
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        const icon = type === 'success' ? '✓' : '✕';
        toast.innerHTML = `<span style="margin-right: 0.5rem;">${icon}</span>${message}`;
        
        toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
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

// Advanced Tesseract Animation for Footer
function initializeFooterTesseractAnimation() {
    const canvas = document.getElementById('footerTesseractCanvas');
    if (!canvas) {
        console.warn('Tesseract canvas not found');
        return;
    }
    
    console.log('Initializing tesseract animation for research page footer');
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Tesseract vertices (4D coordinates)
    let vertices = [];
    let projectedVertices = [];
    let edges = [];
    let rotationX = 0;
    let rotationY = 0;
    let rotationZ = 0;
    let rotationW = 0;
    
    // Additional animation elements
    let floatingParticles = [];
    let dataStreams = [];
    let connectionLines = [];
    let time = 0;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initializeTesseract();
        initializeAdditionalAnimations();
    }
    
    function initializeTesseract() {
        // Define tesseract vertices in 4D space
        vertices = [
            [-1, -1, -1, -1], [1, -1, -1, -1], [-1, 1, -1, -1], [1, 1, -1, -1],
            [-1, -1, 1, -1], [1, -1, 1, -1], [-1, 1, 1, -1], [1, 1, 1, -1],
            [-1, -1, -1, 1], [1, -1, -1, 1], [-1, 1, -1, 1], [1, 1, -1, 1],
            [-1, -1, 1, 1], [1, -1, 1, 1], [-1, 1, 1, 1], [1, 1, 1, 1]
        ];
        
        // Define edges (connections between vertices)
        edges = [
            // Inner cube edges
            [0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7],
            [4, 5], [4, 6], [5, 7], [6, 7],
            // Outer cube edges
            [8, 9], [8, 10], [8, 12], [9, 11], [9, 13], [10, 11], [10, 14], [11, 15],
            [12, 13], [12, 14], [13, 15], [14, 15],
            // Connecting edges between cubes
            [0, 8], [1, 9], [2, 10], [3, 11], [4, 12], [5, 13], [6, 14], [7, 15]
        ];
        
        projectedVertices = new Array(vertices.length);
    }
    
    function initializeAdditionalAnimations() {
        // Initialize floating particles
        floatingParticles = [];
        for (let i = 0; i < 15; i++) {
            floatingParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.6 + 0.2,
                color: Math.random() > 0.5 ? '#5cc2ff' : '#f7c948'
            });
        }
        
        // Initialize data streams
        dataStreams = [];
        for (let i = 0; i < 8; i++) {
            dataStreams.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 100 + 50,
                speed: Math.random() * 2 + 1,
                opacity: Math.random() * 0.4 + 0.1,
                direction: Math.random() * Math.PI * 2
            });
        }
        

        
        // Initialize connection lines
        connectionLines = [];
        for (let i = 0; i < 12; i++) {
            connectionLines.push({
                x1: Math.random() * canvas.width,
                y1: Math.random() * canvas.height,
                x2: Math.random() * canvas.width,
                y2: Math.random() * canvas.height,
                opacity: Math.random() * 0.3 + 0.1,
                fadeSpeed: Math.random() * 0.02 + 0.01,
                fadeDirection: Math.random() > 0.5 ? 1 : -1
            });
        }
    }
    
    function rotate4D(point, rx, ry, rz, rw) {
        let [x, y, z, w] = point;
        
        // Rotate around X axis
        let temp = y;
        y = y * Math.cos(rx) - z * Math.sin(rx);
        z = temp * Math.sin(rx) + z * Math.cos(rx);
        
        // Rotate around Y axis
        temp = x;
        x = x * Math.cos(ry) - z * Math.sin(ry);
        z = temp * Math.sin(ry) + z * Math.cos(ry);
        
        // Rotate around Z axis
        temp = x;
        x = x * Math.cos(rz) - y * Math.sin(rz);
        y = temp * Math.sin(rz) + y * Math.cos(rz);
        
        // Rotate around W axis (4D rotation)
        temp = x;
        x = x * Math.cos(rw) - w * Math.sin(rw);
        w = temp * Math.sin(rw) + w * Math.cos(rw);
        
        return [x, y, z, w];
    }
    
    function project3D(point) {
        const [x, y, z, w] = point;
        const distance = 4;
        const scale = distance / (distance + w);
        return [x * scale, y * scale, z * scale];
    }
    
    function updateTesseract() {
        // Update rotation angles
        rotationX += 0.008;
        rotationY += 0.012;
        rotationZ += 0.015;
        rotationW += 0.006;
        
        // Rotate and project all vertices
        for (let i = 0; i < vertices.length; i++) {
            const rotated = rotate4D(vertices[i], rotationX, rotationY, rotationZ, rotationW);
            const projected = project3D(rotated);
            
            // Scale and center on canvas
            projectedVertices[i] = {
                x: projected[0] * 80 + canvas.width / 2,
                y: projected[1] * 80 + canvas.height / 2,
                z: projected[2],
                w: rotated[3] // Store w coordinate for depth sorting
            };
        }
    }
    
    function updateAdditionalAnimations() {
        time += 0.016; // Assuming 60fps
        
        // Update floating particles
        floatingParticles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
        });
        
        // Update data streams
        dataStreams.forEach(stream => {
            stream.x += Math.cos(stream.direction) * stream.speed;
            stream.y += Math.sin(stream.direction) * stream.speed;
            
            // Reset when off screen
            if (stream.x < -stream.length || stream.x > canvas.width + stream.length ||
                stream.y < -stream.length || stream.y > canvas.height + stream.length) {
                stream.x = Math.random() * canvas.width;
                stream.y = Math.random() * canvas.height;
                stream.direction = Math.random() * Math.PI * 2;
            }
        });
        

        
        // Update connection lines
        connectionLines.forEach(line => {
            line.opacity += line.fadeSpeed * line.fadeDirection;
            
            if (line.opacity <= 0.05) {
                line.fadeDirection = 1;
                line.opacity = 0.05;
            } else if (line.opacity >= 0.4) {
                line.fadeDirection = -1;
                line.opacity = 0.4;
            }
        });
    }
    
    function drawTesseract() {
        // Sort edges by average depth for proper rendering
        const sortedEdges = edges.map(edge => ({
            from: edge[0],
            to: edge[1],
            depth: (projectedVertices[edge[0]].z + projectedVertices[edge[1]].z) / 2
        })).sort((a, b) => b.depth - a.depth);
        
        // Draw edges
        sortedEdges.forEach(edge => {
            const from = projectedVertices[edge.from];
            const to = projectedVertices[edge.to];
            
            // Calculate opacity based on depth
            const depth = (from.z + to.z) / 2;
            const opacity = Math.max(0.1, Math.min(1, (depth + 2) / 4));
            
            // Create gradient for edge
            const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
            gradient.addColorStop(0, `rgba(92, 194, 255, ${opacity * 0.8})`);
            gradient.addColorStop(0.5, `rgba(247, 201, 72, ${opacity})`);
            gradient.addColorStop(1, `rgba(0, 212, 170, ${opacity * 0.8})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = Math.max(1, opacity * 2);
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
            
            // Add flowing particles along edges
            if (!prefersReducedMotion) {
                const time = Date.now() * 0.001;
                const flow = (Math.sin(time + edge.from * 0.5) + 1) / 2;
                
                const flowX = from.x + (to.x - from.x) * flow;
                const flowY = from.y + (to.y - from.y) * flow;
                
                const particleGradient = ctx.createRadialGradient(
                    flowX, flowY, 0,
                    flowX, flowY, 4
                );
                particleGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.9})`);
                particleGradient.addColorStop(0.5, `rgba(247, 201, 72, ${opacity * 0.6})`);
                particleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = particleGradient;
                ctx.beginPath();
                ctx.arc(flowX, flowY, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        // Draw vertices
        projectedVertices.forEach((vertex, index) => {
            const depth = vertex.z;
            const opacity = Math.max(0.2, Math.min(1, (depth + 2) / 4));
            const size = Math.max(2, opacity * 6);
            
            // Outer glow
            const glowGradient = ctx.createRadialGradient(
                vertex.x, vertex.y, 0,
                vertex.x, vertex.y, size * 3
            );
            glowGradient.addColorStop(0, `rgba(92, 194, 255, ${opacity * 0.4})`);
            glowGradient.addColorStop(0.5, `rgba(247, 201, 72, ${opacity * 0.2})`);
            glowGradient.addColorStop(1, 'rgba(92, 194, 255, 0)');
            
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, size * 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Core vertex
            const coreGradient = ctx.createRadialGradient(
                vertex.x, vertex.y, 0,
                vertex.x, vertex.y, size
            );
            coreGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.9})`);
            coreGradient.addColorStop(0.7, `rgba(92, 194, 255, ${opacity * 0.8})`);
            coreGradient.addColorStop(1, `rgba(247, 201, 72, ${opacity * 0.6})`);
            
            ctx.fillStyle = coreGradient;
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    function drawAdditionalAnimations() {
        // Draw floating particles
        floatingParticles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.opacity;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow effect
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.globalAlpha = particle.opacity * 0.3;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        // Draw data streams
        dataStreams.forEach(stream => {
            ctx.save();
            ctx.globalAlpha = stream.opacity;
            ctx.strokeStyle = '#00d4aa';
            ctx.lineWidth = 1;
            
            const endX = stream.x + Math.cos(stream.direction) * stream.length;
            const endY = stream.y + Math.sin(stream.direction) * stream.length;
            
            // Create gradient for stream
            const gradient = ctx.createLinearGradient(stream.x, stream.y, endX, endY);
            gradient.addColorStop(0, 'rgba(0, 212, 170, 0.8)');
            gradient.addColorStop(0.5, 'rgba(92, 194, 255, 0.6)');
            gradient.addColorStop(1, 'rgba(247, 201, 72, 0.4)');
            
            ctx.strokeStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(stream.x, stream.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            // Add data bits along the stream
            for (let i = 0; i < 5; i++) {
                const t = (i / 4) + (time * 0.001) % 1;
                const x = stream.x + (endX - stream.x) * t;
                const y = stream.y + (endY - stream.y) * t;
                
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = stream.opacity * (1 - t) * 0.8;
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });
        

        
        // Draw connection lines
        connectionLines.forEach(line => {
            ctx.save();
            ctx.globalAlpha = line.opacity;
            ctx.strokeStyle = '#5cc2ff';
            ctx.lineWidth = 1;
            
            // Create gradient for line
            const gradient = ctx.createLinearGradient(line.x1, line.y1, line.x2, line.y2);
            gradient.addColorStop(0, 'rgba(92, 194, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(247, 201, 72, 0.6)');
            gradient.addColorStop(1, 'rgba(0, 212, 170, 0.8)');
            
            ctx.strokeStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
            
            // Add connection points
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = line.opacity * 0.8;
            ctx.beginPath();
            ctx.arc(line.x1, line.y1, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(line.x2, line.y2, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!prefersReducedMotion) {
            updateTesseract();
            updateAdditionalAnimations();
        }
        
        drawTesseract();
        drawAdditionalAnimations();
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Initialize
    resizeCanvas();
    initializeAdditionalAnimations();
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation
    animate();
    console.log('Tesseract animation started successfully');
    
    // Cleanup function
    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resizeCanvas);
    };
}

// Canvas Animation Functions
function initializeCanvasAnimations() {
    // Background animation removed - keeping only footer animation
    // Footer background animation is now handled by tesseract animation
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
