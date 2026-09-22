/*
 * CookBook á la Maks — ravintoarvotaulukko
 *
 * Tyypillisiä arvoja 100 grammaa kohden. Suuruusluokat vastaavat Finelin
 * (THL) lukuja, mutta nämä ovat pyöristettyjä keskiarvoja: tuotekohtaiset
 * erot ovat helposti kymmeniä prosentteja. Siksi sivustolla lukee "arvio".
 *
 *   nimi   perusmuoto, jota etsitään ainesrivin sisältä (osumista pisin voittaa)
 *   muut   muut kirjoitusasut ja taivutusmuodot, joita ei löydy perusmuodosta
 *   kcal, prot, hh, sok, rasva, kuitu   grammaa (paitsi kcal) / 100 g
 *   gDl    yhden desilitran paino grammoina  → tilavuusmitat
 *   gKpl   yhden kappaleen paino grammoina   → "4 keltuaista", "1 sipuli"
 *   mitaton  aines, jonka ravintosisältö on reseptin mittakaavassa nolla
 *            (suola, vesi, mausteripaukset) — lasketaan katetuksi ilman määrää
 *
 * Puuttuvan aineksen voi lisätä tähän, tai kirjoittaa reseptiin oman
 * ravinto:-lohkon, joka ohittaa laskennan kokonaan.
 */

