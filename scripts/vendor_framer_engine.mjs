// Downloads the Framer modules the pages already use, rewrites Eventis phrases
// inside them, and points the pages at those local copies.
// The runtime still executes, so layout and interaction stay intact. It no
// longer waits on a slow CDN response and then paints the original template.
import fs from "fs";
import path from "path";

const SITE = "https://framerusercontent.com/sites/77e7t7QkgEB7TyAgJkDYnz/";
const PAIRS_FILE = "dist/.framer-pairs.json";
const TEMPLATES = [
  "templates/eventis_raw.html",
  "templates/eventis_speakers.html",
  "templates/eventis_agenda.html",
  "templates/eventis_venue.html",
  "templates/eventis_contact.html"
];

const UNIVERSAL = [
  ["Alcron Tech Summit", "MUUN"],
  ["AIcron Tech Summit", "MUUN"],
  ["AIcron", "MUUN"],
  ["Alcron", "MUUN"],
  ["Eventis", "MUUN"]
];

function seedFiles() {
  const names = new Set();
  for (const file of TEMPLATES) {
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/framerusercontent\.com\/sites\/77e7t7QkgEB7TyAgJkDYnz\/([A-Za-z0-9_.+-]+\.mjs)/g)) {
      names.add(match[1]);
    }
  }
  return names;
}

function discover(text, queue, seen) {
  for (const match of text.matchAll(/[A-Za-z0-9_.+-]+\.mjs/g)) {
    const name = match[0];
    if (!seen.has(name)) queue.push(name);
  }
}

async function downloadAll() {
  const seen = new Set();
  const queue = [...seedFiles()];
  const files = new Map();
  while (queue.length) {
    const name = queue.pop();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const res = await fetch(SITE + name);
    if (!res.ok) {
      console.warn("skip", name, res.status);
      continue;
    }
    const text = await res.text();
    files.set(name, text);
    discover(text, queue, seen);
  }
  return files;
}

function patchSource(source, pairs) {
  const list = pairs
    .filter((pair) => pair && typeof pair[0] === "string" && typeof pair[1] === "string")
    .filter((pair) => pair[0].length >= 10 && pair[0] !== pair[1] && !pair[1].includes(pair[0]))
    .filter((pair) => !pair[0].includes("<") && !pair[0].includes("{") && !pair[0].includes("http"))
    .sort((a, b) => b[0].length - a[0].length);
  let out = source;
  for (const [from, to] of list) {
    if (out.includes(from)) out = out.split(from).join(to);
  }
  for (const [from, to] of UNIVERSAL) {
    if (from.length >= 10) continue;
    if (out.includes(from)) out = out.split(from).join(to);
  }
  return out;
}

function langOf(file) {
  const parts = file.split(path.sep);
  if (parts.includes("ky")) return "ky";
  if (parts.includes("en")) return "en";
  return "ru";
}

function rewriteHtml(filesByLang) {
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "framer") continue;
        walk(full);
        continue;
      }
      if (!entry.name.endsWith(".html")) continue;
      const lang = langOf(full);
      if (!filesByLang.has(lang)) continue;
      const prefix = `/assets/framer/${lang}/`;
      const html = fs.readFileSync(full, "utf8");
      const next = html.split(SITE).join(prefix);
      if (next !== html) fs.writeFileSync(full, next);
    }
  };
  walk("dist");
}

export async function vendorFramerEngine() {
  if (!fs.existsSync(PAIRS_FILE)) {
    console.warn("framer engine: no phrase list, leaving the CDN copy in place");
    return;
  }
  const pairs = JSON.parse(fs.readFileSync(PAIRS_FILE, "utf8"));
  const files = await downloadAll();
  console.log("framer engine: fetched", files.size, "modules");
  const written = new Set();
  for (const lang of ["ru", "ky", "en"]) {
    const dir = path.join("dist", "assets", "framer", lang);
    fs.mkdirSync(dir, { recursive: true });
    const langPairs = [...(pairs[lang] || []), ...UNIVERSAL];
    for (const [name, source] of files) {
      fs.writeFileSync(path.join(dir, name), patchSource(source, langPairs));
      written.add(lang);
    }
  }
  rewriteHtml(written);
  console.log("framer engine: pages now load the local patched runtime");
}
