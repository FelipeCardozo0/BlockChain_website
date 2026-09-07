// Home page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page loaded successfully!');
    
    // Initialize all functionality
    initializeNavigation();
    initializeFooter();
    initializeFooterCanvas();
    initializeScrollAnimations();
    initializeIndustryEventsSection();
    initializeContactSection();
    initializeInterestFormPopup();
});

// Scroll-triggered animations
function initializeScrollAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // If user prefers reduced motion, show all elements immediately
    if (prefersReducedMotion) {
        const allAnimatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-fade, .scroll-animate-rotate, .stagger-1, .stagger-2, .stagger-3, .stagger-4, .stagger-5, .stagger-6, .stagger-7, .stagger-8');
        allAnimatedElements.forEach(el => {
            el.classList.add('animate-in');
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('animate-in');
                
                // Add stagger effect for child elements
                const staggerChildren = element.querySelectorAll('.stagger-1, .stagger-2, .stagger-3, .stagger-4, .stagger-5, .stagger-6, .stagger-7, .stagger-8');
                staggerChildren.forEach(child => {
                    child.classList.add('animate-in');
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with scroll animation classes
    const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-fade, .scroll-animate-rotate');
    animatedElements.forEach(el => observer.observe(el));
    
    // Also observe individual stagger elements
    const staggerElements = document.querySelectorAll('.stagger-1, .stagger-2, .stagger-3, .stagger-4, .stagger-5, .stagger-6, .stagger-7, .stagger-8');
    staggerElements.forEach(el => observer.observe(el));
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('homeNavbar');
    
    if (navbar) {
        // Add hover effects to navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
}

// Footer functionality
function initializeFooter() {
    // Update current year
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Newsletter form functionality
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
    
    // Social media link hover effects
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
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

// Add some utility functions
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

// Handle window resize
window.addEventListener('resize', debounce(() => {
    console.log('Window resized');
    // Add any resize-specific logic here
}, 250));

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});



// Initialize footer canvas animation
function initializeFooterCanvas() {
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

// Industry Events section functionality
function initializeIndustryEventsSection() {
    const sliderTrack = document.getElementById('industrySliderTrack');
    const prevBtn = document.getElementById('industryPrevBtn');
    const nextBtn = document.getElementById('industryNextBtn');
    const dotsContainer = document.getElementById('industrySliderDots');
    
    if (!sliderTrack || !prevBtn || !nextBtn || !dotsContainer) {
        console.log('Industry slider elements not found');
        return;
    }
    
    const slides = sliderTrack.querySelectorAll('.slider-slide');
    let currentSlide = 0;
    let autoSlideTimer = null;
    let userInteractionTimer = null;
    
    // Initialize dots
    function initializeDots() {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // Update dots
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0 || index >= slides.length) return;
        
        currentSlide = index;
        const translateX = -currentSlide * 100;
        sliderTrack.style.transform = `translateX(${translateX}%)`;
        updateDots();
        resetUserInteractionTimer();
    }
    
    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    }
    
    // Auto slide
    function startAutoSlide() {
        autoSlideTimer = setInterval(() => {
            nextSlide();
        }, 5000); // 5 seconds
    }
    
    // Stop auto slide
    function stopAutoSlide() {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
            autoSlideTimer = null;
        }
    }
    
    // Reset user interaction timer
    function resetUserInteractionTimer() {
        clearTimeout(userInteractionTimer);
        userInteractionTimer = setTimeout(() => {
            startAutoSlide();
        }, 10000); // 10 seconds of no interaction
    }
    
    // Event listeners
    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        resetUserInteractionTimer();
    });
    
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        resetUserInteractionTimer();
    });
    
    // Enhanced touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isSwiping = false;
    
    sliderTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = false;
        stopAutoSlide();
        
        // Prevent default to avoid scrolling while swiping
        e.preventDefault();
    }, { passive: false });
    
    sliderTrack.addEventListener('touchmove', (e) => {
        if (!isSwiping) {
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            // Start swiping if horizontal movement is greater than vertical
            if (diffX > diffY && diffX > 10) {
                isSwiping = true;
                e.preventDefault();
            }
        } else {
            e.preventDefault();
        }
    }, { passive: false });
    
    sliderTrack.addEventListener('touchend', (e) => {
        if (isSwiping) {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = Math.abs(startY - endY);
            
            // Only trigger slide change if horizontal movement is significant and vertical movement is minimal
            if (Math.abs(diffX) > 30 && diffY < 100) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
        
        isSwiping = false;
        resetUserInteractionTimer();
    });
    
    // Add visual feedback for touch interactions
    sliderTrack.addEventListener('touchstart', () => {
        sliderTrack.style.transition = 'transform 0.1s ease';
    });
    
    sliderTrack.addEventListener('touchend', () => {
        sliderTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopAutoSlide();
            prevSlide();
            resetUserInteractionTimer();
        } else if (e.key === 'ArrowRight') {
            stopAutoSlide();
            nextSlide();
            resetUserInteractionTimer();
        }
    });
    
    // Hover pause
    sliderTrack.addEventListener('mouseenter', () => {
        stopAutoSlide();
    });
    
    sliderTrack.addEventListener('mouseleave', () => {
        resetUserInteractionTimer();
    });
    
    // Initialize
    initializeDots();
    resetUserInteractionTimer();
    
    // Add Learn More button functionality for industry events
    const industryLearnMoreBtn = document.querySelector('.industry-events-section .learn-more-btn');
    if (industryLearnMoreBtn) {
        industryLearnMoreBtn.addEventListener('click', function() {
            console.log('Industry Learn More clicked - redirect to event details');
            resetUserInteractionTimer();
        });
    }
}

