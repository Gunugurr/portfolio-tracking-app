# Claude Code `/goal` — YouTube Demo

Claude Code'un `/goal` komutunu gösteren 2 canlı demo. Komuta bir spec dosyası veriyorsun, o projeyi sıfırdan kuruyor.

---

## Ne Var Burada?

```
demo-yt-goal/
├── cli-dashboard/    ← Demo 1: Python CLI dashboard
├── mini-app/         ← Demo 2: Next.js portföy takip uygulaması
└── sunum/            ← Sunum (HTML slideshow)
```

---

## Demo 1 — Founder CLI Dashboard

Terminal'de çalışan kişisel sabah dashboard'u.

**Özellikler:**
- Saate göre selamlama (Günaydın / Merhaba / İyi akşamlar)
- Türkçe tarih (12 Mayıs 2026 · Sal)
- Günlük TODO listesi (`todos.json`)
- İçerik metrikleri — views, likes, saves (`stats.json`)
- Random motivasyon notu (`quotes.json`)
- ANSI renkleri + Unicode box drawing
- **Sıfır pip install** — sadece Python standart kütüphane

**Nasıl çalıştırılır:**

```bash
cd cli-dashboard
python3 dashboard.py
```

**Yapısı:**

```
cli-dashboard/
├── docs/
│   ├── PRD.md        ← Spec: ne yapıyor, neden
│   └── roadmap.md    ← Task listesi (/goal bunu takip etti)
├── data/
│   ├── todos.json
│   ├── stats.json
│   └── quotes.json
└── dashboard.py      ← Tek dosya, max 250 satır
```

---

## Demo 2 — Portföy Takipçisi (Next.js)

Canlı hisse fiyatlarını gösteren, localStorage'a kaydeden sade portföy uygulaması.

**Özellikler:**
- Hisse ekle: ticker + adet + alış fiyatı
- Finnhub API üzerinden canlı fiyat
- Toplam değer, günlük değişim, toplam P&L (yeşil/kırmızı)
- localStorage — backend yok, auth yok
- Dark theme, Türkçe UI

**Kurulum:**

```bash
cd mini-app
npm install
```

Finnhub'dan ücretsiz API key al: [finnhub.io](https://finnhub.io)

```bash
cp .env.example .env.local
# .env.local içine key'i yaz:
# NEXT_PUBLIC_FINNHUB_API_KEY=your_key_here
```

```bash
npm run dev
# → http://localhost:3000
```

**Stack:**
- Next.js 15 App Router
- TypeScript + Tailwind CSS
- Finnhub REST API (free tier, 60 call/dakika)
- localStorage (persistence)

---

## Sunum

```bash
# sunum/index.html dosyasını tarayıcıda aç
# ←/→  → slide geç
# N     → notlar panelini aç/kapat
# F     → tam ekran
```

---

## `/goal` Nasıl Kullanıldı?

Her demo klasöründe bir `docs/` var:
- `PRD.md` — ne yapılacak, neden, nasıl görünmeli
- `roadmap.md` — adım adım task listesi
- `CLAUDE.md` — stack kısıtları ve build kuralları

`/goal` bu dosyaları okuyarak projeyi sıfırdan kurdu. Tek komut, sıfır elle müdahale.

---

## Gereksinimler

| | |
|---|---|
| Claude Code | v2.1.139+ |
| Demo 1 | Python 3.8+ |
| Demo 2 | Node.js 18+ |

---

**[@esadcom](https://x.com/esadcom) · Goatstarter**
