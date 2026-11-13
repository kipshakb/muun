// Единый блок программы: один и тот же HTML вставляется в секцию Agenda
// на главной и на странице /program.
//
// Источник: «28.11_MUUN26_проект программы от 12.11» (общая программа)
// и программа финала «KEL Start» (подробная панель по фильтру «КЕЛ Старт»).
// Где документы расходятся по времени — берётся общая программа.
//
// Устройство:
//   PARALLEL — длинные события, идущие фоном весь день (плашка над лентой,
//              видна только при фильтре «Вся программа»);
//   KEL      — подробная программа финала KEL Start (видна только при
//              фильтре «КЕЛ Старт»; открывается и кнопкой на карточке);
//   DAYS     — основная лента по залу «Курултай».

const UI = {
  ru: {
    trackAll: 'Вся программа',
    talks: 'MUUN Talks',
    maek: 'Ачык маек',
    kel: 'КЕЛ Старт',
    parallel: 'Параллельно в течение дня',
    kelMore: 'Программа КЕЛ Старт',
    kelBack: 'Вся программа',
    format: 'Формат',
    keynote: 'Keynote',
    speakers: 'Спикеры',
    moderator: 'Модератор',
    topics: 'О чём поговорим',
    empty: 'По выбранному фильтру сессий нет',
    more: 'Подробнее'
  },
  ky: {
    trackAll: 'Толук программа',
    talks: 'MUUN Talks',
    maek: 'Ачык маек',
    kel: 'КЕЛ Старт',
    parallel: 'Күн бою катар өтөт',
    kelMore: 'КЕЛ Старт программасы',
    kelBack: 'Толук программа',
    format: 'Формат',
    keynote: 'Keynote',
    speakers: 'Спикерлер',
    moderator: 'Модератор',
    topics: 'Эмне жөнүндө сүйлөшөбүз',
    empty: 'Тандалган чыпка боюнча сессиялар жок',
    more: 'Кененирээк'
  },
  en: {
    trackAll: 'Full programme',
    talks: 'MUUN Talks',
    maek: 'Open Talk',
    kel: 'KEL Start',
    parallel: 'Running in parallel all day',
    kelMore: 'KEL Start programme',
    kelBack: 'Full programme',
    format: 'Format',
    keynote: 'Keynote',
    speakers: 'Speakers',
    moderator: 'Moderator',
    topics: 'Topics',
    empty: 'No sessions match the selected filter',
    more: 'Details'
  }
};

const KURULTAI = { ru: 'Зал «Курултай»', ky: '«Курултай» залы', en: 'Kurultai Hall' };
const FOYER = { ru: 'Фойе зала «Курултай»', ky: '«Курултай» залынын фойеси', en: 'Kurultai Hall foyer' };
const NASYYAT = { ru: 'Зал «Насыят»', ky: '«Насыят» залы', en: 'Nasyyat Hall' };
const SAIRAN = { ru: 'Зал «Сайран»', ky: '«Сайран» залы', en: 'Sairan Hall' };

const SLIDO = {
  ru: 'вопросы участников через Slido',
  ky: 'катышуучулардын Slido аркылуу суроолору',
  en: 'audience questions via Slido'
};

// ── Параллельные события ──────────────────────────────────────────────
const PARALLEL = [
  {
    kind: 'pitch',
    time: '08:00–16:10',
    place: NASYYAT,
    badge: { ru: 'КЕЛ Старт', ky: 'КЕЛ Старт', en: 'KEL Start' },
    title: {
      ru: 'Финал конкурса стартапов «KEL Start»',
      ky: '«KEL Start» стартаптар сынагынын финалы',
      en: 'KEL Start startup competition final'
    },
    desc: {
      ru: 'Питч-сессия: презентации стартапов и вопросы жюри.',
      ky: 'Питч-сессия: стартаптардын презентациялары жана калыстардын суроолору.',
      en: 'Pitch session: startup presentations and jury questions.'
    },
    openKel: true
  },
  {
    kind: 'expo',
    time: '12:45–17:30',
    place: FOYER,
    badge: { ru: 'Выставка', ky: 'Көргөзмө', en: 'Exhibition' },
    title: {
      ru: 'Выставочная экспозиция',
      ky: 'Көргөзмө экспозициясы',
      en: 'Exhibition'
    },
    desc: {
      ru: 'Стенды работодателей, государственных предприятий, университетов и партнёров проекта.',
      ky: 'Иш берүүчүлөрдүн, мамлекеттик ишканалардын, университеттердин жана долбоордун өнөктөштөрүнүн стенддери.',
      en: 'Stands of employers, state enterprises, universities and project partners.'
    }
  },
  {
    kind: 'expo',
    time: '13:00–18:00',
    place: FOYER,
    badge: { ru: 'Карьера', ky: 'Карьера', en: 'Careers' },
    title: {
      ru: 'Карьерная зона «Оффер у стенда»',
      ky: '«Стенддеги оффер» карьера зонасы',
      en: '“Offer at the Stand” career zone'
    },
    desc: {
      ru: 'Экспресс-собеседования с представителями кадровых служб компаний-экспонентов у стендов и консультации по составлению резюме.',
      ky: 'Көргөзмөгө катышкан компаниялардын кадр кызматтарынын өкүлдөрү менен стенддердин жанында экспресс-маектешүү жана резюме түзүү боюнча кеңештер.',
      en: 'Express interviews with HR representatives of exhibiting companies right at their stands, plus CV consultations.'
    }
  }
];

