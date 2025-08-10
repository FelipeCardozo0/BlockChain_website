// Home page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeGeometricBackground();
    initializeMenuOverlay();
    initializeFooter();
    
    // Initialize existing Home page functionality
    initializePartnersInteraction();
    initializeEventsSection();
    initializeTeamPreviewSection();
    initializeUpdatesSection();
    initializeContactSection();
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

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add scroll effect to navbar
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add background opacity on scroll
        if (scrollTop > 50) {
            navbar.style.backgroundColor = 'rgba(30, 58, 138, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '#1e3a8a';
            navbar.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Button click handlers
    const contactBtn = document.querySelector('.btn-outline');
    const applyBtn = document.querySelector('.btn-primary');
    
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            // Add contact functionality here
            console.log('Contact button clicked');
            // You can add modal, redirect, or other functionality
        });
    }
    
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            // Add apply functionality here
            console.log('Apply button clicked');
            // You can add form, redirect, or other functionality
        });
    }

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});

// Utility function for smooth animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Initialize scroll animations
window.addEventListener('scroll', animateOnScroll);

// Partners section touch handling for mobile devices
function initializePartnersInteraction() {
    const partnerLogos = document.querySelectorAll('.partner-logo');
    
    partnerLogos.forEach(logo => {
        let isActive = false;
        
        // Handle touch devices - tap to toggle color
        logo.addEventListener('touchstart', function(e) {
            e.preventDefault();
            isActive = !isActive;
            
            const img = this.querySelector('.logo-img');
            if (isActive) {
                img.style.filter = 'grayscale(0%) brightness(1)';
                img.style.transform = 'scale(1.05)';
            } else {
                img.style.filter = 'grayscale(100%) brightness(0.8)';
                img.style.transform = 'scale(1)';
            }
            
            // Reset after 3 seconds
            setTimeout(() => {
                if (isActive) {
                    isActive = false;
                    img.style.filter = 'grayscale(100%) brightness(0.8)';
                    img.style.transform = 'scale(1)';
                }
            }, 3000);
        });
        
        // Handle mouse events for desktop
        logo.addEventListener('mouseenter', function() {
            if (!('ontouchstart' in window)) {
                const img = this.querySelector('.logo-img');
                img.style.filter = 'grayscale(0%) brightness(1)';
                img.style.transform = 'scale(1.05)';
            }
        });
        
        logo.addEventListener('mouseleave', function() {
            if (!('ontouchstart' in window)) {
                const img = this.querySelector('.logo-img');
                img.style.filter = 'grayscale(100%) brightness(0.8)';
                img.style.transform = 'scale(1)';
            }
        });
    });
}

// Initialize partners interaction when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // ... existing DOMContentLoaded code ...
    
    // Initialize partners interaction
    initializePartnersInteraction();
    
    // Initialize events section
    initializeEventsSection();
    
    // Initialize updates section
    initializeUpdatesSection();
    
    // Initialize contact section
    initializeContactSection();
    
    // Initialize footer
    initializeFooter();
});

