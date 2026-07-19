// ══════════════════════════════════════════════════════════════════
//  SCHERM 3 — PROJECTSCHERM (hoofdscherm van één project)
//  Op telefoon: alles onder elkaar in één kolom.
//  Op een breed scherm (desktop): links de projectgegevens + opslaan,
//  rechts de metingen — en die metingen zelf in meerdere kolommen.
//  Twee tabs (Waterslagen / Dakkappen) houden het overzichtelijk.
//  Eén regel kan voor meerdere gelijke stuks staan (aantal).
// ══════════════════════════════════════════════════════════════════

import React, { useState } from "react";
import { C, F, FM, Card, TxtInp, Label, PrimaryBtn, SecondaryBtn } from "../huisstijl.jsx";
import ProjectOpmerkingen from "../componenten/ProjectOpmerkingen.jsx";
import RalKiezer from "../componenten/RalKiezer.jsx";
import { ralNaarHex } from "../ralKleuren.js";
import { SOORTEN, soortInfo } from "../soorten.js";
import { useBreed } from "../useBreed.js";

export default function ProjectScherm({
  project, instellingen, actieveSoort, onKiesSoort,
  onWijzig, onNieuweMeting, onOpenMeting, onOpslaanAls, onTerug,
}) {
  const breed = useBreed();          // desktop = twee kolommen
  const [melding, setMelding] = useState("");

  const metingen = project.metingen || [];
  const info = soortInfo(actieveSoort);
  const zichtbaar = metingen.filter(m => m.soort === actieveSoort);
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

  // ── De losse blokken; hieronder zetten we ze anders neer per schermbreedte ──

  const klantBlok = (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <Label>Klantnaam</Label>
          <TxtInp value={project.klant} onChange={(v) => onWijzig({ klant: v })}
            placeholder="bijv. Fam. De Vries" />
        </div>
        <div>
          <Label>Ordernummer</Label>
          <TxtInp value={project.ordernummer} onChange={(v) => onWijzig({ ordernummer: v })}
            placeholder="bijv. 2025-041" />
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
  );

  const metingenBlok = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Tabs: Waterslagen / Dakkappen */}
      <div style={{ display: "flex", background: C.inset, border: `1px solid ${C.sep}`,
        borderRadius: 12, padding: 4, gap: 4 }}>
        {Object.keys(SOORTEN).map(soort => {
          const aan = soort === actieveSoort;
          const n = metingen.filter(m => m.soort === soort).length;
          const mv = SOORTEN[soort].meervoud;
          const titel = mv.charAt(0).toUpperCase() + mv.slice(1);
          return (
            <button key={soort} onClick={() => onKiesSoort(soort)}
              style={{ flex: 1, padding: "10px 8px", borderRadius: 9, border: "none",
                cursor: "pointer", fontFamily: F, fontSize: 14, fontWeight: 700,
                background: aan ? C.card : "transparent",
                color: aan ? C.brand : C.t3, boxShadow: aan ? C.shadow : "none" }}>
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

      {/* De metingen — op desktop in meerdere kolommen */}
      {zichtbaar.length > 0 && (
        <div style={{ display: "grid", gap: 14,
          gridTemplateColumns: breed ? "repeat(auto-fill, minmax(280px, 1fr))" : "1fr" }}>
          {zichtbaar.map((m, i) => (
            <MetingKaart key={m.id} meting={m} index={i}
              projectRal={project.ral}
              profielen={instellingen.profielen[m.soort] || []}
              onOpen={() => onOpenMeting(m.id)} />
          ))}
        </div>
      )}

      {/* Toevoeg-knop voor de open soort */}
      <div style={{ maxWidth: breed ? 260 : "100%" }}>
        <PrimaryBtn onClick={() => onNieuweMeting(actieveSoort)}
          icon={<span style={{ fontSize: 18 }}>+</span>}>
          {info.label} toevoegen
        </PrimaryBtn>
      </div>
    </div>
  );

  const opmerkingBlok = (
    <ProjectOpmerkingen waarde={project.opmerking} onChange={(v) => onWijzig({ opmerking: v })} />
  );

  const opslaanBlok = (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <PrimaryBtn onClick={opslaan}>Opslaan</PrimaryBtn>
      <SecondaryBtn onClick={opslaanAls}>Opslaan als…</SecondaryBtn>
      {melding && (
        <div style={{ textAlign: "center", color: C.green, fontSize: 14, fontWeight: 600 }}>
          {melding}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: F }}>

      {/* ── Bovenbalk met terug-knop ────────────────────────────── */}
      <div style={{
        background: C.card, borderBottom: `1px solid ${C.sep}`,
        padding: "12px 14px", paddingTop: "calc(12px + env(safe-area-inset-top))",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <button onClick={onTerug}
          style={{ border: "none", background: "none", color: C.brand,
            fontFamily: F, fontSize: 15, fontWeight: 600, cursor: "pointer", padding: 4 }}>
          ← Projecten
        </button>
        <div style={{ fontSize: 17, fontWeight: 800, color: C.t1 }}>
          {project.klant?.trim() || "Nieuw project"}
        </div>
      </div>

      {/* ── Inhoud ──────────────────────────────────────────────── */}
      <div style={{ padding: 18, maxWidth: breed ? 1100 : 560, margin: "0 auto",
        paddingBottom: "calc(28px + env(safe-area-inset-bottom))" }}>

        {breed ? (
          // Desktop: links de gegevens/opslaan, rechts de metingen.
          <div style={{ display: "grid", gridTemplateColumns: "360px 1fr",
            gap: 20, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {klantBlok}{opmerkingBlok}{opslaanBlok}
            </div>
            <div>{metingenBlok}</div>
          </div>
        ) : (
          // Telefoon: alles onder elkaar.
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {klantBlok}{metingenBlok}{opmerkingBlok}{opslaanBlok}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Eén meting-regel als aantikbare kaart ──────────────────────────
function MetingKaart({ meting, index, projectRal, profielen, onOpen }) {
  const info = soortInfo(meting.soort);
  const m = meting.maten || {};
  const profielNaam = profielen.find(p => p.id === meting.profiel)?.naam;

  const mmDelen = [];
  if (m.lengte)  mmDelen.push(`L ${m.lengte}`);
  if (m.breedte) mmDelen.push(`B ${m.breedte}`);
  if (m.hoogte)  mmDelen.push(`H ${m.hoogte}`);
  const stukken = [];
  if (mmDelen.length) stukken.push(mmDelen.join(" · ") + " mm");
  if (m.hoek) stukken.push(`${m.hoek}°`);
  const matenTekst = stukken.length ? stukken.join(" · ") : "nog geen maten";

  const aantal = parseInt(meting.aantal, 10) || 0;
  const effRal = meting.ral?.trim() || projectRal?.trim() || "";
  const ralHex = ralNaarHex(effRal);

  return (
    <Card style={{ cursor: "pointer", padding: 16 }}>
      <div onClick={onOpen} style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
        <div style={{ color: C.t4, fontSize: 18 }}>›</div>
      </div>
    </Card>
  );
}
