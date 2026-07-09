/* =========================================================================
   DATA:QUESTIONS_MATH
   Authoring schema (one object per question):
     { id, skill, difficulty(1|2|3|"extreme"), type("mcq"|"spr"),
       stem, choices:[4 strings] (mcq only), answer, explanation, strategyTag? }
   `section` and `domain` are auto-derived from `skill` at load (normalizeQuestion),
   so authors set `skill` only and never risk drift.
   mcq `answer` = correct letter "A".."D".  spr `answer` = string; the grader
   accepts equivalent fraction/decimal forms (and an optional `answers` array).
   Every math key below was solved by hand — the worked solution is in `explanation`.
   Grouped by domain for easy editing. Merged into one bank at runtime.
   ========================================================================= */

const QUESTIONS_MATH_ALGEBRA = [
  { id: 'M0001', skill: 'alg_linear_eq', difficulty: 1, type: 'mcq',
    stem: 'If $3(x - 4) = 18$, what is the value of $x$?',
    choices: ['2', '6', '10', '22'], answer: 'C',
    explanation: 'Distribute: $3x - 12 = 18$. Add 12: $3x = 30$. Divide by 3: $x = 10$. (B) 6 just divides 18 by 3 and ignores the −12. (D) 22 adds 12 to 18 without dividing. (A) 2 has no valid path.',
    strategyTag: 'plug_in' },

  { id: 'M0002', skill: 'alg_linear_eq', difficulty: 2, type: 'spr',
    stem: 'If $\\frac{2x+1}{3} = 5$, what is the value of $x$?',
    answer: '7',
    explanation: 'Multiply both sides by 3: $2x + 1 = 15$. Subtract 1: $2x = 14$. Divide by 2: $x = 7$.' },

  { id: 'M0003', skill: 'alg_linear_fn', difficulty: 2, type: 'mcq',
    stem: 'A line passes through $(0, -3)$ and has slope 2. Which equation represents the line?',
    choices: ['$y = 2x - 3$', '$y = -3x + 2$', '$y = 2x + 3$', '$y = -2x - 3$'], answer: 'A',
    explanation: 'Slope-intercept form $y = mx + b$ has $m = 2$ and $y$-intercept $b = -3$, so $y = 2x - 3$. (C) uses the wrong intercept sign, (B) swaps slope and intercept, and (D) uses the wrong slope sign.' },

  { id: 'M0004', skill: 'alg_linear_fn', difficulty: 2, type: 'mcq',
    stem: 'The graph of a linear function $f$ passes through $(2, 5)$ and $(4, 11)$. What is the slope of the graph?',
    choices: ['2', '3', '4', '6'], answer: 'B',
    explanation: 'Slope $= \\frac{11 - 5}{4 - 2} = \\frac{6}{2} = 3$. (D) 6 forgets to divide by the run. (A),(C) mis-subtract the coordinates.' },

  { id: 'M0005', skill: 'alg_systems', difficulty: 2, type: 'mcq',
    stem: 'For the system $y = 2x + 1$ and $y = -x + 7$, what is the value of $x$ at the solution?',
    choices: ['1', '2', '3', '4'], answer: 'B',
    explanation: 'Set the right sides equal: $2x + 1 = -x + 7 \\Rightarrow 3x = 6 \\Rightarrow x = 2$ (and $y = 5$). Plug the other options into both equations and they fail.',
    strategyTag: 'backsolve' },

  { id: 'M0006', skill: 'alg_systems', difficulty: 3, type: 'spr',
    stem: 'If $3x + 2y = 16$ and $x - 2y = 0$, what is the value of $x$?',
    answer: '4',
    explanation: 'Add the equations to eliminate $y$: $(3x + 2y) + (x - 2y) = 16 + 0 \\Rightarrow 4x = 16 \\Rightarrow x = 4$.',
    strategyTag: 'plug_in' },

  { id: 'M0007', skill: 'alg_inequal', difficulty: 2, type: 'mcq',
    stem: 'Which value of $x$ satisfies $-2x + 5 > 1$?',
    choices: ['$x = 4$', '$x = 3$', '$x = 1$', '$x = 2$'], answer: 'C',
    explanation: 'Solve: $-2x + 5 > 1 \\Rightarrow -2x > -4$. Dividing by a negative flips the sign: $x < 2$. Only $x = 1$ is less than 2. $x = 2$ gives exactly 1, which is not greater than 1.' },

  { id: 'M0008', skill: 'alg_word', difficulty: 2, type: 'spr',
    stem: 'A gym charges a \\$30 sign-up fee plus \\$20 per month. After how many months does the total cost reach \\$170?',
    answer: '7',
    explanation: 'Total cost: $30 + 20m = 170$. Subtract 30: $20m = 140$. Divide by 20: $m = 7$ months.' },

  { id: 'M0009', skill: 'alg_word', difficulty: 3, type: 'mcq',
    stem: 'A printer produces pages at a constant rate. It prints 90 pages in 4 minutes. At this rate, how many pages does it print in 10 minutes?',
    choices: ['180', '200', '225', '250'], answer: 'C',
    explanation: 'Rate $= 90 \\div 4 = 22.5$ pages/min. In 10 minutes: $22.5 \\times 10 = 225$. (A) 180 doubles the 4-minute count; (B),(D) misuse the rate.',
    strategyTag: 'plug_in' },
];

