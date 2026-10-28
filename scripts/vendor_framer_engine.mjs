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

const LOGO_AICRON = "1BHox7UUEVMJHfAPN4qPh5r4o";
const LOGO_NAV = "tJ1jqpEOBL9Nna5facx9Yh1rSA";
const LOGO_CRYSTAL = "/assets/logo-crystal.png";
const LOGO_HEADER = "/assets/logo-header.png";
const LOGO_FOOTER = "/assets/logo-footer.png";

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

const SPEAKER_PHOTOS = {
  'eTTTIcVnwyKXnDY6kbVhA1AyzQ': '/assets/speaker-kasymaliev.png',
  'XhuDITv6DpWNuBYIj1HtJ4DvTQw': '/assets/speaker-isamatova.jpg',
  '86VJMTqMd6VC2SOf3RhzPDR4emk': '/assets/speaker-oruntaev.jpg',
  'TzozA0OcRZ36gzl3GAQAWwujo': '/assets/speaker-rysbekov.jpg',
  'FVjwWr85ut7DBy7LiAzsJoNMlLM': '/assets/speaker-kubatov.jpg',
  'dlhgx3fMLQZlK7XF8F8pg5OGE': '/assets/speaker-surabaldieva.jpg',
  'cFl24iPInxckRrL32eRgadp9ZJM': '/assets/speaker-dinara.jpg',
  'UPhDD72urZKey0YOy5IaOSRCJj0': '/assets/speaker-alisherova.jpg'
};