// Events section functionality
function initializeEventsSection() {
    const eventImages = document.querySelectorAll('.event-image-wrapper');
    const eventImagesContainer = document.querySelector('.event-images-container');
    const hiddenImages = document.querySelectorAll('.event-images-hidden .event-image-wrapper');
    
    let currentImageSet = 0;
    let expandedImage = null;
    let autoCollapseTimer = null;
    let imageCycleTimer = null;
    let userInteractionTimer = null;
    
    // Create backdrop element
    const backdrop = document.createElement('div');
    backdrop.className = 'event-backdrop';
    document.body.appendChild(backdrop);
    
    // Reset user interaction timer
    function resetUserInteractionTimer() {
        clearTimeout(userInteractionTimer);
        userInteractionTimer = setTimeout(() => {
            if (!expandedImage) {
                cycleImages();
            }
        }, 20000); // 20 seconds of no interaction
    }
    
    // Cycle through image sets
    function cycleImages() {
        if (expandedImage) return; // Don't cycle if image is expanded
        
        const fanContainer = document.querySelector('.event-images-fan');
        const allImages = [...document.querySelectorAll('.event-image-wrapper')];
        const visibleImages = [...fanContainer.children];
        const hiddenImages = [...document.querySelectorAll('.event-images-hidden .event-image-wrapper')];
        
        // Fade out current images
        fanContainer.style.opacity = '0';
        fanContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            // Remove current images
            visibleImages.forEach(img => {
                fanContainer.removeChild(img);
                document.querySelector('.event-images-hidden').appendChild(img);
            });
            
            // Add next set of images
            for (let i = 0; i < 3 && i < hiddenImages.length; i++) {
                const img = hiddenImages[i];
                document.querySelector('.event-images-hidden').removeChild(img);
                fanContainer.appendChild(img);
            }
            
            // Reapply event listeners to new images
            addImageEventListeners();
            
            // Fade in new images
            fanContainer.style.opacity = '1';
            fanContainer.style.transform = 'translateY(0)';
            
            resetUserInteractionTimer();
        }, 300);
    }
    
    // Add event listeners to images
    function addImageEventListeners() {
        const currentImages = document.querySelectorAll('.event-images-fan .event-image-wrapper');
        
        currentImages.forEach((wrapper, index) => {
            // Remove existing listeners by cloning
            const newWrapper = wrapper.cloneNode(true);
            wrapper.parentNode.replaceChild(newWrapper, wrapper);
            
            // Add event listeners to the new element
            newWrapper.addEventListener('click', function(e) {
                e.stopPropagation();
                expandImage(this);
                resetUserInteractionTimer();
            });
            
            newWrapper.addEventListener('mouseenter', function() {
                resetUserInteractionTimer();
                // Add slight lift effect on hover
                this.style.transform = this.style.transform || '';
            });
            
            newWrapper.addEventListener('mouseleave', function() {
                // Reset to original position if not expanded
                if (!this.classList.contains('expanded')) {
                    this.style.transform = '';
                }
            });
            
            // Add touch support for mobile
            newWrapper.addEventListener('touchstart', function(e) {
                e.preventDefault();
                resetUserInteractionTimer();
            });
            
            newWrapper.addEventListener('touchend', function(e) {
                e.preventDefault();
                expandImage(this);
                resetUserInteractionTimer();
            });
        });
    }
    
    // Expand image
    function expandImage(wrapper) {
        if (expandedImage) return;
        
        expandedImage = wrapper;
        
        // Store original transform for restoration
        wrapper.setAttribute('data-original-transform', wrapper.style.transform || '');
        
        // Show backdrop
        backdrop.classList.add('active');
        
        // Expand the image with smooth transition
        wrapper.classList.add('expanded');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Set auto-collapse timer
        autoCollapseTimer = setTimeout(() => {
            collapseImage();
        }, 30000); // 30 seconds
        
        // Add click listener to backdrop
        backdrop.addEventListener('click', collapseImage);
        
        // Add escape key listener
        document.addEventListener('keydown', handleEscapeKey);
        
        // Pause image cycling while expanded
        clearTimeout(userInteractionTimer);
    }
    
    // Collapse image
    function collapseImage() {
        if (!expandedImage) return;
        
        clearTimeout(autoCollapseTimer);
        
        // Hide backdrop
        backdrop.classList.remove('active');
        
        // Collapse the image
        expandedImage.classList.remove('expanded');
        
        // Restore original transform if it was stored
        const originalTransform = expandedImage.getAttribute('data-original-transform');
        if (originalTransform !== null) {
            expandedImage.style.transform = originalTransform;
            expandedImage.removeAttribute('data-original-transform');
        }
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
        
        // Clean up
        const collapsedImage = expandedImage;
        expandedImage = null;
        backdrop.removeEventListener('click', collapseImage);
        document.removeEventListener('keydown', handleEscapeKey);
        
        // Resume user interaction timer
        resetUserInteractionTimer();
    }
    
    // Handle escape key
    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            collapseImage();
        }
    }
    
    // Initialize event listeners
    addImageEventListeners();
    
    // Start the user interaction timer
    resetUserInteractionTimer();
    
    // Add Learn More button functionality
    const learnMoreBtn = document.querySelector('.learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            console.log('Learn More clicked - redirect to event details');
            resetUserInteractionTimer();
        });
    }
}

