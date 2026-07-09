/* gen: math geotrig batch 2 */
GEN_BANK.push(
  { id: 'GGT2-01', skill: 'geo_trig', difficulty: 1, type: 'mcq',
    stem: 'A right triangle has legs of length 6 and 8. What is the length of the hypotenuse?',
    choices: ['14', '48', '10', '$\\sqrt{28}$'], answer: 'C',
    explanation: 'By the Pythagorean theorem, $c=\\sqrt{6^2+8^2}=\\sqrt{36+64}=\\sqrt{100}=10$. (A) 14 adds the two legs; (B) 48 multiplies them; (D) $\\sqrt{28}$ subtracts the squares instead of adding.' },

  { id: 'GGT2-02', skill: 'geo_circles', difficulty: 1, type: 'mcq',
    stem: 'In the $xy$-plane, the graph of $(x-3)^2+(y+2)^2=16$ is a circle. What are the coordinates of the center of the circle?',
    choices: ['$(3, -2)$', '$(-3, 2)$', '$(3, 2)$', '$(-3, -2)$'], answer: 'A',
    explanation: 'In the standard form $(x-h)^2+(y-k)^2=r^2$ the center is $(h,k)$. Here $x-3$ gives $h=3$ and $y+2=y-(-2)$ gives $k=-2$, so the center is $(3,-2)$. (B) reverses both signs; (C) misreads the sign of the $y$-term; (D) misreads the sign of the $x$-term.' },

  { id: 'GGT2-03', skill: 'geo_circles', difficulty: 1, type: 'mcq',
    stem: 'A circle has a radius of 5. What is the area of the circle?',
    choices: ['$10\\pi$', '$25\\pi$', '$100\\pi$', '$5\\pi$'], answer: 'B',
    explanation: 'The area is $\\pi r^2=\\pi(5)^2=25\\pi$. (A) $10\\pi$ is the circumference $2\\pi r$; (C) $100\\pi$ squares the diameter 10 instead of the radius; (D) $5\\pi$ multiplies $\\pi$ by $r$ without squaring.' },

  { id: 'GGT2-04', skill: 'geo_trig', difficulty: 1, type: 'mcq',
    stem: 'In right triangle $ABC$, the right angle is at $C$. The side opposite angle $A$ has length 5 and the hypotenuse has length 13. What is the value of $\\sin A$?',
    choices: ['$\\frac{13}{5}$', '$\\frac{12}{13}$', '$\\frac{5}{12}$', '$\\frac{5}{13}$'], answer: 'D',
    explanation: 'By SOH, $\\sin A=\\frac{\\text{opposite}}{\\text{hypotenuse}}=\\frac{5}{13}$. (A) inverts the ratio; (B) $\\frac{12}{13}$ is $\\cos A$ (the adjacent side 12 over the hypotenuse); (C) $\\frac{5}{12}$ is $\\tan A$.' },

  { id: 'GGT2-05', skill: 'geo_trig', difficulty: 2, type: 'mcq',
    stem: 'In a 45-45-90 right triangle, each leg has length 7. What is the length of the hypotenuse?',
    choices: ['$7\\sqrt{2}$', '7', '14', '$\\frac{7}{\\sqrt{2}}$'], answer: 'A',
    explanation: 'In a 45-45-90 triangle the hypotenuse equals a leg times $\\sqrt{2}$, so it is $7\\sqrt{2}$. (B) 7 repeats a leg length; (C) 14 doubles the leg; (D) $\\frac{7}{\\sqrt{2}}$ divides by $\\sqrt{2}$ instead of multiplying.' },

  { id: 'GGT2-06', skill: 'geo_circles', difficulty: 2, type: 'spr',
    stem: 'An angle measures $\\frac{3\\pi}{4}$ radians. What is the measure of this angle, in degrees?',
    answer: '135',
    explanation: 'To convert radians to degrees, multiply by $\\frac{180}{\\pi}$: $\\frac{3\\pi}{4}\\cdot\\frac{180}{\\pi}=\\frac{3\\cdot 180}{4}=\\frac{540}{4}=135$ degrees.' },

  { id: 'GGT2-07', skill: 'geo_circles', difficulty: 2, type: 'mcq',
    stem: 'A circle has a radius of 9. A sector of the circle has a central angle of $80^\\circ$. What is the length of the arc that bounds this sector?',
    choices: ['$8\\pi$', '$18\\pi$', '$4\\pi$', '$2\\pi$'], answer: 'C',
    explanation: 'Arc length $=\\frac{80}{360}\\cdot 2\\pi r=\\frac{2}{9}\\cdot 2\\pi(9)=\\frac{2}{9}\\cdot 18\\pi=4\\pi$. (A) $8\\pi$ uses the diameter 18 in place of the radius; (B) $18\\pi$ is the full circumference, dropping the $\\frac{80}{360}$ fraction; (D) $2\\pi$ uses $\\pi r$ instead of $2\\pi r$.' },

  { id: 'GGT2-08', skill: 'geo_trig', difficulty: 2, type: 'mcq',
    stem: 'If $\\sin(x^\\circ)=\\cos(52^\\circ)$ and $0<x<90$, what is the value of $x$?',
    choices: ['52', '38', '48', '142'], answer: 'B',
    explanation: 'Sine and cosine of complementary angles are equal: $\\sin(x^\\circ)=\\cos(90^\\circ-x^\\circ)$. Setting $90-x=52$ gives $x=38$. (A) 52 assumes the two angles are equal; (C) 48 subtracts from 100; (D) 142 adds instead of taking the complement.' },

  { id: 'GGT2-09', skill: 'geo_circles', difficulty: 2, type: 'mcq',
    stem: 'The equation $x^2+y^2-6x+8y=0$ represents a circle in the $xy$-plane. What is the radius of the circle?',
    choices: ['25', '10', '3', '5'], answer: 'D',
    explanation: 'Complete the square: $x^2-6x+y^2+8y=0 \\Rightarrow (x-3)^2+(y+4)^2=9+16=25$, so $r=\\sqrt{25}=5$. (A) 25 is $r^2$, not the radius; (B) 10 is the diameter; (C) 3 adds only the 9 from the $x$-terms and omits the 16 from the $y$-terms.' },

  { id: 'GGT2-10', skill: 'geo_trig', difficulty: 2, type: 'spr',
    stem: 'In a 30-60-90 right triangle, the side opposite the $30^\\circ$ angle has length 7. What is the length of the hypotenuse?',
    answer: '14',
    explanation: 'The side opposite the $30^\\circ$ angle is the shortest side, and the hypotenuse is twice as long: $2\\times 7=14$.' },

  { id: 'GGT2-11', skill: 'geo_circles', difficulty: 2, type: 'mcq',
    stem: 'A sector of a circle has a radius of 6 and a central angle of $120^\\circ$. What is the area of the sector?',
    choices: ['$12\\pi$', '$4\\pi$', '$36\\pi$', '$2\\pi$'], answer: 'A',
    explanation: 'Sector area $=\\frac{120}{360}\\cdot\\pi r^2=\\frac{1}{3}\\cdot\\pi(6)^2=\\frac{1}{3}\\cdot 36\\pi=12\\pi$. (B) $4\\pi$ is the arc length $\\frac{1}{3}\\cdot 2\\pi r$, not an area; (C) $36\\pi$ is the area of the entire circle, dropping the $\\frac{1}{3}$ fraction; (D) $2\\pi$ fails to square the radius.' },

  { id: 'GGT2-12', skill: 'geo_trig', difficulty: 2, type: 'mcq',
    stem: 'In right triangle $DEF$, the right angle is at $F$. Leg $DF=8$ and leg $EF=15$. What is the value of $\\cos D$?',
    choices: ['$\\frac{15}{17}$', '$\\frac{8}{15}$', '$\\frac{8}{17}$', '$\\frac{17}{8}$'], answer: 'C',
    explanation: 'The hypotenuse is $DE=\\sqrt{8^2+15^2}=\\sqrt{289}=17$. For angle $D$ the adjacent leg is $DF=8$, so $\\cos D=\\frac{\\text{adjacent}}{\\text{hypotenuse}}=\\frac{8}{17}$. (A) $\\frac{15}{17}$ is $\\sin D$ (opposite over hypotenuse); (B) $\\frac{8}{15}$ uses the opposite leg as the denominator; (D) $\\frac{17}{8}$ inverts the ratio.' },

  { id: 'GGT2-13', skill: 'geo_circles', difficulty: 3, type: 'mcq',
    stem: 'The equation of a circle in the $xy$-plane is $x^2+y^2+10x-4y-7=0$. Which of the following gives the center and radius of the circle?',
    choices: ['Center $(5, -2)$, radius 6', 'Center $(-5, 2)$, radius 6', 'Center $(-5, 2)$, radius 36', 'Center $(-5, 2)$, radius $\\sqrt{7}$'], answer: 'B',
    explanation: 'Group and complete the square: $(x^2+10x)+(y^2-4y)=7 \\Rightarrow (x+5)^2-25+(y-2)^2-4=7 \\Rightarrow (x+5)^2+(y-2)^2=36$. The center is $(-5,2)$ and the radius is $\\sqrt{36}=6$. (A) reverses the signs of the center; (C) reports $r^2=36$ as the radius; (D) forgets to add 25 and 4 when completing the square, leaving $\\sqrt{7}$.' },

  { id: 'GGT2-14', skill: 'geo_trig', difficulty: 3, type: 'spr',
    stem: 'A straight ladder leans against a vertical wall. The foot of the ladder is 10 feet from the base of the wall, and the ladder is 26 feet long. How many feet up the wall does the top of the ladder reach?',
    answer: '24',
    explanation: 'The wall, the ground, and the ladder form a right triangle with the ladder as the hypotenuse. The height is $\\sqrt{26^2-10^2}=\\sqrt{676-100}=\\sqrt{576}=24$ feet.' },

  { id: 'GGT2-15', skill: 'geo_circles', difficulty: 3, type: 'mcq',
    stem: 'In the $xy$-plane, points $A(1,2)$ and $B(7,10)$ are the endpoints of a diameter of a circle. Which equation represents the circle?',
    choices: ['$(x-4)^2+(y-6)^2=100$', '$(x-4)^2+(y-6)^2=10$', '$(x+4)^2+(y+6)^2=25$', '$(x-4)^2+(y-6)^2=25$'], answer: 'D',
    explanation: 'The center is the midpoint of the diameter: $\\left(\\frac{1+7}{2},\\frac{2+10}{2}\\right)=(4,6)$. The diameter length is $\\sqrt{(7-1)^2+(10-2)^2}=\\sqrt{100}=10$, so the radius is 5 and $r^2=25$: $(x-4)^2+(y-6)^2=25$. (A) uses the diameter 10 as the radius ($10^2=100$); (B) puts the diameter 10 where $r^2$ belongs; (C) reverses the signs of the center coordinates.' },

  { id: 'GGT2-16', skill: 'geo_trig', difficulty: 3, type: 'mcq',
    stem: 'A right triangle has a $60^\\circ$ angle, and the side opposite the $60^\\circ$ angle has length $6\\sqrt{3}$. What is the length of the hypotenuse?',
    choices: ['12', '6', '$6\\sqrt{3}$', '$12\\sqrt{3}$'], answer: 'A',
    explanation: 'In a 30-60-90 triangle the sides are $x$ (opposite $30^\\circ$), $x\\sqrt{3}$ (opposite $60^\\circ$), and $2x$ (hypotenuse). Since $x\\sqrt{3}=6\\sqrt{3}$, we get $x=6$, so the hypotenuse is $2x=12$. (B) 6 is the short leg; (C) $6\\sqrt{3}$ just repeats the given side; (D) $12\\sqrt{3}$ doubles the given side, wrongly treating it as the short leg.' },

  { id: 'GGT2-17', skill: 'geo_circles', difficulty: 3, type: 'spr',
    stem: 'In a circle with center $O$, points $A$, $B$, and $C$ lie on the circle. The central angle $\\angle AOB$ measures $140^\\circ$. What is the measure, in degrees, of the inscribed angle $\\angle ACB$ that intercepts the same arc $AB$?',
    answer: '70',
    explanation: 'An inscribed angle is half of the central angle that intercepts the same arc: $\\frac{1}{2}\\times 140^\\circ=70^\\circ$.' },

  { id: 'GGT2-18', skill: 'geo_trig', difficulty: 3, type: 'mcq',
    stem: 'In right triangle $PQR$, the right angle is at $Q$. If $\\sin P=\\frac{7}{25}$, what is the value of $\\tan P$?',
    choices: ['$\\frac{24}{7}$', '$\\frac{7}{25}$', '$\\frac{7}{24}$', '$\\frac{24}{25}$'], answer: 'C',
    explanation: 'Since $\\sin P=\\frac{7}{25}$, the side opposite $P$ is 7 and the hypotenuse is 25, so the adjacent side is $\\sqrt{25^2-7^2}=\\sqrt{576}=24$. Then $\\tan P=\\frac{\\text{opposite}}{\\text{adjacent}}=\\frac{7}{24}$. (A) $\\frac{24}{7}$ inverts the ratio; (B) $\\frac{7}{25}$ is the given $\\sin P$; (D) $\\frac{24}{25}$ is $\\cos P$.' }
);
