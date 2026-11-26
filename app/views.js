/* StatAtlas views — hash router and the five pages of the site. */
(function () {
  'use strict';

  var S = window.STATATLAS;
  var C = window.STATATLAS_CHARTS;
  var YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  var view = document.getElementById('view');

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function countryLink(c) {
    return '<a href="#/country/' + c.code + '">' + esc(c.name) + '</a>';
  }
  function sourceLine() {
    return '<p class="source-note">Sources: World Bank World Development Indicators and UN World Population Prospects, 2024 edition. Figures are rounded estimates — see <a href="#/about">Sources &amp; method</a>.</p>';
  }
  function kpiCard(label, value, sub, delta) {
    return '<div class="card kpi"><div class="kpi-label">' + esc(label) + '</div>' +
      '<div class="kpi-value">' + esc(value) + '</div>' +
      (sub ? '<div class="kpi-sub">' + esc(sub) + '</div>' : '') +
      (delta ? '<div class="kpi-delta">' + esc(delta) + '</div>' : '') + '</div>';
  }
  function chartCard(title, sub, svgNode, legendHtml) {
    var d = document.createElement('div');
    d.className = 'card chart-card';
    d.innerHTML = '<div class="chart-title">' + esc(title) + '</div><div class="chart-sub">' + esc(sub) + '</div>';
    d.appendChild(svgNode);
    if (legendHtml) {
      var leg = document.createElement('div');
      leg.className = 'legend';
      leg.innerHTML = legendHtml;
      d.appendChild(leg);
    }
    return d;
  }
  function setNav(active) {
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-nav') === active);
    });
  }

  /* ---------- Home / overview ---------- */
  function renderHome() {
    setNav('home');
    var featured = S.byCode('IDN');
    var sorted = S.COUNTRIES.slice().sort(function (a, b) { return b.population - a.population; });
    var gdpSorted = S.COUNTRIES.slice().sort(function (a, b) { return b.gdp - a.gdp; });
    var growth = ((featured.population - featured.popSeries[0]) / featured.popSeries[0] * 100).toFixed(1);

    var html = '<section class="hero"><h1>Every country, measured.</h1>' +
      '<p>StatAtlas gathers population, economy, health and society figures for countries around the world — each figure with its source and year, ready to compare side by side.</p>' +
      '<div class="hero-cta"><a class="btn" href="#/country/IDN">Explore Indonesia</a>' +
      '<a class="btn btn-ghost" href="#/compare">Compare countries</a></div></section>';

    html += '<h2>World at a glance · 2024</h2><div class="grid grid-4">' +
      kpiCard('World population', '8.24 billion', 'UN World Population Prospects 2024') +
      kpiCard('World GDP', '$111 trillion', 'World Bank WDI 2024') +
      kpiCard('Life expectancy', '73.3 years', 'World Bank WDI 2024') +
      kpiCard('People online', '68% of the world', 'ITU 2024') + '</div>';

    html += '<h2>Featured country — ' + esc(featured.name) + ' ' + featured.flag + '</h2>' +
      '<p class="lede">' + esc(featured.blurb) + '</p>' +
      '<div class="grid grid-4">' +
      kpiCard('Population', S.formatValue('population', featured.population), 'Capital: ' + featured.capital, '+' + growth + '% since 2015') +
      kpiCard('GDP', S.formatValue('gdp', featured.gdp), 'GDP per capita ' + S.formatValue('gdpPerCapita', featured.gdpPerCapita)) +
      kpiCard('Life expectancy', S.formatValue('lifeExpectancy', featured.lifeExpectancy) + ' years', 'World average 73.3 years') +
      kpiCard('Median age', S.formatValue('medianAge', featured.medianAge) + ' years', 'Urban population ' + featured.urbanShare + '%') + '</div>';

    html += '<h2>Browse all countries</h2><div class="chip-row">' +
      S.COUNTRIES.map(function (c) {
        return '<a class="chip" href="#/country/' + c.code + '">' + c.flag + ' ' + esc(c.name) + '</a>';
      }).join('') + '</div>';

    var host = document.createElement('div');
    host.innerHTML = html;
    var charts = document.createElement('div');
    charts.className = 'grid grid-2';
    charts.style.marginTop = '18px';
    charts.appendChild(chartCard('Largest populations, 2024',
      'Millions of people · UN World Population Prospects 2024',
      C.barChart(sorted.slice(0, 5).map(function (c) { return { label: c.name, value: c.population }; }),
        { label: 'Population', formatValue: function (v) { return v.toFixed(1) + 'M'; } })));
    charts.appendChild(chartCard('Largest economies, 2024',
      'Nominal GDP, US$ billions · World Bank WDI 2024',
      C.barChart(gdpSorted.slice(0, 5).map(function (c) { return { label: c.name, value: c.gdp }; }),
        { label: 'GDP', formatValue: function (v) { return '$' + v.toLocaleString('en-US') + 'B'; } })));
    host.appendChild(charts);

    var rank = document.createElement('div');
    rank.className = 'card';
    rank.style.marginTop = '16px';
    rank.innerHTML = '<h3 style="margin-top:0">Population ranking — all eight countries</h3><div class="table-wrap"><table>' +
      '<thead><tr><th>#</th><th>Country</th><th>Region</th><th class="num">Population</th><th class="num">GDP per capita</th><th class="num">Life expectancy</th></tr></thead><tbody>' +
      sorted.map(function (c, i) {
        return '<tr><td><span class="rank-badge">' + (i + 1) + '</span></td><td>' + countryLink(c) + '</td><td>' + esc(c.region) + '</td>' +
          '<td class="num">' + S.formatValue('population', c.population) + '</td>' +
          '<td class="num">' + S.formatValue('gdpPerCapita', c.gdpPerCapita) + '</td>' +
          '<td class="num">' + c.lifeExpectancy.toFixed(1) + ' years</td></tr>';
      }).join('') + '</tbody></table></div>' + sourceLine();
    host.appendChild(rank);
    view.innerHTML = '';
    view.appendChild(host);
  }

  /* ---------- Country page ---------- */
  function renderCountry(code) {
    var c = S.byCode(code);
    if (!c) { renderNotFound(code); return; }
    setNav('home');
    var growth10 = ((c.population - c.popSeries[0]) / c.popSeries[0] * 100);
    var host = document.createElement('div');
    host.innerHTML = '<p><a href="#/">&larr; All countries</a></p>' +
      '<h1>' + c.flag + ' ' + esc(c.name) + '</h1>' +
      '<p class="lede">' + esc(c.blurb) + '</p>' +
      '<div class="grid grid-4">' +
      kpiCard('Population', S.formatValue('population', c.population), 'Capital: ' + esc(c.capital), (growth10 >= 0 ? '+' : '') + growth10.toFixed(1) + '% since 2015') +
      kpiCard('GDP', S.formatValue('gdp', c.gdp), 'GDP per capita ' + S.formatValue('gdpPerCapita', c.gdpPerCapita)) +
      kpiCard('Life expectancy', c.lifeExpectancy.toFixed(1) + ' years', 'World average 73.3 years') +
      kpiCard('Median age', c.medianAge.toFixed(1) + ' years', 'Urban ' + c.urbanShare + '% · Internet ' + c.internetUsers + '%') + '</div>';

    var charts = document.createElement('div');
    charts.className = 'grid grid-2';
    charts.style.marginTop = '16px';
    charts.appendChild(chartCard('Population, 2015–2024',
      'Millions · UN World Population Prospects 2024',
      C.lineChart(c.popSeries, YEARS, { label: 'Population of ' + c.name, floorZero: false, formatAxis: function (v) { return v.toFixed(0); }, formatValue: function (v) { return v.toFixed(1) + 'M'; } })));
    var donut = C.donutChart([
      { label: 'Under 15', value: c.ageStructure.under15, color: '#2f8f83' },
      { label: 'Working age 15–64', value: c.ageStructure.working, color: '#f2a541' },
      { label: '65 and over', value: c.ageStructure.over65, color: '#12303a' }
    ], { label: 'Age structure of ' + c.name, center: c.medianAge.toFixed(1), centerSub: 'median age' });
    charts.appendChild(chartCard('Age structure, 2024',
      'Share of population · UN World Population Prospects 2024',
      donut,
      '<span><span class="sw" style="background:#2f8f83"></span>Under 15 — ' + c.ageStructure.under15 + '%</span>' +
      '<span><span class="sw" style="background:#f2a541"></span>Working age — ' + c.ageStructure.working + '%</span>' +
      '<span><span class="sw" style="background:#12303a"></span>65+ — ' + c.ageStructure.over65 + '%</span>'));
    host.appendChild(charts);

    var facts = document.createElement('div');
    facts.className = 'two-col';
    facts.style.marginTop = '16px';
    facts.innerHTML = '<div class="card"><h3 style="margin-top:0">All indicators — ' + esc(c.name) + ', 2024</h3><div class="table-wrap"><table>' +
      '<thead><tr><th>Indicator</th><th class="num">Value</th><th>Source</th></tr></thead><tbody>' +
      S.INDICATORS.map(function (ind) {
        return '<tr><td>' + esc(ind.label) + '<br><span class="source-note">' + esc(ind.unit) + '</span></td>' +
          '<td class="num"><strong>' + esc(S.formatValue(ind.key, c[ind.key])) + '</strong></td>' +
          '<td class="source-note">' + esc(ind.source) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>' +
      '<div class="card"><h3 style="margin-top:0">Country facts</h3><ul class="fact-list">' +
      '<li><span>Region</span><span class="fact-value">' + esc(c.region) + '</span></li>' +
      '<li><span>Capital</span><span class="fact-value">' + esc(c.capital) + '</span></li>' +
      '<li><span>Currency</span><span class="fact-value">' + esc(c.currency) + '</span></li>' +
      '<li><span>Language</span><span class="fact-value">' + esc(c.language) + '</span></li>' +
      '<li><span>World population rank</span><span class="fact-value">#' + (S.COUNTRIES.slice().sort(function (a, b) { return b.population - a.population; }).findIndex(function (x) { return x.code === c.code; }) + 1) + ' of 8 here</span></li>' +
      '</ul><div class="callout"><strong>How to use this page:</strong> compare ' + esc(c.name) + ' with another country on the ' +
      '<a href="#/compare">Compare page</a>, or see every indicator for all countries in the <a href="#/indicators">Indicators table</a>.</div></div>';
    host.appendChild(facts);
    host.insertAdjacentHTML('beforeend', sourceLine());
    view.innerHTML = '';
    view.appendChild(host);
  }

  /* ---------- Compare ---------- */
  function renderCompare(params) {
    setNav('compare');
    var a = S.byCode(params.get('a')) || S.byCode('IDN');
    var b = S.byCode(params.get('b')) || S.byCode('JPN');
    var c = S.byCode(params.get('c'));
    var picked = [a, b];
    if (c && c.code !== a.code && c.code !== b.code) picked.push(c);

    var options = S.COUNTRIES.map(function (x) { return '<option value="' + x.code + '">' + esc(x.name) + '</option>'; }).join('');
    function sel(id, val) {
      return '<select id="' + id + '">' + options.replace('value="' + val.code + '"', 'value="' + val.code + '" selected') + '</select>';
    }
    var host = document.createElement('div');
    host.innerHTML = '<h1>Compare countries</h1>' +
      '<p class="lede">Pick two or three countries and see every indicator side by side. The higher value in each row is highlighted — remember that “higher” is not always better: for unemployment or inflation, lower wins.</p>' +
      '<div class="card compare-pick">' +
      '<div class="field"><label for="cmp-a">Country A</label>' + sel('cmp-a', a) + '</div>' +
      '<div class="field"><label for="cmp-b">Country B</label>' + sel('cmp-b', b) + '</div>' +
      '<div class="field"><label for="cmp-c">Country C (optional)</label><select id="cmp-c"><option value="">— none —</option>' +
      options + '</select></div>' +
      '<button class="btn" id="cmp-go">Compare</button></div>' +
      '<div id="cmp-result"></div>' + sourceLine();

    var result = host.querySelector('#cmp-result');
    var selC = host.querySelector('#cmp-c');
    if (c) selC.value = c.code;
    function draw() {
      var rows = S.INDICATORS.map(function (ind) {
        var vals = picked.map(function (p) { return p[ind.key]; });
        var best = Math.max.apply(null, vals);
        var cells = picked.map(function (p) {
          var win = p[ind.key] === best;
          return '<td class="num">' + (win ? '<span class="winner">' : '') + esc(S.formatValue(ind.key, p[ind.key])) + (win ? ' ▲</span>' : '') + '</td>';
        }).join('');
        return '<tr><td>' + esc(ind.label) + '<br><span class="source-note">' + esc(ind.unit) + '</span></td>' + cells + '</tr>';
      }).join('');
      var head = picked.map(function (p) { return '<th class="num">' + p.flag + ' ' + esc(p.name) + '</th>'; }).join('');
      result.innerHTML = '<div class="card" style="margin-top:16px"><h3 style="margin-top:0">Indicator comparison — 2024</h3><div class="table-wrap"><table>' +
        '<thead><tr><th>Indicator</th>' + head + '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<p class="source-note">▲ marks the highest value in the row. For unemployment, inflation and CO₂ per capita, the lowest value is the better outcome.</p></div>';

      var chartWrap = document.createElement('div');
      chartWrap.className = 'grid grid-2';
      chartWrap.style.marginTop = '16px';
      chartWrap.appendChild(chartCard('GDP per capita, 2024',
        'US$ · World Bank WDI 2024',
        C.barChart(picked.map(function (p, i) { return { label: p.name, value: p.gdpPerCapita, color: C.COLORS[i] }; }),
          { label: 'GDP per capita', formatValue: function (v) { return '$' + Math.round(v).toLocaleString('en-US'); } })));
      chartWrap.appendChild(chartCard('Life expectancy, 2024',
        'Years · World Bank WDI 2024',
        C.barChart(picked.map(function (p, i) { return { label: p.name, value: p.lifeExpectancy, color: C.COLORS[i] }; }),
          { label: 'Life expectancy', formatValue: function (v) { return v.toFixed(1) + ' yrs'; } })));
      result.appendChild(chartWrap);
    }
    draw();
    host.querySelector('#cmp-go').addEventListener('click', function () {
      var na = host.querySelector('#cmp-a').value, nb = host.querySelector('#cmp-b').value, nc = selC.value;
      location.hash = '#/compare?a=' + na + '&b=' + nb + (nc ? '&c=' + nc : '');
    });
    view.innerHTML = '';
    view.appendChild(host);
  }

  /* ---------- Indicators table ---------- */
  function renderIndicators(params) {
    setNav('indicators');
    var sortKey = params.get('sort') || 'population';
    var ind = S.INDICATORS.find(function (i) { return i.key === sortKey; }) || S.INDICATORS[0];
    var dir = params.get('dir') === 'asc' ? 'asc' : 'desc';
    var rows = S.COUNTRIES.slice().sort(function (x, y) {
      return dir === 'asc' ? x[ind.key] - y[ind.key] : y[ind.key] - x[ind.key];
    });
    var host = document.createElement('div');
    host.innerHTML = '<h1>Indicators table</h1>' +
      '<p class="lede">Every indicator for all eight countries in one table. Choose an indicator to sort by it; choose the direction to flip the order.</p>' +
      '<div class="country-picker"><label for="ind-select">Sort by</label><select id="ind-select">' +
      S.INDICATORS.map(function (i) { return '<option value="' + i.key + '"' + (i.key === ind.key ? ' selected' : '') + '>' + esc(i.label) + '</option>'; }).join('') +
      '</select><label for="dir-select">Order</label><select id="dir-select">' +
      '<option value="desc"' + (dir === 'desc' ? ' selected' : '') + '>Highest first</option>' +
      '<option value="asc"' + (dir === 'asc' ? ' selected' : '') + '>Lowest first</option></select></div>' +
      '<div class="card"><div class="table-wrap"><table><thead><tr><th>#</th><th>Country</th><th class="num">' + esc(ind.label) + '</th><th class="num">World share</th><th>Source</th></tr></thead><tbody>' +
      rows.map(function (ct, i) {
        var share = ind.key === 'population' ? (ct.population / S.WORLD.population * 100).toFixed(2) + '% of world' :
          ind.key === 'gdp' ? (ct.gdp / S.WORLD.gdp * 100).toFixed(2) + '% of world' : '—';
        return '<tr><td><span class="rank-badge">' + (i + 1) + '</span></td><td>' + countryLink(ct) + '</td>' +
          '<td class="num"><strong>' + esc(S.formatValue(ind.key, ct[ind.key])) + '</strong></td>' +
          '<td class="num">' + share + '</td><td class="source-note">' + esc(ind.source) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>' +
      '<div class="callout"><strong>Reading the table:</strong> “World share” compares a country with the world total for population and GDP. For other indicators the world average is ' +
      esc(S.formatValue(ind.key, S.WORLD[ind.key])) + ' — see the <a href="#/about">Sources &amp; method</a> page for how world averages are compiled.</div>' +
      sourceLine();
    host.querySelector('#ind-select').addEventListener('change', function (e) {
      location.hash = '#/indicators?sort=' + e.target.value + '&dir=' + dir;
    });
    host.querySelector('#dir-select').addEventListener('change', function (e) {
      location.hash = '#/indicators?sort=' + ind.key + '&dir=' + e.target.value;
    });
    view.innerHTML = '';
    view.appendChild(host);
  }

  /* ---------- Regions ---------- */
  function renderRegions() {
    setNav('regions');
    var total = S.INDONESIA_REGIONS.reduce(function (s, r) { return s + r.pop; }, 0);
    var host = document.createElement('div');
    host.innerHTML = '<h1>Regions — Indonesia’s largest provinces</h1>' +
      '<p class="lede">National figures hide big regional differences. Indonesia’s ten largest provinces hold ' + total.toFixed(1) +
      ' million people — about ' + Math.round(total / S.byCode('IDN').population * 100) + '% of the country. Java alone holds more than half of all Indonesians.</p>' +
      '<div class="grid grid-2"><div class="card"><h3 style="margin-top:0">Population by province, 2024</h3><div class="table-wrap"><table>' +
      '<thead><tr><th>#</th><th>Province</th><th>Capital</th><th class="num">Population</th><th class="num">Share of Indonesia</th></tr></thead><tbody>' +
      S.INDONESIA_REGIONS.map(function (r, i) {
        return '<tr><td><span class="rank-badge">' + (i + 1) + '</span></td><td>' + esc(r.name) + '</td><td>' + esc(r.capital) + '</td>' +
          '<td class="num"><strong>' + r.pop.toFixed(1) + ' million</strong></td>' +
          '<td class="num">' + (r.pop / S.byCode('IDN').population * 100).toFixed(1) + '%</td></tr>';
      }).join('') + '</tbody></table></div><p class="source-note">Source: BPS Statistics Indonesia, 2024 population estimates.</p></div>' +
      '<div id="region-chart"></div></div>' +
      '<div class="callout"><strong>Why regions matter:</strong> a national average can describe nobody. Jakarta’s GDP per capita is roughly five times the national average, while eastern provinces sit far below it — the same country, very different statistics.</div>' +
      sourceLine();
    var chartSlot = host.querySelector('#region-chart');
    chartSlot.appendChild(chartCard('Largest provinces, 2024',
      'Millions of people · BPS Statistics Indonesia',
      C.barChart(S.INDONESIA_REGIONS.slice(0, 6).map(function (r) { return { label: r.name, value: r.pop }; }),
        { label: 'Population', formatValue: function (v) { return v.toFixed(1) + 'M'; } })));
    view.innerHTML = '';
    view.appendChild(host);
  }

  /* ---------- About / sources ---------- */
  function renderAbout() {
    setNav('about');
    view.innerHTML = '<h1>Sources &amp; method</h1>' +
      '<p class="lede">StatAtlas is an independent explorer. Every figure on this site comes from a named public source, is dated 2024, and is rounded to the precision shown. Nothing here is fetched live — the whole dataset ships with the site, so it works offline.</p>' +
      '<div class="card"><h3 style="margin-top:0">Sources</h3><div class="table-wrap"><table>' +
      '<thead><tr><th>Figures</th><th>Source</th><th>Edition</th></tr></thead><tbody>' +
      '<tr><td>Population, population history, median age, age structure</td><td>UN World Population Prospects</td><td>2024 revision</td></tr>' +
      '<tr><td>GDP, GDP per capita, life expectancy, urban share</td><td>World Bank World Development Indicators</td><td>2024</td></tr>' +
      '<tr><td>Adult literacy</td><td>UNESCO Institute for Statistics</td><td>2024</td></tr>' +
      '<tr><td>Unemployment</td><td>ILO modelled estimates</td><td>2024</td></tr>' +
      '<tr><td>Inflation</td><td>IMF World Economic Outlook</td><td>October 2024</td></tr>' +
      '<tr><td>CO₂ per capita</td><td>Global Carbon Budget</td><td>2024</td></tr>' +
      '<tr><td>Internet users</td><td>ITU World Telecommunication Indicators</td><td>2024</td></tr>' +
      '<tr><td>Indonesian provinces</td><td>BPS Statistics Indonesia</td><td>2024 estimates</td></tr>' +
      '</tbody></table></div></div>' +
      '<div class="card" style="margin-top:16px"><h3 style="margin-top:0">Rounding and method</h3><ul>' +
      '<li>Populations are rounded to 0.1 million; GDP to the nearest US$10 billion; GDP per capita to the nearest US$5.</li>' +
      '<li>Rates (life expectancy, literacy, unemployment, inflation, internet use) are shown to one decimal place.</li>' +
      '<li>World totals are the same sources’ 2024 world aggregates, used only for the “world share” column.</li>' +
      '<li>Where sources disagree by a small amount, the World Bank figure is used and the difference is below the rounding shown.</li>' +
      '<li>Figures are estimates: national statistical offices revise them, and later editions may differ slightly.</li>' +
      '</ul></div>' +
      '<div class="card" style="margin-top:16px"><h3 style="margin-top:0">About StatAtlas</h3>' +
      '<p>StatAtlas was built as an original entry for the make.fun “best national statistics site” bounty. Its design, text and charts are original; the figures are public statistics, cited above. The site is a set of static files — it makes no network requests, sets no cookies and tracks nobody.</p>' +
      '<p><a href="#/">Back to the overview</a> · <a href="#/compare">Compare countries</a></p></div>';
  }

  function renderNotFound(code) {
    setNav('home');
    view.innerHTML = '<h1>Country not found</h1><p class="lede">There is no country with code “' + esc(code || '') +
      '” in this edition of StatAtlas. The site covers eight countries so far — pick one below.</p>' +
      '<div class="chip-row">' + S.COUNTRIES.map(function (c) {
        return '<a class="chip" href="#/country/' + c.code + '">' + c.flag + ' ' + esc(c.name) + '</a>';
      }).join('') + '</div><p><a href="#/">&larr; Back to the overview</a></p>';
  }

  function route() {
    var hash = location.hash || '#/';
    var parts = hash.replace(/^#\/?/, '').split('?');
    var path = parts[0].split('/');
    var params = new URLSearchParams(parts[1] || '');
    window.scrollTo(0, 0);
    if (path[0] === 'country' && path[1]) renderCountry(path[1]);
    else if (path[0] === 'compare') renderCompare(params);
    else if (path[0] === 'indicators') renderIndicators(params);
    else if (path[0] === 'regions') renderRegions();
    else if (path[0] === 'about') renderAbout();
    else renderHome();
  }

  /* Header search: live results, Enter jumps to the first match. */
  function initSearch() {
    var form = document.getElementById('country-search');
    var input = document.getElementById('search-input');
    var results = document.getElementById('search-results');
    function update() {
      var matches = S.searchCountries(input.value);
      if (!matches.length) { results.hidden = true; results.innerHTML = ''; return; }
      results.innerHTML = matches.map(function (c) {
        return '<li><a href="#/country/' + c.code + '">' + c.flag + ' ' + esc(c.name) + ' <span class="source-note">— ' + esc(c.region) + '</span></a></li>';
      }).join('');
      results.hidden = false;
    }
    input.addEventListener('input', update);
    input.addEventListener('focus', update);
    document.addEventListener('click', function (e) {
      if (!form.contains(e.target)) results.hidden = true;
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var matches = S.searchCountries(input.value);
      if (matches.length) {
        results.hidden = true;
        location.hash = '#/country/' + matches[0].code;
        input.value = '';
      }
    });
  }

  window.STATATLAS_VIEWS = { route: route, initSearch: initSearch };
})();
