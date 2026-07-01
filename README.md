# Portfolio Tracker

Canlı hisse fiyatlarıyla kişisel portföyünü takip ettiğin sade bir web uygulaması. Backend yok, kayıt yok — sadece aç ve kullan.

## Özellikler

**Piyasa**
- Top 50 ABD hissesi canlı fiyatlarla
- Günlük kazananlar / kaybedenler
- Sembol arama (Finnhub)
- Üstte kayan ticker band

**Portföy**
- Hisse ekle: ticker + adet + alış fiyatı
- Toplam değer, günlük değişim, toplam P&L
- Her pozisyonda: canlı fiyat, günlük %, P&L
- Grafik modal (hisseye tıkla)
- Fiyat alarmı — hedef fiyata gelince tarayıcı bildirimi

**Genel**
- Otomatik yenileme (60 saniye)
- localStorage — veri tarayıcıda kalır
- Türkçe / İngilizce dil desteği
- Dark / Light tema

## Kurulum

```bash
cd mini-app
npm install
```

Finnhub'dan ücretsiz API key al: [finnhub.io/dashboard](https://finnhub.io/dashboard)

```bash
cp .env.example .env.local
```

`.env.local` dosyasına key'i yaz:

```
NEXT_PUBLIC_FINNHUB_API_KEY=your_key_here
```

```bash
npm run dev
```

`http://localhost:3000` aç.

## Stack

- Next.js 16 · React 19 · TypeScript
- Tailwind CSS v4
- Finnhub REST API (free tier — 60 call/dakika)
- localStorage (persistence, no DB)
