/* gen: math algebra batch 4 */
GEN_BANK.push(
  { id: 'GAL4-01', skill: 'alg_linear_eq', difficulty: 1, type: 'mcq',
    stem: 'If $4x - 8 = 20$, what is the value of $x$?',
    choices: ['7', '3', '28', '5'], answer: 'A',
    explanation: 'Add 8 to both sides: $4x = 28$. Divide by 4: $x = 7$. (B) 3 subtracts 8 instead of adding it; (C) 28 forgets to divide by 4; (D) 5 divides 20 by 4 and ignores the $-8$.' },

  { id: 'GAL4-02', skill: 'alg_linear_eq', difficulty: 2, type: 'mcq',
    stem: 'The sum of three consecutive integers is 72. What is the greatest of the three integers?',
    choices: ['24', '23', '26', '25'], answer: 'D',
    explanation: 'Let the integers be $n$, $n+1$, $n+2$. Then $3n + 3 = 72$, so $3n = 69$ and $n = 23$; the integers are 23, 24, 25. The greatest is 25. (A) 24 is the middle integer; (B) 23 is the least; (C) 26 overshoots by one.' },

  { id: 'GAL4-03', skill: 'alg_linear_eq', difficulty: 2, type: 'mcq',
    stem: 'Maria is 4 years older than twice her brother’s age. If Maria is 28 years old, how old is her brother?',
    choices: ['16', '12', '24', '14'], answer: 'B',
    explanation: 'Maria’s age satisfies $2b + 4 = 28$. Subtract 4: $2b = 24$. Divide by 2: $b = 12$. (A) 16 adds 4 before dividing instead of subtracting; (C) 24 forgets to divide by 2; (D) 14 divides 28 by 2 but ignores the $+4$.' },

  { id: 'GAL4-04', skill: 'alg_linear_eq', difficulty: 3, type: 'spr',
    stem: 'If $\\frac{x + 2}{3} - \\frac{x - 4}{5} = 2$, what is the value of $x$?',
    answer: '4',
    explanation: 'Multiply every term by the least common denominator 15: $5(x + 2) - 3(x - 4) = 30$. Distribute: $5x + 10 - 3x + 12 = 30$, so $2x + 22 = 30$. Then $2x = 8$ and $x = 4$.' },

  { id: 'GAL4-05', skill: 'alg_linear_fn', difficulty: 1, type: 'mcq',
    stem: 'A line has a slope of 3 and a $y$-intercept of $-7$. Which equation represents this line?',
    choices: ['$y = 3x - 7$', '$y = -7x + 3$', '$y = 3x + 7$', '$y = -3x - 7$'], answer: 'A',
    explanation: 'In slope-intercept form $y = mx + b$, the slope $m = 3$ and the intercept $b = -7$, giving $y = 3x - 7$. (B) swaps the slope and intercept; (C) uses the wrong sign on the intercept; (D) uses the wrong sign on the slope.' },

  { id: 'GAL4-06', skill: 'alg_linear_fn', difficulty: 2, type: 'mcq',
    stem: 'A tank contains 500 milliliters of water and is filled at a constant rate of 0.2 liters per minute. Which function gives the volume $V$, in milliliters, of water in the tank after $t$ minutes? (1 liter = 1000 milliliters)',
    choices: ['$V = 500 + 0.2t$', '$V = 500 + 20t$', '$V = 500 + 200t$', '$V = 200 + 500t$'], answer: 'C',
    explanation: 'Convert the fill rate to milliliters: $0.2$ liters $= 0.2 \\times 1000 = 200$ milliliters per minute. Starting from 500 mL, $V = 500 + 200t$. (A) leaves the rate in liters without converting; (B) multiplies by 100 instead of 1000; (D) swaps the starting volume and the fill rate.' },

  { id: 'GAL4-07', skill: 'alg_linear_fn', difficulty: 2, type: 'spr',
    stem: 'For a linear function $g$, $g(1) = 5$ and $g(4) = 17$. What is the value of $g(6)$?',
    answer: '25',
    explanation: 'The slope is $\\frac{17 - 5}{4 - 1} = \\frac{12}{3} = 4$, so $g(x) = 4x + b$. From $g(1) = 5$: $4(1) + b = 5$, giving $b = 1$. Then $g(6) = 4(6) + 1 = 25$.' },

  { id: 'GAL4-08', skill: 'alg_linear_fn', difficulty: 3, type: 'mcq',
    stem: 'Line $\\ell$ passes through the point $(2, -1)$ and is parallel to the line $y = -\\frac{3}{4}x + 5$. At what value of $y$ does line $\\ell$ cross the $y$-axis?',
    choices: ['$5$', '$-\\frac{5}{2}$', '$-1$', '$\\frac{1}{2}$'], answer: 'D',
    explanation: 'Parallel lines share the same slope, $-\\frac{3}{4}$, so line $\\ell$ is $y = -\\frac{3}{4}x + b$. Substitute $(2, -1)$: $-1 = -\\frac{3}{4}(2) + b = -\\frac{3}{2} + b$, so $b = -1 + \\frac{3}{2} = \\frac{1}{2}$. (A) 5 wrongly assumes parallel lines share the same intercept; (B) $-\\frac{5}{2}$ drops the negative sign on the slope; (C) $-1$ mistakes the point’s $y$-coordinate for the intercept.' },

  { id: 'GAL4-09', skill: 'alg_systems', difficulty: 1, type: 'mcq',
    stem: 'What is the solution $(x, y)$ to the system $y = x - 1$ and $y = 3x - 7$?',
    choices: ['$(3, 2)$', '$(2, 3)$', '$(4, 3)$', '$(1, 0)$'], answer: 'A',
    explanation: 'Set the two expressions for $y$ equal: $x - 1 = 3x - 7$. Subtract $x$: $-1 = 2x - 7$. Add 7: $6 = 2x$, so $x = 3$ and $y = 3 - 1 = 2$. (B) $(2, 3)$ swaps the coordinates; (C) $(4, 3)$ comes from an arithmetic slip; (D) $(1, 0)$ satisfies only the first equation.' },

  { id: 'GAL4-10', skill: 'alg_systems', difficulty: 2, type: 'mcq',
    stem: 'A theater sold 200 tickets for a total of \\$1,950. Adult tickets cost \\$15 each and child tickets cost \\$8 each. How many adult tickets were sold?',
    choices: ['$150$', '$130$', '$50$', '$70$'], answer: 'C',
    explanation: 'Let $a$ be adult tickets and $c$ child tickets: $a + c = 200$ and $15a + 8c = 1950$. Substitute $c = 200 - a$: $15a + 8(200 - a) = 1950$, so $7a + 1600 = 1950$, giving $7a = 350$ and $a = 50$. (A) 150 is the number of child tickets, which is also what you get if the two prices are swapped; (B) 130 and (D) 70 satisfy neither equation.' },

  { id: 'GAL4-11', skill: 'alg_systems', difficulty: 2, type: 'spr',
    stem: 'A jar contains only nickels and dimes worth a total of \\$4.65. There are 60 coins in all. How many dimes are in the jar?',
    answer: '33',
    explanation: 'Let $n$ be the number of nickels and $d$ the number of dimes. Then $n + d = 60$ and, in cents, $5n + 10d = 465$. Substitute $n = 60 - d$: $5(60 - d) + 10d = 465$, so $300 + 5d = 465$, giving $5d = 165$ and $d = 33$.' },

  { id: 'GAL4-12', skill: 'alg_systems', difficulty: 3, type: 'mcq',
    stem: 'A shop blends beans that cost \\$12 per pound with beans that cost \\$18 per pound to make 30 pounds of a blend that costs \\$14 per pound. How many pounds of the \\$12 beans are used?',
    choices: ['$10$', '$20$', '$15$', '$18$'], answer: 'B',
    explanation: 'Let $x$ be the pounds of \\$12 beans and $y$ the pounds of \\$18 beans. Then $x + y = 30$ and $12x + 18y = 14(30) = 420$. Substitute $y = 30 - x$: $12x + 18(30 - x) = 420$, so $-6x + 540 = 420$, giving $-6x = -120$ and $x = 20$. (A) 10 is the amount of \\$18 beans; (C) 15 wrongly assumes an equal split; (D) 18 confuses the \\$18 price with a weight.' },

  { id: 'GAL4-13', skill: 'alg_systems', difficulty: 3, type: 'spr',
    stem: 'The system of equations $6x + 8y = 20$ and $9x + ky = 45$ has no solution. What is the value of $k$?',
    answer: '12',
    explanation: 'A system has no solution when the lines are parallel: the $x$- and $y$-coefficients are proportional but the constants are not. Matching coefficients, $\\frac{9}{6} = \\frac{k}{8}$, so $k = 8 \\cdot \\frac{9}{6} = 12$. Since $\\frac{45}{20} = 2.25 \\ne 1.5$, the constants differ, confirming the lines are parallel and the system has no solution.' },

  { id: 'GAL4-14', skill: 'alg_inequal', difficulty: 1, type: 'mcq',
    stem: 'Which of the following is a solution to the inequality $2x + 3 > 11$?',
    choices: ['$2$', '$3$', '$4$', '$5$'], answer: 'D',
    explanation: 'Solve: $2x + 3 > 11$, so $2x > 8$ and $x > 4$. Only $x = 5$ satisfies $x > 4$. (C) 4 fails because the inequality is strict ($>$, not $\\ge$); (A) 2 and (B) 3 are both less than 4.' },

  { id: 'GAL4-15', skill: 'alg_inequal', difficulty: 2, type: 'mcq',
    stem: 'Devin has \\$50 to spend on notebooks. Each notebook costs \\$6, and there is a one-time \\$8 shipping fee. Which inequality represents the number of notebooks $n$ he can buy?',
    choices: ['$6n + 8 \\ge 50$', '$6n + 8 \\le 50$', '$6n - 8 \\le 50$', '$6n \\le 50$'], answer: 'B',
    explanation: 'The cost is \\$6 per notebook plus a one-time \\$8 fee, and it cannot exceed the \\$50 budget: $6n + 8 \\le 50$. (A) reverses the inequality; (C) subtracts the fee instead of adding it; (D) omits the \\$8 fee entirely.' },

  { id: 'GAL4-16', skill: 'alg_inequal', difficulty: 3, type: 'mcq',
    stem: 'What is the greatest integer value of $x$ that satisfies $\\frac{2x + 5}{3} > x - 4$?',
    choices: ['$17$', '$9$', '$16$', '$8$'], answer: 'C',
    explanation: 'Multiply both sides by 3: $2x + 5 > 3(x - 4) = 3x - 12$. Subtract $2x$ and add 12: $17 > x$, so $x < 17$. The greatest integer less than 17 is 16. (A) 17 wrongly includes the boundary of a strict inequality; (B) 9 and (D) 8 come from failing to distribute the 3 across $x - 4$.' },

  { id: 'GAL4-17', skill: 'alg_word', difficulty: 1, type: 'mcq',
    stem: 'A gym charges a \\$25 sign-up fee plus \\$40 for each month of membership. Which expression represents the total cost, in dollars, of joining and being a member for $m$ months?',
    choices: ['$40 + 25m$', '$65m$', '$25m + 40$', '$25 + 40m$'], answer: 'D',
    explanation: 'The \\$25 sign-up fee is a one-time constant and \\$40 is charged each month, so the total is $25 + 40m$. (A) swaps the fee and the monthly rate; (B) treats both amounts as monthly; (C) multiplies the wrong number by $m$.' },

  { id: 'GAL4-18', skill: 'alg_word', difficulty: 2, type: 'mcq',
    stem: 'A company has \\$2,000 in fixed costs plus \\$6 per unit to manufacture a product, which it sells for \\$16 per unit. How many units must the company sell to break even?',
    choices: ['$125$', '$200$', '$333$', '$91$'], answer: 'B',
    explanation: 'At break-even, revenue equals cost: $16n = 2000 + 6n$. Subtract $6n$: $10n = 2000$, so $n = 200$. (A) 125 divides 2000 by the \\$16 price and ignores the \\$6 variable cost; (C) 333 divides 2000 by only the \\$6 variable cost; (D) 91 divides 2000 by the sum $16 + 6 = 22$.' },

  { id: 'GAL4-19', skill: 'alg_word', difficulty: 2, type: 'spr',
    stem: 'At a snack stand, a bag of popcorn costs \\$4 and a drink costs \\$3. A group buys 3 more drinks than bags of popcorn and spends \\$44 in total. How many bags of popcorn did they buy?',
    answer: '5',
    explanation: 'Let $p$ be the number of popcorn bags; the number of drinks is $p + 3$. The total cost is $4p + 3(p + 3) = 44$. Distribute: $4p + 3p + 9 = 44$, so $7p = 35$ and $p = 5$.' },

  { id: 'GAL4-20', skill: 'alg_word', difficulty: 3, type: 'mcq',
    stem: 'A store ships gift boxes in two sizes. A small box holds 6 chocolates and a large box holds 10 chocolates. A shipment of 40 boxes contains 324 chocolates. How many large boxes are in the shipment?',
    choices: ['$19$', '$14$', '$21$', '$26$'], answer: 'C',
    explanation: 'Let $s$ be the number of small boxes and $l$ the number of large boxes: $s + l = 40$ and $6s + 10l = 324$. Substitute $s = 40 - l$: $6(40 - l) + 10l = 324$, so $240 + 4l = 324$, giving $4l = 84$ and $l = 21$. (A) 19 is the number of small boxes, which is also what you get if the two box sizes are swapped; (B) 14 and (D) 26 satisfy neither equation.' },

  { id: 'GAL4-21', skill: 'alg_word', difficulty: 3, type: 'mcq',
    stem: 'The sum of three consecutive even integers is 138. What is the least of the three integers?',
    choices: ['$44$', '$42$', '$46$', '$48$'], answer: 'A',
    explanation: 'Let the integers be $n$, $n+2$, $n+4$. Then $3n + 6 = 138$, so $3n = 132$ and $n = 44$; the integers are 44, 46, 48. The least is 44. (B) 42 subtracts too much; (C) 46 is the middle integer (equal to $138 \\div 3$); (D) 48 is the greatest.' }
);
