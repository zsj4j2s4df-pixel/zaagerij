// ══════════════════════════════════════════════════════════════════
//  PROFIELTEKENAAR — teken de zijkant (doorsnede) van een profiel.
//  Je tikt punten aan; de app verbindt ze met RECHTE lijnen. Zo maak
//  je snel de vorm van een waterslag of dakkap. De vorm wordt bewaard
//  als een lijst punten ("lijn") en verschijnt op de profielkaartjes.
//
//  De punten liggen in een vlak van 64 breed × 32 hoog — hetzelfde
//  formaat als de tekeningetjes in de ProfielKiezer, zodat het overal
//  gelijk oogt.
// ══════════════════════════════════════════════════════════════════

import React, { useRef } from "react";
import { C, F, SecondaryBtn } from "../huisstijl.jsx";

const BREED = 64, HOOG = 32;

// "lijn"-tekst ("x,y x,y ...") omzetten naar een lijst punten.
function leesPunten(lijn) {
  if (!lijn) return [];
  return lijn.trim().split(/\s+/).map(s => {
    const [x, y] = s.split(",").map(Number);
    return { x, y };
  }).filter(p => Number.isFinite(p.x) && Number.isFinite(p.y));
}
// Lijst punten terug naar "lijn"-tekst.
function schrijfPunten(punten) {
  return punten.map(p => `${p.x},${p.y}`).join(" ");
}

export default function ProfielTekenaar({ lijn, onChange }) {
  const svgRef = useRef(null);
  const punten = leesPunten(lijn);

  // Een tik op het tekenvlak → punt toevoegen op die plek.
  function voegPuntToe(e) {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    // Schermpositie omrekenen naar het 64×32-vlak, en binnen de rand houden.
    let x = ((e.clientX - rect.left) / rect.width) * BREED;
    let y = ((e.clientY - rect.top) / rect.height) * HOOG;
    x = Math.max(0, Math.min(BREED, Math.round(x * 2) / 2)); // op halve stapjes
    y = Math.max(0, Math.min(HOOG, Math.round(y * 2) / 2));
    onChange(schrijfPunten([...punten, { x, y }]));
  }

  function laatstePuntTerug() {
    onChange(schrijfPunten(punten.slice(0, -1)));
  }
  function wis() {
    onChange("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontFamily: F, fontSize: 12, color: C.t4 }}>
        Tik punten aan; de app verbindt ze met rechte lijnen.
      </div>

      {/* Het tekenvlak */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${BREED} ${HOOG}`}
        onPointerDown={voegPuntToe}
        style={{
          width: "100%", height: 150, touchAction: "none", cursor: "crosshair",
          background: C.inset, border: `1.5px solid ${C.sep}`, borderRadius: 12,
        }}
      >
        {/* Hulplijn onderaan (denkbeeldige "grond") */}
        <line x1="0" y1={HOOG - 1} x2={BREED} y2={HOOG - 1}
          stroke={C.sep} strokeWidth="0.5" strokeDasharray="2 2" />

        {/* De getekende vorm: rechte lijnen tussen de punten */}
        {punten.length >= 2 && (
          <polyline points={schrijfPunten(punten)} fill="none"
            stroke={C.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {/* De punten zelf als bolletjes */}
        {punten.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.6" fill={C.brand} />
        ))}
      </svg>

      {/* Knoppen: laatste punt terug + helemaal wissen */}
      <div style={{ display: "flex", gap: 8 }}>
        <SecondaryBtn onClick={laatstePuntTerug}>Laatste punt terug</SecondaryBtn>
        <SecondaryBtn onClick={wis} color={C.red}>Wissen</SecondaryBtn>
      </div>
    </div>
  );
}
