function esc(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const newsCss = `
  section[data-framer-name="Contact"] [data-framer-name="Contact Cards"],
  section[data-framer-name="Contact"] [data-framer-name="Contact Form"],
  section[data-framer-name="Contact"] [data-framer-name="Join Our Community"],
  section[data-framer-name="Contact"] [data-framer-name="Tag"],
  section[data-framer-name="Contact"] form {
    display: none !important;
  }
  section[data-framer-name="Contact"] {
    padding: 100px 40px 0 !important;
    box-sizing: border-box !important;
  }
  section[data-framer-name="Contact"],
  section[data-framer-name="Contact"] [data-framer-name="Container"] {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    width: 100% !important;
    max-width: 1440px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    overflow: visible !important;
  }
  section[data-framer-name="Contact"] [data-framer-name="Container"] {
    padding: 0 !important;
    gap: 36px !important;
  }
  section[data-framer-name="Contact"] [data-framer-name="Title"],
  section[data-framer-name="Contact"] [data-framer-name="Title"] > div,
  .muun-news {
    width: min(1180px, 100%) !important;
    max-width: 1180px !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    align-self: flex-start !important;
    box-sizing: border-box !important;
  }
  section[data-framer-name="Contact"] [data-framer-name="Title"] h2 {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    text-align: left !important;
    white-space: nowrap !important;
  }
  .muun-news {
    margin-top: 0 !important;
    margin-bottom: 88px !important;
    font-family: Inter, sans-serif;
    color: #fff;
  }
  .muun-news-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
    width: 100%;
  }
  .muun-news-card {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0;
    overflow: hidden;
    text-align: left;
    cursor: pointer;
    color: inherit;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 20px;
    font-family: inherit;
    transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  }
  .muun-news-card:hover {
    border-color: rgba(41,170,225,0.75);
    box-shadow: 0 12px 36px rgba(0,0,0,0.45), 0 0 24px rgba(41,170,225,0.2);
    transform: translateY(-4px);
  }
  .muun-news-card-img-wrap {
    width: 100%;
    height: 190px;
    overflow: hidden;
    position: relative;
    background: #061524;
  }
  .muun-news-card-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }
  .muun-news-card:hover .muun-news-card-img-wrap img {
    transform: scale(1.03);
  }
  .muun-news-card-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px 20px 18px;
    flex: 1;
  }

  .muun-news-card h3 {
    margin: 0;
    font-size: 16.5px;
    line-height: 1.35;
    font-weight: 700;
    color: #ffffff;
  }
  .muun-news-card p {
    margin: 0;
    color: rgba(255,255,255,0.74);
    font-size: 13.5px;
    line-height: 1.55;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .muun-news-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid rgba(255,255,255,0.08);
    font-size: 12.5px;
    color: rgba(255,255,255,0.55);
  }
  .muun-news-foot b {
    color: #29aae1;
    font-weight: 700;
    transition: color 0.2s;
  }
  .muun-news-card:hover .muun-news-foot b {
    color: #60c5f1;
  }
  .muun-news-modal {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 28px 16px;
    background: rgba(2, 8, 16, 0.82);
    backdrop-filter: blur(10px);
  }
  .muun-news-modal.is-open { display: flex; }
  .muun-news-dialog {
    position: relative;
    width: min(720px, 100%);
    max-height: min(88vh, 840px);
    overflow: auto;
    border-radius: 24px;
    background: #07111c;
    border: 1px solid rgba(255,255,255,0.16);
    color: #fff;
    font-family: Inter, sans-serif;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
  }
  .muun-news-dialog-img-wrap {
    width: 100%;
    height: 320px;
    overflow: hidden;
    position: relative;
    background: #020810;
  }
  .muun-news-dialog-img-wrap img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .muun-news-dialog-body {
    padding: 28px 32px 36px;
  }
  .muun-news-dialog h2 {
    margin: 14px 0 16px;
    font-size: 26px;
    line-height: 1.3;
    font-weight: 700;
    color: #ffffff;
  }
  .muun-news-dialog p {
    margin: 0 0 14px;
    color: rgba(255,255,255,0.85);
    font-size: 16px;
    line-height: 1.7;
  }
  .muun-news-source-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 13px 26px;
    background: linear-gradient(135deg, #29aae1 0%, #1582b5 100%);
    color: #ffffff !important;
    text-decoration: none !important;
    font-size: 15px;
    font-weight: 700;
    border-radius: 100px;
    box-shadow: 0 6px 20px rgba(41, 170, 225, 0.4);
    transition: all 0.25s ease;
  }
  .muun-news-source-btn:hover {
    background: linear-gradient(135deg, #38bdf8 0%, #29aae1 100%);
    box-shadow: 0 8px 26px rgba(41, 170, 225, 0.6);
    transform: translateY(-2px);
  }
  .muun-news-close {
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 10;
    width: 38px;
    height: 38px;
    border: 0;
    border-radius: 50%;
    background: rgba(0,0,0,0.65);
    color: #fff;
    cursor: pointer;
    font-size: 22px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .muun-news-close:hover {
    background: rgba(41,170,225,0.8);
  }
  @media (max-width: 810px) {
    section[data-framer-name="Contact"] [data-framer-name="Title"],
    section[data-framer-name="Contact"] [data-framer-name="Title"] > div {
      width: 100% !important;
      max-width: 100% !important;
      overflow: visible !important;
    }
    section[data-framer-name="Contact"] [data-framer-name="Title"] h2 {
      white-space: normal !important;
      overflow: visible !important;
      overflow-wrap: break-word !important;
      font-size: clamp(26px, 7.2vw, 36px) !important;
      line-height: 1.15 !important;
    }
    .muun-news-dialog h2 {
      font-size: 22px;
    }
    .muun-news-dialog-body {
      padding: 20px 20px 28px;
    }
    .muun-news-dialog-img-wrap {
      height: 230px;
    }
  }
  @media (max-width: 980px) {
    .muun-news-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
  }
  @media (max-width: 680px) {
    section[data-framer-name="Contact"] { padding: 72px 16px 0 !important; }
    .muun-news-grid { grid-template-columns: 1fr; }
  }
`;

export const NEWS_ITEMS = {
  ru: [
    {
      id: 'run',
      title: 'Около 5 тысяч студентов приняли участие в осеннем легкоатлетическом забеге «Жаратман МУУН»',
      desc: '24 октября в Бишкеке, Оше, Баткене, Нарыне и Таласе, а также на Иссык-Куле состоялся осенний легкоатлетический забег среди студентов высших и средних профессиональных учебных заведений Кыргызстана.',
      content: 'Спортивное мероприятие было организовано в рамках национального проекта «Жаратман муун».',
      date: '24 октября 2026',
      img: '/assets/news-run.jpg',
      imgPosition: 'center top',
      sourceUrl: 'https://egov.kg/ru/ministry/science/news/49924',
      sourceLabel: 'Перейти к источнику'
    },
    {
      id: 'eco',
      title: 'Эко-акция «Жаратман МУУН» / Гора Боз-Бөлтөк',
      desc: 'На склонах горы Боз-Бөлтөк состоялась масштабная экологическая акция в рамках молодежной инициативы «Жаратман муун», реализуемой под эгидой Министерства науки, высшего образования и инноваций Кыргызской Республики.',
      content: 'Экологическая акция объединила активную молодежь, волонтеров и студентов в поддержку чистоты природы и зеленых инициатив.',
      date: '20 октября 2026',
      img: '/assets/news-eco.jpg',
      imgPosition: 'center center',
      sourceUrl: 'https://egov.kg/ru/ministry/science/news/49866',
      sourceLabel: 'Перейти к источнику'
    }
  ],
  ky: [
    {
      id: 'run',
      title: '«Жаратман МУУН» күзүндөгү жеңил атлетикалык жарышка 5 миңге жакын студент катышты',
      desc: '24-октябрда Бишкек, Ош, Баткен, Нарын, Талас шаарларында жана Ысык-Көлдө Кыргызстандын жогорку жана орто кесиптик окуу жайларынын студенттери арасында күзгү жеңил атлетикалык жарыш өттү.',
      content: 'Спортук иш-чара «Жаратман муун» улуттук долбоорунун алкагында уюштурулду.',
      date: '24-октябрь 2026',
      img: '/assets/news-run.jpg',
      imgPosition: 'center top',
      sourceUrl: 'https://egov.kg/ru/ministry/science/news/49924',
      sourceLabel: 'Булакка өтүү'
    },
    {
      id: 'eco',
      title: '«Жаратман МУУН» эко-акциясы / Боз-Бөлтөк тоосу',
      desc: 'Боз-Бөлтөк тоосунун капталдарында Кыргыз Республикасынын илим, жогорку билим берүү жана инновациялар министрлигинин колдоосу менен «Жаратман муун» жаштар демилгесинин алкагында масштабдуу экологиялык акция өттү.',
      content: 'Экологиялык акция жаратылышты таза сактоо жана жашыл демилгелерди колдоо максатында активдүү жаштарды, ыктыярчыларды жана студенттерди бириктирди.',
      date: '20-октябрь 2026',
      img: '/assets/news-eco.jpg',
      imgPosition: 'center center',
      sourceUrl: 'https://egov.kg/ru/ministry/science/news/49866',
      sourceLabel: 'Булакка өтүү'
    }
  ],
  en: [
    {
      id: 'run',
      title: 'About 5,000 Students Took Part in the "Zharatman MUUN" Autumn Athletic Race',
      desc: 'On October 24, an autumn athletic race was held among students of higher and secondary vocational educational institutions across Kyrgyzstan, including Bishkek, Osh, Batken, Naryn, Talas, and Issyk-Kul.',
      content: 'The sporting event was organized as part of the "Zharatman MUUN" national project.',
      date: 'October 24, 2026',
      img: '/assets/news-run.jpg',
      imgPosition: 'center top',
      sourceUrl: 'https://egov.kg/ru/ministry/science/news/49924',
      sourceLabel: 'Go to source'
    },
    {
      id: 'eco',
      title: '"Zharatman MUUN" Eco-Action / Boz-Boltok Mountain',
      desc: 'A large-scale environmental action was held on the slopes of Mount Boz-Boltok as part of the "Zharatman MUUN" youth initiative, implemented under the auspices of the Ministry of Science, Higher Education and Innovation of the Kyrgyz Republic.',
      content: 'The eco-action brought together youth, volunteers, and university students to promote clean nature and green initiatives.',
      date: 'October 20, 2026',
      img: '/assets/news-eco.jpg',
      imgPosition: 'center center',
      sourceUrl: 'https://egov.kg/ru/ministry/science/news/49866',
      sourceLabel: 'Go to source'
    }
  ]
};

export function renderNewsBlock(lang) {
  const list = NEWS_ITEMS[lang] || NEWS_ITEMS.ru;
  const readMore = lang === 'ky' ? 'Кеңири окуу' : lang === 'en' ? 'Read more' : 'Читать далее';

  const cardsHtml = list.map((item) => `
    <button type="button" class="muun-news-card" data-news-id="${esc(item.id)}">
      <div class="muun-news-card-img-wrap">
        <img src="${esc(item.img)}" alt="${esc(item.title)}" style="object-position:${esc(item.imgPosition)};" />
      </div>
      <span class="muun-news-card-body">
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.desc)}</p>
        <span class="muun-news-foot">
          <span>📅 ${esc(item.date)}</span>
          <b>${esc(readMore)} →</b>
        </span>
      </span>
      <template>
        <div class="muun-news-dialog-img-wrap">
          <img src="${esc(item.img)}" alt="${esc(item.title)}" style="object-position:${esc(item.imgPosition)};" />
        </div>
        <div class="muun-news-dialog-body">
          <p style="margin:0 0 10px;font-size:13px;color:rgba(255,255,255,0.55);">📅 ${esc(item.date)}</p>
          <h2>${esc(item.title)}</h2>
          <p style="font-size:16px;line-height:1.75;color:rgba(255,255,255,0.9);margin-bottom:14px;">${esc(item.desc)}</p>
          <p style="font-size:16px;line-height:1.75;color:rgba(255,255,255,0.9);margin-bottom:24px;">${esc(item.content)}</p>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:flex-start;">
            <a href="${esc(item.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="muun-news-source-btn" onclick="event.stopPropagation()">
              <span>${esc(item.sourceLabel)}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="margin-left:4px;">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </template>
    </button>
  `).join('\n');

  return `
    <div class="muun-news">
      <div class="muun-news-grid">
        ${cardsHtml}
      </div>
      <div class="muun-news-modal" id="muun-news-modal" data-news-modal>
        <div class="muun-news-dialog" role="dialog" aria-modal="true">
          <button type="button" class="muun-news-close" data-news-close aria-label="Close">×</button>
          <div data-news-modal-body></div>
        </div>
      </div>
    </div>`;
}

export const newsClientJs = `
  (function () {
    function bindNews(root) {
      if (!root || root.dataset.newsBound === '1') return;
      root.dataset.newsBound = '1';
      const modal = root.querySelector('[data-news-modal]');
      const modalBody = root.querySelector('[data-news-modal-body]');
      if (modal && modal.parentElement !== document.body) {
        document.body.appendChild(modal);
      }
      const close = () => modal && modal.classList.remove('is-open');
      root.querySelectorAll('.muun-news-card').forEach((card) => {
        card.addEventListener('click', () => {
          const tpl = card.querySelector('template');
          if (!tpl || !modal || !modalBody) return;
          modalBody.innerHTML = tpl.innerHTML;
          modal.classList.add('is-open');
        });
      });
      modal?.querySelector('[data-news-close]')?.addEventListener('click', close);
      modal?.addEventListener('click', (event) => {
        if (event.target === modal) close();
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') close();
      });
    }
    window.__muunBindNews = bindNews;
  })();
`;
