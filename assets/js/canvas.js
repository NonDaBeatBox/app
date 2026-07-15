/* =====================================================================
   canvas.js — the interactive process canvas.
   Renders nodes + typed/labelled streams into an SVG world, provides
   pan / zoom / fit, a live mini-map, click-to-focus up- & down-stream
   highlighting, flow animation, and a vertical re-layout for mobile.
   ===================================================================== */
(function (EO) {
  "use strict";

  var D = EO.data;
  var SVG = "http://www.w3.org/2000/svg";
  var C = {}; // module state
  var SHOW_GLYPH = (D.layers || []).some(function (l) { return l.id === "equipment"; });
  var SHOW_MOL = (D.layers || []).some(function (l) { return l.id === "molecules"; });

  /* ---------- small utils ---------- */
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function el(id) { return document.getElementById(id); }
  function embedSvg(str, x, y, w, h) {
    var s = str.replace(/\swidth="100%"/, "").replace(/\sheight="100%"/, "");
    return s.replace("<svg ", '<svg x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" ');
  }
  function r1(n) { return Math.round(n * 10) / 10; }

  /* ---------- node rectangle for current layout ---------- */
  function rect(n) {
    if (C.layout === "v") return { x: n.mx, y: n.my, w: n.mw, h: n.mh };
    return { x: n.x, y: n.y, w: n.w, h: n.h };
  }
  function anchor(n, side, off) {
    var r = rect(n); off = (off == null ? 0.5 : off);
    switch (side) {
      case "l": return { x: r.x, y: r.y + r.h * off };
      case "r": return { x: r.x + r.w, y: r.y + r.h * off };
      case "t": return { x: r.x + r.w * off, y: r.y };
      case "b": return { x: r.x + r.w * off, y: r.y + r.h };
    }
    return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
  }

  /* ---------- orthogonal router with rounded corners ---------- */
  function stub(p, side, d) {
    if (side === "l") return { x: p.x - d, y: p.y };
    if (side === "r") return { x: p.x + d, y: p.y };
    if (side === "t") return { x: p.x, y: p.y - d };
    return { x: p.x, y: p.y + d };
  }
  function routePoints(a, sa, b, sb, opts) {
    opts = opts || {};
    var d = 26;
    // same-side detour (arcs: t-t / b-b / l-l / r-r)
    if (opts.arc) {
      if (sa === "t" && sb === "t") { var ty = Math.min(a.y, b.y) - opts.arc; return [a, { x: a.x, y: ty }, { x: b.x, y: ty }, b]; }
      if (sa === "b" && sb === "b") { var by = Math.max(a.y, b.y) + opts.arc; return [a, { x: a.x, y: by }, { x: b.x, y: by }, b]; }
      if (sa === "l" && sb === "l") { var lx = Math.min(a.x, b.x) - opts.arc; return [a, { x: lx, y: a.y }, { x: lx, y: b.y }, b]; }
      if (sa === "r" && sb === "r") { var rx = Math.max(a.x, b.x) + opts.arc; return [a, { x: rx, y: a.y }, { x: rx, y: b.y }, b]; }
      // mixed arc (e.g., b -> l): drop down then across then in
      if (sa === "b" && sb === "l") { var yy = a.y + opts.arc; return [a, { x: a.x, y: yy }, { x: b.x - 70, y: yy }, { x: b.x - 70, y: b.y }, b]; }
      if (sa === "r" && sb === "r") { }
    }
    var pa = stub(a, sa, d), pb = stub(b, sb, d);
    var horizA = (sa === "l" || sa === "r"), horizB = (sb === "l" || sb === "r");
    var mid;
    if (horizA && horizB) { var mx = (pa.x + pb.x) / 2; mid = [{ x: mx, y: pa.y }, { x: mx, y: pb.y }]; }
    else if (!horizA && !horizB) { var my = (pa.y + pb.y) / 2; mid = [{ x: pa.x, y: my }, { x: pb.x, y: my }]; }
    else if (horizA && !horizB) { mid = [{ x: pb.x, y: pa.y }]; }
    else { mid = [{ x: pa.x, y: pb.y }]; }
    return [a, pa].concat(mid, [pb, b]);
  }
  function roundedPath(pts, r) {
    if (pts.length < 3) return "M" + pts.map(function (p) { return r1(p.x) + " " + r1(p.y); }).join(" L");
    var d = "M" + r1(pts[0].x) + " " + r1(pts[0].y);
    for (var i = 1; i < pts.length - 1; i++) {
      var p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
      var v1 = norm(p0, p1), v2 = norm(p1, p2);
      var d1 = Math.min(r, dist(p0, p1) / 2), d2 = Math.min(r, dist(p1, p2) / 2);
      var a = { x: p1.x - v1.x * d1, y: p1.y - v1.y * d1 };
      var b = { x: p1.x + v2.x * d2, y: p1.y + v2.y * d2 };
      d += " L" + r1(a.x) + " " + r1(a.y) + " Q" + r1(p1.x) + " " + r1(p1.y) + " " + r1(b.x) + " " + r1(b.y);
    }
    var last = pts[pts.length - 1];
    d += " L" + r1(last.x) + " " + r1(last.y);
    return d;
  }
  function norm(a, b) { var dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1; return { x: dx / l, y: dy / l }; }
  function dist(a, b) { return Math.hypot(b.x - a.x, b.y - a.y); }

  /* ---------- mobile vertical layout ---------- */
  function computeVertical() {
    var CX = 60, ROW = 210, INDENT = 120;
    var spine = ["feedstocks", "furnace", "quench", "treatment", "cryo", "eoreactor", "eorecovery", "eop", "eg"];
    var deriv = ["meg", "deg", "teg", "mea", "dea", "tea", "ethoxylation", "peg", "glycolethers", "polyols"];
    var y = 40, order = 0;
    C.vorder = {};
    spine.forEach(function (id) {
      var n = D.byId[id]; n.mx = CX; n.my = y; n.mw = 320; n.mh = 150; C.vorder[id] = order++; y += ROW;
    });
    deriv.forEach(function (id) {
      var n = D.byId[id]; n.mx = CX + INDENT; n.my = y; n.mw = 280; n.mh = 140; C.vorder[id] = order++; y += 180;
    });
    var st = D.byId.storage; st.mx = CX; st.my = y + 20; st.mw = 420; st.mh = 190; C.vorder.storage = order++;
    var tr = D.byId.trade;
    if (tr) { tr.mx = CX; tr.my = st.my + st.mh + 40; tr.mw = 420; tr.mh = 220; C.vorder.trade = order++; }
    var lastB = (tr ? tr.my + tr.mh : st.my + st.mh) + 80;
    C.vbounds = { minX: -30, minY: -60, maxX: CX + INDENT + 300 + 260, maxY: lastB };
  }

  /* ---------- world bounds ---------- */
  function computeBounds() {
    if (C.layout === "v") { C.bounds = C.vbounds; return; }
    var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    D.nodes.forEach(function (n) {
      minX = Math.min(minX, n.x); minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + n.w); maxY = Math.max(maxY, n.y + n.h);
    });
    C.bounds = { minX: minX - 90, minY: minY - 170, maxX: maxX + 130, maxY: maxY + 170 };
  }

  /* =========================================================
     RENDER
     ========================================================= */
  function render() {
    computeBounds();
    var svg = el("process-svg");
    svg.setAttribute("viewBox", "0 0 " + (svg.clientWidth || 1000) + " " + (svg.clientHeight || 700));
    el("layer-grid").innerHTML = renderGrid() + renderGroups();
    el("layer-streams").innerHTML = renderStreams();
    el("layer-stream-labels").innerHTML = renderStreamLabels();
    el("layer-nodes").innerHTML = renderNodes();
    el("layer-annotations").innerHTML = renderFeeds() + renderEnduse() + renderDelivery() + renderAnnotations();
    renderMinimap();
    applyTransform();
  }

  function renderGrid() {
    var b = C.bounds, g = "", step = 80;
    var x0 = Math.floor(b.minX / step) * step, y0 = Math.floor(b.minY / step) * step;
    for (var x = x0; x < b.maxX; x += step) g += '<line class="grid-line' + (x % 320 === 0 ? ' major' : '') + '" x1="' + x + '" y1="' + b.minY + '" x2="' + x + '" y2="' + b.maxY + '"/>';
    for (var y = y0; y < b.maxY; y += step) g += '<line class="grid-line' + (y % 320 === 0 ? ' major' : '') + '" x1="' + b.minX + '" y1="' + y + '" x2="' + b.maxX + '" y2="' + y + '"/>';
    return g;
  }

  /* ---- group boxes (e.g. the OLEFINS unit around steps 2–4) ---- */
  function renderGroups() {
    if (!D.groups) return "";
    var pad = 26, top = 34;
    return D.groups.map(function (grp) {
      var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
      grp.nodes.forEach(function (id) {
        var n = D.byId[id]; if (!n) return; var r = rect(n);
        minX = Math.min(minX, r.x); minY = Math.min(minY, r.y);
        maxX = Math.max(maxX, r.x + r.w); maxY = Math.max(maxY, r.y + r.h);
      });
      if (minX > maxX) return "";
      var x = minX - pad, y = minY - pad - top, w = (maxX - minX) + pad * 2, h = (maxY - minY) + pad * 2 + top;
      var lw = grp.label.length * 6.4 + 20;
      return '<g class="group-box" data-group="' + grp.id + '">' +
        '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" rx="18" fill="none" stroke="' + grp.color + '" stroke-width="1.6" stroke-dasharray="10 8" opacity="0.85"/>' +
        '<rect x="' + r1(x + 16) + '" y="' + r1(y - 11) + '" width="' + r1(lw) + '" height="22" rx="11" class="fill-surface" stroke="' + grp.color + '"/>' +
        '<text x="' + r1(x + 16 + lw / 2) + '" y="' + r1(y + 4) + '" text-anchor="middle" font-size="11" font-weight="800" letter-spacing="0.08em" fill="' + grp.color + '" font-family="Inter, sans-serif">' + esc(grp.label) + '</text></g>';
    }).join("");
  }

  /* ---- persistent annotations (EOP / EG split labels) ---- */
  function renderAnnotations() {
    if (!D.annotations || C.layout === "v") return "";
    return D.annotations.map(function (a) {
      var n = D.byId[a.atNode]; if (!n) return "";
      var p = anchor(n, a.side || "r", 0.5);
      var x = p.x + (a.dx || 0), y = p.y + (a.dy || 0);
      var w = Math.max(a.text.length * 9 + 16, (a.sub ? a.sub.length * 5 + 12 : 0));
      return '<g class="annot">' +
        '<rect x="' + r1(x - w / 2) + '" y="' + r1(y - 13) + '" width="' + r1(w) + '" height="' + (a.sub ? 30 : 20) + '" rx="7" class="fill-surface" stroke="' + a.color + '"/>' +
        '<text x="' + r1(x) + '" y="' + r1(y + 1) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="' + a.color + '" font-family="Inter, sans-serif">' + esc(a.text) + '</text>' +
        (a.sub ? '<text x="' + r1(x) + '" y="' + r1(y + 12) + '" text-anchor="middle" font-size="8" fill="#9db0c8" font-family="Inter, sans-serif">' + esc(a.sub) + '</text>' : "") + '</g>';
    }).join("");
  }

  /* ---- streams ---- */
  function effAnchors(s) {
    var from = D.byId[s.from], to = D.byId[s.to];
    var fs = s.fs, ts = s.ts, foff = s.foff, toff = s.toff, arc = s.arc;
    if (C.layout === "v") {
      var fwd = C.vorder[s.from] < C.vorder[s.to];
      if (s.to === "storage") { fs = "r"; ts = "r"; arc = 60; foff = 0.5; toff = 0.5; }
      else if (s.side || !fwd) { fs = "l"; ts = "l"; arc = 70; }
      else { fs = "b"; ts = "t"; foff = 0.5; toff = 0.5; arc = 0; }
    }
    var a = anchor(from, fs, foff), b = anchor(to, ts, toff);
    return { a: a, sa: fs, b: b, sb: ts, arc: arc };
  }
  function renderStreams() {
    var g = "";
    D.streams.forEach(function (s, i) {
      var e = effAnchors(s);
      var pts = routePoints(e.a, e.sa, e.b, e.sb, { arc: e.arc });
      var d = roundedPath(pts, 16);
      var cls = D.streamTypes[s.type].css;
      var sideCls = (s.side || s.type === "recycle") ? " side" : "";
      g += '<g class="stream-group type-' + s.type + sideCls + '" data-stream="' + i + '" data-from="' + s.from + '" data-to="' + s.to + '">' +
        '<path class="stream-hit" d="' + d + '"/>' +
        '<path class="stream ' + cls + '" d="' + d + '"/>' +
        '<path class="stream ' + cls + ' stream-flow" d="' + d + '"/>' +
        arrowHead(pts) + '</g>';
    });
    return g;
  }
  function arrowHead(pts) {
    var p = pts[pts.length - 1], q = pts[pts.length - 2];
    var v = norm(q, p), a = Math.atan2(v.y, v.x);
    var s = 7;
    var x1 = p.x - s * Math.cos(a - 0.5), y1 = p.y - s * Math.sin(a - 0.5);
    var x2 = p.x - s * Math.cos(a + 0.5), y2 = p.y - s * Math.sin(a + 0.5);
    return '<path class="stream-arrow" d="M' + r1(p.x) + ' ' + r1(p.y) + ' L' + r1(x1) + ' ' + r1(y1) + ' L' + r1(x2) + ' ' + r1(y2) + ' Z" fill="currentColor" opacity="0.9"/>';
  }
  function renderStreamLabels() {
    var g = "";
    D.streams.forEach(function (s, i) {
      var e = effAnchors(s);
      var pts = routePoints(e.a, e.sa, e.b, e.sb, { arc: e.arc });
      var mid = pts[Math.floor(pts.length / 2)] || pts[0];
      if (pts.length % 2 === 0) { var m2 = pts[pts.length / 2 - 1]; mid = { x: (mid.x + m2.x) / 2, y: (mid.y + m2.y) / 2 }; }
      var w = s.label.length * 5.6 + 12;
      var cls = D.streamTypes[s.type].css;
      g += '<g class="stream-label-group ' + cls + '" data-stream="' + i + '">' +
        '<rect class="stream-label-bg" x="' + r1(mid.x - w / 2) + '" y="' + r1(mid.y - 9) + '" width="' + r1(w) + '" height="16" rx="5"/>' +
        '<text class="stream-label-tx" x="' + r1(mid.x) + '" y="' + r1(mid.y + 3) + '" text-anchor="middle">' + esc(s.label) + '</text></g>';
    });
    return g;
  }

  /* ---- nodes ---- */
  function renderNodes() {
    return D.nodes.map(nodeCard).join("");
  }
  function nodeCard(n) {
    var r = rect(n), w = r.w, h = r.h;
    var g = '<g class="node cat-' + n.cat + '" data-id="' + n.id + '" transform="translate(' + r.x + ',' + r.y + ')">';
    g += '<rect class="node-bg" x="0" y="0" width="' + w + '" height="' + h + '" rx="14"/>';
    // stage badge
    g += '<g class="stage-badge-g"><rect class="stage-badge" x="10" y="10" width="' + (18 + n.stage.length * 8) + '" height="20" rx="6"/>' +
      '<text class="stage-badge-tx" x="' + (10 + (18 + n.stage.length * 8) / 2) + '" y="24" text-anchor="middle">' + esc(n.stage) + '</text></g>';
    // category tag
    var tag = catTag(n.cat);
    g += '<g><rect class="node-tagpill" x="' + (w - tag.length * 6 - 20) + '" y="10" width="' + (tag.length * 6 + 10) + '" height="18" rx="9"/>' +
      '<text class="node-tagpill-tx" x="' + (w - (tag.length * 6 + 10) / 2 - 10) + '" y="22.5" text-anchor="middle">' + esc(tag) + '</text></g>';
    // title (wrap to 2 lines) + sub
    var titleLines = wrapText(n.title, w - 24, 15).slice(0, 2);
    if (SHOW_GLYPH) {
      var ty = 50;
      titleLines.forEach(function (ln) { g += '<text class="node-title" x="14" y="' + ty + '">' + esc(ln) + '</text>'; ty += 18; });
      g += '<text class="node-sub" x="14" y="' + (ty + 1) + '">' + esc(truncate(n.sub, Math.floor((w - 24) / 5.6))) + '</text>';
      var mediaY = ty + 10, mediaH = h - mediaY - 34;
      if (mediaH > 40) g += '<g class="node-equipment">' + embedSvg(EO.glyph(n.glyph), 12, mediaY, w - 24, mediaH) + '</g>';
      if (SHOW_MOL && n.brief.molecules && n.brief.molecules.length) {
        var mols = n.brief.molecules.slice(0, Math.min(3, Math.floor((w - 20) / 46)));
        var mw = 42, gap = (w - 20 - mols.length * mw) / (mols.length + 1);
        var mg = '<g class="node-molecule">';
        mols.forEach(function (m, i) {
          var mx = 10 + gap + i * (mw + gap);
          mg += '<rect x="' + r1(mx) + '" y="' + (h - 30) + '" width="' + mw + '" height="26" rx="6" fill="#0a1420" stroke="#22344d"/>' +
            embedSvg(EO.mol(m), mx + 2, h - 29, mw - 4, 24);
        });
        g += mg + '</g>';
      }
      var metric = topMetric(n);
      if (metric) g += '<g class="node-metric-row"><text class="node-metric" x="14" y="' + (h - 12) + '"><tspan class="node-metric-k">' + esc(metric.k) + '</tspan>  ' + esc(metric.v) + '</text></g>';
    } else {
      // compact labelled box — no equipment drawing
      var blockH = titleLines.length * 20 + 20;
      var ty2 = Math.max(50, (h - blockH) / 2 + 18);
      titleLines.forEach(function (ln) { g += '<text class="node-title" x="14" y="' + r1(ty2) + '">' + esc(ln) + '</text>'; ty2 += 20; });
      g += '<text class="node-sub" x="14" y="' + r1(ty2 + 2) + '">' + esc(truncate(n.sub, Math.floor((w - 22) / 5.4))) + '</text>';
      // product grade labels (e.g. MEG · DEG · TEG)
      if (n.grades && n.grades.length) {
        var gx = 14, gyy = h - 26;
        n.grades.slice(0, 4).forEach(function (gr) {
          var pw = gr.length * 6.4 + 12;
          g += '<rect class="node-grade" x="' + r1(gx) + '" y="' + (gyy - 13) + '" width="' + r1(pw) + '" height="17" rx="8.5"/>' +
            '<text class="node-grade-tx" x="' + r1(gx + pw / 2) + '" y="' + (gyy - 1) + '" text-anchor="middle">' + esc(gr) + '</text>';
          gx += pw + 6;
        });
      }
      g += '<text class="node-open" x="' + (w - 14) + '" y="' + (h - 12) + '" text-anchor="end">click to open ›</text>';
    }
    g += '</g>';
    return g;
  }
  function catTag(cat) {
    return { feed: "FEED PREP", thermal: "CRACKING", separation: "SEPARATION", reaction: "REACTION", recovery: "RECOVERY", distribution: "DISTRIBUTION", derivative: "DERIVATIVE", product: "PRODUCT", logistics: "LOGISTICS", commercial: "TRADE" }[cat] || cat.toUpperCase();
  }
  function topMetric(n) {
    var c = n.brief.conditions;
    if (!c || !c.length) return null;
    return c[0];
  }

  function wrapText(t, maxW, fs) {
    var words = t.split(" "), lines = [], cur = "";
    var cpl = Math.floor(maxW / (fs * 0.55));
    words.forEach(function (wd) {
      if ((cur + " " + wd).trim().length <= cpl) cur = (cur + " " + wd).trim();
      else { if (cur) lines.push(cur); cur = wd; }
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function truncate(t, n) { return t.length > n ? t.slice(0, n - 1) + "…" : t; }

  /* ---- external feed arrows ---- */
  function renderFeeds() {
    var g = "";
    D.feeds.forEach(function (fd) {
      var n = D.byId[fd.node];
      if (C.layout === "v") { // in vertical mode show feeds compactly on the left/right
        var rr = rect(n);
        var side = (fd.dir === "in") ? "l" : "r";
        var p = anchor(n, side, 0.5);
        var ex = side === "l" ? p.x - 40 : p.x + 40;
        var cls = D.streamTypes[fd.type].css;
        g += feedArrow(p, { x: ex, y: p.y }, fd, cls, side === "l");
        return;
      }
      var pt = anchor(n, fd.side, 0.5);
      var len = 46;
      var ext = fd.side === "t" ? { x: pt.x, y: pt.y - len } : fd.side === "b" ? { x: pt.x, y: pt.y + len } : fd.side === "l" ? { x: pt.x - len, y: pt.y } : { x: pt.x + len, y: pt.y };
      var cls = D.streamTypes[fd.type].css;
      var inbound = fd.dir === "in";
      var from = inbound ? ext : pt, to = inbound ? pt : ext;
      g += feedArrow(from, to, fd, cls, true);
    });
    return g;
  }
  function feedArrow(from, to, fd, cls, showLabel) {
    var d = "M" + r1(from.x) + " " + r1(from.y) + " L" + r1(to.x) + " " + r1(to.y);
    var v = norm(from, to), a = Math.atan2(v.y, v.x), s = 6;
    var head = '<path d="M' + r1(to.x) + ' ' + r1(to.y) + ' L' + r1(to.x - s * Math.cos(a - 0.5)) + ' ' + r1(to.y - s * Math.sin(a - 0.5)) + ' L' + r1(to.x - s * Math.cos(a + 0.5)) + ' ' + r1(to.y - s * Math.sin(a + 0.5)) + ' Z" class="stream ' + cls + '" fill="currentColor"/>';
    var lx = (fd.side === "b" || (C.layout === "v")) ? to.x : to.x;
    var ly = fd.side === "t" ? to.y - 6 : fd.side === "b" ? to.y + 14 : to.y - 8;
    var label = showLabel ? '<g class="stream-label-group ' + cls + '"><text class="stream-label-tx" x="' + r1(lx) + '" y="' + r1(ly) + '" text-anchor="middle">' + esc(fd.label) + '</text></g>' : "";
    return '<g class="stream-group type-' + fd.type + ' side feed-arrow"><path class="stream ' + cls + '" d="' + d + '"/>' + head + label + '</g>';
  }

  /* ---- end-use rails ---- */
  function renderEnduse() {
    var g = "";
    D.nodes.forEach(function (n) {
      var apps = n.brief.applications;
      if (!apps || !apps.length || (n.cat !== "derivative" && n.cat !== "product")) return;
      var r = rect(n);
      var startX = r.x + r.w, startY = r.y + r.h / 2;
      if (C.layout === "v") { startX = r.x + r.w; startY = r.y + r.h - 8; }
      var chipW = 96, gap = 10, cx = startX + 40;
      g += '<g class="layer-enduse" data-enduse="' + n.id + '">';
      g += '<path class="stream product" d="M' + r1(startX) + ' ' + r1(startY) + ' L' + r1(cx - 8) + ' ' + r1(startY) + '" opacity="0.7"/>';
      apps.slice(0, 4).forEach(function (app, i) {
        var x = cx + i * (chipW + gap), y = startY - 13;
        g += '<g class="enduse-chip" data-app="' + app + '" data-node="' + n.id + '" style="cursor:pointer">' +
          '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + chipW + '" height="26" rx="13" class="fill-surface" stroke="#17604f"/>' +
          '<circle cx="' + r1(x + 13) + '" cy="' + r1(y + 13) + '" r="5" fill="#17b0a4"/>' +
          '<text x="' + r1(x + 24) + '" y="' + r1(y + 17) + '" font-size="9.5" fill="#9fd8cf" font-family="Inter,sans-serif" font-weight="600">' + esc(shortApp(app)) + '</text></g>';
      });
      g += '</g>';
    });
    return g;
  }
  function shortApp(a) {
    var m = { petbottle: "PET bottles", fiber: "Polyester fibre", film: "Film", antifreeze: "Antifreeze", coolant: "Coolant", resin: "Resins", plasticizer: "Plasticisers", solvent: "Solvents", gasdehydration: "Gas drying", gastreat: "Gas treating", surfactant: "Surfactants", personalcare: "Personal care", detergent: "Detergents", cleaner: "Cleaners", emulsifier: "Emulsifiers", pharma: "Pharma", toothpaste: "Toothpaste", paint: "Paints", coating: "Coatings", ink: "Inks", electronics: "Electronics", foam: "Foam", mattress: "Mattresses", carseat: "Car seats", insulation: "Insulation", elastomer: "Elastomers", cement: "Cement add.", agri: "Agri" };
    return m[a] || a;
  }

  /* ---- delivery rail (from storage) ---- */
  function renderDelivery() {
    var n = D.byId.storage, modes = n.brief.deliveryModes || [];
    var r = rect(n);
    var startX = r.x + r.w, startY = r.y + r.h * 0.5;
    if (C.layout === "v") { startX = r.x + r.w; startY = r.y + r.h / 2; }
    var g = '<g class="layer-delivery-node">';
    g += '<path class="stream product" d="M' + r1(startX) + ' ' + r1(startY) + ' L' + r1(startX + 34) + ' ' + r1(startY) + '"/>';
    modes.forEach(function (m, i) {
      var perCol = 4, col = Math.floor(i / perCol), row = i % perCol;
      var x = startX + 42 + col * 132, y = startY - 58 + row * 30;
      var isEO = m.indexOf("EO") === 0;
      g += '<g class="delivery-chip" data-mode="' + esc(m) + '">' +
        '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="122" height="24" rx="7" class="fill-surface" stroke="' + (isEO ? "#7a4020" : "#294a70") + '"/>' +
        '<text x="' + r1(x + 10) + '" y="' + r1(y + 16) + '" font-size="10" fill="' + (isEO ? "#e6b07a" : "#a9bcd6") + '" font-family="Inter,sans-serif" font-weight="600">' + esc(m) + '</text></g>';
    });
    g += '</g>';
    return g;
  }

  /* =========================================================
     TRANSFORM / PAN / ZOOM
     ========================================================= */
  function applyTransform() {
    var world = el("world");
    world.setAttribute("transform", "translate(" + r1(C.t.x) + "," + r1(C.t.y) + ") scale(" + r1(C.k) + ")");
    updateMinimapView();
    var lvl = el("zoom-level"); if (lvl) lvl.textContent = Math.round(C.k * 100) + "%";
  }
  function vpSize() { var svg = el("process-svg"); return { w: svg.clientWidth, h: svg.clientHeight }; }
  function zoomAt(px, py, factor) {
    var nk = clamp(C.k * factor, C.kmin, 2.4);
    var wx = (px - C.t.x) / C.k, wy = (py - C.t.y) / C.k;
    C.k = nk; C.t.x = px - wx * nk; C.t.y = py - wy * nk;
    applyTransform();
  }
  EO.canvas_zoom = function (factor) { var v = vpSize(); zoomAt(v.w / 2, v.h / 2, factor); };

  function fit(pad) {
    pad = pad || 60; var b = C.bounds, v = vpSize();
    var wsx = (v.w - pad * 2) / (b.maxX - b.minX), wsy = (v.h - pad * 2) / (b.maxY - b.minY);
    C.k = clamp(Math.min(wsx, wsy), C.kmin, 1.4);
    C.t.x = (v.w - (b.maxX + b.minX) * C.k) / 2;
    C.t.y = (v.h - (b.maxY + b.minY) * C.k) / 2;
    applyTransform();
  }
  function reset() {
    var v = vpSize();
    if (C.layout === "v") { fit(24); return; }
    // frame the first stages on the left, spine vertically centred
    var spineMid = D.byId.feedstocks.y + D.byId.feedstocks.h / 2;
    C.k = clamp(v.h / 940, 0.5, 0.86);
    C.t.x = 84 - C.bounds.minX * C.k;
    C.t.y = v.h / 2 - spineMid * C.k;
    applyTransform();
  }

  function centerOn(node, opts) {
    opts = opts || {};
    var r = rect(node), v = vpSize();
    if (opts.zoom) C.k = clamp(opts.zoom, C.kmin, 2.4);
    C.t.x = v.w / 2 - (r.x + r.w / 2) * C.k;
    C.t.y = v.h / 2 - (r.y + r.h / 2) * C.k;
    animateTransform();
  }
  function animateTransform() {
    var world = el("world"); world.style.transition = "transform .4s cubic-bezier(.4,0,.2,1)";
    applyTransform();
    setTimeout(function () { world.style.transition = ""; }, 420);
  }

  /* =========================================================
     MINIMAP
     ========================================================= */
  function renderMinimap() {
    var b = C.bounds, mm = el("minimap-svg");
    mm.setAttribute("viewBox", b.minX + " " + b.minY + " " + (b.maxX - b.minX) + " " + (b.maxY - b.minY));
    var g = '<rect x="' + b.minX + '" y="' + b.minY + '" width="' + (b.maxX - b.minX) + '" height="' + (b.maxY - b.minY) + '" class="mm-bg"/>';
    D.streams.forEach(function (s) {
      var e = effAnchors(s); var pts = routePoints(e.a, e.sa, e.b, e.sb, { arc: e.arc });
      g += '<path d="' + roundedPath(pts, 8) + '" fill="none" stroke="' + strokeFor(s.type) + '" stroke-width="6" opacity="0.5"/>';
    });
    D.nodes.forEach(function (n) {
      var r = rect(n);
      g += '<rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" rx="6" fill="' + fillFor(n.cat) + '" stroke="#3a4a60" stroke-width="2"/>';
    });
    mm.innerHTML = g;
  }
  function strokeFor(t) { return { hydrocarbon: "#2f6fe0", product: "#17b0a4", recycle: "#f2a53a", water: "#58c1f0", utility: "#8595ad", hazard: "#f0544c", info: "#b58be0" }[t] || "#8595ad"; }
  function fillFor(c) { return { feed: "#1a3560", thermal: "#4a3320", separation: "#1c3a52", reaction: "#124f48", recovery: "#12463d", distribution: "#3a2b52", derivative: "#124f48", product: "#0e5a4c", logistics: "#2a3446", commercial: "#4a3f1c" }[c] || "#22344d"; }
  function updateMinimapView() {
    var b = C.bounds, v = vpSize(), mm = el("minimap"), view = el("minimap-view");
    if (!mm || !view) return;
    var bw = b.maxX - b.minX, bh = b.maxY - b.minY;
    var visX = (-C.t.x / C.k - b.minX) / bw, visY = (-C.t.y / C.k - b.minY) / bh;
    var visW = (v.w / C.k) / bw, visH = (v.h / C.k) / bh;
    var mw = mm.clientWidth, mh = mm.clientHeight;
    view.style.left = clamp(visX, 0, 1) * mw + "px";
    view.style.top = clamp(visY, 0, 1) * mh + "px";
    view.style.width = clamp(visW, 0, 1) * mw + "px";
    view.style.height = clamp(visH, 0, 1) * mh + "px";
  }

  /* =========================================================
     FOCUS (upstream / downstream highlight)
     ========================================================= */
  function buildAdj() {
    C.fwd = {}; C.rev = {};
    D.streams.forEach(function (s) {
      (C.fwd[s.from] = C.fwd[s.from] || []).push(s.to);
      (C.rev[s.to] = C.rev[s.to] || []).push(s.from);
    });
  }
  function reach(start, adj) {
    var seen = {}, stack = [start];
    while (stack.length) { var id = stack.pop(); (adj[id] || []).forEach(function (nx) { if (!seen[nx]) { seen[nx] = 1; stack.push(nx); } }); }
    return seen;
  }
  function focus(id) {
    var up = reach(id, C.rev), down = reach(id, C.fwd);
    var inset = {}; inset[id] = 1;
    Object.keys(up).forEach(function (k) { inset[k] = 1; });
    Object.keys(down).forEach(function (k) { inset[k] = 1; });
    var world = el("world"); world.classList.add("has-focus");
    // nodes
    document.querySelectorAll("#layer-nodes .node").forEach(function (nd) {
      var nid = nd.getAttribute("data-id");
      nd.classList.remove("dim", "up", "down", "is-selected");
      if (nid === id) nd.classList.add("is-selected");
      else if (up[nid]) nd.classList.add("up");
      else if (down[nid]) nd.classList.add("down");
      else nd.classList.add("dim");
    });
    // streams + labels
    document.querySelectorAll(".stream-group").forEach(function (sg) {
      var f = sg.getAttribute("data-from"), t = sg.getAttribute("data-to");
      var hot = (inset[f] && inset[t]) || (f === id) || (t === id);
      sg.classList.toggle("hot", !!hot); sg.classList.toggle("dim", !hot);
    });
    document.querySelectorAll(".stream-label-group[data-stream]").forEach(function (lg) {
      var idx = +lg.getAttribute("data-stream"); var s = D.streams[idx];
      if (!s) return;
      var hot = (inset[s.from] && inset[s.to]);
      lg.classList.toggle("dim", !hot);
    });
    C.selected = id;
    updateFocusStrip(id, up, down);
  }
  function clearFocus() {
    var world = el("world"); world.classList.remove("has-focus");
    document.querySelectorAll(".node").forEach(function (n) { n.classList.remove("dim", "up", "down", "is-selected"); });
    document.querySelectorAll(".stream-group, .stream-label-group").forEach(function (s) { s.classList.remove("dim", "hot"); });
    C.selected = null;
    var fs = el("focus-strip"); if (fs) fs.hidden = true;
  }
  function updateFocusStrip(id, up, down) {
    var fs = el("focus-strip"); if (!fs) return;
    var n = D.byId[id];
    var nUp = Object.keys(up).length, nDown = Object.keys(down).length;
    fs.hidden = false;
    fs.innerHTML = '<span class="fs-chip">' + esc(n.title) + '</span>' +
      '<span class="fs-sep">·</span><span>' + nUp + ' upstream</span>' +
      '<span class="fs-sep">·</span><span>' + nDown + ' downstream routes</span>' +
      '<button class="fs-clear" id="fs-clear">Clear focus</button>';
    el("fs-clear").onclick = function (e) { e.stopPropagation(); clearFocus(); if (EO.app) EO.app.closePanel(); };
  }

  /* =========================================================
     INTERACTION WIRING
     ========================================================= */
  function wire() {
    var vp = el("stage-viewport");

    // click / tap on nodes, chips, streams
    vp.addEventListener("click", function (e) {
      if (C.dragged) { C.dragged = false; return; }
      var chip = e.target.closest(".enduse-chip");
      if (chip) { if (EO.app) EO.app.openImage(chip.getAttribute("data-app")); return; }
      var dchip = e.target.closest(".delivery-chip");
      if (dchip) { if (EO.app) EO.app.selectNode("storage"); return; }
      var node = e.target.closest(".node");
      if (node) { EO.canvas.select(node.getAttribute("data-id")); return; }
      var sg = e.target.closest(".stream-group");
      if (sg && sg.getAttribute("data-to")) { EO.canvas.select(sg.getAttribute("data-to")); return; }
      // background click clears
      if (e.target.closest("#layer-grid") || e.target.id === "process-svg" || e.target.id === "stage-viewport") {
        clearFocus(); if (EO.app) EO.app.closePanel();
      }
    });

    // pointer pan + pinch
    var pointers = {};
    vp.addEventListener("pointerdown", function (e) {
      vp.setPointerCapture(e.pointerId);
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      C.panStart = { x: e.clientX, y: e.clientY, tx: C.t.x, ty: C.t.y, moved: 0 };
      vp.classList.add("panning");
    });
    vp.addEventListener("pointermove", function (e) {
      if (!pointers[e.pointerId]) return;
      var ids = Object.keys(pointers);
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (ids.length >= 2) { // pinch
        var p = pointers[ids[0]], q = pointers[ids[1]];
        var distNow = Math.hypot(p.x - q.x, p.y - q.y);
        if (C.pinchDist) {
          var rectSvg = el("process-svg").getBoundingClientRect();
          var cx = (p.x + q.x) / 2 - rectSvg.left, cy = (p.y + q.y) / 2 - rectSvg.top;
          zoomAt(cx, cy, distNow / C.pinchDist);
        }
        C.pinchDist = distNow; C.dragged = true; return;
      }
      if (C.panStart) {
        var dx = e.clientX - C.panStart.x, dy = e.clientY - C.panStart.y;
        C.panStart.moved += Math.abs(dx) + Math.abs(dy);
        C.t.x = C.panStart.tx + dx; C.t.y = C.panStart.ty + dy;
        if (C.panStart.moved > 6) C.dragged = true;
        applyTransform();
      }
    });
    function endPointer(e) {
      delete pointers[e.pointerId];
      if (Object.keys(pointers).length < 2) C.pinchDist = 0;
      if (!Object.keys(pointers).length) { C.panStart = null; vp.classList.remove("panning"); }
    }
    vp.addEventListener("pointerup", endPointer);
    vp.addEventListener("pointercancel", endPointer);

    // wheel zoom / pan
    vp.addEventListener("wheel", function (e) {
      e.preventDefault();
      var rectSvg = el("process-svg").getBoundingClientRect();
      var px = e.clientX - rectSvg.left, py = e.clientY - rectSvg.top;
      if (e.ctrlKey) { zoomAt(px, py, e.deltaY < 0 ? 1.1 : 0.9); }
      else {
        var f = e.deltaY < 0 ? 1.08 : 0.925;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { C.t.x -= e.deltaX; C.t.y -= e.deltaY; applyTransform(); }
        else zoomAt(px, py, f);
      }
    }, { passive: false });

    // minimap navigation
    var mm = el("minimap");
    function mmNav(e) {
      var r = mm.getBoundingClientRect(), b = C.bounds, v = vpSize();
      var fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      var wx = b.minX + fx * (b.maxX - b.minX), wy = b.minY + fy * (b.maxY - b.minY);
      C.t.x = v.w / 2 - wx * C.k; C.t.y = v.h / 2 - wy * C.k; applyTransform();
    }
    mm.addEventListener("pointerdown", function (e) { C.mmDrag = true; mmNav(e); });
    mm.addEventListener("pointermove", function (e) { if (C.mmDrag) mmNav(e); });
    window.addEventListener("pointerup", function () { C.mmDrag = false; });

    // resize
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(onResize, 160); });
  }

  function onResize() {
    var want = window.innerWidth <= 900 ? "v" : "h";
    if (want !== C.layout) { C.layout = want; render(); reset(); }
    else { var svg = el("process-svg"); svg.setAttribute("viewBox", "0 0 " + svg.clientWidth + " " + svg.clientHeight); applyTransform(); }
  }

  /* =========================================================
     PUBLIC API
     ========================================================= */
  EO.canvas = {
    init: function () {
      C.t = { x: 0, y: 0 }; C.k = 1; C.kmin = 0.14; C.selected = null;
      C.layout = window.innerWidth <= 900 ? "v" : "h";
      var defs = el("svg-defs");
      if (defs) defs.innerHTML =
        '<linearGradient id="nodeGrad" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" style="stop-color:var(--node-top)"/>' +
        '<stop offset="1" style="stop-color:var(--node-bot)"/></linearGradient>';
      computeVertical();
      buildAdj();
      render();
      wire();
      reset();
    },
    refresh: function () { render(); if (C.selected) focus(C.selected); },
    select: function (id, opts) {
      var n = D.byId[id]; if (!n) return;
      focus(id);
      if (!(opts && opts.noCenter)) centerOn(n, {});
      if (EO.app) EO.app.showPanel(id);
      EO.canvas._syncNav(id);
    },
    _syncNav: function (id) {
      document.querySelectorAll(".stage-link").forEach(function (l) { l.classList.toggle("active", l.getAttribute("data-id") === id); });
    },
    clearFocus: clearFocus,
    zoom: function (f) { EO.canvas_zoom(f); },
    fit: function () { fit(60); },
    reset: reset,
    resize: function () { var svg = el("process-svg"); if (svg) svg.setAttribute("viewBox", "0 0 " + svg.clientWidth + " " + svg.clientHeight); applyTransform(); },
    centerOn: function (id, o) { var n = D.byId[id]; if (n) centerOn(n, o || {}); },
    setAnimate: function (on) { el("world").classList.toggle("animate", !!on); },
    getLayout: function () { return C.layout; }
  };
})(window.EO = window.EO || {});
