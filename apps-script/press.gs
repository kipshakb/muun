/**
 * MUUN 2026 — только «Аккредитация СМИ».
 *
 * Это отдельная таблица. В файлы участников и бесплатной регистрации
 * эти заявки не попадают.
 *
 * Как подключить:
 * 1. Создайте пустую Google-таблицу «MUUN 2026 — Аккредитация СМИ».
 * 2. Расширения → Apps Script. Удалите шаблон и вставьте этот файл.
 * 3. Токен бота и id чата уже стоят в начале файла, те же, что у участников.
 * 4. Развернуть → Новое развёртывание → Тип: Веб-приложение.
 *    Запускать от моего имени, доступ: Все.
 * 5. Скопируйте URL, который заканчивается на /exec, и пришлите его —
 *    его нужно поставить на сайт.
 *
 * Заявки пишутся в текущий лист этой таблицы.
 * Если лист пустой или стёрта строка заголовков, шапка создаётся заново.
 * В тот же Telegram-чат приходит сообщение «Аккредитация СМИ».
 */

var TELEGRAM_BOT_TOKEN = '8738039810:AAH7rJYPLpTJeRvmJO0AzLjwp_p6GGkb878';
var TELEGRAM_CHAT_ID = '-5249036131';

var HEADERS = [
  'Дата', 'Название СМИ', 'Тип медиа', 'Ссылка', 'ФИО', 'Должность',
  'Телефон', 'Email', 'ПИН', 'Пресс-удостоверение', 'Оборудование',
  'Формат работы', 'Размер команды', 'Даты', 'Комментарий', 'Язык'
];

var MEDIA_TYPES = {
  TV: 'ТВ',
  Agency: 'Агентство',
  Online: 'Онлайн-издание',
  Print: 'Печать',
  Radio: 'Радио',
  Blog: 'Блог',
  PhotoVideo: 'Фото/Видео',
  Other: 'Другое'
};

var FORMATS = {
  coverage: 'Новостное освещение',
  interview: 'Интервью со спикерами',
  photo_video: 'Фото/Видео съемка',
  crew: 'Съемочная группа',
  partner: 'Информационное партнерство',
  other: 'Другое'
};

var DATES = {
  nov17: '28 ноября',
  nov28: '28 ноября',
  nov18: '18 ноября',
  both: 'Оба дня'
};

function doPost(e) {
  var p = (e && e.parameter) || {};
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    ensureHeader(sheet, HEADERS);
    var data = {
      'Дата': sheetDate(p.submittedAt),
      'Название СМИ': p.media_name || '',
      'Тип медиа': labelOf(MEDIA_TYPES, p.media_type),
      'Ссылка': p.media_url || '',
      'ФИО': p.rep_name || '',
      'Должность': p.rep_role || '',
      'Телефон': p.phone || '',
      'Email': p.email || '',
      'ПИН': p.pin || '',
      'Пресс-удостоверение': p.press_id || '',
      'Оборудование': p.equipment || '',
      'Формат работы': translateList(p.format, FORMATS),
      'Размер команды': p.team_size || '',
      'Даты': labelOf(DATES, p.dates),
      'Комментарий': p.comment || '',
      'Язык': p.lang || ''
    };
    appendMapped(sheet, data);
    notifyTelegram(sheet, [
      '🆕 Аккредитация СМИ',
      '',
      'СМИ: ' + data['Название СМИ'] + (data['Тип медиа'] ? ' (' + data['Тип медиа'] + ')' : ''),
      'Ссылка: ' + dash(data['Ссылка']),
      'Журналист: ' + data['ФИО'] + (data['Должность'] ? ', ' + data['Должность'] : ''),
      'Телефон: ' + data['Телефон'],
      'Email: ' + data['Email'],
      'ПИН: ' + dash(data['ПИН']),
      'Удостоверение: ' + dash(data['Пресс-удостоверение']),
      'Оборудование: ' + dash(data['Оборудование']),
      'Формат: ' + dash(data['Формат работы']),
      'Команда: ' + dash(data['Размер команды']),
      'Даты: ' + dash(data['Даты']),
      'Комментарий: ' + dash(data['Комментарий'])
    ].join('\n'));
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
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
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0];
  var row = headers.map(function (h) {
    return sheetValue(data[h] != null ? data[h] : '');
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
  return value ? value : '—';
}

function sheetDate(iso) {
  var date = iso ? new Date(iso) : new Date();
  if (isNaN(date.getTime())) date = new Date();
  return date;
}
