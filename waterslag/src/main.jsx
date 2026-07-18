// ══════════════════════════════════════════════════════════════════
//  MAIN — het startpunt van de app
//  Hier hangen we de React-app in de <div id="root"> uit index.html.
// ══════════════════════════════════════════════════════════════════

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);

// ── PWA: serviceworker registreren (alleen in de "gebouwde" versie) ──
// Tijdens ontwikkelen (npm run dev) laten we dit met rust, anders kan de
// browser oude versies vasthouden. In de online/gebouwde versie zorgt dit
// ervoor dat de app installeerbaar is op iPhone/iPad.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