// ── Подробная программа KEL Start ─────────────────────────────────────
const KEL = {
  title: {
    ru: 'Финал национального конкурса инновационных проектов и стартапов «KEL Start»',
    ky: '«KEL Start» инновациялык долбоорлор жана стартаптар улуттук сынагынын финалы',
    en: 'Final of the KEL Start national competition of innovative projects and startups'
  },
  meta: {
    ru: 'Зал «Насыят» · до 30 проектов · 8 минут на проект: 3 минуты презентация и 5 минут вопросы комиссии',
    ky: '«Насыят» залы · 30 долбоорго чейин · бир долбоорго 8 мүнөт: 3 мүнөт презентация жана 5 мүнөт комиссиянын суроолору',
    en: 'Nasyyat Hall · up to 30 projects · 8 minutes per project: 3-minute pitch and 5 minutes of commission Q&A'
  },
  org: {
    ru: 'Организатор — Министерство науки, высшего образования и инноваций Кыргызской Республики. Секретариат — Государственный фонд интеллектуальной собственности. Проекты оценивает межведомственная комиссия.',
    ky: 'Уюштуруучу — Кыргыз Республикасынын Илим, жогорку билим берүү жана инновациялар министрлиги. Катчылык — Интеллектуалдык менчик мамлекеттик фонду. Долбоорлорду ведомстволор аралык комиссия баалайт.',
    en: 'Organiser: Ministry of Science, Higher Education and Innovation of the Kyrgyz Republic. Secretariat: State Intellectual Property Fund. Projects are assessed by an interdepartmental commission.'
  },
  rows: [
    {
      time: '08:00–08:40',
      title: {
        ru: 'Регистрация финалистов, членов межведомственной комиссии и гостей',
        ky: 'Финалисттерди, ведомстволор аралык комиссиянын мүчөлөрүн жана коноктарды каттоо',
        en: 'Registration of finalists, commission members and guests'
      },
      note: {
        ru: 'Уточнение очерёдности выступлений, приём презентаций',
        ky: 'Чыгып сүйлөө кезегин тактоо, презентацияларды кабыл алуу',
        en: 'Confirming the running order and collecting presentations'
      }
    },
    {
      time: '08:40–08:55',
      title: {
        ru: 'Открытие финала',
        ky: 'Финалдын ачылышы',
        en: 'Opening of the final'
      },
      note: {
        ru: 'Приветственное слово: Сулайманова Лира Сулаймановна, заместитель министра науки, высшего образования и инноваций КР. Представление комиссии и регламента питчинга',
        ky: 'Куттуктоо сөз: Сулайманова Лира Сулаймановна, Кыргыз Республикасынын илим, жогорку билим берүү жана инновациялар министринин орун басары. Комиссияны жана питчинг регламентин тааныштыруу',
        en: 'Welcome address: Lira Sulaimanova, Deputy Minister of Science, Higher Education and Innovation of the Kyrgyz Republic. Introduction of the commission and pitch rules'
      }
    },
    {
      time: '08:55–10:15',
      title: {
        ru: 'Питчинг проектов № 1–10',
        ky: '№ 1–10 долбоорлордун питчинги',
        en: 'Pitches: projects 1–10'
      }
    },
    {
      time: '10:15–13:00',
      title: {
        ru: 'Участие в официальной части форума и перерыв',
        ky: 'Форумдун расмий бөлүгүнө катышуу жана тыныгуу',
        en: 'Forum official programme and break'
      },
      note: {
        ru: 'Церемония открытия «Жаратман МУУН» — 11:00–12:45, зал «Курултай»',
        ky: '«Жаратман МУУН» ачылыш аземи — 11:00–12:45, «Курултай» залы',
        en: 'Zharatman MUUN opening ceremony: 11:00–12:45, Kurultai Hall'
      }
    },
    {
      time: '13:00–15:40',
      title: {
        ru: 'Питчинг проектов № 11–30',
        ky: '№ 11–30 долбоорлордун питчинги',
        en: 'Pitches: projects 11–30'
      }
    },
    {
      time: '15:40–16:00',
      title: {
        ru: 'Рабочее обсуждение межведомственной комиссии',
        ky: 'Ведомстволор аралык комиссиянын иштиктүү талкуусу',
        en: 'Commission deliberation'
      },
      note: {
        ru: 'Рассмотрение результатов оценивания и формирование рейтинга заявок',
        ky: 'Баалоонун жыйынтыктарын карап чыгуу жана арыздардын рейтингин түзүү',
        en: 'Reviewing the scores and ranking the applications'
      }
    },
    {
      time: '16:00–16:10',
      title: {
        ru: 'Завершение финального этапа и общее фото',
        ky: 'Финалдык этаптын жабылышы жана жалпы сүрөт',
        en: 'Closing of the final stage and group photo'
      },
      note: {
        ru: 'Заключительное слово: Сулайманова Лира Сулаймановна',
        ky: 'Жыйынтыктоочу сөз: Сулайманова Лира Сулаймановна',
        en: 'Closing remarks: Lira Sulaimanova'
      }
    },
    {
      time: '19:25–19:40',
      highlight: true,
      title: {
        ru: 'Объявление и награждение победителей',
        ky: 'Жеңүүчүлөрдү жарыялоо жана сыйлоо',
        en: 'Winners announced and awarded'
      },
      note: {
        ru: 'Главная сцена · зал «Курултай»',
        ky: 'Негизги сахна · «Курултай» залы',
        en: 'Main stage · Kurultai Hall'
      }
    }
  ]
};

// ── Основная лента ────────────────────────────────────────────────────
// kind: talks | maek | pitch | ceremony | premiere | service
const p = (ru, ky, en) => ({ ru, ky, en });

