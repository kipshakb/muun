var TELEGRAM_BOT_TOKEN = '8738039810:AAH7rJYPLpTJeRvmJO0AzLjwp_p6GGkb878';
var TELEGRAM_CHAT_ID = '-5249036131';

var HEADERS = [
  'Дата', 'Название СМИ', 'Тип медиа', 'Ссылка', 'ФИО', 'Должность',
  'Телефон', 'Email', 'ПИН', 'Пресс-удостоверение', 'Оборудование',
  'Дополнительные сотрудники', 'Формат работы', 'Комментарии', 'Язык'
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
      'Дополнительные сотрудники': p.additional_members || '',
      'Дополнительные участники': p.additional_members || '',
      'Формат работы': translateList(p.format, FORMATS),
      'Комментарии': p.comment || '',
      'Комментарий': p.comment || '',
      'Язык': p.lang || ''
    };
    appendMapped(sheet, data);

    var tgLines = [
      '🆕 Аккредитация СМИ',
      '',
      'Дата: ' + data['Дата'],
      'СМИ: ' + data['Название СМИ'] + (data['Тип медиа'] ? ' (' + data['Тип медиа'] + ')' : ''),
      'Ссылка: ' + dash(data['Ссылка']),
      'Ответственный: ' + data['ФИО'] + (data['Должность'] ? ', ' + data['Должность'] : ''),
      'Телефон: ' + data['Телефон'],
      'Email: ' + data['Email'],
      'ПИН: ' + dash(data['ПИН']),
      'Удостоверение: ' + dash(data['Пресс-удостоверение']),
      'Оборудование: ' + dash(data['Оборудование'])
    ];
    if (data['Дополнительные сотрудники']) {
      tgLines.push('Доп. сотрудники:\n' + data['Дополнительные сотрудники']);
    }
    tgLines.push('Формат: ' + dash(data['Формат работы']));
    var commentVal = data['Комментарии'] || data['Комментарий'];
    if (commentVal) {
      tgLines.push('Комментарии: ' + commentVal);
    }

    if (p.skip_tg !== '1' && p.silent !== '1' && p.test !== '1') {
      notifyTelegram(sheet, tgLines.join('\n'));
    }
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}

function ensureHeader(sheet, headers) {
  var marker = headers[0];
  var lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    writeHeader(sheet, headers);
    return;
  }
  var first = String(sheet.getRange(1, 1).getDisplayValue() || '').trim();
  if (first !== marker) {
    var width = Math.max(sheet.getLastColumn(), headers.length);
    var row1Values = sheet.getRange(1, 1, 1, width).getDisplayValues()[0];
    var isRow1Empty = !row1Values.some(function (v) {
      return String(v || '').trim() !== '';
    });
    if (!isRow1Empty) {
      sheet.insertRowBefore(1);
    }
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
  if (target > sheet.getMaxRows()) {
    sheet.insertRowsAfter(sheet.getMaxRows(), target - sheet.getMaxRows());
  }
  if (row.length > sheet.getMaxColumns()) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), row.length - sheet.getMaxColumns());
  }
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
  var tz = 'Asia/Bishkek';
  try {
    tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone() || tz;
  } catch (err) {}
  return Utilities.formatDate(date, tz, 'dd.MM.yyyy HH:mm:ss');
}
