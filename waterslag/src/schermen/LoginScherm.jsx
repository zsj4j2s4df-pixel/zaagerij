// ══════════════════════════════════════════════════════════════════
//  SCHERM 1 — LOGINSCHERM
//  Inloggen met gebruikersnaam + wachtwoord, plus "Ingelogd blijven".
//  De controle is voorlopig NEP: elke invoer logt in (nog geen echte server).
// ══════════════════════════════════════════════════════════════════

import React, { useState } from "react";
import { C, F, Card, TxtInp, Toggle, PrimaryBtn, Label } from "../huisstijl.jsx";

export default function LoginScherm({ onInloggen }) {
  // Lokale toestand van dit scherm: wat er in de velden staat.
  const [gebruikersnaam, setGebruikersnaam] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [ingelogdBlijven, setIngelogdBlijven] = useState(true);

  // Op de knop drukken → doorgeven aan het centrale brein (App.jsx).
  function verstuur() {
    // We geven de naam mee; is er niets ingevuld, gebruik dan "Gebruiker".
    onInloggen(gebruikersnaam.trim() || "Gebruiker", ingelogdBlijven);
  }

  return (
    // Beige achtergrond die het hele scherm vult, inhoud netjes gecentreerd.
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: F,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 18px",
      // Ruimte houden voor de iPhone-balk onderaan/bovenaan (notch).
      paddingTop: "calc(24px + env(safe-area-inset-top))",
      paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
    }}>
      {/* Titel / merknaam boven de kaart */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: C.brand, letterSpacing: "-0.02em" }}>
          Waterslag
        </div>
        <div style={{ fontSize: 14, color: C.t3, marginTop: 4 }}>
          Waterslagen inmeten op locatie
        </div>
      </div>

      {/* De inlogkaart. max-width zodat het op iPad niet te breed wordt. */}
      <Card style={{ width: "100%", maxWidth: 360 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Gebruikersnaam */}
          <div>
            <Label>Gebruikersnaam</Label>
            <TxtInp
              value={gebruikersnaam}
              onChange={setGebruikersnaam}
              placeholder="bijv. jan"
            />
          </div>

          {/* Wachtwoord — we hergebruiken bewust hetzelfde tekstveld uit de
              huisstijl. Een echt (verborgen) wachtwoordveld kan later. */}
          <div>
            <Label>Wachtwoord</Label>
            <TxtInp
              value={wachtwoord}
              onChange={setWachtwoord}
              placeholder="••••••"
            />
          </div>

          {/* Rij met de "Ingelogd blijven"-schakelaar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.t2 }}>
              Ingelogd blijven
            </span>
            <Toggle on={ingelogdBlijven} onChange={setIngelogdBlijven} />
          </div>

          {/* De inlogknop (primaire actie) */}
          <PrimaryBtn onClick={verstuur}>Inloggen</PrimaryBtn>

        </div>
      </Card>

      {/* Kleine hint dat de controle nu nog nep is. */}
      <div style={{ fontSize: 12, color: C.t4, marginTop: 16, textAlign: "center" }}>
        Nog geen echte controle — elke invoer logt in.
      </div>
    </div>
  );
}
