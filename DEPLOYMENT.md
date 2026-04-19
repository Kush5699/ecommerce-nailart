# Deployment Guide: Luxe Nail Art

This e-commerce platform is built with a modern tech stack (React, Vite, Tailwind CSS, and Firebase). To deploy this application to a production environment, follow these steps.

## 1. Prerequisites
- A **Google/Firebase Account**.
- **Node.js** installed on your local machine.
- **Firebase CLI** installed (`npm install -g firebase-tools`).

## 2. Setting Up Firebase Production
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named **Luxe Nail Art**.
3. Enable **Authentication** and activate the **Google** sign-in provider.
4. Enable **Firestore Database** in **Production Mode**.
5. Copy your Firebase Configuration (apiKey, appId, etc.) into a new file on your local machine.

## 3. Local Preparation
1. Download the project ZIP or clone it from GitHub.
2. Run `npm install` to install all industrial-standard dependencies.
3. Replace the contents of `src/lib/firebase-applet-config.json` (or where your config is stored) with your production credentials.

## 4. Build for Production
Run the build command to generate an optimized, minified version of your site:
```bash
npm run build
```
This creates a `dist/` folder containing the static assets.

## 5. Deployment with Firebase Hosting
1. Login to Firebase:
   ```bash
   firebase login
   ```
2. Initialize Hosting:
   ```bash
   firebase init hosting
   ```
   - Select your project.
   - Set the public directory to `dist`.
   - Configure as a single-page app (Yes).
   - Do not overwrite `index.html`.
3. Deploy:
   ```bash
   firebase deploy --only hosting,firestore:rules
   ```

## 6. Going Live
- Your site will be available at `your-project-id.web.app`.
- You can connect a custom domain (e.g., `www.luxenailart.com`) via the Firebase Hosting dashboard.

---
**Industry Standard Features Included:**
- **Code Splitting**: Lazy-loaded routes for faster initial paint.
- **Persistence**: Cart data preserved via LocalStorage.
- **Security**: Robust Firestore rules and Error Boundaries.
- **SEO**: Meta tags and semantic HTML structure.
