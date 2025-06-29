# Study Timer --

A React-based study timer application built with Vite.

## Features

- Study timer functionality
- Built with React and Vite
- Deployed on GitHub Pages

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This app is automatically deployed to GitHub Pages via GitHub Actions. The deployment workflow:

1. Triggers on pushes to the `main` branch
2. Builds the app using `npm run build`
3. Deploys to GitHub Pages

The app is configured to work with the repository name `study-timer` as the base path.

## GitHub Pages Setup

To enable GitHub Pages for this repository:

1. Go to your repository settings
2. Navigate to "Pages" in the sidebar
3. Select "GitHub Actions" as the source
4. The deployment will happen automatically when you push to the main branch

## SPA Routing

The app includes special handling for Single Page Application routing on GitHub Pages:
- `404.html` redirects to the main app
- `index.html` includes a script to handle URL restoration

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Test commit for GitHub Pages
