/**
 * Dimensional Cosmic Portal - Interactive JavaScript
 * ScrollVerse Integration
 * Features: Timeline navigation, AR visualization, dimensional synchronization
 */

// ===================================
// Configuration Constants
// ===================================
const CONFIG = {
    MAX_LOG_ENTRIES: 10,
    ANIMATION_DURATION: 300 // milliseconds
};

// ===================================
// Global State Management
// ===================================
const PortalState = {
    currentDimension: 'neutral',
    arActive: false,
    dimensionSynced: false,
    interactionHistory: [],
    frequencies: {
        past: 432,
        present: 528,
        future: 963
    }
};

// ===================================
// Starfield Background
// ===================================
class StarfieldRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.numStars = 200;
        this.init();
    }

    init() {
        this.resize();
        this.createStars();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars() {
        this.stars = [];
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2,
                alpha: Math.random(),
                speed: Math.random() * 0.5
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            // Twinkling effect
            star.alpha += (Math.random() - 0.5) * 0.1;
            star.alpha = Math.max(0.1, Math.min(1, star.alpha));
            
            // Slow drift
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
            
            // Draw star
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// AR Visualization Handler
// ===================================
class ARVisualization {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isActive = false;
        this.animationId = null;
    }

    activate() {
        this.isActive = true;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.createParticles();
        this.animate();
        logInteraction('AR visualization activated');
    }

    deactivate() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        logInteraction('AR visualization deactivated');
    }

    createParticles() {
        this.particles = [];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < 50; i++) {
            const angle = (Math.PI * 2 * i) / 50;
            this.particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * 2,
                vy: Math.sin(angle) * 2,
                radius: Math.random() * 3 + 1,
                color: this.getColorForDimension(PortalState.currentDimension),
                life: 1
            });
        }
    }

    getColorForDimension(dimension) {
        const colors = {
            past: 'rgba(255, 215, 0, ',
            present: 'rgba(0, 255, 136, ',
            future: 'rgba(148, 0, 211, ',
            neutral: 'rgba(0, 206, 209, '
        };
        return colors[dimension] || colors.neutral;
    }

    animate() {
        if (!this.isActive) return;
        
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.01;
            
            // Reset particle if life is over
            if (particle.life <= 0) {
                const angle = (Math.PI * 2 * index) / this.particles.length;
                particle.x = centerX;
                particle.y = centerY;
                particle.vx = Math.cos(angle) * 2;
                particle.vy = Math.sin(angle) * 2;
                particle.life = 1;
                particle.color = this.getColorForDimension(PortalState.currentDimension);
            }
            
            // Draw particle
            this.ctx.fillStyle = `${particle.color}${particle.life})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw connection to center
            this.ctx.strokeStyle = `${particle.color}${particle.life * 0.3})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(particle.x, particle.y);
            this.ctx.stroke();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    updateDimension(dimension) {
        this.particles.forEach(particle => {
            particle.color = this.getColorForDimension(dimension);
        });
    }
}

// ===================================
// Modal Visualization
// ===================================
class ModalVisualization {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dimension = 'neutral';
    }

    render(dimension) {
        this.dimension = dimension;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.95)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw sacred geometry based on dimension
        switch(dimension) {
            case 'past':
                this.drawPyramid(centerX, centerY);
                break;
            case 'present':
                this.drawFlowerOfLife(centerX, centerY);
                break;
            case 'future':
                this.drawMerkaba(centerX, centerY);
                break;
        }
    }

    drawPyramid(x, y) {
        const size = 100;
        this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
        this.ctx.lineWidth = 2;
        
        // Draw pyramid
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x - size, y + size);
        this.ctx.lineTo(x + size, y + size);
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Draw center line
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x, y + size);
        this.ctx.stroke();
    }

    drawFlowerOfLife(x, y) {
        const radius = 40;
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.8)';
        this.ctx.lineWidth = 2;
        
        // Center circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Surrounding circles
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const cx = x + Math.cos(angle) * radius;
            const cy = y + Math.sin(angle) * radius;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    drawMerkaba(x, y) {
        const size = 80;
        this.ctx.strokeStyle = 'rgba(148, 0, 211, 0.8)';
        this.ctx.lineWidth = 2;
        
        // Upper triangle
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x - size, y + size / 2);
        this.ctx.lineTo(x + size, y + size / 2);
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Lower triangle
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + size);
        this.ctx.lineTo(x - size, y - size / 2);
        this.ctx.lineTo(x + size, y - size / 2);
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Center diamond
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size / 2);
        this.ctx.lineTo(x + size / 2, y);
        this.ctx.lineTo(x, y + size / 2);
        this.ctx.lineTo(x - size / 2, y);
        this.ctx.closePath();
        this.ctx.stroke();
    }
}

