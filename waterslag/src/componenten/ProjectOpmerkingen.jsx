// ══════════════════════════════════════════════════════════════════
//  PROJECTOPMERKINGEN — algemene opmerkingen voor het hele project
//  Eén groot opmerkingen-veld (NoteInp) in een kaart.
// ══════════════════════════════════════════════════════════════════

import React from "react";
import { Card, Label, NoteInp } from "../huisstijl.jsx";

export default function ProjectOpmerkingen({ waarde, onChange }) {
  return (
    <Card>
      <Label>Opmerkingen bij het project</Label>
      <NoteInp
        value={waarde}
        onChange={onChange}
        placeholder="Bijv. bereikbaarheid, steiger aanwezig, afspraken met de klant…"
      />
    </Card>
  );
}
