// ══════════════════════════════════════════════════════════════════
//  useBreed — kleine "hook" die vertelt of het scherm breed is (desktop).
//  Zo kunnen de schermen op een grote monitor een bredere, overzichtelijke
//  indeling tonen (meerdere kolommen) en op telefoon de smalle kolom houden.
//  Standaard grens: 900 pixels breed.
// ══════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";

export function useBreed(px = 900) {
  const vraag = `(min-width:${px}px)`;

  // Beginwaarde meteen goed zetten (voorkomt "flikkeren" bij het laden).
  const [breed, setBreed] = useState(
    () => typeof window !== "undefined" && window.matchMedia(vraag).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(vraag);
    const luister = () => setBreed(mq.matches);
    mq.addEventListener("change", luister);   // meebewegen als je het venster versleept
    return () => mq.removeEventListener("change", luister);
  }, [vraag]);

  return breed;
}
