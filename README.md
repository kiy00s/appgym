# GymTracker - Offline-First Workout & Progressive Overload Tracker (PWA)

A lightweight, modern **Progressive Web App (PWA)** built with **React**, **Vite**, and **TypeScript**, designed for iPhone and mobile viewports.

It operates **100% offline**, installs directly to the iOS Home Screen without the App Store, and is ready for free hosting on **GitHub Pages**.

---

## 📱 How to Install on iOS (iPhone)

Once the application is deployed to your GitHub Pages (e.g., `https://<your-username>.github.io/appgym/`):

1. Open the URL in **Safari** on your iPhone.
2. Tap the **Share** button (the square icon with an upward arrow at the bottom of the screen).
3. Scroll down and select **"Add to Home Screen"**.
4. Tap **Add** in the top-right corner.

> [!TIP]
> A green dumbbell icon will appear on your iPhone Home Screen. Tapping it opens the app in **standalone full-screen mode** (without Safari address bars), with full offline support at the gym without requiring cellular reception or Wi-Fi.

---

## ✨ Features

- **100% Offline-First (PWA + Service Worker + LocalStorage):**
  - All workout logs, sets, and personal records (PRs) persist locally on your device.
  - Zero server lag, no login required, no cloud dependencies.
- **Comprehensive Exercise Catalog:**
  - 35+ default strength and hypertrophy exercises categorized by muscle groups (Chest, Back, Legs, Shoulders, Arms, Abs) and equipment (Barbell, Dumbbell, Machine, Cable, Bodyweight).
  - Instant live search and category filtering.
  - Ability to create custom exercises with equipment tags and execution notes.
- **Active Workout Session Logging:**
  - Real-time logging of weight (kg) and reps.
  - **Previous Benchmark Guidance (*POPRZEDNIO*):** Displays previous workout metrics for progressive overload tracking.
  - Set categorization: Normal, Warmup (W), Drop Set (D), Failure (F).
  - Quick set cloning (automatically copies last set's weight and reps).
- **Strength Analytics & 1RM Calculator:**
  - Automatic estimation of One-Rep Max (**1RM**) using the validated Epley formula.
  - All-time Personal Record (**PR**) tracking per exercise.
  - Total workout volume (tonnage in kg) and completed sets summary.
- **Data Backup & Restore:**
  - One-click JSON backup export and import directly from the application header.

---

## 🚀 GitHub Pages Deployment Setup

This repository includes an automated GitHub Actions deployment workflow located at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Enabling GitHub Pages in 2 Clicks:
1. Navigate to your repository on [GitHub.com](https://github.com).
2. Click **Settings** (gear icon on the top repository navigation).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment** > **Source**, change the dropdown to:
   👉 **GitHub Actions**
5. Go to the **Actions** tab and re-run the deployment workflow (or push a new commit via GitHub Desktop).
6. Your live PWA will be published at `https://<your-username>.github.io/appgym/`.

---

## 🛠️ Tech Stack & Local Development

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Icons:** Lucide React
- **Storage:** Offline browser storage (`localStorage` + Service Worker caching)

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Run production build & typecheck
npm run build
```
