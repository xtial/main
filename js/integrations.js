class Integrations {
    constructor() {
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

        this.init();
        this.startStatusRotation();
    }

    async init() {
        await this.initProjects();
        this.updateStatus(this.config.status);
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
        }, 10000); // Rotate every 10 seconds
    }

    async initWebProjects() {
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
        
        try {
            if (!this.webProjectsElement) {
                console.error('Web projects element not found');
                return;
            }

            const webProjectsHtml = webProjects.map(project => `
                <a href="${project.url}" class="project-card" id="${project.id}" target="_blank" rel="noopener noreferrer">
                    <div class="project-header">
                        <h3 class="project-title">${project.name}</h3>
                        <p class="project-description">${project.description}</p>
                    </div>
                </a>
            `).join('');

            this.webProjectsElement.innerHTML = webProjectsHtml;
        } catch (error) {
            console.error('Error loading web projects:', error);
            if (this.webProjectsElement) {
                this.webProjectsElement.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        Failed to load projects
                    </div>
                `;
            }
        }
    }

    async initGithubProjects() {
        try {
            if (!this.githubProjectsElement) {
                console.error('GitHub projects element not found');
                return;
            }

            const response = await fetch(`${this.config.github_api}/users/${this.config.githubUsername}/repos?sort=updated&per_page=4`);
            if (!response.ok) {
                throw new Error(`GitHub API responded with status: ${response.status}`);
            }

            const githubRepos = await response.json();
            
            const githubProjectsHtml = githubRepos.map(repo => `
                <div class="project-card">
                    <div class="project-header">
                        <a href="${repo.html_url}" class="title-link" target="_blank" rel="noopener noreferrer">
                            <h3 class="project-title">${repo.name}</h3>
                            <div class="status-indicators">
                                <span>${repo.archived ? '📦' : '📝'}</span>
                                ${repo.stargazers_count > 0 ? '<span>⭐</span>' : ''}
                            </div>
                        </a>
                        <p class="project-description">${repo.description || ''}</p>
                    </div>
                    <div class="project-footer">
                        <div class="tech-stack">
                            ${repo.language ? `<span class="tech-tag">${repo.language}</span>` : ''}
                            ${repo.topics ? repo.topics.map(topic => `<span class="tech-tag">${topic}</span>`).join('') : ''}
                        </div>
                    </div>
                </div>
            `).join('');

            this.githubProjectsElement.innerHTML = githubProjectsHtml;
        } catch (error) {
            console.error('Error loading GitHub projects:', error);
            if (this.githubProjectsElement) {
                this.githubProjectsElement.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        Failed to load GitHub projects
                    </div>
                `;
            }
        }
    }

    async initProjects() {
        await Promise.all([
            this.initWebProjects(),
            this.initGithubProjects()
        ]);
    }
}

// Initialize integrations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Integrations();
}); 