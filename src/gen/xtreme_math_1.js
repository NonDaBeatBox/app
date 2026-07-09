/* gen: extreme math 1 */
GEN_BANK.push(
  { id: 'GXM1-01', skill: 'alg_systems', difficulty: 'extreme', type: 'spr',
    stem: 'In the system of equations $3x+ky=12$ and $kx+12y=4k$, $k$ is a constant. If the system has infinitely many solutions $(x,y)$, what is the product of all possible values of $k$?',
    answer: '-36',
    explanation: 'For infinitely many solutions the two equations must be proportional, so $\\frac{3}{k}=\\frac{k}{12}=\\frac{12}{4k}$. The equation $\\frac{3}{k}=\\frac{k}{12}$ gives $k^{2}=36$, so $k=6$ or $k=-6$; the ratio $\\frac{12}{4k}=\\frac{3}{k}$ is automatically satisfied by both. Checking: $k=6$ turns both equations into $x+2y=4$, and $k=-6$ turns both into $x-2y=4$, so each value truly yields infinitely many solutions. The product is $6\\cdot(-6)=-36$. A common error is to report only $k=6$ (missing the negative root) or to stop at $k^{2}=36$.' },

  { id: 'GXM1-02', skill: 'adv_quadratic', difficulty: 'extreme', type: 'mcq',
    stem: 'In the equation $2x^{2}-8x+k=0$, $k$ is a constant. If one solution of the equation is 3 times the other solution, what is the value of $k$?',
    choices: ['$3$', '$6$', '$12$', '$24$'], answer: 'B',
    explanation: 'Let the solutions be $r$ and $3r$. By Vieta’s formulas the sum is $r+3r=4r=\\frac{-(-8)}{2}=4$, so $r=1$; the product is $r\\cdot3r=3r^{2}=\\frac{k}{2}$, giving $3(1)^{2}=\\frac{k}{2}$ and $k=6$ (B). Substituting back, $2x^{2}-8x+6=0$ factors as $2(x-1)(x-3)$, with roots 1 and 3. Choice A comes from setting the product equal to $k$ instead of $\\frac{k}{2}$. Choices C and D come from mishandling the leading coefficient in the sum ($4r=8$, so $r=2$), then computing $3r^{2}=12$ or $\\frac{k}{2}=12$.' },

  { id: 'GXM1-03', skill: 'adv_exponential', difficulty: 'extreme', type: 'mcq',
    stem: 'For the equation $9^{x}-4\\cdot3^{x}+3=0$, what is the sum of all values of $x$ that satisfy the equation?',
    choices: ['$0$', '$1$', '$3$', '$4$'], answer: 'B',
    explanation: 'Let $u=3^{x}$, so $9^{x}=(3^{x})^{2}=u^{2}$ and the equation becomes $u^{2}-4u+3=0$, which factors as $(u-1)(u-3)=0$. Then $u=1$ gives $3^{x}=1$, so $x=0$, and $u=3$ gives $3^{x}=3$, so $x=1$. Both values are valid, and their sum is $0+1=1$ (B). Choice A keeps only $x=0$. Choice C reports a $u$-value ($u=3$) as if it were $x$. Choice D adds the two $u$-values ($1+3$) instead of the $x$-values.' },

  { id: 'GXM1-04', skill: 'adv_exponents', difficulty: 'extreme', type: 'spr',
    stem: 'For $x>1$, the expression $\\sqrt{x\\sqrt{x\\sqrt{x}}}$ is equal to $x^{k}$ for some constant $k$. What is the value of $k$?',
    answer: '7/8',
    explanation: 'Work from the inside out using fractional exponents. The innermost radical is $\\sqrt{x}=x^{1/2}$; then $x\\sqrt{x}=x^{3/2}$ and $\\sqrt{x^{3/2}}=x^{3/4}$; finally $x\\cdot x^{3/4}=x^{7/4}$ and $\\sqrt{x^{7/4}}=x^{7/8}$. Thus $k=\\frac{7}{8}$. Stopping one layer too early gives $\\frac{3}{4}$, and treating each radical as acting on only a single $x$ gives $\\frac{1}{8}$.' },

  { id: 'GXM1-05', skill: 'adv_polynomial', difficulty: 'extreme', type: 'mcq',
    stem: 'The polynomial $p(x)=x^{3}-6x^{2}+11x+k$ has three real zeros that form an arithmetic sequence. What is the value of $k$?',
    choices: ['$-6$', '$0$', '$6$', '$11$'], answer: 'A',
    explanation: 'If the three zeros form an arithmetic sequence, write them as $a-d$, $a$, and $a+d$. Their sum is $3a$, and by Vieta’s formulas the sum of the zeros equals $-\\frac{-6}{1}=6$, so $3a=6$ and $a=2$. Therefore $x=2$ is a zero, so $p(2)=8-24+22+k=6+k=0$, giving $k=-6$ (A). Indeed $x^{3}-6x^{2}+11x-6=(x-1)(x-2)(x-3)$, with zeros 1, 2, 3. Choice C flips the sign of $p(2)$. Choice D just copies the coefficient 11, and choice B assumes the constant term must be 0.' },

  { id: 'GXM1-06', skill: 'adv_rational', difficulty: 'extreme', type: 'spr',
    stem: 'What value of $x$ satisfies the equation $\\frac{x}{x-2}+\\frac{4}{x+2}=\\frac{8}{x^{2}-4}$?',
    answer: '-8',
    explanation: 'Multiply both sides by $(x-2)(x+2)=x^{2}-4$: $x(x+2)+4(x-2)=8$. Expanding gives $x^{2}+6x-8=8$, so $x^{2}+6x-16=0$ and $(x+8)(x-2)=0$, giving $x=-8$ or $x=2$. However, $x=2$ makes the denominator $x-2$ equal to 0, so it is extraneous and must be rejected. The only valid solution is $x=-8$. Substituting confirms $\\frac{-8}{-10}+\\frac{4}{-6}=\\frac{8}{60}$.' },

  { id: 'GXM1-07', skill: 'adv_functions', difficulty: 'extreme', type: 'mcq',
    stem: 'The function $f$ satisfies $f(2x-1)=4x^{2}+2x$ for all real numbers $x$. What is the value of $f(3)$?',
    choices: ['$12$', '$20$', '$30$', '$42$'], answer: 'B',
    explanation: 'To find $f(3)$, choose $x$ so that the input $2x-1$ equals 3: $2x-1=3$ gives $x=2$. Then $f(3)=4(2)^{2}+2(2)=16+4=20$ (B). Equivalently, letting $u=2x-1$ gives $f(u)=(u+1)(u+2)$, so $f(3)=4\\cdot5=20$. Choice D substitutes $x=3$ directly into $4x^{2}+2x$. Choice A uses $x=2$ but forgets to square, computing $4(2)+2(2)$. Choice C comes from a sign slip, evaluating $4x^{2}-2x$ at the output value 3.' },

  { id: 'GXM1-08', skill: 'psda_ratio', difficulty: 'extreme', type: 'mcq',
    stem: 'A tank contains 60 liters of a mixture that is 30% antifreeze by volume. Some of the mixture is drained and replaced with an equal volume of pure antifreeze, so that the tank again holds 60 liters. If the resulting mixture is 65% antifreeze, how many liters were drained and replaced?',
    choices: ['$21$', '$30$', '$39$', '$42$'], answer: 'B',
    explanation: 'Let $x$ be the number of liters drained and replaced. The tank starts with $0.30(60)=18$ liters of antifreeze. Draining $x$ liters of the 30% mixture removes $0.30x$ liters of antifreeze, and adding $x$ liters of pure antifreeze adds $x$ liters, so the new amount is $18-0.30x+x=18+0.70x$. Setting the concentration to 65% of 60 liters: $18+0.70x=0.65(60)=39$, so $0.70x=21$ and $x=30$ (B). Choice A stops at $0.70x=21$ and reports 21. Choice C reports 39, the final amount of antifreeze, not the volume replaced. Choice D is $0.70(60)$, applying the 70% to the wrong quantity.' },

  { id: 'GXM1-09', skill: 'psda_percent', difficulty: 'extreme', type: 'spr',
    stem: 'At a company, 60% of the employees are engineers and the rest are not. Of the engineers, 30% are managers, and of the employees who are not engineers, 50% are managers. If the number of employees who are not managers is 60 more than the number who are managers, how many employees does the company have?',
    answer: '250',
    explanation: 'Let $N$ be the total number of employees. Engineers number $0.60N$ and non-engineers $0.40N$. Managers total $0.30(0.60N)+0.50(0.40N)=0.18N+0.20N=0.38N$, so non-managers total $N-0.38N=0.62N$. The condition that there are 60 more non-managers than managers gives $0.62N-0.38N=0.24N=60$, so $N=250$. Check: 150 engineers and 100 non-engineers give $45+50=95$ managers and 155 non-managers, and $155-95=60$.' },

  { id: 'GXM1-10', skill: 'psda_stats', difficulty: 'extreme', type: 'spr',
    stem: 'A list of 5 positive integers has a mean of 8 and a median of 9. What is the greatest possible value of any single integer in the list?',
    answer: '20',
    explanation: 'The five positive integers have a mean of 8, so their sum is $5\\times8=40$. To make one integer as large as possible, make the other four as small as possible. In increasing order, the third value is the median, which must equal 9. The two values below it are positive integers, so their least possible values are 1 and 1, and the fourth value must be at least the median, so its least value is 9. That accounts for $1+1+9+9=20$, leaving $40-20=20$ for the largest integer. The list $1,1,9,9,20$ has mean 8 and median 9, so the greatest possible value is 20.' },

  { id: 'GXM1-11', skill: 'geo_circles', difficulty: 'extreme', type: 'mcq',
    stem: 'In the $xy$-plane, a circle has equation $(x-6)^{2}+(y-8)^{2}=25$. What is the length of the shortest chord of this circle that passes through the point $(9,8)$?',
    choices: ['$4$', '$6$', '$8$', '$10$'], answer: 'C',
    explanation: 'The circle has center $(6,8)$ and radius $\\sqrt{25}=5$. The point $(9,8)$ lies at distance $|9-6|=3$ from the center, which is less than 5, so the point is inside the circle. Among all chords through an interior point, the shortest is the one perpendicular to the segment joining the center to that point. Its half-length is $\\sqrt{r^{2}-d^{2}}=\\sqrt{25-9}=4$, so the chord has length 8 (C). Choice D, 10, is the diameter, which is the longest chord. Choice A, 4, is only half the chord. Choice B, 6, doubles the distance from the center to the point instead.' },

  { id: 'GXM1-12', skill: 'geo_trig', difficulty: 'extreme', type: 'mcq',
    stem: 'Angles are measured in degrees. If $\\sin(4k+10)^{\\circ}=\\cos(2k+20)^{\\circ}$, where $4k+10$ and $2k+20$ are the measures of two acute angles, what is the value of $k$?',
    choices: ['$5$', '$10$', '$15$', '$20$'], answer: 'B',
    explanation: 'Since $\\sin\\theta=\\cos(90^{\\circ}-\\theta)$, two acute angles whose sine and cosine match in this way must be complementary. So $(4k+10)+(2k+20)=90$, giving $6k+30=90$, $6k=60$, and $k=10$ (B). Then the angles are $50^{\\circ}$ and $40^{\\circ}$, and $\\sin50^{\\circ}=\\cos40^{\\circ}$. Choice A sets the two expressions equal ($4k+10=2k+20$), which would make the angles equal rather than complementary. Choice C drops the constant terms, solving $6k=90$. Choice D results from setting the angle sum to 120 instead of 90.' },

  { id: 'GXM1-13', skill: 'alg_word', difficulty: 'extreme', type: 'mcq',
    stem: 'Two cars leave the same point traveling along the same straight road in the same direction. The first car travels at a constant 40 miles per hour. One hour later, the second car leaves the same point traveling at a constant 60 miles per hour. How many miles from the starting point does the second car catch up to the first?',
    choices: ['$80$', '$100$', '$120$', '$180$'], answer: 'C',
    explanation: 'Measure time $t$ in hours after the second car starts. When the second car has traveled for $t$ hours, the first car has traveled for $t+1$ hours, so their distances are $60t$ and $40(t+1)$. Setting them equal: $60t=40t+40$, so $20t=40$ and $t=2$. The second car has then traveled $60\\times2=120$ miles (C). Choice A, 80, uses the first car’s speed for the catch-up time ($40\\times2$). Choice B, 100, simply adds the two speeds. Choice D, 180, multiplies the second car’s speed by the first car’s total travel time of 3 hours.' },

  { id: 'GXM1-14', skill: 'adv_quadratic', difficulty: 'extreme', type: 'spr',
    stem: 'In the equation $x^{2}-(k+3)x+(2k+2)=0$, $k$ is a positive constant. The two solutions of the equation have squares that sum to 13. What is the value of $k$?',
    answer: '2',
    explanation: 'Let the solutions be $r$ and $s$. By Vieta’s formulas, $r+s=k+3$ and $rs=2k+2$. The sum of their squares is $r^{2}+s^{2}=(r+s)^{2}-2rs=(k+3)^{2}-2(2k+2)=k^{2}+2k+5$. Setting this equal to 13 gives $k^{2}+2k-8=0$, so $(k+4)(k-2)=0$ and $k=2$ or $k=-4$. Since $k$ is positive, $k=2$. Check: $x^{2}-5x+6=0$ has solutions 2 and 3, and $2^{2}+3^{2}=13$.' },

  { id: 'GXM1-15', skill: 'adv_rational', difficulty: 'extreme', type: 'mcq',
    stem: 'For $x\\neq4$ and $x\\neq-4$, the expression $\\frac{2x^{2}+3x-20}{x^{2}-16}$ is equivalent to $\\frac{ax+b}{x-4}$, where $a$ and $b$ are constants. What is the value of $a+b$?',
    choices: ['$-7$', '$-3$', '$3$', '$7$'], answer: 'B',
    explanation: 'Factor the numerator and denominator. The numerator $2x^{2}+3x-20$ factors as $(2x-5)(x+4)$, and the denominator $x^{2}-16$ factors as $(x-4)(x+4)$. Canceling the common factor $x+4$ leaves $\\frac{2x-5}{x-4}$, so $a=2$ and $b=-5$, giving $a+b=-3$ (B). The other choices are the remaining sign combinations of 2 and 5: choice A is $(-2)+(-5)$, choice C is $(-2)+5$, and choice D is $2+5$ (taking $b$ as $+5$), each resulting from a sign error in factoring or canceling.' },

  { id: 'GXM1-16', skill: 'geo_circles', difficulty: 'extreme', type: 'mcq',
    stem: 'A sector of a circle of radius 6 has an area of $15\\pi$. What is the length of the arc that bounds this sector?',
    choices: ['$\\frac{5\\pi}{6}$', '$5\\pi$', '$\\frac{5\\pi}{2}$', '$10\\pi$'], answer: 'B',
    explanation: 'The area of a sector is $\\frac{1}{2}r^{2}\\theta$, where $\\theta$ is the central angle in radians. So $\\frac{1}{2}(6)^{2}\\theta=18\\theta=15\\pi$, giving $\\theta=\\frac{5\\pi}{6}$. The arc length is $s=r\\theta=6\\cdot\\frac{5\\pi}{6}=5\\pi$ (B). Equivalently, area $=\\frac{1}{2}rs$ gives $15\\pi=3s$, so $s=5\\pi$. Choice A reports the central angle $\\frac{5\\pi}{6}$ as if it were the arc length. Choice C, $\\frac{5\\pi}{2}$, divides the area by the radius. Choice D doubles the correct arc length.' },

  { id: 'GXM1-17', skill: 'adv_functions', difficulty: 'extreme', type: 'mcq',
    stem: 'The functions $f$ and $g$ are defined by $f(x)=2x-1$ and $g(x)=x^{2}+k$, where $k$ is a constant. If $f(g(2))=15$, what is the value of $g(f(2))$?',
    choices: ['$9$', '$13$', '$15$', '$29$'], answer: 'B',
    explanation: 'First find $k$. Since $g(2)=2^{2}+k=4+k$, we have $f(g(2))=2(4+k)-1=7+2k$. Setting $7+2k=15$ gives $k=4$, so $g(x)=x^{2}+4$. Now $f(2)=2(2)-1=3$, so $g(f(2))=g(3)=3^{2}+4=13$ (B). Choice A forgets to add $k$, computing $3^{2}=9$. Choice C just restates the given value $f(g(2))=15$. Choice D comes from miscomputing $f(2)$ as $2(2)+1=5$, giving $g(5)=25+4=29$.' },

  { id: 'GXM1-18', skill: 'geo_trig', difficulty: 'extreme', type: 'mcq',
    stem: 'In right triangle $PQR$, the right angle is at $Q$, side $PQ$ has length 6, and $\\tan P=\\frac{\\sqrt{7}}{3}$. What is the length of the hypotenuse $PR$?',
    choices: ['$2\\sqrt{7}$', '$\\sqrt{43}$', '$8$', '$10$'], answer: 'C',
    explanation: 'In right triangle $PQR$ with the right angle at $Q$, the legs are $PQ$ and $QR$ and the hypotenuse is $PR$. For angle $P$, the opposite side is $QR$ and the adjacent side is $PQ=6$, so $\\tan P=\\frac{QR}{6}=\\frac{\\sqrt{7}}{3}$, giving $QR=\\frac{6\\sqrt{7}}{3}=2\\sqrt{7}$. Then $PR=\\sqrt{PQ^{2}+QR^{2}}=\\sqrt{36+(2\\sqrt{7})^{2}}=\\sqrt{36+28}=\\sqrt{64}=8$ (C). Choice A, $2\\sqrt{7}$, is the leg $QR$, not the hypotenuse. Choice B, $\\sqrt{43}$, uses $\\sqrt{7}$ itself as the leg ($\\sqrt{36+7}$). Choice D, 10, wrongly assumes a 6-8-10 triangle.' }
);
