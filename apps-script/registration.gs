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
 *   «Индивидуально» — только поля человека;
 *   «Группы» — организация, сопровождающий, размер, день и список.
 * Листы создаются при первой заявке такого типа. Новая заявка
 * встаёт в первую пустую строку своего листа.
 * Старый общий лист (Sheet1) скрипт больше не заполняет — его можно удалить.
 */

var INDIVIDUAL_SHEET = 'Индивидуально';
var GROUP_SHEET = 'Группы';

var INDIVIDUAL_HEADERS = [
  'Дата', 'Номер заявки', 'Фамилия', 'Имя', 'Отчество', 'ПИН', 'Дата рождения',
  'Телефон', 'Email', 'Категория', 'Регион', 'Организация', 'День', 'Слот',
  'Интересы', 'Язык', 'Согласие СГО'
];

var GROUP_HEADERS = [
  'Дата', 'Номер заявки', 'Организация', 'Город', 'Сопровождающий', 'Должность',
  'Телефон', 'Email', 'Размер группы', 'День', 'Слот', 'Список группы',
  'Язык', 'Согласие СГО'
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
  parent: 'Родитель / педагог',
  teacher: 'Педагог',
  company: 'Представитель компании',
  media: 'СМИ / блогер',
  other: 'Другое'
};

var REGIONS = {
  Bishkek: 'г. Бишкек',
  Chuy: 'Чуйская область',
  Osh_city: 'г. Ош',
  OshCity: 'г. Ош',
  Osh: 'Ошская область',
  OshReg: 'Ошская область',
  JalalAbad: 'Джалал-Абадская область',
  IssykKul: 'Иссык-Кульская область',
  Naryn: 'Нарынская область',
  Talas: 'Таласская область',
  Batken: 'Баткенская область'
};

var DAYS = {
  Nov17: '17 ноября',
  Nov18: '18 ноября',
  Both: 'Оба дня',
  BothDays: 'Оба дня'
};

var SLOTS = {
  Slot1: '09:30–12:30',
  Slot2: '13:00–15:30',
  Slot3: '16:00–18:30'
};

var INTERESTS = {
  it: 'IT и ИИ',
  energy: 'Энергетика',
  engineering: 'Инженерия',
  creative: 'Креативные индустрии',
  medicine: 'Медицина',
  agriculture: 'Сельское хозяйство',
  industry: 'Промышленность',
  transport: 'Транспорт и логистика',
  finance: 'Финансы и банки',
  gov: 'Госуправление',
  abroad: 'Образование за рубежом',
  startup: 'Предпринимательство'
};

function doPost(e) {
  var p = (e && e.parameter) || {};
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var isGroup = p.regType === 'group';
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = sheetFor(ss, isGroup ? GROUP_SHEET : INDIVIDUAL_SHEET, isGroup ? GROUP_HEADERS : INDIVIDUAL_HEADERS);
    var organization = p.organization || p.school_org || p.group_org || '';
    var data = isGroup ? {
      'Дата': sheetDate(p.submittedAt),
      'Номер заявки': p.regId || '',
      'Организация': p.group_org || organization,
      'Город': p.group_city || '',
      'Сопровождающий': p.group_leader_name || '',
      'Должность': p.group_leader_role || '',
      'Телефон': p.group_leader_phone || '',
      'Email': p.group_leader_email || '',
      'Размер группы': p.group_size || '',
      'День': labelOf(DAYS, p.group_day),
      'Слот': labelOf(SLOTS, p.group_slot),
      'Список группы': p.group_list_link || '',
      'Язык': p.lang || '',
      'Согласие СГО': p.consent === 'yes' ? 'Да' : ''
    } : {
      'Дата': sheetDate(p.submittedAt),
      'Номер заявки': p.regId || '',
      'Фамилия': p.lastName || '',
      'Имя': p.firstName || '',
      'Отчество': p.middleName || '',
      'ПИН': p.pin || '',
      'Дата рождения': p.birthDate || '',
      'Телефон': p.phone || '',
      'Email': p.email || '',
      'Категория': labelOf(CATEGORIES, p.category),
      'Регион': labelOf(REGIONS, p.region) || p.city || '',
      'Организация': organization,
      'День': labelOf(DAYS, p.preferredDay || p.day),
      'Слот': labelOf(SLOTS, p.timeSlot || p.slot),
      'Интересы': translateList(p.interests, INTERESTS),
      'Язык': p.lang || '',
      'Согласие СГО': p.consent === 'yes' ? 'Да' : ''
    };
    appendMapped(sheet, data);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}

function sheetFor(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  ensureHeader(sheet, headers);
  return sheet;
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

function sheetDate(iso) {
  var date = iso ? new Date(iso) : new Date();
  if (isNaN(date.getTime())) date = new Date();
  return date;
}
