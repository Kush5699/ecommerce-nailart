# Vercel Deployment Guide: Luxe Nail Art

Follow these steps to deploy your Luxe Nail Art application to Vercel.

## 1. Push to GitHub
Vercel works best with a Git provider.
1. Create a new repository on [GitHub](https://github.com/new).
2. Initialize your local project and push:
   ```bash
   git init
   git add .
   git commit -m "Initialize project"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

## 2. Import to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New"** > **"Project"**.
3. Import your GitHub repository.

## 3. Configure Project Settings
Vercel should auto-detect **Vite**. If not, set:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## 4. Environment Variables
Add the following variables in the **Environment Variables** section:
- `GEMINI_API_KEY`: Your Google AI API Key.
- `APP_URL`: Your production URL (e.g., `https://luxe-nail-art.vercel.app`).

## 5. Deployment
Click **"Deploy"**. Vercel will build your site and provide a live URL.

---

### Important Note on Full-Stack Logic
Vercel is a **Serverless** platform. The `server.ts` file in this project is configured as a custom Express server, which **will not run** on Vercel by default. 

- **Static Site**: Your React/Vite frontend will work perfectly.
- **SPA Routing**: I have added a `vercel.json` file to the root. This ensures that when you refresh the page on a sub-route (like `/product/1`), Vercel correctly serves the app.
- **API Routes**: If you need back-end logic (like the `/api/health` check) to run on Vercel, you would need to move those routes into a `/api` directory as [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions).
