// Projects Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Performance monitoring and fallback
    const performanceConfig = {
        enableAnimations: true,
        animationQuality: 'high' // 'high', 'medium', 'low', 'disabled'
    };
    

    
    // Detect device performance and set appropriate quality
    if (navigator.hardwareConcurrency) {
        if (navigator.hardwareConcurrency < 2) {
            performanceConfig.animationQuality = 'disabled';
            performanceConfig.enableAnimations = false;
        } else if (navigator.hardwareConcurrency < 4) {
            performanceConfig.animationQuality = 'low';
        } else if (navigator.hardwareConcurrency < 8) {
            performanceConfig.animationQuality = 'medium';
        }
    }
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        performanceConfig.animationQuality = 'disabled';
        performanceConfig.enableAnimations = false;
    }
    
    // Monitor frame rate and adjust if needed
    let frameCount = 0;
    let lastTime = performance.now();
    let lowFrameRateDetected = false;
    
    function monitorPerformance(currentTime) {
        frameCount++;
        if (currentTime - lastTime >= 1000) { // Check every second
            const fps = frameCount * 1000 / (currentTime - lastTime);
            
            if (fps < 25 && !lowFrameRateDetected) {
                lowFrameRateDetected = true;
                console.warn('Low frame rate detected, reducing animation quality');
                // Dynamically reduce animation quality
                if (performanceConfig.animationQuality === 'high') {
                    performanceConfig.animationQuality = 'medium';
                } else if (performanceConfig.animationQuality === 'medium') {
                    performanceConfig.animationQuality = 'low';
                } else if (performanceConfig.animationQuality === 'low') {
                    performanceConfig.animationQuality = 'disabled';
                    performanceConfig.enableAnimations = false;
                }
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(monitorPerformance);
    }
    
    if (performanceConfig.enableAnimations) {
        requestAnimationFrame(monitorPerformance);
    }
    
    // Initialize components based on performance configuration
    if (performanceConfig.enableAnimations) {
        initNetworkBackground();
        initFooterBackground();
    } else {
        // Disable animations and show static fallback
        disableAnimations();
    }
    
    // Initialize other components (these don't affect performance as much)
    initScrollAnimations();
    initCounterAnimations();
    initNewsletterForm();
    initProjectInteractions();
    initNavigation();
    initTypewriterAnimation();
    initScrambleAnimation();
    initRoadmapAnimations();
    
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
});

// Function to disable animations and show static fallback
function disableAnimations() {
    // Remove animated backgrounds
    const animatedBackground = document.querySelector('.animated-background');
    if (animatedBackground) {
        animatedBackground.style.display = 'none';
    }
    
    // Add static background
    document.body.style.background = 'linear-gradient(135deg, #0b0f1a 0%, #0b2a5a 100%)';
    
    // Remove footer canvas
    const footerCanvas = document.getElementById('blockchainCanvas');
    if (footerCanvas) {
        footerCanvas.style.display = 'none';
    }
    
    // Add static footer background
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(11, 42, 90, 0.6) 100%)';
    }
    
    console.log('Animations disabled for better performance');
}

