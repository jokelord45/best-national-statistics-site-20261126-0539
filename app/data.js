/* StatAtlas dataset — rounded estimates compiled from World Bank World
   Development Indicators and UN World Population Prospects, 2024 edition.
   Figures are rounded to the precision shown; see the Sources & method page
   for the full sourcing and rounding rules. All values are 2024 unless noted. */
(function () {
  'use strict';

  var INDICATORS = [
    { key: 'population', label: 'Population', unit: 'people', fmt: 'int', source: 'UN World Population Prospects 2024' },
    { key: 'gdp', label: 'GDP (nominal)', unit: 'US$', fmt: 'money', source: 'World Bank WDI 2024' },
    { key: 'gdpPerCapita', label: 'GDP per capita', unit: 'US$', fmt: 'money', source: 'World Bank WDI 2024' },
    { key: 'lifeExpectancy', label: 'Life expectancy at birth', unit: 'years', fmt: 'one', source: 'World Bank WDI 2024' },
    { key: 'medianAge', label: 'Median age', unit: 'years', fmt: 'one', source: 'UN World Population Prospects 2024' },
    { key: 'urbanShare', label: 'Urban population', unit: '% of population', fmt: 'pct', source: 'World Bank WDI 2024' },
    { key: 'literacy', label: 'Adult literacy rate', unit: '% of adults 15+', fmt: 'pct', source: 'UNESCO Institute for Statistics 2024' },
    { key: 'unemployment', label: 'Unemployment rate', unit: '% of labour force', fmt: 'pct', source: 'ILO modelled estimates 2024' },
    { key: 'inflation', label: 'Consumer price inflation', unit: '% per year', fmt: 'pct', source: 'IMF World Economic Outlook, Oct 2024' },
    { key: 'co2PerCapita', label: 'CO2 emissions per capita', unit: 'tonnes', fmt: 'one', source: 'Global Carbon Budget 2024' },
    { key: 'internetUsers', label: 'Internet users', unit: '% of population', fmt: 'pct', source: 'ITU World Telecommunication Indicators 2024' }
  ];

  /* Population in millions, 2015-2024 (UN World Population Prospects 2024). */
  var COUNTRIES = [
    {
      code: 'IDN', name: 'Indonesia', region: 'South-Eastern Asia', capital: 'Jakarta',
      flag: '🇮🇩', currency: 'Indonesian rupiah (IDR)', language: 'Indonesian',
      population: 283.5, gdp: 1400, gdpPerCapita: 4925, lifeExpectancy: 71.7,
      medianAge: 30.5, urbanShare: 59, literacy: 96, unemployment: 4.9,
      inflation: 2.3, co2PerCapita: 2.3, internetUsers: 79,
      popSeries: [258.4, 261.1, 263.8, 266.9, 270.2, 273.5, 276.4, 279.4, 281.5, 283.5],
      ageStructure: { under15: 24.5, working: 68.1, over65: 7.4 },
      blurb: 'The world’s fourth most populous country and the largest archipelago state, spread across more than 17,000 islands. Its economy is the largest in South-East Asia, driven by domestic consumption, manufacturing and commodity exports.'
    },
    {
      code: 'IND', name: 'India', region: 'Southern Asia', capital: 'New Delhi',
      flag: '🇮🇳', currency: 'Indian rupee (INR)', language: 'Hindi, English',
      population: 1450.9, gdp: 3900, gdpPerCapita: 2700, lifeExpectancy: 68.4,
      medianAge: 28.7, urbanShare: 36, literacy: 77, unemployment: 4.2,
      inflation: 4.7, co2PerCapita: 1.9, internetUsers: 52,
      popSeries: [1322.9, 1338.7, 1354.2, 1369.0, 1383.1, 1396.4, 1409.1, 1421.9, 1436.6, 1450.9],
      ageStructure: { under15: 25.3, working: 67.7, over65: 7.0 },
      blurb: 'The world’s most populous country since 2023 and its fastest-growing large economy. A young median age of under 29 shapes its labour market, its cities and its digital economy.'
    },
    {
      code: 'USA', name: 'United States', region: 'Northern America', capital: 'Washington, D.C.',
      flag: '🇺🇸', currency: 'US dollar (USD)', language: 'English',
      population: 340.1, gdp: 29200, gdpPerCapita: 85800, lifeExpectancy: 78.4,
      medianAge: 38.9, urbanShare: 83, literacy: 99, unemployment: 4.0,
      inflation: 2.9, co2PerCapita: 14.3, internetUsers: 92,
      popSeries: [320.7, 323.1, 325.1, 327.1, 328.3, 329.5, 331.5, 333.3, 336.0, 340.1],
      ageStructure: { under15: 17.8, working: 64.6, over65: 17.6 },
      blurb: 'The world’s largest economy by nominal GDP and the third most populous country. Services dominate output, and it leads the world in research spending, higher education and venture investment.'
    },
    {
      code: 'JPN', name: 'Japan', region: 'Eastern Asia', capital: 'Tokyo',
      flag: '🇯🇵', currency: 'Japanese yen (JPY)', language: 'Japanese',
      population: 124.1, gdp: 4000, gdpPerCapita: 32500, lifeExpectancy: 84.0,
      medianAge: 49.5, urbanShare: 92, literacy: 99, unemployment: 2.5,
      inflation: 2.7, co2PerCapita: 8.5, internetUsers: 93,
      popSeries: [127.1, 126.9, 126.7, 126.5, 126.3, 125.8, 125.4, 125.1, 124.6, 124.1],
      ageStructure: { under15: 11.4, working: 59.5, over65: 29.1 },
      blurb: 'The world’s oldest large society by median age and the longest-lived, at 84 years. Its population has fallen every year since 2011, while its economy remains the fourth largest in nominal terms.'
    },
    {
      code: 'DEU', name: 'Germany', region: 'Western Europe', capital: 'Berlin',
      flag: '🇩🇪', currency: 'Euro (EUR)', language: 'German',
      population: 84.7, gdp: 4700, gdpPerCapita: 55500, lifeExpectancy: 81.2,
      medianAge: 45.8, urbanShare: 78, literacy: 99, unemployment: 3.4,
      inflation: 2.2, co2PerCapita: 7.3, internetUsers: 93,
      popSeries: [81.2, 82.3, 82.7, 83.0, 83.2, 83.2, 83.2, 83.8, 84.5, 84.7],
      ageStructure: { under15: 13.7, working: 63.9, over65: 22.4 },
      blurb: 'Europe’s largest economy and its biggest exporter of cars and machinery. A shrinking native workforce is offset by immigration, which lifted the population to a record high in 2024.'
    },
    {
      code: 'BRA', name: 'Brazil', region: 'South America', capital: 'Brasília',
      flag: '🇧🇷', currency: 'Brazilian real (BRL)', language: 'Portuguese',
      population: 216.4, gdp: 2170, gdpPerCapita: 10000, lifeExpectancy: 75.8,
      medianAge: 33.6, urbanShare: 88, literacy: 94, unemployment: 6.6,
      inflation: 4.4, co2PerCapita: 2.2, internetUsers: 84,
      popSeries: [204.5, 206.2, 207.8, 209.3, 210.7, 212.0, 213.3, 214.3, 215.3, 216.4],
      ageStructure: { under15: 20.4, working: 69.3, over65: 10.3 },
      blurb: 'South America’s largest country by area and population, and its biggest economy. Agriculture, mining and energy exports anchor output, while 88% of Brazilians now live in towns and cities.'
    },
    {
      code: 'NGA', name: 'Nigeria', region: 'Western Africa', capital: 'Abuja',
      flag: '🇳🇬', currency: 'Nigerian naira (NGN)', language: 'English',
      population: 232.7, gdp: 190, gdpPerCapita: 820, lifeExpectancy: 52.7,
      medianAge: 18.1, urbanShare: 54, literacy: 62, unemployment: 4.3,
      inflation: 32.7, co2PerCapita: 0.6, internetUsers: 42,
      popSeries: [182.2, 187.1, 192.1, 197.4, 202.9, 208.3, 213.4, 218.5, 223.8, 232.7],
      ageStructure: { under15: 42.9, working: 54.4, over65: 2.7 },
      blurb: 'Africa’s most populous country and its youngest large society — the median Nigerian is 18. Its population grows by more than 5 million people a year, and by 2050 it is projected to pass 400 million.'
    },
    {
      code: 'FRA', name: 'France', region: 'Western Europe', capital: 'Paris',
      flag: '🇫🇷', currency: 'Euro (EUR)', language: 'French',
      population: 68.4, gdp: 3050, gdpPerCapita: 44500, lifeExpectancy: 83.4,
      medianAge: 42.5, urbanShare: 82, literacy: 99, unemployment: 7.3,
      inflation: 2.0, co2PerCapita: 4.4, internetUsers: 93,
      popSeries: [66.0, 66.3, 66.6, 66.9, 67.1, 67.4, 67.7, 68.0, 68.2, 68.4],
      ageStructure: { under15: 16.9, working: 61.5, over65: 21.6 },
      blurb: 'Western Europe’s second-largest economy, with the world’s most visited tourist destination and the EU’s largest agricultural output. Life expectancy of 83.4 years is among the highest in the world.'
    }
  ];

  /* Largest provinces of Indonesia by population, millions, 2024 (BPS Statistics Indonesia). */
  var INDONESIA_REGIONS = [
    { name: 'West Java', pop: 49.9, capital: 'Bandung' },
    { name: 'East Java', pop: 41.8, capital: 'Surabaya' },
    { name: 'Central Java', pop: 37.9, capital: 'Semarang' },
    { name: 'North Sumatra', pop: 15.6, capital: 'Medan' },
    { name: 'Banten', pop: 12.4, capital: 'Serang' },
    { name: 'Jakarta', pop: 10.6, capital: 'Jakarta' },
    { name: 'South Sulawesi', pop: 9.3, capital: 'Makassar' },
    { name: 'Lampung', pop: 9.2, capital: 'Bandar Lampung' },
    { name: 'South Sumatra', pop: 8.8, capital: 'Palembang' },
    { name: 'Riau', pop: 6.6, capital: 'Pekanbaru' }
  ];

  var WORLD = {
    population: 8240, gdp: 111000, gdpPerCapita: 13500, lifeExpectancy: 73.3,
    medianAge: 30.9, urbanShare: 58, literacy: 87, unemployment: 5.0,
    inflation: 5.7, co2PerCapita: 4.7, internetUsers: 68
  };

  function byCode(code) {
    code = (code || '').toUpperCase();
    for (var i = 0; i < COUNTRIES.length; i++) if (COUNTRIES[i].code === code) return COUNTRIES[i];
    return null;
  }
  function searchCountries(q) {
    q = (q || '').trim().toLowerCase();
    if (!q) return [];
    return COUNTRIES.filter(function (c) {
      return c.name.toLowerCase().indexOf(q) !== -1 || c.code.toLowerCase() === q || c.region.toLowerCase().indexOf(q) !== -1;
    });
  }
  function formatValue(key, value) {
    if (value == null) return '—';
    if (key === 'population') return value.toFixed(1) + ' million';
    if (key === 'gdp') return '$' + (value >= 1000 ? (value / 1000).toFixed(2) + ' trillion' : value + ' billion');
    if (key === 'gdpPerCapita') return '$' + value.toLocaleString('en-US');
    if (key === 'lifeExpectancy' || key === 'medianAge' || key === 'co2PerCapita') return value.toFixed(1);
    return value.toFixed(1) + '%';
  }
  function formatShort(key, value) {
    if (key === 'population') return value.toFixed(1) + 'M';
    if (key === 'gdp') return '$' + (value >= 1000 ? (value / 1000).toFixed(1) + 'T' : value + 'B');
    if (key === 'gdpPerCapita') return '$' + Math.round(value / 100) / 10 + 'k';
    return formatValue(key, value);
  }

  window.STATATLAS = {
    INDICATORS: INDICATORS, COUNTRIES: COUNTRIES,
    INDONESIA_REGIONS: INDONESIA_REGIONS, WORLD: WORLD,
    byCode: byCode, searchCountries: searchCountries,
    formatValue: formatValue, formatShort: formatShort
  };
})();
