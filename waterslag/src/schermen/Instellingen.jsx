// ══════════════════════════════════════════════════════════════════
//  SCHERM 6 — INSTELLINGEN (het visueel aanpassen zonder code)
//  Hier pas je aan:
//    • de accentkleur (kleurenkiezer + snelkeuzes)
//    • de merknaam bovenaan
//    • de begroeting op het loginscherm
//    • de profielen: toevoegen en verwijderen, apart voor
//      waterslag en dakkap
//  Alles is meteen live zichtbaar en wordt bewaard in de browser.
// ══════════════════════════════════════════════════════════════════

import React, { useState } from "react";
import { C, F, FM, Card, Label, TxtInp, PrimaryBtn, SecondaryBtn } from "../huisstijl.jsx";
import { SOORTEN } from "../soorten.js";
import ProfielTekenaar from "../componenten/ProfielTekenaar.jsx";
import { useBreed } from "../useBreed.js";

// Klein hulpje om een uniek id te maken voor een nieuw profiel.
const nieuwId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// Een paar snelkeuze-kleuren om met één tik de accentkleur te zetten.
const KLEUR_SNELKEUZE = ["#7E5230", "#2F6F4F", "#1F5C8B", "#B4472E", "#5B4B8A", "#3A3A3C"];

export default function Instellingen({ instellingen, onWijzig, onHerstel, onTerug }) {
  const breed = useBreed();          // desktop = twee kolommen naast elkaar

  // ── Hulpjes om de profielen aan te passen ──────────────────────
  function zetProfielen(soort, nieuweLijst) {
    onWijzig({ profielen: { ...instellingen.profielen, [soort]: nieuweLijst } });
  }
  function wijzigProfiel(soort, id, veld, waarde) {
    zetProfielen(soort, instellingen.profielen[soort].map(p =>
      p.id === id ? { ...p, [veld]: waarde } : p));
  }
  function verwijderProfiel(soort, id) {
    zetProfielen(soort, instellingen.profielen[soort].filter(p => p.id !== id));
  }
  function voegProfielToe(soort) {
    zetProfielen(soort, [
      ...instellingen.profielen[soort],
      { id: nieuwId(), naam: "Nieuw profiel", info: "" },
    ]);
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
          ← Terug
        </button>
        <div style={{ fontSize: 17, fontWeight: 800, color: C.t1 }}>Instellingen</div>
      </div>

      {/* ── Inhoud ──────────────────────────────────────────────── */}
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16,
        maxWidth: breed ? 1000 : 560, margin: "0 auto",
        paddingBottom: "calc(28px + env(safe-area-inset-bottom))" }}>

        {/* Kleur en merknaam: op desktop naast elkaar. */}
        <div style={{ display: "grid", gap: 16,
          gridTemplateColumns: breed ? "1fr 1fr" : "1fr", alignItems: "start" }}>

        {/* ── Accentkleur ──────────────────────────────────────── */}
        <Card>
          <Label>Accentkleur</Label>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* De kleurenkiezer van het besturingssysteem */}
            <input
              type="color" value={instellingen.accent}
              onChange={(e) => onWijzig({ accent: e.target.value })}
              style={{ width: 52, height: 44, border: `1px solid ${C.sep}`,
                borderRadius: 10, background: "none", padding: 0, cursor: "pointer", flexShrink: 0 }}
            />
            {/* De kleurcode als tekst (bv. #7E5230) */}
            <div style={{ flex: 1 }}>
              <TxtInp
                value={instellingen.accent}
                onChange={(v) => onWijzig({ accent: v })}
                placeholder="#7E5230"
              />
            </div>
          </div>

          {/* Snelkeuze-kleuren */}
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            {KLEUR_SNELKEUZE.map(kleur => (
              <button
                key={kleur} onClick={() => onWijzig({ accent: kleur })}
                aria-label={`Kleur ${kleur}`}
                style={{ width: 34, height: 34, borderRadius: "50%", background: kleur,
                  border: instellingen.accent?.toLowerCase() === kleur.toLowerCase()
                    ? `3px solid ${C.t1}` : `2px solid ${C.sep}`,
                  cursor: "pointer", padding: 0 }}
              />
            ))}
          </div>
        </Card>

        {/* ── Merknaam + begroeting ────────────────────────────── */}
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <Label>Merknaam (bovenaan)</Label>
              <TxtInp
                value={instellingen.merknaam}
                onChange={(v) => onWijzig({ merknaam: v })}
                placeholder="Waterslag"
              />
            </div>
            <div>
              <Label>Begroeting (op het loginscherm)</Label>
              <TxtInp
                value={instellingen.begroeting}
                onChange={(v) => onWijzig({ begroeting: v })}
                placeholder="Waterslagen inmeten op locatie"
              />
            </div>
          </div>
        </Card>

        </div>{/* einde kleur/merknaam-raster */}

        {/* ── Profielen beheren, per soort ─────────────────────────
            Op desktop de twee soorten naast elkaar. */}
        <div style={{ display: "grid", gap: 16,
          gridTemplateColumns: breed ? "1fr 1fr" : "1fr", alignItems: "start" }}>
        {Object.keys(SOORTEN).map(soort => (
          <Card key={soort}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.t1, marginBottom: 4 }}>
              Profielen — {SOORTEN[soort].label.toLowerCase()}
            </div>
            <div style={{ fontSize: 12, color: C.t4, marginBottom: 12 }}>
              Deze keuzes verschijnen bij het inmeten van een {SOORTEN[soort].label.toLowerCase()}.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {instellingen.profielen[soort].map((p, i) => (
                <ProfielRij
                  key={p.id}
                  profiel={p}
                  volgnr={i + 1}
                  onNaam={(v) => wijzigProfiel(soort, p.id, "naam", v)}
                  onInfo={(v) => wijzigProfiel(soort, p.id, "info", v)}
                  onLijn={(v) => wijzigProfiel(soort, p.id, "lijn", v)}
                  onVerwijder={() => verwijderProfiel(soort, p.id)}
                />
              ))}
            </div>

            {/* Knop om een profiel toe te voegen */}
            <div style={{ marginTop: 12 }}>
              <SecondaryBtn onClick={() => voegProfielToe(soort)} icon={<span>+</span>}>
                Profiel toevoegen
              </SecondaryBtn>
            </div>
          </Card>
        ))}
        </div>{/* einde profielen-raster */}

        {/* ── Alles terugzetten naar de standaard ──────────────── */}
        <SecondaryBtn
          color={C.red}
          onClick={() => {
            if (confirm("Alle instellingen terugzetten naar de standaard?")) onHerstel();
          }}
        >
          Standaardinstellingen herstellen
        </SecondaryBtn>
      </div>
    </div>
  );
}

