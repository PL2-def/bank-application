# Bank Project Deployment to GitHub

This document outlines the steps to deploy the frontend of the Bank project to GitHub, typically for hosting via GitHub Pages or a similar static site hosting service.

## Frontend Deployment

The frontend is a React application built with Vite.

### 1. Build the Project

To create a production-ready build of your frontend application, run the following command in the root of your project directory:

```bash
npm install
npm run build
```

This command will:
- Install all necessary dependencies.
- Compile your TypeScript code.
- Generate optimized static assets (HTML, CSS, JavaScript, etc.) in the `dist` directory.

### 2. Prepare for GitHub Pages (Optional, but Recommended for Static Hosting)

If you plan to host on GitHub Pages, you might need to configure your `vite.config.ts` to set the `base` option to your repository name. For example, if your repository is `https://github.com/your-username/your-repo-name`, you would add:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // <--- Add this line
})
```
Remember to replace `/your-repo-name/` with the actual name of your GitHub repository. You would then need to run `npm run build` again after this change.

### 3. Push to GitHub

You should push the entire project to your GitHub repository. However, for static site hosting, only the contents of the `dist` folder are typically served.

**What to push:**

- **All source code:** `src/`, `public/`, `index.html`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `.gitignore`, `README.md`.
- **The `dist` folder:** After running `npm run build`, the `dist` folder contains the optimized static files. This is what you would typically deploy to a static hosting service.
- **The `backend` folder:** If your backend is part of this repository and needs to be deployed, ensure its files are also pushed.

**What NOT to push (usually ignored by `.gitignore`):**

- `node_modules/`: These are installed based on `package.json` and `package-lock.json`.
- `.env` files or other sensitive configuration.

### 4. Deploying the Frontend to GitHub Pages

After pushing your code to GitHub:
1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Pages**.
3. Under "Build and deployment", select "Deploy from a branch".
4. Choose the branch where your `dist` folder is located (e.g., `main` or `gh-pages`) and select `/dist` as the folder.
5. Save your changes. GitHub Pages will then build and deploy your site.

### Backend Considerations

The `backend` directory suggests you have a server-side component. Deploying a backend typically involves different steps, such as:
- Setting up a server (e.g., Node.js server, Python Flask/Django app).
- Configuring a database.
- Deploying to a cloud provider (e.g., Heroku, Vercel, AWS, Azure, Google Cloud).

The specific steps for your backend will depend on its technology stack and your chosen hosting provider. This `DEPLOYMENT.md` focuses primarily on the frontend.
