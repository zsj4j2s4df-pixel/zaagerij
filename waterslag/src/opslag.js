// ══════════════════════════════════════════════════════════════════
//  OPSLAG — alles wat we in de browser bewaren (localStorage)
//  Eén centrale plek, zodat je later makkelijk kunt wisselen naar
//  een echte server zonder overal in de app te hoeven zoeken.
// ══════════════════════════════════════════════════════════════════

// We zetten voor elke sleutel "waterslag:" ervoor, zodat onze gegevens
// niet botsen met die van andere apps op hetzelfde adres.
const SLEUTELS = {
  projecten:    "waterslag:projecten",     // de lijst met projecten
  sessie:       "waterslag:sessie",        // wie is ingelogd (bij "ingelogd blijven")
  instellingen: "waterslag:instellingen",  // huisstijl-aanpassingen (scherm Instellingen, later)
};

// Veilig inlezen: geeft "standaard" terug als er niets staat of iets stuk is.
function lees(sleutel, standaard) {
  try {
    const ruw = localStorage.getItem(sleutel);
    return ruw ? JSON.parse(ruw) : standaard;
  } catch {
    return standaard;
  }
}

// Veilig wegschrijven.
function schrijf(sleutel, waarde) {
  try {
    localStorage.setItem(sleutel, JSON.stringify(waarde));
  } catch {
    // localStorage kan vol of geblokkeerd zijn; dan slaan we stil over.
  }
}

// ── Projecten ────────────────────────────────────────────────────
export const leesProjecten  = ()   => lees(SLEUTELS.projecten, []);
export const schrijfProjecten = (p) => schrijf(SLEUTELS.projecten, p);

// ── Sessie (ingelogd blijven) ────────────────────────────────────
export const leesSessie   = ()   => lees(SLEUTELS.sessie, null);
export const schrijfSessie = (s)  => schrijf(SLEUTELS.sessie, s);
export const wisSessie    = ()   => localStorage.removeItem(SLEUTELS.sessie);
