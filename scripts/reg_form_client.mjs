import fs from 'fs';
import { REGISTRATION_ENDPOINT } from './form_endpoints.mjs';

let i18nData = null;
function getI18n() {
  if (!i18nData) {
    i18nData = JSON.parse(fs.readFileSync('src/i18n.json', 'utf8'));
  }
  return i18nData;
}

export function getRegistrationClientJs(lang, providedStrings, customEndpoint = null) {
  const i18n = getI18n();
  const t = providedStrings || i18n.strings[lang] || i18n.strings.ru;
  const endpoint = customEndpoint || REGISTRATION_ENDPOINT;

  const regMsg = JSON.stringify({
    cyr: t['reg.err_cyr'] || 'Укажите полностью, без сокращений',
    lat: t['reg.err_lat'] || 'Используйте латинские буквы',
    pin: t['reg.err_pin'] || 'ПИН должен состоять из 14 цифр',
    passport: t['reg.err_passport'] || 'Укажите номер паспорта',
    resumeType: t['reg.err_resume_type'] || 'Допустимые форматы: PDF, DOC, DOCX, JPG, PNG',
    resumeSize: t['reg.err_resume_size'] || 'Размер файла не должен превышать 10 МБ',
    sending: t['reg.sending'] || '⏳ Отправка...'
  });

  return `
    // Registration Tab Switcher & Submission Logic
    var REG_MSG = ${regMsg};

    function isFullPersonName(value) {
      var v = String(value || '').trim().replace(/\\s+/g, ' ');
      if (!v || v.indexOf('.') !== -1) return false;
      var parts = v.split(/[\\s-]+/);
      if (!parts.length) return false;
      for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        if (part.length < 2) return false;
        var cyr = /^[А-ЯЁа-яёҢңӨөҮү]+$/.test(part);
        var lat = /^[A-Za-z]+(?:['’][A-Za-z]+)*$/.test(part);
        if (!cyr && !lat) return false;
      }
      return true;
    }

    function isLatinPassportName(value) {
      var v = String(value || '').trim().replace(/\\s+/g, ' ');
      if (!v) return false;
      var words = v.split(' ');
      for (var i = 0; i < words.length; i++) {
        if (words[i].length < 2 || !/^[A-Za-z]+(?:['-][A-Za-z]+)*$/.test(words[i])) return false;
      }
      return true;
    }

    function markRegInvalid(input, message) {
      if (!input) return;
      input.setCustomValidity(message || '');
      input.reportValidity();
    }

    function setPanelState(panel, active) {
      if (!panel) return;
      panel.style.display = active ? 'flex' : 'none';
      panel.querySelectorAll('input, select, textarea').forEach(function (inp) {
        inp.disabled = !active;
        if (inp.name === 'middleName') {
          inp.removeAttribute('required');
          return;
        }
        if (active) inp.setAttribute('required', '');
        else inp.removeAttribute('required');
      });
    }

    function setStreamEnabled(container, enabled) {
      if (!container) return;
      container.querySelectorAll('input, select, textarea').forEach(function (inp) {
        if (inp.closest && inp.closest('[data-citizen-panel]')) return;
        inp.disabled = !enabled;
        if (inp.name === 'middleName' || inp.name === 'resume') {
          inp.removeAttribute('required');
          return;
        }
        if (enabled) inp.setAttribute('required', '');
        else inp.removeAttribute('required');
      });
    }

    function setOrganizationRequired(required) {
      var input = document.getElementById('reg-organization');
      var star = document.getElementById('reg-org-star');
      if (input) {
        if (required) input.setAttribute('required', '');
        else input.removeAttribute('required');
      }
      if (star) star.hidden = !required;
    }

    window.switchCitizenship = function (kind) {
      var isKg = kind !== 'foreign';
      setPanelState(document.getElementById('citizen-kg'), isKg);
      setPanelState(document.getElementById('citizen-foreign'), !isKg);
      setOrganizationRequired(isKg);
    };

    window.switchRegTab = function(tab) {
      var btnIndiv = document.getElementById('tab-btn-indiv');
      var btnGroup = document.getElementById('tab-btn-group');
      var streamIndiv = document.getElementById('stream-indiv-fields');
      var streamGroup = document.getElementById('stream-group-fields');
      var typeInput = document.getElementById('regTypeInput');
      var indiv = tab !== 'group';

      if (btnIndiv) btnIndiv.classList.toggle('active', indiv);
      if (btnGroup) btnGroup.classList.toggle('active', !indiv);
      if (streamIndiv) streamIndiv.style.display = indiv ? 'flex' : 'none';
      if (streamGroup) streamGroup.style.display = indiv ? 'none' : 'flex';
      if (typeInput) typeInput.value = indiv ? 'individual' : 'group';

      if (indiv) {
        setStreamEnabled(streamGroup, false);
        setStreamEnabled(streamIndiv, true);
        var sel = document.getElementById('citizenship-select');
        window.switchCitizenship(sel ? sel.value : 'kg');
      } else {
        setStreamEnabled(streamIndiv, false);
        setPanelState(document.getElementById('citizen-kg'), false);
        setPanelState(document.getElementById('citizen-foreign'), false);
        setStreamEnabled(streamGroup, true);
      }
    };

    function resumeProblem(input) {
      if (!input || !input.files || !input.files.length) return '';
      var file = input.files[0];
      var name = String(file.name || '').toLowerCase();
      var dot = name.lastIndexOf('.');
      var ext = dot >= 0 ? name.slice(dot + 1) : '';
      var allowed = { pdf: 1, doc: 1, docx: 1, jpg: 1, jpeg: 1, png: 1 };
      if (!allowed[ext]) return REG_MSG.resumeType;
      if (file.size > 10 * 1024 * 1024) return REG_MSG.resumeSize;
      return '';
    }

    function validateVisitorNames(form, regType) {
      if (regType === 'group') return true;
      var resume = document.querySelector('#reg-resume');
      var resumeError = resumeProblem(resume);
      if (resumeError) { markRegInvalid(resume, resumeError); return false; }
      var kindInput = document.getElementById('citizenship-select');
      var kind = kindInput ? kindInput.value : 'kg';
      if (kind === 'foreign') {
        var box = document.getElementById('citizen-foreign');
        var last = box.querySelector('[name="lastName"]');
        var first = box.querySelector('[name="firstName"]');
        var passport = box.querySelector('[name="passport"]');
        if (!isLatinPassportName(last.value)) { markRegInvalid(last, REG_MSG.lat); return false; }
        if (!isLatinPassportName(first.value)) { markRegInvalid(first, REG_MSG.lat); return false; }
        if (!/^[A-Za-z0-9]+$/.test(String(passport.value || '').trim())) { markRegInvalid(passport, REG_MSG.passport); return false; }
        return true;
      }
      var kg = document.getElementById('citizen-kg');
      var lastK = kg.querySelector('[name="lastName"]');
      var firstK = kg.querySelector('[name="firstName"]');
      var middle = kg.querySelector('[name="middleName"]');
      var pin = kg.querySelector('[name="pin"]');
      if (!isFullPersonName(lastK.value)) { markRegInvalid(lastK, REG_MSG.cyr); return false; }
      if (!isFullPersonName(firstK.value)) { markRegInvalid(firstK, REG_MSG.cyr); return false; }
      if (middle && String(middle.value || '').trim() && !isFullPersonName(middle.value)) { markRegInvalid(middle, REG_MSG.cyr); return false; }
      if (!/^\\d{14}$/.test(String(pin.value || '').trim())) { markRegInvalid(pin, REG_MSG.pin); return false; }
      return true;
    }

    if (!window.__muun_reg_listeners_added) {
      window.__muun_reg_listeners_added = true;
      document.addEventListener('change', function (e) {
        var el = e.target;
        if (!el || el.id !== 'reg-resume') return;
        var problem = resumeProblem(el);
        el.setCustomValidity(problem || '');
        if (problem) el.reportValidity();
      });

      document.addEventListener('input', function (e) {
        var el = e.target;
        if (!el || !el.closest || !el.closest('#visitor-reg-form') || !el.setCustomValidity) return;
        if (el.name === 'pin') el.value = String(el.value || '').replace(/\\D/g, '').slice(0, 14);
        el.setCustomValidity('');
      });
    }

    window.submitVisitorForm = function(event, form) {
      event.preventDefault();
      var regType = document.getElementById('regTypeInput') ? document.getElementById('regTypeInput').value : 'individual';
      if (!validateVisitorNames(form, regType)) return;
      var submitBtn = (regType === 'group') ? document.getElementById('reg-submit-btn-group') : document.getElementById('reg-submit-btn-indiv');
      if (!submitBtn) submitBtn = form.querySelector('button[type="submit"]');

      var originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = REG_MSG.sending;
        submitBtn.disabled = true;
      }

      var indivBox = document.getElementById('stream-indiv-fields');
      var groupBox = document.getElementById('stream-group-fields');
      var inactiveBox = regType === 'group' ? indivBox : groupBox;
      var turnedOff = [];
      if (inactiveBox) {
        inactiveBox.querySelectorAll('input, select, textarea').forEach(function (el) {
          if (!el.disabled) {
            el.disabled = true;
            turnedOff.push(el);
          }
        });
      }

      var resumeInput = document.getElementById('reg-resume');
      var resumeFile = (regType !== 'group' && resumeInput && resumeInput.files && resumeInput.files[0]) ? resumeInput.files[0] : null;

      var formData = new FormData(form);
      formData.delete('resume');
      turnedOff.forEach(function (el) { el.disabled = false; });

      var interestsArray = formData.getAll('interests');
      if (interestsArray.length > 0) {
        formData.delete('interests');
        formData.append('interests', interestsArray.join(', '));
      }

      var orgName = formData.get('organization') || formData.get('group_org') || '';
      if (orgName && !formData.get('school_org')) formData.append('school_org', orgName);

      var randomNum = Math.floor(100000 + Math.random() * 900000);
      var regId = (regType === 'group' ? 'MUUN-GRP-' : 'MUUN-') + randomNum;
      formData.set('regId', regId);
      formData.set('regType', regType);
      formData.set('form', 'registration');
      formData.set('lang', '${lang}');
      formData.set('submittedAt', new Date().toISOString());

      function postRegistration() {
        var urlEncodedData = new URLSearchParams(formData).toString();
        fetch('${endpoint}', {
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
      }

      if (!resumeFile) {
        postRegistration();
        return;
      }

      var reader = new FileReader();
      reader.onload = function() {
        var result = String(reader.result || '');
        var comma = result.indexOf(',');
        formData.set('resumeName', resumeFile.name || 'resume');
        formData.set('resumeMime', resumeFile.type || '');
        formData.set('resumeData', comma >= 0 ? result.slice(comma + 1) : result);
        postRegistration();
      };
      reader.onerror = function() {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
        markRegInvalid(resumeInput, REG_MSG.resumeType);
      };
      reader.readAsDataURL(resumeFile);
    };

    window.showPendingScreen = function(regId) {
      var formStep = document.getElementById('reg-step-form');
      var pendingStep = document.getElementById('reg-step-pending');
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
  `;
}
