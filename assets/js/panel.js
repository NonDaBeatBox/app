/* =====================================================================
   panel.js — the detailed engineering brief for a selected process area.
   Renders illustration, purpose, IO tables, reactions + molecules,
   operating windows, products, end-uses, delivery matrix, sources and
   disclaimers. All figures open in the lightbox.
   ===================================================================== */
(function (EO) {
  "use strict";
  var D = EO.data;
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function el(id) { return document.getElementById(id); }
  function dot(type) { return '<span class="io-dot" style="background:' + strokeFor(type) + '"></span>'; }
  function strokeFor(t) { return { hydrocarbon: "#2f6fe0", product: "#17b0a4", recycle: "#f2a53a", water: "#58c1f0", utility: "#8595ad", hazard: "#f0544c", info: "#b58be0" }[t] || "#8595ad"; }

  function sec(title, ico, body) {
    return '<section class="panel-sec"><div class="sec-h"><span class="sec-ico">' + ico + '</span>' + esc(title) + '</div>' + body + '</section>';
  }

  function figure(artName) {
    var meta = EO.artMeta(artName);
    var tagCls = (meta.kind === "photo") ? "repr" : "";
    return '<div class="fig" data-fig="' + esc(artName) + '">' +
      '<span class="fig-tag ' + tagCls + '">' + esc(meta.label) + '</span>' +
      '<button class="fig-zoom" title="Enlarge" data-figzoom="' + esc(artName) + '">⤢</button>' +
      '<div class="fig-media">' + EO.art(artName) + '</div>' +
      (meta.caption ? '<div class="fig-caption">' + esc(meta.caption) + '</div>' : "") +
      '</div>';
  }

  function ioBlock(b) {
    function col(cls, head, items) {
      var lis = (items || []).map(function (it) { return '<li>' + dot(it.type) + '<span>' + esc(it.label) + '</span></li>'; }).join("");
      return '<div class="io-col ' + cls + '"><h4>' + head + '</h4><ul>' + lis + '</ul></div>';
    }
    return '<div class="io-grid">' + col("inp", "Main inputs", b.inputs) + col("out", "Main outputs", b.outputs) + '</div>';
  }

  function molChip(name) {
    var meta = EO.molMeta(name); if (!meta) return "";
    return '<div class="mol-chip" style="text-align:center">' + EO.mol(name, { className: "molsvg", height: 42 }) +
      '<div style="font-size:9.5px;color:#9db0c8;margin-top:3px;font-family:var(--mono)">' + esc(meta.formula) + '</div></div>';
  }

  function reactionsBlock(b) {
    var html = "";
    (b.reactions || []).forEach(function (r) {
      var mols = (r.mols || []).map(function (m, i) {
        return (i ? '<span class="mol-op">' + (i === splitIndex(r) ? "→" : "+") + '</span>' : "") +
          '<div class="mol-chip">' + EO.mol(m, { className: "molsvg", height: 42 }) + '</div>';
      }).join("");
      html += '<div class="rxn ' + (r.kind || "") + '">' +
        '<div class="rxn-label">' + (r.kind === "desired" ? "✓ " : r.kind === "undesired" ? "✕ " : "") + esc(r.label) + '</div>' +
        '<div class="rxn-eq">' + esc(r.eq) + '</div>' +
        (mols ? '<div class="rxn-mols">' + mols + '</div>' : "") + '</div>';
    });
    if (b.rxnNote) html += '<p class="p-para">' + esc(b.rxnNote) + '</p>';
    if (b.rxnCompare) {
      html += '<div class="callout src" style="margin-top:10px"><span class="co-ico">⇄</span><div>' +
        '<b style="color:#43c59e">Desired path:</b> ' + esc(b.rxnCompare.desired) + '<br>' +
        '<b style="color:#f0544c">Undesired path:</b> ' + esc(b.rxnCompare.undesired) + '</div></div>';
    }
    return html;
  }
  function splitIndex(r) {
    // where the "→" goes: number of reactant mols. Heuristic from equation text.
    var left = (r.eq.split("→")[0].match(/\+/g) || []).length + 1;
    return left;
  }

  function specBlock(rows, note) {
    var html = '<div class="spec">' + rows.map(function (c) {
      return '<div class="spec-row"><span class="spec-k">' + esc(c.k) + '</span><span class="spec-v">' + esc(c.v) + '</span></div>';
    }).join("") + '</div>';
    if (note) html += '<div class="spec-note">⚠ ' + esc(note) + '</div>';
    return html;
  }

  function chips(items) { return '<div class="chips">' + items.map(function (i) { return '<span class="chip">' + esc(i) + '</span>'; }).join("") + '</div>'; }

  function moleculesBlock(list, note) {
    var html = '<div class="rxn-mols" style="justify-content:flex-start">' + list.map(function (m) {
      var meta = EO.molMeta(m); if (!meta) return "";
      return '<div class="mol-chip" title="' + esc(meta.title) + '" style="text-align:center">' + EO.mol(m, { className: "molsvg", height: 42 }) +
        '<div style="font-size:9px;color:#8fb4f0;margin-top:2px">' + esc(meta.title.split(" (")[0]) + '</div>' +
        '<div style="font-size:9px;color:#9db0c8;font-family:var(--mono)">' + esc(meta.formula) + '</div></div>';
    }).join("") + '</div>';
    if (note) html += '<p class="p-para">' + esc(note) + '</p>';
    return html;
  }

  function productsBlock(products) {
    return products.map(function (p) {
      var appHtml = (p.apps || []).map(function (a) { return '<span class="chip app" data-app="' + esc(a) + '">' + esc(EO.appShort ? EO.appShort(a) : a) + '</span>'; }).join("");
      return '<div class="rxn" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">' +
        (p.mol ? '<div class="mol-chip" style="text-align:center;min-width:70px">' + EO.mol(p.mol, { className: "molsvg", height: 42 }) + '</div>' : "") +
        '<div style="flex:1;min-width:120px"><div style="font-weight:700;color:#e7eef8;margin-bottom:4px">' + esc(p.name) +
        (p.mol && EO.molMeta(p.mol) ? ' <span style="font-family:var(--mono);font-size:11px;color:#9db0c8">' + esc(EO.molMeta(p.mol).formula) + '</span>' : "") + '</div>' +
        (appHtml ? '<div class="chips">' + appHtml + '</div>' : "") + '</div></div>';
    }).join("");
  }

  function appGrid(apps) {
    return '<div class="app-grid">' + apps.map(function (a) {
      return '<div class="app-card" data-app="' + esc(a) + '">' +
        '<div class="ac-media">' + EO.art(a) + '</div>' +
        '<div class="ac-body"><div class="ac-title">' + esc(shortApp(a)) + '</div><div class="ac-note">' + esc(EO.appCaption(a)) + '</div></div></div>';
    }).join("") + '</div>';
  }
  function shortApp(a) {
    var m = { petbottle: "PET bottles", fiber: "Polyester fibre", film: "Packaging film", antifreeze: "Antifreeze", coolant: "Engine coolant", resin: "Polyester resins", plasticizer: "Plasticisers", solvent: "Industrial solvents", gasdehydration: "Gas dehydration", gastreat: "Gas treating", surfactant: "Surfactants", personalcare: "Personal care", detergent: "Laundry detergents", cleaner: "Surface cleaners", emulsifier: "Emulsifiers", pharma: "Pharmaceuticals", toothpaste: "Toothpaste", paint: "Paints", coating: "Coatings", ink: "Printing inks", electronics: "Electronics cleaning", foam: "Flexible foam", mattress: "Mattresses", carseat: "Car seats", insulation: "Insulation", elastomer: "Elastomers", cement: "Cement additives", agri: "Agriculture" };
    return m[a] || a;
  }

  function deliveryMatrix() {
    var d = D.delivery;
    var head = '<tr><th>Product</th>' + d.columns.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join("") + '</tr>';
    var rows = d.rows.map(function (r) {
      return '<tr><td>' + esc(r.product) + '</td>' + r.cells.map(function (c) {
        var cls = c === "Yes" ? "yes" : c === "No" ? "no" : "cond";
        return '<td class="' + cls + '">' + esc(c) + '</td>';
      }).join("") + '</tr>';
    }).join("");
    return '<div class="matrix-wrap"><table class="matrix"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="spec-note">⚠ ' + esc(d.note) + '</div>';
  }

  /* =========================================================
     INTERACTIVE MARKET & TRADE MODULE
     ========================================================= */
  function tradeHtml(t) {
    var h = "";
    // Section 1 — spot vs contract
    h += '<section class="panel-sec"><div class="sec-h"><span class="sec-ico">⇄</span>Spot vs contract</div>';
    h += '<p class="p-para" style="margin-top:0">' + esc(t.intro) + '</p>';
    h += '<div class="trade-two">' +
      '<div class="trade-card" style="border-left-color:var(--s-hydrocarbon)"><div class="tc-tag" style="color:var(--s-hydrocarbon)">Contract (term)</div><p>' + esc(t.contract) + '</p></div>' +
      '<div class="trade-card" style="border-left-color:var(--s-recycle)"><div class="tc-tag" style="color:var(--s-recycle)">Spot</div><p>' + esc(t.spot) + '</p></div></div>';
    h += '<div class="callout src" style="margin-top:10px"><span class="co-ico">◎</span><div>' + esc(t.benchmark) +
      '<div class="mono-hint">' + esc(t.foreshadow) + '</div></div></div>';
    h += '</section>';

    // Section 2 — netback calculator
    var n = t.netback;
    h += '<section class="panel-sec"><div class="sec-h"><span class="sec-ico">$</span>Netback mini-calculator</div>';
    h += '<p class="p-para" style="margin-top:0">What a spot cargo to China is worth back at the plant gate — versus the contract alternative.</p>';
    h += nbSlider("cfr", n.cfr, "var(--s-product)", "#17b0a4");
    h += nbSlider("freight", n.freight, "var(--s-product)", "#17b0a4");
    h += nbSlider("other", n.other, "var(--s-product)", "#17b0a4");
    h += nbSlider("contract", n.contract, "var(--s-hydrocarbon)", "#2f6fe0");
    h += '<div class="nb-bars">' +
      '<div class="nb-row"><div class="nb-lab"><span>Spot netback</span><span class="mono" id="nb-spot-v" style="color:var(--s-product)"></span></div><div class="nb-track"><div class="nb-fill" id="nb-bar-spot" style="background:var(--s-product)"></div></div></div>' +
      '<div class="nb-row"><div class="nb-lab"><span>Contract</span><span class="mono" id="nb-con-v" style="color:var(--s-hydrocarbon)"></span></div><div class="nb-track"><div class="nb-fill" id="nb-bar-con" style="background:var(--s-hydrocarbon)"></div></div></div></div>';
    h += '<p class="nb-verdict" id="nb-verdict"></p>';
    h += '<p class="p-para" style="font-size:11.5px">Freight is the hidden lever: when ships get expensive, spot netbacks sink even if the headline price holds.</p>';
    h += '<div class="spec-note">⚠ ILLUSTRATIVE NUMBERS — NOT REAL PRICES.</div></section>';

    // Section 3 — Incoterms
    h += '<section class="panel-sec"><div class="sec-h"><span class="sec-ico">⚓</span>Incoterms 2020, drawn</div>';
    h += '<p class="p-para" style="margin-top:0">Where does risk pass, and how far does the seller pay the freight? Tap a term.</p>';
    h += '<div class="ic-light">';
    h += '<div id="ic-block">' + incotermHtml(t, t.defaultTerm) + '</div>';
    h += '<div class="ic-callout"><span>◆</span><div>' + esc(t.callout) + '</div></div>';
    h += '<div class="ic-note"><span>↺</span><div>' + esc(t.closeLoop) + '</div></div>';
    h += '<p class="ic-foot">Incoterms® 2020 summaries for learning only — not legal advice.</p>';
    h += '</div>';
    h += '</section>';
    return h;
  }

  function nbSlider(key, cfg, accentVar, accentHex) {
    return '<div class="nb-slider"><div class="nb-lab"><span>' + esc(cfg.label) + '</span>' +
      '<span class="mono nb-val" id="nb-' + key + '-v" style="color:' + accentVar + '"></span></div>' +
      '<input type="range" class="nb-range" id="nb-' + key + '" min="' + cfg.min + '" max="' + cfg.max + '" value="' + cfg.def + '" data-unit="' + esc(cfg.unit) + '" style="accent-color:' + accentHex + '"></div>';
  }

  // pad-style Incoterms journey + chips + detail + table for a selected code
  var IC_SX = [34, 102, 170, 238, 306], IC_BASE = 104;
  function icGlyph(kind, x) {
    var s = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
    var o = 'transform="translate(' + x + ',' + IC_BASE + ')"';
    if (kind === "plant") return '<g ' + o + '><path d="M-14 0 v-20 h28 v20" ' + s + '/><path d="M-14 -8 h28" ' + s + '/><path d="M-4 -20 v-6 h6 v6" ' + s + '/></g>';
    if (kind === "crane") return '<g ' + o + '><path d="M-9 0 v-24" ' + s + '/><path d="M-9 -24 h20" ' + s + '/><path d="M9 -24 v10" ' + s + '/><path d="M-13 0 h8" ' + s + '/></g>';
    if (kind === "ship") return '<g ' + o + '><path d="M-15 -4 h30 l-4 8 h-22 z" ' + s + '/><path d="M-8 -4 v-9 h13 v9" ' + s + '/><path d="M-2 -13 v-4 h6" ' + s + '/></g>';
    if (kind === "door") return '<g ' + o + '><path d="M-10 0 v-22 h20 v22" ' + s + '/><path d="M-10 0 h20" ' + s + '/><circle cx="5" cy="-11" r="1.6" fill="currentColor"/></g>';
    return "";
  }
  function incotermHtml(t, code) {
    var it = t.incoterms.filter(function (i) { return i.code === code; })[0] || t.incoterms[0];
    var glyphs = ["plant", "crane", "ship", "crane", "door"];
    var riskX = IC_SX[it.risk];
    var anchor = it.risk === 0 ? "start" : it.risk === 4 ? "end" : "middle";
    var brData = it.sellerFreightTo > 0;
    var brX1 = IC_SX[0] - 12, brX2 = IC_SX[it.sellerFreightTo] + 12;
    var shipBy = it.sellerFreightTo >= 3 ? "Seller" : "Buyer";
    var freightWho = ["Buyer — entire journey", "Buyer — main carriage", "Buyer — ocean freight", "Seller — to discharge port", "Seller — to destination"][it.sellerFreightTo];
    var riskName = ["Seller's plant", "Load port", "On board (load)", "Discharge port", "Buyer's door"][it.risk];

    var svg = '<svg viewBox="0 0 340 150" width="100%" class="ic-svg" role="img" aria-label="Incoterms journey for ' + esc(it.code) + '">';
    if (brData) svg += '<path d="M' + brX1 + ' 40 v-6 h' + (brX2 - brX1) + ' v6" fill="none" stroke="#17b0a4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<text x="' + ((brX1 + brX2) / 2) + '" y="26" text-anchor="middle" class="ic-mono" fill="#17b0a4">SELLER PAYS FREIGHT</text>';
    svg += '<line x1="20" y1="' + IC_BASE + '" x2="320" y2="' + IC_BASE + '" stroke="currentColor" stroke-width="1.3" stroke-dasharray="1 5" stroke-linecap="round"/>';
    IC_SX.forEach(function (x, i) {
      svg += '<circle cx="' + x + '" cy="' + IC_BASE + '" r="2.4" fill="currentColor"/>' + icGlyph(glyphs[i], x) +
        '<text x="' + x + '" y="' + (IC_BASE + 16) + '" text-anchor="middle" class="ic-mono">' + esc(t.stations[i][0]) + '</text>' +
        '<text x="' + x + '" y="' + (IC_BASE + 26) + '" text-anchor="middle" class="ic-mono">' + esc(t.stations[i][1]) + '</text>';
    });
    svg += '<path d="M' + riskX + ' ' + (IC_BASE - 30) + ' v-22" stroke="#f2a53a" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M' + riskX + ' ' + (IC_BASE - 52) + ' l16 5 l-16 5 z" fill="#f2a53a"/>' +
      '<text x="' + riskX + '" y="' + (IC_BASE - 58) + '" text-anchor="' + anchor + '" class="ic-mono" fill="#f2a53a" font-weight="700">RISK PASSES HERE</text></svg>';

    var chips = '<div class="ic-chips">' + t.incoterms.map(function (i) {
      return '<button class="ic-chip' + (i.code === code ? " on" : "") + '" data-code="' + i.code + '">' + i.code + '</button>';
    }).join("") + '</div>';

    var detail = '<div class="ic-detail"><div class="ic-name"><span class="mono ic-code">' + esc(it.code) + '</span>' + esc(it.name) + '</div>' +
      '<p class="p-para" style="margin-top:4px">' + esc(it.note) + '</p>' +
      whoRow("Ship booked by", shipBy) + whoRow("Freight", freightWho) + whoRow("Insurance", it.insurance) + whoRow("Risk passes to buyer", riskName, "var(--s-recycle)") + '</div>';

    var head = '<tr><th>Term</th><th>Ship by</th><th>Freight</th><th>Risk passes</th></tr>';
    var rows = t.incoterms.map(function (i) {
      var f = ["Buyer (all)", "Buyer (main)", "Buyer (ocean)", "Seller → discharge", "Seller → door"][i.sellerFreightTo];
      var r = ["Plant", "Load port", "On board", "Discharge", "Buyer door"][i.risk];
      return '<tr' + (i.code === code ? ' class="on"' : '') + '><td>' + i.code + '</td><td>' + (i.sellerFreightTo >= 3 ? "Seller" : "Buyer") + '</td><td>' + f + '</td><td>' + r + '</td></tr>';
    }).join("");
    var table = '<div class="matrix-wrap" style="margin-top:10px"><table class="matrix ic-table"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>';

    return '<div class="ic-card">' + svg + chips + '</div>' + detail + table;
  }
  function whoRow(k, v, color) {
    return '<div class="ic-who"><span class="mono">' + esc(k) + '</span><span style="color:' + (color || "var(--ink)") + '">' + esc(v) + '</span></div>';
  }

  function wireTrade(pb, t) {
    var ids = ["cfr", "freight", "other", "contract"];
    function upd() {
      var v = {};
      ids.forEach(function (k) {
        var inp = pb.querySelector("#nb-" + k);
        v[k] = +inp.value;
        pb.querySelector("#nb-" + k + "-v").textContent = inp.value + " " + inp.getAttribute("data-unit");
      });
      var netback = v.cfr - v.freight - v.other, diff = netback - v.contract;
      var pct = function (x) { return Math.max(0, Math.min(100, ((x - 400) / 400) * 100)); };
      pb.querySelector("#nb-bar-spot").style.width = pct(netback) + "%";
      pb.querySelector("#nb-bar-con").style.width = pct(v.contract) + "%";
      pb.querySelector("#nb-spot-v").textContent = "$" + netback + "/t";
      pb.querySelector("#nb-con-v").textContent = "$" + v.contract + "/t";
      pb.querySelector("#nb-verdict").innerHTML = 'Spot nets <b style="color:var(--s-product)">$' + netback + '/t</b> — ' +
        (diff >= 0 ? 'beats contract by <b style="color:var(--s-product)">$' + Math.abs(diff) + '/t</b>.'
          : 'loses to contract by <b style="color:var(--warn)">$' + Math.abs(diff) + '/t</b>.');
    }
    ids.forEach(function (k) { var inp = pb.querySelector("#nb-" + k); if (inp) inp.addEventListener("input", upd); });
    upd();
    function wireIC() {
      pb.querySelectorAll(".ic-chip").forEach(function (c) {
        c.onclick = function () { pb.querySelector("#ic-block").innerHTML = incotermHtml(t, c.getAttribute("data-code")); wireIC(); };
      });
    }
    wireIC();
  }

  function feedListBlock(list) {
    return '<div class="feed-list">' + list.map(function (f) {
      return '<div class="feed-item"><div class="fi-head"><span class="fi-name">' + esc(f.name) + '</span>' +
        '<span class="fi-formula mono">' + esc(f.formula) + '</span></div><div class="fi-note">' + esc(f.note) + '</div></div>';
    }).join("") + '</div>';
  }
  function splitsBlock(splits) {
    return '<div class="io-grid">' + splits.map(function (s) {
      var col = s.color === "accent" ? "var(--accent)" : "var(--s-product)";
      return '<div class="trade-card" style="border-left-color:' + col + '"><div class="tc-tag" style="color:' + col + '">' + esc(s.code) + '</div>' +
        '<div style="font-weight:600;color:var(--ink);font-size:12.5px;margin:2px 0 4px">' + esc(s.name) + '</div>' +
        '<div style="font-size:11.5px;color:var(--ink-dim);line-height:1.4">' + esc(s.note) + '</div></div>';
    }).join("") + '</div>';
  }

  /* ---------- main render ---------- */
  function render(id) {
    var n = D.byId[id]; if (!n) return;
    var b = n.brief;
    var html = "";

    // head
    html += '<div class="panel-head"><div class="ph-top">' +
      '<span class="ph-stage">Stage ' + esc(n.stage) + '</span>' +
      '<span class="ph-cat">' + esc(catName(n.cat)) + '</span>' +
      '<button class="ph-close" id="panel-close" title="Close">✕</button></div>' +
      '<h2>' + esc(n.title) + '</h2><div class="ph-sub">' + esc(n.sub) + '</div></div>';

    html += briefSections(n);

    var pb = el("panel-body");
    pb.innerHTML = html;
    pb.hidden = false;
    el("panel-empty").style.display = "none";
    pb.scrollTop = 0;

    el("panel-close").onclick = function () { EO.app.closePanel(); EO.canvas.clearFocus(); };
    wireBrief(pb, n);
  }

  /* the sections that describe a process area (reused by the Learn view) */
  function briefSections(n) {
    var b = n.brief, html = "";
    var body1 = figure(n.art);
    body1 += '<p class="p-lead">' + esc(b.purpose) + '</p>';
    if (b.para) body1 += '<p class="p-para">' + esc(b.para) + '</p>';
    if (b.para2) body1 += '<p class="p-para">' + esc(b.para2) + '</p>';
    html += sec("Overview", "◲", body1);
    if (b.feedList) html += sec("Feedstocks", "▤", feedListBlock(b.feedList));
    if (b.splits) html += sec("EO splits into", "⑃", splitsBlock(b.splits));
    if (b.trade) html += tradeHtml(b.trade);
    if (b.inputs || b.outputs) html += sec("Streams in / out", "⇄", ioBlock(b));
    if (b.reactions) html += sec("Reactions", "⚗", reactionsBlock(b));
    if (b.conditions) html += sec("Operating window", "◷", specBlock(b.conditions, b.condNote));
    if (b.ladder) html += sec("Separation ladder — boiling points", "≡", specBlock(b.ladder, "Illustrative public values — not plant data"));
    if (b.molecules && b.molecules.length) html += sec("Molecules", "⬡", moleculesBlock(b.molecules, b.moleculeNote));
    if (b.formula) html += sec("Repeat structure", "⛓", '<div class="rxn-eq" style="text-align:center;font-size:16px;padding:8px">' + esc(b.formula) + '</div>');
    if (b.productsMade) html += sec("Species formed", "⊞", chips(b.productsMade));
    if (b.equipment) html += sec("Equipment", "⚙", chips(b.equipment));
    if (b.products) html += sec("Products", "❖", productsBlock(b.products));
    if (b.applications && b.applications.length) html += sec("Everyday end uses", "◉", appGrid(b.applications));
    if (b.deliveryModes) {
      html += sec("Dispatch modes", "⇉", chips(b.deliveryModes));
      html += sec("Product → delivery matrix", "▦", deliveryMatrix());
    }
    if (b.sources) html += sec("Public source categories", "§", '<ul class="src-list">' + b.sources.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ul>');
    if (b.disclaimers) {
      html += sec("Accuracy & disclaimers", "⚠", b.disclaimers.map(function (d) {
        return '<div class="callout disc" style="margin-bottom:8px"><span class="co-ico">⚠</span><div>' + esc(d) + '</div></div>';
      }).join(""));
    }
    return html;
  }

  /* wire figure zoom, app cards, and the trade module inside any container */
  function wireBrief(container, n) {
    container.querySelectorAll("[data-figzoom]").forEach(function (bn) {
      bn.onclick = function (e) { e.stopPropagation(); EO.app.openFigure(bn.getAttribute("data-figzoom")); };
    });
    container.querySelectorAll(".app-card, .chip.app").forEach(function (c) {
      c.onclick = function () { EO.app.openImage(c.getAttribute("data-app")); };
    });
    if (n.brief.trade) wireTrade(container, n.brief.trade);
  }

  function catName(c) {
    return { feed: "Feed preparation", thermal: "Thermal cracking", separation: "Separation", reaction: "Reaction", recovery: "Recovery & purification", distribution: "Distribution", derivative: "Derivative unit", logistics: "Storage & logistics", commercial: "Market & trade" }[c] || c;
  }

  EO.panel = { render: render, shortApp: shortApp, briefSections: briefSections, wireBrief: wireBrief };
  EO.appShort = function (a) { return shortApp(a); };
})(window.EO = window.EO || {});
