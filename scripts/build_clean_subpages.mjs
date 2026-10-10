import fs from 'fs';
import path from 'path';
import { renderParticipantModal } from './participant_modal.mjs';

console.log('Building completely polished subpages with exact fixes...');

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
      ru: { h1: 'СПИКЕРЫ', kicker: 'Спикеры', sub: 'Познакомьтесь с ведущими спикерами и экспертами форума', meta: 'Спикеры' },
      ky: { h1: 'СПИКЕРЛЕР', kicker: 'Спикерлер', sub: 'Форумдун алдыңкы спикерлери жана эксперттери менен таанышыңыз', meta: 'Спикерлер' },
      en: { h1: 'SPEAKERS', kicker: 'Speakers', sub: 'Meet Our Esteemed Speakers and Technology Trailblazers', meta: 'Speakers' }
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
      ru: { h1: 'ПЛОЩАДКА', kicker: 'Площадка', sub: 'Конгресс-Холл «Ырыс Ордо», Бишкек — тематические зоны', meta: 'Площадка' },
      ky: { h1: 'ӨТКӨРҮЛҮҮЧҮ ЖЕР', kicker: 'Аянтча', sub: '«Ырыс Ордо» конгресс-холлу, Бишкек — тематикалык зоналар', meta: 'Өткөрүлүүчү жер' },
      en: { h1: 'VENUE', kicker: 'Venue', sub: 'Congress Hall "Yrys Ordo", Bishkek — thematic zones', meta: 'Venue' }
    }
  },
  news: {
    template: 'contact',
    titles: {
      ru: { h1: 'НОВОСТИ', kicker: 'Новости', sub: 'Актуальные события и новости форума MUUN 2026', meta: 'Новости' },
      ky: { h1: 'ЖАҢЫЛЫКТАР', kicker: 'Жаңылыктар', sub: 'MUUN 2026 форумунун актуалдуу окуялары жана жаңылыктары', meta: 'Жаңылыктар' },
      en: { h1: 'NEWS', kicker: 'News', sub: 'Latest updates and news from MUUN 2026', meta: 'News' }
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
      ru: { h1: 'КОНТАКТЫ', kicker: 'Контакты', sub: 'Свяжитесь с оргкомитетом молодежного форума MUUN 2026', meta: 'Контакты' },
      ky: { h1: 'БАЙЛАНЫШТАР', kicker: 'Байланыш', sub: 'MUUN 2026 жаштар форумунун уюштуруу комитети менен байланышуу', meta: 'Байланыштар' },
      en: { h1: 'CONTACTS', kicker: 'Contacts', sub: 'Get in touch with the MUUN 2026 organizing team', meta: 'Contacts' }
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
    let pageHtml = templates[conf.template];
    const pageTitle = conf.titles[lang];

    // Replace <title>
    pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${pageTitle.meta} — MUUN 2026</title>`);

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
      </style>
    `;
    pageHtml = pageHtml.replace('</head>', `${customStylesHtml}\n${extraCss}\n</head>`);

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
    pageHtml = pageHtml.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, `<h1 class="framer-hero-big-title">${pageTitle.h1}</h1>`);

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
      <div style="position:fixed; bottom:20px; right:20px; z-index:99999; display:flex; gap:8px; background:rgba(6,21,36,0.85); padding:10px 18px; border-radius:30px; backdrop-filter:blur(12px); border:1px solid rgba(41,170,225,0.3); box-shadow:0 4px 20px rgba(0,0,0,0.5);">
        <a href="/ru/${slug}" style="color: ${lang === 'ru' ? '#29AAE1' : 'rgba(255,255,255,0.6)'}; text-decoration:none; font-family:sans-serif; font-size:14px; font-weight:bold; transition: 0.3s;">RU</a>
        <span style="color:rgba(255,255,255,0.2);">|</span>
        <a href="/ky/${slug}" style="color: ${lang === 'ky' ? '#29AAE1' : 'rgba(255,255,255,0.6)'}; text-decoration:none; font-family:sans-serif; font-size:14px; font-weight:bold; transition: 0.3s;">KY</a>
        <span style="color:rgba(255,255,255,0.2);">|</span>
        <a href="/en/${slug}" style="color: ${lang === 'en' ? '#29AAE1' : 'rgba(255,255,255,0.6)'}; text-decoration:none; font-family:sans-serif; font-size:14px; font-weight:bold; transition: 0.3s;">EN</a>
      </div>
    `;

    const participantModalHtml = renderParticipantModal(lang);

    // Append registration template, participant modal, language switcher, and continuous hydration fixer before </body>
    const clientScript = `
      ${tplHtml}
      ${participantModalHtml}
      ${langSwitcherHtml}
      <script>
        (function() {
          const EXPECTED_H1 = "${pageTitle.h1}";
          const EXPECTED_KICKER = "${pageTitle.kicker}";
          const EXPECTED_H2 = "${pageTitle.sub.replace(/"/g, '\\"')}";
          const REG_BTN_TEXT = "${regCtaText}";
          const NAV_ITEMS = ${JSON.stringify(navItemsList)};

          function fixSubpage() {
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
              h1.className = 'framer-hero-big-title';
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

          fixSubpage();
          setInterval(fixSubpage, 50);
        })();
      </script>
    `;
    pageHtml = pageHtml.replace('</body>', `${clientScript}\n</body>`);

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