const SPEAKER_TEXTS = {
  ru: [
    ['Dr. Emma Parker', 'Касымалиев Адылбек Алешович'],
    ['Senior Software Engineer', 'Председатель Кабинета Министров Кыргызской Республики – Руководитель Администрации Президента Кыргызской Республики'],
    ['John Mitchell', 'Исаматова Гульзат Тыныбековна'],
    ['Full Stack Developer', 'Министр науки, высшего образования и инноваций Кыргызской Республики'],
    ['Samantha Hayes', 'Орунтаев Нурдан Кемелович'],
    ['Backend Architect', 'Министр строительства, архитектуры и жилищно-коммунального хозяйства Кыргызской Республики'],
    ['James Turner', 'Рысбеков Алтынбек Дурусбекович'],
    ['DevOps Specialist', 'Министр энергетики Кыргызской Республики'],
    ['Laura Chang', 'Кубатов Эдуард'],
    ['Director of AI Strategy', 'Директор Государственного агентства по развитию туризма при Кабинете министров Кыргызской Республики, Президент Федерации альпинизма'],
    ['Michael Anderson', 'Эльвира Сурабалдиева'],
    ['Chief Technologist', 'Депутат Жогорку Кенеша Кыргызской Республики'],
    ['Cloud Solutions Expert', 'Депутат Жогорку Кенеша Кыргызской Республики'],
    ['Mobile App Engineer', 'Депутат Жогорку Кенеша Кыргызской Республики'],
    ['Dr. Maya Bennett', 'Динара Русланкызы'],
    ['AI/ML Engineer', 'Основатель и директор ИТ-компании CODIFY'],
    ['Jonathan Reyes', 'Айжан Алишерова'],
    ['Technical Lead – Web Platforms', 'Основатель фонда поддержки стартапов «We Fund»'],
    ['Chief AI Scientist', 'Председатель Кабинета Министров Кыргызской Республики – Руководитель Администрации Президента Кыргызской Республики'],
    ['CEO, AI Solutions Corp', 'Министр науки, высшего образования и инноваций Кыргызской Республики'],
    ['Senior Data Scientist', 'Министр строительства, архитектуры и жилищно-коммунального хозяйства Кыргызской Республики']
  ],
  ky: [
    ['Dr. Emma Parker', 'Касымалиев Адылбек Алешович'],
    ['Senior Software Engineer', 'Кыргыз Республикасынын Министрлер Кабинетинин Төрагасы – Кыргыз Республикасынын Президентинин Администрациясынын жетекчиси'],
    ['John Mitchell', 'Исаматова Гульзат Тыныбековна'],
    ['Full Stack Developer', 'Кыргыз Республикасынын илим, жогорку билим берүү жана инновациялар министри'],
    ['Samantha Hayes', 'Орунтаев Нурдан Кемелович'],
    ['Backend Architect', 'Кыргыз Республикасынын курулуш, архитектура жана турак жай-коммуналдык чарба министри'],
    ['James Turner', 'Рысбеков Алтынбек Дурусбекович'],
    ['DevOps Specialist', 'Кыргыз Республикасынын энергетика министри'],
    ['Laura Chang', 'Кубатов Эдуард'],
    ['Director of AI Strategy', 'Кыргыз Республикасынын Министрлер Кабинетине караштуу Туризмди өнүктүрүү боюнча мамлекеттик агенттиктин директору, Альпинизм федерациясынын президенти'],
    ['Michael Anderson', 'Эльвира Сурабалдиева'],
    ['Chief Technologist', 'Кыргыз Республикасынын Жогорку Кеңешинин депутаты'],
    ['Cloud Solutions Expert', 'Кыргыз Республикасынын Жогорку Кеңешинин депутаты'],
    ['Mobile App Engineer', 'Кыргыз Республикасынын Жогорку Кеңешинин депутаты'],
    ['Dr. Maya Bennett', 'Динара Русланкызы'],
    ['AI/ML Engineer', 'CODIFY ИТ-компаниясынын негиздөөчүсү жана директору'],
    ['Jonathan Reyes', 'Айжан Алишерова'],
    ['Technical Lead – Web Platforms', '«We Fund» стартаптарды колдоо фондунун негиздөөчүсү'],
    ['Chief AI Scientist', 'Кыргыз Республикасынын Министрлер Кабинетинин Төрагасы – Кыргыз Республикасынын Президентинин Администрациясынын жетекчиси'],
    ['CEO, AI Solutions Corp', 'Кыргыз Республикасынын илим, жогорку билим берүү жана инновациялар министри'],
    ['Senior Data Scientist', 'Кыргыз Республикасынын курулуш, архитектура жана турак жай-коммуналдык чарба министри']
  ],
  en: [
    ['Dr. Emma Parker', 'Adylbek Aleshovich Kasymaliev'],
    ['Senior Software Engineer', 'Chairman of the Cabinet of Ministers of the Kyrgyz Republic – Head of the Presidential Administration of the Kyrgyz Republic'],
    ['John Mitchell', 'Gulzat Tynybekovna Isamatova'],
    ['Full Stack Developer', 'Minister of Science, Higher Education and Innovation of the Kyrgyz Republic'],
    ['Samantha Hayes', 'Nurdan Kemelovich Oruntaev'],
    ['Backend Architect', 'Minister of Construction, Architecture and Housing and Communal Services of the Kyrgyz Republic'],
    ['James Turner', 'Altynbek Durusbekovich Rysbekov'],
    ['DevOps Specialist', 'Minister of Energy of the Kyrgyz Republic'],
    ['Laura Chang', 'Eduard Kubatov'],
    ['Director of AI Strategy', 'Director of the State Agency for Tourism Development under the Cabinet of Ministers of the Kyrgyz Republic, President of the Mountaineering Federation'],
    ['Michael Anderson', 'Elvira Surabaldieva'],
    ['Chief Technologist', 'Member of the Jogorku Kenesh of the Kyrgyz Republic'],
    ['Cloud Solutions Expert', 'Member of the Jogorku Kenesh of the Kyrgyz Republic'],
    ['Mobile App Engineer', 'Member of the Jogorku Kenesh of the Kyrgyz Republic'],
    ['Dr. Maya Bennett', 'Dinara Ruslankyzy'],
    ['AI/ML Engineer', 'Founder and Director of the IT company CODIFY'],
    ['Jonathan Reyes', 'Aizhan Alisherova'],
    ['Technical Lead – Web Platforms', 'Founder of the startup support fund We Fund'],
    ['Chief AI Scientist', 'Chairman of the Cabinet of Ministers of the Kyrgyz Republic – Head of the Presidential Administration of the Kyrgyz Republic'],
    ['CEO, AI Solutions Corp', 'Minister of Science, Higher Education and Innovation of the Kyrgyz Republic'],
    ['Senior Data Scientist', 'Minister of Construction, Architecture and Housing and Communal Services of the Kyrgyz Republic']
  ]
};

