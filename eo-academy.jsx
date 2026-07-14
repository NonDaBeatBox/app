import React, { useState, useMemo } from "react";
import {
  Workflow, Flame, FlaskConical, Droplets, Truck, Coins, GraduationCap,
  Factory, Ship, ArrowRight, RotateCcw, Check, X,
} from "lucide-react";

/* ============================================================
   EO Academy — a single-file teaching app for new petrochemical
   interns, walking the ethylene-oxide value chain from feedstock
   to market. Public, textbook information only. All figures are
   illustrative placeholders — never real plant/commercial data.
   ============================================================ */

/* ---- design system ---- */
const C = {
  ink: "#26313f",     // pencil/ink for line-art + body text
  paper: "#f6f2e8",   // warm engineering-pad paper
  grid: "#e4ddca",    // faint pad grid
  line: "#2f6fe0",    // "line blue" accent
  petrol: "#0f8a80",  // petrol / teal accent
  amber: "#c6871f",   // amber accent
  soft: "#e7e0cf",    // card hairline
  muted: "#7b8797",   // secondary text
};

/* ---- Incoterms 2020 data (risk = station index where risk transfers,
        sellerFreightTo = station index seller pays freight to) ---- */
const INCOTERMS = [
  { code: "EXW", name: "Ex Works", risk: 0, sellerFreightTo: 0, insurance: "Buyer's choice",
    note: "Buyer collects at the plant gate. Seller's easiest term, buyer's heaviest." },
  { code: "FCA", name: "Free Carrier", risk: 1, sellerFreightTo: 1, insurance: "Buyer's choice",
    note: "Seller hands the cargo to the buyer's carrier at a named point." },
  { code: "FOB", name: "Free On Board", risk: 2, sellerFreightTo: 2, insurance: "Buyer's choice",
    note: "Risk passes when the cargo is on board at the load port. Buyer books the ship. Sea only." },
  { code: "CFR", name: "Cost & Freight", risk: 2, sellerFreightTo: 3, insurance: "Buyer's choice",
    note: "Seller pays the ship to the discharge port — but risk STILL passes on board at loading. Sea only." },
  { code: "CIF", name: "Cost, Insurance & Freight", risk: 2, sellerFreightTo: 3, insurance: "Seller (mandatory)",
    note: "CFR plus seller-bought insurance for the voyage. Sea only." },
  { code: "DAP", name: "Delivered At Place", risk: 4, sellerFreightTo: 4, insurance: "Seller (usually)",
    note: "Seller delivers to the named destination, ready for unloading." },
  { code: "DDP", name: "Delivered Duty Paid", risk: 4, sellerFreightTo: 4, insurance: "Seller (usually)",
    note: "Maximum seller obligation — even import duty is the seller's problem." },
];

const STATIONS = [
  ["Seller's", "plant"], ["Load", "port"], ["On", "board"], ["Discharge", "port"], ["Buyer's", "door"],
];

