// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavbar();
    initFooter();
    initNewsletterForm();
    initToastSystem();
});

// Navigation Bar Functionality
function initNavbar() {
    const navbar = document.getElementById('homeNavbar');
    let lastScrollTop = 0;
    
    // Navbar scroll behavior
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide navbar
            navbar.classList.add('hidden');
        } else {
            // Scrolling up - show navbar
            navbar.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
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
}

// Footer Functionality
function initFooter() {
    // Update current year
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize footer canvas if needed
    initFooterCanvas();
}

// Blockchain-Style 3D Cube Animation
function initFooterCanvas() {
    const canvas = document.getElementById('footerCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 3D Cube Configuration
    const cubeSize = 5; // 5x5x5 grid
    const cubeSpacing = 25;
    const cubeSize3D = 20;
    let centerX, centerY;
    const centerZ = 0;
    
    // Set canvas size
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        // Update center coordinates after resize
        centerX = rect.width / 2;
        centerY = rect.height / 2;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create cube positions with blockchain properties
    const cubes = [];
    const emptyPositions = new Set([
        '0,0,0', '4,4,4', '2,2,2', '1,3,1', '3,1,3', '0,4,2', '4,0,2',
        '2,0,4', '2,4,0', '1,1,1', '3,3,3', '0,2,4', '4,2,0'
    ]);
    
    let blockCounter = 1;
    for (let x = 0; x < cubeSize; x++) {
        for (let y = 0; y < cubeSize; y++) {
            for (let z = 0; z < cubeSize; z++) {
                const key = `${x},${y},${z}`;
                if (!emptyPositions.has(key)) {
                    const isBlueCube = Math.random() > 0.8;
                    cubes.push({
                        id: blockCounter++,
                        x: (x - cubeSize / 2) * cubeSpacing,
                        y: (y - cubeSize / 2) * cubeSpacing,
                        z: (z - cubeSize / 2) * cubeSpacing,
                        originalX: (x - cubeSize / 2) * cubeSpacing,
                        originalY: (y - cubeSize / 2) * cubeSpacing,
                        originalZ: (z - cubeSize / 2) * cubeSpacing,
                        size: cubeSize3D,
                        color: isBlueCube ? '#5cc2ff' : '#4a5568',
                        opacity: 0.8,
                        isBlueCube: isBlueCube,
                        isHovered: false,
                        isClicked: false,
                        isMinting: false,
                        mintProgress: 0,
                        hoverProgress: 0,
                        clickProgress: 0,
                        label: isBlueCube ? `Validator #${blockCounter}` : `Block #${blockCounter}`,
                        connections: []
                    });
                }
            }
        }
    }
    
    // Create connections between adjacent cubes
    cubes.forEach(cube => {
        cubes.forEach(otherCube => {
            if (cube.id !== otherCube.id) {
                const distance = Math.sqrt(
                    Math.pow(cube.x - otherCube.x, 2) + 
                    Math.pow(cube.y - otherCube.y, 2) + 
                    Math.pow(cube.z - otherCube.z, 2)
                );
                if (distance <= cubeSpacing * 1.5) {
                    cube.connections.push(otherCube.id);
                }
            }
        });
    });
    
    // Animation state
    let rotationY = 0;
    let lastSwapTime = 0;
    let swapInterval = prefersReducedMotion ? 5000 : 2500; // 2.5 seconds, 5 if reduced motion
    let activeSwaps = [];
    let dataPackets = [];
    let mintingCubes = [];
    
    // Easing function for smooth animations
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    // 3D to 2D projection
    function project3DTo2D(x, y, z) {
        const scale = 200 / (200 + z);
        const projectedX = centerX + x * scale;
        const projectedY = centerY + y * scale;
        return { x: projectedX, y: projectedY, scale: scale };
    }
    
    // Rotate point around origin
    function rotatePoint(x, y, z, rx, ry, rz) {
        let newY = y * Math.cos(rx) - z * Math.sin(rx);
        let newZ = y * Math.sin(rx) + z * Math.cos(rx);
        
        let newX = x * Math.cos(ry) + newZ * Math.sin(ry);
        newZ = -x * Math.sin(ry) + newZ * Math.cos(ry);
        
        let finalX = newX * Math.cos(rz) - newY * Math.sin(rz);
        let finalY = newX * Math.sin(rz) + newY * Math.cos(rz);
        
        return { x: finalX, y: finalY, z: newZ };
    }
    
    // Draw data packet
    function drawDataPacket(packet) {
        const startCube = cubes.find(c => c.id === packet.startCubeId);
        const endCube = cubes.find(c => c.id === packet.endCubeId);
        
        if (!startCube || !endCube) return;
        
        const startRotated = rotatePoint(startCube.x, startCube.y, startCube.z, 0, rotationY, 0);
        const endRotated = rotatePoint(endCube.x, endCube.y, endCube.z, 0, rotationY, 0);
        const startProjected = project3DTo2D(startRotated.x, startRotated.y, startRotated.z);
        const endProjected = project3DTo2D(endRotated.x, endRotated.y, endRotated.z);
        
        const currentX = startProjected.x + (endProjected.x - startProjected.x) * packet.progress;
        const currentY = startProjected.y + (endProjected.y - startProjected.y) * packet.progress;
        
        ctx.save();
        ctx.globalAlpha = 0.8 * (1 - packet.progress);
        
        // Glowing effect
        const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 8);
        gradient.addColorStop(0, '#5cc2ff');
        gradient.addColorStop(0.5, 'rgba(92, 194, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(92, 194, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // Draw connections between cubes
    function drawConnections() {
        ctx.save();
        ctx.strokeStyle = 'rgba(92, 194, 255, 0.2)';
        ctx.lineWidth = 1;
        
        cubes.forEach(cube => {
            const cubeRotated = rotatePoint(cube.x, cube.y, cube.z, 0, rotationY, 0);
            const cubeProjected = project3DTo2D(cubeRotated.x, cubeRotated.y, cubeRotated.z);
            
            cube.connections.forEach(connectionId => {
                const connectedCube = cubes.find(c => c.id === connectionId);
                if (connectedCube) {
                    const connectedRotated = rotatePoint(connectedCube.x, connectedCube.y, connectedCube.z, 0, rotationY, 0);
                    const connectedProjected = project3DTo2D(connectedRotated.x, connectedRotated.y, connectedRotated.z);
                    
                    ctx.beginPath();
                    ctx.moveTo(cubeProjected.x, cubeProjected.y);
                    ctx.lineTo(connectedProjected.x, connectedProjected.y);
                    ctx.stroke();
                }
            });
        });
        
        ctx.restore();
    }
    
    // Draw a single cube with blockchain effects
    function drawCube(cube) {
        const rotated = rotatePoint(cube.x, cube.y, cube.z, 0, rotationY, 0);
        const projected = project3DTo2D(rotated.x, rotated.y, rotated.z);
        
        if (projected.scale <= 0) return;
        
        const halfSize = cube.size * projected.scale / 2;
        const depth = cube.size * projected.scale * 0.4;
        
        // Apply hover and click effects
        const hoverOffset = cube.isHovered ? Math.sin(cube.hoverProgress * Math.PI) * 5 : 0;
        const clickScale = cube.isClicked ? 1 + Math.sin(cube.clickProgress * Math.PI) * 0.1 : 1;
        const mintGlow = cube.isMinting ? Math.sin(cube.mintProgress * Math.PI) * 0.3 : 0;
        
        ctx.save();
        ctx.globalAlpha = (cube.opacity + mintGlow) * projected.scale;
        
        // Enhanced color scheme
        const baseColor = cube.color;
        const lightColor = cube.color === '#5cc2ff' ? '#a5f3fc' : '#9ca3af';
        const darkColor = cube.color === '#5cc2ff' ? '#0369a1' : '#1f2937';
        const edgeColor = cube.color === '#5cc2ff' ? '#0ea5e9' : '#4b5563';
        
        // Apply transformations
        ctx.translate(projected.x, projected.y - hoverOffset);
        ctx.scale(clickScale, clickScale);
        
        // Front face with gradient
        const frontGradient = ctx.createLinearGradient(-halfSize, -halfSize, halfSize, halfSize);
        frontGradient.addColorStop(0, baseColor);
        frontGradient.addColorStop(0.3, lightColor);
        frontGradient.addColorStop(1, darkColor);
        
        ctx.fillStyle = frontGradient;
        ctx.fillRect(-halfSize, -halfSize, cube.size * projected.scale, cube.size * projected.scale);
        
        // Right face
        const rightGradient = ctx.createLinearGradient(halfSize, -halfSize, halfSize + depth, halfSize);
        rightGradient.addColorStop(0, lightColor);
        rightGradient.addColorStop(1, baseColor);
        ctx.fillStyle = rightGradient;
        ctx.beginPath();
        ctx.moveTo(halfSize, -halfSize);
        ctx.lineTo(halfSize + depth, -halfSize - depth * 0.3);
        ctx.lineTo(halfSize + depth, halfSize - depth * 0.3);
        ctx.lineTo(halfSize, halfSize);
        ctx.closePath();
        ctx.fill();
        
        // Top face
        const topGradient = ctx.createLinearGradient(-halfSize, -halfSize, halfSize, -halfSize - depth * 0.3);
        topGradient.addColorStop(0, lightColor);
        topGradient.addColorStop(1, baseColor);
        ctx.fillStyle = topGradient;
        ctx.beginPath();
        ctx.moveTo(-halfSize, -halfSize);
        ctx.lineTo(halfSize, -halfSize);
        ctx.lineTo(halfSize + depth, -halfSize - depth * 0.3);
        ctx.lineTo(-halfSize + depth, -halfSize - depth * 0.3);
        ctx.closePath();
        ctx.fill();
        
        // Left face
        const leftGradient = ctx.createLinearGradient(-halfSize, -halfSize, -halfSize + depth, halfSize);
        leftGradient.addColorStop(0, darkColor);
        leftGradient.addColorStop(1, baseColor);
        ctx.fillStyle = leftGradient;
        ctx.beginPath();
        ctx.moveTo(-halfSize, -halfSize);
        ctx.lineTo(-halfSize + depth, -halfSize - depth * 0.3);
        ctx.lineTo(-halfSize + depth, halfSize - depth * 0.3);
        ctx.lineTo(-halfSize, halfSize);
        ctx.closePath();
        ctx.fill();
        
        // Bottom face
        const bottomGradient = ctx.createLinearGradient(-halfSize, halfSize, halfSize, halfSize - depth * 0.3);
        bottomGradient.addColorStop(0, darkColor);
        bottomGradient.addColorStop(1, baseColor);
        ctx.fillStyle = bottomGradient;
        ctx.beginPath();
        ctx.moveTo(-halfSize, halfSize);
        ctx.lineTo(halfSize, halfSize);
        ctx.lineTo(halfSize + depth, halfSize - depth * 0.3);
        ctx.lineTo(-halfSize + depth, halfSize - depth * 0.3);
        ctx.closePath();
        ctx.fill();
        
        // Enhanced highlight effect
        const highlightGradient = ctx.createRadialGradient(
            -halfSize * 0.3, -halfSize * 0.3, 0,
            -halfSize * 0.3, -halfSize * 0.3, halfSize * 0.8
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = highlightGradient;
        ctx.fillRect(-halfSize, -halfSize, cube.size * projected.scale, cube.size * projected.scale);
        
        // Edge lines
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-halfSize, -halfSize, cube.size * projected.scale, cube.size * projected.scale);
        
        // 3D edges
        ctx.beginPath();
        ctx.moveTo(halfSize, -halfSize);
        ctx.lineTo(halfSize + depth, -halfSize - depth * 0.3);
        ctx.moveTo(halfSize, halfSize);
        ctx.lineTo(halfSize + depth, halfSize - depth * 0.3);
        ctx.moveTo(-halfSize, -halfSize);
        ctx.lineTo(-halfSize + depth, -halfSize - depth * 0.3);
        ctx.moveTo(-halfSize, halfSize);
        ctx.lineTo(-halfSize + depth, halfSize - depth * 0.3);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Handle cube swaps
    function updateSwaps() {
        const currentTime = Date.now();
        
        // Start new swaps
        if (currentTime - lastSwapTime > swapInterval && activeSwaps.length === 0) {
            const availableCubes = cubes.filter(cube => 
                !activeSwaps.some(swap => 
                    swap.cube1Id === cube.id || swap.cube2Id === cube.id
                )
            );
            
            if (availableCubes.length >= 2) {
                const cube1 = availableCubes[Math.floor(Math.random() * availableCubes.length)];
                const cube2 = availableCubes[Math.floor(Math.random() * availableCubes.length)];
                
                if (cube1.id !== cube2.id) {
                    activeSwaps.push({
                        cube1Id: cube1.id,
                        cube2Id: cube2.id,
                        startTime: currentTime,
                        duration: 1000, // 1 second swap
                        startX1: cube1.x, startY1: cube1.y, startZ1: cube1.z,
                        startX2: cube2.x, startY2: cube2.y, startZ2: cube2.z,
                        endX1: cube2.x, endY1: cube2.y, endZ1: cube2.z,
                        endX2: cube1.x, endY2: cube1.y, endZ2: cube1.z
                    });
                }
            }
            lastSwapTime = currentTime;
        }
        
        // Update active swaps
        activeSwaps = activeSwaps.filter(swap => {
            const elapsed = currentTime - swap.startTime;
            const progress = Math.min(elapsed / swap.duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            const cube1 = cubes.find(c => c.id === swap.cube1Id);
            const cube2 = cubes.find(c => c.id === swap.cube2Id);
            
            if (cube1 && cube2) {
                cube1.x = swap.startX1 + (swap.endX1 - swap.startX1) * easedProgress;
                cube1.y = swap.startY1 + (swap.endY1 - swap.startY1) * easedProgress;
                cube1.z = swap.startZ1 + (swap.endZ1 - swap.startZ1) * easedProgress;
                
                cube2.x = swap.startX2 + (swap.endX2 - swap.startX2) * easedProgress;
                cube2.y = swap.startY2 + (swap.endY2 - swap.startY2) * easedProgress;
                cube2.z = swap.startZ2 + (swap.endZ2 - swap.startZ2) * easedProgress;
            }
            
            return progress < 1;
        });
    }
    
    // Update data packets
    function updateDataPackets() {
        // Remove completed packets
        dataPackets = dataPackets.filter(packet => packet.progress < 1);
        
        // Add new packets
        if (dataPackets.length < 3 && Math.random() < 0.02) {
            const startCube = cubes[Math.floor(Math.random() * cubes.length)];
            const endCube = cubes[Math.floor(Math.random() * cubes.length)];
            
            if (startCube && endCube && startCube.id !== endCube.id) {
                dataPackets.push({
                    startCubeId: startCube.id,
                    endCubeId: endCube.id,
                    progress: 0,
                    speed: 0.005 + Math.random() * 0.01
                });
            }
        }
        
        // Update packet progress
        dataPackets.forEach(packet => {
            packet.progress += packet.speed;
        });
    }
    
    // Update minting effects
    function updateMinting() {
        // Start new mint events
        if (mintingCubes.length < 2 && Math.random() < 0.01) {
            const availableCubes = cubes.filter(cube => !cube.isMinting);
            if (availableCubes.length > 0) {
                const cube = availableCubes[Math.floor(Math.random() * availableCubes.length)];
                cube.isMinting = true;
                cube.mintProgress = 0;
                mintingCubes.push(cube.id);
            }
        }
        
        // Update minting progress
        mintingCubes = mintingCubes.filter(cubeId => {
            const cube = cubes.find(c => c.id === cubeId);
            if (cube) {
                cube.mintProgress += 0.02;
                if (cube.mintProgress >= 1) {
                    cube.isMinting = false;
                    return false;
                }
            }
            return true;
        });
    }
    
    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    let isHovering = false;
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isHovering = true;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isHovering = false;
        cubes.forEach(cube => {
            cube.isHovered = false;
            cube.hoverProgress = 0;
        });
    });
    
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Find clicked cube
        const sortedCubes = cubes.map(cube => {
            const rotated = rotatePoint(cube.x, cube.y, cube.z, 0, rotationY, 0);
            const projected = project3DTo2D(rotated.x, rotated.y, rotated.z);
            return { ...cube, projected };
        }).sort((a, b) => b.projected.scale - a.projected.scale);
        
        for (const cube of sortedCubes) {
            const halfSize = cube.size * cube.projected.scale / 2;
            if (Math.abs(clickX - cube.projected.x) < halfSize && 
                Math.abs(clickY - cube.projected.y) < halfSize) {
                cube.isClicked = true;
                cube.clickProgress = 0;
                
                // Show tooltip
                showTooltip(cube.label, clickX, clickY);
                break;
            }
        }
    });
    
    // Tooltip system
    function showTooltip(text, x, y) {
        const tooltip = document.createElement('div');
        tooltip.className = 'cube-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: fixed;
            left: ${x + 10}px;
            top: ${y - 30}px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            pointer-events: none;
            z-index: 10000;
            transform: translateY(-100%);
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 300);
        }, 2000);
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update rotation
        if (!prefersReducedMotion) {
            rotationY += 0.015;
        }
        
        // Update animations
        if (!prefersReducedMotion) {
            updateSwaps();
            updateDataPackets();
        }
        updateMinting();
        
        // Update hover effects
        if (isHovering) {
            const sortedCubes = cubes.map(cube => {
                const rotated = rotatePoint(cube.x, cube.y, cube.z, 0, rotationY, 0);
                const projected = project3DTo2D(rotated.x, rotated.y, rotated.z);
                return { ...cube, projected };
            }).sort((a, b) => b.projected.scale - a.projected.scale);
            
            let foundHover = false;
            for (const cube of sortedCubes) {
                const halfSize = cube.size * cube.projected.scale / 2;
                const isHovered = Math.abs(mouseX - cube.projected.x) < halfSize && 
                                Math.abs(mouseY - cube.projected.y) < halfSize;
                
                if (isHovered && !foundHover) {
                    cube.isHovered = true;
                    cube.hoverProgress = Math.min(cube.hoverProgress + 0.1, 1);
                    foundHover = true;
                } else {
                    cube.isHovered = false;
                    cube.hoverProgress = Math.max(cube.hoverProgress - 0.1, 0);
                }
            }
        }
        
        // Update click effects
        cubes.forEach(cube => {
            if (cube.isClicked) {
                cube.clickProgress = Math.min(cube.clickProgress + 0.1, 1);
                if (cube.clickProgress >= 1) {
                    cube.isClicked = false;
                }
            }
        });
        
        // Draw connections
        drawConnections();
        
        // Draw data packets
        dataPackets.forEach(drawDataPacket);
        
        // Sort and draw cubes
        const sortedCubes = cubes.map(cube => {
            const rotated = rotatePoint(cube.x, cube.y, cube.z, 0, rotationY, 0);
            return { ...cube, rotatedZ: rotated.z };
        }).sort((a, b) => b.rotatedZ - a.rotatedZ);
        
        sortedCubes.forEach(drawCube);
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Cleanup function
    return function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
}

// Newsletter Form Functionality
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('newsletterEmail');
        const submitBtn = form.querySelector('.newsletter-btn');
        const email = emailInput.value.trim();
        
        if (!email) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            emailInput.value = '';
            showToast('Thank you for subscribing!', 'success');
        }, 2000);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Toast Notification System
function initToastSystem() {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add toast styles
    toast.style.cssText = `
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-size: 14px;
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, 5000);
}

// Utility Functions
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
window.addEventListener('resize', debounce(function() {
    // Reinitialize any components that need resize handling
}, 250));

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause animations if needed
    } else {
        // Page is visible, resume animations if needed
    }
});
