/* gen: lessons psda + geotrig */
GEN_LESSONS.push(
  {
    skill: 'psda_ratio',
    concept: [
      'A ratio compares two quantities, and a proportion sets two ratios equal to each other. To solve a proportion you cross-multiply: if $\\frac{a}{b} = \\frac{c}{d}$, then $ad = bc$. The single most important habit is to line up your units — put the same kind of quantity in both numerators and the same kind in both denominators.',
      'A rate is a ratio of two quantities measured in different units, such as miles per hour or dollars per pound. A unit rate has a denominator of 1, so you get it by dividing. Once you have a unit rate you can scale it up or down to any amount you like.',
      'For a part-to-part ratio such as $4 : 3$, add the parts to get the whole: there are $4 + 3 = 7$ equal parts in total. Divide the total amount by the number of parts to find the size of one part, then multiply back up for the quantity you want.',
    ],
    examples: [
      { q: 'A map uses a scale where 2 inches represents 25 miles. Two towns are 7 inches apart on the map. How far apart are they in real life?', steps: ['Set up a proportion with inches over miles on both sides: $\\frac{2}{25} = \\frac{7}{d}$.', 'Cross-multiply: $2d = 25 \\times 7 = 175$.', 'Divide by 2: $d = 87.5$ miles.'] },
      { q: 'A printer produces 120 pages in 4 minutes at a constant rate. At this rate, how many pages does it print in 7 minutes?', steps: ['Find the unit rate: $120 \\div 4 = 30$ pages per minute.', 'Scale up to 7 minutes: $30 \\times 7 = 210$ pages.'] },
      { q: 'A trail mix combines peanuts and raisins in a ratio of $5 : 2$ by weight. A bag holds 21 ounces of trail mix. How many ounces are raisins?', steps: ['Add the parts: $5 + 2 = 7$ equal parts in all.', 'Find one part: $21 \\div 7 = 3$ ounces per part.', 'Raisins are 2 parts: $2 \\times 3 = 6$ ounces.'] },
    ],
    traps: [
      'Setting up a proportion with mismatched units — inches over miles on one side but miles over inches on the other.',
      'Confusing a part-to-part ratio with a part-to-whole ratio: $5 : 2$ means 7 total parts, not 5 out of 2.',
      'Inverting the unit rate — using minutes per page when you need pages per minute.',
    ],
  },
  {
    skill: 'psda_percent',
    concept: [
      'Percent means "per 100," so a percent is just a fraction over 100 or, more usefully, a decimal. To find a percent of a number, convert the percent to a decimal and multiply: 15% of 80 is $0.15 \\times 80$. To find what percent one number is of another, divide the part by the whole and multiply by 100.',
      'Percent change is $\\frac{\\text{new} - \\text{old}}{\\text{old}} \\times 100$, always measured against the original amount. A 20% increase multiplies a value by $1.20$, and a 20% decrease multiplies it by $0.80$. Thinking in these multipliers makes multi-step problems fast and reliable.',
      'Successive percents do not add. A 20% increase followed by a 20% decrease is $1.20 \\times 0.80 = 0.96$, a net 4% decrease — not zero. Whenever percents are applied one after another, multiply the multipliers instead of adding the percentages.',
    ],
    examples: [
      { q: 'What is 15% of 80?', steps: ['Convert the percent to a decimal: $15\\% = 0.15$.', 'Multiply: $0.15 \\times 80 = 12$.'] },
      { q: 'A jacket’s price rises from \\$40 to \\$50. What is the percent increase?', steps: ['Find the change: $50 - 40 = 10$ dollars.', 'Divide by the original price: $\\frac{10}{40} = 0.25$.', 'Convert to a percent: $0.25 = 25\\%$ increase.'] },
      { q: 'A \\$200 item is marked down 25%, and then an additional 10% is taken off at the register. What is the final price?', steps: ['Apply the first discount: $200 \\times 0.75 = 150$ dollars.', 'Apply the second discount to the new price: $150 \\times 0.90 = 135$ dollars.', 'The final price is \\$135 (a net multiplier of $0.75 \\times 0.90 = 0.675$).'] },
    ],
    traps: [
      'Measuring a percent change against the new value instead of the original amount.',
      'Adding successive percents — a 25% discount then a 10% discount is not 35% off.',
      'Forgetting to convert the percent to a decimal, multiplying by 15 instead of 0.15.',
    ],
  },
  {
    skill: 'psda_data',
    concept: [
      'Data-interpretation questions hand you a table, a bar graph, a line graph, or a scatterplot. Before touching the numbers, read the title, both axis labels, and the units, so you know exactly what each value represents. Most mistakes here are misreadings, not arithmetic.',
      'To read a value, find the category on one axis and trace across or up to the bar height, the point, or the table cell. Pay close attention to the scale — gridlines might count by 2s, 5s, or 100s, and an axis does not always start at zero, which can make differences look bigger than they are.',
      'For a scatterplot with a line (or curve) of best fit, use the fitted line to make predictions, not the scattered individual points. Plug the given $x$-value into the line’s equation, or trace the line, to read the predicted $y$-value.',
    ],
    examples: [
      { q: 'A bar graph shows monthly sales: January \\$4,000, February \\$6,000, and March \\$5,000. By how much did sales increase from January to February?', steps: ['Read the January bar: \\$4,000.', 'Read the February bar: \\$6,000.', 'Subtract: $6000 - 4000 = 2000$, an increase of \\$2,000.'] },
      { q: 'A table lists a store’s daily revenue: Monday \\$320, Tuesday \\$280, Wednesday \\$400, and Thursday \\$360. What was the total revenue for the four days?', steps: ['Add the four cells: $320 + 280 + 400 + 360$.', 'Combine step by step: $320 + 280 = 600$, then $600 + 400 = 1000$, then $1000 + 360 = 1360$.', 'The total revenue is \\$1,360.'] },
      { q: 'On a scatterplot of hours studied versus test score, the line of best fit is $y = 8x + 50$, where $x$ is hours studied. What score does the line predict for a student who studies 5 hours?', steps: ['Substitute $x = 5$ into the line: $y = 8(5) + 50$.', 'Simplify: $y = 40 + 50 = 90$.', 'The predicted score is 90.'] },
    ],
    traps: [
      'Misreading the scale — assuming gridlines count by 1 when they actually count by 5 or 100.',
      'Reading the wrong row or column, or ignoring the units named in the axis label.',
      'Using a stray individual data point instead of the line of best fit when the question asks for a prediction.',
    ],
  },
  {
    skill: 'psda_stats',
    concept: [
      'The mean is the average: add all the values and divide by how many there are. The median is the middle value once the data is sorted (the average of the two middle values when the count is even). The mode is the most frequent value, and the range is the largest value minus the smallest.',
      'Standard deviation measures spread — how far the values typically sit from the mean. You will not compute it by hand on the SAT; you compare. Data clustered tightly around the mean has a small standard deviation, while data spread far from the mean has a large one. An outlier pulls the mean toward itself and enlarges the range and standard deviation, but the median barely moves, which is why the median is often the better measure of a typical value.',
      'Margin of error comes from surveying a sample instead of everyone. A poll reporting "48% with a margin of error of 3%" means the true value is plausibly between 45% and 51%. A larger, more randomly chosen sample makes the estimate more precise and shrinks the margin of error.',
    ],
    examples: [
      { q: 'Find the mean, median, mode, and range of the data set $4, 8, 8, 10, 20$.', steps: ['Mean: $\\frac{4 + 8 + 8 + 10 + 20}{5} = \\frac{50}{5} = 10$.', 'Median: the middle of the five sorted values is 8.', 'Mode: 8 appears twice, more than any other value, so the mode is 8.', 'Range: $20 - 4 = 16$.'] },
      { q: 'Data set A is $50, 51, 49, 50, 50$ and data set B is $10, 90, 50, 20, 80$. Both have a mean of 50. Which set has the larger standard deviation?', steps: ['Confirm the means: A gives $\\frac{250}{5} = 50$ and B gives $\\frac{250}{5} = 50$.', 'Set A’s values all sit within 1 of the mean; set B’s values sit as far as 40 from the mean.', 'Standard deviation measures typical distance from the mean, so set B has the larger standard deviation.'] },
      { q: 'Five home prices, in thousands of dollars, are $180, 190, 200, 210,$ and $1000$. Is the mean or the median a better measure of a typical price?', steps: ['Median: the middle of the five sorted values is 200 (thousand).', 'Mean: $\\frac{180 + 190 + 200 + 210 + 1000}{5} = \\frac{1780}{5} = 356$ (thousand).', 'The single large value pulls the mean up to 356, well above most homes, so the median of 200 is the better measure of a typical price.'] },
    ],
    traps: [
      'Forgetting to sort the data before locating the median.',
      'Assuming a larger range must mean a larger mean — spread and center are separate ideas.',
      'Believing a larger sample gives a larger margin of error; it is the reverse — larger random samples give a smaller margin of error.',
    ],
  },
  {
    skill: 'psda_prob',
    concept: [
      'Probability is the number of favorable outcomes divided by the total number of equally likely outcomes, giving a value from 0 to 1 that is often left as a fraction. The probability that an event does not happen is $1$ minus the probability that it does.',
      'A two-way table sorts data by two categories at once. The number in the bottom-right corner is the grand total; the row and column totals along the edges are subtotals. The whole challenge is choosing the correct denominator — read carefully whether the question is about everyone or only a specific group.',
      'Conditional probability restricts the group you are drawing from. "Given that the student is a senior" means your denominator is the number of seniors only, not the whole survey. The word "given" is your signal to shrink the total to just that subgroup.',
    ],
    examples: [
      { q: 'In a survey of 110 students, 50 are juniors (20 own a car, 30 do not) and 60 are seniors (45 own a car, 15 do not). If one student is chosen at random, what is the probability the student is a senior?', steps: ['Favorable outcomes: there are 60 seniors.', 'Total outcomes: there are 110 students in all.', 'Probability: $\\frac{60}{110} = \\frac{6}{11}$.'] },
      { q: 'Using the same survey (60 seniors, of whom 45 own a car), what is the probability that a student owns a car, given that the student is a senior?', steps: ['The word "given" restricts the group to the 60 seniors, so the denominator is 60.', 'Among those seniors, 45 own a car.', 'Probability: $\\frac{45}{60} = \\frac{3}{4}$.'] },
      { q: 'A bag holds 3 red, 4 blue, and 5 green marbles. If one marble is drawn at random, what is the probability it is not blue?', steps: ['Total marbles: $3 + 4 + 5 = 12$.', 'Not blue means red or green: $3 + 5 = 8$.', 'Probability: $\\frac{8}{12} = \\frac{2}{3}$.'] },
    ],
    traps: [
      'Using the grand total as the denominator when the question conditions on a subgroup — "given" shrinks the total.',
      'Swapping the direction of a conditional: P(car given senior) $= \\frac{45}{60}$ is not the same as P(senior given car) $= \\frac{45}{65}$.',
      'Forgetting the "not" — the probability of not blue is $1$ minus the probability of blue, not the probability of blue.',
    ],
  },
  {
    skill: 'geo_angles',
    concept: [
      'Angles on a straight line add up to $180°$, and angles all the way around a point add up to $360°$. Where two lines cross, the opposite (vertical) angles are equal. These few facts unlock most figure problems.',
      'When a transversal crosses two parallel lines, corresponding angles are equal and alternate interior angles are equal, while same-side interior angles are supplementary (they sum to $180°$). Always confirm the lines really are parallel before using these relationships.',
      'The three interior angles of any triangle sum to $180°$. An exterior angle equals the sum of the two remote interior angles. Similar triangles have equal corresponding angles and proportional corresponding sides, so you can set up a proportion to find a missing length.',
    ],
    examples: [
      { q: 'Two angles of a triangle measure $40°$ and $75°$. What is the measure of the third angle?', steps: ['The interior angles sum to $180°$.', 'Subtract the known angles: $180 - 40 - 75 = 65$.', 'The third angle measures $65°$.'] },
      { q: 'Parallel lines $m$ and $n$ are cut by a transversal. One interior angle measures $110°$. What is the measure of its same-side interior angle?', steps: ['Same-side interior angles between parallel lines are supplementary.', 'Subtract from $180°$: $180 - 110 = 70$.', 'The same-side interior angle measures $70°$.'] },
      { q: 'Triangle $ABC$ is similar to triangle $DEF$, with $AB$ corresponding to $DE$. If $AB = 6$, $DE = 9$, and $BC = 8$, find $EF$.', steps: ['Corresponding sides are proportional: $\\frac{AB}{DE} = \\frac{BC}{EF}$.', 'Substitute: $\\frac{6}{9} = \\frac{8}{EF}$.', 'Cross-multiply: $6 \\cdot EF = 72$, so $EF = 12$.'] },
    ],
    traps: [
      'Assuming two angles are equal or supplementary without first confirming the lines are parallel.',
      'Mixing up which pairs are equal (alternate interior) and which are supplementary (same-side interior).',
      'Pairing the wrong sides in similar triangles — match sides that lie opposite equal angles.',
    ],
  },
  {
    skill: 'geo_circles',
    concept: [
      'A circle with center $(h, k)$ and radius $r$ has the standard equation $(x - h)^2 + (y - k)^2 = r^2$. Read the center by flipping the signs inside the parentheses, and remember the right side is $r^2$, so take a square root to get the radius. If an equation is not in this form, complete the square to put it there.',
      'The circumference is $C = 2\\pi r$ and the area is $A = \\pi r^2$. An arc is a fraction of the circumference and a sector is that same fraction of the area, where the fraction is $\\frac{\\theta}{360}$ for a central angle of $\\theta$ degrees.',
      'Radians measure angles by arc length: a full circle is $2\\pi$ radians, which equals $360°$, so $180° = \\pi$ radians. Convert degrees to radians by multiplying by $\\frac{\\pi}{180}$.',
    ],
    examples: [
      { q: 'A circle is given by $(x - 3)^2 + (y + 2)^2 = 25$. Find its center and radius.', steps: ['Match to $(x - h)^2 + (y - k)^2 = r^2$; flip the signs for the center: $(3, -2)$.', 'The right side is $r^2 = 25$, so $r = \\sqrt{25} = 5$.', 'Center $(3, -2)$, radius 5.'] },
      { q: 'A circle has radius 6. Find its circumference and area in terms of $\\pi$.', steps: ['Circumference: $C = 2\\pi r = 2\\pi(6) = 12\\pi$.', 'Area: $A = \\pi r^2 = \\pi(6)^2 = 36\\pi$.'] },
      { q: 'A circle has radius 10. A sector has a central angle of $72°$. Find the area of the sector in terms of $\\pi$.', steps: ['The fraction of the circle is $\\frac{72}{360} = \\frac{1}{5}$.', 'The full area is $\\pi(10)^2 = 100\\pi$.', 'The sector area is $\\frac{1}{5}(100\\pi) = 20\\pi$. (As a check, $72°$ equals $72 \\times \\frac{\\pi}{180} = \\frac{2\\pi}{5}$ radians.)'] },
    ],
    traps: [
      'Forgetting to take the square root of $r^2$ — in $(x-h)^2 + (y-k)^2 = 25$ the radius is 5, not 25.',
      'Flipping the center signs the wrong way: $(x - 3)^2 + (y + 2)^2$ has center $(3, -2)$, not $(3, 2)$ or $(-3, 2)$.',
      'Using the wrong fraction for an arc or sector, or mixing degrees and radians in the same formula.',
    ],
  },
  {
    skill: 'geo_volume',
    concept: [
      'Know the plane-figure areas cold: rectangle $lw$, triangle $\\frac{1}{2}bh$, circle $\\pi r^2$, and trapezoid $\\frac{1}{2}(b_1 + b_2)h$. Area is always measured in square units.',
      'The volume of a prism or a cylinder is the base area times the height, so a rectangular box is $lwh$ and a cylinder is $\\pi r^2 h$. The SAT reference sheet also provides the cone $\\frac{1}{3}\\pi r^2 h$, the sphere $\\frac{4}{3}\\pi r^3$, and the pyramid $\\frac{1}{3} \\times \\text{base area} \\times \\text{height}$. Volume is measured in cubic units.',
      'Surface area is the total area of every face of a solid; add the faces up, or imagine unfolding the solid into a flat net and summing the pieces. Before combining any measurements, make sure every length is in the same unit.',
    ],
    examples: [
      { q: 'Find the area of a triangle with base 12 and height 5.', steps: ['Use $A = \\frac{1}{2}bh$.', 'Substitute: $A = \\frac{1}{2}(12)(5) = \\frac{1}{2}(60) = 30$.'] },
      { q: 'A cylinder has radius 3 and height 10. Find its volume in terms of $\\pi$.', steps: ['Use $V = \\pi r^2 h$.', 'Substitute: $V = \\pi(3)^2(10) = \\pi(9)(10) = 90\\pi$.'] },
      { q: 'A rectangular box has length 4, width 3, and height 5. Find its volume and its surface area.', steps: ['Volume: $V = lwh = 4 \\times 3 \\times 5 = 60$ cubic units.', 'Surface area: add the three pairs of faces with $2(lw + lh + wh)$.', 'Substitute: $2(4 \\cdot 3 + 4 \\cdot 5 + 3 \\cdot 5) = 2(12 + 20 + 15) = 2(47) = 94$ square units.'] },
    ],
    traps: [
      'Dropping the $\\frac{1}{2}$ in the triangle area, or the $\\frac{1}{3}$ in the cone and pyramid volumes.',
      'Using the diameter in place of the radius in $\\pi r^2$ — halve the diameter first.',
      'Mixing units, or reporting a volume in square units instead of cubic units.',
    ],
  },
  {
    skill: 'geo_trig',
    concept: [
      'In a right triangle, SOH-CAH-TOA ties an acute angle to the side lengths: $\\sin = \\frac{\\text{opposite}}{\\text{hypotenuse}}$, $\\cos = \\frac{\\text{adjacent}}{\\text{hypotenuse}}$, and $\\tan = \\frac{\\text{opposite}}{\\text{adjacent}}$. Opposite and adjacent are defined relative to the specific angle you are working with.',
      'The Pythagorean theorem, $a^2 + b^2 = c^2$, relates the two legs $a$ and $b$ to the hypotenuse $c$ (the side opposite the right angle). Memorizing common triples — $3\\text{-}4\\text{-}5$, $5\\text{-}12\\text{-}13$, and $8\\text{-}15\\text{-}17$ — saves time.',
      'Two special right triangles have fixed side ratios. A $45°\\text{-}45°\\text{-}90°$ triangle has sides in ratio $1 : 1 : \\sqrt{2}$, and a $30°\\text{-}60°\\text{-}90°$ triangle has sides in ratio $1 : \\sqrt{3} : 2$ (short leg : long leg : hypotenuse). A handy identity is $\\sin\\theta = \\cos(90° - \\theta)$.',
    ],
    examples: [
      { q: 'A right triangle has legs of length 6 and 8. Find the length of the hypotenuse.', steps: ['Apply $a^2 + b^2 = c^2$: $6^2 + 8^2 = c^2$.', 'Simplify: $36 + 64 = 100$, so $c^2 = 100$.', 'Take the square root: $c = \\sqrt{100} = 10$.'] },
      { q: 'In a right triangle, the side opposite angle $A$ is 5 and the hypotenuse is 13. Find $\\sin A$ and $\\cos A$.', steps: ['By SOH, $\\sin A = \\frac{\\text{opposite}}{\\text{hypotenuse}} = \\frac{5}{13}$.', 'Find the adjacent leg with the Pythagorean theorem: $\\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12$.', 'By CAH, $\\cos A = \\frac{\\text{adjacent}}{\\text{hypotenuse}} = \\frac{12}{13}$.'] },
      { q: 'The hypotenuse of a $30°\\text{-}60°\\text{-}90°$ triangle is 10. Find the lengths of the two legs.', steps: ['The side ratio is short : long : hypotenuse $= 1 : \\sqrt{3} : 2$.', 'The hypotenuse is the "2," so $2 = 10$ means one unit equals 5.', 'The short leg is $1 \\times 5 = 5$, and the long leg is $\\sqrt{3} \\times 5 = 5\\sqrt{3}$.'] },
    ],
    traps: [
      'Swapping opposite and adjacent — each is defined relative to the specific angle in question.',
      'Applying the Pythagorean theorem or SOH-CAH-TOA to a triangle that is not right-angled.',
      'Misplacing the special-triangle ratios: in a $30°\\text{-}60°\\text{-}90°$ triangle the shortest side is opposite $30°$ and the hypotenuse (the "2") is opposite $90°$.',
    ],
  }
);
