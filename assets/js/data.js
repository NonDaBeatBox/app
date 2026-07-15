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
        feedList: [
          { name: "Ethane", formula: "C₂H₆", note: "Light gas — the highest ethylene yield." },
          { name: "Propane", formula: "C₃H₈", note: "Light gas; also makes some propylene." },
          { name: "LPG", formula: "C₃–C₄", note: "Propane / butane mixture." },
          { name: "NGL", formula: "C₂–C₅⁺", note: "Natural-gas liquids." },
          { name: "Naphtha", formula: "C₅–C₁₀ mix", note: "Liquid feed — broad product slate; not one molecule." }
        ],
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

    /* ===== STAGE 7 — the EO split: two product boxes, EOP & EG ===== */
    {
      id: "eop", stage: "7", cat: "distribution", glyph: "manifold", art: "manifold",
      title: "EOP — ethylene-oxide product", sub: "High-purity EO piped to the derivative units",
      x: 2400, y: 415, w: 230, h: 132,
      brief: {
        purpose: "Keep part of the purified EO as EOP — the high-purity ethylene-oxide product that feeds the derivative units.",
        para: "Most of the purified EO is kept as EOP: high-purity ethylene-oxide product. Because EO is hazardous and volatile, EOP never travels by road or sea as EO — it moves only by dedicated pipeline to the derivative units on the same integrated site: ethanolamines, ethoxylates, PEG, glycol ethers and polyether polyols.",
        inputs: [{ label: "Purified EO", type: "product" }],
        outputs: [
          { label: "EOP → ethanolamines", type: "product" },
          { label: "EOP → ethoxylates", type: "product" },
          { label: "EOP → PEG", type: "product" },
          { label: "EOP → glycol ethers", type: "product" },
          { label: "EOP → polyether polyols", type: "product" },
          { label: "EOP by dedicated pipeline", type: "product" }
        ],
        equipment: ["Distribution header", "Branch valves", "EOP pipeline connection"],
        conditions: [
          { k: "EOP", v: "EO kept as product" },
          { k: "Destinations", v: "Five derivative units" },
          { k: "EO transport", v: "Dedicated pipeline only" }
        ],
        condNote: PUB,
        molecules: ["eo"],
        sources: SRC_COMMON,
        disclaimers: ["Conceptual EO distribution — not plant piping configuration.", "Branch valves and lines are graphical detail only."]
      }
    },
    {
      id: "eg", stage: "7", cat: "distribution", glyph: "glycol", art: "glycol",
      title: "EG — ethylene glycol", sub: "EO routed to the Shell OMEGA glycol unit",
      x: 2400, y: 232, w: 230, h: 120,
      brief: {
        purpose: "Route the rest of the purified EO to EG — ethylene glycol — made in the Shell OMEGA unit.",
        para: "The other half of the split becomes EG: ethylene glycol. The EO earmarked for glycol is sent to the Shell OMEGA unit, where it reacts with CO₂ and water to give mono-ethylene glycol (MEG) — the single biggest EO derivative, used for PET bottles, polyester fibre, film and coolant.",
        inputs: [{ label: "Purified EO", type: "product" }],
        outputs: [{ label: "EO → OMEGA glycol unit", type: "product" }, { label: "→ MEG (EG) product", type: "product" }],
        equipment: ["Glycol-unit feed line", "Branch valve"],
        conditions: [
          { k: "EG", v: "EO → ethylene glycol" },
          { k: "Route", v: "Shell OMEGA" },
          { k: "Main product", v: "MEG" }
        ],
        condNote: PUB,
        molecules: ["eo", "meg"],
        sources: SRC_COMMON,
        disclaimers: ["Conceptual EO distribution — not plant piping configuration."]
      }
    },

    /* ===== STAGE 8B — Shell OMEGA route ===== */
    {
      id: "omega", stage: "8", cat: "product", glyph: "omega", art: "omega",
      title: "Ethylene glycol", sub: "The biggest EO product — PET, polyester, coolant", grades: ["MEG", "DEG", "TEG"],
      x: 2770, y: 200, w: 240, h: 150,
      brief: {
        purpose: "Turn EO into ethylene glycol (EG / MEG) using the Shell OMEGA technology — the glycol route on this map.",
        para: "OMEGA (Only MEG Advantaged) makes glycol in two steps instead of hydrating EO with a big excess of water. First, EO reacts with CO₂ in the ethylene-carbonate (EC) reactor over a catalyst to form ethylene carbonate. Then that carbonate is hydrolysed with water in a second reactor to give MEG, releasing the CO₂ again. The freed CO₂ is captured, compressed and recycled back to the EC reactor — the prominent amber loop. Because the carbonate step is so selective, OMEGA makes almost pure MEG with very little DEG/TEG, and it needs far less water and evaporation energy than conventional hydration.",
        para2: "The OMEGA 'machine', step by step: EC reactor (EO + CO₂ → carbonate) → hydrolysis reactor (carbonate + water → MEG + CO₂) → CO₂ separator → CO₂ recycle compressor → MEG purification. Click through the illustration to see how the pieces connect.",
        inputs: [{ label: "EO feed (EOP)", type: "product" }, { label: "CO₂ feed", type: "recycle" }, { label: "Water", type: "water" }],
        outputs: [{ label: "MEG (EG) product", type: "product" }, { label: "CO₂ recycle", type: "recycle" }],
        equipment: ["Ethylene-carbonate (EC) reactor", "Catalyst", "Hydrolysis reactor", "CO₂ separator", "CO₂ recycle compressor", "MEG purification"],
        reactions: [
          { kind: "", label: "Step 1 — carbonate formation", eq: "EO + CO₂  →  Ethylene carbonate", mols: ["eo", "co2", "ethylene_carbonate"] },
          { kind: "", label: "Step 2 — hydrolysis to MEG", eq: "Ethylene carbonate + H₂O  →  MEG + CO₂", mols: ["ethylene_carbonate", "water", "meg", "co2"] }
        ],
        conditions: [
          { k: "Route", v: "Carbonate intermediate" },
          { k: "CO₂", v: "Recycled in a loop" },
          { k: "Selectivity", v: "Very high to MEG" },
          { k: "vs hydration", v: "Less water & energy" }
        ],
        condNote: PUB,
        molecules: ["eo", "co2", "ethylene_carbonate", "water", "meg"],
        products: [{ name: "MEG (EG)", mol: "meg", apps: ["petbottle", "fiber", "film", "coolant", "antifreeze"] }],
        applications: ["petbottle", "fiber", "antifreeze", "film", "coolant"],
        sources: SRC_COMMON.concat(["Public descriptions of the Shell OMEGA process"]),
        disclaimers: ["Shell OMEGA technology is described from public sources only.", "Equipment sequence is representative; figures are public illustrative values."]
      }
    },

    /* ===== STAGE 9 — ethanolamines ===== */
    {
      id: "amines", stage: "9", cat: "product", glyph: "amines", art: "amines",
      title: "Ethanolamines", sub: "Gas treating, detergents, personal care", grades: ["MEA", "DEA", "TEA"],
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
      id: "ethoxylation", stage: "10", cat: "product", glyph: "ethoxylation", art: "ethoxylation",
      title: "Ethoxylates", sub: "Non-ionic surfactants — detergents & cleaners", grades: ["AE", "APE", "FMEE"],
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
      id: "peg", stage: "10", cat: "product", glyph: "ethoxylation", art: "peg",
      title: "Polyethylene glycol", sub: "Cosmetics, pharma, lubricants", grades: ["PEG-400", "PEG-4000", "PEG-8000"],
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
      id: "glycolethers", stage: "10", cat: "product", glyph: "glycol", art: "glycolethers",
      title: "Glycol ethers", sub: "Coalescing solvents — coatings & inks", grades: ["EGBE", "PGME", "DEGBE"],
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
      id: "polyols", stage: "10", cat: "product", glyph: "ethoxylation", art: "polyols",
      title: "Polyether polyols", sub: "Feed to polyurethane foams & elastomers", grades: ["Flexible", "Rigid", "PPG"],
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
    },

    /* ===== MARKET & TRADE ===== */
    {
      id: "trade", stage: "$", cat: "commercial", glyph: "trade", art: "trade",
      title: "Market & trade desk", sub: "Spot vs contract · netback · Incoterms 2020",
      x: 4020, y: 540, w: 300, h: 230,
      brief: {
        purpose: "Sell the finished products — the commercial end of the value chain, where volumes are priced against global benchmarks and shipped under standard trade terms.",
        para: "Once product leaves storage it enters the market. Commodity chemicals are sold two ways — steady term contracts and one-off spot cargoes — and the trade desk judges every cargo against published benchmarks like “MEG CFR China”. The tools below are interactive: work the netback calculator, and tap the Incoterms journey to see exactly where risk and freight change hands.",
        inputs: [
          { label: "MEG / DEG / TEG for sale", type: "product" },
          { label: "Amines & other derivatives", type: "product" }
        ],
        outputs: [
          { label: "Contract (term) sales", type: "product" },
          { label: "Spot cargoes", type: "product" }
        ],
        equipment: ["Benchmark assessments (ICIS, Platts)", "Futures (Dalian Commodity Exchange)", "Netback analysis", "Incoterms 2020 trade terms", "Ocean-freight booking", "Letters of credit"],
        conditions: [
          { k: "Contract", v: "Formula vs benchmark" },
          { k: "Spot", v: "Today's market level" },
          { k: "Asian MEG benchmark", v: "MEG CFR China" }
        ],
        condNote: "Public illustrative market mechanics — not real prices or terms",
        sources: SRC_COMMON.concat(["Publicly published price-benchmark methodology", "Incoterms® 2020 (ICC) public summaries"]),
        disclaimers: [
          "All figures in the calculator are illustrative placeholders — not real prices, margins, customers or contract terms.",
          "Incoterms® 2020 summaries are for learning only, not legal advice."
        ],
        // --- interactive trade module ---
        trade: {
          intro: "Commodity chemicals are sold two ways, and the market desk lives in the gap between them.",
          contract: "Steady volumes agreed for months or a year; price is usually a formula linked to published benchmarks. Buys certainty for both sides.",
          spot: "One cargo, priced at today's market level. Flexibility, arbitrage and inventory moves live here.",
          benchmark: "Asian MEG spot trades against the “MEG CFR China” assessments published by price agencies (ICIS, Platts), and MEG futures trade on China's Dalian Commodity Exchange — so a Thai producer judges every cargo against what China is paying.",
          foreshadow: "CFR is an Incoterm — decoded in the journey below.",
          netback: {
            cfr: { label: "CFR China spot price", min: 400, max: 800, def: 520, unit: "$/t" },
            freight: { label: "Ocean freight (Thailand → China)", min: 10, max: 60, def: 30, unit: "$/t" },
            other: { label: "Other costs (port, surveyor, finance)", min: 0, max: 30, def: 10, unit: "$/t" },
            contract: { label: "Contract alternative price", min: 400, max: 800, def: 500, unit: "$/t" }
          },
          stations: [["Seller's", "plant"], ["Load", "port"], ["On", "board"], ["Discharge", "port"], ["Buyer's", "door"]],
          incoterms: [
            { code: "EXW", name: "Ex Works", risk: 0, sellerFreightTo: 0, insurance: "Buyer's choice", note: "Buyer collects at the plant gate. Seller's easiest term, buyer's heaviest." },
            { code: "FCA", name: "Free Carrier", risk: 1, sellerFreightTo: 1, insurance: "Buyer's choice", note: "Seller hands the cargo to the buyer's carrier at a named point." },
            { code: "FOB", name: "Free On Board", risk: 2, sellerFreightTo: 2, insurance: "Buyer's choice", note: "Risk passes when the cargo is on board at the load port. Buyer books the ship. Sea only." },
            { code: "CFR", name: "Cost & Freight", risk: 2, sellerFreightTo: 3, insurance: "Buyer's choice", note: "Seller pays the ship to the discharge port — but risk STILL passes on board at loading. Sea only." },
            { code: "CIF", name: "Cost, Insurance & Freight", risk: 2, sellerFreightTo: 3, insurance: "Seller (mandatory)", note: "CFR plus seller-bought insurance for the voyage. Sea only." },
            { code: "DAP", name: "Delivered At Place", risk: 4, sellerFreightTo: 4, insurance: "Seller (usually)", note: "Seller delivers to the named destination, ready for unloading." },
            { code: "DDP", name: "Delivered Duty Paid", risk: 4, sellerFreightTo: 4, insurance: "Seller (usually)", note: "Maximum seller obligation — even import duty is the seller's problem." }
          ],
          defaultTerm: "CFR",
          callout: "The classic bulk-chemical trio is FOB / CFR / CIF. The split-point insight: in CFR and CIF the seller pays the freight, but the buyer already carries the risk from the moment the cargo crosses the ship's rail.",
          closeLoop: "So “MEG CFR China” reads as: price includes product + freight to a Chinese port, with risk transferring on board in Thailand."
        }
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
    // ---- purified EO splits into two boxes: EG (glycol) and EOP (product) ----
    { from: "eorecovery", to: "eg", fs: "r", ts: "l", type: "product", label: "Purified EO → EG" },
    { from: "eorecovery", to: "eop", fs: "r", ts: "l", type: "product", label: "Purified EO → EOP" },
    // ---- EG box → OMEGA glycol unit ----
    { from: "eg", to: "omega", fs: "r", ts: "l", type: "product", label: "EO → EG (glycol)" },
    // ---- EOP box → the five derivative units ----
    { from: "eop", to: "amines", fs: "r", ts: "l", type: "product", label: "EOP to amines" },
    { from: "eop", to: "ethoxylation", fs: "r", ts: "l", type: "product", label: "EOP to ethoxylates" },
    { from: "eop", to: "peg", fs: "r", ts: "l", type: "product", label: "EOP to PEG" },
    { from: "eop", to: "glycolethers", fs: "r", ts: "l", type: "product", label: "EOP to glycol ethers" },
    { from: "eop", to: "polyols", fs: "r", ts: "l", type: "product", label: "EOP to polyols" },
    // ---- recycle: EO recovery gas back to reactor (prominent) ----
    { from: "eorecovery", to: "eoreactor", fs: "t", ts: "t", type: "recycle", label: "Reactor recycle gas", side: true, arc: 120 },
    // ---- ethane recycle: cryo back to furnace ----
    { from: "cryo", to: "furnace", fs: "b", ts: "b", type: "recycle", label: "Ethane recycle", side: true, arc: 150 },
    // ---- products → storage/delivery (spread along the tall dispatch column) ----
    { from: "omega", to: "storage", fs: "r", ts: "l", toff: 0.03, type: "product", label: "MEG (EG)" },
    { from: "amines", to: "storage", fs: "r", ts: "l", toff: 0.31, type: "product", label: "MEA / DEA / TEA" },
    { from: "ethoxylation", to: "storage", fs: "r", ts: "l", toff: 0.47, type: "product", label: "Ethoxylates" },
    { from: "peg", to: "storage", fs: "r", ts: "l", toff: 0.62, type: "product", label: "PEG" },
    { from: "glycolethers", to: "storage", fs: "r", ts: "l", toff: 0.80, type: "product", label: "Glycol ethers" },
    { from: "polyols", to: "storage", fs: "r", ts: "l", toff: 0.95, type: "product", label: "Polyols" },
    // ---- EO dedicated pipeline (EOP → storage, pipeline only) ----
    { from: "eop", to: "storage", fs: "b", ts: "l", toff: 0.0, type: "product", label: "EO by dedicated pipeline", side: true, dash: true, arc: 200 },
    // ---- storage → market/trade ----
    { from: "storage", to: "trade", fs: "r", ts: "l", type: "product", label: "Product to market" }
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
    { node: "treatment", side: "t", dir: "out", type: "recycle", label: "Acid gas / CO₂" }
  ];

  /* ---------------------------------------------------------------
     LAYERS · LEGEND · MODES
     --------------------------------------------------------------- */
  var LAYERS = [
    { id: "mainflow", label: "Main flow", on: true, kind: "info", swatch: "hydrocarbon", locked: true },
    { id: "allstreams", label: "All streams", on: true, kind: "streams" },
    { id: "recycle", label: "Recycle streams", on: true, kind: "stream", swatch: "recycle" },
    { id: "enduses", label: "End uses", on: false, kind: "product" },
    { id: "delivery", label: "Delivery routes", on: false, kind: "logistics" }
  ];

  var LEGEND = [
    { css: "hydrocarbon", label: "Hydrocarbon & ethylene", solid: true },
    { css: "product", label: "EO & derivative products", solid: true },
    { css: "recycle", label: "Recycle / purge / side", dash: true },
    { css: "hazard", label: "Hazard / combustion", dash: true }
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
     QUIZ — used by the Learn/Academy view (pass mark computed from length)
     --------------------------------------------------------------- */
  var QUIZ = [
    { q: "Steam cracking of ethane mainly produces…", opts: ["A single pure gas", "Ethylene plus other light molecules", "Only methane", "Liquid naphtha"], a: 1, why: "Cracking makes a mixture — ethylene, propylene, methane, hydrogen and more — separated downstream." },
    { q: "Why is dilution steam added in a cracking furnace?", opts: ["To add water to the product", "To lower hydrocarbon partial pressure and limit coke", "To cool the burners", "To raise the pressure"], a: 1, why: "Steam lowers the hydrocarbon partial pressure and slows coke formation on the coils." },
    { q: "Ethylene oxide is made by reacting ethylene with…", opts: ["Hydrogen", "Oxygen over a silver catalyst", "Chlorine", "Nitrogen"], a: 1, why: "EO is the partial oxidation of ethylene over a silver catalyst: C₂H₄ + ½O₂ → C₂H₄O." },
    { q: "The main UNWANTED reaction in the EO reactor gives…", opts: ["More ethylene", "Carbon dioxide and water", "Pure oxygen", "Methanol"], a: 1, why: "Complete combustion, C₂H₄ + 3O₂ → 2CO₂ + 2H₂O, competes with the desired partial oxidation." },
    { q: "Which catalyst is used to make EO?", opts: ["Platinum", "Silver-based", "Nickel", "Iron"], a: 1, why: "EO is made over a silver-based catalyst, tuned with a trace chloride moderator." },
    { q: "The Shell OMEGA route makes EG (MEG) via an intermediate called…", opts: ["Ethylene carbonate", "Acetylene", "Methanol", "Vinyl chloride"], a: 0, why: "OMEGA first reacts EO with CO₂ to ethylene carbonate, then hydrolyses it to MEG." },
    { q: "In the OMEGA route, CO₂ is…", opts: ["Vented", "Used and recycled in a loop", "Turned into fuel", "Not involved"], a: 1, why: "CO₂ makes the carbonate and is released again on hydrolysis, so it is captured and recycled." },
    { q: "Purified EO splits into two destinations —", opts: ["EOP and EG", "Water and steam", "Methane and hydrogen", "MEA and DEA"], a: 0, why: "EOP (EO product for derivatives) and EG (ethylene glycol via OMEGA)." },
    { q: "Ethanolamines (MEA/DEA/TEA) come from EO reacting with…", opts: ["Ammonia", "Water", "Chlorine", "Methane"], a: 0, why: "EO adds hydroxyethyl arms onto ammonia; the EO:NH₃ ratio sets the MEA/DEA/TEA split." },
    { q: "Because EO is hazardous, it is normally moved by…", opts: ["Road drum", "Dedicated pipeline", "Flexibag", "Air freight"], a: 1, why: "EO is shipped by dedicated pipeline, not the general modes used for the liquid glycols." },
    { q: "The biggest end use of MEG (EG) is…", opts: ["Antifreeze only", "PET / polyester", "Explosives", "Fertiliser"], a: 1, why: "Most MEG goes into PET resin and polyester fibre; coolant/antifreeze is a smaller use." },
    { q: "High-purity ethylene for the EO unit comes from the…", opts: ["Quench tower", "Ethylene splitter", "Feed drum", "Flare"], a: 1, why: "The cryogenic ethylene splitter separates ethylene from ethane to reach EO-grade purity." },
    { q: "Ethoxylates (detergent surfactants) are amphiphiles because they have…", opts: ["Only an oily tail", "An oily tail plus a water-loving EO chain", "Only a water-loving head", "No structure"], a: 1, why: "Adding EO onto a fatty alcohol builds a hydrophilic chain on an oily tail — the surfactant shape." },
    { q: "In a CFR sale, risk transfers to the buyer…", opts: ["At the discharge port", "When goods are on board at the load port", "At the seller's gate", "After payment clears"], a: 1, why: "C-terms split cost and risk: the seller pays freight to destination, but risk passes on board at loading — same point as FOB." },
    { q: "The benchmark 'MEG CFR China' includes…", opts: ["Product + ocean freight to China", "Product only", "Product + freight + import duty", "Insurance only"], a: 0, why: "CFR = cost and freight. Seller pays the ship; duty and onward costs are the buyer's." },
    { q: "Under FOB Thailand, who books and pays the ocean freight?", opts: ["The buyer", "The seller", "The port authority", "Split 50/50"], a: 0, why: "Free On Board: the seller's job ends when the cargo is safely on the vessel the buyer chartered." },
    { q: "A spot sale is…", opts: ["A single cargo priced at today's market level", "A five-year fixed contract", "A free sample program", "An internal transfer"], a: 0, why: "Spot = one-off deals priced off current benchmarks; term contracts run on formulas linked to those benchmarks." },
    { q: "The 'olefins' unit on the map covers…", opts: ["Cracking through cryogenic separation (making ethylene)", "Only the EO reactor", "Glycol production", "Storage and delivery"], a: 0, why: "The olefins/ethylene unit takes feed through cracking, quench, treatment and cryogenic separation to high-purity ethylene." }
  ];

  /* ---------------------------------------------------------------
     Ordered stage list for the left-rail nav
     --------------------------------------------------------------- */
  var STAGE_ORDER = ["feedstocks", "furnace", "quench", "treatment", "cryo", "eoreactor", "eorecovery", "eop", "eg", "omega", "amines", "ethoxylation", "peg", "glycolethers", "polyols", "storage", "trade"];

  /* ---------------------------------------------------------------
     GROUPS — dashed bounding boxes drawn around a set of nodes
     --------------------------------------------------------------- */
  var GROUPS = [
    { id: "olefin", label: "OLEFINS · ethylene unit", nodes: ["furnace", "quench", "treatment", "cryo"], color: "#5aa0ff" }
  ];

  /* ---------------------------------------------------------------
     ANNOTATIONS — persistent labels tied to a node anchor
     (not affected by the stream-label layer)
     --------------------------------------------------------------- */
  var ANNOTATIONS = [
    // EOP and EG are now their own boxes (nodes) — no floating labels needed.
  ];

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
    groups: GROUPS,
    annotations: ANNOTATIONS,
    layers: LAYERS,
    legend: LEGEND,
    modes: MODES,
    streamTypes: STREAM_TYPES,
    delivery: DELIVERY,
    disclaimers: DISCLAIMERS,
    sourceCategories: SOURCE_CATEGORIES,
    quiz: QUIZ,
    stageOrder: STAGE_ORDER,
    node: function (id) { return byId[id]; }
  };
})(window.EO = window.EO || {});
