/* =========================================================================
   DATA:STRATEGIES — CookSAT-style digital-SAT tactics the classroom skips.
   Schema: { id, title, icon, blurb, tag(strategyTag for practice),
             practice:{ skills?, section?, type? }  // fallback filter to build a set
             body:[ {h, p:[paragraphs]} ] }
   Desmos can't be embedded; we teach the exact click-by-click workflow and link
   out to desmos.com/calculator. Practice pulls questions by strategyTag first,
   then tops up from the fallback filter.
   ========================================================================= */

const STRATEGIES = [
  {
    id: 'desmos_graph', icon: '📈', title: 'Desmos: graph both sides to solve anything',
    tag: 'desmos_graph', practice: { section: 'math', skills: ['adv_quadratic', 'alg_systems', 'adv_functions', 'adv_rational'] },
    blurb: 'Turn “solve for x” into “find the intersection.” The fastest, most error-proof move on the calculator.',
    body: [
      { h: 'The core trick', p: [
        'Any equation — no matter how ugly — can be solved by graphing. Put the whole left side into $y_1$ and the whole right side into $y_2$, then read off where the two curves cross.',
        'Example: to solve $x^2 - 3 = 2x$, type $y = x^2 - 3$ on one line and $y = 2x$ on the next. Click each intersection point Desmos marks; the $x$-values (3 and −1) are your solutions.' ] },
      { h: 'One-variable shortcut', p: [
        'For a single equation you can instead move everything to one side and graph $y = $ (left side) $-$ (right side). The solutions are the $x$-intercepts — click where the curve crosses the $x$-axis.',
        'This is perfect for “how many solutions does this equation have?” — just count the crossings.' ] },
      { h: 'Systems', p: [
        'For a system, type both equations. The intersection point is the solution $(x, y)$. If the lines are parallel (never cross) there is no solution; if they lie on top of each other there are infinitely many.' ] },
      { h: 'When to reach for it', p: [
        'Use it whenever algebra would be slow or error-prone: messy quadratics, equations with fractions or radicals, “which value of $x$ satisfies…”, and any system. It costs ~15 seconds and removes almost all arithmetic risk.',
        'Open desmos.com/calculator in another tab to drill this — the real test gives you the same calculator built in.' ] },
    ],
  },
  {
    id: 'desmos_regression', icon: '🧮', title: 'Desmos: regression to crack “which model” questions',
    tag: 'desmos_regression', practice: { section: 'math', skills: ['alg_linear_fn', 'psda_data', 'adv_exponential', 'alg_word'] },
    blurb: 'When a table of values asks “which equation fits,” let Desmos find the exact line or curve.',
    body: [
      { h: 'Type the table', p: [
        'Add a table in Desmos and enter the data as $x_1$ and $y_1$ columns. Desmos plots the points automatically.' ] },
      { h: 'Fit a model', p: [
        'On a new line type $y_1 \\sim m x_1 + b$ for a linear fit (the tilde “~” means “regress”). Desmos returns the best-fit $m$ and $b$. For a quadratic use $y_1 \\sim a x_1^2 + b x_1 + c$; for exponential growth use $y_1 \\sim a \\cdot b^{x_1}$.',
        'Match the returned coefficients to the answer choices. If the data is perfectly linear (as SAT tables usually are), the fit is exact.' ] },
      { h: 'Why it wins', p: [
        'It replaces slope calculations, system-solving, and guess-and-check with one line of typing. It is especially strong on “a line of best fit” and “the function that models the data” questions.' ] },
    ],
  },
  {
    id: 'desmos_table', icon: '🔢', title: 'Desmos: tables for student-produced (SPR) answers',
    tag: 'desmos_table', practice: { section: 'math', type: 'spr' },
    blurb: 'For grid-in answers, define a function and read the value straight off a table.',
    body: [
      { h: 'Define, then evaluate', p: [
        'Type the expression as a function, e.g. $f(x) = 2x^2 - 3x + 1$. Then add a table with an $x$ column and a second column $f(x_1)$ — Desmos fills in the outputs. Read your grid-in answer directly.' ] },
      { h: 'Find where something equals a target', p: [
        'To answer “for what $x$ does $f(x) = 10$?”, graph $y = f(x)$ and $y = 10$ and click the intersection, or scan the table until the output hits 10.' ] },
      { h: 'Grid-in rules to remember', p: [
        'You can enter a fraction ($3/2$) or a decimal ($1.5$) — Ace accepts either. Don’t round unless the value is a long decimal; if you must round, give at least 3 digits. Never enter a percent sign or a comma.' ] },
    ],
  },
  {
    id: 'plug_in', icon: '🔌', title: 'Plugging in numbers',
    tag: 'plug_in', practice: { section: 'math', skills: ['alg_word', 'adv_polynomial', 'alg_linear_fn', 'adv_functions'] },
    blurb: 'When the answers contain variables, invent your own numbers and test.',
    body: [
      { h: 'How it works', p: [
        'If a question is abstract (“…in terms of $n$”) and the choices are expressions, pick an easy number for each variable — avoid 0, 1, and any number already in the problem. Compute the real answer with your number, then plug the same number into every choice and keep the one that matches.' ] },
      { h: 'Example', p: [
        'If a shirt costs $d$ dollars and is discounted 20%, which expression is the new price? Let $d = 100$: the true price is \\$80. Test the choices with $d = 100$ — only $0.8d$ gives 80.' ] },
      { h: 'Watch for', p: [
        'If two choices both match, pick a second number and test only those two. Choose numbers that keep the arithmetic clean (10 and 100 are your friends for percents).' ] },
    ],
  },
  {
    id: 'backsolve', icon: '🎯', title: 'Backsolving from the answer choices',
    tag: 'backsolve', practice: { section: 'math', type: 'mcq', skills: ['alg_linear_eq', 'alg_systems', 'adv_quadratic', 'alg_word'] },
    blurb: 'The answer is already on the screen — try the choices instead of solving.',
    body: [
      { h: 'The method', p: [
        'When choices are plain numbers and the question asks for a value, plug the choices into the problem’s condition. Start with the middle value (B or C): if it’s too big, go smaller; too small, go bigger. You’ll rarely test more than two.' ] },
      { h: 'Example', p: [
        'For “what value of $x$ satisfies $3(x - 4) = 18$?”, try C = 10: $3(10-4) = 18$. ✓ Done — no algebra.' ] },
      { h: 'Best targets', p: [
        'Word problems with numeric choices, equations that are annoying to isolate, and “which value could be…” questions. Backsolving turns algebra into a couple of quick substitutions.' ] },
    ],
  },
  {
    id: 'rw_elim', icon: '✂️', title: 'Reading & Writing: elimination patterns',
    tag: 'rw_elim', practice: { section: 'rw', skills: ['rw_vocab', 'rw_inference', 'rw_main', 'rw_evidence'] },
    blurb: 'On RW there is exactly one defensible answer. Cross out the three that aren’t.',
    body: [
      { h: 'Predict first', p: [
        'Before reading the choices, answer the question in your own words from the passage. Then find the choice that matches your prediction. This stops the tempting-but-wrong options from pulling you in.' ] },
      { h: 'Kill these', p: [
        'Extreme language (“always,” “never,” “proves”) is usually wrong — passages hedge. Off-topic choices bring in a true-sounding fact the passage never states. Half-right choices get one clause right and one wrong — the wrong half kills the whole choice.',
        'For “command of evidence,” the answer must connect directly to the specific claim, not just be true. For inference, the answer must be forced by the text, not merely plausible.' ] },
      { h: 'Vocabulary in context', p: [
        'Cover the choices, read the sentence, and predict the word. Then match. The “hardest-looking” word is not automatically the answer — precision beats sophistication.' ] },
    ],
  },
  {
    id: 'rw_boundaries_test', icon: '⚖️', title: 'Punctuation: the two-clause test',
    tag: 'rw_boundaries_test', practice: { section: 'rw', skills: ['rw_boundaries'] },
    blurb: 'Most boundary questions come down to one question: is each side a complete sentence?',
    body: [
      { h: 'Ask: independent on both sides?', p: [
        'An independent clause can stand alone as a sentence. Check both sides of the blank.',
        'Two independent clauses → join with a period, a semicolon, or a comma + FANBOYS conjunction (for/and/nor/but/or/yet/so). A comma alone is a comma splice (wrong).' ] },
      { h: 'One side dependent', p: [
        'If one side can’t stand alone (a phrase or a subordinate clause), use a comma — never a semicolon. Semicolons demand a full sentence on both sides.',
        'A colon needs a complete sentence before it and introduces a list, explanation, or example after it.' ] },
      { h: 'Fast rule of thumb', p: [
        'If a semicolon works, a period works too — so if the test offers both, neither is the answer (they can’t both be right). That instantly eliminates two choices.' ] },
    ],
  },
  {
    id: 'rw_transitions_test', icon: '🔗', title: 'Transitions: name the relationship',
    tag: 'rw_transitions_test', practice: { section: 'rw', skills: ['rw_transitions'] },
    blurb: 'Cover the transition, decide the logical relationship, then match.',
    body: [
      { h: 'Two-step method', p: [
        'Read the sentence before and after the blank with the transition covered. Decide the relationship in one word: contrast, cause/effect, example, addition, or restatement.',
        'Then pick the transition in that family. “However/nevertheless/in contrast” = contrast. “Therefore/thus/as a result” = cause-effect. “For example/for instance” = example. “Moreover/in addition/furthermore” = addition.' ] },
      { h: 'Traps', p: [
        'Don’t choose by what “sounds smooth” — choose by logic. Watch for choices from the wrong family that fit the tone but not the relationship. If two choices mean the same thing (e.g., “therefore” and “thus”), neither can be the answer.' ] },
    ],
  },
  {
    id: 'pacing', icon: '⏱️', title: 'Pacing & skipping, module by module',
    tag: 'pacing', practice: { section: 'rw' },
    blurb: 'A plan for the clock: which questions to fight, which to flag, and when to guess.',
    body: [
      { h: 'The budget', p: [
        'Reading & Writing: ~71 seconds per question (27 questions in 32 minutes). Math: ~95 seconds per question (22 in 35 minutes). Questions run roughly easy → hard, so bank time early.' ] },
      { h: 'Flag and move', p: [
        'If a question isn’t yielding in ~30 seconds past its budget, pick your best guess, mark it for review, and move on. Never let one hard item eat the three easy ones at the end of the module. Use the navigator to return with your leftover time.' ] },
      { h: 'Never leave blanks', p: [
        'There is no penalty for wrong answers. With one minute left, fill every remaining bubble — eliminate what you can, then guess. A blank is a guaranteed zero; a guess is free expected points.' ] },
      { h: 'Adaptive stakes', p: [
        'Module 1 sets your Module 2 difficulty (and your ceiling). Treat Module 1 as the most important minutes of the section: accuracy there unlocks the harder, higher-scoring Module 2.' ] },
    ],
  },
];
const STRATEGY_BY_ID = Object.fromEntries(STRATEGIES.map((s) => [s.id, s]));
