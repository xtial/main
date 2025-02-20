# Personal Portfolio

A modern, responsive portfolio website showcasing projects and status.

## Features

- Responsive design
- Dynamic project cards
- Status integration
- Particle effects and animations
- GitHub projects integration

## Deployment

### GitHub Pages

1. Push to the `main` branch
2. Go to repository Settings > Pages
3. Set source branch to `main`
4. Set folder to `/ (root)`
5. Save the settings

### Custom Domain (Optional)

1. Add your domain to the CNAME file
2. Configure DNS settings:
   - Add an A record pointing to GitHub Pages IPs
   - Add a CNAME record if using a subdomain

## Local Development

1. Clone the repository
2. Open `index.html` in a browser
3. For live reload, use a local server:
   ```bash
   npx http-server
   # or
   python -m http.server
   ```

## Structure

```
.
├── index.html          # Main HTML file
├── css/               # Stylesheets
├── js/                # JavaScript files
└── assets/           # Images and other assets
```

## License

MIT License - feel free to use and modify
