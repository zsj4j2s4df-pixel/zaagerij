// ══════════════════════════════════════════════════════════════════
//  MATENFORMULIER — maten van één waterslag invoeren (in mm)
//  Vier velden: lengte, breedte, hoogte en hoek. Met een Label erboven
//  en het numerieke toetsenbord op de telefoon (NumInp).
// ══════════════════════════════════════════════════════════════════

import React from "react";
import { NumInp, Label } from "../huisstijl.jsx";

export default function MatenFormulier({ maten, onChange }) {
  // Eén veld wijzigen, de rest laten zoals het was.
  const zet = (veld) => (waarde) => onChange({ ...maten, [veld]: waarde });

  return (
    // Twee kolommen naast elkaar; past mooi op een telefoonscherm.
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
  );
}
