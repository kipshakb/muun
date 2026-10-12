import fs from 'fs';

const strings = JSON.parse(fs.readFileSync('src/i18n.json', 'utf8')).strings;

function t(lang, key) {
  return strings[lang]?.[key] || strings.ru[key] || '';
}

function esc(value) {
  return String(value)
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
    gap: 22px;
  }
  .muun-news-card {
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
    border-radius: 24px;
    font-family: inherit;
  }
  .muun-news-card:hover { border-color: rgba(41,170,225,0.75); }
  .muun-news-card img {
    width: 100%;
    height: 190px;
    object-fit: cover;
    display: block;
  }
  .muun-news-card-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px 20px 18px;
    flex: 1;
  }
  .muun-news-badge {
    align-self: flex-start;
    padding: 4px 10px;
    border-radius: 100px;
    background: rgba(41,170,225,0.16);
    color: #8ed8ff;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .muun-news-card h3 {
    margin: 0;
    font-size: 18px;
    line-height: 1.3;
    font-weight: 700;
  }
  .muun-news-card p {
    margin: 0;
    color: rgba(255,255,255,0.74);
    font-size: 14px;
    line-height: 1.55;
    flex: 1;
  }
  .muun-news-foot {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: auto;
    padding-top: 16px;
    font-size: 13px;
    color: rgba(255,255,255,0.55);
  }
  .muun-news-foot b { color: #29aae1; font-weight: 700; }
  .muun-news-modal {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 28px 16px;
    background: rgba(2, 8, 16, 0.78);
  }
  .muun-news-modal.is-open { display: flex; }
  .muun-news-dialog {
    position: relative;
    width: min(680px, 100%);
    max-height: min(86vh, 820px);
    overflow: auto;
    border-radius: 24px;
    background: #07111c;
    border: 1px solid rgba(255,255,255,0.14);
    color: #fff;
    font-family: Inter, sans-serif;
    box-shadow: 0 24px 80px rgba(0,0,0,0.45);
  }
  .muun-news-dialog img {
    display: block;
    width: 100%;
    height: 280px;
    object-fit: cover;
  }
  .muun-news-dialog-body { padding: 24px 28px 32px; }
  .muun-news-dialog h2 {
    margin: 12px 0 14px;
    font-size: 28px;
    line-height: 1.25;
    font-weight: 700;
  }
  .muun-news-dialog p {
    margin: 0 0 12px;
    color: rgba(255,255,255,0.8);
    font-size: 16px;
    line-height: 1.65;
  }
  .muun-news-close {
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 2;
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 50%;
    background: rgba(0,0,0,0.55);
    color: #fff;
    cursor: pointer;
    font-size: 22px;
    line-height: 1;
  }
  @media (max-width: 980px) {
    .muun-news-grid { grid-template-columns: 1fr 1fr; }
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
  }
  @media (max-width: 680px) {
    section[data-framer-name="Contact"] { padding: 72px 16px 0 !important; }
    .muun-news-grid { grid-template-columns: 1fr; }
  }
`;

export function renderNewsBlock(lang) {
  const title = t(lang, 'news.n1_title');
  const desc = t(lang, 'news.n1_desc');
  const date = t(lang, 'news.n1_date');
  const content = t(lang, 'news.n1_content');
  const more = t(lang, 'news.btn_read_more');
  const img = '/assets/gallery-registration.jpg';

  return `
    <div class="muun-news">
      <div class="muun-news-grid">
      <button type="button" class="muun-news-card" data-news-id="1">
        <img src="${img}" alt="${esc(title)}" />
        <span class="muun-news-card-body">
          <h3>${esc(title)}</h3>
          <p>${esc(desc)}</p>
          <span class="muun-news-foot"><span>${esc(date)}</span><b>${esc(more)}</b></span>
        </span>
        <template>
          <img src="${img}" alt="" />
          <div class="muun-news-dialog-body">
            <p style="margin-top:10px;font-size:13px;color:rgba(255,255,255,0.5);">${esc(date)}</p>
            <h2>${esc(title)}</h2>
            <p>${esc(desc)}</p>
            <p>${esc(content)}</p>
          </div>
        </template>
      </button>
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
      if (modal) document.body.appendChild(modal);
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
