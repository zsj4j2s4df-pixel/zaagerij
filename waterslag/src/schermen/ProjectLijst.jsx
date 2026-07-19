// ══════════════════════════════════════════════════════════════════
//  SCHERM 2 — PROJECTLIJST
//  Overzicht van opgeslagen projecten als kaarten (klantnaam + ordernummer),
//  met bovenaan een knop "Nieuw project" en rechtsboven de instellingen.
// ══════════════════════════════════════════════════════════════════

import React from "react";
import { C, F, Card, PrimaryBtn } from "../huisstijl.jsx";
import { useBreed } from "../useBreed.js";

export default function ProjectLijst({
  projecten, instellingen, onNieuwProject, onOpenProject, onOpenInstellingen,
}) {
  const breed = useBreed(); // desktop = breder + raster
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: F }}>

      {/* ── Bovenbalk met titel + instellingen-knop ─────────────── */}
      <div style={{
        background: C.card, borderBottom: `1px solid ${C.sep}`,
        padding: "14px 18px",
        paddingTop: "calc(14px + env(safe-area-inset-top))",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.brand }}>
            {instellingen?.merknaam || "Projecten"}
          </div>
          <div style={{ fontSize: 13, color: C.t3, marginTop: 2 }}>
            {projecten.length === 0
              ? "Nog geen projecten"
              : `${projecten.length} ${projecten.length === 1 ? "project" : "projecten"}`}
          </div>
        </div>
        {/* Tandwiel-knop naar de instellingen */}
        <button
          onClick={onOpenInstellingen} aria-label="Instellingen"
          style={{ border: `1px solid ${C.sep}`, background: C.inset,
            borderRadius: 12, width: 44, height: 44, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
            stroke={C.brand} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* ── Inhoud ──────────────────────────────────────────────── */}
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16,
        maxWidth: breed ? 1040 : 560, margin: "0 auto" }}>

        {/* Knop om een nieuw project te starten (primaire actie).
            Op desktop niet over de volle breedte, maar compact links. */}
        <div style={{ maxWidth: breed ? 260 : "100%" }}>
          <PrimaryBtn onClick={onNieuwProject} icon={<span style={{ fontSize: 18 }}>+</span>}>
            Nieuw project
          </PrimaryBtn>
        </div>

        {/* Lege lijst → vriendelijke uitleg. Anders → de kaarten.
            Op desktop tonen we de kaarten in een raster van meerdere kolommen. */}
        {projecten.length === 0 ? (
          <div style={{ textAlign: "center", color: C.t3, fontSize: 14,
            padding: "40px 20px", lineHeight: 1.5 }}>
            Je hebt nog geen projecten.<br />
            Tik op “Nieuw project” om te beginnen.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14,
            gridTemplateColumns: breed ? "repeat(auto-fill, minmax(280px, 1fr))" : "1fr" }}>
            {projecten.map(project => (
              <ProjectKaart
                key={project.id}
                project={project}
                onOpen={() => onOpenProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Eén project als aantikbare kaart ────────────────────────────────
// Toont: klantnaam + ordernummer, en hoeveel metingen erin zitten.
function ProjectKaart({ project, onOpen }) {
  const aantal = project.metingen?.length || 0;
  return (
    <Card style={{ cursor: "pointer", padding: "16px" }}>
      {/* De hele kaart is aantikbaar om het project te openen. */}
      <div onClick={onOpen}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>
          {project.klant?.trim() ? project.klant : "Nog geen klantnaam"}
        </div>
        <div style={{ fontSize: 14, color: C.t3, marginTop: 4 }}>
          {project.ordernummer?.trim() ? `Order ${project.ordernummer}` : "Geen ordernummer"}
          {aantal > 0 && ` · ${aantal} ${aantal === 1 ? "meting" : "metingen"}`}
        </div>
      </div>
    </Card>
  );
}
