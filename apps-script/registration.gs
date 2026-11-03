/**
 * MUUN 2026 — бесплатная регистрация (посетитель и группа).
 *
 * Вставляется в уже существующий скрипт таблицы регистрации.
 * В таблицы участников и аккредитации СМИ эти заявки не попадают.
 * В Telegram регистрация не отправляется.
 *
 * Публикация (адрес на сайте не меняется):
 * Развернуть → Управление развёртываниями → карандаш →
 * Версия: Новая версия → Развернуть.
 *
 * Два листа в этой же таблице:
 *   «Индивидуально» — гражданство, ФИО, ПИН или паспорт, дата рождения,
 *   телефон, email, категория и учебное заведение или компания;
 *   «Группы» — учебное заведение, сопровождающий, телефон и рабочий email.
 * Дата пишется как дд.мм.гггг чч:мм по времени Бишкека.
 * Номер заявки в таблицу не записывается.
 * Резюме посетителя сохраняется в папку «MUUN 2026 — резюме» на Диске
 * аккаунта, которому принадлежит скрипт. В таблице лежит ссылка на файл.
 * При публикации Google попросит доступ к Диску — его нужно разрешить.
 * Листы создаются при первой заявке такого типа. Новая заявка
 * встаёт в первую пустую строку своего листа.
 * Старый общий лист (Sheet1) скрипт больше не заполняет — его можно удалить.
 */

var INDIVIDUAL_SHEET = 'Индивидуально';

var INDIVIDUAL_HEADERS = [
  'Дата', 'Гражданство', 'Страна', 'Фамилия', 'Имя', 'Отчество',
  'ПИН', 'Номер паспорта', 'Дата рождения', 'Телефон', 'Email',
  'Категория', 'Организация', 'Язык', 'Резюме'
];

var CATEGORIES = {
  school: 'Школьник',
  schoolStudent: 'Школьник',
  college: 'Студент колледжа',
  university: 'Студент университета',
  student: 'Студент',
  graduate: 'Выпускник',
  young_specialist: 'Молодой специалист',
  young_spec: 'Молодой специалист',
  jobSeeker: 'Соискатель',
  moderator: 'Модератор',
  speaker: 'Спикер',
  exhibitor: 'Представитель стенда',
  staff: 'Персонал',
  stuff: 'Персонал',
  organizer: 'Организатор',
  parent: 'Родитель / педагог',
  teacher: 'Педагог',
  company: 'Представитель компании',
  media: 'СМИ / блогер',
  other: 'Другое'
};

var CITIZENSHIP = {
  kg: 'Гражданин КР',
  foreign: 'Иностранный гражданин'
};

var RESUME_MIME = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png'
};

var RESUME_FOLDER = 'MUUN 2026 — резюме';

var TOTAL_SEATS_LIMIT = 800;

function doGet(e) {
  var stats = getRegistrationStats();
  var callback = e && e.parameter && e.parameter.callback;
  var json = JSON.stringify(stats);

  if (callback) {
    return ContentService.createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function getRegistrationStats() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('muun_reg_quota_stats_v2');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (err) {}
  }

  var count = countUniqueRegistrations();
  var limit = TOTAL_SEATS_LIMIT;
  var remaining = Math.max(0, limit - count);
  var percent = Math.min(100, Math.round((count / limit) * 100));

  var stats = {
    limit: limit,
    registered: count,
    remaining: remaining,
    percent: percent,
    isFull: remaining <= 0,
    timestamp: new Date().toISOString()
  };

  try {
    cache.put('muun_reg_quota_stats_v2', JSON.stringify(stats), 90);
  } catch (err) {}

  return stats;
}

