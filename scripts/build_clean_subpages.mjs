import fs from 'fs';
import path from 'path';
import { renderParticipantModal } from './participant_modal.mjs';
import { newsCss, renderNewsBlock, newsClientJs } from './news_block.mjs';
import { pressCss, renderPressBlock, pressClientJs } from './press_block.mjs';
import { programCss, programClientJs, programFixerJs, injectProgramSsr } from './program_block.mjs';
import { applyFooterSocials, footerSocialCss, footerFixerJs, contactBlockHtml, contactCopy, contactSocialCss, contactFixerJs, mobileNavCss, renderMobileNav } from './muun_social.mjs';
import { lockHeroMark, heroMarkCss, heroMarkScript } from './hero_mark.mjs';
import { stripFramerRuntime } from './strip_framer_runtime.mjs';

console.log('Building completely polished subpages with exact fixes...');

const SPEAKER_ORIGINALS = [
  { name: 'Dr. Emma Parker', role: 'Senior Software Engineer', img: 'eTTTIcVnwyKXnDY6kbVhA1AyzQ' },
  { name: 'John Mitchell', role: 'Full Stack Developer', img: 'XhuDITv6DpWNuBYIj1HtJ4DvTQw' },
  { name: 'Samantha Hayes', role: 'Backend Architect', img: '86VJMTqMd6VC2SOf3RhzPDR4emk' },
  { name: 'James Turner', role: 'DevOps Specialist', img: 'TzozA0OcRZ36gzl3GAQAWwujo' },
  { name: 'Michael Anderson', role: 'Mobile App Engineer', img: 'dlhgx3fMLQZlK7XF8F8pg5OGE' },
  { name: 'Laura Chang', role: 'Cloud Solutions Expert', img: 'FVjwWr85ut7DBy7LiAzsJoNMlLM' },
  { name: 'Dr. Maya Bennett', role: 'AI/ML Engineer', img: 'cFl24iPInxckRrL32eRgadp9ZJM' },
  { name: 'Jonathan Reyes', role: 'Technical Lead – Web Platforms', img: 'UPhDD72urZKey0YOy5IaOSRCJj0' }
];

function speakerRoster(lang) {
  const jumabaevRole = 'Founder & CEO, LUWO · Ex-Google · Ex-JetBrains · Ex-Deutsche Bank · Founder, Growthhungry · TEDx Speaker';
  const extra = {
    ru: [
      { name: 'Азис Абакиров', role: 'Директор Парка высоких технологий Кыргызской Республики', photo: '/assets/speaker-abakirov.jpg', focus: 'center center' },
      { name: 'Атеев Руслан Маратович', role: 'Президент Федерации компьютерного спорта Кыргызстана', photo: '/assets/speaker-ateev.jpg', focus: '72% center' },
      { name: 'Котляревский Виктор Сергеевич', role: 'Исполнительный директор турнирного оператора Contest.kg', photo: '/assets/speaker-kotlyarevsky.jpg', focus: 'center 8%' },
      { name: 'Илияс Джеентаев', role: 'Основатель и CEO ArtSkin (искусственная кожа для протезов)', photo: '/assets/speaker-djeentaev.jpg', focus: 'center 20%' },
      { name: 'Оман Абышев', role: 'Основатель Water Watch AI', photo: '/assets/speaker-abyshev.jpg', focus: '34% 8%' },
      { name: 'Алмаз Чаначев', role: 'Руководитель офиса EPAM в Кыргызстане', photo: '/assets/speaker-chanachev.jpg', focus: 'center 22%' },
      { name: 'Эмиль Билгазиев', role: 'Основатель American Institute of Technology (AIT); экс-технический директор одного из подразделений Facebook (Meta)', photo: '/assets/speaker-bilgaziev.jpg', focus: 'center center' },
      { name: 'Аденов Абдыкерим Болотович', role: 'Преподаватель ML в Международном колледже IT и бизнеса Salymbekov University, основатель бишкекского клуба по робототехнике RoboComm', photo: '/assets/speaker-adenov.jpg', focus: 'center 18%' }
    ],
    ky: [
      { name: 'Азис Абакиров', role: 'Кыргыз Республикасынын Жогорку технологиялар паркынын директору', photo: '/assets/speaker-abakirov.jpg', focus: 'center center' },
      { name: 'Атеев Руслан Маратович', role: 'Кыргызстандын компьютердик спорт федерациясынын президенти', photo: '/assets/speaker-ateev.jpg', focus: '72% center' },
      { name: 'Котляревский Виктор Сергеевич', role: 'Contest.kg турнир операторунун аткаруучу директору', photo: '/assets/speaker-kotlyarevsky.jpg', focus: 'center 8%' },
      { name: 'Илияс Джеентаев', role: 'ArtSkin негиздөөчүсү жана башкы директору (протездер үчүн жасалма тери)', photo: '/assets/speaker-djeentaev.jpg', focus: 'center 20%' },
      { name: 'Оман Абышев', role: 'Water Watch AI негиздөөчүсү', photo: '/assets/speaker-abyshev.jpg', focus: '34% 8%' },
      { name: 'Алмаз Чаначев', role: 'EPAM компаниясынын Кыргызстандагы офисинин жетекчиси', photo: '/assets/speaker-chanachev.jpg', focus: 'center 22%' },
      { name: 'Эмиль Билгазиев', role: 'American Institute of Technology (AIT) негиздөөчүсү; Facebook (Meta) бөлүмдөрүнүн биринин мурдагы техникалык директору', photo: '/assets/speaker-bilgaziev.jpg', focus: 'center center' },
      { name: 'Аденов Абдыкерим Болотович', role: 'Salymbekov University Эл аралык IT жана бизнес колледжинин ML окутуучусу, Бишкектеги RoboComm робототехника клубунун негиздөөчүсү', photo: '/assets/speaker-adenov.jpg', focus: 'center 18%' }
    ],
    en: [
      { name: 'Azis Abakirov', role: 'Director of the High Technology Park of the Kyrgyz Republic', photo: '/assets/speaker-abakirov.jpg', focus: 'center center' },
      { name: 'Ruslan Maratovich Ateev', role: 'President of the Esports Federation of Kyrgyzstan', photo: '/assets/speaker-ateev.jpg', focus: '72% center' },
      { name: 'Viktor Sergeevich Kotlyarevsky', role: 'Executive Director of the tournament operator Contest.kg', photo: '/assets/speaker-kotlyarevsky.jpg', focus: 'center 8%' },
      { name: 'Iliyas Dzheentaev', role: 'Founder and CEO of ArtSkin (artificial skin for prosthetics)', photo: '/assets/speaker-djeentaev.jpg', focus: 'center 20%' },
      { name: 'Oman Abyshev', role: 'Founder of Water Watch AI', photo: '/assets/speaker-abyshev.jpg', focus: '34% 8%' },
      { name: 'Almaz Chanachev', role: 'Head of the EPAM office in Kyrgyzstan', photo: '/assets/speaker-chanachev.jpg', focus: 'center 22%' },
      { name: 'Emil Bilgaziev', role: 'Founder of the American Institute of Technology (AIT); former technical director of a Facebook (Meta) division', photo: '/assets/speaker-bilgaziev.jpg', focus: 'center center' },
      { name: 'Abdykerim Bolotovich Adenov', role: 'ML instructor at the International College of IT and Business, Salymbekov University; founder of the Bishkek robotics club RoboComm', photo: '/assets/speaker-adenov.jpg', focus: 'center 18%' }
    ]
  };
  const people = {
    ru: [
      { name: 'Касымалиев Адылбек Алешович', role: 'Председатель Кабинета Министров Кыргызской Республики – Руководитель Администрации Президента Кыргызской Республики', photo: '/assets/speaker-kasymaliev.png', focus: 'center 15%' },
      { name: 'Исаматова Гульзат Тыныбековна', role: 'Министр науки, высшего образования и инноваций Кыргызской Республики', photo: '/assets/speaker-isamatova.jpg', focus: '30% 20%' },
      { name: 'Орунтаев Нурдан Кемелович', role: 'Министр строительства, архитектуры и жилищно-коммунального хозяйства Кыргызской Республики', photo: '/assets/speaker-oruntaev.jpg', focus: 'center 18%' },
      { name: 'Динара Русланкызы', role: 'Основатель и директор ИТ-компании CODIFY', photo: '/assets/speaker-dinara.jpg', focus: 'center 30%' },
      { name: 'Айжан Алишерова', role: 'Основатель фонда поддержки стартапов «We Fund»', photo: '/assets/speaker-alisherova.jpg', focus: 'center 16%' },
      { name: 'Бекназаров Жакшылык Бекназарович', role: 'Председатель молодежного движения Кыргызстана, Отличник молодежной политики Кыргызской Республики', photo: '/assets/speaker-beknazarov.jpg', focus: 'center 30%' },
      { name: 'Эрхан Адаев', role: 'Co-founder & CEO, AI Academy', photo: '/assets/speaker-adaev.jpg', focus: 'center 32%' },
      { name: 'Таалай Джумабаев', role: jumabaevRole, photo: '/assets/speaker-jumabaev.jpg', focus: 'center 18%' },
      ...extra.ru
    ],
    ky: [
      { name: 'Касымалиев Адылбек Алешович', role: 'Кыргыз Республикасынын Министрлер Кабинетинин Төрагасы – Кыргыз Республикасынын Президентинин Администрациясынын жетекчиси', photo: '/assets/speaker-kasymaliev.png', focus: 'center 15%' },
      { name: 'Исаматова Гульзат Тыныбековна', role: 'Кыргыз Республикасынын илим, жогорку билим берүү жана инновациялар министри', photo: '/assets/speaker-isamatova.jpg', focus: '30% 20%' },
      { name: 'Орунтаев Нурдан Кемелович', role: 'Кыргыз Республикасынын курулуш, архитектура жана турак жай-коммуналдык чарба министри', photo: '/assets/speaker-oruntaev.jpg', focus: 'center 18%' },
      { name: 'Динара Русланкызы', role: 'CODIFY ИТ-компаниясынын негиздөөчүсү жана директору', photo: '/assets/speaker-dinara.jpg', focus: 'center 30%' },
      { name: 'Айжан Алишерова', role: '«We Fund» стартаптарды колдоо фондунун негиздөөчүсү', photo: '/assets/speaker-alisherova.jpg', focus: 'center 16%' },
      { name: 'Бекназаров Жакшылык Бекназарович', role: 'Кыргызстандын жаштар кыймылынын төрагасы, Кыргыз Республикасынын жаштар саясатынын отличниги', photo: '/assets/speaker-beknazarov.jpg', focus: 'center 30%' },
      { name: 'Эрхан Адаев', role: 'AI Academy негиздөөчүсү жана башкы директору', photo: '/assets/speaker-adaev.jpg', focus: 'center 32%' },
      { name: 'Таалай Джумабаев', role: jumabaevRole, photo: '/assets/speaker-jumabaev.jpg', focus: 'center 18%' },
      ...extra.ky
    ],
    en: [
      { name: 'Adylbek Aleshovich Kasymaliev', role: 'Chairman of the Cabinet of Ministers of the Kyrgyz Republic – Head of the Presidential Administration of the Kyrgyz Republic', photo: '/assets/speaker-kasymaliev.png', focus: 'center 15%' },
      { name: 'Gulzat Tynybekovna Isamatova', role: 'Minister of Science, Higher Education and Innovation of the Kyrgyz Republic', photo: '/assets/speaker-isamatova.jpg', focus: '30% 20%' },
      { name: 'Nurdan Kemelovich Oruntaev', role: 'Minister of Construction, Architecture and Housing and Communal Services of the Kyrgyz Republic', photo: '/assets/speaker-oruntaev.jpg', focus: 'center 18%' },
      { name: 'Dinara Ruslankyzy', role: 'Founder and Director of the IT company CODIFY', photo: '/assets/speaker-dinara.jpg', focus: 'center 30%' },
      { name: 'Aizhan Alisherova', role: 'Founder of the startup support fund We Fund', photo: '/assets/speaker-alisherova.jpg', focus: 'center 16%' },
      { name: 'Zhakshylyk Beknazarovich Beknazarov', role: 'Chairman of the Youth Movement of Kyrgyzstan, Excellence in Youth Policy of the Kyrgyz Republic', photo: '/assets/speaker-beknazarov.jpg', focus: 'center 30%' },
      { name: 'Erkhan Adaev', role: 'Co-founder & CEO, AI Academy', photo: '/assets/speaker-adaev.jpg', focus: 'center 32%' },
      { name: 'Taalay Dzhumabaev', role: jumabaevRole, photo: '/assets/speaker-jumabaev.jpg', focus: 'center 18%' },
      ...extra.en
    ]
  }[lang];
  return people;
}

