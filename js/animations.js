// Initialize effects when DOM is loaded
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
});