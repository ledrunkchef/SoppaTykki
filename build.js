#!/usr/bin/env node
/*
 * CookBook á la Maks — build script
 *
 * Lukee recipes/*.md ja tuottaa site/index.html:n, joka sisältää kaiken:
 * ei riippuvuuksia, ei palvelinta, ei mitään päivitettävää.
 *
 * Käyttö:  node build.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const RECIPES_DIR = path.join(ROOT, 'recipes');
const SITE_DIR = path.join(ROOT, 'site');
const TEMPLATE = path.join(ROOT, 'template.html');

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

/* ---------- Frontmatterin jäsennys ---------- */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw.trim() };

  const meta = {};
  let currentListKey = null;

  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim()) continue;

    // Listan alkio: "  - jotain"
    const item = line.match(/^\s*-\s+(.*)$/);
    if (item && currentListKey) {
      meta[currentListKey].push(stripQuotes(item[1].trim()));
      continue;
    }

    const kv = line.match(/^([A-Za-zÅÄÖåäö_][A-Za-zÅÄÖåäö0-9_]*)\s*:\s*(.*)$/);
    if (!kv) continue;

    const key = kv[1].trim();
    const val = kv[2].trim();

    if (val === '') {
      // Seuraavilla riveillä tulee lista
      meta[key] = [];
      currentListKey = key;
    } else if (val.startsWith('[') && val.endsWith(']')) {
      // Inline-lista: [a, b, c]
      meta[key] = val.slice(1, -1).split(',')
        .map(s => stripQuotes(s.trim())).filter(Boolean);
      currentListKey = null;
    } else {
      meta[key] = stripQuotes(val);
      currentListKey = null;
    }
  }
  return { meta, body: (m[2] || '').trim() };
}

function stripQuotes(s) {
  return s.replace(/^["'](.*)["']$/, '$1');
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

/* ---------- Kokoa ---------- */
function build() {
  if (!fs.existsSync(RECIPES_DIR)) {
    console.error('Kansiota recipes/ ei löydy.');
    process.exit(1);
  }

  const files = fs.readdirSync(RECIPES_DIR).filter(f => f.endsWith('.md'));
  const reseptit = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(RECIPES_DIR, file), 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    const { vaiheet, muistiinpanot } = parseBody(body);

    if (!meta.otsikko) {
      console.warn('  ohitettu (ei otsikkoa): ' + file);
      continue;
    }

    const ainekset = (meta.ainekset || [])
      .map(parseIngredient).filter(Boolean);

    reseptit.push({
      id: file.replace(/\.md$/, ''),
      otsikko: meta.otsikko,
      annokset: parseInt(meta.annokset, 10) || 4,
      aika: meta.aika || null,
      tagit: meta.tagit || [],
      kuvaus: meta.kuvaus || null,
      lahde: meta.lahde || null,
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
    console.log('  · ' + r.otsikko + ' (' + r.ainekset.length + ' ainesta)');
  }
}

build();
