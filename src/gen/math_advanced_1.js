/* gen: math advanced batch 1 */
GEN_BANK.push(
  { id: 'GAD1-01', skill: 'adv_quadratic', difficulty: 1, type: 'mcq',
    stem: 'What are all solutions to the equation $(x-3)(x+5)=0$?',
    choices: ['$x=-3$ or $x=5$', '$x=3$ or $x=-5$', '$x=3$ or $x=5$', '$x=-3$ or $x=-5$'], answer: 'B',
    explanation: 'By the zero-product property, set each factor equal to 0: $x-3=0$ gives $x=3$, and $x+5=0$ gives $x=-5$ (B). Choice A reverses both signs by reading each factor’s number directly; choices C and D each keep the wrong sign on one root.' },

  { id: 'GAD1-02', skill: 'adv_quadratic', difficulty: 1, type: 'mcq',
    stem: 'If $x^2=36$, which of the following gives all real values of $x$?',
    choices: ['$x=6$', '$x=-6$', '$x=6$ or $x=-6$', '$x=18$'], answer: 'C',
    explanation: 'Taking the square root of both sides gives $|x|=6$, so $x=6$ or $x=-6$ (C). Choices A and B keep only one root, dropping the $\\pm$; choice D incorrectly divides 36 by 2 instead of taking a square root.' },

  { id: 'GAD1-03', skill: 'adv_exponents', difficulty: 1, type: 'mcq',
    stem: 'Which expression is equivalent to $x^3\\cdot x^5$?',
    choices: ['$x^8$', '$x^{15}$', '$x^2$', '$2x^8$'], answer: 'A',
    explanation: 'Multiplying powers with the same base adds the exponents: $x^{3+5}=x^8$ (A). Choice B multiplies the exponents; choice C subtracts them; choice D invents a coefficient of 2 by adding the bases instead of keeping a single $x$.' },

  { id: 'GAD1-04', skill: 'adv_exponents', difficulty: 1, type: 'mcq',
    stem: 'Which expression is equivalent to $(2x^2)^3$?',
    choices: ['$6x^6$', '$8x^5$', '$2x^6$', '$8x^6$'], answer: 'D',
    explanation: 'Raise each factor to the third power: $(2x^2)^3=2^3\\cdot(x^2)^3=8x^6$ (D). Choice A multiplies $2\\cdot3$ for the coefficient; choice B adds the exponents ($2+3$) instead of multiplying; choice C forgets to cube the 2.' },

  { id: 'GAD1-05', skill: 'adv_functions', difficulty: 1, type: 'mcq',
    stem: 'The function $f$ is defined by $f(x)=x^2-3x$. What is the value of $f(4)$?',
    choices: ['$-4$', '$28$', '$4$', '$13$'], answer: 'C',
    explanation: 'Substitute $x=4$: $f(4)=4^2-3(4)=16-12=4$ (C). Choice A treats $4^2$ as $2\\cdot4=8$, giving $8-12=-4$; choice B adds instead of subtracting ($16+12$); choice D uses $3$ in place of $3\\cdot4$, giving $16-3$.' },

  { id: 'GAD1-06', skill: 'adv_quadratic', difficulty: 2, type: 'mcq',
    stem: 'What are all solutions to the equation $x^2+3x-10=0$?',
    choices: ['$x=2$ or $x=-5$', '$x=-2$ or $x=5$', '$x=2$ or $x=5$', '$x=-2$ or $x=-5$'], answer: 'A',
    explanation: 'Find two numbers with product $-10$ and sum $+3$: these are $+5$ and $-2$, so $(x+5)(x-2)=0$ and $x=-5$ or $x=2$ (A). Choice B reverses every sign; choices C and D each carry a wrong sign on one root.' },

  { id: 'GAD1-07', skill: 'adv_quadratic', difficulty: 2, type: 'spr',
    stem: 'In the equation $x^2-10x+c=0$, $c$ is a constant. If the equation has exactly one real solution, what is the value of $c$?',
    answer: '25',
    explanation: 'A quadratic has exactly one real solution when its discriminant is 0. Here $b^2-4ac=(-10)^2-4(1)(c)=100-4c=0$, so $c=25$. Equivalently, the equation becomes the perfect square $(x-5)^2=0$.' },

  { id: 'GAD1-08', skill: 'adv_quadratic', difficulty: 2, type: 'mcq',
    stem: 'The graph of $y=x^2-6x+5$ in the $xy$-plane is a parabola. What are the coordinates of its vertex?',
    choices: ['$(-3,-4)$', '$(3,-4)$', '$(3,4)$', '$(6,5)$'], answer: 'B',
    explanation: 'The axis of symmetry is $x=-\\frac{b}{2a}=\\frac{6}{2}=3$; then $y=3^2-6(3)+5=-4$, so the vertex is $(3,-4)$ (B). Choice A flips the sign of the $x$-coordinate; choice C flips the sign of the $y$-coordinate; choice D just reads off $b$ and $c$.' },

  { id: 'GAD1-09', skill: 'adv_quadratic', difficulty: 2, type: 'mcq',
    stem: 'How many distinct real solutions does the equation $x^2-4x+7=0$ have?',
    choices: ['$0$', '$1$', '$2$', 'Infinitely many'], answer: 'A',
    explanation: 'The discriminant is $b^2-4ac=(-4)^2-4(1)(7)=16-28=-12$. Because it is negative, the equation has no real solutions (A). A discriminant of 0 would give the single solution in B, and a positive value would give the two in C; a quadratic cannot have infinitely many solutions, ruling out D.' },

  { id: 'GAD1-10', skill: 'adv_quadratic', difficulty: 2, type: 'spr',
    stem: 'The solutions to the equation $x^2-8x+12=0$ are $r$ and $s$. What is the value of $r+s$?',
    answer: '8',
    explanation: 'The sum of the roots of $x^2+bx+c=0$ equals $-\\frac{b}{a}$, which here is $-\\frac{-8}{1}=8$. Checking by factoring, $(x-2)(x-6)=0$ gives roots 2 and 6, and $2+6=8$.' },

  { id: 'GAD1-11', skill: 'adv_exponents', difficulty: 2, type: 'mcq',
    stem: 'For $x\\neq0$, which expression is equivalent to $2x^{-3}$?',
    choices: ['$-2x^3$', '$\\frac{1}{2x^3}$', '$2x^3$', '$\\frac{2}{x^3}$'], answer: 'D',
    explanation: 'A negative exponent gives a reciprocal: $x^{-3}=\\frac{1}{x^3}$, and the coefficient 2 stays in the numerator, so $2x^{-3}=\\frac{2}{x^3}$ (D). Choice A misreads the negative exponent as a negative sign; choice B wrongly moves the 2 into the denominator; choice C ignores the negative exponent entirely.' },

  { id: 'GAD1-12', skill: 'adv_exponents', difficulty: 2, type: 'spr',
    stem: 'What is the value of $27^{\\frac{2}{3}}$?',
    answer: '9',
    explanation: 'A rational exponent means root then power: $27^{\\frac{2}{3}}=(27^{\\frac{1}{3}})^2=3^2=9$, since the cube root of 27 is 3.' },

  { id: 'GAD1-13', skill: 'adv_exponential', difficulty: 2, type: 'mcq',
    stem: 'The number of members of a club is modeled by $P(t)=500(1.08)^t$, where $t$ is the number of years since the club formed. Which of the following is the best interpretation of the number $1.08$ in this model?',
    choices: ['The number of members increases by $108\\%$ each year.', 'The number of members increases by $1.08$ each year.', 'The number of members increases by $8\\%$ each year.', 'The number of members increases by 8 each year.'], answer: 'C',
    explanation: 'The base $1.08=1+0.08$ represents a constant $8\\%$ increase each year (C). Choice A misreads $1.08$ as $108\\%$; choices B and D treat the factor as a fixed amount added each year rather than a percent growth rate.' },

  { id: 'GAD1-14', skill: 'adv_polynomial', difficulty: 2, type: 'mcq',
    stem: 'Which of the following is equivalent to $4x^2-25$?',
    choices: ['$(2x-5)^2$', '$(2x-5)(2x+5)$', '$(4x-5)(x+5)$', '$(2x+5)^2$'], answer: 'B',
    explanation: 'This is a difference of squares: $4x^2-25=(2x)^2-5^2=(2x-5)(2x+5)$ (B). Choices A and D are perfect-square forms that would produce a middle term; choice C expands to $4x^2+15x-25$, which is not equal to the original.' },

  { id: 'GAD1-15', skill: 'adv_rational', difficulty: 3, type: 'mcq',
    stem: 'What are all solutions to the equation $x+\\frac{6}{x}=5$?',
    choices: ['$x=-2$ or $x=-3$', '$x=1$ or $x=6$', '$x=2$ or $x=-3$', '$x=2$ or $x=3$'], answer: 'D',
    explanation: 'Multiply both sides by $x$: $x^2+6=5x$, so $x^2-5x+6=0$ and $(x-2)(x-3)=0$, giving $x=2$ or $x=3$ (D); both are nonzero, so both check. Choice A reverses the signs; choice B factors 6 as $1\\cdot6$ while ignoring the $-5x$ term; choice C carries a wrong sign on one root.' },

  { id: 'GAD1-16', skill: 'adv_quadratic', difficulty: 3, type: 'mcq',
    stem: 'What are the solutions to the equation $x^2-6x+4=0$?',
    choices: ['$3\\pm\\sqrt{5}$', '$6\\pm\\sqrt{5}$', '$3\\pm2\\sqrt{5}$', '$-3\\pm\\sqrt{5}$'], answer: 'A',
    explanation: 'By the quadratic formula, $x=\\frac{6\\pm\\sqrt{36-16}}{2}=\\frac{6\\pm\\sqrt{20}}{2}=\\frac{6\\pm2\\sqrt{5}}{2}=3\\pm\\sqrt{5}$ (A). Choice B forgets to divide the 6 by 2; choice C forgets to divide the radical term by 2; choice D uses the wrong sign for $-b$.' },

  { id: 'GAD1-17', skill: 'adv_exponential', difficulty: 3, type: 'spr',
    stem: 'The amount of a decaying substance, in milligrams, after $t$ days is given by $A(t)=800(0.5)^{\\frac{t}{6}}$. How many milligrams remain after 18 days?',
    answer: '100',
    explanation: 'After 18 days the exponent is $\\frac{18}{6}=3$, so $A(18)=800(0.5)^3=800\\cdot\\frac{1}{8}=100$ milligrams. The substance halves three times: $800\\to400\\to200\\to100$.' },

  { id: 'GAD1-18', skill: 'adv_quadratic', difficulty: 3, type: 'mcq',
    stem: 'In the equation $x^2+bx+c=0$, $b$ and $c$ are constants. If the solutions to the equation are $x=3$ and $x=8$, what is the value of $b+c$?',
    choices: ['$35$', '$-35$', '$13$', '$24$'], answer: 'C',
    explanation: 'For $x^2+bx+c=0$ with roots 3 and 8, the sum of the roots gives $b=-(3+8)=-11$ and the product gives $c=(3)(8)=24$, so $b+c=-11+24=13$ (C). Choice A drops the negative sign on $b$ ($11+24$); choice B makes both terms negative; choice D reports only $c$.' },

  { id: 'GAD1-19', skill: 'adv_polynomial', difficulty: 3, type: 'mcq',
    stem: 'The polynomial $p$ is defined by $p(x)=2x^3-3x^2+kx-5$, where $k$ is a constant. If $x-1$ is a factor of $p(x)$, what is the value of $k$?',
    choices: ['$-6$', '$6$', '$-10$', '$0$'], answer: 'B',
    explanation: 'If $x-1$ is a factor, then $p(1)=0$. Substituting: $2(1)-3(1)+k(1)-5=k-6=0$, so $k=6$ (B). Choice C comes from mistakenly using $x=-1$ (which gives $-10-k=0$); choices A and D come from sign or arithmetic slips.' },

  { id: 'GAD1-20', skill: 'adv_rational', difficulty: 3, type: 'spr',
    stem: 'What is the solution to the equation $\\sqrt{2x+1}=x-1$?',
    answer: '4',
    explanation: 'Square both sides: $2x+1=(x-1)^2=x^2-2x+1$, so $x^2-4x=0$ and $x(x-4)=0$, giving $x=0$ or $x=4$. Check each: $x=0$ gives $\\sqrt{1}=1$ but $x-1=-1$, so it is extraneous; $x=4$ gives $\\sqrt{9}=3=4-1$. The only solution is $x=4$.' },

  { id: 'GAD1-21', skill: 'adv_functions', difficulty: 3, type: 'mcq',
    stem: 'The function $g$ is defined by $g(x)=(x-2)^2-9$. For what values of $x$ does $g(x)=0$?',
    choices: ['$x=2$ and $x=-9$', '$x=-5$ and $x=1$', '$x=5$ only', '$x=-1$ and $x=5$'], answer: 'D',
    explanation: 'Set $g(x)=0$: $(x-2)^2=9$, so $x-2=\\pm3$, giving $x=5$ or $x=-1$ (D). Choice A misreads the vertex coordinates $(2,-9)$ as solutions; choice B flips the signs; choice C keeps only the $+3$ case and drops $x=-1$.' }
);
