import fs from 'fs';
import { execSync } from 'child_process';
import { renderParticipantModal } from './participant_modal.mjs';
import { REGISTRATION_ENDPOINT } from './form_endpoints.mjs';
import { getRegistrationClientJs } from './reg_form_client.mjs';
import { SOCIAL, threadsIconSvg, footerSocialCss, footerFixerJs, mobileNavCss, renderMobileNav } from './muun_social.mjs';
import { programCss, programClientJs, programFixerJs, injectProgramSsr } from './program_block.mjs';
import { lockHeroMark, heroMarkCss, heroMarkScript } from './hero_mark.mjs';
import { stripFramerRuntime } from './strip_framer_runtime.mjs';
import { vendorFramerEngine } from './vendor_framer_engine.mjs';

try {
  execSync('powershell -ExecutionPolicy Bypass -File scripts/process_user_assets.ps1', { stdio: 'inherit' });
} catch (e) {
  console.warn('Asset processing note:', e.message);
}

const rawHtml = fs.readFileSync('templates/eventis_raw.html', 'utf8');
try { fs.unlinkSync('dist/.framer-pairs.json'); } catch { /* fresh build */ }
const i18n = JSON.parse(fs.readFileSync('src/i18n.json', 'utf8'));
const homeTemplate = fs.readFileSync('src/template.html', 'utf8');
const kgMapStart = homeTemplate.indexOf('<svg id="kyrgyzstan-vector-map"');
const kgMapEnd = homeTemplate.indexOf('</svg>', kgMapStart);
const kgMapSvgRaw = kgMapStart >= 0 ? homeTemplate.slice(kgMapStart, kgMapEnd + 6) : '';
const kgMapLabels = {
  ky: { 'Чуй': 'Чүй' },
  en: {
    'Бишкек': 'Bishkek', 'Баткен': 'Batken', 'Чуй': 'Chuy', 'Ысык-Көл': 'Issyk-Kul',
    'Нарын': 'Naryn', 'Талас': 'Talas', 'Ош': 'Osh', 'Жалал-Абад': 'Jalal-Abad'
  }
};
function kgMapSvgFor(lang) {
  const labels = kgMapLabels[lang] || {};
  return kgMapSvgRaw.replace(/(<(?:text|title)[^>]*>)([^<]*)(<\/(?:text|title)>)/g, (m, open, label, close) =>
    open + (labels[label.trim()] || label) + close);
}

// Copy all key assets to dist and dist/assets
fs.mkdirSync('dist/assets', { recursive: true });
const downloadMinistryLogo = 'C:/Users/Beibars/Downloads/лого министерство.jpeg';
if (fs.existsSync(downloadMinistryLogo)) {
  fs.copyFileSync(downloadMinistryLogo, 'assets/ministry-logo.jpeg');
}
const downloadEagle = 'C:/Users/Beibars/Downloads/орел2.png';
if (fs.existsSync(downloadEagle)) {
  fs.copyFileSync(downloadEagle, 'assets/eagle2.png');
}

for (const f of fs.readdirSync('assets')) {
  const srcPath = `assets/${f}`;
  if (fs.existsSync(srcPath) && fs.statSync(srcPath).isFile()) {
    fs.copyFileSync(srcPath, `dist/${f}`);
    fs.copyFileSync(srcPath, `dist/assets/${f}`);
  }
}
if (fs.existsSync('assets/aeroporty kyrgyzstana.png')) {
  fs.copyFileSync('assets/aeroporty kyrgyzstana.png', 'assets/aeroporty-kyrgyzstana.png');
  fs.copyFileSync('assets/aeroporty kyrgyzstana.png', 'dist/assets/aeroporty-kyrgyzstana.png');
}

const localizedContent = {
  ru: {
    title: 'ВЫБЕРИ СВОЕ<br>БУДУЩЕЕ',
    subtitle: 'Национальный молодежный форум Жаратман МУУН',
    date: '28 ноября 2026',
    location: 'Конгресс-холл «Ырыс Ордо», Бишкек',
    btnPrimary: 'Стать участником',
    btnSecondary: 'Бесплатная регистрация',
    ministry: 'При поддержке Министерства науки, высшего образования<br>и инноваций Кыргызской Республики'
  },
  ky: {
    title: 'КЕЛЕЧЕГИҢДИ<br>ТАНДА',
    subtitle: '«Жаратман МУУН» улуттук жаштар форуму',
    date: '28-ноябрь 2026',
    location: '«Ырыс Ордо» конгресс-холлу, Бишкек',
    btnPrimary: 'Катышуучу болуу',
    btnSecondary: 'Акысыз каттоо',
    ministry: 'Кыргыз Республикасынын Илим, жогорку билим берүү жана инновациялар министрлигинин колдоосу менен'
  },
  en: {
    title: 'CHOOSE YOUR<br>FUTURE',
    subtitle: 'National Youth Forum Zharatman MUUN',
    date: '28 November 2026',
    location: 'Yrys Ordo Congress Hall, Bishkek',
    btnPrimary: 'Become a participant',
    btnSecondary: 'Free registration',
    ministry: 'Supported by the Ministry of Science, Higher Education and Innovation of the Kyrgyz Republic'
  }
};

const aboutData = {
  ru: {
    kicker: 'О форуме',
    stats: [
      { target: 30, suffix: '+', desc: 'компаний и организаций' },
      { target: 2000, suffix: '+', desc: 'посетителей' },
      { target: 5, suffix: '+', desc: 'стран участниц' },
      { target: 7000, suffix: ' м²', desc: 'площадь' },
      { target: 10, suffix: '+', desc: 'мероприятий программы' },
      { target: 50, suffix: '+', desc: 'топ-менеджеров и спикеров' }
    ],
    pres: {
      kicker: 'Президент Кыргызской Республики',
      name: 'Садыр Жапаров',
      quote: '«Только в государствах с развитым образованием происходят политические, культурные и экономические изменения. Образование — фундамент долгосрочного развития государства, а инвестиции в образование — важнейший вклад в будущее страны».'
    }
  },
  ky: {
    kicker: 'Форум жөнүндө',
    stats: [
      { target: 30, suffix: '+', desc: 'компаниялар жана уюмдар' },
      { target: 2000, suffix: '+', desc: 'келүүчүлөр' },
      { target: 5, suffix: '+', desc: 'катышуучу өлкөлөр' },
      { target: 7000, suffix: ' м²', desc: 'аянт' },
      { target: 10, suffix: '+', desc: 'программадагы иш-чаралар' },
      { target: 50, suffix: '+', desc: 'топ-менеджерлер жана спикерлер' }
    ],
    pres: {
      kicker: 'Кыргыз Республикасынын Президенти',
      name: 'Садыр Жапаров',
      quote: '«Билим өнүккөн мамлекеттерде гана саясий, маданий, экономикалык өзгөрүүлөр болот. Билим — мамлекеттин узак мөөнөттүү өнүгүүсүнүн пайдубалы, ал эми билимге инвестиция — өлкөнүн келечегине эң маанилүү салым».'
    }
  },
  en: {
    kicker: 'About the Forum',
    stats: [
      { target: 30, suffix: '+', desc: 'companies and organizations' },
      { target: 2000, suffix: '+', desc: 'visitors' },
      { target: 5, suffix: '+', desc: 'participating countries' },
      { target: 7000, suffix: ' m²', desc: 'venue area' },
      { target: 10, suffix: '+', desc: 'program events' },
      { target: 50, suffix: '+', desc: 'top executives and speakers' }
    ],
    pres: {
      kicker: 'President of the Kyrgyz Republic',
      name: 'Sadyr Japarov',
      quote: '“Political, cultural, and economic transformations only occur in states with advanced education. Education is the bedrock of long-term state development, and investing in education is the most crucial contribution to the nation\'s future.”'
    }
  }
};


const zonesData = {
  ru: {
    titleHtml: 'Тематические <span class="heading-muted">зоны</span>',
    title: 'Тематические зоны',
    zones: [
      { num: '01', color: '#29AAE1', tag: 'AI & DATA', title: 'ГЛАВНЫЙ ЗАЛ', desc: 'Все панели, MUUN Talks, церемонии' },
      { num: '02', color: '#29AAE1', tag: 'ROBOTICS', title: 'СПОНСОРСКОЕ КОЛЬЦО', desc: '19 позиций вокруг зала' },
      { num: '03', color: '#FFB800', tag: 'CLEANTECH', title: 'ОТРАСЛЕВЫЕ ЗОНЫ', desc: '12 зон по 36 м² каждая' },
      { num: '04', color: '#8B5CF6', tag: 'CREATIVE & GAME', title: 'АЛЛЕЯ СТАРТАПОВ', desc: '10 стендов. Питчи для инвесторов' },
      { num: '05', color: '#29AAE1', tag: 'MEDTECH & BIO', title: 'ЯРМАРКА ВАКАНСИЙ', desc: 'Реальные вакансии и собеседования' },
      { num: '06', color: '#29AAE1', tag: 'AGROTECH', title: 'КОМНАТЫ ПЕРЕГОВОРОВ', desc: 'B2B-матчмейкинг и интервью' },
      { num: '07', color: '#FFB800', tag: 'FINTECH', title: 'ВТОРАЯ СЦЕНА + LED', desc: 'Амфитеатр, мастер-классы, MUUN Cup' },
      { num: '08', color: '#60A5FA', tag: 'GOVTECH', title: 'ГЛАВНЫЙ ВХОД', desc: 'Регистрация, навигация, фотозона' },
      { num: '09', color: '#818CF8', tag: 'AEROSPACE', title: 'АЭРОКОСМОС', desc: 'Космос и авиация' },
      { num: '10', color: '#FFFFFF', tag: 'EDTECH & CAREERS', title: 'ОБРАЗОВАНИЕ И КАРЬЕРА', desc: 'Образование будущего' },
      { num: '11', color: '#FFB800', tag: 'TOURISM & BRAND', title: 'ТУРИЗМ И БРЕНД', desc: 'Брендинг страны' },
      { num: '12', color: '#29AAE1', tag: 'WEB3 & CYBER', title: 'WEB3 И КИБЕРСПОРТ', desc: 'Киберспорт и блокчейн' }
    ]
  },
  ky: {
    titleHtml: 'Тематикалык <span class="heading-muted">зоналар</span>',
    title: 'Тематикалык зоналар',
    zones: [
      { num: '01', color: '#29AAE1', tag: 'AI & DATA', title: 'БАШКЫ ЗАЛ', desc: 'Бардык панелдер, MUUN Talks, аземдер' },
      { num: '02', color: '#29AAE1', tag: 'ROBOTICS', title: 'ДЕМӨӨРЧҮЛӨР АЛКАГЫ', desc: 'Залдын тегерегинде 19 позиция' },
      { num: '03', color: '#FFB800', tag: 'CLEANTECH', title: 'ТАРМАКТЫК ЗОНАЛАР', desc: 'Ар бири 36 м² болгон 12 зона' },
      { num: '04', color: '#8B5CF6', tag: 'CREATIVE & GAME', title: 'СТАРТАП АЛЛЕЯСЫ', desc: '10 стенд. Инвесторлор үчүн питчинг' },
      { num: '05', color: '#29AAE1', tag: 'MEDTECH & BIO', title: 'ВАКАНСИЯЛАР ЖАРМАНКЕСИ', desc: 'Чыныгы вакансиялар жана маектешүүлөр' },
      { num: '06', color: '#29AAE1', tag: 'AGROTECH', title: 'СҮЙЛӨШҮҮЛӨР БӨЛМӨЛӨРҮ', desc: 'B2B-матчмейкинг жана маектешүүлөр' },
      { num: '07', color: '#FFB800', tag: 'FINTECH', title: 'ЭКИНЧИ СЦЕНА + LED', desc: 'Амфитеатр, мастер-класстар, MUUN Cup' },
      { num: '08', color: '#60A5FA', tag: 'GOVTECH', title: 'БАШКЫ КИРЕ БЕРИШ', desc: 'Каттоо, навигация, фотозона' },
      { num: '09', color: '#818CF8', tag: 'AEROSPACE', title: 'АЭРОКОСМОС', desc: 'Космос жана авиация' },
      { num: '10', color: '#FFFFFF', tag: 'EDTECH & CAREERS', title: 'БИЛИМ ЖАНА КАРЬЕРА', desc: 'Келечектин билими' },
      { num: '11', color: '#FFB800', tag: 'TOURISM & BRAND', title: 'ТУРИЗМ ЖАНА БРЕНД', desc: 'Өлкө бренди' },
      { num: '12', color: '#29AAE1', tag: 'WEB3 & CYBER', title: 'WEB3 ЖАНА КИБЕРСПОРТ', desc: 'Киберспорт жана блокчейн' }
    ]
  },
  en: {
    titleHtml: 'Thematic <span class="heading-muted">Zones</span>',
    title: 'Thematic Zones',
    zones: [
      { num: '01', color: '#29AAE1', tag: 'AI & DATA', title: 'MAIN HALL', desc: 'All panels, MUUN Talks, ceremonies' },
      { num: '02', color: '#29AAE1', tag: 'ROBOTICS', title: 'SPONSOR RING', desc: '19 positions around the hall' },
      { num: '03', color: '#FFB800', tag: 'CLEANTECH', title: 'SECTOR ZONES', desc: '12 zones of 36 m² each' },
      { num: '04', color: '#8B5CF6', tag: 'CREATIVE & GAME', title: 'STARTUP ALLEY', desc: '10 booths. Pitches for investors' },
      { num: '05', color: '#29AAE1', tag: 'MEDTECH & BIO', title: 'JOB FAIR', desc: 'Real vacancies and interviews' },
      { num: '06', color: '#29AAE1', tag: 'AGROTECH', title: 'MEETING ROOMS', desc: 'B2B matchmaking and interviews' },
      { num: '07', color: '#FFB800', tag: 'FINTECH', title: 'SECOND STAGE + LED', desc: 'Amphitheater, master classes, MUUN Cup' },
      { num: '08', color: '#60A5FA', tag: 'GOVTECH', title: 'MAIN ENTRANCE', desc: 'Registration, navigation, photo zone' },
      { num: '09', color: '#818CF8', tag: 'AEROSPACE', title: 'AEROSPACE ZONE', desc: 'Space & Aviation' },
      { num: '10', color: '#FFFFFF', tag: 'EDTECH & CAREERS', title: 'EDUCATION & CAREERS', desc: 'Future of Education' },
      { num: '11', color: '#FFB800', tag: 'TOURISM & BRAND', title: 'TOURISM & NATION BRAND', desc: 'Country Branding' },
      { num: '12', color: '#29AAE1', tag: 'WEB3 & CYBER', title: 'WEB3 & ESPORTS', desc: 'Esports & Blockchain' }
    ]
  }
};

const faqData = {
  ru: {
    kicker: 'Вопросы-ответы',
    titleHtml: 'Часто задаваемые <span class="heading-muted">вопросы</span>',
    titleText: 'Часто задаваемые вопросы',
    items: [
      {
        q: 'Участие в форуме бесплатное и как зарегистрироваться?',
        a: 'Да, посещение форума полностью бесплатное. Нажмите кнопку «Бесплатная регистрация» на сайте, заполните простую форму и получите персональный билет с QR-кодом для входа.'
      },
      {
        q: 'Кто может участвовать в форуме MUUN 2026?',
        a: 'Форум открыт для всех желающих! Он ориентирован на школьников старших классов, студентов колледжей и вузов, молодых специалистов, родителей, а также преподавателей, университеты и компании-работодатели.'
      },
      {
        q: 'Где и в какое время будет проходить форум?',
        a: 'Форум пройдет 28 ноября 2026 года в Бишкеке, в Конгресс-холле «Ырыс Ордо» (Бишкек Арена), с 14:00 до 19:00.'
      },
      {
        q: 'Как компания или учебное заведение могут стать экспонентом?',
        a: 'Нажмите кнопку <a href="#participant" onclick="window.openParticipantModal(); return false;" style="color:#29AAE1; font-weight:700; text-decoration:underline; cursor:pointer;">«Стать участником»</a> на сайте и заполните форму заявки. Наш оргкомитет свяжется с вами в течение 24 часов для согласования стенда и партнерских условий.'
      },
      {
        q: 'Какие документы необходимы для входа и правила безопасности?',
        a: 'В связи с официальным статусом мероприятия на входе действует контроль безопасности. Пожалуйста, возьмите с собой документ, удостоверяющий личность (паспорт, свидетельство о рождении или студенческий билет), и электронный QR-билет.'
      },
      {
        q: 'Предусмотрены ли условия для участников и делегаций из регионов?',
        a: 'Да, для делегаций школ, колледжей и молодежных центров из всех 7 областей Кыргызстана действует отдельная групповая регистрация и сопровождение кураторами оргкомитета.'
      }
    ]
  },
  ky: {
    kicker: 'Суроо-жооп',
    titleHtml: 'Көп берилүүчү <span class="heading-muted">суроолор</span>',
    titleText: 'Көп берилүүчү суроолор',
    items: [
      {
        q: 'Форумга катышуу акысызбы жана кантип катталса болот?',
        a: 'Ооба, форумга катышуу толугу менен акысыз. Сайтка кирип «Акысыз катталуу» баскычын басып, жеке маалыматтарды толтуруп, жеке QR-коду бар электрондук билет алуу жетиштүү.'
      },
      {
        q: 'Форум кимдер үчүн уюштурулган жана кимдер катыша алат?',
        a: 'Форум баарына ачык! Ал мектеп окуучулары, студенттер, бүтүрүүчүлөр, жаш адистер, ата-энелер, ошондой эле билим берүү мекемелери жана иш берүүчүлөр үчүн арналган.'
      },
      {
        q: 'Иш-чара кайсы жерде жана кайсы убакта өтөт?',
        a: 'Форум 2026-жылдын 28-ноябрында Бишкек шаарында, «Ырыс Ордо» конгресс-холлунда (Бишкек Арена) саат 14:00дөн 19:00гө чейин өтөт.'
      },
      {
        q: 'Компания же ЖОЖ катары кантип катышса болот?',
        a: 'Сайттагы <a href="#participant" onclick="window.openParticipantModal(); return false;" style="color:#29AAE1; font-weight:700; text-decoration:underline; cursor:pointer;">«Катышуучу болуу»</a> баскычын басып, уюмдун атынан анкетаны толтуруңуз. Оргкомитет 24 сааттын ичинде стенддик орун жана өнөктөштүк шарттары боюнча байланышат.'
      },
      {
        q: 'Коопсуздук жана имаратка кирүү эрежелери кандай?',
        a: 'Мамлекеттик деңгээлдеги коноктордун катышуусуна байланыштуу имаратка кирүүдө инсанды ырастоочу документти жана каттоо QR-кодун көрсөтүү зарыл.'
      },
      {
        q: 'Аймактардан келген катышуучулар үчүн шарттар барбы?',
        a: 'Ооба, 7 облустан уюштурулган топтор жана мектептер үчүн атайын каттоо агымы жана багыттоочу кураторлор каралган.'
      }
    ]
  },
  en: {
    kicker: 'FAQ',
    titleHtml: 'Frequently Asked <span class="heading-muted">Questions</span>',
    titleText: 'Frequently Asked Questions',
    items: [
      {
        q: 'Is admission free and how do I register?',
        a: 'Yes, admission is completely free. Simply click the «Free Registration» button on our website, fill out the form, and download your personal QR code ticket.'
      },
      {
        q: 'Who can participate in the MUUN 2026 Forum?',
        a: 'The event is open to everyone: high school pupils, college and university students, young professionals, parents, educators, and hiring organizations.'
      },
      {
        q: 'Where and when will the forum take place?',
        a: 'The forum will be held on 28 November 2026 in Bishkek at the Yrys Ordo Congress Hall (Bishkek Arena), from 14:00 to 19:00.'
      },
      {
        q: 'How can a company or university become an exhibitor?',
        a: 'Click the <a href="#participant" onclick="window.openParticipantModal(); return false;" style="color:#29AAE1; font-weight:700; text-decoration:underline; cursor:pointer;">«Become a Participant»</a> button and submit the application. Our organizing committee will contact you within 24 hours with exhibition booth details.'
      },
      {
        q: 'What documents are required for entry and security rules?',
        a: 'Due to the official status of the event, please bring a valid personal ID (passport, birth certificate, or student ID) along with your electronic QR code pass.'
      },
      {
        q: 'Are there special arrangements for delegations from regions?',
        a: 'Yes, organized delegations and student groups from all 7 regions of Kyrgyzstan have a dedicated registration stream and support coordinators.'
      }
    ]
  }
};

function renderFaqAccordion(curFaq) {
  return '<div class="muun-faq-layout">' +
    '<div class="muun-faq-accordion" id="muun-faq-list">' +
    curFaq.items.map((item, idx) => 
      '<div class="muun-faq-item" onclick="this.classList.toggle(\'is-open\')">' +
        '<div class="muun-faq-question-row">' +
          '<span class="muun-faq-q-text">' + item.q + '</span>' +
          '<div class="muun-faq-plus-icon">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>' +
          '</div>' +
        '</div>' +
        '<div class="muun-faq-answer-collapse">' +
          '<div class="muun-faq-answer-text">' + item.a + '</div>' +
        '</div>' +
      '</div>'
    ).join('') +
    '</div>' +
    '<div class="muun-faq-eagle-container">' +
      '<img src="/assets/eagle2.png" alt="MUUN 2026 Crystal Eagle" class="muun-faq-eagle-img" />' +
    '</div>' +
  '</div>';
}

function renderThematicZones(curZones) {
  return '<div class="framer-194mue2 muun-thematic-zones-container" data-framer-name="Container">' +
    '<div class="muun-zones-header">' +
      '<h2 class="muun-zones-title">' + (curZones.titleHtml || curZones.title) + '</h2>' +
    '</div>' +
    '<div class="muun-zones-grid">' +
      curZones.zones.map(z => 
        '<div class="muun-zone-card">' +
          '<div class="muun-zone-card-top">' +
            '<span class="muun-zone-num" style="color:' + z.color + ';">' + z.num + '</span>' +
            '<span class="muun-zone-tag">' + z.tag + '</span>' +
          '</div>' +
          '<div class="muun-zone-title">' + z.title + '</div>' +
          '<p class="muun-zone-desc">' + z.desc + '</p>' +
        '</div>'
      ).join('') +
    '</div>' +
  '</div>';
}

