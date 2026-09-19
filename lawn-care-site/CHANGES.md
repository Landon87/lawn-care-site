# Changes Made - Sep 19, 2026

## Phone Number Updated
- Changed from `(904) 555-0123` → `(904) 575-7836`
- Updated in default business settings (App.jsx)
- Admin settings default updated in schema

## Admin Dashboard → Website Sync

### New: Pricing Management Tab
- Added "Pricing" tab to admin sidebar
- Admin can now:
  - Add new services with price
  - Edit existing service names/descriptions/prices
  - Reorder services (drag up/down)
  - Delete services
  - Changes save to Supabase and reflect instantly on website

### Business Settings Sync
- Phone, email, hours, address now load from Supabase settings table
- Admin changes in Settings tab update website automatically
- Website falls back to defaults if Supabase is unavailable

## Database Schema Updates

### New Table: `pricing`
```sql
pricing (
  id UUID PRIMARY KEY,
  service TEXT NOT NULL,      -- "Lawn Mowing"
  desc TEXT,                   -- "Starting price, varies by yard size"
  price TEXT NOT NULL,         -- "$49+"
  sort_order INTEGER,          -- display order
  is_active BOOLEAN DEFAULT true,
  created_at, updated_at
)
```

### Updated Table: `settings`
- Added `address` field
- Default phone now `(904) 575-7836`

## Files Modified
- `src/App.jsx` - Dynamic business info & pricing from Supabase
- `src/lib/supabase.js` - Added pricing CRUD functions
- `public/admin.html` - New Pricing tab + management UI
- `supabase-schema.sql` - Added pricing table + updated defaults

## How It Works
1. Website loads → fetches settings & pricing from Supabase
2. Admin updates pricing in dashboard → saves to Supabase
3. Next website visitor sees updated prices instantly
4. If Supabase is down → uses default fallback values

## Next Steps
1. Run updated schema in Supabase SQL Editor
2. Deploy updated site
3. Test: Change a price in admin, reload website, verify change
