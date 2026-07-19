// ══════════════════════════════════════════════════════════════════
//  SCHERM 3 — PROJECTSCHERM (hoofdscherm van één project)
//  Bovenaan de klantgegevens (incl. RAL-kleur voor het hele project),
//  daaronder twee tabs: Waterslagen en Dakkappen. Elke tab toont zijn
//  eigen lijst en een eigen toevoeg-knop — apart voor de overzichtelijkheid.
//  Eén regel kan voor meerdere gelijke stuks staan (aantal).
//  Onderaan: opmerkingen + "Opslaan" en "Opslaan als".
// ══════════════════════════════════════════════════════════════════

import React, { useState } from "react";
import { C, F, FM, Card, TxtInp, Label, PrimaryBtn, SecondaryBtn } from "../huisstijl.jsx";
import ProjectOpmerkingen from "../componenten/ProjectOpmerkingen.jsx";
import RalKiezer from "../componenten/RalKiezer.jsx";
import { ralNaarHex } from "../ralKleuren.js";
import { SOORTEN, soortInfo } from "../soorten.js";

export default function ProjectScherm({
  project, instellingen, actieveSoort, onKiesSoort,
  onWijzig, onNieuweMeting, onOpenMeting, onOpslaanAls, onTerug,
}) {
  // Welke tab open staat ("waterslag"/"dakkap") wordt in App bewaard, zodat
  // je na het bewerken van een onderdeel op dezelfde tab terugkomt.
  // Korte melding na het opslaan ("Opgeslagen ✓").
  const [melding, setMelding] = useState("");

  const metingen = project.metingen || [];
  const info = soortInfo(actieveSoort);

  // Alleen de metingen van de open tab.
  const zichtbaar = metingen.filter(m => m.soort === actieveSoort);
  // Totaal aantal stuks in deze tab.
  const stuks = zichtbaar.reduce((som, m) => som + (parseInt(m.aantal, 10) || 0), 0);

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

        {/* Klantgegevens + RAL-kleur voor het hele project */}
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
              <Label>Ordernummer</Label>
              <TxtInp
                value={project.ordernummer}
                onChange={(v) => onWijzig({ ordernummer: v })}
                placeholder="bijv. 2025-041"
              />
            </div>
            <RalKiezer
              label="RAL-kleur (hele project)"
              value={project.ral}
              onChange={(v) => onWijzig({ ral: v })}
              placeholder="bijv. 7016"
              hint="Geldt voor alle onderdelen, tenzij je bij een onderdeel een eigen kleur invult."
            />
          </div>
        </Card>

        {/* ── Tabs: Waterslagen / Dakkappen ────────────────────── */}
        <div style={{ display: "flex", background: C.inset, border: `1px solid ${C.sep}`,
          borderRadius: 12, padding: 4, gap: 4 }}>
          {Object.keys(SOORTEN).map(soort => {
            const aan = soort === actieveSoort;
            const n = metingen.filter(m => m.soort === soort).length;
            const mv = SOORTEN[soort].meervoud;                  // "waterslagen"
            const titel = mv.charAt(0).toUpperCase() + mv.slice(1); // "Waterslagen"
            return (
              <button
                key={soort}
                onClick={() => onKiesSoort(soort)}
                style={{
                  flex: 1, padding: "10px 8px", borderRadius: 9, border: "none",
                  cursor: "pointer", fontFamily: F, fontSize: 14, fontWeight: 700,
                  background: aan ? C.card : "transparent",
                  color: aan ? C.brand : C.t3,
                  boxShadow: aan ? C.shadow : "none",
                }}
              >
                {titel}{n > 0 ? ` (${n})` : ""}
              </button>
            );
          })}
        </div>

        {/* Totaal-regel voor de open tab */}
        <div style={{ fontSize: 13, color: C.t3, marginTop: -4 }}>
          {zichtbaar.length === 0
            ? `Nog geen ${info.meervoud} in dit project.`
            : `${stuks} ${stuks === 1 ? info.label.toLowerCase() : info.meervoud} totaal`}
        </div>

        {/* De lijst met metingen van de open tab */}
        {zichtbaar.map((m, i) => (
          <MetingKaart key={m.id} meting={m} index={i}
            projectRal={project.ral}
            profielen={instellingen.profielen[m.soort] || []}
            onOpen={() => onOpenMeting(m.id)} />
        ))}

        {/* Toevoeg-knop voor de open soort */}
        <PrimaryBtn onClick={() => onNieuweMeting(actieveSoort)}
          icon={<span style={{ fontSize: 18 }}>+</span>}>
          {info.label} toevoegen
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

// ── Eén meting-regel als aantikbare kaart ──────────────────────────
// Toont: naam, aantal (bv. ×3), maten, profiel, foto's en RAL-kleur.
function MetingKaart({ meting, index, projectRal, profielen, onOpen }) {
  const info = soortInfo(meting.soort);
  const m = meting.maten || {};
  const profielNaam = profielen.find(p => p.id === meting.profiel)?.naam;

  // Korte maten-samenvatting, alleen van ingevulde velden.
  const mmDelen = [];
  if (m.lengte)  mmDelen.push(`L ${m.lengte}`);
  if (m.breedte) mmDelen.push(`B ${m.breedte}`);
  if (m.hoogte)  mmDelen.push(`H ${m.hoogte}`);
  const stukken = [];
  if (mmDelen.length) stukken.push(mmDelen.join(" · ") + " mm");
  if (m.hoek) stukken.push(`${m.hoek}°`);
  const matenTekst = stukken.length ? stukken.join(" · ") : "nog geen maten";

  const aantal = parseInt(meting.aantal, 10) || 0;

  // De kleur die voor dit onderdeel geldt: eigen RAL of anders die van het project.
  const effRal = meting.ral?.trim() || projectRal?.trim() || "";
  const ralHex = ralNaarHex(effRal);

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
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>
            {meting.naam?.trim() || `${info.label} ${meting.volgnummer || index + 1}`}
          </div>
          <div style={{ fontSize: 13, color: C.t3, marginTop: 3, fontFamily: FM }}>
            {matenTekst}
          </div>
          <div style={{ fontSize: 12, color: C.t4, marginTop: 2, display: "flex",
            alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span>{profielNaam ? `Profiel: ${profielNaam}` : "nog geen profiel"}</span>
            {meting.fotos?.length ? <span>· {meting.fotos.length} foto{meting.fotos.length === 1 ? "" : "'s"}</span> : null}
            {effRal ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                · <span style={{ width: 11, height: 11, borderRadius: 3,
                    border: `1px solid ${C.sep}`, background: ralHex || C.inset,
                    display: "inline-block" }} />
                RAL {effRal.replace(/\D/g, "") || effRal}
              </span>
            ) : null}
          </div>
        </div>
        {/* Pijltje rechts: hint dat je de kaart kunt aantikken */}
        <div style={{ color: C.t4, fontSize: 18 }}>›</div>
      </div>
    </Card>
  );
}
