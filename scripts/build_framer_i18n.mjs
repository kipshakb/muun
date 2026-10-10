import fs from 'fs';
import { renderParticipantModal } from './participant_modal.mjs';

const rawHtml = fs.readFileSync('templates/eventis_raw.html', 'utf8');
const i18n = JSON.parse(fs.readFileSync('src/i18n.json', 'utf8'));

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
for (const f of ['favicon.ico', 'favicon.png', 'logo-new.png', 'logo-crystal.png', 'logo-header.png', 'president.png', 'ministry-logo.jpeg', 'ministry-logo-white.png', 'kumtor.png', 'kyrgyzaltyn.png', 'aeroporty kyrgyzstana.png', 'eagle2.png', 'logo-footer.png']) {
  if (fs.existsSync(`assets/${f}`)) {
    fs.copyFileSync(`assets/${f}`, `dist/${f}`);
    fs.copyFileSync(`assets/${f}`, `dist/assets/${f}`);
  }
}
if (fs.existsSync('assets/aeroporty kyrgyzstana.png')) {
  fs.copyFileSync('assets/aeroporty kyrgyzstana.png', 'assets/aeroporty-kyrgyzstana.png');
  fs.copyFileSync('assets/aeroporty kyrgyzstana.png', 'dist/assets/aeroporty-kyrgyzstana.png');
}

const localizedContent = {
  ru: {
    title: 'ВЫБЕРИ СВОЕ<br>БУДУЩЕЕ',
    subtitle: 'Национальная молодежная выставка-форум<br>профессий будущего',
    date: '17–18 ноября 2026',
    location: 'Конгресс-Холл «Ырыс Ордо», Бишкек',
    btnPrimary: 'Стать участником',
    btnSecondary: 'Бесплатная регистрация',
    ministry: 'При поддержке Министерства науки, высшего образования и инноваций Кыргызской Республики'
  },
  ky: {
    title: 'КЕЛЕЧЕГИНДИ<br>ТАНДА',
    subtitle: 'Кыргызстандын келечек кесиптеринин<br>улуттук жаштар көргөзмө-форуму',
    date: '17–18-ноябрь 2026',
    location: '«Ырыс Ордо» конгресс-холлу, Бишкек',
    btnPrimary: 'Катышуучу болуу',
    btnSecondary: 'Акысыз каттоо',
    ministry: 'Кыргыз Республикасынын Илим, жогорку билим берүү жана инновациялар министрлигинин колдоосу менен'
  },
  en: {
    title: 'CHOOSE YOUR<br>FUTURE',
    subtitle: 'National Youth Exhibition-Forum<br>of Professions of the Future',
    date: '17–18 November 2026',
    location: 'Congress Hall "Yrys Ordo", Bishkek',
    btnPrimary: 'Become a participant',
    btnSecondary: 'Free registration',
    ministry: 'Supported by the Ministry of Science, Higher Education and Innovation of the Kyrgyz Republic'
  }
};

