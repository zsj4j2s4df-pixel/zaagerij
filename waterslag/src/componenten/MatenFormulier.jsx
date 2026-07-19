// ══════════════════════════════════════════════════════════════════
//  MATENFORMULIER — maten van één waterslag invoeren (in mm)
//  Bovenaan een klein voorbeeldtekeningetje dat laat zien wat
//  lengte, breedte, hoogte en hoek betekenen. Daaronder de vier
//  invoervelden met het numerieke toetsenbord (NumInp).
// ══════════════════════════════════════════════════════════════════

import React from "react";
import { C, F, NumInp, Label } from "../huisstijl.jsx";

export default function MatenFormulier({ maten, onChange, soort }) {
  // Eén veld wijzigen, de rest laten zoals het was.
  const zet = (veld) => (waarde) => onChange({ ...maten, [veld]: waarde });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Het voorbeeldtekeningetje hoort bij een waterslag; bij een dakkap
          laten we het weg (dat ziet er anders uit). De namen in het
          tekeningetje matchen de velden eronder. */}
      {soort !== "dakkap" && <MaatVoorbeeld />}

      {/* Twee kolommen naast elkaar; past mooi op een telefoonscherm. */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <Label>Lengte (mm)</Label>
          <NumInp value={maten.lengte} onChange={zet("lengte")} placeholder="bijv. 1200" />
        </div>
        <div>
          <Label>Breedte (mm)</Label>
          <NumInp value={maten.breedte} onChange={zet("breedte")} placeholder="bijv. 180" />
        </div>
        <div>
          <Label>Hoogte (mm)</Label>
          <NumInp value={maten.hoogte} onChange={zet("hoogte")} placeholder="bijv. 40" />
        </div>
        <div>
          <Label>Hoek (°)</Label>
          <NumInp value={maten.hoek} onChange={zet("hoek")} placeholder="bijv. 15" />
        </div>
      </div>
    </div>
  );
}

// ── Het voorbeeldtekeningetje ──────────────────────────────────────
// Links: de waterslag van voren gezien → daar meet je de LENGTE.
// Rechts: de doorsnede (zijkant) → daar zie je BREEDTE, HOOGTE en HOEK.
function MaatVoorbeeld() {
  return (
    <div style={{
      display: "flex", gap: 8, background: C.inset,
      border: `1.5px solid ${C.sep}`, borderRadius: 12, padding: "10px 6px 4px",
    }}>

      {/* ── Vooraanzicht: lengte ── */}
      <svg viewBox="0 0 140 92" style={{ flex: 1, minWidth: 0 }}>
        {/* de waterslag als lange lat */}
        <rect x="15" y="26" width="110" height="16" rx="2"
          fill={C.card} stroke={C.t3} strokeWidth="1.5" />
        {/* maatpijl voor de lengte */}
        <Pijl x1={15} x2={125} y={58} />
        <text x="70" y="74" textAnchor="middle" fontFamily={F} fontSize="11"
          fontWeight="700" fill={C.brand}>lengte</text>
        <text x="70" y="88" textAnchor="middle" fontFamily={F} fontSize="9"
          fill={C.t3}>gezien van voren</text>
      </svg>

      {/* ── Doorsnede: breedte, hoogte en hoek ── */}
      <svg viewBox="0 0 154 92" style={{ flex: 1, minWidth: 0 }}>
        {/* de doorsnede: schuin bovenvlak, voorkant links */}
        <polygon points="20,50 95,30 95,56 20,64"
          fill={C.card} stroke={C.t3} strokeWidth="1.5" strokeLinejoin="round" />
        {/* hoek: stippellijn horizontaal + boogje bij de knik */}
        <line x1="95" y1="30" x2="58" y2="30" stroke={C.t4}
          strokeWidth="1.2" strokeDasharray="3 3" />
        <path d="M 71,30 A 24 24 0 0 1 72,36" fill="none"
          stroke={C.brand} strokeWidth="1.5" />
        <text x="63" y="24" textAnchor="middle" fontFamily={F} fontSize="10"
          fontWeight="700" fill={C.brand}>hoek</text>
        {/* breedte-pijl onder de doorsnede */}
        <Pijl x1={20} x2={95} y={76} />
        <text x="57" y="90" textAnchor="middle" fontFamily={F} fontSize="10"
          fontWeight="700" fill={C.brand}>breedte</text>
        {/* hoogte-pijl rechts van de achterkant */}
        <Pijl x={108} y1={30} y2={56} verticaal />
        <text x="114" y="47" fontFamily={F} fontSize="10"
          fontWeight="700" fill={C.brand}>hoogte</text>
      </svg>
    </div>
  );
}

// Klein maatpijltje met punten aan beide kanten (horizontaal of verticaal).
function Pijl({ x1, x2, y, x, y1, y2, verticaal }) {
  const kleur = C.t2;
  if (verticaal) {
    return (
      <g stroke={kleur} strokeWidth="1.4" fill="none">
        <line x1={x} y1={y1} x2={x} y2={y2} />
        <polyline points={`${x - 3},${y1 + 5} ${x},${y1} ${x + 3},${y1 + 5}`} />
        <polyline points={`${x - 3},${y2 - 5} ${x},${y2} ${x + 3},${y2 - 5}`} />
      </g>
    );
  }
  return (
    <g stroke={kleur} strokeWidth="1.4" fill="none">
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <polyline points={`${x1 + 5},${y - 3} ${x1},${y} ${x1 + 5},${y + 3}`} />
      <polyline points={`${x2 - 5},${y - 3} ${x2},${y} ${x2 - 5},${y + 3}`} />
    </g>
  );
}
