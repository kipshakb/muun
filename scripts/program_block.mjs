// Единый блок программы: один и тот же HTML вставляется в секцию Agenda
// на главной и на странице /program.

const UI = {
  ru: {
    trackAll: 'Все сессии',
    talks: 'MUUN Talks',
    panel: 'Панельные сессии',
    partner: 'От партнёров',
    startup: 'Startup Battle',
    hallAll: 'Все залы',
    kurultai: 'Зал «Курултай»',
    sairan: 'Зал «Сайран»',
    panelBadge: 'Панельная сессия',
    partnerBadge: 'От партнёров',
    people: 'Модератор и спикеры будут объявлены позже',
    empty: 'По выбранным фильтрам сессий нет',
    more: 'Подробнее'
  },
  ky: {
    trackAll: 'Бардык сессиялар',
    talks: 'MUUN Talks',
    panel: 'Панелдик сессиялар',
    partner: 'Өнөктөштөрдөн',
    startup: 'Startup Battle',
    hallAll: 'Бардык залдар',
    kurultai: '«Курултай» залы',
    sairan: '«Сайран» залы',
    panelBadge: 'Панелдик сессия',
    partnerBadge: 'Өнөктөштөрдөн',
    people: 'Модератор жана спикерлер кийинчерээк жарыяланат',
    empty: 'Тандалган чыпкалар боюнча сессиялар жок',
    more: 'Кененирээк'
  },
  en: {
    trackAll: 'All sessions',
    talks: 'MUUN Talks',
    panel: 'Panel sessions',
    partner: 'Partner sessions',
    startup: 'Startup Battle',
    hallAll: 'All halls',
    kurultai: 'Kurultai Hall',
    sairan: 'Sairan Hall',
    panelBadge: 'Panel session',
    partnerBadge: 'Partner session',
    people: 'Moderator and speakers to be announced',
    empty: 'No sessions match the selected filters',
    more: 'Details'
  }
};

