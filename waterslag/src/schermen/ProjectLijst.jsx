// ══════════════════════════════════════════════════════════════════
//  SCHERM 2 — PROJECTLIJST
//  Overzicht van opgeslagen projecten als kaarten (klantnaam + omschrijving),
//  met bovenaan een knop "Nieuw project".
// ══════════════════════════════════════════════════════════════════

import React from "react";
import { C, F, Card, PrimaryBtn } from "../huisstijl.jsx";

export default function ProjectLijst({ projecten, onNieuwProject, onOpenProject }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: F }}>

      {/* ── Bovenbalk met titel ─────────────────────────────────── */}
      <div style={{
        background: C.card, borderBottom: `1px solid ${C.sep}`,
        padding: "14px 18px",
        paddingTop: "calc(14px + env(safe-area-inset-top))",
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.brand }}>Projecten</div>
        <div style={{ fontSize: 13, color: C.t3, marginTop: 2 }}>
          {projecten.length === 0
            ? "Nog geen projecten"
            : `${projecten.length} ${projecten.length === 1 ? "project" : "projecten"}`}
        </div>
      </div>

      {/* ── Inhoud ──────────────────────────────────────────────── */}
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14,
        maxWidth: 560, margin: "0 auto" }}>

        {/* Knop om een nieuw project te starten (primaire actie) */}
        <PrimaryBtn onClick={onNieuwProject} icon={<span style={{ fontSize: 18 }}>+</span>}>
          Nieuw project
        </PrimaryBtn>

        {/* Lege lijst → vriendelijke uitleg. Anders → de kaarten. */}
        {projecten.length === 0 ? (
          <div style={{ textAlign: "center", color: C.t3, fontSize: 14,
            padding: "40px 20px", lineHeight: 1.5 }}>
            Je hebt nog geen projecten.<br />
            Tik op “Nieuw project” om te beginnen.
          </div>
        ) : (
          projecten.map(project => (
            <ProjectKaart
              key={project.id}
              project={project}
              onOpen={() => onOpenProject(project.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ── Eén project als aantikbare kaart ────────────────────────────────
function ProjectKaart({ project, onOpen }) {
  return (
    <Card style={{ cursor: "pointer", padding: "16px" }}>
      {/* De hele kaart is aantikbaar om het project te openen. */}
      <div onClick={onOpen}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>
          {project.klant?.trim() ? project.klant : "Nog geen klantnaam"}
        </div>
        <div style={{ fontSize: 14, color: C.t3, marginTop: 4 }}>
          {project.omschrijving?.trim() ? project.omschrijving : "Geen omschrijving"}
        </div>
      </div>
    </Card>
  );
}
