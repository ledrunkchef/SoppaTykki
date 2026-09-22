# SoppaTykki

CookBook á la Maks — henkilökohtainen keittokirja. Reseptit ovat tavallisia
tekstitiedostoja, sivusto rakentuu niistä yhdeksi HTML-tiedostoksi. Ei
riippuvuuksia, ei palvelinta, ei mitään päivitettävää.

Julkaistu osoitteessa **https://ledrunkchef.github.io/SoppaTykki/**

```
SoppaTykki/
├── recipes/            ← reseptit, yksi .md-tiedosto kutakin kohden
├── template.html       ← sivuston ulkoasu ja toiminnallisuus
├── build.js            ← kokoaa reseptit sivustoksi
├── lisaa-resepti.html  ← lomake uuden reseptin lisäämiseen
├── paivita.command     ← kaksoisklikattava: rakentaa ja julkaisee
├── site/index.html     ← generoitu sivusto (ei mene gitiin)
└── .github/workflows/  ← GitHub rakentaa ja julkaisee sivuston
```

## Reseptin lisääminen

Kolme tapaa, kaikki päätyvät samaan `.md`-tiedostoon:

1. **Lomakkeella.** Avaa `lisaa-resepti.html` Chromessa, valitse SoppaTykki-kansio
   kerran, täytä kentät ja tallenna.
2. **Claudelle sanomalla.** "Lisää carbonara, jossa on guancialea" — Claude
   kirjoittaa tiedoston suoraan `recipes/`-kansioon.
3. **Käsin.** Kopioi mikä tahansa olemassa oleva resepti ja muokkaa.

Lisäyksen jälkeen **kaksoisklikkaa `paivita.command`**. Se rakentaa sivuston,
tallentaa muutokset ja lähettää ne GitHubiin, joka julkaisee uuden version
noin minuutissa. Osoite pysyy aina samana.

## Reseptin muoto

```markdown
---
otsikko: Gyozan dippikastike
annokset: 4
aika: 5 min
odotusaika: 10 min
tagit: [aasialainen, kastike, nopea]
kuvaus: Peruskastike gyozalle.
ainekset:
  - 3 rkl soijakastiketta
  - 0,5 tl chilihiutaleita
  - ripaus suolaa
---

1. Sekoita ainekset kulhossa.
2. Anna tekeytyä 10 minuuttia.

## Muistiinpanot

- Ensi kerralla vähemmän suolaa.
```

**Ainesrivit** kirjoitetaan luonnollisesti: määrä ensin, sitten yksikkö,
sitten aines. Skripti tunnistaa määrän ja skaalaa sen annosmäärän mukana.
Desimaalit pilkulla (`0,5 tl`), murtoluvut kauttaviivalla (`1/2 dl`),
vaihteluvälit viivalla (`2-3 rkl`). Rivi ilman määrää (`ripaus suolaa`)
näytetään sellaisenaan eikä sitä skaalata.

Tunnistetut yksiköt: g, kg, mg, ml, cl, dl, l, rkl, tl, kpl, prk, tlk, pss,
nippu, pala, viipale, kynsi, oksa, annos, purkki, levy. Tuntematon sana menee
osaksi aineksen nimeä — määrä skaalautuu silti oikein.

**Aika jaetaan kahtia.** `aika` on aktiivista työtä — aika, jonka seisot
keittiössä. `odotusaika` on passiivista: uuni, kohoaminen, marinointi,
jäähdytys. Luettelossa näkyy `20 min + 2 h`, reseptinäkymässä molemmat
erikseen ja yhteisaika. Kumpi tahansa voi olla vapaata tekstia (`yön yli`);
yhteisaika lasketaan vain, jos molemmat ovat tulkittavissa minuuteiksi.

**Tagit** valitaan lomakkeella klikkaamalla jo käytössä olevia. `build.js`
kirjoittaa luettelon `lisaa-resepti.html`:ään, ja lomake lukee sen lisäksi
suoraan `recipes/`-kansiosta, kun kansio on valittu.

**Ravintoarvot lasketaan automaattisesti** ainesriveistä `ravintotaulukko.js`:n
avulla, annosta kohden. Mitään ei tarvitse täyttää käsin. Jos jokin aines
puuttuu taulukosta, `node build.js` sanoo sen nimeltä ajon lopuksi — lisää rivi
taulukkoon, niin se on mukana ensi kerralla.

Laskennan voi ohittaa kirjoittamalla reseptiin omat arvot (annosta kohden):

```markdown
ravinto:
  kcal: 520
  proteiini: 18
  hiilihydraatit: 62
  sokeri: 14
  rasva: 21
  kuitu: 9
```

Luvut ovat arvioita: taulukossa on tyypillisiä arvoja, eivät tuotekohtaisia.
Sivustolla lukee sen vuoksi "arvio".

**Vain `otsikko` ja `ainekset` ovat pakollisia.** Kaikki muu on valinnaista.

## Ennen julkaisua

Uusi resepti oikoluetaan ennen kuin se menee ulos: kirjoitusasu, yhdyssanat,
tuotenimien isot alkukirjaimet, vaiheiden johdonmukaisuus ja se, että
ainesluettelo ja vaiheet puhuvat samoista aineksista. Lomakkeella kirjoitettu
resepti menee suoraan kansioon ilman tarkistusta, joten tarkistus tehdään
ennen `paivita.command`-ajoa.

## Miten julkaisu toimii

Kansio on git-repositorio, joka on yhteydessä GitHubiin. Kun muutokset
lähetetään, `.github/workflows/deploy.yml` käynnistyy GitHubin palvelimilla,
ajaa `node build.js` ja julkaisee `site/`-kansion GitHub Pagesiin.

`site/`-kansio ei mene gitiin, koska GitHub rakentaa sen joka kerta uudelleen.
Paikallinen `site/index.html` on vain esikatselua varten.

**Repositorio on julkinen.** Ilmaisella GitHub-tilillä Pages julkaisee vain
julkisesta repositoriosta, joten myös reseptitiedostot ovat kenen tahansa
luettavissa. Älä siis kirjoita resepteihin mitään, mitä et halua julkiseksi.

## Miksi näin

Reseptit ovat tekstitiedostoja, koska ne ovat luettavissa ilman tätä
ohjelmistoa vielä kahdenkymmenen vuoden päästä. Sivusto on yksi tiedosto ilman
riippuvuuksia eikä lataa mitään verkosta, koska silloin ei ole mitään, mikä
voisi hajota päivityksessä tai vaatia ylläpitoa.