// Animated Network Background
function initNetworkBackground() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let lastTime = 0;
    let isVisible = true;
    let isLowPerformance = false;
    
    // Performance detection
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        isLowPerformance = true;
    }
    
    // Check if device prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Network nodes - reduced count for better performance
    const nodes = [];
    const nodeCount = isLowPerformance ? 25 : 50; // Reduced nodes for low-end devices
    const maxDistance = isLowPerformance ? 120 : 150; // Reduced connection distance
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * (isLowPerformance ? 0.3 : 0.5), // Slower movement for low-end
            vy: (Math.random() - 0.5) * (isLowPerformance ? 0.3 : 0.5),
            radius: Math.random() * 2 + 1 // Reduced radius
        });
    }
    
    function animate(currentTime) {
        // Throttle animation to 30fps for better performance
        if (currentTime - lastTime < 33) { // ~30fps
            animationId = requestAnimationFrame(animate);
            return;
        }
        
        // Skip animation if not visible or reduced motion preferred
        if (!isVisible || prefersReducedMotion) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw nodes
        nodes.forEach(node => {
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
            if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;
            
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(92, 194, 255, 0.6)';
            ctx.fill();
        });
        
        // Draw connections with reduced frequency for low-end devices
        const connectionStep = isLowPerformance ? 2 : 1; // Skip some connections on low-end devices
        for (let i = 0; i < nodes.length; i += connectionStep) {
            for (let j = i + connectionStep; j < nodes.length; j += connectionStep) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (maxDistance - distance) / maxDistance * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(92, 194, 255, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        lastTime = currentTime;
        animationId = requestAnimationFrame(animate);
    }
    
    // Intersection Observer to pause animation when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
        });
    }, { threshold: 0.1 });
    
    observer.observe(canvas);
    
    animate(0);
    
    // Cleanup function
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        observer.disconnect();
    };
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
    
    // Add animation classes and observe elements
    const animatedElements = [
        '.featured-card',
        '.project-card',
        '.metric-item',
        '.collaboration-content',
        '.collaboration-visual'
    ];
    
    animatedElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.animationDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    });
}

