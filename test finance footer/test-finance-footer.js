// Finance footer functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeMenuOverlay();
    initializeFooter();
    initializeLedgerAnimation();
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
}

// Focus trap functionality
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', handleTabKey);
    
    function handleTabKey(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }
    }
}

function removeFocusTrap() {
    // Remove event listeners when menu closes
    const menuOverlay = document.getElementById('menuOverlay');
    if (menuOverlay) {
        menuOverlay.removeEventListener('keydown', handleTabKey);
    }
}

// Ripple effect for buttons
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
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Footer functionality
function initializeFooter() {
    // Update current year
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize newsletter signup
    initializeNewsletterSignup();
}

// Newsletter signup functionality
function initializeNewsletterSignup() {
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterBtn = document.querySelector('.newsletter-btn');
    
    if (!newsletterForm || !newsletterEmail || !newsletterBtn) return;
    
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = newsletterEmail.value.trim();
        if (!email) return;
        
        // Show loading state
        newsletterBtn.classList.add('loading');
        newsletterBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showNotification('Successfully subscribed to newsletter!', 'success');
            newsletterEmail.value = '';
            
        } catch (error) {
            // Show error message
            showNotification('Failed to subscribe. Please try again.', 'error');
        } finally {
            // Reset loading state
            newsletterBtn.classList.remove('loading');
            newsletterBtn.disabled = false;
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
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
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    notification.style.backgroundColor = bgColor;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Flowing Digital Ledger Animation
function initializeLedgerAnimation() {
    const canvas = document.getElementById('ledgerCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Animation state
    let time = 0;
    let transactionRows = [];
    let blockIcons = [];
    let highlightEffects = [];
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Generate fake transaction data
    const generateTransactionData = () => {
        const transactionTypes = ['Transfer', 'Swap', 'Stake', 'Unstake', 'Mint', 'Burn'];
        const addresses = [
            '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
            '0x8ba1f109551bD432803012645Hac136c772c3',
            '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
            '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8',
            '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
            '0x514910771AF9Ca656af840dff83E8264EcF986CA'
        ];
        
        return {
            hash: '0x' + Math.random().toString(16).substr(2, 64),
            from: addresses[Math.floor(Math.random() * addresses.length)],
            to: addresses[Math.floor(Math.random() * addresses.length)],
            amount: (Math.random() * 1000).toFixed(4),
            type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
            timestamp: new Date().toISOString()
        };
    };
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initializeLedgerElements();
    }
    
    function initializeLedgerElements() {
        // Initialize transaction rows
        transactionRows = [];
        const numRows = Math.floor(canvas.height / 30);
        
        for (let i = 0; i < numRows; i++) {
            transactionRows.push({
                y: i * 30 + 15,
                x: Math.random() * canvas.width,
                speed: (Math.random() * 0.5 + 0.5) * (prefersReducedMotion ? 0.1 : 1),
                data: generateTransactionData(),
                opacity: Math.random() * 0.15 + 0.05,
                highlight: false,
                highlightTimer: 0
            });
        }
        
        // Initialize block icons
        blockIcons = [];
        for (let i = 0; i < 8; i++) {
            blockIcons.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 8 + 4,
                speed: (Math.random() * 0.3 + 0.2) * (prefersReducedMotion ? 0.1 : 1),
                opacity: Math.random() * 0.2 + 0.1,
                direction: Math.random() > 0.5 ? 1 : -1
            });
        }
        
        // Initialize highlight effects
        highlightEffects = [];
    }
    
    function drawTransactionRow(row) {
        const { x, y, data, opacity, highlight } = row;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Set text color based on highlight
        if (highlight) {
            ctx.fillStyle = '#f7c948';
            ctx.shadowColor = '#f7c948';
            ctx.shadowBlur = 10;
        } else {
            ctx.fillStyle = '#5cc2ff';
            ctx.shadowColor = '#5cc2ff';
            ctx.shadowBlur = 5;
        }
        
        ctx.font = '11px "Courier New", monospace';
        
        // Draw transaction data
        const text = `${data.hash.substr(0, 16)}... | ${data.from.substr(0, 8)}... → ${data.to.substr(0, 8)}... | ${data.amount} ETH | ${data.type}`;
        
        // Check if text is within canvas bounds
        if (x < canvas.width + 200) {
            ctx.fillText(text, x, y);
        }
        
        ctx.restore();
    }
    
    function drawBlockIcon(block) {
        const { x, y, size, opacity } = block;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = '#5cc2ff';
        ctx.lineWidth = 1;
        
        // Draw cube outline
        const halfSize = size / 2;
        ctx.beginPath();
        ctx.moveTo(x - halfSize, y - halfSize);
        ctx.lineTo(x + halfSize, y - halfSize);
        ctx.lineTo(x + halfSize, y + halfSize);
        ctx.lineTo(x - halfSize, y + halfSize);
        ctx.closePath();
        ctx.stroke();
        
        // Draw diagonal lines for 3D effect
        ctx.beginPath();
        ctx.moveTo(x + halfSize, y - halfSize);
        ctx.lineTo(x + halfSize + 2, y - halfSize - 2);
        ctx.lineTo(x + halfSize + 2, y + halfSize - 2);
        ctx.lineTo(x + halfSize, y + halfSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x + halfSize, y + halfSize);
        ctx.lineTo(x + halfSize + 2, y + halfSize - 2);
        ctx.lineTo(x - halfSize + 2, y + halfSize - 2);
        ctx.lineTo(x - halfSize, y + halfSize);
        ctx.stroke();
        
        ctx.restore();
    }
    
    function drawHighlightEffect(effect) {
        const { x, y, width, opacity, timer } = effect;
        
        ctx.save();
        ctx.globalAlpha = opacity * (1 - timer / 60);
        
        // Create gradient for highlight
        const gradient = ctx.createLinearGradient(x, y, x + width, y);
        gradient.addColorStop(0, 'rgba(247, 201, 72, 0)');
        gradient.addColorStop(0.5, 'rgba(247, 201, 72, 0.3)');
        gradient.addColorStop(1, 'rgba(247, 201, 72, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y - 10, width, 20);
        
        ctx.restore();
    }
    
    function updateAnimation() {
        if (prefersReducedMotion) {
            return;
        }
        
        time++;
        
        // Update transaction rows
        transactionRows.forEach(row => {
            row.x -= row.speed;
            
            // Reset position when off screen
            if (row.x < -800) {
                row.x = canvas.width + 100;
                row.data = generateTransactionData();
                row.opacity = Math.random() * 0.15 + 0.05;
                
                // Randomly add highlight effect
                if (Math.random() < 0.02) {
                    row.highlight = true;
                    row.highlightTimer = 60;
                    
                    // Add highlight effect
                    highlightEffects.push({
                        x: row.x,
                        y: row.y,
                        width: 300,
                        opacity: 0.5,
                        timer: 0
                    });
                }
            }
            
            // Update highlight timer
            if (row.highlight && row.highlightTimer > 0) {
                row.highlightTimer--;
                if (row.highlightTimer === 0) {
                    row.highlight = false;
                }
            }
        });
        
        // Update block icons
        blockIcons.forEach(block => {
            block.x += block.speed * block.direction;
            
            // Reset position when off screen
            if (block.direction > 0 && block.x > canvas.width + 50) {
                block.x = -50;
                block.y = Math.random() * canvas.height;
            } else if (block.direction < 0 && block.x < -50) {
                block.x = canvas.width + 50;
                block.y = Math.random() * canvas.height;
            }
        });
        
        // Update highlight effects
        highlightEffects.forEach((effect, index) => {
            effect.timer++;
            if (effect.timer >= 60) {
                highlightEffects.splice(index, 1);
            }
        });
    }
    
    function render() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw highlight effects first (background)
        highlightEffects.forEach(drawHighlightEffect);
        
        // Draw transaction rows
        transactionRows.forEach(drawTransactionRow);
        
        // Draw block icons
        blockIcons.forEach(drawBlockIcon);
    }
    
    function animate() {
        updateAnimation();
        render();
        animationId = requestAnimationFrame(animate);
    }
    
    // Initialize and start animation
    resizeCanvas();
    
    if (!prefersReducedMotion) {
        animate();
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}

// Navigation bar scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    const homeNavbar = document.getElementById('homeNavbar');
    const teamNavbar = document.getElementById('teamNavbar');
    
    if (!homeNavbar || !teamNavbar) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide team navbar based on scroll position
        if (scrollTop > 100) {
            homeNavbar.style.transform = 'translateY(-100%)';
            teamNavbar.classList.add('visible');
        } else {
            homeNavbar.style.transform = 'translateY(0)';
            teamNavbar.classList.remove('visible');
        }
        
        lastScrollTop = scrollTop;
    });
});

// Add CSS animations for menu overlay
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
