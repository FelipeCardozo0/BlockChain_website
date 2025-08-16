// Finances Page JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeCharts();
    initializeInteractivity();
    initializeScrollAnimations();
    updateCurrentYear();
});

// Navigation Functions
function initializeNavigation() {
    const menuButton = document.getElementById('menuButton');
    const overlayClose = document.getElementById('overlayClose');
    const menuOverlay = document.getElementById('menuOverlay');
    const homeNavbar = document.getElementById('homeNavbar');
    const financesNavbar = document.getElementById('financesNavbar');
    
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
        
        if (homeNavbar && financesNavbar) {
            if (currentScrollY > scrollThreshold) {
                // Hide home navbar, show finances navbar
                homeNavbar.classList.add('hidden');
                financesNavbar.classList.add('visible');
            } else {
                // Show home navbar, hide finances navbar
                homeNavbar.classList.remove('hidden');
                financesNavbar.classList.remove('visible');
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Smooth scrolling for finances navbar links
    const financesNavLinks = document.querySelectorAll('.finances-navbar .finances-nav-link[data-section]');
    financesNavLinks.forEach(link => {
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
    const navLinks = document.querySelectorAll('.finances-navbar .finances-nav-link[data-section]');
    
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

// Initialize animations and background
function initializeAnimations() {
    // Create animated blockchain background
    createBlockchainBackground();
    createFooterBlockchainBackground();
    
    // Animate floating icons
    animateFloatingIcons();
    
    // Animate progress bars
    animateProgressBars();
}

// Create blockchain background animation
function createBlockchainBackground() {
    const canvas = document.getElementById('blockchainCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const nodes = [];
    const nodeCount = 50;
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw nodes
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
            
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(92, 194, 255, ${node.opacity})`;
            ctx.fill();
        });
        
        // Draw connections
        nodes.forEach((nodeA, i) => {
            nodes.slice(i + 1).forEach(nodeB => {
                const distance = Math.sqrt(
                    Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
                );
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(nodeA.x, nodeA.y);
                    ctx.lineTo(nodeB.x, nodeB.y);
                    ctx.strokeStyle = `rgba(92, 194, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Create flowing digital ledger background
function createFooterBlockchainBackground() {
    const canvas = document.getElementById('tesseractCanvas');
    if (!canvas) return;
    
    // Check for reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Generate fake transaction data
    function generateTransactionHash() {
        const chars = '0123456789abcdef';
        return '0x' + Array.from({length: 64}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }
    
    function generateWalletAddress() {
        const chars = '0123456789abcdef';
        return '0x' + Array.from({length: 40}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }
    
    function generateAmount() {
        const amounts = ['0.0247', '1.847', '0.156', '2.394', '0.089', '5.672', '0.342', '1.234', '0.567', '3.456'];
        return amounts[Math.floor(Math.random() * amounts.length)];
    }
    
    function generateTimestamp() {
        const now = new Date();
        const randomMinutes = Math.floor(Math.random() * 60);
        const time = new Date(now.getTime() - randomMinutes * 60000);
        return time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    
    // Create ledger rows
    const ledgerRows = [];
    const rowCount = 8;
    const rowHeight = canvas.height / rowCount;
    
    for (let i = 0; i < rowCount; i++) {
        const transactions = [];
        const transactionCount = Math.floor(Math.random() * 15) + 10; // 10-25 transactions per row
        
        for (let j = 0; j < transactionCount; j++) {
            const isLargeTransaction = Math.random() < 0.1; // 10% chance of large transaction
            transactions.push({
                hash: generateTransactionHash(),
                from: generateWalletAddress(),
                to: generateWalletAddress(),
                amount: generateAmount(),
                timestamp: generateTimestamp(),
                isLarge: isLargeTransaction,
                x: Math.random() * canvas.width * 2, // Spread across wider area
                y: i * rowHeight + rowHeight / 2,
                speed: (Math.random() * 0.5 + 0.5) * (isLargeTransaction ? 1.5 : 1), // Large transactions move faster
                opacity: Math.random() * 0.4 + 0.1,
                highlight: 0
            });
        }
        
        ledgerRows.push({
            transactions: transactions,
            direction: i % 2 === 0 ? 1 : -1, // Alternate direction
            y: i * rowHeight + rowHeight / 2
        });
    }
    
    // Removed metric icons (Bitcoin logos and other objects) to keep only the transaction animation
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw ledger rows
        ledgerRows.forEach((row, rowIndex) => {
            row.transactions.forEach(transaction => {
                // Update position
                transaction.x += transaction.speed * row.direction;
                
                // Reset position when off screen
                if (row.direction > 0 && transaction.x > canvas.width + 200) {
                    transaction.x = -200;
                } else if (row.direction < 0 && transaction.x < -200) {
                    transaction.x = canvas.width + 200;
                }
                
                // Random highlight flash for large transactions
                if (transaction.isLarge && Math.random() < 0.001) {
                    transaction.highlight = 1;
                }
                
                // Fade highlight
                if (transaction.highlight > 0) {
                    transaction.highlight -= 0.02;
                }
                
                // Draw transaction with gradient color effect
                const alpha = transaction.opacity + (transaction.highlight * 0.5);
                
                // Create gradient effect similar to social icons hover and matrix animation
                const gradient = ctx.createLinearGradient(transaction.x, transaction.y - 5, transaction.x + 200, transaction.y + 5);
                gradient.addColorStop(0, `rgba(92, 194, 255, ${alpha})`); // #5cc2ff (light blue)
                gradient.addColorStop(0.7, `rgba(92, 194, 255, ${alpha})`); // More light blue
                gradient.addColorStop(1, `rgba(247, 201, 72, ${alpha})`); // #f7c948 (yellow)
                
                ctx.fillStyle = gradient;
                ctx.font = '10px "Courier New", monospace';
                ctx.textAlign = 'left';
                
                const text = `${transaction.hash.slice(0, 8)}...${transaction.hash.slice(-6)} | ${transaction.from.slice(0, 6)}...${transaction.from.slice(-4)} → ${transaction.to.slice(0, 6)}...${transaction.to.slice(-4)} | ${transaction.amount} ETH | ${transaction.timestamp}`;
                
                // Add glow effect for highlighted transactions
                if (transaction.highlight > 0) {
                    ctx.shadowColor = 'rgba(92, 194, 255, 0.8)';
                    ctx.shadowBlur = 10;
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.fillText(text, transaction.x, transaction.y);
                
                // Reset shadow
                ctx.shadowBlur = 0;
            });
        });
        
        // Metric icons removed - keeping only transaction animation
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Animate floating icons
function animateFloatingIcons() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        const delay = parseFloat(icon.dataset.delay) || 0;
        icon.style.animationDelay = `${delay}s`;
        
        // Add random movement
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            icon.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000 + Math.random() * 2000);
    });
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target;
                const width = progressFill.style.width;
                progressFill.style.width = '0%';
                
                setTimeout(() => {
                    progressFill.style.width = width;
                }, 500);
                
                observer.unobserve(progressFill);
            }
        });
    });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Initialize charts
function initializeCharts() {
    initializePieChart();
    initializeAllocationChart();
    initializePerformanceChart();
    initializeValidatorChart();
    initializeMiningCharts();
}

// Initialize pie chart
function initializePieChart() {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Partners', 'Solana Validator', 'Emory Funds', 'Event Revenue', 'Donations'],
            datasets: [{
                data: [50.2, 21.9, 17.7, 7.3, 2.9],
                backgroundColor: [
                    '#5cc2ff',
                    '#3b82f6',
                    '#f7c948',
                    '#22c55e',
                    '#a855f7'
                ],
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#cfd6e4',
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 2000
            }
        }
    });
}

// Initialize allocation chart
function initializeAllocationChart() {
    const ctx = document.getElementById('allocationChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Stablecoins', 'ETH', 'SOL', 'BTC', 'Other'],
            datasets: [{
                data: [44.9, 25.9, 18.5, 10.4, 0.3],
                backgroundColor: [
                    '#22c55e',
                    '#627eea',
                    '#9945ff',
                    '#f7931a',
                    '#6b7280'
                ],
                borderWidth: 0,
                cutout: '50%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#cfd6e4',
                        padding: 15,
                        usePointStyle: true,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1500
            }
        }
    });
}

// Initialize performance chart
function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [680000, 695000, 720000, 742000, 758000, 781000, 795000, 812000, 825000, 834000, 841000, 847329];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Portfolio Value ($)',
                data: data,
                borderColor: '#5cc2ff',
                backgroundColor: 'rgba(92, 194, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#5cc2ff',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: '#cfd6e4'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: '#cfd6e4',
                        callback: function(value) {
                            return '$' + (value / 1000) + 'K';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#cfd6e4'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Initialize validator chart
function initializeValidatorChart() {
    const ctx = document.getElementById('validatorChart');
    if (!ctx) return;
    
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
    const rewards = [11200, 11850, 12100, 12450, 11900, 12650];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Weekly Rewards ($)',
                data: rewards,
                backgroundColor: 'rgba(168, 85, 247, 0.8)',
                borderColor: '#a855f7',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: '#cfd6e4'
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: '#cfd6e4',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#cfd6e4'
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutBounce'
            }
        }
    });
}

