/* gen: math advanced batch 2 */
GEN_BANK.push(
  { id: 'GAD2-01', skill: 'adv_exponents', difficulty: 1, type: 'mcq',
    stem: 'Which of the following is equivalent to $x^{4} \\cdot x^{5}$?',
    choices: ['$x^{20}$', '$x^{9}$', '$x^{45}$', '$x^{1}$'], answer: 'B',
    explanation: 'The product rule adds exponents that share a base: $x^{4} \\cdot x^{5} = x^{4+5} = x^{9}$. (A) $x^{20}$ multiplies the exponents, which is the power rule, not the product rule; (C) $x^{45}$ just writes the digits 4 and 5 side by side; (D) $x^{1}$ subtracts the exponents.' },

  { id: 'GAD2-02', skill: 'adv_exponents', difficulty: 1, type: 'mcq',
    stem: 'For $a \\ne 0$, which of the following is equivalent to $\\frac{a^{8}}{a^{3}}$?',
    choices: ['$a^{5}$', '$a^{11}$', '$a^{24}$', '$a^{\\frac{8}{3}}$'], answer: 'A',
    explanation: 'The quotient rule subtracts exponents that share a base: $\\frac{a^{8}}{a^{3}} = a^{8-3} = a^{5}$. (B) $a^{11}$ adds the exponents; (C) $a^{24}$ multiplies them; (D) $a^{\\frac{8}{3}}$ divides them.' },

  { id: 'GAD2-03', skill: 'adv_exponents', difficulty: 2, type: 'mcq',
    stem: 'Which of the following is equivalent to $(2x^{3})^{2}$?',
    choices: ['$4x^{5}$', '$2x^{6}$', '$4x^{6}$', '$2x^{5}$'], answer: 'C',
    explanation: 'Raise each factor to the power 2: $(2x^{3})^{2} = 2^{2} \\cdot x^{3 \\cdot 2} = 4x^{6}$. (A) $4x^{5}$ adds the exponents $3+2$ instead of multiplying; (B) $2x^{6}$ forgets to square the coefficient 2; (D) $2x^{5}$ makes both errors.' },

  { id: 'GAD2-04', skill: 'adv_exponents', difficulty: 2, type: 'spr',
    stem: 'What is the value of $16^{\\frac{3}{4}}$?',
    answer: '8',
    explanation: 'Write the exponent as a root and a power: $16^{\\frac{3}{4}} = \\left(16^{\\frac{1}{4}}\\right)^{3}$. Since $16^{\\frac{1}{4}} = \\sqrt[4]{16} = 2$, the value is $2^{3} = 8$.' },

  { id: 'GAD2-05', skill: 'adv_exponents', difficulty: 2, type: 'mcq',
    stem: 'Which of the following is equivalent to $\\sqrt{48}$?',
    choices: ['$4\\sqrt{3}$', '$16\\sqrt{3}$', '$4\\sqrt{2}$', '$3\\sqrt{4}$'], answer: 'A',
    explanation: 'Factor out the largest perfect square: $\\sqrt{48} = \\sqrt{16 \\cdot 3} = \\sqrt{16} \\cdot \\sqrt{3} = 4\\sqrt{3}$. (B) $16\\sqrt{3}$ moves the 16 outside without taking its square root; (C) $4\\sqrt{2}$ uses the wrong leftover factor under the radical; (D) $3\\sqrt{4}$ swaps which factor stays inside the radical.' },

  { id: 'GAD2-06', skill: 'adv_exponents', difficulty: 3, type: 'mcq',
    stem: 'For $x > 0$, which of the following is equivalent to $\\left(x^{\\frac{1}{2}}\\right)^{6} \\cdot x^{-2}$?',
    choices: ['$x^{5}$', '$x^{4}$', '$x^{-6}$', '$x$'], answer: 'D',
    explanation: 'First apply the power rule: $\\left(x^{\\frac{1}{2}}\\right)^{6} = x^{\\frac{1}{2} \\cdot 6} = x^{3}$. Then apply the product rule: $x^{3} \\cdot x^{-2} = x^{3+(-2)} = x^{1} = x$. (A) $x^{5}$ treats $x^{-2}$ as $x^{2}$; (B) $x^{4}$ ignores the $\\frac{1}{2}$ and uses $x^{6}$; (C) $x^{-6}$ multiplies the exponents 3 and $-2$ instead of adding them.' },

  { id: 'GAD2-07', skill: 'adv_exponents', difficulty: 3, type: 'spr',
    stem: 'If $\\frac{x^{6} \\cdot x^{-2}}{x^{-3}} = x^{n}$ for $x > 0$, what is the value of $n$?',
    answer: '7',
    explanation: 'Combine the powers of $x$ using the product and quotient rules. The numerator is $x^{6} \\cdot x^{-2} = x^{6-2} = x^{4}$. Dividing by $x^{-3}$ subtracts that exponent: $x^{4-(-3)} = x^{4+3} = x^{7}$, so $n = 7$.' },

  { id: 'GAD2-08', skill: 'adv_exponents', difficulty: 3, type: 'mcq',
    stem: 'For $x \\ge 0$, which of the following is equivalent to $\\sqrt{50x^{7}}$?',
    choices: ['$5x^{3}\\sqrt{2x}$', '$5x^{3}\\sqrt{2}$', '$25x^{3}\\sqrt{2x}$', '$5x^{4}\\sqrt{2x}$'], answer: 'A',
    explanation: 'Separate the perfect squares: $\\sqrt{50x^{7}} = \\sqrt{25 \\cdot 2 \\cdot x^{6} \\cdot x} = \\sqrt{25} \\cdot \\sqrt{x^{6}} \\cdot \\sqrt{2x} = 5x^{3}\\sqrt{2x}$. (B) $5x^{3}\\sqrt{2}$ drops the leftover $x$ that must stay under the radical; (C) $25x^{3}\\sqrt{2x}$ leaves 25 outside without taking its square root; (D) $5x^{4}\\sqrt{2x}$ mishandles $\\sqrt{x^{7}}$, which is $x^{3}$ with one $x$ remaining inside.' },

  { id: 'GAD2-09', skill: 'adv_exponential', difficulty: 1, type: 'mcq',
    stem: 'A population of bacteria is modeled by $P = 300(2)^{t}$, where $t$ is the number of hours since the start. What is the population when $t = 0$?',
    choices: ['600', '0', '300', '2'], answer: 'C',
    explanation: 'The population when $t = 0$ is found by substituting: $P = 300(2)^{0} = 300 \\cdot 1 = 300$, the initial value. (A) 600 comes from using $2^{1}$ instead of $2^{0}$; (B) 0 wrongly assumes the population starts at zero; (D) 2 uses only the base of the exponent.' },

  { id: 'GAD2-10', skill: 'adv_exponential', difficulty: 1, type: 'mcq',
    stem: 'The value of an investment increases by 5% each year. Which of the following is the multiplier applied to the value each year?',
    choices: ['$0.05$', '$1.05$', '$0.95$', '$5$'], answer: 'B',
    explanation: 'A 5% increase means the new value is $100\\% + 5\\% = 105\\%$ of the old value, so the multiplier is $1.05$. (A) $0.05$ is only the 5% increase, not the whole multiplier; (C) $0.95$ is the multiplier for a 5% decrease; (D) 5 treats the percent as a whole number.' },

  { id: 'GAD2-11', skill: 'adv_exponential', difficulty: 2, type: 'mcq',
    stem: 'A car purchased for \\$24,000 loses 12% of its value each year. Which of the following functions gives the car’s value, in dollars, after $t$ years?',
    choices: ['$V = 24000(1.12)^{t}$', '$V = 24000(0.12)^{t}$', '$V = 24000(12)^{t}$', '$V = 24000(0.88)^{t}$'], answer: 'D',
    explanation: 'Losing 12% each year keeps $100\\% - 12\\% = 88\\%$ of the value, so the yearly multiplier is $0.88$ and $V = 24000(0.88)^{t}$. (A) uses $1.12$, which models a 12% gain; (B) uses $0.12$, which keeps only 12% of the value each year; (C) uses 12, which would multiply the value by 12 annually.' },

  { id: 'GAD2-12', skill: 'adv_exponential', difficulty: 2, type: 'spr',
    stem: 'A colony of insects doubles every week. If the colony starts with 15 insects, how many insects are there after 3 weeks?',
    answer: '120',
    explanation: 'Doubling every week multiplies the count by 2 each week: $15 \\cdot 2^{3} = 15 \\cdot 8 = 120$. Equivalently, the count grows $15 \\to 30 \\to 60 \\to 120$ over the three weeks.' },

  { id: 'GAD2-13', skill: 'adv_exponential', difficulty: 2, type: 'mcq',
    stem: 'An account balance is modeled by $B = 500(1.03)^{t}$, where $t$ is measured in years. Which of the following is the annual percent increase in the balance?',
    choices: ['0.03%', '3%', '1.03%', '30%'], answer: 'B',
    explanation: 'The base $1.03$ equals $1 + 0.03$, so the balance grows by $0.03 = 3\\%$ each year. (A) 0.03% misreads the decimal as a percent; (C) 1.03% uses the entire multiplier as the rate; (D) 30% multiplies the correct rate by 10.' },

  { id: 'GAD2-14', skill: 'adv_exponential', difficulty: 3, type: 'mcq',
    stem: 'The value of an investment after $t$ years is given by $500(1.08)^{2t}$. Which of the following expressions is equivalent and shows the yearly growth factor?',
    choices: ['$500(1.1664)^{t}$', '$500(1.16)^{t}$', '$500(2.16)^{t}$', '$1000(1.08)^{t}$'], answer: 'A',
    explanation: 'Group the exponent to reveal the yearly factor: $500(1.08)^{2t} = 500\\left((1.08)^{2}\\right)^{t} = 500(1.1664)^{t}$, since $(1.08)^{2} = 1.1664$. (B) $1.16$ just doubles the 8% rate and ignores compounding; (C) $2.16$ multiplies $1.08$ by 2 instead of squaring it; (D) doubles the initial amount rather than adjusting the growth factor.' },

  { id: 'GAD2-15', skill: 'adv_exponential', difficulty: 3, type: 'spr',
    stem: 'A sample of a radioactive substance has a mass of 80 grams and loses half of its mass every 6 years. What is the mass, in grams, of the sample after 18 years?',
    answer: '10',
    explanation: 'In 18 years the substance passes through $18 \\div 6 = 3$ half-lives. Halving the 80-gram sample three times gives $80 \\cdot \\left(\\frac{1}{2}\\right)^{3} = 80 \\cdot \\frac{1}{8} = 10$ grams. Equivalently, $80 \\to 40 \\to 20 \\to 10$.' },

  { id: 'GAD2-16', skill: 'adv_quadratic', difficulty: 2, type: 'mcq',
    stem: 'What are the solutions to $x^{2} - 5x - 14 = 0$?',
    choices: ['$x = -7$ and $x = 2$', '$x = 7$ and $x = 2$', '$x = 7$ and $x = -2$', '$x = -7$ and $x = -2$'], answer: 'C',
    explanation: 'Factor the quadratic: $x^{2} - 5x - 14 = (x - 7)(x + 2) = 0$, so $x = 7$ or $x = -2$. Check: the roots must multiply to $-14$ and add to $5$, and $7 \\cdot (-2) = -14$ with $7 + (-2) = 5$. (A) and (D) flip signs so the product is no longer $-14$; (B) makes both roots positive, giving a product of $+14$.' },

  { id: 'GAD2-17', skill: 'adv_quadratic', difficulty: 3, type: 'spr',
    stem: 'In the $xy$-plane, the graph of $y = x^{2} - 6x + 13$ has a lowest point. What is the $y$-coordinate of that lowest point?',
    answer: '4',
    explanation: 'Complete the square: $y = x^{2} - 6x + 13 = (x - 3)^{2} + 4$. The minimum occurs at $x = 3$, where $y = (3)^{2} - 6(3) + 13 = 9 - 18 + 13 = 4$. So the lowest point has $y$-coordinate 4.' },

  { id: 'GAD2-18', skill: 'adv_polynomial', difficulty: 1, type: 'mcq',
    stem: 'Which of the following is equivalent to $(x + 3)(x - 5)$?',
    choices: ['$x^{2} + 2x - 15$', '$x^{2} - 15$', '$x^{2} - 2x + 15$', '$x^{2} - 2x - 15$'], answer: 'D',
    explanation: 'Use FOIL: $(x + 3)(x - 5) = x^{2} - 5x + 3x - 15 = x^{2} - 2x - 15$. (A) $x^{2} + 2x - 15$ combines the middle terms with the wrong sign; (B) $x^{2} - 15$ omits the middle terms entirely; (C) $x^{2} - 2x + 15$ uses the wrong sign for the product $3 \\cdot (-5)$.' },

  { id: 'GAD2-19', skill: 'adv_polynomial', difficulty: 2, type: 'mcq',
    stem: 'Which of the following is equivalent to $4x^{2} - 9$?',
    choices: ['$(2x - 3)^{2}$', '$(2x - 3)(2x + 3)$', '$(4x - 3)(x + 3)$', '$(2x - 9)(2x + 1)$'], answer: 'B',
    explanation: 'This is a difference of squares: $4x^{2} - 9 = (2x)^{2} - 3^{2} = (2x - 3)(2x + 3)$. (A) $(2x - 3)^{2}$ expands to $4x^{2} - 12x + 9$, which has an extra middle term; (C) $(4x - 3)(x + 3)$ expands to $4x^{2} + 9x - 9$; (D) $(2x - 9)(2x + 1)$ expands to $4x^{2} - 16x - 9$.' },

  { id: 'GAD2-20', skill: 'adv_rational', difficulty: 3, type: 'mcq',
    stem: 'What is the solution to $\\frac{x^{2}}{x - 2} = \\frac{4}{x - 2}$?',
    choices: ['$x = 2$ and $x = -2$', '$x = 2$ only', '$x = -2$ only', 'No solution'], answer: 'C',
    explanation: 'Multiply both sides by $x - 2$: $x^{2} = 4$, so $x = 2$ or $x = -2$. But $x = 2$ makes the denominator $x - 2$ equal to zero, so it is extraneous and must be rejected; only $x = -2$ works. (A) keeps the extraneous root; (B) keeps only the extraneous root and discards the valid one; (D) wrongly rejects both.' },

  { id: 'GAD2-21', skill: 'adv_functions', difficulty: 2, type: 'mcq',
    stem: 'The functions $f$ and $g$ are defined by $f(x) = 2x + 1$ and $g(x) = x^{2} - 3$. What is the value of $f(g(3))$?',
    choices: ['19', '46', '7', '13'], answer: 'D',
    explanation: 'Work from the inside out: $g(3) = 3^{2} - 3 = 6$, then $f(6) = 2(6) + 1 = 13$. (A) 19 forgets the $-3$ in $g$, using $g(3) = 9$; (B) 46 computes $g(f(3))$ in the reverse order; (C) 7 stops after finding $f(3)$ and never composes.' }
);
