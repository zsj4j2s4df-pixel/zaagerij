// ══════════════════════════════════════════════════════════════════
//  PROFIELKIEZER — kies een standaard waterslag-profiel
//  De profielen staan als aantikbare kaartjes met een klein
//  doorsnede-tekeningetje. Daaronder detail-opties met schakelaars.
// ══════════════════════════════════════════════════════════════════

import React from "react";
import { C, F, NoteInp, Toggle } from "../huisstijl.jsx";

// De standaardprofielen. Wil je er een toevoegen? Zet hem in deze lijst.
// "lijn" is het doorsnede-tekeningetje (punten van een lijn in een vlak van 64×32).
export const PROFIELEN = [
  { id: "standaard", naam: "Standaard",    info: "Recht met afschot",       lijn: "6,10 46,22 46,28 41,28" },
  { id: "opkant",    naam: "Met opkant",   info: "Opstaande rand achter",   lijn: "10,4 10,12 48,24 48,29 43,29" },
  { id: "dubbel",    naam: "Dubbele knik", info: "Twee knikken",            lijn: "6,8 26,14 30,19 50,25 50,29" },
  { id: "vlak",      naam: "Vlak",         info: "Zonder afschot",          lijn: "6,16 50,16 50,23" },
];

export default function ProfielKiezer({ profiel, details, onKiesProfiel, onWijzigDetails }) {
  // Eén detail-schakelaar omzetten, de rest laten staan.
  const zetDetail = (veld) => (waarde) => onWijzigDetails({ ...details, [veld]: waarde });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ── De profiel-kaartjes (2 naast elkaar) ─────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {PROFIELEN.map(p => {
          const gekozen = p.id === profiel;
          return (
            <div
              key={p.id}
              onClick={() => onKiesProfiel(p.id)}
              style={{
                border: `2px solid ${gekozen ? C.brand : C.sep}`,
                background: gekozen ? C.inset : C.card,
                borderRadius: 12, padding: "12px 10px", cursor: "pointer",
                textAlign: "center", fontFamily: F,
              }}
            >
              {/* Het doorsnede-tekeningetje */}
              <svg viewBox="0 0 64 32" style={{ width: 56, height: 28 }}>
                <polyline
                  points={p.lijn} fill="none"
                  stroke={gekozen ? C.brand : C.t3}
                  strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              <div style={{ fontSize: 13, fontWeight: 700, color: gekozen ? C.brand : C.t1 }}>
                {p.naam}
              </div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{p.info}</div>
            </div>
          );
        })}
      </div>

      {/* ── Detail-opties met schakelaars ────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        <DetailRij tekst="Kopschotjes (eindstukken)">
          <Toggle on={details.kopschotjes} onChange={zetDetail("kopschotjes")} />
        </DetailRij>

        <DetailRij tekst="Extra detail toevoegen">
          <Toggle on={details.extraDetail} onChange={zetDetail("extraDetail")} />
        </DetailRij>

        {/* Alleen zichtbaar als "Extra detail" aanstaat: omschrijf het detail. */}
        {details.extraDetail && (
          <NoteInp
            value={details.extraDetailTekst}
            onChange={zetDetail("extraDetailTekst")}
            placeholder="Omschrijf het extra detail…"
          />
        )}
      </div>
    </div>
  );
}

// Eén rijtje: tekst links, schakelaar rechts.
function DetailRij({ tekst, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.t2 }}>{tekst}</span>
      {children}
    </div>
  );
}