/* ---- quiz bank (Trade appends four more below) ---- */
const QUIZ = [
  { q: "Steam cracking of ethane mainly produces…", opts: ["A single pure gas", "Ethylene plus other light molecules", "Only methane", "Liquid naphtha"], a: 1,
    why: "Cracking makes a mixture — ethylene, propylene, methane, hydrogen and more — which is separated downstream." },
  { q: "Why is dilution steam added in a cracking furnace?", opts: ["To add water to the product", "To lower hydrocarbon partial pressure and limit coke", "To cool the burners", "To raise the pressure"], a: 1,
    why: "Steam lowers the hydrocarbon partial pressure and slows coke formation on the coils." },
  { q: "Ethylene oxide is made by reacting ethylene with…", opts: ["Hydrogen", "Oxygen over a silver catalyst", "Chlorine", "Nitrogen"], a: 1,
    why: "EO is the partial oxidation of ethylene over a silver catalyst: C₂H₄ + ½O₂ → C₂H₄O." },
  { q: "The main UNWANTED reaction in the EO reactor gives…", opts: ["More ethylene", "Carbon dioxide and water", "Pure oxygen", "Methanol"], a: 1,
    why: "Complete combustion, C₂H₄ + 3O₂ → 2CO₂ + 2H₂O, competes with the desired partial oxidation." },
  { q: "Which catalyst is used to make EO?", opts: ["Platinum", "Silver-based", "Nickel", "Iron"], a: 1,
    why: "EO is made over a silver-based catalyst, tuned with a trace chloride moderator." },
  { q: "A large excess of water in glycol hydration favours…", opts: ["TEG", "DEG", "MEG", "Ethylene carbonate"], a: 2,
    why: "Keeping EO dilute (≈20:1 water:EO) means EO mostly meets water, so MEG dominates over DEG/TEG." },
  { q: "The biggest end use of MEG is…", opts: ["Antifreeze only", "PET / polyester", "Explosives", "Fertiliser"], a: 1,
    why: "Most MEG goes into PET resin and polyester fibre; coolant/antifreeze is a smaller use." },
  { q: "The Shell OMEGA route makes MEG via an intermediate called…", opts: ["Ethylene carbonate", "Acetylene", "Methanol", "Vinyl chloride"], a: 0,
    why: "OMEGA first reacts EO with CO₂ to ethylene carbonate, then hydrolyses it to MEG." },
  { q: "In the OMEGA route, CO₂ is…", opts: ["Vented", "Used and recycled in a loop", "Turned into fuel", "Not involved"], a: 1,
    why: "CO₂ makes the carbonate and is released again on hydrolysis, so it is captured and recycled." },
  { q: "Ethanolamines (MEA/DEA/TEA) come from EO reacting with…", opts: ["Ammonia", "Water", "Chlorine", "Methane"], a: 0,
    why: "EO adds hydroxyethyl arms onto ammonia; the EO:NH₃ ratio sets the MEA/DEA/TEA split." },
  { q: "Because EO is hazardous, it is normally moved by…", opts: ["Road drum", "Dedicated pipeline", "Flexibag", "Air freight"], a: 1,
    why: "EO is shipped by dedicated pipeline, not the general modes used for the liquid glycols." },
  { q: "TEG is widely used to…", opts: ["Sweeten food", "Dehydrate natural gas", "Bleach paper", "Harden steel"], a: 1,
    why: "Triethylene glycol absorbs water, making it a common natural-gas dehydration solvent." },
  { q: "High-purity ethylene for the EO unit comes from the…", opts: ["Quench tower", "Ethylene splitter", "Feed drum", "Flare"], a: 1,
    why: "The cryogenic ethylene splitter separates ethylene from ethane to reach polymer/EO-grade purity." },
  { q: "Ethoxylates (detergent surfactants) are amphiphiles because they have…", opts: ["Only an oily tail", "An oily tail plus a water-loving EO chain", "Only a water-loving head", "No structure"], a: 1,
    why: "Adding EO onto a fatty alcohol builds a hydrophilic chain on an oily tail — the surfactant shape." },
  // --- Trade tab ---
  { q: "In a CFR sale, risk transfers to the buyer…", opts: ["At the discharge port", "When goods are on board at the load port", "At the seller's gate", "After payment clears"], a: 1,
    why: "C-terms split cost and risk: the seller pays freight to destination, but risk passes on board at loading — the same point as FOB." },
  { q: "The benchmark 'MEG CFR China' includes…", opts: ["Product + ocean freight to China", "Product only", "Product + freight + import duty", "Insurance only"], a: 0,
    why: "CFR = cost and freight. Seller pays the ship; duty and onward costs are the buyer's." },
  { q: "Under FOB Thailand, who books and pays the ocean freight?", opts: ["The buyer", "The seller", "The port authority", "Split 50/50"], a: 0,
    why: "Free On Board: the seller's job ends when the cargo is safely on the vessel the buyer chartered." },
  { q: "A spot sale is…", opts: ["A single cargo priced at today's market level", "A five-year fixed contract", "A free sample program", "An internal transfer"], a: 0,
    why: "Spot = one-off deals priced off current benchmarks; term contracts run on formulas linked to those same benchmarks." },
];

/* ============================================================
   small shared UI
   ============================================================ */
function Tag({ children, color }) {
  return <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: color || C.muted }}>{children}</span>;
}

function Card({ children, accent, className = "", pad = true }) {
  return (
    <div className={"rounded-xl " + className}
      style={{ background: "#fff", border: `1px solid ${C.soft}`, borderLeft: accent ? `4px solid ${accent}` : `1px solid ${C.soft}`, padding: pad ? 16 : 0, boxShadow: "0 1px 0 rgba(38,49,63,.03)" }}>
      {children}
    </div>
  );
}

function SectionHead({ n, title, sub }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        {n != null && <span className="mono" style={{ fontSize: 11, color: C.petrol, letterSpacing: "0.1em" }}>0{n}</span>}
        <h3 style={{ fontSize: 17, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>{title}</h3>
      </div>
      {sub && <p style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{sub}</p>}
    </div>
  );
}

/* LabCard slider primitive — reused by the reactor lab and the Trade netback */
function Slider({ label, min, max, step = 1, value, onChange, unit, accent = C.petrol }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="flex justify-between items-baseline" style={{ marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: C.ink }}>{label}</span>
        <span className="mono" style={{ fontSize: 12.5, color: accent }}>{value}{unit ? " " + unit : ""}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: accent, height: 4 }} />
    </div>
  );
}

function LabCard({ title, tag, children }) {
  return (
    <Card>
      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <div className="flex items-center gap-2">
          <FlaskConical size={15} color={C.petrol} />
          <span style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{title}</span>
        </div>
        {tag && <Tag color={C.petrol}>{tag}</Tag>}
      </div>
      {children}
    </Card>
  );
}

