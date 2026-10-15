import fs from 'fs';
import { PRESS_ENDPOINT } from './form_endpoints.mjs';

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

const extra = {
  ru: {
    doc: 'Официальный документ',
    dateLbl: 'Даты и город',
    venueLbl: 'Локация',
    scaleLbl: 'Масштаб события',
    topicsLbl: 'Ключевые треки',
    formKicker: 'Официальная регистрация прессы',
    s1: 'Информация о СМИ',
    s2: 'Контактные данные и допуск службы безопасности',
    s3: 'Формат работы и даты присутствия',
    phMedia: 'Телеканал, агентство, издание, блог...',
    phRole: 'Корреспондент, оператор, продюсер...',
    phPin: '14 цифр ПИН / ИНН',
    phPressId: 'Номер удостоверения прессы',
    phEquip: 'Камеры, микрофоны, штативы...',
    phComment: 'Специальные запросы на синхроны, спикеров или подключение ПТС...',
    g1: 'Главная сцена',
    g2: 'Конгресс-холл «Ырыс Ордо»',
    g3: 'Панельные сессии',
    dlJpg: 'Скачать JPG',
    pressSvc: 'Пресс-служба MUUN 2026',
    sending: 'Отправка заявки...',
    anonSubject: 'Запрос документа пресс-анонса',
    releaseSubject: 'Пресс-релиз'
  },
  ky: {
    doc: 'Расмий документ',
    dateLbl: 'Күндөр жана шаар',
    venueLbl: 'Жайгашкан жери',
    scaleLbl: 'Иш-чаранын масштабы',
    topicsLbl: 'Негизги багыттар',
    formKicker: 'Расмий пресс-каттоо',
    s1: 'ЖМК тууралуу маалымат',
    s2: 'Байланыш маалыматтары жана коопсуздук кызматынын уруксаты',
    s3: 'Иштөө форматы жана катышуу күндөрү',
    phMedia: 'Телеканал, агентство, басылма, блог...',
    phRole: 'Кабарчы, оператор, продюсер...',
    phPin: '14 орундуу ПИН / ИНН',
    phPressId: 'Пресс-күбөлүктүн номери',
    phEquip: 'Камералар, микрофондор, штативдер...',
    phComment: 'Синхрон, спикерлер же ПТС туташтыруу боюнча атайын суроо-талаптар...',
    g1: 'Башкы сахна',
    g2: '«Ырыс Ордо» конгресс-холлу',
    g3: 'Панелдик сессиялар',
    dlJpg: 'JPG жүктөө',
    pressSvc: 'MUUN 2026 пресс-кызматы',
    sending: 'Билдирме жөнөтүлүүдө...',
    anonSubject: 'Пресс-анонс документине суроо-талап',
    releaseSubject: 'Пресс-релиз'
  },
  en: {
    doc: 'Official document',
    dateLbl: 'Dates and city',
    venueLbl: 'Location',
    scaleLbl: 'Event scale',
    topicsLbl: 'Key tracks',
    formKicker: 'Official press registration',
    s1: 'Media information',
    s2: 'Contact details and security clearance',
    s3: 'Work format and attendance dates',
    phMedia: 'TV channel, agency, publication, blog...',
    phRole: 'Correspondent, camera operator, producer...',
    phPin: '14-digit PIN / TIN',
    phPressId: 'Press ID number',
    phEquip: 'Cameras, microphones, tripods...',
    phComment: 'Special requests for interviews, speakers, or OB van access...',
    g1: 'Main stage',
    g2: 'Yrys Ordo Congress Hall',
    g3: 'Panel sessions',
    dlJpg: 'Download JPG',
    pressSvc: 'MUUN 2026 Press Service',
    sending: 'Sending application...',
    anonSubject: 'Press announcement document request',
    releaseSubject: 'Press release'
  }
};

