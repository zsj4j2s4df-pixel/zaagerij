# Waterslag — inmeet-app

Web-app (React, PWA) om waterslagen / raamdorpels op locatie in te meten.
Gebouwd met dezelfde huisstijl als de zaagerij-app.

## Snel starten (testen op je computer)

Je hebt **Node.js** nodig (versie 18 of hoger). Check met: `node -v`.
Heb je dat nog niet? Download het op https://nodejs.org (kies "LTS").

Open een terminal in deze map (`waterslag/`) en typ:

```bash
npm install     # eenmalig: haalt de benodigde pakketten op
npm run dev     # start de app; open het adres dat verschijnt (bijv. http://localhost:5173)
```

Wil je op je **iPhone/iPad** testen terwijl je computer de app draait?
Start met `npm run dev -- --host` en open op je telefoon het "Network"-adres
dat in de terminal verschijnt (computer en telefoon op hetzelfde wifi).

## Wat werkt er nu al?

- **Loginscherm** — inloggen met "Ingelogd blijven" (controle is nog nep: elke invoer logt in).
- **Projectlijst** — overzicht van projecten + knop "Nieuw project".
- Projecten worden bewaard in de browser (localStorage).

## Nog te bouwen (volgende stappen)

- Projectscherm (maten, profielkiezer, foto's, opmerkingen).
- Instellingen-scherm (accentkleur, merknaam, teksten live aanpassen).

## Hoe de bestanden samenhangen

```
src/
  main.jsx            → start de app
  App.jsx             → CENTRAAL BREIN: ingelogd?, projecten, welk scherm
  opslag.js           → bewaren/ophalen in de browser (localStorage)
  huisstijl.jsx       → vaste kleuren + bouwstenen (Card, NumInp, PrimaryBtn, ...)
  schermen/
    LoginScherm.jsx   → scherm 1
    ProjectLijst.jsx  → scherm 2
```

Wil je later iets aanpassen? Noem gewoon het scherm, bijv. "pas ProjectLijst aan".