function patchSource(source, pairs, lang, name = '') {
  let out = source;

  // 0. Replace Eventis logos with MUUN assets. The hero "AICRON" mark lives in
  // page modules, the same SVG is reused by the footer in script_main, and the
  // navbar logo is in script_main too. srcSet is dropped so the browser cannot
  // pick a CDN variant of the stock file.
  const aicronTarget = name.startsWith('script_main') ? LOGO_FOOTER : LOGO_CRYSTAL;
  for (const [hash, local] of [[LOGO_AICRON, aicronTarget], [LOGO_NAV, LOGO_HEADER]]) {
    const url = 'https://framerusercontent\\.com/images/' + hash + '\\.svg[^`"\'\\s]*';
    out = out.replace(new RegExp('src:`' + url + '`,srcSet:`[^`]*`', 'g'), 'src:`' + local + '`');
    out = out.replace(new RegExp(url, 'g'), local);
  }

  // 1. Replace ALL original template speaker photos with local MUUN photos
  for (const [hash, photo] of Object.entries(SPEAKER_PHOTOS)) {
    out = out.replace(new RegExp('https://framerusercontent\\.com/images/' + hash + '\\.png[^`"\'\\s]*', 'g'), photo);
  }

  // 2. Patch H1, H2, and Kicker in Speakers subpage JS modules
  if (lang === 'ru') {
    out = out.replaceAll('children:`SPEAKERS`', 'children:`СПИКЕРЫ`');
    out = out.replaceAll('children:"SPEAKERS"', 'children:"СПИКЕРЫ"');
    out = out.replaceAll('`Meet Our Esteemed Developers and `', '`Познакомьтесь с ведущими спикерами и экспертами`');
    out = out.replaceAll('"Meet Our Esteemed Developers and "', '"Познакомьтесь с ведущими спикерами и экспертами"');
    out = out.replaceAll('`Technology Trailblazers`', '``');
    out = out.replaceAll('"Technology Trailblazers"', '""');
    out = out.replaceAll('zbD88MwBd:`Speakers`', 'zbD88MwBd:`Спикеры`');
    out = out.replaceAll('zbD88MwBd:"Speakers"', 'zbD88MwBd:"Спикеры"');
  } else if (lang === 'ky') {
    out = out.replaceAll('children:`SPEAKERS`', 'children:`СПИКЕРЛЕР`');
    out = out.replaceAll('children:"SPEAKERS"', 'children:"СПИКЕРЛЕР"');
    out = out.replaceAll('`Meet Our Esteemed Developers and `', '`Алдыңкы спикерлер жана эксперттер менен таанышыңыз`');
    out = out.replaceAll('"Meet Our Esteemed Developers and "', '"Алдыңкы спикерлер жана эксперттер менен таанышыңыз"');
    out = out.replaceAll('`Technology Trailblazers`', '``');
    out = out.replaceAll('"Technology Trailblazers"', '""');
    out = out.replaceAll('zbD88MwBd:`Speakers`', 'zbD88MwBd:`Спикерлер`');
    out = out.replaceAll('zbD88MwBd:"Speakers"', 'zbD88MwBd:"Спикерлер"');
  } else {
    out = out.replaceAll('`Meet Our Esteemed Developers and `', '`Meet the leading speakers and experts`');
    out = out.replaceAll('"Meet Our Esteemed Developers and "', '"Meet the leading speakers and experts"');
    out = out.replaceAll('`Technology Trailblazers`', '``');
    out = out.replaceAll('"Technology Trailblazers"', '""');
  }

  // 3. Replace speaker names and designations
  const spkTexts = SPEAKER_TEXTS[lang] || [];
  for (const [from, to] of spkTexts) {
    if (out.includes(from)) out = out.split(from).join(to);
  }

  // 4. Social links replacement
  out = out.replaceAll('https://www.instagram.com/jitu.ux/', 'https://www.instagram.com/muun.expo.kg?vrfl=ZW83M3E0YTNqMHp2');
  out = out.replaceAll('https://www.linkedin.com/in/jitendra-raut/', 'https://www.threads.com/@muun.expo.kg?invite=0');
  out = out.replaceAll('www.linkedin.com/in/jitendra-raut/', 'https://www.threads.com/@muun.expo.kg?invite=0');

  // 5. Standard phrase list replacement
  const list = pairs
    .filter((pair) => pair && typeof pair[0] === 'string' && typeof pair[1] === 'string')
    .filter((pair) => pair[0].length >= 4 && pair[0] !== pair[1] && !pair[1].includes(pair[0]))
    .filter((pair) => !pair[0].includes('<') && !pair[0].includes('{') && !pair[0].includes('http'))
    .sort((a, b) => b[0].length - a[0].length);

  for (const [from, to] of list) {
    if (out.includes(from)) out = out.split(from).join(to);
  }
  for (const [from, to] of UNIVERSAL) {
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
      fs.writeFileSync(path.join(dir, name), patchSource(source, langPairs, lang, name));
      written.add(lang);
    }
  }
  rewriteHtml(written);
  console.log("framer engine: pages now load the local patched runtime");
}