// kind: talks | panel | partner | startup | ceremony | service
// hall: kurultai | sairan | undefined (общий слот на всю ширину)
const DAYS = [
  {
    label: { ru: 'День 1', ky: '1-күн', en: 'Day 1' },
    title: {
      ru: '17 ноября · Международный день студентов',
      ky: '17-ноябрь · Эл аралык студенттер күнү',
      en: '17 November · International Students’ Day'
    },
    rows: [
      {
        time: '10:00–11:00',
        items: [{
          kind: 'ceremony',
          title: { ru: 'Церемония официального открытия', ky: 'Расмий ачылыш аземи', en: 'Official Opening Ceremony' },
          note: { ru: 'Строго по приглашению', ky: 'Чакыруу менен гана', en: 'By invitation only' }
        }]
      },
      {
        time: '14:00',
        items: [{
          kind: 'service',
          title: { ru: 'Экспозиция открыта', ky: 'Экспозиция ачык', en: 'Exhibition opens' },
          note: { ru: 'С 14:00 вход по регистрации', ky: '14:00дөн баштап каттоо менен кирүү', en: 'Entry with registration from 14:00' }
        }]
      },
      {
        time: '14:00–14:50',
        items: [{
          kind: 'talks', hall: 'kurultai', code: 'MUUN Talks 1 · МАКСАТ', codeEn: 'MUUN Talks 1 · MAKSAT',
          title: {
            ru: 'Профессии будущего: чему учить сегодня',
            ky: 'Келечектин кесиптери: бүгүн эмнеге окутуу керек',
            en: 'Professions of the Future: What to Teach Today'
          },
          desc: {
            ru: 'Первая ключевая сессия. Ценность — ЦЕЛЬ, символ — снежный барс. О том, какие профессии будут нужны экономике Кыргызстана и чему учить поколение уже сейчас.',
            ky: 'Биринчи негизги сессия. Баалуулук — МАКСАТ, символу — илбирс. Кыргызстандын экономикасына кандай кесиптер керек болору жана муунду азыртан эмнеге окутуу керектиги тууралуу.',
            en: 'The first keynote session. Value — PURPOSE, symbol — the snow leopard. Which professions Kyrgyzstan’s economy will need and what this generation should be learning right now.'
          }
        }]
      },
      {
        time: '15:00–15:50',
        items: [
          {
            kind: 'panel', hall: 'kurultai', code: 'П1', codeEn: 'P1',
            title: {
              ru: 'Образование без границ: Stanford, Harvard, MIT, Columbia',
              ky: 'Чек арасыз билим: Stanford, Harvard, MIT, Columbia',
              en: 'Education Without Borders: Stanford, Harvard, MIT, Columbia'
            },
            desc: {
              ru: 'Истории поступления кыргызстанцев в ведущие мировые университеты: подготовка, финансирование, что делать школьнику уже сейчас.',
              ky: 'Кыргызстандыктардын дүйнөнүн алдыңкы университеттерине тапшыруу тажрыйбасы: даярдык, каржылоо жана мектеп окуучусу азыртан эмне кылышы керек.',
              en: 'How students from Kyrgyzstan got into the world’s leading universities: preparation, funding and what a school student can start doing now.'
            }
          },
          {
            kind: 'partner', hall: 'sairan',
            title: {
              ru: 'Блок презентаций: университеты',
              ky: 'Презентациялар блогу: университеттер',
              en: 'Presentations: Universities'
            },
            desc: {
              ru: 'Университеты представляют специальности, условия поступления, гранты и стипендии.',
              ky: 'Университеттер адистиктерин, кабыл алуу шарттарын, гранттарды жана стипендияларды тааныштырат.',
              en: 'Universities present their programmes, admission requirements, grants and scholarships.'
            }
          }
        ]
      },
      {
        time: '16:00–16:50',
        items: [{
          kind: 'talks', hall: 'kurultai', code: 'MUUN Talks 2 · УМТУЛУУ', codeEn: 'MUUN Talks 2 · UMTULUU',
          title: {
            ru: 'Новое поколение в эпоху AI: образование, карьера и навыки будущего',
            ky: 'Жасалма интеллект доорундагы жаңы муун: билим, карьера жана келечектин көндүмдөрү',
            en: 'A New Generation in the Age of AI: Education, Careers and Future Skills'
          },
          desc: {
            ru: 'Вторая ключевая сессия. Ценность — СТРЕМЛЕНИЕ, символ — беркут. Как искусственный интеллект меняет требования к специалистам и какие навыки дают молодым преимущество.',
            ky: 'Экинчи негизги сессия. Баалуулук — УМТУЛУУ, символу — бүркүт. Жасалма интеллект адистерге коюлган талаптарды кантип өзгөртүп жатканы жана жаштарга кайсы көндүмдөр артыкчылык берери тууралуу.',
            en: 'The second keynote session. Value — ASPIRATION, symbol — the golden eagle. How artificial intelligence is changing what employers expect and which skills give young people an edge.'
          }
        }]
      },
      {
        time: '17:00–17:45',
        items: [
          {
            kind: 'panel', hall: 'kurultai', code: 'П3', codeEn: 'P3',
            title: {
              ru: 'Креативный Кыргызстан: интеллектуальная собственность и цифровое будущее',
              ky: 'Креативдүү Кыргызстан: интеллектуалдык менчик жана санариптик келечек',
              en: 'Creative Kyrgyzstan: Intellectual Property and the Digital Future'
            },
            desc: {
              ru: 'Как блогеры, фестивали, кино и разработчики защищают свои права и зарабатывают на интеллектуальной собственности.',
              ky: 'Блогерлер, фестивалдар, кино жана иштеп чыгуучулар өз укуктарын кантип коргоп, интеллектуалдык менчиктен кантип киреше табышат.',
              en: 'How bloggers, festivals, filmmakers and developers protect their rights and earn from intellectual property.'
            }
          },
          {
            kind: 'partner', hall: 'sairan',
            title: {
              ru: 'Ярмарка вакансий и слот партнёра',
              ky: 'Жумуш ярмаркасы жана өнөктөштүн слоту',
              en: 'Job Fair and Partner Slot'
            },
            desc: {
              ru: 'Работодатели представляют вакансии и стажировки. В блоке — выступление партнёра.',
              ky: 'Иш берүүчүлөр бош орундарды жана стажировкаларды сунушташат. Блокто өнөктөштүн чыгып сүйлөөсү бар.',
              en: 'Employers present vacancies and internships. The block includes a partner presentation.'
            }
          }
        ]
      },
      {
        time: '17:45–18:00',
        items: [{
          kind: 'ceremony', hall: 'kurultai', wide: true,
          title: { ru: 'Закрытие первого дня', ky: 'Биринчи күндүн жабылышы', en: 'Day One Closing' },
          desc: {
            ru: 'Итоги дня, объявление топ-10 Startup Battle, анонс второго дня, концертный номер.',
            ky: 'Күндүн жыйынтыгы, Startup Battle топ-10 жарыяланышы, экинчи күндүн анонсу жана концерттик номер.',
            en: 'Highlights of the day, announcement of the Startup Battle top 10, a preview of day two and a musical performance.'
          }
        }]
      },
      {
        time: '18:00',
        items: [{
          kind: 'service',
          title: { ru: 'Окончание первого дня', ky: 'Биринчи күндүн аягы', en: 'End of Day One' }
        }]
      }
    ]
  },
  {
    label: { ru: 'День 2', ky: '2-күн', en: 'Day 2' },
    title: {
      ru: '18 ноября · Финал, награждение и закрытие',
      ky: '18-ноябрь · Финал, сыйлыктар жана жабылыш',
      en: '18 November · Finals, Awards and Closing'
    },
    rows: [
      {
        time: '09:00–10:00',
        items: [{
          kind: 'service',
          title: { ru: 'Начало регистрации', ky: 'Каттоонун башталышы', en: 'Registration opens' },
          note: { ru: 'Экспозиция работает с 09:00 до 18:00', ky: 'Экспозиция 09:00дөн 18:00гө чейин иштейт', en: 'The exhibition is open from 09:00 to 18:00' }
        }]
      },
      {
        time: '10:00–10:50',
        items: [
          {
            kind: 'talks', hall: 'kurultai', code: 'MUUN Talks 3 · УЧУР', codeEn: 'MUUN Talks 3 · UCHUR',
            title: {
              ru: 'Время перемен: искусственный интеллект, технологии и трансформация рынка труда',
              ky: 'Өзгөрүүлөр мезгили: жасалма интеллект, технологиялар жана эмгек рыногунун трансформациясы',
              en: 'Time of Change: AI, Technology and the Transformation of the Labour Market'
            },
            desc: {
              ru: 'Третья ключевая сессия. Ценность — ВРЕМЯ ПЕРЕМЕН, символ — Луна в фазе роста. О том, как технологии меняют отрасли и рынок труда страны.',
              ky: 'Үчүнчү негизги сессия. Баалуулук — ӨЗГӨРҮҮЛӨР МЕЗГИЛИ, символу — жаңы туулган Ай. Технологиялар тармактарды жана өлкөнүн эмгек рыногун кантип өзгөртүп жатканы тууралуу.',
              en: 'The third keynote session. Value — TIME OF CHANGE, symbol — the waxing Moon. How technology is reshaping industries and the country’s labour market.'
            }
          },
          {
            kind: 'partner', hall: 'sairan',
            title: {
              ru: 'Блок презентаций: школы и колледжи',
              ky: 'Презентациялар блогу: мектептер жана колледждер',
              en: 'Presentations: Schools and Colleges'
            },
            desc: {
              ru: 'На сцене — программы профессионального и дополнительного образования.',
              ky: 'Сахнада — кесиптик жана кошумча билим берүү программалары.',
              en: 'Vocational and supplementary education programmes take the stage.'
            }
          }
        ]
      },
      {
        time: '11:00–11:50',
        items: [
          {
            kind: 'panel', hall: 'kurultai', code: 'П2', codeEn: 'P2',
            title: {
              ru: 'Глобальный Big Tech: карьерные траектории от Бишкека',
              ky: 'Глобалдык Big Tech: Бишкектен башталган карьералык жолдор',
              en: 'Global Big Tech: Career Paths Starting in Bishkek'
            },
            desc: {
              ru: 'Кыргызстанцы в Google, Meta, Microsoft и Apple о том, как попали в глобальные компании и с чего начать студенту.',
              ky: 'Google, Meta, Microsoft жана Apple компанияларында иштеген кыргызстандыктар глобалдык компанияларга кантип кирүүгө болорун жана студент эмнеден баштаарын айтып беришет.',
              en: 'People from Kyrgyzstan working at Google, Meta, Microsoft and Apple share how they got there and where a student should start.'
            }
          },
          {
            kind: 'partner', hall: 'sairan',
            title: {
              ru: 'Блок презентаций: университеты',
              ky: 'Презентациялар блогу: университеттер',
              en: 'Presentations: Universities'
            },
            desc: {
              ru: 'Второй блок университетов: специальности, условия поступления, гранты и стипендии.',
              ky: 'Университеттердин экинчи блогу: адистиктер, кабыл алуу шарттары, гранттар жана стипендиялар.',
              en: 'The second university block: programmes, admission requirements, grants and scholarships.'
            }
          }
        ]
      },
      {
        time: '12:00–12:50',
        items: [{
          kind: 'talks', hall: 'kurultai', code: 'MUUN Talks 4 · НИЕТ', codeEn: 'MUUN Talks 4 · NIET',
          title: {
            ru: 'От идеи к действию: предпринимательство, стартапы и молодёжные инициативы',
            ky: 'Идеядан аракетке: ишкердик, стартаптар жана жаштар демилгелери',
            en: 'From Idea to Action: Entrepreneurship, Startups and Youth Initiatives'
          },
          desc: {
            ru: 'Четвёртая ключевая сессия. Ценность — НАМЕРЕНИЕ, символ — тулпар. О пути от идеи до первого клиента и первого инвестора.',
            ky: 'Төртүнчү негизги сессия. Баалуулук — НИЕТ, символу — тулпар. Идеядан биринчи кардарга жана биринчи инвесторго чейинки жол тууралуу.',
            en: 'The fourth keynote session. Value — INTENTION, symbol — the tulpar. The journey from an idea to the first customer and the first investor.'
          }
        }]
      },
      {
        time: '13:00–14:00',
        items: [
          {
            kind: 'panel', hall: 'kurultai', code: 'П8', codeEn: 'P8',
            title: {
              ru: 'Финтех и банкинг: конкуренция за клиента',
              ky: 'Финтех жана банкинг: кардар үчүн атаандаштык',
              en: 'Fintech and Banking: Competing for the Customer'
            },
            desc: {
              ru: 'Банки, телеком и платежи в эпоху цифровой трансформации. Председатели правления банков и Visa о том, кого они нанимают.',
              ky: 'Санариптик трансформация доорундагы банктар, телеком жана төлөмдөр. Банктардын башкармалык төрагалары жана Visa кимди жумушка алышарын айтып беришет.',
              en: 'Banks, telecoms and payments in the era of digital transformation. Bank CEOs and Visa on who they are hiring.'
            }
          },
          {
            kind: 'panel', hall: 'sairan', code: 'П6', codeEn: 'P6',
            title: {
              ru: 'Аэрокосмос и ИИ: мышление без границ',
              ky: 'Аэрокосмос жана ЖИ: чек арасыз ой жүгүртүү',
              en: 'Aerospace and AI: Thinking Without Limits'
            },
            desc: {
              ru: 'Стратосферные разработки, автономные системы и нейросети вместе с кыргызстанскими инженерами. В блоке — слот партнёра.',
              ky: 'Кыргызстандык инженерлер менен стратосфералык иштеп чыгуулар, автономдуу системалар жана нейрон тармактары. Блокто өнөктөштүн слоту бар.',
              en: 'Stratospheric projects, autonomous systems and neural networks with engineers from Kyrgyzstan. Includes a partner slot.'
            }
          }
        ]
      },
      {
        time: '14:00–14:45',
        items: [
          {
            kind: 'panel', hall: 'kurultai', code: 'П9', codeEn: 'P9',
            title: {
              ru: 'Жить в Кыргызстане — работать со всем миром',
              ky: 'Кыргызстанда жашап, бүткүл дүйнө менен иштөө',
              en: 'Live in Kyrgyzstan, Work with the World'
            },
            desc: {
              ru: 'Инфраструктура для компаний с глобальными амбициями: Парк высоких технологий, Парк креативных индустрий, СЭЗ «Бишкек», агентство по инвестициям.',
              ky: 'Глобалдык максаттары бар компаниялар үчүн инфраструктура: Жогорку технологиялар парки, Креативдүү индустриялар парки, «Бишкек» ЭЭА, инвестициялар боюнча агенттик.',
              en: 'Infrastructure for companies with global ambitions: the High Technology Park, the Creative Industries Park, the Bishkek Free Economic Zone and the investment agency.'
            }
          },
          {
            kind: 'panel', hall: 'sairan', code: 'П7', codeEn: 'P7',
            title: {
              ru: 'Стартапы и инновации: новое поколение основателей',
              ky: 'Стартаптар жана инновациялар: негиздөөчүлөрдүн жаңы мууну',
              en: 'Startups and Innovation: A New Generation of Founders'
            },
            desc: {
              ru: 'От Web3 до искусственной кожи — предприниматели, меняющие Кыргызстан.',
              ky: 'Web3төн жасалма териге чейин — Кыргызстанды өзгөртүп жаткан ишкерлер.',
              en: 'From Web3 to artificial skin — the entrepreneurs changing Kyrgyzstan.'
            }
          }
        ]
      },
      {
        time: '15:00–15:45',
        items: [
          {
            kind: 'panel', hall: 'kurultai', code: 'П5', codeEn: 'P5',
            title: {
              ru: 'Инклюзия без барьеров',
              ky: 'Тоскоолдуксуз инклюзия',
              en: 'Inclusion Without Barriers'
            },
            desc: {
              ru: 'Решения для устранения социальных, образовательных и инфраструктурных барьеров. ЮНИСЕФ, ОБСЕ, Совет по делам лиц с инвалидностью при Кабинете министров.',
              ky: 'Социалдык, билим берүү жана инфраструктуралык тоскоолдуктарды жоюу чечимдери. ЮНИСЕФ, ЕККУ, Министрлер Кабинетине караштуу Ден соолугунун мүмкүнчүлүгү чектелген адамдардын иштери боюнча кеңеш.',
              en: 'Solutions for removing social, educational and infrastructure barriers. UNICEF, OSCE and the Council on Persons with Disabilities under the Cabinet of Ministers.'
            }
          },
          {
            kind: 'panel', hall: 'sairan', code: 'П4', codeEn: 'P4',
            title: {
              ru: 'Спорт и киберспорт: эра цифровых атлетов',
              ky: 'Спорт жана киберспорт: санариптик атлеттер доору',
              en: 'Sport and Esports: The Era of Digital Athletes'
            },
            desc: {
              ru: 'От Всемирных игр кочевников до F1H2O — как кыргызстанцы создают профессии будущего в спорте.',
              ky: 'Дүйнөлүк көчмөндөр оюндарынан F1H2Oго чейин — кыргызстандыктар спортто келечектин кесиптерин кантип түзүп жатышат.',
              en: 'From the World Nomad Games to F1H2O — how people from Kyrgyzstan are creating the sports professions of the future.'
            }
          }
        ]
      },
      {
        time: '16:30–17:15',
        items: [{
          kind: 'startup',
          title: { ru: 'Финал стартапов', ky: 'Стартаптардын финалы', en: 'Startup Finals' }
        }]
      },
      {
        time: '17:15–17:50',
        items: [{
          kind: 'ceremony',
          title: { ru: 'Церемония награждения', ky: 'Сыйлык тапшыруу аземи', en: 'Awards Ceremony' }
        }]
      },
      {
        time: '17:50–18:15',
        items: [{
          kind: 'ceremony',
          title: { ru: 'Церемония закрытия', ky: 'Жабылыш аземи', en: 'Closing Ceremony' },
          note: {
            ru: 'Закладка капсулы будущего до 2036 года',
            ky: '2036-жылга чейинки келечек капсуласын коюу',
            en: 'Sealing of a time capsule to be opened in 2036'
          }
        }]
      }
    ]
  }
];