function findFramerMarker(html, name) {
  const marker = `data-framer-name="${name}"`;
  let from = 0;
  while ((from = html.indexOf(marker, from)) !== -1) {
    const prev = html[from - 1];
    if (prev !== '[' && prev !== '"' && prev !== "'") return from;
    from += marker.length;
  }
  return -1;
}

function applySpeakerRoster(pageHtml, roster) {
  const start = findFramerMarker(pageHtml, 'Speakers 1');
  const end = findFramerMarker(pageHtml, 'Speakers 2');
  if (start === -1 || end === -1 || end < start) {
    console.warn('Speaker sections not found for roster replacement', start, end);
    return pageHtml;
  }
  let block = pageHtml.slice(start, end);
  SPEAKER_ORIGINALS.forEach((orig, i) => {
    const person = roster[i];
    block = block.replaceAll(orig.name, person.name);
    block = block.replaceAll(orig.role, person.role);
    block = block.split(`https://framerusercontent.com/images/${orig.img}.png`).join(person.photo);
  });
  block = block.replace(/<img\b[^>]*\/assets\/speaker-[^>]*>/g, (tag) => (
    tag
      .replace(/\s(?:srcset|sizes)="[^"]*"/gi, '')
      .replace(/(\ssrc="\/assets\/speaker-[^"?]+)\?[^"]*"/, '$1"')
  ));
  const extra = renderExtraSpeakers(roster);
  const close = block.lastIndexOf('</section>');
  if (extra && close !== -1) block = block.slice(0, close) + extra + block.slice(close);
  return pageHtml.slice(0, start) + block + pageHtml.slice(end);
}

function escHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderExtraSpeakers(roster) {
  const extras = roster.slice(SPEAKER_ORIGINALS.length);
  if (!extras.length) return '';
  const cards = extras.map((person) => `<article class="muun-extra-card">
      <div class="muun-extra-photo"><img src="${escHtml(person.photo)}" alt="${escHtml(person.name)}" style="object-position:${escHtml(person.focus || 'center 20%')}"></div>
      <h4>${escHtml(person.name)}</h4>
      <p>${escHtml(person.role)}</p>
    </article>`).join('');
  return `<div class="muun-extra-speakers">${cards}</div>`;
}

const templates = {
  speakers: fs.readFileSync('templates/eventis_speakers.html', 'utf8'),
  program: fs.readFileSync('templates/eventis_agenda.html', 'utf8'),
  venue: fs.readFileSync('templates/eventis_venue.html', 'utf8'),
  contact: fs.readFileSync('templates/eventis_contact.html', 'utf8')
};

const pagesConfig = {
  speakers: {
    template: 'speakers',
    titles: {
      ru: { h1: 'СПИКЕРЫ', kicker: 'Спикеры', sub: 'Познакомьтесь с ведущими спикерами и экспертами', meta: 'Спикеры' },
      ky: { h1: 'СПИКЕРЛЕР', kicker: 'Спикерлер', sub: 'Алдыңкы спикерлер жана эксперттер менен таанышыңыз', meta: 'Спикерлер' },
      en: { h1: 'SPEAKERS', kicker: 'Speakers', sub: 'Meet the leading speakers and experts', meta: 'Speakers' }
    }
  },
  program: {
    template: 'program',
    aliases: ['agenda'],
    titles: {
      ru: { h1: 'ПРОГРАММА', kicker: 'Программа', sub: 'Деловая и образовательная программа форума', meta: 'Программа' },
      ky: { h1: 'ПРОГРАММА', kicker: 'Программа', sub: 'Форумдун ишкердик жана билим берүү программасы', meta: 'Программа' },
      en: { h1: 'PROGRAM', kicker: 'Agenda', sub: 'Business & Educational Forum Schedule', meta: 'Program' }
    }
  },
  venue: {
    template: 'venue',
    titles: {
      ru: { h1: 'ПЛОЩАДКА', kicker: 'Площадка', sub: 'Конгресс-холл «Ырыс Ордо»', meta: 'Площадка' },
      ky: { h1: 'АЯНТЧА', kicker: 'Аянтча', sub: '«Ырыс Ордо» конгресс-холлу', meta: 'Аянтча' },
      en: { h1: 'VENUE', kicker: 'Venue', sub: 'Yrys Ordo Congress Hall', meta: 'Venue' }
    }
  },
  news: {
    template: 'contact',
    titles: {
      ru: { h1: 'НОВОСТИ', kicker: 'Новости', sub: 'Актуальные события и новости форума', meta: 'Новости' },
      ky: { h1: 'ЖАҢЫЛЫКТАР', kicker: 'Жаңылыктар', sub: 'MUUN 2026 форумунун актуалдуу окуялары жана жаңылыктары', subHtml: 'MUUN 2026 форумунун актуалдуу окуялары<br>жана жаңылыктары', meta: 'Жаңылыктар' },
      en: { h1: 'NEWS', kicker: 'News', sub: 'Latest updates and news from MUUN 2026', subHtml: 'Latest updates and news<br>from MUUN 2026', meta: 'News' }
    }
  },
  press: {
    template: 'contact',
    titles: {
      ru: { h1: 'ПРЕСС-ЦЕНТР', kicker: 'Пресс-центр', sub: 'Материалы для СМИ, релизы и аккредитация журналистов', meta: 'Пресс-центр' },
      ky: { h1: 'ПРЕСС-БОРБОР', kicker: 'Пресс-борбор', sub: 'ЖМК үчүн материалдар жана журналисттерди аккредитациялоо', meta: 'Пресс-борбор' },
      en: { h1: 'PRESS CENTER', kicker: 'Press Center', sub: 'Media resources, press releases and press accreditation', meta: 'Press Center' }
    }
  },
  contacts: {
    template: 'contact',
    aliases: ['contact'],
    titles: {
      ru: { h1: 'КОНТАКТЫ', kicker: 'Контакты', sub: 'Свяжитесь с оргкомитетом', meta: 'Контакты' },
      ky: { h1: 'БАЙЛАНЫШТАР', kicker: 'Байланыш', sub: 'Уюштуруу комитети менен байланышыңыз', meta: 'Байланыштар' },
      en: { h1: 'CONTACTS', kicker: 'Contacts', sub: 'Get in touch with the organizing committee', meta: 'Contacts' }
    }
  }
};

const languages = ['ru', 'ky', 'en'];