// ── Eén profiel-regel in de instellingen ───────────────────────────
// Naam + korte omschrijving aanpasbaar, met een verwijder-knop en een
// uitklapbaar tekenvlak om de vorm (zijkant) te tekenen.
function ProfielRij({ profiel, volgnr, onNaam, onInfo, onLijn, onVerwijder }) {
  // Onthoudt of het tekenvlak van dit profiel open staat.
  const [tekenen, setTekenen] = useState(false);

  return (
    <div style={{ border: `1px solid ${C.sep}`, borderRadius: 12, padding: 12,
      display: "flex", flexDirection: "column", gap: 8, background: C.card }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Nummertje */}
        <div style={{ fontFamily: FM, fontSize: 13, fontWeight: 700, color: C.t4,
          minWidth: 20, textAlign: "center" }}>{volgnr}</div>
        <div style={{ flex: 1 }}>
          <TxtInp value={profiel.naam} onChange={onNaam} placeholder="Naam van het profiel" />
        </div>
        {/* Verwijder-knop */}
        <button
          onClick={onVerwijder} aria-label="Profiel verwijderen"
          style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            border: `1px solid ${C.sep}`, background: C.inset, color: C.red,
            fontSize: 20, cursor: "pointer" }}
        >×</button>
      </div>

      {/* Korte omschrijving (mag leeg) */}
      <TxtInp value={profiel.info || ""} onChange={onInfo} placeholder="Korte omschrijving (mag leeg)" />

      {/* Rij: klein voorbeeld van de vorm + knop om te (her)tekenen */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 56, height: 28, borderRadius: 8, background: C.inset,
          border: `1px solid ${C.sep}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg viewBox="0 0 64 32" style={{ width: 50, height: 25 }}>
            {profiel.lijn
              ? <polyline points={profiel.lijn} fill="none" stroke={C.brand}
                  strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              : <circle cx="32" cy="16" r="5" fill="none" stroke={C.t4} strokeWidth="3" />}
          </svg>
        </div>
        <button
          onClick={() => setTekenen(v => !v)}
          style={{ border: `1px solid ${C.sep}`, background: C.inset, color: C.brand,
            borderRadius: 20, padding: "8px 14px", fontFamily: F, fontSize: 13,
            fontWeight: 600, cursor: "pointer" }}
        >
          {tekenen ? "Klaar met tekenen" : (profiel.lijn ? "Vorm opnieuw tekenen" : "Vorm tekenen")}
        </button>
      </div>

      {/* Het tekenvlak (alleen als open) */}
      {tekenen && <ProfielTekenaar lijn={profiel.lijn} onChange={onLijn} />}
    </div>
  );
}
