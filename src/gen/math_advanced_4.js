/* gen: math advanced batch 4 */
GEN_BANK.push(
  { id: 'GAD4-01', skill: 'adv_functions', difficulty: 1, type: 'mcq',
    stem: 'The function $f$ is defined by $f(x) = 2x^2 - 5$. What is the value of $f(3)$?',
    choices: ['1', '13', '23', '31'], answer: 'B',
    explanation: 'To evaluate, substitute 3 for $x$: $f(3) = 2(3)^2 - 5 = 2(9) - 5 = 18 - 5 = 13$. (A) 1 multiplies before squaring, using $2(3) - 5$. (C) 23 adds 5 instead of subtracting. (D) 31 squares the whole product $2x$ as $(2 \\cdot 3)^2 = 36$, then subtracts 5.' },

  { id: 'GAD4-02', skill: 'adv_functions', difficulty: 1, type: 'mcq',
    stem: 'The table below shows four values of the function $f$. When $x = 1$, $f(x) = 3$; when $x = 2$, $f(x) = 9$; when $x = 3$, $f(x) = 27$; and when $x = 4$, $f(x) = 81$. Which equation could define $f$?',
    choices: ['$f(x) = 3^x$', '$f(x) = x^3$', '$f(x) = 3x$', '$f(x) = x + 2$'], answer: 'A',
    explanation: 'Each output is a power of 3: $3^1 = 3$, $3^2 = 9$, $3^3 = 27$, and $3^4 = 81$, matching the table, so $f(x) = 3^x$. (B) $x^3$ gives $1, 8, 27, 64$ and matches only at $x = 3$. (C) $3x$ gives $3, 6, 9, 12$ and matches only at $x = 1$. (D) $x + 2$ gives $3, 4, 5, 6$ and matches only at $x = 1$.' },

  { id: 'GAD4-03', skill: 'adv_quadratic', difficulty: 1, type: 'mcq',
    stem: 'The function $f$ is defined by $f(x) = (x - 4)^2 + 3$. What are the coordinates of the vertex of the graph of $y = f(x)$ in the $xy$-plane?',
    choices: ['$(4, 3)$', '$(-4, 3)$', '$(4, -3)$', '$(-4, -3)$'], answer: 'A',
    explanation: 'A quadratic written in vertex form $f(x) = (x - h)^2 + k$ has its vertex at $(h, k)$. Here $h = 4$ and $k = 3$, so the vertex is $(4, 3)$. Because the coefficient of the squared term is positive, this vertex is the graph’s minimum point. (B) reads the sign of $h$ straight from the $-4$ inside the parentheses instead of solving $x - 4 = 0$. (C) flips the sign of $k$. (D) flips both signs.' },

  { id: 'GAD4-04', skill: 'adv_exponents', difficulty: 1, type: 'mcq',
    stem: 'Which of the following is equivalent to $x^6 \\cdot x^2$ for all positive values of $x$?',
    choices: ['$x^8$', '$x^{12}$', '$x^3$', '$x^4$'], answer: 'A',
    explanation: 'When multiplying powers with the same base, add the exponents: $x^6 \\cdot x^2 = x^{6+2} = x^8$. (B) $x^{12}$ multiplies the exponents. (C) $x^3$ divides them. (D) $x^4$ subtracts them.' },

  { id: 'GAD4-05', skill: 'adv_exponential', difficulty: 1, type: 'mcq',
    stem: 'A population of bacteria is modeled by the function $P(t) = 500(2)^t$, where $t$ is the number of hours since the population was first measured. What was the population when it was first measured?',
    choices: ['500', '1000', '2', '250'], answer: 'A',
    explanation: 'The population was first measured at $t = 0$. Substituting gives $P(0) = 500(2)^0 = 500(1) = 500$. (B) 1000 uses $t = 1$, the population after one hour. (C) 2 is the growth factor, the number the population is multiplied by each hour. (D) 250 incorrectly divides the starting amount by the growth factor.' },

  { id: 'GAD4-06', skill: 'adv_functions', difficulty: 2, type: 'mcq',
    stem: 'The functions $f$ and $g$ are defined by $f(x) = 3x + 1$ and $g(x) = x^2 - 2$. What is the value of $f(g(3))$?',
    choices: ['8', '20', '22', '28'], answer: 'C',
    explanation: 'Work from the inside out. First $g(3) = 3^2 - 2 = 9 - 2 = 7$. Then $f(7) = 3(7) + 1 = 21 + 1 = 22$. (A) 8 drops the coefficient 3, computing $7 + 1$. (B) 20 subtracts 1 instead of adding, computing $3(7) - 1$. (D) 28 omits the $-2$ in $g$, using $g(3) = 9$ and then $f(9) = 3(9) + 1 = 28$.' },

  { id: 'GAD4-07', skill: 'adv_functions', difficulty: 2, type: 'spr',
    stem: 'The function $f$ is defined by $f(x) = 2x^2 - 1$. If $f(a) = 49$ and $a > 0$, what is the value of $a$?',
    answer: '5',
    explanation: 'Set $2a^2 - 1 = 49$. Add 1 to both sides: $2a^2 = 50$. Divide by 2: $a^2 = 25$. Since $a > 0$, take the positive square root: $a = 5$.' },

  { id: 'GAD4-08', skill: 'adv_functions', difficulty: 2, type: 'mcq',
    stem: 'The graph of $y = f(x)$ is transformed to produce the graph of $y = f(x + 2) - 5$. Which of the following describes how the graph of $f$ is shifted?',
    choices: ['Left 2 units and down 5 units', 'Right 2 units and down 5 units', 'Left 2 units and up 5 units', 'Right 2 units and up 5 units'], answer: 'A',
    explanation: 'Replacing $x$ with $x + 2$ shifts the graph horizontally in the direction opposite the sign — that is, left 2 units. Subtracting 5 from the entire function lowers every output, shifting the graph down 5 units. (B) treats $x + 2$ as a rightward shift. (C) treats $-5$ as an upward shift. (D) reverses both directions.' },

  { id: 'GAD4-09', skill: 'adv_quadratic', difficulty: 2, type: 'mcq',
    stem: 'A ball is launched upward from the ground. Its height above the ground, in feet, after $t$ seconds is given by $h(t) = -16t^2 + 64t$. What is the maximum height, in feet, that the ball reaches?',
    choices: ['0', '48', '64', '128'], answer: 'C',
    explanation: 'The graph of $h$ is a downward-opening parabola, so its maximum occurs at the vertex. The $t$-coordinate of the vertex is $t = -\\frac{64}{2(-16)} = 2$ seconds. Then $h(2) = -16(2)^2 + 64(2) = -64 + 128 = 64$ feet. (A) 0 is the height when the ball is on the ground, at launch or landing. (B) 48 is the height at $t = 1$, before the maximum. (D) 128 ignores the $-16t^2$ term, using only $64(2)$.' },

  { id: 'GAD4-10', skill: 'adv_quadratic', difficulty: 2, type: 'spr',
    stem: 'A rectangular garden has a length that is 3 meters longer than its width. The area of the garden is 40 square meters. What is the width, in meters, of the garden?',
    answer: '5',
    explanation: 'Let $w$ be the width in meters; the length is $w + 3$. The area equation is $w(w + 3) = 40$, or $w^2 + 3w - 40 = 0$. Factoring gives $(w - 5)(w + 8) = 0$, so $w = 5$ or $w = -8$. A width must be positive, so $w = 5$ meters. (Check: length $5 + 3 = 8$, and $5 \\times 8 = 40$.)' },

  { id: 'GAD4-11', skill: 'adv_exponents', difficulty: 2, type: 'mcq',
    stem: 'Which of the following is equivalent to $\\sqrt{16x^{10}}$ for $x > 0$?',
    choices: ['$4x^5$', '$8x^5$', '$4x^{10}$', '$16x^5$'], answer: 'A',
    explanation: 'A square root applies to each factor: $\\sqrt{16} = 4$ and $\\sqrt{x^{10}} = x^{10/2} = x^5$, giving $4x^5$. (B) uses $\\sqrt{16} = 8$, taking half of 16 rather than its square root. (C) leaves the exponent as $x^{10}$ instead of halving it. (D) forgets to take the square root of 16.' },

  { id: 'GAD4-12', skill: 'adv_exponential', difficulty: 2, type: 'mcq',
    stem: 'The value of an investment, in dollars, is modeled by $V(t) = 8000(1.05)^t$, where $t$ is the number of years after the investment was made. Which statement best describes how the value of the investment changes?',
    choices: ['The value increases by 5% each year.', 'The value increases by \\$5 each year.', 'The value increases by 105% each year.', 'The value decreases by 5% each year.'], answer: 'A',
    explanation: 'In an exponential model $a(b)^t$, the base $b = 1.05$ equals $1 + 0.05$, a 5% increase applied each year. (B) confuses a percent change with a fixed dollar amount. (C) 105% is the growth factor expressed as a percent, not the increase; the increase is only 5%. (D) because the base is greater than 1, the value grows rather than decays.' },

  { id: 'GAD4-13', skill: 'adv_polynomial', difficulty: 2, type: 'mcq',
    stem: 'The function $f$ is defined by $f(x) = x^2 - x - 12$. What are the $x$-coordinates of the $x$-intercepts of the graph of $y = f(x)$?',
    choices: ['$x = 4$ and $x = -3$', '$x = -4$ and $x = 3$', '$x = 4$ and $x = 3$', '$x = -4$ and $x = -3$'], answer: 'A',
    explanation: 'The $x$-intercepts occur where $f(x) = 0$. Factor: $x^2 - x - 12 = (x - 4)(x + 3)$. Setting each factor equal to zero gives $x = 4$ and $x = -3$. (Check: the roots sum to $4 + (-3) = 1$, matching $-(-1)$, and multiply to $-12$.) (B) reverses both signs. (C) makes both positive. (D) makes both negative.' },

  { id: 'GAD4-14', skill: 'adv_rational', difficulty: 2, type: 'spr',
    stem: 'If $\\frac{x}{x - 3} = \\frac{5}{2}$, what is the value of $x$?',
    answer: '5',
    explanation: 'Cross-multiply: $2x = 5(x - 3)$. Distribute: $2x = 5x - 15$. Subtract $5x$ from both sides: $-3x = -15$. Divide by $-3$: $x = 5$. (Check: $\\frac{5}{5 - 3} = \\frac{5}{2}$.)' },

  { id: 'GAD4-15', skill: 'adv_functions', difficulty: 3, type: 'mcq',
    stem: 'The graph of $y = g(x)$ is produced from the graph of $y = f(x)$ by the equation $g(x) = -f(x) + 3$. Which of the following describes this transformation?',
    choices: ['Reflection across the $x$-axis, then a shift up 3 units', 'Reflection across the $y$-axis, then a shift up 3 units', 'Reflection across the $x$-axis, then a shift down 3 units', 'Reflection across the $x$-axis, then a shift right 3 units'], answer: 'A',
    explanation: 'Multiplying the entire function by $-1$ (the $-f(x)$) negates every output, reflecting the graph across the $x$-axis. Adding 3 then raises every point, a shift up 3 units. (B) a $y$-axis reflection would replace $x$ with $-x$, written $f(-x)$, not $-f(x)$. (C) adding $+3$ shifts up, not down. (D) adding a constant shifts vertically, not horizontally.' },

  { id: 'GAD4-16', skill: 'adv_functions', difficulty: 3, type: 'mcq',
    stem: 'The functions $f$ and $g$ are defined by $f(x) = x^2 + 1$ and $g(x) = x - 3$. Which of the following is equivalent to $f(g(x))$?',
    choices: ['$x^2 - 6x + 10$', '$x^2 - 8$', '$x^2 - 2$', '$x^2 - 6x + 9$'], answer: 'A',
    explanation: 'Substitute $g(x) = x - 3$ into $f$: $f(g(x)) = (x - 3)^2 + 1$. Expand $(x - 3)^2 = x^2 - 6x + 9$, then add 1 to get $x^2 - 6x + 10$. (B) wrongly expands $(x - 3)^2$ as $x^2 - 9$, giving $x^2 - 8$. (C) $x^2 - 2$ computes $g(f(x))$, the reverse composition. (D) $x^2 - 6x + 9$ forgets to add the 1.' },

  { id: 'GAD4-17', skill: 'adv_quadratic', difficulty: 3, type: 'spr',
    stem: 'In the equation $x^2 + 8x + c = 0$, $c$ is a constant. If the equation has exactly one real solution, what is the value of $c$?',
    answer: '16',
    explanation: 'A quadratic $ax^2 + bx + c = 0$ has exactly one real solution when its discriminant $b^2 - 4ac$ equals 0. Here $a = 1$ and $b = 8$, so $8^2 - 4(1)c = 0$, giving $64 - 4c = 0$ and $c = 16$.' },

  { id: 'GAD4-18', skill: 'adv_polynomial', difficulty: 3, type: 'mcq',
    stem: 'For a polynomial function $p$, it is known that $p(3) = -2$. Which of the following must be true?',
    choices: ['The remainder when $p(x)$ is divided by $x - 3$ is $-2$.', '$x - 3$ is a factor of $p(x)$.', '$x + 3$ is a factor of $p(x)$.', 'The remainder when $p(x)$ is divided by $x + 3$ is $-2$.'], answer: 'A',
    explanation: 'By the remainder theorem, the remainder when a polynomial $p(x)$ is divided by $x - a$ equals $p(a)$. Since $p(3) = -2$, dividing by $x - 3$ leaves a remainder of $-2$. (B) $x - 3$ would be a factor only if $p(3) = 0$. (C) and (D) involve $x + 3$, which corresponds to $a = -3$ and the value $p(-3)$, not $p(3)$.' },

  { id: 'GAD4-19', skill: 'adv_rational', difficulty: 3, type: 'mcq',
    stem: 'What is the solution set of the equation $\\sqrt{x + 6} = x$?',
    choices: ['$x = 3$', '$x = -2$', '$x = 3$ and $x = -2$', '$x = -3$ and $x = 2$'], answer: 'A',
    explanation: 'Square both sides: $x + 6 = x^2$, so $x^2 - x - 6 = 0$ and $(x - 3)(x + 2) = 0$, giving $x = 3$ or $x = -2$. Each candidate must be checked in the original equation. For $x = 3$: $\\sqrt{9} = 3$, true. For $x = -2$: $\\sqrt{4} = 2$, but the right side is $-2$, so it is extraneous. Only $x = 3$ works. (B) selects the extraneous root. (C) keeps both without checking. (D) factors incorrectly.' },

  { id: 'GAD4-20', skill: 'adv_exponential', difficulty: 3, type: 'spr',
    stem: 'A radioactive sample has a mass of 240 grams. Its mass, in grams, is modeled by $m(t) = 240\\left(\\frac{1}{2}\\right)^{\\frac{t}{6}}$, where $t$ is the number of years since the mass was 240 grams. After how many years will the sample have a mass of 30 grams?',
    answer: '18',
    explanation: 'Set $240\\left(\\frac{1}{2}\\right)^{\\frac{t}{6}} = 30$ and divide both sides by 240: $\\left(\\frac{1}{2}\\right)^{\\frac{t}{6}} = \\frac{30}{240} = \\frac{1}{8}$. Since $\\frac{1}{8} = \\left(\\frac{1}{2}\\right)^3$, the exponents match: $\\frac{t}{6} = 3$, so $t = 18$. Equivalently, the mass halves every 6 years: $240 \\to 120 \\to 60 \\to 30$ is three halvings, or 18 years.' },

  { id: 'GAD4-21', skill: 'adv_functions', difficulty: 3, type: 'mcq',
    stem: 'The polynomial function $f$ is defined by $f(x) = -2x^3 + 5x - 1$. Which of the following describes the end behavior of the graph of $y = f(x)$ in the $xy$-plane?',
    choices: ['As $x \\to \\infty$, $f(x) \\to -\\infty$, and as $x \\to -\\infty$, $f(x) \\to \\infty$.', 'As $x \\to \\infty$, $f(x) \\to \\infty$, and as $x \\to -\\infty$, $f(x) \\to -\\infty$.', 'As $x \\to \\infty$, $f(x) \\to \\infty$, and as $x \\to -\\infty$, $f(x) \\to \\infty$.', 'As $x \\to \\infty$, $f(x) \\to -\\infty$, and as $x \\to -\\infty$, $f(x) \\to -\\infty$.'], answer: 'A',
    explanation: 'End behavior is governed by the leading term, $-2x^3$. The degree 3 is odd and the leading coefficient $-2$ is negative, so the graph falls on the right and rises on the left: as $x \\to \\infty$, $f(x) \\to -\\infty$, and as $x \\to -\\infty$, $f(x) \\to \\infty$. (B) describes a positive leading coefficient with odd degree. (C) describes an even degree with a positive leading coefficient, where both ends go up. (D) describes an even degree with a negative leading coefficient, where both ends go down.' }
);
