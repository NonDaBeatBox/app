/* =========================================================================
   DATA:SKILLS — the backbone of the whole app.
   Domains carry the official Digital SAT weights; every skill belongs to one
   domain. Skill ids are used everywhere (questions, lessons, path, mastery).
   Section pacing targets: RW ~71 sec/q, Math ~95 sec/q.
   ========================================================================= */

const SECTIONS = {
  math: { id: 'math', name: 'Math', paceSec: 95, scaleMin: 200, scaleMax: 800 },
  rw:   { id: 'rw',   name: 'Reading & Writing', paceSec: 71, scaleMin: 200, scaleMax: 800 },
};

const DOMAINS = {
  // Math (~35 / 35 / 15 / 15)
  algebra:     { id: 'algebra',     section: 'math', name: 'Algebra',                         weight: 0.35 },
  advmath:     { id: 'advmath',     section: 'math', name: 'Advanced Math',                   weight: 0.35 },
  psda:        { id: 'psda',        section: 'math', name: 'Problem-Solving & Data Analysis', weight: 0.15 },
  geotrig:     { id: 'geotrig',     section: 'math', name: 'Geometry & Trigonometry',         weight: 0.15 },
  // Reading & Writing (~28 / 26 / 26 / 20)
  craft:       { id: 'craft',       section: 'rw',   name: 'Craft & Structure',              weight: 0.28 },
  infoideas:   { id: 'infoideas',   section: 'rw',   name: 'Information & Ideas',             weight: 0.26 },
  conventions: { id: 'conventions', section: 'rw',   name: 'Standard English Conventions',   weight: 0.26 },
  expression:  { id: 'expression',  section: 'rw',   name: 'Expression of Ideas',            weight: 0.20 },
};