const SECTION_HEADINGS = {
  ru: {
    about: {
      kicker: 'О форуме',
      titleHtml: 'Крупнейшее молодёжное событие <span class="heading-muted">в сфере образования Кыргызстана</span>'
    },
    target: {
      kicker: 'Для Кого?',
      titleHtml: 'Кто должен посетить <span class="heading-muted">форум</span>'
    },
    ticker: 'МАКСАТ . УМТУЛУУ . УЧУР . НИЕТ . МАКСАТ . УМТУЛУУ . УЧУР . НИЕТ . МАКСАТ . УМТУЛУУ . УЧУР . НИЕТ . ',
    speakers: {
      kicker: 'Спикеры',
      titleHtml: 'Ведущие эксперты <span class="heading-muted">и лидеры индустрии</span>'
    },
    agenda: {
      kicker: 'Программа',
      titleHtml: 'Что вас ждет <span class="heading-muted">в этот день</span>'
    },
    zones: zonesData.ru,
    faq: faqData.ru,
    partners: {
      kicker: 'Партнеры',
      titleHtml: 'Партнеры МУУН',
      titleText: 'Партнеры МУУН',
      ecoTitleHtml: 'ECO-SYSTEM <span class="heading-muted">партнеры</span>',
      mediaTitleHtml: 'Медиа <span class="heading-muted">партнеры</span>',
      mediaTitleText: 'Медиа партнеры'
    },
    registration: {
      kicker: 'Регистрация',
      titleHtml: 'Зарегистрируйтесь на форум<br><span class="heading-muted">уже сегодня</span>',
      titleText: 'Зарегистрируйтесь на форум уже сегодня'
    },
    targetTabs: {
      t1: 'Школьники',
      d1: 'Познакомьтесь с профессиями будущего, передовыми технологиями и определите свой путь в быстро меняющемся мире. Узнайте о ведущих университетах, колледжах и международных образовательных программах из первых уст от представителей учебных заведений. Примите участие в практических мастер-классах, интерактивных тестах на профориентацию и сделайте осознанный шаг к успешному будущему.',
      t2: 'Студенты',
      d2: 'Найдите актуальные стажировки и реальные вакансии в топовых IT-компаниях, финансовых институтах и ведущих предприятиях страны. Познакомьтесь лично с топ-менеджерами, ключевыми работодателями и потенциальными менторами прямо на площадке форума. Узнайте, какие практические навыки и компетенции наиболее востребованы рынком труда прямо сейчас для стремительного карьерного старта.',
      t3: 'Предприниматели',
      d3: 'Откройте новые стратегические партнерства, инвестиционные возможности и масштабируйте свой бизнес на национальном и международном уровнях. Привлекайте в свои команды самых талантливых, амбициозных молодых специалистов и выпускников ведущих вузов. Внедряйте передовые инновации, технологические тренды и делитесь экспертным опытом с новым поколением лидеров.',
      t4: 'Родители',
      d4: 'Узнайте о реальных тенденциях и долгосрочных перспективах глобального и национального рынка труда на ближайшие десятилетия. Разберитесь в актуальных направлениях высшего и профессионального образования, востребованных специальностях и доступных программах грантов. Получите экспертные рекомендации специалистов и помогите своим детям сделать уверенный, взвешенный и осознанный выбор будущей профессии.',
      t5: 'Госорганы',
      d5: 'Представьте государственные инициативы, молодежные программы и ключевые векторы национального развития широкой аудитории. Налаживайте прямой и открытый диалог с молодым поколением, образовательными учреждениями и лидерами инновационного бизнеса. Формируйте кадровый резерв нового формата и привлекайте перспективных специалистов для решения масштабных государственных задач.',
      t6: 'Международные организации',
      d6: 'Демонстрируйте международные образовательные гранты, глобальные программы развития и межкультурные молодежные инициативы. Укрепляйте институциональное партнерство с государственными структурами, университетами и гражданским обществом Кыргызстана. Содействуйте обмену передовым опытом, внедрению мировых стандартов и устойчивому развитию человеческого капитала в регионе.'
    }
  },
  ky: {
    about: {
      kicker: 'Форум жөнүндө',
      titleHtml: 'Кыргызстандын билим тармагындагы <span class="heading-muted">эң ири жаштар окуясы</span>'
    },
    target: {
      kicker: 'Кимдер үчүн?',
      titleHtml: 'Көргөзмөгө кимдер <span class="heading-muted">келиши керек</span>'
    },
    ticker: 'МАКСАТ . УМТУЛУУ . УЧУР . НИЕТ . МАКСАТ . УМТУЛУУ . УЧУР . НИЕТ . МАКСАТ . УМТУЛУУ . УЧУР . НИЕТ . ',
    speakers: {
      kicker: 'Спикерлер',
      titleHtml: 'Алдыңкы эксперттер <span class="heading-muted">жана тармак лидерлери</span>'
    },
    agenda: {
      kicker: 'Программа',
      titleHtml: 'Бул күнү <span class="heading-muted">сизди эмне күтөт</span>'
    },
    zones: zonesData.ky,
    faq: faqData.ky,
    partners: {
      kicker: 'Өнөктөштөр',
      titleHtml: 'МУУН өнөктөштөрү',
      titleText: 'МУУН өнөктөштөрү',
      ecoTitleHtml: 'ECO-SYSTEM <span class="heading-muted">өнөктөштөр</span>',
      mediaTitleHtml: 'Медиа <span class="heading-muted">өнөктөштөр</span>',
      mediaTitleText: 'Медиа өнөктөштөр'
    },
    registration: {
      kicker: 'Каттоо',
      titleHtml: 'Көргөзмө-форумга <span class="heading-muted">бүгүн катталыңыз</span>',
      titleText: 'Көргөзмө-форумга бүгүн катталыңыз'
    },
    targetTabs: {
      t1: 'Мектеп окуучулары',
      d1: 'Келечек кесиптери, заманбап технологиялар менен таанышып, өзгөрүлүп жаткан дүйнөдө өз жолуңузду тандаңыз. Алдыңкы ЖОЖдор, колледждер жана эл аралык билим берүү программалары тууралуу түздөн-түз өкүлдөрүнөн билиңиз. Практикалык мастер-класстарга катышып, келечекке карата ишенимдүү жана туура кадам таштаңыз.',
      t2: 'Студенттер',
      d2: 'Алдыңкы IT-компаниялардан, банктардан жана өнөр жай ишканаларынан практика жана жумуш орундарын табыңыз. Жетекчилер, иш берүүчүлөр жана насаатчылар менен жеке жолугуп, байланыш түзүңүз. Бүгүнкү күндө эмгек рыногунда кайсы көндүмдөр эң баалуу экенин билип, карьераңызды баштаңыз.',
      t3: 'Ишкерлер',
      d3: 'Жаңы стратегиялык өнөктөштүктөрдү түзүңүз, инвестиция тартыңыз жана бизнесиңизди жаңы деңгээлге чыгарыңыз. Командаңызга эң таланттуу, максаттуу жаш адистерди жана бүтүрүүчүлөрдү тартыңыз. Алдыңкы инновацияларды киргизип, жаңы муун менен тажрыйба бөлүшүңүз.',
      t4: 'Ата-энелер',
      d4: 'Эмгек рыногунун келечектеги багыттары жана негизги тенденциялары менен тереңирээк таанышыңыз. Заманбап билим берүү багыттарын, суроо-талапка ээ кесиптерди жана стипендиялык программаларды изилдеңиз. Балдарыңызга кесип тандоодо туура жана негизделген чечим чыгарууга көмөктөшүңүз.',
      t5: 'Мамлекеттик органдар',
      d5: 'Мамлекеттик демилгелерди, жаштар программаларын жана өлкөнүн өнүгүү багыттарын кеңири аудиторияга сунуштаңыз. Жаш муун, билим берүү мекемелери жана инновациялык бизнес лидерлери менен түз жана ачык диалог түзүңүз. Мамлекеттик деңгээлдеги маанилүү милдеттерди чечүү үчүн келечектүү адистерди тартып, жаңы форматтагы кадрдык резервди түзүңүз.',
      t6: 'Эл аралык уюмдар',
      d6: 'Эл аралык билим берүү гранттарын, глобалдык өнүктүрүү программаларын жана маданияттар аралык жаштар демилгелерин тааныштырыңыз. Кыргызстандын мамлекеттик түзүмдөрү, университеттери жана жарандык коому менен институционалдык өнөктөштүктү бекемдеңиз. Алдыңкы эл аралык тажрыйба алмашууга, дүйнөлүк стандарттарды жайылтууга жана аймактагы адамдык капиталды туруктуу өнүктүрүүгө салым кошуңуз.'
    }
  },
  en: {
    about: {
      kicker: 'About the Forum',
      titleHtml: 'Kyrgyzstan\'s Largest Youth Event <span class="heading-muted">in Education</span>'
    },
    target: {
      kicker: 'For Whom?',
      titleHtml: 'Who Should Attend <span class="heading-muted">the Exhibition-Forum</span>'
    },
    ticker: 'MAKSAT . UMTULUU . UCHUR . NIET . MAKSAT . UMTULUU . UCHUR . NIET . ',
    speakers: {
      kicker: 'Speakers',
      titleHtml: 'Keynote Speakers <span class="heading-muted">and Industry Leaders</span>'
    },
    agenda: {
      kicker: 'Program',
      titleHtml: 'What Awaits You <span class="heading-muted">on This Day</span>'
    },
    zones: zonesData.en,
    faq: faqData.en,
    partners: {
      kicker: 'Partners',
      titleHtml: 'MUUN Partners',
      titleText: 'MUUN Partners',
      ecoTitleHtml: 'ECO-SYSTEM <span class="heading-muted">partners</span>',
      mediaTitleHtml: 'Media <span class="heading-muted">Partners</span>',
      mediaTitleText: 'Media Partners'
    },
    registration: {
      kicker: 'Registration',
      titleHtml: 'Register for the Exhibition-Forum <span class="heading-muted">Today</span>',
      titleText: 'Register for the Exhibition-Forum Today'
    },
    targetTabs: {
      t1: 'School Students',
      d1: 'Explore in-demand professions of the future, emerging technologies, and define your personal roadmap in a fast-changing world. Connect directly with representatives from leading universities, colleges, and international exchange programs. Participate in hands-on workshops and career tests to make an informed choice for your future.',
      t2: 'Students',
      d2: 'Find valuable internships and real employment opportunities at premier IT companies, financial institutions, and leading enterprises. Meet top executives, prominent employers, and potential mentors face-to-face right on the summit floor. Discover which practical skills and core competencies are in highest demand for a rapid career launch.',
      t3: 'Entrepreneurs',
      d3: 'Unlock strategic partnerships, new investment opportunities, and scale your business to regional and global heights. Recruit ambitious, high-potential young talent and graduates directly into your expanding team. Implement cutting-edge innovations and share your entrepreneurial expertise with the next generation.',
      t4: 'Parents',
      d4: 'Understand the evolving dynamics and long-term perspectives of the global and local labor markets. Explore accredited university degrees, high-demand career pathways, and available educational scholarship options. Empower your children to make confident, balanced, and well-informed professional choices.',
      t5: 'Government Agencies',
      d5: 'Present national initiatives, youth development programs, and public sector opportunities directly to an engaged, forward-looking audience. Foster an open dialogue with the next generation of professionals, academic leaders, and innovative business pioneers. Build a forward-thinking talent reserve and attract high-caliber youth to drive impactful public-sector progress.',
      t6: 'International Organizations',
      d6: 'Showcase global educational grants, sustainable development programs, and international youth empowerment initiatives. Strengthen strategic partnerships with national institutions, academic communities, and civil society across Kyrgyzstan. Foster knowledge exchange, promote international standards, and support the long-term growth of human capital throughout the region.'
    }
  }
};

const COUNTRY_CODES = 'AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RU RS RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW'.split(' ');

function escHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function countryChoices(lang) {
  const locale = lang === 'en' ? 'en' : lang === 'ky' ? 'ky' : 'ru';
  const ruNames = new Intl.DisplayNames(['ru'], { type: 'region' });
  const localNames = new Intl.DisplayNames([locale], { type: 'region' });
  const items = COUNTRY_CODES.map((code) => {
    const value = ruNames.of(code);
    const label = localNames.of(code);
    if (!value || value === code || !label || label === code) return null;
    return { value, label };
  }).filter(Boolean);
  const collator = new Intl.Collator(locale === 'ky' ? 'ky' : locale);
  items.sort((a, b) => collator.compare(a.label, b.label));
  return items;
}

function renderRegForm(lang) {
  const S = i18n.strings[lang];
  const countryOptions = countryChoices(lang).map((c) =>
    `<option value="${escHtml(c.value)}">${escHtml(c.label)}</option>`
  ).join('');

  const resetLabel = lang === 'ky'
    ? 'Жаңы өтүнмө толтуруу'
    : lang === 'en'
      ? 'Submit another application'
      : 'Заполнить новую заявку';

  return `
    <div class="muun-reg-card">
      
      <!-- STEP 1: Registration Form -->
      <div id="reg-step-form" style="display:block;">
        <h3 class="muun-form-title">
          ${S['reg.title']}
        </h3>
        <div class="muun-form-lead">
          <p>${S['reg.lead']}</p>
          <p>${S['reg.access']}</p>
          <p class="lead-strong">${S['reg.deadline_line']}</p>
          <p class="lead-strong">${S['reg.hours']}</p>
        </div>

        <!-- Tabs Switcher (Individual vs Group) -->
        <div class="reg-tabs-wrap">
          <button type="button" id="tab-btn-indiv" class="reg-tab-btn active" onclick="window.switchRegTab('indiv')">
            <span>👤</span> <span>${S['reg.tab_indiv']}</span>
          </button>
          <button type="button" id="tab-btn-group" class="reg-tab-btn" onclick="window.switchRegTab('group')">
            <span>🏫</span> <span>${S['reg.tab_group']}</span>
          </button>
        </div>

        <!-- Registration Form -->
        <form id="visitor-reg-form" onsubmit="window.submitVisitorForm(event, this)" style="display:flex; flex-direction:column; gap:18px;">
          <input type="hidden" name="regType" value="individual" id="regTypeInput" />

          <!-- STREAM A: Individual Visitor Form -->
          <div id="stream-indiv-fields" style="display:flex; flex-direction:column; gap:18px;">
            <div>
              <label class="field-label" for="citizenship-select">${S['reg.citizenship']} *</label>
              <select name="citizenship" id="citizenship-select" required class="form-input-dark" onchange="window.switchCitizenship(this.value)">
                <option value="kg" selected>${S['reg.citizen_kg']}</option>
                <option value="foreign">${S['reg.citizen_foreign']}</option>
              </select>
            </div>

            <div id="citizen-kg" data-citizen-panel="kg" style="display:flex; flex-direction:column; gap:18px;">
              <div>
                <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
                  <div>
                    <label class="field-label">${S['reg.last_name']} *</label>
                    <input type="text" name="lastName" required class="form-input-dark" autocomplete="family-name" placeholder="${S['reg.last_name']}" />
                  </div>
                  <div>
                    <label class="field-label">${S['reg.first_name']} *</label>
                    <input type="text" name="firstName" required class="form-input-dark" autocomplete="given-name" placeholder="${S['reg.first_name']}" />
                  </div>
                  <div>
                    <label class="field-label">${S['reg.middle_name']}</label>
                    <input type="text" name="middleName" class="form-input-dark" autocomplete="additional-name" placeholder="${S['reg.middle_name']}" />
                  </div>
                </div>
                <span class="field-note">${S['reg.name_cyr_note']}</span>
              </div>
              <div>
                <label class="field-label">${S['reg.pin']} *</label>
                <input type="text" name="pin" required pattern="[0-9]{14}" maxlength="14" minlength="14" inputmode="numeric" class="form-input-dark" placeholder="${S['reg.pin_ph']}" />
                <span class="field-note">${S['reg.pin_note']}</span>
              </div>
            </div>

            <div id="citizen-foreign" data-citizen-panel="foreign" style="display:none; flex-direction:column; gap:18px;">
              <div>
                <label class="field-label">${S['reg.country']} *</label>
                <select name="country" class="form-input-dark" disabled>
                  <option value="" disabled selected>${S['reg.country_ph']}</option>
                  ${countryOptions}
                </select>
              </div>
              <div>
                <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div>
                    <label class="field-label">${S['reg.last_name']} *</label>
                    <input type="text" name="lastName" class="form-input-dark" autocomplete="family-name" placeholder="${S['reg.last_name']}" disabled />
                  </div>
                  <div>
                    <label class="field-label">${S['reg.first_name']} *</label>
                    <input type="text" name="firstName" class="form-input-dark" autocomplete="given-name" placeholder="${S['reg.first_name']}" disabled />
                  </div>
                </div>
                <span class="field-note">${S['reg.name_lat_note']}</span>
              </div>
              <div>
                <label class="field-label">${S['reg.passport']} *</label>
                <input type="text" name="passport" class="form-input-dark" autocomplete="off" placeholder="AB1234567" disabled />
              </div>
            </div>

            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label class="field-label">${S['reg.phone']} *</label>
                <input type="tel" name="phone" required class="form-input-dark" autocomplete="tel" placeholder="+996 700 123 456" />
              </div>
              <div>
                <label class="field-label">${S['reg.email']} *</label>
                <input type="email" name="email" required class="form-input-dark" autocomplete="email" placeholder="example@gmail.com" />
                <span class="field-note">${S['reg.email_note']}</span>
              </div>
            </div>

            <div>
              <label class="field-label">${S['reg.category_label']} *</label>
              <select name="category" required class="form-input-dark">
                <option value="" disabled selected>${S['reg.category_label']}</option>
                <option value="school">${S['reg.cat_school_v2'] || S['reg.cat_school']}</option>
                <option value="student">${S['reg.cat_student']}</option>
                <option value="young_specialist">${S['reg.cat_young_spec']}</option>
                <option value="moderator">${S['reg.cat_moderator']}</option>
                <option value="speaker">${S['reg.cat_speaker']}</option>
                <option value="exhibitor">${S['reg.cat_exhibitor']}</option>
                <option value="staff">${S['reg.cat_staff']}</option>
                <option value="organizer">${S['reg.cat_organizer']}</option>
                <option value="parent">${S['reg.cat_parent_v2'] || S['reg.cat_parent']}</option>
                <option value="company">${S['reg.cat_company']}</option>
                <option value="media">${S['reg.cat_media']}</option>
                <option value="other">${S['reg.cat_other']}</option>
              </select>
            </div>

            <div>
              <label class="field-label" for="reg-organization">${S['reg.school_org_label']} <span id="reg-org-star">*</span></label>
              <input type="text" id="reg-organization" name="organization" required class="form-input-dark" placeholder="${S['reg.school_org_ph']}" />
            </div>

            <div>
              <label class="field-label" for="reg-resume">${S['reg.resume']}</label>
              <input type="file" id="reg-resume" name="resume" class="form-input-dark" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png" />
              <span class="field-note">${S['reg.resume_note']}</span>
            </div>

            <button type="submit" id="reg-submit-btn-indiv" class="submit-btn">
              ${S['reg.btn_submit']}
            </button>

            <div class="security-memo">
              🔒 ${S['reg.protect']}
            </div>
          </div>

          <!-- STREAM B: Organized Groups Form -->
          <div id="stream-group-fields" style="display:none; flex-direction:column; gap:18px;">
            <div class="group-info-box">
              <h4>${S['reg.group_title']}</h4>
              <p>${S['reg.group_subtitle']}</p>
            </div>

            <div>
              <label class="field-label">${S['reg.group_org']} *</label>
              <input type="text" name="group_org" class="form-input-dark" placeholder="${S['reg.group_org_ph']}" disabled />
            </div>
            <div>
              <label class="field-label">${S['reg.group_leader_name']} *</label>
              <input type="text" name="group_leader_name" class="form-input-dark" autocomplete="name" disabled />
            </div>
            <div>
              <label class="field-label">${S['reg.group_leader_phone']} *</label>
              <input type="tel" name="group_leader_phone" class="form-input-dark" autocomplete="tel" placeholder="+996 700 123 456" disabled />
            </div>
            <div>
              <label class="field-label">${S['reg.group_leader_email']} *</label>
              <input type="email" name="group_leader_email" class="form-input-dark" autocomplete="email" placeholder="school@edu.gov.kg" disabled />
            </div>

            <button type="submit" id="reg-submit-btn-group" class="submit-btn">
              ${S['reg.btn_submit']}
            </button>

            <div class="security-memo">
              🔒 ${S['reg.protect']}
            </div>
          </div>
        </form>
      </div>

      <!-- STEP 2: Pending Approval / Verification Screen -->
      <div id="reg-step-pending" style="display:none; text-align:center; padding:30px 10px;">
        <div class="pending-icon-wrap">
          ✓
        </div>
        <h3 class="pending-title">
          ${S['reg.pending_title']}
        </h3>
        <p class="pending-desc">
          ${S['reg.pending_desc']}
        </p>

        <div class="pending-memo-box">
          <h4>${S['reg.memo_title']}</h4>
          <ul>
            <li>${S['reg.memo_doc']}</li>
            <li>${S['reg.memo_prohibited']}</li>
            <li>${S['reg.memo_arrival']}</li>
          </ul>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; margin-top:20px;">
          <button type="button" onclick="window.resetRegForm()" class="submit-btn" style="width:auto; padding:12px 36px;">
            ${resetLabel}
          </button>
        </div>
      </div>

    </div>
  `;
}

const HOME_SPEAKER_SLOTS = [
  { slot: 'Speaker 01', name: 'Dr. Emma Parker', role: 'Chief AI Scientist', img: 'eTTTIcVnwyKXnDY6kbVhA1AyzQ' },
  { slot: 'Speaker 02', name: 'John Mitchell', role: 'CEO, AI Solutions Corp', img: 'XhuDITv6DpWNuBYIj1HtJ4DvTQw' },
  { slot: 'Speaker 03', name: 'Samantha Hayes', role: 'Senior Data Scientist', img: '86VJMTqMd6VC2SOf3RhzPDR4emk' },
  { slot: 'Speaker 04', name: 'James Turner', role: 'Senior Data Scientist', img: 'TzozA0OcRZ36gzl3GAQAWwujo' },
  { slot: 'Speaker 05', name: 'Laura Chang', role: 'Director of AI Strategy', img: 'FVjwWr85ut7DBy7LiAzsJoNMlLM' },
  { slot: 'Speaker 06', name: 'Michael Anderson', role: 'Chief Technologist', img: 'dlhgx3fMLQZlK7XF8F8pg5OGE' }
];

function renderPartnerCard(partner) {
  const content = partner.darkBadge
    ? `<div class="muun-dark-logo-badge" style="${partner.darkBadge}">
        <img src="${partner.src}" alt="${partner.alt}" class="muun-partner-logo ${partner.logoClass}" loading="lazy" />
      </div>`
    : `<img src="${partner.src}" alt="${partner.alt}" class="muun-partner-logo ${partner.logoClass}" loading="lazy" />`;

  if (partner.url) {
    return `<a href="${partner.url}" target="_blank" rel="noopener noreferrer" class="muun-partner-card" title="${partner.name}">
      ${content}
    </a>`;
  }
  return `<div class="muun-partner-card no-link" title="${partner.name}">
    ${content}
  </div>`;
}

function renderMarqueeTrack(items, animClass) {
  const groupCards = [];
  // Duplicate items twice per group for continuous infinite loop flow
  for (let r = 0; r < 2; r++) {
    for (const item of items) {
      groupCards.push(renderPartnerCard(item));
    }
  }
  const groupHtml = groupCards.join('\n      ');
  return `<div class="muun-marquee-viewport">
    <div class="muun-marquee-track">
      <div class="muun-marquee-group ${animClass}">
        ${groupHtml}
      </div>
      <div class="muun-marquee-group ${animClass}" aria-hidden="true">
        ${groupHtml}
      </div>
    </div>
  </div>`;
}

function getGeneralPartners(lang) {
  return [
    {
      name: 'Kumtor Gold Company',
      alt: lang === 'ky' ? 'Кумтөр Голд Компани' : 'Кумтор Голд Компани',
      url: 'https://www.kumtor.kg/ru/',
      src: '/assets/kumtor.png',
      logoClass: 'kumtor-logo'
    },
    {
      name: lang === 'ky' ? '«Кыргызалтын» ААК' : 'ОАО «Кыргызалтын»',
      alt: 'Кыргызалтын',
      url: 'https://ru.kyrgyzaltyn.kg/',
      src: '/assets/kyrgyzaltyn.png',
      logoClass: 'kyrgyzaltyn-logo'
    },
    {
      name: lang === 'ky' ? '«Кыргызстан аэропорттору» ААК' : 'ОАО «Аэропорты Кыргызстана»',
      alt: 'Аэропорты Кыргызстана',
      url: 'https://www.airport.kg/',
      src: '/assets/aeroporty-kyrgyzstana.png',
      logoClass: 'aeroporty-logo'
    },
    {
      name: lang === 'ky' ? 'Евразиялык патенттик уюм (ЕАПО)' : 'Евразийская патентная организация (ЕАПО)',
      alt: 'EAPO',
      url: 'https://www.eapo.org/',
      src: '/assets/partner-eapo.png',
      logoClass: 'eapo-logo'
    },
    {
      name: 'TIKA',
      alt: 'TIKA',
      url: 'https://tika.gov.tr/en/office/kazakhstan-astana-program-coordination-office/',
      src: '/assets/partner-tika.png',
      logoClass: 'tika-logo'
    }
  ];
}

