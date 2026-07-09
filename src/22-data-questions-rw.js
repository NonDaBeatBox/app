/* =========================================================================
   DATA:QUESTIONS_RW
   Same authoring schema as math, plus a `passage` (25–150 words) on every
   question — Digital SAT RW items are standalone with their own short passage.
   ========================================================================= */

const QUESTIONS_RW_CRAFT = [
  { id: 'R0001', skill: 'rw_vocab', difficulty: 2, type: 'mcq',
    passage: 'Although the new expense policy was meant to simplify approvals, employees found it so ______ that many gave up midway, tangled in redundant forms and unclear steps.',
    stem: 'Which choice completes the text with the most logical and precise word?',
    choices: ['convoluted', 'transparent', 'lenient', 'concise'], answer: 'A',
    explanation: 'The clues "tangled," "redundant," and "unclear" describe something overly complicated — "convoluted." "Transparent" and "concise" mean clear or brief (the opposite); "lenient" means permissive, which does not fit.',
    strategyTag: 'rw_elim' },

  { id: 'R0002', skill: 'rw_vocab', difficulty: 3, type: 'mcq',
    passage: 'The critic praised the novel’s ______ prose: every sentence felt polished to a high shine, with not a word out of place.',
    stem: 'Which choice completes the text with the most logical and precise word?',
    choices: ['meticulous', 'careless', 'verbose', 'ambiguous'], answer: 'A',
    explanation: '"Polished" and "not a word out of place" signal painstaking care — "meticulous." "Careless" is the opposite, "verbose" means wordy, and "ambiguous" means unclear — none matches praise for precision.',
    strategyTag: 'rw_elim' },

  { id: 'R0003', skill: 'rw_purpose', difficulty: 2, type: 'mcq',
    passage: 'In her essay, Alvarez first lists the objections critics have raised against urban beekeeping. She then devotes the remaining pages to answering each objection in turn, citing safety data and interviews with longtime beekeepers.',
    stem: 'Which choice best describes the overall structure of Alvarez’s essay as it is presented?',
    choices: ['It raises objections and then systematically responds to them.', 'It compares beekeeping in cities and rural areas.', 'It narrates the history of urban beekeeping.', 'It argues that beekeeping should be banned.'], answer: 'A',
    explanation: 'The description is objections first, then point-by-point responses — choice A. No urban/rural comparison (B) or history (C) appears, and Alvarez defends beekeeping rather than calling for a ban (D).' },

  { id: 'R0004', skill: 'rw_connections', difficulty: 3, type: 'mcq',
    passage: 'Text 1: Historian Lee argues that the printing press caused literacy to spread rapidly, since cheap books gave ordinary people reasons to learn to read. Text 2: Historian Ortiz counters that literacy rose mainly where schools already existed; the press, she says, met a demand that schooling had created, rather than creating it.',
    stem: 'Based on the texts, how would Ortiz most likely respond to Lee’s argument?',
    choices: ['By noting that the press followed rising literacy rather than driving it', 'By agreeing that cheap books were the single cause of literacy', 'By denying that literacy rose at all during the period', 'By arguing that schools discouraged reading'], answer: 'A',
    explanation: 'Ortiz credits pre-existing schools and says the press "met a demand," so she would say the press followed literacy rather than caused it — choice A. (B) contradicts her, (C) and (D) state claims neither historian makes.' },
];