/* 33 skills. `blurb` is the one-line concept used in tooltips & lesson intros. */
const SKILLS = [
  // ---- Algebra ----
  { id: 'alg_linear_eq',  domain: 'algebra', name: 'Linear equations',        blurb: 'Solve one-variable linear equations, including those needing distribution and combining like terms.' },
  { id: 'alg_linear_fn',  domain: 'algebra', name: 'Linear functions & slope', blurb: 'Interpret slope and intercepts; write and use slope-intercept and point-slope forms.' },
  { id: 'alg_systems',    domain: 'algebra', name: 'Systems of equations',     blurb: 'Solve linear systems by substitution and elimination; recognize zero/infinite solutions.' },
  { id: 'alg_inequal',    domain: 'algebra', name: 'Linear inequalities',      blurb: 'Solve and graph inequalities and systems of inequalities in context.' },
  { id: 'alg_word',       domain: 'algebra', name: 'Linear modeling',          blurb: 'Translate real-world situations into linear equations and interpret their parts.' },

  // ---- Advanced Math ----
  { id: 'adv_quadratic',  domain: 'advmath', name: 'Quadratic equations',      blurb: 'Solve quadratics by factoring, the quadratic formula, and completing the square.' },
  { id: 'adv_exponents',  domain: 'advmath', name: 'Exponents & radicals',     blurb: 'Apply exponent rules and rewrite radical and rational exponent expressions.' },
  { id: 'adv_exponential',domain: 'advmath', name: 'Exponential functions',    blurb: 'Model growth and decay; connect percent change to exponential form.' },
  { id: 'adv_polynomial', domain: 'advmath', name: 'Polynomials & factoring',  blurb: 'Factor, expand, and use the structure of polynomial expressions.' },
  { id: 'adv_rational',   domain: 'advmath', name: 'Rational & radical eqns',  blurb: 'Solve rational and radical equations and handle extraneous solutions.' },
  { id: 'adv_functions',  domain: 'advmath', name: 'Functions & nonlinear graphs', blurb: 'Use function notation and read features of nonlinear graphs.' },

  // ---- Problem-Solving & Data Analysis ----
  { id: 'psda_ratio',     domain: 'psda', name: 'Ratios, rates & proportions', blurb: 'Set up and solve proportional relationships and unit rates.' },
  { id: 'psda_percent',   domain: 'psda', name: 'Percentages',                 blurb: 'Percent change, percent of, and successive/mixed percent problems.' },
  { id: 'psda_data',      domain: 'psda', name: 'Data interpretation',         blurb: 'Read tables, bar/line graphs, and scatterplots; interpret trend lines.' },
  { id: 'psda_stats',     domain: 'psda', name: 'Statistics & spread',         blurb: 'Mean, median, mode, range, standard deviation, and margin of error.' },
  { id: 'psda_prob',      domain: 'psda', name: 'Probability & two-way tables',blurb: 'Compute simple and conditional probabilities from counts and tables.' },

  // ---- Geometry & Trigonometry ----
  { id: 'geo_angles',     domain: 'geotrig', name: 'Lines, angles & triangles',blurb: 'Angle relationships, similar triangles, and the triangle rules.' },
  { id: 'geo_circles',    domain: 'geotrig', name: 'Circles',                  blurb: 'Circle equations, arcs, sectors, radians, and inscribed angles.' },
  { id: 'geo_volume',     domain: 'geotrig', name: 'Area & volume',           blurb: 'Areas of plane figures and volumes/surface areas of solids.' },
  { id: 'geo_trig',       domain: 'geotrig', name: 'Right-triangle trig',      blurb: 'SOH-CAH-TOA, the Pythagorean theorem, and special right triangles.' },

  // ---- Craft & Structure ----
  { id: 'rw_vocab',       domain: 'craft', name: 'Words in context',           blurb: 'Choose the word that best fits the logic and tone of a passage.' },
  { id: 'rw_purpose',     domain: 'craft', name: 'Text structure & purpose',   blurb: 'Identify the function of a sentence and the author’s rhetorical purpose.' },
  { id: 'rw_connections', domain: 'craft', name: 'Cross-text connections',     blurb: 'Compare how two texts relate — agreement, response, or contrast.' },

  // ---- Information & Ideas ----
  { id: 'rw_main',        domain: 'infoideas', name: 'Central ideas & details',blurb: 'Find the main idea and the details that directly support it.' },
  { id: 'rw_evidence',    domain: 'infoideas', name: 'Command of evidence',    blurb: 'Pick the detail that best supports or weakens a given claim.' },
  { id: 'rw_quant',       domain: 'infoideas', name: 'Quantitative evidence',  blurb: 'Use data from a graph or table to complete or support a claim.' },
  { id: 'rw_inference',   domain: 'infoideas', name: 'Inferences',             blurb: 'Draw the conclusion the passage most logically leads to.' },

  // ---- Standard English Conventions ----
  { id: 'rw_boundaries',  domain: 'conventions', name: 'Boundaries & punctuation', blurb: 'Join and separate clauses correctly — commas, semicolons, colons, dashes.' },
  { id: 'rw_sva',         domain: 'conventions', name: 'Subject-verb agreement',   blurb: 'Match verbs to their true subjects across interrupting phrases.' },
  { id: 'rw_verb',        domain: 'conventions', name: 'Verb tense & form',        blurb: 'Choose consistent, logical tense and correct verb forms.' },
  { id: 'rw_modifiers',   domain: 'conventions', name: 'Pronouns & modifiers',     blurb: 'Fix pronoun agreement/clarity and dangling or misplaced modifiers.' },

  // ---- Expression of Ideas ----
  { id: 'rw_transitions', domain: 'expression', name: 'Transitions',           blurb: 'Select the transition that matches the logical relationship between ideas.' },
  { id: 'rw_synthesis',   domain: 'expression', name: 'Rhetorical synthesis',  blurb: 'Combine notes to meet a specific rhetorical goal efficiently.' },
];

/* Additional authored questions live in the DATA:QUESTIONS_* generated batches
   and push into GEN_BANK, which is merged into the runtime bank alongside the
   hand-written seed arrays. Keeps large batches in tidy, grouped blocks. */
const GEN_BANK = [];

/* Fast lookups built once. */
const SKILL_BY_ID = Object.fromEntries(SKILLS.map(s => [s.id, s]));
const skillSection = (id) => DOMAINS[SKILL_BY_ID[id].domain].section;
const skillsInDomain = (dom) => SKILLS.filter(s => s.domain === dom);
const skillsInSection = (sec) => SKILLS.filter(s => DOMAINS[s.domain].section === sec);
const domainsInSection = (sec) => Object.values(DOMAINS).filter(d => d.section === sec);
