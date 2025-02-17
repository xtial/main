class Integrations {
    constructor() {
        this.statusElement = document.getElementById('discord-presence');
        this.githubProjectsElement = document.getElementById('github-projects');
        
        // Configuration
        this.config = {
            githubUsername: 'xtial',
            github_api: 'https://api.github.com',
            status: {
                emoji: '🌙',
                text: 'sexy chill dev',
                subtext: 'phishing for blood',
                type: 'coding'
            },
            themes: {
                default: { name: 'Default', color: '#FFFFFF' },
                cyberpunk: { name: 'Cyberpunk', color: '#00ff9f' },
                sunset: { name: 'Sunset', color: '#ff6b6b' },
                matrix: { name: 'Matrix', color: '#00ff00' },
                ocean: { name: 'Ocean', color: '#64ffda' }
            }
        };

        this.init();
    }

    async init() {
        this.updateStatus();
        this.initGithubProjects();
        this.initThemeSwitcher();
    }

    initThemeSwitcher() {
        // Create theme switcher container
        const switcher = document.createElement('div');
        switcher.className = 'theme-switcher';
        
        // Create theme buttons
        Object.entries(this.config.themes).forEach(([theme, { color }]) => {
            const button = document.createElement('button');
            button.className = `theme-button ${theme === 'default' ? 'active' : ''}`;
            button.style.backgroundColor = color;
            button.setAttribute('data-theme', theme);
            button.title = `Switch to ${theme} theme`;
            
            button.addEventListener('click', () => this.setTheme(theme));
            switcher.appendChild(button);
        });

        // Add theme switcher to document
        document.body.appendChild(switcher);

        // Load saved theme
        const savedTheme = localStorage.getItem('selected-theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        }
    }

    setTheme(theme) {
        // Update active button
        document.querySelectorAll('.theme-button').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
        });

        // Apply theme
        document.documentElement.setAttribute('data-theme', theme === 'default' ? '' : theme);

        // Save theme preference
        localStorage.setItem('selected-theme', theme);

        // Update particle colors
        const themeColor = this.config.themes[theme].color;
        if (window.particleNetwork) {
            window.particleNetwork.updateColors(themeColor);
        }
        
        // Update audio visualizer colors
        if (window.audioVisualizer) {
            window.audioVisualizer.updateColors(themeColor);
        }
    }

    updateStatus() {
        const { status } = this.config;
        let statusIcon;
        
        switch (status.type) {
            case 'coding':
                statusIcon = 'fas fa-code';
                break;
            case 'gaming':
                statusIcon = 'fas fa-gamepad';
                break;
            case 'music':
                statusIcon = 'fas fa-music';
                break;
            case 'art':
                statusIcon = 'fas fa-palette';
                break;
            case 'writing':
                statusIcon = 'fas fa-pen-fancy';
                break;
            default:
                statusIcon = 'fas fa-circle';
        }

        const html = `
            <div class="status-content">
                <div class="status-main">
                    <span class="status-emoji">${status.emoji}</span>
                    <span class="status-text">${status.text}</span>
                </div>
                <div class="status-details">
                    <i class="${statusIcon}"></i>
                    <span>${status.subtext}</span>
                </div>
            </div>
        `;

        this.statusElement.innerHTML = html;
    }

    // GitHub Projects
    async initGithubProjects() {
        try {
            const response = await fetch(`${this.config.github_api}/users/${this.config.githubUsername}/repos?sort=updated&per_page=6`);
            const repos = await response.json();
            
            const html = repos.map(repo => `
                <a href="${repo.html_url}" class="project-card" target="_blank">
                    <div class="project-title">${repo.name}</div>
                    <div class="project-description">${repo.description || ''}</div>
                    <div class="project-stats">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        <span>${repo.language || 'N/A'}</span>
                    </div>
                </a>
            `).join('');

            this.githubProjectsElement.innerHTML = html;
        } catch (error) {
            this.githubProjectsElement.innerHTML = '<div class="status-error">Failed to load GitHub projects</div>';
        }
    }
}

// Initialize integrations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Integrations();
}); 