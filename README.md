# GymTracker - Offline-First Mobile Workout & Routine Tracker (PWA)

A lightweight, modern, mobile-first **Progressive Web App (PWA)** built with **React**, **Vite**, and **TypeScript**, tailored for iPhone viewports (*Add to Home Screen*) and ready for free hosting on **GitHub Pages**.

It operates **100% offline**, features a full **Workout Plans / Routines** creator, automated **Private GitHub Cloud Sync**, and requires **zero App Store installation**.

---

## 📱 How to Install on iOS (iPhone)

Once deployed to your GitHub Pages (e.g., `https://<your-username>.github.io/appgym/`):

1. Open the URL in **Safari** on your iPhone.
2. Tap the **Share** button (the square icon with an upward arrow at the bottom of the screen).
3. Scroll down and select **"Add to Home Screen"**.
4. Tap **Add** in the top-right corner.

> [!TIP]
> A dumbbell icon will appear on your iPhone Home Screen. Tapping it opens GymTracker in **standalone full-screen mode** (without Safari address bars or browser chrome), with complete offline functionality at the gym even without cellular reception or Wi-Fi.

---

## ✨ Features

### 🏋️ Active Workout Logging
- **Live Set Tracking:** Log weight (kg), reps, and mark sets completed with one tap.
- **Previous Performance Guidance:** Displays previous session metrics for progressive overload tracking (*"Last: 80 kg × 8"*).
- **Set Types:** Quickly cycle set types: Normal, Warmup (**W**), Drop Set (**D**), and Failure (**F**).
- **Instant Plan Switching:** Start an empty workout and load or change a workout plan on the fly.
- **In-Workout Plan Sync:** When adding an exercise or adjusting sets during a routine-based workout, choose whether to update the underlying workout plan.
- **Safe Workout Cancel & Finish:** Quick access to finish or cancel at the top and bottom of the session, with workout notes and volume stats.

### 📋 Custom Workout Plans (Routines)
- **Dedicated Plans Tab:** Manage both custom routines and standard built-in presets (Push, Pull, Legs, Upper, Lower).
- **Custom Plan Builder:** Create routines with custom titles, descriptions, exercise order, and target sets per exercise (1–15 sets).
- **Tap-to-Edit:** Tap anywhere on a plan card to quickly inspect and modify its exercises and planned sets.
- **Exercise Reordering:** Move exercises up and down to match gym floor flow.

### ☁️ Private GitHub Cloud Sync (Gist)
- **100% Private Cloud Backup:** Back up all workouts, routines, and custom exercises to a **Secret Gist** on your personal GitHub account.
- **Automatic Background Sync:** Automatically updates your private Gist in the background whenever you finish a workout.
- **One-Tap Restore:** If Safari cache is wiped or you switch to a new phone, enter your token and restore your entire workout history in seconds.
- **Cross-Device Access:** Access your raw JSON backup directly on your PC at [gist.github.com](https://gist.github.com).

### 🔄 PWA In-App Updates & Offline Cache
- **Instant In-App Update:** Tap the Settings gear icon &rarr; **Update App** to fetch the latest code from GitHub Pages and clear stale assets.
- **Confirmation Toast:** Sleek confirmation popup (*"App Updated! Running latest version"*) appears right after refreshing.
- **Offline Reliability:** Service Worker caches static assets while `localStorage` keeps all your workout data isolated and safe.

### 📊 Strength Analytics & Exercise Catalog
- **1RM Calculator:** Real-time One-Rep Max (**1RM**) estimation using the validated Epley formula.
- **All-Time PR Tracking:** Tracks personal records (PRs) per exercise.
- **Summary Metrics:** Total volume (tonnage in kg or tons), workout counts, and workouts completed this month.
- **35+ Built-in Exercises:** Categorized by muscle groups (Chest, Back, Legs, Shoulders, Arms, Core) and equipment (Barbell, Dumbbell, Cable, Machine, Bodyweight).
- **Custom Exercises:** Add new exercises with custom equipment and notes.

---

## 🔒 Private GitHub Cloud Sync Setup

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens).
2. Click **Generate new token** &rarr; select **Generate new token (classic)**.
3. In the **Note** field, enter `GymTracker Backup`.
4. Under **Expiration**, select `No expiration` (or desired timeframe).
5. In scopes, check **only one box: `[x] gist`** (no repository or private code access needed).
6. Click **Generate token** and copy the `ghp_...` token.
7. Open GymTracker on your phone &rarr; tap **Settings (gear icon)** &rarr; **GitHub Cloud Sync** &rarr; paste the token and tap **Backup Now to GitHub**.

---

## 🚀 GitHub Pages Deployment

The repository includes an automated GitHub Actions deployment workflow located at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Enabling GitHub Pages:
1. Open your repository on [GitHub.com](https://github.com).
2. Go to **Settings** &rarr; **Pages** (in the left sidebar).
3. Under **Build and deployment** &gt; **Source**, select:
   👉 **GitHub Actions**
4. Push a new commit (or manually trigger the workflow in the **Actions** tab).
5. Your live app is available at `https://<your-username>.github.io/appgym/`.

---

## 🛠️ Tech Stack & Local Development

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Icons:** Lucide React
- **Architecture:** Clean Code / Modular Tab views (`WorkoutTab`, `RoutinesTab`, `ExercisesTab`, `HistoryTab`)
- **Storage:** Browser `localStorage` + Service Worker Cache + Private GitHub Gist API

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Run production build & typecheck
npm run build
```