// Counter Animations for Metrics
function initCounterAnimations() {
    const metrics = document.querySelectorAll('.metric-value');
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    metrics.forEach(metric => {
        observer.observe(metric);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const start = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startValue + (target - startValue) * easeOut);
        
        // Format number with commas for large numbers
        if (target >= 1000) {
            element.textContent = current.toLocaleString();
        } else if (target >= 10 && target < 100 && element.dataset.target.includes('.')) {
            // Handle decimal values like 99.9
            const decimalTarget = parseFloat(element.dataset.target);
            const decimalCurrent = startValue + (decimalTarget - startValue) * easeOut;
            element.textContent = decimalCurrent.toFixed(1);
        } else {
            element.textContent = current;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Footer Background Animation
function initFooterBackground() {
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

// Project Interactions
function initProjectInteractions() {
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    // Featured project interactions
    const featuredCards = document.querySelectorAll('.featured-card');
    
    featuredCards.forEach(card => {
        const image = card.querySelector('.project-image');
        
        card.addEventListener('mouseenter', () => {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
    
    // Quick view functionality
    const quickViewBtns = document.querySelectorAll('.project-quick-view');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Add quick view modal functionality here
            console.log('Quick view clicked');
        });
    });
    
    // CTA button interactions
    const ctaBtns = document.querySelectorAll('.project-cta, .featured-cta, .collaboration-cta');
    
    ctaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (rect.width / 2 - size / 2) + 'px';
            ripple.style.top = (rect.height / 2 - size / 2) + 'px';
            
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Typewriter Animation
function initTypewriterAnimation() {
    const typewriterText = document.getElementById('typewriterText');
    const cursor = document.querySelector('.typewriter-cursor');
    
    if (!typewriterText || !cursor) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Show static text for users who prefer reduced motion
        typewriterText.textContent = 'All Projects';
        cursor.style.display = 'none';
        return;
    }
    
    // Ensure cursor is visible and start blinking
    cursor.style.display = 'inline-block';
    cursor.style.animation = 'none'; // Disable CSS animation to use our custom blinking
    
    const words = [
        'All Projects',
        'Coding Initiatives',
        'Blockchain Ventures',
        'Crypto Programs'
    ];
    
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150; // ms per character (slowed down)
    let deleteSpeed = 75; // ms per character when deleting (slowed down)
    let pauseTime = 1000; // ms to pause after completing a word (increased pause)
    
    // Cursor blinking state
    let cursorVisible = true;
    
    // Function to toggle cursor visibility
    function toggleCursor() {
        cursorVisible = !cursorVisible;
        cursor.style.opacity = cursorVisible ? '1' : '0';
    }
    
    // Start cursor blinking
    const cursorBlinkInterval = setInterval(toggleCursor, 500); // Blink every 500ms
    
    function typeWriter() {
        const currentWord = words[currentWordIndex];
        
        if (isDeleting) {
            // Delete characters
            typewriterText.textContent = currentWord.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = deleteSpeed;
        } else {
            // Type characters
            typewriterText.textContent = currentWord.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 150;
        }
        
        // Handle word completion and transitions
        if (!isDeleting && currentCharIndex === currentWord.length) {
            // Word completed, pause then start deleting
            typingSpeed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            // Word deleted, move to next word
            isDeleting = false;
            currentWordIndex = (currentWordIndex + 1) % words.length;
            typingSpeed = 250; // Pause before starting next word (reduced pause)
        }
        
        setTimeout(typeWriter, typingSpeed);
    }
    
    // Start the animation
    setTimeout(typeWriter, 500); // Initial delay (reduced)
    
    // Cleanup function to clear the cursor blinking interval
    window.addEventListener('beforeunload', () => {
        if (cursorBlinkInterval) {
            clearInterval(cursorBlinkInterval);
        }
    });
}

// Scramble Text Animation
function initScrambleAnimation() {
    const scrambleElement = document.getElementById('featuredProjectsScramble');
    if (!scrambleElement) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return; // Skip animation for users who prefer reduced motion
    }
    
    const originalText = 'Featured Projects';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let isAnimating = false;
    
    // Create character spans
    function createCharacterSpans() {
        scrambleElement.innerHTML = '';
        for (let i = 0; i < originalText.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.className = 'scramble-char';
            
            // Handle spaces properly
            if (originalText[i] === ' ') {
                charSpan.innerHTML = '&nbsp;'; // Use non-breaking space
                charSpan.dataset.originalChar = ' ';
            } else {
                charSpan.textContent = originalText[i];
                charSpan.dataset.originalChar = originalText[i];
            }
            
            scrambleElement.appendChild(charSpan);
        }
    }
    
    // Initialize character spans
    createCharacterSpans();
    
    // Scramble animation function
    function scrambleText() {
        if (isAnimating) return;
        isAnimating = true;
        
        const charSpans = scrambleElement.querySelectorAll('.scramble-char');
        const scrambleDuration = 2000; // 2 seconds (back to original)
        const charDelay = 60; // 60ms between each character (faster than original 50ms)
        const iterations = 12; // Number of scramble iterations per character (balanced)
        
        charSpans.forEach((charSpan, index) => {
            let iteration = 0;
            
            const scrambleChar = () => {
                if (iteration < iterations) {
                    // Don't scramble spaces, keep them as spaces
                    if (charSpan.dataset.originalChar === ' ') {
                        charSpan.innerHTML = '&nbsp;';
                    } else {
                        charSpan.textContent = characters[Math.floor(Math.random() * characters.length)];
                    }
                    charSpan.classList.add('scrambling');
                    
                    setTimeout(() => {
                        charSpan.classList.remove('scrambling');
                    }, 120);
                    
                    iteration++;
                    setTimeout(scrambleChar, charDelay);
                } else {
                    // Final character reveal
                    if (charSpan.dataset.originalChar === ' ') {
                        charSpan.innerHTML = '&nbsp;';
                    } else {
                        charSpan.textContent = charSpan.dataset.originalChar;
                    }
                    charSpan.classList.add('final');
                    
                    setTimeout(() => {
                        charSpan.classList.remove('final');
                    }, 300);
                    
                    // Check if all characters are done
                    if (index === charSpans.length - 1) {
                        setTimeout(() => {
                            isAnimating = false;
                        }, 500);
                    }
                }
            };
            
            // Start scrambling for this character
            setTimeout(scrambleChar, index * charDelay);
        });
    }
    
    // Trigger scramble animation when element comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isAnimating) {
                setTimeout(scrambleText, 500); // Small delay for better effect
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(scrambleElement);
    
    // Also trigger on page load after a delay
    setTimeout(() => {
        if (!isAnimating) {
            scrambleText();
        }
    }, 1000);
}

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Performance optimization: Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
}

// Add loading states for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => {
        img.style.opacity = '1';
    });
    
    img.addEventListener('error', () => {
        img.style.opacity = '0.5';
        img.alt = 'Image failed to load';
    });
});

// Keyboard navigation improvements
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add focus styles for keyboard navigation
const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #5cc2ff !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(keyboardStyle);

