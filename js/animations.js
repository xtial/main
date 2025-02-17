// Black Hole Cursor Effect
class BlackHoleCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor';
        document.body.appendChild(this.cursor);

        this.cursorX = 0;
        this.cursorY = 0;
        this.isActive = false;
        this.textElements = new Set();
        this.distortionRadius = 120; // Reduced radius for better performance
        this.maxRotation = 45; // Reduced rotation for smoother animation
        this.maxScale = 0.85; // Less aggressive scaling
        this.frameId = null;
        this.lastProcessTime = 0;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    init() {
        if (this.isReducedMotion) {
            this.cursor.style.display = 'none';
            return;
        }

        this.prepareTextElements();

        // Optimized mouse move handler with RAF and bounds checking
        let isMoving = false;
        document.addEventListener('mousemove', (e) => {
            this.cursorX = e.clientX;
            this.cursorY = e.clientY;
            
            if (!isMoving) {
                isMoving = true;
                this.frameId = requestAnimationFrame(() => {
                    this.updateCursor();
                    isMoving = false;
                });
            }
        }, { passive: true });

        // Mouse events for active state
        document.addEventListener('mousedown', () => this.setActive(true), { passive: true });
        document.addEventListener('mouseup', () => this.setActive(false), { passive: true });

        // Optimized window resize handler with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.prepareTextElements(), 100);
        }, { passive: true });
    }

    prepareTextElements() {
        this.textElements.clear();

        // Use more efficient selector
        const visibleElements = document.querySelectorAll('h1, h2, p, .status-text, .project-title, .project-description, .bio');
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        visibleElements.forEach(node => {
            if (node.getAttribute('data-processed')) return;
            
            const rect = node.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > viewportHeight ||
                rect.right < 0 || rect.left > viewportWidth) {
                return;
            }

            const text = node.textContent;
            node.textContent = '';
            
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (char === ' ') {
                    fragment.appendChild(document.createTextNode(' '));
                } else {
                    const span = document.createElement('span');
                    span.className = 'distort-text';
                    span.textContent = char;
                    fragment.appendChild(span);
                    this.textElements.add(span);
                }
            }
            
            node.appendChild(fragment);
            node.setAttribute('data-processed', 'true');
        });
    }

    setActive(active) {
        if (this.isActive === active) return;
        this.isActive = active;
        this.cursor.classList.toggle('active', active);
        this.distortionRadius = active ? 150 : 120;
    }

    updateCursor() {
        // Use transform3d for better performance
        this.cursor.style.transform = `translate3d(${this.cursorX}px, ${this.cursorY}px, 0)`;

        // Throttle text distortion to every 32ms (roughly 30fps)
        const now = performance.now();
        if (now - this.lastProcessTime > 32) {
            this.applyTextDistortion();
            this.lastProcessTime = now;
        }
    }

    applyTextDistortion() {
        const cursorX = this.cursorX;
        const cursorY = this.cursorY;
        const radius = this.distortionRadius;
        const maxRotation = this.maxRotation;
        const maxScale = this.maxScale;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Process only elements within viewport and radius
        for (const span of this.textElements) {
            const rect = span.getBoundingClientRect();
            
            // Skip if outside viewport
            if (rect.bottom < 0 || rect.top > viewportHeight || 
                rect.right < 0 || rect.left > viewportWidth) {
                continue;
            }

            const spanX = rect.left + rect.width / 2;
            const spanY = rect.top + rect.height / 2;
            
            // Skip if outside distortion radius
            const dx = cursorX - spanX;
            const dy = cursorY - spanY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > radius) {
                if (span.style.transform) {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
                continue;
            }

            const distortionFactor = 1 - distance / radius;
            const angle = Math.atan2(dy, dx);
            const rotation = maxRotation * distortionFactor * (angle / Math.PI);
            const scale = 1 - ((1 - maxScale) * distortionFactor);
            
            // Use transform3d for better performance
            span.style.transform = `translate3d(0,0,0) scale(${scale}) rotate(${rotation}deg)`;
            span.style.opacity = Math.max(0.6, 1 - (distortionFactor * 0.4));
        }
    }
}

// Initialize effects when DOM is loaded with delay for better initial load
document.addEventListener('DOMContentLoaded', () => {
    requestIdleCallback(() => {
        new BlackHoleCursor();
    }, { timeout: 1000 });

    // Handle loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        });
    }
}); 