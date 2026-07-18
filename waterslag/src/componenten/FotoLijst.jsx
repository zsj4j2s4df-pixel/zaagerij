// ══════════════════════════════════════════════════════════════════
//  FOTOLIJST — foto's toevoegen bij een waterslag
//  Via de bestandskiezer (op de iPhone opent dat ook de camera).
//  Elke foto krijgt een eigen opmerkingen-veld (NoteInp).
//  Foto's worden verkleind opgeslagen, anders raakt de browser-opslag vol.
// ══════════════════════════════════════════════════════════════════

import React, { useRef } from "react";
import { C, F, NoteInp, SecondaryBtn, Label } from "../huisstijl.jsx";

const nieuwId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// Foto verkleinen tot max. 1000 pixels breed en omzetten naar JPEG.
// Dit houdt de opslag klein; voor het inmeten is dit scherp genoeg.
function verkleinFoto(bestand, maxBreedte = 1000) {
  return new Promise((klaar) => {
    const img = new Image();
    img.onload = () => {
      const schaal = Math.min(1, maxBreedte / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * schaal);
      canvas.height = Math.round(img.height * schaal);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      klaar(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.src = URL.createObjectURL(bestand);
  });
}

export default function FotoLijst({ fotos, onChange }) {
  // Verwijzing naar de (onzichtbare) bestandskiezer.
  const kiezerRef = useRef(null);

  // Gekozen bestanden verkleinen en aan de lijst toevoegen.
  async function bestandenGekozen(e) {
    const bestanden = Array.from(e.target.files || []);
    const nieuwe = [];
    for (const bestand of bestanden) {
      const dataUrl = await verkleinFoto(bestand);
      nieuwe.push({ id: nieuwId(), dataUrl, opmerking: "" });
    }
    onChange([...fotos, ...nieuwe]);
    e.target.value = ""; // zodat je dezelfde foto zo nodig opnieuw kunt kiezen
  }

  // De opmerking van één foto wijzigen.
  function wijzigOpmerking(id, opmerking) {
    onChange(fotos.map(f => (f.id === id ? { ...f, opmerking } : f)));
  }

  // Eén foto verwijderen.
  function verwijderFoto(id) {
    onChange(fotos.filter(f => f.id !== id));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* De echte bestandskiezer is onzichtbaar; de knop hieronder opent hem.
          accept="image/*" → alleen foto's. Op de iPhone kun je dan direct
          de camera of je fotobibliotheek kiezen. */}
      <input
        ref={kiezerRef} type="file" accept="image/*" multiple
        onChange={bestandenGekozen} style={{ display: "none" }}
      />
      <SecondaryBtn onClick={() => kiezerRef.current?.click()} icon={<span>📷</span>}>
        Foto toevoegen
      </SecondaryBtn>

      {fotos.length === 0 && (
        <div style={{ fontFamily: F, fontSize: 13, color: C.t4, textAlign: "center" }}>
          Nog geen foto's bij deze waterslag.
        </div>
      )}

      {/* Elke foto: afbeelding + opmerking + verwijderknop */}
      {fotos.map((foto, i) => (
        <div key={foto.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <img
            src={foto.dataUrl} alt={`Foto ${i + 1}`}
            style={{ width: "100%", borderRadius: 12, display: "block" }}
          />
          <Label>Opmerking bij foto {i + 1}</Label>
          <NoteInp
            value={foto.opmerking}
            onChange={(tekst) => wijzigOpmerking(foto.id, tekst)}
            placeholder="Bijv. rechterkant, let op de spouwlat…"
          />
          <SecondaryBtn onClick={() => verwijderFoto(foto.id)} color={C.red}>
            Foto verwijderen
          </SecondaryBtn>
        </div>
      ))}
    </div>
  );
}