// Navigation Functions
function initNavigation() {
    const menuButton = document.getElementById('menuButton');
    const overlayClose = document.getElementById('overlayClose');
    const menuOverlay = document.getElementById('menuOverlay');
    const homeNavbar = document.getElementById('homeNavbar');
    const projectsNavbar = document.getElementById('projectsNavbar');
    
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
        
        if (homeNavbar && projectsNavbar && !isMobile) {
            if (currentScrollY > scrollThreshold) {
                // Hide home navbar, show projects navbar
                homeNavbar.classList.add('hidden');
                projectsNavbar.classList.add('visible');
            } else {
                // Show home navbar, hide projects navbar
                homeNavbar.classList.remove('hidden');
                projectsNavbar.classList.remove('visible');
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
    
    // Smooth scrolling for projects navbar links (desktop only)
    const projectsNavLinks = document.querySelectorAll('.projects-navbar .projects-nav-link[data-section]');
    projectsNavLinks.forEach(link => {
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
    const navLinks = document.querySelectorAll('.projects-navbar .projects-nav-link[data-section]');
    
    window.addEventListener('scroll', function() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) return; // Disable on mobile
        
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
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMenu() {
    const overlay = document.getElementById('menuOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Roadmap Animations
function initRoadmapAnimations() {
    const roadmapItems = document.querySelectorAll('.roadmap-item');
    const roadmapPhases = document.querySelectorAll('.roadmap-phase');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe roadmap phases
    roadmapPhases.forEach(phase => {
        phase.style.opacity = '0';
        phase.style.transform = 'translateY(30px)';
        phase.style.transition = 'all 0.6s ease';
        observer.observe(phase);
    });
    
    // Observe individual roadmap items
    roadmapItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Add hover effects for roadmap items
    roadmapItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Performance Settings Modal
function initPerformanceSettings() {
    const performanceBtn = document.getElementById('performanceSettings');
    const performanceModal = document.getElementById('performanceModal');
    const performanceModalClose = document.getElementById('performanceModalClose');
    const performanceSaveBtn = document.getElementById('performanceSaveBtn');
    const performanceOptions = document.querySelectorAll('.performance-option');
    
    if (!performanceBtn || !performanceModal) return;
    
    // Load saved settings
    const savedQuality = localStorage.getItem('animationQuality') || 'high';
    setActiveOption(savedQuality);
    
    // Open modal
    performanceBtn.addEventListener('click', () => {
        performanceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal
    performanceModalClose.addEventListener('click', closePerformanceModal);
    performanceModal.addEventListener('click', (e) => {
        if (e.target === performanceModal) {
            closePerformanceModal();
        }
    });
    
    // Handle option selection
    performanceOptions.forEach(option => {
        option.addEventListener('click', () => {
            const quality = option.dataset.quality;
            setActiveOption(quality);
        });
    });
    
    // Save settings
    performanceSaveBtn.addEventListener('click', () => {
        const activeOption = document.querySelector('.performance-option.active');
        if (activeOption) {
            const quality = activeOption.dataset.quality;
            localStorage.setItem('animationQuality', quality);
            applyPerformanceSettings(quality);
            closePerformanceModal();
            
            // Show feedback
            showPerformanceFeedback(quality);
        }
    });
    
    function setActiveOption(quality) {
        performanceOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.quality === quality) {
                option.classList.add('active');
            }
        });
    }
    
    function closePerformanceModal() {
        performanceModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function applyPerformanceSettings(quality) {
        // Reload page to apply new settings
        window.location.reload();
    }
    
    function showPerformanceFeedback(quality) {
        const messages = {
            high: 'High quality animations enabled',
            medium: 'Medium quality animations enabled',
            low: 'Low quality animations enabled',
            disabled: 'Animations disabled for better performance'
        };
        
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #5cc2ff, #3b82f6);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        `;
        feedback.textContent = messages[quality];
        
        document.body.appendChild(feedback);
        
        // Animate in
        setTimeout(() => {
            feedback.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            feedback.style.transform = 'translateX(100%)';
            setTimeout(() => {
                feedback.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize performance settings
initPerformanceSettings();