function getEcoPartners(lang) {
  const mdkSrc = lang === 'ky' ? '/assets/partner-mdk-ky.png' : '/assets/partner-mdk-ru.png';
  const mdkAlt = lang === 'ky'
    ? 'Кыргызстан жаштар кыймылы'
    : lang === 'en'
      ? 'Youth Movement of Kyrgyzstan'
      : 'Молодежное движение Кыргызстана';

  return [
    {
      name: 'China-Eurasian Business Council (CEBC)',
      alt: 'CEBC',
      url: 'https://cebc-tau.vercel.app/',
      src: '/assets/partner-cebc.png',
      logoClass: 'eco-cebc'
    },
    {
      name: 'Codify',
      alt: 'Codify',
      url: 'https://codifylab.com/',
      src: '/assets/partner-codify.png',
      logoClass: 'eco-codify'
    },
    {
      name: 'ProKG',
      alt: 'ProKG',
      url: 'https://prokg.net/',
      src: '/assets/partner-prokg.png',
      logoClass: 'eco-prokg'
    },
    {
      name: lang === 'ky' ? 'Жогорку технологиялар паркы' : 'High Technology Park',
      alt: 'High Technology Park',
      url: 'https://htp.kg/ru/',
      src: '/assets/partner-htp.png',
      logoClass: 'eco-htp'
    },
    {
      name: mdkAlt,
      alt: mdkAlt,
      url: '',
      src: mdkSrc,
      logoClass: 'eco-mdk'
    },
    {
      name: 'Contest',
      alt: 'Contest',
      url: 'https://contest.kg/',
      src: '/assets/partner-contest.png',
      logoClass: 'eco-contest'
    }
  ];
}

function getMediaPartners(lang) {
  return [
    {
      name: 'ЭлТР (dntp)',
      alt: 'ЭлТР',
      url: '',
      src: '/assets/partner-eltr.png',
      logoClass: 'media-logo-eltr',
      darkBadge: 'background:#003750;border-radius:16px;padding:8px 12px;width:100%;height:100%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;'
    },
    {
      name: 'Регион ТВ',
      alt: 'Регион ТВ',
      url: 'https://region.kg/category/stati',
      src: '/assets/partner-regiontv.png',
      logoClass: 'media-logo-region'
    },
    {
      name: '7 Канал',
      alt: '7 Канал',
      url: 'https://7tv.kg/',
      src: '/assets/partner-channel7.png',
      logoClass: 'media-logo-ch7'
    },
    {
      name: 'Кыргыз радиосу',
      alt: 'Кыргыз радиосу',
      url: '',
      src: '/assets/partner-kyrgyz-radio.png',
      logoClass: 'media-logo-radio',
      darkBadge: 'background:#0c172d;border-radius:16px;padding:8px 12px;width:100%;height:100%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;'
    },
    {
      name: 'Мин Кыял FM',
      alt: 'Мин Кыял FM',
      url: '',
      src: '/assets/partner-minkyal.png',
      logoClass: 'media-logo-minkyal',
      darkBadge: 'background:#0c172d;border-radius:16px;padding:8px 12px;width:100%;height:100%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;'
    },
    {
      name: 'Ала-Тоо 24',
      alt: 'Ала-Тоо 24',
      url: '',
      src: '/assets/partner-alatoo24.png',
      logoClass: 'media-logo-alatoo'
    },
    {
      name: 'УТРК',
      alt: 'УТРК',
      url: 'https://utrk.kg/',
      src: '/assets/partner-utrk.png',
      logoClass: 'media-logo-utrk'
    },
    {
      name: 'Кабар',
      alt: 'КНИА «Кабар»',
      url: 'https://ru.kabar.kg/',
      src: '/assets/partner-kabar.png',
      logoClass: 'media-logo-kabar'
    }
  ];
}

function renderPartnersSection(partnersMeta, lang) {
  const generalPartners = getGeneralPartners(lang);
  const ecoPartners = getEcoPartners(lang);
  const mediaPartners = getMediaPartners(lang);

  const generalTrackHtml = renderMarqueeTrack(generalPartners, 'muun-marquee-general');
  const ecoTrackHtml = renderMarqueeTrack(ecoPartners, 'muun-marquee-eco');
  const mediaTrackHtml = renderMarqueeTrack(mediaPartners, 'muun-marquee-media');

  return `
    <div class="muun-partners-category muun-general-partners">
      ${generalTrackHtml}
    </div>
    <div class="muun-partners-category muun-eco-partners">
      <h2 class="muun-eco-partners-title">${partnersMeta.ecoTitleHtml}</h2>
      ${ecoTrackHtml}
    </div>
    <div class="muun-partners-category muun-media-partners">
      <h2 class="muun-eco-partners-title">${partnersMeta.mediaTitleHtml}</h2>
      ${mediaTrackHtml}
    </div>
  `;
}

function homeSpeakerPeople(lang) {
  const people = {
    ru: [
      { name: 'Касымалиев Адылбек Алешович', role: 'Председатель Кабинета Министров Кыргызской Республики – Руководитель Администрации Президента Кыргызской Республики', photo: '/assets/speaker-kasymaliev.png', focus: 'center 15%' },
      { name: 'Исаматова Гульзат Тыныбековна', role: 'Министр науки, высшего образования и инноваций Кыргызской Республики', photo: '/assets/speaker-isamatova.jpg', focus: '30% 20%' },
      { name: 'Орунтаев Нурдан Кемелович', role: 'Министр строительства, архитектуры и жилищно-коммунального хозяйства Кыргызской Республики', photo: '/assets/speaker-oruntaev.jpg', focus: 'center 18%' },
      { name: 'Рысбеков Алтынбек Дурусбекович', role: 'Министр энергетики Кыргызской Республики', photo: '/assets/speaker-rysbekov.jpg', focus: 'center center' },
      { name: 'Эльвира Сурабалдиева', role: 'Депутат Жогорку Кенеша Кыргызской Республики', photo: '/assets/speaker-surabaldieva.jpg', focus: 'center center' },
      { name: 'Эсеналиева Назира Солтонбековна', role: 'Ректор Международного университета «Ала-Тоо», кандидат экономических наук', photo: '/assets/speaker-esenalieva.jpg', focus: 'center center' }
    ],
    ky: [
      { name: 'Касымалиев Адылбек Алешович', role: 'Кыргыз Республикасынын Министрлер Кабинетинин Төрагасы – Кыргыз Республикасынын Президентинин Администрациясынын жетекчиси', photo: '/assets/speaker-kasymaliev.png', focus: 'center 15%' },
      { name: 'Исаматова Гульзат Тыныбековна', role: 'Кыргыз Республикасынын илим, жогорку билим берүү жана инновациялар министри', photo: '/assets/speaker-isamatova.jpg', focus: '30% 20%' },
      { name: 'Орунтаев Нурдан Кемелович', role: 'Кыргыз Республикасынын курулуш, архитектура жана турак жай-коммуналдык чарба министри', photo: '/assets/speaker-oruntaev.jpg', focus: 'center 18%' },
      { name: 'Рысбеков Алтынбек Дурусбекович', role: 'Кыргыз Республикасынын энергетика министри', photo: '/assets/speaker-rysbekov.jpg', focus: 'center center' },
      { name: 'Эльвира Сурабалдиева', role: 'Кыргыз Республикасынын Жогорку Кеңешинин депутаты', photo: '/assets/speaker-surabaldieva.jpg', focus: 'center center' },
      { name: 'Эсеналиева Назира Солтонбековна', role: '«Ала-Тоо» Эл аралык университетинин ректору, экономика илимдеринин кандидаты', photo: '/assets/speaker-esenalieva.jpg', focus: 'center center' }
    ],
    en: [
      { name: 'Adylbek Aleshovich Kasymaliev', role: 'Chairman of the Cabinet of Ministers of the Kyrgyz Republic – Head of the Presidential Administration of the Kyrgyz Republic', photo: '/assets/speaker-kasymaliev.png', focus: 'center 15%' },
      { name: 'Gulzat Tynybekovna Isamatova', role: 'Minister of Science, Higher Education and Innovation of the Kyrgyz Republic', photo: '/assets/speaker-isamatova.jpg', focus: '30% 20%' },
      { name: 'Nurdan Kemelovich Oruntaev', role: 'Minister of Construction, Architecture and Housing and Communal Services of the Kyrgyz Republic', photo: '/assets/speaker-oruntaev.jpg', focus: 'center 18%' },
      { name: 'Altynbek Durusbekovich Rysbekov', role: 'Minister of Energy of the Kyrgyz Republic', photo: '/assets/speaker-rysbekov.jpg', focus: 'center center' },
      { name: 'Elvira Surabaldieva', role: 'Member of the Jogorku Kenesh of the Kyrgyz Republic', photo: '/assets/speaker-surabaldieva.jpg', focus: 'center center' },
      { name: 'Nazira Soltonbekovna Esenalieva', role: 'Rector of Ala-Too International University, PhD in Economics', photo: '/assets/speaker-esenalieva.jpg', focus: 'center center' }
    ]
  };
  return people[lang];
}

function patchHomeSpeakers(html, people) {
  HOME_SPEAKER_SLOTS.forEach((slot, i) => {
    const person = people[i];
    const marker = `data-framer-name="${slot.slot}"`;
    let result = '';
    let cursor = 0;
    let from = 0;
    while ((from = html.indexOf(marker, from)) !== -1) {
      const next = ['Speaker 01', 'Speaker 02', 'Speaker 03', 'Speaker 04', 'Speaker 05', 'Speaker 06']
        .filter(name => name !== slot.slot)
        .map(name => html.indexOf(`data-framer-name="${name}"`, from + marker.length))
        .filter(index => index !== -1);
      const end = next.length ? Math.min(...next) : html.length;
      let chunk = html.slice(from, end);
      chunk = chunk.replaceAll(slot.name, person.name);
      chunk = chunk.replaceAll(slot.role, person.role);
      chunk = chunk.split(`https://framerusercontent.com/images/${slot.img}.png`).join(person.photo);
      chunk = chunk.replace(/<img\b[^>]*\/assets\/speaker-[^>]*>/g, (tag) => (
        tag
          .replace(/\s(?:srcset|sizes)="[^"]*"/gi, '')
          .replace(/(\ssrc="\/assets\/speaker-[^"?]+)\?[^"]*"/, '$1"')
      ));
      result += html.slice(cursor, from) + chunk;
      cursor = end;
      from = end;
    }
    html = result + html.slice(cursor);
  });
  return patchGuestCards(html, people);
}

