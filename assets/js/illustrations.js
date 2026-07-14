/* =====================================================================
   illustrations.js — detailed vector illustrations of industrial
   equipment, process areas and end-use products.

   All artwork here is ORIGINAL technical vector illustration built for
   training. No real photographs are embedded. Two label kinds are used:
     · "Technical training illustration — not plant configuration"
     · "Representative industrial illustration — not a specific GC,
        PTTGC or Shell facility"

   Exposes:
     EO.glyph(kind, opts)   -> compact equipment symbol for map nodes
     EO.art(name, opts)     -> detailed scene for the detail panel / lightbox
     EO.artMeta[name]       -> { kind, label, caption }
   ===================================================================== */
(function (EO) {
  "use strict";

  /* ---------- shared gradient / filter defs ---------- */
  var DEFS =
    '<defs>' +
    grad("mtl", "v", [[0, "#3a4a60"], [0.18, "#5a6f8c"], [0.5, "#8399b4"], [0.82, "#4c5f79"], [1, "#33425a"]]) +
    grad("mtlH", "h", [[0, "#34435a"], [0.5, "#788fa0"], [0.5, "#7889a0"], [1, "#31405620"]]) +
    grad("mtl2", "v", [[0, "#2a3648"], [0.5, "#556a86"], [1, "#283647"]]) +
    grad("liq", "v", [[0, "#1f6f8f"], [1, "#0e3f57"]]) +
    grad("liqAmber", "v", [[0, "#c98a2e"], [1, "#7a4f12"]]) +
    grad("sky", "v", [[0, "#132a44"], [0.55, "#20415f"], [1, "#3a5a74"]]) +
    grad("hot", "v", [[0, "#7a2f1e"], [0.5, "#c25a2a"], [1, "#e6903a"]]) +
    grad("steam", "v", [[0, "#ffffff"], [1, "#ffffff00"]]) +
    grad("prod", "v", [[0, "#1a9c92"], [1, "#0c5850"]]) +
    grad("floor", "v", [[0, "#0f1f30"], [1, "#0a1522"]]) +
    '<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#ffffff" stop-opacity="0"/>' +
      '<stop offset="0.5" stop-color="#ffffff" stop-opacity="0.22"/>' +
      '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">' +
      '<stop offset="0" stop-color="#ffb066" stop-opacity="0.8"/>' +
      '<stop offset="1" stop-color="#ffb066" stop-opacity="0"/></radialGradient>' +
    '</defs>';

  function grad(id, dir, stops) {
    var coords = dir === "h" ? 'x1="0" y1="0" x2="1" y2="0"' : 'x1="0" y1="0" x2="0" y2="1"';
    var s = stops.map(function (st) {
      var c = String(st[1]);
      // guard against any malformed color -> fall back to a safe steel tone
      if (!/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(c)) c = "#4c5f79";
      return '<stop offset="' + st[0] + '" stop-color="' + c + '"/>';
    }).join("");
    return '<linearGradient id="' + id + '" ' + coords + '>' + s + '</linearGradient>';
  }

  /* ---------- low-level primitives (return positioned <g> strings) ---------- */
  function T(x, y, txt, opts) {
    opts = opts || {};
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (opts.anchor || "middle") +
      '" font-size="' + (opts.size || 11) + '" font-weight="' + (opts.weight || 600) +
      '" fill="' + (opts.fill || "#c6d4e6") + '" font-family="Inter, sans-serif"' +
      (opts.mono ? ' letter-spacing="0.02em"' : "") + '>' + esc(txt) + '</text>';
  }
  function label(x, y, txt) { // equipment name plate
    var w = txt.length * 6.0 + 14;
    return '<g class="equip-name"><rect x="' + (x - w / 2) + '" y="' + (y - 9) + '" width="' + w + '" height="16" rx="4" fill="#0b1626" stroke="#26374f"/>' +
      T(x, y + 2.5, txt, { size: 9.5, weight: 700, fill: "#a9bcd6" }) + '</g>';
  }
  function pipe(d, cls, w) {
    return '<path d="' + d + '" fill="none" stroke="' + (cls || "#5a7a9a") + '" stroke-width="' + (w || 5) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  // vertical distillation column with trays
  function column(x, y, w, h, trays, name, liquidFrac) {
    var g = '<g>';
    var rx = w / 2;
    // body
    g += '<path d="M' + x + ' ' + (y + rx * 0.5) + ' A' + rx + ' ' + (rx * 0.5) + ' 0 0 1 ' + (x + w) + ' ' + (y + rx * 0.5) +
      ' L' + (x + w) + ' ' + (y + h - rx * 0.5) + ' A' + rx + ' ' + (rx * 0.5) + ' 0 0 1 ' + x + ' ' + (y + h - rx * 0.5) + ' Z" fill="url(#mtl)" stroke="#26374f" stroke-width="1.4"/>';
    // top head
    g += '<ellipse cx="' + (x + rx) + '" cy="' + (y + rx * 0.5) + '" rx="' + rx + '" ry="' + (rx * 0.5) + '" fill="#5a6f8c" stroke="#26374f"/>';
    // trays
    for (var i = 1; i <= trays; i++) {
      var ty = y + (h * i) / (trays + 1);
      g += '<line x1="' + (x + 3) + '" y1="' + ty + '" x2="' + (x + w - 3) + '" y2="' + ty + '" stroke="#22344d" stroke-width="1"/>';
    }
    // sheen
    g += '<rect x="' + (x + w * 0.16) + '" y="' + (y + 4) + '" width="' + (w * 0.16) + '" height="' + (h - 8) + '" fill="url(#sheen)"/>';
    if (name) g += label(x + rx, y + h + 14, name);
    g += '</g>';
    return g;
  }

  // horizontal drum / knockout
  function drum(x, y, w, h, name) {
    var ry = h / 2;
    var g = '<g><rect x="' + (x + ry * 0.4) + '" y="' + y + '" width="' + (w - ry * 0.8) + '" height="' + h + '" fill="url(#mtlH)" stroke="#26374f" stroke-width="1.3"/>' +
      '<ellipse cx="' + (x + ry * 0.4) + '" cy="' + (y + ry) + '" rx="' + (ry * 0.5) + '" ry="' + ry + '" fill="#4c5f79" stroke="#26374f"/>' +
      '<ellipse cx="' + (x + w - ry * 0.4) + '" cy="' + (y + ry) + '" rx="' + (ry * 0.5) + '" ry="' + ry + '" fill="#6a7f9b" stroke="#26374f"/>' +
      '<rect x="' + (x + ry * 0.4) + '" y="' + (y + 3) + '" width="' + (w - ry * 0.8) + '" height="' + (h * 0.22) + '" fill="url(#sheen)"/>';
    if (name) g += label(x + w / 2, y + h + 13, name);
    return g + '</g>';
  }

  // storage tank (short fat cylinder)
  function tank(x, y, w, h, name, liquid) {
    var rx = w / 2;
    var g = '<g><path d="M' + x + ' ' + (y + rx * 0.34) + ' L' + x + ' ' + (y + h) +
      ' A' + rx + ' ' + (rx * 0.34) + ' 0 0 0 ' + (x + w) + ' ' + (y + h) +
      ' L' + (x + w) + ' ' + (y + rx * 0.34) + '" fill="url(#mtl)" stroke="#26374f" stroke-width="1.3"/>';
    if (liquid) {
      var ly = y + h - (h - rx * 0.34) * liquid;
      g += '<path d="M' + x + ' ' + ly + ' L' + x + ' ' + (y + h) + ' A' + rx + ' ' + (rx * 0.34) + ' 0 0 0 ' + (x + w) + ' ' + (y + h) + ' L' + (x + w) + ' ' + ly + ' A' + rx + ' ' + (rx * 0.34) + ' 0 0 1 ' + x + ' ' + ly + ' Z" fill="url(#liq)" opacity="0.85"/>';
    }
    g += '<ellipse cx="' + (x + rx) + '" cy="' + (y + rx * 0.34) + '" rx="' + rx + '" ry="' + (rx * 0.34) + '" fill="#6a7f9b" stroke="#26374f"/>';
    g += '<rect x="' + (x + w * 0.16) + '" y="' + (y + rx * 0.2) + '" width="' + (w * 0.13) + '" height="' + (h - rx * 0.3) + '" fill="url(#sheen)"/>';
    if (name) g += label(x + rx, y + h + 14, name);
    return g + '</g>';
  }

  // shell-and-tube heat exchanger (TEMA style)
  function hx(x, y, name) {
    var w = 58, h = 26;
    var g = '<g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="url(#mtlH)" stroke="#26374f" stroke-width="1.2"/>';
    g += '<rect x="' + (x - 6) + '" y="' + (y - 3) + '" width="8" height="' + (h + 6) + '" rx="2" fill="#4c5f79" stroke="#26374f"/>';
    g += '<rect x="' + (x + w - 2) + '" y="' + (y - 3) + '" width="8" height="' + (h + 6) + '" rx="2" fill="#4c5f79" stroke="#26374f"/>';
    for (var i = 1; i <= 4; i++) g += '<line x1="' + x + '" y1="' + (y + h * i / 5) + '" x2="' + (x + w) + '" y2="' + (y + h * i / 5) + '" stroke="#22344d" stroke-width="0.8"/>';
    if (name) g += label(x + w / 2, y + h + 13, name);
    return g + '</g>';
  }

  // centrifugal pump
  function pump(x, y, name) {
    var g = '<g><circle cx="' + x + '" cy="' + y + '" r="13" fill="url(#mtl)" stroke="#26374f" stroke-width="1.2"/>' +
      '<path d="M' + x + ' ' + (y - 13) + ' L' + (x + 15) + ' ' + (y - 6) + ' L' + (x + 15) + ' ' + (y + 6) + ' L' + x + ' ' + (y + 13) + '" fill="#4c5f79" stroke="#26374f"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#8399b4"/>';
    if (name) g += label(x, y + 26, name);
    return g + '</g>';
  }

  // centrifugal compressor (trapezoid)
  function compressor(x, y, name) {
    var g = '<g><path d="M' + x + ' ' + (y - 16) + ' L' + (x + 46) + ' ' + (y - 9) + ' L' + (x + 46) + ' ' + (y + 9) + ' L' + x + ' ' + (y + 16) + ' Z" fill="url(#mtl)" stroke="#26374f" stroke-width="1.3"/>' +
      '<line x1="' + (x + 10) + '" y1="' + (y - 13) + '" x2="' + (x + 10) + '" y2="' + (y + 13) + '" stroke="#22344d"/>' +
      '<line x1="' + (x + 24) + '" y1="' + (y - 11) + '" x2="' + (x + 24) + '" y2="' + (y + 11) + '" stroke="#22344d"/>';
    if (name) g += label(x + 23, y + 26, name);
    return g + '</g>';
  }

  // valve (bow-tie)
  function valve(x, y) {
    return '<g><path d="M' + (x - 8) + ' ' + (y - 7) + ' L' + (x + 8) + ' ' + (y + 7) + ' L' + (x + 8) + ' ' + (y - 7) + ' L' + (x - 8) + ' ' + (y + 7) + ' Z" fill="#33507a" stroke="#5a7aa8" stroke-width="1"/>' +
      '<rect x="' + (x - 2) + '" y="' + (y - 13) + '" width="4" height="6" fill="#5a7aa8"/></g>';
  }

  // multitubular (shell & tube) reactor — the EO reactor look
  function shellTubeReactor(x, y, w, h, name) {
    var g = '<g>';
    g += '<rect x="' + x + '" y="' + (y + 8) + '" width="' + w + '" height="' + (h - 16) + '" rx="8" fill="url(#mtl)" stroke="#26374f" stroke-width="1.5"/>';
    // tube sheets
    g += '<rect x="' + (x + 4) + '" y="' + (y + 14) + '" width="' + (w - 8) + '" height="6" fill="#33455f"/>';
    g += '<rect x="' + (x + 4) + '" y="' + (y + h - 20) + '" width="' + (w - 8) + '" height="6" fill="#33455f"/>';
    // catalyst-filled tubes
    var n = Math.floor((w - 16) / 9);
    for (var i = 0; i < n; i++) {
      var tx = x + 10 + i * 9;
      g += '<rect x="' + tx + '" y="' + (y + 20) + '" width="5" height="' + (h - 40) + '" rx="2" fill="#1c2c40" stroke="#33455f" stroke-width="0.6"/>';
      // catalyst pellets
      for (var p = 0; p < 5; p++) g += '<circle cx="' + (tx + 2.5) + '" cy="' + (y + 26 + p * (h - 46) / 4) + '" r="1.7" fill="#9aa7b6"/>';
    }
    // coolant heads
    g += '<path d="M' + x + ' ' + (y + 8) + ' Q' + (x + w / 2) + ' ' + (y - 6) + ' ' + (x + w) + ' ' + (y + 8) + '" fill="#3a4a60" stroke="#26374f"/>';
    g += '<path d="M' + x + ' ' + (y + h - 8) + ' Q' + (x + w / 2) + ' ' + (y + h + 6) + ' ' + (x + w) + ' ' + (y + h - 8) + '" fill="#3a4a60" stroke="#26374f"/>';
    g += '<rect x="' + (x + w * 0.14) + '" y="' + (y + 14) + '" width="6" height="' + (h - 28) + '" fill="url(#sheen)"/>';
    if (name) g += label(x + w / 2, y + h + 16, name);
    return g + '</g>';
  }

  // fired furnace (steam cracker) — convection + radiant, no cartoon flames
  function furnaceScene(w, h) {
    var g = '<g>';
    // radiant firebox
    g += '<rect x="60" y="120" width="150" height="150" rx="6" fill="#161e2b" stroke="#2a3a52" stroke-width="1.4"/>';
    g += '<rect x="66" y="126" width="138" height="138" fill="url(#hot)" opacity="0.55"/>';
    // radiant coils (serpentine)
    var coil = "M90 138";
    for (var r = 0; r < 6; r++) { var yy = 138 + r * 20; coil += " L90 " + (yy + 14) + " Q84 " + (yy + 20) + " 96 " + (yy + 20) + " L176 " + (yy + 20) + " Q188 " + (yy + 20) + " 182 " + (yy + 14); }
    g += '<path d="' + coil + '" fill="none" stroke="#d98a3a" stroke-width="3.4" stroke-linecap="round"/>';
    // burner nozzles along firebox floor (radiant heat, not flames)
    for (var b = 0; b < 5; b++) {
      var bx = 78 + b * 30;
      g += '<ellipse cx="' + bx + '" cy="262" rx="12" ry="7" fill="url(#glow)"/>';
      g += '<rect x="' + (bx - 3) + '" y="258" width="6" height="8" rx="1.5" fill="#3a4a60" stroke="#26374f"/>';
    }
    g += T(135, 292, "Radiant section (burners)", { size: 9.5, fill: "#9db0c8" });
    // convection section (top box with tube bank)
    g += '<rect x="60" y="40" width="150" height="70" rx="5" fill="url(#mtl)" stroke="#26374f" stroke-width="1.3"/>';
    for (var c = 0; c < 6; c++) g += '<line x1="70" y1="' + (50 + c * 10) + '" x2="200" y2="' + (50 + c * 10) + '" stroke="#22344d" stroke-width="2.4"/>';
    g += T(135, 32, "Convection section", { size: 9.5, fill: "#9db0c8" });
    // stack
    g += '<rect x="120" y="10" width="30" height="34" fill="#33425a" stroke="#26374f"/>';
    // TLE (transfer-line exchanger) to the right
    g += hx(238, 178, "Transfer-line exchanger (TLE)");
    g += pipe("M182 145 L238 191", "#d98a3a", 4);
    g += pipe("M296 191 L330 191", "#2f6fe0", 4);
    g += T(320, 182, "cracked gas →", { size: 9, anchor: "end", fill: "#8fb4f0" });
    // feed in
    g += pipe("M20 90 L60 90", "#2f6fe0", 4);
    g += pipe("M20 108 L60 108", "#58c1f0", 3);
    g += T(18, 86, "feed", { size: 9, anchor: "end", fill: "#8fb4f0" });
    g += T(18, 118, "dilution steam", { size: 9, anchor: "end", fill: "#8fd4f0" });
    return g;
  }

  /* ============================================================
     GLYPHS — compact equipment symbol used on each map node
     each returns a <svg> sized to fit a ~150x96 node media area
     ============================================================ */
  function wrapG(inner, w, h) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">' + DEFS + inner + '</svg>';
  }

  var GLYPH = {
    feed: function () {
      var g = tank(14, 30, 40, 46, "", 0.6) + pump(84, 62, "") + hx(104, 40, "");
      g += pipe("M54 58 L71 58", "#2f6fe0", 4) + pipe("M97 58 L104 52", "#2f6fe0", 4);
      g += pipe("M20 84 L120 84", "#58c1f0", 3);
      g += drum(120, 26, 40, 22, "");
      return wrapG(g, 180, 100);
    },
    furnace: function () {
      var g = '<rect x="20" y="46" width="70" height="44" rx="4" fill="#161e2b" stroke="#2a3a52"/>' +
        '<rect x="24" y="50" width="62" height="36" fill="url(#hot)" opacity="0.5"/>';
      var coil = "M34 54"; for (var r = 0; r < 3; r++) { var yy = 54 + r * 11; coil += " L34 " + (yy + 7) + " Q30 " + (yy + 11) + " 40 " + (yy + 11) + " L74 " + (yy + 11) + " Q84 " + (yy + 11) + " 80 " + (yy + 7); }
      g += '<path d="' + coil + '" fill="none" stroke="#d98a3a" stroke-width="2.6"/>';
      g += '<rect x="20" y="18" width="70" height="26" rx="3" fill="url(#mtl)" stroke="#26374f"/>';
      for (var c = 0; c < 4; c++) g += '<line x1="26" y1="' + (24 + c * 5) + '" x2="84" y2="' + (24 + c * 5) + '" stroke="#22344d" stroke-width="1.6"/>';
      g += '<rect x="46" y="6" width="18" height="14" fill="#33425a"/>';
      g += hx(108, 52, "");
      g += pipe("M90 68 L108 66", "#d98a3a", 3.4) + pipe("M170 66 L182 66", "#2f6fe0", 3.4);
      return wrapG(g, 190, 104);
    },
    quench: function () {
      var g = column(30, 12, 34, 74, 5, "") + drum(96, 54, 46, 22, "") + compressor(96, 26, "");
      g += pipe("M64 40 L96 30", "#2f6fe0", 3.4) + pipe("M142 30 L162 30", "#2f6fe0", 3.4);
      g += pipe("M47 86 L47 96", "#58c1f0", 3);
      return wrapG(g, 180, 104);
    },
    treatment: function () {
      var g = column(24, 10, 26, 78, 4, "") + column(66, 10, 26, 78, 4, "") + drum(108, 30, 44, 20, "") + drum(108, 60, 44, 20, "");
      g += pipe("M50 40 L66 40", "#2f6fe0", 3);
      g += pipe("M92 40 L108 40", "#2f6fe0", 3);
      return wrapG(g, 172, 104);
    },
    cryo: function () {
      var g = column(20, 6, 24, 90, 6, "") + column(60, 14, 24, 82, 6, "") + column(100, 8, 26, 88, 7, "");
      g += pipe("M44 50 L60 54", "#2f6fe0", 3) + pipe("M84 54 L100 50", "#2f6fe0", 3);
      g += '<circle cx="150" cy="30" r="14" fill="url(#mtl)" stroke="#26374f"/>' + T(150, 33, "❄", { size: 14, fill: "#8fd4f0" });
      return wrapG(g, 176, 104);
    },
    reactor: function () {
      var g = shellTubeReactor(40, 12, 84, 74, "") + compressor(20, 92, "");
      g += pipe("M10 40 L40 40", "#2f6fe0", 3.4) + pipe("M10 58 L40 58", "#58c1f0", 3);
      g += pipe("M124 48 L150 48", "#17b0a4", 3.4);
      g += '<path d="M132 48 Q160 48 160 92 L44 92" fill="none" stroke="#f2a53a" stroke-width="2.4" stroke-dasharray="7 5"/>';
      return wrapG(g, 176, 108);
    },
    recovery: function () {
      var g = column(26, 8, 26, 84, 5, "") + column(74, 8, 24, 84, 6, "") + column(118, 20, 24, 72, 5, "");
      g += pipe("M13 30 L26 30", "#17b0a4", 3) + pipe("M52 46 L74 46", "#17b0a4", 3) + pipe("M98 46 L118 46", "#17b0a4", 3);
      g += '<path d="M39 8 Q39 -2 60 -2" fill="none" stroke="#f2a53a" stroke-width="2.2" stroke-dasharray="6 5"/>';
      return wrapG(g, 168, 104);
    },
    manifold: function () {
      var g = '<rect x="14" y="46" width="150" height="12" rx="6" fill="url(#mtlH)" stroke="#26374f"/>';
      g += pipe("M0 52 L14 52", "#17b0a4", 5);
      for (var i = 0; i < 6; i++) { var bx = 28 + i * 24; g += valve(bx, 40) + pipe("M" + bx + " 58 L" + bx + " 84", "#17b0a4", 3.4); }
      return wrapG(g, 178, 100);
    },
    glycol: function () {
      var g = '<circle cx="34" cy="40" r="18" fill="url(#mtl)" stroke="#26374f"/>' + T(34, 44, "R", { size: 13, fill: "#cfe" });
      g += column(70, 8, 22, 84, 5, "") + column(108, 8, 22, 84, 6, "") + column(146, 16, 22, 76, 5, "");
      g += pipe("M52 40 L70 40", "#17b0a4", 3);
      return wrapG(g, 186, 104);
    },
    omega: function () {
      var g = '<circle cx="34" cy="34" r="16" fill="url(#mtl)" stroke="#26374f"/>' + T(34, 38, "EC", { size: 10, fill: "#cfe" });
      g += '<circle cx="96" cy="34" r="16" fill="url(#mtl)" stroke="#26374f"/>' + T(96, 38, "H₂O", { size: 8, fill: "#cfe" });
      g += column(140, 12, 24, 80, 6, "");
      g += pipe("M50 34 L80 34", "#17b0a4", 3);
      g += '<path d="M96 50 Q96 84 60 84 Q20 84 20 50" fill="none" stroke="#f2a53a" stroke-width="2.6" stroke-dasharray="8 5"/>';
      g += compressor(40, 84, "");
      return wrapG(g, 178, 104);
    },
    amines: function () {
      var g = '<circle cx="34" cy="40" r="17" fill="url(#mtl)" stroke="#26374f"/>' + T(34, 44, "R", { size: 12, fill: "#cfe" });
      g += column(72, 8, 22, 84, 5, "") + column(110, 8, 22, 84, 6, "") + column(148, 8, 22, 84, 7, "");
      g += pipe("M10 32 L18 32", "#17b0a4", 3) + T(30, 24, "NH₃", { size: 9, fill: "#8fb4f0" });
      return wrapG(g, 186, 104);
    },
    ethoxylation: function () {
      var g = '<rect x="40" y="18" width="60" height="72" rx="26" fill="url(#mtl)" stroke="#26374f"/>';
      g += '<path d="M46 60 A24 12 0 0 0 94 60 L94 78 A24 8 0 0 1 46 78 Z" fill="url(#prod)"/>';
      // stirrer
      g += '<line x1="70" y1="6" x2="70" y2="66" stroke="#8399b4" stroke-width="2.4"/><line x1="58" y1="66" x2="82" y2="66" stroke="#8399b4" stroke-width="2.4"/>';
      g += pipe("M10 34 L40 34", "#17b0a4", 3.4) + T(20, 26, "EO", { size: 9, fill: "#7fd8cf" });
      g += pipe("M120 50 L150 50", "#17b0a4", 3.4);
      return wrapG(g, 168, 104);
    },
    storage: function () {
      var g = tank(14, 26, 48, 56, "", 0.55) + tank(74, 34, 42, 48, "", 0.4);
      g += '<rect x="128" y="40" width="40" height="30" rx="3" fill="url(#mtlH)" stroke="#26374f"/>'; // iso frame
      g += '<path d="M130 70 L166 70" stroke="#8595ad" stroke-width="2"/>';
      g += pipe("M14 86 L168 86", "#8595ad", 3);
      return wrapG(g, 182, 100);
    },
    trade: function () {
      var g = '<rect x="18" y="12" width="140" height="74" rx="6" fill="url(#mtl)" stroke="#26374f"/>';
      g += '<rect x="24" y="18" width="128" height="62" rx="3" fill="#0a1420"/>';
      var cx = [40, 60, 80, 100, 120], hi = [56, 48, 50, 38, 30], lo = [70, 66, 58, 56, 44], up = [1, 0, 1, 1, 1];
      for (var i = 0; i < 5; i++) {
        var col = up[i] ? "#17b0a4" : "#f0544c";
        g += '<line x1="' + cx[i] + '" y1="' + (hi[i] - 5) + '" x2="' + cx[i] + '" y2="' + (lo[i] + 5) + '" stroke="' + col + '" stroke-width="1.3"/>';
        g += '<rect x="' + (cx[i] - 4) + '" y="' + hi[i] + '" width="8" height="' + (lo[i] - hi[i]) + '" rx="1" fill="' + col + '"/>';
      }
      g += '<path d="M40 62 L60 56 L80 52 L100 42 L120 34" fill="none" stroke="#38bdf8" stroke-width="1.6" stroke-linecap="round"/>';
      g += '<ellipse cx="150" cy="92" rx="13" ry="5" fill="#b8901f"/><ellipse cx="150" cy="88" rx="13" ry="5" fill="#f0c860" stroke="#b8901f"/><text x="150" y="91" text-anchor="middle" font-size="8" font-weight="800" fill="#7a5a12">$</text>';
      return wrapG(g, 180, 104);
    }
  };

  /* ============================================================
     ART — detailed scenes for the detail panel & lightbox
     ============================================================ */
  function wrapA(inner, w, h, aria) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet" width="100%" role="img" aria-label="' + esc(aria || "process illustration") + '">' +
      DEFS + '<rect width="' + w + '" height="' + h + '" fill="#0a1420"/>' + inner + '</svg>';
  }
  // subtle blueprint backdrop
  function bp(w, h) {
    var g = '<g opacity="0.5">';
    for (var x = 40; x < w; x += 40) g += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + h + '" stroke="#12233a" stroke-width="1"/>';
    for (var y = 40; y < h; y += 40) g += '<line x1="0" y1="' + y + '" x2="' + w + '" y2="' + y + '" stroke="#12233a" stroke-width="1"/>';
    return g + '</g>';
  }

  var ART = {};

  // ---- scene: petrochemical complex (representative) ----
  ART.complex = function () {
    var w = 640, h = 300, g = '';
    g += '<rect width="' + w + '" height="' + h + '" fill="url(#sky)"/>';
    // distant haze
    g += '<rect y="180" width="' + w + '" height="120" fill="url(#floor)"/>';
    // steam plumes
    [110, 300, 470].forEach(function (sx) {
      g += '<ellipse cx="' + sx + '" cy="120" rx="34" ry="60" fill="url(#steam)" opacity="0.10"/>';
    });
    // pipe rack
    g += '<g stroke="#2a3a52">';
    for (var px = 20; px < w; px += 46) g += '<rect x="' + px + '" y="196" width="8" height="70" fill="#1a2740"/>';
    g += '<rect x="16" y="188" width="' + (w - 30) + '" height="10" fill="#22344d"/>';
    g += '<rect x="16" y="204" width="' + (w - 30) + '" height="6" fill="#1c2c44"/>';
    g += '</g>';
    // column silhouettes of varying height
    var cols = [[70, 60], [120, 110], [170, 40], [250, 150], [300, 90], [360, 130], [430, 70], [480, 120], [540, 100], [590, 150]];
    cols.forEach(function (c) {
      var cx = c[0], ch = c[1], cw = 14 + ch * 0.06;
      g += '<rect x="' + (cx - cw / 2) + '" y="' + (188 - ch) + '" width="' + cw + '" height="' + ch + '" rx="' + (cw / 2) + '" fill="#26364e" stroke="#33455f" stroke-width="1"/>';
      // platforms
      for (var pl = 0; pl < ch; pl += 28) g += '<rect x="' + (cx - cw / 2 - 2) + '" y="' + (186 - pl) + '" width="' + (cw + 4) + '" height="2.5" fill="#3a4a60"/>';
      // aircraft light
      g += '<circle cx="' + cx + '" cy="' + (188 - ch - 3) + '" r="1.8" fill="#f0544c"/>';
    });
    // a couple of tall stacks
    g += '<rect x="612" y="70" width="12" height="118" fill="#2a3a52"/><rect x="610" y="66" width="16" height="8" fill="#33455f"/>';
    // flare (thin, subtle — not a cartoon flame)
    g += '<rect x="30" y="96" width="7" height="92" fill="#2a3a52"/>';
    g += '<path d="M33 96 q6 -10 2 -20 q10 8 4 20 z" fill="#e6903a" opacity="0.7"/>';
    // foreground tanks
    g += tank(150, 214, 70, 60, "", 0);
    g += tank(300, 220, 84, 54, "", 0);
    g += tank(470, 214, 70, 60, "", 0);
    return wrapA(g, w, h, "Representative petrochemical complex at dusk");
  };

  // ---- scene: feed preparation ----
  ART.feedprep = function () {
    var w = 640, h = 300, g = bp(w, h);
    g += tank(40, 120, 72, 120, "Feed storage", 0.62);
    g += drum(180, 150, 90, 40, "Feed drum");
    g += pump(300, 200, "Feed pump");
    g += hx(350, 150, "Feed / effluent exchanger");
    g += drum(450, 120, 90, 40, "Vaporiser");
    // dilution steam mixing tee
    g += '<circle cx="470" cy="212" r="9" fill="#0c1a2e" stroke="#58c1f0"/>' + T(470, 236, "Steam mix tee", { size: 9.5, fill: "#8fd4f0" });
    // pipes
    g += pipe("M112 180 L180 170", "#2f6fe0", 5);
    g += pipe("M270 170 L300 187", "#2f6fe0", 5);
    g += pipe("M313 200 L350 172", "#2f6fe0", 5);
    g += pipe("M408 165 L450 150", "#2f6fe0", 5);
    g += pipe("M470 160 L470 203", "#2f6fe0", 5);
    g += pipe("M540 140 L600 140 L600 205 L479 210", "#2f6fe0", 5);
    g += pipe("M400 270 L470 270 L470 221", "#58c1f0", 4);
    g += T(400, 284, "dilution steam", { size: 10, anchor: "start", fill: "#8fd4f0" });
    g += pipe("M600 205 L636 205", "#2f6fe0", 5);
    g += T(634, 196, "to furnace →", { size: 10, anchor: "end", fill: "#8fb4f0" });
    return wrapA(g, w, h, "Feed preparation area");
  };

  // ---- scene: steam cracking furnace ----
  ART.furnace = function () {
    var w = 640, h = 320, g = bp(w, h);
    g += furnaceScene(w, h);
    // temperature ramp annotation
    g += '<rect x="360" y="40" width="250" height="96" rx="8" fill="#0b1626" stroke="#26374f"/>';
    g += T(372, 60, "Temperature through furnace", { size: 11, anchor: "start", fill: "#c6d4e6", weight: 700 });
    g += '<defs><linearGradient id="tramp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2f6fe0"/><stop offset="1" stop-color="#e6903a"/></linearGradient></defs>';
    g += '<rect x="372" y="72" width="226" height="12" rx="6" fill="url(#tramp)"/>';
    g += T(372, 102, "~600 °C in", { size: 10, anchor: "start", fill: "#8fb4f0" });
    g += T(598, 102, "800–875 °C out", { size: 10, anchor: "end", fill: "#e6b07a" });
    g += T(372, 122, "Very short residence time · rapid TLE quench", { size: 9.5, anchor: "start", fill: "#9db0c8" });
    return wrapA(g, w, h, "Steam cracking furnace");
  };

  // ---- scene: quench + compression ----
  ART.quench = function () {
    var w = 640, h = 300, g = bp(w, h);
    g += column(40, 40, 60, 170, 7, "Quench tower");
    g += drum(150, 200, 90, 36, "Quench-water drum");
    // compressor train (multi-stage) with intercoolers
    var cx = 300;
    for (var s = 0; s < 3; s++) {
      g += compressor(cx + s * 96, 90, "Stage " + (s + 1));
      g += hx(cx + s * 96 + 8, 140, "Intercooler");
      g += drum(cx + s * 96 - 4, 190, 60, 26, "K.O. drum");
    }
    g += pipe("M100 90 L300 88", "#2f6fe0", 5);
    g += T(180, 80, "cracked gas", { size: 10, fill: "#8fb4f0" });
    for (var s2 = 0; s2 < 2; s2++) g += pipe("M" + (cx + s2 * 96 + 46) + " 90 L" + (cx + (s2 + 1) * 96) + " 90", "#2f6fe0", 5);
    g += pipe("M70 210 L70 250", "#58c1f0", 4) + T(70, 264, "quench water", { size: 9.5, fill: "#8fd4f0" });
    g += pipe("M488 88 L620 88", "#2f6fe0", 5) + T(618, 80, "compressed gas →", { size: 10, anchor: "end", fill: "#8fb4f0" });
    return wrapA(g, w, h, "Quench and multi-stage compression");
  };

  // ---- scene: acid-gas removal + drying ----
  ART.treatment = function () {
    var w = 640, h = 300, g = bp(w, h);
    g += column(60, 30, 46, 190, 8, "Caustic / amine absorber");
    g += column(180, 30, 46, 190, 8, "Regenerator");
    g += drum(300, 120, 90, 40, "Mol-sieve dryer A");
    g += drum(300, 180, 90, 40, "Mol-sieve dryer B");
    g += hx(450, 90, "Chiller");
    g += pipe("M20 120 L60 120", "#2f6fe0", 5) + T(18, 112, "compressed gas", { size: 9.5, anchor: "end", fill: "#8fb4f0" });
    g += pipe("M106 120 L180 120", "#2f6fe0", 5);
    g += pipe("M226 120 L300 140", "#2f6fe0", 5);
    g += pipe("M390 140 L450 110", "#2f6fe0", 5);
    g += pipe("M508 100 L620 100", "#2f6fe0", 5) + T(618, 92, "to cryo separation →", { size: 9.5, anchor: "end", fill: "#8fb4f0" });
    // CO2 / acid gas side stream
    g += '<path d="M203 30 Q203 12 260 12 L360 12" fill="none" stroke="#f2a53a" stroke-width="3" stroke-dasharray="9 6"/>';
    g += T(360, 8, "acid gas / CO₂ →", { size: 9.5, anchor: "start", fill: "#e6b07a" });
    g += T(300, 250, "Water & CO₂ removed before cryogenic separation (they would freeze).", { size: 10, fill: "#9db0c8" });
    return wrapA(g, w, h, "Acid-gas removal and drying");
  };

  // ---- scene: cryogenic separation train ----
  ART.cryo = function () {
    var w = 680, h = 300, g = bp(w, h);
    var names = ["Demethaniser", "Deethaniser", "C₂ acetylene\nconverter", "Ethylene splitter"];
    var xs = [40, 150, 260, 360];
    g += column(xs[0], 30, 52, 200, 9, "Demethaniser");
    g += column(xs[1], 30, 52, 200, 9, "Deethaniser");
    g += shellTubeReactor(xs[2], 60, 70, 90, "Acetylene converter");
    g += column(xs[3], 20, 64, 210, 12, "Ethylene splitter");
    // highlight splitter
    g += '<rect x="' + (xs[3] - 8) + '" y="12" width="80" height="248" rx="10" fill="none" stroke="#17b0a4" stroke-width="1.6" stroke-dasharray="5 5"/>';
    g += T(xs[3] + 32, 8, "high-purity ethylene", { size: 9.5, fill: "#7fd8cf" });
    // refrigeration
    g += compressor(470, 250, "Refrigeration");
    g += '<circle cx="560" cy="60" r="18" fill="url(#mtl)" stroke="#26374f"/>' + T(560, 64, "❄", { size: 16, fill: "#8fd4f0" }) + label(560, 96, "Cold box");
    // flows
    g += pipe("M20 130 L40 130", "#2f6fe0", 5) + T(18, 122, "dry gas", { size: 9, anchor: "end", fill: "#8fb4f0" });
    g += pipe("M92 130 L150 130", "#2f6fe0", 5);
    g += pipe("M202 130 L260 100", "#2f6fe0", 5);
    g += pipe("M330 105 L360 110", "#2f6fe0", 5);
    g += pipe("M424 120 L470 120 L470 90 L620 90", "#17b0a4", 5) + T(618, 82, "purified ethylene → EO unit", { size: 9.5, anchor: "end", fill: "#7fd8cf" });
    // recycle / methane & propylene draws
    g += '<path d="M66 30 Q66 14 120 14 L160 14" fill="none" stroke="#f2a53a" stroke-width="2.6" stroke-dasharray="8 5"/>' + T(160, 10, "CH₄ / H₂", { size: 9, anchor: "start", fill: "#e6b07a" });
    g += '<path d="M176 230 Q176 250 230 250 L300 250" fill="none" stroke="#f2a53a" stroke-width="2.6" stroke-dasharray="8 5"/>' + T(300, 262, "C₃+ to recovery", { size: 9, anchor: "start", fill: "#e6b07a" });
    return wrapA(g, w, h, "Cryogenic separation train");
  };

  // ---- scene: EO reactor system ----
  ART.eoreactor = function () {
    var w = 660, h = 320, g = bp(w, h);
    g += shellTubeReactor(230, 40, 150, 190, "Multitubular EO reactor");
    g += T(305, 20, "silver-catalyst tubes · heat-transfer fluid in shell", { size: 9.5, fill: "#9db0c8" });
    // mixer + preheater
    g += '<circle cx="120" cy="120" r="14" fill="#0c1a2e" stroke="#17b0a4"/>' + T(120, 124, "mix", { size: 9, fill: "#7fd8cf" }) + label(120, 148, "Gas mixer");
    g += hx(150, 176, "Feed preheater");
    // effluent cooler + separator
    g += hx(410, 90, "Effluent cooler");
    g += drum(410, 160, 96, 40, "Gas separator");
    g += compressor(410, 250, "Recycle compressor");
    // feeds
    g += pipe("M20 80 L106 110", "#2f6fe0", 5) + T(18, 74, "ethylene", { size: 9.5, anchor: "end", fill: "#7fd8cf" });
    g += pipe("M20 150 L106 130", "#58c1f0", 4) + T(18, 158, "oxygen", { size: 9.5, anchor: "end", fill: "#8fd4f0" });
    g += pipe("M134 120 L150 176", "#2f6fe0", 4);
    g += pipe("M208 186 L230 150", "#2f6fe0", 5);
    // reactor out
    g += pipe("M380 120 L410 105", "#17b0a4", 5) + T(395, 96, "reactor effluent", { size: 9, fill: "#7fd8cf" });
    g += pipe("M468 118 L458 160", "#17b0a4", 5);
    // recycle loop (prominent amber)
    g += '<path d="M458 200 L458 250" fill="none" stroke="#f2a53a" stroke-width="3" stroke-dasharray="9 6"/>';
    g += '<path d="M410 258 L120 258 Q100 258 100 180 L107 128" fill="none" stroke="#f2a53a" stroke-width="3" stroke-dasharray="9 6"/>';
    g += T(250, 272, "reactor recycle gas", { size: 9.5, fill: "#e6b07a" });
    // CO2 purge
    g += '<path d="M506 178 L560 178" fill="none" stroke="#f2a53a" stroke-width="2.6" stroke-dasharray="7 5"/>' + T(562, 182, "CO₂ / purge", { size: 9, anchor: "start", fill: "#e6b07a" });
    // crude EO out
    g += pipe("M506 168 L560 168 L560 120 L636 120", "#17b0a4", 5) + T(634, 112, "crude EO →", { size: 9.5, anchor: "end", fill: "#7fd8cf" });
    return wrapA(g, w, h, "Ethylene oxide reactor system");
  };

  // ---- scene: EO recovery + purification ----
  ART.eorecovery = function () {
    var w = 660, h = 300, g = bp(w, h);
    g += column(50, 20, 52, 210, 9, "EO absorber");
    g += column(180, 20, 48, 210, 9, "EO stripper");
    g += column(310, 30, 44, 190, 8, "Light-ends column");
    g += column(430, 30, 44, 190, 9, "EO purification");
    g += tank(560, 150, 60, 90, "Purified EO", 0.6);
    // reactor effluent in
    g += pipe("M20 180 L50 180", "#17b0a4", 5) + T(18, 172, "reactor effluent", { size: 9, anchor: "end", fill: "#7fd8cf" });
    // recycle gas back to reactor (top of absorber)
    g += '<path d="M76 20 Q76 6 130 6 L240 6" fill="none" stroke="#f2a53a" stroke-width="3" stroke-dasharray="9 6"/>' + T(240, 2, "recycle gas → reactor", { size: 9, anchor: "start", fill: "#e6b07a" });
    // water circulation
    g += pipe("M76 20 L76 -0", "#58c1f0", 0);
    g += '<path d="M40 60 Q20 60 20 130 Q20 200 44 200" fill="none" stroke="#58c1f0" stroke-width="3"/>' + T(14, 130, "lean water", { size: 9, anchor: "end", fill: "#8fd4f0" });
    g += pipe("M102 150 L180 150", "#17b0a4", 5) + T(140, 142, "EO-rich water", { size: 9, fill: "#7fd8cf" });
    g += pipe("M228 120 L310 120", "#17b0a4", 5);
    g += pipe("M354 120 L430 120", "#17b0a4", 5);
    g += pipe("M474 120 L560 175", "#17b0a4", 5) + T(520, 150, "purified EO", { size: 9, fill: "#7fd8cf" });
    // light ends
    g += '<path d="M332 30 Q332 16 380 16" fill="none" stroke="#f2a53a" stroke-width="2.4" stroke-dasharray="7 5"/>' + T(384, 20, "light ends", { size: 9, anchor: "start", fill: "#e6b07a" });
    // reboiler steam
    g += pipe("M204 230 L204 260", "#58c1f0", 3) + T(204, 274, "steam", { size: 9, fill: "#8fd4f0" });
    g += pipe("M620 190 L640 190", "#17b0a4", 5) + T(638, 210, "→ distribution", { size: 9.5, anchor: "end", fill: "#7fd8cf" });
    return wrapA(g, w, h, "EO recovery and purification");
  };

  // ---- scene: EO distribution header ----
  ART.manifold = function () {
    var w = 660, h = 280, g = bp(w, h);
    g += '<rect x="40" y="70" width="580" height="18" rx="9" fill="url(#mtlH)" stroke="#26374f" stroke-width="1.3"/>';
    g += '<rect x="46" y="73" width="560" height="5" fill="url(#sheen)"/>';
    g += pipe("M10 79 L40 79", "#17b0a4", 6) + T(24, 64, "purified EO", { size: 10, fill: "#7fd8cf" });
    var branches = ["EO → glycols", "HPEO → ethanolamines", "HPEO → ethoxylates", "HPEO → PEG", "HPEO → glycol ethers", "HPEO → polyols", "EO by pipeline"];
    branches.forEach(function (b, i) {
      var bx = 80 + i * 78;
      g += valve(bx, 58);
      g += pipe("M" + bx + " 88 L" + bx + " 150", "#17b0a4", 4);
      g += '<rect x="' + (bx - 34) + '" y="150" width="68" height="46" rx="6" fill="#0b1626" stroke="#1a5c55"/>';
      g += foreignLabel(bx, 168, b);
    });
    g += T(330, 236, "Conceptual EO distribution header — not plant piping configuration", { size: 10, fill: "#e6b07a" });
    return wrapA(g, w, h, "EO distribution header");
  };
  function foreignLabel(cx, cy, txt) {
    var parts = txt.split(" → ");
    return T(cx, cy, parts[0], { size: 9, fill: "#7fd8cf", weight: 700 }) + T(cx, cy + 13, parts[1] || "", { size: 8.5, fill: "#9db0c8" });
  }

  // ---- scene: conventional glycol hydration ----
  ART.glycol = function () {
    var w = 680, h = 300, g = bp(w, h);
    g += '<circle cx="70" cy="120" r="12" fill="#0c1a2e" stroke="#17b0a4"/>' + T(70, 124, "mix", { size: 8, fill: "#7fd8cf" });
    g += shellTubeReactor(110, 70, 90, 110, "Hydration reactor");
    // multiple-effect evaporators
    for (var e = 0; e < 3; e++) g += drum(240 + e * 74, 60, 66, 30, "Evap " + (e + 1));
    // distillation ladder MEG/DEG/TEG
    g += column(250, 130, 40, 130, 6, "MEG col");
    g += column(340, 140, 40, 120, 6, "DEG col");
    g += column(430, 150, 40, 110, 6, "TEG col");
    g += tank(540, 150, 44, 100, "MEG", 0.6);
    // feeds
    g += pipe("M20 100 L58 114", "#17b0a4", 5) + T(18, 94, "EO", { size: 9.5, anchor: "end", fill: "#7fd8cf" });
    g += pipe("M20 140 L58 126", "#58c1f0", 4) + T(18, 148, "excess water (~20:1)", { size: 9, anchor: "end", fill: "#8fd4f0" });
    g += pipe("M82 120 L110 120", "#17b0a4", 5);
    g += pipe("M200 120 L240 90", "#17b0a4", 5);
    g += pipe("M306 82 L340 82 L340 60", "#58c1f0", 4) + T(360, 52, "water recycle", { size: 9, anchor: "start", fill: "#e6b07a" });
    g += pipe("M270 260 L520 260 L520 175", "#17b0a4", 4) + T(400, 274, "MEG product", { size: 9.5, fill: "#7fd8cf" });
    return wrapA(g, w, h, "Conventional glycol hydration and separation");
  };

  // ---- scene: Shell OMEGA route ----
  ART.omega = function () {
    var w = 660, h = 300, g = bp(w, h);
    g += shellTubeReactor(90, 50, 90, 110, "EC reactor");
    g += T(135, 40, "EO + CO₂ → ethylene carbonate", { size: 9, fill: "#9db0c8" });
    g += shellTubeReactor(300, 50, 90, 110, "Hydrolysis reactor");
    g += T(345, 40, "EC + H₂O → MEG + CO₂", { size: 9, fill: "#9db0c8" });
    g += column(470, 40, 44, 180, 8, "MEG purification");
    g += drum(300, 210, 90, 34, "CO₂ separator");
    g += compressor(180, 250, "CO₂ recycle compressor");
    g += tank(580, 130, 44, 90, "MEG", 0.6);
    // feeds
    g += pipe("M20 80 L90 80", "#17b0a4", 5) + T(18, 74, "EO", { size: 9.5, anchor: "end", fill: "#7fd8cf" });
    g += pipe("M20 130 L90 130", "#f2a53a", 4) + T(18, 138, "CO₂ feed", { size: 9, anchor: "end", fill: "#e6b07a" });
    g += pipe("M180 100 L300 100", "#b58be0", 5) + T(240, 92, "ethylene carbonate", { size: 9, fill: "#c9aef0" });
    g += pipe("M260 160 L200 130", "#58c1f0", 4) + T(250, 175, "H₂O", { size: 9, fill: "#8fd4f0" });
    g += pipe("M390 100 L470 100", "#17b0a4", 5);
    g += pipe("M514 130 L580 155", "#17b0a4", 5) + T(548, 140, "MEG", { size: 9, fill: "#7fd8cf" });
    // prominent CO2 recycle loop
    g += '<path d="M345 160 L345 210" fill="none" stroke="#f2a53a" stroke-width="3.4" stroke-dasharray="10 6"/>';
    g += '<path d="M300 227 L206 227 L206 250" fill="none" stroke="#f2a53a" stroke-width="3.4" stroke-dasharray="10 6"/>';
    g += '<path d="M180 258 L60 258 L60 130 L90 118" fill="none" stroke="#f2a53a" stroke-width="3.4" stroke-dasharray="10 6"/>';
    g += T(230, 242, "CO₂ recycle loop", { size: 10, fill: "#e6b07a", weight: 700 });
    return wrapA(g, w, h, "Shell OMEGA glycol route with CO₂ recycle");
  };

  // ---- scene: ethanolamines ----
  ART.amines = function () {
    var w = 660, h = 300, g = bp(w, h);
    g += shellTubeReactor(120, 60, 90, 110, "Amination reactor");
    g += drum(250, 60, 80, 34, "NH₃ recovery");
    g += column(370, 30, 42, 200, 7, "MEA column");
    g += column(460, 30, 42, 200, 8, "DEA column");
    g += column(550, 30, 42, 200, 9, "TEA column");
    g += pipe("M20 90 L120 90", "#17b0a4", 5) + T(18, 84, "EO", { size: 9.5, anchor: "end", fill: "#7fd8cf" });
    g += pipe("M20 140 L120 140", "#58c1f0", 4) + T(18, 148, "ammonia", { size: 9, anchor: "end", fill: "#8fd4f0" });
    g += pipe("M210 110 L250 90", "#17b0a4", 5);
    g += pipe("M290 94 L290 130 L370 130", "#17b0a4", 5);
    // NH3 recycle
    g += '<path d="M290 60 Q290 30 200 30 L150 30 L150 58" fill="none" stroke="#f2a53a" stroke-width="2.8" stroke-dasharray="9 5"/>' + T(220, 24, "NH₃ recycle", { size: 9, fill: "#e6b07a" });
    g += pipe("M412 130 L460 130", "#17b0a4", 4);
    g += pipe("M502 130 L550 130", "#17b0a4", 4);
    g += T(391, 250, "MEA", { size: 10, fill: "#7fd8cf", weight: 700 }) + T(481, 250, "DEA", { size: 10, fill: "#7fd8cf", weight: 700 }) + T(571, 250, "TEA", { size: 10, fill: "#7fd8cf", weight: 700 });
    g += T(330, 278, "EO : ammonia ratio sets the MEA / DEA / TEA split", { size: 10, fill: "#9db0c8" });
    return wrapA(g, w, h, "Ethanolamines process");
  };

  // ---- scene: ethoxylation ----
  ART.ethoxylation = function () {
    var w = 620, h = 300, g = bp(w, h);
    // reactor vessel with stirrer
    g += '<rect x="180" y="60" width="120" height="150" rx="46" fill="url(#mtl)" stroke="#26374f" stroke-width="1.5"/>';
    g += '<path d="M188 150 A52 20 0 0 0 292 150 L292 194 A52 14 0 0 1 188 194 Z" fill="url(#prod)"/>';
    g += '<line x1="240" y1="34" x2="240" y2="160" stroke="#8399b4" stroke-width="3"/><line x1="216" y1="160" x2="264" y2="160" stroke="#8399b4" stroke-width="3"/><line x1="222" y1="150" x2="258" y2="150" stroke="#8399b4" stroke-width="3"/>';
    g += label(240, 226, "Stirred ethoxylation reactor");
    // controlled EO addition
    g += drum(60, 60, 80, 30, "EO metering");
    g += pipe("M100 90 L100 120 L180 120", "#17b0a4", 4) + T(120, 112, "controlled EO", { size: 9, fill: "#7fd8cf" });
    g += pipe("M20 160 L180 160", "#8595ad", 4) + T(18, 154, "fatty alcohol / initiator", { size: 9, anchor: "end", fill: "#a9bcd6" });
    // cooling coil note
    g += hx(360, 90, "Reaction cooler");
    g += pipe("M300 110 L360 100", "#17b0a4", 4);
    g += drum(430, 150, 90, 34, "Finishing");
    g += pipe("M418 100 L470 100 L470 150", "#17b0a4", 4);
    g += pipe("M520 167 L600 167", "#17b0a4", 5) + T(598, 158, "ethoxylate →", { size: 9.5, anchor: "end", fill: "#7fd8cf" });
    // amphiphile schematic
    g += ART._amphiphile(330, 210);
    return wrapA(g, w, h, "Ethoxylation reactor and product");
  };
  ART._amphiphile = function (x, y) {
    var g = '<g>';
    g += '<line x1="' + x + '" y1="' + y + '" x2="' + (x + 60) + '" y2="' + y + '" stroke="#d98a3a" stroke-width="3"/>';
    for (var i = 0; i < 4; i++) g += '<path d="M' + (x + i * 15) + ' ' + y + ' l7 -8 l8 8" fill="none" stroke="#d98a3a" stroke-width="3"/>';
    for (var b = 0; b < 4; b++) g += '<circle cx="' + (x + 66 + b * 14) + '" cy="' + y + '" r="5.5" fill="#17b0a4"/>';
    g += '<circle cx="' + (x + 66 + 4 * 14) + '" cy="' + y + '" r="5" fill="#c0453c"/>';
    g += T(x + 30, y + 18, "hydrophobic tail", { size: 8, fill: "#e6b07a" }) + T(x + 96, y + 18, "hydrophilic EO chain", { size: 8, fill: "#7fd8cf" });
    return g + '</g>';
  };

  // ---- scene: PEG / polyether ----
  ART.peg = function () {
    var w = 600, h = 280, g = bp(w, h);
    g += '<rect x="150" y="50" width="120" height="150" rx="44" fill="url(#mtl)" stroke="#26374f" stroke-width="1.5"/>';
    g += '<path d="M158 140 A52 18 0 0 0 262 140 L262 184 A52 12 0 0 1 158 184 Z" fill="url(#prod)"/>';
    g += '<line x1="210" y1="26" x2="210" y2="150" stroke="#8399b4" stroke-width="3"/><line x1="188" y1="150" x2="232" y2="150" stroke="#8399b4" stroke-width="3"/>';
    g += label(210, 216, "Polymerisation reactor");
    g += drum(40, 60, 80, 28, "EO feed");
    g += pipe("M80 88 L80 110 L150 110", "#17b0a4", 4) + T(96, 102, "EO addition", { size: 9, fill: "#7fd8cf" });
    g += pipe("M20 150 L150 150", "#8595ad", 4) + T(18, 144, "initiator", { size: 9, anchor: "end", fill: "#a9bcd6" });
    g += drum(340, 140, 90, 32, "Finishing / grades");
    g += pipe("M270 120 L380 120 L380 140", "#17b0a4", 4);
    g += pipe("M430 156 L560 156", "#17b0a4", 5) + T(558, 148, "PEG grades →", { size: 9.5, anchor: "end", fill: "#7fd8cf" });
    // bracket formula
    g += '<g transform="translate(360,210)">' +
      T(-70, 5, "HO", { size: 12, fill: "#c6d4e6" }) +
      '<path d="M-46 -14 q-6 0 -6 6 v10 q0 6 6 6" fill="none" stroke="#7fd8cf" stroke-width="2"/>' +
      T(-6, 5, "CH₂CH₂O", { size: 12, fill: "#7fd8cf" }) +
      '<path d="M40 -14 q6 0 6 6 v10 q0 6 -6 6" fill="none" stroke="#7fd8cf" stroke-width="2"/>' +
      T(56, 12, "n", { size: 11, fill: "#e6b07a" }) +
      T(74, 5, "H", { size: 12, fill: "#c6d4e6" }) + '</g>';
    return wrapA(g, w, h, "PEG polymerisation");
  };

  // ---- scene: glycol ethers ----
  ART.glycolethers = function () {
    var w = 600, h = 280, g = bp(w, h);
    g += shellTubeReactor(130, 60, 90, 110, "Etherification reactor");
    g += column(300, 30, 44, 190, 7, "Purification");
    g += column(400, 40, 44, 180, 7, "Product cut");
    g += tank(510, 130, 46, 90, "Glycol ether", 0.55);
    g += pipe("M20 90 L130 90", "#8595ad", 5) + T(18, 84, "alcohol feed", { size: 9, anchor: "end", fill: "#a9bcd6" });
    g += pipe("M20 140 L130 140", "#17b0a4", 5) + T(18, 148, "EO", { size: 9.5, anchor: "end", fill: "#7fd8cf" });
    g += pipe("M220 110 L300 110", "#17b0a4", 5);
    g += pipe("M344 110 L400 110", "#17b0a4", 5);
    g += pipe("M444 120 L510 155", "#17b0a4", 5);
    return wrapA(g, w, h, "Glycol ethers process");
  };

  // ---- scene: polyether polyols ----
  ART.polyols = function () {
    var w = 620, h = 290, g = bp(w, h);
    g += '<rect x="150" y="50" width="120" height="150" rx="42" fill="url(#mtl)" stroke="#26374f" stroke-width="1.5"/>';
    g += '<path d="M158 140 A52 18 0 0 0 262 140 L262 184 A52 12 0 0 1 158 184 Z" fill="url(#prod)"/>';
    g += '<line x1="210" y1="26" x2="210" y2="150" stroke="#8399b4" stroke-width="3"/><line x1="188" y1="150" x2="232" y2="150" stroke="#8399b4" stroke-width="3"/>';
    g += label(210, 216, "Alkoxylation reactor");
    g += drum(40, 44, 78, 26, "EO / PO");
    g += pipe("M79 70 L79 104 L150 104", "#17b0a4", 4) + T(96, 96, "EO / PO addition", { size: 9, fill: "#7fd8cf" });
    g += pipe("M20 150 L150 150", "#8595ad", 4) + T(18, 144, "initiator", { size: 9, anchor: "end", fill: "#a9bcd6" });
    g += drum(340, 150, 90, 32, "Finishing");
    g += pipe("M270 120 L380 120 L380 150", "#17b0a4", 4);
    g += pipe("M430 166 L520 166", "#17b0a4", 5) + T(560, 160, "polyol", { size: 9.5, anchor: "end", fill: "#7fd8cf" });
    g += '<rect x="520" y="150" width="80" height="34" rx="6" fill="#0b1626" stroke="#1a5c55"/>' + T(560, 172, "→ polyurethane", { size: 9, fill: "#7fd8cf" });
    return wrapA(g, w, h, "Polyether polyols process");
  };

  // ---- scene: storage & delivery ----
  ART.storage = function () {
    var w = 700, h = 300, g = '';
    g += '<rect width="' + w + '" height="' + h + '" fill="url(#sky)"/>';
    g += '<rect y="200" width="' + w + '" height="100" fill="url(#floor)"/>';
    // tank farm
    g += tank(40, 120, 90, 100, "Product tank", 0.6);
    g += tank(150, 130, 80, 90, "Tank", 0.5);
    g += tank(250, 125, 84, 95, "Tank", 0.7);
    // loading pump + arm
    g += pump(380, 210, "Loading pump");
    g += '<rect x="420" y="120" width="10" height="80" fill="#33455f"/>';
    g += '<path d="M425 130 L470 150 L470 180" fill="none" stroke="#8595ad" stroke-width="5"/>' + T(452, 118, "loading arm", { size: 9, fill: "#a9bcd6" });
    // tanker truck
    g += '<g><rect x="452" y="184" width="86" height="26" rx="12" fill="url(#mtlH)" stroke="#26374f"/>' +
      '<rect x="536" y="182" width="26" height="28" rx="3" fill="#33455f"/>' +
      '<circle cx="472" cy="216" r="8" fill="#1a2740" stroke="#33455f"/><circle cx="512" cy="216" r="8" fill="#1a2740" stroke="#33455f"/><circle cx="548" cy="216" r="8" fill="#1a2740" stroke="#33455f"/></g>';
    g += label(500, 236, "Road tanker");
    // jetty + ship
    g += '<rect x="560" y="250" width="140" height="8" fill="#22344d"/>';
    g += '<path d="M600 250 L690 250 L678 274 L612 274 Z" fill="#26364e" stroke="#33455f"/>' + '<rect x="628" y="230" width="40" height="20" fill="#33455f"/>';
    g += label(645, 290, "Marine loading / vessel");
    // ISO tank
    g += '<g><rect x="150" y="240" width="70" height="34" rx="4" fill="url(#mtlH)" stroke="#26374f"/><ellipse cx="168" cy="257" rx="8" ry="15" fill="#4c5f79"/><rect x="150" y="240" width="70" height="34" rx="4" fill="none" stroke="#5a7aa8"/></g>' + label(185, 288, "ISO tank");
    g += pipe("M334 175 L380 197", "#8595ad", 4);
    return wrapA(g, w, h, "Storage and delivery / tank farm and loading");
  };

  // ---- scene: market / benchmark price screen ----
  ART.trade = function () {
    var w = 640, h = 300, g = bp(w, h);
    // trading screen
    g += '<rect x="36" y="26" width="392" height="214" rx="10" fill="url(#mtl)" stroke="#26374f"/>';
    g += '<rect x="48" y="38" width="368" height="168" rx="4" fill="#0a1420"/>';
    var i;
    for (i = 1; i < 6; i++) g += '<line x1="48" y1="' + (38 + i * 28) + '" x2="416" y2="' + (38 + i * 28) + '" stroke="#12233a"/>';
    // candlesticks
    var xs = [78, 118, 158, 198, 238, 278, 318, 358], base = 150;
    var hs = [40, 60, 52, 78, 70, 96, 88, 112], bod = [16, 22, 14, 24, 12, 20, 16, 22], upd = [1, 0, 1, 1, 0, 1, 1, 1];
    for (i = 0; i < xs.length; i++) {
      var col = upd[i] ? "#17b0a4" : "#f0544c";
      var top = base - hs[i];
      g += '<line x1="' + xs[i] + '" y1="' + (top - 8) + '" x2="' + xs[i] + '" y2="' + (base - hs[i] + bod[i] + 8) + '" stroke="' + col + '" stroke-width="1.6"/>';
      g += '<rect x="' + (xs[i] - 6) + '" y="' + top + '" width="12" height="' + bod[i] + '" rx="1.5" fill="' + col + '"/>';
    }
    // trend line
    g += '<path d="M78 116 L118 96 L158 104 L198 78 L238 86 L278 58 L318 66 L358 42" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>';
    g += T(60, 56, "MEG CFR CHINA", { size: 11, anchor: "start", fill: "#8fb4f0" });
    g += T(404, 56, "▲ illustrative", { size: 9.5, anchor: "end", fill: "#17b0a4" });
    g += label(232, 226, "Benchmark price screen");
    // ship delivering product → market, with coins
    g += '<path d="M470 150 h120 l-12 24 h-96 z" fill="url(#mtlH)" stroke="#26374f"/>';
    g += '<rect x="486" y="132" width="40" height="18" fill="#33455f" stroke="#26374f"/><rect x="536" y="126" width="30" height="24" fill="#3a4a60" stroke="#26374f"/>';
    g += '<line x1="470" y1="150" x2="590" y2="150" stroke="#58c1f0" stroke-width="1.4" stroke-dasharray="2 4"/>';
    g += pipe("M418 150 L470 158", "#17b0a4", 4);
    // coin stack
    var cy = 210;
    for (i = 0; i < 4; i++) g += '<ellipse cx="530" cy="' + (cy - i * 8) + '" rx="26" ry="9" fill="' + (i % 2 ? "#e0b341" : "#f0c860") + '" stroke="#b8901f"/>';
    g += T(530, cy - 24, "$", { size: 15, fill: "#7a5a12", weight: 800 });
    g += label(530, 236, "Priced & sold");
    return wrapA(g, w, h, "Market benchmark price screen and sale");
  };

  /* ============================================================
     APPLICATIONS — realistic product/end-use illustrations
     ============================================================ */
  function wrapApp(inner, aria) { return wrapA(inner, 200, 150, aria); }

  var APP = {
    petbottle: function () {
      var g = '<rect width="200" height="150" fill="#0e1c2b"/>';
      g += '<g transform="translate(100,78)">';
      g += '<path d="M-18 -54 q0 -8 18 -8 q18 0 18 8 l0 10 q6 6 6 16 l0 50 q0 14 -24 14 q-24 0 -24 -14 l0 -50 q0 -10 6 -16 z" fill="#bfe9f2" opacity="0.28" stroke="#7fd8cf" stroke-width="1.6"/>';
      g += '<rect x="-14" y="-64" width="28" height="8" rx="2" fill="#7fd8cf"/>';
      g += '<path d="M-24 6 h48" stroke="#7fd8cf" stroke-width="1" opacity="0.5"/><path d="M-24 -6 h48" stroke="#7fd8cf" stroke-width="1" opacity="0.5"/>';
      g += '<rect x="-24" y="18" width="48" height="26" rx="3" fill="#17b0a4" opacity="0.5"/>';
      g += '</g>';
      g += T(100, 138, "PET bottle", { size: 11, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "PET bottle");
    },
    fiber: function () {
      var g = '<rect width="200" height="150" fill="#141026"/>';
      for (var i = 0; i < 14; i++) g += '<path d="M' + (30 + i * 11) + ' 20 q10 40 -4 100" fill="none" stroke="#8fd4f0" stroke-width="2.4" opacity="0.7"/>';
      g += '<rect x="20" y="98" width="160" height="16" fill="#17b0a4" opacity="0.4"/>';
      g += T(100, 138, "Polyester fibre", { size: 11, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Polyester fibre");
    },
    film: function () {
      var g = '<rect width="200" height="150" fill="#10202b"/>';
      g += '<path d="M30 40 q40 -12 80 0 q40 12 60 0 l0 70 q-20 12 -60 0 q-40 -12 -80 0 z" fill="#bfe9f2" opacity="0.22" stroke="#7fd8cf"/>';
      g += '<path d="M30 60 q40 -10 80 0 q40 10 60 0" fill="none" stroke="#7fd8cf" opacity="0.5"/>';
      g += T(100, 138, "Packaging film", { size: 11, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Packaging film");
    },
    antifreeze: function () {
      var g = '<rect width="200" height="150" fill="#0e1c2b"/>';
      g += '<rect x="66" y="34" width="68" height="86" rx="8" fill="#1e7f5f" opacity="0.55" stroke="#2dd4bf"/>';
      g += '<rect x="82" y="20" width="24" height="16" rx="3" fill="#2dd4bf"/>';
      g += '<rect x="74" y="60" width="52" height="36" rx="3" fill="#0a1420" opacity="0.6"/>';
      g += '<path d="M80 96 l8 -16 l6 10 l8 -20 l6 26" fill="none" stroke="#8fd4f0" stroke-width="2"/>';
      g += T(100, 138, "Engine coolant / antifreeze", { size: 10, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Antifreeze");
    },
    coolant: function () { return APP.antifreeze(); },
    resin: function () {
      var g = '<rect width="200" height="150" fill="#181226"/>';
      g += '<path d="M40 110 q0 -60 60 -60 q60 0 60 60 z" fill="#c98a2e" opacity="0.4" stroke="#e6b07a"/>';
      g += '<ellipse cx="100" cy="52" rx="60" ry="12" fill="#e6b07a" opacity="0.35"/>';
      g += T(100, 138, "Unsaturated polyester resin", { size: 10, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Polyester resin");
    },
    plasticizer: function () {
      var g = '<rect width="200" height="150" fill="#10202b"/>';
      g += '<rect x="50" y="40" width="100" height="70" rx="8" fill="#33507a" opacity="0.4" stroke="#5a7aa8"/>';
      for (var i = 0; i < 5; i++) g += '<path d="M60 ' + (55 + i * 12) + ' q40 -8 80 0" fill="none" stroke="#8fb4f0" stroke-width="2" opacity="0.6"/>';
      g += T(100, 138, "Plasticisers", { size: 11, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Plasticisers");
    },
    solvent: function () {
      var g = '<rect width="200" height="150" fill="#0e1c2b"/>';
      g += '<path d="M70 40 h60 v14 l14 30 v40 h-88 v-40 l14 -30 z" fill="#1f6f8f" opacity="0.4" stroke="#58c1f0"/>';
      g += '<rect x="76" y="86" width="48" height="30" fill="#58c1f0" opacity="0.35"/>';
      g += T(100, 138, "Industrial solvent", { size: 11, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Industrial solvent");
    },
    gasdehydration: function () {
      var g = '<rect width="200" height="150" fill="#0d1a29"/>';
      g += column(84, 24, 32, 92, 5, "");
      g += '<path d="M40 120 q30 -10 120 0" fill="none" stroke="#8595ad" stroke-width="3"/>';
      g += T(100, 138, "Natural-gas dehydration (TEG)", { size: 9.5, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Gas dehydration");
    },
    gastreat: function () {
      var g = '<rect width="200" height="150" fill="#0d1a29"/>';
      g += column(60, 24, 30, 92, 5, "") + column(112, 24, 30, 92, 5, "");
      g += '<path d="M90 60 h22" stroke="#17b0a4" stroke-width="3"/>';
      g += T(100, 138, "Gas treating / sweetening", { size: 10, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Gas treating");
    },
    surfactant: function () {
      var g = '<rect width="200" height="150" fill="#141b2b"/>';
      for (var i = 0; i < 6; i++) { var cy = 40 + (i % 3) * 30, cx = 60 + Math.floor(i / 3) * 60; g += '<circle cx="' + cx + '" cy="' + cy + '" r="12" fill="#17b0a4" opacity="0.4"/><line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + 16) + '" y2="' + (cy + 10) + '" stroke="#e6b07a" stroke-width="2"/>'; }
      g += T(100, 138, "Surfactants", { size: 11, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Surfactants");
    },
    personalcare: function () {
      var g = '<rect width="200" height="150" fill="#1a1424"/>';
      g += '<rect x="70" y="40" width="34" height="76" rx="6" fill="#c98ab0" opacity="0.5" stroke="#e6a9cf"/>';
      g += '<rect x="112" y="54" width="26" height="62" rx="5" fill="#8ab0c9" opacity="0.5" stroke="#a9cfe6"/>';
      g += '<rect x="78" y="30" width="18" height="12" rx="2" fill="#e6a9cf"/>';
      g += T(100, 138, "Personal-care formulations", { size: 10, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Personal care");
    },
    detergent: function () {
      var g = '<rect width="200" height="150" fill="#0e1c2b"/>';
      g += '<rect x="66" y="34" width="68" height="84" rx="6" fill="#2f6fe0" opacity="0.45" stroke="#5a8fe6"/>';
      g += '<rect x="74" y="60" width="52" height="34" rx="3" fill="#0a1420" opacity="0.6"/>';
      g += '<circle cx="92" cy="30" r="6" fill="#8fd4f0" opacity="0.6"/><circle cx="108" cy="26" r="4" fill="#8fd4f0" opacity="0.6"/>';
      g += T(100, 138, "Laundry detergent", { size: 11, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Laundry detergent");
    },
    cleaner: function () {
      var g = '<rect width="200" height="150" fill="#0e1c2b"/>';
      g += '<rect x="76" y="46" width="40" height="66" rx="6" fill="#17b0a4" opacity="0.45" stroke="#2dd4bf"/>';
      g += '<path d="M116 56 l24 -6 l4 12 l-24 8 z" fill="#33507a"/><rect x="138" y="44" width="10" height="16" rx="2" fill="#5a7aa8"/>';
      g += T(100, 138, "Hard-surface cleaner", { size: 10, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Cleaner");
    },
    emulsifier: function () {
      var g = '<rect width="200" height="150" fill="#141b2b"/>';
      g += '<ellipse cx="100" cy="72" rx="64" ry="42" fill="#c98a2e" opacity="0.25"/>';
      for (var i = 0; i < 7; i++) g += '<circle cx="' + (54 + (i * 29) % 92) + '" cy="' + (50 + (i * 37) % 52) + '" r="' + (6 + i % 4) + '" fill="#8fd4f0" opacity="0.5"/>';
      g += T(100, 138, "Emulsifiers", { size: 11, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Emulsifiers");
    },
    pharma: function () {
      var g = '<rect width="200" height="150" fill="#101a26"/>';
      g += '<rect x="66" y="60" width="30" height="16" rx="8" fill="#e6e9ef"/><rect x="80" y="60" width="16" height="16" fill="#c05a5a"/>';
      g += '<rect x="108" y="50" width="30" height="16" rx="8" fill="#e6e9ef"/><rect x="122" y="50" width="16" height="16" fill="#5a86e6"/>';
      g += '<circle cx="86" cy="98" r="10" fill="#e6e9ef"/><circle cx="112" cy="100" r="10" fill="#e6e9ef"/>';
      g += T(100, 138, "Pharmaceutical excipients", { size: 10, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Pharmaceuticals");
    },
    toothpaste: function () {
      var g = '<rect width="200" height="150" fill="#0e1c2b"/>';
      g += '<path d="M60 96 l70 -26 l6 16 l-70 26 z" fill="#e6e9ef" opacity="0.85"/>';
      g += '<rect x="128" y="66" width="10" height="26" rx="2" fill="#5a7aa8" transform="rotate(-20 133 79)"/>';
      g += '<path d="M56 98 q-8 4 -6 12 q10 2 12 -6 z" fill="#17b0a4"/>';
      g += T(100, 138, "Toothpaste (PEG)", { size: 11, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Toothpaste");
    },
    paint: function () {
      var g = '<rect width="200" height="150" fill="#0e1c2b"/>';
      g += '<rect x="66" y="52" width="68" height="60" rx="4" fill="#33507a" opacity="0.55" stroke="#5a7aa8"/>';
      g += '<path d="M66 52 q34 -18 68 0" fill="none" stroke="#8595ad" stroke-width="3"/>';
      g += '<path d="M100 52 q30 -22 40 -6 q6 10 -6 14" fill="none" stroke="#a9bcd6" stroke-width="3"/>';
      g += '<rect x="74" y="86" width="52" height="26" fill="#2dd4bf" opacity="0.5"/>';
      g += T(100, 138, "Paints & coatings", { size: 11, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Paint");
    },
    coating: function () { return APP.paint(); },
    ink: function () {
      var g = '<rect width="200" height="150" fill="#0e1c2b"/>';
      g += '<circle cx="72" cy="70" r="20" fill="#2f6fe0" opacity="0.6"/><circle cx="100" cy="70" r="20" fill="#c05a5a" opacity="0.6"/><circle cx="128" cy="70" r="20" fill="#e6b07a" opacity="0.6"/>';
      g += T(100, 138, "Printing inks", { size: 11, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Inks");
    },
    electronics: function () {
      var g = '<rect width="200" height="150" fill="#0b1a17"/>';
      g += '<rect x="50" y="40" width="100" height="70" rx="4" fill="#123f2f" stroke="#2dd4bf" opacity="0.7"/>';
      for (var i = 0; i < 4; i++) for (var j = 0; j < 3; j++) g += '<rect x="' + (62 + i * 22) + '" y="' + (52 + j * 20) + '" width="12" height="12" rx="2" fill="#2dd4bf" opacity="0.5"/>';
      g += T(100, 138, "Electronics cleaning", { size: 10, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Electronics cleaning");
    },
    foam: function () {
      var g = '<rect width="200" height="150" fill="#181226"/>';
      g += '<rect x="40" y="60" width="120" height="52" rx="6" fill="#c98ab0" opacity="0.3" stroke="#e6a9cf"/>';
      for (var i = 0; i < 26; i++) g += '<circle cx="' + (50 + (i * 41) % 100) + '" cy="' + (70 + (i * 27) % 34) + '" r="' + (3 + i % 4) + '" fill="none" stroke="#e6a9cf" stroke-width="1" opacity="0.5"/>';
      g += T(100, 138, "Flexible foam", { size: 11, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Flexible foam");
    },
    mattress: function () {
      var g = '<rect width="200" height="150" fill="#101a26"/>';
      g += '<rect x="36" y="66" width="128" height="40" rx="8" fill="#8ab0c9" opacity="0.4" stroke="#a9cfe6"/>';
      for (var i = 0; i < 6; i++) g += '<line x1="' + (52 + i * 20) + '" y1="70" x2="' + (52 + i * 20) + '" y2="102" stroke="#a9cfe6" stroke-width="1.4" opacity="0.5"/>';
      g += '<rect x="30" y="102" width="140" height="10" rx="3" fill="#33455f"/>';
      g += T(100, 138, "Mattress / bedding", { size: 11, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Mattress");
    },
    carseat: function () {
      var g = '<rect width="200" height="150" fill="#0e1c2b"/>';
      g += '<path d="M70 40 q-6 0 -6 20 l0 30 l-14 6 l0 14 l60 0 l0 -14 q-26 0 -26 -20 l0 -16 q0 -20 -8 -20 z" fill="#33507a" opacity="0.5" stroke="#5a7aa8"/>';
      g += T(100, 138, "Automotive seating", { size: 10, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Car seat");
    },
    insulation: function () {
      var g = '<rect width="200" height="150" fill="#141026"/>';
      g += '<rect x="46" y="52" width="108" height="56" rx="4" fill="#c98a2e" opacity="0.28" stroke="#e6b07a"/>';
      for (var i = 0; i < 30; i++) g += '<circle cx="' + (54 + (i * 47) % 92) + '" cy="' + (60 + (i * 31) % 40) + '" r="' + (4 + i % 3) + '" fill="none" stroke="#e6b07a" stroke-width="0.8" opacity="0.5"/>';
      g += T(100, 138, "Rigid-foam insulation", { size: 10, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Insulation");
    },
    elastomer: function () {
      var g = '<rect width="200" height="150" fill="#10202b"/>';
      g += '<path d="M50 76 q12 -30 50 -30 q38 0 50 30 q-12 30 -50 30 q-38 0 -50 -30 z" fill="#33507a" opacity="0.4" stroke="#5a7aa8"/>';
      g += T(100, 138, "Elastomers & coatings", { size: 10, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Elastomers");
    },
    cement: function () {
      var g = '<rect width="200" height="150" fill="#141b2b"/>';
      g += '<path d="M60 110 l40 -50 l40 50 z" fill="#8595ad" opacity="0.4" stroke="#a9bcd6"/>';
      g += T(100, 138, "Cement additives", { size: 11, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Cement additives");
    },
    agri: function () {
      var g = '<rect width="200" height="150" fill="#0d1a12"/>';
      g += '<path d="M100 110 l0 -40" stroke="#2dd4bf" stroke-width="3"/><path d="M100 84 q-20 -6 -24 -24 q22 2 24 24" fill="#2dd4bf" opacity="0.5"/><path d="M100 74 q20 -6 24 -24 q-22 2 -24 24" fill="#2dd4bf" opacity="0.5"/>';
      g += T(100, 138, "Agricultural formulations", { size: 10, fill: "#c6d4e6", weight: 700 });
      return wrapApp(g, "Agriculture");
    }
  };

  /* ---------- metadata (labels / captions) ---------- */
  var ILLUS_LABEL = "Technical training illustration — not plant configuration";
  var PHOTO_LABEL = "Representative industrial illustration — not a specific GC, PTTGC or Shell facility";
  var META = {
    complex:      { kind: "photo", label: PHOTO_LABEL, caption: "A modern petrochemical complex groups crackers, separation trains and derivative units on one integrated site." },
    feedprep:     { kind: "illustration", label: ILLUS_LABEL, caption: "Feed is received, drummed, pumped, heated (and vaporised where needed) and blended with dilution steam before the furnace." },
    furnace:      { kind: "illustration", label: ILLUS_LABEL, caption: "Feed is preheated in the convection section, cracked in the radiant coils, then quenched immediately in the transfer-line exchanger." },
    quench:       { kind: "illustration", label: ILLUS_LABEL, caption: "Hot cracked gas is quenched, then raised to separation pressure through a multi-stage compressor with intercooling and knock-out drums." },
    treatment:    { kind: "illustration", label: ILLUS_LABEL, caption: "Acid gases are absorbed and the gas is dried on molecular sieves so water and CO₂ cannot freeze downstream." },
    cryo:         { kind: "illustration", label: ILLUS_LABEL, caption: "A cold separation train fractionates the cracked gas; the ethylene splitter delivers high-purity ethylene to the EO unit." },
    eoreactor:    { kind: "illustration", label: ILLUS_LABEL, caption: "Ethylene, oxygen and recycle gas react over a silver catalyst in cooled tubes; most gas is recycled and CO₂ is purged." },
    eorecovery:   { kind: "illustration", label: ILLUS_LABEL, caption: "EO is absorbed into water, stripped, and purified by distillation; scrubbed recycle gas returns to the reactor loop." },
    manifold:     { kind: "illustration", label: ILLUS_LABEL, caption: "One purified-EO stream is split at a distribution header to the glycol unit and the HPEO derivative units." },
    glycol:       { kind: "illustration", label: ILLUS_LABEL, caption: "EO is hydrated with large excess water; evaporation and a distillation ladder separate MEG, DEG and TEG by boiling point." },
    omega:        { kind: "illustration", label: ILLUS_LABEL, caption: "The OMEGA route first makes ethylene carbonate from EO + CO₂, then hydrolyses it to MEG, recycling the CO₂." },
    amines:       { kind: "illustration", label: ILLUS_LABEL, caption: "EO reacts with ammonia; the EO:NH₃ ratio sets the MEA/DEA/TEA split, which is then separated by distillation." },
    ethoxylation: { kind: "illustration", label: ILLUS_LABEL, caption: "EO is added in a controlled way onto a fatty alcohol / initiator, growing an amphiphilic ethoxylate chain." },
    peg:          { kind: "illustration", label: ILLUS_LABEL, caption: "EO polymerises onto an initiator; molecular weight is controlled to give a range of PEG grades." },
    glycolethers: { kind: "illustration", label: ILLUS_LABEL, caption: "An alcohol reacts with EO and the products are purified into a family of glycol ethers." },
    polyols:      { kind: "illustration", label: ILLUS_LABEL, caption: "EO and/or PO are added onto an initiator to build polyether polyols for polyurethane." },
    storage:      { kind: "photo", label: PHOTO_LABEL, caption: "Products move from tank farm to loading pumps and arms, then to road, ISO-tank, marine and pipeline dispatch." },
    trade:        { kind: "photo", label: PHOTO_LABEL, caption: "The commercial end: cargoes are priced against published benchmarks and sold on term contracts or spot." }
  };
  // application captions
  var APP_CAP = {
    petbottle: "PET resin (from MEG) is blow-moulded into beverage bottles.",
    fiber: "MEG-based polyester is spun into textile fibre.",
    film: "Polyester film for packaging and labels.",
    antifreeze: "MEG is the base of engine coolant / antifreeze.",
    coolant: "MEG heat-transfer fluid for cooling loops.",
    resin: "DEG is used in unsaturated polyester resins.",
    plasticizer: "DEG/TEG derivatives act as plasticisers.",
    solvent: "Glycols and glycol ethers as industrial solvents.",
    gasdehydration: "TEG dries natural gas by absorbing water.",
    gastreat: "Ethanolamines absorb acid gases (H₂S/CO₂).",
    surfactant: "Ethanolamine/ethoxylate surfactants.",
    personalcare: "Ethanolamines & PEG in personal-care products.",
    detergent: "Ethoxylates are key laundry-detergent surfactants.",
    cleaner: "Ethoxylates in hard-surface and industrial cleaners.",
    emulsifier: "Ethoxylate emulsifiers stabilise oil–water mixes.",
    pharma: "PEG as a pharmaceutical excipient / base.",
    toothpaste: "PEG as a humectant/binder in toothpaste.",
    paint: "Glycol ethers as coalescing solvents in paint.",
    coating: "Glycol ethers in coatings and finishes.",
    ink: "Glycol ethers in printing inks.",
    electronics: "Glycol-ether cleaning in electronics (where supported).",
    foam: "Polyols make flexible polyurethane foam.",
    mattress: "Flexible foam for mattresses and bedding.",
    carseat: "Moulded foam for automotive seating.",
    insulation: "Rigid polyurethane foam insulation.",
    elastomer: "Polyols in elastomers and coatings.",
    cement: "Ethanolamines as cement grinding additives.",
    agri: "Ethanolamine/ethoxylate agro-formulations (where supported)."
  };

  /* ---------- public API ---------- */
  EO.glyph = function (kind, opts) { return (GLYPH[kind] || GLYPH.feed)(opts || {}); };
  EO.hasGlyph = function (kind) { return !!GLYPH[kind]; };
  EO.art = function (name, opts) {
    if (ART[name]) return ART[name](opts || {});
    if (APP[name]) return APP[name](opts || {});
    return "";
  };
  EO.artMeta = function (name) {
    if (META[name]) return META[name];
    if (APP_CAP[name]) return { kind: "product", label: "Representative product illustration", caption: APP_CAP[name] };
    return { kind: "illustration", label: ILLUS_LABEL, caption: "" };
  };
  EO.appList = Object.keys(APP);
  EO.appCaption = function (n) { return APP_CAP[n] || ""; };

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
})(window.EO = window.EO || {});
