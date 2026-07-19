// ══════════════════════════════════════════════════════════════════
//  APP — het centrale brein van de app
//  Hier woont de "toestand" (state) van de hele app op één plek:
//    • ingelogd of niet (en wie)
//    • de instellingen (kleur, merknaam, teksten, profielen)
//    • de lijst met projecten
//    • welk project geopend is, en welke meting daarbinnen
//  Vanuit hier kiezen we welk scherm we laten zien.
//
//  Opbouw van de gegevens:
//    project = { id, klant, ordernummer, metingen: [...], opmerking }
//    meting  = { id, soort, naam, aantal, maten, profiel, details, fotos, opmerking }
//  "soort" is "waterslag" of "dakkap" — beide mogen in één project staan.
//  Eén meting-regel kan voor meerdere gelijke stuks staan (aantal).
// ══════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import LoginScherm from "./schermen/LoginScherm.jsx";
import ProjectLijst from "./schermen/ProjectLijst.jsx";
import ProjectScherm from "./schermen/ProjectScherm.jsx";
import MetingScherm from "./schermen/MetingScherm.jsx";
import Instellingen from "./schermen/Instellingen.jsx";
import { STANDAARD_INSTELLINGEN, vulInstellingenAan } from "./standaardInstellingen.js";
import {
  leesProjecten, schrijfProjecten,
  leesSessie, schrijfSessie, wisSessie,
  leesInstellingen, schrijfInstellingen,
} from "./opslag.js";

// Klein hulpje om een uniek id te maken.
const nieuwId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// Een lege meting-regel (één type, eventueel meerdere stuks).
export function legeMeting(soort, volgnummer) {
  return {
    id: nieuwId(),
    soort,                    // "waterslag" of "dakkap"
    naam: "",                 // bv. "Voorgevel links" (mag leeg blijven)
    aantal: "1",              // hoeveel gelijke stuks dit type heeft
    maten: { lengte: "", breedte: "", hoogte: "", hoek: "" }, // in mm / graden
    profiel: null,            // gekozen profiel-id uit de ProfielKiezer
    details: { kopschotjes: false, extraDetail: false, extraDetailTekst: "" },
    fotos: [],                // [{ id, dataUrl, opmerking }]
    opmerking: "",
    volgnummer,               // voor de standaardnaam "Waterslag 1", "Dakkap 1", ...
  };
}

