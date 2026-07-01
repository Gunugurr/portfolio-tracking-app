# Founder Dashboard — PRD

## Ne
Her sabah terminal'de `python3 dashboard.py` çalıştırınca beni karşılayan kişisel dashboard.

## Niye
Sabah açtığım ilk şey terminal. Email/IG açmadan, kafamda 4 şeyi tek ekrandan görmek istiyorum:
- Bugünün tarihi + selamlama (saate göre)
- Bugün için 3 TODO
- Dünkü içerik metrikleri (mock)
- Random motivasyon notu

## Çıktı (ekran taslağı)

```
┌─────────────────────────────────────────────┐
│  Günaydın, Esad. · 12 Mayıs 2026 · Sal      │
├─────────────────────────────────────────────┤
│  BUGÜN                                       │
│  [ ] VSL landing page kabuğunu kur          │
│  [x] /goal video çekildi                    │
│  [ ] Mezun case 1 edit                      │
├─────────────────────────────────────────────┤
│  DÜN İÇERİK                                  │
│  Views   12,400  ↑ %18                       │
│  Likes      890  ↑ %4                        │
│  Save        72  ↑ %22                       │
├─────────────────────────────────────────────┤
│  ◆  Sıfırdan ödeyen müşteriye.              │
└─────────────────────────────────────────────┘
```

## Kısıtlar
- Tek Python dosyası (`dashboard.py`)
- Sadece standart kütüphane (json, datetime, random, os)
- Hiç pip install YOK
- Veri `data/*.json` dosyalarından okunur
- Renk + box drawing manuel ANSI/Unicode

## Selamlama mantığı
- 05:00-12:00 → "Günaydın"
- 12:00-18:00 → "Merhaba"
- 18:00-05:00 → "İyi akşamlar"

## Tarih formatı
Türkçe ay isimleri + gün isimleri. Örnek: "12 Mayıs 2026 · Sal"

## Renkler
- Header: cyan
- Section başlıkları: orange (sarı)
- ✓ tamamlanmış todo: green strikethrough
- ↑ pozitif metrik: green
- Quote: italic gri