export const pressCss = `
  section[data-framer-name="Contact"] [data-framer-name="Contact Cards"],
  section[data-framer-name="Contact"] [data-framer-name="Contact Form"],
  section[data-framer-name="Contact"] [data-framer-name="Join Our Community"],
  section[data-framer-name="Contact"] [data-framer-name="Tag"],
  section[data-framer-name="Contact"] form:not(.muun-press-form) {
    display: none !important;
  }
  section[data-framer-name="Contact"] {
    padding: 80px 40px 0 !important;
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
    gap: 28px !important;
  }
  section[data-framer-name="Contact"] [data-framer-name="Title"],
  section[data-framer-name="Contact"] [data-framer-name="Title"] > div,
  .muun-press {
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
    white-space: normal !important;
  }
  .muun-press {
    margin-top: 8px !important;
    margin-bottom: 88px !important;
    font-family: Inter, sans-serif;
    color: #fff;
  }
  .muun-press * { box-sizing: border-box; }
  .muun-press-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 28px;
  }
  .muun-press-btn {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    min-height: 46px !important;
    padding: 12px 22px !important;
    border-radius: 100px !important;
    font-family: Inter, sans-serif !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    line-height: 1 !important;
    text-decoration: none !important;
    cursor: pointer !important;
    border: 1px solid transparent !important;
  }
  .muun-press-btn--primary {
    background: linear-gradient(135deg, #29aae1, #1d4ed8) !important;
    color: #fff !important;
    box-shadow: 0 8px 24px rgba(41, 170, 225, 0.28) !important;
  }
  .muun-press-btn--ghost {
    background: transparent !important;
    color: #fff !important;
    border-color: rgba(255,255,255,0.22) !important;
  }
  .muun-press-btn--ghost:hover { border-color: #29aae1 !important; color: #8ed8ff !important; }
  .muun-press-btn--sm { min-height: 36px !important; padding: 8px 14px !important; font-size: 12px !important; }
  .muun-press-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 24px;
  }
  .muun-press-anon {
    padding: 28px 28px 24px;
    background: linear-gradient(135deg, rgba(41,170,225,0.16) 0%, rgba(255,255,255,0.04) 55%);
    border: 1px solid rgba(41,170,225,0.35);
    border-radius: 24px;
    margin-bottom: 48px;
  }
  .muun-press-anon-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 18px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .muun-press-kicker {
    display: block;
    margin-bottom: 6px;
    color: #8ed8ff;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .muun-press h3 {
    margin: 0;
    color: #fff;
    font-size: 28px;
    line-height: 1.25;
    font-weight: 700;
  }
  .muun-press-lead {
    margin: 8px 0 0;
    color: rgba(255,255,255,0.72);
    font-size: 15px;
    line-height: 1.6;
  }
  .muun-press-facts {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }
  .muun-press-facts span {
    display: block;
    margin-bottom: 4px;
    color: rgba(255,255,255,0.5);
    font-size: 12px;
  }
  .muun-press-facts strong {
    display: block;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
  }
  .muun-press-block { margin-bottom: 48px; }
  .muun-press-block > h3 { margin-bottom: 8px; }
  .muun-press-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    margin-top: 22px;
  }
  .muun-press-release {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 100%;
    padding: 22px;
  }
  .muun-press-date {
    color: #8ed8ff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .muun-press-release h4 {
    margin: 0;
    color: #fff;
    font-size: 18px;
    line-height: 1.35;
    font-weight: 700;
  }
  .muun-press-release p,
  .muun-press-note {
    margin: 0;
    color: rgba(255,255,255,0.72);
    font-size: 14px;
    line-height: 1.55;
  }
  .muun-press-release .muun-press-btn { margin-top: auto; align-self: flex-start !important; }
  .muun-press-form-card {
    margin-top: 22px;
    padding: 32px 32px 28px;
    background: linear-gradient(145deg, rgba(13, 22, 43, 0.92) 0%, rgba(8, 15, 30, 0.96) 100%);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 24px;
    box-shadow: 0 25px 60px rgba(0,0,0,0.35);
  }
  .muun-press-step { margin-top: 26px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,0.08); }
  .muun-press-step:first-child { margin-top: 0; padding-top: 0; border-top: 0; }
  .muun-press-step h4 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 16px;
    color: #fff;
    font-size: 17px;
    font-weight: 700;
  }
  .muun-press-num {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #29aae1;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    flex: none;
  }
  .muun-press-field { margin-bottom: 14px; }
  .muun-press-field label,
  .muun-press-label {
    display: block;
    margin-bottom: 6px;
    color: rgba(255,255,255,0.88);
    font-size: 12.5px;
    font-weight: 600;
  }
  .muun-press-input,
  .muun-press-form textarea {
    width: 100% !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    padding: 12px 14px !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 11px !important;
    background: rgba(13, 23, 44, 0.75) !important;
    color: #fff !important;
    font-family: Inter, sans-serif !important;
    font-size: 13.5px !important;
    outline: none !important;
    color-scheme: dark !important;
  }
  .muun-press-input::placeholder,
  .muun-press-form textarea::placeholder { color: rgba(255,255,255,0.35) !important; }
  .muun-press-input:focus,
  .muun-press-form textarea:focus {
    border-color: #38bdf8 !important;
    background: rgba(16, 29, 56, 0.95) !important;
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.22) !important;
  }
  .muun-press-form textarea { min-height: 96px; resize: vertical; }
  .muun-press-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .muun-press-pills { display: flex; flex-wrap: wrap; gap: 8px; }
  .muun-press-pill {
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
    margin: 0 !important;
    padding: 10px 14px !important;
    border: 1px solid rgba(255,255,255,0.14) !important;
    border-radius: 12px !important;
    background: rgba(255,255,255,0.04) !important;
    color: rgba(255,255,255,0.86) !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    cursor: pointer !important;
  }
  .muun-press-pill input { accent-color: #29aae1; margin: 0 !important; }
  .muun-press-pill:has(input:checked) {
    background: rgba(41,170,225,0.16) !important;
    border-color: #29aae1 !important;
    color: #fff !important;
  }
  .muun-press-submit {
    width: 100% !important;
    margin-top: 8px !important;
    border: 0 !important;
    background: linear-gradient(135deg, #29aae1, #1d4ed8) !important;
    color: #fff !important;
  }
  .muun-press-submit:disabled { opacity: 0.7 !important; cursor: wait !important; }
  .muun-press-disclaimer {
    margin: 12px auto 0;
    max-width: 680px;
    text-align: center;
    color: rgba(255,255,255,0.5);
    font-size: 12px;
    line-height: 1.5;
  }
  .muun-press-success {
    margin-top: 8px;
    padding: 28px 20px;
    text-align: center;
    border-radius: 16px;
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.35);
  }
  .muun-press-success h4 { margin: 0 0 6px; color: #86efac; font-size: 18px; }
  .muun-press-success p { margin: 0; color: #bbf7d0; font-size: 14px; }
  .muun-press-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-bottom: 22px;
  }
  .muun-press-panel { padding: 26px; }
  .muun-press-panel--alert {
    background: rgba(239,68,68,0.08);
    border-color: rgba(239,68,68,0.28);
  }
  .muun-press-panel h3 { font-size: 20px; margin-bottom: 10px; }
  .muun-press-panel ul { list-style: none; margin: 16px 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .muun-press-panel li { display: flex; gap: 10px; color: rgba(255,255,255,0.88); font-size: 14px; line-height: 1.45; }
  .muun-press-panel li b { color: #f87171; font-weight: 700; }
  .muun-press-panel--zone li b { color: #29aae1; }
  .muun-press-kit {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 22px 24px;
    margin-bottom: 48px;
  }
  .muun-press-kit h3 { font-size: 18px; margin-bottom: 6px; }
  .muun-press-status {
    padding: 10px 16px;
    border-radius: 100px;
    background: rgba(41,170,225,0.12);
    border: 1px solid rgba(41,170,225,0.3);
    color: #8ed8ff;
    font-size: 13px;
    font-weight: 600;
  }
  .muun-press-shot { overflow: hidden; padding: 0; }
  .muun-press-shot img { display: block; width: 100%; height: 210px; object-fit: cover; }
  .muun-press-shot-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px 16px;
  }
  .muun-press-shot-foot span { color: #fff; font-size: 14px; font-weight: 600; }
  .muun-press-contacts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-top: 22px;
  }
  .muun-press-contact { padding: 26px; }
  .muun-press-contact h4 { margin: 0 0 8px; color: #fff; font-size: 17px; }
  .muun-press-contact p { margin: 0 0 14px; }
  .muun-press-contact a { color: #8ed8ff !important; font-weight: 700; text-decoration: none !important; }
  #releases, #accreditation { scroll-margin-top: 110px; }
  @media (max-width: 980px) {
    .muun-press-facts, .muun-press-grid { grid-template-columns: 1fr 1fr; }
    .muun-press-split, .muun-press-contacts, .muun-press-row { grid-template-columns: 1fr; }
  }
  @media (max-width: 680px) {
    section[data-framer-name="Contact"] { padding: 72px 16px 0 !important; }
    .muun-press-facts, .muun-press-grid { grid-template-columns: 1fr; }
    .muun-press-anon, .muun-press-form-card, .muun-press-panel { padding: 20px 16px; }
    .muun-press h3 { font-size: 24px; }
    .muun-press-shot-foot { flex-direction: column; align-items: flex-start; }
  }
`;

