# StatAtlas — National Statistics Explorer

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/jokelord45/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/jokelord45/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

Entry for the [Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539) bounty on [make.fun](https://make.fun).

## The site

**StatAtlas** is an original national statistics explorer that runs entirely offline from static files. It covers eight countries — Indonesia, India, United States, Japan, Germany, Brazil, Nigeria and France — with 2024 figures for population, GDP, GDP per capita, life expectancy, median age, urban share, literacy, unemployment, inflation, CO₂ per capita and internet use, each with its named source.

Five pages, all reached from the header navigation:

1. **Overview** — world-at-a-glance KPIs, a featured country, population and GDP ranking charts, and a full population ranking table.
2. **Country** — per-country KPIs, a 2015–2024 population line chart, an age-structure donut chart, a full indicator table with sources, and country facts.
3. **Compare** — pick two or three countries and see every indicator side by side, with the highest value in each row highlighted, plus GDP-per-capita and life-expectancy bar charts.
4. **Indicators** — one sortable table for all eight countries; choose any of the eleven indicators and flip the sort direction.
5. **Regions** — Indonesia's ten largest provinces by population, with a bar chart and shares of the national total; plus a **Sources & method** page listing every source, edition and rounding rule.

Every chart is hand-rolled SVG (no libraries, no network requests), the layout is responsive down to a 390 px phone, and a header search jumps straight to any country.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Data

Figures are rounded estimates compiled from the World Bank World Development Indicators and UN World Population Prospects, 2024 edition (plus UNESCO, ILO, IMF, Global Carbon Budget, ITU and BPS Statistics Indonesia — see the Sources & method page in the site for the full list). The dataset is bundled in `app/data.js`; the site fetches nothing.
