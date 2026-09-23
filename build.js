#!/usr/bin/env node
/*
 * CookBook á la Maks — build script
 *
 * Lukee recipes/*.md ja tuottaa site/index.html:n, joka sisältää kaiken:
 * ei riippuvuuksia, ei palvelinta, ei mitään päivitettävää.
 *
 * Lisäksi laskee ravintoarvot aineksista ja päivittää lisaa-resepti.html:n
 * tagiluettelon.
 *
 * Käyttö:  node build.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const RECIPES_DIR = path.join(ROOT, 'recipes');
const SITE_DIR = path.join(ROOT, 'site');
const TEMPLATE = path.join(ROOT, 'template.html');
const LOMAKE = path.join(ROOT, 'lisaa-resepti.html');
const RUOAT = require('./ravintotaulukko.js');

/* ---------- Yksiköt ---------- */
// Tunnistetut mittayksiköt. Jos sanaa ei tunnisteta, se menee osaksi
// aineksen nimeä — määrä skaalautuu silti oikein.
const YKSIKOT = [
  'g', 'kg', 'mg', 'ml', 'dl', 'l', 'cl',
  'rkl', 'tl', 'kpl', 'prk', 'tlk', 'pss', 'ps',
  'nippu', 'nippua', 'pala', 'palaa', 'viipale', 'viipaletta',
  'kynsi', 'kynttä', 'oksa', 'oksaa', 'annos', 'annosta',
  'purkki', 'purkkia', 'levy', 'levyä'
];

// Tilavuusmitat millilitroina
const TILAVUUS_ML = { ml: 1, cl: 10, dl: 100, l: 1000, rkl: 15, tl: 5 };

// Yksiköt, jotka tarkoittavat kappaletta
const KAPPALEYKSIKOT = [
  'kpl', 'pala', 'palaa', 'viipale', 'viipaletta',
  'kynsi', 'kynttä', 'oksa', 'oksaa', 'levy', 'levyä', 'nippu', 'nippua'
];

/* ---------- Frontmatterin jäsennys ---------- */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw.trim() };

  const meta = {};
  let currentKey = null;

  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim()) continue;

    // Listan alkio: "  - jotain"
    const item = line.match(/^\s*-\s+(.*)$/);
    if (item && currentKey) {
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = [];
      meta[currentKey].push(stripQuotes(item[1].trim()));
      continue;
    }

    // Sisennetty avain-arvo: "  kcal: 520"  (esim. ravinto-lohko)
    const nested = line.match(/^\s+([A-Za-zÅÄÖåäö_][A-Za-zÅÄÖåäö0-9_]*)\s*:\s*(.*)$/);
    if (nested && currentKey) {
      if (!meta[currentKey] || Array.isArray(meta[currentKey])) meta[currentKey] = {};
      meta[currentKey][nested[1].trim()] = stripQuotes(nested[2].trim());
      continue;
    }

    const kv = line.match(/^([A-Za-zÅÄÖåäö_][A-Za-zÅÄÖåäö0-9_]*)\s*:\s*(.*)$/);
    if (!kv) continue;

    const key = kv[1].trim();
    const val = kv[2].trim();

    if (val === '') {
      // Seuraavilla riveillä tulee lista tai sisennetty lohko
      meta[key] = [];
      currentKey = key;
    } else if (val.startsWith('[') && val.endsWith(']')) {
      // Inline-lista: [a, b, c]
      meta[key] = val.slice(1, -1).split(',')
        .map(s => stripQuotes(s.trim())).filter(Boolean);
      currentKey = null;
    } else {
      meta[key] = stripQuotes(val);
      currentKey = null;
    }
  }
  return { meta, body: (m[2] || '').trim() };
}

