/* StatAtlas charts — small hand-rolled SVG charts. No libraries, no network. */
(function () {
  'use strict';

  var COLORS = ['#2f8f83', '#f2a541', '#12303a', '#7fb5ac', '#c77f1d', '#5d6f76', '#e07856', '#8a6fb8'];
  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, text) {
    var n = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function niceMax(v) {
    var p = Math.pow(10, Math.floor(Math.log10(v)));
    var n = v / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
  }

  /* Line chart: values array, years array, labels for the axes. */
  function lineChart(values, years, opts) {
    opts = opts || {};
    var W = 640, H = 300, L = 56, R = 14, T = 16, B = 34;
    var max = niceMax(Math.max.apply(null, values) * 1.05);
    var min = opts.floorZero === false ? Math.min.apply(null, values) * 0.95 : 0;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': opts.label || 'Line chart' });
    var iw = W - L - R, ih = H - T - B;
    function x(i) { return L + (iw * i) / (values.length - 1); }
    function y(v) { return T + ih - (ih * (v - min)) / (max - min); }
    var g;
    for (g = 0; g <= 4; g++) {
      var gv = min + ((max - min) * g) / 4;
      var gy = y(gv);
      svg.appendChild(el('line', { x1: L, y1: gy, x2: W - R, y2: gy, stroke: '#e6e2d4', 'stroke-width': 1 }));
      svg.appendChild(el('text', { x: L - 8, y: gy + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#5d6f76' }, opts.formatAxis ? opts.formatAxis(gv) : String(Math.round(gv))));
    }
    var pts = values.map(function (v, i) { return x(i).toFixed(1) + ',' + y(v).toFixed(1); }).join(' ');
    svg.appendChild(el('polyline', { points: pts, fill: 'none', stroke: opts.color || '#2f8f83', 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    values.forEach(function (v, i) {
      svg.appendChild(el('circle', { cx: x(i), cy: y(v), r: 3.5, fill: '#fff', stroke: opts.color || '#2f8f83', 'stroke-width': 2 }));
      if (i % 3 === 0 || i === values.length - 1) {
        svg.appendChild(el('text', { x: x(i), y: H - 10, 'text-anchor': 'middle', 'font-size': 11, fill: '#5d6f76' }, String(years[i])));
      }
    });
    var last = values[values.length - 1];
    svg.appendChild(el('text', { x: x(values.length - 1) - 4, y: y(last) - 10, 'text-anchor': 'end', 'font-size': 12, 'font-weight': 700, fill: '#12303a' }, opts.formatValue ? opts.formatValue(last) : String(last)));
    return svg;
  }

  /* Horizontal bar chart: [{label, value}] sorted desc. */
  function barChart(rows, opts) {
    opts = opts || {};
    var W = 640, rowH = 34, T = 8, B = 8, L = 150, R = 70;
    var H = T + B + rows.length * rowH;
    var max = Math.max.apply(null, rows.map(function (r) { return r.value; }));
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': opts.label || 'Bar chart' });
    rows.forEach(function (r, i) {
      var cy = T + i * rowH + rowH / 2;
      var bw = ((W - L - R) * r.value) / max;
      svg.appendChild(el('text', { x: L - 10, y: cy + 4, 'text-anchor': 'end', 'font-size': 12.5, fill: '#12303a' }, r.label));
      svg.appendChild(el('rect', { x: L, y: cy - 9, width: Math.max(bw, 2), height: 18, rx: 4, fill: r.color || COLORS[i % COLORS.length] }));
      svg.appendChild(el('text', { x: L + Math.max(bw, 2) + 8, y: cy + 4, 'font-size': 12, 'font-weight': 700, fill: '#12303a' }, opts.formatValue ? opts.formatValue(r.value) : String(r.value)));
    });
    return svg;
  }

  /* Donut chart for age structure: [{label, value, color}]. */
  function donutChart(parts, opts) {
    opts = opts || {};
    var size = 220, cx = size / 2, cy = size / 2, r = 82, thick = 34;
    var svg = el('svg', { viewBox: '0 0 ' + size + ' ' + size, role: 'img', 'aria-label': opts.label || 'Donut chart', style: 'max-width:220px;margin:0 auto' });
    var total = parts.reduce(function (s, p) { return s + p.value; }, 0);
    var start = -Math.PI / 2;
    parts.forEach(function (p) {
      var frac = p.value / total;
      var a0 = start, a1 = start + frac * Math.PI * 2;
      var large = frac > 0.5 ? 1 : 0;
      var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      var x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      svg.appendChild(el('path', {
        d: 'M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1),
        fill: 'none', stroke: p.color, 'stroke-width': thick
      }));
      start = a1;
    });
    svg.appendChild(el('text', { x: cx, y: cy - 4, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: '#12303a' }, opts.center || ''));
    svg.appendChild(el('text', { x: cx, y: cy + 16, 'text-anchor': 'middle', 'font-size': 11, fill: '#5d6f76' }, opts.centerSub || ''));
    return svg;
  }

  window.STATATLAS_CHARTS = { lineChart: lineChart, barChart: barChart, donutChart: donutChart, COLORS: COLORS };
})();