const aboutData = {
  ru: {
    kicker: 'О форуме',
    stats: [
      { target: 100, suffix: '+', desc: 'компаний и организаций-участников' },
      { target: 10000, suffix: '+', desc: 'уникальных посетителей за два дня' },
      { target: 10, suffix: '+', desc: 'стран-участниц' },
      { target: 10000, suffix: ' м²', desc: 'общая площадь' },
      { target: 20, suffix: '+', desc: 'мероприятий деловой программы' },
      { target: 50, suffix: '+', desc: 'топ-менеджеров и руководителей' }
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
      { target: 100, suffix: '+', desc: 'компаниялар жана уюмдар' },
      { target: 10000, suffix: '+', desc: 'эки күндө уникалдуу келүүчүлөр' },
      { target: 10, suffix: '+', desc: 'катышуучу өлкөлөр' },
      { target: 10000, suffix: ' м²', desc: 'жалпы аянты' },
      { target: 20, suffix: '+', desc: 'ишкердик программасындагы иш-чаралар' },
      { target: 50, suffix: '+', desc: 'топ-менеджерлер жана жетекчилер' }
    ],
    pres: {
      kicker: 'Кыргыз Республикасынын Президенти',
      name: 'Садыр Жапаров',
      quote: '«Билим өнүккөн мамлекеттерде гана саясий, маданий, экономикалык өзгөрүүлөр болот. Билим — мамлекеттин узак мөөнөттүү өнүгүүсүнүн пайдубалы, ал эми билимге инвестиция — өлкөнүн келечегине эң маанилүү салым».'
    }
  },
  en: {
    kicker: 'About Forum',
    stats: [
      { target: 100, suffix: '+', desc: 'companies and participating organizations' },
      { target: 10000, suffix: '+', desc: 'unique visitors over two days' },
      { target: 10, suffix: '+', desc: 'participating countries' },
      { target: 10000, suffix: ' m²', desc: 'total venue area' },
      { target: 20, suffix: '+', desc: 'business program events' },
      { target: 50, suffix: '+', desc: 'top executives and industry leaders' }
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
      { num: '09', color: '#818CF8', tag: 'AEROSPACE', title: 'AEROSPACE', desc: 'Космос и авиация' },
      { num: '10', color: '#FFFFFF', tag: 'EDTECH & CAREERS', title: 'EDTECH & CAREERS', desc: 'Образование будущего' },
      { num: '11', color: '#FFB800', tag: 'TOURISM & BRAND', title: 'TOURISM & BRAND', desc: 'Брендинг страны' },
      { num: '12', color: '#29AAE1', tag: 'WEB3 & CYBER', title: 'WEB3 & CYBER', desc: 'Киберспорт и блокчейн' }
    ]
  },
  ky: {
    titleHtml: 'Тематикалык <span class="heading-muted">зоналар</span>',
    title: 'Тематикалык зоналар',
    zones: [
      { num: '01', color: '#29AAE1', tag: 'AI & DATA', title: 'БАШКЫ ЗАЛ', desc: 'Бардык панелдер, MUUN Talks, аземдер' },
      { num: '02', color: '#29AAE1', tag: 'ROBOTICS', title: 'ДЕМӨӨРЧҮЛҮК РЕҢИ', desc: 'Залдын тегерегинде 19 позиция' },
      { num: '03', color: '#FFB800', tag: 'CLEANTECH', title: 'ТАРМАКТЫК ЗОНАЛАР', desc: 'Ар бири 36 м² болгон 12 зона' },
      { num: '04', color: '#8B5CF6', tag: 'CREATIVE & GAME', title: 'СТАРТАП АЛЛЕЯСЫ', desc: '10 стенд. Инвесторлор үчүн питчинг' },
      { num: '05', color: '#29AAE1', tag: 'MEDTECH & BIO', title: 'ВАКАНСИЯЛАР ЖАРМАНКЕСИ', desc: 'Чыныгы вакансиялар жана маектешүүлөр' },
      { num: '06', color: '#29AAE1', tag: 'AGROTECH', title: 'СҮЙЛӨШҮҮЛӨР БӨЛМӨЛӨРҮ', desc: 'B2B-матчмейкинг жана маектешүүлөр' },
      { num: '07', color: '#FFB800', tag: 'FINTECH', title: 'ЭКИНЧИ СЦЕНА + LED', desc: 'Амфитеатр, мастер-класстар, MUUN Cup' },
      { num: '08', color: '#60A5FA', tag: 'GOVTECH', title: 'БАШКЫ КИРЕ БЕРИШ', desc: 'Каттоо, навигация, фотозона' },
      { num: '09', color: '#818CF8', tag: 'AEROSPACE', title: 'AEROSPACE', desc: 'Космос жана авиация' },
      { num: '10', color: '#FFFFFF', tag: 'EDTECH & CAREERS', title: 'EDTECH & CAREERS', desc: 'Келечектин билими' },
      { num: '11', color: '#FFB800', tag: 'TOURISM & BRAND', title: 'TOURISM & BRAND', desc: 'Өлкө бренди' },
      { num: '12', color: '#29AAE1', tag: 'WEB3 & CYBER', title: 'WEB3 & CYBER', desc: 'Киберспорт жана блокчейн' }
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
      { num: '09', color: '#818CF8', tag: 'AEROSPACE', title: 'AEROSPACE', desc: 'Space & Aviation' },
      { num: '10', color: '#FFFFFF', tag: 'EDTECH & CAREERS', title: 'EDTECH & CAREERS', desc: 'Future of Education' },
      { num: '11', color: '#FFB800', tag: 'TOURISM & BRAND', title: 'TOURISM & BRAND', desc: 'Country Branding' },
      { num: '12', color: '#29AAE1', tag: 'WEB3 & CYBER', title: 'WEB3 & CYBER', desc: 'Cybersport & Blockchain' }
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
        a: 'Форум пройдет 17–18 ноября 2026 года в Бишкеке, в Конгресс-Холле «Ырыс Ордо» (Бишкек Арена) с 09:00 до 18:00.'
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
        a: 'Форум 2026-жылдын 17-18-ноябрында Бишкек шаарында, «Ырыс Ордо» Конгресс-Холлунда (Бишкек Арена) саат 09:00дөн 18:00гө чейин өтөт.'
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
        a: 'The forum will be held on November 17–18, 2026, in Bishkek at the «Yrys Ordo» Congress Hall (Bishkek Arena) from 9:00 AM to 6:00 PM.'
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
      titleHtml: 'Кто должен посетить <span class="heading-muted">выставку-форум</span>'
    },
    ticker: 'МАКСАТ . УМТУЛУУ . УЧУР . НИЕТ . МАКСАТ . УМТУЛУУ . УЧУР . НИЕТ . МАКСАТ . УМТУЛУУ . УЧУР . НИЕТ . ',
    speakers: {
      kicker: 'Спикеры',
      titleHtml: 'Ведущие эксперты <span class="heading-muted">и лидеры индустрии</span>'
    },
    agenda: {
      kicker: 'Программа',
      titleHtml: 'Что вас ждет <span class="heading-muted">в эти два дня</span>'
    },
    zones: zonesData.ru,
    faq: faqData.ru,
    partners: {
      kicker: 'Партнеры',
      titleHtml: 'Генеральные партнеры <span class="heading-muted">форума</span>',
      titleText: 'Генеральные партнеры форума'
    },
    registration: {
      kicker: 'Регистрация',
      titleHtml: 'Зарегистрируйтесь на выставку-форум <span class="heading-muted">уже сегодня</span>',
      titleText: 'Зарегистрируйтесь на выставку-форум уже сегодня'
    },
    targetTabs: {
      t1: 'Школьники',
      d1: 'Познакомьтесь с профессиями будущего, передовыми технологиями и определите свой путь в быстро меняющемся мире. Узнайте о ведущих университетах, колледжах и международных образовательных программах из первых уст от представителей учебных заведений. Примите участие в практических мастер-классах, интерактивных тестах на профориентацию и сделайте осознанный шаг к успешному будущему.',
      t2: 'Студенты',
      d2: 'Найдите актуальные стажировки и реальные вакансии в топовых IT-компаниях, финансовых институтах и ведущих предприятиях страны. Познакомьтесь лично с топ-менеджерами, ключевыми работодателями и потенциальными менторами прямо на площадке форума. Узнайте, какие практические навыки и компетенции наиболее востребованы рынком труда прямо сейчас для стремительного карьерного старта.',
      t3: 'Предприниматели',
      d3: 'Откройте новые стратегические партнерства, инвестиционные возможности и масштабируйте свой бизнес на национальном и международном уровнях. Привлекайте в свои команды самых талантливых, амбициозных молодых специалистов и выпускников ведущих вузов. Внедряйте передовые инновации, технологические тренды и делитесь экспертным опытом с новым поколением лидеров.',
      t4: 'Родители',
      d4: 'Узнайте о реальных тенденциях и долгосрочных перспективах глобального и национального рынка труда на ближайшие десятилетия. Разберитесь в актуальных направлениях высшего и профессионального образования, востребованных специальностях и доступных программах грантов. Получите экспертные рекомендации специалистов и помогите своим детям сделать уверенный, взвешенный и осознанный выбор будущей профессии.'
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
      titleHtml: 'Бул эки күндө <span class="heading-muted">сизди эмне күтөт</span>'
    },
    zones: zonesData.ky,
    faq: faqData.ky,
    partners: {
      kicker: 'Өнөктөштөр',
      titleHtml: 'Форумдун башкы <span class="heading-muted">өнөктөштөрү</span>',
      titleText: 'Форумдун башкы өнөктөштөрү'
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
      d4: 'Эмгек рыногунун келечектеги багыттары жана негизги тенденциялары менен тереңирээк таанышыңыз. Заманбап билим берүү багыттарын, суроо-талапка ээ кесиптерди жана стипендиялык программаларды изилдеңиз. Балдарыңызга кесип тандоодо туура жана негизделген чечим чыгарууга көмөктөшүңүз.'
    }
  },
  en: {
    about: {
      kicker: 'About Forum',
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
      titleHtml: 'What Awaits You <span class="heading-muted">Over These Two Days</span>'
    },
    zones: zonesData.en,
    faq: faqData.en,
    partners: {
      kicker: 'Partners',
      titleHtml: 'General Partners <span class="heading-muted">of the Forum</span>',
      titleText: 'General Partners of the Forum'
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
      d4: 'Understand the evolving dynamics and long-term perspectives of the global and local labor markets. Explore accredited university degrees, high-demand career pathways, and available educational scholarship options. Empower your children to make confident, balanced, and well-informed professional choices.'
    }
  }
};