function patchGuestCards(html, people) {
  if (!people?.length) return html;
  const marker = 'data-framer-name="Guest Card"';
  let result = '';
  let cursor = 0;
  let from = 0;
  let personIndex = 0;
  let lastOriginal = null;
  while ((from = html.indexOf(marker, from)) !== -1) {
    const next = html.indexOf(marker, from + marker.length);
    const end = next === -1 ? html.length : next;
    let chunk = html.slice(from, end);
    const original = (chunk.match(/<h4\b[^>]*>([^<]*)<\/h4>/) || [])[1] || '';
    if (lastOriginal !== null && original !== lastOriginal) personIndex += 1;
    lastOriginal = original;
    const person = people[personIndex % people.length];
    chunk = chunk.replace(/(<h4\b[^>]*>)[^<]*(<\/h4>)/, `$1${person.name}$2`);
    chunk = chunk.replace(/(<p\b[^>]*>)[^<]*(<\/p>)/, `$1${person.role}$2`);
    chunk = chunk.replace(/<img\b[^>]*>/i, (tag) => (
      tag
        .replace(/\s(?:srcset|sizes)="[^"]*"/gi, '')
        .replace(/\ssrc="[^"]*"/i, ` src="${person.photo}"`)
        .replace(/\salt="[^"]*"/i, ` alt="${person.name.replace(/"/g, '')}"`)
    ));
    result += html.slice(cursor, from) + chunk;
    cursor = end;
    from = end;
  }
  return result + html.slice(cursor);
}

function replaceMarkedHeadings(html, pairs) {
  return html.replace(/<h2\b[^>]*>[\s\S]*?<\/h2>/gi, (h2) => {
    const hit = pairs.find((pair) => h2.includes(pair.marker));
    if (!hit) return h2;
    return h2.replace(/>([\s\S]*)<\/h2>$/, `>${hit.html}</h2>`);
  });
}

const targetIcons = {
  school: `<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
    <line x1="2" y1="12" x2="22" y2="12"></line>
  </svg>`,
  students: `<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 7l-10-4-10 4 10 4 10-4z"></path>
    <path d="M6 9.5v3"></path>
    <circle cx="12" cy="13" r="3"></circle>
    <path d="M6 21v-1a6 6 0 0 1 12 0v1"></path>
  </svg>`,
  entrepreneurs: `<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
    <rect width="20" height="12" x="2" y="6" rx="2"></rect>
    <circle cx="12" cy="12" r="2.5"></circle>
    <path d="M6 12h.01M18 12h.01"></path>
  </svg>`,
  parents: `<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>`,
  government: `<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 21h18"/>
    <path d="M4 18h16"/>
    <path d="M2 10h20"/>
    <path d="M12 3 2 10h20z"/>
    <path d="M6 10v8"/>
    <path d="M12 10v8"/>
    <path d="M18 10v8"/>
  </svg>`,
  international: `<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9.5"/>
    <ellipse cx="12" cy="12" rx="4.5" ry="9.5"/>
    <path d="M2.5 12h19"/>
    <path d="M4.5 7h15"/>
    <path d="M4.5 17h15"/>
  </svg>`
};

function getTargetAudienceData(lang) {
  const tabs = SECTION_HEADINGS[lang].targetTabs;
  return [
    { id: 'school', title: tabs.t1, desc: tabs.d1 },
    { id: 'students', title: tabs.t2, desc: tabs.d2 },
    { id: 'entrepreneurs', title: tabs.t3, desc: tabs.d3 },
    { id: 'parents', title: tabs.t4, desc: tabs.d4 },
    { id: 'government', title: tabs.t5, desc: tabs.d5 },
    { id: 'international', title: tabs.t6, desc: tabs.d6 }
  ];
}

function renderTargetTabsHtml(items) {
  const cardsHtml = items.map((item, idx) => {
    const isActive = idx === 0;
    const variantClass = isActive ? 'framer-v-1wn31oz is-active' : 'framer-v-6klljf';
    const variantName = isActive ? 'Clicked' : 'Square';
    const iconSvg = targetIcons[item.id] || '';
    const cubeDisplay = isActive ? '' : 'style="display:none;"';

    return `<div class="framer-NWfWD framer-VxbzB framer-6klljf ${variantClass} muun-framer-card" data-target-index="${idx}" data-border="true" data-framer-name="${variantName}" data-highlight="true" tabindex="0" role="button" aria-pressed="${isActive ? 'true' : 'false'}">
      <div class="framer-vdq0vg" data-framer-name="Cube" ${cubeDisplay}>
        <div style="position:absolute;border-radius:inherit;top:0;right:0;bottom:0;left:0" data-framer-background-image-wrapper="true">
          <img decoding="async" width="855" height="855" src="https://framerusercontent.com/images/wX62SMRMN1v1X6SFoJaoNdwo.webp?width=855&amp;height=855" alt="" style="display:block;width:100%;height:100%;border-radius:inherit;object-position:center;object-fit:cover" />
        </div>
      </div>
      <div class="framer-dr18ap"></div>
      <div class="framer-12hi9of-container">
        ${iconSvg}
      </div>
      <div class="framer-31nozc" data-framer-name="${escHtml(item.title)}" data-framer-component-type="RichTextContainer">
        <h4 class="framer-text framer-styles-preset-flhrrz" data-styles-preset="dgjyWRW1V">${escHtml(item.title)}</h4>
      </div>
    </div>`;
  }).join('');

  const first = items[0] || {};
  return `<div class="framer-G6Ndb framer-mxN0T framer-1mpnhrg framer-v-1mpnhrg muun-for-whom-container" data-framer-name="Desktop 1" style="width:100%">
    <div class="framer-1crz8ec muun-cards-track" data-framer-name="Images">
      ${cardsHtml}
    </div>

    <div class="framer-296zja muun-desc-outer" data-framer-name="Content">
      <div class="muun-desc-card" data-framer-name="Text">
        <p class="framer-text framer-styles-preset-dsr0r muun-desc-text" data-styles-preset="Erxl6HnxD" style="--framer-text-color:rgb(237, 237, 237);">${escHtml(first.desc || '')}</p>
      </div>
    </div>
  </div>`;
}

for (const lang of ['ru', 'ky', 'en']) {
  let finalHtml = rawHtml;

  const t = i18n.strings[lang] || {};
  const m = i18n.locales[lang]?.meta || {};
  const loc = localizedContent[lang];
  const curAbout = aboutData[lang];
  const hd = SECTION_HEADINGS[lang];
  const targetAudienceItems = getTargetAudienceData(lang);
  const targetTabsHtml = renderTargetTabsHtml(targetAudienceItems);

  const metaTitle = m.title || (lang === 'ky' ? '«Жаратман МУУН» - Улуттук жаштар форуму' : lang === 'en' ? 'Zharatman MUUN - National Youth Forum' : 'Жаратман МУУН - Национальный молодежный форум');

  // 1. String replacements in raw HTML
  const spTxt = lang === 'ky' ? 'Спикерлер' : lang === 'en' ? 'Speakers' : 'Спикеры';
  const saTxt = lang === 'ky' ? 'Баарын көрүү' : lang === 'en' ? 'See All' : 'Смотреть всех';

  const replacements = [
    ['<html lang="en-IN">', `<html lang="${lang === 'en' ? 'en' : lang === 'ky' ? 'ky' : 'ru'}">`],
    ['<title>Eventis - Free Event and Conference Template</title>', `<title>${metaTitle}</title>`],
    ['Eventis - Free Event and Conference Template', metaTitle],
    ['Join Eventis, the premier technology and IT summit, bringing together developers, designers, entrepreneurs, and investors to explore the latest in software development, AI innovations, and startup growth.', m.description || loc.subtitle.replace('<br>', ' ')],
    ['https://eventis.framer.website/', 'https://muun.kg/'],
    ['Marina Bay, Singapore', loc.location],
    ['https://framerusercontent.com/images/AxQMXkb9SNyxDMp63XvKlzyGFo.png', '/favicon.png?v=11'],
    ['About Aicron', curAbout.kicker],
    ['Innovation . Networking . Marketing . Learning . ', hd.ticker],
    ['https://framerusercontent.com/images/1BHox7UUEVMJHfAPN4qPh5r4o.svg', '/assets/logo-footer.png'],
    ['All copyrights @eventis', '<a href="#" style="color:inherit;text-decoration:none;">' + (lang === 'ky' ? 'Купуялуулук саясаты' : lang === 'en' ? 'Privacy Policy' : 'Политика конфиденциальности') + '</a>'],
    ['Terms and Conditions', lang === 'ky' ? 'Оферта келишими' : lang === 'en' ? 'Terms of Service' : 'Договор оферты'],
    ['href="./terms-and-conditions"', 'href="#"'],
    ['>Social </p>', '></p>'],
    ['https://www.facebook.com', SOCIAL.facebook],
    ['https://www.instagram.com/jitu.ux/', SOCIAL.instagram],
    ['https://www.linkedin.com/in/jitendra-raut/', SOCIAL.threads],
    ['https://x.com/jituux', 'javascript:void(0)'],
    ['<div class="framer-1q9j6t2-container"><!--$--><div style="display:contents"></div><!--/$--></div>', '<div class="framer-1q9j6t2-container" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></div>'],
    ['<div class="framer-meo1sm-container"><!--$--><div style="display:contents"></div><!--/$--></div>', '<div class="framer-meo1sm-container" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></div>'],
    ['<div class="framer-mwybfh-container"><!--$--><div style="display:contents"></div><!--/$--></div>', `<div class="framer-mwybfh-container" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${threadsIconSvg}</div>`],
    ['<div class="framer-1p56u4x-container"><!--$--><div style="display:contents"></div><!--/$--></div>', '<div class="framer-1p56u4x-container" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></div>'],
    ['Designed By Jitu Raut  @fremix.design', ''],
    ['mask:linear-gradient(353deg, rgba(0,0,0,0) 15%, rgba(0, 0, 0, 0.49) 32%, rgba(0,0,0,1) 75%) add;-webkit-mask:linear-gradient(353deg, rgba(0,0,0,0) 15%, rgba(0, 0, 0, 0.49) 32%, rgba(0,0,0,1) 75%) add', ''],
    ['<footer class="framer-RYOK6', '<footer id="contact" class="framer-RYOK6'],
    ['https://framerusercontent.com/images/tJ1jqpEOBL9Nna5facx9Yh1rSA.svg', '/assets/logo-header.png'],
    ['Nexgen AI Summit for all the', loc.title.replace('<br>', ' ')],
    ['14th October 2025', loc.date],

    // Grayscale removal on SSR figures
    ['filter:grayscale(1);-webkit-filter:grayscale(1);', 'filter:none;-webkit-filter:none;'],

    // Bottom bar: remove 20+ and translate
    ['20+ Speakers', spTxt],
    ['200+ Speakers', spTxt],
    ['Смотреть все', saTxt],
    ['See All', saTxt],
    ['See all', saTxt],

    // Specific nav/footer text replacements
    ['>Speaker</p>', `>${spTxt}</p>`],
    ['>Speakers</p>', `>${spTxt}</p>`],
    ['>Agenda</p>', `>${t['nav.program'] || 'Программа'}</p>`],
    ['>Venue</p>', `>${t['nav.venue'] || 'Площадка'}</p>`],
    ['>Contact</p>', `>${t['nav.contact'] || 'Контакты'}</p>`],
    ['>Get Ticket</p>', `>${t['hero.cta_register'] || 'Регистрация'}</p>`],
    ['>Get Tickets</p>', `>${t['hero.cta_register'] || 'Регистрация'}</p>`],

    // Partners section translations & structure
    ['>Sponsorship</h4>', `>${hd.partners.kicker}</h4>`],
    ['Sponsorship', hd.partners.kicker],
    ['<span>Meet</span> <span>out</span> <span>sponsors</span> <span>who</span> <span>help</span> <span>to</span> <span>bring</span> <span></span><span class="framer-text"><span>this</span> <span>think</span> <span>live</span></span>', hd.partners.titleHtml],
    ['Meet out sponsors who help to bring this think live', hd.partners.titleText],
    ['>Questions</h4>', `>${hd.faq.kicker}</h4>`],
    ['Questions', hd.faq.kicker],
    ['>Our Host</h4>', `>${hd.zones.title}</h4>`],
    ['Our Host', hd.zones.title],
    ['All the Important Details Before Attending AIcron Tech Summit', hd.faq.titleText],
    ['Meet Our Hosts: The Visionaries Behind AIcron Tech Summit', hd.zones.title],

    // Registration section replacements
    ['>Registration</h4>', `>${hd.registration.kicker}</h4>`],
    ['Registration</h4>', `${hd.registration.kicker}</h4>`],
    ['Secure Your Spot at AIcron Tech Summit Today!', hd.registration.titleText],
    ['Secure Your Spot at Alcron Tech Summit Today!', hd.registration.titleText],
    ['Secure Your Spot Today!', hd.registration.titleText],

    // About & For Whom kicker replacements
    ['>About Aicron</h4>', `>${curAbout.kicker}</h4>`],
    ['About Aicron</h4>', `${curAbout.kicker}</h4>`],
    ['>For Whom?</h4>', `>${hd.target.kicker}</h4>`],
    ['For Whom?</h4>', `${hd.target.kicker}</h4>`],

    // Ticket video autoplay & loop
    ['preload="none" muted playsinline', 'autoplay loop muted playsinline preload="auto"']
  ];

  for (const [en, localized] of replacements) {
    if (typeof localized === 'string') {
      finalHtml = finalHtml.split(en).join(localized);
    }
  }

  // Pre-render Partners section: general partners, then ECO-SYSTEM partners, then Media partners
  const partnersGridInnerHtml = renderPartnersSection(hd.partners, lang);
  const partnersGridHtml = `<div class="framer-ff8lq4" data-framer-name="Partners">${partnersGridInnerHtml}</div>`;

  const spGridStart = finalHtml.indexOf('<div class="framer-ff8lq4"');
  if (spGridStart !== -1) {
    const spGridClose = finalHtml.indexOf('</div></div></section>', spGridStart);
    if (spGridClose !== -1) {
      finalHtml = finalHtml.slice(0, spGridStart) + partnersGridHtml + finalHtml.slice(spGridClose);
    }
  }

  // Pre-render Partners section Title (h2)
  const ostf7sStart = finalHtml.indexOf('class="framer-ostf7s"');
  if (ostf7sStart !== -1) {
    const h2Tag = '<h2 class="framer-text framer-styles-preset-y2rde0" data-styles-preset="ukkzEhTCI">';
    const h2Start = finalHtml.indexOf(h2Tag, ostf7sStart);
    if (h2Start !== -1) {
      const h2End = finalHtml.indexOf('</h2>', h2Start);
      if (h2End !== -1) {
        finalHtml = finalHtml.slice(0, h2Start + h2Tag.length) + hd.partners.titleHtml + finalHtml.slice(h2End);
      }
    }
  }

  
  const curFaq = faqData[lang];
  const curZones = zonesData[lang];
  const faqListHtml = renderFaqAccordion(curFaq);
  const thematicZonesHtml = renderThematicZones(curZones);
  const regFormHtml = renderRegForm(lang);

  // Pre-render FAQ Title (h2) in .framer-19oyny3
  const faqH2Container = finalHtml.indexOf('class="framer-19oyny3"');
  if (faqH2Container !== -1) {
    const h2Tag = '<h2 class="framer-text framer-styles-preset-y2rde0" data-styles-preset="ukkzEhTCI">';
    const h2Start = finalHtml.indexOf(h2Tag, faqH2Container);
    if (h2Start !== -1) {
      const h2End = finalHtml.indexOf('</h2>', h2Start);
      if (h2End !== -1) {
        finalHtml = finalHtml.slice(0, h2Start + h2Tag.length) + hd.faq.titleHtml + finalHtml.slice(h2End);
      }
    }
  }

  // Pre-render FAQ accordion list in .framer-rs1smy
  const rs1smyStart = finalHtml.indexOf('<div class="framer-rs1smy"');
  if (rs1smyStart !== -1) {
    const faqSecEnd = finalHtml.indexOf('</section>', rs1smyStart);
    if (faqSecEnd !== -1) {
      finalHtml = finalHtml.slice(0, rs1smyStart) +
        '<div class="framer-rs1smy" data-framer-name="Content">' +
        faqListHtml +
        '</div></div></section>' +
        finalHtml.slice(faqSecEnd + 10);
    }
  }

  // Pre-render Thematic Zones replacing Host section (framer-19yv87c)
  const hostSecStart = finalHtml.indexOf('<section class="framer-19yv87c" data-framer-name="Host"');
  if (hostSecStart !== -1) {
    const hostSecEnd = finalHtml.indexOf('</section>', hostSecStart);
    if (hostSecEnd !== -1) {
      finalHtml = finalHtml.slice(0, hostSecStart) +
        '<section class="framer-19yv87c muun-thematic-zones-section" data-framer-name="Host" id="venue">' +
        thematicZonesHtml +
        '</section>' +
        finalHtml.slice(hostSecEnd + 10);
    }
  }

  // Pre-render Registration section Title & Kicker
  const regSecStart = finalHtml.indexOf('data-framer-name="Registration"');
  if (regSecStart !== -1) {
    const regKickerStart = finalHtml.indexOf('class="framer-17e9nqz-container"', regSecStart);
    if (regKickerStart !== -1) {
      const h4Start = finalHtml.indexOf('<h4', regKickerStart);
      if (h4Start !== -1) {
        const h4Close = finalHtml.indexOf('>', h4Start) + 1;
        const h4End = finalHtml.indexOf('</h4>', h4Close);
        if (h4End !== -1) {
          finalHtml = finalHtml.slice(0, h4Close) + hd.registration.kicker + finalHtml.slice(h4End);
        }
      }
    }
    const regTitleStart = finalHtml.indexOf('class="framer-1npbtm4"', regSecStart);
    if (regTitleStart !== -1) {
      const h2Start = finalHtml.indexOf('<h2', regTitleStart);
      if (h2Start !== -1) {
        const h2Close = finalHtml.indexOf('>', h2Start) + 1;
        const h2End = finalHtml.indexOf('</h2>', h2Close);
        if (h2End !== -1) {
          finalHtml = finalHtml.slice(0, h2Close) + hd.registration.titleHtml + finalHtml.slice(h2End);
        }
      }
    }

    // Pre-render registration form in .framer-n7lw51 replacing 3 pricing tiers
    const regCardsStart = finalHtml.indexOf('<div class="framer-n7lw51"', regSecStart);
    if (regCardsStart !== -1) {
      const regSecEnd = finalHtml.indexOf('</section>', regCardsStart);
      if (regSecEnd !== -1) {
        finalHtml = finalHtml.slice(0, regCardsStart) +
          '<div class="framer-n7lw51" data-framer-name="Cards">' +
          regFormHtml +
          '</div></div></div></section>' +
          finalHtml.slice(regSecEnd + 10);
      }
    }
  }

  // Pre-render "For Whom?" 6 category cards and description box
  const targetSecStart = finalHtml.indexOf('data-framer-name="For Whom?"');
  if (targetSecStart !== -1) {
    const targetContentStart = finalHtml.indexOf('<div class="framer-mu05uw"', targetSecStart);
    if (targetContentStart !== -1) {
      const targetTickerStart = finalHtml.indexOf('<div class="framer-4y5hkw"', targetContentStart);
      if (targetTickerStart !== -1) {
        finalHtml = finalHtml.slice(0, targetContentStart) +
          '<div class="framer-mu05uw" data-framer-name="Content">' +
          targetTabsHtml +
          '</div></div></div>' +
          finalHtml.slice(targetTickerStart);
      }
    }
  }

  // Pre-render all 6 header nav items with exact Framer DOM structure (О форуме removed)
  const navItemsList = [
    { href: `/${lang}/speakers`, label: t['nav.speakers'] || t['nav.participants'] || 'Спикеры' },
    { href: `/${lang}/program`, label: t['nav.program'] || 'Программа' },
    { href: `/${lang}/venue`, label: t['nav.venue'] || 'Площадка' },
    { href: `/${lang}/news`, label: t['nav.news'] || 'Новости' },
    { href: `/${lang}/press`, label: t['nav.press'] || 'Пресс-центр' },
    { href: `/${lang}/contacts`, label: t['nav.contact'] || 'Контакты' }
  ];

  const fullNavHtml = `<nav class="framer-1s42b8a" data-framer-name="Links">${navItemsList.map(item => `
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

  const navStart = finalHtml.indexOf('<nav class="framer-1s42b8a"');
  if (navStart !== -1) {
    const navEnd = finalHtml.indexOf('</nav>', navStart);
    if (navEnd !== -1) {
      finalHtml = finalHtml.slice(0, navStart) + fullNavHtml + finalHtml.slice(navEnd + 6);
    }
  }

  // 2. Custom About block HTML template
  const customAboutHtml = `
<div class="muun-custom-about">
  <div class="muun-stats-grid">
    ${curAbout.stats.map(s => `
      <div class="muun-stat-card">
        <div class="muun-stat-num">
          <span class="muun-counter" data-target="${s.target}">0</span><span class="suffix">${s.suffix}</span>
        </div>
        <p class="muun-stat-desc">${s.desc}</p>
      </div>
    `).join('')}
  </div>
  <div class="muun-pres-card">
    <div class="muun-pres-quote-side">
      <svg class="muun-quote-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
      </svg>
      <blockquote class="muun-pres-quote">
        ${curAbout.pres.quote}
      </blockquote>
      <div class="muun-pres-author">
        <div class="muun-pres-name">— ${curAbout.pres.name}</div>
        <div class="muun-pres-kicker">${curAbout.pres.kicker}</div>
      </div>
    </div>
    <div class="muun-pres-photo-side">
      <img src="/assets/president.png" alt="${curAbout.pres.name}" class="muun-pres-photo" />
    </div>
  </div>
  <section class="muun-regions" id="regions">
    ${kgMapSvgFor(lang)}
  </section>
</div>
`;

  // 3. Styling & Client Hydration Script
  const styleAndScripts = `
    ${heroMarkScript}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      :root {
        --token-440020f8-b9e1-49ea-9687-1ea12b43b3de: #061524 !important;
        --token-f1e2c775-aff6-494c-a201-646657d66935: #29AAE1 !important;
        --token-f1c81b52-2a59-4da2-a47f-3f4bfb2f2b58: #0A3251 !important;
        --token-dc631f8a-4140-47df-884a-ed562fa8ef1a: #29AAE1 !important;
      }
      
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background-color: #061524 !important;
      }
      ${heroMarkCss}
      ${footerSocialCss}
      ${mobileNavCss}
      ${programCss}

      #main, .framer-lR50G, .framer-128530 {
        margin: 0 !important;
        padding-top: 0 !important;
        background-color: #061524 !important;
      }

      /* Hero Section */
      header.framer-168cvbo {
        margin: 0 !important;
        padding: 0 20px !important;
        height: 100vh !important;
        min-height: 100vh !important;
        box-sizing: border-box !important;
        background-color: #061524 !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        overflow: hidden !important;
        position: relative !important;
      }

      .framer-1ygh3u6-container {
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }

      .framer-kha8to, .framer-f0om72, .framer-1pvbk64 { position: static !important; }

      /* Hide unwanted elements: cubes, video, templates */
      figure:has(img[src*="gallery-registration"]),
      figure:has(img[src*="arena"]),
      figure:has(img[src*="gallery-exhibition"]),
      div[data-framer-name="Video"],
      .framer-video,
      .framer-k6an6u,
      .framer-1cgsc4r,
      header.framer-168cvbo figure:not([data-framer-name="Event Name"]),
      header.framer-168cvbo .framer-1rid37y,
      header.framer-168cvbo .framer-8bnuea,
      header.framer-168cvbo .framer-okpf4l,
      header.framer-168cvbo [data-framer-name*="Cube"],
      header.framer-168cvbo [data-framer-name*="Triangle"],
      .framer-at8k3b,
      .framer-1wtuexu,
      .framer-udrc98-container,
      .framer-1joz9r6,
      .framer-nb40pn,
      .framer-18v3bwc,
      .framer-fzg97m,
      #__framer-badge-container,
      a[href*="framer.com"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /* Header logo on main site: slightly larger and shifted right */
      nav img[src*="logo-header"] {
        max-height: 50px !important;
        margin-left: 18px !important;
        width: auto !important;
        object-fit: contain !important;
      }

      /* Hero Stage Container */
      .framer-1pvbk64 {
        padding: 0 5% !important;
        gap: 40px !important;
        width: 100% !important;
        max-width: 1200px !important;
        height: auto !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        overflow: visible !important;
        position: relative !important;
        z-index: 5 !important;
      }

      .framer-kha8to {
        position: static !important;
        display: flex !important;
        flex-direction: row-reverse !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100% !important;
        max-width: 1300px !important;
        height: auto !important;
        overflow: visible !important;
        margin: 0 auto !important;
        gap: 30px !important;
      }

      figure.framer-f0om72 {
        opacity: 1 !important;
        position: static !important;
        transform: translate(5vw, -8px) !important;
        width: 44% !important;
        max-width: 560px !important;
        height: auto !important;
        aspect-ratio: 2070 / 2260 !important;
        max-height: min(65vh, 600px) !important;
        overflow: visible !important;
        z-index: 1 !important;
        pointer-events: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
      }

      @keyframes float-crystal {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(2deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }

      figure.framer-f0om72 img,
      img[src*="logo-crystal"] {
        width: 100% !important;
        height: 100% !important;
        max-width: 1400px !important;
        max-height: 100% !important;
        object-fit: contain !important;
        opacity: 0.95 !important;
        filter: drop-shadow(0 20px 40px rgba(41, 170, 225, 0.35)) drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4)) !important;
        animation: float-crystal 6s ease-in-out infinite !important;
        margin: 0 !important;
        display: block !important;
      }

      .framer-7sznpq {
        position: absolute !important;
        left: 10vw !important;
        top: calc(50% - 8px) !important;
        transform: translateY(-50%) !important;
        z-index: 100 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        justify-content: center !important;
        text-align: left !important;
        width: auto !important;
        max-width: 50vw !important;
        pointer-events: auto !important;
        opacity: 1 !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .muun-hero-title {
        font-family: "Inter Display", "Inter", -apple-system, BlinkMacSystemFont, sans-serif !important;
        font-size: clamp(40px, 5.2vw, 72px) !important;
        font-weight: 800 !important;
        letter-spacing: -0.04em !important;
        line-height: 1.1 !important;
        margin: 0 !important;
        padding: 0 !important;
        text-transform: uppercase !important;
        color: #FFFFFF !important;
        text-align: left !important;
        text-shadow: 
          0 0 20px rgba(41, 170, 225, 0.4),
          0 0 40px rgba(41, 170, 225, 0.2),
          0 4px 10px rgba(0, 0, 0, 0.6) !important;
        display: block !important;
        max-width: 1200px !important;
        width: max-content !important;
        min-width: 800px !important;
      }

      .muun-hero-subtitle {
        font-family: "Inter", sans-serif !important;
        font-size: clamp(16px, 1.8vw, 20px) !important;
        font-weight: 500 !important;
        line-height: 1.5 !important;
        color: #E0F2FE !important;
        opacity: 0.9 !important;
        margin-top: 18px !important;
        max-width: 700px !important;
        text-align: left !important;
        text-shadow: 0 2px 5px rgba(0, 0, 0, 0.6) !important;
        display: block !important;
      }

      .muun-hero-buttons {
        display: flex !important;
        flex-direction: row !important;
        gap: 18px !important;
        margin-top: 26px !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
        width: max-content !important;
      }

      /* Ministry Endorsement under Hero Buttons: Frameless, clean and native */
      .muun-hero-ministry {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 18px !important;
        margin-top: 24px !important;
        max-width: 750px !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      .muun-ministry-logo {
        height: 48px !important;
        width: auto !important;
        max-width: 72px !important;
        object-fit: contain !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.45)) !important;
        flex-shrink: 0 !important;
        display: block !important;
        opacity: 0.95 !important;
      }

      .muun-ministry-text {
        font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif !important;
        font-size: 16.5px !important;
        font-weight: 400 !important;
        line-height: 1.45 !important;
        color: rgba(224, 242, 254, 0.9) !important;
        letter-spacing: -0.01em !important;
        margin: 0 !important;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6) !important;
      }

      .muun-btn {
        font-family: "Inter", sans-serif !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        padding: 16px 36px !important;
        border-radius: 50px !important;
        text-decoration: none !important;
        transition: all 0.3s ease !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
      }

      .muun-btn-primary {
        background: linear-gradient(135deg, #29AAE1 0%, #0A3251 100%) !important;
        color: #fff !important;
        box-shadow: 0 10px 30px rgba(41, 170, 225, 0.5) !important;
        border: none !important;
      }

      .muun-btn-primary:hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 15px 25px rgba(41, 170, 225, 0.5) !important;
      }

      .muun-btn-secondary {
        background: rgba(255, 255, 255, 0.05) !important;
        color: #fff !important;
        border: 2px solid rgba(255, 255, 255, 0.3) !important;
        backdrop-filter: blur(10px) !important;
      }

      .muun-btn-secondary:hover {
        border-color: #29AAE1 !important;
        color: #29AAE1 !important;
        background: rgba(255,255,255,0.1) !important;
        transform: translateY(-3px) !important;
      }

      .muun-bottom-date, .muun-bottom-loc {
        font-family: "Inter", sans-serif !important;
        font-size: clamp(17px, 2vw, 22px) !important;
        font-weight: 500 !important;
        color: #FFFFFF !important;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5) !important;
        white-space: nowrap !important;
      }

      .muun-bottom-line {
        flex: 1 !important;
        height: 3px !important;
        background: rgba(255,255,255,0.5) !important;
        margin: 0 40px !important;
      }

      .framer-poyw0 {
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 80px !important;
        padding: 0 10vw !important;
        width: 100vw !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        z-index: 9999 !important;
      }

      /* ── 1. ALL SECTION HEADINGS: INTER DISPLAY WITH EVENTIS WHITE + GREY SPLIT ── */
      .framer-s11aph h2,
      .framer-10bvv2u h2,
      .framer-1xmtadx h2,
      .framer-17ylf30 h2,
      .framer-19oyny3 h2,
      .framer-ostf7s h2,
      .muun-eco-partners-title,
      .framer-1q8loet h2,
      .framer-1npbtm4 h2 {
        font-family: "Inter Display", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        font-weight: 600 !important;
        line-height: 1.18 !important;
        letter-spacing: -0.04em !important;
        color: #FFFFFF !important;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
      }

      /* Strictly single line for target, speakers, agenda, and partners headings */
      .framer-10bvv2u,
      .framer-10bvv2u h2,
      .framer-1xmtadx,
      .framer-1xmtadx h2,
      .framer-17ylf30,
      .framer-17ylf30 h2,
      .framer-ostf7s,
      .framer-ostf7s h2,
      .muun-eco-partners-title {
        white-space: nowrap !important;
        word-break: normal !important;
        word-wrap: normal !important;
        max-width: 100% !important;
        width: auto !important;
        font-size: clamp(24px, 3.2vw, 46px) !important;
      }

      @media (max-width: 992px) {
        .framer-ostf7s,
        .framer-ostf7s h2,
        .muun-eco-partners-title {
          white-space: normal !important;
        }
      }

      .framer-s11aph h2,
      .framer-19oyny3 h2,
      .framer-1q8loet h2,
      .framer-1npbtm4 h2 {
        font-size: clamp(34px, 3.8vw, 52px) !important;
        max-width: 950px !important;
      }

      .framer-s11aph h2 span,
      .framer-10bvv2u h2 span,
      .framer-1xmtadx h2 span,
      .framer-17ylf30 h2 span,
      .framer-19oyny3 h2 span,
      .framer-ostf7s h2 span,
      .muun-eco-partners-title span,
      .framer-1q8loet h2 span,
      .framer-1npbtm4 h2 span {
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        letter-spacing: inherit !important;
      }

      .heading-muted {
        color: var(--token-a1a0c7e5-1e4d-414c-8dba-5e69e14eca12, rgb(138, 138, 138)) !important;
      }

      /* ── 2. TICKER TYPOGRAPHY: EXACT EVENTIS 102px STYLE ── */
      .framer-1jdx44a-container {
        height: clamp(80px, 9vw, 130px) !important;
      }
      .framer-1ees0g7,
      .framer-1ees0g7 h2,
      div[data-framer-name="Ticker"] h2,
      .framer-styles-preset-1wrjz7w {
        font-family: "Inter", sans-serif !important;
        font-size: clamp(56px, 6.8vw, 102px) !important;
        font-weight: 600 !important;
        letter-spacing: -0.07em !important;
        line-height: 1.15 !important;
        text-transform: uppercase !important;
        color: #FFFFFF !important;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
        white-space: nowrap !important;
        width: max-content !important;
      }

      /* ── 3. FOR WHOM SECTION: EXACT FRAMER SQUIRCLE/CIRCLE CARDS IN 1 ROW ── */
      .framer-mu05uw .framer-9wjni4-container {
        display: none !important;
      }

      .muun-for-whom-container {
        width: 100% !important;
        max-width: 1200px !important;
        margin: 0 auto !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        position: relative !important;
        box-sizing: border-box !important;
      }

      /* 6 cards in 1 row: CSS Grid guarantees exact 1:1 square/circle aspect ratio without stretching */
      .muun-cards-track {
        display: grid !important;
        grid-template-columns: repeat(6, 1fr) !important;
        gap: 16px !important;
        width: 100% !important;
        max-width: 1200px !important;
        margin: 0 auto !important;
        padding: 14px 0 !important;
        box-sizing: border-box !important;
      }

      .muun-framer-card {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 1 / 1 !important;
        min-width: 0 !important;
        min-height: 0 !important;
        padding: 16px 8px !important;
        cursor: pointer !important;
        user-select: none !important;
        box-sizing: border-box !important;
        position: relative !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 10px !important;
        transition: border-radius 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                    border-color 0.25s ease,
                    box-shadow 0.35s ease,
                    transform 0.25s ease !important;
        background-color: #000000 !important;
        outline: none !important;
      }

      /* Active Card: Circular with glowing cube and vibrant blue border */
      .muun-framer-card.is-active,
      .muun-framer-card.framer-v-1wn31oz {
        border-radius: 9999px !important;
        border: 2.5px solid #0055FF !important;
        box-shadow: 0 0 35px rgba(0, 85, 255, 0.55), inset 0 0 20px rgba(0, 85, 255, 0.25) !important;
        transform: scale(1.02) !important;
      }

      .muun-framer-card.is-active .framer-vdq0vg,
      .muun-framer-card.framer-v-1wn31oz .framer-vdq0vg {
        display: block !important;
        opacity: 1 !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 0 !important;
        border-radius: inherit !important;
      }

      .muun-framer-card.is-active .framer-dr18ap,
      .muun-framer-card.framer-v-1wn31oz .framer-dr18ap {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 1 !important;
        border-radius: inherit !important;
        background-color: rgba(0, 0, 0, 0.45) !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
      }

      .muun-framer-card.is-active h4,
      .muun-framer-card.framer-v-1wn31oz h4 {
        color: #FFFFFF !important;
      }

      .muun-framer-card.is-active svg,
      .muun-framer-card.framer-v-1wn31oz svg {
        stroke: #FFFFFF !important;
      }

      /* Inactive Card: Squircle with subtle border */
      .muun-framer-card:not(.is-active) {
        border-radius: 48px !important;
        border: 2px solid rgb(38, 38, 38) !important;
      }

      .muun-framer-card:not(.is-active) .framer-vdq0vg {
        display: none !important;
        opacity: 0 !important;
      }

      .muun-framer-card:not(.is-active) .framer-dr18ap {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 1 !important;
        border-radius: inherit !important;
        background-color: rgba(0, 0, 0, 0.72) !important;
        backdrop-filter: blur(5px) !important;
        -webkit-backdrop-filter: blur(5px) !important;
      }

      .muun-framer-card:not(.is-active) h4 {
        color: rgb(138, 138, 138) !important;
      }

      .muun-framer-card:not(.is-active) svg {
        stroke: rgb(160, 160, 160) !important;
      }

      /* Inactive Hover */
      .muun-framer-card:not(.is-active):hover {
        border-color: rgba(255, 255, 255, 0.3) !important;
        transform: translateY(-4px) !important;
      }

      .muun-framer-card:not(.is-active):hover h4 {
        color: #FFFFFF !important;
      }

      .muun-framer-card:not(.is-active):hover svg {
        stroke: #FFFFFF !important;
      }

      /* Card Internal Icon & Title */
      .muun-framer-card .framer-12hi9of-container {
        width: 48px !important;
        height: 48px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 2 !important;
        position: relative !important;
        flex-shrink: 0 !important;
      }

      .muun-framer-card .framer-12hi9of-container svg {
        width: 44px !important;
        height: 44px !important;
        transition: stroke 0.25s ease !important;
      }

      .muun-framer-card .framer-31nozc {
        z-index: 2 !important;
        position: relative !important;
        width: 100% !important;
        text-align: center !important;
      }

      .muun-framer-card h4 {
        font-family: 'Inter', sans-serif !important;
        font-size: 14.5px !important;
        font-weight: 600 !important;
        line-height: 1.22 !important;
        margin: 0 !important;
        text-align: center !important;
        transition: color 0.25s ease !important;
        word-break: normal !important;
      }

      /* Description Box: Full width, proper padding, horizontal readable text */
      .framer-mu05uw .muun-desc-outer,
      .muun-desc-outer {
        width: 100% !important;
        max-width: 1200px !important;
        margin: 28px auto 0 !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
      }

      .framer-mu05uw .muun-desc-card,
      .muun-desc-card {
        width: 100% !important;
        max-width: 1200px !important;
        flex: 1 1 100% !important;
        padding: 26px 36px !important;
        border-radius: 32px !important;
        background-color: #000000 !important;
        border: 2px solid rgb(38, 38, 38) !important;
        box-sizing: border-box !important;
        position: relative !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        display: block !important;
      }

      .framer-mu05uw .framer-gfcum4,
      .muun-desc-card .framer-gfcum4 {
        width: 100% !important;
        max-width: 100% !important;
        flex: 1 1 100% !important;
        white-space: normal !important;
        word-break: normal !important;
      }

      .muun-desc-text {
        font-family: 'Inter', sans-serif !important;
        font-size: 16px !important;
        line-height: 1.65 !important;
        color: rgb(237, 237, 237) !important;
        text-align: left !important;
        margin: 0 !important;
        width: 100% !important;
        white-space: normal !important;
        word-break: normal !important;
        word-wrap: break-word !important;
        display: block !important;
        transition: opacity 0.15s ease, transform 0.15s ease !important;
      }

      /* Responsive: Mobile & Tablet */
      @media (max-width: 820px) {
        .muun-cards-track {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          overflow-x: auto !important;
          scroll-behavior: smooth !important;
          -webkit-overflow-scrolling: touch !important;
          scrollbar-width: none !important;
          gap: 12px !important;
          padding: 10px 4px !important;
        }
        .muun-cards-track::-webkit-scrollbar {
          display: none !important;
        }
        .muun-framer-card {
          flex: 0 0 142px !important;
          width: 142px !important;
          height: 142px !important;
          min-width: 142px !important;
          min-height: 142px !important;
          border-radius: 40px !important;
        }
        .muun-framer-card.is-active,
        .muun-framer-card.framer-v-1wn31oz {
          border-radius: 9999px !important;
        }
        .muun-framer-card .framer-12hi9of-container {
          width: 40px !important;
          height: 40px !important;
        }
        .muun-framer-card .framer-12hi9of-container svg {
          width: 36px !important;
          height: 36px !important;
        }
        .muun-framer-card h4 {
          font-size: 13px !important;
        }
        .muun-desc-card {
          padding: 20px 22px !important;
          border-radius: 24px !important;
        }
        .muun-desc-text {
          font-size: 14.5px !important;
          line-height: 1.55 !important;
        }
      }
      
      /* ── 4. HEADER NAVIGATION: RESTORE NATIVE SIZE & ROLL-UP HOVER ANIMATION ── */
      .framer-Luar2 .framer-18kiu0w {
        overflow: visible !important;
        flex: 1 1 auto !important;
        width: auto !important;
      }

      nav.framer-1s42b8a {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 8px !important;
        flex-wrap: nowrap !important;
      }

      .framer-nav-item-wrap {
        flex: none !important;
      }

      nav.framer-1s42b8a .framer-npy4b,
      nav.framer-1a0e2lt .framer-npy4b, footer .framer-npy4b {
        cursor: pointer !important;
        position: relative !important;
        overflow: hidden !important;
        padding: 8px 16px !important;
        height: 38px !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
        place-content: center !important;
        align-items: center !important;
        border-radius: 100px !important;
        text-decoration: none !important;
      }

      nav.framer-1s42b8a .framer-npy4b .framer-295hd4,
      nav.framer-1a0e2lt .framer-npy4b .framer-295hd4,
      footer .framer-npy4b .framer-295hd4 {
        position: absolute !important;
        inset: 0 !important;
        border-radius: 100px !important;
        pointer-events: none !important;
      }

      nav.framer-1s42b8a .framer-npy4b .framer-1dl5625,
      nav.framer-1a0e2lt .framer-npy4b .framer-1dl5625,
      footer .framer-npy4b .framer-1dl5625 {
        user-select: none !important;
        white-space: pre !important;
        position: relative !important;
        z-index: 2 !important;
        transform: translateY(0) !important;
        opacity: 1 !important;
        transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) !important;
      }

      nav.framer-1s42b8a .framer-npy4b .framer-mvpx8f,
      nav.framer-1a0e2lt .framer-npy4b .framer-mvpx8f,
      footer .framer-npy4b .framer-mvpx8f {
        position: absolute !important;
        inset: 0 !important;
        height: 100% !important;
        border-radius: 100px !important;
        background-color: #1c2bff !important;
        z-index: 1 !important;
        transform: translateY(101%) !important;
        transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) !important;
      }

      nav.framer-1s42b8a .framer-npy4b .framer-shp3q0,
      nav.framer-1a0e2lt .framer-npy4b .framer-shp3q0,
      footer .framer-npy4b .framer-shp3q0 {
        user-select: none !important;
        white-space: pre !important;
        position: absolute !important;
        inset: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 2 !important;
        opacity: 1 !important;
        transform: translateY(101%) !important;
        transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) !important;
      }

      nav.framer-1s42b8a .framer-npy4b:hover .framer-1dl5625,
      nav.framer-1s42b8a .framer-npy4b.hover .framer-1dl5625,
      nav.framer-1a0e2lt .framer-npy4b:hover .framer-1dl5625,
      nav.framer-1a0e2lt .framer-npy4b.hover .framer-1dl5625,
      footer .framer-npy4b:hover .framer-1dl5625,
      footer .framer-npy4b.hover .framer-1dl5625 {
        transform: translateY(-120%) !important;
      }

      nav.framer-1s42b8a .framer-npy4b:hover .framer-mvpx8f,
      nav.framer-1s42b8a .framer-npy4b.hover .framer-mvpx8f,
      nav.framer-1a0e2lt .framer-npy4b:hover .framer-mvpx8f,
      nav.framer-1a0e2lt .framer-npy4b.hover .framer-mvpx8f,
      footer .framer-npy4b:hover .framer-mvpx8f,
      footer .framer-npy4b.hover .framer-mvpx8f,
      nav.framer-1s42b8a .framer-npy4b:hover .framer-shp3q0,
      nav.framer-1s42b8a .framer-npy4b.hover .framer-shp3q0,
      nav.framer-1a0e2lt .framer-npy4b:hover .framer-shp3q0,
      nav.framer-1a0e2lt .framer-npy4b.hover .framer-shp3q0,
      footer .framer-npy4b:hover .framer-shp3q0,
      footer .framer-npy4b.hover .framer-shp3q0 {
        transform: translateY(0) !important;
      }

      /* ── 4b. SPEAKERS: ALWAYS FULL COLOR PHOTOS & SOCIAL ICONS HOVER HIGHLIGHT ── */
      /* Ensure photos are ALWAYS colored (no grayscale at rest or on hover) */
      .framer-KUjhD,
      .framer-1kwjq53,
      .framer-1kwjq53 img,
      .framer-KUjhD .framer-1kwjq53,
      .framer-KUjhD .framer-1kwjq53 img,
      .framer-KUjhD figure[data-framer-name="Image"],
      .framer-KUjhD figure[data-framer-name="Image"] img,
      section[data-framer-name="Speakers"] figure,
      section[data-framer-name="Speakers"] img {
        filter: none !important;
        -webkit-filter: none !important;
        transition: none !important;
      }

      .framer-KUjhD:hover .framer-1kwjq53,
      .framer-KUjhD:hover .framer-1kwjq53 img,
      .framer-KUjhD:hover figure[data-framer-name="Image"],
      .framer-KUjhD:hover figure[data-framer-name="Image"] img {
        filter: none !important;
        -webkit-filter: none !important;
      }

      /* Speaker Social Media Logos at bottom of cards */
      .framer-KUjhD .framer-1k1k4zw,
      .framer-KUjhD .framer-1kw927m,
      .framer-KUjhD [data-framer-name="Instagram"],
      .framer-KUjhD [data-framer-name="Linkedin"] {
        opacity: 0.7 !important;
        border-radius: 12px !important;
        background: rgba(255, 255, 255, 0.12) !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
        border: 1px solid rgba(255, 255, 255, 0.22) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25) !important;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
        transform: translateZ(0) !important;
      }

      /* On card hover: ONLY social logos light up with luminous electric cyan/white highlight */
      .framer-KUjhD:hover .framer-1k1k4zw,
      .framer-KUjhD:hover .framer-1kw927m,
      .framer-KUjhD:hover [data-framer-name="Instagram"],
      .framer-KUjhD:hover [data-framer-name="Linkedin"] {
        opacity: 1 !important;
        background: rgba(41, 170, 225, 0.35) !important;
        border-color: rgba(41, 170, 225, 0.9) !important;
        box-shadow: 0 0 16px rgba(41, 170, 225, 0.9), 0 0 32px rgba(41, 170, 225, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.4) !important;
        filter: drop-shadow(0 0 8px rgba(41, 170, 225, 0.95)) brightness(1.25) !important;
        transform: translateY(-2px) scale(1.08) !important;
      }

      /* Direct icon hover */
      .framer-KUjhD .framer-1k1k4zw:hover,
      .framer-KUjhD .framer-1kw927m:hover,
      .framer-KUjhD [data-framer-name="Instagram"]:hover,
      .framer-KUjhD [data-framer-name="Linkedin"]:hover {
        opacity: 1 !important;
        background: #29AAE1 !important;
        border-color: #FFFFFF !important;
        box-shadow: 0 0 24px rgba(41, 170, 225, 1), 0 0 48px rgba(41, 170, 225, 0.75), inset 0 0 12px rgba(255, 255, 255, 0.7) !important;
        filter: drop-shadow(0 0 12px rgba(41, 170, 225, 1)) brightness(1.35) !important;
        transform: translateY(-4px) scale(1.18) !important;
      }

      .framer-KUjhD .framer-1k1k4zw svg,
      .framer-KUjhD .framer-1kw927m svg,
      .framer-KUjhD [data-framer-name="Instagram"] svg,
      .framer-KUjhD [data-framer-name="Linkedin"] svg,
      .framer-KUjhD .framer-1k1k4zw path,
      .framer-KUjhD .framer-1kw927m path {
        fill: #FFFFFF !important;
        color: #FFFFFF !important;
      }

      section[data-framer-name="Speakers"] [data-framer-name="Blue Blur"],
      section[data-framer-name="Speakers"] [data-framer-name="Instagram"],
      section[data-framer-name="Speakers"] [data-framer-name="Linkedin"] {
        display: none !important;
      }
      section[data-framer-name="Speakers"] .framer--carousel {
        align-items: flex-start !important;
      }
      section[data-framer-name="Speakers"] [data-framer-name="Speaker 01"],
      section[data-framer-name="Speakers"] [data-framer-name="Speaker 02"],
      section[data-framer-name="Speakers"] [data-framer-name="Speaker 03"],
      section[data-framer-name="Speakers"] [data-framer-name="Speaker 04"],
      section[data-framer-name="Speakers"] [data-framer-name="Speaker 05"],
      section[data-framer-name="Speakers"] [data-framer-name="Speaker 06"] {
        padding-top: 0 !important;
        margin-top: 0 !important;
      }
      section[data-framer-name="Speakers"] [data-framer-name="Content"]:has(> [data-framer-name="Image"]) {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 4 / 5 !important;
        position: relative !important;
        overflow: hidden !important;
      }
      /* The section wrapper is also named Content. Keep it only as tall as the cards. */
      section[data-framer-name="Speakers"] [data-framer-name="Content"]:has(> [data-framer-name="Speakers Cards"]) {
        aspect-ratio: auto !important;
        height: auto !important;
        min-height: 0 !important;
        align-items: flex-start !important;
        justify-content: flex-start !important;
        align-content: flex-start !important;
      }
      section[data-framer-name="Speakers"] [data-framer-name="Image"] {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }
      section[data-framer-name="Speakers"] [data-framer-name="Image"] img[src*="speaker-beknazarov"] {
        transform: scale(1.72) !important;
        transform-origin: center 34% !important;
      }
      section[data-framer-name="Speakers"] [data-framer-name="Image"] img[src*="speaker-rysbekov"],
      section[data-framer-name="Speakers"] [data-framer-name="Image"] img[src*="speaker-surabaldieva"],
      section[data-framer-name="Speakers"] [data-framer-name="Image"] img[src*="speaker-esenalieva"] {
        object-position: center center !important;
      }
      section[data-framer-name="Speakers"] [data-framer-name="Name"],
      section[data-framer-name="Speakers"] [data-framer-name="Name"] h4,
      section[data-framer-name="Speakers"] [data-framer-name="Designation"],
      section[data-framer-name="Speakers"] [data-framer-name="Designation"] p {
        height: auto !important;
        max-height: none !important;
        white-space: normal !important;
      }
      section[data-framer-name="Speakers"] [data-framer-name="Name"],
      section[data-framer-name="Speakers"] [data-framer-name="Name"] h4 {
        min-height: 2.8em !important;
      }

      /* Speakers Bottom Bar: Typography & Interaction */
      .framer-qjskfs h4,
      .framer-393pab h4,
      .framer-u84szu .framer-393pab h4,
      [data-framer-name="200+ Speakers"] h4,
      [data-framer-name="20+ Speakers"] h4 {
        font-family: "Inter", sans-serif !important;
        font-size: 16px !important;
        font-weight: 500 !important;
        letter-spacing: -0.01em !important;
        color: #FFFFFF !important;
        white-space: nowrap !important;
      }

      .framer-1hr1kgt h4,
      .framer-u6t1id h4,
      .framer-u84szu .framer-u6t1id h4 {
        font-family: "Inter", sans-serif !important;
        font-size: 16px !important;
        font-weight: 500 !important;
        letter-spacing: -0.01em !important;
        color: #FFFFFF !important;
        white-space: nowrap !important;
        transition: color 0.25s ease !important;
      }

      .framer-u6t1id:hover .framer-1hr1kgt h4,
      .framer-u6t1id:hover h4,
      .framer-1hr1kgt:hover h4 {
        color: #29AAE1 !important;
      }

      /* ── 4c. PARTNERS SECTION & CONTINUOUS MARQUEE ── */
      .framer-v0m3u0 {
        position: relative !important;
        overflow: visible !important;
      }

      section[data-framer-name="Sponsors"] .framer-1cwmk1v,
      .framer-v0m3u0 .framer-1cwmk1v {
        max-width: 1320px !important;
        width: 100% !important;
        margin: 0 auto !important;
        padding: 0 !important;
        align-items: flex-start !important;
        box-sizing: border-box !important;
      }

      section[data-framer-name="Sponsors"] .framer-1cncrv2,
      .framer-v0m3u0 .framer-1cncrv2 {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        align-items: flex-start !important;
      }

      section[data-framer-name="Sponsors"] .framer-ostf7s,
      .framer-v0m3u0 .framer-ostf7s {
        margin: 0 !important;
        padding: 0 !important;
        text-align: left !important;
        width: 100% !important;
      }

      .framer-ff8lq4 {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 56px !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }

      .muun-partners-category {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 24px !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }

      .muun-eco-partners-title {
        margin: 0 !important;
        padding: 0 !important;
        text-align: left !important;
        font-family: inherit !important;
      }

      .muun-marquee-viewport {
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
        position: relative !important;
        padding: 16px 0 !important;
        margin: -16px 0 !important;
        box-sizing: border-box !important;
      }

      .muun-marquee-track {
        display: flex !important;
        width: max-content !important;
        gap: 24px !important;
        user-select: none !important;
        box-sizing: border-box !important;
      }

      .muun-marquee-group {
        display: flex !important;
        align-items: center !important;
        gap: 24px !important;
        flex-shrink: 0 !important;
        will-change: transform !important;
      }

      /* Hover pauses the movement */
      .muun-marquee-viewport:hover .muun-marquee-group {
        animation-play-state: paused !important;
      }

      /* Faster, lively velocity-matched linear scrolling (~106px/s) */
      .muun-marquee-general {
        animation: muunMarqueeScroll 25s linear infinite !important;
      }

      .muun-marquee-eco {
        animation: muunMarqueeScroll 30s linear infinite !important;
      }

      .muun-marquee-media {
        animation: muunMarqueeScroll 40s linear infinite !important;
      }

      @keyframes muunMarqueeScroll {
        0% {
          transform: translate3d(0, 0, 0);
        }
        100% {
          transform: translate3d(calc(-100% - 24px), 0, 0);
        }
      }

      /* Card styling - exactly 5 frames visible in 1320px viewport (245px * 5 + 24px * 4 = 1321px) */
      .muun-partner-card {
        background: #FFFFFF !important;
        border-radius: 24px !important;
        padding: 24px 28px !important;
        min-height: 150px !important;
        height: 165px !important;
        width: 245px !important;
        flex: 0 0 245px !important;
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        position: relative !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35), 0 0 1px rgba(255, 255, 255, 0.4) !important;
        border: 1px solid rgba(255, 255, 255, 0.6) !important;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease !important;
        cursor: pointer !important;
        text-decoration: none !important;
        overflow: hidden !important;
      }

      .muun-partner-card:hover {
        transform: translateY(-6px) scale(1.02) !important;
        border-color: #29AAE1 !important;
        box-shadow: 0 16px 40px rgba(41, 170, 225, 0.35), 0 0 25px rgba(41, 170, 225, 0.4) !important;
        z-index: 10 !important;
      }

      .muun-partner-card.no-link {
        cursor: default !important;
      }

      .muun-partner-card img {
        display: block !important;
        max-width: 100% !important;
        width: auto !important;
        object-fit: contain !important;
        filter: none !important;
        -webkit-filter: none !important;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }

      .muun-partner-card:hover img {
        transform: scale(1.05) !important;
      }

      .muun-dark-logo-badge {
        box-sizing: border-box !important;
      }

      /* Logo dimensions inside frames */
      .muun-partner-card .kumtor-logo {
        max-height: 85px !important;
        max-width: 200px !important;
      }
      .muun-partner-card .kyrgyzaltyn-logo {
        max-height: 85px !important;
        max-width: 200px !important;
      }
      .muun-partner-card .aeroporty-logo {
        max-height: 60px !important;
        max-width: 215px !important;
      }
      .muun-partner-card .eapo-logo {
        max-height: 80px !important;
        max-width: 170px !important;
      }
      .muun-partner-card .tika-logo {
        max-height: 60px !important;
        max-width: 200px !important;
      }

      .muun-partner-card .eco-cebc {
        max-height: 75px !important;
        max-width: 195px !important;
      }
      .muun-partner-card .eco-codify {
        max-height: 52px !important;
        max-width: 190px !important;
      }
      .muun-partner-card .eco-prokg {
        max-height: 70px !important;
        max-width: 190px !important;
      }
      .muun-partner-card .eco-htp {
        max-height: 52px !important;
        max-width: 190px !important;
      }
      .muun-partner-card .eco-mdk {
        max-height: 85px !important;
        max-width: 195px !important;
      }
      .muun-partner-card .eco-contest {
        max-height: 52px !important;
        max-width: 185px !important;
      }

      .muun-partner-card .media-logo-eltr {
        max-height: 65px !important;
        max-width: 180px !important;
      }
      .muun-partner-card .media-logo-region {
        max-height: 60px !important;
        max-width: 190px !important;
      }
      .muun-partner-card .media-logo-ch7 {
        max-height: 70px !important;
        max-width: 185px !important;
      }
      .muun-partner-card .media-logo-radio {
        max-height: 65px !important;
        max-width: 180px !important;
      }
      .muun-partner-card .media-logo-minkyal {
        max-height: 65px !important;
        max-width: 180px !important;
      }
      .muun-partner-card .media-logo-alatoo {
        max-height: 50px !important;
        max-width: 190px !important;
      }
      .muun-partner-card .media-logo-utrk {
        max-height: 58px !important;
        max-width: 185px !important;
      }
      .muun-partner-card .media-logo-kabar {
        max-height: 58px !important;
        max-width: 195px !important;
      }

      @media (max-width: 768px) {
        .muun-partner-card {
          width: 200px !important;
          flex: 0 0 200px !important;
          height: 140px !important;
          min-height: 130px !important;
          padding: 18px 20px !important;
          border-radius: 20px !important;
        }
        .framer-ff8lq4 {
          gap: 42px !important;
        }
      }

      @media (max-width: 480px) {
        .muun-partner-card {
          width: 170px !important;
          flex: 0 0 170px !important;
          height: 125px !important;
          min-height: 115px !important;
          padding: 14px 16px !important;
          border-radius: 16px !important;
        }
        .muun-marquee-track {
          gap: 16px !important;
        }
        .muun-marquee-group {
          gap: 16px !important;
        }
        @keyframes muunMarqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(calc(-100% - 16px), 0, 0);
          }
        }
      }

      
      /* ── 4d. FAQ LAYOUT & ACCORDION STYLES ── */
      section[data-framer-name="FAQs"],
      .framer-xo1fg0 {
        padding: 90px 40px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        position: relative !important;
      }

      section[data-framer-name="FAQs"] .framer-1cecm0z,
      .framer-xo1fg0 .framer-1cecm0z {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        justify-content: flex-start !important;
        gap: 40px !important;
        width: 100% !important;
        max-width: 1320px !important;
        margin: 0 auto !important;
        box-sizing: border-box !important;
      }

      section[data-framer-name="FAQs"] .framer-1nj0jeg,
      .framer-xo1fg0 .framer-1nj0jeg {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 16px !important;
        width: 100% !important;
        max-width: 100% !important;
        flex: none !important;
        box-sizing: border-box !important;
      }

      section[data-framer-name="FAQs"] .framer-19oyny3,
      .framer-xo1fg0 .framer-19oyny3 {
        width: 100% !important;
        max-width: 100% !important;
      }

      section[data-framer-name="FAQs"] .framer-19oyny3 h2,
      .framer-xo1fg0 .framer-19oyny3 h2 {
        text-align: left !important;
      }

      section[data-framer-name="FAQs"] .framer-rs1smy,
      .framer-xo1fg0 .framer-rs1smy {
        width: 100% !important;
        max-width: 100% !important;
        flex: none !important;
        display: block !important;
        box-sizing: border-box !important;
      }

      .muun-faq-layout {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 60px !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }

      .muun-faq-accordion {
        flex: 1 1 54% !important;
        max-width: 56% !important;
        width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
      }

      .muun-faq-eagle-container {
        flex: 1 1 42% !important;
        max-width: 44% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        position: sticky !important;
        top: 100px !important;
        align-self: flex-start !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .muun-faq-eagle-img {
        width: 100% !important;
        max-width: 460px !important;
        height: auto !important;
        object-fit: contain !important;
        display: block !important;
        background: transparent !important;
        border: none !important;
        outline: none !important;
        filter: drop-shadow(0 20px 40px rgba(0, 198, 255, 0.22)) drop-shadow(0 4px 15px rgba(0, 0, 0, 0.5)) !important;
        animation: eagleFloat 6s ease-in-out infinite !important;
        pointer-events: none !important;
        user-select: none !important;
      }

      @keyframes eagleFloat {
        0%, 100% {
          transform: translateY(0px) scale(1);
        }
        50% {
          transform: translateY(-12px) scale(1.02);
        }
      }

      @media (max-width: 991px) {
        .muun-faq-layout {
          flex-direction: column !important;
          gap: 36px !important;
        }
        .muun-faq-accordion {
          max-width: 100% !important;
          width: 100% !important;
        }
        .muun-faq-eagle-container {
          max-width: 100% !important;
          width: 100% !important;
          position: static !important;
          order: -1 !important;
          display: flex !important;
          justify-content: center !important;
        }
        .muun-faq-eagle-img {
          max-width: 320px !important;
        }
      }

      .muun-faq-item {
        background-color: var(--token-12cbfa94-9c5f-41d3-a67b-614d50367bfe, rgb(17, 17, 20)) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 24px !important;
        padding: 22px 28px !important;
        cursor: pointer !important;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        width: 100% !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
      }

      .muun-faq-item:hover {
        border-color: rgba(41, 170, 225, 0.4) !important;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4) !important;
      }

      .muun-faq-item.is-open {
        border-color: rgba(41, 170, 225, 0.5) !important;
        background-color: rgba(10, 30, 52, 0.75) !important;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5) !important;
      }

      .muun-faq-question-row {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 18px !important;
        width: 100% !important;
        user-select: none !important;
      }

      .muun-faq-q-text {
        font-family: "Inter", sans-serif !important;
        font-size: clamp(16px, 1.4vw, 18px) !important;
        font-weight: 500 !important;
        color: #FFFFFF !important;
        line-height: 1.4 !important;
        text-align: left !important;
      }

      .muun-faq-plus-icon {
        width: 36px !important;
        height: 36px !important;
        min-width: 36px !important;
        border-radius: 50% !important;
        background-color: rgba(255, 255, 255, 0.12) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        position: relative !important;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        flex-shrink: 0 !important;
      }

      .muun-faq-item:hover .muun-faq-plus-icon {
        background-color: rgba(41, 170, 225, 0.25) !important;
      }

      .muun-faq-item.is-open .muun-faq-plus-icon {
        background-color: #29AAE1 !important;
        transform: rotate(45deg) !important;
      }

      .muun-faq-plus-icon svg {
        width: 16px !important;
        height: 16px !important;
        stroke: #FFFFFF !important;
        stroke-width: 2.2 !important;
        display: block !important;
      }

      .muun-faq-answer-collapse {
        display: none !important;
        padding-top: 18px !important;
        margin-top: 16px !important;
        border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
      }

      .muun-faq-item.is-open .muun-faq-answer-collapse {
        display: block !important;
        animation: faqFadeIn 0.35s ease forwards !important;
      }

      @keyframes faqFadeIn {
        from { opacity: 0; transform: translateY(-6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .muun-faq-answer-text {
        font-family: "Inter", sans-serif !important;
        font-size: 15px !important;
        line-height: 1.65 !important;
        color: rgba(224, 242, 254, 0.88) !important;
        text-align: left !important;
      }

      .framer-xo1fg0 .framer-rs1smy > .ssr-variant {
        display: none !important;
      }

      /* ── 4e. THEMATIC ZONES (SCREENSHOT 2) ── */
      section.framer-19yv87c,
      .muun-thematic-zones-section {
        padding: 100px 40px !important;
        display: flex !important;
        justify-content: center !important;
        width: 100% !important;
        box-sizing: border-box !important;
        background: transparent !important;
        position: relative !important;
        overflow: visible !important;
      }

      .muun-thematic-zones-container {
        width: 100% !important;
        max-width: 1320px !important;
        margin: 0 auto !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 36px !important;
        box-sizing: border-box !important;
      }

      .muun-zones-header {
        text-align: left !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
      }

      .muun-zones-kicker,
      .muun-zones-subtitle {
        display: none !important;
      }

      .muun-zones-title {
        font-family: "Inter Display", "Inter", sans-serif !important;
        font-size: clamp(34px, 4vw, 52px) !important;
        font-weight: 800 !important;
        line-height: 1.15 !important;
        letter-spacing: -0.04em !important;
        color: #FFFFFF !important;
        margin: 0 !important;
        text-align: left !important;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
      }

      .muun-zones-grid {
        display: grid !important;
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
        gap: 22px !important;
        width: 100% !important;
        max-width: 1320px !important;
        box-sizing: border-box !important;
      }

      @media (max-width: 1100px) {
        .muun-zones-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 20px !important;
        }
      }

      @media (max-width: 640px) {
        .muun-zones-grid {
          display: flex !important;
          flex-wrap: nowrap !important;
          grid-template-columns: none !important;
          gap: 12px !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          scroll-snap-type: x mandatory;
          scroll-padding-left: 2px;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          padding: 2px 18px 12px 2px !important;
          scrollbar-width: none;
        }
        .muun-zones-grid::-webkit-scrollbar { display: none; }
        .muun-zone-card {
          flex: 0 0 78% !important;
          width: 78% !important;
          max-width: 280px !important;
          scroll-snap-align: start;
        }
      }

      .muun-zone-card {
        background: linear-gradient(145deg, rgba(13, 22, 43, 0.85) 0%, rgba(8, 15, 30, 0.95) 100%) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 22px !important;
        padding: 28px 24px !important;
        min-height: 185px !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-start !important;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
      }

      .muun-zone-card:hover {
        transform: translateY(-4px) !important;
        border-color: rgba(41, 170, 225, 0.45) !important;
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.55), 0 0 24px rgba(41, 170, 225, 0.2) !important;
      }

      .muun-zone-card-top {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100% !important;
      }

      .muun-zone-num {
        font-family: "Inter Display", "Inter", sans-serif !important;
        font-size: 26px !important;
        font-weight: 800 !important;
        letter-spacing: -0.02em !important;
        line-height: 1 !important;
      }

      .muun-zone-tag {
        font-family: "Inter", sans-serif !important;
        font-size: 11.5px !important;
        font-weight: 700 !important;
        letter-spacing: 0.06em !important;
        text-transform: uppercase !important;
        color: rgba(255, 255, 255, 0.7) !important;
        background: rgba(255, 255, 255, 0.06) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 20px !important;
        padding: 4px 12px !important;
        line-height: 1.2 !important;
      }

      .muun-zone-title {
        margin: 26px 0 8px 0 !important;
        font-family: "Inter Display", "Inter", sans-serif !important;
        font-size: 17px !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.02em !important;
        color: #FFFFFF !important;
        line-height: 1.3 !important;
      }

      .muun-zone-desc {
        margin: 0 !important;
        font-family: "Inter", sans-serif !important;
        font-size: 13.5px !important;
        line-height: 1.5 !important;
        color: rgba(224, 242, 254, 0.72) !important;
      }

      /* ── REGISTRATION SECTION: TICKET TRANSPARENCY & DARK GLASS FORM ── */
      section[data-framer-name="Registration"] .framer-xqjflg {
        -webkit-mask: none !important;
        mask: none !important;
        overflow: visible !important;
        background: transparent !important;
        background-color: transparent !important;
        mix-blend-mode: screen !important;
      }

      section[data-framer-name="Registration"] .framer-1v0ka20-container {
        background: transparent !important;
        background-color: transparent !important;
        mix-blend-mode: screen !important;
      }

      section[data-framer-name="Registration"] .framer-eeeoyo {
        background: transparent !important;
        background-color: transparent !important;
      }

      section[data-framer-name="Registration"] .framer-xqjflg video,
      section[data-framer-name="Registration"] .framer-1v0ka20-container video,
      section[data-framer-name="Registration"] video {
        mix-blend-mode: screen !important;
        background: transparent !important;
        background-color: transparent !important;
        border-radius: 0 !important;
      }

      section[data-framer-name="Registration"] .framer-n7lw51 {
        flex: 1 1 0 !important;
        width: 100% !important;
        max-width: 680px !important;
        overflow: visible !important;
        gap: 0 !important;
        align-items: stretch !important;
      }

      .muun-reg-card {
        background: linear-gradient(145deg, rgba(13, 22, 43, 0.88) 0%, rgba(8, 15, 30, 0.96) 100%) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 24px !important;
        padding: 38px 36px !important;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.2) inset !important;
        width: 100% !important;
        max-width: 680px !important;
        box-sizing: border-box !important;
        backdrop-filter: blur(24px) !important;
        -webkit-backdrop-filter: blur(24px) !important;
        color: #FFFFFF !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        position: relative !important;
      }

      @media (max-width: 640px) {
        .muun-reg-card {
          padding: 24px 18px !important;
          border-radius: 20px !important;
        }
      }

      .muun-form-title {
        font-size: clamp(20px, 2.2vw, 24px) !important;
        text-align: left !important;
        margin: 0 0 6px 0 !important;
        color: #FFFFFF !important;
        text-transform: uppercase !important;
        font-weight: 800 !important;
        font-family: 'Inter Display', 'Inter', -apple-system, sans-serif !important;
        letter-spacing: 0.02em !important;
      }

      .muun-form-subtitle,
      .muun-form-lead p {
        text-align: left !important;
        color: rgba(224, 242, 254, 0.78) !important;
        margin: 0 !important;
        font-size: 13.5px !important;
        line-height: 1.55 !important;
        font-family: 'Inter', sans-serif !important;
      }

      .muun-form-lead {
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
        margin: 0 0 22px 0 !important;
      }

      .muun-form-lead .lead-strong {
        color: #ffffff !important;
        font-weight: 600 !important;
      }

      .muun-sgo-warning-box {
        background: rgba(245, 158, 11, 0.08) !important;
        border: 1px solid rgba(245, 158, 11, 0.25) !important;
        border-left: 3px solid #f59e0b !important;
        border-radius: 14px !important;
        padding: 14px 16px !important;
        margin-bottom: 22px !important;
        display: flex !important;
        gap: 12px !important;
        align-items: flex-start !important;
      }

      .muun-sgo-warning-box .icon {
        font-size: 20px !important;
        flex-shrink: 0 !important;
        line-height: 1 !important;
      }

      .muun-sgo-warning-box p {
        margin: 0 !important;
        font-size: 12.5px !important;
        color: #FCD34D !important;
        line-height: 1.55 !important;
        font-weight: 500 !important;
        font-family: 'Inter', sans-serif !important;
      }

      /* Tabs Switcher */
      .reg-tabs-wrap {
        display: flex !important;
        gap: 6px !important;
        background: rgba(6, 12, 24, 0.8) !important;
        padding: 5px !important;
        border-radius: 14px !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        margin-bottom: 24px !important;
      }

      .reg-tab-btn {
        flex: 1 !important;
        padding: 11px 16px !important;
        font-family: 'Inter', sans-serif !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        border-radius: 10px !important;
        border: 1px solid transparent !important;
        background: transparent !important;
        color: rgba(255, 255, 255, 0.65) !important;
        cursor: pointer !important;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
      }

      .reg-tab-btn:hover {
        color: #FFFFFF !important;
        background: rgba(255, 255, 255, 0.06) !important;
      }

      .reg-tab-btn.active {
        background: linear-gradient(135deg, #29AAE1, #1D4ED8) !important;
        color: #FFFFFF !important;
        font-weight: 700 !important;
        box-shadow: 0 4px 16px rgba(41, 170, 225, 0.35) !important;
        border-color: rgba(255, 255, 255, 0.15) !important;
      }

      /* Labels & Notes */
      .field-label {
        display: block !important;
        margin-bottom: 6px !important;
        font-size: 12.5px !important;
        color: rgba(255, 255, 255, 0.88) !important;
        font-weight: 600 !important;
        font-family: 'Inter', sans-serif !important;
        letter-spacing: 0.01em !important;
      }

      .field-note {
        display: block !important;
        font-size: 11px !important;
        color: rgba(255, 255, 255, 0.45) !important;
        margin-top: 4px !important;
        line-height: 1.4 !important;
        font-family: 'Inter', sans-serif !important;
      }

      .form-input-dark {
        width: 100% !important;
        box-sizing: border-box !important;
        background: rgba(13, 23, 44, 0.75) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        color: #FFFFFF !important;
        padding: 12px 14px !important;
        border-radius: 11px !important;
        font-size: 13.5px !important;
        font-family: 'Inter', sans-serif !important;
        transition: all 0.2s ease !important;
        outline: none !important;
        color-scheme: dark !important;
      }

      .form-input-dark::placeholder {
        color: rgba(255, 255, 255, 0.35) !important;
      }

      input[type="file"].form-input-dark::file-selector-button {
        margin-right: 12px !important;
        border: 0 !important;
        border-radius: 8px !important;
        padding: 8px 12px !important;
        background: rgba(56, 189, 248, 0.18) !important;
        color: #ffffff !important;
        font-family: 'Inter', sans-serif !important;
        font-size: 12.5px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
      }

      .form-input-dark:focus {
        border-color: #38bdf8 !important;
        background: rgba(16, 29, 56, 0.95) !important;
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.22) !important;
      }

      select.form-input-dark {
        background-color: #0b1528 !important;
        appearance: none !important;
        -webkit-appearance: none !important;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2338BDF8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
        background-repeat: no-repeat !important;
        background-position: right 14px center !important;
        padding-right: 36px !important;
        cursor: pointer !important;
      }

      select.form-input-dark option {
        background: #0b1528 !important;
        color: #FFFFFF !important;
        padding: 10px !important;
      }

      /* Interests Grid */
      .interests-grid {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 10px !important;
      }

      @media (max-width: 600px) {
        .interests-grid {
          grid-template-columns: repeat(2, 1fr) !important;
        }
      }

      .interest-chip {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        padding: 10px 12px !important;
        background: rgba(13, 23, 44, 0.6) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 11px !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        user-select: none !important;
        font-size: 12.5px !important;
        font-weight: 500 !important;
        color: #E2E8F0 !important;
        font-family: 'Inter', sans-serif !important;
      }

      .interest-chip:hover {
        border-color: rgba(56, 189, 248, 0.4) !important;
        background: rgba(56, 189, 248, 0.08) !important;
      }

      .interest-chip input[type="checkbox"] {
        accent-color: #38bdf8 !important;
        width: 16px !important;
        height: 16px !important;
        cursor: pointer !important;
      }

      /* Consent Box */
      .consent-box {
        background: rgba(13, 23, 44, 0.45) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 12px !important;
        padding: 14px 16px !important;
        display: flex !important;
        gap: 12px !important;
        align-items: flex-start !important;
      }

      .consent-box input[type="checkbox"] {
        accent-color: #38bdf8 !important;
        width: 17px !important;
        height: 17px !important;
        margin-top: 2px !important;
        flex-shrink: 0 !important;
        cursor: pointer !important;
      }

      .consent-box label {
        font-size: 12px !important;
        color: rgba(255, 255, 255, 0.72) !important;
        line-height: 1.5 !important;
        cursor: pointer !important;
        font-family: 'Inter', sans-serif !important;
      }

      /* Submit Button */
      .submit-btn {
        width: 100% !important;
        padding: 15px 24px !important;
        border-radius: 100px !important;
        font-family: 'Inter Display', 'Inter', sans-serif !important;
        font-size: 14.5px !important;
        font-weight: 800 !important;
        letter-spacing: 0.03em !important;
        text-transform: uppercase !important;
        background: linear-gradient(135deg, #00b4d8 0%, #0077b6 50%, #1d4ed8 100%) !important;
        color: #FFFFFF !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        cursor: pointer !important;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        box-shadow: 0 8px 24px rgba(0, 180, 216, 0.35) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
      }

      .submit-btn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 12px 32px rgba(0, 180, 216, 0.5) !important;
        background: linear-gradient(135deg, #24d2ff 0%, #0d84ff 100%) !important;
      }

      .submit-btn:active {
        transform: translateY(0) !important;
      }

      .security-memo {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        font-size: 11.5px !important;
        color: rgba(255, 255, 255, 0.45) !important;
        margin-top: 4px !important;
        font-family: 'Inter', sans-serif !important;
      }

      .group-info-box {
        background: rgba(41, 170, 225, 0.08) !important;
        border: 1px solid rgba(41, 170, 225, 0.25) !important;
        border-radius: 12px !important;
        padding: 14px 16px !important;
        margin-bottom: 4px !important;
      }

      .group-info-box h4 {
        margin: 0 0 4px 0 !important;
        color: #38bdf8 !important;
        font-size: 13.5px !important;
        font-weight: 700 !important;
        font-family: 'Inter', sans-serif !important;
      }

      .group-info-box p {
        margin: 0 !important;
        color: rgba(255, 255, 255, 0.65) !important;
        font-size: 12px !important;
        font-family: 'Inter', sans-serif !important;
      }

      /* Pending Step */
      .pending-icon-wrap {
        font-size: 44px !important;
        margin-bottom: 14px !important;
      }

      .pending-title {
        font-size: 22px !important;
        color: #38bdf8 !important;
        font-weight: 800 !important;
        margin: 0 0 10px 0 !important;
        font-family: 'Inter Display', 'Inter', sans-serif !important;
      }

      .pending-desc {
        font-size: 13.5px !important;
        color: rgba(255, 255, 255, 0.75) !important;
        line-height: 1.6 !important;
        max-width: 520px !important;
        margin: 0 auto 20px auto !important;
        font-family: 'Inter', sans-serif !important;
      }

      .pending-memo-box {
        background: rgba(255, 255, 255, 0.03) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 14px !important;
        padding: 18px 20px !important;
        text-align: left !important;
        max-width: 520px !important;
        margin: 0 auto !important;
      }

      .pending-memo-box h4 {
        margin: 0 0 12px 0 !important;
        color: #fde68a !important;
        font-size: 13.5px !important;
        font-weight: 700 !important;
      }

      .pending-memo-box ul {
        margin: 0 !important;
        padding-left: 18px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
      }

      .pending-memo-box li {
        font-size: 12px !important;
        color: rgba(255, 255, 255, 0.75) !important;
        line-height: 1.5 !important;
      }

      /* Hide old host elements */
      .framer-19yv87c .framer-10c26e3,
      .framer-19yv87c .framer-1w04qn0,
      .framer-19yv87c .framer-s7qxlq,
      .framer-19yv87c .framer-5r7my2,
      .framer-19yv87c .framer-1q8loet,
      .framer-19yv87c .framer-1g7fzf3 {
        display: none !important;
      }

      /* ── 5. IMMERSIVE STATS & LARGE PRESIDENT PHOTO ── */
      .muun-custom-about {
        width: 100% !important;
        max-width: 1280px !important;
        overflow: visible !important;
        margin: 0 auto !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 40px !important;
        box-sizing: border-box !important;
      }

      .muun-stats-grid {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 20px !important;
        width: 100% !important;
      }

      @media (max-width: 992px) {
        .muun-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }

      @media (max-width: 600px) {
        .muun-stats-grid { grid-template-columns: 1fr !important; }
      }

      .muun-stat-card {
        position: relative !important;
        background: linear-gradient(135deg, rgba(10, 50, 81, 0.45) 0%, rgba(6, 21, 36, 0.75) 100%) !important;
        border: 1px solid rgba(41, 170, 225, 0.22) !important;
        border-radius: 20px !important;
        padding: 36px 32px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
        overflow: hidden !important;
      }

      .muun-stat-card::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        height: 2px !important;
        background: linear-gradient(90deg, transparent, rgba(41, 170, 225, 0.6), transparent) !important;
        opacity: 0 !important;
        transition: opacity 0.35s ease !important;
      }

      .muun-stat-card:hover {
        transform: translateY(-5px) !important;
        border-color: rgba(41, 170, 225, 0.5) !important;
        box-shadow: 0 22px 45px rgba(0, 0, 0, 0.6), 0 0 30px rgba(41, 170, 225, 0.25) !important;
      }

      .muun-stat-card:hover::before {
        opacity: 1 !important;
      }

      .muun-stat-num {
        font-family: "Inter Display", "Inter", sans-serif !important;
        font-size: clamp(38px, 3.4vw, 50px) !important;
        font-weight: 800 !important;
        line-height: 1.1 !important;
        color: #FFFFFF !important;
        margin: 0 0 12px 0 !important;
        letter-spacing: -0.03em !important;
        text-shadow: 0 0 25px rgba(41, 170, 225, 0.45) !important;
        display: flex !important;
        align-items: baseline !important;
        gap: 4px !important;
      }

      .muun-stat-num .suffix {
        font-size: 0.8em !important;
        color: #29AAE1 !important;
        font-weight: 800 !important;
      }

      .muun-stat-desc {
        font-family: "Inter", sans-serif !important;
        font-size: 15px !important;
        font-weight: 500 !important;
        line-height: 1.5 !important;
        color: rgba(224, 242, 254, 0.8) !important;
        margin: 0 !important;
      }

      /* Presidential Card - MASSIVE PHOTO & BALANCED SIDES */
      .muun-pres-card {
        position: relative !important;
        background: linear-gradient(135deg, rgba(10, 50, 81, 0.5) 0%, rgba(6, 21, 36, 0.88) 100%) !important;
        border: 1px solid rgba(41, 170, 225, 0.28) !important;
        border-radius: 28px !important;
        padding: 40px !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: stretch !important;
        justify-content: space-between !important;
        gap: 40px !important;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        overflow: hidden !important;
      }

      .muun-pres-quote-side {
        flex: 1 !important;
        min-width: 320px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        position: relative !important;
        z-index: 2 !important;
        padding-right: 15px !important;
      }

      .muun-quote-icon {
        width: 44px !important;
        height: 44px !important;
        color: #29AAE1 !important;
        opacity: 0.4 !important;
        margin-bottom: 20px !important;
      }

      .muun-pres-quote {
        margin: 0 !important;
        padding: 0 !important;
        font-family: "Inter", sans-serif !important;
        font-size: clamp(17px, 1.5vw, 20px) !important;
        font-weight: 500 !important;
        line-height: 1.7 !important;
        color: #FFFFFF !important;
        font-style: italic !important;
      }

      .muun-pres-author {
        margin-top: 28px !important;
      }

      .muun-pres-name {
        font-family: "Inter Display", "Inter", sans-serif !important;
        font-size: 22px !important;
        font-weight: 700 !important;
        color: #FFFFFF !important;
        letter-spacing: -0.02em !important;
      }

      .muun-pres-kicker {
        font-family: "Inter", sans-serif !important;
        font-size: 13.5px !important;
        font-weight: 600 !important;
        color: #29AAE1 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.06em !important;
        margin-top: 6px !important;
      }

      .muun-pres-photo-side {
        flex: 1.4 !important;
        min-width: 420px !important;
        max-width: 650px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 2 !important;
      }

      .muun-pres-photo {
        width: 100% !important;
        height: 100% !important;
        min-height: 480px !important;
        max-height: 580px !important;
        object-fit: cover !important;
        object-position: center 20% !important;
        border-radius: 22px !important;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        display: block !important;
      }

      .muun-regions {
        width: min(1000px, 88vw) !important;
        max-width: none !important;
        margin: 28px 0 0 !important;
        position: relative !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        background: none !important;
        border: none !important;
        padding: 0 !important;
        box-shadow: none !important;
      }
      .muun-regions #kyrgyzstan-vector-map {
        width: 100% !important;
        max-width: none !important;
        height: auto !important;
        display: block !important;
      }

      @media (max-width: 960px) {
        .muun-pres-card {
          flex-direction: column !important;
          padding: 32px 24px !important;
          gap: 32px !important;
        }
        .muun-pres-quote-side {
          min-width: 0 !important;
          padding-right: 0 !important;
        }
        .muun-pres-photo-side {
          max-width: 100% !important;
          width: 100% !important;
          min-width: 0 !important;
        }
        .muun-pres-photo {
          min-height: 240px !important;
          max-height: 360px !important;
        }
      }

      /* ==============================================================
         FOOTER CUSTOMIZATIONS (User requests 1, 2, 3, 4)
         ============================================================== */
      /* 1. Hide "Social" label */
      .framer-17tcu0s,
      [data-framer-name="Social"] {
        display: none !important;
      }

      /* 1b. Social Icons Links neutralized */
      /* 1b. Social Icons Links neutralized & styled */
      .framer-1dhn2g1 {
        display: flex !important;
        flex-flow: row nowrap !important;
        align-items: center !important;
        width: max-content !important;
        gap: 12px !important;
      }
      .framer-1dhn2g1 a,
      .framer-1p7sii6, .framer-zdafop, .framer-nwu7er, .framer-1l4gi3g {
        background: rgba(255, 255, 255, 0.08) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        border-radius: 50% !important;
        width: 40px !important;
        height: 40px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: all 0.2s ease !important;
        cursor: default !important;
      }
      .framer-1dhn2g1 a:hover,
      .framer-1p7sii6:hover, .framer-zdafop:hover, .framer-nwu7er:hover, .framer-1l4gi3g:hover {
        background: rgba(41, 170, 225, 0.18) !important;
        border-color: rgba(41, 170, 225, 0.5) !important;
      }

      /* 1c. Footer Navigation Buttons Layout */
      .framer-RYOK6 .framer-1a0e2lt {
        flex-wrap: wrap !important;
        justify-content: flex-end !important;
        align-items: center !important;
        gap: 10px !important;
        width: auto !important;
        max-width: 100% !important;
      }

      /* 2. Footer Legal Links (Политика конфиденциальности & Договор оферты) */
      .framer-RYOK6 .framer-1xctxok {
        display: flex !important;
        flex-direction: row !important;
        justify-content: flex-start !important;
        align-items: center !important;
        width: 100% !important;
        overflow: visible !important;
      }
      .framer-RYOK6 .framer-spf60w,
      .framer-spf60w {
        flex: none !important;
        width: auto !important;
        max-width: 100% !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 32px !important;
        overflow: visible !important;
      }
      .framer-RYOK6 .framer-1ie1jya,
      .framer-RYOK6 .framer-b79ppf,
      .framer-RYOK6 .framer-18tis13 {
        flex: none !important;
        width: auto !important;
        height: auto !important;
        display: inline-flex !important;
        align-items: center !important;
        overflow: visible !important;
        text-decoration: none !important;
      }
      .framer-RYOK6 .framer-1ie1jya p,
      .framer-RYOK6 .framer-1ie1jya a,
      .framer-RYOK6 .framer-18tis13 p,
      .framer-RYOK6 .framer-18tis13 a,
      .framer-RYOK6 .framer-b79ppf,
      .framer-RYOK6 .framer-b79ppf p {
        font-family: 'Inter', sans-serif !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        color: rgba(255, 255, 255, 0.6) !important;
        text-decoration: none !important;
        white-space: nowrap !important;
        transition: color 0.2s ease !important;
      }
      .framer-RYOK6 .framer-1ie1jya a:hover,
      .framer-RYOK6 .framer-18tis13 a:hover,
      .framer-RYOK6 .framer-b79ppf:hover,
      .framer-RYOK6 .framer-b79ppf:hover p {
        color: #29AAE1 !important;
      }

      /* 3. Hide Designed By Jitu Raut */
      .framer-1n7mxh0,
      a[href*="fremix.design"] {
        display: none !important;
      }

      /* 4. Bottom footer emblem — keep it compact so the footer stays short */
      footer.framer-RYOK6.framer-1el6i8r {
        padding-top: 56px !important;
        gap: 40px !important;
      }
      .framer-RYOK6 .framer-sdeuni,
      .framer-RYOK6 .framer-1nrybkz {
        gap: 32px !important;
      }
      .framer-RYOK6 .framer-3zho6a {
        height: 280px !important;
      }
      .framer-RYOK6 .framer-16fyxtb {
        aspect-ratio: auto !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        width: 100% !important;
        display: flex !important;
        justify-content: center !important;
        align-items: flex-end !important;
        mask: none !important;
        -webkit-mask: none !important;
        margin-top: 20px !important;
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
        position: relative !important;
        overflow: visible !important;
        pointer-events: none !important;
      }
      .framer-RYOK6 .framer-16fyxtb > div[data-framer-background-image-wrapper] {
        position: relative !important;
        width: 100% !important;
        max-width: 720px !important;
        height: auto !important;
        display: flex !important;
        justify-content: center !important;
        align-items: flex-end !important;
        inset: auto !important;
      }
      .framer-RYOK6 .framer-16fyxtb img {
        width: 100% !important;
        max-width: 720px !important;
        height: auto !important;
        display: block !important;
        object-fit: contain !important;
        object-position: bottom center !important;
        filter: drop-shadow(0 -6px 24px rgba(41, 170, 225, 0.28)) !important;
      }
      @media (max-width: 810px) {
        .framer-RYOK6 .framer-16fyxtb > div[data-framer-background-image-wrapper],
        .framer-RYOK6 .framer-16fyxtb img {
          max-width: 88vw !important;
        }
      }

      /* ── GLOBAL MOBILE ADAPTATION ── */
      html, body {
        overflow-x: hidden !important;
        max-width: 100% !important;
      }
      img, video {
        max-width: 100% !important;
      }

      @media (max-width: 992px) {
        .framer-10bvv2u,
        .framer-10bvv2u h2,
        .framer-1xmtadx,
        .framer-1xmtadx h2,
        .framer-17ylf30,
        .framer-17ylf30 h2,
        .framer-s11aph h2,
        .framer-19oyny3 h2,
        .framer-1q8loet h2,
        .framer-1npbtm4 h2,
        .muun-zones-title {
          white-space: normal !important;
          overflow-wrap: anywhere !important;
          word-break: break-word !important;
        }
        section[data-framer-name="FAQs"],
        .framer-xo1fg0,
        section.framer-19yv87c,
        .muun-thematic-zones-section,
        section[data-framer-name="Registration"],
        section[data-framer-name="About"],
        section[data-framer-name="For Whom?"],
        section[data-framer-name="Speakers"],
        section[data-framer-name="Agenda"],
        section[data-framer-name="Sponsors"] {
          padding-left: 18px !important;
          padding-right: 18px !important;
        }
      }

      @media (max-width: 810px) {
        header.framer-168cvbo {
          height: auto !important;
          min-height: 100svh !important;
          padding: 96px 16px 36px !important;
          justify-content: flex-start !important;
          overflow: hidden !important;
        }
        .framer-1pvbk64,
        .framer-kha8to {
          flex-direction: column !important;
          align-items: center !important;
          justify-content: flex-start !important;
          gap: 20px !important;
          width: 100% !important;
          max-width: 100% !important;
          padding: 0 !important;
        }
        figure.framer-f0om72 {
          width: 58vw !important;
          max-width: 260px !important;
          aspect-ratio: 2070 / 2260 !important;
          transform: none !important;
          order: -1 !important;
        }
        .framer-7sznpq {
          position: relative !important;
          left: auto !important;
          top: auto !important;
          transform: none !important;
          width: 100% !important;
          max-width: 100% !important;
          align-items: stretch !important;
        }
        .muun-hero-title {
          min-width: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          font-size: clamp(30px, 9.2vw, 42px) !important;
          line-height: 1.12 !important;
        }
        .muun-hero-subtitle {
          max-width: 100% !important;
          font-size: 15px !important;
          margin-top: 12px !important;
        }
        .muun-hero-buttons {
          flex-direction: column !important;
          align-items: stretch !important;
          width: 100% !important;
          max-width: 100% !important;
          flex-wrap: wrap !important;
          gap: 10px !important;
          margin-top: 18px !important;
        }
        .muun-hero-buttons .muun-btn,
        .muun-btn {
          width: 100% !important;
          text-align: center !important;
          box-sizing: border-box !important;
          padding: 14px 18px !important;
          font-size: 13.5px !important;
        }
        .muun-hero-ministry {
          max-width: 100% !important;
          width: 100% !important;
          align-items: center !important;
          gap: 14px !important;
          margin-top: 18px !important;
        }
        .muun-ministry-logo {
          height: 40px !important;
          max-width: 60px !important;
        }
        .muun-ministry-text {
          font-size: 14px !important;
        }
        .framer-poyw0 {
          position: relative !important;
          left: auto !important;
          right: auto !important;
          bottom: auto !important;
          width: 100% !important;
          padding: 20px 4px 8px !important;
          flex-direction: column !important;
          gap: 8px !important;
          align-items: center !important;
        }
        .muun-bottom-line { display: none !important; }
        .muun-bottom-date,
        .muun-bottom-loc {
          white-space: normal !important;
          text-align: center !important;
          font-size: 14px !important;
          line-height: 1.4 !important;
        }

        .framer-s11aph h2,
        .framer-19oyny3 h2,
        .framer-1q8loet h2,
        .framer-1npbtm4 h2,
        .muun-zones-title {
          font-size: clamp(26px, 7.4vw, 34px) !important;
        }
        .framer-10bvv2u h2,
        .framer-1xmtadx h2,
        .framer-17ylf30 h2,
        .framer-ostf7s h2,
        .muun-eco-partners-title {
          font-size: clamp(22px, 6.6vw, 30px) !important;
        }

        .muun-custom-about { gap: 24px !important; }
        .muun-stat-card { padding: 22px 18px !important; }
        .muun-pres-card { padding: 22px 16px !important; gap: 20px !important; }
        .muun-pres-photo { min-height: 220px !important; max-height: 280px !important; }
        .muun-pres-quote { font-size: 15px !important; }
        .muun-pres-name { font-size: 18px !important; }
        .muun-regions {
          width: 100vw !important;
          max-width: 100vw !important;
          margin-top: 12px !important;
          padding: 8px 10px 4px !important;
          box-sizing: border-box !important;
          background: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        .muun-regions #kyrgyzstan-vector-map {
          filter: none !important;
        }
        .muun-thematic-zones-section,
        section.framer-19yv87c {
          padding-top: 56px !important;
          padding-bottom: 36px !important;
          overflow: visible !important;
        }
        .muun-thematic-zones-container { overflow: visible !important; gap: 18px !important; }

        section[data-framer-name="For Whom?"] .framer-1mpnhrg,
        section[data-framer-name="For Whom?"] .framer-1dxlm5u,
        section[data-framer-name="For Whom?"] [data-framer-name="Text"] {
          padding: 16px 16px !important;
        }
        section[data-framer-name="For Whom?"] p {
          font-size: 14px !important;
        }

        [data-framer-name="Speakers"] [data-framer-name="Name"],
        [data-framer-name="Speakers"] [data-framer-name="Name"] h4,
        [data-framer-name="Speakers"] [data-framer-name="Designation"],
        [data-framer-name="Speakers"] [data-framer-name="Designation"] p {
          white-space: normal !important;
          overflow: visible !important;
          height: auto !important;
          max-height: none !important;
        }
        [data-framer-name="Speakers"] img {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }

        .muun-partner-card {
          height: 140px !important;
          min-height: 130px !important;
          padding: 18px 20px !important;
        }
        .muun-faq-item { padding: 16px 16px !important; border-radius: 18px !important; }
        .muun-faq-eagle-img { max-width: 220px !important; }
        .muun-zone-card { min-height: 0 !important; padding: 20px 18px !important; }

        .form-row {
          grid-template-columns: 1fr !important;
        }
        .reg-tabs-wrap {
          flex-direction: column !important;
        }
        .reg-tab-btn {
          width: 100% !important;
          font-size: 12.5px !important;
          padding: 12px 10px !important;
          white-space: normal !important;
          line-height: 1.3 !important;
        }
        .interests-grid {
          grid-template-columns: 1fr 1fr !important;
        }
        .consent-box {
          align-items: flex-start !important;
        }
        .muun-reg-card {
          padding: 20px 14px !important;
          max-width: 100% !important;
        }
        section[data-framer-name="Registration"] .framer-n7lw51 {
          max-width: 100% !important;
        }
        section[data-framer-name="Registration"] [data-framer-name="Content"],
        section[data-framer-name="Registration"] [data-framer-name="Cards"],
        section[data-framer-name="Registration"] .framer-n7lw51 {
          width: 100% !important;
          max-width: 100% !important;
          flex: none !important;
        }
        section[data-framer-name="Registration"] [data-framer-name="Sticky"],
        section[data-framer-name="Registration"] [data-framer-name="Graphic"],
        section[data-framer-name="Registration"] .framer-xqjflg,
        section[data-framer-name="Registration"] .framer-1v0ka20-container {
          position: relative !important;
          width: min(240px, 70vw) !important;
          max-width: 70vw !important;
          max-height: none !important;
          height: auto !important;
          overflow: visible !important;
          margin: 8px auto 16px !important;
          inset: auto !important;
          align-self: center !important;
        }
        section[data-framer-name="Registration"] video {
          width: 100% !important;
          height: auto !important;
          max-height: 220px !important;
          object-fit: contain !important;
        }

        .framer-RYOK6 .framer-1a0e2lt,
        footer nav {
          justify-content: flex-start !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
        }
        .framer-RYOK6 .framer-spf60w,
        .framer-spf60w {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 12px !important;
        }
        .framer-1dhn2g1 {
          flex-flow: row nowrap !important;
          width: max-content !important;
          max-width: 100% !important;
        }

        .muun-lang-switcher {
          bottom: 12px !important;
          right: 12px !important;
          padding: 8px 12px !important;
          gap: 6px !important;
        }
      }

      @media (max-width: 480px) {
        .interests-grid { grid-template-columns: 1fr !important; }
        .interest-chip { width: 100% !important; }
        header.framer-168cvbo { padding: 88px 14px 28px !important; }
      }
    </style>

    <template id="muun-faq-tpl">${faqListHtml}</template>
    <template id="muun-zones-tpl">${thematicZonesHtml}</template>
    <template id="muun-reg-form-tpl">${regFormHtml}</template>
    <template id="muun-target-tabs-tpl">${targetTabsHtml}</template>
    <template id="muun-about-tpl">
      ${customAboutHtml}
    </template>

    <script>
      window.selectKyrgyzRegion = function(regId, btn) {
        document.querySelectorAll('.kg-region-path').forEach(function(p) { p.classList.remove('active'); });
        document.querySelectorAll('.muun-reg-pill, .reg-pill').forEach(function(p) { p.classList.remove('is-active'); p.classList.remove('active'); });
        if (btn) btn.classList.add(btn.classList.contains('muun-reg-pill') ? 'is-active' : 'active');
        if (regId === 'all') return;
        var pathId = regId === 'osh-city' ? 'osh-obl' : regId;
        var activePath = document.querySelector('.kg-region-path[data-region="' + pathId + '"]');
        if (activePath) activePath.classList.add('active');
      };
      ${programClientJs}
      (function() {
        const META_TITLE = ${JSON.stringify(metaTitle)};
        const LOC_TITLE = ${JSON.stringify(loc.title)};
        const LOC_SUBTITLE = ${JSON.stringify(loc.subtitle)};
        const LOC_DATE = ${JSON.stringify(loc.date)};
        const LOC_LOCATION = ${JSON.stringify(loc.location)};
        const LOC_BTN1 = ${JSON.stringify(loc.btnPrimary)};
        const LOC_BTN2 = ${JSON.stringify(loc.btnSecondary)};
        const LOC_MINISTRY = ${JSON.stringify(loc.ministry)};

        const HEADINGS = ${JSON.stringify(hd)};
        const TARGET_AUDIENCE_DATA = ${JSON.stringify(targetAudienceItems)};

        function initTargetCards(items) {
          const container = document.querySelector('.muun-for-whom-container');
          if (!container || !Array.isArray(items)) return;
          const cards = container.querySelectorAll('.muun-framer-card');
          const descText = container.querySelector('.muun-desc-text');

          function selectCard(idx) {
            if (!items[idx]) return;
            cards.forEach(function(c, i) {
              const isAct = i === idx;
              c.classList.toggle('is-active', isAct);
              c.classList.toggle('framer-v-1wn31oz', isAct);
              c.classList.toggle('framer-v-6klljf', !isAct);
              c.setAttribute('data-framer-name', isAct ? 'Clicked' : 'Square');
              c.setAttribute('aria-pressed', isAct ? 'true' : 'false');
              const cube = c.querySelector('.framer-vdq0vg');
              if (cube) cube.style.display = isAct ? 'block' : 'none';
            });

            if (descText) {
              descText.style.opacity = '0';
              descText.style.transform = 'translateY(4px)';
              setTimeout(function() {
                descText.textContent = items[idx].desc;
                descText.style.opacity = '1';
                descText.style.transform = 'translateY(0)';
              }, 120);
            }
          }

          cards.forEach(function(card, idx) {
            card.onclick = function() { selectCard(idx); };
            card.onkeydown = function(e) {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectCard(idx);
              }
            };
          });
        }

        const TRANSLATIONS = {
          'Speaker': "${t['nav.speakers'] || t['nav.participants'] || 'Спикеры'}",
          'Agenda': "${t['nav.program'] || 'Программа'}",
          'Venue': "${t['nav.venue'] || 'Площадка'}",
          'Contact': "${t['nav.contact'] || 'Контакты'}",
          'Get Ticket': "${t['hero.cta_register'] || 'Регистрация'}",
          
          'About Aicron': HEADINGS.about.kicker,
          'For Whom?': HEADINGS.target.kicker,
          'Speakers': HEADINGS.speakers.kicker,
          'Event agenda': HEADINGS.agenda.kicker,
          'Questions': HEADINGS.faq.kicker,
          'Our Host': HEADINGS.zones.title,
          'Frequently Asked Questions': HEADINGS.faq.titleText,
          'All the Important Details Before Attending AIcron Tech Summit': HEADINGS.faq.titleText,
          'Meet Our Hosts: The Visionaries Behind AIcron Tech Summit': HEADINGS.zones.title,
          'Sponsorship': HEADINGS.partners.kicker,
          'Meet out sponsors who help to bring this think live': HEADINGS.partners.titleText,
          'Registration': HEADINGS.registration.kicker,
          'Secure Your Spot at AIcron Tech Summit Today!': HEADINGS.registration.titleText,
          'Secure Your Spot at Alcron Tech Summit Today!': HEADINGS.registration.titleText,
          'Secure Your Spot Today!': HEADINGS.registration.titleText,
          
          'Kickoff': "${lang === 'ky' ? 'Башталыш' : lang === 'en' ? 'Kickoff' : 'Старт'}",
          'Day 1: Main Conference': "${lang === 'ky' ? '1-күн: Негизги программа' : lang === 'en' ? 'Day 1: Main Program' : 'День 1: Главная программа'}",
          'Day 2: Closing & Awards': "${lang === 'ky' ? '2-күн: Сыйлыктар жана жыйынтык' : lang === 'en' ? 'Day 2: Closing & Awards' : 'День 2: Награждение и закрытие'}",
          'Opening Remarks': "${lang === 'ky' ? 'Салтанаттуу ачылыш' : lang === 'en' ? 'Opening Remarks' : 'Торжественное открытие'}",

          'Sponsors': "${t['nav.partnership'] || 'Партнеры'}",
          'FAQ': "${t['nav.faq'] || 'Вопрос-Ответ'}",
          'Frequently Asked Questions': "${lang === 'ky' ? 'Көп берилүүчү суроолор' : lang === 'en' ? 'Frequently Asked Questions' : 'Часто задаваемые вопросы'}",
          'Join Us at AIcron Tech Summit': "${t['hero.cta_register'] || 'Регистрация'}",
          'Ready to dive into the future of AI?': "${lang === 'ky' ? 'Келечекке кадам таштоого даярсызбы?' : lang === 'en' ? 'Ready to dive into the future of professions?' : 'Готовы погрузиться в мир новых возможностей?'}",

          '20+ Speakers': "${lang === 'ky' ? 'Спикерлер' : lang === 'en' ? 'Speakers' : 'Спикеры'}",
          '200+ Speakers': "${lang === 'ky' ? 'Спикерлер' : lang === 'en' ? 'Speakers' : 'Спикеры'}",
          '20+ Спикерыs': "${lang === 'ky' ? 'Спикерлер' : lang === 'en' ? 'Speakers' : 'Спикеры'}",
          'See All': "${lang === 'ky' ? 'Баарын көрүү' : lang === 'en' ? 'See All' : 'Смотреть всех'}",
          'See all': "${lang === 'ky' ? 'Баарын көрүү' : lang === 'en' ? 'See All' : 'Смотреть всех'}",
          'Смотреть все': "${lang === 'ky' ? 'Баарын көрүү' : lang === 'en' ? 'See All' : 'Смотреть всех'}"
        };

        // Smooth counter animation handling
        let countersBound = false;
        function initCounters() {
          const grid = document.querySelector('.muun-stats-grid');
          if (!grid || countersBound) return;
          countersBound = true;

          const counters = grid.querySelectorAll('.muun-counter');
          let isRunning = false;

          function runAnimation() {
            if (isRunning) return;
            isRunning = true;

            const startTime = performance.now();
            const duration = 2200;

            function step(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

              counters.forEach(el => {
                const target = +el.getAttribute('data-target');
                const val = Math.round(target * ease);
                el.textContent = val >= 1000 ? val.toLocaleString('ru-RU').replace(/,/g, ' ') : val;
              });

              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                counters.forEach(el => {
                  const target = +el.getAttribute('data-target');
                  el.textContent = target >= 1000 ? target.toLocaleString('ru-RU').replace(/,/g, ' ') : target;
                });
                isRunning = false;
              }
            }

            requestAnimationFrame(step);
          }

          function resetAnimation() {
            isRunning = false;
            counters.forEach(el => {
              el.textContent = '0';
            });
          }

          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                runAnimation();
              } else {
                resetAnimation();
              }
            });
          }, { threshold: 0.15 });

          observer.observe(grid);
        }

        // Full registration tab switcher and submission logic
        ${getRegistrationClientJs(lang, t)}

        // 3. Navigation Update: All 7 links in order with native roll-up hover animation
        function updateNav() {
          const navContainers = document.querySelectorAll('nav.framer-1s42b8a, nav.framer-1a0e2lt, .site-header-nav-list');
          navContainers.forEach(navContainer => {
            const navItems = [
              { href: "/${lang}/speakers", label: "${t['nav.speakers'] || 'Спикеры'}" },
              { href: "/${lang}/program", label: "${t['nav.program'] || 'Программа'}" },
              { href: "/${lang}/venue", label: "${t['nav.venue'] || 'Площадка'}" },
              { href: "/${lang}/news", label: "${t['nav.news'] || 'Новости'}" },
              { href: "/${lang}/press", label: "${t['nav.press'] || 'Пресс-центр'}" },
              { href: "/${lang}/contacts", label: "${t['nav.contact'] || 'Контакты'}" }
            ];

            const currentLinks = Array.from(navContainer.querySelectorAll('a.framer-npy4b'));
            const currentLabels = currentLinks.map(a => {
              const p = a.querySelector('.framer-1dl5625 p');
              return p ? p.textContent.trim() : a.textContent.trim();
            });
            const expectedLabels = navItems.map(n => n.label);

            if (currentLabels.join('|') !== expectedLabels.join('|') || currentLinks.length !== navItems.length) {
              navContainer.innerHTML = '';
              navItems.forEach(item => {
                const wrap = document.createElement('div');
                wrap.className = 'framer-nav-item-wrap';
                wrap.style.cssText = 'opacity:1;transform:none;flex:none;position:relative;';
                wrap.innerHTML = 
                  '<a class="framer-npy4b framer-mxN0T framer-ikziiq framer-v-ikziiq framer-115tijb" data-framer-name="Light" href="' + item.href + '" tabindex="0" style="background-color:var(--token-9a7303fe-2324-4aa1-bbd4-e1f1d449de82, rgba(255, 255, 255, 0.12));border-bottom-left-radius:100px;border-bottom-right-radius:100px;border-top-left-radius:100px;border-top-right-radius:100px">' +
                    '<div class="framer-295hd4" data-framer-name="BG" style="background-color:var(--token-9a7303fe-2324-4aa1-bbd4-e1f1d449de82, rgba(255, 255, 255, 0.12));border-bottom-left-radius:100px;border-bottom-right-radius:100px;border-top-left-radius:100px;border-top-right-radius:100px"></div>' +
                    '<div class="framer-1dl5625" data-framer-name="Label" data-framer-component-type="RichTextContainer" style="--extracted-r6o4lv:var(--token-873fb35c-2084-47f0-9254-cb5d8b65f475, rgb(255, 255, 255));--framer-link-text-color:rgb(0, 153, 255);--framer-link-text-decoration:underline;transform:none">' +
                      '<p class="framer-text framer-styles-preset-dsr0r" data-styles-preset="Erxl6HnxD" style="--framer-text-color:var(--extracted-r6o4lv, var(--token-873fb35c-2084-47f0-9254-cb5d8b65f475, rgb(255, 255, 255)));font-size:16px;font-weight:500;">' + item.label + '</p>' +
                    '</div>' +
                    '<div class="framer-mvpx8f" data-framer-name="Another one" style="background-color:var(--token-dc631f8a-4140-47df-884a-ed562fa8ef1a, rgb(41, 170, 225));border-bottom-left-radius:100px;border-bottom-right-radius:100px;border-top-left-radius:100px;border-top-right-radius:100px"></div>' +
                    '<div class="framer-shp3q0" data-framer-name="Label" data-framer-component-type="RichTextContainer" style="--framer-link-text-color:rgb(0, 153, 255);--framer-link-text-decoration:underline;transform:translateX(-50%)">' +
                      '<p class="framer-text framer-styles-preset-dsr0r" data-styles-preset="Erxl6HnxD" style="color:#ffffff;font-size:16px;font-weight:500;">' + item.label + '</p>' +
                    '</div>' +
                  '</a>';
                const a = wrap.querySelector('a');
                a.addEventListener('mouseenter', () => a.classList.add('hover'));
                a.addEventListener('mouseleave', () => a.classList.remove('hover'));
                navContainer.appendChild(wrap);
              });
            }
          });

          // Ensure in-page anchor section IDs
          const aboutSec = document.querySelector('section[data-framer-name="About"]');
          if (aboutSec && !aboutSec.id) aboutSec.id = 'about';
          const targetSec = document.querySelector('section[data-framer-name="For Whom?"]');
          if (targetSec && !targetSec.id) targetSec.id = 'target';
          const speakersSec = document.querySelector('section[data-framer-name="Speakers"]');
          if (speakersSec && !speakersSec.id) speakersSec.id = 'speakers';
          const agendaSec = document.querySelector('section[data-framer-name="Agenda"]');
          if (agendaSec && !agendaSec.id) agendaSec.id = 'program';
          const hostsSec = document.querySelector('section[data-framer-name="Host"]');
          if (hostsSec) hostsSec.id = 'venue';
          const faqSec = document.querySelector('section[data-framer-name="FAQs"]');
          if (faqSec && !faqSec.id) faqSec.id = 'faq';
          const regSectionEl = document.querySelector('section[data-framer-name="Registration"]');
          if (regSectionEl) regSectionEl.id = 'tickets';
          const footerEl = document.querySelector('footer');
          if (footerEl && !footerEl.id) footerEl.id = 'contact';
        }

        function fixHydration() {
          if (document.title !== META_TITLE) document.title = META_TITLE;

          // 1. Text translations
          document.querySelectorAll('a, p, span, h1, h2, h3, h4, div').forEach(el => {
            if (el.children.length === 0) {
              const txt = el.textContent.trim();
              if (TRANSLATIONS[txt] && el.textContent !== TRANSLATIONS[txt]) {
                el.innerHTML = TRANSLATIONS[txt];
              }
            }
          });

          // 2. Hide unwanted elements
          const unwanted = document.querySelectorAll(
            'header.framer-168cvbo figure:not([data-framer-name="Event Name"]), ' +
            'header.framer-168cvbo .framer-1rid37y, ' +
            'header.framer-168cvbo .framer-8bnuea, ' +
            'header.framer-168cvbo .framer-okpf4l, ' +
            'header.framer-168cvbo [data-framer-name*="Cube"], ' +
            'header.framer-168cvbo [data-framer-name*="Triangle"], ' +
            '.framer-at8k3b, .framer-1wtuexu, .framer-udrc98-container, ' +
            '.framer-k6an6u, .framer-1cgsc4r, ' +
            '.framer-1joz9r6, .framer-18v3bwc, ' +
            '#__framer-badge-container, a[href*="framer.com"]'
          );
          unwanted.forEach(el => {
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('opacity', '0', 'important');
            el.style.setProperty('pointer-events', 'none', 'important');
          });

          // 3. Hero Bottom Bar
          const bottomBar = document.querySelector('.framer-poyw0');
          if (bottomBar && !bottomBar.querySelector('.muun-bottom-date')) {
            bottomBar.innerHTML = 
              '<div class="muun-bottom-date">' + LOC_DATE + '</div>' +
              '<div class="muun-bottom-line"></div>' +
              '<div class="muun-bottom-loc">' + LOC_LOCATION + '</div>';
          } else if (bottomBar) {
            const dateEl = bottomBar.querySelector('.muun-bottom-date');
            const locEl = bottomBar.querySelector('.muun-bottom-loc');
            if (dateEl && dateEl.textContent !== LOC_DATE) dateEl.textContent = LOC_DATE;
            if (locEl && locEl.textContent !== LOC_LOCATION) locEl.textContent = LOC_LOCATION;
          }
          
          // 4. Hero Title, Subtitle, Buttons, and Ministry Endorsement
          const heroTextContainer = document.querySelector('.framer-7sznpq');
          if (heroTextContainer) {
            if (!heroTextContainer.querySelector('.muun-hero-title') || !heroTextContainer.querySelector('.muun-hero-ministry')) {
              heroTextContainer.innerHTML = 
                '<h1 class="muun-hero-title">' + LOC_TITLE + '</h1>' +
                '<p class="muun-hero-subtitle">' + LOC_SUBTITLE + '</p>' +
                '<div class="muun-hero-buttons">' +
                  '<a href="#participant" onclick="window.openParticipantModal(); return false;" class="muun-btn muun-btn-primary">' + LOC_BTN1 + '</a>' +
                  '<a href="#tickets" class="muun-btn muun-btn-secondary">' + LOC_BTN2 + '</a>' +
                '</div>' +
                '<div class="muun-hero-ministry">' +
                  '<img src="/assets/ministry-logo-white.png" alt="' + LOC_MINISTRY + '" class="muun-ministry-logo" />' +
                  '<span class="muun-ministry-text">' + LOC_MINISTRY + '</span>' +
                '</div>';
            } else {
              const minTextEl = heroTextContainer.querySelector('.muun-ministry-text');
              if (minTextEl && minTextEl.innerHTML !== LOC_MINISTRY) {
                minTextEl.innerHTML = LOC_MINISTRY;
              }
              const minImgEl = heroTextContainer.querySelector('.muun-ministry-logo');
              if (minImgEl && !minImgEl.src.includes('ministry-logo-white.png')) {
                minImgEl.src = '/assets/ministry-logo-white.png';
              }
            }
          }

          const mainHeader = document.querySelector('header.framer-168cvbo');
          if (mainHeader && heroTextContainer && bottomBar) {
            if (heroTextContainer.parentNode !== mainHeader) mainHeader.appendChild(heroTextContainer);
            if (bottomBar.parentNode !== mainHeader) mainHeader.appendChild(bottomBar);
          }

          // 5. Top Left Logo
          const logoLinks = document.querySelectorAll('img[src*="tJ1jqpEOBL9Nna5facx9Yh1rSA.svg"], img[src*="logo-header"], img[src*="logo-new"]');
          logoLinks.forEach(img => {
            if (!img.src.includes('logo-header.png')) {
              img.src = '/assets/logo-header.png';
              if(img.hasAttribute('srcset')) img.removeAttribute('srcset');
            }
            img.style.setProperty('max-height', '50px', 'important');
            img.style.setProperty('margin-left', '18px', 'important');
            img.style.setProperty('height', '100%', 'important');
            img.style.setProperty('width', 'auto', 'important');
            img.style.setProperty('max-width', '230px', 'important');
            img.style.setProperty('object-fit', 'contain', 'important');
            img.style.setProperty('object-position', 'left center', 'important');
            
            const a = img.closest('a');
            if (a) {
              const scrollNav = !!(a.closest('nav') && a.closest('nav').getAttribute('data-framer-name') === 'Phone Scroll');
              const narrow = window.innerWidth <= 810 && scrollNav;
              a.style.setProperty('width', narrow ? '160px' : '230px', 'important');
              a.style.setProperty('height', narrow ? '48px' : '54px', 'important');
              a.style.setProperty('max-width', narrow ? '42vw' : 'none', 'important');
              a.style.setProperty('flex', '0 0 auto', 'important');
              a.style.setProperty('display', 'flex', 'important');
              a.style.setProperty('align-items', 'center', 'important');
              a.style.setProperty('justify-content', 'flex-start', 'important');
              a.style.setProperty('position', 'relative', 'important');
              if (narrow) img.style.setProperty('height', '45px', 'important');
              a.setAttribute('href', "/${lang}/");
              a.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "/${lang}/";
                return false;
              };
              if (a.parentElement) {
                a.parentElement.style.setProperty('overflow', 'visible', 'important');
                if (window.innerWidth <= 810) {
                  a.parentElement.style.setProperty('width', '100%', 'important');
                  a.parentElement.style.setProperty('min-width', '0', 'important');
                  a.parentElement.style.setProperty('justify-content', 'space-between', 'important');
                  a.parentElement.style.setProperty('align-items', 'center', 'important');
                } else {
                  a.parentElement.style.setProperty('width', 'auto', 'important');
                  a.parentElement.style.setProperty('min-width', '195px', 'important');
                }
              }
            }
          });

          // 6. Central Logo Crystal
          const mainLogos = document.querySelectorAll('figure.framer-f0om72 img');
          mainLogos.forEach(img => {
            if (!img.src.includes('logo-crystal.png')) {
              img.src = '/assets/logo-crystal.png';
              if(img.hasAttribute('srcset')) img.removeAttribute('srcset');
            }
          });

          // 7. SECTION HEADINGS (WHITE + GREY SPLIT)
          // 7a. About section - strictly scoped to About section
          const aboutSec = document.querySelector('section[data-framer-name="About"], #about');
          if (aboutSec) {
            const aboutTitleH2 = aboutSec.querySelector('.framer-s11aph h2, h2');
            if (aboutTitleH2 && aboutTitleH2.innerHTML !== HEADINGS.about.titleHtml) {
              aboutTitleH2.innerHTML = HEADINGS.about.titleHtml;
            }
            const aboutKickerH4 = aboutSec.querySelector('.framer-5zw0lw h4, .framer-1f4tdby-container h4');
            if (aboutKickerH4 && aboutKickerH4.textContent.trim() !== HEADINGS.about.kicker) {
              aboutKickerH4.textContent = HEADINGS.about.kicker;
            }
          }

          // 7b. For Whom section - strictly scoped to For Whom section
          const targetSec = document.querySelector('section[data-framer-name="For Whom?"], #target');
          if (targetSec) {
            const targetTitleH2 = targetSec.querySelector('.framer-10bvv2u h2, h2');
            if (targetTitleH2 && targetTitleH2.innerHTML !== HEADINGS.target.titleHtml) {
              targetTitleH2.innerHTML = HEADINGS.target.titleHtml;
            }
            const targetKickerH4 = targetSec.querySelector('.framer-5zw0lw h4, .framer-lgsf0-container h4');
            if (targetKickerH4 && targetKickerH4.textContent.trim() !== HEADINGS.target.kicker) {
              targetKickerH4.textContent = HEADINGS.target.kicker;
            }
          }

          // 7c. Ticker (running marquee)
          const tickerH2s = document.querySelectorAll('.framer-1ees0g7 h2, div[data-framer-name="Ticker"] h2');
          tickerH2s.forEach(h2 => {
            if (h2.textContent.trim() !== HEADINGS.ticker.trim()) {
              h2.textContent = HEADINGS.ticker;
            }
          });

          // 7d. Speakers section — every breakpoint copy
          document.querySelectorAll('h2').forEach(h2 => {
            const t = h2.textContent;
            if (t.includes('Absolutely')) h2.innerHTML = HEADINGS.about.titleHtml;
            else if (t.includes('Definitely')) h2.innerHTML = HEADINGS.target.titleHtml;
            else if (t.includes('Esteemed') || t.includes('Thought Leaders')) h2.innerHTML = HEADINGS.speakers.titleHtml;
            else if (t.includes('Discover the Full') || t.includes('Event Agenda')) h2.innerHTML = HEADINGS.agenda.titleHtml;
          });
          const speakersTitleH2 = document.querySelector('.framer-1xmtadx h2');
          if (speakersTitleH2 && speakersTitleH2.innerHTML !== HEADINGS.speakers.titleHtml) {
            speakersTitleH2.innerHTML = HEADINGS.speakers.titleHtml;
          }
          const speakersKickerH4 = document.querySelector('.framer-1tnxaas h4');
          if (speakersKickerH4 && speakersKickerH4.textContent.trim() !== HEADINGS.speakers.kicker) {
            speakersKickerH4.textContent = HEADINGS.speakers.kicker;
          }

          // 7e. Event agenda section
          const agendaTitleH2 = document.querySelector('.framer-17ylf30 h2');
          if (agendaTitleH2 && agendaTitleH2.innerHTML !== HEADINGS.agenda.titleHtml) {
            agendaTitleH2.innerHTML = HEADINGS.agenda.titleHtml;
          }
          const agendaKickers = document.querySelectorAll('.framer-17ylf30 h4, .framer-1v2aywf h4');
          agendaKickers.forEach(h4 => {
            if (h4.textContent.includes('Event agenda')) {
              h4.textContent = HEADINGS.agenda.kicker;
            }
          });

          // 7f. FAQ section Title & Kicker
          const faqTitleH2 = document.querySelector('.framer-19oyny3 h2');
          if (faqTitleH2 && faqTitleH2.innerHTML !== HEADINGS.faq.titleHtml) {
            faqTitleH2.innerHTML = HEADINGS.faq.titleHtml;
          }
          const faqKickerH4 = document.querySelector('.framer-1v0wodp-container h4');
          if (faqKickerH4 && faqKickerH4.textContent.trim() !== HEADINGS.faq.kicker) {
            faqKickerH4.textContent = HEADINGS.faq.kicker;
          }

          // FAQ Accordion
          const faqContainer = document.querySelector('.framer-rs1smy');
          if (faqContainer && !faqContainer.querySelector('.muun-faq-accordion')) {
            const tpl = document.getElementById('muun-faq-tpl');
            if (tpl) {
              faqContainer.innerHTML = '';
              faqContainer.appendChild(tpl.content.cloneNode(true));
            }
          }

          // Thematic Zones (replacing Host)
          const hostSec = document.querySelector('section[data-framer-name="Host"], .framer-19yv87c');
          if (hostSec) {
            if (hostSec.id !== 'venue') hostSec.id = 'venue';
            if (!hostSec.querySelector('.muun-zones-grid')) {
              const tpl = document.getElementById('muun-zones-tpl');
              if (tpl) {
                hostSec.innerHTML = '';
                hostSec.appendChild(tpl.content.cloneNode(true));
              }
            }
          }

          // 7g. Partners (Sponsors) section
          const partnersTitleH2 = document.querySelector('.framer-ostf7s h2');
          if (partnersTitleH2 && partnersTitleH2.innerHTML !== HEADINGS.partners.titleHtml) {
            partnersTitleH2.innerHTML = HEADINGS.partners.titleHtml;
          }
          const partnersKickerH4 = document.querySelector('.framer-v0m3u0 .framer-5zw0lw h4');
          if (partnersKickerH4 && partnersKickerH4.textContent.trim() !== HEADINGS.partners.kicker) {
            partnersKickerH4.textContent = HEADINGS.partners.kicker;
          }

          // 7h. Registration section Title & Kicker & Form
          const regSec = document.querySelector('section[data-framer-name="Registration"], #tickets');
          if (regSec) {
            if (regSec.id !== 'tickets') regSec.id = 'tickets';
            const regTitleH2 = regSec.querySelector('.framer-1npbtm4 h2');
            if (regTitleH2 && regTitleH2.innerHTML !== HEADINGS.registration.titleHtml) {
              regTitleH2.innerHTML = HEADINGS.registration.titleHtml;
            }
            const regKickerH4 = regSec.querySelector('.framer-17e9nqz-container h4, .framer-5zw0lw h4');
            if (regKickerH4 && regKickerH4.textContent.trim() !== HEADINGS.registration.kicker) {
              regKickerH4.textContent = HEADINGS.registration.kicker;
            }

            // Replace pricing cards with free registration form
            const regCards = regSec.querySelector('.framer-n7lw51');
            if (regCards && !regCards.querySelector('.muun-reg-card')) {
              const tpl = document.getElementById('muun-reg-form-tpl');
              if (tpl) {
                regCards.innerHTML = '';
                regCards.appendChild(tpl.content.cloneNode(true));
              }
            }
          }

          // 8. FOR WHOM TABS (6 CATEGORIES): INITIALIZE INTERACTIVE CARDS & TEMPLATE FALLBACK
          const targetContent = document.querySelector('section[data-framer-name="For Whom?"] .framer-mu05uw');
          if (targetContent) {
            const oldFramerContainer = targetContent.querySelector('.framer-9wjni4-container');
            if (oldFramerContainer) {
              oldFramerContainer.style.setProperty('display', 'none', 'important');
            }
            let forWhomEl = targetContent.querySelector('.muun-for-whom-container');
            if (!forWhomEl) {
              const tpl = document.getElementById('muun-target-tabs-tpl');
              if (tpl) {
                targetContent.appendChild(tpl.content.cloneNode(true));
                forWhomEl = targetContent.querySelector('.muun-for-whom-container');
              }
            }
            if (forWhomEl && !forWhomEl.hasAttribute('data-initialized')) {
              forWhomEl.setAttribute('data-initialized', 'true');
              initTargetCards(TARGET_AUDIENCE_DATA);
            }
          }

          // 10. Program block (shared with /program)
          ${programFixerJs(lang)}

          // 11. Inject Custom About Block (Counters + President)
          const aboutContainer = document.querySelector('.framer-iyfkd5');
          if (aboutContainer && !aboutContainer.querySelector('.muun-custom-about')) {
            const tpl = document.getElementById('muun-about-tpl');
            if (tpl) {
              const clone = tpl.content.cloneNode(true);
              aboutContainer.appendChild(clone);
              countersBound = false;
            }
          }
          initCounters();

          // 12. Update Navigation
          updateNav();

          // 13. Speakers on the home carousel (six cards)
          const HOME_SPEAKERS = ${JSON.stringify(homeSpeakerPeople(lang))};
          ${JSON.stringify(HOME_SPEAKER_SLOTS.map((slot) => slot.slot))}.forEach((slot, i) => {
            const person = HOME_SPEAKERS[i];
            document.querySelectorAll('section[data-framer-name="Speakers"] [data-framer-name="' + slot + '"]').forEach(root => {
              root.querySelectorAll('[data-framer-name="Name"] h4').forEach(h => {
                if (h.textContent !== person.name) h.textContent = person.name;
              });
              root.querySelectorAll('[data-framer-name="Designation"] p').forEach(p => {
                if (p.textContent !== person.role) p.textContent = person.role;
              });
              root.querySelectorAll('[data-framer-name="Image"] img').forEach(img => {
                if (img.closest('[data-framer-name="Blue Blur"]')) return;
                if (!img.getAttribute('src') || img.getAttribute('src').indexOf(person.photo) === -1) {
                  img.removeAttribute('srcset');
                  img.removeAttribute('sizes');
                  img.setAttribute('src', person.photo);
                }
                img.setAttribute('alt', person.name);
                img.style.setProperty('object-fit', 'cover', 'important');
                img.style.setProperty('object-position', person.focus || 'center 20%', 'important');
              });
            });
          });
          // 13b. Speakers Section: Bottom Bar & Permanent Color Photos
          const speakerBarText = "${lang === 'ky' ? 'Спикерлер' : lang === 'en' ? 'Speakers' : 'Спикеры'}";
          const seeAllText = "${lang === 'ky' ? 'Баарын көрүү' : lang === 'en' ? 'See All' : 'Смотреть всех'}";

          const bottomBarContainer = document.querySelector('.framer-u84szu');
          if (bottomBarContainer) {
            const h4s = bottomBarContainer.querySelectorAll('h4');
            if (h4s.length >= 2) {
              if (h4s[0].textContent.trim() !== speakerBarText) h4s[0].textContent = speakerBarText;
              if (h4s[1].textContent.trim() !== seeAllText) h4s[1].textContent = seeAllText;
            }
          }

          const spBarEl = document.querySelector('.framer-393pab h4, .framer-qjskfs h4, [data-framer-name="200+ Speakers"] h4, [data-framer-name="20+ Speakers"] h4');
          if (spBarEl && spBarEl.textContent.trim() !== speakerBarText) {
            spBarEl.textContent = speakerBarText;
          }

          const seeAllBarEl = document.querySelector('.framer-u6t1id h4, .framer-1hr1kgt h4');
          if (seeAllBarEl && seeAllBarEl.textContent.trim() !== seeAllText) {
            seeAllBarEl.textContent = seeAllText;
          }

          const speakersPage = "/${lang}/speakers";
          const openSpeakersPage = function(e) {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            window.location.assign(speakersPage);
            return false;
          };
          document.querySelectorAll('.framer-u84szu a').forEach((a) => {
            a.setAttribute('href', speakersPage);
            a.onclick = openSpeakersPage;
          });
          const seeAllBtn = document.querySelector('.framer-u84szu [data-framer-name="Button"]');
          if (seeAllBtn) {
            seeAllBtn.style.cursor = 'pointer';
            seeAllBtn.onclick = openSpeakersPage;
          }

          document.querySelectorAll('.framer-1kwjq53, .framer-KUjhD figure[data-framer-name="Image"], .framer-KUjhD img').forEach(fig => {
            if (fig.style.filter !== 'none' || fig.style.webkitFilter !== 'none') {
              fig.style.setProperty('filter', 'none', 'important');
              fig.style.setProperty('-webkit-filter', 'none', 'important');
            }
          });

          // 14. Partners Grid: general partners, then ECO-SYSTEM partners, then Media partners
          const partnersGrid = document.querySelector('.framer-ff8lq4');
          if (partnersGrid && !partnersGrid.querySelector('.muun-marquee-viewport')) {
            partnersGrid.innerHTML = ${JSON.stringify(partnersGridInnerHtml)};
          }

          // 15. Footer Customizations (User requests 1, 2, 3, 4)
          // 15a. Hide "Social" label
          const socialLabel = document.querySelector('.framer-17tcu0s');
          if (socialLabel && socialLabel.style.display !== 'none') {
            socialLabel.style.setProperty('display', 'none', 'important');
          }

          // 15b. Footer social links: Instagram, Facebook, Threads
          ${footerFixerJs}

          // 15c. Privacy Policy & Offer Agreement
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
            const offerA = offerContainer.closest('a') || (offerContainer.tagName === 'A' ? offerContainer : null);
            if (offerA && offerA.getAttribute('href') !== '#') {
              offerA.setAttribute('href', '#');
              offerA.removeAttribute('target');
            }
          }

          // 15d. Hide Designed By Jitu Raut
          const designedByEl = document.querySelector('.framer-1n7mxh0');
          if (designedByEl && designedByEl.style.display !== 'none') {
            designedByEl.style.setProperty('display', 'none', 'important');
          }

          // 15e. Footer Bottom Crystal Dome Logo (rising emblem matching screenshot 2)
          const footerFig = document.querySelector('.framer-RYOK6 .framer-16fyxtb');
          if (footerFig) {
            if (footerFig.style.mask !== 'none' || footerFig.style.webkitMask !== 'none') {
              footerFig.style.setProperty('mask', 'none', 'important');
              footerFig.style.setProperty('-webkit-mask', 'none', 'important');
            }
            const footerImg = footerFig.querySelector('img');
            if (footerImg && !footerImg.src.includes('logo-footer.png')) {
              footerImg.src = '/assets/logo-footer.png';
              if (footerImg.hasAttribute('srcset')) footerImg.removeAttribute('srcset');
              if (footerImg.hasAttribute('sizes')) footerImg.removeAttribute('sizes');
              footerImg.alt = 'MUUN 2026';
            }
          }
        }

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
        })(fixHydration);
      })();
    </script>
  `;

  finalHtml = lockHeroMark(finalHtml);
  finalHtml = patchHomeSpeakers(finalHtml, homeSpeakerPeople(lang));
  finalHtml = injectProgramSsr(finalHtml, lang);
  finalHtml = replaceMarkedHeadings(finalHtml, [
    { marker: 'Absolutely', html: hd.about.titleHtml },
    { marker: 'Definitely', html: hd.target.titleHtml },
    { marker: 'Esteemed', html: hd.speakers.titleHtml },
    { marker: '>Discover<', html: hd.agenda.titleHtml }
  ]);
  finalHtml = finalHtml.replaceAll('>Event agenda</h4>', `>${hd.agenda.kicker}</h4>`);
  finalHtml = finalHtml.replace('</head>', styleAndScripts + '\n</head>');

  // Floating language switcher
  const langSwitcherHtml = `
    <div class="muun-lang-switcher" style="position:fixed; bottom:20px; right:20px; z-index:99999; display:flex; gap:8px; background:rgba(6,21,36,0.85); padding:10px 18px; border-radius:30px; backdrop-filter:blur(12px); border:1px solid rgba(41,170,225,0.3); box-shadow:0 4px 20px rgba(0,0,0,0.5);">
      <a href="/ru/" style="color: ${lang === 'ru' ? '#29AAE1' : 'rgba(255,255,255,0.6)'}; text-decoration:none; font-family:sans-serif; font-size:14px; font-weight:bold; transition: 0.3s;">RU</a>
      <span style="color:rgba(255,255,255,0.2);">|</span>
      <a href="/ky/" style="color: ${lang === 'ky' ? '#29AAE1' : 'rgba(255,255,255,0.6)'}; text-decoration:none; font-family:sans-serif; font-size:14px; font-weight:bold; transition: 0.3s;">KY</a>
      <span style="color:rgba(255,255,255,0.2);">|</span>
      <a href="/en/" style="color: ${lang === 'en' ? '#29AAE1' : 'rgba(255,255,255,0.6)'}; text-decoration:none; font-family:sans-serif; font-size:14px; font-weight:bold; transition: 0.3s;">EN</a>
    </div>
  `;
  const participantModalHtml = renderParticipantModal(lang);
  const mobileNavHtml = renderMobileNav(lang);
  finalHtml = finalHtml.replace('</body>', participantModalHtml + '\n' + langSwitcherHtml + '\n' + mobileNavHtml + '\n</body>');

  fs.mkdirSync(`dist/${lang}`, { recursive: true });
  finalHtml = stripFramerRuntime(finalHtml, {
    lang,
    pairs: [
      ...replacements,
      ...homeSpeakerPeople(lang).flatMap((person, index) => {
        const slot = HOME_SPEAKER_SLOTS[index];
        return slot ? [[slot.name, person.name], [slot.role, person.role]] : [];
      })
    ]
  });
  fs.writeFileSync(`dist/${lang}/index.html`, finalHtml);

  if (lang === 'ru') {
    fs.writeFileSync('dist/index.html', finalHtml);
  }
}

console.log('Successfully generated dist/ru, dist/ky, dist/en, and dist/index.html with updated Inter typography, complete nav links, left-aligned 3-sentence descriptions, and refined ticker font.');

execSync('node scripts/build_clean_subpages.mjs', { stdio: 'inherit' });
await vendorFramerEngine();
