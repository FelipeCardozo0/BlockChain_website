// Research Page JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    updateCurrentYear();
    initializeFooter();
    initializeResearchCategories();
    initializeImpactMetrics();
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
    
    // Dual navbar scroll effect (desktop only)
    let lastScrollY = window.scrollY;
    
    function handleNavbarScroll() {
        const currentScrollY = window.scrollY;
        const scrollThreshold = 200;
        const isMobile = window.innerWidth <= 768;
        
        if (homeNavbar && researchNavbar && !isMobile) {
            if (currentScrollY > scrollThreshold) {
                // Hide home navbar, show research navbar
                homeNavbar.classList.add('hidden');
                researchNavbar.classList.add('visible');
            } else {
                // Show home navbar, hide research navbar
                homeNavbar.classList.remove('hidden');
                researchNavbar.classList.remove('visible');
            }
        } else if (isMobile && homeNavbar) {
            // On mobile, always show home navbar
            homeNavbar.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Handle resize events to update navbar state
    window.addEventListener('resize', function() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile && homeNavbar) {
            homeNavbar.classList.remove('hidden');
        }
        handleNavbarScroll();
    });
    
    // Smooth scrolling for research navbar links (desktop only)
    const researchNavLinks = document.querySelectorAll('.research-navbar .research-nav-link[data-section]');
    researchNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const isMobile = window.innerWidth <= 768;
            if (isMobile) return; // Disable on mobile
            
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
    
    // Update active nav link on scroll (desktop only)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.research-navbar .research-nav-link[data-section]');
    
    window.addEventListener('scroll', function() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) return; // Disable on mobile
        
        let current = '';
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
}

// Menu Functions
function toggleMenu() {
    const menuButton = document.getElementById('menuButton');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (menuButton && menuOverlay) {
        const isActive = menuButton.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }
}

function openMenu() {
    const menuButton = document.getElementById('menuButton');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (menuButton && menuOverlay) {
        menuButton.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMenu() {
    const menuButton = document.getElementById('menuButton');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (menuButton && menuOverlay) {
        menuButton.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}



// Impact Metrics Animation
function initializeImpactMetrics() {
    const metricValues = document.querySelectorAll('.metric-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.getAttribute('data-target'));
                animateCounter(target, targetValue);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    metricValues.forEach(value => {
        observer.observe(value);
    });
}

function animateCounter(element, targetValue) {
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetValue.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Research Categories Functionality
function initializeResearchCategories() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const researchCards = document.querySelectorAll('.research-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedCategory = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter research cards
            filterResearchCards(selectedCategory, researchCards);
        });
    });
    
    // Handle window resize for responsive grid
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const activeButton = document.querySelector('.category-btn.active');
            if (activeButton) {
                const selectedCategory = activeButton.getAttribute('data-category');
                filterResearchCards(selectedCategory, researchCards);
            }
        }, 250);
    });
}

function filterResearchCards(category, cards) {
    // First, hide all cards
    cards.forEach(card => {
        card.classList.add('hidden');
        card.classList.remove('filtered');
    });
    
    // Show and position matching cards
    const matchingCards = Array.from(cards).filter(card => {
        const cardCategories = card.getAttribute('data-category').split(' ');
        return category === 'all' || cardCategories.includes(category);
    });
    
    // Get current grid columns based on screen size
    const getGridColumns = () => {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    };
    
    const gridColumns = getGridColumns();
    
    matchingCards.forEach((card, index) => {
        // Remove hidden class and add filtered class
        card.classList.remove('hidden');
        card.classList.add('filtered');
        
        // Set specific grid positioning for top-left priority
        if (category !== 'all') {
            // Position cards starting from top-left
            const row = Math.floor(index / gridColumns);
            const col = index % gridColumns;
            card.style.gridRow = row + 1;
            card.style.gridColumn = col + 1;
            card.style.order = index;
        } else {
            // Reset positioning for "All Research"
            card.style.gridRow = '';
            card.style.gridColumn = '';
            card.style.order = '';
        }
    });
    
    // Add smooth animation delay for staggered effect
    matchingCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Footer functionality
function initializeFooter() {
    // Update current year
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize blockchain animation for footer
    initializeFooterBlockchainAnimation();
    
    // Initialize newsletter signup
    initializeNewsletterSignup();
}

// Footer Blockchain Animation
function initializeFooterBlockchainAnimation() {
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

// Newsletter signup functionality
function initializeNewsletterSignup() {
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

// Update current year in footer
function updateCurrentYear() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility function for debouncing
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






