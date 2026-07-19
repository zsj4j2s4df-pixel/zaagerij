// ══════════════════════════════════════════════════════════════════
//  PROFIELKIEZER — kies een profiel voor deze meting
//  De keuzelijst komt uit de instellingen (per soort waterslag/dakkap),
//  dus je kunt hem in het Instellingen-scherm aanpassen. Profielen met
//  een "lijn" tonen een klein doorsnede-tekeningetje; zelf toegevoegde
//  profielen (zonder lijn) tonen een neutraal icoontje.
//  Daaronder detail-opties met schakelaars.
// ══════════════════════════════════════════════════════════════════

import React from "react";
import { C, F, NoteInp, Toggle } from "../huisstijl.jsx";

export default function ProfielKiezer({ profielen, profiel, details, onKiesProfiel, onWijzigDetails }) {
  // Eén detail-schakelaar omzetten, de rest laten staan.
  const zetDetail = (veld) => (waarde) => onWijzigDetails({ ...details, [veld]: waarde });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ── De profiel-kaartjes (2 naast elkaar) ─────────────────── */}
      {profielen.length === 0 ? (
        <div style={{ fontFamily: F, fontSize: 13, color: C.t4, textAlign: "center", padding: "6px 0" }}>
          Nog geen profielen. Voeg ze toe in Instellingen.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {profielen.map(p => {
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
                {/* Tekeningetje als het profiel een "lijn" heeft, anders een stipje */}
                <svg viewBox="0 0 64 32" style={{ width: 56, height: 28 }}>
                  {p.lijn ? (
                    <polyline
                      points={p.lijn} fill="none"
                      stroke={gekozen ? C.brand : C.t3}
                      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    />
                  ) : (
                    <circle cx="32" cy="16" r="5" fill="none"
                      stroke={gekozen ? C.brand : C.t3} strokeWidth="3" />
                  )}
                </svg>
                <div style={{ fontSize: 13, fontWeight: 700, color: gekozen ? C.brand : C.t1 }}>
                  {p.naam}
                </div>
                {p.info && <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{p.info}</div>}
              </div>
            );
          })}
        </div>
      )}

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
