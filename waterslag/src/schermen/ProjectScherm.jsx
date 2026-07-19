// ══════════════════════════════════════════════════════════════════
//  SCHERM 3 — PROJECTSCHERM (hoofdscherm van één project)
//  Bovenaan de klantgegevens, daaronder de lijst met metingen.
//  Een meting is een waterslag óf een dakkap; beide mogen in hetzelfde
//  project. Eén regel kan voor meerdere gelijke stuks staan (aantal):
//  bv. 5 ramen = "Type A ×3" + twee losse afwijkende regels.
//  Onderaan: opmerkingen + "Opslaan" en "Opslaan als".
// ══════════════════════════════════════════════════════════════════

import React, { useState } from "react";
import { C, F, FM, Card, TxtInp, Label, PrimaryBtn, SecondaryBtn } from "../huisstijl.jsx";
import ProjectOpmerkingen from "../componenten/ProjectOpmerkingen.jsx";
import { soortInfo } from "../soorten.js";

export default function ProjectScherm({
  project, instellingen, onWijzig, onNieuweMeting, onOpenMeting, onOpslaanAls, onTerug,
}) {
  // Korte melding na het opslaan ("Opgeslagen ✓").
  const [melding, setMelding] = useState("");

  const metingen = project.metingen || [];

  // Totaal aantal stuks per soort, bv. { waterslag: 5, dakkap: 2 }.
  const totalen = {};
  metingen.forEach(m => {
    totalen[m.soort] = (totalen[m.soort] || 0) + (parseInt(m.aantal, 10) || 0);
  });
  // Daarvan een leesbaar zinnetje maken: "5 waterslagen · 2 dakkappen".
  const totaalTekst = Object.keys(totalen)
    .map(s => `${totalen[s]} ${soortInfo(s).meervoud}`)
    .join(" · ");

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
              <Label>Ordernummer</Label>
              <TxtInp
                value={project.ordernummer}
                onChange={(v) => onWijzig({ ordernummer: v })}
                placeholder="bijv. 2025-041"
              />
            </div>
          </div>
        </Card>

        {/* Kopje boven de lijst, met het totaal per soort */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.t1 }}>Metingen</div>
          <div style={{ fontSize: 13, color: C.t3, textAlign: "right" }}>
            {metingen.length === 0 ? "nog geen" : totaalTekst}
          </div>
        </div>

        {/* De lijst met metingen */}
        {metingen.length === 0 ? (
          <div style={{ textAlign: "center", color: C.t3, fontSize: 14,
            padding: "18px 20px", lineHeight: 1.5 }}>
            Nog geen metingen in dit project.<br />
            Voeg hieronder een waterslag of een dakkap toe.
          </div>
        ) : (
          metingen.map((m, i) => (
            <MetingKaart key={m.id} meting={m} index={i}
              profielen={instellingen.profielen[m.soort] || []}
              onOpen={() => onOpenMeting(m.id)} />
          ))
        )}

        {/* Twee toevoeg-knoppen: kies waterslag of dakkap */}
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <PrimaryBtn onClick={() => onNieuweMeting("waterslag")}
              icon={<span style={{ fontSize: 17 }}>+</span>}>
              Waterslag
            </PrimaryBtn>
          </div>
          <div style={{ flex: 1 }}>
            <PrimaryBtn onClick={() => onNieuweMeting("dakkap")}
              icon={<span style={{ fontSize: 17 }}>+</span>}>
              Dakkap
            </PrimaryBtn>
          </div>
        </div>

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
// Toont: soort-label, naam, aantal (bv. ×3), de maten en het profiel.
function MetingKaart({ meting, index, profielen, onOpen }) {
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
          {/* Soort-label (Waterslag / Dakkap) als klein gekleurd chipje */}
          <span style={{
            display: "inline-block", fontSize: 11, fontWeight: 700, color: "#fff",
            background: C.brand, borderRadius: 6, padding: "2px 8px", marginBottom: 4,
          }}>
            {info.label}
          </span>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>
            {meting.naam?.trim() || `${info.label} ${meting.volgnummer || index + 1}`}
          </div>
          <div style={{ fontSize: 13, color: C.t3, marginTop: 3, fontFamily: FM }}>
            {matenTekst}
          </div>
          <div style={{ fontSize: 12, color: C.t4, marginTop: 2 }}>
            {profielNaam ? `Profiel: ${profielNaam}` : "nog geen profiel gekozen"}
            {meting.fotos?.length ? ` · ${meting.fotos.length} foto${meting.fotos.length === 1 ? "" : "'s"}` : ""}
          </div>
        </div>
        {/* Pijltje rechts: hint dat je de kaart kunt aantikken */}
        <div style={{ marginLeft: "auto", color: C.t4, fontSize: 18 }}>›</div>
      </div>
    </Card>
  );
}