function mail(subject) {
  return `mailto:media@muun.kg?subject=${encodeURIComponent(subject)}`;
}

function releaseCard(lang, x, dateKey, titleKey, descKey) {
  const title = t(lang, titleKey);
  return `
    <article class="muun-press-card muun-press-release">
      <span class="muun-press-date">${esc(t(lang, dateKey))}</span>
      <h4>${esc(title)}</h4>
      <p>${esc(t(lang, descKey))}</p>
      <a class="muun-press-btn muun-press-btn--ghost muun-press-btn--sm" href="${esc(mail(`${x.releaseSubject}: ${title}`))}">${esc(t(lang, 'press.btn_download_docx'))}</a>
    </article>`;
}

function shot(src, alt, label, downloadLabel) {
  return `
    <article class="muun-press-card muun-press-shot">
      <img src="${src}" alt="${esc(alt)}" />
      <div class="muun-press-shot-foot">
        <span>${esc(label)}</span>
        <a class="muun-press-btn muun-press-btn--ghost muun-press-btn--sm" href="${src}" download>${esc(downloadLabel)}</a>
      </div>
    </article>`;
}

export function renderPressBlock(lang) {
  const x = extra[lang] || extra.ru;
  const types = [
    ['TV', 'press.f_type_tv', false],
    ['Agency', 'press.f_type_agency', false],
    ['Online', 'press.f_type_online', true],
    ['Print', 'press.f_type_print', false],
    ['Radio', 'press.f_type_radio', false],
    ['Blog', 'press.f_type_blog', false],
    ['PhotoVideo', 'press.f_type_photo', false],
    ['Other', 'press.f_type_other', false]
  ];
  const formats = [
    ['coverage', 'press.f_fmt_coverage', true],
    ['interview', 'press.f_fmt_interview', false],
    ['photo_video', 'press.f_fmt_photo_video', false],
    ['crew', 'press.f_fmt_crew', false],
    ['partner', 'press.f_fmt_partnership', false],
    ['other', 'press.f_fmt_other', false]
  ];
  const typePills = types.map(([value, key, checked]) =>
    `<label class="muun-press-pill"><input type="radio" name="media_type" value="${value}"${checked ? ' checked' : ''} required /> <span>${esc(t(lang, key))}</span></label>`
  ).join('');
  const formatPills = formats.map(([value, key, checked]) =>
    `<label class="muun-press-pill"><input type="checkbox" name="format" value="${value}"${checked ? ' checked' : ''} /> <span>${esc(t(lang, key))}</span></label>`
  ).join('');
  const sizePills = ['1', '2', '3', '4+'].map((value, i) =>
    `<label class="muun-press-pill"><input type="radio" name="team_size" value="${value}"${i === 0 ? ' checked' : ''} /> <span>${value}</span></label>`
  ).join('');
  const datePills = [
    ['nov17', 'press.f_date_nov17', true]
  ].map(([value, key, checked]) =>
    `<label class="muun-press-pill"><input type="radio" name="dates" value="${value}"${checked ? ' checked' : ''} /> <span>${esc(t(lang, key))}</span></label>`
  ).join('');

  return `
    <div class="muun-press">
      <section class="muun-press-block" id="accreditation">
        <h3>${esc(t(lang, 'press.form_title'))}</h3>
        <p class="muun-press-lead">${esc(t(lang, 'press.form_desc'))}</p>
        <div class="muun-press-form-card">
          <form class="muun-press-form" id="media-accreditation-form">
            <div class="muun-press-form-body">
              <div class="muun-press-step">
                <h4><span class="muun-press-num">1</span> ${esc(x.s1)}</h4>
                <div class="muun-press-field">
                  <label for="press-media-name">${esc(t(lang, 'press.f_media_name'))}</label>
                  <input class="muun-press-input" id="press-media-name" type="text" name="media_name" required placeholder="${esc(x.phMedia)}" />
                </div>
                <div class="muun-press-field">
                  <span class="muun-press-label">${esc(t(lang, 'press.f_media_type'))}</span>
                  <div class="muun-press-pills">${typePills}</div>
                </div>
                <div class="muun-press-field">
                  <label for="press-media-url">${esc(t(lang, 'press.f_media_url'))}</label>
                  <input class="muun-press-input" id="press-media-url" type="url" name="media_url" required placeholder="https://" />
                </div>
              </div>

              <div class="muun-press-step">
                <h4><span class="muun-press-num">2</span> ${esc(x.s2)}</h4>
                <div class="muun-press-row">
                  <div class="muun-press-field">
                    <label for="press-name">${esc(t(lang, 'press.f_name'))}</label>
                    <input class="muun-press-input" id="press-name" type="text" name="rep_name" required />
                  </div>
                  <div class="muun-press-field">
                    <label for="press-role">${esc(t(lang, 'press.f_role'))}</label>
                    <input class="muun-press-input" id="press-role" type="text" name="rep_role" required placeholder="${esc(x.phRole)}" />
                  </div>
                </div>
                <div class="muun-press-row">
                  <div class="muun-press-field">
                    <label for="press-phone">${esc(t(lang, 'press.f_phone'))}</label>
                    <input class="muun-press-input" id="press-phone" type="tel" name="phone" required placeholder="+996 " />
                  </div>
                  <div class="muun-press-field">
                    <label for="press-email">${esc(t(lang, 'press.f_email'))}</label>
                    <input class="muun-press-input" id="press-email" type="email" name="email" required />
                  </div>
                </div>
                <div class="muun-press-row">
                  <div class="muun-press-field">
                    <label for="press-pin">${esc(t(lang, 'press.f_pin'))}</label>
                    <input class="muun-press-input" id="press-pin" type="text" name="pin" required placeholder="${esc(x.phPin)}" />
                  </div>
                  <div class="muun-press-field">
                    <label for="press-id">${esc(t(lang, 'press.f_press_id'))}</label>
                    <input class="muun-press-input" id="press-id" type="text" name="press_id" required placeholder="${esc(x.phPressId)}" />
                  </div>
                </div>
                <div class="muun-press-field">
                  <label for="press-equipment">${esc(t(lang, 'press.f_equipment'))}</label>
                  <input class="muun-press-input" id="press-equipment" type="text" name="equipment" placeholder="${esc(x.phEquip)}" />
                </div>
              </div>

              <div class="muun-press-step">
                <h4><span class="muun-press-num">3</span> ${esc(x.s3)}</h4>
                <div class="muun-press-field">
                  <span class="muun-press-label">${esc(t(lang, 'press.f_formats_title'))}</span>
                  <div class="muun-press-pills">${formatPills}</div>
                </div>
                <div class="muun-press-row">
                  <div class="muun-press-field">
                    <span class="muun-press-label">${esc(t(lang, 'press.f_team_size_title'))}</span>
                    <div class="muun-press-pills">${sizePills}</div>
                  </div>
                  <div class="muun-press-field">
                    <span class="muun-press-label">${esc(t(lang, 'press.f_dates_title'))}</span>
                    <div class="muun-press-pills">${datePills}</div>
                  </div>
                </div>
                <div class="muun-press-field">
                  <label for="press-comment">${esc(t(lang, 'press.f_comment'))}</label>
                  <textarea id="press-comment" name="comment" placeholder="${esc(x.phComment)}"></textarea>
                </div>
              </div>
            </div>
            <button type="submit" class="muun-press-btn muun-press-submit" data-press-submit data-sending="${esc(x.sending)}">${esc(t(lang, 'press.f_submit_btn'))}</button>
            <p class="muun-press-disclaimer" data-press-disclaimer>${esc(t(lang, 'press.f_disclaimer'))}</p>
            <div class="muun-press-success" data-press-success hidden>
              <h4>${esc(t(lang, 'press.f_success_title'))}</h4>
              <p>${esc(t(lang, 'press.f_success_desc'))}</p>
            </div>
          </form>
        </div>
      </section>
    </div>`;
}

