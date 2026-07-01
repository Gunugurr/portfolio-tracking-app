# Portföy Takipçisi — PRD

## Ne
Kişisel hisse portföyü takip uygulaması. Hisse sembolü eklersin, canlı fiyat çekilir, alış fiyatınla karşılaştırılır, P&L gösterilir.

## Niye
Mevcut tool'lar (Yahoo Finance, Investing.com) ağır + reklam dolu. Sade, dark, tek sayfa: portföyünü gör, ekle, çıkar. Bu kadar.

## Ekran Yapısı

```
┌────────────────────────────────────────────────────────────┐
│  Portföy                                                    │
├────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ TOPLAM       │  │ GÜNLÜK Δ     │  │ TOPLAM P&L   │      │
│  │ $ 12,450     │  │ + $ 142.30   │  │ + $ 1,820    │      │
│  │              │  │ + %1.17      │  │ + %17.1      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  [ AAPL ▸ ] [ Adet: 10 ] [ Alış: 180.00 ]  [ + EKLE ]      │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐│
│  │ AAPL · Apple Inc      $ 224.50  +%1.2  10 · $1,820 P&L ││
│  │ MSFT · Microsoft      $ 412.10  -%0.4   5 · $-120  P&L ││
│  │ NVDA · NVIDIA Corp    $ 138.40  +%3.1   8 · $+220  P&L ││
│  └────────────────────────────────────────────────────────┘│
│                                                             │
│  [ ↻ Yenile ]                  Son güncellenme: 14:32      │
└────────────────────────────────────────────────────────────┘
```

## Özellikler

### 1. Hisse Ekleme
- Üç input: ticker (örn. AAPL), adet, alış fiyatı
- "EKLE" butonuna basınca:
  - Finnhub `/quote` ve `/profile2` çağrılır
  - Geçersiz ticker → hata mesajı
  - Geçerli → portföye eklenir, localStorage'a yazılır

### 2. Portföy Tablosu
Her satır:
- Ticker + şirket adı
- Mevcut fiyat (Finnhub'dan)
- Günlük % değişim (yeşil/kırmızı)
- Adet
- Pozisyon değeri (adet × mevcut fiyat)
- P&L (mevcut - alış) × adet (yeşil/kırmızı)
- ✕ butonu (hover'da görünür, sil)

### 3. Özet Kartlar (Üstte, 3 tane)
- **Toplam Değer:** tüm pozisyonların toplamı
- **Günlük Değişim:** tüm hisselerin günlük Δ toplamı + %
- **Toplam P&L:** (mevcut - alış) × adet, hepsi toplamı + %

### 4. Yenileme
- Manuel "↻ Yenile" butonu — tüm tickerlar için quote yeniden çek
- Son güncellenme zamanı göster
- Otomatik yenileme YOK (rate limit + sadelik)

### 5. Persistence
- localStorage key: `portfoy_holdings`
- Yapı: `[{ symbol, name, qty, buyPrice, addedAt }]`
- Quote verisi cache'lenmez (her yenilemede fresh)

## Edge Cases
- API down → "Veri çekilemedi, tekrar dene" toast
- Geçersiz ticker → "Bu ticker bulunamadı"
- Boş portföy → "Henüz hisse eklemedin. AAPL gibi bir sembol ekle."
- Negatif/sıfır adet → input validation
- Aynı ticker iki kez eklenebilir mi? → Hayır, mevcut pozisyonu update et

## Kısıtlar
- Sadece Finnhub free tier (60 call/dakika yeter)
- Backend yok
- Auth yok
- Tek user, tek tarayıcı
- Hisse listesi US market öncelikli (Finnhub free tier'ı en iyi US destekliyor)

## Boyut
Hedef: ~600 satır toplam kod, 5-6 component, 2 lib dosyası.