// ===================================
// Interaction Logging
// ===================================
function logInteraction(message) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    
    PortalState.interactionHistory.push(logEntry);
    
    const logList = document.getElementById('logEntries');
    const li = document.createElement('li');
    li.className = 'log-entry';
    li.textContent = logEntry;
    logList.insertBefore(li, logList.firstChild);
    
    // Keep only last MAX_LOG_ENTRIES entries
    while (logList.children.length > CONFIG.MAX_LOG_ENTRIES) {
        logList.removeChild(logList.lastChild);
    }
}

// ===================================
// Dimension Information Update
// ===================================
function updateDimensionInfo(dimension) {
    const info = {
        past: {
            name: 'Past Dimension',
            frequency: '432 Hz - Earth Resonance',
            status: 'Accessing ancestral wisdom archives...'
        },
        present: {
            name: 'Present Dimension',
            frequency: '528 Hz - Love Frequency',
            status: 'Synchronizing with current consciousness...'
        },
        future: {
            name: 'Future Dimension',
            frequency: '963 Hz - Divine Connection',
            status: 'Opening ascension gateway...'
        },
        neutral: {
            name: 'Neutral Space',
            frequency: '---',
            status: 'Select a timeline to begin'
        }
    };
    
    const dimensionData = info[dimension] || info.neutral;
    
    document.querySelector('.dimension-name').textContent = dimensionData.name;
    document.querySelector('.dimension-frequency').textContent = dimensionData.frequency;
    document.querySelector('.dimension-status').textContent = dimensionData.status;
}

// ===================================
// Portal Modal Management
// ===================================
function openPortalModal(dimension) {
    const modal = document.getElementById('portalModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const content = {
        past: {
            title: 'Past Timeline Portal - Ancestral Wisdom',
            body: `
                <h3>432 Hz - Earth Frequency</h3>
                <p>Journey into the wisdom of ancient civilizations and sacred traditions.</p>
                <ul>
                    <li><strong>Sacred Sigils Archive</strong> - Collection of Imhotep, Musa, and prophetic symbols</li>
                    <li><strong>Ancient Frequencies</strong> - Healing sounds from mystery schools</li>
                    <li><strong>Wisdom Scrolls</strong> - Eternal teachings preserved through time</li>
                </ul>
                <p style="margin-top: 1rem; color: #ffd700; font-style: italic;">
                    "The past holds the keys to understanding our present and shaping our future."
                </p>
            `
        },
        present: {
            title: 'Present Timeline Portal - Current Consciousness',
            body: `
                <h3>528 Hz - Love Frequency</h3>
                <p>Experience the power of now with live bio-resonance synchronization.</p>
                <ul>
                    <li><strong>Live NFT Gallery</strong> - Real-time Soul Altar collection display</li>
                    <li><strong>Bio-Resonance Sync</strong> - Heart rate and consciousness alignment</li>
                    <li><strong>Cosmic Music Stream</strong> - OmniVibes transcendent playlists</li>
                </ul>
                <p style="margin-top: 1rem; color: #00ff88; font-style: italic;">
                    "In this moment, we are infinite. The present is where transformation occurs."
                </p>
            `
        },
        future: {
            title: 'Future Timeline Portal - Ascension Gateway',
            body: `
                <h3>963 Hz - Divine Connection</h3>
                <p>Step into quantum possibilities and higher dimensional consciousness.</p>
                <ul>
                    <li><strong>Quantum Possibilities</strong> - AI-predicted timeline variations</li>
                    <li><strong>AR/VR Integration</strong> - Full immersive holographic experiences</li>
                    <li><strong>Divine Connection</strong> - Unity consciousness network access</li>
                </ul>
                <p style="margin-top: 1rem; color: #9400d3; font-style: italic;">
                    "The future is not written—it is created by our conscious choices in the now."
                </p>
            `
        }
    };
    
    const dimensionContent = content[dimension];
    modalTitle.textContent = dimensionContent.title;
    modalBody.innerHTML = dimensionContent.body;
    
    modal.classList.add('active');
    
    // Render visualization
    const modalViz = new ModalVisualization('modalCanvas');
    modalViz.render(dimension);
    
    logInteraction(`Portal opened: ${dimension} dimension`);
}