const QUESTIONS_RW_INFOIDEAS = [
  { id: 'R0101', skill: 'rw_main', difficulty: 2, type: 'mcq',
    passage: 'Octopuses can change not only the color but also the texture of their skin, raising tiny bumps to mimic coral or smoothing out to slip past a predator. This camouflage is controlled directly by the nervous system, allowing near-instant shifts.',
    stem: 'Which choice best states the main idea of the text?',
    choices: ['Octopuses use fast, nervous-system-controlled changes in skin color and texture to camouflage.', 'Octopuses are the ocean’s most dangerous predators.', 'Coral reefs depend on octopuses for their protection.', 'Octopuses cannot survive unless they change color constantly.'], answer: 'A',
    explanation: 'The text focuses on how octopuses camouflage by rapidly changing color and texture under nervous-system control — choice A. (B) and (C) add claims never made; (D) overstates a survival requirement the passage does not assert.' },

  { id: 'R0102', skill: 'rw_evidence', difficulty: 3, type: 'mcq',
    passage: 'A researcher claims that a plant species growing along a mountain trail has spread mainly because hikers unknowingly carry its seeds on their boots.',
    stem: 'Which finding, if true, would most directly support the researcher’s claim?',
    choices: ['The plant is far denser within one meter of the trail than deeper in the forest.', 'The plant produces flowers that attract many bees.', 'The plant grows well in a wide variety of soil types.', 'The trail was built more recently than the surrounding forest.'], answer: 'A',
    explanation: 'If the plant clusters right along the trail (where boots pass) and thins out away from it, that pattern fits seed transport by hikers — choice A. Bee attraction (B) and soil tolerance (C) point to other means of spreading; trail age (D) does not link the spread to hikers.' },

  { id: 'R0103', skill: 'rw_inference', difficulty: 3, type: 'mcq',
    passage: 'The museum’s oldest manuscripts are kept in a sealed room where light, temperature, and humidity never vary. Visitors see only high-resolution digital copies; the originals are handled just a few times each decade, and then only by conservators wearing gloves.',
    stem: 'Which choice most logically completes the text?\n\nThe museum’s practices suggest that ______',
    choices: ['preserving the manuscripts is treated as more important than displaying the originals.', 'the manuscripts are of little historical value.', 'the digital copies are more accurate than the originals.', 'visitors are not interested in the manuscripts.'], answer: 'A',
    explanation: 'Sealing the originals away and showing copies signals that protection is prioritized over public display — choice A. (B) contradicts the care taken; (C) and (D) are unsupported — copies are shown for preservation, not accuracy, and visitor interest is never discussed.' },

  { id: 'R0104', skill: 'rw_quant', difficulty: 2, type: 'mcq',
    passage: 'A study measured average daily water use in four neighborhoods. The results were: Ash 180 L, Birch 240 L, Cedar 150 L, Dover 300 L per person. The researchers noted that one neighborhood used far more water per person than the others.',
    stem: 'Which choice most effectively uses data from the text to complete the observation?',
    choices: ['Dover, at 300 L per person, used the most water of the four neighborhoods.', 'Cedar, at 150 L per person, used the most water of the four.', 'Ash and Birch used identical amounts of water.', 'All four neighborhoods used about the same amount of water.'], answer: 'A',
    explanation: 'The observation is about the highest user; Dover’s 300 L is the largest figure — choice A. (B) names the lowest, (C) is false (180 ≠ 240), and (D) contradicts the stated variation.' },
];

