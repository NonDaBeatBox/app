/* gen: extreme math 2 */
GEN_BANK.push(
  { id: 'GXM2-01', skill: 'psda_stats', difficulty: 'extreme', type: 'spr',
    stem: 'A set of 12 numbers has a mean of 30. When one of the numbers is removed, the mean of the remaining 11 numbers is 28. A separate set of 5 numbers has a mean of 40. If the number that was removed from the first set is inserted into the second set, what is the mean of the resulting set of 6 numbers?',
    answer: '42',
    explanation: 'The 12 numbers total $12 \\times 30 = 360$, and the 11 remaining numbers total $11 \\times 28 = 308$, so the removed number is $360 - 308 = 52$. The second set of 5 numbers totals $5 \\times 40 = 200$; inserting 52 gives a total of $200 + 52 = 252$ spread over 6 numbers, for a mean of $\\frac{252}{6} = 42$.' },

  { id: 'GXM2-02', skill: 'psda_prob', difficulty: 'extreme', type: 'mcq',
    stem: 'In a group of 300 people, 150 subscribe to streaming service $X$, 130 subscribe to streaming service $Y$, and 60 subscribe to both services. If a person is selected at random from those who subscribe to at least one of the two services, what is the probability that the person subscribes to exactly one of the two services?',
    choices: ['$\\frac{8}{15}$', '$\\frac{8}{11}$', '$\\frac{3}{11}$', '$\\frac{11}{15}$'], answer: 'B',
    explanation: 'The number subscribing to at least one service is $150 + 130 - 60 = 220$. Of these, 60 subscribe to both, so the number subscribing to exactly one is $220 - 60 = 160$. Restricting to the 220 people who subscribe to at least one service, the probability is $\\frac{160}{220} = \\frac{8}{11}$, choice (B). (A) $\\frac{8}{15} = \\frac{160}{300}$ divides by all 300 people instead of only those with at least one subscription. (C) $\\frac{3}{11} = \\frac{60}{220}$ is the probability of subscribing to both services, the complement of exactly one. (D) $\\frac{11}{15} = \\frac{220}{300}$ is the probability of subscribing to at least one service, ignoring the exactly-one condition.' },

  { id: 'GXM2-03', skill: 'geo_circles', difficulty: 'extreme', type: 'mcq',
    stem: 'In the $xy$-plane, a circle has its center at $(6, 8)$ and passes through the origin. From the external point $P(15, 0)$, a line is drawn tangent to the circle, touching it at point $T$. What is the length of segment $PT$?',
    choices: ['$\\sqrt{145}$', '$7\\sqrt{5}$', '$3\\sqrt{5}$', '$3\\sqrt{15}$'], answer: 'C',
    explanation: 'The radius equals the distance from the center to the origin: $r = \\sqrt{6^2 + 8^2} = \\sqrt{100} = 10$. The distance from $P$ to the center is $PC = \\sqrt{(15 - 6)^2 + (0 - 8)^2} = \\sqrt{81 + 64} = \\sqrt{145}$. A tangent is perpendicular to the radius at $T$, so triangle $PTC$ has its right angle at $T$, giving $PT = \\sqrt{PC^2 - r^2} = \\sqrt{145 - 100} = \\sqrt{45} = 3\\sqrt{5}$, choice (C). (A) $\\sqrt{145}$ is $PC$ itself, forgetting to subtract $r^2$. (B) $7\\sqrt{5} = \\sqrt{245}$ adds $r^2$ instead of subtracting it. (D) $3\\sqrt{15} = \\sqrt{135}$ subtracts $r$ rather than $r^2$.' },

  { id: 'GXM2-04', skill: 'adv_functions', difficulty: 'extreme', type: 'mcq',
    stem: 'The function $f$ is defined by $f(x) = ax + b$, where $a$ and $b$ are constants and $a > 0$. If $f(f(x)) = 9x - 4$ for all values of $x$, what is the value of $f(3)$?',
    choices: ['8', '10', '2', '23'], answer: 'A',
    explanation: 'Composing, $f(f(x)) = a(ax + b) + b = a^2 x + ab + b$. Matching this to $9x - 4$: the $x$-terms require $a^2 = 9$, so $a = 3$ (since $a > 0$), and the constant terms require $ab + b = b(a + 1) = -4$, so $4b = -4$ and $b = -1$. Thus $f(x) = 3x - 1$ and $f(3) = 3(3) - 1 = 8$, choice (A). (B) 10 comes from taking $b = +1$, a sign error. (C) 2 comes from misreading $ab + b$ as $a + b = -4$, giving $b = -7$ and $f(3) = 2$. (D) 23 evaluates $f(f(3)) = 9(3) - 4 = 23$ instead of $f(3)$.' },

  { id: 'GXM2-05', skill: 'psda_percent', difficulty: 'extreme', type: 'spr',
    stem: 'The price of a share of stock rose by 20% during the first week, then fell by 25% during the second week, and then rose by $p\\%$ during the third week. At the end of the third week, the price was 8% greater than the price at the start of the first week. What is the value of $p$?',
    answer: '20',
    explanation: 'Let the starting price be $P$. After a 20% rise the price is $1.20P$; after a 25% fall it is $1.20 \\times 0.75\\,P = 0.90P$. A rise of $p\\%$ in the third week multiplies by $\\left(1 + \\frac{p}{100}\\right)$, and the final price equals $1.08P$. So $0.90\\left(1 + \\frac{p}{100}\\right) = 1.08$, giving $1 + \\frac{p}{100} = \\frac{1.08}{0.90} = 1.20$. Therefore $\\frac{p}{100} = 0.20$ and $p = 20$.' },

  { id: 'GXM2-06', skill: 'geo_trig', difficulty: 'extreme', type: 'mcq',
    stem: 'In triangle $ABC$, $AB = AC = 10$ and the measure of angle $BAC$ is $120^\\circ$. What is the area of triangle $ABC$?',
    choices: ['$50\\sqrt{3}$', '$50$', '$25$', '$25\\sqrt{3}$'], answer: 'D',
    explanation: 'Drop an altitude from $A$ to the midpoint $M$ of $BC$. It bisects the $120^\\circ$ angle into two $60^\\circ$ angles, creating right triangle $AMB$ with hypotenuse $AB = 10$. Then $AM = 10\\cos 60^\\circ = 5$ and $BM = 10\\sin 60^\\circ = 5\\sqrt{3}$, so $BC = 2(5\\sqrt{3}) = 10\\sqrt{3}$. The area is $\\frac{1}{2}(BC)(AM) = \\frac{1}{2}(10\\sqrt{3})(5) = 25\\sqrt{3}$, choice (D). (A) $50\\sqrt{3}$ omits the factor $\\frac{1}{2}$. (B) 50 uses $\\frac{1}{2}(10)(10)$ but drops the sine factor, as if the angle were $90^\\circ$. (C) 25 uses $\\sin 120^\\circ = \\frac{1}{2}$, mistaking it for the sine of $30^\\circ$ instead of $\\frac{\\sqrt{3}}{2}$.' },

  { id: 'GXM2-07', skill: 'adv_quadratic', difficulty: 'extreme', type: 'spr',
    stem: 'In the equation $x^2 - bx + 27 = 0$, $b$ is a positive constant. One of the two solutions of the equation is 3 times the other solution. What is the value of $b$?',
    answer: '12',
    explanation: 'Let the two solutions be $r$ and $3r$. Their product equals the constant term: $r \\cdot 3r = 3r^2 = 27$, so $r^2 = 9$ and $r = 3$ (the positive value, since a positive $b$ forces both roots positive). The solutions are 3 and 9, and their sum equals $b$: $3 + 9 = 12$. Check: $x^2 - 12x + 27 = (x - 3)(x - 9)$, and $9 = 3 \\times 3$, so $b = 12$.' },

  { id: 'GXM2-08', skill: 'psda_ratio', difficulty: 'extreme', type: 'mcq',
    stem: 'In a jar, the ratio of red marbles to blue marbles is $7 : 4$. After 20 red marbles are removed from the jar, the ratio of red marbles to blue marbles becomes $3 : 4$. How many blue marbles are in the jar?',
    choices: ['20', '35', '15', '55'], answer: 'A',
    explanation: 'Write the counts as $7x$ red and $4x$ blue. Removing 20 red marbles leaves $7x - 20$ red, while the blue count is unchanged, so $\\frac{7x - 20}{4x} = \\frac{3}{4}$. Cross-multiplying gives $4(7x - 20) = 12x$, so $28x - 80 = 12x$, $16x = 80$, and $x = 5$. The number of blue marbles is $4x = 20$, choice (A). (B) 35 is the original red count $7x$. (C) 15 is the red count after removal, $7x - 20$. (D) 55 is the original total $7x + 4x = 11x$.' },

  { id: 'GXM2-09', skill: 'geo_volume', difficulty: 'extreme', type: 'mcq',
    stem: 'A right circular cone with height 12 and base radius 6 is oriented with its vertex pointing straight down. Water is poured into the cone until it reaches a depth of 8, measured vertically upward from the vertex. What fraction of the cone’s total volume is filled with water?',
    choices: ['$\\frac{2}{3}$', '$\\frac{8}{27}$', '$\\frac{4}{9}$', '$\\frac{19}{27}$'], answer: 'B',
    explanation: 'The water forms a smaller cone similar to the full cone, because they share the vertex and the same shape. The ratio of their heights is $\\frac{8}{12} = \\frac{2}{3}$, so every linear dimension of the water cone is $\\frac{2}{3}$ of the full cone’s. Volume scales as the cube of the linear ratio: $\\left(\\frac{2}{3}\\right)^3 = \\frac{8}{27}$, choice (B). (A) $\\frac{2}{3}$ is the ratio of heights (linear), not volume. (C) $\\frac{4}{9} = \\left(\\frac{2}{3}\\right)^2$ is the ratio of areas, not volume. (D) $\\frac{19}{27} = 1 - \\frac{8}{27}$ is the fraction of the volume that is empty.' },

  { id: 'GXM2-10', skill: 'psda_prob', difficulty: 'extreme', type: 'mcq',
    stem: 'A box contains 5 red balls and 3 green balls. Two balls are drawn from the box at random, one after the other, without replacement. Given that at least one of the two balls drawn is green, what is the probability that both balls drawn are green?',
    choices: ['$\\frac{3}{28}$', '$\\frac{2}{7}$', '$\\frac{1}{6}$', '$\\frac{3}{8}$'], answer: 'C',
    explanation: 'The number of ways to choose 2 balls from 8 is $\\frac{8 \\cdot 7}{2} = 28$. Choosing 2 green from the 3 green gives $\\frac{3 \\cdot 2}{2} = 3$ ways. The event “at least one green” is the complement of “both red,” and both red gives $\\frac{5 \\cdot 4}{2} = 10$ ways, so at least one green occurs in $28 - 10 = 18$ ways. The conditional probability is $\\frac{3}{18} = \\frac{1}{6}$, choice (C). (A) $\\frac{3}{28}$ is the unconditional probability that both are green, ignoring the given condition. (B) $\\frac{2}{7}$ is the probability the second ball is green given that the first is green. (D) $\\frac{3}{8}$ is the probability that a single drawn ball is green.' },

  { id: 'GXM2-11', skill: 'adv_exponential', difficulty: 'extreme', type: 'spr',
    stem: 'If $2^{2x} - 5\\left(2^{x}\\right) + 4 = 0$ and $x > 0$, what is the value of $x$?',
    answer: '2',
    explanation: 'Let $u = 2^{x}$. Since $2^{2x} = \\left(2^{x}\\right)^2 = u^2$, the equation becomes $u^2 - 5u + 4 = 0$, which factors as $(u - 1)(u - 4) = 0$. So $u = 1$ or $u = 4$, meaning $2^{x} = 1$ (giving $x = 0$) or $2^{x} = 4$ (giving $x = 2$). Because $x > 0$, the only valid solution is $x = 2$.' },

  { id: 'GXM2-12', skill: 'psda_stats', difficulty: 'extreme', type: 'mcq',
    stem: 'A list consists of 7 distinct integers. The three smallest integers in the list are 3, 5, and 8, and the median of the list is 12. If the mean of all 7 integers is 14, what is the greatest possible value of the largest integer in the list?',
    choices: ['43', '45', '70', '44'], answer: 'A',
    explanation: 'The 7 integers sum to $7 \\times 14 = 98$. Written in increasing order they begin $3, 5, 8, 12$, where 12 is the 4th value (the median), followed by three larger integers. The first four sum to $3 + 5 + 8 + 12 = 28$, so the top three sum to $98 - 28 = 70$. To maximize the largest, make the other two as small as possible while keeping all integers distinct and greater than 12: the smallest available are 13 and 14. The largest is then $70 - 13 - 14 = 43$, choice (A). (B) 45 lets the fifth value equal the median 12, but the integers must be distinct. (C) 70 places the entire remaining sum in one value, ignoring that two other integers above 12 are also required. (D) 44 uses 13 and 13, which are not distinct.' },

  { id: 'GXM2-13', skill: 'geo_circles', difficulty: 'extreme', type: 'spr',
    stem: 'In the $xy$-plane, a circle is defined by the equation $x^2 + y^2 - 6x + 8y + 9 = 0$. A sector of this circle has an area of $\\frac{16\\pi}{5}$. What is the measure, in degrees, of the central angle of this sector?',
    answer: '72',
    explanation: 'Complete the square: $(x^2 - 6x) + (y^2 + 8y) = -9$ becomes $(x - 3)^2 + (y + 4)^2 = -9 + 9 + 16 = 16$, so $r^2 = 16$ and the full circle’s area is $\\pi r^2 = 16\\pi$. A sector with central angle $\\theta$ degrees has area $\\frac{\\theta}{360}(16\\pi)$. Setting $\\frac{\\theta}{360}(16\\pi) = \\frac{16\\pi}{5}$ gives $\\frac{\\theta}{360} = \\frac{1}{5}$, so $\\theta = \\frac{360}{5} = 72$ degrees.' },

  { id: 'GXM2-14', skill: 'adv_rational', difficulty: 'extreme', type: 'mcq',
    stem: 'For a constant $k$, the equation $\\frac{x + 2}{x - 1} = k$ has no real solution for $x$. What is the value of $k$?',
    choices: ['-2', '0', '-1', '1'], answer: 'D',
    explanation: 'Multiplying both sides by $x - 1$ gives $x + 2 = k(x - 1)$, so $x + 2 = kx - k$ and $x - kx = -k - 2$, i.e., $x(1 - k) = -(k + 2)$. This can be solved for $x$ unless the coefficient $1 - k = 0$, that is $k = 1$. When $k = 1$ the equation becomes $x + 2 = x - 1$, or $2 = -1$, which is never true, so there is no solution; the value 1 is the horizontal asymptote of $\\frac{x + 2}{x - 1}$, an output the function approaches but never reaches. The answer is (D). (A) $k = -2$ gives $x = 0$, a valid solution. (B) $k = 0$ gives $x = -2$, a valid solution. (C) $k = -1$ gives $x = -\\frac{1}{2}$, a valid solution.' },

  { id: 'GXM2-15', skill: 'psda_data', difficulty: 'extreme', type: 'mcq',
    stem: 'A biologist models the size of a population using the equation $P = 120 + 8t$, where $t$ is the number of whole months since the study began. According to this model, during which month will the population first exceed 250?',
    choices: ['16', '17', '18', '32'], answer: 'B',
    explanation: 'Solve $120 + 8t > 250$: $8t > 130$, so $t > 16.25$. Since $t$ counts whole months, the first month for which the population exceeds 250 is $t = 17$, choice (B). Check: at $t = 16$, $P = 120 + 128 = 248$, still below 250; at $t = 17$, $P = 120 + 136 = 256$, above 250. (A) 16 rounds 16.25 down, but month 16 reaches only 248. (C) 18 rounds up one month too far. (D) 32 comes from solving $8t = 250$ ($t \\approx 31.25$, then rounding up), ignoring the initial value of 120.' },

  { id: 'GXM2-16', skill: 'geo_trig', difficulty: 'extreme', type: 'mcq',
    stem: 'From a point on level ground, the angle of elevation to the top of a vertical flagpole is $30^\\circ$. From a second point on the same straight path, 50 feet closer to the base of the flagpole, the angle of elevation to the top is $45^\\circ$. What is the height, in feet, of the flagpole?',
    choices: ['$25(\\sqrt{3} + 1)$', '$25(\\sqrt{3} - 1)$', '$50(\\sqrt{3} + 1)$', '$25\\sqrt{3}$'], answer: 'A',
    explanation: 'Let $h$ be the height and $d$ the horizontal distance from the closer point to the base. From the closer point, $\\tan 45^\\circ = \\frac{h}{d} = 1$, so $d = h$. From the farther point, $\\tan 30^\\circ = \\frac{h}{d + 50} = \\frac{1}{\\sqrt{3}}$, so $d + 50 = h\\sqrt{3}$. Substituting $d = h$ gives $h + 50 = h\\sqrt{3}$, so $50 = h(\\sqrt{3} - 1)$ and $h = \\frac{50}{\\sqrt{3} - 1} = \\frac{50(\\sqrt{3} + 1)}{(\\sqrt{3} - 1)(\\sqrt{3} + 1)} = \\frac{50(\\sqrt{3} + 1)}{2} = 25(\\sqrt{3} + 1)$, choice (A). (B) $25(\\sqrt{3} - 1)$ rationalizes with the wrong sign. (C) $50(\\sqrt{3} + 1)$ forgets to divide by 2 after rationalizing. (D) $25\\sqrt{3}$ keeps only one of the two terms, dropping the $+1$.' },

  { id: 'GXM2-17', skill: 'adv_polynomial', difficulty: 'extreme', type: 'spr',
    stem: 'The polynomial $p(x) = x^3 + ax^2 - 13x + b$, where $a$ and $b$ are constants, is divisible by both $(x - 1)$ and $(x + 3)$. What is the value of $p(2)$?',
    answer: '-15',
    explanation: 'If $(x - 1)$ and $(x + 3)$ are factors, then $p(1) = 0$ and $p(-3) = 0$. From $p(1) = 1 + a - 13 + b = 0$ we get $a + b = 12$. From $p(-3) = -27 + 9a + 39 + b = 0$ we get $9a + b = -12$. Subtracting the first equation from the second gives $8a = -24$, so $a = -3$ and $b = 15$. Then $p(x) = x^3 - 3x^2 - 13x + 15$, and $p(2) = 8 - 12 - 26 + 15 = -15$.' },

  { id: 'GXM2-18', skill: 'psda_percent', difficulty: 'extreme', type: 'mcq',
    stem: 'At a company, 60% of the employees are engineers and the remaining 40% are non-engineers. Exactly 40% of the engineers hold a graduate degree, and exactly 75% of the non-engineers hold a graduate degree. If an employee who holds a graduate degree is selected at random, what is the probability that this employee is an engineer?',
    choices: ['$\\frac{2}{5}$', '$\\frac{6}{25}$', '$\\frac{4}{9}$', '$\\frac{5}{9}$'], answer: 'C',
    explanation: 'Consider 100 employees: 60 engineers and 40 non-engineers. Engineers with a graduate degree number $0.40 \\times 60 = 24$; non-engineers with a graduate degree number $0.75 \\times 40 = 30$. The total number of graduate-degree holders is $24 + 30 = 54$. Among these, the fraction who are engineers is $\\frac{24}{54} = \\frac{4}{9}$, choice (C). (A) $\\frac{2}{5}$ merely restates the 40% graduate rate among engineers, not the requested conditional probability. (B) $\\frac{6}{25} = \\frac{24}{100}$ is the probability of being an engineer with a graduate degree, not conditioned on holding a degree. (D) $\\frac{5}{9} = \\frac{30}{54}$ is the probability that the graduate-degree holder is a non-engineer, the complement.' }
);