function renderRegForm(lang) {
  const S = i18n.strings[lang];

  const badgeText = lang === 'ky'
    ? 'АКЫСЫЗ КАТТОО · 0 СОМ'
    : lang === 'en'
      ? 'FREE REGISTRATION · 0 SOM'
      : 'БЕСПЛАТНАЯ РЕГИСТРАЦИЯ · 0 СОМ';

  const protectMemo = lang === 'ky'
    ? 'Сиздин маалыматтарыңыз корголгон жана КР СГОго гана берилет'
    : lang === 'en'
      ? 'Your data is secured and transferred strictly to SGO KR'
      : 'Ваши данные защищены и передаются только в СГО КР';

  const resetLabel = lang === 'ky'
    ? 'Жаңы өтүнмө толтуруу'
    : lang === 'en'
      ? 'Submit another application'
      : 'Заполнить новую заявку';

  return `
    <div class="muun-reg-card">
      
      <!-- STEP 1: Registration Form -->
      <div id="reg-step-form" style="display:block;">
        <div class="muun-reg-badge">
          <span style="font-size:12px;">🎟️</span>
          <span>${badgeText}</span>
        </div>
        <h3 class="muun-form-title">
          ${S['reg.title']}
        </h3>
        <p class="muun-form-subtitle">
          ${S['reg.subtitle']}
        </p>

        <!-- SGO Security Warning Notice -->
        <div class="muun-sgo-warning-box">
          <span class="icon">🏛️</span>
          <p>
            ${S['reg.sgo_notice']}
          </p>
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
            <!-- FIO (3 separate fields) -->
            <div>
              <label class="field-label">${S['reg.fio_label']}</label>
              <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
                <div>
                  <input type="text" name="lastName" required class="form-input-dark" placeholder="${S['reg.last_name']} *" />
                </div>
                <div>
                  <input type="text" name="firstName" required class="form-input-dark" placeholder="${S['reg.first_name']} *" />
                </div>
                <div>
                  <input type="text" name="middleName" class="form-input-dark" placeholder="${S['reg.middle_name']}" />
                </div>
              </div>
              <span class="field-note">${S['reg.fio_note']}</span>
            </div>

            <!-- PIN / INN & Date of Birth -->
            <div class="form-row" style="display:grid; grid-template-columns:1.2fr 1fr; gap:12px;">
              <div>
                <label class="field-label">${S['reg.pin']} *</label>
                <input type="text" name="pin" required pattern="[0-9]{14}" maxlength="14" minlength="14" inputmode="numeric" class="form-input-dark" placeholder="${S['reg.pin_ph']}" />
                <span class="field-note">${S['reg.pin_note']}</span>
              </div>
              <div>
                <label class="field-label">${S['reg.dob']} *</label>
                <input type="date" name="birthDate" required class="form-input-dark" min="1940-01-01" max="2020-01-01" />
                <span class="field-note">${S['reg.dob_note']}</span>
              </div>
            </div>

            <!-- Phone & Email -->
            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label class="field-label">${S['reg.phone']} *</label>
                <input type="tel" name="phone" required class="form-input-dark" placeholder="+996 700 123 456" />
                <span class="field-note">${S['reg.phone_note']}</span>
              </div>
              <div>
                <label class="field-label">${S['reg.email']} *</label>
                <input type="email" name="email" required class="form-input-dark" placeholder="example@gmail.com" />
                <span class="field-note">${S['reg.email_note']}</span>
              </div>
            </div>

            <!-- Category & Region -->
            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label class="field-label">${S['reg.category_label']} *</label>
                <select name="category" required class="form-input-dark">
                  <option value="" disabled selected>${S['reg.category_label']}</option>
                  <option value="school">${S['reg.cat_school_v2']}</option>
                  <option value="college">${S['reg.cat_college']}</option>
                  <option value="university">${S['reg.cat_university']}</option>
                  <option value="graduate">${S['reg.cat_graduate']}</option>
                  <option value="young_specialist">${S['reg.cat_young_spec']}</option>
                  <option value="parent">${S['reg.cat_parent_v2'] || S['reg.cat_parent']}</option>
                  <option value="company">${S['reg.cat_company']}</option>
                  <option value="media">${S['reg.cat_media']}</option>
                  <option value="other">${S['reg.cat_other']}</option>
                </select>
              </div>
              <div>
                <label class="field-label">${S['reg.region_label']} *</label>
                <select name="region" required class="form-input-dark">
                  <option value="" disabled selected>${S['reg.region_label']}</option>
                  <option value="Bishkek">${S['reg.reg_bishkek']}</option>
                  <option value="Chuy">${S['reg.reg_chuy']}</option>
                  <option value="Osh_city">${S['reg.reg_osh_city']}</option>
                  <option value="Osh">${S['reg.reg_osh_reg']}</option>
                  <option value="JalalAbad">${S['reg.reg_jalal']}</option>
                  <option value="IssykKul">${S['reg.reg_issyk']}</option>
                  <option value="Naryn">${S['reg.reg_naryn']}</option>
                  <option value="Talas">${S['reg.reg_talas']}</option>
                  <option value="Batken">${S['reg.reg_batken']}</option>
                </select>
              </div>
            </div>

            <!-- Organization / School / University -->
            <div>
              <label class="field-label">${S['reg.school_org_label']} *</label>
              <input type="text" name="organization" required class="form-input-dark" placeholder="${S['reg.school_org_ph']}" />
            </div>

            <!-- Day & Time Slot -->
            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label class="field-label">${S['reg.day_label']} *</label>
                <select name="preferredDay" required class="form-input-dark">
                  <option value="Nov17" selected>${S['reg.day1']}</option>
                  <option value="Nov18">${S['reg.day2']}</option>
                  <option value="Both">${S['reg.day_both']}</option>
                </select>
              </div>
              <div>
                <label class="field-label">${S['reg.slot_label']} *</label>
                <select name="timeSlot" required class="form-input-dark">
                  <option value="Slot1" selected>${S['reg.slot1']}</option>
                  <option value="Slot2">${S['reg.slot2']}</option>
                  <option value="Slot3">${S['reg.slot3']}</option>
                </select>
              </div>
            </div>

            <!-- Topic of Interest Checkboxes -->
            <div>
              <label class="field-label">${S['reg.interests'] || 'Сферы интереса'}</label>
              <div class="interests-grid">
                <label class="interest-chip"><input type="checkbox" name="interests" value="it" /> <span>💻</span> <span>${S['reg.int_it']}</span></label>
                <label class="interest-chip"><input type="checkbox" name="interests" value="energy" /> <span>⚡</span> <span>${S['reg.int_energy']}</span></label>
                <label class="interest-chip"><input type="checkbox" name="interests" value="engineering" /> <span>⚙️</span> <span>${S['reg.int_engineering']}</span></label>
                <label class="interest-chip"><input type="checkbox" name="interests" value="creative" /> <span>🎨</span> <span>${S['reg.int_creative']}</span></label>
                <label class="interest-chip"><input type="checkbox" name="interests" value="medicine" /> <span>❤️</span> <span>${S['reg.int_medicine']}</span></label>
                <label class="interest-chip"><input type="checkbox" name="interests" value="agriculture" /> <span>🌱</span> <span>${S['reg.int_agriculture']}</span></label>
              </div>
            </div>

            <!-- SGO Mandatory Consent -->
            <div class="consent-box">
              <input type="checkbox" id="indiv-sgo-consent" required />
              <label for="indiv-sgo-consent">
                ${S['reg.sgo_consent']}
              </label>
            </div>

            <button type="submit" id="reg-submit-btn-indiv" class="submit-btn">
              ${S['reg.btn_submit_indiv']}
            </button>

            <div class="security-memo">
              🔒 ${protectMemo}
            </div>
          </div>

          <!-- STREAM B: Organized Groups Form -->
          <div id="stream-group-fields" style="display:none; flex-direction:column; gap:18px;">
            <div class="group-info-box">
              <h4>${S['reg.group_title']}</h4>
              <p>${S['reg.group_subtitle']}</p>
            </div>

            <div class="form-row" style="display:grid; grid-template-columns:1.5fr 1fr; gap:12px;">
              <div>
                <label class="field-label">${S['reg.group_org']} *</label>
                <input type="text" name="group_org" class="form-input-dark" placeholder="${S['reg.group_org_ph']}" />
              </div>
              <div>
                <label class="field-label">${S['reg.group_city']} *</label>
                <input type="text" name="group_city" class="form-input-dark" placeholder="${S['reg.group_city_ph']}" />
              </div>
            </div>

            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label class="field-label">${S['reg.group_leader_name']} *</label>
                <input type="text" name="group_leader_name" class="form-input-dark" placeholder="ФИО сопровождающего" />
              </div>
              <div>
                <label class="field-label">${S['reg.group_leader_role']} *</label>
                <input type="text" name="group_leader_role" class="form-input-dark" placeholder="Завуч, декан, куратор" />
              </div>
            </div>

            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label class="field-label">${S['reg.group_leader_phone']} *</label>
                <input type="tel" name="group_leader_phone" class="form-input-dark" placeholder="+996 700 123 456" />
              </div>
              <div>
                <label class="field-label">${S['reg.group_leader_email']} *</label>
                <input type="email" name="group_leader_email" class="form-input-dark" placeholder="school@edu.gov.kg" />
              </div>
            </div>

            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;">
              <div>
                <label class="field-label">${S['reg.group_size']} *</label>
                <input type="number" name="group_size" min="5" max="500" class="form-input-dark" placeholder="Напр. 45" />
              </div>
              <div>
                <label class="field-label">${S['reg.day_label']} *</label>
                <select name="group_day" class="form-input-dark">
                  <option value="Nov17" selected>${S['reg.day1']}</option>
                  <option value="Nov18">${S['reg.day2']}</option>
                </select>
              </div>
              <div>
                <label class="field-label">${S['reg.slot_label']} *</label>
                <select name="group_slot" class="form-input-dark">
                  <option value="Slot1" selected>09:30 – 12:30</option>
                  <option value="Slot2">13:00 – 15:30</option>
                  <option value="Slot3">16:00 – 18:30</option>
                </select>
              </div>
            </div>

            <div>
              <label class="field-label">${S['reg.group_list_label']} *</label>
              <input type="url" name="group_list_link" class="form-input-dark" placeholder="${S['reg.group_list_ph']}" />
              <span class="field-note">${S['reg.group_list_note']}</span>
            </div>

            <div class="consent-box">
              <input type="checkbox" id="group-sgo-consent" />
              <label for="group-sgo-consent">
                ${S['reg.group_consent']}
              </label>
            </div>

            <button type="submit" id="reg-submit-btn-group" class="submit-btn">
              ${S['reg.btn_submit_group']}
            </button>

            <div class="security-memo">
              🔒 ${protectMemo}
            </div>
          </div>
        </form>
      </div>

      <!-- STEP 2: Pending Approval / Verification Screen -->
      <div id="reg-step-pending" style="display:none; text-align:center; padding:30px 10px;">
        <div class="pending-icon-wrap">
          ⏳
        </div>
        <h3 class="pending-title">
          ${S['reg.pending_title']}
        </h3>
        <p class="pending-desc">
          ${S['reg.pending_desc']}
        </p>

        <div class="pending-id-pill" id="pending-reg-id">
          ID: MUUN-PENDING
        </div>

        <div class="pending-memo-box">
          <h4>⚠️ ${S['reg.memo_title']}</h4>
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

for (const lang of ['ru', 'ky', 'en']) {
  let finalHtml = rawHtml;

  const t = i18n.strings[lang] || {};
  const m = i18n.locales[lang]?.meta || {};
  const loc = localizedContent[lang];
  const curAbout = aboutData[lang];
  const hd = SECTION_HEADINGS[lang];

  const metaTitle = m.title || (lang === 'ky' ? 'MUUN 2026 - Кыргызстандын келечек кесиптеринин улуттук жаштар көргөзмө-форуму' : lang === 'en' ? 'MUUN 2026 - National Youth Exhibition-Forum of Professions of the Future' : 'MUUN 2026 - Национальная молодежная выставка-форум профессий будущего');

  // 1. String replacements in raw HTML
  const spTxt = lang === 'ky' ? 'Спикерлер' : lang === 'en' ? 'Speakers' : 'Спикеры';
  const saTxt = lang === 'ky' ? 'Баарын көрүү' : lang === 'en' ? 'See All' : 'Смотреть всех';

  const replacements = [
    ['<title>Eventis - Free Event and Conference Template</title>', `<title>${metaTitle}</title>`],
    ['Eventis - Free Event and Conference Template', metaTitle],
    ['Join Eventis, the premier technology and IT summit, bringing together developers, designers, entrepreneurs, and investors to explore the latest in software development, AI innovations, and startup growth.', m.description || loc.subtitle.replace('<br>', ' ')],
    ['https://eventis.framer.website/', 'https://muun.kg/'],
    ['https://framerusercontent.com/images/AxQMXkb9SNyxDMp63XvKlzyGFo.png', '/favicon.png'],
    ['About Aicron', curAbout.kicker],
    ['Innovation . Networking . Marketing . Learning . ', hd.ticker],
    ['https://framerusercontent.com/images/1BHox7UUEVMJHfAPN4qPh5r4o.svg', '/assets/logo-footer.png'],
    ['All copyrights @eventis', '<a href="#" style="color:inherit;text-decoration:none;">' + (lang === 'ky' ? 'Купуялуулук саясаты' : lang === 'en' ? 'Privacy Policy' : 'Политика конфиденциальности') + '</a>'],
    ['Terms and Conditions', lang === 'ky' ? 'Оферта келишими' : lang === 'en' ? 'Terms of Service' : 'Договор оферты'],
    ['href="./terms-and-conditions"', 'href="#"'],
    ['>Social </p>', '></p>'],
    ['https://www.facebook.com', 'javascript:void(0)'],
    ['https://www.instagram.com/jitu.ux/', 'javascript:void(0)'],
    ['https://www.linkedin.com/in/jitendra-raut/', 'javascript:void(0)'],
    ['https://x.com/jituux', 'javascript:void(0)'],
    ['<div class="framer-1q9j6t2-container"><!--$--><div style="display:contents"></div><!--/$--></div>', '<div class="framer-1q9j6t2-container" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></div>'],
    ['<div class="framer-meo1sm-container"><!--$--><div style="display:contents"></div><!--/$--></div>', '<div class="framer-meo1sm-container" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></div>'],
    ['<div class="framer-mwybfh-container"><!--$--><div style="display:contents"></div><!--/$--></div>', '<div class="framer-mwybfh-container" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></div>'],
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

  // Pre-render Partners section with 3 prominent general partner cards
  const partnersGridHtml = `<div class="framer-ff8lq4" data-framer-name="Partners">
    <div class="muun-partner-card" title="Kumtor Gold Company">
      <img src="/assets/kumtor.png" alt="Кумтөр Голд Компани" class="muun-partner-logo kumtor-logo" />
    </div>
    <div class="muun-partner-card" title="Кыргызалтын">
      <img src="/assets/kyrgyzaltyn.png" alt="ОАО Кыргызалтын" class="muun-partner-logo kyrgyzaltyn-logo" />
    </div>
    <div class="muun-partner-card" title="Аэропорты Кыргызстана">
      <img src="/assets/aeroporty-kyrgyzstana.png" alt="ОАО Аэропорты Кыргызстана" class="muun-partner-logo aeroporty-logo" />
    </div>
  </div>`;

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
</div>
`;

  // 3. Styling & Client Hydration Script
  const styleAndScripts = `
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
        position: static !important;
        transform: translate(6vw, -8px) !important;
        width: 45% !important;
        max-width: 550px !important;
        height: auto !important;
        aspect-ratio: 1 !important;
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
        gap: 16px !important;
        margin-top: 26px !important;
        max-width: 600px !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      .muun-ministry-logo {
        height: 38px !important;
        width: auto !important;
        max-width: 58px !important;
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
        font-size: 13.5px !important;
        font-weight: 400 !important;
        line-height: 1.45 !important;
        color: rgba(224, 242, 254, 0.85) !important;
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
      .framer-ostf7s h2 {
        white-space: nowrap !important;
        word-break: normal !important;
        word-wrap: normal !important;
        max-width: 100% !important;
        width: auto !important;
        font-size: clamp(24px, 3.2vw, 46px) !important;
      }

      @media (max-width: 992px) {
        .framer-ostf7s,
        .framer-ostf7s h2 {
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

      /* ── 3. FOR WHOM SECTION: LEFT-ALIGNED 3-SENTENCE DESCRIPTION ACROSS RECTANGLE ── */
      section[data-framer-name="For Whom?"] .framer-12hi9of-container,
      .framer-mu05uw .framer-12hi9of-container {
        width: 60px !important;
        height: 60px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      section[data-framer-name="For Whom?"] .framer-12hi9of-container svg,
      .framer-mu05uw .framer-12hi9of-container svg {
        width: 100% !important;
        height: 100% !important;
        max-width: 60px !important;
        max-height: 60px !important;
      }

      section[data-framer-name="For Whom?"] .framer-1mpnhrg,
      section[data-framer-name="For Whom?"] .framer-1dxlm5u,
      section[data-framer-name="For Whom?"] [data-framer-name="Text"],
      .framer-mu05uw [data-framer-name="Text"] {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        padding: 24px 36px !important;
        display: flex !important;
        justify-content: flex-start !important;
        align-items: center !important;
      }

      section[data-framer-name="For Whom?"] p,
      .framer-mu05uw p {
        font-family: "Inter", sans-serif !important;
        font-size: 15.5px !important;
        line-height: 1.65 !important;
        color: rgba(224, 242, 254, 0.92) !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        text-align: left !important;
        white-space: normal !important;
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

      .framer-npy4b {
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

      .framer-npy4b .framer-295hd4 {
        position: absolute !important;
        inset: 0 !important;
        border-radius: 100px !important;
        pointer-events: none !important;
      }

      .framer-npy4b .framer-1dl5625 {
        user-select: none !important;
        white-space: pre !important;
        position: relative !important;
        z-index: 2 !important;
        transform: translateY(0px) !important;
        opacity: 1 !important;
        transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease !important;
      }

      .framer-npy4b .framer-mvpx8f {
        position: absolute !important;
        left: -1px !important;
        right: -1px !important;
        bottom: -45px !important;
        height: 45px !important;
        border-radius: 100px !important;
        background-color: #29AAE1 !important;
        z-index: 1 !important;
        transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }

      .framer-npy4b .framer-shp3q0 {
        user-select: none !important;
        white-space: pre !important;
        position: absolute !important;
        bottom: -32px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 2 !important;
        opacity: 0 !important;
        transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease !important;
      }

      .framer-npy4b:hover .framer-1dl5625,
      .framer-npy4b.hover .framer-1dl5625 {
        transform: translateY(-34px) !important;
        opacity: 0 !important;
      }

      .framer-npy4b:hover .framer-mvpx8f,
      .framer-npy4b.hover .framer-mvpx8f {
        bottom: 0px !important;
        top: 0px !important;
        height: 100% !important;
      }

      .framer-npy4b:hover .framer-shp3q0,
      .framer-npy4b.hover .framer-shp3q0 {
        transform: translate(-50%, -34px) !important;
        opacity: 1 !important;
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

      /* ── 4c. GENERAL PARTNERS: 3 COLUMNS & PROMINENT LOGOS ── */
      .framer-v0m3u0 {
        position: relative !important;
        overflow: visible !important;
      }

      .framer-ff8lq4 {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        grid-template-rows: auto !important;
        grid-auto-rows: auto !important;
        gap: 32px !important;
        width: 100% !important;
        max-width: 1320px !important;
        margin: 0 auto !important;
        justify-content: center !important;
        align-items: stretch !important;
        box-sizing: border-box !important;
      }

      @media (max-width: 992px) {
        .framer-ff8lq4 {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 24px !important;
        }
      }

      @media (max-width: 640px) {
        .framer-ff8lq4 {
          grid-template-columns: 1fr !important;
          gap: 16px !important;
        }
      }

      .muun-partner-card {
        background: #FFFFFF !important;
        border-radius: 24px !important;
        padding: 32px 36px !important;
        min-height: 160px !important;
        height: 175px !important;
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        position: relative !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35), 0 0 1px rgba(255, 255, 255, 0.4) !important;
        border: 1px solid rgba(255, 255, 255, 0.6) !important;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
        cursor: pointer !important;
        overflow: hidden !important;
      }

      .muun-partner-card:hover {
        transform: translateY(-6px) scale(1.02) !important;
        border-color: #29AAE1 !important;
        box-shadow: 0 16px 40px rgba(41, 170, 225, 0.35), 0 0 25px rgba(41, 170, 225, 0.4) !important;
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

      .muun-partner-card .kumtor-logo {
        max-height: 115px !important;
        max-width: 250px !important;
      }

      .muun-partner-card .kyrgyzaltyn-logo {
        max-height: 115px !important;
        max-width: 250px !important;
      }

      .muun-partner-card .aeroporty-logo {
        max-height: 75px !important;
        max-width: 330px !important;
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
          grid-template-columns: 1fr !important;
          gap: 16px !important;
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

      .muun-reg-badge {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        padding: 5px 14px !important;
        border-radius: 999px !important;
        background: rgba(41, 170, 225, 0.12) !important;
        border: 1px solid rgba(41, 170, 225, 0.3) !important;
        color: #38bdf8 !important;
        font-family: 'Inter', sans-serif !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.06em !important;
        margin-bottom: 14px !important;
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

      .muun-form-subtitle {
        text-align: left !important;
        color: rgba(224, 242, 254, 0.65) !important;
        margin: 0 0 20px 0 !important;
        font-size: 13.5px !important;
        line-height: 1.5 !important;
        font-family: 'Inter', sans-serif !important;
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

      .pending-id-pill {
        display: inline-block !important;
        padding: 8px 20px !important;
        background: rgba(56, 189, 248, 0.12) !important;
        border: 1px dashed rgba(56, 189, 248, 0.4) !important;
        border-radius: 10px !important;
        color: #38bdf8 !important;
        font-weight: 800 !important;
        font-size: 15px !important;
        letter-spacing: 0.05em !important;
        margin-bottom: 24px !important;
        font-family: monospace !important;
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

      @media (max-width: 960px) {
        .muun-pres-card {
          flex-direction: column !important;
          padding: 32px 24px !important;
          gap: 32px !important;
        }
        .muun-pres-photo-side {
          max-width: 100% !important;
          width: 100% !important;
          min-width: unset !important;
        }
        .muun-pres-photo {
          min-height: 320px !important;
          max-height: 420px !important;
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
        align-items: center !important;
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

      /* 4. Bottom Footer Crystal Dome Logo (rising emblem matching screenshot 2) */
      .framer-RYOK6 .framer-16fyxtb {
        aspect-ratio: auto !important;
        height: auto !important;
        min-height: 180px !important;
        max-height: none !important;
        width: 100% !important;
        display: flex !important;
        justify-content: center !important;
        align-items: flex-end !important;
        mask: none !important;
        -webkit-mask: none !important;
        margin-top: 50px !important;
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
        position: relative !important;
        overflow: visible !important;
        pointer-events: none !important;
      }
      .framer-RYOK6 .framer-16fyxtb > div[data-framer-background-image-wrapper] {
        position: relative !important;
        width: 100% !important;
        max-width: 860px !important;
        height: auto !important;
        display: flex !important;
        justify-content: center !important;
        align-items: flex-end !important;
        inset: auto !important;
      }
      .framer-RYOK6 .framer-16fyxtb img {
        width: 100% !important;
        max-width: 860px !important;
        height: auto !important;
        display: block !important;
        object-fit: contain !important;
        object-position: bottom center !important;
        filter: drop-shadow(0 -10px 45px rgba(41, 170, 225, 0.45)) drop-shadow(0 -4px 15px rgba(255, 255, 255, 0.25)) !important;
      }
      @media (max-width: 810px) {
        .framer-RYOK6 .framer-16fyxtb > div[data-framer-background-image-wrapper],
        .framer-RYOK6 .framer-16fyxtb img {
          max-width: 94vw !important;
        }
      }
    </style>

    <template id="muun-faq-tpl">${faqListHtml}</template>
    <template id="muun-zones-tpl">${thematicZonesHtml}</template>
    <template id="muun-reg-form-tpl">${regFormHtml}</template>
    <template id="muun-about-tpl">
      ${customAboutHtml}
    </template>

    <script>
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

        // Registration Tab Switcher & Submission Logic
        window.switchRegTab = function(tab) {
          var btnIndiv = document.getElementById('tab-btn-indiv');
          var btnGroup = document.getElementById('tab-btn-group');
          var streamIndiv = document.getElementById('stream-indiv-fields');
          var streamGroup = document.getElementById('stream-group-fields');
          var typeInput = document.getElementById('regTypeInput');

          if (tab === 'indiv') {
            if (btnIndiv) btnIndiv.classList.add('active');
            if (btnGroup) btnGroup.classList.remove('active');
            if (streamIndiv) streamIndiv.style.display = 'flex';
            if (streamGroup) streamGroup.style.display = 'none';
            if (typeInput) typeInput.value = 'individual';

            setRegFieldsRequired(streamIndiv, true);
            setRegFieldsRequired(streamGroup, false);
          } else {
            if (btnGroup) btnGroup.classList.add('active');
            if (btnIndiv) btnIndiv.classList.remove('active');
            if (streamIndiv) streamIndiv.style.display = 'none';
            if (streamGroup) streamGroup.style.display = 'flex';
            if (typeInput) typeInput.value = 'group';

            setRegFieldsRequired(streamIndiv, false);
            setRegFieldsRequired(streamGroup, true);
          }
        };

        function setRegFieldsRequired(container, isReq) {
          if (!container) return;
          var inputs = container.querySelectorAll('input:not([type="checkbox"]):not([type="hidden"]), select');
          inputs.forEach(function(inp) {
            if (inp.name === 'middleName' || inp.name === 'other_interest' || inp.name === 'interests') return;
            if (isReq) inp.setAttribute('required', '');
            else inp.removeAttribute('required');
          });
          var chk = container.querySelector('input[type="checkbox"][id$="sgo-consent"]');
          if (chk) {
            if (isReq) chk.setAttribute('required', '');
            else chk.removeAttribute('required');
          }
        }

        window.submitVisitorForm = function(event, form) {
          event.preventDefault();
          var regType = document.getElementById('regTypeInput') ? document.getElementById('regTypeInput').value : 'individual';
          var submitBtn = (regType === 'group') ? document.getElementById('reg-submit-btn-group') : document.getElementById('reg-submit-btn-indiv');
          if (!submitBtn) submitBtn = form.querySelector('button[type="submit"]');

          var originalText = submitBtn ? submitBtn.innerHTML : '';
          if (submitBtn) {
            submitBtn.innerHTML = '⏳ Отправка в СГО...';
            submitBtn.disabled = true;
          }

          var formData = new FormData(form);
          var interestsArray = formData.getAll('interests');
          if (interestsArray.length > 0) {
            formData.delete('interests');
            formData.append('interests', interestsArray.join(', '));
          }

          var randomNum = Math.floor(100000 + Math.random() * 900000);
          var regId = (regType === 'group' ? 'MUUN-GRP-' : 'MUUN-') + randomNum;
          formData.append('regId', regId);
          formData.append('regType', regType);
          formData.append('submittedAt', new Date().toISOString());

          var urlEncodedData = new URLSearchParams(formData).toString();

          fetch('https://script.google.com/macros/s/AKfycbwWErGImzzLoBqAWDNyNOLvARpYNxNiHV-gKXIsrhWPEBmI1VyfFYxOiEm2Q-Nay6lm/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: urlEncodedData
          })
          .then(function() {
            window.showPendingScreen(regId);
          })
          .catch(function(err) {
            console.error(err);
            window.showPendingScreen(regId);
          })
          .finally(function() {
            if (submitBtn) {
              submitBtn.innerHTML = originalText;
              submitBtn.disabled = false;
            }
          });
        };

        window.showPendingScreen = function(regId) {
          var formStep = document.getElementById('reg-step-form');
          var pendingStep = document.getElementById('reg-step-pending');
          var idEl = document.getElementById('pending-reg-id');
          if (idEl) idEl.textContent = 'ID: ' + regId;
          if (formStep) formStep.style.display = 'none';
          if (pendingStep) pendingStep.style.display = 'block';

          try {
            localStorage.setItem('muun_pending_reg', JSON.stringify({
              regId: regId,
              time: new Date().toISOString()
            }));
          } catch(e) {}
        };

        window.resetRegForm = function() {
          try { localStorage.removeItem('muun_pending_reg'); } catch(e) {}
          var pendingStep = document.getElementById('reg-step-pending');
          var formStep = document.getElementById('reg-step-form');
          if (pendingStep) pendingStep.style.display = 'none';
          if (formStep) formStep.style.display = 'block';
        };

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
          if (bottomBar) {
            bottomBar.innerHTML = 
              '<div class="muun-bottom-date">' + LOC_DATE + '</div>' +
              '<div class="muun-bottom-line"></div>' +
              '<div class="muun-bottom-loc">' + LOC_LOCATION + '</div>';
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
              if (minTextEl && minTextEl.textContent !== LOC_MINISTRY) {
                minTextEl.textContent = LOC_MINISTRY;
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
            img.style.setProperty('max-height', '45px', 'important');
            img.style.setProperty('height', '100%', 'important');
            img.style.setProperty('width', 'auto', 'important');
            img.style.setProperty('max-width', '100%', 'important');
            img.style.setProperty('object-fit', 'contain', 'important');
            img.style.setProperty('object-position', 'left center', 'important');
            
            const a = img.closest('a');
            if (a) {
              a.style.setProperty('width', '195px', 'important');
              a.style.setProperty('max-width', 'none', 'important');
              a.style.setProperty('display', 'flex', 'important');
              a.style.setProperty('align-items', 'center', 'important');
              a.style.setProperty('justify-content', 'flex-start', 'important');
              a.setAttribute('href', "/${lang}/");
              a.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "/${lang}/";
                return false;
              };
              if (a.parentElement) {
                a.parentElement.style.setProperty('width', 'auto', 'important');
                a.parentElement.style.setProperty('min-width', '195px', 'important');
                a.parentElement.style.setProperty('overflow', 'visible', 'important');
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

          // 7d. Speakers section
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

          // 8. FOR WHOM TABS: EXACT POSITIONAL MAPPING & CUSTOM ICONS
          const forWhomTabs = document.querySelectorAll('section[data-framer-name="For Whom?"] .framer-NWfWD, .framer-mu05uw .framer-NWfWD');
          if (forWhomTabs.length >= 4) {
            const h0 = forWhomTabs[0].querySelector('h4');
            if (h0 && h0.textContent.trim() !== HEADINGS.targetTabs.t1) h0.textContent = HEADINGS.targetTabs.t1;
            const h1 = forWhomTabs[1].querySelector('h4');
            if (h1 && h1.textContent.trim() !== HEADINGS.targetTabs.t2) h1.textContent = HEADINGS.targetTabs.t2;
            const h2 = forWhomTabs[2].querySelector('h4');
            if (h2 && h2.textContent.trim() !== HEADINGS.targetTabs.t3) h2.textContent = HEADINGS.targetTabs.t3;
            const h3 = forWhomTabs[3].querySelector('h4');
            if (h3 && h3.textContent.trim() !== HEADINGS.targetTabs.t4) h3.textContent = HEADINGS.targetTabs.t4;

            // Tab 0: Школьники (keep current icon)

            // Tab 0: Школьники (keep current icon)

            // Tab 1: Студенты (Человек со шляпой - 50x50)
            const icon1 = forWhomTabs[1].querySelector('.framer-12hi9of-container');
            if (icon1 && !icon1.querySelector('.muun-icon-student')) {
              icon1.innerHTML = '<div class="muun-icon-student" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">' +
                '<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">' +
                  '<path d="M22 7l-10-4-10 4 10 4 10-4z"/>' +
                  '<path d="M6 9.5v3"/>' +
                  '<circle cx="12" cy="13" r="3"/>' +
                  '<path d="M6 21v-1a6 6 0 0 1 12 0v1"/>' +
                '</svg>' +
              '</div>';
            }

            // Tab 2: Предприниматели (Знак денег / банкнота - 50x50)
            const icon2 = forWhomTabs[2].querySelector('.framer-12hi9of-container');
            if (icon2 && !icon2.querySelector('.muun-icon-money')) {
              icon2.innerHTML = '<div class="muun-icon-money" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">' +
                '<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">' +
                  '<rect width="20" height="12" x="2" y="6" rx="2"/>' +
                  '<circle cx="12" cy="12" r="2.5"/>' +
                  '<path d="M6 12h.01M18 12h.01"/>' +
                '</svg>' +
              '</div>';
            }

            // Tab 3: Родители (Просто 2 человека - 50x50)
            const icon3 = forWhomTabs[3].querySelector('.framer-12hi9of-container');
            if (icon3 && !icon3.querySelector('.muun-icon-parents')) {
              icon3.innerHTML = '<div class="muun-icon-parents" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">' +
                '<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">' +
                  '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>' +
                  '<circle cx="9" cy="7" r="4"/>' +
                  '<path d="M22 21v-2a4 4 0 0 0-3-3.87"/>' +
                  '<path d="M16 3.13a4 4 0 0 1 0 7.75"/>' +
                '</svg>' +
              '</div>';
            }
          }

          // 9. FOR WHOM DESCRIPTIONS: COMPREHENSIVE 3 SENTENCES PER CATEGORY
          document.querySelectorAll('section[data-framer-name="For Whom?"] p, .framer-mu05uw p').forEach(p => {
            const t = p.textContent.trim();
            if (t.includes('Unlock AI') || t.includes('operations') || t.includes('Познакомьтесь с профессиями')) {
              p.textContent = HEADINGS.targetTabs.d1;
            } else if (t.includes('Identify breakthrough') || t.includes('disruptive startups') || t.includes('Найдите актуальные стажировки')) {
              p.textContent = HEADINGS.targetTabs.d2;
            } else if (t.includes('smarter products') || t.includes('collaborators') || t.includes('Откройте новые стратегические')) {
              p.textContent = HEADINGS.targetTabs.d3;
            } else if (t.includes('Explore powerful') || t.includes('dev community') || t.includes('Узнайте о реальных тенденциях')) {
              p.textContent = HEADINGS.targetTabs.d4;
            }
          });

          // 10. Agenda items translation
          document.querySelectorAll('.framer-1gpbv7e h3, .framer-pfrlz6 h4, .framer-qtcajc h4').forEach(el => {
            const t = el.textContent.trim();
            if (TRANSLATIONS[t]) el.textContent = TRANSLATIONS[t];
          });
          const agendaOpeningDesc = Array.from(document.querySelectorAll('p')).find(p => p.textContent.includes('Welcome to the Alcron Tech Summit'));
          if (agendaOpeningDesc) {
            agendaOpeningDesc.textContent = "${lang === 'ky' ? 'MUUN 2026 жаштар көргөзмө-форумунун салтанаттуу ачылышы. Уюштуруучулардын куттуктоо сөздөрү жана негизги аянтчалардын бет ачары.' : lang === 'en' ? 'Grand Opening of the MUUN 2026 Youth Exhibition-Forum. Welcoming remarks and presentation of core zones.' : 'Торжественное открытие национальной молодежной выставки-форума MUUN 2026. Приветственные речи организаторов и презентация ключевых площадок.'}";
          }

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

          // 13. Speakers Section: Bottom Bar & Permanent Color Photos
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

          const seeAllLink = document.querySelector('.framer-u6t1id a, .framer-1td7r8s-container a');
          if (seeAllLink && seeAllLink.getAttribute('href') === './speakers') {
            seeAllLink.setAttribute('href', '#speakers');
          }

          document.querySelectorAll('.framer-1kwjq53, .framer-KUjhD figure[data-framer-name="Image"], .framer-KUjhD img').forEach(fig => {
            if (fig.style.filter !== 'none' || fig.style.webkitFilter !== 'none') {
              fig.style.setProperty('filter', 'none', 'important');
              fig.style.setProperty('-webkit-filter', 'none', 'important');
            }
          });

          // 14. Partners Grid (3 prominent general partner cards)
          const partnersGrid = document.querySelector('.framer-ff8lq4');
          if (partnersGrid) {
            const partnerCards = partnersGrid.querySelectorAll('.muun-partner-card');
            if (partnerCards.length !== 3 || partnersGrid.children.length !== 3) {
              partnersGrid.innerHTML = 
                '<div class="muun-partner-card" title="Kumtor Gold Company">' +
                  '<img src="/assets/kumtor.png" alt="Кумтөр Голд Компани" class="muun-partner-logo kumtor-logo" />' +
                '</div>' +
                '<div class="muun-partner-card" title="Кыргызалтын">' +
                  '<img src="/assets/kyrgyzaltyn.png" alt="ОАО Кыргызалтын" class="muun-partner-logo kyrgyzaltyn-logo" />' +
                '</div>' +
                '<div class="muun-partner-card" title="Аэропорты Кыргызстана">' +
                  '<img src="/assets/aeroporty-kyrgyzstana.png" alt="ОАО Аэропорты Кыргызстана" class="muun-partner-logo aeroporty-logo" />' +
                '</div>';
            }
          }

          // 15. Footer Customizations (User requests 1, 2, 3, 4)
          // 15a. Hide "Social" label
          const socialLabel = document.querySelector('.framer-17tcu0s');
          if (socialLabel && socialLabel.style.display !== 'none') {
            socialLabel.style.setProperty('display', 'none', 'important');
          }

          // 15b. Remove links from social icons
          document.querySelectorAll('.framer-1dhn2g1 a').forEach(a => {
            if (a.getAttribute('href') !== 'javascript:void(0)') {
              a.setAttribute('href', 'javascript:void(0)');
              a.removeAttribute('target');
              a.removeAttribute('rel');
              a.onclick = function(e) { e.preventDefault(); e.stopPropagation(); return false; };
            }
          });

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

        setInterval(fixHydration, 20);
      })();
    </script>
  `;

  finalHtml = finalHtml.replace('</head>', styleAndScripts + '\n</head>');

  // Floating language switcher
  const langSwitcherHtml = `
    <div style="position:fixed; bottom:20px; right:20px; z-index:99999; display:flex; gap:8px; background:rgba(6,21,36,0.85); padding:10px 18px; border-radius:30px; backdrop-filter:blur(12px); border:1px solid rgba(41,170,225,0.3); box-shadow:0 4px 20px rgba(0,0,0,0.5);">
      <a href="../ru/" style="color: ${lang === 'ru' ? '#29AAE1' : 'rgba(255,255,255,0.6)'}; text-decoration:none; font-family:sans-serif; font-size:14px; font-weight:bold; transition: 0.3s;">RU</a>
      <span style="color:rgba(255,255,255,0.2);">|</span>
      <a href="../ky/" style="color: ${lang === 'ky' ? '#29AAE1' : 'rgba(255,255,255,0.6)'}; text-decoration:none; font-family:sans-serif; font-size:14px; font-weight:bold; transition: 0.3s;">KY</a>
      <span style="color:rgba(255,255,255,0.2);">|</span>
      <a href="../en/" style="color: ${lang === 'en' ? '#29AAE1' : 'rgba(255,255,255,0.6)'}; text-decoration:none; font-family:sans-serif; font-size:14px; font-weight:bold; transition: 0.3s;">EN</a>
    </div>
  `;
  const participantModalHtml = renderParticipantModal(lang);
  finalHtml = finalHtml.replace('</body>', participantModalHtml + '\n' + langSwitcherHtml + '\n</body>');

  fs.mkdirSync(`dist/${lang}`, { recursive: true });
  fs.writeFileSync(`dist/${lang}/index.html`, finalHtml);

  if (lang === 'ru') {
    fs.writeFileSync('dist/index.html', finalHtml);
  }
}

console.log('Successfully generated dist/ru, dist/ky, dist/en, and dist/index.html with updated Inter typography, complete nav links, left-aligned 3-sentence descriptions, and refined ticker font.');

import { execSync } from 'child_process';
execSync('node scripts/build_clean_subpages.mjs', { stdio: 'inherit' });
