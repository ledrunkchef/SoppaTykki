#!/bin/bash
# Kaksoisklikkaa tätä Finderissa: rakentaa sivuston, tallentaa muutokset
# ja julkaisee ne GitHubiin.
cd "$(dirname "$0")" || exit 1

OSOITE="https://ledrunkchef.github.io/SoppaTykki/"

echo ""
echo "  SoppaTykki — päivitetään keittokirjaa…"
echo ""

lopeta() {
  echo ""
  read -r -p "  Paina Enter sulkeaksesi. "
  exit "${1:-0}"
}

if ! command -v node >/dev/null 2>&1; then
  echo "  Node.js:ää ei löydy. Asenna se osoitteesta https://nodejs.org"
  lopeta 1
fi

# 1. Rakenna sivusto paikallista esikatselua varten
if ! node build.js; then
  echo ""
  echo "  Rakennus epäonnistui. Katso virheilmoitus yltä."
  lopeta 1
fi

# 2. Tallenna ja julkaise
echo ""
if [ -z "$(git status --porcelain)" ]; then
  echo "  Ei uusia muutoksia julkaistavaksi."
else
  git add -A
  git commit -q -m "Reseptipäivitys $(date '+%-d.%-m.%Y %H:%M')"
  echo "  Muutokset tallennettu."

  if git remote | grep -q '^origin$'; then
    echo "  Lähetetään GitHubiin…"
    if git push -q 2>/dev/null; then
      echo ""
      echo "  Valmis. Sivusto päivittyy noin minuutissa:"
      echo "  $OSOITE"
    else
      echo ""
      echo "  Lähetys ei onnistunut. Avaa GitHub Desktop ja paina Push origin."
    fi
  else
    echo ""
    echo "  Repositoriota ei ole vielä julkaistu GitHubissa."
    echo "  Avaa GitHub Desktop ja paina Publish repository."
  fi
fi

# 3. Avaa paikallinen esikatselu
open site/index.html
lopeta 0
