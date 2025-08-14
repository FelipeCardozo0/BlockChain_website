// Projects Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNetworkBackground();
    initScrollAnimations();
    initCounterAnimations();
    initFooterBackground();
    initNewsletterForm();
    initProjectInteractions();
    
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
});

// Animated Network Background
function initNetworkBackground() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Network nodes
    const nodes = [];
    const nodeCount = 50;
    const maxDistance = 150;
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 3 + 1
        });
    }
    
    function animate() {
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
        
        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
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
    const canvas = document.getElementById('blockchainCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initializeMatrix();
    }
    
    // Matrix characters (mix of blockchain-related symbols, numbers, and letters)
    const matrixChars = '01ABCDEF0123456789abcdef@#$%&*+=<>?{}[]()|\\/~^';
    
    // Matrix columns
    let columns = [];
    let time = 0;
    
    function initializeMatrix() {
        columns = [];
        const columnWidth = 28; // Increased from 18 to 28 for more spacing
        const columnCount = Math.floor(canvas.width / columnWidth);
        
        for (let i = 0; i < columnCount; i++) {
            columns.push({
                x: i * columnWidth,
                chars: [],
                speed: Math.random() * 1.5 + 0.8,
                delay: Math.random() * 200,
                length: Math.floor(Math.random() * 15) + 8
            });
        }
    }
    
    function createMatrixChar() {
        return matrixChars[Math.floor(Math.random() * matrixChars.length)];
    }
    
    function animateFooter() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.016; // Assuming 60fps
        
        columns.forEach((column, columnIndex) => {
            // Update column
            if (time * 1000 > column.delay) {
                // Add new character at top
                column.chars.unshift({
                    char: createMatrixChar(),
                    y: 0,
                    opacity: 1,
                    brightness: Math.random() > 0.85 ? 1 : 0.4 // Some chars are brighter
                });
                
                // Remove characters that are off screen
                column.chars = column.chars.filter(char => char.y < canvas.height + 30);
                
                // Update character positions
                column.chars.forEach(char => {
                    char.y += column.speed;
                    char.opacity = Math.max(0, 1 - (char.y / canvas.height));
                });
            }
            
            // Draw characters
            column.chars.forEach((char, charIndex) => {
                ctx.save();
                ctx.font = '14px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                
                // Use gradient color scheme to match footer hover effects
                if (char.brightness === 1) {
                    // Bright character (head of the column) - use light blue from gradient
                    ctx.fillStyle = 'rgba(92, 194, 255, 0.9)'; // #5cc2ff
                    ctx.shadowColor = 'rgba(92, 194, 255, 0.8)';
                    ctx.shadowBlur = 8;
                } else {
                    // Regular character - alternate between gradient colors based on position
                    const gradientProgress = (char.y / canvas.height) % 1;
                    if (gradientProgress < 0.5) {
                        // First half of gradient: light blue to yellow
                        const colorProgress = gradientProgress * 2;
                        const r = Math.floor(92 + (247 - 92) * colorProgress);
                        const g = Math.floor(194 + (201 - 194) * colorProgress);
                        const b = Math.floor(255 + (72 - 255) * colorProgress);
                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${char.opacity * 0.6})`;
                    } else {
                        // Second half of gradient: yellow to light blue
                        const colorProgress = (gradientProgress - 0.5) * 2;
                        const r = Math.floor(247 + (92 - 247) * colorProgress);
                        const g = Math.floor(201 + (194 - 201) * colorProgress);
                        const b = Math.floor(72 + (255 - 72) * colorProgress);
                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${char.opacity * 0.6})`;
                    }
                    ctx.shadowBlur = 0;
                }
                
                ctx.globalAlpha = char.opacity;
                ctx.fillText(char.char, column.x, char.y);
                
                ctx.restore();
            });
        });
        
        animationId = requestAnimationFrame(animateFooter);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animateFooter();
    
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
}

// Newsletter Form
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletterEmail');
    const submitBtn = form?.querySelector('.newsletter-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnSpinner = submitBtn?.querySelector('.newsletter-spinner');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        if (!email) return;
        
        // Show loading state
        submitBtn.classList.add('loading');
        btnText.style.opacity = '0';
        btnSpinner.style.display = 'block';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success state
            btnText.textContent = 'Subscribed!';
            submitBtn.style.background = 'linear-gradient(135deg, #059669, #34d399)';
            emailInput.value = '';
            
            setTimeout(() => {
                btnText.textContent = 'Subscribe';
                submitBtn.style.background = '';
            }, 3000);
            
        } catch (error) {
            // Error state
            btnText.textContent = 'Try Again';
            submitBtn.style.background = 'linear-gradient(135deg, #dc2626, #f87171)';
            
            setTimeout(() => {
                btnText.textContent = 'Subscribe';
                submitBtn.style.background = '';
            }, 3000);
        } finally {
            // Reset loading state
            submitBtn.classList.remove('loading');
            btnText.style.opacity = '1';
            btnSpinner.style.display = 'none';
        }
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