const TRACK_OF = { talks: 'talks', panel: 'panel', partner: 'partner', startup: 'startup' };

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function badgeText(item, lang, ui) {
  if (item.kind === 'talks') return lang === 'en' ? item.codeEn : item.code;
  if (item.kind === 'panel') return `${ui.panelBadge} · ${lang === 'en' ? item.codeEn : item.code}`;
  if (item.kind === 'partner') return ui.partnerBadge;
  if (item.kind === 'startup') return ui.startup;
  return '';
}

function renderItem(item, lang, ui) {
  const track = TRACK_OF[item.kind] || 'general';
  const wide = !item.hall || item.wide;
  const badge = badgeText(item, lang, ui);
  const hallLabel = item.hall ? ui[item.hall] : '';
  const desc = item.desc ? item.desc[lang] : '';
  const withPeople = item.kind === 'talks' || item.kind === 'panel';
  const expandable = Boolean(desc) || withPeople;
  const meta = (badge || hallLabel)
    ? `<span class="muun-prog-meta">${badge ? `<span class="muun-prog-badge">${esc(badge)}</span>` : ''}${hallLabel ? `<span class="muun-prog-hall">${esc(hallLabel)}</span>` : ''}</span>`
    : '';
  const note = item.note ? `<span class="muun-prog-note">${esc(item.note[lang])}</span>` : '';
  const classes = [
    'muun-prog-item',
    `is-${item.kind}`,
    wide ? 'is-wide' : '',
    expandable ? 'is-expandable' : ''
  ].filter(Boolean).join(' ');
  const attrs = `data-track="${track}"${item.hall ? ` data-hall="${item.hall}"` : ''}`;

  if (!expandable) {
    return `<div class="${classes}" ${attrs}><div class="muun-prog-head">${meta}<h3 class="muun-prog-title">${esc(item.title[lang])}</h3>${note}</div></div>`;
  }

  return `<div class="${classes}" ${attrs}>` +
    `<button type="button" class="muun-prog-head" aria-expanded="false" aria-label="${esc(ui.more)}: ${esc(item.title[lang])}">` +
      `${meta}<h3 class="muun-prog-title">${esc(item.title[lang])}</h3>${note}` +
      `<span class="muun-prog-toggle" aria-hidden="true"></span>` +
    `</button>` +
    `<div class="muun-prog-body"><div class="muun-prog-body-inner">` +
      (desc ? `<p class="muun-prog-desc">${esc(desc)}</p>` : '') +
      (withPeople ? `<p class="muun-prog-people">${esc(ui.people)}</p>` : '') +
    `</div></div>` +
  `</div>`;
}

