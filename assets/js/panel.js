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

    // illustration + purpose
    var body1 = figure(n.art);
    body1 += '<p class="p-lead">' + esc(b.purpose) + '</p>';
    if (b.para) body1 += '<p class="p-para">' + esc(b.para) + '</p>';
    html += sec("Overview", "◲", body1);

    // IO
    if (b.inputs || b.outputs) html += sec("Streams in / out", "⇄", ioBlock(b));

    // reactions (chemistry)
    if (b.reactions) html += sec("Reactions", "⚗", reactionsBlock(b));

    // operating conditions
    if (b.conditions) html += sec("Operating window", "◷", specBlock(b.conditions, b.condNote));

    // boiling-point ladder
    if (b.ladder) html += sec("Separation ladder — boiling points", "≡", specBlock(b.ladder, "Illustrative public values — not plant data"));

    // molecules
    if (b.molecules && b.molecules.length) html += sec("Molecules", "⬡", moleculesBlock(b.molecules, b.moleculeNote));

    // formula
    if (b.formula) html += sec("Repeat structure", "⛓", '<div class="rxn-eq" style="text-align:center;font-size:16px;padding:8px">' + esc(b.formula) + '</div>');

    // products made list (furnace)
    if (b.productsMade) html += sec("Species formed", "⊞", chips(b.productsMade));

    // equipment
    if (b.equipment) html += sec("Equipment", "⚙", chips(b.equipment));

    // products (derivative split)
    if (b.products) html += sec("Products", "❖", productsBlock(b.products));

    // applications
    if (b.applications && b.applications.length) html += sec("Everyday end uses", "◉", appGrid(b.applications));

    // delivery matrix (storage)
    if (b.deliveryModes) {
      html += sec("Dispatch modes", "⇉", chips(b.deliveryModes));
      html += sec("Product → delivery matrix", "▦", deliveryMatrix());
    }

    // sources
    if (b.sources) html += sec("Public source categories", "§", '<ul class="src-list">' + b.sources.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ul>');

    // disclaimers
    if (b.disclaimers) {
      html += sec("Accuracy & disclaimers", "⚠", b.disclaimers.map(function (d) {
        return '<div class="callout disc" style="margin-bottom:8px"><span class="co-ico">⚠</span><div>' + esc(d) + '</div></div>';
      }).join(""));
    }

    var pb = el("panel-body");
    pb.innerHTML = html;
    pb.hidden = false;
    el("panel-empty").style.display = "none";
    pb.scrollTop = 0;

    // wire figure + app clicks
    el("panel-close").onclick = function () { EO.app.closePanel(); EO.canvas.clearFocus(); };
    pb.querySelectorAll("[data-figzoom]").forEach(function (bn) {
      bn.onclick = function (e) { e.stopPropagation(); EO.app.openFigure(bn.getAttribute("data-figzoom")); };
    });
    pb.querySelectorAll(".app-card, .chip.app").forEach(function (c) {
      c.onclick = function () { EO.app.openImage(c.getAttribute("data-app")); };
    });
  }

  function catName(c) {
    return { feed: "Feed preparation", thermal: "Thermal cracking", separation: "Separation", reaction: "Reaction", recovery: "Recovery & purification", distribution: "Distribution", derivative: "Derivative unit", logistics: "Storage & logistics" }[c] || c;
  }

  EO.panel = { render: render, shortApp: shortApp };
  EO.appShort = function (a) { return shortApp(a); };
})(window.EO = window.EO || {});
