// Team page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeGeometricBackground();
    initializeMenuOverlay();
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
    let sparks = [];
    let cryptoParticles = [];
    let dataBlocks = [];
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initializeNodes();
        initializeSparks();
        initializeCryptoParticles();
        initializeDataBlocks();
    }
    
    function initializeNodes() {
        nodes = [];
        connections = [];
        
        const nodeCount = Math.min(12, Math.floor(canvas.width / 100));
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 4 + 3,
                glow: Math.random() * 0.6 + 0.4,
                glowDirection: Math.random() > 0.5 ? 1 : -1,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.05 + 0.02,
                type: Math.random() > 0.7 ? 'mining' : 'node'
            });
        }
        
        // Create connections between nearby nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = Math.sqrt(
                    Math.pow(nodes[i].x - nodes[j].x, 2) + 
                    Math.pow(nodes[i].y - nodes[j].y, 2)
                );
                
                if (distance < 120) {
                    connections.push({
                        from: i,
                        to: j,
                        opacity: Math.max(0.15, 1 - distance / 120),
                        flow: Math.random(),
                        dataFlow: Math.random() * Math.PI * 2,
                        dataSpeed: Math.random() * 0.03 + 0.02
                    });
                }
            }
        }
    }
    
    function initializeSparks() {
        sparks = [];
        const sparkCount = Math.min(25, Math.floor(canvas.width / 60));
        
        for (let i = 0; i < sparkCount; i++) {
            sparks.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: Math.random() * 0.5 + 0.5,
                maxLife: Math.random() * 0.5 + 0.5,
                size: Math.random() * 3 + 1,
                color: Math.random() > 0.5 ? '#5cc2ff' : '#f7c948',
                trail: []
            });
        }
    }
    
    function initializeCryptoParticles() {
        cryptoParticles = [];
        const particleCount = Math.min(20, Math.floor(canvas.width / 80));
        
        for (let i = 0; i < particleCount; i++) {
            cryptoParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 2 + 1,
                life: Math.random() * 0.7 + 0.3,
                maxLife: Math.random() * 0.7 + 0.3,
                symbol: ['₿', 'Ξ', '◈', '◆', '●'][Math.floor(Math.random() * 5)],
                color: ['#f7931a', '#627eea', '#00d4aa', '#ff6b35', '#8e44ad'][Math.floor(Math.random() * 5)]
            });
        }
    }
    
    function initializeDataBlocks() {
        dataBlocks = [];
        const blockCount = Math.min(8, Math.floor(canvas.width / 150));
        
        for (let i = 0; i < blockCount; i++) {
            dataBlocks.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 15 + 10,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                hash: generateRandomHash(),
                opacity: Math.random() * 0.4 + 0.2
            });
        }
    }
    
    function generateRandomHash() {
        const chars = '0123456789abcdef';
        let hash = '';
        for (let i = 0; i < 8; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash;
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
            
            // Update glow and pulse
            node.glow += node.glowDirection * 0.015;
            if (node.glow > 1 || node.glow < 0.3) {
                node.glowDirection *= -1;
            }
            
            node.pulse += node.pulseSpeed;
        });
        
        // Update connection flow
        connections.forEach(connection => {
            connection.flow += 0.025;
            if (connection.flow > 1) connection.flow = 0;
            
            connection.dataFlow += connection.dataSpeed;
        });
    }
    
    function updateSparks() {
        sparks.forEach(spark => {
            // Update position
            spark.x += spark.vx;
            spark.y += spark.vy;
            
            // Add to trail
            spark.trail.push({ x: spark.x, y: spark.y, life: spark.life });
            if (spark.trail.length > 5) spark.trail.shift();
            
            // Update life
            spark.life -= 0.01;
            
            // Bounce off edges
            if (spark.x < 0 || spark.x > canvas.width) spark.vx *= -0.8;
            if (spark.y < 0 || spark.y > canvas.height) spark.vy *= -0.8;
            
            // Keep within bounds
            spark.x = Math.max(0, Math.min(canvas.width, spark.x));
            spark.y = Math.max(0, Math.min(canvas.height, spark.y));
            
            // Fade trail
            spark.trail.forEach(point => {
                point.life -= 0.02;
            });
            spark.trail = spark.trail.filter(point => point.life > 0);
        });
        
        // Remove dead sparks and create new ones
        sparks = sparks.filter(spark => spark.life > 0);
        while (sparks.length < Math.min(25, Math.floor(canvas.width / 60))) {
            sparks.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: Math.random() * 0.5 + 0.5,
                maxLife: Math.random() * 0.5 + 0.5,
                size: Math.random() * 3 + 1,
                color: Math.random() > 0.5 ? '#5cc2ff' : '#f7c948',
                trail: []
            });
        }
    }
    
    function updateCryptoParticles() {
        cryptoParticles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Update life
            particle.life -= 0.005;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            // Keep within bounds
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        });
        
        // Remove dead particles and create new ones
        cryptoParticles = cryptoParticles.filter(particle => particle.life > 0);
        while (cryptoParticles.length < Math.min(20, Math.floor(canvas.width / 80))) {
            cryptoParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 2 + 1,
                life: Math.random() * 0.7 + 0.3,
                maxLife: Math.random() * 0.7 + 0.3,
                symbol: ['₿', 'Ξ', '◈', '◆', '●'][Math.floor(Math.random() * 5)],
                color: ['#f7931a', '#627eea', '#00d4aa', '#ff6b35', '#8e44ad'][Math.floor(Math.random() * 5)]
            });
        }
    }
    
    function updateDataBlocks() {
        dataBlocks.forEach(block => {
            // Update position
            block.x += block.vx;
            block.y += block.vy;
            
            // Update rotation
            block.rotation += block.rotationSpeed;
            
            // Bounce off edges
            if (block.x < 0 || block.x > canvas.width) block.vx *= -1;
            if (block.y < 0 || block.y > canvas.height) block.vy *= -1;
            
            // Keep within bounds
            block.x = Math.max(0, Math.min(canvas.width, block.x));
            block.y = Math.max(0, Math.min(canvas.height, block.y));
        });
    }
    
    function drawNodes() {
        nodes.forEach(node => {
            const pulseEffect = Math.sin(node.pulse) * 0.3 + 0.7;
            
            // Outer glow
            const gradient = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.radius * 4
            );
            
            if (node.type === 'mining') {
                gradient.addColorStop(0, `rgba(247, 201, 72, ${node.glow * pulseEffect * 0.8})`);
                gradient.addColorStop(0.5, `rgba(247, 201, 72, ${node.glow * pulseEffect * 0.4})`);
                gradient.addColorStop(1, 'rgba(247, 201, 72, 0)');
            } else {
                gradient.addColorStop(0, `rgba(92, 194, 255, ${node.glow * pulseEffect * 0.8})`);
                gradient.addColorStop(0.5, `rgba(92, 194, 255, ${node.glow * pulseEffect * 0.4})`);
                gradient.addColorStop(1, 'rgba(92, 194, 255, 0)');
            }
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Core node
            ctx.fillStyle = node.type === 'mining' 
                ? `rgba(247, 201, 72, ${node.glow * pulseEffect})`
                : `rgba(92, 194, 255, ${node.glow * pulseEffect})`;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Mining indicator
            if (node.type === 'mining') {
                ctx.strokeStyle = `rgba(247, 201, 72, ${node.glow * pulseEffect * 0.6})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
                ctx.stroke();
            }
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
            
            gradient.addColorStop(0, `rgba(92, 194, 255, ${connection.opacity * 0.4})`);
            gradient.addColorStop(0.5, `rgba(92, 194, 255, ${connection.opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(92, 194, 255, ${connection.opacity * 0.4})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.stroke();
            
            // Data flow effect
            if (!prefersReducedMotion) {
                const flowX = fromNode.x + (toNode.x - fromNode.x) * connection.flow;
                const flowY = fromNode.y + (toNode.y - fromNode.y) * connection.flow;
                
                const flowGradient = ctx.createRadialGradient(
                    flowX, flowY, 0,
                    flowX, flowY, 6
                );
                
                flowGradient.addColorStop(0, 'rgba(247, 201, 72, 0.9)');
                flowGradient.addColorStop(0.5, 'rgba(247, 201, 72, 0.4)');
                flowGradient.addColorStop(1, 'rgba(247, 201, 72, 0)');
                
                ctx.fillStyle = flowGradient;
                ctx.beginPath();
                ctx.arc(flowX, flowY, 6, 0, Math.PI * 2);
                ctx.fill();
                
                // Data packet effect
                const dataX = fromNode.x + (toNode.x - fromNode.x) * Math.sin(connection.dataFlow) * 0.3 + 0.5;
                const dataY = fromNode.y + (toNode.y - fromNode.y) * Math.sin(connection.dataFlow) * 0.3 + 0.5;
                
                ctx.fillStyle = 'rgba(0, 212, 170, 0.7)';
                ctx.beginPath();
                ctx.arc(dataX, dataY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
    
    function drawSparks() {
        sparks.forEach(spark => {
            // Draw trail
            spark.trail.forEach((point, index) => {
                const alpha = (point.life / spark.maxLife) * 0.6;
                ctx.fillStyle = `${spark.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
                ctx.beginPath();
                ctx.arc(point.x, point.y, spark.size * (index / spark.trail.length), 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Draw spark
            ctx.fillStyle = `${spark.color}${Math.floor((spark.life / spark.maxLife) * 255).toString(16).padStart(2, '0')}`;
            ctx.beginPath();
            ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    function drawCryptoParticles() {
        cryptoParticles.forEach(particle => {
            ctx.fillStyle = `${particle.color}${Math.floor((particle.life / particle.maxLife) * 255).toString(16).padStart(2, '0')}`;
            ctx.font = `${particle.size * 8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(particle.symbol, particle.x, particle.y);
        });
    }
    
    function drawDataBlocks() {
        dataBlocks.forEach(block => {
            ctx.save();
            ctx.translate(block.x, block.y);
            ctx.rotate(block.rotation);
            
            // Block background
            ctx.fillStyle = `rgba(92, 194, 255, ${block.opacity * 0.3})`;
            ctx.fillRect(-block.size / 2, -block.size / 2, block.size, block.size);
            
            // Block border
            ctx.strokeStyle = `rgba(92, 194, 255, ${block.opacity * 0.8})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(-block.size / 2, -block.size / 2, block.size, block.size);
            
            // Hash text
            ctx.fillStyle = `rgba(255, 255, 255, ${block.opacity * 0.9})`;
            ctx.font = '8px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(block.hash, 0, 0);
            
            ctx.restore();
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!prefersReducedMotion) {
            updateNodes();
            updateSparks();
            updateCryptoParticles();
            updateDataBlocks();
        }
        
        drawConnections();
        drawDataBlocks();
        drawNodes();
        drawSparks();
        drawCryptoParticles();
        
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
