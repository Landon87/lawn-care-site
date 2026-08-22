# MEMORY.md - Lance AI Project Knowledge

## About Landon (The Boss)
- Location: Jacksonville, Florida
- Timezone: Eastern Time (ET)
- Day job: Sales at ADT (8 AM - 4:30 PM)
- Side hustle: Blockchain developer, building Lance AI
- Named me after his older brother Lance who passed away

## The VPS (srv1338588)
- **IP:** 31.97.10.52
- **SSH Port:** 29847 (not 22!)
- **Lance (main OpenClaw):** Running there
- **I'm connected as a node to that VPS**

---

## Lance AI Business

### What Is Lance AI?
AI phone receptionist and automation for small businesses.
- Answers calls 24/7
- Takes messages
- Books appointments
- Captures leads
- Multi-industry (24 verticals)

### Live URLs
| Service | URL |
|---------|-----|
| **Main Site** | https://lanceai.io |
| **Admin Dashboard** | https://lanceai.io/admin/ (pw: lanceadmin2026!) |
| **Customer Dashboard** | https://lanceai.io/dashboard/ |
| **API** | https://api.lanceai.io |
| **Pricing** | https://lanceai.io/pricing |

### Tech Stack
- **Frontend:** Cloudflare Pages
- **Backend:** VPS (31.97.10.52:8882 API, 8888 Voice)
- **Database:** Supabase (PostgreSQL + pgvector)
- **Phone:** SignalWire
- **Payments:** Stripe (LIVE)
- **TTS:** ElevenLabs (eleven_flash_v2_5)
- **LLM:** Groq (llama-3.1-8b-instant)

### Pricing Plans
- **Starter:** $49/mo
- **Growth:** $99/mo
- **Pro:** $149/mo

### Main Phone Number
- (904) 293-0005 (SignalWire)

---

## Other Projects

### EchoFind (OSINT Platform)
- URL: https://echofind.pages.dev
- Internal: http://31.97.10.52:3000/batman
- Tools: Person search, breach check, photo geo, username, email, phone, IP, domain lookup

### Solana Trading Bot
- Wallet: Groc9R4pxtozZsYPZ3oGabphBzxgP8i7PCGwwBvjNCsU
- Features: Pump.fun sniper, migration sniper, copy trading, Jito MEV protection
- Location on VPS: /root/.openclaw/workspace/crypto/solana-bot/

### Websites Built
| Site | URL | Description |
|------|-----|-------------|
| Lance AI | https://lanceai.io | Main business site |
| EchoFind | https://echofind.pages.dev | OSINT platform |
| T-Time with Gailon | https://ttimewithgailon.pages.dev | T-shirt brand |
| I Spill The Tees | https://ispillthetees.netlify.app | T-shirt brand |

---

## API Keys (Don't share publicly!)

### Groq
- Key: [REDACTED - see local file]

### Cloudflare
- Token: fa4pn4qyFgcVUdehLTVN_LArqWWQZ0QNZm13zuRP

### Netlify
- Token: nfp_YAH6FfoqcxfDU74K6ZPN6dWr1CyaCL1N4ab3

### OpenAI (ChatGPT)
- Key: [REDACTED - see local file]
- Status: ✅ Working (verified Aug 22, 2026)

### ElevenLabs (Voice)
- Voice: Adam
- Voice ID: pNInz6obpgDQGcFmaJgB
- Model: eleven_turbo_v2_5

---

## How Wormhole0x Fits In

I'm connected to the VPS as a **node**. Lance (on the VPS) can:
- Run commands on me remotely
- Use my local network
- Control browsers on my machine
- Access files here

To reconnect if disconnected:
```bash
ssh -f -N -L 18790:127.0.0.1:18789 -p 29847 root@31.97.10.52
OPENCLAW_GATEWAY_TOKEN="ed6f5e654165c96519a28a72743bbeeb6f879355a8e94867" openclaw node run --host 127.0.0.1 --port 18790
```

---

*Last updated: April 2, 2026*
