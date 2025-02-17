class AudioVisualizer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.audioData = new Uint8Array(128);
        this.isPlaying = false;
        this.particles = [];
        this.lastRenderTime = 0;
        
        this.setupCanvas();
        this.setupAudio();
        this.createParticles();
        this.animate();
    }

    setupCanvas() {
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.8;
        `;
        document.body.appendChild(this.canvas);
        this.resize();
        window.addEventListener('resize', () => this.resize(), { passive: true });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    }

    setupAudio() {
        // Wait for Spotify iframe to load
        window.addEventListener('message', (event) => {
            if (event.data.type === 'playback_update') {
                this.isPlaying = event.data.payload.playing;
                // Simulate audio data when music is playing
                if (this.isPlaying) {
                    this.updateAudioData();
                }
            }
        });
    }

    updateAudioData() {
        // Simulate frequency data when we can't access real audio data
        for (let i = 0; i < this.audioData.length; i++) {
            const t = performance.now() / 1000;
            this.audioData[i] = 128 + 
                Math.sin(t * 2 + i * 0.1) * 64 +
                Math.sin(t * 4 + i * 0.05) * 32;
        }
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.min(128, Math.floor(window.innerWidth / 10));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: this.canvas.width * (i / particleCount),
                y: this.canvas.height / 2,
                baseY: this.canvas.height / 2,
                size: 3,
                color: getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim(),
                velocity: 0,
                damping: 0.98
            });
        }
    }

    animate() {
        const now = performance.now();
        if (now - this.lastRenderTime > 16) { // Cap at ~60fps
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            if (this.isPlaying) {
                this.updateAudioData();
            }

            // Update and draw particles
            this.particles.forEach((particle, i) => {
                const audioIndex = Math.floor(i * (this.audioData.length / this.particles.length));
                const targetY = particle.baseY - (this.audioData[audioIndex] || 0);
                
                // Spring physics
                const acceleration = (targetY - particle.y) * 0.2;
                particle.velocity = particle.velocity * particle.damping + acceleration;
                particle.y += particle.velocity;

                // Draw particle
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.baseY);
                this.ctx.lineTo(particle.x, particle.y);
                this.ctx.strokeStyle = particle.color + '80';
                this.ctx.lineWidth = particle.size;
                this.ctx.stroke();

                // Draw glow
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color + '40';
                this.ctx.fill();
            });

            this.lastRenderTime = now;
        }

        requestAnimationFrame(() => this.animate());
    }

    updateColors(color) {
        this.particles.forEach(particle => {
            particle.color = color;
        });
    }
}

// Initialize audio visualizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.audioVisualizer = new AudioVisualizer();
    }, 1000);
}); 