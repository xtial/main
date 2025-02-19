// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Handle loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        });
    }

    // Initialize fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        element.style.animationDelay = `${0.3 * (index + 1)}s`;
    });

    // Handle theme initialization
    const root = document.documentElement;
    const defaultTheme = {
        primary: '#FFFFFF',
        background: '#000000',
        secondary: '#808080',
        accent: 'rgba(255, 255, 255, 0.1)',
        glow: 'rgba(255, 255, 255, 0.5)'
    };

    // Apply default theme
    Object.entries(defaultTheme).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value);
    });

    // Handle smooth scrolling for anchor links
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

    // Handle responsive adjustments
    const handleResize = () => {
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('is-mobile', isMobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    // Handle performance optimizations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduced-motion');
    }
}); 