// Initialize interactivity
function initializeInteractivity() {
    initializeMenuToggle();
    initializeTableFilters();
    initializeTimeframToggle();
    initializeNewsletterForms();
    initializeDownloadButtons();
}

// Initialize menu toggle
function initializeMenuToggle() {
    const menuButton = document.getElementById('menuButton');
    const menuOverlay = document.getElementById('menuOverlay');
    const overlayClose = document.getElementById('overlayClose');
    const overlayBackground = document.querySelector('.overlay-background');
    
    if (menuButton && menuOverlay) {
        menuButton.addEventListener('click', () => {
            menuOverlay.classList.add('active');
            menuButton.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    function closeMenu() {
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
            if (menuButton) menuButton.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (overlayClose) {
        overlayClose.addEventListener('click', closeMenu);
    }
    
    if (overlayBackground) {
        overlayBackground.addEventListener('click', closeMenu);
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Initialize table filters
function initializeTableFilters() {
    const filterButtons = document.querySelectorAll('.control-btn');
    const tableRows = document.querySelectorAll('#assetsTableBody tr');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            tableRows.forEach(row => {
                if (filter === 'all' || row.dataset.type === filter) {
                    row.style.display = '';
                    row.style.animation = 'fadeIn 0.3s ease-in-out';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
}

// Initialize timeframe toggle
function initializeTimeframToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const period = button.dataset.period;
            updatePerformanceMetrics(period);
        });
    });
}

// Update performance metrics based on timeframe
function updatePerformanceMetrics(period) {
    const metrics = {
        '7d': {
            return: '+3.2%',
            pnl: '+$847',
            sharpe: '2.1',
            winRate: '71.4%',
            drawdown: '-2.1%',
            volatility: '8.7%'
        },
        '30d': {
            return: '+12.8%',
            pnl: '+$8,420',
            sharpe: '1.9',
            winRate: '68.9%',
            drawdown: '-5.4%',
            volatility: '12.3%'
        },
        'ytd': {
            return: '+24.7%',
            pnl: '+$167,329',
            sharpe: '1.85',
            winRate: '67.3%',
            drawdown: '-8.2%',
            volatility: '15.4%'
        }
    };
    
    const kpiItems = document.querySelectorAll('.kpi-item');
    const data = metrics[period];
    
    if (data && kpiItems.length >= 6) {
        const values = [data.return, data.pnl, data.sharpe, data.winRate, data.drawdown, data.volatility];
        
        kpiItems.forEach((item, index) => {
            const valueElement = item.querySelector('.kpi-value');
            if (valueElement && values[index]) {
                valueElement.textContent = values[index];
                
                // Add animation
                valueElement.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    valueElement.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }
}

// Initialize newsletter forms
function initializeNewsletterForms() {
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

// Initialize download buttons
function initializeDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 2000);
            }, 1500);
        });
    });
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add fade-in class to elements
    const elementsToAnimate = document.querySelectorAll('.glass-card, .section-title');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Update current year
function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Counter animation for numbers
function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        
        if (element.textContent.includes('$')) {
            element.textContent = '$' + Math.floor(current).toLocaleString();
        } else if (element.textContent.includes('%')) {
            element.textContent = current.toFixed(1) + '%';
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Initialize counter animations when elements come into view
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.usd-value, .stat-value, .kpi-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                const number = parseFloat(text.replace(/[^0-9.-]/g, ''));
                
                if (!isNaN(number) && number > 0) {
                    animateCounter(element, 0, number, 2000);
                }
                
                observer.unobserve(element);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeCounterAnimations();
    }, 500);
});