function countUniqueRegistrations() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var indivSheet = ss.getSheetByName(INDIVIDUAL_SHEET);

  var uniqueSet = {};
  var uniqueCount = 0;

  if (indivSheet && indivSheet.getLastRow() >= 2) {
    var lastRow = indivSheet.getLastRow();
    var lastCol = indivSheet.getLastColumn();
    var headers = indivSheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0];

    var pinCol = -1;
    var passCol = -1;
    var emailCol = -1;
    var phoneCol = -1;
    var lastNameCol = -1;
    var firstNameCol = -1;

    for (var i = 0; i < headers.length; i++) {
      var h = String(headers[i] || '').trim().toLowerCase();
      if (h === 'пин') pinCol = i;
      else if (h.indexOf('паспорт') !== -1) passCol = i;
      else if (h === 'email') emailCol = i;
      else if (h.indexOf('телефон') !== -1) phoneCol = i;
      else if (h === 'фамилия') lastNameCol = i;
      else if (h === 'имя') firstNameCol = i;
    }

    var values = indivSheet.getRange(2, 1, lastRow - 1, lastCol).getDisplayValues();
    for (var r = 0; r < values.length; r++) {
      var row = values[r];
      var isFilled = row.some(function(cell) { return String(cell || '').trim() !== ''; });
      if (!isFilled) continue;

      var key = '';
      var pin = pinCol >= 0 ? String(row[pinCol] || '').replace(/\D/g, '') : '';
      var pass = passCol >= 0 ? String(row[passCol] || '').trim().toUpperCase() : '';
      var email = emailCol >= 0 ? String(row[emailCol] || '').trim().toLowerCase() : '';
      var phone = phoneCol >= 0 ? String(row[phoneCol] || '').replace(/\D/g, '') : '';
      var fio = (lastNameCol >= 0 && firstNameCol >= 0)
        ? (String(row[lastNameCol] || '').trim().toLowerCase() + '_' + String(row[firstNameCol] || '').trim().toLowerCase())
        : '';

      if (pin && pin.length >= 10) {
        key = 'pin:' + pin;
      } else if (pass && pass.length >= 4) {
        key = 'pass:' + pass;
      } else if (email && email.indexOf('@') !== -1) {
        key = 'email:' + email;
      } else if (phone && phone.length >= 9) {
        key = 'phone:' + phone;
      } else if (fio && fio.length >= 4) {
        key = 'fio:' + fio;
      } else {
        key = 'row:' + (r + 2);
      }

      if (!uniqueSet[key]) {
        uniqueSet[key] = true;
        uniqueCount++;
      }
    }
  }

  return uniqueCount;
}

function doPost(e) {
  var p = postParams(e);
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = sheetFor(ss, INDIVIDUAL_SHEET, INDIVIDUAL_HEADERS);
    var foreign = p.citizenship === 'foreign';
    var data = {
      'Дата': sheetDate(p.submittedAt),
      'Гражданство': CITIZENSHIP[p.citizenship] || p.citizenship || '',
      'Страна': foreign ? (p.country || '') : '',
      'Фамилия': p.lastName || '',
      'Имя': p.firstName || '',
      'Отчество': foreign ? '' : (p.middleName || ''),
      'ПИН': foreign ? '' : (p.pin || ''),
      'Номер паспорта': foreign ? (p.passport || '') : '',
      'Дата рождения': sheetBirthDate(p.birthDate),
      'Телефон': p.phone || '',
      'Email': p.email || '',
      'Категория': CATEGORIES[p.category] || p.category || '',
      'Организация': p.organization || p.school_org || '',
      'Язык': p.lang || '',
      'Резюме': resumeLink(p)
    };
    saveOrUpdateMapped(sheet, data);
    try {
      CacheService.getScriptCache().remove('muun_reg_quota_stats_v2');
    } catch (clearErr) {}
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}

function postParams(e) {
  var params = {};
  var source = (e && e.parameter) || {};
  for (var key in source) params[key] = source[key];
  var raw = e && e.postData && e.postData.contents;
  if (!raw || raw.indexOf('resumeData=') === -1) return params;
  var extra = parseFormBody(raw);
  if ((extra.resumeData || '').length >= (params.resumeData || '').length) {
    params.resumeData = extra.resumeData || '';
    if (extra.resumeName) params.resumeName = extra.resumeName;
    if (extra.resumeMime) params.resumeMime = extra.resumeMime;
  }
  return params;
}

function parseFormBody(raw) {
  var out = {};
  String(raw).split('&').forEach(function (part) {
    if (!part) return;
    var eq = part.indexOf('=');
    var key = decodeURIComponent(String(eq >= 0 ? part.slice(0, eq) : part).replace(/\+/g, ' '));
    var val = decodeURIComponent(String(eq >= 0 ? part.slice(eq + 1) : '').replace(/\+/g, ' '));
    out[key] = val;
  });
  return out;
}

function authorizeResume() {
  var folder = resumeFolder();
  Logger.log(folder.getUrl());
}

