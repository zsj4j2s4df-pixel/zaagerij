// ══════════════════════════════════════════════════════════════════
//  APP — het centrale brein van de waterslag-app
//  Hier woont de "toestand" (state) van de hele app op één plek:
//    • ingelogd of niet (en wie)
//    • de lijst met projecten
//    • welk project op dit moment geopend is
//  Vanuit hier kiezen we welk scherm we laten zien.
// ══════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import { C, F } from "./huisstijl.jsx";
import LoginScherm from "./schermen/LoginScherm.jsx";
import ProjectLijst from "./schermen/ProjectLijst.jsx";
import {
  leesProjecten, schrijfProjecten,
  leesSessie, schrijfSessie, wisSessie,
} from "./opslag.js";

// Klein hulpje om een uniek id te maken voor een nieuw project.
const nieuwId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export default function App() {
  // ── De centrale toestand ───────────────────────────────────────
  const [gebruiker, setGebruiker] = useState(null);        // string of null (= niet ingelogd)
  const [projecten, setProjecten] = useState([]);          // lijst met projecten
  const [actiefProjectId, setActiefProjectId] = useState(null); // welk project open is (null = lijst)

  // ── Bij het opstarten: eerder opgeslagen gegevens inladen ──────
  useEffect(() => {
    setProjecten(leesProjecten());          // projecten uit localStorage
    const sessie = leesSessie();            // stond "ingelogd blijven" aan?
    if (sessie && sessie.gebruiker) setGebruiker(sessie.gebruiker);
  }, []);

  // Elke keer dat de projecten wijzigen: meteen bewaren in de browser.
  useEffect(() => { schrijfProjecten(projecten); }, [projecten]);

  // ── Acties die de schermen kunnen aanroepen ────────────────────

  // Inloggen. Controle is voorlopig nep: elke invoer logt in.
  function inloggen(gebruikersnaam, ingelogdBlijven) {
    setGebruiker(gebruikersnaam);
    if (ingelogdBlijven) schrijfSessie({ gebruiker: gebruikersnaam });
    else wisSessie();
  }

  // Uitloggen (nog niet als knop in beeld, maar alvast klaar).
  function uitloggen() {
    setGebruiker(null);
    setActiefProjectId(null);
    wisSessie();
  }

  // Nieuw, leeg project aanmaken en meteen openen.
  function nieuwProject() {
    const project = {
      id: nieuwId(),
      klant: "",
      omschrijving: "Nieuw project",
      maten: {},        // wordt gevuld in het projectscherm (volgende stap)
      profiel: null,
      fotos: [],
      opmerking: "",
    };
    setProjecten(vorige => [project, ...vorige]);
    setActiefProjectId(project.id);
  }

  // Een bestaand project openen.
  function openProject(id) { setActiefProjectId(id); }

  // Terug naar de projectlijst.
  function sluitProject() { setActiefProjectId(null); }

  // ── Kiezen welk scherm we tonen ────────────────────────────────

  // 1) Niet ingelogd → altijd eerst het loginscherm.
  if (!gebruiker) {
    return <LoginScherm onInloggen={inloggen} />;
  }

  // 2) Ingelogd, maar een project geopend → (voorlopig) een tussenscherm.
  //    Het echte ProjectScherm bouwen we in de volgende stap.
  if (actiefProjectId) {
    const project = projecten.find(p => p.id === actiefProjectId);
    return <ProjectPlaceholder project={project} onTerug={sluitProject} />;
  }

  // 3) Ingelogd, geen project open → de projectlijst.
  return (
    <ProjectLijst
      projecten={projecten}
      onNieuwProject={nieuwProject}
      onOpenProject={openProject}
    />
  );
}

// ── Tijdelijk tussenscherm ─────────────────────────────────────────
// Zodat "Nieuw project" en het aantikken van een kaart al werken.
// In de volgende stap vervangen we dit door het echte ProjectScherm.
function ProjectPlaceholder({ project, onTerug }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: F,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 24, textAlign: "center", gap: 12 }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: C.t1 }}>
        {project?.omschrijving || "Project"}
      </div>
      <div style={{ fontSize: 14, color: C.t3, maxWidth: 300 }}>
        Het projectscherm (maten, profiel, foto's, opmerkingen) bouwen we in de
        volgende stap. Dit project is alvast opgeslagen.
      </div>
      <button
        onClick={onTerug}
        style={{ marginTop: 8, padding: "10px 18px", borderRadius: 20,
          border: `1px solid ${C.sep}`, background: C.inset, color: C.brand,
          fontFamily: F, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
      >
        ← Terug naar projecten
      </button>
    </div>
  );
}
