// Team page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeGeometricBackground();
    initializeNavigation();
    initializeMemberCards();
    initializeFooter();
});

// Animated Geometric Background
function initializeGeometricBackground() {
    const canvas = document.getElementById('geometricCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let shapes = [];
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeShapes();
    }
    
    function initializeShapes() {
        shapes = [];
        const shapeCount = Math.min(12, Math.floor(canvas.width / 150));
        
        for (let i = 0; i < shapeCount; i++) {
            const shapeType = Math.random() > 0.5 ? 'triangle' : 'hexagon';
            shapes.push({
                type: shapeType,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 40 + 20,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.3 + 0.1,
                color: Math.random() > 0.6 ? '#5cc2ff' : '#f7c948',
                glowIntensity: Math.random() * 0.5 + 0.3,
                glowDirection: Math.random() > 0.5 ? 1 : -1
            });
        }
    }
    
    function updateShapes() {
        shapes.forEach(shape => {
            // Update position
            shape.x += shape.vx;
            shape.y += shape.vy;
            
            // Bounce off edges
            if (shape.x < -shape.size || shape.x > canvas.width + shape.size) {
                shape.vx *= -1;
            }
            if (shape.y < -shape.size || shape.y > canvas.height + shape.size) {
                shape.vy *= -1;
            }
            
            // Keep within bounds
            shape.x = Math.max(-shape.size, Math.min(canvas.width + shape.size, shape.x));
            shape.y = Math.max(-shape.size, Math.min(canvas.height + shape.size, shape.y));
            
            // Update rotation
            shape.rotation += shape.rotationSpeed;
            
            // Update glow
            shape.glowIntensity += shape.glowDirection * 0.005;
            if (shape.glowIntensity > 0.8 || shape.glowIntensity < 0.2) {
                shape.glowDirection *= -1;
            }
        });
    }
    
    function drawTriangle(ctx, x, y, size, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        const height = size * Math.sqrt(3) / 2;
        
        ctx.beginPath();
        ctx.moveTo(0, -height / 2);
        ctx.lineTo(-size / 2, height / 2);
        ctx.lineTo(size / 2, height / 2);
        ctx.closePath();
        
        ctx.restore();
    }
    
    function drawHexagon(ctx, x, y, size, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const px = size * Math.cos(angle);
            const py = size * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        
        ctx.restore();
    }
    
    function drawShapes() {
        shapes.forEach(shape => {
            // Create glow effect
            const gradient = ctx.createRadialGradient(
                shape.x, shape.y, 0,
                shape.x, shape.y, shape.size * 2
            );
            
            const alpha = shape.opacity * shape.glowIntensity;
            gradient.addColorStop(0, `${shape.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(0.5, `${shape.color}${Math.floor(alpha * 0.5 * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `${shape.color}00`);
            
            ctx.fillStyle = gradient;
            
            if (shape.type === 'triangle') {
                drawTriangle(ctx, shape.x, shape.y, shape.size, shape.rotation);
            } else {
                drawHexagon(ctx, shape.x, shape.y, shape.size, shape.rotation);
            }
            
            ctx.fill();
            
            // Draw outline
            ctx.strokeStyle = `${shape.color}${Math.floor(alpha * 0.8 * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!prefersReducedMotion) {
            updateShapes();
        }
        
        drawShapes();
        
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

// Navigation Functions
function initializeNavigation() {
    const menuButton = document.getElementById('menuButton');
    const overlayClose = document.getElementById('overlayClose');
    const menuOverlay = document.getElementById('menuOverlay');
    const homeNavbar = document.getElementById('homeNavbar');
    const teamNavbar = document.getElementById('teamNavbar');
    
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
        
        if (homeNavbar && teamNavbar) {
            if (currentScrollY > scrollThreshold) {
                // Hide home navbar, show team navbar
                homeNavbar.classList.add('hidden');
                teamNavbar.classList.add('visible');
            } else {
                // Show home navbar, hide team navbar
                homeNavbar.classList.remove('hidden');
                teamNavbar.classList.remove('visible');
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Smooth scrolling for team navbar links
    const teamNavLinks = document.querySelectorAll('.team-navbar .team-nav-link[data-section]');
    teamNavLinks.forEach(link => {
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
    const navLinks = document.querySelectorAll('.team-navbar .team-nav-link[data-section]');
    
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

// Menu toggle functions
function toggleMenu() {
    const menuOverlay = document.getElementById('menuOverlay');
    const menuButton = document.getElementById('menuButton');
    
    if (menuOverlay) {
        menuOverlay.classList.add('active');
        if (menuButton) menuButton.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMenu() {
    const menuOverlay = document.getElementById('menuOverlay');
    const menuButton = document.getElementById('menuButton');
    
    if (menuOverlay) {
        menuOverlay.classList.remove('active');
        if (menuButton) menuButton.classList.remove('active');
        document.body.style.overflow = '';
    }
}
    




// Member Cards Functionality
function initializeMemberCards() {
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            const linkedinUrl = card.getAttribute('data-linkedin');
            if (linkedinUrl) {
                // Add click animation
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    card.style.transform = '';
                    // Open LinkedIn profile in new tab
                    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
                }, 150);
            }
        });
        
        // Add keyboard accessibility
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
        
        // Make cards focusable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View ${card.querySelector('.member-name').textContent}'s LinkedIn profile`);
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
    const canvas = document.getElementById('blockchainCanvas');
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
    const form = document.getElementById('newsletterForm');
    const input = document.getElementById('newsletterEmail');
    const button = form.querySelector('.newsletter-btn');
    
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
                    source: 'team-footer',
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

// Performance optimization
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

// Initialize intersection observer for animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe team cards
    document.querySelectorAll('.team-card').forEach(card => {
        observer.observe(card);
    });
    
    // Add animation CSS
    if (!document.querySelector('#scroll-animations')) {
        const style = document.createElement('style');
        style.id = 'scroll-animations';
        style.textContent = `
            .team-card {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .team-card.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeScrollAnimations, 100);
});