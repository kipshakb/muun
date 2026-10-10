import fs from 'fs';

const i18n = JSON.parse(fs.readFileSync('src/i18n.json', 'utf8'));

export function renderParticipantModal(lang) {
  const d = i18n.strings[lang] || i18n.strings.ru;
  const t = (k) => d[k] || '';

  return `
  <!-- ==================== PARTICIPANT MODAL (СТАТЬ УЧАСТНИКОМ) ==================== -->
  <div id="modal-participant" class="muun-part-modal-overlay" onclick="if(event.target===this) window.closeParticipantModal();">
    <div class="muun-part-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="muun-part-title">
      <button class="muun-part-modal-close" aria-label="Close" onclick="window.closeParticipantModal();">&times;</button>

      <!-- LEFT SIDEBAR -->
      <aside class="muun-part-sidebar">
        <div class="muun-part-sidebar-top">
          <img src="/assets/logo-header.png" alt="MUUN26" class="muun-part-sidebar-logo" />
          <div class="muun-part-badges">
            <span class="muun-part-badge muun-part-badge--cyan">📅 ${t('mod.dates')}</span>
            <span class="muun-part-badge muun-part-badge--ghost">📍 ${t('mod.city')}</span>
          </div>
          <h2 id="muun-part-title" class="muun-part-sidebar-title">
            ${t('mod.title_part1')}<br/>
            <span class="muun-part-title-cyan">${t('mod.title_part2')}</span>
          </h2>
          <ul class="muun-part-features">
            <li><span class="muun-part-feat-icon">👥</span> <span>${t('mod.feat1')}</span></li>
            <li><span class="muun-part-feat-icon">🤝</span> <span>${t('mod.feat2')}</span></li>
            <li><span class="muun-part-feat-icon">📈</span> <span>${t('mod.feat3')}</span></li>
            <li><span class="muun-part-feat-icon">💡</span> <span>${t('mod.feat4')}</span></li>
          </ul>
        </div>
        <div class="muun-part-sidebar-bottom">
          <p class="muun-part-slogan">${t('mod.footer')}</p>
        </div>
      </aside>

      <!-- RIGHT MULTI-STEP CONTENT -->
      <main class="muun-part-main">
        <!-- STEPPER INDICATOR -->
        <header class="muun-part-stepper">
          <div class="muun-part-stepper-inner">
            <!-- Step 1 -->
            <div id="p-step-item-1" class="muun-part-step-item is-active">
              <div id="p-step-dot-1" class="muun-part-step-dot is-active">1</div>
              <span class="muun-part-step-lbl">${t('p_step1')}</span>
            </div>
            <div id="p-step-line-1" class="muun-part-step-line"></div>
            <!-- Step 2 -->
            <div id="p-step-item-2" class="muun-part-step-item">
              <div id="p-step-dot-2" class="muun-part-step-dot">2</div>
              <span class="muun-part-step-lbl">${t('p_step2')}</span>
            </div>
            <div id="p-step-line-2" class="muun-part-step-line"></div>
            <!-- Step 3 -->
            <div id="p-step-item-3" class="muun-part-step-item">
              <div id="p-step-dot-3" class="muun-part-step-dot">3</div>
              <span class="muun-part-step-lbl">${t('p_step3')}</span>
            </div>
          </div>
        </header>

        <!-- SCREEN 1: УСЛОВИЯ УЧАСТИЯ -->
        <div id="part-step-terms" class="muun-part-screen">
          <h3 class="muun-part-screen-title">${t('p_terms_title')}</h3>
          <p class="muun-part-screen-sub">${t('p_terms_subtitle')}</p>

          <div class="muun-part-cards-grid">
            <div class="muun-part-card">
              <div class="muun-part-card-icon muun-icon-blue">🎁</div>
              <div class="muun-part-card-body">
                <h4 class="muun-part-card-title">${t('p_term_card1_t')}</h4>
                <p class="muun-part-card-desc">${t('p_term_card1_d')}</p>
              </div>
            </div>
            <div class="muun-part-card">
              <div class="muun-part-card-icon muun-icon-amber">📍</div>
              <div class="muun-part-card-body">
                <h4 class="muun-part-card-title">${t('p_term_card2_t')}</h4>
                <p class="muun-part-card-desc">${t('p_term_card2_d')}</p>
              </div>
            </div>
            <div class="muun-part-card">
              <div class="muun-part-card-icon muun-icon-indigo">🛠️</div>
              <div class="muun-part-card-body">
                <h4 class="muun-part-card-title">${t('p_term_card3_t')}</h4>
                <p class="muun-part-card-desc">${t('p_term_card3_d')}</p>
              </div>
            </div>
            <div class="muun-part-card">
              <div class="muun-part-card-icon muun-icon-green">🤝</div>
              <div class="muun-part-card-body">
                <h4 class="muun-part-card-title">${t('p_term_card4_t')}</h4>
                <p class="muun-part-card-desc">${t('p_term_card4_d')}</p>
              </div>
            </div>
          </div>

          <!-- AGREEMENT CHECKBOX -->
          <div id="part-terms-box" class="muun-part-agree-box">
            <label class="muun-part-agree-label">
              <input type="checkbox" id="part-terms-agree" onchange="window.togglePartTerms(this.checked)" class="muun-part-checkbox" />
              <span>${t('p_terms_agree_label')} *</span>
            </label>
          </div>

          <button type="button" id="part-btn-to-form" disabled onclick="window.goToPartStep(2)" class="muun-part-cta-btn">
            ${t('p_btn_continue')} &rarr;
          </button>
        </div>

        <!-- SCREEN 2: ФОРМА ЗАЯВКИ -->
        <div id="part-step-form" class="muun-part-screen" style="display:none;">
          <button type="button" onclick="window.goToPartStep(1)" class="muun-part-back-btn">
            &larr; ${t('p_btn_back_to_terms')}
          </button>

          <h3 class="muun-part-screen-title">${t('p_form_title')}</h3>
          <p class="muun-part-screen-sub">${t('p_form_subtitle')}</p>

          <form id="participant-form" onsubmit="window.submitParticipantForm(event, this)" class="muun-part-form">
            <!-- SECTION 1: Company -->
            <fieldset class="muun-part-fieldset">
              <legend class="muun-part-legend">${t('p_sec_company')}</legend>
              <div class="muun-part-field">
                <label class="muun-part-lbl">${t('p_org_name')}</label>
                <input type="text" required name="org" class="muun-part-input" />
              </div>
              <div class="muun-part-row">
                <div class="muun-part-field">
                  <label class="muun-part-lbl">${t('p_sector')}</label>
                  <select required name="sector" class="muun-part-input muun-part-select">
                    <option value="" disabled selected>${t('p_sector_ph')}</option>
                    <option value="IT">IT & Технологии</option>
                    <option value="Education">Образование и наука</option>
                    <option value="Finance">Банки и финансы</option>
                    <option value="Production">Производство и промышленность</option>
                    <option value="Gov">Государственный сектор</option>
                    <option value="International">Международная организация</option>
                    <option value="Creative">Креативная экономика</option>
                    <option value="Other">Другое</option>
                  </select>
                </div>
                <div class="muun-part-field">
                  <label class="muun-part-lbl">${t('p_website')}</label>
                  <input type="url" name="website" placeholder="https://" class="muun-part-input" />
                </div>
              </div>
              <div class="muun-part-row">
                <div class="muun-part-field">
                  <label class="muun-part-lbl">${t('p_country')}</label>
                  <select required name="country" class="muun-part-input muun-part-select">
                    <option value="" disabled selected>${t('p_country_ph')}</option>
                    <option value="Kyrgyzstan">Кыргызстан</option>
                    <option value="Kazakhstan">Казахстан</option>
                    <option value="Uzbekistan">Узбекистан</option>
                    <option value="Other">Другая страна</option>
                  </select>
                </div>
                <div class="muun-part-field">
                  <label class="muun-part-lbl">${t('p_city')}</label>
                  <input type="text" required name="city" class="muun-part-input" />
                </div>
              </div>
            </fieldset>

            <!-- SECTION 2: Contact -->
            <fieldset class="muun-part-fieldset">
              <legend class="muun-part-legend">${t('p_sec_contact')}</legend>
              <div class="muun-part-row">
                <div class="muun-part-field">
                  <label class="muun-part-lbl">${t('p_fio')}</label>
                  <input type="text" required name="fio" class="muun-part-input" />
                </div>
                <div class="muun-part-field">
                  <label class="muun-part-lbl">${t('p_position')}</label>
                  <input type="text" required name="position" class="muun-part-input" />
                </div>
              </div>
              <div class="muun-part-row">
                <div class="muun-part-field">
                  <label class="muun-part-lbl">${t('p_phone')}</label>
                  <input type="tel" required name="phone" placeholder="+996 " class="muun-part-input" />
                </div>
                <div class="muun-part-field">
                  <label class="muun-part-lbl">${t('p_email')}</label>
                  <input type="email" required name="email" class="muun-part-input" />
                </div>
              </div>
            </fieldset>

            <!-- SECTION 3: Interests -->
            <fieldset class="muun-part-fieldset">
              <legend class="muun-part-legend">${t('p_interests')}</legend>
              <p class="muun-part-field-hint">${t('p_interests_desc')}</p>
              <div class="muun-part-int-grid">
                <label class="muun-part-int-card">
                  <span>🏪 ${t('p_int_stand')}</span>
                  <input type="checkbox" name="interests" value="stand" class="muun-part-checkbox" />
                </label>
                <label class="muun-part-int-card">
                  <span>👥 ${t('p_int_hr')}</span>
                  <input type="checkbox" name="interests" value="hr" class="muun-part-checkbox" />
                </label>
                <label class="muun-part-int-card">
                  <span>🎙️ ${t('p_int_speaker')}</span>
                  <input type="checkbox" name="interests" value="speaker" class="muun-part-checkbox" />
                </label>
                <label class="muun-part-int-card">
                  <span>🤝 ${t('p_int_partner')}</span>
                  <input type="checkbox" name="interests" value="partner" class="muun-part-checkbox" />
                </label>
                <label class="muun-part-int-card">
                  <span>🏫 ${t('p_int_masterclass')}</span>
                  <input type="checkbox" name="interests" value="masterclass" class="muun-part-checkbox" />
                </label>
                <label class="muun-part-int-card">
                  <span>📢 ${t('p_int_brand')}</span>
                  <input type="checkbox" name="interests" value="brand" class="muun-part-checkbox" />
                </label>
                <label class="muun-part-int-card muun-part-int-card--full">
                  <span class="muun-part-other-wrap">
                    <span>💬 ${t('p_int_other')}</span>
                    <input type="text" name="other_interest" placeholder="${t('p_other_ph')}" class="muun-part-other-input" />
                  </span>
                  <input type="checkbox" name="interests" value="other" class="muun-part-checkbox" />
                </label>
              </div>
            </fieldset>

            <!-- SECTION 4: Extra & Sponsorship -->
            <fieldset class="muun-part-fieldset">
              <div class="muun-part-sponsor-box">
                <label class="muun-part-sponsor-label">
                  <input type="checkbox" name="request_sponsor_file" value="yes" class="muun-part-checkbox" />
                  <span>${t('p_want_sponsor_file')}</span>
                </label>
              </div>
              <div class="muun-part-field">
                <label class="muun-part-lbl">${t('p_sec_extra')}</label>
                <textarea rows="2" name="comment" placeholder="${t('p_comment')}" class="muun-part-input muun-part-textarea"></textarea>
              </div>
              <div class="muun-part-field" style="margin-top:8px;">
                <label class="muun-part-privacy-label">
                  <input type="checkbox" required class="muun-part-checkbox" />
                  <span>${t('reg.privacy')} *</span>
                </label>
              </div>
            </fieldset>

            <button type="submit" class="muun-part-cta-btn">
              ${t('p_submit')} &rarr;
            </button>
          </form>
        </div>

        <!-- SCREEN 3: ПОДТВЕРЖДЕНИЕ -->
        <div id="part-step-success" class="muun-part-screen muun-part-screen--success" style="display:none;">
          <div class="muun-part-success-icon">✓</div>
          <h3 class="muun-part-screen-title">${t('p_success_title')}</h3>
          <p class="muun-part-success-desc">${t('p_success_desc')}</p>
          <button type="button" onclick="window.closeParticipantModal()" class="muun-part-cta-btn muun-part-cta-btn--auto">
            ${t('p_close_btn')}
          </button>
        </div>
      </main>
    </div>
  </div>

  <style>
    /* PARTICIPANT MODAL - DARK GLASS THEME */
    .muun-part-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999999;
      display: none;
      align-items: center;
      justify-content: center;
      background: rgba(3, 8, 18, 0.85);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      padding: 16px;
      box-sizing: border-box;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .muun-part-modal-overlay.is-open {
      display: flex !important;
      opacity: 1 !important;
    }
    .muun-part-modal-dialog {
      width: 100%;
      max-width: 1040px;
      max-height: 92vh;
      background: linear-gradient(135deg, rgba(12, 23, 46, 0.96) 0%, rgba(6, 13, 27, 0.98) 100%);
      border: 1px solid rgba(41, 170, 225, 0.32);
      box-shadow: 0 30px 90px rgba(0, 0, 0, 0.85), 0 0 40px rgba(41, 170, 225, 0.2);
      border-radius: 24px;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      position: relative;
      font-family: 'Inter', sans-serif;
      color: #ffffff;
    }
    .muun-part-modal-close {
      position: absolute;
      top: 16px;
      right: 18px;
      z-index: 30;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.16);
      color: #ffffff;
      font-size: 20px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .muun-part-modal-close:hover {
      background: rgba(41, 170, 225, 0.25);
      border-color: #29AAE1;
      transform: scale(1.08);
    }
    /* LEFT SIDEBAR */
    .muun-part-sidebar {
      width: 350px;
      min-width: 350px;
      background: linear-gradient(180deg, rgba(8, 17, 36, 0.98) 0%, rgba(4, 9, 20, 0.99) 100%);
      padding: 36px 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-right: 1px solid rgba(41, 170, 225, 0.18);
      box-sizing: border-box;
    }
    .muun-part-sidebar-logo {
      height: 38px;
      width: auto;
      max-width: 175px;
      object-fit: contain;
      margin-bottom: 22px;
      display: block;
    }
    .muun-part-badges {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 22px;
    }
    .muun-part-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 100px;
      font-size: 11.5px;
      font-weight: 600;
      width: fit-content;
    }
    .muun-part-badge--cyan {
      background: rgba(41, 170, 225, 0.12);
      border: 1px solid rgba(41, 170, 225, 0.35);
      color: #29AAE1;
    }
    .muun-part-badge--ghost {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1;
    }
    .muun-part-sidebar-title {
      font-size: 22px;
      font-weight: 800;
      line-height: 1.25;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      margin: 0 0 24px 0;
      color: #ffffff;
    }
    .muun-part-title-cyan {
      color: #29AAE1;
      text-shadow: 0 0 20px rgba(41, 170, 225, 0.45);
    }
    .muun-part-features {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .muun-part-features li {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: #e2e8f0;
      letter-spacing: 0.03em;
    }
    .muun-part-feat-icon {
      font-size: 18px;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: rgba(41, 170, 225, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .muun-part-slogan {
      font-size: 11px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin: 30px 0 0 0;
    }
    /* RIGHT CONTENT */
    .muun-part-main {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      background: transparent;
      box-sizing: border-box;
    }
    .muun-part-stepper {
      background: rgba(8, 17, 34, 0.94);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 20px 32px 14px;
      border-bottom: 1px solid rgba(41, 170, 225, 0.18);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .muun-part-stepper-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      max-width: 480px;
      margin: 0 auto;
    }
    .muun-part-step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      flex: 1;
    }
    .muun-part-step-dot {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    .muun-part-step-dot.is-active {
      background: #29AAE1;
      color: #ffffff;
      border-color: #29AAE1;
      box-shadow: 0 0 16px rgba(41, 170, 225, 0.7);
    }
    .muun-part-step-dot.is-done {
      background: #10b981;
      color: #ffffff;
      border-color: #10b981;
    }
    .muun-part-step-lbl {
      font-size: 10.5px;
      color: #94a3b8;
      font-weight: 600;
      white-space: nowrap;
      letter-spacing: 0.02em;
    }
    .muun-part-step-item.is-active .muun-part-step-lbl {
      color: #ffffff;
    }
    .muun-part-step-line {
      flex: 1;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      margin-top: -14px;
      transition: all 0.3s ease;
    }
    .muun-part-step-line.is-done {
      background: #10b981;
    }
    /* SCREENS */
    .muun-part-screen {
      padding: 28px 36px 36px;
      color: #ffffff;
      box-sizing: border-box;
    }
    .muun-part-screen-title {
      font-size: 22px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      margin: 0 0 8px 0;
      color: #ffffff;
      line-height: 1.25;
    }
    .muun-part-screen-sub {
      color: #94a3b8;
      font-size: 13.5px;
      line-height: 1.55;
      margin: 0 0 22px 0;
    }
    /* STEP 1 CARDS */
    .muun-part-cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      margin-bottom: 22px;
    }
    .muun-part-card {
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 14px 16px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
      transition: all 0.25s ease;
    }
    .muun-part-card:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(41, 170, 225, 0.3);
      transform: translateY(-1px);
    }
    .muun-part-card-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    .muun-icon-blue { background: rgba(37, 99, 235, 0.2); border: 1px solid rgba(37, 99, 235, 0.35); }
    .muun-icon-amber { background: rgba(217, 119, 6, 0.2); border: 1px solid rgba(217, 119, 6, 0.35); }
    .muun-icon-indigo { background: rgba(79, 70, 229, 0.2); border: 1px solid rgba(79, 70, 229, 0.35); }
    .muun-icon-green { background: rgba(22, 163, 74, 0.2); border: 1px solid rgba(22, 163, 74, 0.35); }
    .muun-part-card-body {
      flex: 1;
    }
    .muun-part-card-title {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 4px 0;
    }
    .muun-part-card-desc {
      font-size: 12.5px;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0;
    }
    /* AGREEMENT BOX */
    .muun-part-agree-box {
      background: rgba(41, 170, 225, 0.06);
      border: 1px solid rgba(41, 170, 225, 0.25);
      border-radius: 14px;
      padding: 14px 18px;
      margin-bottom: 22px;
      transition: all 0.2s ease;
    }
    .muun-part-agree-label {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;
      user-select: none;
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
      line-height: 1.45;
    }
    /* FORM INPUTS & ROWS */
    .muun-part-back-btn {
      background: none;
      border: none;
      color: #29AAE1;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 16px;
      padding: 0;
      transition: 0.2s;
    }
    .muun-part-back-btn:hover {
      text-decoration: underline;
    }
    .muun-part-form {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    .muun-part-fieldset {
      border: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 18px;
    }
    .muun-part-fieldset:first-of-type {
      border-top: none;
      padding-top: 0;
    }
    .muun-part-legend {
      font-size: 14.5px;
      font-weight: 700;
      color: #29AAE1;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 8px;
      padding: 0;
    }
    .muun-part-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .muun-part-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .muun-part-lbl {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.85);
    }
    .muun-part-field-hint {
      font-size: 12px;
      color: #94a3b8;
      margin: -4px 0 8px 0;
    }
    .muun-part-input {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      font-family: inherit;
      font-size: 13.5px;
      color: #ffffff;
      transition: all 0.2s ease;
    }
    .muun-part-input:focus {
      outline: none;
      border-color: #29AAE1;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 0 3px rgba(41, 170, 225, 0.25);
    }
    .muun-part-select {
      cursor: pointer;
    }
    .muun-part-select option {
      background: #091326;
      color: #ffffff;
    }
    .muun-part-textarea {
      resize: vertical;
      min-height: 60px;
    }
    /* INTERESTS GRID */
    .muun-part-int-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .muun-part-int-card {
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 11px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      font-size: 12.5px;
      font-weight: 500;
      color: #e2e8f0;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .muun-part-int-card:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(41, 170, 225, 0.3);
    }
    .muun-part-int-card:has(input:checked) {
      background: rgba(41, 170, 225, 0.12);
      border-color: #29AAE1;
      color: #ffffff;
    }
    .muun-part-int-card--full {
      grid-column: span 2;
    }
    .muun-part-other-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }
    .muun-part-other-input {
      flex: 1;
      background: none;
      border: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.25);
      color: #ffffff;
      font-size: 12.5px;
      outline: none;
      padding: 2px 4px;
    }
    .muun-part-other-input:focus {
      border-bottom-color: #29AAE1;
    }
    .muun-part-checkbox {
      width: 18px;
      height: 18px;
      accent-color: #29AAE1;
      cursor: pointer;
      flex-shrink: 0;
    }
    /* SPONSOR & PRIVACY */
    .muun-part-sponsor-box {
      background: rgba(41, 170, 225, 0.06);
      border: 1px solid rgba(41, 170, 225, 0.2);
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 6px;
    }
    .muun-part-sponsor-label, .muun-part-privacy-label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 12.5px;
      color: #cbd5e1;
      font-weight: 500;
      cursor: pointer;
      line-height: 1.45;
    }
    /* CTA BUTTON */
    .muun-part-cta-btn {
      width: 100%;
      box-sizing: border-box;
      padding: 16px 24px;
      border-radius: 100px;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border: none;
      cursor: pointer;
      transition: all 0.25s ease;
      background: linear-gradient(135deg, #29AAE1 0%, #0077EE 100%);
      color: #ffffff;
      box-shadow: 0 4px 20px rgba(41, 170, 225, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .muun-part-cta-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(41, 170, 225, 0.6);
    }
    .muun-part-cta-btn:disabled {
      background: rgba(255, 255, 255, 0.08) !important;
      color: rgba(255, 255, 255, 0.3) !important;
      cursor: not-allowed !important;
      box-shadow: none !important;
      opacity: 0.6 !important;
    }
    .muun-part-cta-btn--auto {
      width: auto !important;
      padding: 14px 38px !important;
      margin: 0 auto;
    }
    /* SUCCESS SCREEN */
    .muun-part-screen--success {
      text-align: center;
      padding: 60px 36px;
    }
    .muun-part-success-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #10b981;
      font-size: 36px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 22px;
      box-shadow: 0 0 35px rgba(16, 185, 129, 0.35);
    }
    .muun-part-success-desc {
      font-size: 14px;
      color: #94a3b8;
      max-width: 460px;
      margin: 0 auto 30px;
      line-height: 1.6;
    }
    /* RESPONSIVE */
    @media (max-width: 900px) {
      .muun-part-sidebar {
        display: none !important;
      }
      .muun-part-row {
        grid-template-columns: 1fr;
      }
      .muun-part-int-grid {
        grid-template-columns: 1fr;
      }
      .muun-part-int-card--full {
        grid-column: span 1;
      }
      .muun-part-screen {
        padding: 24px 20px 28px;
      }
      .muun-part-stepper {
        padding: 16px 20px 12px;
      }
    }
  </style>

  <script>
    (function() {
      window.openParticipantModal = function() {
        window.goToPartStep(1);
        var chk = document.getElementById('part-terms-agree');
        if (chk) {
          chk.checked = false;
          window.togglePartTerms(false);
        }
        var m = document.getElementById('modal-participant');
        if (m) {
          m.classList.add('is-open');
          document.body.style.overflow = 'hidden';
        }
      };

      window.closeParticipantModal = function() {
        var m = document.getElementById('modal-participant');
        if (m) {
          m.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      };

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          window.closeParticipantModal();
        }
      });

      window.goToPartStep = function(step) {
        var s1 = document.getElementById('part-step-terms');
        var s2 = document.getElementById('part-step-form');
        var s3 = document.getElementById('part-step-success');
        if (s1) s1.style.display = (step === 1) ? 'block' : 'none';
        if (s2) s2.style.display = (step === 2) ? 'block' : 'none';
        if (s3) s3.style.display = (step === 3) ? 'block' : 'none';
        window.updatePartStepsUI(step);
        var main = document.querySelector('.muun-part-main');
        if (main) main.scrollTop = 0;
      };

      window.togglePartTerms = function(isChecked) {
        var btn = document.getElementById('part-btn-to-form');
        var box = document.getElementById('part-terms-box');
        if (btn) {
          btn.disabled = !isChecked;
          if (box) {
            box.style.borderColor = isChecked ? '#29AAE1' : 'rgba(41, 170, 225, 0.25)';
          }
        }
      };

      window.updatePartStepsUI = function(activeStep) {
        var dot1 = document.getElementById('p-step-dot-1');
        var dot2 = document.getElementById('p-step-dot-2');
        var dot3 = document.getElementById('p-step-dot-3');
        var line1 = document.getElementById('p-step-line-1');
        var line2 = document.getElementById('p-step-line-2');
        var itm1 = document.getElementById('p-step-item-1');
        var itm2 = document.getElementById('p-step-item-2');
        var itm3 = document.getElementById('p-step-item-3');
        if (!dot1 || !dot2 || !dot3) return;

        // Reset
        [dot1, dot2, dot3].forEach(function(d) {
          d.classList.remove('is-active', 'is-done');
        });
        [itm1, itm2, itm3].forEach(function(it) {
          if (it) it.classList.remove('is-active', 'is-done');
        });
        if (line1) line1.classList.remove('is-done');
        if (line2) line2.classList.remove('is-done');

        if (activeStep === 1) {
          dot1.classList.add('is-active');
          if (itm1) itm1.classList.add('is-active');
          dot1.textContent = '1';
          dot2.textContent = '2';
          dot3.textContent = '3';
        } else if (activeStep === 2) {
          dot1.classList.add('is-done');
          if (itm1) itm1.classList.add('is-done');
          dot1.textContent = '✓';
          dot2.classList.add('is-active');
          if (itm2) itm2.classList.add('is-active');
          dot2.textContent = '2';
          dot3.textContent = '3';
          if (line1) line1.classList.add('is-done');
        } else if (activeStep === 3) {
          dot1.classList.add('is-done');
          dot2.classList.add('is-done');
          dot3.classList.add('is-active', 'is-done');
          if (itm1) itm1.classList.add('is-done');
          if (itm2) itm2.classList.add('is-done');
          if (itm3) itm3.classList.add('is-done');
          dot1.textContent = '✓';
          dot2.textContent = '✓';
          dot3.textContent = '✓';
          if (line1) line1.classList.add('is-done');
          if (line2) line2.classList.add('is-done');
        }
      };

      window.submitParticipantForm = function(event, form) {
        event.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var origText = btn ? btn.innerHTML : '';
        if (btn) {
          btn.innerHTML = '...';
          btn.disabled = true;
        }

        var formData = new FormData(form);
        var interestsArray = formData.getAll('interests');
        var otherInt = formData.get('other_interest');
        if (interestsArray.length > 0 || otherInt) {
          var combined = interestsArray;
          if (otherInt && combined.indexOf('other') !== -1) {
            combined = combined.filter(function(v) { return v !== 'other'; });
            combined.push(otherInt);
          }
          formData.delete('interests');
          if (combined.length > 0) {
            formData.append('interests', combined.join(', '));
          }
        }
        var urlEncodedData = new URLSearchParams(formData).toString();

        fetch('https://script.google.com/macros/s/AKfycbyVnRhf4OSgB5H3GZ4wutFhdt2A8rIxkf010ailJrdeCBxJzv2HsX-oJfkkozxJI3YNYQ/exec', {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: urlEncodedData
        })
        .then(function() {
          form.reset();
          window.goToPartStep(3);
        })
        .catch(function(err) {
          alert('Error submitting form');
          console.error(err);
        })
        .finally(function() {
          if (btn) {
            btn.innerHTML = origText;
            btn.disabled = false;
          }
        });
      };
    })();
  </script>
  `;
}
