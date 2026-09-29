import fs from 'fs';

const p = 'c:/Users/Beibars/Desktop/muun/bishkek_moon_site/src/i18n.json';
let data = fs.readFileSync(p, 'utf8');
let json = JSON.parse(data);

function replaceInObj(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      let str = obj[key];
      // Strings replacements
      str = str.replace(/Национальный выставка-форум/g, "Молодежная выставка-форум");
      str = str.replace(/национальная выставка-форум/g, "молодежная выставка-форум");
      str = str.replace(/национальный выставка-форум/g, "молодежная выставка-форум");
      str = str.replace(/улуттук көргөзмө-форуму/g, "жаштар көргөзмө-форуму");
      str = str.replace(/улуттук жаштар көргөзмө-форумунун/g, "жаштар көргөзмө-форумунун"); // to avoid duplication
      str = str.replace(/national exhibition-forum/g, "youth exhibition-forum");
      
      // Dates replacements
      str = str.replace(/9-10 ноябрь/g, "17-18 ноябрь");
      str = str.replace(/9-10 ноября/g, "17-18 ноября");
      str = str.replace(/November 9-10/g, "November 17-18");
      
      str = str.replace(/9 ноября/g, "17 ноября");
      str = str.replace(/10 ноября/g, "18 ноября");
      str = str.replace(/9-ноябрь/g, "17-ноябрь");
      str = str.replace(/10-ноябрь/g, "18-ноябрь");
      str = str.replace(/November 9/g, "November 17");
      str = str.replace(/November 10/g, "November 18");
      
      obj[key] = str;
    } else if (typeof obj[key] === 'object') {
      replaceInObj(obj[key]);
    }
  }
}

replaceInObj(json);

if (json.strings.ky["prog.d1_t1_d"]) {
  json.strings.ky["prog.d1_t1_d"] = json.strings.ky["prog.d1_t1_d"].replace('MUUN Cup башталышы.', 'MUUN Cup башталышы. 17-ноябрь — Кыргызстандагы студенттер күнүнө карата.');
}
if (json.strings.ru["prog.d1_t1_d"]) {
  json.strings.ru["prog.d1_t1_d"] = json.strings.ru["prog.d1_t1_d"].replace('Старт MUUN Cup.', 'Старт MUUN Cup. В честь Дня студентов в Кыргызстане 17 ноября.');
}
if (json.strings.en["prog.d1_t1_d"]) {
  json.strings.en["prog.d1_t1_d"] = json.strings.en["prog.d1_t1_d"].replace('MUUN Cup start.', 'MUUN Cup start. Celebrating Students\' Day in Kyrgyzstan on November 17.');
}

fs.writeFileSync(p, JSON.stringify(json, null, 2));
console.log("Done");
