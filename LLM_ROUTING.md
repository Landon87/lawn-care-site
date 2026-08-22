# LLM Routing Guide — Which Model to Use When

## Available Models & Keys

| Provider | Models | Key Status | Best For | Price Tier |
|----------|--------|-----------|----------|------------|
| **OpenAI** | GPT-4o, GPT-4, GPT-3.5, DALL-E 3, Whisper | ✅ `sk-proj-***ibYA` | Images, coding, complex reasoning, premium output | $$$ |
| **Kimi (Moonshot)** | kimi-k2.6, kimi-k2.5 | ✅ Default (me right now) | Long context, general chat, analysis | $$ |
| **Groq** | Llama 3.1, Mixtral, Gemma | ✅ `gsk_MK***llOa` | Fast/cheap inference, high volume, real-time | $ |
| **DeepSeek** | DeepSeek-V3, DeepSeek-Coder | ❌ No key yet | Cheap coding, reasoning, Chinese | $ |
| **ElevenLabs** | Voice models | ✅ `pNInz6obpgDQGcFmaJgB` | Text-to-speech, voice cloning | $$ |

---

## Routing Rules

### Use **OpenAI (GPT-4o)** when:
- 🎨 **Image generation** — DALL-E 3 is the only image model we have
- 💻 **Complex coding** — GPT-4o beats others at debugging, architecture, multi-file changes
- 🧠 **Hard reasoning** — math, logic puzzles, step-by-step analysis
- 📝 **Premium writing** — marketing copy, important emails, polished content
- 🔊 **Speech tasks** — Whisper for transcription, TTS alternatives
- 🏗️ **System design** — building architectures, planning complex systems

### Use **Kimi (Moonshot)** when:
- 💬 **General chat** — what we're doing right now (default)
- 📚 **Long documents** — Kimi has massive context window (256K tokens, up to 2M in some versions)
- 🔍 **Deep analysis** — reading lots of files, summarizing books, research
- 💰 **Cost-sensitive** — cheaper than OpenAI for long conversations
- 🌐 **Chinese content** — Kimi is strong with Chinese language/tasks
- 🏆 **Best long context** — Kimi is the king of context windows among models we have access to
- ⚠️ **Tool calling** — works but not as reliable as OpenAI/Groq

### Use **Groq** when:
- ⚡ **Speed matters** — fastest inference, great for real-time
- 💸 **High volume** — cheapest per token, good for bulk processing
- 🔄 **Simple tasks** — classification, extraction, formatting, summaries
- 🛠️ **Tool calling** — Groq is reliable for function calling (2nd best after OpenAI)
- 📞 **Lance AI voice** — already using Groq for the phone system

### Use **DeepSeek** when:
- 💰 **Cheapest option** — often 10x cheaper than OpenAI, competitive with Groq
- 💻 **Coding tasks** — DeepSeek-Coder is excellent at programming
- 🧮 **Math/reasoning** — strong at logic and step-by-step problems
- 🌐 **Chinese content** — native Chinese model, very strong with Mandarin
- 📊 **Data analysis** — good at structured reasoning
- **Need to get API key first** — not set up yet

### Use **ElevenLabs** when:
- 🎙️ **Voice output** — storytelling, voice messages, character voices
- 🎭 **Voice cloning** — replicating a specific voice

---

## Quick Decision Tree

```
Need images? → OpenAI (DALL-E 3)
Need voice? → ElevenLabs
Need it FAST and CHEAP? → Groq or DeepSeek
Need CHEAPEST possible? → DeepSeek
Need to read a whole book? → Kimi
Need best code quality? → OpenAI (GPT-4o) or DeepSeek
Just chatting? → Kimi (default)
```

---

## Examples

| Task | Pick | Why |
|------|------|-----|
| "Generate a logo" | OpenAI | DALL-E 3 |
| "Read this 100-page PDF and summarize" | Kimi | Long context |
| "Transcribe this audio file" | OpenAI | Whisper |
| "Fix this bug in my React app" | OpenAI | Best coding |
| "Categorize these 1000 emails" | Groq | Fast + cheap |
| "Tell me a story in a deep voice" | ElevenLabs | Voice |
| "Analyze this codebase" | Kimi | Long context + cheap |
| "Write a Stripe integration" | OpenAI | Complex code |
| "Cheap bulk processing" | DeepSeek | Cheapest per token |

---

## Auto-Switching Policy

**I should automatically switch models when the task clearly calls for it:**

- "Generate an image" → Switch to OpenAI (DALL-E 3)
- "Transcribe this audio" → Switch to OpenAI (Whisper)
- "Write complex code" / "Debug this" → Switch to OpenAI (GPT-4o)
- "Read this huge file/book" → Switch to Kimi (long context)
- "Process 1000 items" → Switch to Groq (fast + cheap)
- "Tell me a story in voice" → Use ElevenLabs

**I don't need to ask permission to switch.** Just do it and tell you which model I'm using.

**Exception:** If you explicitly say "use [model]" or "stay on [model]", respect that.

---

## Notes

- **Default model** for new sessions: Kimi (what I am now)
- **Override** with `/model <name>` if you want to switch mid-session
- **Cost priority**: DeepSeek < Groq < Kimi < OpenAI (cheapest to most expensive)
- **Quality priority**: OpenAI > DeepSeek ≈ Kimi > Groq (best to good-enough)
- **Speed priority**: Groq > DeepSeek > Kimi > OpenAI (fastest to slowest)
- **Coding priority**: OpenAI ≈ DeepSeek > Kimi > Groq
- **Long context priority**: Kimi > DeepSeek > OpenAI > Groq
- **Tool calling priority**: OpenAI > Groq > Kimi > DeepSeek

*Last updated: Aug 18, 2026*
