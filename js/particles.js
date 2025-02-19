class StarField {
    constructor() {
        this.stars = [];
        this.generateStars();
        this.lastRenderTime = 0;
        this.frameId = null;
        this.animate();
    }

    generateStars() {
        const stars1 = document.getElementById('stars');
        const stars2 = document.getElementById('stars2');
        const stars3 = document.getElementById('stars3');

        // Reduce number of stars for better performance
        const starCounts = {
            small: 300,  // Reduced from 700
            medium: 100, // Reduced from 200
            large: 50    // Reduced from 100
        };

        for (let i = 0; i < starCounts.small; i++) {
            this.stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: 1,
                speed: Math.random() * 0.3,
                element: stars1
            });
        }

        for (let i = 0; i < starCounts.medium; i++) {
            this.stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: 2,
                speed: Math.random() * 0.2,
                element: stars2
            });
        }

        for (let i = 0; i < starCounts.large; i++) {
            this.stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: 3,
                speed: Math.random() * 0.1,
                element: stars3
            });
        }
    }

    animate() {
        const now = performance.now();
        if (now - this.lastRenderTime > 32) { // Cap at ~30fps
            this.stars.forEach(star => {
                star.y -= star.speed;
                if (star.y < -10) {
                    star.y = window.innerHeight + 10;
                    star.x = Math.random() * window.innerWidth;
                }
            });

            // Batch update star positions
            const updates = {
                stars1: [],
                stars2: [],
                stars3: []
            };

            this.stars.forEach(star => {
                const key = star.size === 1 ? 'stars1' : star.size === 2 ? 'stars2' : 'stars3';
                updates[key].push(`${star.x}px ${star.y}px rgba(255,255,255,${0.3 + star.size * 0.1})`);
            });

            document.getElementById('stars').style.boxShadow = updates.stars1.join(',');
            document.getElementById('stars2').style.boxShadow = updates.stars2.join(',');
            document.getElementById('stars3').style.boxShadow = updates.stars3.join(',');

            this.lastRenderTime = now;
        }

        this.frameId = requestAnimationFrame(() => this.animate());
    }
}

class FloatingPetals {
    constructor() {
        this.petals = [];
        this.container = document.querySelector('.petals');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'petals';
            this.container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
                transform: translateZ(0);
                will-change: transform;
            `;
            document.body.appendChild(this.container);
        }
        this.lastRenderTime = 0;
        this.frameId = null;
        this.generatePetals();
        this.animate();
    }

    generatePetals() {
        this.container.innerHTML = '';
        this.petals = [];

        // Reduce number of petals for better performance
        const petalCount = window.innerWidth < 768 ? 10 : 15;

        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.cssText = `
                position: absolute;
                width: ${Math.random() * 15 + 8}px;
                height: ${Math.random() * 15 + 8}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 100% 0;
                transform: translateZ(0);
                will-change: transform;
                pointer-events: none;
            `;

            this.petals.push({
                element: petal,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                speedX: Math.random() * 1.5 - 0.75,
                speedY: -Math.random() * 1.5 - 0.75,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 1.5 - 0.75
            });

            this.container.appendChild(petal);
        }
    }

    animate() {
        const now = performance.now();
        if (now - this.lastRenderTime > 32) { // Cap at ~30fps
            this.petals.forEach(petal => {
                petal.x += petal.speedX;
                petal.y += petal.speedY;
                petal.rotation += petal.rotationSpeed;

                if (petal.y < -50) {
                    petal.y = window.innerHeight + 50;
                    petal.x = Math.random() * window.innerWidth;
                }

                petal.element.style.transform = 
                    `translate3d(${petal.x}px, ${petal.y}px, 0) rotate(${petal.rotation}deg)`;
            });

            this.lastRenderTime = now;
        }

        this.frameId = requestAnimationFrame(() => this.animate());
    }
}

// Add ParticleNetwork class before the initialization
class ParticleNetwork {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        this.connectionRadius = 100;
        this.particleCount = window.innerWidth < 768 ? 50 : 100;
        this.color = '#FFFFFF';
        
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.5;
        `;
        
        document.body.appendChild(this.canvas);
        window.particleNetwork = this; // Make instance globally accessible
        this.init();
    }

    updateColors(color) {
        this.color = color;
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: Math.random() * 0.2 - 0.1,
                vy: Math.random() * 0.2 - 0.1,
                size: Math.random() * 2 + 1,
                color: this.color
            });
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        }, { passive: true });

        window.addEventListener('resize', () => {
            this.resize();
            this.particles = [];
            this.createParticles();
        }, { passive: true });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            // Move particles
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Update particle color
            particle.color = this.color;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `${particle.color}40`; // 25% opacity
            this.ctx.fill();

            // Check connections with mouse
            const mouseDistance = Math.hypot(this.mousePosition.x - particle.x, this.mousePosition.y - particle.y);
            if (mouseDistance < this.connectionRadius) {
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mousePosition.x, this.mousePosition.y);
                this.ctx.strokeStyle = `${particle.color}${Math.floor(48 * (1 - mouseDistance / this.connectionRadius)).toString(16)}`; // Dynamic opacity
                this.ctx.stroke();
            }

            // Check connections with other particles
            for (let j = index + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const distance = Math.hypot(other.x - particle.x, other.y - particle.y);
                
                if (distance < this.connectionRadius) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `${particle.color}${Math.floor(24 * (1 - distance / this.connectionRadius)).toString(16)}`; // Dynamic opacity
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Update the initialization code
document.addEventListener('DOMContentLoaded', () => {
    // Delay initialization for better initial load performance
    setTimeout(() => {
        if (!window.matchMedia('(max-width: 768px)').matches) {
            new StarField();
            new FloatingPetals();
            new ParticleNetwork(); // Add particle network
        }
    }, 500);
}); 