module.exports = [
  /* ---------- Viljat, jauhot, pasta ---------- */
  { nimi: 'kaurahiutale', kcal: 370, prot: 13.5, hh: 58, sok: 1, rasva: 7, kuitu: 10, gDl: 35 },
  { nimi: 'ruishiutale', kcal: 340, prot: 11, hh: 60, sok: 1, rasva: 2, kuitu: 14, gDl: 35 },
  { nimi: 'vehnäjauho', kcal: 340, prot: 10, hh: 69, sok: 1, rasva: 1.5, kuitu: 3.5, gDl: 60 },
  { nimi: 'ruisjauho', kcal: 325, prot: 9, hh: 60, sok: 1, rasva: 2, kuitu: 14, gDl: 55 },
  { nimi: 'grahamjauho', kcal: 330, prot: 11, hh: 60, sok: 1, rasva: 2, kuitu: 10, gDl: 55 },
  { nimi: 'mantelijauho', kcal: 600, prot: 24, hh: 6, sok: 4, rasva: 52, kuitu: 10, gDl: 40 },
  { nimi: 'perunajauho', kcal: 330, prot: 0.5, hh: 80, sok: 0, rasva: 0.1, kuitu: 0, gDl: 65 },
  { nimi: 'maissitärkkelys', kcal: 340, prot: 0.3, hh: 85, sok: 0, rasva: 0.1, kuitu: 0, gDl: 55 },
  { nimi: 'kauralese', kcal: 350, prot: 15, hh: 45, sok: 1, rasva: 8, kuitu: 15, gDl: 30 },
  { nimi: 'korppujauho', kcal: 380, prot: 12, hh: 72, sok: 4, rasva: 4, kuitu: 4, gDl: 45 },
  { nimi: 'spagetti', kcal: 360, prot: 12.5, hh: 70, sok: 3, rasva: 1.5, kuitu: 3, gDl: 45 },
  { nimi: 'pasta', kcal: 360, prot: 12.5, hh: 70, sok: 3, rasva: 1.5, kuitu: 3, gDl: 45 },
  { nimi: 'makaroni', kcal: 360, prot: 12.5, hh: 70, sok: 3, rasva: 1.5, kuitu: 3, gDl: 45 },
  { nimi: 'nuudeli', kcal: 350, prot: 11, hh: 70, sok: 2, rasva: 2, kuitu: 3, gDl: 45 },
  { nimi: 'riisi', kcal: 355, prot: 7, hh: 78, sok: 0.5, rasva: 1, kuitu: 1.5, gDl: 85 },
  { nimi: 'couscous', kcal: 355, prot: 12, hh: 72, sok: 1, rasva: 1.5, kuitu: 5, gDl: 75 },
  { nimi: 'ohrasuurimo', kcal: 340, prot: 10, hh: 65, sok: 1, rasva: 2, kuitu: 10, gDl: 80 },
  { nimi: 'leipä', kcal: 260, prot: 8.5, hh: 45, sok: 3, rasva: 3, kuitu: 5, gKpl: 35 },
  { nimi: 'tortilla', kcal: 300, prot: 8, hh: 50, sok: 3, rasva: 7, kuitu: 3, gKpl: 50 },
  { nimi: 'patonki', kcal: 270, prot: 9, hh: 52, sok: 2.5, rasva: 1.5, kuitu: 3, gKpl: 250 },
  { nimi: 'leivinjauhe', kcal: 100, prot: 0, hh: 25, sok: 0, rasva: 0, kuitu: 0, mitaton: true },
  { nimi: 'hiiva', kcal: 100, prot: 12, hh: 5, sok: 0, rasva: 2, kuitu: 5, mitaton: true },

  /* ---------- Maitotuotteet ja munat ---------- */
  { nimi: 'rasvaton maito', kcal: 33, prot: 3.4, hh: 4.8, sok: 4.8, rasva: 0.1, kuitu: 0, gDl: 103 },
  { nimi: 'kevytmaito', kcal: 42, prot: 3.4, hh: 4.8, sok: 4.8, rasva: 1.5, kuitu: 0, gDl: 103 },
  { nimi: 'täysmaito', kcal: 62, prot: 3.3, hh: 4.7, sok: 4.7, rasva: 3.5, kuitu: 0, gDl: 103 },
  { nimi: 'maito', kcal: 42, prot: 3.4, hh: 4.8, sok: 4.8, rasva: 1.5, kuitu: 0, gDl: 103 },
  { nimi: 'kaurajuoma', kcal: 45, prot: 1, hh: 7, sok: 4, rasva: 1.5, kuitu: 0.8, gDl: 103 },
  { nimi: 'kookosmaito', kcal: 190, prot: 2, hh: 3, sok: 2.5, rasva: 19, kuitu: 0, gDl: 100 },
  { nimi: 'ruokakerma', kcal: 190, prot: 2.5, hh: 4, sok: 4, rasva: 18, kuitu: 0, gDl: 102 },
  { nimi: 'vispikerma', kcal: 340, prot: 2, hh: 3, sok: 3, rasva: 36, kuitu: 0, gDl: 100 },
  { nimi: 'kerma', kcal: 290, prot: 2.3, hh: 3.5, sok: 3.5, rasva: 30, kuitu: 0, gDl: 100 },
  { nimi: 'kermaviili', kcal: 170, prot: 3, hh: 4, sok: 4, rasva: 15, kuitu: 0, gDl: 100 },
  { nimi: 'smetana', kcal: 200, prot: 3, hh: 4, sok: 4, rasva: 19, kuitu: 0, gDl: 100 },
  { nimi: 'creme fraiche', muut: ['crème fraîche'], kcal: 290, prot: 2.5, hh: 3, sok: 3, rasva: 30, kuitu: 0, gDl: 100 },
  { nimi: 'luonnonjogurtti', kcal: 60, prot: 3.5, hh: 4.5, sok: 4.5, rasva: 3, kuitu: 0, gDl: 103 },
  { nimi: 'turkkilainen jogurtti', kcal: 120, prot: 5, hh: 4, sok: 4, rasva: 9, kuitu: 0, gDl: 103 },
  { nimi: 'jogurtti', kcal: 85, prot: 3, hh: 13, sok: 12, rasva: 2.5, kuitu: 0, gDl: 103 },
  { nimi: 'rahka', kcal: 80, prot: 12, hh: 4, sok: 4, rasva: 0.3, kuitu: 0, gDl: 105 },
  { nimi: 'raejuusto', kcal: 100, prot: 13, hh: 3, sok: 3, rasva: 4, kuitu: 0, gDl: 100 },
  { nimi: 'maapähkinävoi', kcal: 600, prot: 25, hh: 14, sok: 6, rasva: 50, kuitu: 6, gDl: 107 },
  { nimi: 'voi', kcal: 730, prot: 0.6, hh: 0.6, sok: 0.6, rasva: 81, kuitu: 0, gDl: 95 },
  { nimi: 'margariini', kcal: 540, prot: 0.2, hh: 0.5, sok: 0.3, rasva: 60, kuitu: 0, gDl: 95 },
  { nimi: 'parmesaani', kcal: 400, prot: 33, hh: 1, sok: 0.9, rasva: 29, kuitu: 0 },
  { nimi: 'pecorino', kcal: 390, prot: 28, hh: 1, sok: 1, rasva: 30, kuitu: 0 },
  { nimi: 'gruyère', muut: ['gruyere'], kcal: 410, prot: 30, hh: 0.4, sok: 0.4, rasva: 32, kuitu: 0 },
  { nimi: 'vacherin', kcal: 380, prot: 25, hh: 1, sok: 0.5, rasva: 31, kuitu: 0 },
  { nimi: 'emmental', kcal: 380, prot: 28, hh: 1, sok: 0.5, rasva: 30, kuitu: 0 },
  { nimi: 'mozzarella', kcal: 250, prot: 18, hh: 2, sok: 1, rasva: 19, kuitu: 0 },
  { nimi: 'fetajuusto', muut: ['feta'], kcal: 265, prot: 14, hh: 1.5, sok: 1, rasva: 22, kuitu: 0 },
  { nimi: 'sinihomejuusto', kcal: 350, prot: 21, hh: 1, sok: 0.5, rasva: 29, kuitu: 0 },
  { nimi: 'tuorejuusto', kcal: 250, prot: 6, hh: 3, sok: 3, rasva: 24, kuitu: 0 },
  { nimi: 'juusto', kcal: 350, prot: 25, hh: 1, sok: 0.5, rasva: 27, kuitu: 0 },
  { nimi: 'kananmuna', muut: ['muna'], kcal: 140, prot: 12.5, hh: 0.7, sok: 0.7, rasva: 10, kuitu: 0, gKpl: 55 },
  { nimi: 'keltuain', kcal: 320, prot: 16, hh: 1, sok: 0.6, rasva: 28, kuitu: 0, gKpl: 17 },
  { nimi: 'valkuain', kcal: 50, prot: 11, hh: 0.7, sok: 0.7, rasva: 0.2, kuitu: 0, gKpl: 33 },

  /* ---------- Liha, kala, äyriäiset ---------- */
  { nimi: 'jauheliha', kcal: 200, prot: 19, hh: 0.5, sok: 0, rasva: 13, kuitu: 0 },
  { nimi: 'naudan', muut: ['nauta', 'härkä'], kcal: 150, prot: 21, hh: 0, sok: 0, rasva: 7, kuitu: 0 },
  { nimi: 'possu', muut: ['porsa', 'sian'], kcal: 160, prot: 20, hh: 0, sok: 0, rasva: 9, kuitu: 0 },
  { nimi: 'broileri', muut: ['kanan', 'kana '], kcal: 115, prot: 22, hh: 0, sok: 0, rasva: 2.5, kuitu: 0 },
  { nimi: 'kalkkuna', kcal: 110, prot: 23, hh: 0, sok: 0, rasva: 2, kuitu: 0 },
  { nimi: 'guanciale', kcal: 450, prot: 12, hh: 0, sok: 0, rasva: 45, kuitu: 0 },
  { nimi: 'pancetta', kcal: 420, prot: 15, hh: 0.5, sok: 0, rasva: 40, kuitu: 0 },
  { nimi: 'pekoni', kcal: 400, prot: 14, hh: 0.5, sok: 0, rasva: 38, kuitu: 0 },
  { nimi: 'kinkku', kcal: 130, prot: 19, hh: 1, sok: 1, rasva: 5, kuitu: 0 },
  { nimi: 'makkara', kcal: 290, prot: 12, hh: 5, sok: 2, rasva: 24, kuitu: 0 },
  { nimi: 'lohi', kcal: 200, prot: 20, hh: 0, sok: 0, rasva: 13, kuitu: 0 },
  { nimi: 'kirjolohi', kcal: 170, prot: 20, hh: 0, sok: 0, rasva: 10, kuitu: 0 },
  { nimi: 'silakka', kcal: 190, prot: 17, hh: 0, sok: 0, rasva: 14, kuitu: 0 },
  { nimi: 'tonnikala', kcal: 110, prot: 24, hh: 0, sok: 0, rasva: 1, kuitu: 0 },
  { nimi: 'katkarapu', kcal: 85, prot: 18, hh: 0, sok: 0, rasva: 1, kuitu: 0 },

  /* ---------- Kasvikset ---------- */
  { nimi: 'valkosipuli', kcal: 130, prot: 6, hh: 24, sok: 1, rasva: 0.5, kuitu: 2, gKpl: 4 },
  { nimi: 'salottisipuli', kcal: 45, prot: 1.5, hh: 8, sok: 4, rasva: 0.1, kuitu: 2, gKpl: 25 },
  { nimi: 'kevätsipuli', kcal: 30, prot: 1.8, hh: 4, sok: 2, rasva: 0.2, kuitu: 2, gKpl: 15 },
  { nimi: 'punasipuli', kcal: 40, prot: 1.2, hh: 7, sok: 5, rasva: 0.1, kuitu: 1.8, gKpl: 100 },
  { nimi: 'purjo', kcal: 35, prot: 1.5, hh: 5, sok: 3, rasva: 0.3, kuitu: 2, gKpl: 150 },
  { nimi: 'sipuli', kcal: 40, prot: 1.2, hh: 7, sok: 5, rasva: 0.1, kuitu: 1.8, gKpl: 100 },
  { nimi: 'porkkan', kcal: 35, prot: 0.7, hh: 6, sok: 5, rasva: 0.2, kuitu: 3, gKpl: 80, gDl: 70 },
  { nimi: 'peruna', muut: ['peruno'], kcal: 75, prot: 2, hh: 15, sok: 1, rasva: 0.1, kuitu: 1.5, gKpl: 110 },
  { nimi: 'bataatti', kcal: 90, prot: 1.6, hh: 19, sok: 6, rasva: 0.1, kuitu: 3, gKpl: 150 },
  { nimi: 'tomaattimurska', kcal: 30, prot: 1.3, hh: 4.5, sok: 4, rasva: 0.2, kuitu: 1.3, gDl: 105 },
  { nimi: 'tomaattipyre', muut: ['tomaattisose'], kcal: 80, prot: 4, hh: 12, sok: 10, rasva: 0.5, kuitu: 3, gDl: 110 },
  { nimi: 'kirsikkatomaat', kcal: 22, prot: 0.9, hh: 3.5, sok: 3.5, rasva: 0.2, kuitu: 1.2, gKpl: 15 },
  { nimi: 'tomaat', kcal: 20, prot: 0.9, hh: 3, sok: 3, rasva: 0.2, kuitu: 1.2, gKpl: 100 },
  { nimi: 'paprika', kcal: 30, prot: 1, hh: 5, sok: 4, rasva: 0.3, kuitu: 2, gKpl: 150 },
  { nimi: 'kurkku', kcal: 15, prot: 0.6, hh: 2, sok: 2, rasva: 0.1, kuitu: 0.6, gKpl: 300 },
  { nimi: 'romainesalaat', kcal: 17, prot: 1.2, hh: 1.5, sok: 1, rasva: 0.3, kuitu: 2, gKpl: 160 },
  { nimi: 'salaat', kcal: 15, prot: 1.2, hh: 1.5, sok: 1, rasva: 0.3, kuitu: 1.5, gKpl: 150 },
  { nimi: 'pinaat', kcal: 25, prot: 3, hh: 1, sok: 0.5, rasva: 0.4, kuitu: 2.5, gDl: 30 },
  { nimi: 'parsakaali', muut: ['brokkoli'], kcal: 35, prot: 3, hh: 4, sok: 2, rasva: 0.4, kuitu: 3, gDl: 60 },
  { nimi: 'kukkakaali', kcal: 25, prot: 2, hh: 3, sok: 2, rasva: 0.3, kuitu: 2.5, gDl: 55 },
  { nimi: 'kaali', kcal: 25, prot: 1.4, hh: 4, sok: 3, rasva: 0.2, kuitu: 2.5, gDl: 55 },
  { nimi: 'herkkusien', muut: ['sien', 'siitake'], kcal: 25, prot: 3, hh: 1.5, sok: 1, rasva: 0.4, kuitu: 2, gDl: 45 },
  { nimi: 'kesäkurpitsa', kcal: 20, prot: 1.3, hh: 2, sok: 2, rasva: 0.3, kuitu: 1, gKpl: 250 },
  { nimi: 'munakoiso', kcal: 25, prot: 1, hh: 3, sok: 3, rasva: 0.2, kuitu: 2.5, gKpl: 300 },
  { nimi: 'herne', kcal: 80, prot: 5.5, hh: 11, sok: 4, rasva: 0.4, kuitu: 5, gDl: 70 },
  { nimi: 'maissi', kcal: 90, prot: 3, hh: 16, sok: 5, rasva: 1.2, kuitu: 3, gDl: 75 },
  { nimi: 'avokado', kcal: 190, prot: 2, hh: 2, sok: 0.5, rasva: 18, kuitu: 6.5, gKpl: 150 },
  { nimi: 'oliivi', kcal: 150, prot: 1, hh: 1, sok: 0.5, rasva: 15, kuitu: 3, gDl: 90 },
  { nimi: 'chili', kcal: 40, prot: 2, hh: 6, sok: 4, rasva: 0.4, kuitu: 1.5, gKpl: 10, mitaton: true },
  { nimi: 'inkivääri', kcal: 80, prot: 1.8, hh: 15, sok: 1.7, rasva: 0.8, kuitu: 2, gKpl: 30 },

  /* ---------- Palkokasvit, pähkinät, siemenet ---------- */
  { nimi: 'kikherne', kcal: 120, prot: 7, hh: 15, sok: 1, rasva: 2.5, kuitu: 6, gDl: 95 },
  { nimi: 'linssi', kcal: 340, prot: 25, hh: 48, sok: 2, rasva: 1.5, kuitu: 11, gDl: 85 },
  { nimi: 'papu', kcal: 130, prot: 8, hh: 18, sok: 0.5, rasva: 0.5, kuitu: 7, gDl: 95 },
  { nimi: 'tofu', kcal: 120, prot: 13, hh: 2, sok: 0.5, rasva: 7, kuitu: 1 },
  { nimi: 'manteli', kcal: 600, prot: 21, hh: 6, sok: 4, rasva: 52, kuitu: 11, gDl: 60 },
  { nimi: 'saksanpähkinä', kcal: 690, prot: 15, hh: 7, sok: 3, rasva: 65, kuitu: 6, gDl: 45 },
  { nimi: 'cashew', kcal: 580, prot: 18, hh: 27, sok: 6, rasva: 44, kuitu: 3, gDl: 60 },
  { nimi: 'maapähkinä', kcal: 590, prot: 25, hh: 12, sok: 4, rasva: 49, kuitu: 8, gDl: 60 },
  { nimi: 'chiansiemen', muut: ['chia'], kcal: 480, prot: 17, hh: 8, sok: 0, rasva: 31, kuitu: 34, gDl: 80 },
  { nimi: 'pellavansiemen', kcal: 530, prot: 18, hh: 3, sok: 1.5, rasva: 42, kuitu: 27, gDl: 70 },
  { nimi: 'seesaminsiemen', kcal: 570, prot: 18, hh: 10, sok: 0.3, rasva: 50, kuitu: 12, gDl: 60 },
  { nimi: 'auringonkukansiemen', kcal: 580, prot: 21, hh: 11, sok: 3, rasva: 50, kuitu: 9, gDl: 55 },
  { nimi: 'kurpitsansiemen', kcal: 560, prot: 25, hh: 10, sok: 1.5, rasva: 46, kuitu: 6, gDl: 55 },

  /* ---------- Rasvat ja öljyt ---------- */
  { nimi: 'oliiviöljy', kcal: 900, prot: 0, hh: 0, sok: 0, rasva: 100, kuitu: 0, gDl: 91 },
  { nimi: 'rypsiöljy', kcal: 900, prot: 0, hh: 0, sok: 0, rasva: 100, kuitu: 0, gDl: 91 },
  { nimi: 'seesamiöljy', kcal: 900, prot: 0, hh: 0, sok: 0, rasva: 100, kuitu: 0, gDl: 91 },
  { nimi: 'kookosöljy', kcal: 900, prot: 0, hh: 0, sok: 0, rasva: 100, kuitu: 0, gDl: 91 },
  { nimi: 'öljy', kcal: 900, prot: 0, hh: 0, sok: 0, rasva: 100, kuitu: 0, gDl: 91 },

  /* ---------- Makeutus ---------- */
  { nimi: 'hunaja', kcal: 320, prot: 0.3, hh: 80, sok: 80, rasva: 0, kuitu: 0, gDl: 140 },
  { nimi: 'fariinisokeri', kcal: 380, prot: 0, hh: 97, sok: 95, rasva: 0, kuitu: 0, gDl: 85 },
  { nimi: 'vaniljasokeri', kcal: 400, prot: 0, hh: 100, sok: 100, rasva: 0, kuitu: 0, gDl: 85 },
  { nimi: 'sokeri', kcal: 400, prot: 0, hh: 100, sok: 100, rasva: 0, kuitu: 0, gDl: 85 },
  { nimi: 'siirappi', kcal: 300, prot: 0, hh: 75, sok: 70, rasva: 0, kuitu: 0, gDl: 140 },
  { nimi: 'kaakaojauhe', kcal: 350, prot: 20, hh: 15, sok: 1, rasva: 14, kuitu: 30, gDl: 45 },
  { nimi: 'tumma suklaa', muut: ['suklaa'], kcal: 550, prot: 7, hh: 45, sok: 35, rasva: 35, kuitu: 8 },

  /* ---------- Mausteet ja nesteet ---------- */
  { nimi: 'suola', kcal: 0, prot: 0, hh: 0, sok: 0, rasva: 0, kuitu: 0, gDl: 120, mitaton: true },
  { nimi: 'pippuri', kcal: 250, prot: 10, hh: 50, sok: 1, rasva: 3, kuitu: 25, gDl: 45, mitaton: true },
  { nimi: 'kaneli', kcal: 250, prot: 4, hh: 55, sok: 2, rasva: 3, kuitu: 53, gDl: 45, mitaton: true },
  { nimi: 'kardemumma', kcal: 310, prot: 11, hh: 40, sok: 0, rasva: 7, kuitu: 28, gDl: 45, mitaton: true },
  { nimi: 'muskotti', kcal: 520, prot: 6, hh: 28, sok: 3, rasva: 36, kuitu: 21, gDl: 45, mitaton: true },
  { nimi: 'yrtti', muut: ['persilj', 'basilika', 'timjami', 'rosmariini', 'korianteri', 'tilli'], kcal: 40, prot: 3, hh: 4, sok: 0.5, rasva: 0.8, kuitu: 3, gDl: 15, mitaton: true },
  { nimi: 'vesi', muut: ['vettä', 'vedellä'], kcal: 0, prot: 0, hh: 0, sok: 0, rasva: 0, kuitu: 0, gDl: 100, mitaton: true },
  { nimi: 'liemi', kcal: 5, prot: 0.3, hh: 0.5, sok: 0.3, rasva: 0.1, kuitu: 0, gDl: 100 },
  { nimi: 'soijakastike', kcal: 60, prot: 8, hh: 5, sok: 1.5, rasva: 0, kuitu: 0, gDl: 115 },
  { nimi: 'kalakastike', kcal: 50, prot: 8, hh: 4, sok: 4, rasva: 0, kuitu: 0, gDl: 115 },
  { nimi: 'riisiviinietikka', kcal: 20, prot: 0, hh: 5, sok: 5, rasva: 0, kuitu: 0, gDl: 101 },
  { nimi: 'balsamico', muut: ['balsami'], kcal: 90, prot: 0.5, hh: 17, sok: 15, rasva: 0, kuitu: 0, gDl: 110 },
  { nimi: 'etikka', kcal: 20, prot: 0, hh: 1, sok: 1, rasva: 0, kuitu: 0, gDl: 101 },
  { nimi: 'sinappi', kcal: 150, prot: 6, hh: 6, sok: 2, rasva: 10, kuitu: 3, gDl: 110 },
  { nimi: 'ketsuppi', kcal: 110, prot: 1.5, hh: 25, sok: 22, rasva: 0.2, kuitu: 1, gDl: 110 },
  { nimi: 'majoneesi', kcal: 680, prot: 1, hh: 2, sok: 1.5, rasva: 75, kuitu: 0, gDl: 95 },
  { nimi: 'valkoviini', kcal: 80, prot: 0.1, hh: 2.5, sok: 1, rasva: 0, kuitu: 0, gDl: 99 },
  { nimi: 'punaviini', kcal: 85, prot: 0.1, hh: 2.5, sok: 0.6, rasva: 0, kuitu: 0, gDl: 99 },
  { nimi: 'kirsch', muut: ['konjakki', 'rommi'], kcal: 250, prot: 0, hh: 0, sok: 0, rasva: 0, kuitu: 0, gDl: 95 },
  { nimi: 'olut', kcal: 40, prot: 0.4, hh: 3, sok: 0.2, rasva: 0, kuitu: 0, gDl: 100 },

  /* ---------- Hedelmät ja marjat ---------- */
  { nimi: 'omen', kcal: 50, prot: 0.3, hh: 11, sok: 10, rasva: 0.2, kuitu: 2, gKpl: 150 },
  { nimi: 'banaani', kcal: 90, prot: 1, hh: 20, sok: 15, rasva: 0.3, kuitu: 2, gKpl: 120 },
  { nimi: 'sitruun', kcal: 30, prot: 0.9, hh: 3, sok: 2.5, rasva: 0.3, kuitu: 2.5, gKpl: 100 },
  { nimi: 'lime', kcal: 30, prot: 0.7, hh: 3, sok: 2, rasva: 0.2, kuitu: 2.5, gKpl: 70 },
  { nimi: 'appelsiini', kcal: 45, prot: 0.9, hh: 9, sok: 9, rasva: 0.2, kuitu: 2, gKpl: 180 },
  { nimi: 'mansik', kcal: 35, prot: 0.7, hh: 6, sok: 5, rasva: 0.4, kuitu: 2, gDl: 65 },
  { nimi: 'mustikka', muut: ['mustikoi'], kcal: 45, prot: 0.6, hh: 7, sok: 7, rasva: 0.6, kuitu: 3.5, gDl: 65 },
  { nimi: 'puolukka', muut: ['puolukoi'], kcal: 40, prot: 0.4, hh: 6, sok: 5, rasva: 0.6, kuitu: 3, gDl: 60 },
  { nimi: 'vadelma', muut: ['vadelmi'], kcal: 45, prot: 1.2, hh: 5, sok: 5, rasva: 0.6, kuitu: 5, gDl: 60 },
  { nimi: 'rusina', muut: ['rusino'], kcal: 300, prot: 3, hh: 70, sok: 65, rasva: 0.5, kuitu: 4, gDl: 65 },
  { nimi: 'taateli', kcal: 290, prot: 2.5, hh: 70, sok: 63, rasva: 0.4, kuitu: 8, gKpl: 8 }
];