// Team Preview section functionality
function initializeTeamPreviewSection() {
    const teamSection = document.querySelector('.team-preview-section');
    const teamCards = document.querySelectorAll('.team-preview-card');
    
    if (!teamSection) {
        console.log('Team section not found');
        return;
    }
    
    console.log('Team section found:', teamSection);
    console.log('Team cards found:', teamCards.length);
    
    // Ensure section is visible immediately
    teamSection.style.opacity = '1';
    teamSection.style.transform = 'translateY(0)';
    teamSection.style.visibility = 'visible';
    teamSection.style.display = 'block';
    
    // Ensure cards are visible
    teamCards.forEach((card, index) => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.visibility = 'visible';
        card.style.display = 'block';
        console.log(`Card ${index} styled:`, card);
    });
    
    // Optional scroll reveal animation
    function checkTeamVisibility() {
        const sectionTop = teamSection.getBoundingClientRect().top;
        const sectionVisible = 150;
        
        if (sectionTop < window.innerHeight - sectionVisible) {
            teamSection.classList.add('fade-in');
            
            // Staggered animation for team cards
            teamCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 150);
            });
        }
    }
    
    // Add hover effects for event cards
    teamCards.forEach((card, index) => {
        // Add hover animation for event photos
        card.addEventListener('mouseenter', function() {
            // Add subtle scale and rotation effect
            const imageWrapper = this.querySelector('.team-preview-image-wrapper');
            if (imageWrapper) {
                imageWrapper.style.transform = 'scale(1.05) rotate(1deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const imageWrapper = this.querySelector('.team-preview-image-wrapper');
            if (imageWrapper) {
                imageWrapper.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Optional: Add click handler to navigate to Team page
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            card.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                card.style.transform = '';
                // Navigate to Team page
                window.location.href = '../Team/Team.html';
            }, 150);
        });
        
        // Keyboard accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
        
        // Make cards focusable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'View team page to see all members');
    });
    
    // Initialize scroll checking
    checkTeamVisibility();
    window.addEventListener('scroll', checkTeamVisibility);
    
    // Add parallax effect to section (subtle)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const sectionTop = teamSection.getBoundingClientRect().top + scrolled;
        const windowHeight = window.innerHeight;
        
        if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + teamSection.offsetHeight) {
            const rate = (scrolled + windowHeight - sectionTop) / (windowHeight + teamSection.offsetHeight);
            const yPos = -(rate * 50); // Subtle parallax movement
            teamSection.style.transform = `translateY(${yPos}px)`;
        }
    });
}