const DAYS = [
  {
    label: { ru: '28 ноября', ky: '28-ноябрь', en: '28 November' },
    title: {
      ru: 'День профессий будущего',
      ky: 'Келечек кесиптеринин күнү',
      en: 'Day of Future Professions'
    },
    rows: [
      {
        time: '07:00–10:00',
        items: [{
          kind: 'service',
          title: p('Регистрация и допуск участников', 'Катышуучуларды каттоо жана киргизүү', 'Registration and admission of participants'),
          note: p('Для участников закрытой регистрации', 'Жабык каттоо аркылуу катталгандар үчүн', 'For participants registered through closed registration')
        }]
      },
      {
        time: '10:00–10:30',
        items: [{
          kind: 'ceremony',
          place: KURULTAI,
          badge: p('Пре-шоу', 'Пре-шоу', 'Pre-show'),
          title: p('Пре-шоу: ведущий, музыка, ролик MUUN', 'Пре-шоу: алып баруучу, музыка, MUUN ролиги', 'Pre-show: host, music and the MUUN film'),
          note: p('В 10:30 зал заполнен, двери закрываются', 'Саат 10:30да зал толот, эшиктер жабылат', 'At 10:30 the hall is seated and the doors close')
        }]
      },
      {
        time: '10:30–11:00',
        items: [{
          kind: 'service',
          title: p('Прибытие первых лиц и обход выставочной экспозиции официальной делегацией', 'Биринчи жетекчилердин келиши жана расмий делегациянын көргөзмөнү кыдыруусу', 'Arrival of senior officials and the official delegation’s tour of the exhibition'),
          note: p('Протокольный маршрут', 'Протоколдук маршрут', 'Protocol route')
        }]
      },
      {
        time: '11:00–12:45',
        items: [{
          kind: 'ceremony',
          place: KURULTAI,
          badge: p('Церемония', 'Азем', 'Ceremony'),
          title: p('Церемония открытия', 'Ачылыш аземи', 'Opening ceremony'),
          points: [
            p('Прибытие первых лиц и встреча у входа', 'Биринчи жетекчилердин келиши жана кире бериште тосуп алуу', 'Arrival of senior officials and welcome at the entrance'),
            p('Начало официальной части и запуск ролика проекта', 'Расмий бөлүктүн башталышы жана долбоордун ролигин көрсөтүү', 'Start of the official part and the project film'),
            p('Государственный гимн Кыргызской Республики', 'Кыргыз Республикасынын Мамлекеттик гимни', 'National anthem of the Kyrgyz Republic'),
            p('Приветственное слово Председателя Кабинета Министров Кыргызской Республики А.А. Касымалиева', 'Кыргыз Республикасынын Министрлер Кабинетинин Төрагасы А.А. Касымалиевдин куттуктоо сөзү', 'Welcome address by A.A. Kasymaliev, Chairman of the Cabinet of Ministers of the Kyrgyz Republic'),
            p('Церемония награждения обладателей Президентской стипендии', 'Президенттик стипендиянын ээлерин сыйлоо аземи', 'Award ceremony for Presidential Scholarship holders'),
            p('Выступление Президентского стипендиата', 'Президенттик стипендиаттын сөзү', 'Speech by a Presidential Scholar'),
            p('Концертная программа', 'Концерттик программа', 'Concert programme')
          ],
          moderator: {
            name: p('Исаматова Г.Т.', 'Исаматова Г.Т.', 'G.T. Isamatova'),
            role: p('Министр науки, высшего образования и инноваций Кыргызской Республики', 'Кыргыз Республикасынын Илим, жогорку билим берүү жана инновациялар министри', 'Minister of Science, Higher Education and Innovation of the Kyrgyz Republic')
          }
        }]
      },
      {
        time: '12:00–13:30',
        items: [{
          kind: 'service',
          place: SAIRAN,
          title: p('Питание участников', 'Катышуучуларды тамактандыруу', 'Lunch for participants')
        }]
      },
      {
        time: '12:45',
        items: [{
          kind: 'service',
          title: p('Вход для посетителей по бесплатной регистрации', 'Акысыз каттоо аркылуу келгендердин кириши', 'Entry for visitors with free registration'),
          note: p('Открываются выставочная экспозиция и карьерная зона', 'Көргөзмө экспозициясы жана карьера зонасы ачылат', 'The exhibition and the career zone open')
        }]
      },
      {
        time: '13:00–13:50',
        items: [{
          kind: 'talks',
          place: KURULTAI,
          badge: p('MUUN Talks 1 · Максат', 'MUUN Talks 1 · Максат', 'MUUN Talks 1 · Maksat'),
          title: p('«Профессии будущего: чему учить сегодня»', '«Келечектин кесиптери: бүгүн эмнени үйрөтүү керек»', '“Professions of the future: what to teach today”'),
          format: p('Ключевое выступление, модерируемый диалог, ' + SLIDO.ru, 'Негизги баяндама, модератор жетектеген диалог, ' + SLIDO.ky, 'Keynote, moderated dialogue, ' + SLIDO.en),
          speakers: [
            { name: p('Орунтаев Нурдан Кемелович', 'Орунтаев Нурдан Кемелович', 'Nurdan Oruntaev'), role: p('Министр строительства, архитектуры и жилищно-коммунального хозяйства Кыргызской Республики', 'Кыргыз Республикасынын Курулуш, архитектура жана турак жай-коммуналдык чарба министри', 'Minister of Construction, Architecture, Housing and Utilities of the Kyrgyz Republic') },
            { name: p('Рысбеков Алтынбек Дурусбекович', 'Рысбеков Алтынбек Дурусбекович', 'Altynbek Rysbekov'), role: p('Министр энергетики Кыргызской Республики', 'Кыргыз Республикасынын Энергетика министри', 'Minister of Energy of the Kyrgyz Republic') },
            { name: p('Кубатов Эдуард Джумакадырович', 'Кубатов Эдуард Джумакадырович', 'Eduard Kubatov'), role: p('Директор Государственного агентства по развитию туризма при Кабинете Министров Кыргызской Республики', 'Кыргыз Республикасынын Министрлер Кабинетине караштуу Туризмди өнүктүрүү боюнча мамлекеттик агенттиктин директору', 'Director of the State Agency for Tourism Development under the Cabinet of Ministers of the Kyrgyz Republic') },
            { name: p('Сурабалдиева Эльвира', 'Сурабалдиева Эльвира', 'Elvira Surabaldieva') }
          ],
          moderator: { name: p('Эсеналиева Назира Солтонбековна', 'Эсеналиева Назира Солтонбековна', 'Nazira Esenalieva'), role: p('Ректор Международного университета «Ала-Тоо»', '«Ала-Тоо» эл аралык университетинин ректору', 'Rector of Ala-Too International University') },
          topics: [
            p('профессии будущего', 'келечектин кесиптери', 'professions of the future'),
            p('чему учить сегодня', 'бүгүн эмнени үйрөтүү керек', 'what to teach today'),
            p('карьера в строительстве', 'курулуштагы карьера', 'careers in construction'),
            p('карьера в энергетике', 'энергетикадагы карьера', 'careers in energy'),
            p('карьера в туризме', 'туризмдеги карьера', 'careers in tourism'),
            p('ориентиры для обучения', 'окуу үчүн багыттар', 'study guidance')
          ]
        }]
      },
      {
        time: '14:00–14:20',
        items: [{
          kind: 'premiere',
          place: KURULTAI,
          badge: p('Технологическая премьера', 'Технологиялык премьера', 'Tech premiere'),
          title: p('Airun AI: «AIRUN 2.0 — ИИ на кыргызском языке»', 'Airun AI: «AIRUN 2.0 — кыргыз тилиндеги жасалма интеллект»', 'Airun AI: “AIRUN 2.0 — AI in the Kyrgyz language”'),
          format: p('Keynote и live-демо, 20 минут', 'Keynote жана түз демо, 20 мүнөт', 'Keynote and live demo, 20 minutes'),
          speakers: [
            { name: p('Чынгыз Арзиев', 'Чыңгыз Арзиев', 'Chyngyz Arziev'), role: p('Основатель и CEO Airun AI', 'Airun AI негиздөөчүсү жана CEO', 'Founder and CEO of Airun AI') }
          ],
          topics: [
            p('ИИ на кыргызском', 'кыргыз тилиндеги ЖИ', 'AI in Kyrgyz'),
            p('премьера Airun 2.0', 'Airun 2.0 премьерасы', 'Airun 2.0 premiere'),
            p('live-демо', 'түз демо', 'live demo'),
            p('языковые технологии', 'тил технологиялары', 'language technology'),
            p('инструменты для учёбы', 'окуу үчүн куралдар', 'study tools'),
            p('практика применения', 'колдонуу практикасы', 'practical use')
          ]
        }]
      },
      {
        time: '14:30–15:30',
        items: [{
          kind: 'talks',
          place: KURULTAI,
          badge: p('MUUN Talks 2 · Умтулуу', 'MUUN Talks 2 · Умтулуу', 'MUUN Talks 2 · Umtuluu'),
          title: p('«От Кыргызстана до глобальных компаний: как мечтать масштабно в эпоху AI»', '«Кыргызстандан глобалдык компанияларга чейин: AI доорунда кантип чоң кыялдануу керек»', '“From Kyrgyzstan to global companies: how to dream big in the age of AI”'),
          format: p('Keynote (онлайн), панельная дискуссия, ' + SLIDO.ru, 'Keynote (онлайн), панелдик талкуу, ' + SLIDO.ky, 'Keynote (online), panel discussion, ' + SLIDO.en),
          keynote: { name: p('Джумабаев Таалай', 'Жумабаев Таалай', 'Taalai Djumabaev'), role: p('Senior Software Engineer, Google (Остин, США) · онлайн', 'Senior Software Engineer, Google (Остин, АКШ) · онлайн', 'Senior Software Engineer, Google (Austin, USA) · online') },
          speakers: [
            { name: p('Билгазиев Эмиль, PhD', 'Билгазиев Эмиль, PhD', 'Emil Bilgaziev, PhD'), role: p('AI-инженер (Meta, Snapchat, Uber), сооснователь American Institute of Technology (AIT)', 'AI-инженер (Meta, Snapchat, Uber), American Institute of Technology (AIT) тең негиздөөчүсү', 'AI engineer (Meta, Snapchat, Uber), co-founder of the American Institute of Technology (AIT)') },
            { name: p('Жумашукуров Чолпонбек', 'Жумашукуров Чолпонбек', 'Cholponbek Zhumashukurov'), role: p('MBA Harvard Business School, сооснователь Highland Capital Partners и ProKG', 'MBA Harvard Business School, Highland Capital Partners жана ProKG тең негиздөөчүсү', 'MBA, Harvard Business School; co-founder of Highland Capital Partners and ProKG') },
            { name: p('Кенжалиев Азрет', 'Кенжалиев Азрет', 'Azret Kenzhaliev'), role: p('Сооснователь и CTO VisaKG; ex-Google DeepMind, Palantir, Yelp', 'VisaKG тең негиздөөчүсү жана CTO; мурда Google DeepMind, Palantir, Yelp', 'Co-founder and CTO of VisaKG; ex-Google DeepMind, Palantir, Yelp') },
            { name: p('Момуналиева Жазгул Сакеновна', 'Момуналиева Жазгул Сакеновна', 'Zhazgul Momunalieva'), role: p('Директор HR-департамента BAKAI Bank', 'BAKAI Bank HR-департаментинин директору', 'HR Director, BAKAI Bank') },
            { name: p('Эсен Сагынов', 'Эсен Сагынов', 'Esen Sagynov'), role: p('Основатель Mancho, экс-Amazon', 'Mancho негиздөөчүсү, мурда Amazon', 'Founder of Mancho, ex-Amazon') }
          ],
          moderator: { name: p('Алишерова Айжан', 'Алишерова Айжан', 'Aizhan Alisherova'), role: p('Основатель фонда «We Fund»; Nuroo AI, Startup Lab 119', '«We Fund» фондунун негиздөөчүсү; Nuroo AI, Startup Lab 119', 'Founder of We Fund; Nuroo AI, Startup Lab 119') },
          topics: [
            p('карьерные траектории', 'карьералык жолдор', 'career paths'),
            p('путь в глобальные компании', 'глобалдык компанияларга жол', 'the road to global companies'),
            p('карьера в эпоху AI', 'AI доорундагы карьера', 'careers in the age of AI'),
            p('стажировки и карьера в банке', 'банктагы стажировка жана карьера', 'bank internships and careers'),
            p('опыт фаундеров', 'негиздөөчүлөрдүн тажрыйбасы', 'founders’ experience')
          ]
        }]
      },
      {
        time: '15:40–16:25',
        items: [{
          kind: 'maek',
          place: KURULTAI,
          badge: p('Ачык маек', 'Ачык маек', 'Open Talk'),
          title: p('«Экономика будущего: энергия, экспорт и рабочие места для молодёжи»', '«Келечектин экономикасы: энергия, экспорт жана жаштар үчүн жумуш орундары»', '“The economy of the future: energy, exports and jobs for young people”'),
          desc: p('Энергия, экспорт и рабочие места — кого ищут работодатели и как попасть в отрасль.', 'Энергия, экспорт жана жумуш орундары — иш берүүчүлөр кимди издейт жана тармакка кантип кирсе болот.', 'Energy, exports and jobs: who employers are looking for and how to get into the sector.'),
          speakers: [
            { name: p('Байгазиев Айдар Абдыбекович', 'Байгазиев Айдар Абдыбекович', 'Aidar Baigaziev'), role: p('Начальник отдела энергобаланса и потерь электроэнергии, ОАО «Кыргызский энергетический расчетный центр»', '«Кыргыз энергетикалык эсептешүү борбору» ААКнын энергобаланс жана электр энергиясынын жоготуулары бөлүмүнүн башчысы', 'Head of Energy Balance and Power Losses, Kyrgyz Energy Settlement Centre OJSC') },
            { name: p('Мухаммед уулу Болот', 'Мухаммед уулу Болот', 'Bolot Mukhammed uulu'), role: p('Заместитель генерального директора ОАО «Кыргызкомур»', '«Кыргызкөмүр» ААКнын башкы директорунун орун басары', 'Deputy General Director, Kyrgyzkomur OJSC') },
            { name: p('Такиров Урмат Канатбекович', 'Такиров Урмат Канатбекович', 'Urmat Takirov'), role: p('Директор Центра «Кыргыз Экспорт» при Министерстве экономики и коммерции Кыргызской Республики', 'Кыргыз Республикасынын Экономика жана коммерция министрлигине караштуу «Кыргыз Экспорт» борборунун директору', 'Director of the Kyrgyz Export Centre under the Ministry of Economy and Commerce of the Kyrgyz Republic') },
            { name: p('Эльдар Абакиров', 'Эльдар Абакиров', 'Eldar Abakirov'), role: p('Экс-депутат Жогорку Кенеша VII созыва, экс-заместитель министра экономики КР, предприниматель', 'VII чакырылыштагы Жогорку Кеңештин мурдагы депутаты, КР экономика министринин мурдагы орун басары, ишкер', 'Former member of the 7th Jogorku Kenesh, former Deputy Minister of Economy, entrepreneur') },
            { name: p('Представитель ОАО «НЭС Кыргызстан»', '«Кыргызстандын УЭТ» ААКнын өкүлү', 'Representative of NEG Kyrgyzstan OJSC'), role: p('уточняется', 'такталууда', 'to be confirmed') }
          ],
          topics: [
            p('энергия и рабочие места', 'энергия жана жумуш орундары', 'energy and jobs'),
            p('экспорт и внешние рынки', 'экспорт жана тышкы рыноктор', 'exports and foreign markets'),
            p('кого ищут работодатели', 'иш берүүчүлөр кимди издейт', 'what employers look for'),
            p('карьера в отрасли', 'тармактагы карьера', 'careers in the sector'),
            p('предпринимательство', 'ишкердик', 'entrepreneurship')
          ]
        }]
      },
      {
        time: '16:35–17:25',
        items: [{
          kind: 'talks',
          place: KURULTAI,
          badge: p('MUUN Talks 3 · Учур', 'MUUN Talks 3 · Учур', 'MUUN Talks 3 · Uchur'),
          title: p('«Время перемен: ИИ, технологии, интеллектуальная собственность и рынок труда»', '«Өзгөрүүлөр мезгили: ЖИ, технологиялар, интеллектуалдык менчик жана эмгек рыногу»', '“Time of change: AI, technology, intellectual property and the labour market”'),
          format: p('Ключевое выступление, панельная дискуссия, интерактивный опрос и ' + SLIDO.ru, 'Негизги баяндама, панелдик талкуу, интерактивдүү сурамжылоо жана ' + SLIDO.ky, 'Keynote, panel discussion, live poll and ' + SLIDO.en),
          speakers: [
            { name: p('Абдурахманова Аселя', 'Абдурахманова Аселя', 'Aselia Abdurakhmanova'), role: p('Заместитель директора Национального центра фтизиатрии при Минздраве КР; MPH, Johns Hopkins Bloomberg School of Public Health (2025); стипендиат программы «Эл Үмүтү»', 'КР Саламаттык сактоо министрлигине караштуу Улуттук фтизиатрия борборунун директорунун орун басары; MPH, Johns Hopkins Bloomberg School of Public Health (2025); «Эл Үмүтү» программасынын стипендиаты', 'Deputy Director, National Phthisiology Centre, Ministry of Health; MPH, Johns Hopkins Bloomberg School of Public Health (2025); El Umutu scholar') },
            { name: p('Исабекова Жылдыз', 'Исабекова Жылдыз', 'Zhyldyz Isabekova'), role: p('Глава Accelerate Prosperity в Кыргызстане', 'Кыргызстандагы Accelerate Prosperity жетекчиси', 'Head of Accelerate Prosperity in Kyrgyzstan') },
            { name: p('Жусуев Куван Сайдмаматович', 'Жусуев Куван Сайдмаматович', 'Kuvan Zhusuev'), role: p('Учредитель ОФ WorldSkills Кыргызстан', 'WorldSkills Кыргызстан КФнун негиздөөчүсү', 'Founder of the WorldSkills Kyrgyzstan foundation') },
            { name: p('Денис Заставный', 'Денис Заставный', 'Denis Zastavny'), role: p('Начальник управления информационного обеспечения Евразийского патентного ведомства (ЕАПВ)', 'Евразия патент ведомствосунун (ЕАПВ) маалымат менен камсыздоо башкармалыгынын башчысы', 'Head of Information Support, Eurasian Patent Office (EAPO)') },
            { name: p('Абдрахманова Айнагуль', 'Абдрахманова Айнагүл', 'Ainagul Abdrakhmanova'), role: p('Руководитель отдела коммуникаций ПРООН, выпускница стипендиальной программы Чивнинг', 'БУУӨПтүн коммуникациялар бөлүмүнүн жетекчиси, Chevening стипендиялык программасынын бүтүрүүчүсү', 'Head of Communications, UNDP; Chevening Scholarship alumna') }
          ],
          moderator: { name: p('Алымбеков Айдар Бакытович', 'Алымбеков Айдар Бакытович', 'Aidar Alymbekov'), role: p('Заведующий отделом инноваций Министерства науки, высшего образования и инноваций Кыргызской Республики', 'Кыргыз Республикасынын Илим, жогорку билим берүү жана инновациялар министрлигинин инновациялар бөлүмүнүн башчысы', 'Head of Innovation, Ministry of Science, Higher Education and Innovation of the Kyrgyz Republic') },
          topics: [
            p('ИИ и рынок труда', 'ЖИ жана эмгек рыногу', 'AI and the labour market'),
            p('технологические навыки', 'технологиялык көндүмдөр', 'tech skills'),
            p('интеллектуальная собственность', 'интеллектуалдык менчик', 'intellectual property'),
            p('прикладные компетенции', 'колдонмо компетенциялар', 'applied skills'),
            p('WorldSkills', 'WorldSkills', 'WorldSkills')
          ]
        }]
      },
      {
        time: '17:35–18:15',
        items: [{
          kind: 'maek',
          place: KURULTAI,
          badge: p('Ачык маек', 'Ачык маек', 'Open Talk'),
          title: p('«Активное поколение: спорт, киберспорт и геймдев — играй, создавай, побеждай»', '«Активдүү муун: спорт, киберспорт жана геймдев — ойно, жарат, жең»', '“Active generation: sport, esports and game dev — play, create, win”'),
          format: p('Разговор и блиц-вопросы из зала', 'Маек жана залдан блиц-суроолор', 'Conversation and rapid-fire questions from the audience'),
          speakers: [
            { name: p('Атеев Руслан Маратович', 'Атеев Руслан Маратович', 'Ruslan Ateev'), role: p('Президент Федерации компьютерного спорта Кыргызской Республики', 'Кыргыз Республикасынын Компьютердик спорт федерациясынын президенти', 'President of the Esports Federation of the Kyrgyz Republic') },
            { name: p('Оторбаева Айдана', 'Оторбаева Айдана', 'Aidana Otorbaeva'), role: p('Мастер спорта по футболу, вице-президент Ассоциации женского футбола Кыргызской Республики', 'Футбол боюнча спорт чебери, Кыргыз Республикасынын Аялдар футболу ассоциациясынын вице-президенти', 'Master of Sport in football, Vice-President of the Women’s Football Association of the Kyrgyz Republic') },
            { name: p('Аденов Нурсултан Нурланович', 'Аденов Нурсултан Нурланович', 'Nursultan Adenov'), role: p('Руководитель Международного секретариата Всемирных игр кочевников', 'Дүйнөлүк көчмөндөр оюндарынын Эл аралык катчылыгынын жетекчиси', 'Head of the International Secretariat of the World Nomad Games') },
            { name: p('Динара Русланкызы', 'Динара Руслан кызы', 'Dinara Ruslankyzy'), role: p('Основатель и директор ИТ-компании CODIFY', 'CODIFY IT-компаниясынын негиздөөчүсү жана директору', 'Founder and Director of the IT company CODIFY') }
          ],
          moderator: { name: p('Котляревский Виктор Сергеевич', 'Котляревский Виктор Сергеевич', 'Viktor Kotlyarevsky'), role: p('Contest.kg, спортивный комментатор', 'Contest.kg, спорттук комментатор', 'Contest.kg, sports commentator') },
          topics: [
            p('здоровое поколение', 'дени сак муун', 'a healthy generation'),
            p('футбол', 'футбол', 'football'),
            p('Всемирные игры кочевников', 'Дүйнөлүк көчмөндөр оюндары', 'World Nomad Games'),
            p('киберспорт', 'киберспорт', 'esports'),
            p('геймдев (Roblox / Scratch)', 'геймдев (Roblox / Scratch)', 'game dev (Roblox / Scratch)'),
            p('карьера в спорте и IT', 'спорттогу жана IT тармагындагы карьера', 'careers in sport and IT')
          ]
        }]
      },
      {
        time: '18:25–19:15',
        items: [{
          kind: 'talks',
          place: KURULTAI,
          badge: p('MUUN Talks 4 · Ниет', 'MUUN Talks 4 · Ниет', 'MUUN Talks 4 · Niet'),
          title: p('«От идеи к действию: предпринимательство, стартапы и молодёжные инициативы»', '«Идеядан аракетке: ишкердик, стартаптар жана жаштардын демилгелери»', '“From idea to action: entrepreneurship, startups and youth initiatives”'),
          format: p('Модерируемая панельная дискуссия, ' + SLIDO.ru, 'Модератор жетектеген панелдик талкуу, ' + SLIDO.ky, 'Moderated panel discussion, ' + SLIDO.en),
          keynote: { name: p('Амангелди Жумадилов', 'Амангелди Жумадилов', 'Amangeldi Zhumadilov'), role: p('Президент Салымбеков Университета', 'Салымбеков Университетинин президенти', 'President of Salymbekov University') },
          speakers: [
            { name: p('Бекназаров Жакшылык Бекназарович', 'Бекназаров Жакшылык Бекназарович', 'Zhakshylyk Beknazarov'), role: p('Председатель ОО «Молодёжное движение Кыргызстана»', '«Кыргызстандын жаштар кыймылы» КБнын төрагасы', 'Chair of the Youth Movement of Kyrgyzstan') },
            { name: p('Халманбетова Гулназа', 'Халманбетова Гүлназа', 'Gulnaza Khalmanbetova'), role: p('Founder & CEO, Mama Space (femtech)', 'Founder & CEO, Mama Space (femtech)', 'Founder & CEO, Mama Space (femtech)') },
            { name: p('Абышев Оман', 'Абышев Оман', 'Oman Abyshev'), role: p('Основатель Water Watch AI', 'Water Watch AI негиздөөчүсү', 'Founder of Water Watch AI') },
            { name: p('Суюнова Гульбарчын', 'Суюнова Гүлбарчын', 'Gulbarchyn Suyunova'), role: p('Эксперт по развитию молодёжного предпринимательства и стартапам, экс-директор Enactus Кыргызстан', 'Жаштар ишкердигин жана стартаптарды өнүктүрүү боюнча эксперт, Enactus Кыргызстандын мурдагы директору', 'Expert in youth entrepreneurship and startups, former Director of Enactus Kyrgyzstan') },
            { name: p('Адаев Эрхан', 'Адаев Эрхан', 'Erkhan Adaev'), role: p('Сооснователь и генеральный директор AI Academy', 'AI Academy тең негиздөөчүсү жана башкы директору', 'Co-founder and CEO of AI Academy') }
          ],
          moderator: { name: p('Абдылдаев Даниэль', 'Абдылдаев Даниэль', 'Daniel Abdyldaev'), role: p('CIO Accelerate Prosperity; Managing Partner ADVentures; сооснователь chANGELS', 'CIO Accelerate Prosperity; Managing Partner ADVentures; chANGELS тең негиздөөчүсү', 'CIO, Accelerate Prosperity; Managing Partner, ADVentures; co-founder of chANGELS') },
          topics: [
            p('от идеи к действию', 'идеядан аракетке', 'from idea to action'),
            p('запуск стартапа', 'стартапты ишке киргизүү', 'launching a startup'),
            p('молодёжное предпринимательство', 'жаштар ишкердиги', 'youth entrepreneurship'),
            p('первый клиент', 'биринчи кардар', 'the first customer'),
            p('молодёжные инициативы', 'жаштардын демилгелери', 'youth initiatives')
          ]
        }]
      },
      {
        time: '19:25–19:40',
        items: [{
          kind: 'pitch',
          place: KURULTAI,
          badge: p('КЕЛ Старт', 'КЕЛ Старт', 'KEL Start'),
          title: p('Подведение итогов конкурса стартапов «КЕЛ СТАРТ»: объявление и награждение победителей', '«КЕЛ СТАРТ» стартаптар сынагынын жыйынтыгы: жеңүүчүлөрдү жарыялоо жана сыйлоо', 'KEL START startup competition results: winners announced and awarded'),
          desc: p('Тизер-ролик, топ-3 проектов, вручение наград и общее фото. Награждающие уточняются, планируется участие министра.', 'Тизер-ролик, мыкты 3 долбоор, сыйлыктарды тапшыруу жана жалпы сүрөт. Сыйлоочулар такталууда, министрдин катышуусу пландалууда.', 'Teaser film, top 3 projects, awards and group photo. Presenters to be confirmed; the Minister is expected to take part.'),
          topics: [
            p('итоги конкурса', 'сынактын жыйынтыгы', 'competition results'),
            p('награждение топ-3', 'мыкты 3төнү сыйлоо', 'top 3 awards'),
            p('публичный финал', 'ачык финал', 'public final')
          ]
        }]
      },
      {
        time: '19:40–20:00',
        items: [{
          kind: 'ceremony',
          place: KURULTAI,
          title: p('Концертная программа', 'Концерттик программа', 'Concert programme')
        }]
      },
      {
        time: '20:00',
        items: [{
          kind: 'service',
          title: p('Завершение мероприятия', 'Иш-чаранын жабылышы', 'Close of the event')
        }]
      }
    ]
  }
];

