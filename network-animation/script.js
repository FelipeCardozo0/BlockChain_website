// Network Animation Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initBackgroundAnimation();
    initFooterAnimation();
    initNewsletterForm();
    
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
});

// Navigation functionality
function initNavigation() {
    const homeNavbar = document.getElementById('homeNavbar');
    const aboutNavbar = document.getElementById('aboutNavbar');
    const menuButton = document.getElementById('menuButton');
    const menuOverlay = document.getElementById('menuOverlay');
    const overlayClose = document.getElementById('overlayClose');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    
    let lastScrollY = window.scrollY;
    
    // Handle navbar transitions
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Show/hide home navbar
        if (currentScrollY > 100) {
            homeNavbar.classList.add('hidden');
        } else {
            homeNavbar.classList.remove('hidden');
        }
        
        // Show/hide about navbar
        if (currentScrollY > 200) {
            aboutNavbar.classList.add('visible');
        } else {
            aboutNavbar.classList.remove('visible');
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Menu overlay functionality
    function toggleMenu() {
        const isActive = menuOverlay.classList.contains('active');
        
        if (isActive) {
            menuOverlay.classList.remove('active');
            menuButton.classList.remove('active');
            menuButton.setAttribute('aria-expanded', 'false');
        } else {
            menuOverlay.classList.add('active');
            menuButton.classList.add('active');
            menuButton.setAttribute('aria-expanded', 'true');
        }
    }
    
    // Close menu when clicking overlay background
    function closeMenu() {
        menuOverlay.classList.remove('active');
        menuButton.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
    }
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('[id^="section"]');
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
    
    // Event listeners
    window.addEventListener('scroll', handleScroll);
    menuButton.addEventListener('click', toggleMenu);
    overlayClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', function(e) {
        if (e.target === menuOverlay) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close menu if open
                if (menuOverlay.classList.contains('active')) {
                    closeMenu();
                }
            }
        });
    });
    
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
}