export function renderProgramBlock(lang) {
  const ui = UI[lang] || UI.ru;
  const trackChips = [
    ['all', ui.trackAll], ['talks', ui.talks], ['panel', ui.panel], ['partner', ui.partner], ['startup', ui.startup]
  ].map(([v, label], i) => `<button type="button" class="muun-prog-chip${i === 0 ? ' is-active' : ''}${v === 'talks' ? ' is-talks' : ''}" data-prog-filter="track" data-value="${v}">${esc(label)}</button>`).join('');
  const hallChips = [
    ['all', ui.hallAll], ['kurultai', ui.kurultai], ['sairan', ui.sairan]
  ].map(([v, label], i) => `<button type="button" class="muun-prog-chip${i === 0 ? ' is-active' : ''}" data-prog-filter="hall" data-value="${v}">${esc(label)}</button>`).join('');

  const days = DAYS.map((day) => `
      <div class="muun-prog-day">
        <div class="muun-prog-dayhead">
          <div class="muun-prog-daylabel"><h3>${esc(day.label[lang])}</h3></div>
          <div class="muun-prog-daytitle"><h3>${esc(day.title[lang])}</h3></div>
        </div>
        <div class="muun-prog-rows">
          ${day.rows.map((row) => `
          <div class="muun-prog-row">
            <div class="muun-prog-time">${esc(row.time)}</div>
            <div class="muun-prog-slots">${row.items.map((item) => renderItem(item, lang, ui)).join('')}</div>
          </div>`).join('')}
        </div>
      </div>`).join('');

  return `
    <div class="muun-program" data-track="all" data-hall="all">
      <div class="muun-prog-filters">
        <div class="muun-prog-chips">${trackChips}</div>
        <div class="muun-prog-chips">${hallChips}</div>
      </div>
      ${days}
      <p class="muun-prog-empty" hidden>${esc(ui.empty)}</p>
    </div>`;
}

