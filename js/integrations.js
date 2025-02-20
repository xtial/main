class Integrations {
    constructor() {
        // Initialize DOM elements
        this.statusElement = document.getElementById('discord-presence');
        this.webProjectsElement = document.getElementById('web-projects');
        this.githubProjectsElement = document.getElementById('github-projects');
        
        // Configuration
        this.config = {
            githubUsername: 'xtial',
            github_api: 'https://api.github.com',
            status: {
                emoji: '🌙',
                text: 'sexy chill dev',
                subtext: 'phishing for blood',
                type: 'idle',
                activities: [
                    { 
                        emoji: '💻',
                        text: 'dev',
                        subtext: 'nelliel.soulsociety.cc',
                        details: {
                            location: '🌍 remote',
                            experience: '⚡ 5+ years',
                            specialty: '🔮 automation & data'
                        }
                    },
                    { 
                        emoji: '🎯',
                        text: 'currently',
                        subtext: 'traceback.sh',
                        details: {
                            status: '🚀 live',
                            users: '💫 1.2k+ users',
                            uptime: '⚡ 99.9% uptime'
                        }
                    },
                    { 
                        emoji: '🎵',
                        text: 'right now',
                        subtext: 'chilling',
                        details: {
                            mood: '💆‍♂️ chill',
                            availability: '📫 open to dms',
                            timezone: '🌙 UTC+9'
                        }
                    }
                ]
            }
        };

        // Initialize everything
        this.init();
    }

    async init() {
        try {
            // Initialize all components
            await Promise.all([
                this.initWebProjects(),
                this.initGithubProjects()
            ]);
            
            // Start status rotation
            this.updateStatus(this.config.status);
            this.startStatusRotation();
            
            // Remove loading states after successful initialization
            document.querySelectorAll('.status-loading').forEach(loader => {
                loader.style.display = 'none';
            });
        } catch (error) {
            console.error('Failed to initialize components:', error);
            this.handleInitializationError();
        }
    }

    handleInitializationError() {
        const errorMessage = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>Failed to load content. Please refresh the page.</span>
            </div>
        `;
        
        document.querySelectorAll('.status-loading').forEach(loader => {
            loader.innerHTML = errorMessage;
        });
    }

    updateStatus(status) {
        if (!this.statusElement) return;

        const statusTypeColors = {
            online: '#43b581',
            idle: '#faa61a',
            dnd: '#f04747',
            offline: '#747f8d'
        };

        const detailsHtml = status.details ? `
            <div class="status-details">
                ${Object.entries(status.details).map(([key, value]) => `
                    <div class="status-detail">
                        <span class="detail-value">${value}</span>
                    </div>
                `).join('')}
            </div>
        ` : '';

        const statusHtml = `
            <div class="status-display">
                <div class="status-main">
                    <div class="status-icon" style="background-color: ${statusTypeColors[status.type] || statusTypeColors.idle}"></div>
                    <div class="status-info">
                        <div class="status-text">
                            <span class="status-emoji">${status.emoji}</span>
                            <span class="status-title">${status.text}</span>
                        </div>
                        <div class="status-subtext">${status.subtext}</div>
                    </div>
                </div>
                ${detailsHtml}
            </div>
        `;

        this.statusElement.innerHTML = statusHtml;
    }

    startStatusRotation() {
        let currentIndex = 0;
        setInterval(() => {
            const activity = this.config.status.activities[currentIndex];
            this.updateStatus({
                ...activity,
                type: ['online', 'idle', 'dnd'][Math.floor(Math.random() * 3)]
            });
            currentIndex = (currentIndex + 1) % this.config.status.activities.length;
        }, 10000);
    }

    async initWebProjects() {
        if (!this.webProjectsElement) return;
        
        // Clear loading state
        this.webProjectsElement.innerHTML = '';
        
        // Add your web projects here
        const webProjects = [
            {
                id: 'nelliel-suite',
                name: 'nelliel.soulsociety.cc',
                description: 'aio panel - email, calling, crypto, data',
                url: 'https://nelliel.soulsociety.cc/'
            },
            {
                id: 'traceback',
                name: 'traceback.sh',
                description: 'traceback.sh - osint capabilities',
                url: 'https://traceback.sh'
            }
        ];
        
        webProjects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            this.webProjectsElement.appendChild(projectCard);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('a');
        card.href = project.url;
        card.className = 'project-card';
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        
        card.innerHTML = `
            <div class="project-header">
                <h3 class="project-title">${project.name}</h3>
                <p class="project-description">${project.description}</p>
            </div>
        `;
        
        return card;
    }

    async initGithubProjects() {
        if (!this.githubProjectsElement) return;
        
        // Clear loading state
        this.githubProjectsElement.innerHTML = '';
        
        try {
            const response = await fetch(`${this.config.github_api}/users/${this.config.githubUsername}/repos?sort=updated&per_page=4`);
            if (!response.ok) {
                throw new Error(`GitHub API responded with status: ${response.status}`);
            }

            const githubRepos = await response.json();
            
            const githubProjectsHtml = githubRepos.map(repo => `
                <a href="${repo.html_url}" class="project-card" target="_blank" rel="noopener noreferrer">
                    <div class="project-header">
                        <h3 class="project-title">${repo.name}</h3>
                        <p class="project-description">${repo.description || 'No description available'}</p>
                    </div>
                </a>
            `).join('');

            this.githubProjectsElement.innerHTML = githubProjectsHtml;
        } catch (error) {
            console.error('Failed to fetch GitHub projects:', error);
            throw error;
        }
    }
}

// Initialize integrations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Integrations();
}); 