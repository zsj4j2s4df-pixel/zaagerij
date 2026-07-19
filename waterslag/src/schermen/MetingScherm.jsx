// ══════════════════════════════════════════════════════════════════
//  SCHERM 4 — METINGSCHERM (één waterslag óf dakkap bewerken)
//  (Heette eerder WaterslagScherm; doet nu ook dakkappen.)
//  Hier vul je alles in voor één type: naam + aantal, de maten,
//  het profiel, foto's en een opmerking. Staat het aantal op 3, dan
//  geldt deze regel voor 3 gelijke stuks.
// ══════════════════════════════════════════════════════════════════

import React from "react";
import { C, F, Card, TxtInp, NumInp, NoteInp, Label, PrimaryBtn, SecondaryBtn } from "../huisstijl.jsx";
import MatenFormulier from "../componenten/MatenFormulier.jsx";
import ProfielKiezer from "../componenten/ProfielKiezer.jsx";
import FotoLijst from "../componenten/FotoLijst.jsx";
import RalKiezer from "../componenten/RalKiezer.jsx";
import { soortInfo } from "../soorten.js";

export default function MetingScherm({ meting, projectRal, profielen, onWijzig, onTerug, onVerwijder }) {
  const info = soortInfo(meting.soort);
  const standaardNaam = `${info.label} ${meting.volgnummer || ""}`.trim();

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
          {meting.naam?.trim() || standaardNaam}
        </div>
      </div>

      {/* ── Inhoud ──────────────────────────────────────────────── */}
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16,
        maxWidth: 560, margin: "0 auto",
        paddingBottom: "calc(28px + env(safe-area-inset-bottom))" }}>

        {/* Naam + aantal. Het aantal is de kern van jouw werkwijze:
            3 gelijke stuks = deze regel één keer invullen met aantal 3. */}
        <Card>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <Label>Naam (mag leeg)</Label>
              <TxtInp
                value={meting.naam}
                onChange={(v) => onWijzig({ naam: v })}
                placeholder={standaardNaam}
              />
            </div>
            <div style={{ width: 120 }}>
              <Label>{info.aantalLabel}</Label>
              <NumInp
                value={meting.aantal}
                onChange={(v) => onWijzig({ aantal: v })}
                placeholder="1"
              />
            </div>
          </div>
          <div style={{ fontSize: 12, color: C.t4, marginTop: 8 }}>
            {info.gelijkTekst}
          </div>
        </Card>

        {/* De RAL-kleur van dit onderdeel. Leeg = de projectkleur geldt. */}
        <Card>
          <RalKiezer
            label="RAL-kleur (dit onderdeel)"
            value={meting.ral}
            onChange={(v) => onWijzig({ ral: v })}
            placeholder={projectRal ? `Volgt project: ${projectRal}` : "bijv. 7016"}
            hint={projectRal
              ? "Laat leeg om de projectkleur te volgen."
              : "Nog geen projectkleur ingesteld."}
          />
        </Card>

        {/* De maten (mm) */}
        <Card>
          <SectieKop>Maten</SectieKop>
          <MatenFormulier
            maten={meting.maten}
            soort={meting.soort}
            onChange={(m) => onWijzig({ maten: m })}
          />
        </Card>

        {/* Het profiel + detail-opties */}
        <Card>
          <SectieKop>Profiel</SectieKop>
          <ProfielKiezer
            profielen={profielen}
            profiel={meting.profiel}
            details={meting.details}
            onKiesProfiel={(id) => onWijzig({ profiel: id })}
            onWijzigDetails={(d) => onWijzig({ details: d })}
          />
        </Card>

        {/* Foto's met opmerking per foto */}
        <Card>
          <SectieKop>Foto's</SectieKop>
          <FotoLijst
            fotos={meting.fotos}
            onChange={(f) => onWijzig({ fotos: f })}
          />
        </Card>

        {/* Opmerking bij deze meting */}
        <Card>
          <Label>Opmerking bij deze {info.label.toLowerCase()}</Label>
          <NoteInp
            value={meting.opmerking}
            onChange={(v) => onWijzig({ opmerking: v })}
            placeholder="Bijv. bestaande situatie eerst verwijderen…"
          />
        </Card>

        {/* Klaar → terug naar het project. Alles is al bewaard. */}
        <PrimaryBtn onClick={onTerug}>Klaar</PrimaryBtn>
        <SecondaryBtn onClick={onVerwijder} color={C.red}>
          {info.label} verwijderen
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