const QUESTIONS_MATH_ADVANCED = [
  { id: 'M0101', skill: 'adv_quadratic', difficulty: 2, type: 'mcq',
    stem: 'What are the solutions to $x^2 - 5x + 6 = 0$?',
    choices: ['$x = -2$ and $x = -3$', '$x = 2$ and $x = 3$', '$x = 1$ and $x = 6$', '$x = -1$ and $x = 6$'], answer: 'B',
    explanation: 'Factor: $(x - 2)(x - 3) = 0$, so $x = 2$ or $x = 3$. (A) has flipped signs (those solve $x^2 + 5x + 6$). (C),(D) mis-factor 6 as $1 \\cdot 6$.' },

  { id: 'M0102', skill: 'adv_quadratic', difficulty: 3, type: 'spr',
    stem: 'One solution to $x^2 - 6x + 4 = 0$ can be written as $3 + \\sqrt{k}$. What is the value of $k$?',
    answer: '5',
    explanation: 'Quadratic formula: $x = \\frac{6 \\pm \\sqrt{36 - 16}}{2} = \\frac{6 \\pm \\sqrt{20}}{2} = 3 \\pm \\sqrt{5}$. Matching $3 + \\sqrt{k}$ gives $k = 5$.' },

  { id: 'M0103', skill: 'adv_exponents', difficulty: 2, type: 'mcq',
    stem: 'Which expression is equivalent to $\\dfrac{x^5 \\cdot x^3}{x^2}$ for $x \\neq 0$?',
    choices: ['$x^6$', '$x^7$', '$x^{10}$', '$x^{-4}$'], answer: 'A',
    explanation: 'Add exponents when multiplying, subtract when dividing: $x^{5+3-2} = x^6$. (B) forgets the $-2$, (C) multiplies the exponents, (D) reverses the operations.' },

  { id: 'M0104', skill: 'adv_exponents', difficulty: 3, type: 'mcq',
    stem: 'If $x > 0$, which expression is equivalent to $\\sqrt{50x^4}$?',
    choices: ['$5x^2\\sqrt{2}$', '$25x^2\\sqrt{2}$', '$5x\\sqrt{2}$', '$10x^2$'], answer: 'A',
    explanation: '$\\sqrt{50x^4} = \\sqrt{25 \\cdot 2 \\cdot x^4} = 5x^2\\sqrt{2}$. (B) keeps 25 outside the root, (C) mishandles $x^4$, (D) drops the $\\sqrt{2}$.' },

  { id: 'M0105', skill: 'adv_exponential', difficulty: 3, type: 'mcq',
    stem: 'A culture of 200 bacteria doubles every 3 hours. Which function gives the population after $t$ hours?',
    choices: ['$P = 200(2)^{t/3}$', '$P = 200(2)^{3t}$', '$P = 200 + \\tfrac{2t}{3}$', '$P = 200(3)^{t/2}$'], answer: 'A',
    explanation: 'Doubling means base 2; "every 3 hours" places $t/3$ in the exponent: $P = 200(2)^{t/3}$. (B) triples the rate, (C) is linear, (D) uses the wrong base and exponent.' },

  { id: 'M0106', skill: 'adv_polynomial', difficulty: 2, type: 'mcq',
    stem: 'Which expression is equivalent to $(2x - 3)(x + 5)$?',
    choices: ['$2x^2 + 7x - 15$', '$2x^2 - 15$', '$2x^2 + 10x - 15$', '$2x^2 + 7x + 15$'], answer: 'A',
    explanation: 'FOIL: $2x \\cdot x + 2x \\cdot 5 - 3 \\cdot x - 3 \\cdot 5 = 2x^2 + 10x - 3x - 15 = 2x^2 + 7x - 15$. (C) forgets the $-3x$ term, (B) drops the middle terms, (D) has the wrong constant sign.' },

  { id: 'M0107', skill: 'adv_functions', difficulty: 2, type: 'spr',
    stem: 'If $f(x) = 2x^2 - 3x + 1$, what is the value of $f(3)$?',
    answer: '10',
    explanation: 'Substitute $x = 3$: $f(3) = 2(3)^2 - 3(3) + 1 = 18 - 9 + 1 = 10$.' },

  { id: 'M0108', skill: 'adv_rational', difficulty: 3, type: 'mcq',
    stem: 'If $\\dfrac{x}{x-2} = 3$, what is the value of $x$?',
    choices: ['2', '3', '4', '6'], answer: 'B',
    explanation: 'Multiply both sides by $(x-2)$: $x = 3(x-2) = 3x - 6$. Then $-2x = -6$, so $x = 3$. Check: $\\frac{3}{1} = 3$. ✓ (C) 4 gives $\\frac{4}{2}=2$; (A) 2 makes the denominator 0.' },
];

