/* gen: math geotrig batch 1 */
GEN_BANK.push(
  { id: 'GGT1-01', skill: 'geo_angles', difficulty: 1, type: 'mcq',
    stem: 'In triangle $ABC$, angle $A$ measures $35°$ and angle $B$ measures $85°$. What is the measure of angle $C$?',
    choices: ['$120°$', '$60°$', '$145°$', '$50°$'], answer: 'B',
    explanation: 'The interior angles of a triangle sum to $180°$, so angle $C = 180° - 35° - 85° = 60°$. (A) $120°$ adds the two given angles but forgets to subtract from $180°$; (C) $145°$ subtracts only angle $A$ from $180°$; (D) $50°$ subtracts the two given angles from each other.' },

  { id: 'GGT1-02', skill: 'geo_angles', difficulty: 1, type: 'mcq',
    stem: 'Angles $P$ and $Q$ are complementary. If angle $P$ measures $32°$, what is the measure of angle $Q$?',
    choices: ['$148°$', '$68°$', '$58°$', '$32°$'], answer: 'C',
    explanation: 'Complementary angles sum to $90°$, so angle $Q = 90° - 32° = 58°$. (A) $148°$ uses $180°$ (supplementary) instead of $90°$; (B) $68°$ wrongly assumes the two angles sum to $100°$; (D) $32°$ assumes the two angles are equal.' },

  { id: 'GGT1-03', skill: 'geo_angles', difficulty: 2, type: 'mcq',
    stem: 'Parallel lines $\\ell$ and $m$ are cut by a transversal. The marked interior angle at line $\\ell$ measures $65°$. The co-interior angle at line $m$, on the same side of the transversal, measures $x°$. What is the value of $x$?',
    choices: ['$65$', '$115$', '$25$', '$130$'], answer: 'B',
    explanation: 'A transversal crossing parallel lines makes same-side (co-interior) angles supplementary, so $x = 180 - 65 = 115$. (A) $65$ treats them as equal, which holds for alternate interior or corresponding angles but not same-side interior; (C) $25$ uses complementary ($90 - 65$); (D) $130$ just doubles $65$.' },

  { id: 'GGT1-04', skill: 'geo_angles', difficulty: 2, type: 'spr',
    stem: 'In triangle $ABC$, the exterior angle at vertex $C$ measures $130°$. If angle $A$ measures $75°$, what is the measure of angle $B$, in degrees?',
    answer: '55',
    explanation: 'By the exterior angle theorem, an exterior angle equals the sum of the two remote interior angles: $130° = \\text{angle } A + \\text{angle } B = 75° + \\text{angle } B$. So angle $B = 130° - 75° = 55°$.' },

  { id: 'GGT1-05', skill: 'geo_angles', difficulty: 2, type: 'mcq',
    stem: 'In isosceles triangle $ABC$, sides $AB$ and $AC$ are equal, and the vertex angle $A$ measures $40°$. What is the measure of angle $B$?',
    choices: ['$40°$', '$140°$', '$70°$', '$50°$'], answer: 'C',
    explanation: 'The two base angles opposite the equal sides are equal and together share the remaining $180° - 40° = 140°$, so each is $140° \\div 2 = 70°$. (A) $40°$ just repeats the vertex angle; (B) $140°$ forgets to divide by 2; (D) $50°$ takes the complement of $40°$ instead.' },

  { id: 'GGT1-06', skill: 'geo_angles', difficulty: 3, type: 'mcq',
    stem: 'Triangle $ABC$ is similar to triangle $DEF$, with $A$ corresponding to $D$, $B$ to $E$, and $C$ to $F$. If $AB = 10$, $DE = 25$, and $BC = 14$, what is the length of $EF$?',
    choices: ['$5.6$', '$29$', '$39$', '$35$'], answer: 'D',
    explanation: 'Corresponding sides of similar triangles are proportional. The scale factor from $ABC$ to $DEF$ is $\\frac{DE}{AB} = \\frac{25}{10} = 2.5$, and $EF$ corresponds to $BC$, so $EF = 14 \\times 2.5 = 35$. (A) $5.6$ inverts the ratio ($14 \\times \\frac{10}{25}$); (B) $29$ adds the difference $25 - 10 = 15$ to $14$ instead of scaling; (C) $39$ adds $14 + 25$.' },

  { id: 'GGT1-07', skill: 'geo_angles', difficulty: 3, type: 'spr',
    stem: 'A person who is $6$ feet tall casts a shadow $4$ feet long. At the same moment, a nearby flagpole casts a shadow $30$ feet long. Using similar triangles, what is the height, in feet, of the flagpole?',
    answer: '45',
    explanation: 'The person and the flagpole, together with the ground and the light rays, form similar right triangles, so height and shadow length are proportional: $\\frac{6}{4} = \\frac{h}{30}$. Cross-multiplying gives $4h = 180$, so $h = 45$ feet.' },

  { id: 'GGT1-08', skill: 'geo_angles', difficulty: 2, type: 'mcq',
    stem: 'Two lines intersect at a point. One angle measures $(2x + 10)°$, and the angle vertical to it measures $(3x - 20)°$. What is the value of $x$?',
    choices: ['$38$', '$10$', '$30$', '$70$'], answer: 'C',
    explanation: 'Vertical angles are equal, so $2x + 10 = 3x - 20$. Subtracting $2x$ and adding $20$ gives $x = 30$ (each angle is then $70°$). (A) $38$ comes from wrongly making the angles supplementary ($5x - 10 = 180$); (B) $10$ is a sign error while solving; (D) $70$ is the measure of each angle, not the value of $x$.' },

  { id: 'GGT1-09', skill: 'geo_angles', difficulty: 3, type: 'mcq',
    stem: 'Parallel lines $r$ and $s$ are cut by a transversal. A same-side interior angle at line $r$ measures $(3x)°$, and the same-side interior angle at line $s$ measures $(2x + 40)°$. What is the value of $x$?',
    choices: ['$40$', '$28$', '$36$', '$10$'], answer: 'B',
    explanation: 'Same-side interior angles are supplementary: $3x + (2x + 40) = 180$, so $5x + 40 = 180$, giving $5x = 140$ and $x = 28$. (A) $40$ wrongly sets the two angles equal; (C) $36$ forgets the $+40$ before dividing ($5x = 180$); (D) $10$ uses $90°$ instead of $180°$.' },

  { id: 'GGT1-10', skill: 'geo_volume', difficulty: 1, type: 'mcq',
    stem: 'A triangle has a base of $10$ centimeters and a height of $6$ centimeters. What is the area of the triangle?',
    choices: ['$30 \\text{ cm}^2$', '$60 \\text{ cm}^2$', '$16 \\text{ cm}^2$', '$32 \\text{ cm}^2$'], answer: 'A',
    explanation: 'Area of a triangle $= \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 10 \\times 6 = 30$ square centimeters. (B) $60$ forgets the factor $\\frac{1}{2}$; (C) $16$ adds the base and height instead of multiplying; (D) $32$ computes $2(10 + 6)$, a perimeter-style sum.' },

  { id: 'GGT1-11', skill: 'geo_volume', difficulty: 1, type: 'mcq',
    stem: 'A circle has a radius of $5$ inches. What is the area of the circle?',
    choices: ['$10\\pi \\text{ in}^2$', '$5\\pi \\text{ in}^2$', '$100\\pi \\text{ in}^2$', '$25\\pi \\text{ in}^2$'], answer: 'D',
    explanation: 'Area of a circle $= \\pi r^2 = \\pi (5)^2 = 25\\pi$ square inches. (A) $10\\pi$ is the circumference $2\\pi r$; (B) $5\\pi$ uses $r$ instead of $r^2$; (C) $100\\pi$ squares the diameter $10$ instead of the radius.' },

  { id: 'GGT1-12', skill: 'geo_volume', difficulty: 2, type: 'mcq',
    stem: 'A cylinder has a radius of $3$ meters and a height of $10$ meters. What is the volume of the cylinder?',
    choices: ['$30\\pi \\text{ m}^3$', '$90\\pi \\text{ m}^3$', '$60\\pi \\text{ m}^3$', '$360\\pi \\text{ m}^3$'], answer: 'B',
    explanation: 'Volume of a cylinder $= \\pi r^2 h = \\pi (3)^2 (10) = 90\\pi$ cubic meters. (A) $30\\pi$ forgets to square the radius ($\\pi \\cdot 3 \\cdot 10$); (C) $60\\pi$ is the lateral surface area $2\\pi r h$; (D) $360\\pi$ uses the diameter $6$ in place of the radius.' },

  { id: 'GGT1-13', skill: 'geo_volume', difficulty: 2, type: 'spr',
    stem: 'A rectangular storage box has a volume of $240$ cubic inches. Its rectangular base measures $8$ inches by $5$ inches. What is the height of the box, in inches?',
    answer: '6',
    explanation: 'Volume of a rectangular prism $= \\text{length} \\times \\text{width} \\times \\text{height}$. The base area is $8 \\times 5 = 40$ square inches, so $240 = 40 \\times \\text{height}$, giving height $= 240 \\div 40 = 6$ inches.' },

  { id: 'GGT1-14', skill: 'geo_volume', difficulty: 2, type: 'mcq',
    stem: 'A sphere has a radius of $3$ centimeters. What is the volume of the sphere?',
    choices: ['$12\\pi \\text{ cm}^3$', '$108\\pi \\text{ cm}^3$', '$36\\pi \\text{ cm}^3$', '$27\\pi \\text{ cm}^3$'], answer: 'C',
    explanation: 'Volume of a sphere $= \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi (3)^3 = \\frac{4}{3}\\pi (27) = 36\\pi$ cubic centimeters. (A) $12\\pi$ squares the radius instead of cubing it; (B) $108\\pi$ omits the factor $\\frac{1}{3}$ (using $4\\pi r^3$); (D) $27\\pi$ keeps only $\\pi r^3$ and drops the $\\frac{4}{3}$.' },

  { id: 'GGT1-15', skill: 'geo_volume', difficulty: 3, type: 'mcq',
    stem: 'A cone-shaped paper cup has a radius of $4$ centimeters and a height of $9$ centimeters. What is the volume of the cup?',
    choices: ['$48\\pi \\text{ cm}^3$', '$144\\pi \\text{ cm}^3$', '$12\\pi \\text{ cm}^3$', '$192\\pi \\text{ cm}^3$'], answer: 'A',
    explanation: 'Volume of a cone $= \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi (4)^2 (9) = \\frac{1}{3}\\pi (16)(9) = 48\\pi$ cubic centimeters. (B) $144\\pi$ omits the factor $\\frac{1}{3}$ (that is $\\pi r^2 h$); (C) $12\\pi$ uses $r$ instead of $r^2$; (D) $192\\pi$ uses the diameter $8$ in place of the radius.' },

  { id: 'GGT1-16', skill: 'geo_volume', difficulty: 3, type: 'spr',
    stem: 'A cube has a total surface area of $150$ square inches. What is the volume of the cube, in cubic inches?',
    answer: '125',
    explanation: 'A cube has $6$ congruent square faces, so $6s^2 = 150$, giving $s^2 = 25$ and edge length $s = 5$ inches. The volume is $s^3 = 5^3 = 125$ cubic inches.' },

  { id: 'GGT1-17', skill: 'geo_volume', difficulty: 2, type: 'mcq',
    stem: 'A rectangular prism has length $5$ inches, width $4$ inches, and height $2$ inches. What is the total surface area of the prism?',
    choices: ['$40 \\text{ in}^2$', '$38 \\text{ in}^2$', '$60 \\text{ in}^2$', '$76 \\text{ in}^2$'], answer: 'D',
    explanation: 'Surface area $= 2(lw + lh + wh) = 2(5\\cdot4 + 5\\cdot2 + 4\\cdot2) = 2(20 + 10 + 8) = 76$ square inches. (A) $40$ is the volume $lwh$; (B) $38$ forgets to double the sum $lw + lh + wh$; (C) $60$ leaves out the pair of $4 \\times 2$ faces (using $2\\cdot20 + 2\\cdot10$).' },

  { id: 'GGT1-18', skill: 'geo_volume', difficulty: 3, type: 'mcq',
    stem: 'A cylindrical tank has radius $5$ feet and height $8$ feet. A second cylindrical tank has the same height but twice the radius. The second tank holds how many times as much as the first?',
    choices: ['$2$', '$4$', '$8$', '$16$'], answer: 'B',
    explanation: 'For cylinders of equal height, volume is proportional to $r^2$ because $V = \\pi r^2 h$. Doubling the radius multiplies the volume by $2^2 = 4$. (A) $2$ counts only the radius factor, not the squaring; (C) $8$ uses $2^3$, which would apply only if every dimension doubled; (D) $16$ uses $2^4$.' }
);
