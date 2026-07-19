// ══════════════════════════════════════════════════════════════════
//  STANDAARD-INSTELLINGEN — hoe de app eruitziet als je nog niets
//  hebt aangepast. In het Instellingen-scherm kun je dit wijzigen;
//  je aanpassingen worden in de browser bewaard (localStorage).
//
//  Wat je kunt instellen:
//    • accent      → de accentkleur (knoppen, koppen, ...)
//    • merknaam    → de naam bovenaan het loginscherm
//    • begroeting  → de tekst onder de merknaam op het loginscherm
//    • profielen   → de keuzelijst met profielen, apart voor
//                    waterslag en dakkap (toevoegen/verwijderen kan)
//
//  Een profiel heeft: id, naam, info en (optioneel) "lijn" — dat laatste
//  is een klein doorsnede-tekeningetje. Zelf toegevoegde profielen krijgen
//  geen tekeningetje; die tonen een neutraal icoontje.
// ══════════════════════════════════════════════════════════════════

import { ACCENT_STANDAARD } from "./huisstijl.jsx";

export const STANDAARD_INSTELLINGEN = {
  accent: ACCENT_STANDAARD,
  merknaam: "Waterslag",
  begroeting: "Waterslagen en dakkappen inmeten op locatie",
  profielen: {
    waterslag: [
      { id: "standaard", naam: "Standaard",    info: "Recht met afschot",     lijn: "6,10 46,22 46,28 41,28" },
      { id: "opkant",    naam: "Met opkant",   info: "Opstaande rand achter", lijn: "10,4 10,12 48,24 48,29 43,29" },
      { id: "dubbel",    naam: "Dubbele knik", info: "Twee knikken",          lijn: "6,8 26,14 30,19 50,25 50,29" },
      { id: "vlak",      naam: "Vlak",         info: "Zonder afschot",        lijn: "6,16 50,16 50,23" },
    ],
    dakkap: [
      { id: "plat",   naam: "Plat dak",   info: "Platte bovenkant", lijn: "8,12 48,12 48,26" },
      { id: "schuin", naam: "Schuin dak", info: "Aflopend dak",     lijn: "8,9 48,20 48,26" },
      { id: "tent",   naam: "Puntdak",    info: "Dak met nok",      lijn: "8,24 28,9 48,24" },
    ],
  },
};

// Voegt ontbrekende standaardwaarden toe aan wat er is opgeslagen, zodat
// oudere opslag (bv. zonder dakkap-profielen) toch compleet wordt.
export function vulInstellingenAan(opgeslagen) {
  const o = opgeslagen || {};
  return {
    ...STANDAARD_INSTELLINGEN,
    ...o,
    profielen: {
      ...STANDAARD_INSTELLINGEN.profielen,
      ...(o.profielen || {}),
    },
  };
}
