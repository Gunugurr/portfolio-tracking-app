# Portföy Takipçisi — Build Rules

## Genel
Tek sayfalık Next.js app. Finnhub API ile canlı hisse fiyatları çekiyor. Kullanıcının portföyü localStorage'a kaydediliyor (backend yok).

## Stack
- Next.js 15 App Router — `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-npm`
- TypeScript
- Tailwind CSS
- Finnhub REST API (free tier — 60 call/dakika)
- localStorage (no DB, no auth)
- Native fetch (no axios/swr — sade tut)

## API
**Endpoint baz URL:** `https://finnhub.io/api/v1`
**Auth:** `?token=$FINNHUB_API_KEY` query param

Kullanılacak endpoint'ler:
- `GET /quote?symbol=AAPL&token=...` → `{ c, d, dp, h, l, o, pc, t }` (current, change, % change, high, low, open, prev close)
- `GET /stock/profile2?symbol=AAPL&token=...` → `{ name, logo, ticker, currency, finnhubIndustry }`

API key environment'tan oku: `process.env.NEXT_PUBLIC_FINNHUB_API_KEY`
**ASLA** kodda hardcode etme, .env.local'dan oku.

## Kurallar
- Türkçe UI
- Em dash kullanma, virgül/nokta
- Dark theme — accent orange (#F97316)
- Tüm para gösterimleri 2 ondalık + currency code (örn. "$ 245.32")
- Pozitif değişim yeşil (#3FB950), negatif kırmızı (#F85149)
- Loading state'ler şart (spinner veya skeleton)
- Error handling: API down ise kullanıcıya temiz hata mesajı
- localStorage key prefix: `portfoy_`

## Dizin Yapısı (hedef)
```
mini-app/
├── docs/PRD.md, roadmap.md, design.md
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       └── quote/route.ts   (opsiyonel proxy)
├── components/
│   ├── Header.tsx
│   ├── PortfolioTable.tsx
│   ├── AddStock.tsx
│   ├── StockRow.tsx
│   └── SummaryCard.tsx
├── lib/
│   ├── finnhub.ts
│   └── storage.ts
├── .env.local        (commit ETME, .gitignore'a ekle)
├── .env.example
├── package.json
└── README.md
```

## Build Önceliği
roadmap.md'deki task'ları sırayla yap. Her task'ı tamamlayınca `[x]` ile işaretle.

## Doğrulama
`npm run dev` çalışmalı, `http://localhost:3000` açılınca portföy ekranı görünmeli. Bir hisse ekle (örn. AAPL), canlı fiyat gelsin. Sayfayı yenile, veri kalsın.