for (const lang of languages) {
  const homeHtml = fs.readFileSync(`dist/${lang}/index.html`, 'utf8');

  // 1. Extract Registration section from dist/${lang}/index.html
  const regMatch = homeHtml.match(/<section[^>]+data-framer-name="Registration"[\s\S]*?<\/section>/);
  if (!regMatch) {
    console.error(`Could not find Registration section in dist/${lang}/index.html!`);
    continue;
  }
  const regHtml = regMatch[0];

  // 2. Extract <template id="muun-reg-form-tpl">
  const tplMatch = homeHtml.match(/<template id="muun-reg-form-tpl">[\s\S]*?<\/template>/);
  const tplHtml = tplMatch ? tplMatch[0] : '';

  // 3. Extract custom styles from <head>
  const styleMatches = [...homeHtml.matchAll(/<style(?:\s+[^>]*)?>([\s\S]*?)<\/style>/gi)]
    .filter(m => m[1].includes('.muun-reg-card') || m[1].includes('mix-blend-mode') || m[1].includes('framer-nav-item-wrap') || m[1].includes('muun-btn'))
    .map(m => m[0]);
  const customStylesHtml = styleMatches.join('\n');

  // 4. Navigation labels (6 items, NO "О форуме")
  const navLabels = {
    speakers: lang === 'ky' ? 'Спикерлер' : lang === 'en' ? 'Speakers' : 'Спикеры',
    program: lang === 'ky' ? 'Программа' : lang === 'en' ? 'Program' : 'Программа',
    venue: lang === 'ky' ? 'Аянтча' : lang === 'en' ? 'Venue' : 'Площадка',
    news: lang === 'ky' ? 'Жаңылыктар' : lang === 'en' ? 'News' : 'Новости',
    press: lang === 'ky' ? 'Пресс-борбор' : lang === 'en' ? 'Press Center' : 'Пресс-центр',
    contacts: lang === 'ky' ? 'Байланыш' : lang === 'en' ? 'Contact' : 'Контакты'
  };

  const regCtaText = lang === 'ky' ? 'Каттоо' : lang === 'en' ? 'Registration' : 'Регистрация';

  const navItemsList = [
    { href: `/${lang}/speakers`, label: navLabels.speakers },
    { href: `/${lang}/program`, label: navLabels.program },
    { href: `/${lang}/venue`, label: navLabels.venue },
    { href: `/${lang}/news`, label: navLabels.news },
    { href: `/${lang}/press`, label: navLabels.press },
    { href: `/${lang}/contacts`, label: navLabels.contacts }
  ];

  const headerNavHtml = `<nav class="framer-1s42b8a" data-framer-name="Links">${navItemsList.map(item => `
    <div class="framer-nav-item-wrap" style="opacity:1;transform:none;flex:none;position:relative;">
      <a class="framer-npy4b framer-mxN0T framer-ikziiq framer-v-ikziiq framer-115tijb" data-framer-name="Light" href="${item.href}" tabindex="0" style="background-color:var(--token-9a7303fe-2324-4aa1-bbd4-e1f1d449de82, rgba(255, 255, 255, 0.12));border-bottom-left-radius:100px;border-bottom-right-radius:100px;border-top-left-radius:100px;border-top-right-radius:100px">
        <div class="framer-295hd4" data-framer-name="BG" style="background-color:var(--token-9a7303fe-2324-4aa1-bbd4-e1f1d449de82, rgba(255, 255, 255, 0.12));border-bottom-left-radius:100px;border-bottom-right-radius:100px;border-top-left-radius:100px;border-top-right-radius:100px"></div>
        <div class="framer-1dl5625" data-framer-name="Label" data-framer-component-type="RichTextContainer" style="--extracted-r6o4lv:var(--token-873fb35c-2084-47f0-9254-cb5d8b65f475, rgb(255, 255, 255));--framer-link-text-color:rgb(0, 153, 255);--framer-link-text-decoration:underline;transform:none">
          <p class="framer-text framer-styles-preset-dsr0r" data-styles-preset="Erxl6HnxD" style="--framer-text-color:var(--extracted-r6o4lv, var(--token-873fb35c-2084-47f0-9254-cb5d8b65f475, rgb(255, 255, 255)));font-family:'Inter',sans-serif;font-size:16px;font-weight:500;">${item.label}</p>
        </div>
        <div class="framer-mvpx8f" data-framer-name="Another one" style="background-color:var(--token-dc631f8a-4140-47df-884a-ed562fa8ef1a, rgb(41, 170, 225));border-bottom-left-radius:100px;border-bottom-right-radius:100px;border-top-left-radius:100px;border-top-right-radius:100px"></div>
        <div class="framer-shp3q0" data-framer-name="Label" data-framer-component-type="RichTextContainer" style="--framer-link-text-color:rgb(0, 153, 255);--framer-link-text-decoration:underline;transform:translateX(-50%)">
          <p class="framer-text framer-styles-preset-dsr0r" data-styles-preset="Erxl6HnxD" style="color:#ffffff;font-family:'Inter',sans-serif;font-size:16px;font-weight:500;">${item.label}</p>
        </div>
      </a>
    </div>
  `).join('')}</nav>`;

  const footerNavHtml = `<nav class="framer-1a0e2lt" data-framer-name="Links">${navItemsList.map(item => `
    <div class="framer-nav-item-wrap" style="opacity:1;transform:none;flex:none;position:relative;">
      <a class="framer-npy4b framer-mxN0T framer-ikziiq framer-v-ikziiq framer-115tijb" data-framer-name="Light" href="${item.href}" tabindex="0" style="background-color:transparent;border-radius:100px">
        <div class="framer-1dl5625" data-framer-name="Label" data-framer-component-type="RichTextContainer" style="--framer-paragraph-spacing:0px;transform:none">
          <p class="framer-text framer-styles-preset-dsr0r" data-styles-preset="Erxl6HnxD" style="--framer-text-color:rgb(255, 255, 255);font-family:'Inter',sans-serif;font-size:16px;font-weight:500;">${item.label}</p>
        </div>
      </a>
    </div>
  `).join('')}</nav>`;

  // 5. Build each subpage
  for (const [slug, conf] of Object.entries(pagesConfig)) {
    let pageHtml = lockHeroMark(templates[conf.template]
      .split('https://framerusercontent.com/images/AxQMXkb9SNyxDMp63XvKlzyGFo.png')
      .join('/favicon.png?v=7'));
    const pageTitle = conf.titles[lang];

    const htmlLang = lang === 'en' ? 'en' : lang === 'ky' ? 'ky' : 'ru';
    const metaDesc = lang === 'ky'
      ? 'MUUN 2026 — Кыргызстандын келечек кесиптеринин улуттук жаштар көргөзмө-форуму. 17-ноябрь, Бишкек, Ырыс Ордо.'
      : lang === 'en'
      ? 'MUUN 2026 — national youth exhibition-forum of the professions of the future. 17 November, Bishkek, Yrys Ordo.'
      : 'MUUN 2026 — национальная молодежная выставка-форум профессий будущего. 17 ноября, Бишкек, Ырыс Ордо.';
    pageHtml = pageHtml.replace(/<html lang="[^"]*">/i, `<html lang="${htmlLang}">`);
    pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${pageTitle.meta} — MUUN 2026</title>`);
    pageHtml = pageHtml.replaceAll('Eventis - Free Event and Conference Template', `${pageTitle.meta} — MUUN 2026`);
    pageHtml = pageHtml.replaceAll('Join Eventis, the premier technology and IT summit, bringing together developers, designers, entrepreneurs, and investors to explore the latest in software development, AI innovations, and startup growth.', metaDesc);
    pageHtml = pageHtml.replaceAll('https://eventis.framer.website/', `https://muun.kg/${lang}/`);

    // Injected CSS
    const extraCss = `
      <style>
        /* Transparent Ticket Video Background */
        section[data-framer-name="Registration"] .framer-xqjflg,
        section[data-framer-name="Registration"] .framer-x4d5kq,
        section[data-framer-name="Registration"] [data-framer-name="Sticky"],
        section[data-framer-name="Registration"] [data-framer-name="Graphic"],
        section[data-framer-name="Registration"] video {
          mix-blend-mode: screen !important;
          background: transparent !important;
        }
        /* Subpage Hero Big Title centered with high visibility */
        .framer-hero-big-title {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          font-size: clamp(3.2rem, 9.5vw, 8rem) !important;
          font-weight: 900 !important;
          letter-spacing: -0.04em !important;
          text-transform: uppercase !important;
          text-align: center !important;
          color: #ffffff !important;
          line-height: 0.95 !important;
          margin: 0 auto !important;
          white-space: nowrap !important;
          opacity: 1 !important;
          display: block !important;
        }
        @media (max-width: 810px) {
          html, body { overflow-x: hidden !important; max-width: 100% !important; }
          img, video { max-width: 100% !important; }
          .framer-hero-big-title {
            white-space: normal !important;
            font-size: clamp(2rem, 11vw, 3.4rem) !important;
            line-height: 1.05 !important;
            padding: 0 12px !important;
            max-width: 100% !important;
          }
          .framer-hero-big-title.muun-hero-one-line {
            white-space: nowrap !important;
            font-size: clamp(1.45rem, 7.6vw, 2.7rem) !important;
            letter-spacing: -0.045em !important;
            padding: 0 8px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .form-row { grid-template-columns: 1fr !important; }
          .reg-tabs-wrap { flex-direction: column !important; }
          .reg-tab-btn { width: 100% !important; white-space: normal !important; }
          .muun-reg-card { padding: 20px 14px !important; max-width: 100% !important; }
          [data-framer-name="Speakers 1"] [data-framer-name="Name"],
          [data-framer-name="Speakers 1"] [data-framer-name="Name"] h4,
          [data-framer-name="Speakers 1"] [data-framer-name="Designation"] p {
            white-space: normal !important;
            height: auto !important;
            max-height: none !important;
          }
          section[data-framer-name="Venue"] img,
          section[data-framer-name="Venue"] video {
            width: 100% !important;
            height: auto !important;
            object-fit: cover !important;
          }
          footer nav,
          .framer-RYOK6 .framer-1a0e2lt {
            flex-wrap: wrap !important;
            justify-content: flex-start !important;
            gap: 8px !important;
          }
        }
        /* Hide all Framer old pricing pass cards */
        [data-framer-name="Cards"] [data-framer-name="Ticket 01"],
        [data-framer-name="Cards"] [data-framer-name="Pricing "],
        [data-framer-name="Cards"] [data-framer-name="Desktop"],
        [data-framer-name="Cards"] [data-framer-name="Phone"],
        .framer-ldkdj8, .framer-108zwyn, .framer-iuqh2z {
          display: none !important;
        }
        /* Header Logo forced to full width (NEVER cut off MUUN26) */
        .framer-b7ke7f a,
        [data-framer-name="Logo"] a,
        .framer-f5khec {
          width: 195px !important;
          max-width: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: flex-start !important;
          cursor: pointer !important;
        }
        .framer-b7ke7f,
        [data-framer-name="Logo"] {
          width: auto !important;
          min-width: 195px !important;
          overflow: visible !important;
        }
        .framer-b7ke7f img,
        [data-framer-name="Logo"] img {
          max-height: 42px !important;
          width: auto !important;
          max-width: 190px !important;
          object-fit: contain !important;
          object-position: left center !important;
          display: block !important;
        }
        /* Footer Rising Dome Logo */
        .framer-RYOK6 .framer-16fyxtb,
        .framer-16fyxtb {
          mask: none !important;
          -webkit-mask: none !important;
        }
        .framer-RYOK6 .framer-16fyxtb img,
        .framer-16fyxtb img {
          mask: none !important;
          -webkit-mask: none !important;
          object-fit: contain !important;
        }
        ${footerSocialCss}
        ${mobileNavCss}
        ${slug === 'contacts' ? contactSocialCss : ''}
        ${slug === 'news' ? newsCss : ''}
        ${slug === 'press' ? pressCss : ''}
        ${slug === 'program' ? programCss : ''}
        ${slug === 'venue' ? `
        section[data-framer-name="Venue"] .framer-1h1gm54,
        section[data-framer-name="Venue"] [data-framer-name="Venue Title"],
        section[data-framer-name="Venue"] [data-framer-name="Tag"] {
          display: none !important;
        }
        section[data-framer-name="Venue"] .framer-nl6gb7 {
          display: none !important;
        }
        ` : ''}
        ${slug === 'speakers' ? `
        [data-framer-name="Speakers 1"] [data-framer-name="Tag"],
        [data-framer-name="Speakers 2"] {
          display: none !important;
        }
        [data-framer-name="Speakers 1"] [data-framer-name="Name"],
        [data-framer-name="Speakers 1"] [data-framer-name="Name"] h4,
        [data-framer-name="Speakers 1"] [data-framer-name="Designation"],
        [data-framer-name="Speakers 1"] [data-framer-name="Designation"] p,
        [data-framer-name="Speakers 1"] [data-framer-name="Profile"] {
          height: auto !important;
          max-height: none !important;
          white-space: normal !important;
          overflow: visible !important;
        }
        [data-framer-name="Speakers 1"] [data-framer-name="Image"] img {
          object-fit: cover !important;
        }
        [data-framer-name="Speakers 1"] img[src*="speaker-kasymaliev"] { object-position: center 15% !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-isamatova"] { object-position: 30% 20% !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-oruntaev"] { object-position: center 18% !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-dinara"] { object-position: center 28% !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-alisherova"] { object-position: center 16% !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-beknazarov"] { object-position: center 30% !important; transform: scale(1.72) !important; transform-origin: center 34% !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-adaev"] { object-position: center 32% !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-jumabaev"] { object-position: center 18% !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-abakirov"] { object-position: center center !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-ateev"] { object-position: 72% center !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-kotlyarevsky"] { object-position: center 8% !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-djeentaev"] { object-position: center 20% !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-abyshev"] { object-position: 34% 8% !important; transform: scale(1.7) !important; transform-origin: 42% 18% !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-chanachev"] { object-position: center 22% !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-bilgaziev"] { object-position: center center !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-adenov"] { object-position: center 18% !important; }
        [data-framer-name="Speakers 1"] img[src*="speaker-placeholder"] { object-position: center center !important; }
        [data-framer-name="Speakers 1"] {
          flex-direction: column !important;
          flex-wrap: nowrap !important;
          align-items: stretch !important;
          height: auto !important;
        }
        [data-framer-name="Speakers 1"] > * {
          width: 100% !important;
          max-width: 100% !important;
          flex: none !important;
        }
        .muun-extra-speakers {
          display: grid !important;
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 56px 24px !important;
          width: 100% !important;
          max-width: 1320px !important;
          margin: 56px auto 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          position: relative !important;
          z-index: 3 !important;
        }
        .muun-extra-card {
          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
          gap: 14px !important;
          min-width: 0 !important;
        }
        .muun-extra-photo {
          width: 100% !important;
          aspect-ratio: 4 / 5 !important;
          border-radius: 24px !important;
          overflow: hidden !important;
          background: #111 !important;
        }
        .muun-extra-photo img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block !important;
          filter: none !important;
          -webkit-filter: none !important;
        }
        .muun-extra-card h4 {
          margin: 0 !important;
          min-height: 2.6em !important;
          color: #fff !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 22px !important;
          font-weight: 600 !important;
          line-height: 1.25 !important;
        }
        .muun-extra-card p {
          margin: 0 !important;
          color: rgb(138, 138, 138) !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 15px !important;
          line-height: 1.45 !important;
        }
        @media (max-width: 1199.98px) {
          .muun-extra-speakers { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 809.98px) {
          .muun-extra-speakers { grid-template-columns: 1fr !important; margin-top: 40px !important; }
        }
        [data-framer-name="Speakers 1"] [data-framer-name="Image"] { overflow: hidden !important; }
        [data-framer-name="Speakers 1"] [data-framer-name="Layer 1"],
        [data-framer-name="Speakers 1"] [data-framer-name="Layer 2"] {
          align-items: flex-start !important;
        }
        [data-framer-name="Speakers 1"] [data-framer-name="White "],
        [data-framer-name="Speakers 1"] [data-framer-name="Phone"] {
          display: flex !important;
          flex-direction: column !important;
          height: auto !important;
          align-items: stretch !important;
        }
        [data-framer-name="Speakers 1"] [data-framer-name="Content"]:has(> [data-framer-name="Image"]) {
          width: 100% !important;
          height: auto !important;
          aspect-ratio: 4 / 5 !important;
          flex: none !important;
          overflow: hidden !important;
          position: relative !important;
        }
        [data-framer-name="Speakers 1"] [data-framer-name="Content"]:has(> [data-framer-name="Layer 1"]) {
          aspect-ratio: auto !important;
          height: auto !important;
          min-height: 0 !important;
          justify-content: flex-start !important;
          align-items: flex-start !important;
          align-content: flex-start !important;
        }
        [data-framer-name="Speakers 1"] [data-framer-name="Image"] {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          aspect-ratio: auto !important;
        }
        [data-framer-name="Speakers 1"] [data-framer-name="Profile"] {
          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
          width: 100% !important;
          height: auto !important;
        }
        [data-framer-name="Speakers 1"] [data-framer-name="Name"],
        [data-framer-name="Speakers 1"] [data-framer-name="Name"] h4 {
          min-height: 2.8em !important;
          height: auto !important;
        }
        [data-framer-name="Speakers 1"] [data-framer-name="Blue Blur"],
        [data-framer-name="Speakers 1"] [data-framer-name="Instagram"],
        [data-framer-name="Speakers 1"] [data-framer-name="Linkedin"] {
          display: none !important;
        }
        .framer-czfk01-container [data-framer-name="Blue Blur"],
        .framer-1mohwrm-container [data-framer-name="Blue Blur"],
        .framer-1iuexxu-container [data-framer-name="Blue Blur"],
        .framer-2trhh7-container [data-framer-name="Blue Blur"] {
          display: none !important;
        }
        ` : ''}
      </style>
    `;
    pageHtml = pageHtml.replace('</head>', `${heroMarkScript}\n<style>${heroMarkCss}</style>\n${customStylesHtml}\n${extraCss}\n</head>`);

    // REPLACE HEADER LOGO: replace all occurrences of old eventis logo SVGs in src and srcset
    pageHtml = pageHtml.replaceAll('https://framerusercontent.com/images/tJ1jqpEOBL9Nna5facx9Yh1rSA.svg?scale-down-to=512&amp;width=520&amp;height=149 512w,https://framerusercontent.com/images/tJ1jqpEOBL9Nna5facx9Yh1rSA.svg?width=520&amp;height=149 520w', '/assets/logo-header.png');
    pageHtml = pageHtml.replaceAll('https://framerusercontent.com/images/tJ1jqpEOBL9Nna5facx9Yh1rSA.svg?scale-down-to=512&width=520&height=149 512w,https://framerusercontent.com/images/tJ1jqpEOBL9Nna5facx9Yh1rSA.svg?width=520&height=149 520w', '/assets/logo-header.png');
    pageHtml = pageHtml.replaceAll('https://framerusercontent.com/images/tJ1jqpEOBL9Nna5facx9Yh1rSA.svg?width=520&amp;height=149', '/assets/logo-header.png');
    pageHtml = pageHtml.replaceAll('https://framerusercontent.com/images/tJ1jqpEOBL9Nna5facx9Yh1rSA.svg?width=520&height=149', '/assets/logo-header.png');
    pageHtml = pageHtml.replaceAll('https://framerusercontent.com/images/tJ1jqpEOBL9Nna5facx9Yh1rSA.svg', '/assets/logo-header.png');

    // Replace Header Logo Link to go directly to /${lang}/ and prevent Framer router
    pageHtml = pageHtml.replaceAll('aria-label="Company Logo" as="a" class="framer-f5khec framer-soh4vb" data-framer-name="Logo" href="./"', `aria-label="Company Logo" class="framer-f5khec framer-soh4vb" data-framer-name="Logo" href="/${lang}/" onclick="window.location.href='/${lang}/'; return false;"`);
    pageHtml = pageHtml.replaceAll('href="./"', `href="/${lang}/"`);
    pageHtml = pageHtml.replaceAll('href="/"', `href="/${lang}/"`);

    // Replace Big H1 Title
    const heroTitleClass = slug === 'press' ? 'framer-hero-big-title muun-hero-one-line' : 'framer-hero-big-title';
    pageHtml = pageHtml.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, `<h1 class="${heroTitleClass}">${pageTitle.h1}</h1>`);

    // Replace Header Navigation in SSR HTML
    const navStart = pageHtml.indexOf('<nav class="framer-1s42b8a"');
    if (navStart !== -1) {
      const navEnd = pageHtml.indexOf('</nav>', navStart);
      if (navEnd !== -1) {
        pageHtml = pageHtml.slice(0, navStart) + headerNavHtml + pageHtml.slice(navEnd + 6);
      }
    }

    // Replace Header CTA button text in SSR HTML
    pageHtml = pageHtml.replaceAll('>Get Ticket</p>', `>${regCtaText}</p>`);
    pageHtml = pageHtml.replaceAll('>Get Tickets</p>', `>${regCtaText}</p>`);

    // Replace Kickers and Subheadings in content section (single clean kicker, NO double dash!)
    if (slug === 'speakers') {
      const spk1 = pageHtml.indexOf('data-framer-name="Speakers 1"');
      if (spk1 !== -1) {
        const h4Match = pageHtml.slice(spk1).match(/<h4[^>]*>[\s\S]*?<\/h4>/i);
        if (h4Match) {
          pageHtml = pageHtml.replace(h4Match[0], `<h4 class="framer-text framer-styles-preset-luad1x" data-styles-preset="QrpSGcou5" style="--framer-text-color:var(--token-873fb35c-2084-47f0-9254-cb5d8b65f475, rgb(255, 255, 255));font-family:'Inter',sans-serif;">${pageTitle.kicker}</h4>`);
        }
        const h2Match = pageHtml.slice(spk1).match(/<h2[^>]*>[\s\S]*?<\/h2>/i);
        if (h2Match) {
          pageHtml = pageHtml.replace(h2Match[0], `<h2 class="framer-text framer-styles-preset-y2rde0" data-styles-preset="ukkzEhTCI" style="font-family:'Inter',sans-serif;">${pageTitle.sub}</h2>`);
        }
        pageHtml = applySpeakerRoster(pageHtml, speakerRoster(lang));
      }
      const spk2 = pageHtml.indexOf('data-framer-name="Speakers 2"');
      if (spk2 !== -1) {
        const h4Match2 = pageHtml.slice(spk2).match(/<h4[^>]*>[\s\S]*?<\/h4>/i);
        if (h4Match2) {
          pageHtml = pageHtml.replace(h4Match2[0], `<h4 class="framer-text framer-styles-preset-luad1x" data-styles-preset="QrpSGcou5" style="--framer-text-color:var(--token-873fb35c-2084-47f0-9254-cb5d8b65f475, rgb(255, 255, 255));font-family:'Inter',sans-serif;">${pageTitle.kicker}</h4>`);
        }
      }
    } else if (slug === 'program') {
      const agSec = pageHtml.indexOf('data-framer-name="Agenda"');
      if (agSec !== -1) {
        const h4Match = pageHtml.slice(agSec).match(/<h4[^>]*>[\s\S]*?<\/h4>/i);
        if (h4Match) {
          pageHtml = pageHtml.replace(h4Match[0], `<h4 class="framer-text framer-styles-preset-luad1x" data-styles-preset="QrpSGcou5" style="--framer-text-color:var(--token-873fb35c-2084-47f0-9254-cb5d8b65f475, rgb(255, 255, 255));font-family:'Inter',sans-serif;">${pageTitle.kicker}</h4>`);
        }
        const h2Match = pageHtml.slice(agSec).match(/<h2[^>]*>[\s\S]*?<\/h2>/i);
        if (h2Match) {
          pageHtml = pageHtml.replace(h2Match[0], `<h2 class="framer-text framer-styles-preset-y2rde0" data-styles-preset="ukkzEhTCI" style="font-family:'Inter',sans-serif;">${pageTitle.sub}</h2>`);
        }
      }
      pageHtml = injectProgramSsr(pageHtml, lang);
    } else if (slug === 'venue') {
      const vSec = pageHtml.indexOf('data-framer-name="Venue"');
      if (vSec !== -1) {
        const h4Match = pageHtml.slice(vSec).match(/<h4[^>]*>[\s\S]*?<\/h4>/i);
        if (h4Match) {
          pageHtml = pageHtml.replace(h4Match[0], `<h4 class="framer-text framer-styles-preset-luad1x" data-styles-preset="QrpSGcou5" style="--framer-text-color:var(--token-873fb35c-2084-47f0-9254-cb5d8b65f475, rgb(255, 255, 255));font-family:'Inter',sans-serif;">${pageTitle.kicker}</h4>`);
        }
        const h2Match = pageHtml.slice(vSec).match(/<h2[^>]*>[\s\S]*?<\/h2>/i);
        if (h2Match) {
          pageHtml = pageHtml.replace(h2Match[0], `<h2 class="framer-text framer-styles-preset-y2rde0" data-styles-preset="ukkzEhTCI" style="font-family:'Inter',sans-serif;">${pageTitle.sub}</h2>`);
        }
      }

      const venueCopy = {
        ru: [
          'Конгресс-холл «Ырыс Ордо» в комплексе «Бишкек Арена» — место проведения MUUN 2026, национальной молодежной выставки-форума профессий будущего. 17 ноября здесь встречаются школьники, студенты, университеты, работодатели и государственные организации.',
          'На площадке работают главная сцена, панельные дискуссии и стойки регистрации. Гости проходят тематические зоны, слушают выступления и лично общаются с компаниями и учебными заведениями о карьере, обучении и проектах.'
        ],
        ky: [
          '«Ырыс Ордо» конгресс-холлу «Бишкек Арена» комплексинде MUUN 2026 — келечектин кесиптеринин улуттук жаштар көргөзмө-форуму өтөт. 17-ноябрда бул жерде мектеп окуучулары, студенттер, университеттер, иш берүүчүлөр жана мамлекеттик уюмдар жолугат.',
          'Аянтчада башкы сахна, панелдик талкуулар жана каттоо зонасы иштейт. Коноктор тематикалык зоналарды кыдырып, чыгып сүйлөөлөрдү угуп, компаниялар жана окуу жайлар менен карьера, билим жана долбоорлор тууралуу жеке сүйлөшөт.'
        ],
        en: [
          'The Yrys Ordo Congress Hall at the Bishkek Arena complex is the venue for MUUN 2026, the national youth exhibition-forum of the professions of the future. On 17 November, school students, university students, employers and public institutions meet here.',
          'The hall brings together the main stage, panel discussions and registration desks. Guests walk through the thematic zones, listen to the sessions and talk directly with companies and education institutions about careers, study and projects.'
        ]
      }[lang];
      const venueImages = [
        ['jAO8hsj4cqFOU4eSd9NEn5faTuM', '/assets/venue-exterior.jpg'],
        ['tb1C68dgSO0HtIQ3nl97tROxntI', '/assets/gallery-mainstage.jpg'],
        ['eRjuxhjXm2C3YKMVMexMdMIkaA', '/assets/gallery-panel.jpg']
      ];
      pageHtml = pageHtml.replace(
        'The AIcron Tech Summit is the ultimate gathering for tech enthusiasts, industry leaders, and innovators to delve into the world of AI, machine learning, and the future of emerging technologies. This summit offers a unique opportunity to hear from top experts, engage in insightful discussions, and explore groundbreaking AI innovations. Whether you\'re a startup founder, developer.',
        venueCopy[0]
      );
      pageHtml = pageHtml.replace(
        'You’ll have the chance to explore real-world use cases, witness cutting-edge demos, and connect with others who are driving change in the tech world. Be part of the conversation that’s shaping the future.',
        venueCopy[1]
      );
      pageHtml = pageHtml.replaceAll('>Marin bay Conventional centre, Singapore</h3>', '></h3>');
      pageHtml = pageHtml.replace(/<img\b[^>]*>/g, (tag) => {
        const hit = venueImages.find(([id]) => tag.includes(id));
        if (!hit) return tag;
        return tag
          .replace(/\s(?:srcset|sizes)="[^"]*"/g, '')
          .replace(/\ssrc="[^"]*"/, ` src="${hit[1]}"`)
          .replace(/\salt(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/, ` alt="${pageTitle.sub}"`);
      });
    } else if (conf.template === 'contact') {
      const cSec = pageHtml.indexOf('data-framer-name="Contact"');
      if (cSec !== -1) {
        const h4Match = pageHtml.slice(cSec).match(/<h4[^>]*>[\s\S]*?<\/h4>/i);
        if (h4Match) {
          pageHtml = pageHtml.replace(h4Match[0], `<h4 class="framer-text framer-styles-preset-luad1x" data-styles-preset="QrpSGcou5" style="--framer-text-color:var(--token-873fb35c-2084-47f0-9254-cb5d8b65f475, rgb(255, 255, 255));font-family:'Inter',sans-serif;">${pageTitle.kicker}</h4>`);
        }
        const h2Match = pageHtml.slice(cSec).match(/<h2[^>]*>[\s\S]*?<\/h2>/i);
        if (h2Match) {
          pageHtml = pageHtml.replace(h2Match[0], `<h2 class="framer-text framer-styles-preset-y2rde0" data-styles-preset="ukkzEhTCI" style="font-family:'Inter',sans-serif;">${pageTitle.sub}</h2>`);
        }
      }
    }

    pageHtml = applyFooterSocials(pageHtml);
    if (slug === 'contacts') {
      const copy = contactCopy(lang);
      pageHtml = pageHtml.replace(
        '</div><form class="framer-vko7cj"',
        `${contactBlockHtml(lang)}</div><form class="framer-vko7cj"`
      );
      pageHtml = pageHtml.replaceAll('>Email Us</h4>', `>${copy.emailTitle}</h4>`);
      pageHtml = pageHtml.replaceAll('Reach out to our team for quick assistance.', copy.emailBody);
      pageHtml = pageHtml.replaceAll('>Call Us</h4>', `>${copy.phoneTitle}</h4>`);
      pageHtml = pageHtml.replace(/Drop us a message, and we.ll get back to you soon\./g, copy.phoneBody);
    }
    pageHtml = pageHtml.replaceAll('info@aicron.com', 'info@muun.kg');
    pageHtml = pageHtml.replaceAll('+91 1234567890', '+996 990 122 341');
    pageHtml = pageHtml.replaceAll('tel: +91 9730627087', 'tel:+996990122341');

    // Replace footer navigation in SSR HTML
    const fNavStart = pageHtml.indexOf('<nav class="framer-1a0e2lt"');
    if (fNavStart !== -1) {
      const fNavEnd = pageHtml.indexOf('</nav>', fNavStart);
      if (fNavEnd !== -1) {
        pageHtml = pageHtml.slice(0, fNavStart) + footerNavHtml + pageHtml.slice(fNavEnd + 6);
      }
    }

    // Replace Registration section in SSR HTML with the exact registration section from main landing page
    const subRegMatch = pageHtml.match(/<section[^>]+data-framer-name="Registration"[\s\S]*?<\/section>/);
    if (subRegMatch) {
      pageHtml = pageHtml.replace(subRegMatch[0], regHtml);
    }

    // Replace footer logo with /assets/logo-footer.png
    pageHtml = pageHtml.replaceAll('https://framerusercontent.com/images/1BHox7UUEVMJHfAPN4qPh5r4o.svg', '/assets/logo-footer.png');
    pageHtml = pageHtml.replaceAll('https://framerusercontent.com/images/r9U7K4k4b1c7m7m4a0.png', '/assets/logo-footer.png');

    // Make sure header registration link scrolls to #tickets on current page in SSR
    pageHtml = pageHtml.replaceAll('href="./speakers#tickets"', 'href="#tickets"');
    pageHtml = pageHtml.replaceAll('href="./agenda#tickets"', 'href="#tickets"');
    pageHtml = pageHtml.replaceAll('href="./venue#tickets"', 'href="#tickets"');
    pageHtml = pageHtml.replaceAll('href="./contact#tickets"', 'href="#tickets"');
    pageHtml = pageHtml.replaceAll(`href="/${lang}/#tickets"`, 'href="#tickets"');

    // Replace footer texts
    pageHtml = pageHtml.replaceAll('All copyrights @eventis', '<a href="#" style="color:inherit;text-decoration:none;">' + (lang === 'ky' ? 'Купуялуулук саясаты' : lang === 'en' ? 'Privacy Policy' : 'Политика конфиденциальности') + '</a>');
    pageHtml = pageHtml.replaceAll('Terms and Conditions', lang === 'ky' ? 'Оферта келишими' : lang === 'en' ? 'Terms of Service' : 'Договор оферты');
    pageHtml = pageHtml.replaceAll('Designed By Jitu Raut  @fremix.design', '');

    // Floating language switcher
    const langSwitcherHtml = `
      <div class="muun-lang-switcher" style="position:fixed; bottom:20px; right:20px; z-index:99999; display:flex; gap:8px; background:rgba(6,21,36,0.85); padding:10px 18px; border-radius:30px; backdrop-filter:blur(12px); border:1px solid rgba(41,170,225,0.3); box-shadow:0 4px 20px rgba(0,0,0,0.5);">
        <a href="/ru/${slug}" style="color: ${lang === 'ru' ? '#29AAE1' : 'rgba(255,255,255,0.6)'}; text-decoration:none; font-family:sans-serif; font-size:14px; font-weight:bold; transition: 0.3s;">RU</a>
        <span style="color:rgba(255,255,255,0.2);">|</span>
        <a href="/ky/${slug}" style="color: ${lang === 'ky' ? '#29AAE1' : 'rgba(255,255,255,0.6)'}; text-decoration:none; font-family:sans-serif; font-size:14px; font-weight:bold; transition: 0.3s;">KY</a>
        <span style="color:rgba(255,255,255,0.2);">|</span>
        <a href="/en/${slug}" style="color: ${lang === 'en' ? '#29AAE1' : 'rgba(255,255,255,0.6)'}; text-decoration:none; font-family:sans-serif; font-size:14px; font-weight:bold; transition: 0.3s;">EN</a>
      </div>
    ` + renderMobileNav(lang, slug);

    if (slug === 'news' || slug === 'press') {
      const blockHtml = slug === 'news' ? renderNewsBlock(lang) : renderPressBlock(lang);
      const marker = 'data-framer-name="Registration"';
      let from = 0;
      let regSection = -1;
      while ((from = pageHtml.indexOf(marker, from)) !== -1) {
        const sec = pageHtml.lastIndexOf('<section', from);
        const between = sec === -1 ? '' : pageHtml.slice(sec, from);
        if (sec !== -1 && between.length < 1200 && !between.includes('</section>')) {
          regSection = sec;
          break;
        }
        from += marker.length;
      }
      const contactEnd = regSection === -1 ? -1 : pageHtml.lastIndexOf('</section>', regSection);
      if (contactEnd !== -1) {
        pageHtml = pageHtml.slice(0, contactEnd) + blockHtml + pageHtml.slice(contactEnd);
      } else {
        console.warn(`${slug} block was not inserted: contact section end not found`);
      }
    }

    const participantModalHtml = renderParticipantModal(lang);

    // Append registration template, participant modal, language switcher, and continuous hydration fixer before </body>
    const clientScript = `
      ${tplHtml}
      ${participantModalHtml}
      ${langSwitcherHtml}
      <script>
        ${slug === 'news' ? newsClientJs : ''}
        ${slug === 'press' ? pressClientJs : ''}
        ${slug === 'program' ? programClientJs : ''}
        (function() {
          const EXPECTED_TITLE = "${pageTitle.meta} — MUUN 2026";
          const EXPECTED_H1 = "${pageTitle.h1}";
          const EXPECTED_KICKER = "${pageTitle.kicker}";
          const EXPECTED_H2 = "${pageTitle.sub.replace(/"/g, '\\"')}";
          const REG_BTN_TEXT = "${regCtaText}";
          const NAV_ITEMS = ${JSON.stringify(navItemsList)};

          function fixSubpage() {
            if (document.title !== EXPECTED_TITLE) document.title = EXPECTED_TITLE;
            // 1. Maintain Header Logo with full width & direct navigation to /${lang}/
            const logoImgs = document.querySelectorAll('[data-framer-name="Logo"] img, img[src*="tJ1jqpEOBL9Nna5facx9Yh1rSA"], img[src*="logo-header"]');
            logoImgs.forEach(img => {
              if (!img.src.includes('logo-header.png')) {
                img.src = '/assets/logo-header.png';
                img.removeAttribute('srcset');
                img.removeAttribute('sizes');
              }
              img.style.setProperty('max-height', '45px', 'important');
              img.style.setProperty('width', 'auto', 'important');
              img.style.setProperty('max-width', '190px', 'important');
              img.style.setProperty('object-fit', 'contain', 'important');
              img.style.setProperty('object-position', 'left center', 'important');
              
              const a = img.closest('a');
              if (a) {
                a.style.setProperty('width', '195px', 'important');
                a.style.setProperty('max-width', 'none', 'important');
                a.style.setProperty('display', 'flex', 'important');
                a.style.setProperty('align-items', 'center', 'important');
                a.style.setProperty('justify-content', 'flex-start', 'important');
                a.setAttribute('href', '/${lang}/');
                a.removeAttribute('data-framer-page-link-current');
                // Hard navigation to home page on click, preventing Framer router
                a.onclick = function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = '/${lang}/';
                  return false;
                };
                if (a.parentElement) {
                  a.parentElement.style.setProperty('width', 'auto', 'important');
                  a.parentElement.style.setProperty('min-width', '195px', 'important');
                  a.parentElement.style.setProperty('overflow', 'visible', 'important');
                }
              }
            });

            // 2. Maintain Header Nav (6 items, no "О форуме") - only rebuild if mismatch!
            const navContainers = document.querySelectorAll('nav.framer-1s42b8a, nav[data-framer-name="Links"], .framer-18kiu0w nav');
            navContainers.forEach(nav => {
              const currentLinks = Array.from(nav.querySelectorAll('a.framer-npy4b'));
              const currentLabels = currentLinks.map(a => {
                const p = a.querySelector('.framer-1dl5625 p');
                return p ? p.textContent.trim() : a.textContent.trim();
              });
              const expectedLabels = NAV_ITEMS.map(n => n.label);
              
              // Only modify DOM if labels or count do not match!
              if (currentLabels.join('|') !== expectedLabels.join('|') || currentLinks.length !== NAV_ITEMS.length) {
                nav.innerHTML = '';
                NAV_ITEMS.forEach(item => {
                  const wrap = document.createElement('div');
                  wrap.className = 'framer-nav-item-wrap';
                  wrap.style.cssText = 'opacity:1;transform:none;flex:none;position:relative;';
                  wrap.innerHTML = 
                    '<a class="framer-npy4b framer-mxN0T framer-ikziiq framer-v-ikziiq framer-115tijb" data-framer-name="Light" href="' + item.href + '" tabindex="0" style="background-color:var(--token-9a7303fe-2324-4aa1-bbd4-e1f1d449de82, rgba(255, 255, 255, 0.12));border-bottom-left-radius:100px;border-bottom-right-radius:100px;border-top-left-radius:100px;border-top-right-radius:100px">' +
                      '<div class="framer-295hd4" data-framer-name="BG" style="background-color:var(--token-9a7303fe-2324-4aa1-bbd4-e1f1d449de82, rgba(255, 255, 255, 0.12));border-bottom-left-radius:100px;border-bottom-right-radius:100px;border-top-left-radius:100px;border-top-right-radius:100px"></div>' +
                      '<div class="framer-1dl5625" data-framer-name="Label" data-framer-component-type="RichTextContainer" style="--extracted-r6o4lv:var(--token-873fb35c-2084-47f0-9254-cb5d8b65f475, rgb(255, 255, 255));--framer-link-text-color:rgb(0, 153, 255);--framer-link-text-decoration:underline;transform:none">' +
                        '<p class="framer-text framer-styles-preset-dsr0r" data-styles-preset="Erxl6HnxD" style="--framer-text-color:var(--extracted-r6o4lv, var(--token-873fb35c-2084-47f0-9254-cb5d8b65f475, rgb(255, 255, 255)));font-family:\\'Inter\\',sans-serif;font-size:16px;font-weight:500;">' + item.label + '</p>' +
                      '</div>' +
                      '<div class="framer-mvpx8f" data-framer-name="Another one" style="background-color:var(--token-dc631f8a-4140-47df-884a-ed562fa8ef1a, rgb(41, 170, 225));border-bottom-left-radius:100px;border-bottom-right-radius:100px;border-top-left-radius:100px;border-top-right-radius:100px"></div>' +
                      '<div class="framer-shp3q0" data-framer-name="Label" data-framer-component-type="RichTextContainer" style="--framer-link-text-color:rgb(0, 153, 255);--framer-link-text-decoration:underline;transform:translateX(-50%)">' +
                        '<p class="framer-text framer-styles-preset-dsr0r" data-styles-preset="Erxl6HnxD" style="color:#ffffff;font-family:\\'Inter\\',sans-serif;font-size:16px;font-weight:500;">' + item.label + '</p>' +
                      '</div>' +
                    '</a>';
                  const a = wrap.querySelector('a');
                  a.addEventListener('mouseenter', () => a.classList.add('hover'));
                  a.addEventListener('mouseleave', () => a.classList.remove('hover'));
                  a.onclick = function(e) {
                    e.stopPropagation();
                    window.location.href = item.href;
                  };
                  nav.appendChild(wrap);
                });
              }
            });

            // 3. Maintain Header Registration CTA Button
            const regBtns = document.querySelectorAll('[data-framer-name="Get Ticket"], [data-framer-name="Get Tickets"], .framer-8y2g0o');
            regBtns.forEach(b => {
              const p = b.querySelector('p');
              if (p && p.textContent.trim() !== REG_BTN_TEXT) p.textContent = REG_BTN_TEXT;
              const a = b.tagName === 'A' ? b : b.closest('a');
              if (a) {
                if (a.getAttribute('href') !== '#tickets') a.setAttribute('href', '#tickets');
                a.onclick = function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  const target = document.getElementById('tickets') || document.querySelector('section[data-framer-name="Registration"]');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.hash = 'tickets';
                  }
                  return false;
                };
              }
            });

            // 4. Maintain Big H1 Title
            const h1 = document.querySelector('h1');
            if (h1 && h1.textContent.trim() !== EXPECTED_H1) {
              h1.className = '${slug === 'press' ? 'framer-hero-big-title muun-hero-one-line' : 'framer-hero-big-title'}';
              h1.textContent = EXPECTED_H1;
              h1.style.setProperty('opacity', '1', 'important');
              h1.style.setProperty('visibility', 'visible', 'important');
            }

            // 5. Maintain Kicker and Subheading (NO double dash!)
            const kickerH4s = document.querySelectorAll('section:not([data-framer-name="Registration"]) [data-framer-name="Tag"] h4');
            if (kickerH4s.length > 0) {
              kickerH4s.forEach(k => {
                if (k.textContent.trim() !== EXPECTED_KICKER) k.textContent = EXPECTED_KICKER;
              });
            } else {
              const firstH4 = document.querySelector('section:not([data-framer-name="Registration"]) h4');
              if (firstH4 && firstH4.textContent.trim() !== EXPECTED_KICKER) firstH4.textContent = EXPECTED_KICKER;
            }
            // Strip any accidental leading dashes from all H4 elements on page
            document.querySelectorAll('h4').forEach(h4 => {
              const t = h4.textContent.trim();
              if (t.startsWith('—') || t.startsWith('-')) {
                h4.textContent = t.replace(/^[\\s—–-]+/, '').trim();
              }
            });
            const subH2 = document.querySelector('section:not([data-framer-name="Registration"]) h2');
            if (subH2 && subH2.textContent.trim() !== EXPECTED_H2) {
              subH2.textContent = EXPECTED_H2;
            }

            ${slug === 'speakers' ? `
            const SPEAKER_ROSTER = ${JSON.stringify(speakerRoster(lang))};
            const EXTRA_SPEAKERS_HTML = ${JSON.stringify(renderExtraSpeakers(speakerRoster(lang)))};
            document.querySelectorAll('[data-framer-name="Speakers 1"] [data-framer-name="Tag"], [data-framer-name="Speakers 2"]').forEach(el => {
              el.style.setProperty('display', 'none', 'important');
            });
            const speakerSection = document.querySelector('[data-framer-name="Speakers 1"]');
            if (speakerSection && EXTRA_SPEAKERS_HTML && !document.querySelector('.muun-extra-speakers')) {
              speakerSection.insertAdjacentHTML('beforeend', EXTRA_SPEAKERS_HTML);
            }
            let speakerProfiles = [...document.querySelectorAll('[data-framer-name="Speakers 1"] [data-framer-name="Profile"]')];
            const visibleProfiles = speakerProfiles.filter(p => p.getBoundingClientRect().height > 0);
            if (visibleProfiles.length) speakerProfiles = visibleProfiles;
            speakerProfiles.forEach((profile, i) => {
              if (i >= 8) return;
              const person = SPEAKER_ROSTER[i];
              if (!person) return;
              const card = profile.parentElement;
              profile.querySelectorAll('[data-framer-name="Name"] h4').forEach(h => {
                if (h.textContent !== person.name) h.textContent = person.name;
              });
              profile.querySelectorAll('[data-framer-name="Designation"] p').forEach(p => {
                if (p.textContent !== person.role) p.textContent = person.role;
              });
              profile.querySelectorAll('[data-framer-name="Designation"]').forEach(el => {
                if (person.role) el.style.removeProperty('display');
                else el.style.setProperty('display', 'none', 'important');
              });
              card.style.setProperty('height', 'auto', 'important');
              card.style.setProperty('display', 'flex', 'important');
              card.style.setProperty('flex-direction', 'column', 'important');
              card.style.setProperty('align-items', 'stretch', 'important');
              const photoBox = card.querySelector('[data-framer-name="Content"]');
              if (photoBox) {
                photoBox.style.setProperty('width', '100%', 'important');
                photoBox.style.setProperty('height', 'auto', 'important');
                photoBox.style.setProperty('aspect-ratio', '4 / 5', 'important');
                photoBox.style.setProperty('flex', 'none', 'important');
                photoBox.style.setProperty('position', 'relative', 'important');
                photoBox.style.setProperty('overflow', 'hidden', 'important');
              }
              const photo = card.querySelector('[data-framer-name="Image"]');
              if (photo) {
                photo.style.setProperty('position', 'absolute', 'important');
                photo.style.setProperty('inset', '0', 'important');
                photo.style.setProperty('width', '100%', 'important');
                photo.style.setProperty('height', '100%', 'important');
              }
              profile.querySelectorAll('[data-framer-name="Name"], [data-framer-name="Name"] h4').forEach(el => {
                el.style.setProperty('min-height', '2.8em', 'important');
                el.style.setProperty('height', 'auto', 'important');
              });
              card.querySelectorAll('[data-framer-name="Image"] img').forEach(img => {
                if (img.closest('[data-framer-name="Blue Blur"]')) return;
                if (!img.getAttribute('src') || !img.getAttribute('src').includes(person.photo)) {
                  img.removeAttribute('srcset');
                  img.removeAttribute('sizes');
                  img.setAttribute('src', person.photo);
                }
                img.setAttribute('alt', person.name);
                img.style.setProperty('object-fit', 'cover', 'important');
                img.style.setProperty('object-position', person.focus || 'center 20%', 'important');
              });
              card.querySelectorAll('[data-framer-name="Blue Blur"], [data-framer-name="Instagram"], [data-framer-name="Linkedin"]').forEach(el => {
                el.style.setProperty('display', 'none', 'important');
              });
            });
            ` : ''}

            ${slug === 'news' ? `
            document.querySelectorAll('section[data-framer-name="Contact"] [data-framer-name="Contact Cards"], section[data-framer-name="Contact"] [data-framer-name="Contact Form"], section[data-framer-name="Contact"] [data-framer-name="Join Our Community"], section[data-framer-name="Contact"] form').forEach(el => {
              el.style.setProperty('display', 'none', 'important');
            });
            const newsHost = document.querySelector('section[data-framer-name="Contact"]');
            if (newsHost && !newsHost.querySelector('.muun-news')) {
              newsHost.insertAdjacentHTML('beforeend', ${JSON.stringify(renderNewsBlock(lang))});
            }
            document.querySelectorAll('.muun-news').forEach(root => {
              if (window.__muunBindNews) window.__muunBindNews(root);
            });
            ` : ''}

            ${slug === 'press' ? `
            document.querySelectorAll('section[data-framer-name="Contact"] [data-framer-name="Contact Cards"], section[data-framer-name="Contact"] [data-framer-name="Contact Form"], section[data-framer-name="Contact"] [data-framer-name="Join Our Community"], section[data-framer-name="Contact"] [data-framer-name="Tag"], section[data-framer-name="Contact"] form:not(.muun-press-form)').forEach(el => {
              el.style.setProperty('display', 'none', 'important');
            });
            const pressHost = document.querySelector('section[data-framer-name="Contact"]');
            if (pressHost && !pressHost.querySelector('.muun-press')) {
              pressHost.insertAdjacentHTML('beforeend', ${JSON.stringify(renderPressBlock(lang))});
            }
            document.querySelectorAll('.muun-press').forEach(root => {
              if (window.__muunBindPress) window.__muunBindPress(root);
            });
            ` : ''}

            ${slug === 'program' ? programFixerJs(lang) : ''}

            ${slug === 'venue' ? `
            const venueSec = document.querySelector('section[data-framer-name="Venue"]');
            if (venueSec) {
              venueSec.querySelectorAll('.framer-1h1gm54, [data-framer-name="Venue Title"], [data-framer-name="Tag"]').forEach(el => {
                el.style.setProperty('display', 'none', 'important');
              });
              const thirdShot = venueSec.querySelector('.framer-nl6gb7');
              if (thirdShot) thirdShot.style.setProperty('display', 'none', 'important');
              const venueParas = ${JSON.stringify({
                ru: [
                  'Конгресс-холл «Ырыс Ордо» в комплексе «Бишкек Арена» — место проведения MUUN 2026, национальной молодежной выставки-форума профессий будущего. 17 ноября здесь встречаются школьники, студенты, университеты, работодатели и государственные организации.',
                  'На площадке работают главная сцена, панельные дискуссии и стойки регистрации. Гости проходят тематические зоны, слушают выступления и лично общаются с компаниями и учебными заведениями о карьере, обучении и проектах.'
                ],
                ky: [
                  '«Ырыс Ордо» конгресс-холлу «Бишкек Арена» комплексинде MUUN 2026 — келечектин кесиптеринин улуттук жаштар көргөзмө-форуму өтөт. 17-ноябрда бул жерде мектеп окуучулары, студенттер, университеттер, иш берүүчүлөр жана мамлекеттик уюмдар жолугат.',
                  'Аянтчада башкы сахна, панелдик талкуулар жана каттоо зонасы иштейт. Коноктор тематикалык зоналарды кыдырып, чыгып сүйлөөлөрдү угуп, компаниялар жана окуу жайлар менен карьера, билим жана долбоорлор тууралуу жеке сүйлөшөт.'
                ],
                en: [
                  'The Yrys Ordo Congress Hall at the Bishkek Arena complex is the venue for MUUN 2026, the national youth exhibition-forum of the professions of the future. On 17 November, school students, university students, employers and public institutions meet here.',
                  'The hall brings together the main stage, panel discussions and registration desks. Guests walk through the thematic zones, listen to the sessions and talk directly with companies and education institutions about careers, study and projects.'
                ]
              }[lang])};
              const textPs = venueSec.querySelectorAll('[data-framer-name="Text"] p');
              textPs.forEach((p, i) => {
                if (venueParas[i] && p.textContent.trim() !== venueParas[i]) p.textContent = venueParas[i];
              });
              const venueSwaps = [
                ['jAO8hsj4cqFOU4eSd9NEn5faTuM', '/assets/venue-exterior.jpg'],
                ['tb1C68dgSO0HtIQ3nl97tROxntI', '/assets/gallery-mainstage.jpg'],
                ['eRjuxhjXm2C3YKMVMexMdMIkaA', '/assets/gallery-panel.jpg']
              ];
              venueSec.querySelectorAll('img').forEach(img => {
                const raw = (img.getAttribute('src') || '') + ' ' + (img.getAttribute('srcset') || '') + ' ' + (img.src || '');
                const hit = venueSwaps.find(([id]) => raw.includes(id));
                if (!hit) return;
                if (img.getAttribute('src') !== hit[1]) {
                  img.removeAttribute('srcset');
                  img.removeAttribute('sizes');
                  img.src = hit[1];
                }
              });
            }
            ` : ''}

            // 6. Maintain Registration section & Ticket Video & Questionnaire Form
            const regSec = document.querySelector('section[data-framer-name="Registration"], #tickets');
            if (regSec) {
              if (regSec.id !== 'tickets') regSec.id = 'tickets';

              // Ticket video blend mode
              const vContainer = regSec.querySelector('.framer-xqjflg, .framer-x4d5kq, [data-framer-name="Sticky"], [data-framer-name="Graphic"]');
              if (vContainer) {
                vContainer.style.setProperty('mix-blend-mode', 'screen', 'important');
                vContainer.style.setProperty('background', 'transparent', 'important');
              }
              const regVideo = regSec.querySelector('video');
              if (regVideo) {
                regVideo.style.setProperty('mix-blend-mode', 'screen', 'important');
                regVideo.style.setProperty('background', 'transparent', 'important');
              }

              // Hide old cards or replace them with survey form
              const oldPricing = regSec.querySelectorAll('[data-framer-name="Cards"] [data-framer-name="Ticket 01"], [data-framer-name="Pricing "], .framer-ldkdj8, .framer-108zwyn, .framer-iuqh2z');
              oldPricing.forEach(el => el.style.setProperty('display', 'none', 'important'));

              // Inject registration questionnaire form into cards container
              const cardsWrap = regSec.querySelector('.framer-n7lw51, [data-framer-name="Cards"], .framer-19s8391');
              if (cardsWrap && !cardsWrap.querySelector('.muun-reg-card')) {
                const tpl = document.getElementById('muun-reg-form-tpl');
                if (tpl) {
                  cardsWrap.innerHTML = '';
                  cardsWrap.appendChild(tpl.content.cloneNode(true));
                }
              }

              // Update registration title & kicker (identical to main landing page!)
              const regH4 = regSec.querySelector('h4');
              const expRegKicker = "${lang === 'ky' ? 'Каттоо' : lang === 'en' ? 'Registration' : 'Регистрация'}";
              if (regH4 && regH4.textContent.trim() !== expRegKicker) {
                regH4.textContent = expRegKicker;
              }
              const regH2 = regSec.querySelector('h2');
              const expRegTitle = "${lang === 'ky' ? 'Көргөзмө-форумга бүгүн катталыңыз' : lang === 'en' ? 'Register for the Exhibition-Forum Today' : 'Зарегистрируйтесь на выставку-форум уже сегодня'}";
              const expRegH2Html = '${lang === 'ky' ? 'Көргөзмө-форумга <span class="heading-muted">бүгүн катталыңыз</span>' : lang === 'en' ? 'Register for the Exhibition-Forum <span class="heading-muted">Today</span>' : 'Зарегистрируйтесь на выставку-форум <span class="heading-muted">уже сегодня</span>'}';
              if (regH2 && regH2.textContent.replace(/\\s+/g, ' ').trim() !== expRegTitle) {
                regH2.innerHTML = expRegH2Html;
              }
            }

            // 7. Maintain Footer Logo & Legal
            const footerFig = document.querySelector('.framer-RYOK6 .framer-16fyxtb, .framer-16fyxtb');
            if (footerFig) {
              footerFig.style.setProperty('mask', 'none', 'important');
              footerFig.style.setProperty('-webkit-mask', 'none', 'important');
              const footerImg = footerFig.querySelector('img');
              if (footerImg && !footerImg.src.includes('logo-footer.png')) {
                footerImg.src = '/assets/logo-footer.png';
                footerImg.removeAttribute('srcset');
                footerImg.removeAttribute('sizes');
              }
            }

            const privacyText = "${lang === 'ky' ? 'Купуялуулук саясаты' : lang === 'en' ? 'Privacy Policy' : 'Политика конфиденциальности'}";
            const offerText = "${lang === 'ky' ? 'Оферта келишими' : lang === 'en' ? 'Terms of Service' : 'Договор оферты'}";
            const privContainer = document.querySelector('.framer-1ie1jya');
            if (privContainer) {
              const privP = privContainer.querySelector('p');
              if (privP && privP.textContent.trim() !== privacyText) {
                privP.innerHTML = '<a href="#" style="color:inherit;text-decoration:none;">' + privacyText + '</a>';
              }
            }
            const offerContainer = document.querySelector('.framer-18tis13, .framer-b79ppf');
            if (offerContainer) {
              const offerP = offerContainer.querySelector('p');
              if (offerP && offerP.textContent.trim() !== offerText) {
                offerP.textContent = offerText;
              }
            }

            // Hide Designed By and Social
            const designedBy = document.querySelector('.framer-1n7mxh0');
            if (designedBy) designedBy.style.setProperty('display', 'none', 'important');
            const socialLabel = document.querySelector('.framer-17tcu0s');
            if (socialLabel) socialLabel.style.setProperty('display', 'none', 'important');
            ${footerFixerJs}
            ${slug === 'contacts' ? contactFixerJs(lang) : ''}
          }

          // Registration form multi-step logic
          window.handleCategorySelect = function(cat) {
            document.querySelectorAll('.muun-cat-btn').forEach(b => {
              b.classList.remove('active');
              if (b.dataset.cat === cat) b.classList.add('active');
            });
            const catInput = document.getElementById('reg-category');
            if (catInput) catInput.value = cat;
          };

          window.goToRegStep = function(step) {
            const step1 = document.getElementById('muun-reg-step-1');
            const step2 = document.getElementById('muun-reg-step-2');
            if (step === 2) {
              if (step1) step1.style.display = 'none';
              if (step2) step2.style.display = 'block';
            } else {
              if (step2) step2.style.display = 'none';
              if (step1) step1.style.display = 'block';
            }
          };

          window.handleRegSubmit = function(e) {
            e.preventDefault();
            const btn = document.querySelector('.muun-reg-submit-btn');
            if (btn) btn.textContent = '...';
            setTimeout(() => {
              const regCards = document.querySelector('.muun-reg-card');
              if (regCards) {
                regCards.innerHTML = '<div style=\"text-align:center;padding:40px 20px;\"><h3 style=\"color:#29AAE1;font-size:24px;margin-bottom:12px;\">${lang === 'ky' ? 'Ийгиликтүү катталдыңыз!' : lang === 'en' ? 'Successfully Registered!' : 'Регистрация успешна!'}</h3><p style=\"color:#fff;font-size:16px;\">${lang === 'ky' ? 'Билетиңиз электрондук почтаңызга жөнөтүлдү.' : lang === 'en' ? 'Your ticket has been sent to your email.' : 'Ваш билет отправлен на указанную почту.'}</p></div>';
              }
            }, 600);
          };

          (function watchFramer(fix) {
            var obs = new MutationObserver(function () { schedule(); });
            var queued = false;
            var started = false;
            function schedule() {
              if (queued) return;
              queued = true;
              requestAnimationFrame(function () {
                queued = false;
                try { fix(); }
                catch (err) { console.error('[muun]', err); }
              });
            }
            function start() {
              if (started || !document.body) return;
              started = true;
              obs.observe(document.body, { childList: true, subtree: true });
              schedule();
            }
            if (document.body) start();
            else document.addEventListener('DOMContentLoaded', start);
            window.addEventListener('pageshow', function (event) {
              if (event.persisted) schedule();
            });
          })(fixSubpage);
        })();
      </script>
    `;
    const enginePairs = [
      ['Eventis - Free Event and Conference Template', `${pageTitle.meta} — MUUN 2026`],
      ['Join Eventis, the premier technology and IT summit, bringing together developers, designers, entrepreneurs, and investors to explore the latest in software development, AI innovations, and startup growth.', metaDesc],
      ['Get Ticket', regCtaText],
      ['Get Tickets', regCtaText],
      ['info@aicron.com', 'info@muun.kg'],
      ['+91 1234567890', '+996 990 122 341'],
      ['Designed By Jitu Raut  @fremix.design', ''],
      ['Terms and Conditions', lang === 'ky' ? 'Оферта келишими' : lang === 'en' ? 'Terms of Service' : 'Договор оферты'],
      ['Email Us', contactCopy(lang).emailTitle],
      ['Call Us', contactCopy(lang).phoneTitle],
      ['Reach out to our team for quick assistance.', contactCopy(lang).emailBody],
      ['Drop us a message and we will get back to you shortly.', contactCopy(lang).phoneBody]
    ];
    speakerRoster(lang).forEach((person, index) => {
      const orig = SPEAKER_ORIGINALS[index];
      if (!orig) return;
      enginePairs.push([orig.name, person.name], [orig.role, person.role]);
    });
    pageHtml = stripFramerRuntime(pageHtml.replace('</body>', `${clientScript}\n</body>`), { lang, pairs: enginePairs });

    // Write output files
    const targets = [
      `dist/${lang}/${slug}/index.html`,
      `dist/${lang}/${slug}.html`
    ];
    if (conf.aliases) {
      for (const al of conf.aliases) {
        targets.push(`dist/${lang}/${al}/index.html`);
        targets.push(`dist/${lang}/${al}.html`);
      }
    }
    if (lang === 'ru') {
      targets.push(`dist/${slug}/index.html`);
      targets.push(`dist/${slug}.html`);
      if (conf.aliases) {
        for (const al of conf.aliases) {
          targets.push(`dist/${al}/index.html`);
          targets.push(`dist/${al}.html`);
        }
      }
    }

    for (const target of targets) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, pageHtml);
    }
  }
}

console.log('Completely polished subpages build complete!');
