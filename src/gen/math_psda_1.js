/* gen: math psda batch 1 */
GEN_BANK.push(
  { id: 'GPS1-01', skill: 'psda_ratio', difficulty: 1, type: 'mcq',
    stem: 'At a constant rate, a factory produces 320 phone cases in 8 hours. How many phone cases does the factory produce in 5 hours?',
    choices: ['40', '1,600', '200', '64'], answer: 'C',
    explanation: 'The unit rate is $320 \\div 8 = 40$ cases per hour, so in 5 hours the factory makes $40 \\times 5 = 200$ cases. (A) 40 is only the hourly rate; (B) 1,600 multiplies $320 \\times 5$ without dividing by 8; (D) 64 divides 320 by 5 instead of using the correct rate.' },

  { id: 'GPS1-02', skill: 'psda_ratio', difficulty: 1, type: 'spr',
    stem: 'A fruit stand sells 3 mangoes for \\$2. At this rate, how much, in dollars, do 12 mangoes cost?',
    answer: '8',
    explanation: 'Since $12 = 4 \\times 3$, the cost scales the same way: $4 \\times 2 = \\$8$. Equivalently, each mango costs $\\frac{2}{3}$ of a dollar, and $12 \\times \\frac{2}{3} = 8$.' },

  { id: 'GPS1-03', skill: 'psda_ratio', difficulty: 2, type: 'mcq',
    stem: 'A pasta recipe that serves 4 people requires 6 ounces of pasta. Keeping the same ratio, how many ounces of pasta are needed to serve 10 people?',
    choices: ['60', '15', '24', '12'], answer: 'B',
    explanation: 'Each serving needs $6 \\div 4 = 1.5$ ounces, so 10 servings need $1.5 \\times 10 = 15$ ounces. (A) 60 multiplies $6 \\times 10$ without dividing by 4; (C) 24 scales by the original 4 servings instead of the ratio; (D) 12 adds 1 ounce for each of the 6 extra servings instead of scaling proportionally.' },

  { id: 'GPS1-04', skill: 'psda_ratio', difficulty: 2, type: 'mcq',
    stem: 'On a map, 4 inches represents an actual distance of 60 miles. Two towns are 10 inches apart on the map. What is the actual distance, in miles, between the two towns?',
    choices: ['150', '15', '600', '25'], answer: 'A',
    explanation: 'The scale is $60 \\div 4 = 15$ miles per inch, so 10 inches represents $15 \\times 10 = 150$ miles. (B) 15 is only the miles-per-inch rate; (C) 600 multiplies $60 \\times 10$ without dividing by 4; (D) 25 adds the rate 15 to the 10 inches instead of multiplying.' },

  { id: 'GPS1-05', skill: 'psda_ratio', difficulty: 2, type: 'spr',
    stem: 'A train travels at a constant speed of 60 miles per hour. How many minutes does it take the train to travel 45 miles?',
    answer: '45',
    explanation: 'At 60 miles per hour, the train covers 1 mile each minute, so 45 miles takes 45 minutes. Equivalently, $\\frac{45}{60} = 0.75$ of an hour, and $0.75 \\times 60 = 45$ minutes.' },

  { id: 'GPS1-06', skill: 'psda_ratio', difficulty: 2, type: 'mcq',
    stem: 'At a school, the ratio of teachers to students is 2 to 45. If the school has 630 students, how many teachers does it have?',
    choices: ['1,260', '315', '45', '28'], answer: 'D',
    explanation: 'Set up the proportion $\\frac{2}{45} = \\frac{t}{630}$. Since $630 = 14 \\times 45$, the number of teachers is $t = 14 \\times 2 = 28$. (A) 1,260 multiplies $630 \\times 2$ without dividing by 45; (B) 315 divides 630 by 2, using the wrong part of the ratio; (C) 45 just repeats a number from the ratio.' },

  { id: 'GPS1-07', skill: 'psda_ratio', difficulty: 3, type: 'mcq',
    stem: 'A store sells cereal in two sizes. A 750-gram box of Brand A costs \\$4.50, and a 500-gram box of Brand B costs \\$3.20. How much less does Brand A cost per 100 grams than Brand B?',
    choices: ['\\$0.60', '\\$0.04', '\\$0.64', '\\$1.30'], answer: 'B',
    explanation: 'Brand A costs $\\frac{4.50}{750} \\times 100 = \\$0.60$ per 100 grams, and Brand B costs $\\frac{3.20}{500} \\times 100 = \\$0.64$ per 100 grams, so Brand A costs $0.64 - 0.60 = \\$0.04$ less. (A) \\$0.60 and (C) \\$0.64 are the two unit prices themselves; (D) \\$1.30 subtracts the total prices, ignoring the different box sizes.' },

  { id: 'GPS1-08', skill: 'psda_ratio', difficulty: 3, type: 'spr',
    stem: 'A prize of \\$540 is divided among three people in the ratio 2 : 3 : 4. How many dollars does the person with the largest share receive?',
    answer: '240',
    explanation: 'The ratio has $2 + 3 + 4 = 9$ equal parts, so each part is $540 \\div 9 = \\$60$. The largest share is $4 \\times 60 = \\$240$.' },

  { id: 'GPS1-09', skill: 'psda_ratio', difficulty: 3, type: 'mcq',
    stem: 'A leaky faucet drips at a constant rate of 3 milliliters every 5 seconds. How many liters of water drip from the faucet in 1 hour? (1 liter = 1,000 milliliters)',
    choices: ['2.16', '2,160', '21.6', '6'], answer: 'A',
    explanation: 'The faucet drips $\\frac{3}{5} = 0.6$ milliliter per second. One hour is 3,600 seconds, so it drips $0.6 \\times 3600 = 2160$ milliliters, which is $2160 \\div 1000 = 2.16$ liters. (B) 2,160 leaves the answer in milliliters; (C) 21.6 divides by 100 instead of 1,000; (D) 6 comes from inverting the rate to $\\frac{5}{3}$ milliliters per second.' },

  { id: 'GPS1-10', skill: 'psda_percent', difficulty: 1, type: 'mcq',
    stem: 'A basketball player made 40% of the 80 shots she attempted in a game. How many shots did she make?',
    choices: ['40', '120', '32', '3,200'], answer: 'C',
    explanation: '40% of 80 is $0.40 \\times 80 = 32$ shots. (A) 40 subtracts 40 from 80, treating the percent as a number of shots; (B) 120 adds 40 to 80; (D) 3,200 multiplies $40 \\times 80$ without dividing by 100.' },

  { id: 'GPS1-11', skill: 'psda_percent', difficulty: 1, type: 'mcq',
    stem: 'Of the 40 students in a class, 18 walk to school. What percent of the students in the class walk to school?',
    choices: ['18%', '45%', '22%', '55%'], answer: 'B',
    explanation: 'The percent who walk is $\\frac{18}{40} = 0.45 = 45\\%$. (A) 18% uses the raw count as a percent; (C) 22% uses $40 - 18$; (D) 55% is the percent who do not walk.' },

  { id: 'GPS1-12', skill: 'psda_percent', difficulty: 2, type: 'mcq',
    stem: 'A store raises the price of a \\$120 winter coat by 15%. What is the new price of the coat?',
    choices: ['\\$135', '\\$102', '\\$18', '\\$138'], answer: 'D',
    explanation: 'A 15% increase makes the new price $120 \\times 1.15 = \\$138$; equivalently, 15% of 120 is \\$18, and $120 + 18 = 138$. (A) \\$135 adds 15 dollars instead of 15%; (B) \\$102 subtracts the \\$18 increase instead of adding it; (C) \\$18 is only the amount of the increase.' },

  { id: 'GPS1-13', skill: 'psda_percent', difficulty: 2, type: 'spr',
    stem: 'A bicycle originally priced at \\$650 is discounted by 20%. What is the sale price, in dollars, of the bicycle?',
    answer: '520',
    explanation: 'A 20% discount means paying 80% of the price: $650 \\times 0.80 = 520$ dollars. Equivalently, 20% of 650 is \\$130, and $650 - 130 = 520$.' },

  { id: 'GPS1-14', skill: 'psda_percent', difficulty: 2, type: 'mcq',
    stem: 'A survey of 200 people found that 130 preferred tea and the rest preferred coffee. What percent of the people surveyed preferred coffee?',
    choices: ['65%', '54%', '35%', '70%'], answer: 'C',
    explanation: 'The number preferring coffee is $200 - 130 = 70$, so the percent is $\\frac{70}{200} = 0.35 = 35\\%$. (A) 65% is the percent who preferred tea; (B) 54% divides 70 by 130 instead of by the total 200; (D) 70% uses the raw count as a percent.' },

  { id: 'GPS1-15', skill: 'psda_percent', difficulty: 2, type: 'mcq',
    stem: 'The monthly fee for a gym membership rose from \\$40 to \\$46. What was the percent increase in the fee?',
    choices: ['15%', '13%', '6%', '115%'], answer: 'A',
    explanation: 'The increase is $46 - 40 = 6$ dollars, and $\\frac{6}{40} = 0.15 = 15\\%$. (B) 13% divides the increase by the new fee 46 instead of the original 40; (C) 6% uses the raw \\$6 difference as the percent; (D) 115% expresses the new fee as a percent of the old but omits subtracting 100%.' },

  { id: 'GPS1-16', skill: 'psda_percent', difficulty: 3, type: 'mcq',
    stem: 'The price of a \\$200 appliance is first increased by 10%, and then that new price is decreased by 10%. What is the final price?',
    choices: ['\\$200', '\\$198', '\\$220', '\\$180'], answer: 'B',
    explanation: 'First the price rises: $200 \\times 1.10 = \\$220$. Then it falls 10%: $220 \\times 0.90 = \\$198$. (A) \\$200 wrongly assumes the increase and decrease cancel; (C) \\$220 applies only the increase; (D) \\$180 applies a single 10% decrease to the original price.' },

  { id: 'GPS1-17', skill: 'psda_percent', difficulty: 3, type: 'spr',
    stem: 'After a 25% discount, a pair of running shoes is priced at \\$60. What was the original price, in dollars, of the shoes?',
    answer: '80',
    explanation: 'The sale price is 75% of the original price $p$, so $0.75p = 60$ and $p = \\frac{60}{0.75} = 80$ dollars.' },

  { id: 'GPS1-18', skill: 'psda_percent', difficulty: 3, type: 'mcq',
    stem: 'The population of a town increased by 20% during one year and then by 30% during the next year. What was the total percent increase in the population over the two years?',
    choices: ['50%', '156%', '6%', '56%'], answer: 'D',
    explanation: 'Apply the growth factors in succession: $1.20 \\times 1.30 = 1.56$, a 56% increase. (A) 50% simply adds $20\\% + 30\\%$, ignoring that the second increase applies to an already-larger population; (B) 156% is the final size relative to the start but omits subtracting the original 100%; (C) 6% multiplies the decimals $0.20 \\times 0.30$ instead of the growth factors.' }
);
