# Portföy Takipçisi — Design

## Color Palette
- `--bg`: #0D1117 (derin siyah, GitHub dark)
- `--bg-2`: #161B22 (card background)
- `--bg-3`: #1C2333 (input/elevated)
- `--line`: #21262D (border)
- `--text`: #E6EDF3 (primary)
- `--text-2`: #7D8590 (secondary)
- `--text-3`: #484F58 (muted)
- `--accent`: #F97316 (orange — CTA, accent)
- `--green`: #3FB950 (pozitif değişim, P&L+)
- `--red`: #F85149 (negatif değişim, P&L-)

## Typography
- Body: Inter, 14-16px
- Headlines: Inter bold, 24-32px, tight tracking
- Numbers (fiyat, P&L): JetBrains Mono (sayılar hizalı görünsün)
- Tickers: JetBrains Mono uppercase

## Spacing
- Page padding: 24px mobil, 48px desktop
- Card padding: 20px
- Card gap: 16px
- Table row padding: 14px vertical

## Shape
- Border radius: rounded-lg (8px) cards, rounded-md (6px) buttons
- Border: 1px solid var(--line)
- Hover: bg lightens to rgba(255,255,255,0.02)

## Components

### Summary Card
- Header: muted uppercase label (12px)
- Value: large mono number (32px)
- Delta: small (14px) with arrow + color
- Background: var(--bg-2), border, padding 20px

### Stock Row
- Compact, single line on desktop
- Left: ticker (mono bold orange) + name (text-2)
- Middle: price (mono) + delta % (colored)
- Right: qty · pozisyon (mono) · P&L (colored mono)
- Hover: row bg lightens, ✕ butonu görünür

### Add Stock Form
- 3 input yan yana (desktop), alt alta (mobil)
- Ticker input uppercase, max 5 char
- Qty input number, min 1
- BuyPrice input number, step 0.01
- EKLE butonu: orange bg, white text, bold

### Loading
- Skeleton: rgba(255,255,255,0.05) animasyonlu shimmer
- Spinner: orange, 24px

## Interaction
- Transitions: 150ms ease
- Focus: orange ring (ring-2 ring-orange-500/40)
- Disabled: opacity 0.4

## Anti-pattern
- Pastel renkler YOK
- Yuvarlak buton YOK (kare/rounded-md)
- Soft shadow YOK
- Emoji bombardımanı YOK
- Animasyon abartısı YOK
