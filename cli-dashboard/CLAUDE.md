# Founder Dashboard — Build Rules

## Genel
Single-file Python CLI. Terminal'de çalışan kişisel dashboard.

## Kurallar
- Pure Python 3, **hiç pip install gerekmesin** (sadece standart kütüphane)
- Tek dosya: `dashboard.py` (max 250 satır)
- Veri dosyaları JSON, repo içinde (`data/` klasörü)
- ANSI renkleri için escape sequence kullan (rich/colorama YOK)
- Box drawing: Unicode karakterler (`┌─┐│└┘`)
- Türkçe metinler (UTF-8)
- Çalıştırma: `python3 dashboard.py`

## Dizin Yapısı (hedef)
```
cli-dashboard/
├── docs/
│   ├── PRD.md
│   └── roadmap.md
├── data/
│   ├── todos.json
│   ├── stats.json
│   └── quotes.json
├── dashboard.py
└── README.md
```

## Build Önceliği
roadmap.md'deki task'ları sırayla yap. Her task'ı tamamlayınca `[x]` ile işaretle.

## Doğrulama
Hepsi bittiğinde `python3 dashboard.py` çalışmalı, hata vermemeli, dashboard ekranı temiz çizmeli.