/* simple comparison / data table (OMEGA rows + Incoterms table share this look) */
function DataTable({ cols, rows, headAccent = C.ink }) {
  return (
    <div style={{ overflowX: "auto", border: `1px solid ${C.soft}`, borderRadius: 10 }}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 340, fontSize: 12 }}>
        <thead>
          <tr>
            {cols.map((c, i) => (
              <th key={i} className="mono" style={{ textAlign: i === 0 ? "left" : "left", padding: "8px 10px", background: "#faf7ef", color: headAccent, borderBottom: `1px solid ${C.soft}`, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} style={{ background: ri % 2 ? "#fbf9f3" : "#fff" }}>
              {r.map((cell, ci) => (
                <td key={ci} style={{ padding: "8px 10px", color: ci === 0 ? C.ink : C.muted, fontWeight: ci === 0 ? 600 : 400, borderBottom: ri === rows.length - 1 ? "none" : `1px solid ${C.soft}`, borderRight: ci === r.length - 1 ? "none" : `1px solid ${C.soft}`, whiteSpace: "nowrap" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* pencil-pad line-art building blocks (stroke ink) */
const strokeProps = { fill: "none", stroke: C.ink, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
function ChainGlyph({ kind, x, y }) {
  const g = (children) => <g transform={`translate(${x},${y})`}>{children}</g>;
  if (kind === "feed") return g(<>
    <rect x={-14} y={-12} width={28} height={24} rx={2} {...strokeProps} />
    <path d="M-14 -2 h28 M-6 -12 v24 M4 -12 v24" {...strokeProps} />
  </>);
  if (kind === "crack") return g(<>
    <rect x={-13} y={-14} width={26} height={28} rx={2} {...strokeProps} />
    <path d="M-8 8 q4 -8 0 -14 q4 6 8 -2 q2 8 -2 16" stroke={C.amber} fill="none" strokeWidth={1.6} strokeLinecap="round" />
  </>);
  if (kind === "eo") return g(<>
    <circle cx={0} cy={0} r={14} {...strokeProps} />
    <path d="M-6 5 L0 -7 L6 5 Z" {...strokeProps} />
  </>);
  if (kind === "glycol") return g(<>
    <rect x={-13} y={-13} width={26} height={26} rx={2} {...strokeProps} />
    <path d="M0 -13 v26 M-13 0 h26" stroke={C.petrol} strokeWidth={1.4} fill="none" />
  </>);
  if (kind === "market") return g(<>
    <path d="M-13 6 v-14 l13 -8 l13 8 v14 z" {...strokeProps} />
    <path d="M-13 -6 h26" {...strokeProps} />
  </>);
  return null;
}

/* ============================================================
   TAB: The Chain (intro)
   ============================================================ */
function Intro() {
  const nodes = [
    { k: "feed", t: ["Feedstock"] }, { k: "crack", t: ["Cracker"] }, { k: "eo", t: ["EO"] },
    { k: "glycol", t: ["Glycols"] }, { k: "market", t: ["Market"] },
  ];
  const xs = [40, 108, 176, 244, 312];
  return (
    <div className="space-y-4">
      <SectionHead title="The ethylene-oxide value chain" sub="One molecule, a long journey — from a gas feed to the products in your day, and finally to a price on a trading screen." />
      <Card>
        <svg viewBox="0 0 352 96" width="100%" style={{ maxWidth: 620 }}>
          <line x1={26} y1={42} x2={326} y2={42} {...strokeProps} strokeDasharray="1 6" />
          {nodes.map((n, i) => <ChainGlyph key={i} kind={n.k} x={xs[i]} y={42} />)}
          {nodes.map((n, i) => (
            <text key={i} x={xs[i]} y={80} textAnchor="middle" className="mono" style={{ fontSize: 8.5, fill: C.ink, letterSpacing: "0.06em", textTransform: "uppercase" }}>{n.t[0]}</text>
          ))}
        </svg>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card accent={C.line}><Tag color={C.line}>Make it</Tag><p style={{ fontSize: 13, color: C.ink, marginTop: 6, lineHeight: 1.5 }}>Crack a hydrocarbon feed to ethylene, then partially oxidise it over silver to ethylene oxide.</p></Card>
        <Card accent={C.petrol}><Tag color={C.petrol}>Use it</Tag><p style={{ fontSize: 13, color: C.ink, marginTop: 6, lineHeight: 1.5 }}>EO becomes glycols, ethanolamines, ethoxylates and polyols — bottles, fibre, coolant, detergents, foam.</p></Card>
        <Card accent={C.amber}><Tag color={C.amber}>Sell it</Tag><p style={{ fontSize: 13, color: C.ink, marginTop: 6, lineHeight: 1.5 }}>The finished products are commodities, priced against global benchmarks and shipped under standard trade terms.</p></Card>
      </div>
    </div>
  );
}

/* ============================================================
   TAB: Cracking
   ============================================================ */
function Cracking() {
  return (
    <div className="space-y-4">
      <SectionHead title="Feedstock & steam cracking" sub="Turning a hydrocarbon feed into the ethylene the whole chain depends on." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card accent={C.line}>
          <Tag color={C.line}>Feed in</Tag>
          <p style={{ fontSize: 13, color: C.ink, marginTop: 6, lineHeight: 1.55 }}>Light gases (ethane, propane, LPG, NGL) or liquid naphtha are heated with <b>dilution steam</b> and fed to a fired furnace. Lighter feeds give more ethylene.</p>
        </Card>
        <Card accent={C.amber}>
          <Tag color={C.amber}>Cracked gas out</Tag>
          <p style={{ fontSize: 13, color: C.ink, marginTop: 6, lineHeight: 1.55 }}>At ~800–875 °C bonds break for a fraction of a second, then the gas is quenched. The result is a <b>mixture</b>: ethylene, propylene, methane, hydrogen and heavier species.</p>
        </Card>
      </div>
      <Card>
        <Tag>Key reaction (illustrative)</Tag>
        <p className="mono" style={{ fontSize: 14, color: C.ink, marginTop: 8 }}>C₂H₆ → C₂H₄ + H₂</p>
        <p style={{ fontSize: 12.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>Ethylene is then purified in a cold separation train; the ethylene splitter delivers the high-purity ethylene used to make EO.</p>
      </Card>
    </div>
  );
}

/* ============================================================
   TAB: EO Reactor (LabCard interactive)
   ============================================================ */
function Reactor() {
  const [temp, setTemp] = useState(245);
  const [oxygen, setOxygen] = useState(7);
  // illustrative selectivity: best near a mid temperature, falls as combustion rises
  const selectivity = useMemo(() => {
    const s = 90 - Math.abs(temp - 245) * 0.32 - Math.max(0, oxygen - 8) * 2.2 - Math.max(0, 6 - oxygen) * 1.5;
    return Math.max(60, Math.min(92, Math.round(s)));
  }, [temp, oxygen]);
  return (
    <div className="space-y-4">
      <SectionHead title="The EO reactor" sub="Ethylene meets oxygen over a silver catalyst — but a rival reaction is always trying to burn it all to CO₂." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card accent={C.petrol}><Tag color={C.petrol}>Desired</Tag><p className="mono" style={{ fontSize: 13.5, color: C.ink, marginTop: 6 }}>C₂H₄ + ½O₂ → C₂H₄O</p><p style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Partial oxidation to ethylene oxide.</p></Card>
        <Card accent={C.amber}><Tag color={C.amber}>Undesired</Tag><p className="mono" style={{ fontSize: 13.5, color: C.ink, marginTop: 6 }}>C₂H₄ + 3O₂ → 2CO₂ + 2H₂O</p><p style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Complete combustion — wasted ethylene.</p></Card>
      </div>
      <LabCard title="Selectivity bench" tag="Illustrative">
        <Slider label="Reactor temperature" min={200} max={300} value={temp} onChange={setTemp} unit="°C" accent={C.petrol} />
        <Slider label="Oxygen in feed" min={3} max={12} value={oxygen} onChange={setOxygen} unit="%" accent={C.petrol} />
        <div style={{ marginTop: 10 }}>
          <div className="flex justify-between items-baseline" style={{ marginBottom: 5 }}>
            <Tag>EO selectivity</Tag>
            <span className="mono" style={{ fontSize: 13, color: C.petrol }}>≈ {selectivity}%</span>
          </div>
          <div style={{ height: 10, background: "#eee7d6", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ width: selectivity + "%", height: "100%", background: C.petrol, transition: "width .12s" }} />
          </div>
          <p style={{ fontSize: 11.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>Push temperature or oxygen too high and combustion wins; too low and the catalyst underperforms. Real plants tune this with a trace ethyl-chloride moderator.</p>
        </div>
        <p className="mono" style={{ fontSize: 10, color: C.muted, marginTop: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Illustrative model — public range, not plant data.</p>
      </LabCard>
    </div>
  );
}

/* ============================================================
   TAB: Glycols (OMEGA comparison rows)
   ============================================================ */
function Glycols() {
  return (
    <div className="space-y-4">
      <SectionHead title="Glycols from EO" sub="Hydrate EO with water to make MEG, DEG and TEG — or take the CO₂-recycling OMEGA short-cut to MEG." />
      <Card>
        <Tag>Conventional hydration (illustrative)</Tag>
        <div className="mono" style={{ fontSize: 13, color: C.ink, marginTop: 8, lineHeight: 1.8 }}>
          EO + H₂O → MEG<br />MEG + EO → DEG<br />DEG + EO → TEG
        </div>
        <p style={{ fontSize: 12.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>A large water excess (≈20:1) keeps EO dilute so MEG dominates. The glycols are then split by boiling point (MEG ≈197 °C, DEG ≈246 °C, TEG ≈287 °C).</p>
      </Card>
      <div>
        <Tag>Conventional vs Shell OMEGA</Tag>
        <div style={{ marginTop: 8 }}>
          <DataTable
            cols={["", "Conventional", "Shell OMEGA"]}
            rows={[
              ["Route", "Direct hydration", "Via ethylene carbonate"],
              ["Water : EO", "≈ 20 : 1", "Near stoichiometric"],
              ["Main product", "MEG (+ DEG, TEG)", "MEG (very selective)"],
              ["CO₂", "—", "Used & recycled"],
              ["Evaporation load", "Higher", "Lower"],
            ]}
          />
        </div>
        <p className="mono" style={{ fontSize: 10, color: C.muted, marginTop: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>Illustrative public technology values — not plant data.</p>
      </div>
    </div>
  );
}

/* ============================================================
   TAB: Delivery
   ============================================================ */
function Delivery() {
  const rows = [
    ["EO", "Dedicated pipeline only", "Hazardous — never general modes"],
    ["MEG / DEG / TEG", "Vessel · truck · ISO · IBC · drum", "Pipeline where the site allows"],
    ["Ethanolamines", "Truck · ISO · IBC · drum", "Vessel/flexibag product-dependent"],
    ["Ethoxylates / PEG", "Truck · ISO · IBC · drum", "By grade"],
  ];
  return (
    <div className="space-y-4">
      <SectionHead title="Storage & delivery" sub="Every product leaves the tank farm by the modes that suit it — and EO is a special case." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card accent={C.line}><div className="flex items-center gap-2"><Truck size={15} color={C.line} /><Tag color={C.line}>Bulk liquids</Tag></div><p style={{ fontSize: 13, color: C.ink, marginTop: 6, lineHeight: 1.5 }}>Glycols and amines move by marine vessel, road tanker, ISO-tank, IBC and drum — from tank farm through loading arms.</p></Card>
        <Card accent={C.amber}><div className="flex items-center gap-2"><Ship size={15} color={C.amber} /><Tag color={C.amber}>EO is different</Tag></div><p style={{ fontSize: 13, color: C.ink, marginTop: 6, lineHeight: 1.5 }}>Because EO is hazardous, it travels only by <b>dedicated pipeline</b> — never the general transport modes.</p></Card>
      </div>
      <DataTable cols={["Product", "Typical modes", "Notes"]} rows={rows} />
      <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>Which mode fits depends on volume, distance and destination — and it sets up a bigger question: <b>on whose account, and at whose risk, does the cargo travel?</b> That is the Trade desk's world.</p>
    </div>
  );
}

/* ============================================================
   TAB: Trade  (Coins)  — spot vs contract · netback · Incoterms
   ============================================================ */
function Trade() {
  return (
    <div className="space-y-6">
      <SectionHead title="Trading the molecule" sub="Commodity chemicals are sold two ways, and the market desk lives in the gap between them." />
      <SpotVsContract />
      <Netback />
      <Incoterms />
    </div>
  );
}

function SpotVsContract() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><Coins size={15} color={C.ink} /><SectionHead n={1} title="Spot vs contract" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card accent={C.line}>
          <Tag color={C.line}>Contract (term)</Tag>
          <p style={{ fontSize: 13, color: C.ink, marginTop: 6, lineHeight: 1.55 }}>Steady volumes agreed for months or a year; price is usually a <b>formula</b> linked to published benchmarks. Buys certainty for both sides.</p>
        </Card>
        <Card accent={C.amber}>
          <Tag color={C.amber}>Spot</Tag>
          <p style={{ fontSize: 13, color: C.ink, marginTop: 6, lineHeight: 1.55 }}>One cargo, priced at today's market level. <b>Flexibility, arbitrage and inventory moves</b> live here.</p>
        </Card>
      </div>
      <Card>
        <Tag color={C.petrol}>Benchmark</Tag>
        <p style={{ fontSize: 13, color: C.ink, marginTop: 6, lineHeight: 1.55 }}>Asian MEG spot trades against the <b>“MEG CFR China”</b> assessments published by price agencies (ICIS, Platts), and MEG futures trade on China's <b>Dalian Commodity Exchange</b> — so a Thai producer judges every cargo against what China is paying.</p>
        <p className="mono" style={{ fontSize: 10.5, color: C.petrol, marginTop: 8, letterSpacing: "0.08em" }}>CFR IS AN INCOTERM — DECODED IN THE NEXT SECTION ↓</p>
      </Card>
    </div>
  );
}

function Netback() {
  const [cfr, setCfr] = useState(520);
  const [freight, setFreight] = useState(30);
  const [other, setOther] = useState(10);
  const [contract, setContract] = useState(500);
  const netback = cfr - freight - other;
  const diff = netback - contract;
  const pct = (v) => Math.max(0, Math.min(100, ((v - 400) / 400) * 100));
  return (
    <div className="space-y-3">
      <SectionHead n={2} title="Netback mini-calculator" sub="What a spot cargo to China is really worth back at the plant gate — versus the contract alternative." />
      <Card>
        <Slider label="CFR China spot price" min={400} max={800} value={cfr} onChange={setCfr} unit="$/t" />
        <Slider label="Ocean freight (Thailand → China)" min={10} max={60} value={freight} onChange={setFreight} unit="$/t" />
        <Slider label="Other costs (port, surveyor, finance)" min={0} max={30} value={other} onChange={setOther} unit="$/t" />
        <Slider label="Contract alternative price" min={400} max={800} value={contract} onChange={setContract} unit="$/t" accent={C.line} />

        <div style={{ marginTop: 14, marginBottom: 6 }}>
          <BarRow label="Spot netback" value={netback} color={C.petrol} pct={pct(netback)} />
          <BarRow label="Contract" value={contract} color={C.line} pct={pct(contract)} />
        </div>

        <div style={{ borderTop: `1px solid ${C.soft}`, paddingTop: 10, marginTop: 8 }}>
          <p style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5 }}>
            Spot nets <b className="mono" style={{ color: C.petrol }}>${netback}/t</b> — {diff >= 0
              ? <>beats contract by <b className="mono" style={{ color: C.petrol }}>${Math.abs(diff)}/t</b>.</>
              : <>loses to contract by <b className="mono" style={{ color: C.amber }}>${Math.abs(diff)}/t</b>.</>}
          </p>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>Freight is the hidden lever: when ships get expensive, spot netbacks sink even if the headline price holds.</p>
        </div>
        <p className="mono" style={{ fontSize: 10, color: C.muted, marginTop: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Illustrative numbers — not real prices.</p>
      </Card>
    </div>
  );
}

function BarRow({ label, value, color, pct }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div className="flex justify-between items-baseline" style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: C.ink }}>{label}</span>
        <span className="mono" style={{ fontSize: 12, color }}>${value}/t</span>
      </div>
      <div style={{ height: 12, background: "#eee7d6", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: pct + "%", height: "100%", background: color, transition: "width .12s" }} />
      </div>
    </div>
  );
}

/* --- Section 3: Incoterms 2020, drawn --- */
const SX = [34, 102, 170, 238, 306];
const BASE = 108;
function TermGlyph({ kind, x }) {
  const p = (d, stroke = C.ink, w = 1.6) => <path d={d} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
  const g = (children) => <g transform={`translate(${x},${BASE})`}>{children}</g>;
  if (kind === "plant") return g(<>
    {p("M-14 0 v-20 h28 v20")}{p("M-14 -8 h28")}{p("M-4 -20 v-6 h6 v6")}
  </>);
  if (kind === "crane") return g(<>
    {p("M-9 0 v-24")}{p("M-9 -24 h20")}{p("M9 -24 v10")}{p("M-13 0 h8")}
  </>);
  if (kind === "ship") return g(<>
    {p("M-15 -4 h30 l-4 8 h-22 z")}{p("M-8 -4 v-9 h13 v9")}{p("M-2 -13 v-4 h6")}
  </>);
  if (kind === "door") return g(<>
    {p("M-10 0 v-22 h20 v22")}{p("M-10 0 h20")}<circle cx={5} cy={-11} r={1.6} fill={C.ink} />
  </>);
  return null;
}

function Incoterms() {
  const [sel, setSel] = useState("CFR");
  const t = INCOTERMS.find((i) => i.code === sel);
  const glyphs = ["plant", "crane", "ship", "crane", "door"];
  const riskX = SX[t.risk];
  const riskAnchor = t.risk === 0 ? "start" : t.risk === 4 ? "end" : "middle";
  const brData = t.sellerFreightTo > 0;
  const brX1 = SX[0] - 12, brX2 = SX[t.sellerFreightTo] + 12;
  const shipBy = t.sellerFreightTo >= 3 ? "Seller" : "Buyer";
  const freightWho = ["Buyer — entire journey", "Buyer — main carriage", "Buyer — ocean freight", "Seller — to discharge port", "Seller — to destination"][t.sellerFreightTo];
  const riskName = ["Seller's plant", "Load port", "On board (load)", "Discharge port", "Buyer's door"][t.risk];

  return (
    <div className="space-y-3">
      <SectionHead n={3} title="Incoterms 2020, drawn" sub="Where does risk pass, and how far does the seller pay the freight? Tap a term to see it on the journey." />

      <Card>
        <svg viewBox="0 0 340 150" width="100%" style={{ maxWidth: 560, display: "block", margin: "0 auto" }}>
          {/* freight bracket (petrol) */}
          {brData && (
            <g>
              <path d={`M${brX1} 40 v-6 h${brX2 - brX1} v6`} fill="none" stroke={C.petrol} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              <text x={(brX1 + brX2) / 2} y={26} textAnchor="middle" className="mono" style={{ fontSize: 8, fill: C.petrol, letterSpacing: "0.08em" }}>SELLER PAYS FREIGHT</text>
            </g>
          )}
          {/* baseline */}
          <line x1={20} y1={BASE} x2={320} y2={BASE} stroke={C.ink} strokeWidth={1.4} strokeDasharray="1 5" strokeLinecap="round" />
          {/* stations + glyphs + labels */}
          {SX.map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={BASE} r={2.4} fill={C.ink} />
              <TermGlyph kind={glyphs[i]} x={x} />
              <text x={x} y={BASE + 16} textAnchor="middle" className="mono" style={{ fontSize: 7.5, fill: C.ink, letterSpacing: "0.04em", textTransform: "uppercase" }}>{STATIONS[i][0]}</text>
              <text x={x} y={BASE + 26} textAnchor="middle" className="mono" style={{ fontSize: 7.5, fill: C.ink, letterSpacing: "0.04em", textTransform: "uppercase" }}>{STATIONS[i][1]}</text>
            </g>
          ))}
          {/* risk flag (amber) */}
          <g>
            <path d={`M${riskX} ${BASE - 30} v-22`} stroke={C.amber} strokeWidth={1.6} strokeLinecap="round" />
            <path d={`M${riskX} ${BASE - 52} l16 5 l-16 5 z`} fill={C.amber} />
            <text x={riskX} y={BASE - 58} textAnchor={riskAnchor} className="mono" style={{ fontSize: 7.5, fill: C.amber, letterSpacing: "0.06em", fontWeight: 700 }}>RISK PASSES HERE</text>
          </g>
        </svg>

        {/* term chips */}
        <div className="flex flex-wrap gap-2" style={{ marginTop: 6, justifyContent: "center" }}>
          {INCOTERMS.map((i) => {
            const on = i.code === sel;
            return (
              <button key={i.code} onClick={() => setSel(i.code)} className="mono"
                style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", padding: "6px 12px", borderRadius: 9, cursor: "pointer",
                  border: `1px solid ${on ? C.petrol : C.soft}`, background: on ? C.petrol : "#fff", color: on ? "#fff" : C.ink }}>
                {i.code}
              </button>
            );
          })}
        </div>
      </Card>

      {/* detail card */}
      <Card accent={C.petrol}>
        <div className="flex items-baseline gap-2" style={{ flexWrap: "wrap" }}>
          <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: C.ink, letterSpacing: "0.04em" }}>{t.code}</span>
          <span style={{ fontSize: 14, color: C.ink, fontWeight: 600 }}>{t.name}</span>
        </div>
        <p style={{ fontSize: 12.5, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>{t.note}</p>
        <div style={{ marginTop: 10 }}>
          <WhoRow k="Ship booked by" v={shipBy} />
          <WhoRow k="Freight" v={freightWho} />
          <WhoRow k="Insurance" v={t.insurance} />
          <WhoRow k="Risk passes to buyer" v={riskName} accent={C.amber} />
        </div>
      </Card>

      {/* head-to-head table */}
      <DataTable
        cols={["Term", "Ship booked by", "Freight", "Risk passes"]}
        rows={INCOTERMS.map((i) => [
          i.code,
          i.sellerFreightTo >= 3 ? "Seller" : "Buyer",
          ["Buyer (all)", "Buyer (main)", "Buyer (ocean)", "Seller → discharge", "Seller → door"][i.sellerFreightTo],
          ["Plant", "Load port", "On board", "Discharge", "Buyer door"][i.risk],
        ])}
      />

      <Card accent={C.amber}>
        <p style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.55 }}>The classic bulk-chemical trio is <b>FOB / CFR / CIF</b>. The split-point insight: in <b>CFR</b> and <b>CIF</b> the seller pays the freight, but the buyer already carries the <b>risk</b> from the moment the cargo crosses the ship's rail.</p>
      </Card>

      <Card>
        <p style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.55 }}>Close the loop: <b>“MEG CFR China”</b> now reads as — price includes <b>product + freight to a Chinese port</b>, with <b>risk transferring on board in Thailand</b>.</p>
      </Card>
      <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>Incoterms® 2020 summaries for learning only — not legal advice.</p>
    </div>
  );
}

function WhoRow({ k, v, accent }) {
  return (
    <div className="flex justify-between items-baseline" style={{ padding: "6px 0", borderTop: `1px solid ${C.soft}` }}>
      <span className="mono" style={{ fontSize: 10.5, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{k}</span>
      <span style={{ fontSize: 12.5, color: accent || C.ink, fontWeight: 600, textAlign: "right", marginLeft: 12 }}>{v}</span>
    </div>
  );
}

/* ============================================================
   TAB: Quiz  (pass mark computed from length)
   ============================================================ */
function Quiz() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const passMark = Math.ceil(QUIZ.length * 0.7);
  const score = QUIZ.reduce((n, q, i) => n + (answers[i] === q.a ? 1 : 0), 0);
  const passed = score >= passMark;

  return (
    <div className="space-y-4">
      <SectionHead title="Check yourself" sub={`${QUIZ.length} questions · pass mark ${passMark}/${QUIZ.length}.`} />
      {QUIZ.map((q, i) => (
        <Card key={i}>
          <p style={{ fontSize: 13.5, color: C.ink, fontWeight: 600, lineHeight: 1.45 }}><span className="mono" style={{ color: C.petrol, marginRight: 6 }}>{i + 1}.</span>{q.q}</p>
          <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
            {q.opts.map((o, oi) => {
              const chosen = answers[i] === oi;
              const reveal = submitted;
              const correct = q.a === oi;
              let border = C.soft, bg = "#fff", col = C.ink;
              if (chosen && !reveal) { border = C.petrol; bg = "#f0faf8"; }
              if (reveal && correct) { border = C.petrol; bg = "#eef8f5"; }
              if (reveal && chosen && !correct) { border = C.amber; bg = "#fbf3e6"; }
              return (
                <button key={oi} disabled={submitted} onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                  style={{ textAlign: "left", fontSize: 13, color: col, padding: "8px 10px", borderRadius: 8, border: `1px solid ${border}`, background: bg, cursor: submitted ? "default" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  {reveal && correct && <Check size={14} color={C.petrol} />}
                  {reveal && chosen && !correct && <X size={14} color={C.amber} />}
                  <span>{o}</span>
                </button>
              );
            })}
          </div>
          {submitted && <p style={{ fontSize: 12, color: C.muted, marginTop: 8, lineHeight: 1.5 }}><b style={{ color: C.ink }}>Why:</b> {q.why}</p>}
        </Card>
      ))}

      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < QUIZ.length}
          style={{ width: "100%", padding: "12px", borderRadius: 10, background: Object.keys(answers).length < QUIZ.length ? "#cfc8b6" : C.petrol, color: "#fff", fontWeight: 700, fontSize: 14, cursor: Object.keys(answers).length < QUIZ.length ? "default" : "pointer", border: "none" }}>
          {Object.keys(answers).length < QUIZ.length ? `Answer all ${QUIZ.length} to submit (${Object.keys(answers).length}/${QUIZ.length})` : "Submit"}
        </button>
      ) : (
        <Card accent={passed ? C.petrol : C.amber}>
          <div className="flex items-center justify-between">
            <div>
              <Tag color={passed ? C.petrol : C.amber}>{passed ? "Passed" : "Keep going"}</Tag>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginTop: 4 }}>{score} / {QUIZ.length}</p>
              <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Pass mark {passMark}. {passed ? "Nice — you can trace the chain and the trade." : "Review the tabs and try again."}</p>
            </div>
            <button onClick={() => { setAnswers({}); setSubmitted(false); }} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.ink, border: `1px solid ${C.soft}`, borderRadius: 9, padding: "8px 12px", background: "#fff", cursor: "pointer" }}>
              <RotateCcw size={14} /> Retry
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
const TABS = [
  { id: "intro", label: "The Chain", icon: Workflow, C: Intro },
  { id: "crack", label: "Cracking", icon: Flame, C: Cracking },
  { id: "reactor", label: "EO Reactor", icon: FlaskConical, C: Reactor },
  { id: "glycol", label: "Glycols", icon: Droplets, C: Glycols },
  { id: "delivery", label: "Delivery", icon: Truck, C: Delivery },
  { id: "trade", label: "Trade", icon: Coins, C: Trade },
  { id: "quiz", label: "Quiz", icon: GraduationCap, C: Quiz },
];

export default function App() {
  const [tab, setTab] = useState("intro");
  const Active = (TABS.find((t) => t.id === tab) || TABS[0]).C;
  return (
    <div className="eo-root" style={{ minHeight: "100vh", color: C.ink }}>
      <style>{`
        .eo-root{ background-color:${C.paper};
          background-image: linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px);
          background-size: 26px 26px; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
        .eo-root .mono{ font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; }
        .eo-root ::-webkit-scrollbar{ height:8px; width:8px; } .eo-root ::-webkit-scrollbar-thumb{ background:${C.soft}; border-radius:8px; }
        .eo-tabbtn{ transition: background .12s, color .12s; }
      `}</style>

      {/* header */}
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(246,242,232,.92)", backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.soft}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "12px 16px 0" }}>
          <div className="flex items-center gap-2">
            <Factory size={18} color={C.petrol} />
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em", color: C.ink }}>EO Academy</span>
            <span className="mono" style={{ fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginLeft: 4 }}>Value-chain field guide</span>
          </div>
          <nav className="flex gap-1" style={{ marginTop: 10, overflowX: "auto", paddingBottom: 2 }}>
            {TABS.map((t) => {
              const on = t.id === tab;
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className="eo-tabbtn mono"
                  style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", padding: "8px 12px", borderRadius: "9px 9px 0 0", border: "none", cursor: "pointer",
                    color: on ? C.ink : C.muted, background: on ? "#fff" : "transparent", borderBottom: on ? `2px solid ${C.petrol}` : "2px solid transparent" }}>
                  <Icon size={14} color={on ? C.petrol : C.muted} /> {t.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* content */}
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px 40px" }}>
        <Active />
      </main>

      {/* footer */}
      <footer style={{ borderTop: `1px solid ${C.soft}`, background: "rgba(246,242,232,.7)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.4 }}>Public, textbook information for training. No real prices, margins, customers or contracts. All figures illustrative.</span>
          <span className="mono" style={{ fontSize: 11, color: C.muted, letterSpacing: "0.1em" }}>EO ACADEMY · V0.9</span>
        </div>
      </footer>
    </div>
  );
}
