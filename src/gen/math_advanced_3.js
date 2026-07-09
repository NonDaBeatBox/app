/* gen: math advanced batch 3 */
GEN_BANK.push(
  { id: 'GAD3-01', skill: 'adv_polynomial', difficulty: 1, type: 'mcq',
    stem: 'Which expression is equivalent to $(x + 4)(x + 7)$?',
    choices: ['$x^2 + 28x + 11$', '$x^2 + 28$', '$x^2 + 11x + 28$', '$x^2 + 11x + 11$'], answer: 'C',
    explanation: 'FOIL: $x \\cdot x + x \\cdot 7 + 4 \\cdot x + 4 \\cdot 7 = x^2 + 7x + 4x + 28 = x^2 + 11x + 28$. (A) swaps the middle coefficient and the constant; (B) keeps only the first and last products, dropping both middle terms; (D) adds $4 + 7$ for the constant instead of multiplying $4 \\cdot 7$.' },

  { id: 'GAD3-02', skill: 'adv_polynomial', difficulty: 1, type: 'mcq',
    stem: 'Which expression is the complete factorization of $6x^2 + 15x$?',
    choices: ['$3x(2x + 5)$', '$3(2x^2 + 5x)$', '$x(6x + 15)$', '$2x(3x + 5)$'], answer: 'A',
    explanation: 'The greatest common factor of $6x^2$ and $15x$ is $3x$. Dividing each term by $3x$ gives $2x$ and $5$, so $6x^2 + 15x = 3x(2x + 5)$. (B) pulls out only $3$, leaving a factor that still contains $x$; (C) pulls out only $x$, leaving a common factor of $3$; (D) uses $2x$, but $2x(3x + 5) = 6x^2 + 10x$, not the original.' },

  { id: 'GAD3-03', skill: 'adv_polynomial', difficulty: 1, type: 'mcq',
    stem: 'Which expression is equivalent to $x^2 - 49$?',
    choices: ['$(x - 7)(x - 7)$', '$(x - 7)(x + 7)$', '$(x + 7)(x + 7)$', '$(x - 49)(x + 1)$'], answer: 'B',
    explanation: 'This is a difference of squares: $x^2 - 49 = x^2 - 7^2 = (x - 7)(x + 7)$. (A) and (C) are perfect-square forms that expand to $x^2 - 14x + 49$ and $x^2 + 14x + 49$, each with an unwanted middle term; (D) multiplies out to $x^2 - 48x - 49$.' },

  { id: 'GAD3-04', skill: 'adv_exponents', difficulty: 1, type: 'mcq',
    stem: 'Which expression is equivalent to $x^3 \\cdot x^5$?',
    choices: ['$x^{15}$', '$x^2$', '$2x^8$', '$x^8$'], answer: 'D',
    explanation: 'When multiplying powers with the same base, add the exponents: $x^{3+5} = x^8$. (A) multiplies the exponents, which is the rule for a power raised to a power; (B) subtracts them, which is the division rule; (C) invents a coefficient of $2$ — the bases combine, they are not counted.' },

  { id: 'GAD3-05', skill: 'adv_functions', difficulty: 1, type: 'spr',
    stem: 'The function $g$ is defined by $g(x) = x^2 - 4x + 5$. What is the value of $g(2)$?',
    answer: '1',
    explanation: 'Substitute $x = 2$: $g(2) = (2)^2 - 4(2) + 5 = 4 - 8 + 5 = 1$.' },

  { id: 'GAD3-06', skill: 'adv_polynomial', difficulty: 2, type: 'mcq',
    stem: 'Which expression is equivalent to $(2x - 3)(x - 5)$?',
    choices: ['$2x^2 - 13x - 15$', '$2x^2 - 10x + 15$', '$2x^2 - 13x + 15$', '$2x^2 + 13x + 15$'], answer: 'C',
    explanation: 'FOIL: $(2x)(x) + (2x)(-5) + (-3)(x) + (-3)(-5) = 2x^2 - 10x - 3x + 15 = 2x^2 - 13x + 15$. (A) mishandles $(-3)(-5)$, which is $+15$; (B) forgets the $-3x$ term; (D) uses the wrong sign on the middle term.' },

  { id: 'GAD3-07', skill: 'adv_polynomial', difficulty: 2, type: 'mcq',
    stem: 'Which expression is equivalent to $x^3 + 2x^2 + 3x + 6$?',
    choices: ['$(x + 3)(x^2 + 2)$', '$(x + 2)(x^2 + 3)$', '$(x + 2)(x^2 - 3)$', '$(x + 6)(x^2 + 1)$'], answer: 'B',
    explanation: 'Factor by grouping: $x^3 + 2x^2 + 3x + 6 = x^2(x + 2) + 3(x + 2) = (x + 2)(x^2 + 3)$. (A) swaps the constants inside the two factors and expands to $x^3 + 3x^2 + 2x + 6$; (C) uses $-3$, but the common group is $+3$; (D) does not multiply back to the original polynomial.' },

  { id: 'GAD3-08', skill: 'adv_exponential', difficulty: 2, type: 'mcq',
    stem: 'A population of 5,000 organisms decreases by 12% each year. Which function models the population $P$ after $t$ years?',
    choices: ['$P = 5000(0.88)^t$', '$P = 5000(1.12)^t$', '$P = 5000(0.12)^t$', '$P = 5000 - 0.12t$'], answer: 'A',
    explanation: 'A 12% yearly decrease multiplies the population by $1 - 0.12 = 0.88$ each year, giving $P = 5000(0.88)^t$. (B) uses $1.12$, which models 12% growth; (C) uses $0.12$, which would remove 88% of the population each step; (D) is linear and does not capture a constant percent change.' },

  { id: 'GAD3-09', skill: 'adv_rational', difficulty: 2, type: 'mcq',
    stem: 'For $x > 0$, which expression is equivalent to $\\dfrac{x^2 - 9}{x^2 + 7x + 12}$?',
    choices: ['$\\frac{x - 3}{x - 4}$', '$\\frac{-9}{7x + 12}$', '$\\frac{x + 3}{x + 4}$', '$\\frac{x - 3}{x + 4}$'], answer: 'D',
    explanation: 'Factor both parts: $x^2 - 9 = (x - 3)(x + 3)$ and $x^2 + 7x + 12 = (x + 3)(x + 4)$. Cancel the common factor $(x + 3)$: $\\frac{x - 3}{x + 4}$. (A) has the wrong sign in the denominator; (B) illegally cancels the $x^2$ terms and the constants separately; (C) cancels $(x - 3)$ instead of the common $(x + 3)$.' },

  { id: 'GAD3-10', skill: 'adv_rational', difficulty: 2, type: 'spr',
    stem: 'What value of $x$ satisfies $\\dfrac{2}{x} + \\dfrac{1}{3} = \\dfrac{5}{x}$?',
    answer: '9',
    explanation: 'Subtract $\\frac{2}{x}$ from both sides: $\\frac{1}{3} = \\frac{5}{x} - \\frac{2}{x} = \\frac{3}{x}$. Cross-multiply: $x = 9$. Check: $\\frac{2}{9} + \\frac{1}{3} = \\frac{2}{9} + \\frac{3}{9} = \\frac{5}{9}$, which equals $\\frac{5}{9}$.' },

  { id: 'GAD3-11', skill: 'adv_rational', difficulty: 2, type: 'mcq',
    stem: 'Which expression is equivalent to $\\dfrac{3}{x} + \\dfrac{2}{x + 1}$?',
    choices: ['$\\frac{5}{2x + 1}$', '$\\frac{5x + 3}{x^2 + x}$', '$\\frac{5x + 3}{2x + 1}$', '$\\frac{6}{x^2 + x}$'], answer: 'B',
    explanation: 'Use the common denominator $x(x + 1)$: $\\frac{3}{x} = \\frac{3(x + 1)}{x(x + 1)}$ and $\\frac{2}{x + 1} = \\frac{2x}{x(x + 1)}$. Add the numerators: $3(x + 1) + 2x = 5x + 3$, over $x(x + 1) = x^2 + x$. (A) adds numerators and denominators straight across; (C) keeps the correct numerator but wrongly adds the denominators; (D) multiplies the numerators instead of building a common denominator.' },

  { id: 'GAD3-12', skill: 'adv_quadratic', difficulty: 2, type: 'mcq',
    stem: 'What are all solutions to $x^2 + 3x - 10 = 0$?',
    choices: ['$x = 5$ and $x = -2$', '$x = -5$ and $x = -2$', '$x = -5$ and $x = 2$', '$x = 5$ and $x = 2$'], answer: 'C',
    explanation: 'Factor: $x^2 + 3x - 10 = (x + 5)(x - 2) = 0$, so $x = -5$ or $x = 2$. (A) flips both signs, which would solve $x^2 - 3x - 10 = 0$; (B) uses two negatives, giving a product of $+10$; (D) uses two positives, giving a sum of $+7$.' },

  { id: 'GAD3-13', skill: 'adv_exponents', difficulty: 2, type: 'mcq',
    stem: 'What is the value of $16^{3/4}$?',
    choices: ['12', '8', '64', '48'], answer: 'B',
    explanation: 'A rational exponent means take the root, then the power: $16^{3/4} = \\left(16^{1/4}\\right)^3 = 2^3 = 8$, since the fourth root of 16 is 2. (A) multiplies $16$ by $\\frac{3}{4}$; (C) uses the square root of 16, giving $4^3 = 64$; (D) multiplies $16$ by $3$, ignoring the denominator of the exponent.' },

  { id: 'GAD3-14', skill: 'adv_exponential', difficulty: 2, type: 'mcq',
    stem: 'A \\$1,500 investment grows 4% per year, compounded annually. Which function gives the value $V$, in dollars, after $t$ years?',
    choices: ['$V = 1500(1.04)^t$', '$V = 1500(0.04)^t$', '$V = 1500(1.4)^t$', '$V = 1500 + 60t$'], answer: 'A',
    explanation: 'A 4% annual increase multiplies the balance by $1 + 0.04 = 1.04$ each year: $V = 1500(1.04)^t$. (B) uses $0.04$, which models rapid decay; (C) uses $1.4$, a 40% rate; (D) adds a flat \\$60 per year, which is linear rather than exponential.' },

  { id: 'GAD3-15', skill: 'adv_functions', difficulty: 3, type: 'spr',
    stem: 'The function $f$ is defined by $f(x) = x^2 + 2x$. If $f(a) = 15$ and $a > 0$, what is the value of $a$?',
    answer: '3',
    explanation: 'Set $x^2 + 2x = 15$, so $x^2 + 2x - 15 = 0$. Factor: $(x + 5)(x - 3) = 0$, giving $x = -5$ or $x = 3$. Since $a > 0$, the value is $a = 3$.' },

  { id: 'GAD3-16', skill: 'adv_rational', difficulty: 3, type: 'mcq',
    stem: 'What is the solution to $\\sqrt{x + 6} = x$?',
    choices: ['$x = -2$ only', '$x = 3$ and $x = -2$', 'There are no real solutions', '$x = 3$ only'], answer: 'D',
    explanation: 'Square both sides: $x + 6 = x^2$, so $x^2 - x - 6 = 0$ and $(x - 3)(x + 2) = 0$, giving candidates $x = 3$ and $x = -2$. Check in the original: $\\sqrt{3 + 6} = 3$ works, but $\\sqrt{-2 + 6} = 2 \\neq -2$, so $x = -2$ is extraneous. Only $x = 3$ is valid. (A) keeps the extraneous root and drops the valid one; (B) keeps both without checking; (C) discards a genuine solution.' },

  { id: 'GAD3-17', skill: 'adv_polynomial', difficulty: 3, type: 'mcq',
    stem: 'Which expression is equivalent to $6x^2 + x - 15$?',
    choices: ['$(3x + 5)(2x - 3)$', '$(3x - 5)(2x + 3)$', '$(6x - 5)(x + 3)$', '$(3x + 5)(2x + 3)$'], answer: 'A',
    explanation: 'Use the ac-method: $6 \\cdot (-15) = -90$, and $+10$ and $-9$ multiply to $-90$ and add to $+1$. Split the middle term: $6x^2 + 10x - 9x - 15 = 2x(3x + 5) - 3(3x + 5) = (3x + 5)(2x - 3)$. (B) expands to $6x^2 - x - 15$; (C) expands to $6x^2 + 13x - 15$; (D) expands to $6x^2 + 19x + 15$.' },

  { id: 'GAD3-18', skill: 'adv_rational', difficulty: 3, type: 'mcq',
    stem: 'How many solutions does $\\dfrac{1}{x - 2} + \\dfrac{1}{x + 2} = \\dfrac{4}{x^2 - 4}$ have?',
    choices: ['$x = 2$', '$x = 4$', '$x = -2$ and $x = 2$', 'There are no solutions'], answer: 'D',
    explanation: 'Since $x^2 - 4 = (x - 2)(x + 2)$, multiply every term by $(x - 2)(x + 2)$: $(x + 2) + (x - 2) = 4$, so $2x = 4$ and $x = 2$. But $x = 2$ makes $x - 2$ and $x^2 - 4$ equal to zero, so it is extraneous and must be rejected — there is no valid solution. (A) keeps the extraneous value; (B) and (C) do not satisfy the equation at all.' },

  { id: 'GAD3-19', skill: 'adv_quadratic', difficulty: 3, type: 'spr',
    stem: 'One solution to $x^2 - 6x + 7 = 0$ can be written as $3 + \\sqrt{k}$, where $k$ is a constant. What is the value of $k$?',
    answer: '2',
    explanation: 'By the quadratic formula, $x = \\frac{6 \\pm \\sqrt{36 - 28}}{2} = \\frac{6 \\pm \\sqrt{8}}{2} = \\frac{6 \\pm 2\\sqrt{2}}{2} = 3 \\pm \\sqrt{2}$. Matching $3 + \\sqrt{k}$ gives $k = 2$.' },

  { id: 'GAD3-20', skill: 'adv_rational', difficulty: 3, type: 'spr',
    stem: 'What is the value of $x$ that satisfies $\\sqrt{4x + 1} - 2 = 3$?',
    answer: '6',
    explanation: 'Isolate the radical: $\\sqrt{4x + 1} = 5$. Square both sides: $4x + 1 = 25$, so $4x = 24$ and $x = 6$. Check: $\\sqrt{4(6) + 1} - 2 = \\sqrt{25} - 2 = 5 - 2 = 3$.' },

  { id: 'GAD3-21', skill: 'adv_polynomial', difficulty: 3, type: 'mcq',
    stem: 'For $x \\neq -3$, which expression is equivalent to $\\dfrac{2x^2 + 5x - 3}{x + 3}$?',
    choices: ['$2x + 1$', '$2x - 3$', '$2x - 1$', '$x - 1$'], answer: 'C',
    explanation: 'Factor the numerator: $2x^2 + 5x - 3 = (2x - 1)(x + 3)$. Cancel the common factor $(x + 3)$, leaving $2x - 1$. (A) has the wrong sign on the constant; (B) simply reads the $-3$ from the trinomial without factoring; (D) drops the leading coefficient of the factor.' }
);
