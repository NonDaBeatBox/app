/* =====================================================================
   data.js — the process model that drives the map.
   Everything the canvas and panel render comes from here:
     · NODES     — process areas (spine + derivatives + logistics)
     · STREAMS   — connections between areas (typed + labelled)
     · FEEDS     — external inlets/outlets (steam, O₂, NH₃, CO₂, water…)
     · LAYERS / LEGEND / MODES / DELIVERY / DISCLAIMERS
   All numeric values are public, illustrative training values.
   ===================================================================== */
(function (EO) {
  "use strict";

  var STREAM_TYPES = {
    hydrocarbon: { css: "hydrocarbon", name: "Hydrocarbon & ethylene" },
    product:     { css: "product",     name: "EO & derivative product" },
    recycle:     { css: "recycle",     name: "Recycle / purge / side" },
    water:       { css: "water",       name: "Water & steam" },
    utility:     { css: "utility",     name: "Utility / support" },
    hazard:      { css: "hazard",      name: "Hazard / combustion" },
    info:        { css: "info",        name: "Information only" }
  };

  var PUB = "Public illustrative range — not plant operating data";
  var SRC_COMMON = ["Public process-chemistry references", "Public technology-provider process descriptions", "General chemical-engineering handbooks"];

  /* ---------------------------------------------------------------
     NODES
     --------------------------------------------------------------- */
  var NODES = [
    /* ===== STAGE 1 — feedstocks & feed preparation ===== */
    {
      id: "feedstocks", stage: "1", cat: "feed", glyph: "feed", art: "feedprep",
      title: "Feedstocks & feed preparation", sub: "Receive, heat and mix feed with dilution steam",
      x: 80, y: 340, w: 250, h: 190,
      brief: {
        purpose: "Prepare hydrocarbon feed and mix it with dilution steam before cracking.",
        para: "Crackers can run on light gas feeds (ethane, propane, LPG, NGL) or on liquid naphtha. Lighter feeds give more ethylene; heavier feeds give a broader product slate. The feed is received, drummed, pumped, heated — and vaporised if it arrives as a liquid — then blended with dilution steam on its way to the furnace.",
        inputs: [
          { label: "Ethane / propane / LPG / NGL", type: "hydrocarbon" },
          { label: "Naphtha (a mixture, not one molecule)", type: "hydrocarbon" },
          { label: "Dilution steam", type: "water" }
        ],
        outputs: [
          { label: "Heated hydrocarbon + steam mixture → furnace", type: "hydrocarbon" }
        ],
        equipment: ["Incoming pipeline / feed storage", "Feed drum", "Feed pump", "Feed/effluent heat exchanger", "Vaporiser (for liquid feeds)", "Dilution-steam mixing tee"],
        conditions: [
          { k: "Ethane", v: "C₂H₆" }, { k: "Propane", v: "C₃H₈" },
          { k: "Naphtha", v: "Hydrocarbon mixture (C₅–C₁₀)" },
          { k: "Dilution steam", v: "Lowers hydrocarbon partial pressure" }
        ],
        condNote: PUB,
        molecules: ["ethane", "propane"],
        moleculeNote: "Naphtha is a mixture of many hydrocarbons, so it has no single structure.",
        sources: SRC_COMMON,
        disclaimers: ["Feedstock choice and preparation vary widely by site and by whether the feed is a gas or a liquid."]
      }
    },

    /* ===== STAGE 2 — steam cracking furnace ===== */
    {
      id: "furnace", stage: "2", cat: "thermal", glyph: "furnace", art: "furnace",
      title: "Steam cracking furnace", sub: "Thermal cracking of feed into cracked gas",
      x: 410, y: 340, w: 250, h: 190,
      brief: {
        purpose: "Crack the hydrocarbon feed at high temperature into a mixture rich in ethylene and other light molecules, then quench it immediately.",
        para: "Feed and dilution steam are preheated in the convection section, then pass through radiant coils fired by burners. Cracking happens in a very short residence time; the coil outlet is quenched at once in the transfer-line exchanger (TLE) to lock in the product mix. Dilution steam lowers the hydrocarbon partial pressure and limits coke formation. Over time coke still builds on the coil walls and the furnace is periodically taken offline for decoking (burning the coke off with steam and air).",
        inputs: [
          { label: "Heated feed + dilution steam", type: "hydrocarbon" },
          { label: "Fuel gas to burners", type: "hazard" }
        ],
        outputs: [
          { label: "Cracked gas (many species)", type: "hydrocarbon" }
        ],
        equipment: ["Convection section", "Radiant section (burners)", "Radiant coils / furnace tubes", "Coil outlet", "Transfer-line exchanger (TLE)"],
        reactions: [
          { kind: "", label: "Representative cracking reaction", eq: "C₂H₆  →  C₂H₄ + H₂", mols: ["ethane", "ethylene", "hydrogen"] }
        ],
        rxnNote: "Heavier feeds form many products at once — this single reaction is only illustrative.",
        conditions: [
          { k: "Coil-outlet temperature", v: "≈ 800–875 °C" },
          { k: "Residence time", v: "Very short" },
          { k: "Steam purpose", v: "↓ partial pressure, ↓ coke" },
          { k: "After the coil", v: "Rapid TLE quench" }
        ],
        condNote: PUB,
        molecules: ["ethane", "ethylene", "hydrogen", "methane", "propane"],
        productsMade: ["Ethylene", "Propylene", "Methane", "Hydrogen", "Heavier hydrocarbons", "Unreacted feed"],
        sources: SRC_COMMON,
        disclaimers: ["The furnace does not make pure ethylene — it makes a mixture that is separated later.", "Decoking chemistry shown is general public information only."]
      }
    },

    /* ===== STAGE 3a — quench & compression ===== */
    {
      id: "quench", stage: "3", cat: "separation", glyph: "quench", art: "quench",
      title: "Quench & compression", sub: "Cool, separate heavies, compress the cracked gas",
      x: 740, y: 340, w: 250, h: 190,
      brief: {
        purpose: "Cool the cracked gas, drop out heavy material and water, then raise the gas to the pressure needed for later separation.",
        para: "After the transfer-line exchanger the gas is quenched (often with oil then water), which condenses the heaviest fractions and much of the dilution steam. The remaining gas is compressed in several stages, with an intercooler and a knock-out drum between stages to remove condensate and control temperature.",
        inputs: [{ label: "Cracked gas", type: "hydrocarbon" }],
        outputs: [
          { label: "Compressed cracked gas", type: "hydrocarbon" },
          { label: "Quench water / heavy ends", type: "recycle" }
        ],
        equipment: ["Transfer-line exchanger", "Quench tower", "Quench-water/oil drum", "Multi-stage cracked-gas compressor", "Intercoolers", "Knock-out (K.O.) drums"],
        conditions: [
          { k: "Quench", v: "Condenses heavies + steam" },
          { k: "Compression", v: "Multi-stage w/ intercooling" },
          { k: "Between stages", v: "Knock-out of condensate" }
        ],
        condNote: PUB,
        sources: SRC_COMMON,
        disclaimers: ["Quench and compression schemes vary by cracker and feed."]
      }
    },

    /* ===== STAGE 3b — acid-gas removal & drying ===== */
    {
      id: "treatment", stage: "3", cat: "separation", glyph: "treatment", art: "treatment",
      title: "Cracked-gas treatment", sub: "Acid-gas removal + drying before cryogenics",
      x: 1070, y: 340, w: 250, h: 190,
      brief: {
        purpose: "Clean and dry the compressed gas so it can be cooled to very low temperature without freezing or fouling.",
        para: "Acid gases (CO₂ and any H₂S) are scrubbed out in a caustic or amine wash, and water is removed on molecular-sieve dryers. This matters because water and CO₂ would freeze solid in the cold cryogenic section and block the equipment.",
        inputs: [{ label: "Compressed cracked gas", type: "hydrocarbon" }],
        outputs: [
          { label: "Dry, sweet cracked gas", type: "hydrocarbon" },
          { label: "Acid gas / CO₂", type: "recycle" }
        ],
        equipment: ["Caustic / amine absorber", "Solvent regenerator", "Molecular-sieve dryers (A/B)", "Chiller"],
        conditions: [
          { k: "Acid-gas removal", v: "Caustic / amine wash" },
          { k: "Drying", v: "Molecular sieves" },
          { k: "Why", v: "H₂O & CO₂ freeze in cryo" }
        ],
        condNote: PUB,
        molecules: ["co2", "water"],
        sources: SRC_COMMON,
        disclaimers: ["Treatment configuration is representative and varies by site."]
      }
    },

    /* ===== STAGE 4 — cryogenic separation & ethylene purification ===== */
    {
      id: "cryo", stage: "4", cat: "separation", glyph: "cryo", art: "cryo",
      title: "Cryogenic separation", sub: "Fractionate cracked gas → high-purity ethylene",
      x: 1400, y: 340, w: 250, h: 190,
      brief: {
        purpose: "Separate the many components of the cracked gas by distillation at low temperature and deliver high-purity ethylene to the EO unit.",
        para: "The cracked gas is fractionated in a cold separation train. The demethaniser removes methane and hydrogen; the deethaniser cuts C₂ from C₃⁺; a small catalytic reactor converts trace acetylene to ethylene; and the ethylene splitter finally separates ethylene from ethane. The splitter is the key column — its overhead is the high-purity ethylene used to make EO. A refrigeration system and cold box supply the low temperatures.",
        inputs: [{ label: "Dry cracked gas", type: "hydrocarbon" }],
        outputs: [
          { label: "Purified ethylene → EO unit", type: "hydrocarbon" },
          { label: "Methane / hydrogen", type: "recycle" },
          { label: "C₃⁺ to recovery", type: "recycle" },
          { label: "Ethane recycle to furnace", type: "recycle" }
        ],
        equipment: ["Demethaniser", "Deethaniser", "Acetylene-conversion reactor", "Ethylene splitter", "Refrigeration compressors", "Cold box"],
        conditions: [
          { k: "Principle", v: "Distillation by volatility" },
          { k: "Key column", v: "Ethylene splitter" },
          { k: "Product", v: "High-purity ethylene" }
        ],
        condNote: PUB,
        molecules: ["ethylene", "methane", "hydrogen"],
        sources: SRC_COMMON,
        disclaimers: ["Representative separation sequence — actual cracker configurations vary by feedstock, technology and site."]
      }
    },

    /* ===== STAGE 5 — EO reactor system ===== */
    {
      id: "eoreactor", stage: "5", cat: "reaction", glyph: "reactor", art: "eoreactor",
      title: "EO reactor system", sub: "Silver-catalysed partial oxidation of ethylene",
      x: 1730, y: 340, w: 250, h: 190,
      brief: {
        purpose: "React ethylene with oxygen over a silver catalyst to make ethylene oxide, while recycling most of the gas and rejecting the CO₂ that forms.",
        para: "Purified ethylene, oxygen and a large recycle-gas stream are mixed, preheated and fed to a multitubular reactor: thousands of tubes packed with silver catalyst, cooled by a heat-transfer fluid in the shell. Only part of the ethylene reacts per pass, so the reactor effluent is cooled, the EO is taken off downstream, and the unreacted gas is compressed and recycled. A small ethyl-chloride moderator tunes selectivity, and CO₂ from the side reaction is purged.",
        inputs: [
          { label: "Purified ethylene", type: "hydrocarbon" },
          { label: "Oxygen feed", type: "utility" },
          { label: "Reactor recycle gas", type: "recycle" }
        ],
        outputs: [
          { label: "Crude EO + gas → recovery", type: "product" },
          { label: "CO₂ by-product / purge", type: "recycle" }
        ],
        equipment: ["Gas mixer", "Feed preheater", "Multitubular catalytic reactor", "Silver catalyst (in tubes)", "Reactor-effluent cooler", "Gas separator", "Recycle compressor"],
        reactions: [
          { kind: "desired", label: "Desired — partial oxidation", eq: "C₂H₄ + ½O₂  →  C₂H₄O", mols: ["ethylene", "oxygen", "eo"] },
          { kind: "undesired", label: "Undesired — complete combustion", eq: "C₂H₄ + 3O₂  →  2CO₂ + 2H₂O", mols: ["ethylene", "oxygen", "co2", "water"] }
        ],
        rxnCompare: { desired: "Ethylene → Ethylene oxide", undesired: "Ethylene → Carbon dioxide + water" },
        conditions: [
          { k: "Temperature", v: "≈ 220–280 °C" },
          { k: "Pressure", v: "≈ 10–30 bar" },
          { k: "Catalyst", v: "Silver-based" },
          { k: "Moderator", v: "Ethyl chloride" },
          { k: "EO selectivity", v: "≈ 85–90 %" }
        ],
        condNote: "Public illustrative range — not plant operating data",
        molecules: ["ethylene", "oxygen", "eo", "co2", "water", "ethyl_chloride"],
        sources: SRC_COMMON,
        disclaimers: ["The reactor is a shell-and-tube catalytic reactor, not a single tank.", "Catalyst and moderator details shown are public/general only — no unpublished formulations."]
      }
    },

    /* ===== STAGE 6 — EO recovery & purification ===== */
    {
      id: "eorecovery", stage: "6", cat: "recovery", glyph: "recovery", art: "eorecovery",
      title: "EO recovery & purification", sub: "Absorb, strip and distil EO to product grade",
      x: 2060, y: 340, w: 250, h: 190,
      brief: {
        purpose: "Recover ethylene oxide from the reactor gas and purify it, returning the scrubbed gas to the reactor loop.",
        para: "EO does not leave the reactor as a pure liquid — it comes out mixed with recycle gas, unreacted ethylene and by-products. It is first absorbed into water (EO is very soluble), giving an EO-rich water stream, while the scrubbed gas returns to the reactor. The EO is then stripped back out of the water and purified by distillation, removing light ends and heavy ends to reach product grade.",
        inputs: [{ label: "Crude EO + gas", type: "product" }, { label: "Absorption water", type: "water" }],
        outputs: [
          { label: "Purified EO → distribution", type: "product" },
          { label: "Recycle gas → reactor", type: "recycle" },
          { label: "Light / heavy ends", type: "recycle" }
        ],
        equipment: ["EO absorber", "Water circulation", "EO stripper", "Light-ends column", "EO purification column", "Reboilers / condensers"],
        conditions: [
          { k: "Absorption", v: "EO into water" },
          { k: "Recovery", v: "Stripping + distillation" },
          { k: "Recycle gas", v: "Back to reactor" },
          { k: "CO₂ side stream", v: "Purged (amber)" }
        ],
        condNote: PUB,
        molecules: ["eo", "water"],
        sources: SRC_COMMON,
        disclaimers: ["Internal energy and flow data are not shown — utility connections are indicative only."]
      }
    },

    /* ===== STAGE 7 — EO distribution header ===== */
    {
      id: "manifold", stage: "7", cat: "distribution", glyph: "manifold", art: "manifold",
      title: "Purified-EO distribution header", sub: "Split one EO stream to every derivative unit",
      x: 2390, y: 330, w: 250, h: 210,
      brief: {
        purpose: "Divide the single purified-EO stream between the glycol unit and the HPEO derivative units.",
        para: "A distribution header (a conceptual manifold, not a real piping arrangement) sends purified EO to the glycol plant and high-purity EO (HPEO) to the ethanolamine, ethoxylate, PEG, glycol-ether and polyether-polyol units. EO can also be moved by dedicated pipeline. Because EO is hazardous, it travels only by dedicated pipeline — never by the general transport modes used for the liquid products.",
        inputs: [{ label: "Purified EO", type: "product" }],
        outputs: [
          { label: "EO → glycol production", type: "product" },
          { label: "EO → Shell OMEGA route", type: "product" },
          { label: "HPEO → ethanolamines", type: "product" },
          { label: "HPEO → ethoxylates", type: "product" },
          { label: "HPEO → PEG", type: "product" },
          { label: "HPEO → glycol ethers", type: "product" },
          { label: "HPEO → polyether polyols", type: "product" },
          { label: "EO by dedicated pipeline", type: "product" }
        ],
        equipment: ["Distribution header", "Branch valves", "Labelled branch lines", "Vessel / pipeline connections"],
        conditions: [
          { k: "Function", v: "One EO stream → many units" },
          { k: "EO transport", v: "Dedicated pipeline only" }
        ],
        condNote: PUB,
        molecules: ["eo"],
        sources: SRC_COMMON,
        disclaimers: ["Conceptual EO distribution header — not plant piping configuration.", "Branch valves and lines are graphical detail only."]
      }
    },

    /* ===== STAGE 8B — Shell OMEGA route ===== */
    {
      id: "omega", stage: "8B", cat: "derivative", glyph: "omega", art: "omega",
      title: "Shell OMEGA glycol route", sub: "EO → ethylene carbonate → MEG (CO₂ recycled)",
      x: 2770, y: 60, w: 240, h: 150,
      brief: {
        purpose: "Make mono-ethylene glycol (MEG) from EO via ethylene carbonate, using and recycling CO₂ — an alternative to conventional hydration.",
        para: "Instead of hydrating EO directly, the OMEGA route first reacts EO with CO₂ to form ethylene carbonate, then hydrolyses that intermediate to MEG, releasing the CO₂ again. The CO₂ is captured and recycled, so the loop is highly selective to MEG and makes very little DEG/TEG. The amber CO₂ recycle loop is the defining feature of this route.",
        inputs: [{ label: "EO feed", type: "product" }, { label: "CO₂ feed", type: "recycle" }, { label: "Water", type: "water" }],
        outputs: [{ label: "MEG product", type: "product" }, { label: "CO₂ recycle", type: "recycle" }],
        equipment: ["Ethylene-carbonate (EC) reactor", "Catalyst", "Hydrolysis reactor", "CO₂ separator", "CO₂ recycle compressor", "MEG purification"],
        reactions: [
          { kind: "", label: "Carbonate formation", eq: "EO + CO₂  →  Ethylene carbonate", mols: ["eo", "co2", "ethylene_carbonate"] },
          { kind: "", label: "Hydrolysis to MEG", eq: "Ethylene carbonate + H₂O  →  MEG + CO₂", mols: ["ethylene_carbonate", "water", "meg", "co2"] }
        ],
        conditions: [
          { k: "Route", v: "Carbonate intermediate" },
          { k: "CO₂", v: "Recycled in a loop" },
          { k: "Selectivity", v: "Very high to MEG" },
          { k: "Co-products", v: "Little DEG / TEG" }
        ],
        condNote: PUB,
        molecules: ["eo", "co2", "ethylene_carbonate", "water", "meg"],
        products: [{ name: "MEG", mol: "meg" }],
        applications: ["petbottle", "fiber", "antifreeze", "film", "coolant"],
        sources: SRC_COMMON.concat(["Public descriptions of the Shell OMEGA process"]),
        disclaimers: ["Distinct from conventional hydration — shown as a separate route.", "Comparison figures are public illustrative values."]
      }
    },

    /* ===== STAGE 8A — conventional glycols ===== */
    {
      id: "glycol", stage: "8A", cat: "derivative", glyph: "glycol", art: "glycol",
      title: "Conventional glycol production", sub: "EO hydration → MEG + DEG + TEG",
      x: 2770, y: 240, w: 240, h: 150,
      brief: {
        purpose: "React EO with a large excess of water to make mainly MEG, plus DEG and TEG, then separate them by boiling point.",
        para: "EO and water are mixed and hydrated; the first product is MEG, but MEG can react with more EO to give DEG, and DEG with more EO to give TEG. Using a large excess of water (about 20 parts water to 1 part EO) keeps EO dilute, so it mostly meets water rather than glycol — favouring MEG. The reactor effluent is concentrated in a multiple-effect evaporator train, then a distillation ladder separates the glycols by their rising boiling points.",
        inputs: [{ label: "EO feed", type: "product" }, { label: "Excess water (~20:1)", type: "water" }],
        outputs: [{ label: "MEG / DEG / TEG products", type: "product" }, { label: "Water recycle", type: "recycle" }],
        equipment: ["Feed mixing", "Hydration reactor", "Effluent cooling", "Multiple-effect evaporator train", "MEG column", "DEG column", "TEG / heavy-glycol column", "Product tanks"],
        reactions: [
          { kind: "", label: "MEG", eq: "EO + H₂O  →  MEG", mols: ["eo", "water", "meg"] },
          { kind: "", label: "DEG", eq: "MEG + EO  →  DEG", mols: ["meg", "eo", "deg"] },
          { kind: "", label: "TEG", eq: "DEG + EO  →  TEG", mols: ["deg", "eo", "teg"] }
        ],
        conditions: [
          { k: "Water-to-EO ratio", v: "≈ 20 : 1" },
          { k: "Reaction temperature", v: "≈ 200 °C" },
          { k: "Main product", v: "MEG" },
          { k: "Co-products", v: "DEG, TEG" }
        ],
        condNote: "Illustrative public technology values — not plant data",
        ladder: [
          { k: "MEG boiling point", v: "≈ 197 °C" },
          { k: "DEG boiling point", v: "≈ 246 °C" },
          { k: "TEG boiling point", v: "≈ 287 °C" }
        ],
        molecules: ["eo", "water", "meg", "deg", "teg"],
        products: [
          { name: "MEG", mol: "meg", apps: ["petbottle", "fiber", "film", "coolant", "antifreeze"] },
          { name: "DEG", mol: "deg", apps: ["resin", "plasticizer", "solvent"] },
          { name: "TEG", mol: "teg", apps: ["gasdehydration", "solvent"] }
        ],
        applications: ["petbottle", "fiber", "antifreeze", "resin", "gasdehydration"],
        sources: SRC_COMMON,
        disclaimers: ["Excess water favours MEG by keeping EO dilute.", "Illustrative public technology values — not plant data."]
      }
    },

    /* ===== STAGE 9 — ethanolamines ===== */
    {
      id: "amines", stage: "9", cat: "derivative", glyph: "amines", art: "amines",
      title: "Ethanolamines process", sub: "EO + ammonia → MEA / DEA / TEA",
      x: 2770, y: 470, w: 240, h: 150,
      brief: {
        purpose: "React EO with ammonia to make mono-, di- and tri-ethanolamine, then separate them.",
        para: "Ammonia reacts with EO to add a hydroxyethyl (–CH₂CH₂OH) arm, giving MEA. MEA can react with more EO to give DEA (two arms), and DEA with more EO to give TEA (three arms). Changing the EO-to-ammonia ratio shifts the product mix: more ammonia favours MEA, more EO favours DEA/TEA. Excess ammonia is recovered and recycled, and the three products are separated by distillation.",
        inputs: [{ label: "EO feed", type: "product" }, { label: "Ammonia feed", type: "utility" }],
        outputs: [{ label: "MEA / DEA / TEA products", type: "product" }, { label: "Ammonia recycle", type: "recycle" }],
        equipment: ["Amination reactor", "Ammonia recovery", "MEA column", "DEA column", "TEA column"],
        reactions: [
          { kind: "", label: "MEA (one arm)", eq: "NH₃ + EO  →  MEA", mols: ["ammonia", "eo", "mea"] },
          { kind: "", label: "DEA (two arms)", eq: "MEA + EO  →  DEA", mols: ["mea", "eo", "dea"] },
          { kind: "", label: "TEA (three arms)", eq: "DEA + EO  →  TEA", mols: ["dea", "eo", "tea"] }
        ],
        conditions: [
          { k: "Reactants", v: "EO + ammonia" },
          { k: "Product split", v: "Set by EO : NH₃ ratio" },
          { k: "MEA / DEA / TEA", v: "1 / 2 / 3 hydroxyethyl arms" }
        ],
        condNote: PUB,
        molecules: ["ammonia", "eo", "mea", "dea", "tea"],
        products: [
          { name: "MEA", mol: "mea", apps: ["gastreat", "surfactant", "cement"] },
          { name: "DEA", mol: "dea", apps: ["gastreat", "detergent", "cement"] },
          { name: "TEA", mol: "tea", apps: ["personalcare", "cement", "agri"] }
        ],
        applications: ["gastreat", "surfactant", "personalcare", "detergent", "cement", "agri"],
        sources: SRC_COMMON,
        disclaimers: ["MEA, DEA and TEA are made and then separated — not by one single direct reaction."]
      }
    },

    /* ===== STAGE 10 — ethoxylates ===== */
    {
      id: "ethoxylation", stage: "10", cat: "derivative", glyph: "ethoxylation", art: "ethoxylation",
      title: "Ethoxylates", sub: "Controlled EO addition onto an initiator",
      x: 2770, y: 650, w: 240, h: 150,
      brief: {
        purpose: "Add EO in a controlled way onto a fatty alcohol or other initiator to build surfactant molecules.",
        para: "A starter such as a fatty alcohol is charged to a stirred reactor and EO is added a little at a time. Each EO adds one –CH₂CH₂O– unit, growing a water-loving chain on the end of the oil-loving starter. The result is an amphiphile: a hydrophobic tail plus a hydrophilic EO chain — the basic structure of most non-ionic surfactants.",
        inputs: [{ label: "Fatty alcohol / initiator", type: "utility" }, { label: "EO feed (metered)", type: "product" }],
        outputs: [{ label: "Ethoxylate product", type: "product" }],
        equipment: ["EO metering", "Stirred ethoxylation reactor", "Reaction cooler", "Product finishing"],
        conditions: [
          { k: "EO addition", v: "Controlled / metered" },
          { k: "Chain growth", v: "–CH₂CH₂O– units" },
          { k: "Structure", v: "Amphiphile (tail + EO chain)" }
        ],
        condNote: PUB,
        molecules: ["eo"],
        applications: ["detergent", "cleaner", "surfactant", "emulsifier"],
        sources: SRC_COMMON,
        disclaimers: ["Structure shown is a generic amphiphile, not a specific commercial product."]
      }
    },

    /* ===== STAGE 10 — PEG ===== */
    {
      id: "peg", stage: "10", cat: "derivative", glyph: "ethoxylation", art: "peg",
      title: "Poly-ethylene glycol (PEG)", sub: "EO polymerised to controlled molecular weight",
      x: 2770, y: 830, w: 240, h: 150,
      brief: {
        purpose: "Polymerise EO onto an initiator to make PEG across a range of molecular weights.",
        para: "EO is added onto an initiator and the –CH₂CH₂O– chain is grown to a target length. Controlling how much EO is added sets the molecular weight, which in turn sets whether the PEG is a mobile liquid, a paste or a waxy solid. PEG grades are named by their approximate molecular weight.",
        inputs: [{ label: "Initiator", type: "utility" }, { label: "EO feed", type: "product" }],
        outputs: [{ label: "PEG grades", type: "product" }],
        equipment: ["EO feed", "Polymerisation reactor", "Molecular-weight control", "Finishing / grading"],
        conditions: [
          { k: "Repeat unit", v: "HO–(CH₂CH₂O)ₙ–H" },
          { k: "Chain growth", v: "EO addition" },
          { k: "Grades", v: "By molecular weight" }
        ],
        condNote: PUB,
        molecules: ["eo", "peg"],
        formula: "HO–(CH₂CH₂O)ₙ–H",
        applications: ["personalcare", "pharma", "toothpaste", "solvent"],
        sources: SRC_COMMON,
        disclaimers: ["Grade ranges are general public information."]
      }
    },

    /* ===== STAGE 10 — glycol ethers ===== */
    {
      id: "glycolethers", stage: "10", cat: "derivative", glyph: "glycol", art: "glycolethers",
      title: "Glycol ethers", sub: "Alcohol + EO → glycol-ether solvents",
      x: 2770, y: 1010, w: 240, h: 150,
      brief: {
        purpose: "React an alcohol with EO to make a family of glycol-ether solvents, then purify the cuts.",
        para: "An alcohol reacts with EO to give a glycol ether — a molecule that dissolves both water-based and oil-based materials, which makes it a valuable coalescing solvent. Different alcohols and different numbers of EO units give a family of products separated by distillation.",
        inputs: [{ label: "Alcohol feed", type: "utility" }, { label: "EO feed", type: "product" }],
        outputs: [{ label: "Glycol-ether products", type: "product" }],
        equipment: ["Etherification reactor", "Purification", "Product-cut columns"],
        conditions: [
          { k: "Reactants", v: "Alcohol + EO" },
          { k: "Family", v: "Several glycol ethers" },
          { k: "Separation", v: "Distillation" }
        ],
        condNote: PUB,
        molecules: ["eo"],
        applications: ["paint", "coating", "ink", "cleaner", "electronics"],
        sources: SRC_COMMON,
        disclaimers: ["Product family is representative."]
      }
    },

    /* ===== STAGE 10 — polyether polyols ===== */
    {
      id: "polyols", stage: "10", cat: "derivative", glyph: "ethoxylation", art: "polyols",
      title: "Polyether polyols", sub: "EO/PO onto an initiator → polyols for polyurethane",
      x: 2770, y: 1190, w: 240, h: 150,
      brief: {
        purpose: "Build polyether polyols by adding EO and/or propylene oxide (PO) onto an initiator, for downstream polyurethane.",
        para: "EO and/or PO are added onto a multi-functional initiator to grow polyether chains ending in –OH groups (a polyol). The choice and ratio of EO/PO and the initiator set the polyol’s properties. Polyols react with isocyanates downstream to make polyurethanes — flexible and rigid foams, elastomers and coatings.",
        inputs: [{ label: "Initiator", type: "utility" }, { label: "EO and/or PO feed", type: "product" }],
        outputs: [{ label: "Polyol product → polyurethane", type: "product" }],
        equipment: ["EO/PO feed", "Alkoxylation reactor", "Polymerisation", "Finishing"],
        conditions: [
          { k: "Monomers", v: "EO and/or PO" },
          { k: "Product", v: "Polyether polyol (–OH ends)" },
          { k: "Downstream", v: "Polyurethane" }
        ],
        condNote: PUB,
        molecules: ["eo"],
        applications: ["foam", "mattress", "carseat", "insulation", "elastomer"],
        sources: SRC_COMMON,
        disclaimers: ["EO and PO chemistry shown at a general public level."]
      }
    },

    /* ===== STORAGE & DELIVERY ===== */
    {
      id: "storage", stage: "→", cat: "logistics", glyph: "storage", art: "storage",
      title: "Product storage & delivery", sub: "Tank farm, loading & dispatch by mode",
      x: 3560, y: 320, w: 290, h: 760,
      brief: {
        purpose: "Store finished products and dispatch each one by the transport modes that suit it.",
        para: "Liquid products move from the tank farm through loading pumps and loading arms to road tankers, ISO tanks, drums, IBCs and marine vessels, or leave by pipeline. EO itself is different: because it is hazardous, it is moved only by dedicated pipeline and is never loaded into the general transport modes used for the glycols and amines.",
        inputs: [
          { label: "MEG / DEG / TEG", type: "product" },
          { label: "MEA / DEA / TEA", type: "product" },
          { label: "Ethoxylates / PEG / glycol ethers / polyols", type: "product" },
          { label: "EO by dedicated pipeline", type: "product" }
        ],
        outputs: [{ label: "Customer delivery", type: "product" }],
        equipment: ["Product storage tanks", "Tank farm", "Loading pumps", "Loading arms", "Pipeline connection", "Marine-loading connection", "Tanker-loading bay", "ISO-tank handling", "Packaged-product warehouse"],
        conditions: [
          { k: "EO", v: "Dedicated pipeline only" },
          { k: "Liquid products", v: "Vessel / truck / ISO / drum…" }
        ],
        condNote: "General public training guidance — not site-specific logistics data",
        deliveryModes: ["EO pipeline", "Bulk vessel", "Bulk truck", "ISO tank", "Flexibag", "IBC", "Drum"],
        sources: SRC_COMMON,
        disclaimers: ["EO is never shown connected to transport modes other than dedicated pipeline.", "Product-to-delivery guidance is general and public, not site-specific."]
      }
    }
  ];

  /* ---------------------------------------------------------------
     STREAMS  (from → to, typed, labelled)
     sides: l r t b   ·  side:true marks a side/recycle stream
     --------------------------------------------------------------- */
  var STREAMS = [
    // ---- main hydrocarbon backbone ----
    { from: "feedstocks", to: "furnace", fs: "r", ts: "l", type: "hydrocarbon", label: "Heated feed + steam" },
    { from: "furnace", to: "quench", fs: "r", ts: "l", type: "hydrocarbon", label: "Cracked gas" },
    { from: "quench", to: "treatment", fs: "r", ts: "l", type: "hydrocarbon", label: "Compressed cracked gas" },
    { from: "treatment", to: "cryo", fs: "r", ts: "l", type: "hydrocarbon", label: "Dry cracked gas" },
    { from: "cryo", to: "eoreactor", fs: "r", ts: "l", type: "hydrocarbon", label: "Purified ethylene" },
    // ---- EO product backbone ----
    { from: "eoreactor", to: "eorecovery", fs: "r", ts: "l", type: "product", label: "Crude EO solution" },
    { from: "eorecovery", to: "manifold", fs: "r", ts: "l", type: "product", label: "Purified EO" },
    // ---- distribution header → derivatives ----
    { from: "manifold", to: "omega", fs: "r", ts: "l", type: "product", label: "EO to OMEGA" },
    { from: "manifold", to: "glycol", fs: "r", ts: "l", type: "product", label: "EO to glycol unit" },
    { from: "manifold", to: "amines", fs: "r", ts: "l", type: "product", label: "HPEO to amines" },
    { from: "manifold", to: "ethoxylation", fs: "r", ts: "l", type: "product", label: "HPEO to ethoxylates" },
    { from: "manifold", to: "peg", fs: "r", ts: "l", type: "product", label: "HPEO to PEG" },
    { from: "manifold", to: "glycolethers", fs: "r", ts: "l", type: "product", label: "HPEO to glycol ethers" },
    { from: "manifold", to: "polyols", fs: "r", ts: "l", type: "product", label: "HPEO to polyols" },
    // ---- recycle: EO recovery gas back to reactor (prominent) ----
    { from: "eorecovery", to: "eoreactor", fs: "t", ts: "t", type: "recycle", label: "Reactor recycle gas", side: true, arc: 120 },
    // ---- ethane recycle: cryo back to furnace ----
    { from: "cryo", to: "furnace", fs: "b", ts: "b", type: "recycle", label: "Ethane recycle", side: true, arc: 150 },
    // ---- products → storage/delivery (spread along the tall dispatch column) ----
    { from: "omega", to: "storage", fs: "r", ts: "l", toff: 0.03, type: "product", label: "MEG" },
    { from: "glycol", to: "storage", fs: "r", ts: "l", toff: 0.13, type: "product", label: "MEG / DEG / TEG" },
    { from: "amines", to: "storage", fs: "r", ts: "l", toff: 0.31, type: "product", label: "MEA / DEA / TEA" },
    { from: "ethoxylation", to: "storage", fs: "r", ts: "l", toff: 0.47, type: "product", label: "Ethoxylates" },
    { from: "peg", to: "storage", fs: "r", ts: "l", toff: 0.62, type: "product", label: "PEG" },
    { from: "glycolethers", to: "storage", fs: "r", ts: "l", toff: 0.80, type: "product", label: "Glycol ethers" },
    { from: "polyols", to: "storage", fs: "r", ts: "l", toff: 0.95, type: "product", label: "Polyols" },
    // ---- EO dedicated pipeline (manifold → storage, pipeline only) ----
    { from: "manifold", to: "storage", fs: "b", ts: "l", toff: 0.0, type: "product", label: "EO by dedicated pipeline", side: true, dash: true, arc: 200 }
  ];

  /* ---------------------------------------------------------------
     FEEDS — external inlets / outlets drawn as short labelled arrows
     --------------------------------------------------------------- */
  var FEEDS = [
    { node: "feedstocks", side: "b", dir: "in", type: "water", label: "Dilution steam" },
    { node: "furnace", side: "b", dir: "in", type: "hazard", label: "Fuel gas (burners)" },
    { node: "cryo", side: "t", dir: "out", type: "recycle", label: "CH₄ / H₂ off-gas" },
    { node: "eoreactor", side: "t", dir: "in", type: "utility", label: "Oxygen feed" },
    { node: "eoreactor", side: "b", dir: "out", type: "recycle", label: "CO₂ by-product" },
    { node: "amines", side: "t", dir: "in", type: "utility", label: "Ammonia feed" },
    { node: "omega", side: "t", dir: "in", type: "recycle", label: "CO₂ feed" },
    { node: "glycol", side: "b", dir: "in", type: "water", label: "Process water" },
    { node: "treatment", side: "t", dir: "out", type: "recycle", label: "Acid gas / CO₂" }
  ];

  /* ---------------------------------------------------------------
     LAYERS · LEGEND · MODES
     --------------------------------------------------------------- */
  var LAYERS = [
    { id: "mainflow", label: "Main flow", on: true, kind: "info", swatch: "hydrocarbon", locked: true },
    { id: "allstreams", label: "All streams", on: true, kind: "streams" },
    { id: "recycle", label: "Recycle streams", on: true, kind: "stream", swatch: "recycle" },
    { id: "utilities", label: "Utilities & water", on: true, kind: "stream", swatch: "water" },
    { id: "labels", label: "Stream labels", on: true, kind: "text" },
    { id: "molecules", label: "Molecules", on: false, kind: "chem" },
    { id: "equipment", label: "Equipment (in nodes)", on: true, kind: "equip" },
    { id: "equipnames", label: "Equipment names", on: false, kind: "equip" },
    { id: "enduses", label: "End uses", on: false, kind: "product" },
    { id: "delivery", label: "Delivery routes", on: false, kind: "logistics" }
  ];

  var LEGEND = [
    { css: "hydrocarbon", label: "Hydrocarbon & ethylene", solid: true },
    { css: "product", label: "EO & derivative products", solid: true },
    { css: "recycle", label: "Recycle / purge / side", dash: true },
    { css: "water", label: "Water & steam", solid: true },
    { css: "utility", label: "Utilities / support", solid: true },
    { css: "hazard", label: "Hazard / combustion", dash: true },
    { css: "info", label: "Information only", dot: true }
  ];

  var MODES = {
    overview: { label: "Process overview", desc: "Complete route, major equipment groups, main streams, products and applications." },
    equipment: { label: "Equipment detail", desc: "Adds individual equipment, columns, compressors, exchangers, reactors, storage and recycle loops." },
    chemistry: { label: "Chemistry detail", desc: "Adds molecule drawings, reaction equations, catalyst, selectivity, boiling points and ratio effects." }
  };

  /* ---------------------------------------------------------------
     DELIVERY MATRIX  (general public training guidance)
     --------------------------------------------------------------- */
  var DELIVERY = {
    columns: ["Pipeline", "Vessel", "Truck", "ISO tank", "Flexibag", "IBC", "Drum"],
    rows: [
      { product: "EO", cells: ["Yes", "No", "No", "No", "No", "No", "No"] },
      { product: "MEG", cells: ["Site-dependent", "Yes", "Yes", "Yes", "Where suitable", "Yes", "Yes"] },
      { product: "DEG", cells: ["Site-dependent", "Yes", "Yes", "Yes", "Where suitable", "Yes", "Yes"] },
      { product: "TEG", cells: ["Site-dependent", "Yes", "Yes", "Yes", "Where suitable", "Yes", "Yes"] },
      { product: "Ethanolamines", cells: ["Site-dependent", "Product-dependent", "Yes", "Yes", "Product-dependent", "Yes", "Yes"] }
    ],
    note: "General public training guidance — not site-specific logistics data. EO is dispatched only by dedicated pipeline."
  };

  /* ---------------------------------------------------------------
     GLOBAL DISCLAIMERS + SOURCE CATEGORIES
     --------------------------------------------------------------- */
  var DISCLAIMERS = [
    "This is a detailed training map built from public process chemistry and public technology descriptions. It is not a plant process-flow diagram.",
    "Equipment sequence and configuration are representative. Actual designs vary by technology provider, feedstock, capacity and site.",
    "All temperatures, pressures, ratios, capacities and yields are public illustrative values — not plant operating data.",
    "All artwork is original technical illustration. No real photographs are embedded; realistic scene illustrations are labelled as representative and are not a specific GC, PTTGC or Shell facility.",
    "The map deliberately contains no proprietary equipment numbers, line numbers, control tags, plant layouts, internal operating conditions, production rates, operating procedures, unpublished catalyst formulations or site-specific safety systems."
  ];
  var SOURCE_CATEGORIES = [
    "Public process-chemistry references and textbooks",
    "Public technology-provider process descriptions",
    "General chemical-engineering handbooks",
    "Publicly available product and safety information"
  ];

  /* ---------------------------------------------------------------
     Ordered stage list for the left-rail nav
     --------------------------------------------------------------- */
  var STAGE_ORDER = ["feedstocks", "furnace", "quench", "treatment", "cryo", "eoreactor", "eorecovery", "manifold", "omega", "glycol", "amines", "ethoxylation", "peg", "glycolethers", "polyols", "storage"];

  /* ---------------------------------------------------------------
     expose
     --------------------------------------------------------------- */
  var byId = {};
  NODES.forEach(function (n) { byId[n.id] = n; });

  EO.data = {
    nodes: NODES,
    byId: byId,
    streams: STREAMS,
    feeds: FEEDS,
    layers: LAYERS,
    legend: LEGEND,
    modes: MODES,
    streamTypes: STREAM_TYPES,
    delivery: DELIVERY,
    disclaimers: DISCLAIMERS,
    sourceCategories: SOURCE_CATEGORIES,
    stageOrder: STAGE_ORDER,
    node: function (id) { return byId[id]; }
  };
})(window.EO = window.EO || {});