const QUESTIONS_MATH_PSDA = [
  { id: 'M0201', skill: 'psda_ratio', difficulty: 1, type: 'spr',
    stem: 'If 4 pencils cost \\$1.20, what is the cost, in dollars, of 10 pencils?',
    answer: '3',
    explanation: 'Unit price $= 1.20 \\div 4 = \\$0.30$ per pencil. Then $10 \\times 0.30 = \\$3.00$.' },

  { id: 'M0202', skill: 'psda_percent', difficulty: 2, type: 'mcq',
    stem: 'A jacket priced at \\$80 is discounted by 25%. What is the sale price?',
    choices: ['\\$55', '\\$60', '\\$65', '\\$75'], answer: 'B',
    explanation: 'A 25% discount keeps 75%: $80 \\times 0.75 = \\$60$. Equivalently, 25% of 80 is \\$20 off. (A) subtracts \\$25 instead of 25%; (C),(D) use the wrong percent.' },

  { id: 'M0203', skill: 'psda_percent', difficulty: 3, type: 'mcq',
    stem: 'A population grows from 250 to 320. What is the percent increase, to the nearest percent?',
    choices: ['22%', '28%', '35%', '70%'], answer: 'B',
    explanation: 'Percent increase $= \\frac{320 - 250}{250} = \\frac{70}{250} = 0.28 = 28\\%$. (A) divides by 320, (D) reports the raw difference 70, (C) is a rounding error.' },

  { id: 'M0204', skill: 'psda_stats', difficulty: 2, type: 'mcq',
    stem: 'For the data set 4, 8, 8, 10, 20, which statement is true?',
    choices: ['mean < median', 'mean = median', 'mean > median', 'mean = mode'], answer: 'C',
    explanation: 'Mean $= 50 \\div 5 = 10$; median (middle value) $= 8$; so mean > median — the outlier 20 pulls the mean up. The mode is 8, not equal to the mean, so the last option is false.' },

  { id: 'M0205', skill: 'psda_prob', difficulty: 2, type: 'mcq',
    stem: 'A bag has 5 red, 3 blue, and 2 green marbles. If one marble is drawn at random, what is the probability it is blue?',
    choices: ['$\\tfrac{3}{10}$', '$\\tfrac{3}{7}$', '$\\tfrac{1}{3}$', '$\\tfrac{2}{5}$'], answer: 'A',
    explanation: 'There are $5 + 3 + 2 = 10$ marbles and 3 are blue, so $P(\\text{blue}) = \\frac{3}{10}$. (B) uses 7 as the total, ignoring blue itself; (C),(D) miscount.' },

  { id: 'M0206', skill: 'psda_data', difficulty: 2, type: 'spr',
    stem: 'A survey found that 60% of 450 students walk to school. How many students walk to school?',
    answer: '270',
    explanation: '$0.60 \\times 450 = 270$ students.' },
];

const QUESTIONS_MATH_GEOTRIG = [
  { id: 'M0301', skill: 'geo_trig', difficulty: 2, type: 'mcq',
    stem: 'In a right triangle, the two legs have lengths 6 and 8. What is the length of the hypotenuse?',
    choices: ['10', '12', '14', '$\\sqrt{28}$'], answer: 'A',
    explanation: 'Pythagorean theorem: hypotenuse $= \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$ (a 6-8-10 triangle). (C) 14 just adds the legs; (D) subtracts instead of adds.' },

  { id: 'M0302', skill: 'geo_circles', difficulty: 3, type: 'mcq',
    stem: 'A circle in the $xy$-plane has equation $(x - 2)^2 + (y + 1)^2 = 25$. What is the radius of the circle?',
    choices: ['5', '25', '$\\sqrt{5}$', '10'], answer: 'A',
    explanation: 'In $(x - h)^2 + (y - k)^2 = r^2$, the right side equals $r^2$. Here $r^2 = 25$, so $r = 5$. (B) reports $r^2$; (C) takes an extra root; (D) doubles $r$.' },

  { id: 'M0303', skill: 'geo_volume', difficulty: 2, type: 'mcq',
    stem: 'A rectangular box has length 5, width 3, and height 4. What is its volume?',
    choices: ['12', '47', '60', '94'], answer: 'C',
    explanation: 'Volume $= l \\times w \\times h = 5 \\times 3 \\times 4 = 60$. (D) 94 is the surface area, (B) sums face pairs, (A) adds the dimensions.' },

  { id: 'M0304', skill: 'geo_angles', difficulty: 2, type: 'mcq',
    stem: 'In a triangle, two angles measure $50°$ and $70°$. What is the measure of the third angle?',
    choices: ['$40°$', '$50°$', '$60°$', '$120°$'], answer: 'C',
    explanation: 'The angles of a triangle sum to $180°$: $180 - 50 - 70 = 60°$. (D) 120 forgets to subtract from 180; (A),(B) mis-add.' },
];

/* All math questions in one array for the loader. */
const QUESTIONS_MATH = [].concat(
  QUESTIONS_MATH_ALGEBRA, QUESTIONS_MATH_ADVANCED, QUESTIONS_MATH_PSDA, QUESTIONS_MATH_GEOTRIG
);
