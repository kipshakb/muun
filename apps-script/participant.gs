/**
 * MUUN 2026 — только «Стать участником».
 *
 * Вставляется в уже существующий скрипт таблицы участников.
 * Содержимое таблицы удалять не нужно.
 *
 * Публикация (адрес на сайте не меняется):
 * Развернуть → Управление развёртываниями → карандаш →
 * Версия: Новая версия → Развернуть.
 *
 * Пишет в текущий лист, в том же порядке колонок, что и раньше.
 * В конец шапки добавляются «Спонсорский файл» и «Язык».
 * Если лист пустой или кто-то стёр первую строку с заголовками,
 * шапка создаётся заново, и заявка всё равно записывается.
 */

var TELEGRAM_BOT_TOKEN = '8738039810:AAH7rJYPLpTJeRvmJO0AzLjwp_p6GGkb878';
var TELEGRAM_CHAT_ID = '-5249036131';

var HEADERS = [
  'Дата', 'Организация', 'Сфера', 'Сайт', 'Страна', 'Город',
  'ФИО', 'Должность', 'Телефон', 'Email', 'Интересы', 'Комментарий',
  'Спонсорский файл', 'Язык'
];

var SECTORS = {
  IT: 'IT и технологии',
  Education: 'Образование и наука',
  Finance: 'Банки и финансы',
  Production: 'Производство и промышленность',
  Gov: 'Государственный сектор',
  International: 'Международная организация',
  Creative: 'Креативная экономика',
  Other: 'Другое'
};

var COUNTRIES = {
  Kyrgyzstan: 'Кыргызстан',
  Kazakhstan: 'Казахстан',
  Uzbekistan: 'Узбекистан',
  Other: 'Другая страна'
};

var INTERESTS = {
  stand: 'Выставочный стенд',
  hr: 'HR и рекрутинг',
  speaker: 'Выступление в деловой программе',
  partner: 'Партнёрство / спонсорство',
  masterclass: 'Мастер-класс',
  brand: 'Продвижение бренда',
  other: 'Другое'
};

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    ensureHeader(sheet, HEADERS);
    if (e && e.parameter) {
      var data = participantRow(e.parameter);
      appendMapped(sheet, data);
      notifyTelegram(sheet, participantMessage(data));
    }
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('Success').setMimeType(ContentService.MimeType.TEXT);
}

function participantRow(p) {
  return {
    'Дата': sheetDate(p.submittedAt),
    'Организация': p.org || '',
    'Сфера': labelOf(SECTORS, p.sector),
    'Сайт': p.website || '',
    'Страна': labelOf(COUNTRIES, p.country),
    'Город': p.city || '',
    'ФИО': p.fio || '',
    'Должность': p.position || '',
    'Телефон': p.phone || '',
    'Email': p.email || '',
    'Интересы': translateList(p.interests, INTERESTS),
    'Комментарий': p.comment || '',
    'Спонсорский файл': p.request_sponsor_file === 'yes' ? 'Да' : 'Нет',
    'Язык': p.lang || ''
  };
}

function participantMessage(d) {
  return [
    '🚀 Участник',
    '',
    'Организация: ' + dash(d['Организация']),
    'Сфера: ' + dash(d['Сфера']),
    'ФИО: ' + dash(d['ФИО']),
    'Должность: ' + dash(d['Должность']),
    'Телефон: ' + dash(d['Телефон']),
    'Email: ' + dash(d['Email']),
    'Страна: ' + dash(d['Страна']),
    'Город: ' + dash(d['Город']),
    'Интересы: ' + dash(d['Интересы']),
    'Сайт: ' + dash(d['Сайт']),
    'Спонсорский файл: ' + dash(d['Спонсорский файл']),
    'Комментарий: ' + dash(d['Комментарий'])
  ].join('\n');
}

function ensureHeader(sheet, headers) {
  var marker = headers[0];
  if (sheet.getLastRow() === 0) {
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
  sheet.getRange(target, 1, 1, row.length).setValues([row]);
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

function notifyTelegram(sheet, text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
      method: 'post',
      payload: {
        chat_id: TELEGRAM_CHAT_ID,
        text: text
      },
      muteHttpExceptions: true
    });
  } catch (err) {
    sheet.getRange(sheet.getLastRow(), 1).setNote('Telegram: ' + err);
  }
}

function translateList(raw, map) {
  if (!raw) return '';
  return String(raw).split(',').map(function (part) {
    var key = part.trim();
    return map[key] || key;
  }).filter(Boolean).join(', ');
}

function labelOf(map, key) {
  if (!key) return '';
  return map[key] || key;
}

function dash(value) {
  return value ? value : '-';
}

function sheetDate(iso) {
  var date = iso ? new Date(iso) : new Date();
  if (isNaN(date.getTime())) date = new Date();
  return date;
}
