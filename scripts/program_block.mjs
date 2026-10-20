// Единый блок программы: один и тот же HTML вставляется в секцию Agenda
// на главной и на странице /program.

const UI = {
  ru: {
    trackAll: 'Все сессии',
    talks: 'MUUN Talks',
    pitch: 'Питч-сессии',
    table: 'Открытый стол',
    hallAll: 'Все залы',
    kurultai: 'Зал «Курултай»',
    nasyyat: 'Зал «Насыят»',
    sanzhyra: 'Зал «Санжыра»',
    pitchBadge: 'Питч-сессия',
    tableBadge: 'Открытый стол',
    people: 'Модератор и спикеры будут объявлены позже',
    empty: 'По выбранным фильтрам сессий нет',
    more: 'Подробнее'
  },
  ky: {
    trackAll: 'Бардык сессиялар',
    talks: 'MUUN Talks',
    pitch: 'Питч-сессиялар',
    table: 'Ачык стол',
    hallAll: 'Бардык залдар',
    kurultai: '«Курултай» залы',
    nasyyat: '«Насыят» залы',
    sanzhyra: '«Санжыра» залы',
    pitchBadge: 'Питч-сессия',
    tableBadge: 'Ачык стол',
    people: 'Модератор жана спикерлер кийинчерээк жарыяланат',
    empty: 'Тандалган чыпкалар боюнча сессиялар жок',
    more: 'Кененирээк'
  },
  en: {
    trackAll: 'All sessions',
    talks: 'MUUN Talks',
    pitch: 'Pitch sessions',
    table: 'Open Table',
    hallAll: 'All halls',
    kurultai: 'Kurultai Hall',
    nasyyat: 'Nasyyat Hall',
    sanzhyra: 'Sanzhyra Hall',
    pitchBadge: 'Pitch session',
    tableBadge: 'Open Table',
    people: 'Moderator and speakers to be announced',
    empty: 'No sessions match the selected filters',
    more: 'Details'
  }
};