function stripQuotes(s) {
  return s.replace(/^["'](.*)["']$/, '$1');
}

/* ---------- Ajan jäsennys ---------- */
// "aika" on aktiivista työtä, "odotusaika" on passiivista: uuni, kohoaminen,
// marinointi, jäähdytys. Molemmat kirjoitetaan vapaana tekstinä; jos teksti
// on tulkittavissa minuuteiksi, niistä lasketaan myös yhteisaika.
//
// "1 h 30 min" -> 90 | "1,5 h" -> 90 | "45 min" -> 45 | "yön yli" -> null
function aikaMinuutteina(s) {
  if (!s) return null;
  const t = String(s).toLowerCase().replace(',', '.');

  let min = 0, osui = false;

  const h = t.match(/(\d+(?:\.\d+)?)\s*(h\b|t\b|tunti|tuntia)/);
  if (h) { min += parseFloat(h[1]) * 60; osui = true; }

  const m = t.match(/(\d+(?:\.\d+)?)\s*(min|minuutti|minuuttia)/);
  if (m) { min += parseFloat(m[1]); osui = true; }

  if (!osui) {
    const pelkkaLuku = t.match(/^\s*(\d+(?:\.\d+)?)\s*$/);
    if (pelkkaLuku) { min = parseFloat(pelkkaLuku[1]); osui = true; }
  }

  return osui ? Math.round(min) : null;
}

function muotoileMinuutit(min) {
  if (min == null) return null;
  if (min < 60) return min + ' min';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? h + ' h ' + m + ' min' : h + ' h';
}

// Luettelossa näytettävä tiivis muoto: "20 min + 2 h"
function yhdistaAika(tyoaika, odotusaika) {
  if (tyoaika && odotusaika) return tyoaika + ' + ' + odotusaika;
  return tyoaika || odotusaika || null;
}

/* ---------- Aineksen jäsennys ---------- */
// "3 rkl soijakastiketta"  -> { maara: 3, yksikko: 'rkl', aines: 'soijakastiketta' }
// "1/2 dl kermaa"          -> { maara: 0.5, ... }
// "2-3 valkosipulinkynttä" -> { maara: 2, maaraMax: 3, yksikko: null, ... }
// "ripaus suolaa"          -> { maara: null, teksti: 'ripaus suolaa' }
function parseIngredient(line) {
  const raw = line.trim();
  if (!raw) return null;

  const num = '\\d+(?:[.,]\\d+)?';
  const re = new RegExp('^(' + num + ')(?:\\s*[-–]\\s*(' + num + '))?\\s+(.*)$');
  const frac = raw.match(/^(\d+)\/(\d+)\s+(.*)$/);

  let maara = null, maaraMax = null, rest = raw;

  if (frac) {
    maara = parseInt(frac[1], 10) / parseInt(frac[2], 10);
    rest = frac[3];
  } else {
    const m = raw.match(re);
    if (m) {
      maara = parseFloat(m[1].replace(',', '.'));
      if (m[2]) maaraMax = parseFloat(m[2].replace(',', '.'));
      rest = m[3];
    }
  }

  if (maara === null) return { maara: null, yksikko: null, aines: raw, raw };

  // Erota yksikkö, jos ensimmäinen sana tunnistetaan
  let yksikko = null;
  const words = rest.split(/\s+/);
  if (words.length > 1 && YKSIKOT.includes(words[0].toLowerCase())) {
    yksikko = words.shift();
  }

  return { maara, maaraMax, yksikko, aines: words.join(' '), raw };
}

/* ---------- Ravintoarvot ----------
 * Arvio, joka lasketaan ainesriveistä ravintotaulukko.js:n avulla.
 * Reseptin oma ravinto:-lohko ohittaa laskennan.
 */

// Etsii taulukosta parhaan osuman: pisin osuva hakusana voittaa, jotta
// "oliiviöljy" ei mene "öljyksi" eikä "kookosmaito" "maidoksi".
function etsiRuoka(nimi) {
  const teksti = String(nimi || '').toLowerCase();
  let paras = null, pituus = 0;

  for (const ruoka of RUOAT) {
    for (const avain of [ruoka.nimi].concat(ruoka.muut || [])) {
      // Monisanaisesta hakusanasta jokaisen sanan on löydyttävä erikseen:
      // "rasvatonta maitoa" taipuu, mutta sisältää yhä sanat "rasvaton" ja "maito"
      const osuu = avain.indexOf(' ') === -1
        ? teksti.includes(avain)
        : avain.split(' ').every(sana => teksti.includes(sana));

      if (osuu && avain.length > pituus) {
        paras = ruoka;
        pituus = avain.length;
      }
    }
  }
  return paras;
}

// Muuntaa ainesrivin grammoiksi. null = ei voida päätellä.
function grammoina(aines, ruoka) {
  if (aines.maara == null) return null;

  const maara = aines.maaraMax != null
    ? (aines.maara + aines.maaraMax) / 2
    : aines.maara;

  const y = (aines.yksikko || '').toLowerCase();

  if (y === 'g') return maara;
  if (y === 'kg') return maara * 1000;
  if (y === 'mg') return maara / 1000;

  if (TILAVUUS_ML[y] != null) {
    // Ilman tiheystietoa oletetaan veden tiheys
    const gPerMl = (ruoka && ruoka.gDl ? ruoka.gDl : 100) / 100;
    return maara * TILAVUUS_ML[y] * gPerMl;
  }

  if (!y || KAPPALEYKSIKOT.includes(y)) {
    if (ruoka && ruoka.gKpl) return maara * ruoka.gKpl;
    return null;
  }

  return null;  // prk, tlk, pss — koko ei ole tiedossa
}

function pyorista(n) {
  if (n >= 10) return Math.round(n);
  return Math.round(n * 10) / 10;
}

function laskeRavinto(ainekset, annokset) {
  if (!ainekset.length) return null;

  let kcal = 0, prot = 0, hh = 0, sok = 0, rasva = 0, kuitu = 0;
  let katettu = 0;
  const puuttuvat = [];

  for (const a of ainekset) {
    const ruoka = etsiRuoka(a.aines || a.raw);
    const gramm = grammoina(a, ruoka);

    if (ruoka && gramm != null) {
      const k = gramm / 100;
      kcal += ruoka.kcal * k;
      prot += ruoka.prot * k;
      hh += ruoka.hh * k;
      sok += ruoka.sok * k;
      rasva += ruoka.rasva * k;
      kuitu += ruoka.kuitu * k;
      katettu++;
    } else if (ruoka && ruoka.mitaton) {
      // "ripaus suolaa" — ei ravintosisältöä, mutta ei myöskään puute
      katettu++;
    } else {
      puuttuvat.push(a.aines || a.raw);
    }
  }

  if (!katettu) return null;

  const jako = annokset || 1;
  return {
    kcal: Math.round(kcal / jako),
    proteiini: pyorista(prot / jako),
    hiilihydraatit: pyorista(hh / jako),
    sokeri: pyorista(sok / jako),
    rasva: pyorista(rasva / jako),
    kuitu: pyorista(kuitu / jako),
    katettu,
    ainesmaara: ainekset.length,
    puuttuvat,
    lahde: 'laskettu'
  };
}

// Reseptiin kirjattu ravinto:-lohko (annosta kohden) ohittaa laskennan
function kirjattuRavinto(meta) {
  const r = meta.ravinto;
  if (!r || Array.isArray(r) || typeof r !== 'object') return null;

  const luku = v => {
    if (v == null) return null;
    const n = parseFloat(String(v).replace(',', '.'));
    return isNaN(n) ? null : n;
  };

  const kcal = luku(r.kcal ?? r.energia);
  if (kcal == null) return null;

  return {
    kcal: Math.round(kcal),
    proteiini: luku(r.proteiini ?? r.prot),
    hiilihydraatit: luku(r.hiilihydraatit ?? r.hh),
    sokeri: luku(r.sokeri ?? r.sok),
    rasva: luku(r.rasva),
    kuitu: luku(r.kuitu),
    lahde: 'kirjattu'
  };
}

/* ---------- Ohjeen rungon jäsennys ---------- */
function parseBody(body) {
  const vaiheet = [];
  const muistiinpanot = [];
  let inNotes = false;

  for (const line of body.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;

    if (/^#{1,6}\s*muistiinpan/i.test(t)) { inNotes = true; continue; }
    if (/^#{1,6}\s/.test(t)) { inNotes = false; continue; }

    if (inNotes) {
      muistiinpanot.push(t.replace(/^[-*]\s+/, ''));
    } else {
      vaiheet.push(t.replace(/^\d+[.)]\s*/, '').replace(/^[-*]\s+/, ''));
    }
  }
  return { vaiheet, muistiinpanot };
}

/* ---------- Tagien vienti lomakkeeseen ---------- */
// Lomake on yksittäinen tiedosto ilman verkkoyhteyttä, joten tagiluettelo
// kirjoitetaan siihen suoraan. Merkit säilyvät, joten tämän voi ajaa uudestaan.
function paivitaLomakkeenTagit(reseptit) {
  if (!fs.existsSync(LOMAKE)) return;

  const laskurit = new Map();
  for (const r of reseptit) {
    for (const t of r.tagit) {
      const tagi = String(t).trim().toLowerCase();
      if (tagi) laskurit.set(tagi, (laskurit.get(tagi) || 0) + 1);
    }
  }

  const jarjestetty = [...laskurit.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'fi')
  );

  const lomake = fs.readFileSync(LOMAKE, 'utf8');
  const merkit = /\/\*__TAGIT__\*\/[\s\S]*?\/\*__TAGIT_LOPPU__\*\//;

  if (!merkit.test(lomake)) {
    console.warn('  huom: lisaa-resepti.html:stä ei löydy tagimerkkejä — ohitettu');
    return;
  }

  const uusi = lomake.replace(
    merkit,
    '/*__TAGIT__*/' + JSON.stringify(jarjestetty) + '/*__TAGIT_LOPPU__*/'
  );

  if (uusi !== lomake) fs.writeFileSync(LOMAKE, uusi, 'utf8');
  console.log('Lomakkeen tagit: ' + jarjestetty.length + ' kpl');
}

/* ---------- Kokoa ---------- */
function build() {
  if (!fs.existsSync(RECIPES_DIR)) {
    console.error('Kansiota recipes/ ei löydy.');
    process.exit(1);
  }

  const files = fs.readdirSync(RECIPES_DIR).filter(f => f.endsWith('.md'));
  const reseptit = [];
  const tuntemattomat = new Map();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(RECIPES_DIR, file), 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    const { vaiheet, muistiinpanot } = parseBody(body);

    if (!meta.otsikko) {
      console.warn('  ohitettu (ei otsikkoa): ' + file);
      continue;
    }

    // Väliotsikko ainesluettelossa: rivi, joka päättyy kaksoispisteeseen
    // eikä ala määrällä ("- Marinadi:"). Seuraavat ainekset kuuluvat siihen.
    const ainekset = [];
    let osio = null;
    for (const rivi of (meta.ainekset || [])) {
      const t = String(rivi).trim();
      if (/:$/.test(t) && !/^\d/.test(t)) {
        osio = t.slice(0, -1).trim() || null;
        continue;
      }
      const a = parseIngredient(t);
      if (!a) continue;
      if (osio) a.osio = osio;
      ainekset.push(a);
    }

    const annokset = parseInt(meta.annokset, 10) || 4;

    const tyoaika = meta.aika || null;
    const odotusaika = meta.odotusaika || null;

    const tyoMin = aikaMinuutteina(tyoaika);
    const odotusMin = aikaMinuutteina(odotusaika);
    const yhteensa = (tyoMin != null && odotusMin != null)
      ? muotoileMinuutit(tyoMin + odotusMin) : null;

    const ravinto = kirjattuRavinto(meta) || laskeRavinto(ainekset, annokset);
    if (ravinto && ravinto.puuttuvat) {
      for (const p of ravinto.puuttuvat) {
        tuntemattomat.set(p, (tuntemattomat.get(p) || 0) + 1);
      }
      delete ravinto.puuttuvat;   // ei tarvita sivustolla
    }

    reseptit.push({
      id: file.replace(/\.md$/, ''),
      otsikko: meta.otsikko,
      annokset,
      aika: yhdistaAika(tyoaika, odotusaika),
      tyoaika,
      odotusaika,
      aikaYhteensa: yhteensa,
      aikaMin: tyoMin != null || odotusMin != null
        ? (tyoMin || 0) + (odotusMin || 0) : null,
      tagit: meta.tagit || [],
      kuvaus: meta.kuvaus || null,
      lahde: meta.lahde || null,
      ravinto,
      ainekset,
      vaiheet,
      muistiinpanot
    });
  }

  reseptit.sort((a, b) => a.otsikko.localeCompare(b.otsikko, 'fi'));

  if (!fs.existsSync(SITE_DIR)) fs.mkdirSync(SITE_DIR, { recursive: true });

  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const html = template.replace(
    '/*__RESEPTIT__*/[]',
    JSON.stringify(reseptit)
  );

  fs.writeFileSync(path.join(SITE_DIR, 'index.html'), html, 'utf8');

  console.log('Valmis: ' + reseptit.length + ' reseptiä -> site/index.html');
  for (const r of reseptit) {
    const rav = r.ravinto
      ? r.ravinto.kcal + ' kcal/annos' +
        (r.ravinto.lahde === 'kirjattu' ? ', kirjattu'
          : ', ' + r.ravinto.katettu + '/' + r.ravinto.ainesmaara + ' ainesta')
      : 'ei ravintoarvoja';
    console.log('  · ' + r.otsikko + ' (' + r.ainekset.length + ' ainesta, ' + rav + ')');
  }

  if (tuntemattomat.size) {
    console.log('\nAineksia, joita ravintotaulukosta ei löydy:');
    for (const [nimi, lkm] of [...tuntemattomat.entries()].sort((a, b) => b[1] - a[1])) {
      console.log('  ? ' + nimi + (lkm > 1 ? ' (' + lkm + ' reseptissä)' : ''));
    }
    console.log('  Lisää ne ravintotaulukko.js:ään, jos haluat ne mukaan laskentaan.');
  }

  paivitaLomakkeenTagit(reseptit);
}

build();
