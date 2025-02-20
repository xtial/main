// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Initialize animations
    initAnimations();
    
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize responsive behavior
    initResponsive();
});

function initTheme() {
    const root = document.documentElement;
    const defaultTheme = {
        primary: '#FFFFFF',
        background: '#000000',
        secondary: '#808080',
        accent: 'rgba(255, 255, 255, 0.1)',
        glow: 'rgba(255, 255, 255, 0.5)'
    };

    Object.entries(defaultTheme).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value);
    });

    document.body.classList.add('theme-loaded');
}

function initAnimations() {
    // Initialize fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        element.style.animationDelay = `${0.3 * (index + 1)}s`;
        element.style.opacity = '1';
    });

    // Initialize smooth scrolling
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

function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (!loadingScreen) return;

    // Hide loading screen after content is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.classList.add('content-loaded');
        }, 500);
    });
}

function initResponsive() {
    const updateLayout = () => {
        document.documentElement.style.setProperty(
            '--vh', 
            `${window.innerHeight * 0.01}px`
        );
    };

    window.addEventListener('resize', updateLayout);
    updateLayout();

    // Handle reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduced-motion');
    }
} 