// Background animation
function initBackgroundAnimation() {
    const canvas = document.getElementById('blockchainCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Simple geometric animation
    let time = 0;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
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
    
    // Cleanup function
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
}

// Enhanced Footer Network Animation - Advanced Blockchain Network Visualization
function initFooterAnimation() {
    const canvas = document.getElementById('footerBlockchainCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let nodes = [];
    let connections = [];
    let particles = [];
    let time = 0;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initializeNetwork();
    }
    
    function initializeNetwork() {
        nodes = [];
        connections = [];
        particles = [];
        
        // Create a dense network with more nodes
        const nodeCount = Math.min(120, Math.floor(canvas.width / 25));
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 3 + 1.5,
                brightness: Math.random() * 0.6 + 0.4,
                pulseSpeed: Math.random() * 0.03 + 0.015,
                pulsePhase: Math.random() * Math.PI * 2,
                type: Math.random() > 0.7 ? 'hub' : 'node', // Some nodes are hubs
                connections: 0
            });
        }
        
        // Create dense connections between nearby nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = Math.sqrt(
                    Math.pow(nodes[i].x - nodes[j].x, 2) + 
                    Math.pow(nodes[i].y - nodes[j].y, 2)
                );
                
                // Shorter connection distance for denser network
                if (distance < 100) {
                    connections.push({
                        from: i,
                        to: j,
                        opacity: Math.max(0.15, 1 - distance / 100),
                        flow: Math.random(),
                        flowSpeed: Math.random() * 0.04 + 0.02,
                        width: Math.random() * 1.5 + 0.5,
                        dataPackets: []
                    });
                    
                    nodes[i].connections++;
                    nodes[j].connections++;
                }
            }
        }
        
        // Create floating particles
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.6 + 0.2,
                life: Math.random() * Math.PI * 2,
                lifeSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }
    
    function updateNetwork() {
        time += 0.016;
        
        // Update nodes
        nodes.forEach(node => {
            // Update position with gentle movement
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges with some padding
            if (node.x < 20 || node.x > canvas.width - 20) node.vx *= -1;
            if (node.y < 20 || node.y > canvas.height - 20) node.vy *= -1;
            
            // Keep within bounds
            node.x = Math.max(20, Math.min(canvas.width - 20, node.x));
            node.y = Math.max(20, Math.min(canvas.height - 20, node.y));
            
            // Update pulse
            node.pulsePhase += node.pulseSpeed;
            
            // Add subtle attraction to center
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const dx = centerX - node.x;
            const dy = centerY - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 50) {
                node.vx += dx * 0.0001;
                node.vy += dy * 0.0001;
            }
        });
        
        // Update connection flow and data packets
        connections.forEach(connection => {
            connection.flow += connection.flowSpeed;
            if (connection.flow > 1) connection.flow = 0;
            
            // Add data packets occasionally
            if (Math.random() < 0.02) {
                connection.dataPackets.push({
                    progress: 0,
                    speed: Math.random() * 0.02 + 0.01,
                    size: Math.random() * 3 + 2
                });
            }
            
            // Update data packets
            connection.dataPackets = connection.dataPackets.filter(packet => {
                packet.progress += packet.speed;
                return packet.progress < 1;
            });
        });
        
        // Update particles
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life += particle.lifeSpeed;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            // Keep within bounds
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        });
    }
    
    function drawBackground() {
        // Create subtle gradient background
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        
        gradient.addColorStop(0, 'rgba(10, 25, 41, 0.8)');
        gradient.addColorStop(0.5, 'rgba(13, 74, 90, 0.6)');
        gradient.addColorStop(1, 'rgba(10, 25, 41, 0.9)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    function drawParticles() {
        particles.forEach(particle => {
            const opacity = particle.opacity * (0.5 + 0.5 * Math.sin(particle.life));
            
            ctx.fillStyle = `rgba(92, 194, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    function drawConnections() {
        connections.forEach(connection => {
            const fromNode = nodes[connection.from];
            const toNode = nodes[connection.to];
            
            if (!fromNode || !toNode) return;
            
            // Create gradient connection line
            const gradient = ctx.createLinearGradient(
                fromNode.x, fromNode.y,
                toNode.x, toNode.y
            );
            
            // Bright cyan/blue gradient with varying intensity
            const intensity = 0.5 + 0.5 * Math.sin(time * 2 + connection.from + connection.to);
            gradient.addColorStop(0, `rgba(92, 194, 255, ${connection.opacity * intensity * 0.8})`);
            gradient.addColorStop(0.3, `rgba(0, 255, 255, ${connection.opacity * intensity * 1.2})`);
            gradient.addColorStop(0.7, `rgba(0, 255, 255, ${connection.opacity * intensity * 1.2})`);
            gradient.addColorStop(1, `rgba(92, 194, 255, ${connection.opacity * intensity * 0.8})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = connection.width;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.stroke();
            
            // Draw data packets flowing along connections
            connection.dataPackets.forEach(packet => {
                const packetX = fromNode.x + (toNode.x - fromNode.x) * packet.progress;
                const packetY = fromNode.y + (toNode.y - fromNode.y) * packet.progress;
                
                // Bright white flowing data packet
                const packetGradient = ctx.createRadialGradient(
                    packetX, packetY, 0,
                    packetX, packetY, packet.size
                );
                
                packetGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                packetGradient.addColorStop(0.5, 'rgba(92, 194, 255, 0.7)');
                packetGradient.addColorStop(1, 'rgba(92, 194, 255, 0)');
                
                ctx.fillStyle = packetGradient;
                ctx.beginPath();
                ctx.arc(packetX, packetY, packet.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Add flowing particle effect
            if (!prefersReducedMotion) {
                const flowX = fromNode.x + (toNode.x - fromNode.x) * connection.flow;
                const flowY = fromNode.y + (toNode.y - fromNode.y) * connection.flow;
                
                // Bright white flowing particle
                const particleGradient = ctx.createRadialGradient(
                    flowX, flowY, 0,
                    flowX, flowY, 8
                );
                
                particleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                particleGradient.addColorStop(0.5, 'rgba(92, 194, 255, 0.6)');
                particleGradient.addColorStop(1, 'rgba(92, 194, 255, 0)');
                
                ctx.fillStyle = particleGradient;
                ctx.beginPath();
                ctx.arc(flowX, flowY, 8, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
    
    function drawNodes() {
        nodes.forEach(node => {
            // Calculate pulse effect
            const pulse = Math.sin(node.pulsePhase) * 0.4 + 0.6;
            const currentBrightness = node.brightness * pulse;
            
            // Different appearance for hub nodes
            const isHub = node.type === 'hub';
            const baseRadius = isHub ? node.radius * 1.5 : node.radius;
            const glowRadius = baseRadius * (isHub ? 6 : 4);
            
            // Create glowing effect around node
            const gradient = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, glowRadius
            );
            
            if (isHub) {
                // Hub nodes have more intense glow
                gradient.addColorStop(0, `rgba(255, 255, 255, ${currentBrightness})`);
                gradient.addColorStop(0.2, `rgba(92, 194, 255, ${currentBrightness * 0.8})`);
                gradient.addColorStop(0.5, `rgba(0, 255, 255, ${currentBrightness * 0.6})`);
                gradient.addColorStop(0.8, `rgba(92, 194, 255, ${currentBrightness * 0.3})`);
                gradient.addColorStop(1, 'rgba(92, 194, 255, 0)');
            } else {
                // Regular nodes
                gradient.addColorStop(0, `rgba(255, 255, 255, ${currentBrightness})`);
                gradient.addColorStop(0.3, `rgba(92, 194, 255, ${currentBrightness * 0.6})`);
                gradient.addColorStop(0.7, `rgba(92, 194, 255, ${currentBrightness * 0.2})`);
                gradient.addColorStop(1, 'rgba(92, 194, 255, 0)');
            }
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Bright white core
            ctx.fillStyle = `rgba(255, 255, 255, ${currentBrightness})`;
            ctx.beginPath();
            ctx.arc(node.x, node.y, baseRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Add connection count indicator for hub nodes
            if (isHub && node.connections > 3) {
                ctx.fillStyle = `rgba(0, 255, 255, ${currentBrightness * 0.8})`;
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(node.connections.toString(), node.x, node.y + 3);
            }
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!prefersReducedMotion) {
            updateNetwork();
        }
        
        drawBackground();
        drawParticles();
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
function initNewsletterForm() {
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
            alert('Please enter a valid email address.');
            return;
        }
        
        // Show loading state
        button.classList.add('loading');
        button.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success state
            button.querySelector('.btn-text').textContent = 'Subscribed!';
            button.style.background = 'linear-gradient(135deg, #059669, #34d399)';
            input.value = '';
            
            setTimeout(() => {
                button.querySelector('.btn-text').textContent = 'Subscribe';
                button.style.background = '';
            }, 3000);
            
        } catch (error) {
            // Error state
            button.querySelector('.btn-text').textContent = 'Try Again';
            button.style.background = 'linear-gradient(135deg, #dc2626, #f87171)';
            
            setTimeout(() => {
                button.querySelector('.btn-text').textContent = 'Subscribe';
                button.style.background = '';
            }, 3000);
        } finally {
            // Reset loading state
            button.classList.remove('loading');
            button.disabled = false;
        }
    });
}
