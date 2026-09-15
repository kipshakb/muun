import { readFile, writeFile, mkdir, rename, rm, cp } from "node:fs/promises";
import { execSync } from "node:child_process";
import crypto from "node:crypto";
import path from "node:path";

// ─────────────────────────────────────────────────────────────
// ВАЖНО: замените на реальный домен сайта (для canonical / hreflang / og).
const SITE_URL = "https://placy.kz";
// ─────────────────────────────────────────────────────────────

const OUT = "dist";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const i18n = JSON.parse(await readFile("src/i18n.json", "utf8"));
const template = await readFile("src/template.html", "utf8");
const locales = i18n.locales;
const codes = Object.keys(locales);

// чистая пересборка
await rm(OUT, { recursive: true, force: true });
await mkdir(path.join(OUT, "assets"), { recursive: true });

// 1) Компилируем Tailwind и добавляем хеш в имя файла (для долгого кэша)
execSync(
  `npx tailwindcss -i src/styles.css -o ${OUT}/assets/styles.css --minify`,
  { stdio: "inherit" },
);
const css = await readFile(path.join(OUT, "assets", "styles.css"));
const hash = crypto.createHash("sha1").update(css).digest("hex").slice(0, 8);
const cssName = `styles.${hash}.css`;
await rename(
  path.join(OUT, "assets", "styles.css"),
  path.join(OUT, "assets", cssName),
);
const cssHref = `/assets/${cssName}`;

// 2) Копируем картинки в dist/assets/ (полностью автономный сайт)
await cp("assets", path.join(OUT, "assets"), { recursive: true });

// 3) Генерируем страницы по языкам
function hreflangBlock() {
  const links = codes.map(
    (c) =>
      `    <link rel="alternate" hreflang="${locales[c].htmlLang}" href="${SITE_URL}/${locales[c].path}" />`,
  );
  links.push(
    `    <link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`,
  );
  return links.join("\n");
}

function switcherHTML(active) {
  const base =
    "lang-btn inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold tracking-wide leading-none transition-colors";
  return codes
    .map((c) => {
      const isActive = c === active;
      const cls = isActive
        ? `${base} bg-brand-navy text-primary-foreground`
        : `${base} text-foreground/70 hover:bg-secondary`;
      return `<a href="/${locales[c].path}" data-lang="${c}" class="${cls}" aria-current="${isActive ? "page" : "false"}">${locales[c].label}</a>`;
    })
    .join("");
}

for (const code of codes) {
  const L = locales[code];
  const S = i18n.strings[code];
  let html = template
    .replaceAll("{{htmlLang}}", L.htmlLang)
    .replaceAll("{{ogLocale}}", L.ogLocale)
    .replaceAll("{{meta_title}}", esc(L.meta.title))
    .replaceAll("{{meta_description}}", esc(L.meta.description))
    .replaceAll("{{canonical}}", `${SITE_URL}/${L.path}`)
    .replaceAll("{{home}}", `/${L.path}`)
    .replaceAll("{{css_href}}", cssHref)
    .replace("{{hreflang}}", hreflangBlock())
    .replaceAll("{{lang_switcher}}", switcherHTML(code));

  for (const [k, v] of Object.entries(S)) {
    html = html.replaceAll(`{{${k}}}`, esc(v));
  }

  const leftover = html.match(/\{\{[a-z0-9_.]+\}\}/gi);
  if (leftover)
    throw new Error(
      `[${code}] незаполненные плейсхолдеры: ${[...new Set(leftover)].join(", ")}`,
    );

  const dir = path.join(OUT, L.path);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), html, "utf8");
  console.log("✓", path.join(dir, "index.html"), `(${L.htmlLang})`);
}

// 4) .htaccess для Plesk/Apache: gzip + долгий кэш ассетов, html без кэша
const htaccess = `# gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>
# кэш: хешированные ассеты — навсегда, html — не кэшировать
<IfModule mod_headers.c>
  <FilesMatch "\\.(css|js|woff2|png|jpe?g|svg)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
`;
await writeFile(path.join(OUT, ".htaccess"), htaccess, "utf8");

console.log("\n✓ CSS:", cssHref);
console.log("✓ Готово. Залейте содержимое папки dist/ в httpdocs на Plesk.");