const TRACK_OF = {
  talks: 'talks',
  maek: 'maek',
  pitch: 'kel',
  ceremony: 'ceremony',
  premiere: 'ceremony',
  expo: 'expo',
  service: 'service'
};

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const tr = (obj, lang) => (obj ? (obj[lang] || obj.ru || '') : '');

function personHtml(person, lang) {
  const name = tr(person.name, lang);
  const role = tr(person.role, lang);
  return `<span class="muun-prog-pname">${esc(name)}</span>${role ? ` <span class="muun-prog-prole">— ${esc(role)}</span>` : ''}`;
}

function renderBody(item, lang, ui) {
  const parts = [];
  const desc = tr(item.desc, lang);
  if (desc) parts.push(`<p class="muun-prog-desc">${esc(desc)}</p>`);
  if (item.points && item.points.length) {
    parts.push(`<ul class="muun-prog-points">${item.points.map((pt) => `<li>${esc(tr(pt, lang))}</li>`).join('')}</ul>`);
  }
  const format = tr(item.format, lang);
  if (format) parts.push(`<p class="muun-prog-format"><span class="muun-prog-label">${esc(ui.format)}:</span> ${esc(format)}</p>`);
  if (item.keynote) {
    parts.push(`<div class="muun-prog-group"><p class="muun-prog-label">${esc(ui.keynote)}</p><p class="muun-prog-person">${personHtml(item.keynote, lang)}</p></div>`);
  }
  if (item.speakers && item.speakers.length) {
    parts.push(`<div class="muun-prog-group"><p class="muun-prog-label">${esc(ui.speakers)}</p><ol class="muun-prog-speakers">${item.speakers.map((sp) => `<li>${personHtml(sp, lang)}</li>`).join('')}</ol></div>`);
  }
  if (item.moderator) {
    parts.push(`<div class="muun-prog-group"><p class="muun-prog-label">${esc(ui.moderator)}</p><p class="muun-prog-person">${personHtml(item.moderator, lang)}</p></div>`);
  }
  if (item.topics && item.topics.length) {
    parts.push(`<div class="muun-prog-group"><p class="muun-prog-label">${esc(ui.topics)}</p><div class="muun-prog-topics">${item.topics.map((t) => `<span>${esc(tr(t, lang))}</span>`).join('')}</div></div>`);
  }
  return parts.join('');
}

