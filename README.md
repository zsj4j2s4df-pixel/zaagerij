# Waterslag

Web-app (PWA) om **waterslagen (raamdorpels) en dakkappen in te meten op locatie**.
Installeerbaar op telefoon/tablet; metingen worden lokaal op het apparaat bewaard.

De app staat in de map [`waterslag/`](waterslag/) — een React + Vite-project.

## Online zetten

De app draait op **GitHub Pages** en wordt **automatisch gepubliceerd** bij elke
push naar `main` (workflow: [`.github/workflows/deploy-waterslag.yml`](.github/workflows/deploy-waterslag.yml)).
Er is geen handmatige stap of token nodig.

## Lokaal draaien

```sh
cd waterslag
npm install
npm run dev      # ontwikkelserver
npm run build    # productie-build naar waterslag/dist
```

## Huisstijl

De standaard-accentkleur (huiskleur) staat in
[`waterslag/src/huisstijl.jsx`](waterslag/src/huisstijl.jsx) (`ACCENT_STANDAARD`)
en is in de app zelf aan te passen via **Instellingen → Accentkleur**.
