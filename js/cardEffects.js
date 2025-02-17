class CardEffects {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.bounds = {};
        this.mousePosition = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.cards.forEach(card => {
            // Store card bounds
            this.updateBounds(card);

            // Add event listeners
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, card));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
        });

        // Update bounds on resize
        window.addEventListener('resize', () => {
            this.cards.forEach(card => this.updateBounds(card));
        }, { passive: true });

        // Update mouse position
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        }, { passive: true });
    }

    updateBounds(card) {
        this.bounds[card.id] = card.getBoundingClientRect();
    }

    handleMouseMove(e, card) {
        const bounds = this.bounds[card.id];
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate relative mouse position
        const relativeX = mouseX - bounds.left;
        const relativeY = mouseY - bounds.top;

        // Update CSS variables for the magnetic gradient effect
        card.style.setProperty('--mouse-x', `${relativeX}px`);
        card.style.setProperty('--mouse-y', `${relativeY}px`);

        // Calculate rotation
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;
        const rotateY = ((relativeX - centerX) / centerX) * 5; // Max 5 degrees
        const rotateX = -((relativeY - centerY) / centerY) * 5; // Max 5 degrees

        // Apply rotation with smooth transition
        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
    }

    handleMouseEnter(e, card) {
        // Reset transition
        card.style.transition = 'none';
        
        // Force a repaint
        card.offsetHeight;
        
        // Restore transition
        card.style.transition = `transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                               border-color 0.3s ease,
                               background-color 0.3s ease,
                               filter 0.3s ease`;
    }

    handleMouseLeave(e, card) {
        // Reset rotation
        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
    }

    // Add magnetic pull effect to cursor
    magneticPull(card) {
        const bounds = this.bounds[card.id];
        const cardCenterX = bounds.left + bounds.width / 2;
        const cardCenterY = bounds.top + bounds.height / 2;
        
        // Calculate distance between cursor and card center
        const deltaX = this.mousePosition.x - cardCenterX;
        const deltaY = this.mousePosition.y - cardCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // If cursor is within magnetic field (150px)
        if (distance < 150) {
            const pull = (150 - distance) / 150; // Stronger pull when closer
            const moveX = deltaX * pull * 0.2;
            const moveY = deltaY * pull * 0.2;
            
            card.style.transform = `
                translate(${moveX}px, ${moveY}px)
                rotateX(var(--rotate-x))
                rotateY(var(--rotate-y))
            `;
        }
    }
}

// Initialize card effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.cardEffects = new CardEffects();
    }, 1000);
}); 