// Вставляет блок в SSR-разметку перед шаблонным контентом секции Agenda.
export function injectProgramSsr(html, lang) {
  const match = /<section\b[^>]*data-framer-name="Agenda"/.exec(html);
  if (!match) return html;
  const sec = match.index;
  const content = html.indexOf('data-framer-name="Content"', sec);
  if (content === -1) return html;
  const divStart = html.lastIndexOf('<div', content);
  return html.slice(0, divStart) + renderProgramBlock(lang) + html.slice(divStart);
}

export const programCss = `
  section[data-framer-name="Agenda"] > [data-framer-name="Container"] > [data-framer-name="Content"] {
    display: none !important;
  }
  .muun-program {
    display: flex;
    flex-direction: column;
    gap: 64px;
    width: 100%;
    font-family: Inter, sans-serif;
    color: #fff;
    box-sizing: border-box;
  }
  .muun-program *, .muun-program *::before, .muun-program *::after { box-sizing: border-box; }
  .muun-program h3, .muun-program p { margin: 0; }
  .muun-prog-filters {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px 24px;
    margin-bottom: -16px;
  }
  .muun-prog-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .muun-prog-chip {
    padding: 10px 18px;
    border: 0;
    border-radius: 100px;
    background: rgba(255,255,255,0.12);
    color: #fff;
    font: 500 15px/1.2 Inter, sans-serif;
    cursor: pointer;
    transition: background-color .2s ease, color .2s ease;
  }
  .muun-prog-chip:hover { background: rgba(255,255,255,0.2); }
  .muun-prog-chip.is-active { background: rgb(1, 30, 255); }
  .muun-prog-chip.is-talks:not(.is-active) { box-shadow: inset 0 0 0 1px rgba(64, 96, 255, 0.7); }
  .muun-prog-day { display: flex; flex-direction: column; gap: 48px; }
  .muun-prog-day[hidden], .muun-prog-row[hidden], .muun-prog-item[hidden] { display: none !important; }
  .muun-prog-dayhead { display: flex; align-items: stretch; min-height: 85px; }
  .muun-prog-daylabel {
    display: flex;
    align-items: center;
    flex: 0 0 259px;
    padding: 18px 24px;
    background: rgb(1, 30, 255);
    border-radius: 24px 0 0 24px;
  }
  .muun-prog-daytitle {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    padding: 18px 54px 18px 74px;
    background: rgba(255,255,255,0.12);
    border-radius: 0 24px 24px 0;
  }
  .muun-prog-dayhead h3 {
    font-family: "Inter Display", Inter, sans-serif;
    font-size: 38px;
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: -0.04em;
    color: #fff;
  }
  .muun-prog-daytitle h3 { color: rgb(237, 237, 237); }
  .muun-prog-rows { display: flex; flex-direction: column; gap: 32px; }
  .muun-prog-row {
    display: grid;
    grid-template-columns: 233px minmax(0, 1fr);
    column-gap: 74px;
    padding-left: 24px;
    align-items: start;
  }
  .muun-prog-time {
    padding-top: 22px;
    font-size: 24px;
    line-height: 1.4;
    letter-spacing: -0.03em;
    color: rgb(237, 237, 237);
    white-space: nowrap;
  }
  .muun-prog-slots {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    align-items: start;
  }
  .muun-prog-item { grid-column: 1; border-radius: 24px; background: rgb(17, 17, 20); }
  .muun-prog-item[data-hall="sairan"] { grid-column: 2; }
  .muun-prog-item.is-wide { grid-column: 1 / -1; }
  .muun-program[data-hall="kurultai"] .muun-prog-slots,
  .muun-program[data-hall="sairan"] .muun-prog-slots { grid-template-columns: minmax(0, 1fr); }
  .muun-program[data-hall="kurultai"] .muun-prog-item,
  .muun-program[data-hall="sairan"] .muun-prog-item { grid-column: 1; }
  .muun-prog-item.is-service { background: transparent; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12); }
  .muun-prog-item.is-talks {
    background: linear-gradient(135deg, rgba(1, 30, 255, 0.38) 0%, rgba(1, 30, 255, 0.1) 48%, rgb(17, 17, 20) 100%);
    box-shadow: inset 0 0 0 1px rgba(64, 96, 255, 0.6);
  }
  .muun-prog-head {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
    padding: 24px 32px;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
  }
  button.muun-prog-head { padding-right: 84px; cursor: pointer; }
  .muun-prog-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; }
  .muun-prog-badge {
    padding: 5px 12px;
    border-radius: 100px;
    background: rgba(255,255,255,0.08);
    color: rgb(207, 207, 207);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .is-talks .muun-prog-badge { background: rgb(1, 30, 255); color: #fff; }
  .is-panel .muun-prog-badge { background: rgba(41, 170, 225, 0.16); color: #8ed8ff; }
  .is-startup .muun-prog-badge { background: rgba(255, 176, 32, 0.16); color: #ffc56b; }
  .muun-prog-hall {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
  }
  .muun-prog-title {
    font-family: "Inter Display", Inter, sans-serif;
    font-size: 26px;
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: -0.03em;
    color: rgb(237, 237, 237);
  }
  .is-wide .muun-prog-title { font-size: 32px; }
  .muun-prog-note { font-size: 16px; line-height: 1.5; color: rgb(191, 191, 191); }
  .muun-prog-toggle {
    position: absolute;
    top: 24px;
    right: 28px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    transition: transform .3s ease, background-color .2s ease;
  }
  .muun-prog-toggle::before, .muun-prog-toggle::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 14px;
    height: 2px;
    margin: -1px 0 0 -7px;
    border-radius: 2px;
    background: #fff;
  }
  .muun-prog-toggle::after { transform: rotate(90deg); }
  .muun-prog-head:hover .muun-prog-toggle { background: rgb(1, 30, 255); }
  .muun-prog-item.is-open .muun-prog-toggle { transform: rotate(45deg); background: rgb(1, 30, 255); }
  .muun-prog-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s ease; }
  .muun-prog-item.is-open .muun-prog-body { grid-template-rows: 1fr; }
  .muun-prog-body-inner { overflow: hidden; }
  .muun-prog-desc {
    padding: 0 32px 0;
    max-width: 820px;
    font-size: 18px;
    line-height: 1.4;
    color: rgb(191, 191, 191);
  }
  .muun-prog-people {
    margin: 16px 32px 0 !important;
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.1);
    font-size: 15px;
    line-height: 1.5;
    color: rgba(255,255,255,0.55);
  }
  .muun-prog-body-inner > :last-child { margin-bottom: 26px !important; }
  .muun-prog-empty { font-size: 18px; color: rgb(191, 191, 191); }
  @media (max-width: 1199px) {
    .muun-prog-row { grid-template-columns: 170px minmax(0, 1fr); column-gap: 32px; padding-left: 0; }
    .muun-prog-time { font-size: 20px; }
    .muun-prog-daylabel { flex-basis: 200px; }
    .muun-prog-daytitle { padding: 18px 32px; }
    .muun-prog-dayhead h3 { font-size: 30px; }
  }
  @media (max-width: 809px) {
    .muun-program { gap: 48px; }
    .muun-prog-filters { margin-bottom: 0; }
    .muun-prog-chips { flex-wrap: nowrap; overflow-x: auto; width: 100%; padding-bottom: 4px; scrollbar-width: none; }
    .muun-prog-chips::-webkit-scrollbar { display: none; }
    .muun-prog-chip { flex: none; font-size: 14px; padding: 9px 16px; }
    .muun-prog-day { gap: 28px; }
    .muun-prog-dayhead { min-height: 0; }
    .muun-prog-daylabel { flex-basis: auto; padding: 14px 18px; border-radius: 18px 0 0 18px; }
    .muun-prog-daytitle { padding: 14px 18px; border-radius: 0 18px 18px 0; }
    .muun-prog-dayhead h3 { font-size: 20px; letter-spacing: -0.03em; }
    .muun-prog-rows { gap: 24px; }
    .muun-prog-row { display: flex; flex-direction: column; align-items: stretch; gap: 10px; }
    .muun-prog-time { padding-top: 0; font-size: 18px; }
    .muun-prog-slots { grid-template-columns: minmax(0, 1fr); gap: 12px; }
    .muun-prog-item, .muun-prog-item[data-hall="sairan"] { grid-column: 1; border-radius: 20px; }
    .muun-prog-head { padding: 20px; }
    button.muun-prog-head { padding-right: 64px; }
    .muun-prog-toggle { top: 18px; right: 16px; width: 34px; height: 34px; }
    .muun-prog-title, .is-wide .muun-prog-title { font-size: 20px; }
    .muun-prog-desc { padding: 0 20px; font-size: 16px; }
    .muun-prog-people { margin: 14px 20px 0 !important; }
    .muun-prog-body-inner > :last-child { margin-bottom: 20px !important; }
  }
`;