function renderItem(item, lang, ui) {
  const track = TRACK_OF[item.kind] || 'general';
  const badge = tr(item.badge, lang);
  const place = tr(item.place, lang);
  const body = renderBody(item, lang, ui);
  const meta = (badge || place)
    ? `<span class="muun-prog-meta">${badge ? `<span class="muun-prog-badge">${esc(badge)}</span>` : ''}${place ? `<span class="muun-prog-hall">${esc(place)}</span>` : ''}</span>`
    : '';
  const rawNote = tr(item.note, lang);
  const note = rawNote ? `<span class="muun-prog-note">${esc(rawNote)}</span>` : '';
  const kindClass = item.kind === 'premiere' ? 'is-ceremony is-premiere' : `is-${item.kind}`;
  const classes = ['muun-prog-item', kindClass, 'is-wide', body ? 'is-expandable' : ''].filter(Boolean).join(' ');
  const attrs = `data-track="${track}"`;
  const title = tr(item.title, lang);

  if (!body) {
    return `<div class="${classes}" ${attrs}><div class="muun-prog-head">${meta}<h3 class="muun-prog-title">${esc(title)}</h3>${note}</div></div>`;
  }

  return `<div class="${classes}" ${attrs}>` +
    `<button type="button" class="muun-prog-head" aria-expanded="false" aria-label="${esc(ui.more)}: ${esc(title)}">` +
      `${meta}<h3 class="muun-prog-title">${esc(title)}</h3>${note}` +
      `<span class="muun-prog-toggle" aria-hidden="true"></span>` +
    `</button>` +
    `<div class="muun-prog-body"><div class="muun-prog-body-inner">${body}</div></div>` +
  `</div>`;
}

