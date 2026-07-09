/* gen: lessons advanced */
GEN_LESSONS.push(
  { skill: 'adv_quadratic',
    concept: [
      'A quadratic equation has the form $ax^2 + bx + c = 0$, where $a\\neq0$. Three tools solve almost anything: factoring (fastest when it works), the quadratic formula (always works), and completing the square (best for finding a vertex).',
      'To factor $x^2 + bx + c$, find two numbers that multiply to $c$ and add to $b$. When factoring is awkward, use the quadratic formula $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$. The part under the root, $b^2 - 4ac$, is the discriminant: positive gives two real solutions, zero gives exactly one, and negative gives none.',
      'The graph of a quadratic is a parabola. Its vertex sits on the axis of symmetry $x = -\\frac{b}{2a}$; plug that $x$ back in to get the $y$-value. Completing the square rewrites the equation as $y = a(x-h)^2 + k$, which shows the vertex $(h, k)$ directly.'
    ],
    examples: [
      { q: 'Solve $x^2 - 5x + 6 = 0$ by factoring.',
        steps: ['Find two numbers that multiply to $6$ and add to $-5$: they are $-2$ and $-3$.', 'Factor: $(x-2)(x-3) = 0$.', 'Set each factor to zero: $x = 2$ or $x = 3$.', 'Check: $2^2 - 5(2) + 6 = 0$ and $3^2 - 5(3) + 6 = 0$.'] },
      { q: 'Solve $2x^2 + 3x - 5 = 0$ with the quadratic formula.',
        steps: ['Identify $a = 2$, $b = 3$, $c = -5$.', 'Discriminant: $b^2 - 4ac = 3^2 - 4(2)(-5) = 9 + 40 = 49$.', 'Apply the formula: $x = \\frac{-3 \\pm \\sqrt{49}}{2(2)} = \\frac{-3 \\pm 7}{4}$.', 'So $x = \\frac{4}{4} = 1$ or $x = \\frac{-10}{4} = -\\frac{5}{2}$.'] },
      { q: 'Find the vertex of $y = x^2 - 6x + 5$ by completing the square.',
        steps: ['Take half of $-6$ and square it: $(-3)^2 = 9$.', 'Rewrite: $y = (x^2 - 6x + 9) - 9 + 5 = (x-3)^2 - 4$.', 'The vertex form $y = (x-3)^2 - 4$ shows the vertex is $(3, -4)$.', 'Check with $x = -\\frac{b}{2a} = \\frac{6}{2} = 3$, then $y = 3^2 - 6(3) + 5 = -4$.'] }
    ],
    traps: [
      'Taking a square root without the $\\pm$, which drops one of the two solutions.',
      'Sign slips when factoring: the two numbers must multiply to $c$ and add to $b$, signs included.',
      'Forgetting that the whole numerator $-b \\pm \\sqrt{b^2-4ac}$ is divided by $2a$, not just part of it.'
    ] },

  { skill: 'adv_exponents',
    concept: [
      'Exponent rules all come from repeated multiplication. Same base, multiply: add the exponents, $x^a \\cdot x^b = x^{a+b}$. Same base, divide: subtract them, $\\frac{x^a}{x^b} = x^{a-b}$. Power of a power: multiply them, $(x^a)^b = x^{ab}$.',
      'A negative exponent means reciprocal: $x^{-n} = \\frac{1}{x^n}$. A fractional exponent means a root: $x^{1/n} = \\sqrt[n]{x}$, and $x^{m/n} = (\\sqrt[n]{x})^m$ — take the root first, then raise to the power.',
      'To simplify a radical, pull out perfect-square factors using $\\sqrt{ab} = \\sqrt{a}\\sqrt{b}$. Hunt for the largest perfect square hiding inside the number.'
    ],
    examples: [
      { q: 'Simplify $\\frac{x^5 \\cdot x^2}{x^3}$.',
        steps: ['Multiply on top by adding exponents: $x^5 \\cdot x^2 = x^{7}$.', 'Divide by subtracting exponents: $\\frac{x^7}{x^3} = x^{7-3} = x^4$.'] },
      { q: 'Evaluate $27^{-2/3}$.',
        steps: ['A negative exponent flips it: $27^{-2/3} = \\frac{1}{27^{2/3}}$.', 'Root first: $27^{1/3} = 3$. Then power: $3^2 = 9$.', 'So $27^{-2/3} = \\frac{1}{9}$.'] },
      { q: 'Simplify $\\sqrt{72}$.',
        steps: ['Find the largest perfect-square factor: $72 = 36 \\cdot 2$.', 'Split the radical: $\\sqrt{72} = \\sqrt{36}\\sqrt{2} = 6\\sqrt{2}$.'] }
    ],
    traps: [
      'Multiplying the exponents when the bases are multiplied — $x^a \\cdot x^b = x^{a+b}$, not $x^{ab}$.',
      'Reading a negative exponent as a negative sign; $x^{-2} = \\frac{1}{x^2}$, a positive quantity.',
      'Splitting a radical over addition: $\\sqrt{a+b} \\neq \\sqrt{a} + \\sqrt{b}$.'
    ] },

  { skill: 'adv_exponential',
    concept: [
      'An exponential model has the form $y = a \\cdot b^x$. The initial value $a$ is the amount when $x = 0$; the base $b$ is the constant factor multiplied once for each step of $x$.',
      'Percent change becomes that multiplier. A growth of $r\\%$ gives $b = 1 + \\frac{r}{100}$ (so $8\\%$ growth means $b = 1.08$); a decay of $r\\%$ gives $b = 1 - \\frac{r}{100}$ (so $15\\%$ decay means $b = 0.85$).',
      'If $b > 1$ the quantity grows; if $0 < b < 1$ it decays. The base is always a multiplier, never the raw percent — $8\\%$ growth is $1.08$, not $0.08$.'
    ],
    examples: [
      { q: 'A \\$1000 deposit grows $10\\%$ per year. What is it worth after 2 years?',
        steps: ['Turn $10\\%$ growth into a multiplier: $b = 1 + 0.10 = 1.10$.', 'Model the value: $V = 1000(1.10)^t$.', 'After 2 years: $V = 1000(1.10)^2 = 1000(1.21) = 1210$, so it is worth \\$1210.'] },
      { q: 'A car worth \\$20,000 loses $15\\%$ of its value each year. Write a model, then find its value after 1 year.',
        steps: ['Turn $15\\%$ decay into a multiplier: $b = 1 - 0.15 = 0.85$.', 'Model the value: $V = 20000(0.85)^t$.', 'After 1 year: $V = 20000(0.85) = 17000$, so it is worth \\$17,000.'] },
      { q: 'A colony of 400 bacteria doubles every hour. How many are there after 3 hours?',
        steps: ['Doubling means the multiplier is $b = 2$ (a $100\\%$ increase each hour).', 'Model the count: $N = 400(2)^t$.', 'After 3 hours: $N = 400(2)^3 = 400(8) = 3200$.'] }
    ],
    traps: [
      'Using the raw percent as the base — $8\\%$ growth is a multiplier of $1.08$, not $0.08$.',
      'Mixing up the initial value $a$ with the base $b$ in $y = a \\cdot b^x$.',
      'For decay, using $1 + r$ instead of $1 - r$; a $15\\%$ drop means multiplying by $0.85$.'
    ] },

  { skill: 'adv_polynomial',
    concept: [
      'To expand two binomials, use FOIL — First, Outer, Inner, Last — then combine like terms: $(x+a)(x+b) = x^2 + (a+b)x + ab$. Factoring runs this same process in reverse.',
      'Always factor out the greatest common factor (GCF) first. With four terms, try grouping: pair the terms, factor each pair, and pull out the shared binomial.',
      'Memorize the difference of squares: $a^2 - b^2 = (a-b)(a+b)$. A sum of squares $a^2 + b^2$ does not factor over the real numbers.'
    ],
    examples: [
      { q: 'Expand $(2x - 3)(x + 4)$.',
        steps: ['First: $2x \\cdot x = 2x^2$. Outer: $2x \\cdot 4 = 8x$.', 'Inner: $-3 \\cdot x = -3x$. Last: $-3 \\cdot 4 = -12$.', 'Combine like terms: $2x^2 + 8x - 3x - 12 = 2x^2 + 5x - 12$.'] },
      { q: 'Factor $2x^3 - 8x$ completely.',
        steps: ['Factor out the GCF $2x$: $2x(x^2 - 4)$.', 'Recognize $x^2 - 4$ as a difference of squares: $x^2 - 4 = (x-2)(x+2)$.', 'Complete factorization: $2x(x-2)(x+2)$.'] },
      { q: 'Factor $x^3 + 2x^2 + 3x + 6$ by grouping.',
        steps: ['Group in pairs: $(x^3 + 2x^2) + (3x + 6)$.', 'Factor each pair: $x^2(x + 2) + 3(x + 2)$.', 'Pull out the shared factor $(x+2)$: $(x + 2)(x^2 + 3)$.'] }
    ],
    traps: [
      'Forgetting the middle term when squaring a binomial: $(x+a)^2 = x^2 + 2ax + a^2$, not $x^2 + a^2$.',
      'Not pulling out the GCF first, so the factoring is left incomplete.',
      'Trying to factor a sum of squares $a^2 + b^2$, which has no real factorization.'
    ] },

  { skill: 'adv_rational',
    concept: [
      'To solve a rational equation, multiply every term by the least common denominator to clear the fractions, then solve the equation that remains. For a radical equation, isolate the radical and square both sides.',
      'Clearing denominators and squaring can both create extraneous solutions — values that solve the new equation but not the original. Any value that makes a denominator zero, or that fails when substituted back, must be thrown out.',
      'Build the safe habit: solve, then check every candidate in the original equation. Keep only the ones that truly work.'
    ],
    examples: [
      { q: 'Solve $\\frac{x}{x-3} = \\frac{3}{x-3} + 2$.',
        steps: ['Multiply every term by $(x-3)$: $x = 3 + 2(x-3)$.', 'Expand and simplify: $x = 3 + 2x - 6 = 2x - 3$.', 'Solve: $-x = -3$, so $x = 3$.', 'Check: $x = 3$ makes the denominator $x - 3 = 0$, so it is extraneous. There is no solution.'] },
      { q: 'Solve $\\sqrt{x + 7} = x + 1$.',
        steps: ['Square both sides: $x + 7 = (x+1)^2 = x^2 + 2x + 1$.', 'Rearrange: $x^2 + x - 6 = 0$, so $(x+3)(x-2) = 0$.', 'Candidates: $x = -3$ or $x = 2$.', 'Check: $x = 2$ gives $\\sqrt{9} = 3 = 2 + 1$ (works); $x = -3$ gives $\\sqrt{4} = 2 \\neq -2$ (extraneous). Solution: $x = 2$.'] },
      { q: 'Solve $\\frac{12}{x} - \\frac{12}{x+1} = 1$.',
        steps: ['Multiply every term by $x(x+1)$: $12(x+1) - 12x = x(x+1)$.', 'Simplify the left side: $12 = x^2 + x$.', 'Solve $x^2 + x - 12 = 0$: $(x+4)(x-3) = 0$, so $x = -4$ or $x = 3$.', 'Check: neither makes a denominator zero, and both satisfy the original. Solutions: $x = -4$ and $x = 3$.'] }
    ],
    traps: [
      'Skipping the extraneous-solution check after squaring or clearing denominators.',
      'Squaring term by term: $(x+1)^2 = x^2 + 2x + 1$, not $x^2 + 1$.',
      'Keeping a solution that makes a denominator zero — that is never allowed.'
    ] },

  { skill: 'adv_functions',
    concept: [
      'Function notation $f(x)$ names a rule: it is the output when you feed in the input $x$. It is not $f$ times $x$. To find $f(3)$, replace every $x$ in the rule with $3$ and simplify.',
      'A composition $f(g(x))$ means do $g$ first, then feed its output into $f$. Always work from the inside out: evaluate the inner function, then the outer one.',
      'Reading a nonlinear graph: the zeros (or $x$-intercepts) are where the graph crosses the $x$-axis, that is, where $y = 0$; the $y$-intercept is where $x = 0$. A parabola’s vertex is its highest or lowest point, and it sits halfway between the two zeros.'
    ],
    examples: [
      { q: 'If $f(x) = x^2 - 3x + 2$, find $f(-2)$.',
        steps: ['Replace every $x$ with $-2$: $f(-2) = (-2)^2 - 3(-2) + 2$.', 'Simplify: $4 + 6 + 2 = 12$.'] },
      { q: 'If $f(x) = 2x + 1$ and $g(x) = x^2$, find $f(g(3))$.',
        steps: ['Work inside first: $g(3) = 3^2 = 9$.', 'Feed that into $f$: $f(9) = 2(9) + 1 = 19$.'] },
      { q: 'A parabola crosses the $x$-axis at $(-1, 0)$ and $(5, 0)$. What is the $x$-coordinate of its vertex?',
        steps: ['The zeros are $x = -1$ and $x = 5$.', 'The vertex sits halfway between the zeros: $x = \\frac{-1 + 5}{2} = 2$.'] }
    ],
    traps: [
      'Reading $f(x)$ as multiplication instead of a function evaluated at $x$.',
      'In a composition $f(g(x))$, working outer-first instead of inner-first.',
      'Confusing the zeros ($x$-intercepts, where $y = 0$) with the $y$-intercept (where $x = 0$).'
    ] }
);
