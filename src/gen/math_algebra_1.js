/* gen: math algebra batch 1 */
GEN_BANK.push(
  { id: 'GAL1-01', skill: 'alg_linear_eq', difficulty: 1, type: 'mcq',
    stem: 'If $3x + 6 = 24$, what is the value of $x$?',
    choices: ['6', '8', '18', '10'], answer: 'A',
    explanation: 'Subtract 6 from both sides: $3x = 18$. Divide by 3: $x = 6$. (B) 8 divides 24 by 3 but ignores the $+6$; (C) 18 forgets to divide by 3; (D) 10 adds 6 instead of subtracting.' },

  { id: 'GAL1-02', skill: 'alg_linear_eq', difficulty: 2, type: 'spr',
    stem: 'If $\\frac{3x - 4}{2} = 7$, what is the value of $x$?',
    answer: '6',
    explanation: 'Multiply both sides by 2: $3x - 4 = 14$. Add 4: $3x = 18$. Divide by 3: $x = 6$.' },

  { id: 'GAL1-03', skill: 'alg_linear_eq', difficulty: 2, type: 'mcq',
    stem: 'If $3(x - 2) = x + 8$, what is the value of $x$?',
    choices: ['5', '7', '1', '14'], answer: 'B',
    explanation: 'Distribute: $3x - 6 = x + 8$. Subtract $x$ and add 6: $2x = 14$, so $x = 7$. (A) 5 fails to multiply the $-2$ by 3; (C) 1 mishandles the sign of the $-6$; (D) 14 forgets to divide by 2.' },

  { id: 'GAL1-04', skill: 'alg_linear_eq', difficulty: 3, type: 'mcq',
    stem: 'If $\\frac{x}{4} + \\frac{x}{6} = 5$, what is the value of $x$?',
    choices: ['25', '50', '60', '12'], answer: 'D',
    explanation: 'Using the least common denominator 12: $\\frac{3x}{12} + \\frac{2x}{12} = \\frac{5x}{12} = 5$, so $5x = 60$ and $x = 12$. (A) 25 wrongly adds both numerators and denominators to get $\\frac{2x}{10}$; (B) 50 adds only the denominators to get $\\frac{x}{10}$; (C) 60 forgets to divide by 5.' },

  { id: 'GAL1-05', skill: 'alg_linear_eq', difficulty: 3, type: 'spr',
    stem: 'If $\\frac{2}{3}(x - 6) = \\frac{1}{2}(x + 4)$, what is the value of $x$?',
    answer: '36',
    explanation: 'Multiply both sides by 6 to clear the fractions: $4(x - 6) = 3(x + 4)$. Distribute: $4x - 24 = 3x + 12$. Subtract $3x$ and add 24: $x = 36$.' },

  { id: 'GAL1-06', skill: 'alg_linear_fn', difficulty: 1, type: 'mcq',
    stem: 'A line has slope $-2$ and passes through the point $(0, 5)$. Which equation represents the line?',
    choices: ['$y = 5x - 2$', '$y = 2x + 5$', '$y = -2x - 5$', '$y = -2x + 5$'], answer: 'D',
    explanation: 'In slope-intercept form $y = mx + b$, the slope is $m = -2$ and the $y$-intercept is $b = 5$, giving $y = -2x + 5$. (A) swaps the slope and intercept; (B) uses the wrong slope sign; (C) uses the wrong intercept sign.' },

  { id: 'GAL1-07', skill: 'alg_linear_fn', difficulty: 2, type: 'mcq',
    stem: 'A line passes through the points $(-1, 4)$ and $(3, -8)$. What is the slope of the line?',
    choices: ['3', '-3', '-6', '$-\\frac{1}{3}$'], answer: 'B',
    explanation: 'Slope $= \\frac{-8 - 4}{3 - (-1)} = \\frac{-12}{4} = -3$. (A) 3 mishandles the negative signs; (C) $-6$ uses $3 - 1$ in the denominator instead of $3 - (-1)$; (D) inverts rise over run.' },

  { id: 'GAL1-08', skill: 'alg_linear_fn', difficulty: 2, type: 'spr',
    stem: 'A linear function $f$ satisfies $f(2) = 9$ and $f(5) = 21$. What is the value of $f(0)$?',
    answer: '1',
    explanation: 'Slope $= \\frac{21 - 9}{5 - 2} = \\frac{12}{3} = 4$, so $f(x) = 4x + b$. Using $f(2) = 9$: $4(2) + b = 9$, so $b = 1$. Then $f(0) = b = 1$.' },

  { id: 'GAL1-09', skill: 'alg_linear_fn', difficulty: 3, type: 'mcq',
    stem: 'Line $m$ is perpendicular to the line $2x + 5y = 20$. What is the slope of line $m$?',
    choices: ['$\\frac{5}{2}$', '$-\\frac{2}{5}$', '$-\\frac{5}{2}$', '$\\frac{2}{5}$'], answer: 'A',
    explanation: 'Rewrite the given line as $5y = -2x + 20$, so $y = -\\frac{2}{5}x + 4$ and its slope is $-\\frac{2}{5}$. A perpendicular line has the negative reciprocal slope, $\\frac{5}{2}$. (B) is the original slope; (C) takes the reciprocal but keeps the negative sign; (D) only flips the sign.' },

  { id: 'GAL1-10', skill: 'alg_systems', difficulty: 1, type: 'mcq',
    stem: 'What is the solution $(x, y)$ to the system $y = x + 2$ and $y = 2x$?',
    choices: ['$(4, 8)$', '$(2, 6)$', '$(2, 4)$', '$(1, 2)$'], answer: 'C',
    explanation: 'Substitute $y = 2x$ into $y = x + 2$: $2x = x + 2$, so $x = 2$ and $y = 2(2) = 4$, giving $(2, 4)$. (A) uses $x = 4$; (B) keeps $x = 2$ but uses the wrong $y$; (D) satisfies $y = 2x$ but not $y = x + 2$.' },

  { id: 'GAL1-11', skill: 'alg_systems', difficulty: 2, type: 'mcq',
    stem: 'If $2x + 3y = 12$ and $2x - y = 4$, what is the value of $y$?',
    choices: ['2', '3', '-2', '4'], answer: 'A',
    explanation: 'Subtract the second equation from the first to eliminate $x$: $(2x + 3y) - (2x - y) = 12 - 4$, so $4y = 8$ and $y = 2$. (B) 3 is the value of $x$, not $y$; (C) $-2$ flips the sign; (D) 4 mishandles the subtraction.' },

  { id: 'GAL1-12', skill: 'alg_systems', difficulty: 3, type: 'spr',
    stem: 'The system $3x + 4y = 26$ and $5x - 2y = 0$ has solution $(x, y)$. What is the value of $x + y$?',
    answer: '7',
    explanation: 'From $5x - 2y = 0$, we get $y = \\frac{5x}{2}$. Substitute into $3x + 4y = 26$: $3x + 10x = 13x = 26$, so $x = 2$ and $y = 5$. Then $x + y = 2 + 5 = 7$.' },

  { id: 'GAL1-13', skill: 'alg_systems', difficulty: 3, type: 'mcq',
    stem: 'For what value of $c$ does the system $3x - 6y = 9$ and $2x - 4y = c$ have infinitely many solutions?',
    choices: ['3', '9', '6', '18'], answer: 'C',
    explanation: 'The left side $2x - 4y$ is $\\frac{2}{3}$ of $3x - 6y$, so for the two equations to represent one line the constant must scale the same way: $c = \\frac{2}{3}(9) = 6$. Both equations then reduce to $x - 2y = 3$. (A) 3 and (B) 9 skip the scaling; (D) 18 scales in the wrong direction.' },

  { id: 'GAL1-14', skill: 'alg_inequal', difficulty: 1, type: 'mcq',
    stem: 'Which value of $x$ is a solution to $3x - 5 \\le 7$?',
    choices: ['3', '5', '6', '7'], answer: 'A',
    explanation: 'Solve: $3x - 5 \\le 7 \\Rightarrow 3x \\le 12 \\Rightarrow x \\le 4$. Only $x = 3$ satisfies $x \\le 4$; the values 5, 6, and 7 all exceed 4.' },

  { id: 'GAL1-15', skill: 'alg_inequal', difficulty: 2, type: 'mcq',
    stem: 'What is the solution to the inequality $8 - 2x < 14$?',
    choices: ['$x < -3$', '$x > -3$', '$x > 3$', '$x < 3$'], answer: 'B',
    explanation: 'Subtract 8 from both sides: $-2x < 6$. Divide by $-2$ and flip the inequality: $x > -3$. (A) forgets to flip the sign when dividing by a negative; (C) and (D) drop the negative sign on 3.' },

  { id: 'GAL1-16', skill: 'alg_inequal', difficulty: 2, type: 'mcq',
    stem: 'A delivery van can carry at most 1,200 pounds. It already holds a 150-pound cart, and it is loaded with boxes that each weigh 25 pounds. Which inequality gives the possible numbers of boxes $b$?',
    choices: ['$25b + 150 \\ge 1200$', '$25b \\le 1200$', '$25b - 150 \\le 1200$', '$25b + 150 \\le 1200$'], answer: 'D',
    explanation: 'The 150-pound cart plus the boxes ($25b$) can be at most 1,200 pounds: $25b + 150 \\le 1200$. "At most" means $\\le$. (A) reverses the inequality; (B) omits the cart’s weight; (C) subtracts the cart instead of adding it.' },

  { id: 'GAL1-17', skill: 'alg_inequal', difficulty: 3, type: 'mcq',
    stem: 'What is the greatest integer value of $x$ that satisfies $\\frac{3x - 1}{4} \\le 5$?',
    choices: ['6', '7', '8', '21'], answer: 'B',
    explanation: 'Multiply both sides by 4: $3x - 1 \\le 20$. Add 1: $3x \\le 21$. Divide by 3: $x \\le 7$. The greatest integer satisfying $x \\le 7$ is 7. (A) 6 treats the inequality as strict; (C) 8 exceeds the bound; (D) 21 forgets to divide by 3.' },

  { id: 'GAL1-18', skill: 'alg_word', difficulty: 1, type: 'mcq',
    stem: 'A taxi charges a flat fee of \\$4 plus \\$2 per mile. Which expression represents the total cost, in dollars, of a ride of $m$ miles?',
    choices: ['$2 + 4m$', '$6m$', '$4 + 2m$', '$4m - 2$'], answer: 'C',
    explanation: 'The \\$4 flat fee is constant, and each mile adds \\$2, so the total cost is $4 + 2m$. (A) swaps the fee and the per-mile rate; (B) treats both amounts as per-mile; (D) subtracts and swaps.' },

  { id: 'GAL1-19', skill: 'alg_word', difficulty: 2, type: 'spr',
    stem: 'A candle is 30 centimeters tall and burns at a constant rate of 4 centimeters per hour. After how many hours will the candle be 6 centimeters tall?',
    answer: '6',
    explanation: 'The height after $t$ hours is $30 - 4t$. Set it equal to 6: $30 - 4t = 6$, so $4t = 24$ and $t = 6$ hours.' },

  { id: 'GAL1-20', skill: 'alg_word', difficulty: 2, type: 'mcq',
    stem: 'A company models its monthly profit with $P = 15n - 900$, where $P$ is the profit in dollars and $n$ is the number of units sold. What does the number 900 represent?',
    choices: ['The profit, in dollars, earned for each unit sold', 'The number of units the company must sell to break even', 'The company’s fixed cost, in dollars, when no units are sold', 'The profit, in dollars, when 900 units are sold'], answer: 'C',
    explanation: 'When $n = 0$ (no units sold), $P = -900$, a loss of \\$900 — the fixed cost the company must cover before earning any profit. (A) describes the slope 15, the profit per unit; (B) the break-even amount is $900 \\div 15 = 60$ units, not 900; (D) misreads 900 as a number of units.' },

  { id: 'GAL1-21', skill: 'alg_word', difficulty: 3, type: 'mcq',
    stem: 'At a bake sale, muffins sell for \\$3 each and cookies sell for \\$2 each. On Saturday, 80 items were sold for a total of \\$210. How many muffins were sold?',
    choices: ['30', '40', '55', '50'], answer: 'D',
    explanation: 'Let $m$ be the number of muffins and $c$ the number of cookies: $m + c = 80$ and $3m + 2c = 210$. Substitute $c = 80 - m$: $3m + 2(80 - m) = 210 \\Rightarrow m + 160 = 210 \\Rightarrow m = 50$. (A) 30 is the number of cookies; (B) 40 and (C) 55 fail to satisfy both equations.' }
);