// Делегирование событий на document: блок может быть перерисован при гидрации Framer.
export const programClientJs = `
  (function () {
    if (window.__muunProgramBound) return;
    window.__muunProgramBound = true;
    function apply(root) {
      var track = root.dataset.track || 'all';
      var hall = root.dataset.hall || 'all';
      var anyDay = false;
      root.querySelectorAll('.muun-prog-day').forEach(function (day) {
        var anyRow = false;
        day.querySelectorAll('.muun-prog-row').forEach(function (row) {
          var anyItem = false;
          row.querySelectorAll('.muun-prog-item').forEach(function (item) {
            var okTrack = track === 'all' || item.dataset.track === track;
            var okHall = hall === 'all' || !item.dataset.hall || item.dataset.hall === hall;
            item.hidden = !(okTrack && okHall);
            if (!item.hidden) anyItem = true;
          });
          row.hidden = !anyItem;
          if (anyItem) anyRow = true;
        });
        day.hidden = !anyRow;
        if (anyRow) anyDay = true;
      });
      var empty = root.querySelector('.muun-prog-empty');
      if (empty) empty.hidden = anyDay;
    }
    document.addEventListener('click', function (e) {
      var chip = e.target.closest('.muun-program [data-prog-filter]');
      if (chip) {
        var root = chip.closest('.muun-program');
        var group = chip.dataset.progFilter;
        root.dataset[group] = chip.dataset.value;
        root.querySelectorAll('[data-prog-filter="' + group + '"]').forEach(function (c) {
          c.classList.toggle('is-active', c === chip);
        });
        apply(root);
        return;
      }
      var head = e.target.closest('.muun-program button.muun-prog-head');
      if (head) {
        var item = head.closest('.muun-prog-item');
        var open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open);
        head.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    });
  })();
`;

// Фрагмент для периодического фиксера гидрации: возвращает блок, если Framer его перерисовал.
export function programFixerJs(lang) {
  return `
    (function () {
      var sec = document.querySelector('section[data-framer-name="Agenda"]');
      if (!sec || sec.querySelector('.muun-program')) return;
      var content = sec.querySelector('[data-framer-name="Container"] > [data-framer-name="Content"]');
      if (content) content.insertAdjacentHTML('beforebegin', ${JSON.stringify(renderProgramBlock(lang))});
    })();
  `;
}
