import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ── Vite-instellingen ────────────────────────────────────────────
// "base: ./" zorgt dat de app ook werkt als hij later in een submap
// online staat (bv. GitHub Pages / Cloudflare Pages).
export default defineConfig({
  base: "./",
  plugins: [react()],
});
