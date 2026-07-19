// ══════════════════════════════════════════════════════════════════
//  SOORTEN — de twee dingen die je kunt inmeten: waterslag en dakkap
//  Eén centrale plek voor de teksten die per soort verschillen, zodat
//  labels als "Aantal ramen" / "Aantal dakkappen" automatisch kloppen.
// ══════════════════════════════════════════════════════════════════

export const SOORTEN = {
  waterslag: {
    label: "Waterslag",
    meervoud: "waterslagen",
    aantalLabel: "Aantal ramen",
    gelijkTekst: "Gelijke ramen? Vul ze hier één keer in en zet het aantal erbij.",
  },
  dakkap: {
    label: "Dakkap",
    meervoud: "dakkappen",
    aantalLabel: "Aantal dakkappen",
    gelijkTekst: "Gelijke dakkappen? Vul ze hier één keer in en zet het aantal erbij.",
  },
};

// Handig hulpje: geef de info van een soort, met terugval op waterslag.
export const soortInfo = (soort) => SOORTEN[soort] || SOORTEN.waterslag;
