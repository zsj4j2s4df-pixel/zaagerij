// ══════════════════════════════════════════════════════════════════
//  RALKIEZER — een tekstveld voor een RAL-code met een kleurstaaltje.
//  Herkent de app de code, dan kleurt het staaltje mee; anders toont
//  het een neutraal vakje met "?". Gebruikt op het projectscherm
//  (kleur voor het hele project) en bij één onderdeel.
// ══════════════════════════════════════════════════════════════════

import React from "react";
import { C, F, TxtInp, Label } from "../huisstijl.jsx";
import { ralNaarHex } from "../ralKleuren.js";

export default function RalKiezer({ label, value, onChange, placeholder, hint }) {
  const hex = ralNaarHex(value);
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <TxtInp value={value || ""} onChange={onChange} placeholder={placeholder || "bijv. 7016"} />
        </div>
        {/* Het kleurstaaltje */}
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          border: `1px solid ${C.sep}`,
          background: hex || C.inset,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.t4, fontFamily: F, fontSize: 18, fontWeight: 700,
        }}>
          {/* Geen bekende kleur? Toon "?" (alleen als er iets is ingevuld) */}
          {!hex && value ? "?" : ""}
        </div>
      </div>
      {hint && <div style={{ fontSize: 12, color: C.t4, marginTop: 6 }}>{hint}</div>}
    </div>
  );
}
