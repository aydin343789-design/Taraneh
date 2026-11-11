# Taraneh Android build and API hosting

## Build the APK

The GitHub Actions workflow **Build Android APK** builds a debug APK from the feature branch. After a successful run, open the run's **Artifacts** section and download `taraneh-android-debug-apk`, then extract `app-debug.apk` and install it on Android.

## Publish the API (free-tier setup)

The Android package contains the UI; the Express API must be reachable over HTTPS for AI generation/editing. This repository includes `render.yaml` for a free-tier Render web service.

1. Sign in to Render and create a **Blueprint** from this repository/branch, or create a Node web service manually.
2. Use build command `npm install && npm run build` and start command `npm start`; set `NODE_ENV=production`.
3. Wait for the deploy to finish and confirm `https://YOUR-SERVICE.onrender.com/api/health` returns JSON with `ok: true`.
4. In the app, open the API key/settings dialog and paste the service's HTTPS base URL into **نشانی سرور برنامه (برای نسخه APK)**.
5. Enter your own provider keys in the app as before. Never commit API keys or paste them into public issues.

Free hosting has provider-specific limits and may sleep when idle. This setup does not guarantee unlimited AI usage; Groq, Cloudflare, Gemini and other providers have their own quotas. Keep the API URL on HTTPS.