// Smooth scrolling for anchor links
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

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate chart sizes if needed
    Chart.helpers.each(Chart.instances, (instance) => {
        instance.resize();
    });
});

// Performance optimization - lazy load charts
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const chartId = entry.target.id;
            
            // Initialize chart based on ID
            switch(chartId) {
                case 'pieChart':
                    setTimeout(() => initializePieChart(), 300);
                    break;
                case 'allocationChart':
                    setTimeout(() => initializeAllocationChart(), 600);
                    break;
                case 'performanceChart':
                    setTimeout(() => initializePerformanceChart(), 900);
                    break;
                case 'validatorChart':
                    setTimeout(() => initializeValidatorChart(), 1200);
                    break;
            }
            
            chartObserver.unobserve(entry.target);
        }
    });
});

// Observe chart canvases for lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const chartCanvases = document.querySelectorAll('canvas');
    chartCanvases.forEach(canvas => {
        if (canvas.id && canvas.id.includes('Chart')) {
            chartObserver.observe(canvas);
        }
    });
});

// Initialize mining charts
function initializeMiningCharts() {
    createHashrateChart();
    createRevenueCostChart();
    initializeMiningInteractivity();
}

// Create hashrate chart
function createHashrateChart() {
    const ctx = document.getElementById('hashrateChart');
    if (!ctx) return;
    
    // Generate sample data for the last 7 days
    const labels = [];
    const hashrateData = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Generate realistic hashrate data with some variation
        const baseHashrate = 847;
        const variation = (Math.random() - 0.5) * 50;
        hashrateData.push(baseHashrate + variation);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Hashrate (PH/s)',
                data: hashrateData,
                borderColor: '#5cc2ff',
                backgroundColor: 'rgba(92, 194, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#5cc2ff',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return value + ' PH/s';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Create revenue vs cost chart
function createRevenueCostChart() {
    const ctx = document.getElementById('revenueCostChart');
    if (!ctx) return;
    
    // Generate sample data for the last 30 days
    const labels = [];
    const revenueData = [];
    const costData = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Generate realistic revenue and cost data
        const baseRevenue = 859;
        const baseCost = 3122;
        const revenueVariation = (Math.random() - 0.5) * 100;
        const costVariation = (Math.random() - 0.5) * 50;
        
        revenueData.push(baseRevenue + revenueVariation);
        costData.push(baseCost + costVariation);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Daily Revenue (USD)',
                    data: revenueData,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#22c55e',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Daily Costs (USD)',
                    data: costData,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#cfd6e4',
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        maxTicksLimit: 10
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Initialize mining interactivity
function initializeMiningInteractivity() {
    // Hardware table filtering
    const filterButtons = document.querySelectorAll('.hardware-inventory-card .control-btn');
    const hardwareRows = document.querySelectorAll('#hardwareTableBody tr');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter rows
            hardwareRows.forEach(row => {
                const status = row.getAttribute('data-status');
                if (filter === 'all' || status === filter) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
    
    // Copy button functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const textToCopy = button.getAttribute('data-clipboard');
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show success feedback
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.background = 'rgba(34, 197, 94, 0.3)';
                button.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                button.style.color = '#22c55e';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = 'rgba(92, 194, 255, 0.2)';
                    button.style.borderColor = 'rgba(92, 194, 255, 0.3)';
                    button.style.color = '#5cc2ff';
                }, 2000);
            });
        });
    });
    
    // Chart timeframe toggles
    const timeframeButtons = document.querySelectorAll('.performance-charts-card .toggle-btn');
    timeframeButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeframeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Here you would typically update the chart data
            // For now, we'll just show a visual feedback
            const period = button.getAttribute('data-period');
            console.log('Switched to period:', period);
        });
    });
    
    // Unit toggles
    const unitButtons = document.querySelectorAll('.unit-btn');
    unitButtons.forEach(button => {
        button.addEventListener('click', () => {
            unitButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const unit = button.getAttribute('data-unit');
            console.log('Switched to unit:', unit);
        });
    });
    
    // Export button functionality
    const exportButton = document.querySelector('.export-btn');
    if (exportButton) {
        exportButton.addEventListener('click', () => {
            // Generate CSV data
            const table = document.querySelector('.hardware-table');
            const rows = Array.from(table.querySelectorAll('tr'));
            
            let csvContent = 'data:text/csv;charset=utf-8,';
            
            rows.forEach(row => {
                const cells = Array.from(row.querySelectorAll('th, td'));
                const rowData = cells.map(cell => {
                    // Remove HTML tags and get text content
                    const text = cell.textContent.replace(/"/g, '""');
                    return `"${text}"`;
                });
                csvContent += rowData.join(',') + '\r\n';
            });
            
            // Create download link
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'mining_hardware_inventory.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
}
