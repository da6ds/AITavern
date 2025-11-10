# Deployment Guide

## For Testing with 5 People: Use Render (Easiest)

### Render Deployment (Recommended for small testing)

1. **Sign up at [Render.com](https://render.com)** (free tier is perfect for 5 users)

2. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect the `render.yaml` configuration

3. **Add Environment Variables:**
   - Go to your service → "Environment"
   - Add: `OPENAI_API_KEY` with your OpenAI API key

4. **Deploy:**
   - Click "Manual Deploy" or push to your repository
   - Render will automatically build and deploy

5. **Access your app:**
   - Render will give you a URL like: `https://aittrpg.onrender.com`

**Note:** The free tier sleeps after 15 minutes of inactivity, so the first request after inactivity will be slow (~30 seconds). Perfect for testing!

---

## Alternative: Cloudflare Pages (Frontend Only)

If you want to deploy just the frontend to Cloudflare Pages:

### Build Settings:
```
Framework preset: None (or Vite)
Build command: npm run build
Build output directory: dist/public
Root directory: /
Node version: 18
```

**Important:** You'll still need to deploy the backend separately (to Render, Railway, or Fly.io) and update the API endpoints in your frontend.

---

## Environment Variables Needed:

- `OPENAI_API_KEY` - Your OpenAI API key
- `NODE_ENV` - Set to `production`
- `PORT` - Usually auto-set by the platform

---

## Notes on In-Memory Storage:

Your app currently uses in-memory storage (`MemStorage`), which means:
- ✅ Simple and fast for testing
- ✅ No database setup needed
- ⚠️ Data resets when the server restarts
- ⚠️ Each user shares the same game state (not ideal for multiple concurrent users)

For production with real users, consider switching to a persistent database (Neon, Supabase, etc.).
