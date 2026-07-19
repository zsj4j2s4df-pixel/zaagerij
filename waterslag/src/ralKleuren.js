// ══════════════════════════════════════════════════════════════════
//  RAL-KLEUREN — een lijstje bekende RAL-codes met een benadering van
//  de kleur (hex). Puur om een klein kleurstaaltje te tonen naast de
//  ingevoerde code; de exacte kleur bepaal je natuurlijk met een
//  RAL-waaier. Staat een code er niet bij, dan tonen we gewoon geen
//  staaltje (je kunt elke code invullen).
// ══════════════════════════════════════════════════════════════════

// Veelgebruikte RAL-codes in de bouw (hex is een benadering).
const RAL_HEX = {
  "1015": "#E6D2B5", // licht ivoor
  "3000": "#A72920", // vuurrood
  "3005": "#59191F", // wijnrood
  "3011": "#792423", // bruinrood
  "5010": "#0E294B", // gentiaanblauw
  "5015": "#177EB0", // hemelsblauw
  "6005": "#114232", // mosgroen
  "6009": "#27352A", // dennengroen
  "6011": "#587246", // resedagroen
  "7016": "#383E42", // antracietgrijs
  "7021": "#2F3234", // zwartgrijs
  "7035": "#C5C7C4", // lichtgrijs
  "7039": "#6B665E", // kwartsgrijs
  "7040": "#9DA3A6", // venstergrijs
  "8003": "#7C4B24", // kleibruin
  "8014": "#4A3526", // sepiabruin
  "8016": "#3E2620", // mahoniebruin
  "8017": "#442F29", // chocoladebruin
  "9001": "#E9E0D2", // crèmewit
  "9005": "#0A0A0A", // gitzwart
  "9006": "#A5A5A5", // blank aluminiumkleurig
  "9007": "#878581", // grijs aluminiumkleurig
  "9010": "#F1F0EA", // zuiver wit
  "9016": "#F1F1EA", // verkeerswit
};

// Geeft de hex-kleur bij een ingevoerde RAL-code, of null als onbekend.
// Werkt met "7016", "RAL 7016", "ral7016 mat", enzovoort.
export function ralNaarHex(code) {
  if (!code) return null;
  const m = String(code).match(/\d{4}/); // pak vier cijfers
  if (!m) return null;
  return RAL_HEX[m[0]] || null;
}
