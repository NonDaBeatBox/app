/* =====================================================================
   app.js — bootstrap, rail controls, detail modes, layer toggles,
   modals, lightbox, mobile drawers, keyboard and the guided tour.
   ===================================================================== */
(function (EO) {
  "use strict";
  var D = EO.data;
  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  var state = { mode: "overview", layers: {}, tourIdx: -1, theme: "dark" };

  /* ---------------- day / night theme ---------------- */
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    var btn = el("btn-theme");
    if (btn) { btn.textContent = theme === "light" ? "☀" : "☾"; btn.title = (theme === "light" ? "Switch to night theme" : "Switch to day theme"); }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#eef1f6" : "#0a1018");
    try { localStorage.setItem("eo-theme", theme); } catch (e) {}
  }
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("eo-theme"); } catch (e) {}
    var theme = saved || ((window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark");
    applyTheme(theme);
  }

  /* ---------------- left rail ---------------- */
  function buildLayers() {
    var host = el("layer-toggles");
    host.innerHTML = D.layers.map(function (l) {
      state.layers[l.id] = l.on;
      var sw = l.swatch ? '<span class="tg-swatch"><svg width="20" height="8"><line x1="1" y1="4" x2="19" y2="4" stroke="' + strokeFor(l.swatch) + '" stroke-width="3" ' + (l.swatch === "recycle" ? 'stroke-dasharray="5 4"' : "") + ' stroke-linecap="round"/></svg></span>' : '<span class="tg-swatch"></span>';
      return '<button class="toggle' + (l.on ? " on" : "") + (l.locked ? " locked" : "") + '" data-layer="' + l.id + '"' + (l.locked ? " disabled" : "") + '>' +
        '<span class="sw"></span>' + sw + '<span>' + esc(l.label) + '</span></button>';
    }).join("");
    host.querySelectorAll(".toggle:not(.locked)").forEach(function (b) {
      b.addEventListener("click", function () { toggleLayer(b.getAttribute("data-layer")); });
    });
    // apply initial body classes
    D.layers.forEach(function (l) { document.body.classList.toggle("layer-" + l.id, !!l.on); });
  }
  function toggleLayer(id, force) {
    var on = force == null ? !state.layers[id] : force;
    state.layers[id] = on;
    document.body.classList.toggle("layer-" + id, on);
    var btn = document.querySelector('.toggle[data-layer="' + id + '"]');
    if (btn) btn.classList.toggle("on", on);
  }
  function strokeFor(t) { return { hydrocarbon: "#2f6fe0", product: "#17b0a4", recycle: "#f2a53a", water: "#58c1f0", utility: "#8595ad", hazard: "#f0544c", info: "#b58be0" }[t] || "#8595ad"; }

  function buildLegend() {
    el("legend").innerHTML = D.legend.map(function (l) {
      var style = "border-top-color:" + strokeFor(l.css) + ";";
      if (l.dash) style += "border-top-style:dashed;";
      if (l.dot) style += "border-top-style:dotted;border-top-width:3px;";
      return '<li><span class="lg-line" style="' + style + '"></span>' + esc(l.label) + '</li>';
    }).join("");
  }

  function buildStageNav() {
    el("stage-nav").innerHTML = D.stageOrder.map(function (id) {
      var n = D.byId[id];
      return '<button class="stage-link" data-id="' + id + '"><span class="sl-idx">' + esc(n.stage) + '</span><span>' + esc(n.title) + '</span></button>';
    }).join("");
    el("stage-nav").querySelectorAll(".stage-link").forEach(function (b) {
      b.addEventListener("click", function () {
        EO.canvas.select(b.getAttribute("data-id"));
        document.body.classList.remove("rail-open");
      });
    });
  }

  function buildCanvasLegend() {
    el("canvas-legend").innerHTML = '<span class="cl-dot"></span><span>Trace the value chain <b>left → right</b>: feedstocks to ethylene to EO to derivatives to delivery</span>';
  }

  /* ---------------- modes ---------------- */
  function setMode(mode) {
    state.mode = mode;
    document.body.classList.remove("mode-overview", "mode-equipment", "mode-chemistry");
    document.body.classList.add("mode-" + mode);
    document.querySelectorAll(".mode-btn").forEach(function (b) {
      var on = b.getAttribute("data-mode") === mode;
      b.classList.toggle("is-active", on); b.setAttribute("aria-selected", on ? "true" : "false");
    });
    // modes drive molecule + equipment-name density
    toggleLayer("molecules", mode === "chemistry");
    toggleLayer("equipnames", mode !== "overview");
  }
  function wireModes() {
    document.querySelectorAll(".mode-btn").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
  }

  /* ---------------- panel ---------------- */
  function showPanel(id) {
    EO.panel.render(id);
    if (isMobile()) document.body.classList.add("panel-open");
    ensureSheetHandle();
  }
  function closePanel() {
    el("panel-body").hidden = true;
    el("panel-empty").style.display = "";
    document.body.classList.remove("panel-open");
  }
  function ensureSheetHandle() {
    var panel = el("panel");
    if (!panel.querySelector(".sheet-handle")) {
      var h = document.createElement("div"); h.className = "sheet-handle";
      h.addEventListener("click", closePanel);
      panel.insertBefore(h, panel.firstChild);
    }
  }

  /* ---------------- lightbox ---------------- */
  function openFigure(artName) {
    var meta = EO.artMeta(artName);
    el("lightbox-media").innerHTML = EO.art(artName);
    el("lightbox-cap").innerHTML =
      '<h3>' + esc(titleForArt(artName)) + '</h3>' +
      '<p>' + esc(meta.caption || "") + '</p>' +
      '<div class="lc-meta">' +
      '<span><b>What to look at:</b> ' + esc(relevanceForArt(artName)) + '</span>' +
      '<span><b>Source basis:</b> Public process chemistry &amp; public technology descriptions.</span>' +
      '<span><b>Credit:</b> Original technical illustration for this training board.</span>' +
      '</div>' +
      '<span class="lc-tag">⚠ ' + esc(meta.label) + '</span>';
    openLB();
  }
  function openImage(appName) {
    if (!EO.appCaption(appName)) { return; }
    el("lightbox-media").innerHTML = EO.art(appName);
    el("lightbox-cap").innerHTML =
      '<h3>' + esc(EO.appShort(appName)) + '</h3>' +
      '<p>' + esc(EO.appCaption(appName)) + '</p>' +
      '<div class="lc-meta"><span><b>Relevance:</b> a representative everyday product of this part of the value chain.</span>' +
      '<span><b>Credit:</b> Original product illustration for this training board.</span></div>' +
      '<span class="lc-tag">⚠ Representative product illustration — not a brand or specific product.</span>';
    openLB();
  }
  function openLB() { var lb = el("lightbox"); lb.hidden = false; requestAnimationFrame(function () { lb.classList.add("show"); }); }
  function closeLB() { el("lightbox").hidden = true; }
  function titleForArt(a) { var n = D.nodes.filter(function (x) { return x.art === a; })[0]; return n ? n.title : "Process illustration"; }
  function relevanceForArt(a) {
    var n = D.nodes.filter(function (x) { return x.art === a; })[0];
    return n ? ("This illustrates the " + n.title.toLowerCase() + " area of the map — the equipment groups and stream connections it shows.") : "The highlighted equipment and stream connections for this area.";
  }

  /* ---------------- modals ---------------- */
  function openModal(title, html) {
    el("modal-title").textContent = title;
    el("modal-content").innerHTML = html;
    el("modal").hidden = false;
  }
  function closeModal() { el("modal").hidden = true; }

  function helpHtml() {
    return '<p>This is an interactive training map of the <b>ethylene-oxide value chain</b> — from hydrocarbon feedstocks all the way to everyday products and how they are delivered.</p>' +
      '<h3>Navigating the map</h3><ul>' +
      '<li><b>Click a stage</b> to focus it: the map highlights everything upstream that feeds it and every downstream route it leads to, dims the rest, and opens a detailed brief on the right.</li>' +
      '<li><b>Scroll / pinch</b> to zoom, <b>drag</b> to pan. Use the zoom buttons or the mini-map (bottom-right) to move around.</li>' +
      '<li><b>Keyboard:</b> ← → step between stages · <code>+</code>/<code>-</code> zoom · <code>0</code> fit · <code>Esc</code> clear.</li></ul>' +
      '<h3>Detail levels</h3><ul>' +
      '<li><b>Process overview</b> — the whole route, equipment groups, main streams and products.</li>' +
      '<li><b>Equipment detail</b> — adds equipment names and key operating values on the map.</li>' +
      '<li><b>Chemistry detail</b> — adds molecule structures to the nodes.</li></ul>' +
      '<h3>Layers</h3><p>Turn technical layers on and off in the left panel — recycle streams, utilities, stream labels, molecules, equipment names, <b>end uses</b> and <b>delivery routes</b> — without leaving the map.</p>' +
      '<h3>Stream colours</h3><ul>' +
      '<li><span style="color:#2f6fe0">■</span> hydrocarbon &amp; ethylene &nbsp; <span style="color:#17b0a4">■</span> EO &amp; products</li>' +
      '<li><span style="color:#f2a53a">■</span> recycle / side &nbsp; <span style="color:#58c1f0">■</span> water &amp; steam</li>' +
      '<li><span style="color:#8595ad">■</span> utilities &nbsp; <span style="color:#f0544c">■</span> hazard / combustion</li></ul>';
  }
  function disclaimerHtml() {
    return '<p>' + D.disclaimers.map(esc).join('</p><p>') + '</p>' +
      '<h3>Public source categories</h3><ul>' + D.sourceCategories.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ul>' +
      '<h3>What this map never contains</h3><p>No proprietary equipment numbers, line numbers, control-system tags, plant layouts, internal operating conditions, production rates, operating procedures, unpublished catalyst formulations or site-specific safety systems.</p>';
  }

  /* ---------------- guided tour ---------------- */
  function buildTourBar() {
    var bar = document.createElement("div");
    bar.className = "tourbar"; bar.id = "tourbar"; bar.hidden = true;
    bar.innerHTML = '<button class="tb-nav" id="tb-prev">‹ Prev</button>' +
      '<div class="tb-body"><div class="tb-title" id="tb-title"></div><div class="tb-text" id="tb-text"></div></div>' +
      '<div class="tb-count" id="tb-count"></div>' +
      '<button class="tb-nav" id="tb-next">Next ›</button>' +
      '<button class="tb-exit" id="tb-exit">✕</button>';
    document.body.appendChild(bar);
    el("tb-prev").onclick = function () { tourStep(-1); };
    el("tb-next").onclick = function () { tourStep(1); };
    el("tb-exit").onclick = endTour;
  }
  function startTour() { state.tourIdx = -1; el("tourbar").hidden = false; tourStep(1); }
  function endTour() { el("tourbar").hidden = true; EO.canvas.clearFocus(); closePanel(); state.tourIdx = -1; }
  function tourStep(dir) {
    var order = D.stageOrder;
    state.tourIdx = Math.max(0, Math.min(order.length - 1, state.tourIdx + dir));
    var id = order[state.tourIdx], n = D.byId[id];
    EO.canvas.select(id);
    el("tb-title").textContent = "Stage " + n.stage + " · " + n.title;
    el("tb-text").textContent = n.brief.purpose;
    el("tb-count").textContent = (state.tourIdx + 1) + " / " + order.length;
    el("tb-prev").disabled = state.tourIdx === 0;
    el("tb-next").disabled = state.tourIdx === order.length - 1;
  }

  /* ---------------- mobile ---------------- */
  function isMobile() { return window.innerWidth <= 900; }
  function buildFabs() {
    var fab = document.createElement("button");
    fab.className = "fab fab-layers mobile-only"; fab.id = "fab-layers"; fab.title = "Layers & legend";
    fab.innerHTML = "☰";
    fab.addEventListener("click", function () { document.body.classList.toggle("rail-open"); });
    document.body.appendChild(fab);
    // tap outside rail closes it
    document.addEventListener("click", function (e) {
      if (document.body.classList.contains("rail-open") && isMobile()) {
        if (!e.target.closest("#rail-left") && !e.target.closest("#fab-layers")) document.body.classList.remove("rail-open");
      }
    });
  }

  /* ---------------- keyboard ---------------- */
  function wireKeys() {
    window.addEventListener("keydown", function (e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "Escape") {
        if (!el("lightbox").hidden) { closeLB(); return; }
        if (!el("modal").hidden) { closeModal(); return; }
        if (!el("tourbar").hidden) { endTour(); return; }
        EO.canvas.clearFocus(); closePanel(); return;
      }
      if (e.key === "+" || e.key === "=") { EO.canvas.zoom(1.2); }
      else if (e.key === "-" || e.key === "_") { EO.canvas.zoom(0.83); }
      else if (e.key === "0") { EO.canvas.fit(); }
      else if (e.key.toLowerCase() === "h") { EO.canvas.reset(); }
      else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        var order = D.stageOrder;
        var cur = order.indexOf(EO.canvas_selected());
        if (cur < 0) cur = e.key === "ArrowRight" ? -1 : order.length;
        var nx = cur + (e.key === "ArrowRight" ? 1 : -1);
        if (nx >= 0 && nx < order.length) EO.canvas.select(order[nx]);
      } else if (e.key === "?") { openModal("How to use this map", helpHtml()); }
    });
  }

  /* ---------------- zoom + misc wiring ---------------- */
  function wireControls() {
    el("zoom-in").onclick = function () { EO.canvas.zoom(1.25); };
    el("zoom-out").onclick = function () { EO.canvas.zoom(0.8); };
    el("zoom-fit").onclick = function () { EO.canvas.fit(); };
    el("zoom-reset").onclick = function () { EO.canvas.reset(); };
    el("btn-help").onclick = function () { openModal("How to use this map", helpHtml()); };
    el("btn-tour").onclick = startTour;
    el("btn-theme").onclick = function () { applyTheme(state.theme === "light" ? "dark" : "light"); };
    el("disc-more").onclick = function () { openModal("Accuracy & disclaimers", disclaimerHtml()); };
    // modal / lightbox close
    document.querySelectorAll("[data-close]").forEach(function (b) {
      b.addEventListener("click", function () { closeModal(); closeLB(); });
    });
  }

  /* keep a tiny bridge so keyboard can read current selection */
  EO.canvas_selected = function () { return EO._sel || null; };

  /* ---------------- boot ---------------- */
  function boot() {
    initTheme();
    buildLayers();
    buildLegend();
    buildStageNav();
    buildCanvasLegend();
    buildFabs();
    buildTourBar();
    wireControls();
    wireKeys();
    document.body.classList.add("mode-overview");
    EO.canvas.init();
    EO.canvas.setAnimate(true);

    // expose app hooks used by canvas/panel
    EO.app = {
      showPanel: showPanel, closePanel: closePanel,
      openFigure: openFigure, openImage: openImage,
      selectNode: function (id) { EO.canvas.select(id); }
    };
    // track selection for keyboard nav + nav sync
    var origSelect = EO.canvas.select;
    EO.canvas.select = function (id, opts) { EO._sel = id; return origSelect(id, opts); };

    // reveal
    el("app").classList.add("ready");
    el("app").setAttribute("aria-hidden", "false");
    var splash = el("splash");
    setTimeout(function () { splash.classList.add("gone"); setTimeout(function () { splash.style.display = "none"; }, 420); }, 260);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window.EO = window.EO || {});
