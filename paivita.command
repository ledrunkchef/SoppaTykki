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

# Tallenna tunnukset avainnippuun, jottei niitä kysytä joka kerta.
if [ -z "$(git config --get credential.helper)" ]; then
  git config credential.helper osxkeychain
fi

if ! node build.js; then
  echo ""
  echo "  Rakennus epäonnistui. Katso virheilmoitus yltä."
  lopeta 1
fi

echo ""
if [ -z "$(git status --porcelain)" ]; then
  echo "  Ei uusia muutoksia julkaistavaksi."
  echo "  Sivusto: $OSOITE"
  lopeta 0
fi

git add -A
git commit -q -m "Reseptipäivitys $(date '+%-d.%-m.%Y %H:%M')"
echo "  Muutokset tallennettu."

if ! git remote | grep -q '^origin$'; then
  echo ""
  echo "  Repositoriota ei ole vielä julkaistu GitHubissa."
  echo "  Avaa GitHub Desktop ja paina Publish repository."
  lopeta 1
fi

echo "  Lähetetään GitHubiin…"
echo ""
if git push 2>&1 | sed 's/^/    /'; then
  echo ""
  echo "  Valmis. GitHub rakentaa sivuston noin minuutissa:"
  echo "  $OSOITE"
  echo ""
  echo "  Jos sivu näyttää vanhalta, paina selaimessa Cmd+Shift+R."
else
  echo ""
  echo "  Lähetys ei onnistunut. Katso virheilmoitus yltä."
fi

lopeta 0
