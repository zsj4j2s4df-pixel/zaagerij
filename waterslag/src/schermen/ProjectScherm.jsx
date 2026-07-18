// ══════════════════════════════════════════════════════════════════
//  SCHERM 3 — PROJECTSCHERM (hoofdscherm van één project)
//  Bovenaan de klantgegevens, daaronder de lijst met waterslagen.
//  Eén waterslag-regel kan voor meerdere gelijke ramen staan (aantal):
//  bv. 5 ramen = "Type A × 3" + twee losse afwijkende regels.
//  Onderaan: opmerkingen + "Opslaan" en "Opslaan als".
// ══════════════════════════════════════════════════════════════════

import React, { useState } from "react";
import { C, F, FM, Card, TxtInp, Label, PrimaryBtn, SecondaryBtn } from "../huisstijl.jsx";
import ProjectOpmerkingen from "../componenten/ProjectOpmerkingen.jsx";
import { PROFIELEN } from "../componenten/ProfielKiezer.jsx";

export default function ProjectScherm({
  project, onWijzig, onNieuweWaterslag, onOpenWaterslag, onOpslaanAls, onTerug,
}) {
  // Korte melding na het opslaan ("Opgeslagen ✓").
  const [melding, setMelding] = useState("");

  const waterslagen = project.waterslagen || [];

  // Totaal aantal ramen: de aantallen van alle regels bij elkaar.
  const totaalRamen = waterslagen.reduce((som, w) => som + (parseInt(w.aantal, 10) || 0), 0);

  // Opslaan gebeurt eigenlijk al automatisch (localStorage), maar de knop
  // geeft een geruststellend "Opgeslagen ✓" zodat je weet dat het goed zit.
  function opslaan() {
    setMelding("Opgeslagen ✓");
    setTimeout(() => setMelding(""), 1800);
  }

  function opslaanAls() {
    onOpslaanAls();
    setMelding("Kopie gemaakt ✓");
    setTimeout(() => setMelding(""), 1800);
  }

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
          ← Projecten
        </button>
        <div style={{ fontSize: 17, fontWeight: 800, color: C.t1 }}>
          {project.klant?.trim() || "Nieuw project"}
        </div>
      </div>

      {/* ── Inhoud ──────────────────────────────────────────────── */}
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16,
        maxWidth: 560, margin: "0 auto",
        paddingBottom: "calc(28px + env(safe-area-inset-bottom))" }}>

        {/* Klantgegevens */}
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <Label>Klantnaam</Label>
              <TxtInp
                value={project.klant}
                onChange={(v) => onWijzig({ klant: v })}
                placeholder="bijv. Fam. De Vries"
              />
            </div>
            <div>
              <Label>Omschrijving</Label>
              <TxtInp
                value={project.omschrijving}
                onChange={(v) => onWijzig({ omschrijving: v })}
                placeholder="bijv. Voorgevel — 5 ramen"
              />
            </div>
          </div>
        </Card>

        {/* Kopje boven de waterslagen-lijst, met het totaal */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.t1 }}>Waterslagen</div>
          <div style={{ fontSize: 13, color: C.t3 }}>
            {waterslagen.length === 0
              ? "nog geen"
              : `${waterslagen.length} ${waterslagen.length === 1 ? "type" : "types"} · ${totaalRamen} ${totaalRamen === 1 ? "raam" : "ramen"} totaal`}
          </div>
        </div>

        {/* De lijst met waterslag-regels */}
        {waterslagen.length === 0 ? (
          <div style={{ textAlign: "center", color: C.t3, fontSize: 14,
            padding: "18px 20px", lineHeight: 1.5 }}>
            Nog geen waterslagen in dit project.<br />
            Gelijke ramen voer je één keer in en geef je een aantal mee.
          </div>
        ) : (
          waterslagen.map((w, i) => (
            <WaterslagKaart key={w.id} waterslag={w} index={i}
              onOpen={() => onOpenWaterslag(w.id)} />
          ))
        )}

        {/* Nieuwe waterslag-regel toevoegen */}
        <PrimaryBtn onClick={onNieuweWaterslag} icon={<span style={{ fontSize: 18 }}>+</span>}>
          Waterslag toevoegen
        </PrimaryBtn>

        {/* Algemene opmerkingen voor het hele project */}
        <ProjectOpmerkingen
          waarde={project.opmerking}
          onChange={(v) => onWijzig({ opmerking: v })}
        />

        {/* Opslaan-knoppen */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <PrimaryBtn onClick={opslaan}>Opslaan</PrimaryBtn>
          <SecondaryBtn onClick={opslaanAls}>Opslaan als…</SecondaryBtn>
          {melding && (
            <div style={{ textAlign: "center", color: C.green, fontSize: 14, fontWeight: 600 }}>
              {melding}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Eén waterslag-regel als aantikbare kaart ───────────────────────
// Toont: naam, aantal (bv. ×3), de maten en het gekozen profiel.
function WaterslagKaart({ waterslag, index, onOpen }) {
  const m = waterslag.maten || {};
  const profielNaam = PROFIELEN.find(p => p.id === waterslag.profiel)?.naam;

  // Korte maten-samenvatting, alleen van ingevulde velden.
  // Bv. "L 1200 · B 180 · H 40 mm · 15°".
  const mmDelen = [];
  if (m.lengte)  mmDelen.push(`L ${m.lengte}`);
  if (m.breedte) mmDelen.push(`B ${m.breedte}`);
  if (m.hoogte)  mmDelen.push(`H ${m.hoogte}`);
  const stukken = [];
  if (mmDelen.length) stukken.push(mmDelen.join(" · ") + " mm");
  if (m.hoek) stukken.push(`${m.hoek}°`);
  const matenTekst = stukken.length ? stukken.join(" · ") : "nog geen maten";

  const aantal = parseInt(waterslag.aantal, 10) || 0;

  return (
    <Card style={{ cursor: "pointer", padding: 16 }}>
      <div onClick={onOpen} style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Het aantal, groot en duidelijk: dit is het "×3" uit jouw voorbeeld. */}
        <div style={{
          minWidth: 46, height: 46, borderRadius: 12, background: C.inset,
          border: `1.5px solid ${C.sep}`, display: "flex", alignItems: "center",
          justifyContent: "center", fontFamily: FM, fontSize: 16, fontWeight: 700,
          color: C.brand, flexShrink: 0,
        }}>
          ×{aantal}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>
            {waterslag.naam?.trim() || `Waterslag ${waterslag.volgnummer || index + 1}`}
          </div>
          <div style={{ fontSize: 13, color: C.t3, marginTop: 3, fontFamily: FM }}>
            {matenTekst}
          </div>
          <div style={{ fontSize: 12, color: C.t4, marginTop: 2 }}>
            {profielNaam ? `Profiel: ${profielNaam}` : "nog geen profiel gekozen"}
            {waterslag.fotos?.length ? ` · ${waterslag.fotos.length} foto${waterslag.fotos.length === 1 ? "" : "'s"}` : ""}
          </div>
        </div>
        {/* Pijltje rechts: hint dat je de kaart kunt aantikken */}
        <div style={{ marginLeft: "auto", color: C.t4, fontSize: 18 }}>›</div>
      </div>
    </Card>
  );
}
