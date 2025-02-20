// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize stars
    initStars();
    
    // Initialize background effects
    initBackgroundEffects();

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

function initStars() {
    const stars = document.querySelectorAll('#stars, #stars2, #stars3');
    stars.forEach(star => {
        if (star) {
            star.style.animation = `twinkle ${3 + Math.random() * 2}s infinite`;
        }
    });
}

function initBackgroundEffects() {
    const bokehOverlay = document.querySelector('.bokeh-overlay');
    if (bokehOverlay) {
        bokehOverlay.style.animation = 'glow 4s ease-in-out infinite';
    }

    const particleSystem = document.querySelector('.particle-system');
    if (particleSystem) {
        particleSystem.style.opacity = '0.5';
    }
}