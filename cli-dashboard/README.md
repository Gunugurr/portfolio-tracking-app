# Demo 1 — Founder Dashboard (CLI)

Pure Python 3 dashboard. Terminal'de `python3 dashboard.py` deyince kişisel sabah ekranını çiziyor.

## Build adımı (/goal ile)

```bash
cd ~/demo-yt-goal/cli-dashboard
claude --auto
```

Önce plan:
```
/plan docs/PRD.md ve docs/roadmap.md'yi oku. Bana özetle: kaç phase var, kaç task var, ilk hangi dosyayı oluşturacaksın.
```

Sonra goal:
```
/goal docs/PRD.md ve docs/roadmap.md'yi takip ederek Founder Dashboard'u sıfırdan kur. Her task'ı tamamlayınca roadmap.md'de [x] ile işaretle. CLAUDE.md'deki kuralları ihlal etme. Tüm task'lar tamamlanınca veya 40 turn sonra dur.
```

## Doğrulama

Build bitince:
```bash
python3 dashboard.py
```

Hata yok, dashboard ekranı temiz görünmeli.

## @esadcom · Goatstarter
