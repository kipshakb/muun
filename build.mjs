import { readFile, writeFile, mkdir, rename, rm, cp } from "node:fs/promises";
import fs from "node:fs";
import { execSync } from "node:child_process";
import crypto from "node:crypto";
import path from "node:path";

// ─────────────────────────────────────────────────────────────
// ВАЖНО: замените на реальный домен сайта (для canonical / hreflang / og).
const SITE_URL = "https://muun.kg";
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
  return codes
    .map((c) => {
      const isActive = c === active;
      const cls = isActive ? "lang-btn active" : "lang-btn";
      return `<a href="/${locales[c].path}" data-lang="${c}" class="${cls}" aria-current="${isActive ? "page" : "false"}">${locales[c].label}</a>`;
    })
    .join("");
}

for (const code of codes) {
  const L = locales[code];
  const S = i18n.strings[code];
const dir = path.join(OUT, L.path);
  await mkdir(dir, { recursive: true });

const pages = [
    { src: template, out: "index.html" },
    { src: fs.readFileSync("src/news.html", "utf8"), out: "news.html" },
    { src: fs.readFileSync("src/press.html", "utf8"), out: "press.html" }
  ];

  const assetPrefix = L.path ? "../assets/" : "assets/";
  const currentCssHref = `${assetPrefix}${cssName}`;

  for (const page of pages) {
    let html = page.src
      .replaceAll("{{htmlLang}}", L.htmlLang)
      .replaceAll("{{ogLocale}}", L.ogLocale)
      .replaceAll("{{meta_title}}", esc(L.meta.title))
      .replaceAll("{{meta_description}}", esc(L.meta.description))
      .replaceAll("{{canonical}}", `${SITE_URL}/${L.path}`)
      .replaceAll("{{home}}", `/${L.path}`)
      .replaceAll("{{css_href}}", currentCssHref)
      .replaceAll("{{assets_path}}", assetPrefix)
      .replaceAll('="/assets/', `="${assetPrefix}`)
      .replaceAll("='/assets/", `='${assetPrefix}`)
      .replace("{{hreflang}}", hreflangBlock())
      .replaceAll("{{lang_switcher}}", switcherHTML(code));

    for (const [k, v] of Object.entries(S)) {
      html = html.replaceAll(`{{${k}}}`, esc(v));
    }

    const leftover = html.match(/\{\{[a-z0-9_.]+\}\}/gi);
    if (leftover)
      throw new Error(
        `[${code}] незаполненные плейсхолдеры в ${page.out}: ${[...new Set(leftover)].join(", ")}`
      );

    await writeFile(path.join(dir, page.out), html, "utf8");
    console.log("✓", path.join(dir, page.out), `(${L.htmlLang})`);
  }
}

// 3.1) Копируем служебную страницу проверки билетов
const scannerHtml = await readFile("src/scanner.html", "utf8");
await writeFile(path.join(OUT, "scanner.html"), scannerHtml, "utf8");
for (const code of codes) {
  const L = locales[code];
  if (L.path) {
    await writeFile(path.join(OUT, L.path, "scanner.html"), scannerHtml, "utf8");
  }
}
console.log("✓ dist/scanner.html (сканер билетов)");

// 4) .htaccess для Plesk/Apache: gzip + долгий кэш ассетов, html без кэша
const htaccess = `# gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>

# 301 Редирект с www на без-www (Основной хост)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTP_HOST} ^www\.muun\.kg$ [NC]
  RewriteRule ^(.*)$ https://muun.kg/$1 [R=301,L]
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
console.log("✓ Генерируем точную копию Framer (pixel-perfect) с инъекцией MUUN контента...");
execSync('node scratch/build_framer_i18n.mjs', { stdio: 'inherit' });
console.log("✓ Готово. Залейте содержимое папки dist/ в httpdocs на Plesk.");
