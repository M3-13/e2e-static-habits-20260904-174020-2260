# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Ruhiges, produktivitätsorientiertes Hell-Dunkel-System im Stil von Linear/Stripe: warm-neutrale Flächen, dunkles Blaugrau für Text und ein sattes Grün als Erfolgsakzent für Häkchen und primäre Aktionen.

## Colors

- `--color-bg`: **#FAFAF8**
- `--color-fg`: **#1A1F2E**
- `--color-accent`: **#1B8A4B**
- `--color-border`: **#E3E5E1**
- `--color-muted`: **#6B7280**
- `--color-surface`: **#FFFFFF**
- `--color-danger`: **#DC2626**
- `--color-bg_dark`: **#10131A**
- `--color-fg_dark`: **#E7EAF0**
- `--color-accent_dark`: **#34D399**
- `--color-border_dark`: **#2A2F3A**
- `--color-muted_dark`: **#8A94A6**
- `--color-surface_dark`: **#161B24**
- `--color-danger_dark`: **#F87171**

## Typography

- `font_family`: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
- `heading_weight`: 600
- `body_weight`: 400

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px

## Border-Radii

- `--radius-sm`: 6px
- `--radius-md`: 10px
- `--radius-lg`: 16px
- `--radius-pill`: 999px

## Components

### Button

Primäraktion. padding 10px 16px, min-height 44px, radius md (10px), font-weight 600, font-size 14px, border none, color #FFFFFF, bg accent (#1B8A4B); hover bg #15703B (accent +10% lightness); active bg #125F32 und transform translateY(1px); disabled opacity 0.45, cursor not-allowed; focus-visible outline 2px #2563EB, offset 2px; Dark Mode bg accent_dark (#34D399), color #10131A, hover #5FE0B0.

### ButtonSecondary

Sekundär-/Ghost-Aktion. padding 10px 16px, min-height 44px, radius md, font-weight 600, font-size 14px, bg surface, border 1px solid border, color fg; hover bg bg (#FAFAF8), border #C6C9C4; active transform translateY(1px); disabled opacity 0.45; focus-visible outline 2px #2563EB; Dark Mode bg surface_dark, color fg_dark, border border_dark, hover bg #1E242E.

### IconButton

Kompakte Symbolaktion (z. B. Archivieren/Löschen). 44x44px, display inline-flex, zentriert, radius md, bg transparent, color muted, font-size 16px; hover bg bg, color fg; active transform scale(0.97); focus-visible outline 2px #2563EB; Dark Mode hover bg #1E242E, color fg_dark.

### Input

Einzeiliges Eingabefeld. height 44px, padding 0 12px, radius md, border 1px solid border, bg surface, color fg, font-size 14px; placeholder color muted; focus border accent, box-shadow 0 0 0 3px rgba(27,138,75,0.18); invalid border danger; Dark Mode bg surface_dark, color fg_dark, border border_dark, focus border accent_dark, box-shadow rgba(52,211,153,0.18).

### Card

HabitCard als Inhaltscontainer. bg surface, border 1px solid border, radius lg (16px), padding 16px, box-shadow 0 1px 2px rgba(16,19,26,0.04); Dark Mode bg surface_dark, border border_dark.

### CheckCell

Rasterzelle des 30-Tage-Rasters. min-width 36px, min-height 36px, radius sm (6px), border 1px solid border, bg bg; checked: bg accent, border accent, weißes Häkchen (SVG/✓) zentriert; hover: border accent, bg rgba(27,138,75,0.10); heute: border 2px solid accent, ungecheckt bg surface; focus-visible outline 2px #2563EB; Dark Mode checked bg accent_dark mit dunklem Häkchen, hover bg rgba(52,211,153,0.12).

### ToggleSwitch

Dark-Mode-Umschalter. 44x24px, radius pill, Thumb 18x18px, radius pill, transition 150ms; off bg border, on bg accent; Thumb #FFFFFF mit 1px Schatten; focus-visible outline 2px #2563EB; Dark Mode on bg accent_dark, Thumb #10131A.

### Stat

Statistik-Wert (Serie/Quote). Label 12px, color muted; Wert 16px, font-weight 600, color fg; Abstand Label zu Wert 4px; nebeneinander in Reihe mit gap 16px; Dark Mode color fg_dark.

### SegmentedControl

Filter für aktiv/archiviert. display inline-flex, bg bg, border 1px solid border, radius md, padding 2px; Segment padding 8px 16px, min-height 36px, radius sm, font-size 14px, color muted; aktives Segment bg surface, color fg, font-weight 600, box-shadow 0 1px 2px rgba(16,19,26,0.06); Dark Mode bg surface_dark, border border_dark, aktives Segment bg #1E242E, color fg_dark.

### EmptyState

Leerzustand. zentriert, max-width 360px, margin 48px auto, Icon 48px color muted, Heading 20px/600 color fg, Text 14px color muted, Abstand 8px, primärer Button darunter; Dark Mode Heading color fg_dark.

### ConfirmDialog

Bestätigungsdialog (Löschen). Overlay rgba(16,19,26,0.5), zentriert; Panel max-width 420px, width calc(100% - 32px), bg surface, radius lg, padding 24px, shadow 0 12px 32px rgba(16,19,26,0.18); Titel 18px/600; Text 14px color muted; Aktionen rechts mit ButtonSecondary + Button, gap 8px; Dark Mode Panel bg surface_dark, Text fg_dark.

### Alert

Inline-Fehlermeldung (z. B. Importfehler). padding 12px 16px, radius md, border 1px solid rgba(220,38,38,0.30), bg rgba(220,38,38,0.10), color #B91C1C, font-size 14px; Dark Mode color #FCA5A5, bg rgba(248,113,113,0.12).

## Layout Principles

- App-Container: max-width 960px, margin 0 auto, padding 16px (Mobile) / 24px (ab 640px).
- Breakpoints: Basis <640px (Mobile), ≥640px Tablet, ≥960px Desktop.
- Vertikales Layout: Header (Titel + Aktionen), Eingabezeile, Filter, HabitCards mit gap 16px; Sektionen mit margin-bottom 24px.
- Header: Titel links, rechts Dark-Toggle und Export/Import als IconButtons; auf Mobile Aktionen in zweite Zeile.
- 30-Tage-Raster: 30 Spalten, Zellen min 36px, gap 4px; auf <640px horizontal scrollbar (overflow-x auto) mit sichtbarem Fokus; Desktop vollständig sichtbar.
- Canvas-Diagramm: Breite 100%, Höhe 160px, devicePixelRatio-skalierte 2D-Zeichnung, Achsen-/Wochenlabels in muted, Balken in accent.
- Kontrast in beiden Modi mind. WCAG AA; Fokus immer sichtbar per 2px Outline.
