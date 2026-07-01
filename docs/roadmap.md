# Portföy Takipçisi — Roadmap

## Phase 1 · Setup
- [x] T01 — `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-npm` (default seçimlerle)
- [x] T02 — `.env.example` dosyası: `NEXT_PUBLIC_FINNHUB_API_KEY=your_key_here`
- [x] T03 — `.gitignore`'a `.env.local` ekle
- [x] T04 — README.md yaz: nasıl kurulur, API key nereden alınır
- [x] T05 — `app/globals.css` dark theme base: bg #0D1117, text #E6EDF3
- [x] T06 — `app/layout.tsx` Türkçe lang, meta tags

## Phase 2 · API Layer
- [x] T07 — `lib/finnhub.ts`: `getQuote(symbol)` ve `getProfile(symbol)` fonksiyonları
- [x] T08 — Finnhub response type'ları (`Quote`, `Profile`)
- [x] T09 — Error handling: 401/429/404 için kullanıcı dostu mesaj
- [x] T10 — Loading state için promise wrapper

## Phase 3 · Storage Layer
- [x] T11 — `lib/storage.ts`: `getHoldings()`, `setHoldings()`, `addHolding(h)`, `removeHolding(symbol)`, `updateHolding(symbol, partial)`
- [x] T12 — `Holding` type: `{ symbol, name, qty, buyPrice, addedAt }`

## Phase 4 · Components
- [x] T13 — `components/Header.tsx`: app adı + son güncellenme zamanı + yenile butonu
- [x] T14 — `components/SummaryCard.tsx`: label + değer + delta (renkli)
- [x] T15 — `components/AddStock.tsx`: 3 input (ticker/qty/buyPrice) + EKLE butonu
- [x] T16 — `components/StockRow.tsx`: ticker, name, fiyat, % değişim, adet, pozisyon, P&L, ✕ butonu
- [x] T17 — `components/PortfolioTable.tsx`: StockRow'ları listele + boş state

## Phase 5 · Page
- [x] T18 — `app/page.tsx`: tüm component'leri birleştir, state yönetimi
- [x] T19 — Mount'ta localStorage'tan holdings oku
- [x] T20 — Mount'ta her holding için quote çek (Promise.all)
- [x] T21 — Add stock akışı: validate → fetch quote/profile → save → refresh
- [x] T22 — Remove stock akışı: localStorage update → state update
- [x] T23 — Refresh akışı: tüm tickerlar için quote re-fetch
- [x] T24 — Özet hesaplama (toplam değer, günlük Δ, toplam P&L)

## Phase 6 · Polish
- [x] T25 — Empty state: "Henüz hisse eklemedin. AAPL ekleyerek başla."
- [x] T26 — Loading skeleton (ilk yüklemede)
- [x] T27 — Error toast component
- [x] T28 — Para formatlama utility (currency + 2 decimal)
- [x] T29 — Yüzde formatlama (+%X.XX / -%X.XX)
- [x] T30 — Responsive: mobil için padding ve font ayarı
- [x] T31 — Favicon + page title "Portföy"

## Doğrulama
- [x] T32 — `.env.local` dosyasının kullanıcı tarafından doldurulmuş olması gerektiğini README'de açıkça yaz
- [x] T33 — `npm run dev` çalışsın, http://localhost:3000 açılınca app görünsün
- [x] T34 — AAPL, MSFT, NVDA ekle → canlı fiyat gelsin
- [x] T35 — Sayfa yenile → veri kaybolmasın (localStorage)
- [x] T36 — Yenile butonu → fiyatlar güncellensin
- [x] T37 — ✕ butonu → hisse silinsin
- [x] T38 — Tüm task'lar [x] olsun
