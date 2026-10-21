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
var GROUP_SHEET = 'Группы';

var INDIVIDUAL_HEADERS = [
  'Дата', 'Гражданство', 'Страна', 'Фамилия', 'Имя', 'Отчество',
  'ПИН', 'Номер паспорта', 'Дата рождения', 'Телефон', 'Email',
  'Категория', 'Организация', 'Язык', 'Резюме'
];

var GROUP_HEADERS = [
  'Дата', 'Организация', 'Сопровождающий', 'Телефон', 'Email', 'Язык'
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

function doPost(e) {
  var p = postParams(e);
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var isGroup = p.regType === 'group';
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = sheetFor(ss, isGroup ? GROUP_SHEET : INDIVIDUAL_SHEET, isGroup ? GROUP_HEADERS : INDIVIDUAL_HEADERS);
    var foreign = p.citizenship === 'foreign';
    var data = isGroup ? {
      'Дата': sheetDate(p.submittedAt),
      'Организация': p.group_org || '',
      'Сопровождающий': p.group_leader_name || '',
      'Телефон': p.group_leader_phone || '',
      'Email': p.group_leader_email || '',
      'Язык': p.lang || ''
    } : {
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
    appendMapped(sheet, data);
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

function appendMapped(sheet, data) {
  var width = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, width).getDisplayValues()[0];
  var row = headers.map(function (h) {
    var key = String(h || '').trim();
    return sheetValue(data[key] != null ? data[key] : '');
  });
  var target = firstEmptyRow(sheet, width);
  var range = sheet.getRange(target, 1, 1, row.length);
  range.setNumberFormat('@');
  range.setValues([row]);
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
