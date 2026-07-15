/* =====================================================================
   learn.js — the "Learn" (EO Academy) view of the combined app.
   A guided, tabbed walk through the value chain, built from the SAME
   data as the map (EO.data + EO.panel.briefSections), plus a reactor
   selectivity lab and an 18-question quiz. Shares the day/night theme.
   ===================================================================== */
(function (EO) {
  "use strict";
  var D = EO.data;
  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function catName(c) {
    return { feed: "Feed preparation", thermal: "Thermal cracking", separation: "Separation", reaction: "Reaction", recovery: "Recovery & purification", distribution: "Distribution", derivative: "Derivative unit", logistics: "Storage & logistics", commercial: "Market & trade" }[c] || c;
  }

  var LESSONS = [
    { id: "chain", label: "The chain", kind: "intro" },
    { id: "crack", label: "Feed & cracking", kind: "nodes", nodes: ["feedstocks", "furnace"] },
    { id: "reactor", label: "EO reactor", kind: "nodes", nodes: ["eoreactor"], lab: true },
    { id: "split", label: "Recovery & split", kind: "nodes", nodes: ["eorecovery", "eop", "eg"] },
    { id: "glycol", label: "Glycols · OMEGA", kind: "nodes", nodes: ["omega"] },
    { id: "deriv", label: "Derivatives", kind: "nodes", nodes: ["amines", "ethoxylation", "peg", "glycolethers", "polyols"] },
    { id: "delivery", label: "Delivery", kind: "nodes", nodes: ["storage"] },
    { id: "trade", label: "Trade", kind: "nodes", nodes: ["trade"] },
    { id: "quiz", label: "Quiz", kind: "quiz" }
  ];

  var built = false;

  function build() {
    if (built) return; built = true;
    var host = el("learn-view");
    host.innerHTML =
      '<div class="learn">' +
        '<header class="learn-top">' +
          '<div class="learn-title">EO Academy</div>' +
          '<div class="learn-sub">A guided walk through the ethylene-oxide value chain — read each stage, then test yourself. Switch to <b>Map</b> any time to explore it interactively.</div>' +
        '</header>' +
        '<nav class="learn-tabs" id="learn-tabs" aria-label="Lessons">' +
          LESSONS.map(function (l, i) { return '<button class="learn-tab' + (i === 0 ? " on" : "") + '" data-lesson="' + l.id + '">' + esc(l.label) + '</button>'; }).join("") +
        '</nav>' +
        '<div class="learn-body" id="learn-body"></div>' +
      '</div>';
    el("learn-tabs").addEventListener("click", function (e) {
      var b = e.target.closest(".learn-tab"); if (!b) return;
      selectLesson(b.getAttribute("data-lesson"));
      el("learn-body").scrollIntoView({ block: "start", behavior: "smooth" });
    });
    selectLesson(LESSONS[0].id);
  }

  function selectLesson(id) {
    document.querySelectorAll(".learn-tab").forEach(function (t) { t.classList.toggle("on", t.getAttribute("data-lesson") === id); });
    var lesson = LESSONS.filter(function (l) { return l.id === id; })[0];
    var body = el("learn-body");
    if (lesson.kind === "intro") { body.innerHTML = introHtml(); wireFigs(body); }
    else if (lesson.kind === "quiz") { renderQuiz(body); }
    else {
      var html = "";
      lesson.nodes.forEach(function (nid, i) {
        var n = D.byId[nid]; if (!n) return;
        html += (i ? '<div class="lesson-div"></div>' : "") + lessonHead(n) + EO.panel.briefSections(n);
      });
      if (lesson.lab) html += reactorLab();
      body.innerHTML = html;
      lesson.nodes.forEach(function (nid) { var n = D.byId[nid]; if (n) EO.panel.wireBrief(body, n); });
      if (lesson.lab) wireLab(body);
    }
    body.scrollTop = 0;
  }

  function lessonHead(n) {
    return '<div class="lesson-head"><div class="lh-top">' +
      '<span class="ph-stage">Stage ' + esc(n.stage) + '</span>' +
      '<span class="ph-cat">' + esc(catName(n.cat)) + '</span></div>' +
      '<h2>' + esc(n.title) + '</h2><div class="ph-sub">' + esc(n.sub) + '</div></div>';
  }

  function introHtml() {
    function card(tag, color, txt) {
      return '<div class="learn-card" style="border-left-color:' + color + '"><div class="tc-tag" style="color:' + color + '">' + tag + '</div><p>' + txt + '</p></div>';
    }
    return '<div class="lesson-head"><h2>The ethylene-oxide value chain</h2>' +
      '<div class="ph-sub">One molecule, a long journey — from a gas feed to the products in your day, and finally to a price on a trading screen.</div></div>' +
      '<div class="fig"><span class="fig-tag repr">Representative industrial illustration — not a specific GC, PTTGC or Shell facility</span>' +
      '<div class="fig-media">' + EO.art("complex") + '</div>' +
      '<div class="fig-caption">A modern petrochemical complex groups crackers, separation trains and derivative units on one integrated site.</div></div>' +
      '<div class="learn-cards">' +
        card("Make it", "var(--s-hydrocarbon)", "Crack a hydrocarbon feed to ethylene in the <b>olefins</b> unit, then partially oxidise it over silver to ethylene oxide.") +
        card("Use it", "var(--s-product)", "EO splits into <b>EOP</b> (product) and <b>EG</b> (glycol via OMEGA), and becomes ethanolamines, ethoxylates, PEG and polyols — bottles, fibre, coolant, detergents, foam.") +
        card("Sell it", "var(--s-recycle)", "The finished products are commodities, priced against global benchmarks and shipped under standard trade terms.") +
      '</div>' +
      '<p class="p-para">Read each stage with the tabs above, or open the <b>Map</b> to explore it. Finish with the <b>Quiz</b>. All figures are public illustrative values — not plant or commercial data.</p>';
  }

  /* reactor selectivity lab (illustrative) */
  function reactorLab() {
    function sld(id, label, min, max, val, unit) {
      return '<div class="nb-slider"><div class="nb-lab"><span>' + label + '</span><span class="mono nb-val" id="' + id + '-v" style="color:var(--s-product)"></span></div>' +
        '<input type="range" class="nb-range" id="' + id + '" min="' + min + '" max="' + max + '" value="' + val + '" data-unit="' + unit + '" style="accent-color:#17b0a4"></div>';
    }
    return '<section class="panel-sec"><div class="sec-h"><span class="sec-ico">⚗</span>Selectivity bench' +
      '<span style="margin-left:auto;font-family:var(--mono);font-size:10px;letter-spacing:.08em;color:var(--s-product)">ILLUSTRATIVE</span></div>' +
      '<p class="p-para" style="margin-top:0">EO is always racing a rival reaction that burns ethylene to CO₂. Work the sliders to see how conditions shift selectivity.</p>' +
      sld("lab-temp", "Reactor temperature", 200, 300, 245, "°C") +
      sld("lab-o2", "Oxygen in feed", 3, 12, 7, "%") +
      '<div class="nb-lab" style="margin-top:12px"><span>EO selectivity</span><span class="mono" id="lab-sel" style="color:var(--s-product)"></span></div>' +
      '<div class="nb-track"><div class="nb-fill" id="lab-bar" style="background:var(--s-product)"></div></div>' +
      '<p class="p-para" style="font-size:11.5px">Push temperature or oxygen too high and combustion wins; too low and the catalyst underperforms. Real plants tune this with a trace ethyl-chloride moderator.</p>' +
      '<div class="spec-note">⚠ Illustrative model — public range, not plant data.</div></section>';
  }
  function wireLab(body) {
    function upd() {
      var t = +body.querySelector("#lab-temp").value, o = +body.querySelector("#lab-o2").value;
      body.querySelector("#lab-temp-v").textContent = t + " °C";
      body.querySelector("#lab-o2-v").textContent = o + " %";
      var s = 90 - Math.abs(t - 245) * 0.32 - Math.max(0, o - 8) * 2.2 - Math.max(0, 6 - o) * 1.5;
      s = Math.max(60, Math.min(92, Math.round(s)));
      body.querySelector("#lab-sel").textContent = "≈ " + s + "%";
      body.querySelector("#lab-bar").style.width = s + "%";
    }
    ["#lab-temp", "#lab-o2"].forEach(function (q) { var e = body.querySelector(q); if (e) e.addEventListener("input", upd); });
    upd();
  }

  /* quiz */
  function renderQuiz(body) {
    var Q = D.quiz, pass = Math.ceil(Q.length * 0.7);
    var answers = {}, submitted = false;
    function draw() {
      var answered = Object.keys(answers).length;
      var score = Q.reduce(function (n, q, i) { return n + (answers[i] === q.a ? 1 : 0); }, 0);
      var passed = score >= pass;
      var h = '<div class="lesson-head"><h2>Check yourself</h2><div class="ph-sub">' + Q.length + ' questions · pass mark ' + pass + "/" + Q.length + '.</div></div>';
      Q.forEach(function (q, i) {
        h += '<div class="lq-card"><p class="lq-q"><span class="mono" style="color:var(--s-product);margin-right:6px">' + (i + 1) + '.</span>' + esc(q.q) + '</p><div class="lq-opts">';
        q.opts.forEach(function (o, oi) {
          var cls = "lq-opt", chosen = answers[i] === oi;
          if (submitted && q.a === oi) cls += " correct";
          else if (submitted && chosen && q.a !== oi) cls += " wrong";
          else if (chosen) cls += " chosen";
          h += '<button class="' + cls + '" data-q="' + i + '" data-o="' + oi + '"' + (submitted ? " disabled" : "") + '>' +
            (submitted && q.a === oi ? "✓ " : (submitted && chosen && q.a !== oi ? "✕ " : "")) + esc(o) + '</button>';
        });
        h += '</div>' + (submitted ? '<p class="lq-why"><b>Why:</b> ' + esc(q.why) + '</p>' : "") + '</div>';
      });
      if (!submitted) {
        h += '<button class="lq-submit" id="lq-submit"' + (answered < Q.length ? " disabled" : "") + '>' +
          (answered < Q.length ? "Answer all " + Q.length + " to submit (" + answered + "/" + Q.length + ")" : "Submit") + '</button>';
      } else {
        h += '<div class="lq-result ' + (passed ? "pass" : "fail") + '"><div><div class="tc-tag" style="color:' + (passed ? "var(--s-product)" : "var(--s-recycle)") + '">' + (passed ? "Passed" : "Keep going") + '</div>' +
          '<div class="lq-score">' + score + " / " + Q.length + '</div><div class="ph-sub">Pass mark ' + pass + ". " + (passed ? "Nice — you can trace the chain and the trade." : "Review the lessons and try again.") + '</div></div>' +
          '<button class="lq-retry" id="lq-retry">↺ Retry</button></div>';
      }
      body.innerHTML = h;
      body.querySelectorAll(".lq-opt").forEach(function (b) {
        b.onclick = function () { if (submitted) return; answers[+b.getAttribute("data-q")] = +b.getAttribute("data-o"); draw(); };
      });
      var sb = body.querySelector("#lq-submit"); if (sb) sb.onclick = function () { if (Object.keys(answers).length >= Q.length) { submitted = true; draw(); } };
      var rb = body.querySelector("#lq-retry"); if (rb) rb.onclick = function () { answers = {}; submitted = false; draw(); };
    }
    draw();
  }

  function wireFigs(body) {
    body.querySelectorAll("[data-figzoom]").forEach(function (bn) { bn.onclick = function () { EO.app.openFigure(bn.getAttribute("data-figzoom")); }; });
  }

  EO.learn = { build: build, select: selectLesson };
})(window.EO = window.EO || {});
