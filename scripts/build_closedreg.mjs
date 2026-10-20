import fs from 'fs';
import path from 'path';
import { getRegistrationClientJs } from './reg_form_client.mjs';
import { CLOSED_REGISTRATION_ENDPOINT, REGISTRATION_ENDPOINT } from './form_endpoints.mjs';

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

export function buildClosedRegHtml(lang) {
  const i18n = JSON.parse(fs.readFileSync('src/i18n.json', 'utf8'));
  const S = i18n.strings[lang] || i18n.strings.ru;

  const countryOptions = countryChoices(lang).map((c) =>
    `<option value="${escHtml(c.value)}">${escHtml(c.label)}</option>`
  ).join('');

  const metaTitle = lang === 'ky'
    ? 'Катышуучуну жабык каттоо — MUUN 2026'
    : lang === 'en'
      ? 'Private Participant Registration — MUUN 2026'
      : 'Закрытая регистрация участника — MUUN 2026';

  const badgeText = lang === 'ky'
    ? 'Жабык каттоо'
    : lang === 'en'
      ? 'Private Registration'
      : 'Закрытая регистрация';

  const titleText = lang === 'ky'
    ? 'КӨРГӨЗМӨ-ФОРУМГА КАТТАЛУУ'
    : lang === 'en'
      ? 'PARTICIPANT REGISTRATION'
      : 'РЕГИСТРАЦИЯ УЧАСТНИКА';

  const resumeHint = lang === 'ky'
    ? 'Кааласаңыз, резюмеңизди (CV) тиркей аласыз — биз аны потенциалдуу иш берүүчүлөр жана өнөктөштөр менен бөлүшөбүз. Форматтар: PDF, DOC, DOCX, JPG, PNG 10 МБ чейин (милдеттүү эмес).'
    : lang === 'en'
      ? 'Optionally, you can attach your resume (CV) — we will share it with potential employers and forum partners. Formats: PDF, DOC, DOCX, JPG, PNG up to 10 MB (optional).'
      : 'При желании вы можете прикрепить резюме (CV) — мы поделимся им с потенциальными работодателями и партнерами форума. Форматы: PDF, DOC, DOCX, JPG, PNG до 10 МБ (необязательно).';

  const resetLabel = lang === 'ky'
    ? 'Жаңы өтүнмө толтуруу'
    : lang === 'en'
      ? 'Submit another application'
      : 'Заполнить новую заявку';

  const notices = {
    ru: {
      subtitleHeadline: 'Прийти необходимо с 07:00 до 10:00, имея при себе удостоверение личности или паспорт. Дресс-код — официальный, допускается надевать одежду с элементами национальной стилистики Кыргызстана.',
      accessNote: 'Форум проходит в Конгресс-холле «Ырыс Ордо». Пропускной режим осуществляется строго по предварительной регистрации.',
      timeLabel: 'Время прибытия:',
      timeText: 'с 07:00 до 10:00',
      docsLabel: 'Документы:',
      docsText: 'при себе обязательно иметь удостоверение личности или паспорт',
      dressLabel: 'Дресс-код:',
      dressText: 'официальный, допускается надевать одежду с элементами национальной стилистики Кыргызстана'
    },
    ky: {
      subtitleHeadline: 'Иш-чарага саат 07:00дөн 10:00гө чейин келүү зарыл, жаныңызда өздүк күбөлүк же паспорт болушу керек. Дресс-код — расмий (официалдуу), Кыргызстандын улуттук стилистикасынын элементтери бар кийимдерди кийүүгө уруксат берилет.',
      accessNote: 'Форум «Ырыс Ордо» конгресс-холлунда өтөт. Кирүү алдын ала каттоо боюнча гана жүргүзүлөт.',
      timeLabel: 'Келүү убактысы:',
      timeText: 'саат 07:00дөн 10:00гө чейин',
      docsLabel: 'Документтер:',
      docsText: 'жаныңызда сөзсүз түрдө өздүк күбөлүк же паспорт болушу керек',
      dressLabel: 'Дресс-код:',
      dressText: 'расмий (официалдуу), Кыргызстандын улуттук стилистикасынын элементтери бар кийимдерди кийүүгө уруксат берилет'
    },
    en: {
      subtitleHeadline: 'You must arrive between 07:00 AM and 10:00 AM with your government-issued ID card or passport. Dress code is formal; clothing with elements of Kyrgyz national style is permitted.',
      accessNote: 'The forum takes place at the Yrys Ordo Congress Hall. Pre-registration is strictly required for security entry.',
      timeLabel: 'Arrival time:',
      timeText: 'from 07:00 AM to 10:00 AM',
      docsLabel: 'Documents:',
      docsText: 'you must have a valid government-issued ID or passport with you',
      dressLabel: 'Dress code:',
      dressText: 'formal / business attire; clothing with elements of Kyrgyz national style is permitted'
    }
  };
  const N = notices[lang] || notices.ru;

  const targetEndpoint = CLOSED_REGISTRATION_ENDPOINT || REGISTRATION_ENDPOINT;
  const clientJs = getRegistrationClientJs(lang, S, targetEndpoint);

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${metaTitle}</title>
  <meta name="robots" content="noindex, nofollow, noarchive">
  <meta name="googlebot" content="noindex, nofollow">
  <link rel="icon" href="/favicon.ico?v=7" sizes="any">
  <link rel="icon" type="image/png" href="/favicon.png?v=7">
  <link rel="apple-touch-icon" href="/favicon.png?v=7">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #061524;
      background-image: 
        radial-gradient(circle 800px at 50% 0%, rgba(41, 170, 225, 0.16), transparent 75%),
        radial-gradient(circle 600px at 90% 80%, rgba(29, 78, 216, 0.12), transparent 60%),
        linear-gradient(180deg, #061524 0%, #030a13 100%);
      color: #FFFFFF;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 60px;
      -webkit-font-smoothing: antialiased;
    }

    .closedreg-header {
      width: 100%;
      max-width: 800px;
      padding: 28px 24px 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .closedreg-logo {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .closedreg-logo img {
      height: 42px;
      width: auto;
      object-fit: contain;
    }

    .closedreg-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .closedreg-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(41, 170, 225, 0.12);
      border: 1px solid rgba(41, 170, 225, 0.32);
      color: #38bdf8;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    .closedreg-badge-dot {
      width: 8px;
      height: 8px;
      background: #38bdf8;
      border-radius: 50%;
      box-shadow: 0 0 10px #38bdf8;
      animation: pulse 2s infinite ease-in-out;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.15); }
    }

    .closedreg-lang-switcher {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(13, 23, 44, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }

    .closedreg-lang-switcher a {
      color: rgba(255, 255, 255, 0.55);
      text-decoration: none;
      transition: color 0.2s;
    }

    .closedreg-lang-switcher a.active,
    .closedreg-lang-switcher a:hover {
      color: #38bdf8;
    }

    .closedreg-lang-switcher span {
      color: rgba(255, 255, 255, 0.2);
    }

    .closedreg-main {
      width: 100%;
      max-width: 720px;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .muun-reg-card {
      background: linear-gradient(145deg, rgba(13, 22, 43, 0.92) 0%, rgba(8, 15, 30, 0.98) 100%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 24px;
      padding: 38px 36px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.2) inset;
      width: 100%;
      box-sizing: border-box;
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      color: #FFFFFF;
      position: relative;
    }

    @media (max-width: 640px) {
      .muun-reg-card {
        padding: 24px 18px;
        border-radius: 20px;
      }
      .closedreg-header {
        padding: 20px 16px 16px 16px;
      }
      .closedreg-badge {
        display: none;
      }
    }

    .muun-form-title {
      font-size: clamp(20px, 2.2vw, 24px);
      text-align: left;
      margin: 0 0 8px 0;
      color: #FFFFFF;
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 0.02em;
    }

    .muun-form-lead {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 0 0 24px 0;
    }

    .muun-form-lead p {
      text-align: left;
      color: rgba(224, 242, 254, 0.78);
      margin: 0;
      font-size: 13.5px;
      line-height: 1.55;
    }

    .closedreg-notice-box {
      margin-top: 14px;
      background: rgba(41, 170, 225, 0.08);
      border: 1px solid rgba(41, 170, 225, 0.28);
      border-left: 3px solid #38bdf8;
      border-radius: 14px;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }

    .closedreg-notice-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13px;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.92);
      text-align: left;
    }

    .closedreg-notice-row strong {
      color: #38bdf8;
      font-weight: 700;
    }

    .closedreg-notice-row .notice-icon {
      font-size: 16px;
      line-height: 1.3;
      flex-shrink: 0;
    }

    .field-label {
      display: block;
      margin-bottom: 6px;
      font-size: 12.5px;
      color: rgba(255, 255, 255, 0.88);
      font-weight: 600;
      letter-spacing: 0.01em;
    }

    .field-note {
      display: block;
      font-size: 11.5px;
      color: rgba(255, 255, 255, 0.55);
      margin-top: 5px;
      line-height: 1.45;
    }

    .field-note-highlight {
      color: #7dd3fc;
      background: rgba(56, 189, 248, 0.08);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 8px;
      padding: 8px 12px;
      margin-top: 8px;
      line-height: 1.5;
    }

    .form-input-dark {
      width: 100%;
      box-sizing: border-box;
      background: rgba(13, 23, 44, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #FFFFFF;
      padding: 12px 14px;
      border-radius: 11px;
      font-size: 13.5px;
      font-family: inherit;
      transition: all 0.2s ease;
      outline: none;
      color-scheme: dark;
    }

    .form-input-dark::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }

    input[type="file"].form-input-dark::file-selector-button {
      margin-right: 12px;
      border: 0;
      border-radius: 8px;
      padding: 8px 12px;
      background: rgba(56, 189, 248, 0.18);
      color: #ffffff;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
    }

    .form-input-dark:focus {
      border-color: #38bdf8;
      background: rgba(16, 29, 56, 0.95);
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.22);
    }

    select.form-input-dark {
      background-color: #0b1528;
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2338BDF8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 36px;
      cursor: pointer;
    }

    select.form-input-dark option {
      background: #0b1528;
      color: #FFFFFF;
      padding: 10px;
    }

    .submit-btn {
      width: 100%;
      padding: 15px 24px;
      border-radius: 100px;
      font-family: inherit;
      font-size: 14.5px;
      font-weight: 800;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      background: linear-gradient(135deg, #00b4d8 0%, #0077b6 50%, #1d4ed8 100%);
      color: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 8px 24px rgba(0, 180, 216, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(0, 180, 216, 0.5);
      background: linear-gradient(135deg, #24d2ff 0%, #0d84ff 100%);
    }

    .submit-btn:active {
      transform: translateY(0);
    }

    .security-memo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 11.5px;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 4px;
    }

    .pending-icon-wrap {
      font-size: 44px;
      margin-bottom: 14px;
      color: #29aae1;
    }

    .pending-title {
      font-size: 22px;
      color: #38bdf8;
      font-weight: 800;
      margin: 0 0 10px 0;
    }

    .pending-desc {
      font-size: 13.5px;
      color: rgba(255, 255, 255, 0.75);
      line-height: 1.6;
      max-width: 520px;
      margin: 0 auto 20px auto;
    }

    .pending-memo-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 18px 20px;
      text-align: left;
      max-width: 520px;
      margin: 0 auto;
    }

    .pending-memo-box h4 {
      margin: 0 0 12px 0;
      color: #fde68a;
      font-size: 13.5px;
      font-weight: 700;
    }

    .pending-memo-box ul {
      margin: 0;
      padding-left: 20px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 12.5px;
      line-height: 1.6;
    }

    .closedreg-footer {
      margin-top: 40px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      text-align: center;
    }

    .closedreg-footer a {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
    }

    .closedreg-footer a:hover {
      color: #38bdf8;
    }
  </style>
</head>
<body>

  <header class="closedreg-header">
    <a href="/${lang}/" class="closedreg-logo" aria-label="MUUN 2026">
      <img src="/assets/logo-header.png" alt="MUUN 2026" />
    </a>
    <div class="closedreg-right">
      <div class="closedreg-badge">
        <span class="closedreg-badge-dot"></span>
        <span>${badgeText}</span>
      </div>
      <div class="closedreg-lang-switcher">
        <a href="/ru/closedreg" class="${lang === 'ru' ? 'active' : ''}">RU</a>
        <span>|</span>
        <a href="/ky/closedreg" class="${lang === 'ky' ? 'active' : ''}">KY</a>
        <span>|</span>
        <a href="/en/closedreg" class="${lang === 'en' ? 'active' : ''}">EN</a>
      </div>
    </div>
  </header>

  <main class="closedreg-main">
    <div class="muun-reg-card">
      
      <!-- STEP 1: Registration Form (Only Individual, No Tab Buttons) -->
      <div id="reg-step-form" style="display:block;">
        <h3 class="muun-form-title">
          ${titleText}
        </h3>
        <div class="muun-form-lead">
          <p>
            ${N.accessNote}
          </p>
          
          <div class="closedreg-notice-box">
            <div class="closedreg-notice-row">
              <span class="notice-icon">⏰</span>
              <div>
                <strong>${N.timeLabel}</strong> ${N.timeText}.
              </div>
            </div>
            <div class="closedreg-notice-row">
              <span class="notice-icon">🪪</span>
              <div>
                <strong>${N.docsLabel}</strong> ${N.docsText}.
              </div>
            </div>
            <div class="closedreg-notice-row">
              <span class="notice-icon">👔</span>
              <div>
                <strong>${N.dressLabel}</strong> ${N.dressText}.
              </div>
            </div>
          </div>
        </div>

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
                <label class="field-label">${S['reg.dob']} *</label>
                <input type="date" name="birthDate" required class="form-input-dark" min="1920-01-01" max="2026-10-13" />
                <span class="field-note">${S['reg.dob_note']}</span>
              </div>
              <div>
                <label class="field-label">${S['reg.email']} *</label>
                <input type="email" name="email" required class="form-input-dark" autocomplete="email" placeholder="example@gmail.com" />
                <span class="field-note">${S['reg.email_note']}</span>
              </div>
            </div>

            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label class="field-label">${S['reg.phone']} *</label>
                <input type="tel" name="phone" required class="form-input-dark" autocomplete="tel" placeholder="+996 700 123 456" />
              </div>
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
            </div>

            <div>
              <label class="field-label" for="reg-organization">${S['reg.school_org_label']} <span id="reg-org-star">*</span></label>
              <input type="text" id="reg-organization" name="organization" required class="form-input-dark" placeholder="${S['reg.school_org_ph']}" />
            </div>

            <div>
              <label class="field-label" for="reg-resume">${S['reg.resume']}</label>
              <input type="file" id="reg-resume" name="resume" class="form-input-dark" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png" />
              <div class="field-note field-note-highlight">
                💡 ${resumeHint}
              </div>
            </div>

            <button type="submit" id="reg-submit-btn-indiv" class="submit-btn">
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
            <li><strong>${N.timeLabel}</strong> ${N.timeText}.</li>
            <li><strong>${N.docsLabel}</strong> ${N.docsText}.</li>
            <li><strong>${N.dressLabel}</strong> ${N.dressText}.</li>
            <li>${S['reg.memo_prohibited']}</li>
          </ul>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; margin-top:20px;">
          <button type="button" onclick="window.resetRegForm()" class="submit-btn" style="width:auto; padding:12px 36px;">
            ${resetLabel}
          </button>
        </div>
      </div>

    </div>

    <footer class="closedreg-footer">
      <p>© 2026 MUUN. <a href="/${lang}/">muun.kg</a></p>
    </footer>
  </main>

  <script>
    ${clientJs}

    document.addEventListener('DOMContentLoaded', function() {
      if (typeof window.switchCitizenship === 'function') {
        window.switchCitizenship('kg');
      }
    });
  </script>
</body>
</html>`;
}

export function buildClosedRegPages() {
  const languages = ['ru', 'ky', 'en'];
  for (const lang of languages) {
    const html = buildClosedRegHtml(lang);
    const langDir = path.join('dist', lang, 'closedreg');
    fs.mkdirSync(langDir, { recursive: true });
    fs.writeFileSync(path.join(langDir, 'index.html'), html, 'utf8');
    fs.writeFileSync(path.join('dist', lang, 'closedreg.html'), html, 'utf8');

    if (lang === 'ru') {
      // Default closedreg at root /closedreg and /closedreg/
      const rootDir = path.join('dist', 'closedreg');
      fs.mkdirSync(rootDir, { recursive: true });
      fs.writeFileSync(path.join(rootDir, 'index.html'), html, 'utf8');
      fs.writeFileSync(path.join('dist', 'closedreg.html'), html, 'utf8');
    }
  }
  console.log('✓ dist/closedreg (закрытая регистрация участников, без публичных ссылок)');
}

if (process.argv[1] && process.argv[1].includes('build_closedreg')) {
  buildClosedRegPages();
}
