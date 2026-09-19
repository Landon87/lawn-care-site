# Emerald's Cuts - Deployment Guide

## Supabase Setup (One Time)

1. Go to https://supabase.com/dashboard/project/ktjyjgroqdfwztpyruve
2. Open **SQL Editor** (left sidebar)
3. Click **New Query**
4. Paste the entire contents of `supabase-schema.sql`
5. Click **Run**

### Get Your Anon Key
1. Go to **Project Settings** → **API**
2. Copy the **anon public** key (starts with `eyJhbGci...`)
3. You'll need this for the website to connect

## Environment Variables

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Build & Deploy

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Cloudflare Pages
# Upload the contents of the `dist/` folder
```

## What's Connected

| Feature | Before | After |
|---------|--------|-------|
| Booking Form | `mailto:` link (broken) | Saves to Supabase |
| Admin Dashboard | localStorage only | Supabase + localStorage fallback |
| Customer Database | Manual | Auto-built from bookings |
| Stats | Calculated locally | Live from database |
| Data Persistence | Browser only | Cloud database |

## Files Changed

- `src/App.jsx` - Booking form now submits to Supabase
- `src/lib/supabase.js` - New database client
- `public/admin.html` - Admin dashboard connects to Supabase
- `vite.config.js` - Added env support

## Fallback Behavior

If Supabase is unavailable, the site automatically falls back to localStorage so no leads are lost.
