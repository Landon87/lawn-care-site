# Admin Dashboard Production Checklist

## Current State
- Admin page exists at `/admin.html`
- Uses localStorage for data (no database needed)
- Has fake/demo data and placeholder stats

## Tasks

### 1. Remove Fake Data
- [ ] Remove hardcoded customer entries (John Smith, Sarah Johnson, Mike Davis)
- [ ] Remove fake stats (24 submissions, 5 this week, 68% conversion)
- [ ] Show "No submissions yet" or "0" when empty
- [ ] Remove placeholder activity feed

### 2. Add Password Protection
- [ ] Simple login screen before dashboard
- [ ] Store password hash (not plaintext)
- [ ] Session persistence (stay logged in)
- [ ] Logout button

### 3. Real Stats Dashboard
- [ ] Total submissions (from localStorage)
- [ ] New leads count (status = "new")
- [ ] Contacted count
- [ ] Scheduled count
- [ ] This week's submissions
- [ ] Conversion rate calculation

### 4. Submissions Table
- [ ] Load real data from localStorage
- [ ] Sort by date (newest first)
- [ ] Search/filter functionality
- [ ] Status dropdown (New → Contacted → Scheduled → Completed)
- [ ] Delete with confirmation
- [ ] Export to CSV

### 5. Customer Database
- [ ] Auto-build from submissions
- [ ] Track visit count
- [ ] Last contact date
- [ ] Notes field

### 6. Settings
- [ ] Business info (name, phone, email, hours)
- [ ] Service areas list
- [ ] Email notification settings
- [ ] Auto-reply message

### 7. Mobile Responsive
- [ ] Sidebar becomes hamburger menu
- [ ] Tables scroll horizontally
- [ ] Cards stack on mobile

### 8. Data Backup/Export
- [ ] Export all data as JSON
- [ ] Import data (for restoring)
- [ ] Auto-export reminder

## Files to Modify
- `public/admin.html` - Main admin page
- `src/App.jsx` - Booking form (ensure data saves correctly)

## Notes
- Keep it simple - no external APIs needed
- All data stays in browser localStorage
- Export regularly to avoid data loss
