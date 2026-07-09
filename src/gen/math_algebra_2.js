/* gen: math algebra batch 2 */
GEN_BANK.push(
  { id: 'GAL2-01', skill: 'alg_linear_eq', difficulty: 1, type: 'mcq',
    stem: 'The formula $P = 2l + 2w$ gives the perimeter $P$ of a rectangle with length $l$ and width $w$. Which equation correctly solves for $w$?',
    choices: ['$w = \\frac{P - 2l}{2}$', '$w = \\frac{P}{2} - 2l$', '$w = P - 2l$', '$w = \\frac{P - l}{2}$'], answer: 'A',
    explanation: 'Subtract $2l$ from both sides: $P - 2l = 2w$. Divide both sides by 2: $w = \\frac{P - 2l}{2}$. (B) divides only $P$ by 2, not the whole right side; (C) forgets to divide by 2; (D) subtracts $l$ instead of $2l$.' },

  { id: 'GAL2-02', skill: 'alg_linear_eq', difficulty: 2, type: 'mcq',
    stem: 'The equation $C = \\frac{5}{9}(F - 32)$ converts a Fahrenheit temperature $F$ to a Celsius temperature $C$. Which equation solves for $F$ in terms of $C$?',
    choices: ['$F = \\frac{5}{9}C + 32$', '$F = \\frac{9}{5}C + 32$', '$F = \\frac{9}{5}(C + 32)$', '$F = \\frac{9}{5}C - 32$'], answer: 'B',
    explanation: 'Multiply both sides by the reciprocal $\\frac{9}{5}$: $\\frac{9}{5}C = F - 32$. Add 32: $F = \\frac{9}{5}C + 32$. (A) uses $\\frac{5}{9}$ instead of its reciprocal; (C) adds 32 before scaling rather than after; (D) subtracts 32 instead of adding it.' },

  { id: 'GAL2-03', skill: 'alg_linear_eq', difficulty: 2, type: 'spr',
    stem: 'If $4(x + 1) = 6x - 3$, what is the value of $x$?',
    answer: '7/2',
    explanation: 'Distribute the left side: $4x + 4 = 6x - 3$. Subtract $4x$ from both sides: $4 = 2x - 3$. Add 3: $7 = 2x$. Divide by 2: $x = \\frac{7}{2}$.' },

  { id: 'GAL2-04', skill: 'alg_linear_eq', difficulty: 3, type: 'mcq',
    stem: 'The formula $A = \\frac{h(a + b)}{2}$ gives the area $A$ of a trapezoid with parallel sides of length $a$ and $b$ and height $h$. Which equation correctly solves for $b$?',
    choices: ['$b = \\frac{2A - a}{h}$', '$b = \\frac{A}{2h} - a$', '$b = \\frac{2A}{h} - a$', '$b = 2A - h - a$'], answer: 'C',
    explanation: 'Multiply both sides by 2: $2A = h(a + b)$. Divide by $h$: $\\frac{2A}{h} = a + b$. Subtract $a$: $b = \\frac{2A}{h} - a$. (A) subtracts $a$ inside the numerator before dividing by $h$; (B) divides by $2h$ instead of multiplying by 2 then dividing by $h$; (D) treats $h$ as a subtracted term.' },

  { id: 'GAL2-05', skill: 'alg_linear_fn', difficulty: 1, type: 'mcq',
    stem: 'A line $\\ell$ passes through the three points listed in a table: $(0, 4)$, $(2, 10)$, and $(4, 16)$. What is the slope of line $\\ell$?',
    choices: ['2', '4', '6', '3'], answer: 'D',
    explanation: 'Slope $= \\frac{10 - 4}{2 - 0} = \\frac{6}{2} = 3$ (the same value results from any two of the points). (A) 2 is the change in $x$ between rows; (B) 4 is the $y$-value at $x = 0$, the $y$-intercept, not the slope; (C) 6 is the change in $y$ alone, without dividing by the change in $x$.' },

  { id: 'GAL2-06', skill: 'alg_linear_fn', difficulty: 2, type: 'mcq',
    stem: 'Line $p$ is parallel to the line $y = \\frac{3}{4}x - 5$ and passes through the point $(0, 2)$. Which equation represents line $p$?',
    choices: ['$y = \\frac{3}{4}x + 2$', '$y = -\\frac{4}{3}x + 2$', '$y = \\frac{3}{4}x - 5$', '$y = 2x + \\frac{3}{4}$'], answer: 'A',
    explanation: 'Parallel lines share the same slope, so line $p$ has slope $\\frac{3}{4}$. It passes through $(0, 2)$, so its $y$-intercept is 2, giving $y = \\frac{3}{4}x + 2$. (B) uses the perpendicular slope $-\\frac{4}{3}$; (C) is the original line, not a new parallel one; (D) swaps the slope and the intercept.' },

  { id: 'GAL2-07', skill: 'alg_linear_fn', difficulty: 2, type: 'spr',
    stem: 'A line passes through the points $(-2, 7)$ and $(4, k)$. The slope of the line is $-\\frac{1}{2}$. What is the value of $k$?',
    answer: '4',
    explanation: 'The slope is $\\frac{k - 7}{4 - (-2)} = \\frac{k - 7}{6}$. Set this equal to $-\\frac{1}{2}$: $\\frac{k - 7}{6} = -\\frac{1}{2}$, so $k - 7 = -3$ and $k = 4$.' },

  { id: 'GAL2-08', skill: 'alg_linear_fn', difficulty: 3, type: 'mcq',
    stem: 'Line $n$ passes through the point $(6, 1)$ and is perpendicular to the line $y = -3x + 4$. What is the $y$-intercept of line $n$?',
    choices: ['19', '-1', '2', '-17'], answer: 'B',
    explanation: 'The perpendicular slope is the negative reciprocal of $-3$, which is $\\frac{1}{3}$. Using $y = \\frac{1}{3}x + b$ with $(6, 1)$: $1 = \\frac{1}{3}(6) + b = 2 + b$, so $b = -1$. (A) 19 uses the original slope $-3$; (C) 2 stops at $\\frac{1}{3}(6)$ without solving for $b$; (D) $-17$ uses slope 3 instead of $\\frac{1}{3}$.' },

  { id: 'GAL2-09', skill: 'alg_linear_fn', difficulty: 3, type: 'mcq',
    stem: 'For the linear function $h$, a table gives $h(1) = 20$, $h(3) = 12$, and $h(5) = 4$. For what value of $x$ does $h(x) = 0$?',
    choices: ['4', '24', '6', '-4'], answer: 'C',
    explanation: 'The slope is $\\frac{12 - 20}{3 - 1} = \\frac{-8}{2} = -4$, so $h(x) = -4x + b$. Using $h(1) = 20$: $-4 + b = 20$, so $b = 24$ and $h(x) = -4x + 24$. Set $h(x) = 0$: $-4x + 24 = 0$, so $x = 6$. (A) 4 is $h(5)$, not the input where $h = 0$; (B) 24 is $h(0)$, the $y$-intercept; (D) $-4$ is the slope.' },

  { id: 'GAL2-10', skill: 'alg_systems', difficulty: 1, type: 'mcq',
    stem: 'What is the solution $(x, y)$ to the system $y = 3x$ and $x + y = 8$?',
    choices: ['$(6, 2)$', '$(1, 3)$', '$(2, 4)$', '$(2, 6)$'], answer: 'D',
    explanation: 'Substitute $y = 3x$ into $x + y = 8$: $x + 3x = 8$, so $4x = 8$ and $x = 2$. Then $y = 3(2) = 6$, giving $(2, 6)$. (A) reverses the coordinates; (B) satisfies $y = 3x$ but $1 + 3 = 4 \\neq 8$; (C) keeps $x = 2$ but uses the wrong $y$.' },

  { id: 'GAL2-11', skill: 'alg_systems', difficulty: 2, type: 'mcq',
    stem: 'If $2x + 3y = 12$ and $4x - y = 10$, what is the value of $y$?',
    choices: ['2', '3', '14', '-2'], answer: 'A',
    explanation: 'Multiply the first equation by 2 to line up the $x$-terms: $4x + 6y = 24$. Subtract the second equation: $(4x + 6y) - (4x - y) = 24 - 10$, so $7y = 14$ and $y = 2$. (B) 3 is the value of $x$; (C) 14 is $7y$ before dividing by 7; (D) $-2$ flips the sign.' },

  { id: 'GAL2-12', skill: 'alg_systems', difficulty: 2, type: 'spr',
    stem: 'If $x = 2y - 1$ and $3x + y = 11$, what is the value of $y$?',
    answer: '2',
    explanation: 'Substitute $x = 2y - 1$ into $3x + y = 11$: $3(2y - 1) + y = 11$. Distribute: $6y - 3 + y = 11$, so $7y - 3 = 11$. Add 3: $7y = 14$. Divide by 7: $y = 2$.' },

  { id: 'GAL2-13', skill: 'alg_systems', difficulty: 3, type: 'mcq',
    stem: 'The system of equations $y = \\frac{2}{3}x + 5$ and $y = kx - 1$ has no solution. What is the value of the constant $k$?',
    choices: ['$-\\frac{2}{3}$', '$\\frac{3}{2}$', '$\\frac{2}{3}$', '$-\\frac{3}{2}$'], answer: 'C',
    explanation: 'A system of two lines has no solution when the lines are parallel: equal slopes but different $y$-intercepts. The first slope is $\\frac{2}{3}$, so $k = \\frac{2}{3}$, and since the intercepts $5$ and $-1$ differ, the lines are distinct. (A) has the wrong sign; (B) is the reciprocal; (D) is the negative reciprocal, which would make the lines perpendicular and give exactly one solution.' },

  { id: 'GAL2-14', skill: 'alg_systems', difficulty: 3, type: 'spr',
    stem: 'The solution to the system $4x + 3y = 27$ and $2x - 5y = -19$ is $(x, y)$. What is the value of $x + y$?',
    answer: '8',
    explanation: 'Multiply the second equation by 2: $4x - 10y = -38$. Subtract this from the first equation: $(4x + 3y) - (4x - 10y) = 27 - (-38)$, so $13y = 65$ and $y = 5$. Substitute back: $4x + 3(5) = 27$, so $4x = 12$ and $x = 3$. Then $x + y = 3 + 5 = 8$.' },

  { id: 'GAL2-15', skill: 'alg_inequal', difficulty: 1, type: 'mcq',
    stem: 'What is the solution to the inequality $\\frac{x}{2} + 3 > 7$?',
    choices: ['$x > 20$', '$x > 8$', '$x < 8$', '$x > 2$'], answer: 'B',
    explanation: 'Subtract 3 from both sides: $\\frac{x}{2} > 4$. Multiply both sides by 2: $x > 8$. (A) adds 3 and then multiplies by 2, using $ (7 + 3)\\times 2$; (C) flips the inequality sign for no reason; (D) divides 4 by 2 instead of multiplying.' },

  { id: 'GAL2-16', skill: 'alg_inequal', difficulty: 2, type: 'mcq',
    stem: 'A student has \\$60 to spend on notebooks and pens. Notebooks cost \\$4 each and pens cost \\$1.50 each. If the student buys 6 pens, which inequality describes the possible numbers of notebooks $n$ the student can buy?',
    choices: ['$4n + 9 \\ge 60$', '$4n + 6 \\le 60$', '$4n \\le 60$', '$4n + 9 \\le 60$'], answer: 'D',
    explanation: 'Six pens cost $6 \\times \\$1.50 = \\$9$, and $n$ notebooks cost $4n$ dollars. The total can be at most \\$60, so $4n + 9 \\le 60$. (A) reverses the inequality; (B) uses the number of pens (6) instead of their cost (\\$9); (C) ignores the cost of the pens entirely.' },

  { id: 'GAL2-17', skill: 'alg_inequal', difficulty: 3, type: 'mcq',
    stem: 'How many integer values of $x$ satisfy $-5 < 2x - 1 \\le 7$?',
    choices: ['6', '7', '5', '4'], answer: 'A',
    explanation: 'Add 1 to all three parts: $-4 < 2x \\le 8$. Divide all parts by 2: $-2 < x \\le 4$. The integers greater than $-2$ and at most 4 are $-1, 0, 1, 2, 3, 4$, which is 6 values. (B) 7 wrongly includes $-2$; (C) 5 wrongly excludes 4; (D) 4 counts only $1, 2, 3, 4$.' },

  { id: 'GAL2-18', skill: 'alg_word', difficulty: 1, type: 'mcq',
    stem: 'A parking garage charges \\$5 for the first hour and \\$3 for each additional hour. Which expression gives the total cost, in dollars, of parking for $h$ hours, where $h \\ge 1$?',
    choices: ['$5 + 3h$', '$3 + 5(h - 1)$', '$8h$', '$5 + 3(h - 1)$'], answer: 'D',
    explanation: 'The first hour costs \\$5, and the remaining $h - 1$ hours cost \\$3 each, for a total of $5 + 3(h - 1)$. Checking $h = 1$: $5 + 3(0) = 5$, correct. (A) charges \\$3 for all $h$ hours in addition to the \\$5, double-counting the first hour; (B) swaps the two rates; (C) adds the two rates and applies the sum to every hour.' },

  { id: 'GAL2-19', skill: 'alg_word', difficulty: 2, type: 'spr',
    stem: 'A tank holds 500 liters of water and is being drained at 20 liters per minute. At the same time, a second tank holds 150 liters and is being filled at 30 liters per minute. After how many minutes will the two tanks hold the same amount of water?',
    answer: '7',
    explanation: 'After $t$ minutes the first tank holds $500 - 20t$ liters and the second holds $150 + 30t$ liters. Set them equal: $500 - 20t = 150 + 30t$. Subtract $150$ and add $20t$: $350 = 50t$, so $t = 7$ minutes. (Check: $500 - 140 = 360$ and $150 + 210 = 360$.)' },

  { id: 'GAL2-20', skill: 'alg_word', difficulty: 2, type: 'mcq',
    stem: 'The monthly cost of a phone plan is modeled by $C = 20 + 0.10t$, where $C$ is the cost in dollars and $t$ is the number of text messages sent beyond the amount included in the plan. Which statement best interprets the number $0.10$ in this model?',
    choices: ['The base monthly cost, in dollars, of the plan', 'The cost, in dollars, of each text message sent beyond the included amount', 'The number of text messages included in the plan each month', 'The total cost, in dollars, when 10 text messages are sent'], answer: 'B',
    explanation: 'Each additional text message adds $0.10$ to $C$, so $0.10$ is the cost in dollars per extra message — the rate of change. (A) describes the constant 20, the base cost when $t = 0$; (C) misreads the coefficient as a count of included messages; (D) misreads $0.10$ as 10 messages.' },

  { id: 'GAL2-21', skill: 'alg_word', difficulty: 3, type: 'mcq',
    stem: 'Two landscaping companies each charge a flat fee plus an hourly rate. Company A charges a \\$50 flat fee plus \\$15 per hour, and Company B charges a \\$20 flat fee plus \\$25 per hour. For how many hours of work do the two companies charge the same total amount?',
    choices: ['30', '95', '3', '10'], answer: 'C',
    explanation: 'Set the totals equal: $50 + 15h = 20 + 25h$. Subtract $15h$ and $20$ from both sides: $30 = 10h$, so $h = 3$ hours. (A) 30 is the difference in flat fees, not yet divided by the difference in rates; (B) 95 is the equal total cost in dollars at $h = 3$, not the number of hours; (D) 10 is the difference in hourly rates.' }
);