export default function App() {
  // ── De centrale toestand ───────────────────────────────────────
  const [gebruiker, setGebruiker] = useState(null);             // string of null
  const [instellingen, setInstellingen] = useState(STANDAARD_INSTELLINGEN);
  const [projecten, setProjecten] = useState([]);               // alle projecten
  const [actiefProjectId, setActiefProjectId] = useState(null); // open project
  const [actieveMetingId, setActieveMetingId] = useState(null); // open meting
  const [toonInstellingen, setToonInstellingen] = useState(false);

  // ── Bij het opstarten: eerder opgeslagen gegevens inladen ──────
  useEffect(() => {
    // Instellingen laden en aanvullen met eventueel nieuwe standaardwaarden.
    setInstellingen(vulInstellingenAan(leesInstellingen()));

    // Projecten laden en oudere opslag netjes bijwerken:
    //  • veld "omschrijving" → "ordernummer"
    //  • oude "waterslagen" → "metingen" (met soort "waterslag")
    const geladen = leesProjecten().map(p => {
      const metingen = (p.metingen || p.waterslagen || []).map(m => ({
        soort: "waterslag", ...m,
      }));
      return {
        opmerking: "",
        ordernummer: p.ordernummer ?? p.omschrijving ?? "",
        ...p,
        metingen,
      };
    });
    setProjecten(geladen);

    const sessie = leesSessie();
    if (sessie && sessie.gebruiker) setGebruiker(sessie.gebruiker);
  }, []);

  // Elke wijziging meteen bewaren in de browser (localStorage).
  useEffect(() => { schrijfProjecten(projecten); }, [projecten]);
  useEffect(() => { schrijfInstellingen(instellingen); }, [instellingen]);

  // De accentkleur live toepassen op de hele app via de CSS-variabele --accent.
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", instellingen.accent);
  }, [instellingen.accent]);

  // Handige verwijzingen naar het open project / de open meting.
  const actiefProject = projecten.find(p => p.id === actiefProjectId) || null;
  const actieveMeting =
    actiefProject?.metingen.find(m => m.id === actieveMetingId) || null;

  // ── Inloggen / uitloggen ───────────────────────────────────────

  // Controle is voorlopig nep: elke invoer logt in.
  function inloggen(gebruikersnaam, ingelogdBlijven) {
    setGebruiker(gebruikersnaam);
    if (ingelogdBlijven) schrijfSessie({ gebruiker: gebruikersnaam });
    else wisSessie();
  }

  // ── Instellingen wijzigen ──────────────────────────────────────
  function wijzigInstellingen(wijziging) {
    setInstellingen(vorige => ({ ...vorige, ...wijziging }));
  }

  // ── Projecten ──────────────────────────────────────────────────

  function nieuwProject() {
    const project = {
      id: nieuwId(),
      klant: "",
      ordernummer: "",
      metingen: [],
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
      klant: (actiefProject.klant || "Project") + " (kopie)",
      // Ook de metingen krijgen nieuwe id's, anders delen ze gegevens.
      metingen: actiefProject.metingen.map(m => ({ ...m, id: nieuwId() })),
    };
    setProjecten(vorige => [kopie, ...vorige]);
    setActiefProjectId(kopie.id);
  }

  function openProject(id) { setActiefProjectId(id); }
  function sluitProject() { setActiefProjectId(null); setActieveMetingId(null); }

  // ── Metingen binnen het open project ───────────────────────────

  // Nieuwe meting-regel toevoegen en meteen openen. "soort" bepaalt
  // of het een waterslag of een dakkap is.
  function nieuweMeting(soort) {
    // Volgnummer per soort, zodat je "Waterslag 1, 2" en "Dakkap 1" krijgt.
    const aantalVanSoort = actiefProject.metingen.filter(m => m.soort === soort).length;
    const meting = legeMeting(soort, aantalVanSoort + 1);
    wijzigProject({ metingen: [...actiefProject.metingen, meting] });
    setActieveMetingId(meting.id);
  }

  // Een paar velden van de open meting wijzigen (bv. { aantal: "3" }).
  function wijzigMeting(wijziging) {
    wijzigProject({
      metingen: actiefProject.metingen.map(m =>
        m.id === actieveMetingId ? { ...m, ...wijziging } : m
      ),
    });
  }

  // De open meting verwijderen en terug naar het projectscherm.
  function verwijderMeting() {
    wijzigProject({
      metingen: actiefProject.metingen.filter(m => m.id !== actieveMetingId),
    });
    setActieveMetingId(null);
  }

  function openMeting(id) { setActieveMetingId(id); }
  function sluitMeting() { setActieveMetingId(null); }

  // ── Kiezen welk scherm we tonen ────────────────────────────────

  // 1) Niet ingelogd → altijd eerst het loginscherm.
  if (!gebruiker) {
    return <LoginScherm onInloggen={inloggen} instellingen={instellingen} />;
  }

  // 2) Instellingen-scherm geopend.
  if (toonInstellingen) {
    return (
      <Instellingen
        instellingen={instellingen}
        onWijzig={wijzigInstellingen}
        onHerstel={() => setInstellingen(STANDAARD_INSTELLINGEN)}
        onTerug={() => setToonInstellingen(false)}
      />
    );
  }

  // 3) Een meting open → het meting-scherm (maten, profiel, foto's).
  if (actiefProject && actieveMeting) {
    return (
      <MetingScherm
        meting={actieveMeting}
        profielen={instellingen.profielen[actieveMeting.soort] || []}
        onWijzig={wijzigMeting}
        onTerug={sluitMeting}
        onVerwijder={verwijderMeting}
      />
    );
  }

  // 4) Een project open → het projectscherm met de lijst metingen.
  if (actiefProject) {
    return (
      <ProjectScherm
        project={actiefProject}
        instellingen={instellingen}
        onWijzig={wijzigProject}
        onNieuweMeting={nieuweMeting}
        onOpenMeting={openMeting}
        onOpslaanAls={opslaanAls}
        onTerug={sluitProject}
      />
    );
  }

  // 5) Alleen ingelogd → de projectlijst.
  return (
    <ProjectLijst
      projecten={projecten}
      instellingen={instellingen}
      onNieuwProject={nieuwProject}
      onOpenProject={openProject}
      onOpenInstellingen={() => setToonInstellingen(true)}
    />
  );
}