function renderParallel(lang, ui) {
  const cards = PARALLEL.map((ev) => {
    const btn = ev.openKel
      ? `<button type="button" class="muun-prog-chip muun-prog-kel-open" data-prog-filter="track" data-value="kel">${esc(ui.kelMore)} →</button>`
      : '';
    return `<div class="muun-prog-pcard is-${ev.kind}">` +
      `<span class="muun-prog-meta"><span class="muun-prog-badge">${esc(tr(ev.badge, lang))}</span></span>` +
      `<h3 class="muun-prog-ptitle">${esc(tr(ev.title, lang))}</h3>` +
      `<p class="muun-prog-ptime">${esc(ev.time)} · ${esc(tr(ev.place, lang))}</p>` +
      `<p class="muun-prog-pdesc">${esc(tr(ev.desc, lang))}</p>` +
      btn +
    `</div>`;
  }).join('');
  return `<div class="muun-prog-parallel"><p class="muun-prog-plabel">${esc(ui.parallel)}</p><div class="muun-prog-pgrid">${cards}</div></div>`;
}

function renderKel(lang, ui) {
  const rows = KEL.rows.map((r) => {
    const note = tr(r.note, lang);
    return `<div class="muun-prog-krow${r.highlight ? ' is-highlight' : ''}">` +
      `<div class="muun-prog-ktime">${esc(r.time)}</div>` +
      `<div class="muun-prog-kbody"><p class="muun-prog-ktitle">${esc(tr(r.title, lang))}</p>${note ? `<p class="muun-prog-knote">${esc(note)}</p>` : ''}</div>` +
    `</div>`;
  }).join('');
  return `<div class="muun-prog-kel">` +
    `<div class="muun-prog-kelhead">` +
      `<span class="muun-prog-meta"><span class="muun-prog-badge">${esc(ui.kel)}</span></span>` +
      `<h3 class="muun-prog-keltitle">${esc(tr(KEL.title, lang))}</h3>` +
      `<p class="muun-prog-kelmeta">${esc(tr(KEL.meta, lang))}</p>` +
    `</div>` +
    `<div class="muun-prog-krows">${rows}</div>` +
    `<p class="muun-prog-kelorg">${esc(tr(KEL.org, lang))}</p>` +
    `<button type="button" class="muun-prog-chip muun-prog-kel-back" data-prog-filter="track" data-value="all">← ${esc(ui.kelBack)}</button>` +
  `</div>`;
}

