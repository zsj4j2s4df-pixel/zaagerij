// ══════════════════════════════════════════════════════════════════
//  APP — het centrale brein van de waterslag-app
//  Hier woont de "toestand" (state) van de hele app op één plek:
//    • ingelogd of niet (en wie)
//    • de lijst met projecten
//    • welk project geopend is, en welke waterslag daarbinnen
//  Vanuit hier kiezen we welk scherm we laten zien.
//
//  Opbouw van de gegevens:
//    project = { id, klant, omschrijving, waterslagen: [...], opmerking }
//    waterslag = { id, naam, aantal, maten, profiel, details, fotos, opmerking }
//  Eén waterslag-regel kan dus voor meerdere gelijke ramen staan (aantal).
// ══════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import LoginScherm from "./schermen/LoginScherm.jsx";
import ProjectLijst from "./schermen/ProjectLijst.jsx";
import ProjectScherm from "./schermen/ProjectScherm.jsx";
import WaterslagScherm from "./schermen/WaterslagScherm.jsx";
import {
  leesProjecten, schrijfProjecten,
  leesSessie, schrijfSessie, wisSessie,
} from "./opslag.js";

// Klein hulpje om een uniek id te maken.
const nieuwId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// Een lege waterslag-regel (één type raam, eventueel meerdere stuks).
export function legeWaterslag(volgnummer) {
  return {
    id: nieuwId(),
    naam: "",                 // bv. "Voorgevel links" (mag leeg blijven)
    aantal: "1",              // hoeveel gelijke ramen dit type heeft
    maten: { lengte: "", breedte: "", hoogte: "", hoek: "" }, // in mm / graden
    profiel: null,            // gekozen profiel-id uit de ProfielKiezer
    details: { kopschotjes: false, extraDetail: false, extraDetailTekst: "" },
    fotos: [],                // [{ id, dataUrl, opmerking }]
    opmerking: "",
    volgnummer,               // alleen voor de standaardnaam "Waterslag 1, 2, ..."
  };
}

export default function App() {
  // ── De centrale toestand ───────────────────────────────────────
  const [gebruiker, setGebruiker] = useState(null);             // string of null
  const [projecten, setProjecten] = useState([]);               // alle projecten
  const [actiefProjectId, setActiefProjectId] = useState(null); // open project
  const [actieveWaterslagId, setActieveWaterslagId] = useState(null); // open waterslag

  // ── Bij het opstarten: eerder opgeslagen gegevens inladen ──────
  useEffect(() => {
    // Oudere projecten (uit een eerdere versie) krijgen automatisch
    // een lege waterslagen-lijst, zodat niets stukgaat.
    const geladen = leesProjecten().map(p => ({ waterslagen: [], opmerking: "", ...p }));
    setProjecten(geladen);
    const sessie = leesSessie();
    if (sessie && sessie.gebruiker) setGebruiker(sessie.gebruiker);
  }, []);

  // Elke wijziging meteen bewaren in de browser (localStorage).
  useEffect(() => { schrijfProjecten(projecten); }, [projecten]);

  // Handige verwijzingen naar het open project / de open waterslag.
  const actiefProject = projecten.find(p => p.id === actiefProjectId) || null;
  const actieveWaterslag =
    actiefProject?.waterslagen.find(w => w.id === actieveWaterslagId) || null;

  // ── Inloggen / uitloggen ───────────────────────────────────────

  // Controle is voorlopig nep: elke invoer logt in.
  function inloggen(gebruikersnaam, ingelogdBlijven) {
    setGebruiker(gebruikersnaam);
    if (ingelogdBlijven) schrijfSessie({ gebruiker: gebruikersnaam });
    else wisSessie();
  }

  // ── Projecten ──────────────────────────────────────────────────

  // Nieuw, leeg project aanmaken en meteen openen.
  function nieuwProject() {
    const project = {
      id: nieuwId(),
      klant: "",
      omschrijving: "",
      waterslagen: [],
      opmerking: "",
    };
    setProjecten(vorige => [project, ...vorige]);
    setActiefProjectId(project.id);
  }

  // Een paar velden van het open project wijzigen (bv. { klant: "Jansen" }).
  function wijzigProject(wijziging) {
    setProjecten(lijst =>
      lijst.map(p => (p.id === actiefProjectId ? { ...p, ...wijziging } : p))
    );
  }

  // "Opslaan als": kopie van het open project maken en die openen.
  function opslaanAls() {
    if (!actiefProject) return;
    const kopie = {
      ...actiefProject,
      id: nieuwId(),
      omschrijving: (actiefProject.omschrijving || "Project") + " (kopie)",
      // Ook de waterslagen krijgen nieuwe id's, anders delen ze gegevens.
      waterslagen: actiefProject.waterslagen.map(w => ({ ...w, id: nieuwId() })),
    };
    setProjecten(vorige => [kopie, ...vorige]);
    setActiefProjectId(kopie.id);
  }

  function openProject(id) { setActiefProjectId(id); }
  function sluitProject() { setActiefProjectId(null); setActieveWaterslagId(null); }

  // ── Waterslagen binnen het open project ────────────────────────

  // Nieuwe waterslag-regel toevoegen en meteen openen.
  function nieuweWaterslag() {
    const ws = legeWaterslag(actiefProject.waterslagen.length + 1);
    wijzigProject({ waterslagen: [...actiefProject.waterslagen, ws] });
    setActieveWaterslagId(ws.id);
  }

  // Een paar velden van de open waterslag wijzigen (bv. { aantal: "3" }).
  function wijzigWaterslag(wijziging) {
    wijzigProject({
      waterslagen: actiefProject.waterslagen.map(w =>
        w.id === actieveWaterslagId ? { ...w, ...wijziging } : w
      ),
    });
  }

  // De open waterslag verwijderen en terug naar het projectscherm.
  function verwijderWaterslag() {
    wijzigProject({
      waterslagen: actiefProject.waterslagen.filter(w => w.id !== actieveWaterslagId),
    });
    setActieveWaterslagId(null);
  }

  function openWaterslag(id) { setActieveWaterslagId(id); }
  function sluitWaterslag() { setActieveWaterslagId(null); }

  // ── Kiezen welk scherm we tonen ────────────────────────────────

  // 1) Niet ingelogd → altijd eerst het loginscherm.
  if (!gebruiker) {
    return <LoginScherm onInloggen={inloggen} />;
  }

  // 2) Een waterslag open → het waterslag-scherm (maten, profiel, foto's).
  if (actiefProject && actieveWaterslag) {
    return (
      <WaterslagScherm
        waterslag={actieveWaterslag}
        onWijzig={wijzigWaterslag}
        onTerug={sluitWaterslag}
        onVerwijder={verwijderWaterslag}
      />
    );
  }

  // 3) Een project open → het projectscherm met de lijst waterslagen.
  if (actiefProject) {
    return (
      <ProjectScherm
        project={actiefProject}
        onWijzig={wijzigProject}
        onNieuweWaterslag={nieuweWaterslag}
        onOpenWaterslag={openWaterslag}
        onOpslaanAls={opslaanAls}
        onTerug={sluitProject}
      />
    );
  }

  // 4) Alleen ingelogd → de projectlijst.
  return (
    <ProjectLijst
      projecten={projecten}
      onNieuwProject={nieuwProject}
      onOpenProject={openProject}
    />
  );
}