// kind: talks | pitch | table | ceremony | service
// hall: kurultai | nasyyat | sanzhyra | undefined (общий слот на всю ширину)
const DAYS = [
  {
    label: { ru: '17 ноября', ky: '17-ноябрь', en: '17 November' },
    title: {
      ru: 'Международный день студентов',
      ky: 'Эл аралык студенттер күнү',
      en: 'International Students’ Day'
    },
    rows: [
      {
        time: '07:00–10:00',
        items: [{
          kind: 'service',
          title: {
            ru: 'Регистрация приглашённых участников',
            ky: 'Чакырылган катышуучуларды каттоо',
            en: 'Registration of invited participants'
          },
          note: {
            ru: 'Строго по приглашению',
            ky: 'Чакыруу боюнча гана',
            en: 'Strictly by invitation'
          }
        }]
      },
      {
        time: '10:00–11:00',
        items: [{
          kind: 'service',
          title: {
            ru: 'Выставочная экспозиция',
            ky: 'Көргөзмө экспозициясы',
            en: 'Exhibition showcase'
          },
          note: {
            ru: 'Для приглашённых участников церемонии',
            ky: 'Аземдин чакырылган катышуучулары үчүн',
            en: 'For invited ceremony participants'
          }
        }]
      },
      {
        time: '11:00–12:00',
        items: [{
          kind: 'ceremony',
          title: {
            ru: 'Церемония официального открытия',
            ky: 'Расмий ачылыш аземи',
            en: 'Official Opening Ceremony'
          },
          note: {
            ru: 'Строго по приглашению',
            ky: 'Чакыруу боюнча гана',
            en: 'Strictly by invitation'
          },
          desc: {
            ru: 'Торжественный старт главного молодёжного дня страны.',
            ky: 'Өлкөнүн башкы жаштар күнүнүн салтанаттуу башталышы.',
            en: 'Grand opening of the country’s premier youth day.'
          }
        }]
      },
      {
        time: '13:30',
        items: [{
          kind: 'service',
          title: {
            ru: 'Вход для посетителей по регистрации',
            ky: 'Каттоо боюнча келүүчүлөрдүн кирүүсү',
            en: 'Visitor Entry with Registration'
          },
          note: {
            ru: 'Выставочная экспозиция открыта до 17:45',
            ky: 'Көргөзмө экспозициясы 17:45ке чейин ачык',
            en: 'Exhibition open until 17:45'
          },
          desc: {
            ru: 'Выставочная экспозиция открыта до 17:45. С 14:00 в фойе зала Курултай — карьерная зона «Оффер у стенда»: экспресс-собеседования у стендов и разбор резюме. Приходи с резюме!',
            ky: 'Көргөзмө экспозициясы 17:45ке чейин ачык. 14:00дөн баштап «Курултай» залынын фойесинде — «Стендде оффер» карьералык аймагы: стенддерде экспресс-маектешүүлөр жана резюмени талдоо. Резюмеңиз менен келиңиз!',
            en: 'Exhibition open until 17:45. From 14:00 in Kurultai Hall foyer — career zone “Offer at the Stand”: express interviews and CV reviews. Come with your resume!'
          }
        }]
      },
      {
        time: '14:00–14:55',
        items: [
          {
            kind: 'talks', hall: 'kurultai',
            code: 'MUUN Talks · МАКСАТ', codeEn: 'MUUN Talks · MAKSAT',
            timeSlot: '14:00–14:45',
            title: {
              ru: 'Пленарная сессия 1: «Профессии будущего: чему учить сегодня»',
              ky: '1-пленардык сессия: «Келечектин кесиптери: бүгүн эмнеге окутуу керек»',
              en: 'Plenary Session 1: “Professions of the Future: What to Teach Today”'
            },
            desc: {
              ru: '«Кем ты станешь через 10 лет» — какие профессии нужны стране завтра и чему учиться уже сегодня.',
              ky: '«10 жылдан кийин ким болосуң» — эртең өлкөгө кайсы кесиптер керек болот жана бүгүн эмнеге окуу зарыл.',
              en: '“Who will you become in 10 years” — what professions the country will need tomorrow and what to learn today.'
            }
          },
          {
            kind: 'pitch', hall: 'nasyyat',
            badge: { ru: 'Питч-сессия', ky: 'Питч-сессия', en: 'Pitch Session' },
            timeSlot: '14:00–15:30',
            title: {
              ru: 'Питч-сессия Kel Start: открытие и выступления № 1–15',
              ky: 'Kel Start питч-сессиясы: ачылышы жана № 1–15 чыгып сүйлөөлөрү',
              en: 'Kel Start Pitch Session: Opening & Pitches #1–15'
            },
            desc: {
              ru: '30 молодёжных стартапов — одна сцена. Старт конкурса, затем питчи перед жюри и инвесторами: 3 минуты на питч, 2 — на вопросы.',
              ky: '30 жаштар стартапы — бир сахна. Сынактын башталышы, калыстар тобу менен инвесторлордун алдында питчтер: питчке 3 мүнөт, суроолорго 2 мүнөт.',
              en: '30 youth startups — one stage. Kickoff followed by pitches to judges and investors: 3 min pitch, 2 min Q&A.'
            }
          },
          {
            kind: 'table', hall: 'sanzhyra',
            badge: { ru: 'Круглый стол 1', ky: '1-тегерек стол', en: 'Roundtable 1' },
            timeSlot: '14:00–14:55',
            title: {
              ru: 'Круглый стол 1 «Лаборатория профессий будущего»',
              ky: '1-тегерек стол «Келечек кесиптеринин лабораториясы»',
              en: 'Roundtable 1: “Laboratory of Future Professions”'
            },
            desc: {
              ru: '«Потрогай будущее» — робототехника, медтех и ИИ в живых демонстрациях от практиков.',
              ky: '«Келечекти сезип көр» — робототехника, медтех жана ЖИ тажрыйбалуу адистердин жандуу көрсөтмөсүндө.',
              en: '“Touch the future” — robotics, medtech and AI in live practical demonstrations.'
            }
          }
        ]
      },
      {
        time: '14:55–15:40',
        items: [
          {
            kind: 'talks', hall: 'kurultai',
            code: 'MUUN Talks · УМТУЛУУ', codeEn: 'MUUN Talks · UMTULUU',
            timeSlot: '14:55–15:40',
            title: {
              ru: 'Пленарная сессия 2: «От Бишкека до Harvard и Big Tech: как мечтать масштабно в эпоху AI»',
              ky: '2-пленардык сессия: «Бишкектен Harvard жана Big Techке чейин: AI доорунда кантип масштабдуу кыялдануу керек»',
              en: 'Plenary Session 2: “From Bishkek to Harvard & Big Tech: How to Dream Big in the Age of AI”'
            },
            desc: {
              ru: '«Из Бишкека — в Big Tech» — реальные истории пути в глобальные IT-компании и навыки, которые для этого нужны.',
              ky: '«Бишкектен — Big Techке» — глобалдык IT-компанияларга жетүү жолунун чыныгы тарыхтары жана буга зарыл көндүмдөр.',
              en: '“From Bishkek to Big Tech” — real stories of journeys to global IT companies and skills needed.'
            }
          },
          {
            kind: 'table', hall: 'sanzhyra',
            badge: { ru: 'Круглый стол 2', ky: '2-тегерек стол', en: 'Roundtable 2' },
            timeSlot: '15:00–15:35',
            title: {
              ru: 'Круглый стол 2 «Спорт и киберспорт: игра на победу»',
              ky: '2-тегерек стол «Спорт жана киберспорт: жеңиш үчүн оюн»',
              en: 'Roundtable 2: “Sport and Esports: Playing to Win”'
            },
            desc: {
              ru: 'От киберспорта до Всемирных игр кочевников: какие профессии скрываются за большим спортом.',
              ky: 'Киберспорттон Дүйнөлүк көчмөндөр оюндарына чейин: чоң спорттун артында кандай кесиптер турат.',
              en: 'From esports to the World Nomad Games: what professions lie behind major sports.'
            }
          }
        ]
      },
      {
        time: '15:40–16:15',
        items: [
          {
            kind: 'talks', hall: 'kurultai',
            code: 'MUUN Talks · УЧУР', codeEn: 'MUUN Talks · UCHUR',
            timeSlot: '15:50–16:35',
            title: {
              ru: 'Пленарная сессия 3: «Время перемен: ИИ, технологии, интеллектуальная собственность и рынок труда»',
              ky: '3-пленардык сессия: «Өзгөрүүлөр мезгили: ЖИ, технологиялар, интеллектуалдык менчик жана эмгек рыногу»',
              en: 'Plenary Session 3: “Time of Change: AI, Technology, Intellectual Property and the Labour Market”'
            },
            desc: {
              ru: '«ИИ не заберёт твою работу, если ты знаешь новые правила и умеешь защищать свои идеи» — где появятся новые рабочие места, какие навыки нужны уже сейчас и как превратить свою идею в защищённый актив.',
              ky: '«Эгер жаңы эрежелерди билип, идеяларыңды коргой алсаң, ЖИ жумушуңду тартып албайт» — жаңы жумуш орундары кайда пайда болот, азыртан кандай көндүмдөр керек жана идеяны кантип корголгон активге айландырууга болот.',
              en: '“AI won’t take your job if you know the new rules and how to protect your ideas” — where new jobs will emerge, what skills are needed now, and how to turn your idea into a protected asset.'
            }
          },
          {
            kind: 'pitch', hall: 'nasyyat',
            badge: { ru: 'Питч-сессия', ky: 'Питч-сессия', en: 'Pitch Session' },
            timeSlot: '15:45–17:00',
            title: {
              ru: 'Питч-сессия Kel Start: выступления № 16–30',
              ky: 'Kel Start питч-сессиясы: № 16–30 чыгып сүйлөөлөрү',
              en: 'Kel Start Pitch Session: Pitches #16–30'
            },
            desc: {
              ru: 'Вторая волна питчей — поддержи команды из зала. Итоги — в 17:45 в зале «Курултай».',
              ky: 'Питчтердин экинчи толкуну — залдан командаларды колдоп бериңиз. Жыйынтыгы — 17:45те «Курултай» залында.',
              en: 'The second wave of pitches — support teams from the audience. Results at 17:45 in Kurultai Hall.'
            }
          },
          {
            kind: 'table', hall: 'sanzhyra',
            badge: { ru: 'Мастер-класс', ky: 'Мастер-класс', en: 'Masterclass' },
            timeSlot: '15:40–16:15',
            title: {
              ru: 'Мастер-класс «Оффер мечты: как попасть в глобальную компанию»',
              ky: 'Мастер-класс «Кыялдагы оффер: глобалдык компанияга кантип кирүү керек»',
              en: 'Masterclass: “Dream Offer: How to Land a Job at a Global Company”'
            },
            desc: {
              ru: 'Разбор резюме и учебное собеседование — узнай, что ищут международные работодатели.',
              ky: 'Резюмелерди талдоо жана машыгуу маектешүүсү — эл аралык иш берүүчүлөр эмнени издешерин билип алыңыз.',
              en: 'Resume review and mock interview — learn what international employers look for.'
            }
          }
        ]
      },
      {
        time: '16:15–16:35',
        items: [
          {
            kind: 'table', hall: 'sanzhyra',
            badge: { ru: 'Открытый диалог', ky: 'Ачык диалог', en: 'Open Dialogue' },
            timeSlot: '16:15–16:35',
            title: {
              ru: 'Открытый диалог «Спроси PhD: учёба в США и гранты»',
              ky: 'Ачык диалог «PhDден сура: АКШдагы окуу жана гранттар»',
              en: 'Open Dialogue: “Ask a PhD: US Studies & Grants”'
            },
            desc: {
              ru: 'Как поступить в университет США и найти стипендию — задай свой вопрос напрямую.',
              ky: 'АКШ университетине кантип тапшыруу жана стипендия табуу керек — сурооңузду түздөн-түз бериңиз.',
              en: 'How to apply to a US university and find a scholarship — ask your question directly.'
            }
          }
        ]
      },
      {
        time: '16:35–17:30',
        items: [
          {
            kind: 'talks', hall: 'kurultai',
            code: 'MUUN Talks · НИЕТ', codeEn: 'MUUN Talks · NIET',
            timeSlot: '16:45–17:30',
            title: {
              ru: 'Пленарная сессия 4: «От идеи к действию: предпринимательство, стартапы и молодёжные инициативы»',
              ky: '4-пленардык сессия: «Идеядан аракетке: ишкердик, стартаптар жана жаштар демилгелери»',
              en: 'Plenary Session 4: “From Idea to Action: Entrepreneurship, Startups and Youth Initiatives”'
            },
            desc: {
              ru: '«Хватит ждать — запускай своё» — как начать дело без капитала и где найти первое финансирование.',
              ky: '«Күтүүнү токтот — өз ишиңди башта» — капиталсыз бизнести кантип баштоо жана биринчи каржылоону кайдан табуу керек.',
              en: '“Stop waiting — launch your own” — how to start a business without capital and find initial funding.'
            }
          },
          {
            kind: 'table', hall: 'sanzhyra',
            badge: { ru: 'Круглый стол 3', ky: '3-тегерек стол', en: 'Roundtable 3' },
            timeSlot: '16:35–17:30',
            title: {
              ru: 'Круглый стол 3 «От идеи до оффера: стартап, блог, Big Tech, финтех»',
              ky: '3-тегерек стол «Идеядан офферге чейин: стартап, блог, Big Tech, финтех»',
              en: 'Roundtable 3: “From Idea to Offer: Startup, Blog, Big Tech, Fintech”'
            },
            desc: {
              ru: '«Без фильтров» — честные истории о четырёх путях. Выбери свой.',
              ky: '«Фильтрсиз» — төрт жол тууралуу ачык тарыхтар. Өзүңдүкүн танда.',
              en: '“Unfiltered” — honest stories about four pathways. Choose yours.'
            }
          }
        ]
      },
      {
        time: '17:45–18:05',
        items: [
          {
            kind: 'pitch', hall: 'kurultai', wide: true,
            badge: { ru: 'Итоги Kel Start', ky: 'Kel Start жыйынтыгы', en: 'Kel Start Results' },
            timeSlot: '17:45–18:05',
            title: {
              ru: 'Подведение итогов питч-сессии Kel Start',
              ky: 'Kel Start питч-сессиясынын жыйынтыгын чыгаруу',
              en: 'Kel Start Pitch Session Results & Awards'
            },
            desc: {
              ru: 'Объявляем лучшие молодёжные стартапы дня и чествуем победителей.',
              ky: 'Күндүн мыкты жаштар стартаптарын жарыялап, жеңүүчүлөрдү сыйлайбыз.',
              en: 'Announcing the best youth startups of the day and honoring the winners.'
            }
          }
        ]
      },
      {
        time: '18:05–18:30',
        items: [
          {
            kind: 'ceremony', hall: 'kurultai', wide: true,
            timeSlot: '18:05–18:30',
            title: {
              ru: 'Концертная программа',
              ky: 'Концерттик программа',
              en: 'Concert Programme'
            },
            desc: {
              ru: 'Яркий финал дня MUUN 2026.',
              ky: 'MUUN 2026 күнүнүн жаркын финалы.',
              en: 'A bright finale of MUUN 2026.'
            }
          }
        ]
      },
      {
        time: '18:30',
        items: [
          {
            kind: 'service',
            title: {
              ru: 'Окончание форума',
              ky: 'Форумдун аягы',
              en: 'End of Forum'
            }
          }
        ]
      }
    ]
  }
];

