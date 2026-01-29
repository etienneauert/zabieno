# Zabieno – Künstler-Website

React-Single-Page-Anwendung für die Künstler-Website **Zabieno** mit Galerien, Sprachumschaltung und geschütztem Künstlerlogin zur Bildverwaltung.

---

## Inhaltsverzeichnis

- [Tech-Stack](#tech-stack)
- [Projektstruktur](#projektstruktur)
- [Schnellstart](#schnellstart)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Funktionen im Überblick](#funktionen-im-überblick)
- [Architektur & wichtige Dateien](#architektur--wichtige-dateien)
- [Deployment (Vercel)](#deployment-vercel)
- [Bekannte Besonderheiten & Hinweise](#bekannte-besonderheiten--hinweise)
- [Scripts](#scripts)

---

## Tech-Stack

- **React 19** mit **Vite 7**
- **CSS-Module** für komponentenlokale Styles
- **GSAP** für die Pagereveal-Intro-Animation
- **ESLint** für Linting
- Deployment: **Vercel** (statische SPA)

---

## Projektstruktur

```
zabieno/
├── public/              # Statische Assets, 404.html
├── src/
│   ├── app/             # App.jsx, App.css (globaler Zustand, Layout)
│   ├── assets/          # Bilder (JPGs für Galerien)
│   ├── components/
│   │   ├── admin/       # AdminGallery (Bild-Upload/-Löschen im Künstlerlogin)
│   │   ├── layout/      # Header, Footer, Tabs, LanguageToggle, Overlays
│   │   └── ui/          # Lightbox, Pagereveal, ScrollToTop
│   ├── features/
│   │   └── galleries/   # GemaeldeGallery, FotografienGallery, AusstellungenGallery
│   ├── styles/          # index.css (globale Basis-Styles)
│   ├── utils/           # addedImages, deletedImages, passwordHash
│   └── main.jsx
├── index.html
├── vite.config.js
├── vercel.json          # SPA-Rewrites für Vercel
├── generate-password-hash.js   # Passwort-Hash für .env erzeugen
└── package.json
```

---

## Schnellstart

### Voraussetzungen

- **Node.js** (LTS empfohlen)
- **npm** (oder pnpm/yarn)

### Installation & Entwicklung

```bash
cd zabieno
npm install
npm run dev
```

Die App läuft unter `http://localhost:5173` (oder dem von Vite angezeigten Port).

### Build & Preview

```bash
npm run build
npm run preview
```

---

## Umgebungsvariablen

Für den **Künstlerlogin** wird ein Passwort-Hash benötigt. Die App liest nur Variablen mit dem Präfix `VITE_`.

### Lokale Entwicklung

1. Im Projektordner `zabieno` eine Datei `.env` anlegen (wird von Git ignoriert).
2. Passwort-Hash erzeugen:

   ```bash
   node generate-password-hash.js
   ```

3. Die Ausgabe (z. B. `VITE_ARTIST_PASSWORD_HASH=...`) in `.env` eintragen.

**Beispiel `.env`:**

```env
VITE_ARTIST_PASSWORD_HASH=<von generate-password-hash.js ausgegebener Hash>
```

### Vercel

Unter **Project → Settings → Environment Variables** die Variable `VITE_ARTIST_PASSWORD_HASH` mit dem gleichen Hash setzen. Nach Änderung einen neuen Deploy auslösen.

---

## Funktionen im Überblick

| Bereich | Beschreibung |
|--------|----------------|
| **Galerien** | Drei Tabs: Gemälde, Fotografien, Ausstellungen. Masonry-Layout, Klick öffnet Lightbox. |
| **Sprache** | DE/EN-Umschaltung über `LanguageToggle`; Texte in Komponenten/Overlays sprachabhängig. |
| **Footer** | Links öffnen Overlays: Kontakt, Über mich, „Andere über mich“, Impressum/Datenschutz, Künstlerlogin. |
| **Künstlerlogin** | Passwortgeschützter Bereich: Bilder pro Kategorie hochladen/löschen. Daten im `localStorage` (siehe Hinweise). |
| **Pagereveal** | Intro-Animation (GSAP) mit Logo/Name beim ersten Laden. |
| **Scroll-to-Top** | Button zum Hochscrollen erscheint beim Scrollen. |

---

## Architektur & wichtige Dateien

### Globaler Zustand (`App.jsx`)

- `activeTab` – aktiver Galerie-Tab (`gemaelde` | `fotografien` | `ausstellungen`)
- `lang` – Sprache (`de` | `en`)
- `isEditMode` – ob Künstlerlogin aktiv ist (nach erfolgreichem Login)

### Galerien

- **`features/galleries/`**  
  `GemaeldeGallery`, `FotografienGallery`, `AusstellungenGallery`: laden Bilder aus `assets/` und `utils/addedImages` (pro Kategorie), nutzen `deletedImages` für ausgeblendete Bilder. Masonry-Layout, Klick → `Lightbox`.

### Künstlerlogin & Admin

- **`overlays/KuenstlerloginOverlay.jsx`**  
  Login-Formular; Passwort wird mit `utils/passwordHash` gegen `VITE_ARTIST_PASSWORD_HASH` geprüft.
- **`admin/AdminGallery.jsx`**  
  Zeigt Bilder der gewählten Kategorie, Upload (Datei-Input), Löschen. Liest/schreibt über `addedImages.js` und `deletedImages.js`.

### Bilder „persistiert“ im Frontend

- **`utils/addedImages.js`**  
  Hinzugefügte Bilder (Base64 oder URL) im `localStorage` unter dem Key `zabieno_added_images`.
- **`utils/deletedImages.js`**  
  IDs von als „gelöscht“ markierten Bildern (z. B. aus dem ursprünglichen Set), damit sie in den Galerien nicht mehr angezeigt werden.

### Routing

- Single Page: Kein React Router. Vercel liefert für alle Pfade `index.html` aus (`vercel.json` Rewrites). Vite-`base`: bei Vercel-Deploy `/`, sonst z. B. `/zabieno/` (vgl. `vite.config.js`).

---

## Deployment (Vercel)

1. Projekt mit Vercel verbinden (Git-Integration).
2. **Root Directory**: auf `zabieno` setzen (falls Repo-Wurzel darüber liegt).
3. **Build**: `npm run build`, **Output**: `dist`.
4. **Environment Variable**: `VITE_ARTIST_PASSWORD_HASH` setzen.
5. `vercel.json` liegt bereits in `zabieno` und enthält die SPA-Rewrites (`(.*) → /index.html`).

Ohne korrekten `base` und ohne Rewrites kann nach dem Deploy eine leere weiße Seite erscheinen – dann prüfen, ob `vite.config.js` `base` für Vercel auf `/` steht und alle Routen auf `index.html` zeigen.

---

## Bekannte Besonderheiten & Hinweise

### Künstlerlogin – Speicherung der Bilder

- Hochgeladene Bilder und „gelöschte“ IDs liegen nur im **localStorage** des Browsers.
- Folge: nicht geräteübergreifend, nicht dauerhaft bei Cache-Löschung oder anderem Browser.
- Für echte Persistenz wäre ein Backend/Storage nötig (z. B. Vercel Blob, Supabase Storage, S3 + Serverless).

### Bild-Upload (AdminGallery)

- Der Upload-Button triggert ein verstecktes `<input type="file">`. Damit Klick und Öffnen des Dateidialogs zuverlässig funktionieren, wird `e.preventDefault()` / `e.stopPropagation()` genutzt; das Input ist per `display: none` bzw. vergleichbar ausgeblendet.
- Akzeptierte Formate: `accept="image/*,.png,.PNG"` (alle gängigen Bildformate inkl. PNG).

### Layout & Styling

- **Sticky Footer**: App-Layout mit Flexbox in `App.css`, sodass der Footer unten bleibt.
- **Lightbox**: Weiße Schrift, keine Bildmaße mehr in der Anzeige.
- **Pagereveal**: Eigenes Modul, Hintergrund weiß, hoher `z-index` für `.pageRevealName`, damit der Text über der Nav erscheint.
- **Footer-Links**: Auf kleinen Bildschirmen untereinander (`Footer.module.css`).

### Tabs

- Aktuell: Button-Design mit abgerundeten Ecken, keine Unterstreichungs-Animation.

---

## Scripts

| Befehl | Beschreibung |
|--------|----------------|
| `npm run dev` | Vite-Entwicklungsserver mit HMR |
| `npm run build` | Production-Build nach `dist/` |
| `npm run preview` | Lokale Vorschau des Builds |
| `npm run lint` | ESLint ausführen |
| `node generate-password-hash.js` | Gibt einen Zeilen-String für `VITE_ARTIST_PASSWORD_HASH` aus (in `.env` eintragen) |

---

Bei Fragen zur Struktur oder zum Einstieg: zuerst `App.jsx`, dann die Galerien in `features/galleries/` und die Footer-Overlays in `components/layout/overlays/` ansehen.
