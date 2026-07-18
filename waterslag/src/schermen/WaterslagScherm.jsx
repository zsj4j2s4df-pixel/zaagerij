// ══════════════════════════════════════════════════════════════════
//  SCHERM 4 — WATERSLAGSCHERM (één waterslag bewerken)
//  Hier vul je alles in voor één type raam: naam + aantal, de maten,
//  het profiel, foto's en een opmerking. Staat het aantal op 3, dan
//  geldt deze regel voor 3 gelijke ramen.
// ══════════════════════════════════════════════════════════════════

import React from "react";
import { C, F, Card, TxtInp, NumInp, NoteInp, Label, PrimaryBtn, SecondaryBtn } from "../huisstijl.jsx";
import MatenFormulier from "../componenten/MatenFormulier.jsx";
import ProfielKiezer from "../componenten/ProfielKiezer.jsx";
import FotoLijst from "../componenten/FotoLijst.jsx";

export default function WaterslagScherm({ waterslag, onWijzig, onTerug, onVerwijder }) {
  const standaardNaam = `Waterslag ${waterslag.volgnummer || ""}`.trim();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: F }}>

      {/* ── Bovenbalk met terug-knop ────────────────────────────── */}
      <div style={{
        background: C.card, borderBottom: `1px solid ${C.sep}`,
        padding: "12px 14px", paddingTop: "calc(12px + env(safe-area-inset-top))",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <button
          onClick={onTerug}
          style={{ border: "none", background: "none", color: C.brand,
            fontFamily: F, fontSize: 15, fontWeight: 600, cursor: "pointer", padding: 4 }}
        >
          ← Project
        </button>
        <div style={{ fontSize: 17, fontWeight: 800, color: C.t1 }}>
          {waterslag.naam?.trim() || standaardNaam}
        </div>
      </div>

      {/* ── Inhoud ──────────────────────────────────────────────── */}
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16,
        maxWidth: 560, margin: "0 auto",
        paddingBottom: "calc(28px + env(safe-area-inset-bottom))" }}>

        {/* Naam + aantal. Het aantal is de kern van jouw werkwijze:
            3 gelijke ramen = deze regel één keer invullen met aantal 3. */}
        <Card>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <Label>Naam (mag leeg)</Label>
              <TxtInp
                value={waterslag.naam}
                onChange={(v) => onWijzig({ naam: v })}
                placeholder={standaardNaam}
              />
            </div>
            <div style={{ width: 110 }}>
              <Label>Aantal ramen</Label>
              <NumInp
                value={waterslag.aantal}
                onChange={(v) => onWijzig({ aantal: v })}
                placeholder="1"
              />
            </div>
          </div>
          <div style={{ fontSize: 12, color: C.t4, marginTop: 8 }}>
            Gelijke ramen? Vul ze hier één keer in en zet het aantal erbij.
          </div>
        </Card>

        {/* De maten (mm) */}
        <Card>
          <SectieKop>Maten</SectieKop>
          <MatenFormulier
            maten={waterslag.maten}
            onChange={(m) => onWijzig({ maten: m })}
          />
        </Card>

        {/* Het profiel + detail-opties */}
        <Card>
          <SectieKop>Profiel</SectieKop>
          <ProfielKiezer
            profiel={waterslag.profiel}
            details={waterslag.details}
            onKiesProfiel={(id) => onWijzig({ profiel: id })}
            onWijzigDetails={(d) => onWijzig({ details: d })}
          />
        </Card>

        {/* Foto's met opmerking per foto */}
        <Card>
          <SectieKop>Foto's</SectieKop>
          <FotoLijst
            fotos={waterslag.fotos}
            onChange={(f) => onWijzig({ fotos: f })}
          />
        </Card>

        {/* Opmerking bij deze waterslag */}
        <Card>
          <Label>Opmerking bij deze waterslag</Label>
          <NoteInp
            value={waterslag.opmerking}
            onChange={(v) => onWijzig({ opmerking: v })}
            placeholder="Bijv. bestaande dorpel eerst verwijderen…"
          />
        </Card>

        {/* Klaar → terug naar het project. Alles is al bewaard. */}
        <PrimaryBtn onClick={onTerug}>Klaar</PrimaryBtn>
        <SecondaryBtn onClick={onVerwijder} color={C.red}>
          Waterslag verwijderen
        </SecondaryBtn>
      </div>
    </div>
  );
}

// Klein sectie-kopje bovenin een kaart.
function SectieKop({ children }) {
  return (
    <div style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: C.t1, marginBottom: 12 }}>
      {children}
    </div>
  );
}