const TRACK_OF = {
  talks: 'talks',
  pitch: 'pitch',
  table: 'table',
  ceremony: 'ceremony',
  service: 'service'
};

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function badgeText(item, lang, ui) {
  if (item.badge) {
    if (typeof item.badge === 'object') {
      return item.badge[lang] || item.badge.ru || '';
    }
    return String(item.badge);
  }
  if (item.kind === 'talks') {
    if (lang === 'en') return item.codeEn || item.code || 'MUUN Talks';
    return item.code || 'MUUN Talks';
  }
  if (item.kind === 'pitch') return ui.pitchBadge;
  if (item.kind === 'table') return ui.tableBadge;
  return '';
}

function renderItem(item, lang, ui) {
  const track = TRACK_OF[item.kind] || 'general';
  const wide = !item.hall || item.wide;
  const badge = badgeText(item, lang, ui);
  const hallLabel = item.hall ? ui[item.hall] : '';
  const desc = item.desc ? item.desc[lang] : '';
  const withPeople = (item.kind === 'talks' || item.kind === 'table') && item.withPeople !== false;
  const expandable = Boolean(desc) || withPeople;
  const meta = (badge || hallLabel)
    ? `<span class="muun-prog-meta">${badge ? `<span class="muun-prog-badge">${esc(badge)}</span>` : ''}${hallLabel ? `<span class="muun-prog-hall">${esc(hallLabel)}</span>` : ''}</span>`
    : '';

  const timeBadge = item.timeSlot
    ? `<span class="muun-prog-time-badge"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span>${esc(item.timeSlot)}</span></span>`
    : '';

  const rawNote = item.note ? (typeof item.note === 'object' ? (item.note[lang] || item.note.ru) : item.note) : '';
  const note = rawNote ? `<span class="muun-prog-note">${esc(rawNote)}</span>` : '';

  const classes = [
    'muun-prog-item',
    `is-${item.kind}`,
    wide ? 'is-wide' : '',
    expandable ? 'is-expandable' : ''
  ].filter(Boolean).join(' ');
  const attrs = `data-track="${track}"${item.hall ? ` data-hall="${item.hall}"` : ''}`;

  if (!expandable) {
    return `<div class="${classes}" ${attrs}><div class="muun-prog-head">${meta}<h3 class="muun-prog-title">${esc(item.title[lang])}</h3>${timeBadge}${note}</div></div>`;
  }

  return `<div class="${classes}" ${attrs}>` +
    `<button type="button" class="muun-prog-head" aria-expanded="false" aria-label="${esc(ui.more)}: ${esc(item.title[lang])}">` +
      `${meta}<h3 class="muun-prog-title">${esc(item.title[lang])}</h3>${timeBadge}${note}` +
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
    ['all', ui.trackAll],
    ['talks', ui.talks],
    ['pitch', ui.pitch],
    ['table', ui.table]
  ].map(([v, label], i) => `<button type="button" class="muun-prog-chip${i === 0 ? ' is-active' : ''}${v === 'talks' ? ' is-talks' : ''}" data-prog-filter="track" data-value="${v}">${esc(label)}</button>`).join('');
  const hallChips = [
    ['all', ui.hallAll],
    ['kurultai', ui.kurultai],
    ['nasyyat', ui.nasyyat],
    ['sanzhyra', ui.sanzhyra]
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
    white-space: nowrap;
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
    grid-template-columns: 200px minmax(0, 1fr);
    column-gap: 48px;
    padding-left: 16px;
    align-items: start;
  }
  .muun-prog-time {
    padding-top: 18px;
    font-size: 22px;
    line-height: 1.4;
    letter-spacing: -0.03em;
    font-weight: 500;
    color: rgb(237, 237, 237);
    white-space: nowrap;
  }
  .muun-prog-slots {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    align-items: start;
  }
  .muun-prog-item {
    border-radius: 22px;
    background: rgb(17, 17, 20);
    transition: transform .2s ease, box-shadow .2s ease;
  }
  .muun-prog-item[data-hall="kurultai"] { grid-column: 1; }
  .muun-prog-item[data-hall="nasyyat"] { grid-column: 2; }
  .muun-prog-item[data-hall="sanzhyra"] { grid-column: 3; }
  .muun-prog-item.is-wide { grid-column: 1 / -1; }

  /* Full width when filtered by specific hall */
  .muun-program[data-hall="kurultai"] .muun-prog-slots,
  .muun-program[data-hall="nasyyat"] .muun-prog-slots,
  .muun-program[data-hall="sanzhyra"] .muun-prog-slots {
    grid-template-columns: minmax(0, 1fr);
  }
  .muun-program[data-hall="kurultai"] .muun-prog-item,
  .muun-program[data-hall="nasyyat"] .muun-prog-item,
  .muun-program[data-hall="sanzhyra"] .muun-prog-item {
    grid-column: 1 !important;
  }

  /* Full width when filtered by specific track */
  .muun-program:not([data-track="all"]) .muun-prog-slots {
    grid-template-columns: minmax(0, 1fr);
  }
  .muun-program:not([data-track="all"]) .muun-prog-item {
    grid-column: 1 !important;
  }

  .muun-prog-item.is-service {
    background: transparent;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);
  }
  .muun-prog-item.is-talks {
    background: linear-gradient(135deg, rgba(1, 30, 255, 0.32) 0%, rgba(1, 30, 255, 0.08) 48%, rgb(17, 17, 20) 100%);
    box-shadow: inset 0 0 0 1px rgba(64, 96, 255, 0.55);
  }
  .muun-prog-item.is-pitch {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0.04) 48%, rgb(17, 17, 20) 100%);
    box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.35);
  }
  .muun-prog-item.is-table {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.18) 0%, rgba(14, 165, 233, 0.04) 48%, rgb(17, 17, 20) 100%);
    box-shadow: inset 0 0 0 1px rgba(14, 165, 233, 0.35);
  }
  .muun-prog-item.is-ceremony {
    background: linear-gradient(135deg, rgba(147, 51, 234, 0.22) 0%, rgba(147, 51, 234, 0.06) 48%, rgb(17, 17, 20) 100%);
    box-shadow: inset 0 0 0 1px rgba(147, 51, 234, 0.45);
  }

  .muun-prog-head {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
    padding: 22px 24px;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
  }
  button.muun-prog-head { padding-right: 64px; cursor: pointer; }
  .muun-prog-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; }
  .muun-prog-badge {
    padding: 4px 10px;
    border-radius: 100px;
    background: rgba(255,255,255,0.08);
    color: rgb(207, 207, 207);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .is-talks .muun-prog-badge { background: rgb(1, 30, 255); color: #fff; }
  .is-pitch .muun-prog-badge { background: rgba(245, 158, 11, 0.22); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
  .is-table .muun-prog-badge { background: rgba(14, 165, 233, 0.22); color: #38bdf8; border: 1px solid rgba(14, 165, 233, 0.4); }
  .is-ceremony .muun-prog-badge { background: rgba(147, 51, 234, 0.25); color: #c084fc; }

  .muun-prog-hall {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
  }
  .muun-prog-title {
    font-family: "Inter Display", Inter, sans-serif;
    font-size: 21px;
    font-weight: 500;
    line-height: 1.28;
    letter-spacing: -0.025em;
    color: rgb(237, 237, 237);
  }
  .is-wide .muun-prog-title { font-size: 28px; }

  /* Заметный акцентный бейдж времени сессии внутри карточки */
  .muun-prog-time-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-top: 8px;
    padding: 5px 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.09);
    border: 1px solid rgba(255, 255, 255, 0.16);
    font-family: Inter, sans-serif;
    font-size: 17px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  }
  .is-talks .muun-prog-time-badge {
    background: rgba(1, 30, 255, 0.26);
    border-color: rgba(64, 96, 255, 0.5);
    color: #ffffff;
  }
  .is-pitch .muun-prog-time-badge {
    background: rgba(245, 158, 11, 0.18);
    border-color: rgba(245, 158, 11, 0.45);
    color: #fef08a;
  }
  .is-table .muun-prog-time-badge {
    background: rgba(14, 165, 233, 0.18);
    border-color: rgba(14, 165, 233, 0.45);
    color: #bae6fd;
  }
  .is-ceremony .muun-prog-time-badge {
    background: rgba(147, 51, 234, 0.24);
    border-color: rgba(147, 51, 234, 0.5);
    color: #f3e8ff;
  }

  .muun-prog-note {
    font-size: 15px;
    font-weight: 500;
    line-height: 1.45;
    color: rgb(210, 210, 210);
    margin-top: 4px;
  }

  .muun-prog-toggle {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    transition: transform .3s ease, background-color .2s ease;
  }
  .muun-prog-toggle::before, .muun-prog-toggle::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 2px;
    margin: -1px 0 0 -6px;
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
    padding: 0 24px 0;
    max-width: 820px;
    font-size: 16px;
    line-height: 1.45;
    color: rgb(191, 191, 191);
  }
  .muun-prog-people {
    margin: 14px 24px 0 !important;
    padding-top: 14px;
    border-top: 1px solid rgba(255,255,255,0.1);
    font-size: 14px;
    line-height: 1.45;
    color: rgba(255,255,255,0.55);
  }
  .muun-prog-body-inner > :last-child { margin-bottom: 22px !important; }
  .muun-prog-empty { font-size: 18px; color: rgb(191, 191, 191); }

  @media (max-width: 1199px) {
    .muun-prog-row { grid-template-columns: 150px minmax(0, 1fr); column-gap: 24px; padding-left: 0; }
    .muun-prog-time { font-size: 19px; }
    .muun-prog-daylabel { flex-basis: 200px; }
    .muun-prog-daytitle { padding: 18px 28px; }
    .muun-prog-dayhead h3 { font-size: 28px; }
    .muun-prog-slots { gap: 12px; }
    .muun-prog-head { padding: 18px 20px; }
    .muun-prog-title { font-size: 18px; }
    .is-wide .muun-prog-title { font-size: 22px; }
    .muun-prog-time-badge { font-size: 16px; padding: 4px 11px; }
  }
  @media (max-width: 900px) {
    .muun-prog-row { display: flex; flex-direction: column; align-items: stretch; gap: 10px; padding-left: 0; }
    .muun-prog-time { padding-top: 0; font-size: 18px; }
    .muun-prog-slots { grid-template-columns: minmax(0, 1fr); gap: 12px; }
    .muun-prog-item,
    .muun-prog-item[data-hall="kurultai"],
    .muun-prog-item[data-hall="nasyyat"],
    .muun-prog-item[data-hall="sanzhyra"] {
      grid-column: 1 !important;
      border-radius: 20px;
    }
  }
  @media (max-width: 809px) {
    .muun-program { gap: 40px; }
    .muun-prog-filters { margin-bottom: 0; }
    .muun-prog-chips { flex-wrap: nowrap; overflow-x: auto; width: 100%; padding-bottom: 4px; scrollbar-width: none; }
    .muun-prog-chips::-webkit-scrollbar { display: none; }
    .muun-prog-chip { flex: none; font-size: 14px; padding: 9px 16px; }
    .muun-prog-day { gap: 24px; }
    .muun-prog-dayhead { min-height: 0; }
    .muun-prog-daylabel { flex: 0 0 auto; padding: 12px 16px; border-radius: 16px 0 0 16px; }
    .muun-prog-daytitle { padding: 12px 18px; border-radius: 0 16px 16px 0; }
    .muun-prog-dayhead h3 { font-size: 17px; letter-spacing: -0.02em; }
    .muun-prog-rows { gap: 20px; }
    .muun-prog-head { padding: 16px 18px; }
    button.muun-prog-head { padding-right: 56px; }
    .muun-prog-toggle { top: 16px; right: 16px; width: 30px; height: 30px; }
    .muun-prog-title, .is-wide .muun-prog-title { font-size: 18px; }
    .muun-prog-time-badge { font-size: 15px; padding: 4px 10px; margin-top: 6px; }
    .muun-prog-note { font-size: 14px; }
    .muun-prog-desc { padding: 0 18px; font-size: 14px; }
    .muun-prog-people { margin: 12px 18px 0 !important; font-size: 13px; }
    .muun-prog-body-inner > :last-child { margin-bottom: 16px !important; }
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
            var okHall = hall === 'all' || item.dataset.hall === hall;
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
