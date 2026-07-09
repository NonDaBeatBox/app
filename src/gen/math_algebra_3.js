/* gen: math algebra batch 3 */
GEN_BANK.push(
  { id: 'GAL3-01', skill: 'alg_linear_eq', difficulty: 1, type: 'mcq',
    stem: 'If $4x + 9 = x + 30$, what is the value of $x$?',
    choices: ['13', '7', '21', '10'], answer: 'B',
    explanation: 'Subtract $x$ from both sides: $3x + 9 = 30$. Subtract 9: $3x = 21$. Divide by 3: $x = 7$. (A) 13 adds 9 instead of subtracting it $((30 + 9)\\div 3)$; (C) 21 stops before dividing by 3; (D) 10 ignores the $+9$ and divides 30 by 3.' },

  { id: 'GAL3-02', skill: 'alg_linear_eq', difficulty: 2, type: 'mcq',
    stem: 'The equation $3x - 4y = 12$ relates $x$ and $y$. Which of the following correctly expresses $y$ in terms of $x$?',
    choices: ['$y = -\\frac{3}{4}x + 3$', '$y = \\frac{4}{3}x - 3$', '$y = \\frac{3}{4}x - 3$', '$y = \\frac{3}{4}x + 3$'], answer: 'C',
    explanation: 'Isolate the $y$-term: $-4y = -3x + 12$. Divide every term by $-4$: $y = \\frac{3}{4}x - 3$. (A) divides by $+4$ instead of $-4$, so the signs come out wrong; (B) inverts the coefficient to $\\frac{4}{3}$; (D) divides $12$ by $-4$ but keeps it positive as $+3$.' },

  { id: 'GAL3-03', skill: 'alg_linear_eq', difficulty: 2, type: 'spr',
    stem: 'If $\\frac{2x + 5}{3} = \\frac{x + 7}{2}$, what is the value of $x$?',
    answer: '11',
    explanation: 'Cross-multiply: $2(2x + 5) = 3(x + 7)$, giving $4x + 10 = 3x + 21$. Subtract $3x$ and subtract 10 from both sides: $x = 11$. Check: $\\frac{2(11) + 5}{3} = \\frac{27}{3} = 9$ and $\\frac{11 + 7}{2} = \\frac{18}{2} = 9$.' },

  { id: 'GAL3-04', skill: 'alg_linear_eq', difficulty: 3, type: 'mcq',
    stem: 'Which of the following equations has the same solution as $\\frac{x}{3} - \\frac{x - 1}{2} = 4$?',
    choices: ['$2x - 3(x - 1) = 4$', '$3x - 2(x - 1) = 24$', '$2x - 3x - 1 = 24$', '$2x - 3(x - 1) = 24$'], answer: 'D',
    explanation: 'Multiply every term by the least common denominator, 6: $\\frac{x}{3}\\cdot 6 = 2x$, $\\frac{x - 1}{2}\\cdot 6 = 3(x - 1)$, and $4 \\cdot 6 = 24$, giving $2x - 3(x - 1) = 24$. (A) forgets to multiply the right side by 6; (B) swaps the two multipliers; (C) distributes $-3(x - 1)$ incorrectly as $-3x - 1$.' },

  { id: 'GAL3-05', skill: 'alg_linear_fn', difficulty: 1, type: 'mcq',
    stem: 'A plant’s height is modeled by $h = 5 + 2d$, where $h$ is the height in centimeters and $d$ is the number of days since planting. According to the model, what was the plant’s height at the moment it was planted?',
    choices: ['5 centimeters', '2 centimeters', '7 centimeters', '10 centimeters'], answer: 'A',
    explanation: 'The plant was planted at $d = 0$, so $h = 5 + 2(0) = 5$ centimeters — the value of the constant term. (B) 2 is the daily growth rate (the slope), not the starting height; (C) 7 is the height after 1 day; (D) 10 incorrectly multiplies 5 by 2.' },

  { id: 'GAL3-06', skill: 'alg_linear_fn', difficulty: 2, type: 'mcq',
    stem: 'A gym charges its members according to the model $C = 25m + 40$, where $C$ is the total cost in dollars and $m$ is the number of months of membership. Which of the following best describes the meaning of 25 in this model?',
    choices: ['The one-time sign-up fee is \\$25.', 'The total cost increases by \\$25 for each additional month.', 'The membership costs \\$25 in total.', 'The membership lasts 25 months.'], answer: 'B',
    explanation: 'In $C = 25m + 40$, the coefficient 25 multiplies $m$ (months), so it is the rate of change: each additional month adds \\$25 to the total cost. (A) describes a fixed starting fee, which is the constant 40, not 25; (C) treats a per-month rate as a single total; (D) misreads the rate as a length of time.' },

  { id: 'GAL3-07', skill: 'alg_linear_fn', difficulty: 2, type: 'spr',
    stem: 'A linear function $g$ satisfies $g(1) = 4$ and $g(3) = 10$. What is the value of $g(5)$?',
    answer: '16',
    explanation: 'The slope is $\\frac{10 - 4}{3 - 1} = \\frac{6}{2} = 3$, so $g(x) = 3x + b$. Using $g(1) = 4$: $3(1) + b = 4$, so $b = 1$ and $g(x) = 3x + 1$. Then $g(5) = 3(5) + 1 = 16$.' },

  { id: 'GAL3-08', skill: 'alg_linear_fn', difficulty: 3, type: 'mcq',
    stem: 'In the $xy$-plane, a line passes through the points $(0, -6)$ and $(4, 0)$. Which of the following is an equation of this line?',
    choices: ['$y = -\\frac{3}{2}x - 6$', '$y = \\frac{2}{3}x - 6$', '$y = \\frac{3}{2}x + 4$', '$y = \\frac{3}{2}x - 6$'], answer: 'D',
    explanation: 'The slope is $\\frac{0 - (-6)}{4 - 0} = \\frac{6}{4} = \\frac{3}{2}$, and the line crosses the $y$-axis at $(0, -6)$, so $y = \\frac{3}{2}x - 6$. (A) uses the wrong slope sign; (B) inverts the slope to $\\frac{2}{3}$; (C) mistakes the $x$-intercept 4 for the $y$-intercept.' },

  { id: 'GAL3-09', skill: 'alg_linear_fn', difficulty: 3, type: 'spr',
    stem: 'The line given by $3x + 5y = 45$ is graphed in the $xy$-plane. At what value of $x$ does the graph cross the $x$-axis?',
    answer: '15',
    explanation: 'A graph crosses the $x$-axis where $y = 0$. Substitute $y = 0$: $3x + 5(0) = 45$, so $3x = 45$ and $x = 15$.' },

  { id: 'GAL3-10', skill: 'alg_systems', difficulty: 1, type: 'mcq',
    stem: 'What is the solution $(x, y)$ to the system $x + y = 10$ and $x - y = 4$?',
    choices: ['$(7, 3)$', '$(3, 7)$', '$(6, 4)$', '$(5, 5)$'], answer: 'A',
    explanation: 'Add the two equations to eliminate $y$: $2x = 14$, so $x = 7$. Then $7 + y = 10$ gives $y = 3$, so $(7, 3)$. (B) swaps the coordinates; (C) $(6, 4)$ and (D) $(5, 5)$ satisfy $x + y = 10$ but not $x - y = 4$.' },

  { id: 'GAL3-11', skill: 'alg_systems', difficulty: 2, type: 'mcq',
    stem: 'For what value of $k$ will the system $y = 3x + 5$ and $y = kx - 2$ have no solution?',
    choices: ['$-2$', '$5$', '$-3$', '$3$'], answer: 'D',
    explanation: 'A system of two lines has no solution when the lines are parallel — equal slopes but different $y$-intercepts. The first line has slope 3, so $k = 3$; because the intercepts 5 and $-2$ differ, the lines never meet. (A) $-2$ and (B) 5 are $y$-intercepts, not slopes; (C) $-3$ has the wrong sign.' },

  { id: 'GAL3-12', skill: 'alg_systems', difficulty: 2, type: 'spr',
    stem: 'The solution to the system $3x + 2y = 21$ and $x = 2y - 1$ is $(x, y)$. What is the value of $y$?',
    answer: '3',
    explanation: 'Substitute $x = 2y - 1$ into $3x + 2y = 21$: $3(2y - 1) + 2y = 21$, so $6y - 3 + 2y = 21$, giving $8y = 24$ and $y = 3$.' },

  { id: 'GAL3-13', skill: 'alg_systems', difficulty: 3, type: 'mcq',
    stem: 'The system $2x - 5y = 8$ and $6x - 15y = c$ has infinitely many solutions. What is the value of $c$?',
    choices: ['8', '3', '24', '16'], answer: 'C',
    explanation: 'Infinitely many solutions means the two equations describe the same line. Since $6x - 15y$ is exactly 3 times $2x - 5y$, the constant must also be tripled: $c = 3 \\times 8 = 24$. (A) 8 keeps the original constant; (B) 3 is only the scale factor; (D) 16 doubles instead of tripling.' },

  { id: 'GAL3-14', skill: 'alg_systems', difficulty: 3, type: 'mcq',
    stem: 'The system $ax + 4y = 9$ and $3x + 2y = 7$ has no solution. What is the value of $a$?',
    choices: ['6', '2', '$\\frac{3}{2}$', '8'], answer: 'A',
    explanation: 'Two linear equations have no solution when their $x$- and $y$-coefficients are proportional but the constants are not. Matching the $y$-coefficients, $\\frac{4}{2} = 2$, so the $x$-coefficients must satisfy $\\frac{a}{3} = 2$, giving $a = 6$. The constants give $\\frac{9}{7} \\neq 2$, confirming the lines are parallel and distinct. (B) 2 is the ratio itself, not $a$; (C) $\\frac{3}{2}$ inverts the ratio; (D) 8 does not keep the coefficients proportional.' },

  { id: 'GAL3-15', skill: 'alg_inequal', difficulty: 1, type: 'mcq',
    stem: 'Which of the following values of $x$ is a solution to the inequality $2x + 1 > 9$?',
    choices: ['3', '4', '5', '2'], answer: 'C',
    explanation: 'Subtract 1: $2x > 8$. Divide by 2: $x > 4$. Only $x = 5$ is greater than 4. (A) 3 and (D) 2 are less than 4; (B) 4 is not included because the inequality is strict.' },

  { id: 'GAL3-16', skill: 'alg_inequal', difficulty: 2, type: 'mcq',
    stem: 'A student has \\$60 to spend on school supplies. Notebooks cost \\$4 each and pens cost \\$1.50 each. If the student buys 6 notebooks, which inequality represents the possible numbers of pens $p$ the student can also buy?',
    choices: ['$24 + 1.5p \\ge 60$', '$24 + 1.5p \\le 60$', '$6 + 1.5p \\le 60$', '$4p + 1.5 \\le 60$'], answer: 'B',
    explanation: 'Six notebooks cost $6 \\times 4 = 24$ dollars. Adding the pens ($1.5p$), the total spent can be at most \\$60: $24 + 1.5p \\le 60$. (A) reverses the inequality; (C) uses the number of notebooks, 6, instead of their \\$24 cost; (D) misplaces the numbers, attaching the count to the wrong price.' },

  { id: 'GAL3-17', skill: 'alg_inequal', difficulty: 2, type: 'mcq',
    stem: 'A ride-share driver earns \\$12 for each trip and wants to earn a total of at least \\$300 in one day. The driver has already earned \\$96. What is the minimum number of additional trips $t$ the driver must complete to reach this goal?',
    choices: ['17', '25', '33', '16'], answer: 'A',
    explanation: 'The total earnings must satisfy $12t + 96 \\ge 300$. Subtract 96: $12t \\ge 204$. Divide by 12: $t \\ge 17$, so the minimum is 17 trips. (B) 25 ignores the \\$96 already earned $(300 \\div 12)$; (C) 33 adds the \\$96 instead of subtracting it; (D) 16 falls one trip short of the goal.' },

  { id: 'GAL3-18', skill: 'alg_inequal', difficulty: 3, type: 'spr',
    stem: 'What is the least integer value of $x$ that satisfies $\\frac{2}{5}x - 3 > 1$?',
    answer: '11',
    explanation: 'Add 3 to both sides: $\\frac{2}{5}x > 4$. Multiply both sides by $\\frac{5}{2}$: $x > 10$. The least integer greater than 10 is 11. (Note $x = 10$ gives exactly 1, which is not greater than 1.)' },

  { id: 'GAL3-19', skill: 'alg_word', difficulty: 1, type: 'mcq',
    stem: 'A printing service charges a setup fee of \\$15 plus \\$0.10 for each page printed. Which expression gives the total charge, in dollars, for printing $n$ pages?',
    choices: ['$0.10 + 15n$', '$15.10n$', '$15n + 0.10$', '$15 + 0.10n$'], answer: 'D',
    explanation: 'The \\$15 setup fee is a one-time constant, and each page adds \\$0.10, so the total is $15 + 0.10n$. (A) swaps the fee and the per-page rate; (B) combines them into a single per-page charge of \\$15.10; (C) treats the \\$0.10 as the constant and the \\$15 as a per-page rate.' },

  { id: 'GAL3-20', skill: 'alg_word', difficulty: 2, type: 'mcq',
    stem: 'The value of a company’s equipment is modeled by $V = 18000 - 1500y$, where $V$ is the value in dollars and $y$ is the number of years after it was purchased. Which of the following is the best interpretation of the number 18,000 in this model?',
    choices: ['The equipment loses \\$18,000 in value each year.', 'The equipment’s value when it was purchased was \\$18,000.', 'The equipment will be worth \\$18,000 after one year.', 'The equipment reaches a value of \\$0 after 18,000 years.'], answer: 'B',
    explanation: 'When $y = 0$ (the moment of purchase), $V = 18000$, so 18,000 is the equipment’s original value — the $V$-intercept. (A) confuses 18,000 with the slope $-1500$, the yearly loss in value; (C) misreads the intercept as the value after a year; (D) is not supported by the model.' },

  { id: 'GAL3-21', skill: 'alg_word', difficulty: 3, type: 'mcq',
    stem: 'A theater sold 500 tickets to a show for a total of \\$8,600. Adult tickets cost \\$20 each and student tickets cost \\$12 each. How many adult tickets were sold?',
    choices: ['325', '175', '300', '250'], answer: 'A',
    explanation: 'Let $a$ be the number of adult tickets and $s$ the number of student tickets: $a + s = 500$ and $20a + 12s = 8600$. Substitute $s = 500 - a$: $20a + 12(500 - a) = 8600$, so $8a + 6000 = 8600$, giving $8a = 2600$ and $a = 325$. (B) 175 is the number of student tickets; (C) 300 and (D) 250 do not satisfy the total sales of \\$8,600.' }
);