// Contact section functionality
function initializeContactSection() {
    const form = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.form-submit');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageTextarea = document.getElementById('contact-message');
    
    // Debug logging
    console.log('Contact form elements found:', {
        form: !!form,
        submitBtn: !!submitBtn,
        firstNameInput: !!firstNameInput,
        lastNameInput: !!lastNameInput,
        emailInput: !!emailInput,
        subjectInput: !!subjectInput,
        messageTextarea: !!messageTextarea
    });
    
    if (!form || !submitBtn) {
        console.log('Contact form not found');
        return;
    }
    
    let lastSubmission = 0;
    const RATE_LIMIT_MS = 30000; // 30 seconds
    
    // Fade in form on scroll
    function checkContactVisibility() {
        if (form && !form.classList.contains('fade-in')) {
            const formTop = form.getBoundingClientRect().top;
            if (formTop < window.innerHeight - 100) {
                form.classList.add('fade-in');
            }
        }
    }
    
    // Validation functions
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
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
        
        if (validationRules.minLength && value.length < validationRules.minLength) {
            showError(errorId, `Minimum ${validationRules.minLength} characters required`);
            return false;
        }
        
        clearError(errorId);
        return true;
    }
    
    function validateForm() {
        const formData = new FormData(form);
        let isValid = true;
        
        // Define validation rules for contact form fields
        const validations = {
            firstName: { required: true },
            lastName: { required: true },
            email: { required: true, email: true },
            subject: { required: true },
            message: { required: true }
        };
        
        // Validate each field
        Object.entries(validations).forEach(([field, rules]) => {
            const value = formData.get(field) || '';
            
            if (!validateField(field, value, rules)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            // Create toast container if it doesn't exist
            const container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.cssText = `
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            max-width: 300px;
        `;
        
        const icon = type === 'success' ? 
            '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
            '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
        
        toast.innerHTML = `
            ${icon}
            <span>${message}</span>
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }
    
    async function submitForm(formData) {
        try {
            // Submit to Formspree
            const response = await fetch('https://formspree.io/f/mrblwjpo', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showToast("Thanks! We'll reply within 3 business days.", 'success');
                form.reset();
                updateSubmitButton(false);
                lastSubmission = Date.now();
            } else {
                throw new Error('Form submission failed');
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
            submitBtn.querySelector('.submit-text').textContent = `Wait ${remaining}s`;
            setTimeout(() => updateSubmitButton(validateForm()), 1000);
        } else {
            submitBtn.querySelector('.submit-text').textContent = 'SUBMIT';
        }
    }
    
    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', () => {
            if (field.value || field.required) {
                const validations = {
                    firstName: { required: true },
                    lastName: { required: true },
                    email: { required: true, email: true },
                    subject: { required: true },
                    message: { required: true }
                };
                
                if (validations[field.name]) {
                    validateField(field.name, field.value, validations[field.name]);
                }
            }
            updateSubmitButton(validateForm());
        });
        
        field.addEventListener('input', () => {
            // Only clear errors on input, don't validate yet
            clearError(field.name + 'Error');
            // Only update submit button state, don't show validation errors while typing
            updateSubmitButton(validateForm());
        });
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
    
    // Copy email functionality
    function copyEmail() {
        const email = 'blockchainemory@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            const copyBtn = document.querySelector('.copy-email-btn');
            if (copyBtn) {
                copyBtn.classList.add('copied');
                copyBtn.querySelector('.copy-icon').style.display = 'none';
                copyBtn.querySelector('.check-icon').style.display = 'block';
                
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.querySelector('.copy-icon').style.display = 'block';
                    copyBtn.querySelector('.check-icon').style.display = 'none';
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy email:', err);
        });
    }
    
    // Make copyEmail function globally available
    window.copyEmail = copyEmail;
    
    // Initialize
    checkContactVisibility();
    window.addEventListener('scroll', checkContactVisibility);
    updateSubmitButton(false);
    
    // Fallback: ensure form is visible
    form.style.opacity = '1';
    form.style.transform = 'translateY(0)';
    form.style.visibility = 'visible';
}

// Handle scroll to email box when coming from finances page
function handleContactScroll() {
    // Check if URL has #contact hash
    if (window.location.hash === '#contact') {
        // First, scroll to top immediately to start from the top
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
        
        // Wait a moment for the page to settle, then scroll to email box
        setTimeout(() => {
            const emailInput = document.getElementById('contact-email');
            if (emailInput) {
                // Get the position of the email input
                const emailInputPosition = emailInput.getBoundingClientRect().top + window.pageYOffset;
                
                // Calculate offset to center the email input nicely in the viewport
                const offset = 150; // Offset from top of viewport
                const targetPosition = emailInputPosition - offset;
                
                // Smooth scroll to email input with animation
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Focus on the email input after scrolling completes
                setTimeout(() => {
                    emailInput.focus();
                }, 1000); // Wait for scroll animation to complete
            } else {
                // Fallback: scroll to contact section if email input not found
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }, 300); // Small delay to ensure page is ready and starts from top
    }
}

// Prevent default browser scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Small delay to override any default browser scrolling
        setTimeout(handleContactScroll, 100);
    });
} else {
    // Small delay to ensure DOM is fully ready
    setTimeout(handleContactScroll, 100);
}

// Also handle hash changes (in case user navigates with hash already in URL)
window.addEventListener('hashchange', () => {
    if (window.location.hash === '#contact') {
        handleContactScroll();
    }
});

// Interest Form Popup
function initializeInterestFormPopup() {
    const interestFormBtn = document.getElementById('interestFormBtn');
    const interestPopupModal = document.getElementById('interestPopupModal');
    const interestPopupClose = document.getElementById('interestPopupClose');
    const interestPopupOverlay = interestPopupModal?.querySelector('.interest-popup-overlay');

    if (!interestFormBtn || !interestPopupModal) return;

    // Open popup when Interest Form button is clicked
    interestFormBtn.addEventListener('click', function(e) {
        e.preventDefault();
        interestPopupModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Close popup when close button is clicked
    if (interestPopupClose) {
        interestPopupClose.addEventListener('click', function() {
            interestPopupModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    // Close popup when overlay is clicked
    if (interestPopupOverlay) {
        interestPopupOverlay.addEventListener('click', function() {
            interestPopupModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    // Close popup when Escape key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && interestPopupModal.style.display === 'flex') {
            interestPopupModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

console.log('Home page JavaScript initialized!');
