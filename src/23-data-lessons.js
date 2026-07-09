/* =========================================================================
   DATA:LESSONS — Khan-style mini-lessons, one per skill.
   Schema:
     { skill, concept:[paragraph, ...],
       examples:[{ q, steps:[step, ...] }],
       traps:[string, ...] }
   Text may use $...$ for KaTeX math and \$ for money (see mathToHtml).
   The checkpoint quiz is pulled LIVE from the question bank by skill (6 Qs),
   so lessons stay lean and always match the current bank.
   Additional lessons are appended via GEN_LESSONS batches.
   ========================================================================= */

const LESSONS = [
  {
    skill: 'alg_linear_eq',
    concept: [
      'A linear equation in one variable is any equation you can get into the form $ax + b = c$. Your job is to isolate $x$ by undoing operations in reverse order: first clear parentheses and fractions, then move the variable terms to one side and the numbers to the other, and finally divide.',
      'Whatever you do to one side you must do to the other. That balance is the whole game — every legal step keeps the two sides equal.',
    ],
    examples: [
      { q: 'Solve $3(x - 4) = 18$.', steps: ['Distribute the 3: $3x - 12 = 18$.', 'Add 12 to both sides: $3x = 30$.', 'Divide by 3: $x = 10$.'] },
      { q: 'Solve $\\frac{2x + 1}{3} = 5$.', steps: ['Multiply both sides by 3 to clear the fraction: $2x + 1 = 15$.', 'Subtract 1: $2x = 14$.', 'Divide by 2: $x = 7$.'] },
      { q: 'Solve $5x - 7 = 2x + 8$.', steps: ['Subtract $2x$ from both sides: $3x - 7 = 8$.', 'Add 7: $3x = 15$.', 'Divide by 3: $x = 5$.'] },
    ],
    traps: [
      'Forgetting to distribute to every term inside parentheses.',
      'Dropping a negative sign when moving a term across the equals sign.',
      'Dividing only part of a side by the coefficient — divide the whole side.',
    ],
  },
  {
    skill: 'alg_linear_fn',
    concept: [
      'A linear function has a constant rate of change, the slope $m$. In slope-intercept form $y = mx + b$, $m$ is the slope and $b$ is the $y$-intercept (the value of $y$ when $x = 0$).',
      'Slope between two points is $\\frac{\\text{change in } y}{\\text{change in } x} = \\frac{y_2 - y_1}{x_2 - x_1}$. On the SAT, always ask what the slope and intercept *mean* in context — dollars per month, the starting amount, and so on.',
    ],
    examples: [
      { q: 'A line passes through $(2, 5)$ and $(4, 11)$. Find its slope.', steps: ['Slope $= \\frac{11 - 5}{4 - 2} = \\frac{6}{2} = 3$.'] },
      { q: 'Write the equation of the line with slope 2 and $y$-intercept $-3$.', steps: ['Plug into $y = mx + b$: $m = 2$, $b = -3$.', 'So $y = 2x - 3$.'] },
    ],
    traps: [
      'Flipping the slope formula (putting the $x$-difference on top).',
      'Confusing the slope with the $y$-intercept in $y = mx + b$.',
      'Sign errors on a negative intercept.',
    ],
  },
  {
    skill: 'alg_systems',
    concept: [
      'A system of two linear equations asks for the point $(x, y)$ that satisfies both. Two tools: substitution (solve one equation for a variable and plug in) and elimination (add or subtract the equations to cancel a variable).',
      'If the equations describe the same line there are infinitely many solutions; if they are parallel (same slope, different intercept) there are none.',
    ],
    examples: [
      { q: 'Solve $y = 2x + 1$ and $y = -x + 7$.', steps: ['Both equal $y$, so set them equal: $2x + 1 = -x + 7$.', 'Add $x$, subtract 1: $3x = 6$, so $x = 2$.', 'Then $y = 2(2) + 1 = 5$. Solution: $(2, 5)$.'] },
      { q: 'Solve $3x + 2y = 16$ and $x - 2y = 0$ by elimination.', steps: ['Add the equations so $2y$ and $-2y$ cancel: $4x = 16$.', 'So $x = 4$, and from $x - 2y = 0$, $y = 2$.'] },
    ],
    traps: [
      'Adding when you should subtract (or vice versa) so nothing cancels.',
      'Solving for one variable and forgetting to find the other.',
      'Assuming a system always has exactly one solution.',
    ],
  },
  {
    skill: 'alg_inequal',
    concept: [
      'Linear inequalities are solved just like equations, with one extra rule: when you multiply or divide both sides by a negative number, flip the inequality sign.',
      'A solution is a range of values. For systems of inequalities, the answer is the overlap region — the set of points that satisfy every inequality at once.',
    ],
    examples: [
      { q: 'Solve $-2x + 5 > 1$.', steps: ['Subtract 5: $-2x > -4$.', 'Divide by $-2$ and flip the sign: $x < 2$.'] },
      { q: 'Solve $4x - 3 \\le 9$.', steps: ['Add 3: $4x \\le 12$.', 'Divide by 4 (positive, no flip): $x \\le 3$.'] },
    ],
    traps: [
      'Forgetting to flip the sign when dividing by a negative.',
      'Treating a strict inequality ($<$) as inclusive ($\\le$).',
      'Reversing which side of the boundary the solution lies on.',
    ],
  },
  {
    skill: 'alg_word',
    concept: [
      'Linear word problems hide a $y = mx + b$ inside a story. The slope $m$ is the per-unit rate (per month, per mile, per item); the intercept $b$ is the starting or fixed amount.',
      'Translate carefully: name the variable, write the equation, then answer the exact question asked — sometimes a value, sometimes the meaning of a coefficient.',
    ],
    examples: [
      { q: 'A gym charges a \\$30 sign-up fee plus \\$20 per month. After how many months is the total \\$170?', steps: ['Total: $30 + 20m = 170$.', 'Subtract 30: $20m = 140$.', 'Divide by 20: $m = 7$ months.'] },
      { q: 'In $C = 5 + 0.25t$, what does 0.25 represent if $C$ is cost in dollars and $t$ is minutes?', steps: ['It is the slope — the cost added per minute: \\$0.25 per minute.'] },
    ],
    traps: [
      'Swapping the fixed fee and the per-unit rate.',
      'Answering with the equation instead of the number the question asks for.',
      'Misreading units (per month vs. per year).',
    ],
  },
];

/* Merge hand-written + generated lessons into a skill lookup (built at boot). */
let LESSON_BY_SKILL = {};
function buildLessons() {
  LESSON_BY_SKILL = {};
  for (const l of LESSONS.concat(typeof GEN_LESSONS !== 'undefined' ? GEN_LESSONS : [])) LESSON_BY_SKILL[l.skill] = l;
}