function closePortalModal() {
    const modal = document.getElementById('portalModal');
    modal.classList.remove('active');
}

// ===================================
// Dimension Synchronization
// ===================================
function synchronizeDimensions() {
    PortalState.dimensionSynced = !PortalState.dimensionSynced;
    
    const syncBtn = document.getElementById('dimensionSync');
    if (PortalState.dimensionSynced) {
        syncBtn.style.background = 'rgba(0, 255, 136, 0.4)';
        syncBtn.style.borderColor = '#00ff88';
        logInteraction('Dimensions synchronized - Timeline coherence achieved');
    } else {
        syncBtn.style.background = 'rgba(0, 206, 209, 0.2)';
        syncBtn.style.borderColor = '#00ced1';
        logInteraction('Dimension sync released - Free navigation mode');
    }
}

// ===================================
// Event Handlers Setup
// ===================================
function setupEventHandlers() {
    // Nav Pillar Interactions
    const pillars = document.querySelectorAll('.nav-pillar');
    pillars.forEach(pillar => {
        const dimension = pillar.dataset.timeline;
        
        // Click handler
        pillar.addEventListener('click', () => {
            PortalState.currentDimension = dimension;
            updateDimensionInfo(dimension);
            logInteraction(`Navigated to ${dimension} dimension`);
            
            // Update AR visualization if active
            if (PortalState.arActive && window.arVisualization) {
                window.arVisualization.updateDimension(dimension);
            }
        });
        
        // Keyboard accessibility
        pillar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                pillar.click();
            }
        });
        
        // Activate button
        const activateBtn = pillar.querySelector('.activate-btn');
        activateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openPortalModal(dimension);
        });
    });
    
    // AR Toggle
    const arToggle = document.getElementById('arToggle');
    arToggle.addEventListener('click', () => {
        PortalState.arActive = !PortalState.arActive;
        
        if (PortalState.arActive) {
            window.arVisualization.activate();
            arToggle.innerHTML = '<span class="ar-icon">◉</span> AR Active';
            arToggle.style.background = 'rgba(0, 255, 136, 0.4)';
            arToggle.style.borderColor = '#00ff88';
        } else {
            window.arVisualization.deactivate();
            arToggle.innerHTML = '<span class="ar-icon">◉</span> Activate AR View';
            arToggle.style.background = 'rgba(0, 206, 209, 0.2)';
            arToggle.style.borderColor = '#00ced1';
        }
    });
    
    // Dimension Sync
    const dimensionSync = document.getElementById('dimensionSync');
    dimensionSync.addEventListener('click', synchronizeDimensions);
    
    // Modal Close
    const modalClose = document.getElementById('modalClose');
    modalClose.addEventListener('click', closePortalModal);
    
    // Close modal on background click
    const modal = document.getElementById('portalModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePortalModal();
        }
    });
    
    // Cultural Element Cards
    const elementCards = document.querySelectorAll('.element-card');
    elementCards.forEach(card => {
        card.addEventListener('click', () => {
            const culture = card.dataset.culture;
            logInteraction(`Cultural element activated: ${culture}`);
            
            // Add visual feedback
            card.style.transform = 'scale(1.2)';
            setTimeout(() => {
                card.style.transform = '';
            }, CONFIG.ANIMATION_DURATION);
        });
    });
}

// ===================================
// Initialization
// ===================================
function initPortal() {
    console.log('🌌 Initializing Dimensional Cosmic Portal...');
    
    // Initialize starfield
    const starfield = new StarfieldRenderer('starfield');
    
    // Initialize AR visualization
    window.arVisualization = new ARVisualization('arCanvas');
    
    // Setup event handlers
    setupEventHandlers();
    
    // Initial dimension info
    updateDimensionInfo('neutral');
    
    // Log initialization
    logInteraction('Portal systems online');
    logInteraction('Starfield renderer initialized');
    logInteraction('AR visualization ready');
    logInteraction('Awaiting dimensional navigation...');
    
    console.log('✨ Portal initialization complete!');
}

// ===================================
// Start Portal on Page Load
// ===================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortal);
} else {
    initPortal();
}

// Export for potential external use
window.PortalState = PortalState;
