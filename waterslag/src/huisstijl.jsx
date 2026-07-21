// ══════════════════════════════════════════════════════════════════
//  HUISSTIJL — Waterslag-app
//  Overgenomen uit de Zaagerij-app zodat alles vertrouwd aanvoelt.
//  Importeer wat je nodig hebt, bv:  import { C, Card, NumInp, PrimaryBtn } from "./huisstijl.jsx";
// ══════════════════════════════════════════════════════════════════

import React from "react";

// De standaard-accentkleur. In het Instellingen-scherm kun je hem wijzigen;
// dat gebeurt via de CSS-variabele "--accent" (zie hieronder bij "brand").
export const ACCENT_STANDAARD = "#007AFF";

// ── 1. KLEUREN (design tokens) ───────────────────────────────────
// Eén centrale plek voor alle kleuren. De accentkleur ("brand") leest uit
// de CSS-variabele --accent, zodat het Instellingen-scherm hem live kan
// aanpassen. Staat die variabele niet, dan valt hij terug op het bruin.
export const C = {
  bg:     "#E8E3DD", // zachte beige achtergrond
  card:   "#FFFFFF", // witte kaarten
  brand:  "var(--accent, #007AFF)", // accentkleur — live instelbaar
  green:  "#34C759", // Apple-groen (gelukt / aan)
  orange: "#FF9500", // Apple-oranje (let op)
  red:    "#FF3B30", // Apple-rood (fout / verwijderen)
  t1:     "#1C1C1E", // tekst donker (koppen)
  t2:     "#48484A", // tekst medium
  t3:     "#6C6C70", // tekst licht (bijschriften)
  t4:     "#8E8E93", // tekst extra licht (placeholders)
  sep:    "#E2DBD1", // scheidingslijntjes / randen
  inset:  "#F4F0EA", // vulling van invoervelden
  shadow: "0 1px 3px rgba(0,0,0,0.08),0 4px 16px rgba(60,40,20,0.07)", // zachte kaartschaduw
};

// ── 2. LETTERTYPES ───────────────────────────────────────────────
export const F  = "-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif"; // gewone tekst (Apple-font)
export const FM = "'SF Mono','Fira Code','Courier New',monospace";                 // cijfers / maten (monospace)

// ── 3. KAART ─────────────────────────────────────────────────────
// De witte, afgeronde kaart met zachte schaduw. De basis van elke sectie.
export const Card = ({ children, style }) => (
  <div style={{ background: C.card, borderRadius: 16, padding: "20px 16px", boxShadow: C.shadow, ...style }}>
    {children}
  </div>
);

// ── 4. INVOERVELD VOOR MATEN (mm) ────────────────────────────────
// Numeriek toetsenbord op mobiel. "error" maakt de rand rood.
export function NumInp({ value, onChange, placeholder, error }) {
  return (
    <input
      type="number" inputMode="numeric" value={value}
      onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%", padding: "11px 12px", borderRadius: 10,
        border: `1.5px solid ${error ? C.red : C.sep}`, background: C.inset,
        fontFamily: FM, fontSize: 15, color: C.t1, outline: "none", boxSizing: "border-box",
      }}
    />
  );
}

// ── 5. INVOERVELD VOOR TEKST ─────────────────────────────────────
// Voor namen, klantnaam, omschrijving enz.
export function TxtInp({ value, onChange, placeholder }) {
  return (
    <input
      type="text" value={value}
      onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%", padding: "11px 12px", borderRadius: 10,
        border: `1.5px solid ${C.sep}`, background: C.inset,
        fontFamily: F, fontSize: 14, color: C.t1, outline: "none", boxSizing: "border-box",
      }}
    />
  );
}

// ── 6. OPMERKINGEN-VELD (meerdere regels) ────────────────────────
// Voor detail-opmerkingen bij foto's, project en het .sldprt-bestand.
export function NoteInp({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder || "Opmerking toevoegen…"} rows={3}
      style={{
        width: "100%", padding: "11px 12px", borderRadius: 10,
        border: `1.5px solid ${C.sep}`, background: C.inset,
        fontFamily: F, fontSize: 14, color: C.t1, outline: "none",
        boxSizing: "border-box", resize: "vertical",
      }}
    />
  );
}

// ── 7. PRIMAIRE KNOP (volle accentkleur) ─────────────────────────
// Voor de belangrijkste actie op een scherm: "Opslaan", "Inloggen".
export function PrimaryBtn({ onClick, children, disabled, icon }) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        width: "100%", padding: 14, borderRadius: 14, border: "none",
        background: disabled ? C.sep : C.brand, color: "#fff",
        fontFamily: F, fontWeight: 700, fontSize: 16,
        cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}
    >
      {icon} {children}
    </button>
  );
}

// ── 8. TWEEDE KNOP (omlijnd, pill-vorm) ──────────────────────────
// Voor secundaire acties: "Opslaan als", "Foto toevoegen".
export function SecondaryBtn({ onClick, children, icon, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "10px 16px", borderRadius: 20, border: `1px solid ${C.sep}`,
        background: C.inset, color: color || C.t2,
        fontFamily: F, fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
      }}
    >
      {icon} {children}
    </button>
  );
}

// ── 9. AAN/UIT SCHAKELAAR (zoals op de iPhone) ───────────────────
// Voor detail-opties: bv. "extra detail in solid part" aan/uit.
export function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)} aria-pressed={on}
      style={{
        width: 48, height: 29, borderRadius: 15, border: "none",
        background: on ? C.green : "#D1D1D6", position: "relative",
        cursor: "pointer", transition: "background .2s", flexShrink: 0, padding: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 2, left: on ? 21 : 2, width: 25, height: 25,
        borderRadius: "50%", background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)", transition: "left .2s",
      }}/>
    </button>
  );
}

// ── 10. LABEL BOVEN EEN VELD ─────────────────────────────────────
// Klein grijs bijschrift boven invoervelden.
export const Label = ({ children }) => (
  <div style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: C.t3, marginBottom: 6 }}>
    {children}
  </div>
);

// ══════════════════════════════════════════════════════════════════
//  Klaar. Deze bouwstenen matchen 1-op-1 met de zaagerij-app.
//  Voeg gerust nieuwe toe naarmate de app groeit.
// ══════════════════════════════════════════════════════════════════