export const pressClientJs = `
  (function () {
    function bindPress(root) {
      if (!root || root.dataset.pressBound === '1') return;
      root.dataset.pressBound = '1';
      const form = root.querySelector('.muun-press-form');
      if (!form) return;
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const btn = form.querySelector('[data-press-submit]');
        const success = form.querySelector('[data-press-success]');
        const origText = btn ? btn.textContent : '';
        if (btn) {
          btn.disabled = true;
          btn.textContent = btn.getAttribute('data-sending') || '...';
        }
        const formData = new FormData(form);
        const formats = formData.getAll('format');
        formData.delete('format');
        if (formats.length) formData.append('format', formats.join(', '));
        formData.set('form', 'press');
        var lang = (location.pathname.split('/').filter(Boolean)[0] || 'ru');
        if (lang !== 'ru' && lang !== 'ky' && lang !== 'en') lang = 'ru';
        formData.set('lang', lang);
        formData.set('submittedAt', new Date().toISOString());
        var endpoint = '${PRESS_ENDPOINT}';
        if (!endpoint) {
          if (btn) {
            btn.disabled = false;
            btn.textContent = origText;
          }
          window.alert('Таблица аккредитации СМИ ещё не подключена.');
          return;
        }
        fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        })
        .then(function () {
          form.querySelectorAll('.muun-press-form-body, [data-press-submit], [data-press-disclaimer]').forEach(function (el) {
            el.style.display = 'none';
          });
          if (success) success.hidden = false;
        })
        .catch(function () {
          if (btn) {
            btn.disabled = false;
            btn.textContent = origText;
          }
          window.alert('Не удалось отправить заявку. Попробуйте ещё раз.');
        });
      });
    }
    window.__muunBindPress = bindPress;
  })();
`;