const QUESTIONS_RW_CONVENTIONS = [
  { id: 'R0201', skill: 'rw_boundaries', difficulty: 2, type: 'mcq',
    passage: 'The greenhouse held dozens of orchids ______ each one labeled with its species and the date it first bloomed.',
    stem: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: [', ', '; ', ', and ', ': '], answer: 'A',
    explanation: '"each one labeled with its species…" is a describing (participial) phrase, not a complete sentence, so a comma attaches it. A semicolon (B) and "and" (C) both need a full independent clause after them, and a colon (D) is not used to introduce a simple modifier.',
    strategyTag: 'rw_boundaries_test' },

  { id: 'R0202', skill: 'rw_sva', difficulty: 2, type: 'mcq',
    passage: 'The collection of rare coins, gathered over three decades by a single dedicated hobbyist, ______ now on display at the national museum.',
    stem: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['is', 'are', 'were', 'have been'], answer: 'A',
    explanation: 'The subject is "collection" (singular); "of rare coins…" is just a modifier. A singular subject takes "is." "Are," "were," and "have been" all agree with the plural "coins," which is not the true subject.' },

  { id: 'R0203', skill: 'rw_verb', difficulty: 2, type: 'mcq',
    passage: 'By the time the results were announced last spring, the committee ______ the proposals for nearly six months.',
    stem: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['had been reviewing', 'reviews', 'reviewing', 'will review'], answer: 'A',
    explanation: 'The reviewing spanned a period ending before a past event ("were announced"), so the past perfect progressive "had been reviewing" fits. "Reviews" (present) and "will review" (future) clash with the past timeframe; "reviewing" alone is not a complete verb.' },

  { id: 'R0204', skill: 'rw_modifiers', difficulty: 2, type: 'mcq',
    passage: 'Adjusting the telescope carefully, ______',
    stem: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['the students finally brought Saturn’s rings into focus.', 'the faint rings of Saturn finally came into focus.', 'Saturn’s rings were finally visible in the eyepiece.', 'it was finally possible to see Saturn’s rings.'], answer: 'A',
    explanation: 'The opening modifier "Adjusting the telescope carefully" must describe whoever is adjusting, so the subject right after the comma should be "the students" — choice A. In the others the rings, a passive verb, or "it" cannot logically be doing the adjusting, leaving the modifier dangling.' },
];

const QUESTIONS_RW_EXPRESSION = [
  { id: 'R0301', skill: 'rw_transitions', difficulty: 2, type: 'mcq',
    passage: 'The city’s ferry service is famously punctual. ______ riders can plan tight connections without much worry, confident the boat will leave exactly on schedule.',
    stem: 'Which choice completes the text with the most logical transition?',
    choices: ['As a result,', 'Nevertheless,', 'In contrast,', 'For example,'], answer: 'A',
    explanation: 'The second sentence is a consequence of the ferry being punctual, so a cause-effect transition — "As a result" — fits. "Nevertheless" and "In contrast" signal opposition; "For example" would introduce an illustration, not an effect.',
    strategyTag: 'rw_transitions_test' },

  { id: 'R0302', skill: 'rw_transitions', difficulty: 3, type: 'mcq',
    passage: 'Solar panels have become far cheaper over the past decade. ______ many homeowners still hesitate to install them, put off by the upfront cost of batteries and wiring.',
    stem: 'Which choice completes the text with the most logical transition?',
    choices: ['Even so,', 'Therefore,', 'Likewise,', 'In short,'], answer: 'A',
    explanation: 'Cheaper panels would predict more adoption, but the sentence describes hesitation — a contrast — so "Even so" fits. "Therefore" and "In short" signal agreement or summary; "Likewise" signals similarity, none of which matches the reversal.' },

  { id: 'R0303', skill: 'rw_synthesis', difficulty: 2, type: 'mcq',
    passage: 'Notes:\n• Halley’s Comet completes one orbit every 76 years.\n• It was last visible from Earth in 1986.\n• Its next appearance is predicted for 2061.\n• It is named after astronomer Edmond Halley.',
    stem: 'The student wants to emphasize when the comet will next be seen. Which choice most effectively uses the notes to accomplish this goal?',
    choices: ['Last seen in 1986, Halley’s Comet is predicted to next appear in 2061.', 'Halley’s Comet, named for Edmond Halley, orbits every 76 years.', 'Edmond Halley studied a comet that orbits the Sun.', 'Halley’s Comet has an orbital period of 76 years.'], answer: 'A',
    explanation: 'The goal is to stress the next sighting, and only choice A names 2061 as the next appearance. The others emphasize the comet’s name or orbital period instead of when it will next be seen.' },
];

const QUESTIONS_RW = [].concat(
  QUESTIONS_RW_CRAFT, QUESTIONS_RW_INFOIDEAS, QUESTIONS_RW_CONVENTIONS, QUESTIONS_RW_EXPRESSION
);