export function renderProgramBlock(lang) {
  const ui = UI[lang] || UI.ru;
  const trackChips = [
    ['all', ui.trackAll, ''],
    ['talks', ui.talks, ' is-talks'],
    ['maek', ui.maek, ' is-maek-chip'],
    ['kel', ui.kel, ' is-pitch-chip']
  ].map(([v, label, cls], i) => `<button type="button" class="muun-prog-chip${i === 0 ? ' is-active' : ''}${cls}" data-prog-filter="track" data-value="${v}">${esc(label)}</button>`).join('');

  const days = DAYS.map((day) => `
      <div class="muun-prog-day">
        <div class="muun-prog-dayhead">
          <div class="muun-prog-daylabel"><h3>${esc(day.label[lang])}</h3></div>
          <div class="muun-prog-daytitle"><h3>${esc(day.title[lang])}</h3></div>
        </div>
        ${renderParallel(lang, ui)}
        ${renderKel(lang, ui)}
        <div class="muun-prog-rows">
          ${day.rows.map((row) => `
          <div class="muun-prog-row">
            <div class="muun-prog-time">${esc(row.time)}</div>
            <div class="muun-prog-slots">${row.items.map((item) => renderItem(item, lang, ui)).join('')}</div>
          </div>`).join('')}
        </div>
      </div>`).join('');

  return `
    <div class="muun-program" data-track="all">
      <div class="muun-prog-filters">
        <div class="muun-prog-chips">${trackChips}</div>
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
  .muun-prog-chip.is-pitch-chip:not(.is-active) { box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.65); }
  .muun-prog-chip.is-maek-chip:not(.is-active) { box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.6); }
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

  /* ── Одна колонка: вся основная программа идёт в зале «Курултай» ── */
  .muun-prog-slots { grid-template-columns: minmax(0, 1fr) !important; }
  .muun-prog-item { grid-column: 1 !important; }
  .is-wide .muun-prog-title { font-size: 23px; }

  /* Ачык маек — зелёный акцент */
  .muun-prog-item.is-maek {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.04) 48%, rgb(17, 17, 20) 100%);
    box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.4);
  }
  .is-maek .muun-prog-badge { background: rgba(16, 185, 129, 0.22); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4); }

  /* Раскрывающаяся часть: формат, спикеры, модератор, темы */
  .muun-prog-points { margin: 0 24px; padding-left: 20px; color: rgb(191, 191, 191); font-size: 16px; line-height: 1.5; }
  .muun-prog-points li + li { margin-top: 4px; }
  .muun-prog-format { margin: 12px 24px 0 !important; font-size: 15px; line-height: 1.45; color: rgb(191, 191, 191); }
  .muun-prog-group { margin: 16px 24px 0; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.1); }
  .muun-prog-label {
    font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    color: rgba(255,255,255,0.55); margin-bottom: 8px !important;
  }
  .muun-prog-format .muun-prog-label { font-size: 12px; margin-right: 4px; }
  .muun-prog-speakers { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; }
  .muun-prog-speakers li, .muun-prog-person { font-size: 15px; line-height: 1.45; color: rgb(191, 191, 191); }
  .muun-prog-pname { color: #fff; font-weight: 500; }
  .muun-prog-topics { display: flex; flex-wrap: wrap; gap: 6px; }
  .muun-prog-topics span {
    padding: 4px 10px; border-radius: 100px; font-size: 13px; line-height: 1.3;
    background: rgba(255,255,255,0.08); color: rgb(210, 210, 210);
  }

  /* ── «Параллельно в течение дня» (только во «Всей программе») ── */
  .muun-prog-parallel { display: flex; flex-direction: column; gap: 14px; }
  .muun-prog-plabel {
    font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    color: rgba(255,255,255,0.55);
  }
  .muun-prog-pgrid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
  .muun-prog-pcard {
    display: flex; flex-direction: column; align-items: flex-start; gap: 10px;
    padding: 20px 22px; border-radius: 22px; background: rgb(17, 17, 20);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);
  }
  .muun-prog-pcard.is-pitch {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0.04) 48%, rgb(17, 17, 20) 100%);
    box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.35);
  }
  .muun-prog-pcard.is-pitch .muun-prog-badge { background: rgba(245, 158, 11, 0.22); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
  .muun-prog-ptitle {
    font-family: "Inter Display", Inter, sans-serif; font-size: 20px; font-weight: 500;
    line-height: 1.28; letter-spacing: -0.02em; color: rgb(237, 237, 237);
  }
  .muun-prog-ptime { font-size: 15px; font-weight: 600; color: #fff; }
  .muun-prog-pdesc { font-size: 14px; line-height: 1.45; color: rgb(191, 191, 191); }
  .muun-prog-kel-open { margin-top: auto; font-size: 14px; padding: 9px 16px; background: rgba(245, 158, 11, 0.22); }
  .muun-prog-kel-open:hover { background: rgba(245, 158, 11, 0.35); }

  /* ── Панель КЕЛ Старт (только при фильтре «КЕЛ Старт») ── */
  .muun-prog-kel {
    display: flex; flex-direction: column; gap: 20px;
    padding: 28px 28px 24px; border-radius: 24px;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(245, 158, 11, 0.03) 50%, rgb(17, 17, 20) 100%);
    box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.35);
  }
  .muun-prog-kel .muun-prog-badge { background: rgba(245, 158, 11, 0.22); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
  .muun-prog-kelhead { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
  .muun-prog-keltitle {
    font-family: "Inter Display", Inter, sans-serif; font-size: 26px; font-weight: 500;
    line-height: 1.25; letter-spacing: -0.025em; color: rgb(237, 237, 237);
  }
  .muun-prog-kelmeta { font-size: 15px; line-height: 1.45; color: rgb(210, 210, 210); }
  .muun-prog-krows { display: flex; flex-direction: column; }
  .muun-prog-krow {
    display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 20px;
    padding: 14px 0; border-top: 1px solid rgba(255,255,255,0.1);
  }
  .muun-prog-ktime { font-size: 17px; font-weight: 600; color: #fef08a; white-space: nowrap; }
  .muun-prog-ktitle { font-size: 17px; font-weight: 500; line-height: 1.35; color: rgb(237, 237, 237); }
  .muun-prog-knote { margin-top: 4px !important; font-size: 14px; line-height: 1.45; color: rgb(191, 191, 191); }
  .muun-prog-krow.is-highlight .muun-prog-ktitle { color: #fbbf24; }
  .muun-prog-kelorg { font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.55); }
  .muun-prog-kel-back { align-self: flex-start; }

  /* Видимость по фильтру */
  .muun-prog-kel { display: none; }
  .muun-program[data-track="kel"] .muun-prog-kel { display: flex; }
  .muun-program[data-track="kel"] .muun-prog-rows { display: none; }
  .muun-program:not([data-track="all"]) .muun-prog-parallel { display: none; }

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
    .muun-prog-points { margin: 0 18px; font-size: 14px; }
    .muun-prog-format { margin: 10px 18px 0 !important; font-size: 14px; }
    .muun-prog-group { margin: 14px 18px 0; }
    .muun-prog-speakers li, .muun-prog-person { font-size: 14px; }
    .muun-prog-pgrid { grid-template-columns: minmax(0, 1fr); gap: 12px; }
    .muun-prog-pcard { padding: 16px 18px; border-radius: 20px; }
    .muun-prog-ptitle { font-size: 18px; }
    .muun-prog-kel { padding: 20px 18px; border-radius: 20px; }
    .muun-prog-keltitle { font-size: 20px; }
    .muun-prog-krow { grid-template-columns: minmax(0, 1fr); gap: 4px; }
    .muun-prog-ktime { font-size: 15px; }
    .muun-prog-ktitle { font-size: 16px; }
  }
  @media (min-width: 810px) and (max-width: 1199px) {
    .muun-prog-pgrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
`;

// Делегирование событий на document: блок может быть перерисован при гидрации Framer.
export const programClientJs = `
  (function () {
    if (window.__muunProgramBound) return;
    window.__muunProgramBound = true;
    function apply(root) {
      var track = root.dataset.track || 'all';
      var anyDay = false;
      root.querySelectorAll('.muun-prog-day').forEach(function (day) {
        var anyRow = false;
        day.querySelectorAll('.muun-prog-row').forEach(function (row) {
          var anyItem = false;
          row.querySelectorAll('.muun-prog-item').forEach(function (item) {
            item.hidden = !(track === 'all' || item.dataset.track === track);
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
        // Подсвечиваем только верхние фильтры; кнопки «Программа КЕЛ Старт» и
        // «Вся программа» внутри блока просто переключают фильтр.
        root.querySelectorAll('.muun-prog-filters [data-prog-filter="' + group + '"]').forEach(function (c) {
          c.classList.toggle('is-active', c.dataset.value === chip.dataset.value);
        });
        apply(root);
        if (chip.classList.contains('muun-prog-kel-back')) {
          root.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
