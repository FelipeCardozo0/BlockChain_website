// Team page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeMenuOverlay();
    initializeMemberCards();
    initializeFooter();
});



// Menu Overlay Functionality
function initializeMenuOverlay() {
    const menuButton = document.getElementById('menuButton');
    const menuOverlay = document.getElementById('menuOverlay');
    const overlayClose = document.getElementById('overlayClose');
    const overlayBackground = document.querySelector('.overlay-background');
    const overlayLinks = document.querySelectorAll('.overlay-link');
    
    if (!menuButton || !menuOverlay) return;
    
    let isMenuOpen = false;
    
    function openMenu() {
        isMenuOpen = true;
        menuOverlay.classList.add('active');
        menuButton.classList.add('active');
        menuButton.setAttribute('aria-expanded', 'true');
        menuButton.setAttribute('aria-label', 'Close navigation menu');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        trapFocus(menuOverlay);
        
        // Add staggered animation to links
        overlayLinks.forEach((link, index) => {
            link.style.animationDelay = `${index * 0.05}s`;
            link.style.animation = 'slideInRight 0.3s ease forwards';
        });
    }
    
    function closeMenu() {
        isMenuOpen = false;
        menuOverlay.classList.remove('active');
        menuButton.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation menu');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Remove focus trap
        removeFocusTrap();
        
        // Reset link animations
        overlayLinks.forEach(link => {
            link.style.animation = '';
            link.style.animationDelay = '';
        });
        
        // Return focus to menu button
        menuButton.focus();
    }
    
    function toggleMenu() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // Event listeners
    menuButton.addEventListener('click', toggleMenu);
    
    if (overlayClose) {
        overlayClose.addEventListener('click', closeMenu);
    }
    
    if (overlayBackground) {
        overlayBackground.addEventListener('click', closeMenu);
    }
    
    // Close menu when clicking on overlay links
    overlayLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add ripple effect
            createRipple(e, link);
            
            // Close menu after short delay
            setTimeout(closeMenu, 150);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Focus management
    let focusableElements = [];
    let firstFocusableElement = null;
    let lastFocusableElement = null;
    
    function trapFocus(container) {
        focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        container.addEventListener('keydown', handleFocusTrap);
        
        // Focus first element
        if (overlayClose) {
            overlayClose.focus();
        }
    }
    
    function handleFocusTrap(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    }
    
    function removeFocusTrap() {
        if (menuOverlay) {
            menuOverlay.removeEventListener('keydown', handleFocusTrap);
        }
    }
    
    // Ripple effect for overlay links
    function createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    // Add ripple CSS if not already added
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(92, 194, 255, 0.4);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
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
    
    // Initialize tesseract animation for footer
    initializeFooterTesseractAnimation();
    
    // Initialize newsletter signup
    initializeNewsletterSignup();
}

// Footer Blockchain Animation
function initializeFooterTesseractAnimation() {
    const canvas = document.getElementById('tesseractCanvas');
    if (!canvas) return;
    
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
    let glowingOrbs = [];
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
        
        // Initialize glowing orbs
        glowingOrbs = [];
        for (let i = 0; i < 6; i++) {
            glowingOrbs.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 8 + 4,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2,
                color: ['#5cc2ff', '#f7c948', '#00d4aa'][Math.floor(Math.random() * 3)]
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
        
        // Update glowing orbs
        glowingOrbs.forEach(orb => {
            orb.pulsePhase += orb.pulseSpeed;
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
        
        // Draw glowing orbs
        glowingOrbs.forEach(orb => {
            ctx.save();
            const pulse = Math.sin(orb.pulsePhase) * 0.3 + 0.7;
            const size = orb.size * pulse;
            
            // Outer glow
            const outerGradient = ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, size * 2
            );
            outerGradient.addColorStop(0, orb.color);
            outerGradient.addColorStop(0.5, orb.color + '40');
            outerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = outerGradient;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, size * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner glow
            const innerGradient = ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, size
            );
            innerGradient.addColorStop(0, '#ffffff');
            innerGradient.addColorStop(0.5, orb.color);
            innerGradient.addColorStop(1, orb.color + '80');
            
            ctx.fillStyle = innerGradient;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, size, 0, Math.PI * 2);
            ctx.fill();
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
