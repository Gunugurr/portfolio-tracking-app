# Founder Dashboard — Roadmap

## Phase 1 · Kurulum
- [ ] T01 — `dashboard.py` oluştur, basic `if __name__ == "__main__"` iskeleti
- [ ] T02 — `data/` klasörü + 3 seed JSON: `todos.json`, `stats.json`, `quotes.json`
- [ ] T03 — `todos.json` örnek içerik (3-4 todo, bazıları `done: true`)
- [ ] T04 — `stats.json` örnek içerik (views/likes/saves + delta)
- [ ] T05 — `quotes.json` 5-7 Türkçe Goatstarter tonu motivasyon

## Phase 2 · Yardımcı fonksiyonlar
- [ ] T06 — ANSI color helper: `c(text, code)` (cyan/orange/green/red/dim)
- [ ] T07 — Box drawing helper: `box_top(width)`, `box_mid(width)`, `box_bot(width)`
- [ ] T08 — Türkçe tarih helper: ay + gün isimleri map'i
- [ ] T09 — Selamlama helper: saate göre ("Günaydın"/"Merhaba"/"İyi akşamlar")

## Phase 3 · Sectionlar
- [ ] T10 — Header section: selamlama + tarih, cyan renkli, box içinde
- [ ] T11 — TODO section: `todos.json` oku, `[ ]`/`[x]` ile listele, done olanlar yeşil + strikethrough
- [ ] T12 — Stats section: `stats.json` oku, metric + delta göster, pozitif yeşil ↑ negatif kırmızı ↓
- [ ] T13 — Quote section: `quotes.json`'dan random seçim, italic gri, ◆ prefix

## Phase 4 · Polish
- [ ] T14 — Tüm sectionlar tek box içinde, sectionlar arası `├─┤` ayraç
- [ ] T15 — Genişlik dinamik (terminal `os.get_terminal_size().columns` veya sabit 60)
- [ ] T16 — README.md yaz: ne yapar, nasıl çalıştırılır, data dosyalarını nasıl düzenlerim

## Doğrulama
- [ ] T17 — `python3 dashboard.py` çalıştır, hata yok, ekran çizilsin
- [ ] T18 — Roadmap'teki tüm task'lar `[x]` olsun