function resumeLink(p) {
  if (!normalizeBase64(p.resumeData)) return '';
  try {
    return saveResume(p);
  } catch (err) {
    var message = String(err && err.message || err || '');
    if (/permission|autoriz|authoriz|доступ|insufficient/i.test(message)) {
      return 'нет доступа к Диску: в редакторе запустите authorizeResume и разрешите доступ';
    }
    return ('файл не сохранился: ' + message).slice(0, 180);
  }
}

function normalizeBase64(value) {
  return String(value || '')
    .replace(/ /g, '+')
    .replace(/[\r\n\t]/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
}

function saveResume(p) {
  var data = normalizeBase64(p.resumeData);
  if (!data) return '';
  var ext = fileExt(p.resumeName);
  if (!RESUME_MIME[ext]) return 'непринятый формат';
  var bytes;
  try {
    bytes = Utilities.base64Decode(data);
  } catch (err) {
    return 'файл повреждён';
  }
  if (!bytes || !bytes.length) return 'файл повреждён';
  if (bytes.length > 10 * 1024 * 1024) return 'файл больше 10 МБ';
  var file = resumeFolder().createFile(Utilities.newBlob(bytes, RESUME_MIME[ext], resumeTitle(p, ext)));
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (err) {}
  return file.getUrl();
}

function resumeFolder() {
  var found = DriveApp.getFoldersByName(RESUME_FOLDER);
  if (found.hasNext()) return found.next();
  return DriveApp.createFolder(RESUME_FOLDER);
}

function resumeTitle(p, ext) {
  var stamp = Utilities.formatDate(new Date(), 'Asia/Bishkek', 'yyyy-MM-dd HH-mm');
  var who = [p.lastName, p.firstName].join(' ').replace(/\s+/g, ' ').trim();
  var base = safeFilePart(p.resumeName).replace(new RegExp('\\.' + ext + '$', 'i'), '');
  var title = stamp + (who ? ' ' + who : '') + (base ? ' ' + base : '');
  return title.slice(0, 120) + '.' + ext;
}

function fileExt(name) {
  var clean = String(name || '').toLowerCase();
  var dot = clean.lastIndexOf('.');
  return dot >= 0 ? clean.slice(dot + 1) : '';
}

function safeFilePart(name) {
  return String(name || '')
    .replace(/[\\/:*?"<>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sheetFor(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  ensureHeader(sheet, headers);
  return sheet;
}

function ensureHeader(sheet, headers) {
  var marker = headers[0];
  if (sheet.getLastRow() <= 1) {
    sheet.clear();
    writeHeader(sheet, headers);
    return;
  }
  var first = String(sheet.getRange(1, 1).getDisplayValue() || '').trim();
  if (first !== marker) {
    sheet.insertRowBefore(1);
    writeHeader(sheet, headers);
    return;
  }
  var width = Math.max(sheet.getLastColumn(), 1);
  var current = sheet.getRange(1, 1, 1, width).getDisplayValues()[0].map(function (v) {
    return String(v || '').trim();
  });
  while (current.length && !current[current.length - 1]) current.pop();
  var missing = headers.filter(function (h) { return current.indexOf(h) === -1; });
  if (!missing.length) return;
  var next = current.concat(missing);
  sheet.getRange(1, 1, 1, next.length).setValues([next]);
  sheet.getRange(1, 1, 1, next.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function writeHeader(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function saveOrUpdateMapped(sheet, data) {
  var width = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, width).getDisplayValues()[0];
  var row = headers.map(function (h) {
    var key = String(h || '').trim();
    return sheetValue(data[key] != null ? data[key] : '');
  });

  var targetRow = -1;

  // Ищем совпадение по ПИН, Паспорту или Email
  if (sheet.getLastRow() >= 2) {
    var pinCol = -1;
    var passCol = -1;
    var emailCol = -1;
    for (var i = 0; i < headers.length; i++) {
      var h = String(headers[i] || '').trim().toLowerCase();
      if (h === 'пин') pinCol = i;
      else if (h.indexOf('паспорт') !== -1) passCol = i;
      else if (h === 'email') emailCol = i;
    }

    var newPin = data['ПИН'] ? String(data['ПИН']).replace(/\D/g, '') : '';
    var newPass = data['Номер паспорта'] ? String(data['Номер паспорта']).trim().toUpperCase() : '';
    var newEmail = data['Email'] ? String(data['Email']).trim().toLowerCase() : '';

    var lastRow = sheet.getLastRow();
    var values = sheet.getRange(2, 1, lastRow - 1, width).getDisplayValues();

    for (var r = 0; r < values.length; r++) {
      var curRow = values[r];
      var curPin = pinCol >= 0 ? String(curRow[pinCol] || '').replace(/\D/g, '') : '';
      var curPass = passCol >= 0 ? String(curRow[passCol] || '').trim().toUpperCase() : '';
      var curEmail = emailCol >= 0 ? String(curRow[emailCol] || '').trim().toLowerCase() : '';

      var isMatch = false;
      if (newPin && newPin.length >= 10 && curPin === newPin) {
        isMatch = true;
      } else if (newPass && newPass.length >= 4 && curPass === newPass) {
        isMatch = true;
      } else if (newEmail && newEmail.indexOf('@') !== -1 && curEmail === newEmail) {
        isMatch = true;
      }

      if (isMatch) {
        targetRow = r + 2; // строка в таблице
        break;
      }
    }
  }

  // Если совпадений нет — вставляем в новую строку
  if (targetRow === -1) {
    targetRow = firstEmptyRow(sheet, width);
  }

  var range = sheet.getRange(targetRow, 1, 1, row.length);
  range.setNumberFormat('@');
  range.setValues([row]);
}

/**
 * Разовая очистка уже имеющихся дубликатов в таблице.
 * Выберите cleanDuplicates вверху редактора Apps Script и нажмите «Выполнить».
 * Удалит повторы на листе «Индивидуально», оставив самые свежие записи.
 */
function cleanDuplicates() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(INDIVIDUAL_SHEET);
  if (!sheet || sheet.getLastRow() < 3) {
    Logger.log('Недостаточно строк для очистки.');
    return;
  }

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0];

  var pinCol = -1;
  var passCol = -1;
  var emailCol = -1;
  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i] || '').trim().toLowerCase();
    if (h === 'пин') pinCol = i;
    else if (h.indexOf('паспорт') !== -1) passCol = i;
    else if (h === 'email') emailCol = i;
  }

  var values = sheet.getRange(2, 1, lastRow - 1, lastCol).getDisplayValues();
  var seen = {};
  var rowsToDelete = [];

  // Идём снизу вверх, чтобы сохранить самую последнюю (свежую) отправку человека
  for (var r = values.length - 1; r >= 0; r--) {
    var row = values[r];
    var pin = pinCol >= 0 ? String(row[pinCol] || '').replace(/\D/g, '') : '';
    var pass = passCol >= 0 ? String(row[passCol] || '').trim().toUpperCase() : '';
    var email = emailCol >= 0 ? String(row[emailCol] || '').trim().toLowerCase() : '';

    var key = '';
    if (pin && pin.length >= 10) key = 'pin:' + pin;
    else if (pass && pass.length >= 4) key = 'pass:' + pass;
    else if (email && email.indexOf('@') !== -1) key = 'email:' + email;

    if (!key) continue;

    if (seen[key]) {
      rowsToDelete.push(r + 2);
    } else {
      seen[key] = true;
    }
  }

  // Удаляем строки снизу вверх
  for (var d = 0; d < rowsToDelete.length; d++) {
    sheet.deleteRow(rowsToDelete[d]);
  }

  try {
    CacheService.getScriptCache().remove('muun_reg_quota_stats_v2');
  } catch (e) {}

  Logger.log('Удалено дубликатов: ' + rowsToDelete.length);
}

function firstEmptyRow(sheet, width) {
  var last = sheet.getLastRow();
  if (last < 2) return 2;
  var values = sheet.getRange(2, 1, last - 1, width).getDisplayValues();
  for (var i = 0; i < values.length; i++) {
    var filled = values[i].some(function (cell) {
      return String(cell || '').trim() !== '';
    });
    if (!filled) return i + 2;
  }
  return last + 1;
}

function sheetValue(value) {
  if (value instanceof Date) return value;
  var s = value == null ? '' : String(value);
  if (s && '+-=@'.indexOf(s.charAt(0)) !== -1) return "'" + s;
  return s;
}

function sheetBirthDate(value) {
  var match = String(value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value || '';
  return match[3] + '.' + match[2] + '.' + match[1];
}

function sheetDate(iso) {
  var date = iso ? new Date(iso) : new Date();
  if (isNaN(date.getTime())) date = new Date();
  return Utilities.formatDate(date, 'Asia/Bishkek', 'dd.MM.yyyy HH:mm');
}
