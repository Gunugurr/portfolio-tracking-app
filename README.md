# Demo 2 — Portföy Takipçisi

Next.js single-page app. Finnhub free API ile canlı hisse fiyatları + localStorage'da portföy.

## Önceden hazırlık (1 dakika)

1. `finnhub.io` aç → "Get free API key" → kopyala
2. Bu klasörde `.env.local` oluştur:
   ```bash
   cp .env.example .env.local
   ```
3. `.env.local`'i aç, `NEXT_PUBLIC_FINNHUB_API_KEY=` satırına key'ini yapıştır

## Build adımı (/goal ile)

```bash
cd ~/demo-yt-goal/mini-app
claude --auto
```

Önce plan:
```
/plan docs/PRD.md, docs/roadmap.md ve docs/design.md'yi oku. Bana özetle: ne kuracağız, kaç phase, kaç task. İlk adım ne.
```

Sonra goal:
```
/goal docs/PRD.md ve docs/roadmap.md'yi takip ederek portföy takipçisini sıfırdan kur. docs/design.md'yi renk ve typography için referans al. CLAUDE.md'deki kuralları ihlal etme. Her task'ı tamamlayınca roadmap.md'de [x] ile işaretle. Tüm task'lar tamamlanınca veya 60 turn sonra dur.
```

## Doğrulama

```bash
npm run dev
```

`http://localhost:3000` açılınca portföy ekranı görünmeli. AAPL, MSFT, NVDA gibi sembolleri ekle, canlı fiyatlar gelsin. Sayfa yenilenince veri kaybolmamalı.

## @esadcom
