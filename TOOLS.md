# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

---

## Lance AI Scraper (VPS-hosted)

### Endpoint
- **URL:** https://api.lanceai.io/api/scrape
- **Method:** POST
- **Auth:** None required (internal use)

### Usage
```bash
# Single URL
curl -X POST https://api.lanceai.io/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Multiple URLs
curl -X POST https://api.lanceai.io/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://site1.com", "https://site2.com"]}'
```

### Features
- **Stealth Browser v2** - Bypasses bot detection (X, Reddit, Facebook)
- **AI-powered extraction** - Uses Groq to intelligently parse content
- **Auto industry detection** - Knows if it's a restaurant, law firm, etc.
- **Ghost cursor** - Human-like mouse movements
- **Session persistence** - Saves cookies

### Response
```json
{
  "success": true,
  "data": {
    "title": "Page Title",
    "content": "Extracted text...",
    "industry": "detected_industry",
    "extracted": { ... }
  }
}
```

### VPS Files
- Scraper: `/opt/lance-phone-service/api/routes/scraper.js`
- Stealth Browser: `/opt/lance-phone-service/lib/stealth-browser.js`

---

## Facebook Browser Automation (VPS)

### Commands (via Lance on VPS)
- "Check my Facebook" → Returns follower count
- "Share Lance AI post" → Shares to profile
- "Post to Facebook: [msg]" → Posts to timeline
- "FB comments" → Checks for comments

### Files
- `/opt/lance-phone-service/lib/fb-commands.js`
- Cookies: `/opt/lance-phone-service/data/fb-cookies.json`

### Credentials
- Email: gclef_taw@yahoo.com
- Page: facebook.com/Lanceai4landon

---

## VPS API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/scrape` | POST | AI web scraper |
| `/api/numbers/search` | GET | Search phone numbers |
| `/api/numbers/buy` | POST | Provision number |
| `/api/customers` | GET | List customers |
| `/voice/incoming` | POST | SignalWire webhook |
| `/sms/incoming` | POST | SMS webhook |

### Base URLs
- **API:** https://api.lanceai.io
- **Direct VPS:** http://31.97.10.52:8882

