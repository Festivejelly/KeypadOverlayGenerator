# Deployment Guide for GitHub Pages

## First-Time Setup

### 1. Enable GitHub Pages in Repository Settings

1. Go to your repository on GitHub: `https://github.com/Festivejelly/KeypadOverlayGenerator`
2. Click on **Settings** (top right)
3. In the left sidebar, click **Pages**
4. Under **Build and deployment**, select:
   - **Source**: GitHub Actions
   
That's it! The GitHub Actions workflow will handle the rest.

### 2. Push Your Code

```bash
git add .
git commit -m "Initial setup with Vite and React"
git push origin main
```

### 3. Wait for Deployment

- Go to the **Actions** tab in your GitHub repository
- You'll see the "Deploy to GitHub Pages" workflow running
- Wait for it to complete (usually takes 2-3 minutes)
- Your site will be live at: `https://festivejelly.github.io/KeypadOverlayGenerator/`

## Manual Deployment (Alternative)

If you prefer to deploy manually instead of using GitHub Actions:

```bash
npm run deploy
```

This will:
1. Build the production version
2. Deploy it to the `gh-pages` branch
3. GitHub Pages will automatically serve it

**Note**: For manual deployment, you need to change the GitHub Pages source to:
- **Source**: Deploy from a branch
- **Branch**: gh-pages / (root)

## Development Workflow

### Run Locally
```bash
npm run dev
```
Visit: `http://localhost:5173/KeypadOverlayGenerator/`

### Build for Production
```bash
npm run build
```
Output will be in the `dist/` folder

### Preview Production Build
```bash
npm run preview
```

## Updating the Site

Every time you push to the `main` branch, GitHub Actions will automatically:
1. Build the project
2. Deploy to GitHub Pages
3. Update the live site

## Troubleshooting

### Site Shows 404
- Make sure GitHub Pages is enabled in settings
- Check that the workflow completed successfully in Actions tab
- Verify the base path in `vite.config.ts` matches your repository name

### Build Fails
- Check the Actions tab for error logs
- Make sure all dependencies are in `package.json`
- Test locally with `npm run build` first

### Local Development Issues
- Clear node_modules: `Remove-Item -Recurse -Force node_modules`
- Reinstall: `npm install`
- Clear cache: `npm run dev -- --force`
