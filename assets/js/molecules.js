/* =====================================================================
   molecules.js — SVG molecular-structure renderer
   Draws technically correct connectivity for the species used across the
   ethylene-oxide value chain. Heavy atoms are placed by hand; hydrogens on
   O/N (and optionally on C) are laid out automatically into free angular
   gaps so the structures stay tidy at any size.
   Exposes:  EO.mol(name, opts) -> "<svg>…</svg>"  string
             EO.molMeta(name)   -> { formula, title }
   ===================================================================== */
(function (EO) {
  "use strict";

  /* ---- element styling (tuned for dark board) ---- */
  var ELEM = {
    C:  { fill: "#2b3a4f", stroke: "#4a5f7b", text: "#d3deec", r: 10, fs: 11 },
    H:  { fill: "#182636", stroke: "#33465c", text: "#93a6bf", r: 7,  fs: 9  },
    O:  { fill: "#c0453c", stroke: "#dd6d63", text: "#ffffff", r: 10, fs: 11 },
    N:  { fill: "#2f62d6", stroke: "#5f86e8", text: "#ffffff", r: 10, fs: 11 },
    Cl: { fill: "#3f9e4d", stroke: "#66b872", text: "#ffffff", r: 11, fs: 10 },
    Ag: { fill: "#9aa7b6", stroke: "#c3ced9", text: "#0a1420", r: 11, fs: 10 }
  };
  var VALENCE = { C: 4, N: 3, O: 2, H: 1, Cl: 1 };
  var BOND = "#7286a1";

  /* ---- helpers to build skeletons ---- */
  function A(el, x, y) { return { el: el, x: x, y: y }; }

  // append an –CH2–CH2–OH style arm from an origin atom index
  function arm(atoms, bonds, fromIdx, ax, ay, angleDeg) {
    var a = angleDeg * Math.PI / 180, L = 23;
    var c1 = A("C", ax + L * Math.cos(a), ay + L * Math.sin(a));
    var b = (angleDeg + 34) * Math.PI / 180;
    var c2 = A("C", c1.x + L * Math.cos(b), c1.y + L * Math.sin(b));
    var d = (angleDeg - 12) * Math.PI / 180;
    var o = A("O", c2.x + L * Math.cos(d), c2.y + L * Math.sin(d));
    var i0 = atoms.length;
    atoms.push(c1, c2, o);
    bonds.push([fromIdx, i0, 1], [i0, i0 + 1, 1], [i0 + 1, i0 + 2, 1]);
  }

  // linear glycol / chain: HO(-CH2CH2-O-)nH   built along x
  function glycolChain(units) {
    var atoms = [], bonds = [], x = 0, y = 0, up = true, prev = -1;
    function put(el) {
      var a = A(el, x, up ? y - 7 : y + 7);
      atoms.push(a);
      if (prev >= 0) bonds.push([prev, atoms.length - 1, 1]);
      prev = atoms.length - 1; x += 21; up = !up;
    }
    put("O");                                   // terminal OH
    for (var u = 0; u < units; u++) { put("C"); put("C"); if (u < units - 1) put("O"); }
    put("O");                                   // terminal OH
    return { atoms: atoms, bonds: bonds };
  }

  /* ---- molecule library (heavy-atom skeletons) ---- */
  var LIB = {
    ethane:   { title: "Ethane", formula: "C₂H₆", explicitCH: true,
                atoms: [A("C", 0, 0), A("C", 26, 0)], bonds: [[0, 1, 1]] },
    propane:  { title: "Propane", formula: "C₃H₈", explicitCH: true,
                atoms: [A("C", 0, 9), A("C", 24, -5), A("C", 48, 9)], bonds: [[0, 1, 1], [1, 2, 1]] },
    methane:  { title: "Methane", formula: "CH₄", explicitCH: true,
                atoms: [A("C", 0, 0)], bonds: [] },
    hydrogen: { title: "Hydrogen", formula: "H₂", explicitCH: false,
                atoms: [A("H", 0, 0), A("H", 22, 0)], bonds: [[0, 1, 1]] },
    oxygen:   { title: "Oxygen", formula: "O₂", explicitCH: false,
                atoms: [A("O", 0, 0), A("O", 26, 0)], bonds: [[0, 1, 2]] },
    water:    { title: "Water", formula: "H₂O", explicitCH: false,
                atoms: [A("O", 0, 0), A("H", -18, 13), A("H", 18, 13)], bonds: [[0, 1, 1], [0, 2, 1]] },
    ammonia:  { title: "Ammonia", formula: "NH₃", explicitCH: false,
                atoms: [A("N", 0, 0)], bonds: [] },
    co2:      { title: "Carbon dioxide", formula: "CO₂", explicitCH: false,
                atoms: [A("O", -26, 0), A("C", 0, 0), A("O", 26, 0)], bonds: [[0, 1, 2], [1, 2, 2]] },
    ethylene: { title: "Ethylene", formula: "C₂H₄", explicitCH: true,
                atoms: [A("C", 0, 0), A("C", 26, 0)], bonds: [[0, 1, 2]] },
    eo:       { title: "Ethylene oxide", formula: "C₂H₄O", explicitCH: true,
                atoms: [A("C", -13, 9), A("C", 13, 9), A("O", 0, -15)],
                bonds: [[0, 1, 1], [0, 2, 1], [1, 2, 1]] },
    ethylene_carbonate: {
                title: "Ethylene carbonate", formula: "C₃H₄O₃", explicitCH: true,
                atoms: [A("C", 0, -24), A("O", 22.8, -7.4), A("C", 14.1, 19.4),
                        A("C", -14.1, 19.4), A("O", -22.8, -7.4), A("O", 0, -47)],
                bonds: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 0, 1], [0, 5, 2]] },
    ethyl_chloride: { title: "Ethyl chloride (moderator)", formula: "C₂H₅Cl", explicitCH: true,
                atoms: [A("C", 0, 0), A("C", 26, 0), A("Cl", 52, 0)], bonds: [[0, 1, 1], [1, 2, 1]] },
    meg:      (function () { var g = glycolChain(1); g.title = "Mono-ethylene glycol (MEG)"; g.formula = "C₂H₆O₂"; g.explicitCH = false; return g; })(),
    deg:      (function () { var g = glycolChain(2); g.title = "Di-ethylene glycol (DEG)"; g.formula = "C₄H₁₀O₃"; g.explicitCH = false; return g; })(),
    teg:      (function () { var g = glycolChain(3); g.title = "Tri-ethylene glycol (TEG)"; g.formula = "C₆H₁₄O₄"; g.explicitCH = false; return g; })(),
    peg:      (function () { var g = glycolChain(4); g.title = "Poly-ethylene glycol (PEG)"; g.formula = "HO–(CH₂CH₂O)ₙ–H"; g.explicitCH = false; return g; })(),
    mea: (function () {
            var atoms = [A("N", 0, 0)], bonds = [];
            arm(atoms, bonds, 0, 0, 0, 8);
            return { title: "Mono-ethanolamine (MEA)", formula: "C₂H₇NO", explicitCH: false, atoms: atoms, bonds: bonds };
          })(),
    dea: (function () {
            var atoms = [A("N", 0, 0)], bonds = [];
            arm(atoms, bonds, 0, 0, 0, -52);
            arm(atoms, bonds, 0, 0, 0, 52);
            return { title: "Di-ethanolamine (DEA)", formula: "C₄H₁₁NO₂", explicitCH: false, atoms: atoms, bonds: bonds };
          })(),
    tea: (function () {
            var atoms = [A("N", 0, 0)], bonds = [];
            arm(atoms, bonds, 0, 0, 0, -90);
            arm(atoms, bonds, 0, 0, 0, 150);
            arm(atoms, bonds, 0, 0, 0, 30);
            return { title: "Tri-ethanolamine (TEA)", formula: "C₆H₁₅NO₃", explicitCH: false, atoms: atoms, bonds: bonds };
          })()
  };

  /* ---- hydrogen auto-placement ---- */
  function withHydrogens(def) {
    var atoms = def.atoms.map(function (a) { return { el: a.el, x: a.x, y: a.y }; });
    var bonds = def.bonds.map(function (b) { return b.slice(); });
    var order = atoms.map(function () { return 0; });
    var neighAngles = atoms.map(function () { return []; });

    bonds.forEach(function (b) {
      order[b[0]] += b[2]; order[b[1]] += b[2];
      var a = atoms[b[0]], c = atoms[b[1]];
      neighAngles[b[0]].push(Math.atan2(c.y - a.y, c.x - a.x) * 180 / Math.PI);
      neighAngles[b[1]].push(Math.atan2(a.y - c.y, a.x - c.x) * 180 / Math.PI);
    });

    var base = atoms.length;
    for (var i = 0; i < base; i++) {
      var el = atoms[i].el;
      if (el === "H" || VALENCE[el] === undefined) continue;
      var nH = VALENCE[el] - order[i];
      if (nH <= 0) continue;
      if (el === "C" && !def.explicitCH) continue;   // hide C–H unless requested
      var pts = placeAround(atoms[i].x, atoms[i].y, neighAngles[i], nH, el === "H" ? 18 : 19);
      pts.forEach(function (p) {
        atoms.push({ el: "H", x: p[0], y: p[1] });
        bonds.push([i, atoms.length - 1, 1]);
      });
    }
    return { atoms: atoms, bonds: bonds };
  }

  function placeAround(cx, cy, angs, count, L) {
    var pts = [], i;
    if (!angs.length) {
      var start = count === 2 ? 50 : -90;
      var step = count === 2 ? 80 : 360 / count;
      for (i = 0; i < count; i++) {
        var a0 = (start + i * step) * Math.PI / 180;
        pts.push([cx + L * Math.cos(a0), cy + L * Math.sin(a0)]);
      }
      return pts;
    }
    var s = angs.slice().sort(function (a, b) { return a - b; });
    var gaps = [];
    for (i = 0; i < s.length; i++) {
      var a1 = s[i], a2 = (i + 1 < s.length) ? s[i + 1] : s[0] + 360;
      gaps.push({ start: a1, size: a2 - a1 });
    }
    gaps.sort(function (p, q) { return q.size - p.size; });
    var assign = gaps.map(function (g) { return { start: g.start, size: g.size, n: 0 }; });
    for (i = 0; i < count; i++) assign[i % assign.length].n++;
    assign.forEach(function (g) {
      for (var k = 0; k < g.n; k++) {
        var frac = (k + 1) / (g.n + 1);
        var a = (g.start + g.size * frac) * Math.PI / 180;
        pts.push([cx + L * Math.cos(a), cy + L * Math.sin(a)]);
      }
    });
    return pts;
  }

  /* ---- render to SVG string ---- */
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function render(name, opts) {
    opts = opts || {};
    var def = LIB[name];
    if (!def) return "";
    var m = withHydrogens(def);
    var pad = 16;
    var xs = m.atoms.map(function (a) { return a.x; }),
        ys = m.atoms.map(function (a) { return a.y; });
    var minX = Math.min.apply(null, xs) - pad, maxX = Math.max.apply(null, xs) + pad;
    var minY = Math.min.apply(null, ys) - pad, maxY = Math.max.apply(null, ys) + pad;
    var w = maxX - minX, h = maxY - minY;

    var g = "";
    // bonds
    m.bonds.forEach(function (b) {
      var a = m.atoms[b[0]], c = m.atoms[b[1]];
      var dx = c.x - a.x, dy = c.y - a.y, len = Math.hypot(dx, dy) || 1;
      var ox = -dy / len, oy = dx / len;
      if (b[2] === 1) {
        g += line(a.x, a.y, c.x, c.y);
      } else if (b[2] === 2) {
        g += line(a.x + ox * 3, a.y + oy * 3, c.x + ox * 3, c.y + oy * 3);
        g += line(a.x - ox * 3, a.y - oy * 3, c.x - ox * 3, c.y - oy * 3);
      } else {
        g += line(a.x, a.y, c.x, c.y);
        g += line(a.x + ox * 4, a.y + oy * 4, c.x + ox * 4, c.y + oy * 4);
        g += line(a.x - ox * 4, a.y - oy * 4, c.x - ox * 4, c.y - oy * 4);
      }
    });
    // atoms
    m.atoms.forEach(function (a) {
      var e = ELEM[a.el] || ELEM.C;
      g += '<circle cx="' + f(a.x) + '" cy="' + f(a.y) + '" r="' + e.r + '" fill="' + e.fill + '" stroke="' + e.stroke + '" stroke-width="1.3"/>';
      g += '<text x="' + f(a.x) + '" y="' + f(a.y + e.fs * 0.35) + '" text-anchor="middle" font-size="' + e.fs + '" font-weight="700" fill="' + e.text + '" font-family="Inter, sans-serif">' + a.el + '</text>';
    });

    var cls = opts.className ? ' class="' + opts.className + '"' : "";
    // size preserving aspect ratio if only one dimension is given
    var ow = opts.width, oh = opts.height, ar = w / h;
    if (oh && !ow) ow = Math.round(oh * ar);
    if (ow && !oh) oh = Math.round(ow / ar);
    var wAttr = ow ? ' width="' + ow + '"' : "";
    var hAttr = oh ? ' height="' + oh + '"' : "";
    var style = opts.style ? ' style="' + opts.style + '"' : "";
    return '<svg xmlns="http://www.w3.org/2000/svg"' + cls + wAttr + hAttr + style +
      ' viewBox="' + f(minX) + " " + f(minY) + " " + f(w) + " " + f(h) + '" role="img" aria-label="' +
      esc(def.title + " molecule, " + def.formula) + '">' + g + '</svg>';

    function line(x1, y1, x2, y2) {
      return '<line x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) +
        '" stroke="' + BOND + '" stroke-width="2.2" stroke-linecap="round"/>';
    }
  }
  function f(n) { return Math.round(n * 10) / 10; }

  EO.mol = render;
  EO.molMeta = function (name) { var d = LIB[name]; return d ? { formula: d.formula, title: d.title } : null; };
  EO.molList = Object.keys(LIB);
})(window.EO = window.EO || {});
