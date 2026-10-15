// The Framer runtime stays loaded. Removing it collapses layout, breakpoints
// and the ticket graphic. This module only remembers the phrases each language
// uses, so the engine files can be patched before they paint. See
// vendor_framer_engine.mjs.
import fs from "fs";

const PAIRS_FILE = "dist/.framer-pairs.json";

export function stripFramerRuntime(html, options) {
  if (options && options.lang && Array.isArray(options.pairs)) {
    fs.mkdirSync("dist", { recursive: true });
    let data = {};
    try { data = JSON.parse(fs.readFileSync(PAIRS_FILE, "utf8")); } catch { /* first write */ }
    const prev = Array.isArray(data[options.lang]) ? data[options.lang] : [];
    const seen = new Set(prev.map((pair) => pair[0]));
    for (const pair of options.pairs) {
      if (!pair || typeof pair[0] !== "string" || typeof pair[1] !== "string") continue;
      if (!pair[0] || pair[0] === pair[1] || seen.has(pair[0])) continue;
      seen.add(pair[0]);
      prev.push(pair);
    }
    data[options.lang] = prev;
    fs.writeFileSync(PAIRS_FILE, JSON.stringify(data));
  }
  return html;
}