// Updates section functionality
function initializeUpdatesSection() {
    const updateCards = document.querySelectorAll('.update-card');
    const sparkBars = document.querySelectorAll('.spark-bar');
    const chartBars = document.querySelectorAll('.chart-bar');
    
    // Scroll reveal animation
    function checkUpdatesVisibility() {
        updateCards.forEach((card, index) => {
            const cardTop = card.getBoundingClientRect().top;
            const cardVisible = 150;
            
            if (cardTop < window.innerHeight - cardVisible) {
                setTimeout(() => {
                    card.classList.add('animate-in');
                    
                    // Animate charts after card animation
                    setTimeout(() => {
                        animateCharts(card);
                    }, 400);
                }, index * 150);
            }
        });
    }
    
    // Animate charts within a card
    function animateCharts(card) {
        const sparkBars = card.querySelectorAll('.spark-bar');
        const chartBars = card.querySelectorAll('.chart-bar');
        
        // Animate sparkline bars
        sparkBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.transform = 'scaleY(1)';
                bar.style.transformOrigin = 'bottom';
                bar.style.animation = `growUp 0.6s ease-out forwards`;
            }, index * 100);
        });
        
        // Animate chart bars
        chartBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.transform = 'scaleY(1)';
                bar.style.transformOrigin = 'bottom';
                bar.style.animation = `growUp 0.6s ease-out forwards`;
            }, index * 80);
        });
    }
    
    // Add click handlers for cards
    updateCards.forEach((card) => {
        const cta = card.querySelector('.card-cta');
        
        // Card click handler
        card.addEventListener('click', function(e) {
            if (e.target === cta) return; // Let CTA handle its own click
            
            // Add ripple effect
            createRipple(e, this);
            
            // Simulate CTA click
            setTimeout(() => {
                cta.click();
            }, 200);
        });
        
        // CTA click handlers
        if (cta) {
            cta.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const cardType = card.classList.contains('validator-card') ? 'validator' :
                               card.classList.contains('research-card') ? 'research' : 'performance';
                
                handleCTAClick(cardType);
            });
        }
        
        // Keyboard accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                cta.click();
            }
        });
    });
    
    // Create ripple effect
    function createRipple(event, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(92, 194, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Handle CTA clicks
    function handleCTAClick(type) {
        switch (type) {
            case 'validator':
                console.log('Opening Solana validator dashboard...');
                // window.open('https://solanabeach.io/validator/...', '_blank');
                break;
            case 'research':
                console.log('Opening Substack article...');
                // window.open('https://yoursubstack.substack.com/p/defi-yield-optimization', '_blank');
                break;
            case 'performance':
                console.log('Opening performance report...');
                // window.open('/performance-report', '_blank');
                break;
        }
    }
    
    // Enhanced hover effects for KPI items
    const kpiItems = document.querySelectorAll('.kpi-item');
    kpiItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Performance value color coding
    const perfValues = document.querySelectorAll('.perf-value');
    perfValues.forEach(value => {
        const text = value.textContent.trim();
        if (text.startsWith('+')) {
            value.classList.add('positive');
        } else if (text.startsWith('-')) {
            value.classList.add('negative');
        }
    });
    
    // Initialize scroll checking
    checkUpdatesVisibility();
    window.addEventListener('scroll', checkUpdatesVisibility);
    
    // Add CSS animation for growing bars
    const style = document.createElement('style');
    style.textContent = `
        @keyframes growUp {
            from {
                transform: scaleY(0);
                opacity: 0.5;
            }
            to {
                transform: scaleY(1);
                opacity: 1;
            }
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .spark-bar, .chart-bar {
            transform: scaleY(0);
            transform-origin: bottom;
        }
    `;
    document.head.appendChild(style);
    
    // Real-time data simulation (optional)
    function simulateRealTimeData() {
        const slotHeight = document.querySelector('.validator-card .kpi-value');
        if (slotHeight) {
            const currentValue = parseInt(slotHeight.textContent.replace(/,/g, ''));
            const newValue = currentValue + Math.floor(Math.random() * 100);
            slotHeight.textContent = newValue.toLocaleString();
        }
    }
    
    // Update data every 30 seconds (optional)
    // setInterval(simulateRealTimeData, 30000);
}

// Contact section functionality
function initializeContactSection() {
    const form = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.form-submit');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const topicSelect = document.getElementById('contact-topic');
    const messageTextarea = document.getElementById('contact-message');
    
    let lastSubmission = 0;
    const RATE_LIMIT_MS = 30000; // 30 seconds
    
    // Store UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {
        source: urlParams.get('utm_source'),
        medium: urlParams.get('utm_medium'),
        campaign: urlParams.get('utm_campaign'),
        term: urlParams.get('utm_term'),
        content: urlParams.get('utm_content')
    };
    
    // Fade in form on scroll
    function checkContactVisibility() {
        const form = document.querySelector('.contact-form');
        if (form && !form.classList.contains('fade-in')) {
            const formTop = form.getBoundingClientRect().top;
            if (formTop < window.innerHeight - 100) {
                form.classList.add('fade-in');
            }
        }
    }
    
    // Character counter for message
    function updateCharCount() {
        const length = messageTextarea.value.length;
        charCount.textContent = length;
        
        const counter = charCount.parentElement;
        counter.classList.remove('warning', 'error');
        
        if (length < 200) {
            counter.classList.add('error');
        } else if (length > 1400) {
            counter.classList.add('warning');
        }
    }
    
    // File upload handler
    function handleFileUpload() {
        const file = fileInput.files[0];
        const maxSize = parseInt(fileInput.dataset.maxSize);
        
        if (file) {
            if (file.size > maxSize) {
                showError('attachmentError', 'File size must be ≤10MB');
                fileInput.value = '';
                fileName.textContent = '';
                return false;
            }
            
            const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                showError('attachmentError', 'Only PDF, PNG, and JPG files are allowed');
                fileInput.value = '';
                fileName.textContent = '';
                return false;
            }
            
            fileName.textContent = file.name;
            clearError('attachmentError');
            return true;
        }
        
        fileName.textContent = '';
        clearError('attachmentError');
        return true;
    }
    
    // Validation functions
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    function validateURL(url) {
        if (!url) return true; // Optional field
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    function validateField(fieldId, value, validationRules) {
        const errorId = fieldId + 'Error';
        
        if (validationRules.required && !value.trim()) {
            showError(errorId, 'This field is required');
            return false;
        }
        
        if (validationRules.email && value && !validateEmail(value)) {
            showError(errorId, 'Please enter a valid email address');
            return false;
        }
        
        if (validationRules.url && value && !validateURL(value)) {
            showError(errorId, 'Please enter a valid URL');
            return false;
        }
        
        if (validationRules.minLength && value.length < validationRules.minLength) {
            showError(errorId, `Minimum ${validationRules.minLength} characters required`);
            return false;
        }
        
        if (validationRules.maxLength && value.length > validationRules.maxLength) {
            showError(errorId, `Maximum ${validationRules.maxLength} characters allowed`);
            return false;
        }
        
        if (validationRules.antiBot && value !== '10') {
            showError(errorId, 'Incorrect answer. Please try again.');
            return false;
        }
        
        clearError(errorId);
        return true;
    }
    
    function showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        const inputElement = document.querySelector(`[name="${errorId.replace('Error', '')}"], #${errorId.replace('Error', '')}`);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        if (inputElement) {
            inputElement.classList.add('error');
        }
    }
    
    function clearError(errorId) {
        const errorElement = document.getElementById(errorId);
        const inputElement = document.querySelector(`[name="${errorId.replace('Error', '')}"], #${errorId.replace('Error', '')}`);
        
        if (errorElement) {
            errorElement.classList.remove('show');
            setTimeout(() => {
                errorElement.textContent = '';
            }, 300);
        }
        
        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }
    
    function validateForm() {
        const formData = new FormData(form);
        let isValid = true;
        
        // Define validation rules
        const validations = {
            name: { required: true },
            email: { required: true, email: true },
            affiliation: { required: true },
            role: { required: true },
            topic: { required: true },
            linkedin: { url: true },
            github: { url: true },
            message: { required: true, minLength: 200, maxLength: 1500 },
            consent: { required: true },
            antiBot: { required: true, antiBot: true }
        };
        
        // Validate each field
        Object.entries(validations).forEach(([field, rules]) => {
            const value = field === 'consent' ? 
                document.getElementById('consent').checked : 
                formData.get(field) || '';
            
            if (!validateField(field, value, rules)) {
                isValid = false;
            }
        });
        
        // Validate file upload
        if (!handleFileUpload()) {
            isValid = false;
        }
        
        return isValid;
    }
    
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 
            '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
            '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
        
        toast.innerHTML = `
            <div class="toast-content">
                ${icon}
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 400);
        }, 5000);
    }
    
    async function submitForm(formData) {
        try {
            // Add metadata
            const submissionData = {
                ...Object.fromEntries(formData),
                timestamp: new Date().toISOString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                timezoneOffset: new Date().getTimezoneOffset(),
                utm: utmParams,
                links: {
                    linkedin: formData.get('linkedin') || null,
                    github: formData.get('github') || null
                }
            };
            
            // Remove individual link fields since they're in links object
            delete submissionData.linkedin;
            delete submissionData.github;
            
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });
            
            if (response.ok) {
                showToast("Thanks! We'll reply within 3 business days.", 'success');
                form.reset();
                updateCharCount();
                fileName.textContent = '';
                updateSubmitButton(false);
                lastSubmission = Date.now();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showToast('Something went wrong. Please try again or email us directly.', 'error');
        }
    }
    
    function updateSubmitButton(isValid) {
        const now = Date.now();
        const rateLimited = (now - lastSubmission) < RATE_LIMIT_MS;
        
        submitBtn.disabled = !isValid || rateLimited;
        
        if (rateLimited) {
            const remaining = Math.ceil((RATE_LIMIT_MS - (now - lastSubmission)) / 1000);
            submitBtn.querySelector('.btn-text').textContent = `Wait ${remaining}s`;
            setTimeout(() => updateSubmitButton(validateForm()), 1000);
        } else {
            submitBtn.querySelector('.btn-text').textContent = 'Send Message';
        }
    }
    
    // Event listeners
    messageTextarea.addEventListener('input', updateCharCount);
    fileInput.addEventListener('change', handleFileUpload);
    
    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => {
            if (field.value || field.required) {
                const validations = {
                    name: { required: true },
                    email: { required: true, email: true },
                    affiliation: { required: true },
                    role: { required: true },
                    topic: { required: true },
                    linkedin: { url: true },
                    github: { url: true },
                    message: { required: true, minLength: 200, maxLength: 1500 },
                    antiBot: { required: true, antiBot: true }
                };
                
                if (validations[field.name]) {
                    validateField(field.name, field.value, validations[field.name]);
                }
            }
            updateSubmitButton(validateForm());
        });
        
        field.addEventListener('input', () => {
            clearError(field.name);
            updateSubmitButton(validateForm());
        });
    });
    
    // Consent checkbox
    document.getElementById('consent').addEventListener('change', () => {
        updateSubmitButton(validateForm());
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        const formData = new FormData(form);
        await submitForm(formData);
        
        // Remove loading state
        submitBtn.classList.remove('loading');
    });
    
    // Email button
    emailBtn.addEventListener('click', () => {
        window.location.href = 'mailto:blockchain@emory.edu?subject=Collaboration Inquiry';
    });
    
    // Initialize
    updateCharCount();
    checkContactVisibility();
    window.addEventListener('scroll', checkContactVisibility);
    updateSubmitButton(false);
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
                    source: 'home-footer',
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

// Animated blockchain network background
function initializeBlockchainAnimation() {
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
                    source: 'footer',
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
        // Reuse the existing toast system from contact form
        const toastContainer = document.getElementById('toastContainer') || createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 
            '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
            '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
        
        toast.innerHTML = `
            <div class="toast-content">
                ${icon}
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 400);
        }, 4000);
    }
    
    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }
}
