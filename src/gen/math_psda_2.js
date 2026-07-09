/* gen: math psda batch 2 */
GEN_BANK.push(
  { id: 'GPS2-01', skill: 'psda_data', difficulty: 1, type: 'mcq',
    stem: 'The table shows the number of trees planted by a community group in four parks.\nPark | Trees\nOakdale | 24\nRiverside | 31\nHillcrest | 18\nLakeview | 27\nIn which park were the most trees planted?',
    choices: ['Oakdale', 'Riverside', 'Hillcrest', 'Lakeview'], answer: 'B',
    explanation: 'Compare the four counts: 24, 31, 18, and 27. The greatest is 31, at Riverside. Oakdale (24), Lakeview (27), and Hillcrest (18) all planted fewer.' },

  { id: 'GPS2-02', skill: 'psda_data', difficulty: 1, type: 'mcq',
    stem: 'The table shows the number of movie tickets sold at a theater on four days.\nDay | Tickets\nThursday | 85\nFriday | 140\nSaturday | 210\nSunday | 175\nHow many more tickets were sold on Saturday than on Friday?',
    choices: ['350', '125', '70', '35'], answer: 'C',
    explanation: 'Saturday sold 210 tickets and Friday sold 140, so $210 - 140 = 70$ more. (350 adds the two totals instead of subtracting; 125 subtracts Thursday’s 85 rather than Friday’s 140; 35 uses Sunday and Friday, the wrong two days.)' },

  { id: 'GPS2-03', skill: 'psda_stats', difficulty: 1, type: 'mcq',
    stem: 'What is the mean of the data set 6, 9, 10, and 15?',
    choices: ['9.5', '40', '9', '10'], answer: 'D',
    explanation: 'Mean $= \\frac{6 + 9 + 10 + 15}{4} = \\frac{40}{4} = 10$. (9.5 is the median, the average of the two middle values; 40 is the sum before dividing; 9 divides by the wrong count.)' },

  { id: 'GPS2-04', skill: 'psda_prob', difficulty: 1, type: 'mcq',
    stem: 'A jar contains 4 green, 6 yellow, and 10 red gumballs. If one gumball is selected at random, what is the probability that it is green?',
    choices: ['$\\frac{1}{5}$', '$\\frac{1}{4}$', '$\\frac{2}{3}$', '$\\frac{2}{5}$'], answer: 'A',
    explanation: 'There are $4 + 6 + 10 = 20$ gumballs and 4 are green, so the probability is $\\frac{4}{20} = \\frac{1}{5}$. ($\\frac{1}{4}$ leaves the 4 green out of the denominator, using 16; $\\frac{2}{3}$ compares green to yellow; $\\frac{2}{5}$ compares green to red.)' },

  { id: 'GPS2-05', skill: 'psda_data', difficulty: 2, type: 'spr',
    stem: 'The table shows the number of each type of pet adopted from a shelter in one week.\nPet | Number\nDog | 18\nCat | 24\nRabbit | 6\nBird | 12\nWhat percent of the pets adopted that week were cats?',
    answer: '40',
    explanation: 'The total number of pets is $18 + 24 + 6 + 12 = 60$. Cats make up $\\frac{24}{60} = 0.40$, which is $40\\%$.' },

  { id: 'GPS2-06', skill: 'psda_data', difficulty: 2, type: 'mcq',
    stem: 'The table shows the number of students in each after-school club.\nClub | Students\nArt | 15\nChess | 9\nDrama | 21\nRobotics | 15\nWhat fraction of these students are in the Drama club?',
    choices: ['$\\frac{1}{4}$', '$\\frac{7}{20}$', '$\\frac{21}{39}$', '$\\frac{3}{20}$'], answer: 'B',
    explanation: 'The total is $15 + 9 + 21 + 15 = 60$ students, and 21 are in Drama, so the fraction is $\\frac{21}{60} = \\frac{7}{20}$. ($\\frac{1}{4} = \\frac{15}{60}$ is Art’s fraction; $\\frac{21}{39}$ wrongly leaves Drama out of the denominator; $\\frac{3}{20} = \\frac{9}{60}$ is Chess’s fraction.)' },

  { id: 'GPS2-07', skill: 'psda_stats', difficulty: 2, type: 'mcq',
    stem: 'What is the median of the data set 11, 6, 8, 20, 8, and 14?',
    choices: ['8', '11.17', '14', '9.5'], answer: 'D',
    explanation: 'Order the six values: 6, 8, 8, 11, 14, 20. The median is the average of the two middle values: $\\frac{8 + 11}{2} = 9.5$. (8 is the mode, the most frequent value; 11.17 is the mean; 14 comes from averaging the middle two values without first ordering the list.)' },

  { id: 'GPS2-08', skill: 'psda_stats', difficulty: 2, type: 'spr',
    stem: 'The list shows the daily high temperatures, in degrees Fahrenheit, recorded over seven days.\n68, 74, 71, 80, 66, 74, 77\nWhat is the range of these temperatures?',
    answer: '14',
    explanation: 'The range is the greatest value minus the least value. The greatest is 80 and the least is 66, so the range is $80 - 66 = 14$ degrees.' },

  { id: 'GPS2-09', skill: 'psda_stats', difficulty: 2, type: 'mcq',
    stem: 'A book club has five members who read 4, 6, 7, 9, and 24 books this year. A sixth member who read 8 books then joins. Compared with the original five values, what happens to the mean and the median of the number of books read after the sixth value is added?',
    choices: ['The mean decreases and the median increases.', 'The mean increases and the median decreases.', 'Both the mean and the median decrease.', 'The mean decreases and the median stays the same.'], answer: 'A',
    explanation: 'The original five values 4, 6, 7, 9, 24 have mean $\\frac{50}{5} = 10$ and median 7. After adding 8, the six values 4, 6, 7, 8, 9, 24 have mean $\\frac{58}{6} \\approx 9.67$ (a decrease) and median $\\frac{7 + 8}{2} = 7.5$ (an increase). So the mean decreases while the median increases. The other options misjudge at least one of the two changes.' },

  { id: 'GPS2-10', skill: 'psda_prob', difficulty: 2, type: 'mcq',
    stem: 'The two-way table shows survey responses from 100 students about whether they play a sport, grouped by grade.\nGrade | Plays sport | No sport | Total\nJuniors | 30 | 20 | 50\nSeniors | 25 | 25 | 50\nTotal | 55 | 45 | 100\nIf one of the 100 students is selected at random, what is the probability that the student is a junior who plays a sport?',
    choices: ['$\\frac{3}{5}$', '$\\frac{30}{55}$', '$\\frac{3}{10}$', '$\\frac{1}{2}$'], answer: 'C',
    explanation: 'All 100 students are equally likely, and 30 of them are juniors who play a sport, so the probability is $\\frac{30}{100} = \\frac{3}{10}$. ($\\frac{3}{5}$ divides by only the 50 juniors; $\\frac{30}{55}$ divides by the 55 who play a sport; $\\frac{1}{2}$ is just the probability of being a junior.)' },

  { id: 'GPS2-11', skill: 'psda_prob', difficulty: 2, type: 'spr',
    stem: 'The two-way table shows 80 drink orders at a café, classified by size and temperature.\nSize | Hot | Iced | Total\nSmall | 15 | 5 | 20\nLarge | 25 | 35 | 60\nTotal | 40 | 40 | 80\nIf one order is selected at random, what is the probability that it was a large iced drink? Give your answer as a fraction or decimal.',
    answer: '7/16',
    explanation: 'There were 80 orders in all, and 35 of them were large iced drinks, so the probability is $\\frac{35}{80} = \\frac{7}{16} = 0.4375$.' },

  { id: 'GPS2-12', skill: 'psda_prob', difficulty: 2, type: 'mcq',
    stem: 'At a factory, records show that 3 out of every 200 light bulbs produced are defective. At this rate, how many defective bulbs would be expected in a shipment of 5,000 bulbs?',
    choices: ['25', '75', '150', '7.5'], answer: 'B',
    explanation: 'The defect rate is $\\frac{3}{200}$, so for 5,000 bulbs expect $5000 \\times \\frac{3}{200} = 5000 \\times 0.015 = 75$ defective bulbs. (25 divides 5,000 by 200 but forgets to multiply by 3; 150 uses $\\frac{3}{100}$ by misreading the denominator; 7.5 divides by 2,000 instead of 200.)' },

  { id: 'GPS2-13', skill: 'psda_data', difficulty: 3, type: 'mcq',
    stem: 'The table shows the price and weight of four package sizes of rice.\nSize | Price | Weight (lb)\nA | \\$4.00 | 2\nB | \\$7.50 | 5\nC | \\$10.00 | 8\nD | \\$13.50 | 9\nWhich size has the lowest price per pound?',
    choices: ['Size A', 'Size B', 'Size C', 'Size D'], answer: 'C',
    explanation: 'Find the price per pound for each size: A is $\\frac{4.00}{2} = 2.00$, B is $\\frac{7.50}{5} = 1.50$, C is $\\frac{10.00}{8} = 1.25$, and D is $\\frac{13.50}{9} = 1.50$ dollars per pound. Size C is the lowest at \\$1.25 per pound. (Size A is the most expensive per pound; sizes B and D tie at \\$1.50, both higher than C.)' },

  { id: 'GPS2-14', skill: 'psda_data', difficulty: 3, type: 'mcq',
    stem: 'A scatterplot compares the number of hours studied, $x$, and the exam score, $y$, for the students in a class. The line of best fit is $y = 6x + 52$. Based on this model, what is the best interpretation of the number 6?',
    choices: ['The predicted exam score of a student who studies for 0 hours.', 'The number of additional hours needed to raise the predicted score by 1 point.', 'The predicted exam score of a student who studies for 6 hours.', 'The predicted increase in exam score for each additional hour of study.'], answer: 'D',
    explanation: 'In $y = 6x + 52$, the number 6 is the slope, the change in predicted score for each additional hour studied — about 6 more points per hour. (The predicted score at 0 hours is the intercept, 52; raising the score by 1 point takes $\\frac{1}{6}$ of an hour, not 6; the score at 6 hours would be $6(6) + 52 = 88$, an output value, not the meaning of the coefficient.)' },

  { id: 'GPS2-15', skill: 'psda_stats', difficulty: 3, type: 'mcq',
    stem: 'Two data sets each contain five values and have the same mean of 20.\nData set P: 18, 19, 20, 21, 22\nData set Q: 10, 15, 20, 25, 30\nWhich statement correctly compares the standard deviations of the two data sets?',
    choices: ['Set Q has the larger standard deviation.', 'Set P has the larger standard deviation.', 'The two standard deviations are equal because the means are equal.', 'There is not enough information to compare the standard deviations.'], answer: 'A',
    explanation: 'Standard deviation measures how far the values typically fall from the mean. Both sets have mean 20, but Set P’s values stay within 2 of the mean while Set Q’s reach 10 away (10 and 30). Greater spread means a larger standard deviation, so Set Q’s is larger. Equal means do not force equal spread, and the spread is clearly visible, so the other statements are false.' },

  { id: 'GPS2-16', skill: 'psda_stats', difficulty: 3, type: 'spr',
    stem: 'The mean of five numbers is 26. Four of the numbers are 20, 24, 30, and 22. What is the fifth number?',
    answer: '34',
    explanation: 'If the mean of five numbers is 26, their sum is $5 \\times 26 = 130$. The four known numbers total $20 + 24 + 30 + 22 = 96$, so the fifth number is $130 - 96 = 34$.' },

  { id: 'GPS2-17', skill: 'psda_prob', difficulty: 3, type: 'mcq',
    stem: 'The two-way table shows the results of a survey of 150 people about whether they own a bicycle, grouped by city.\nCity | Owns bike | No bike | Total\nCity X | 40 | 35 | 75\nCity Y | 30 | 45 | 75\nTotal | 70 | 80 | 150\nGiven that a randomly selected person is from City X, what is the probability that the person owns a bicycle?',
    choices: ['$\\frac{4}{15}$', '$\\frac{8}{15}$', '$\\frac{4}{7}$', '$\\frac{7}{15}$'], answer: 'B',
    explanation: 'The condition “from City X” restricts attention to the 75 people in City X, of whom 40 own a bicycle: $\\frac{40}{75} = \\frac{8}{15}$. ($\\frac{4}{15} = \\frac{40}{150}$ divides by all 150 people; $\\frac{4}{7} = \\frac{40}{70}$ divides by the 70 bike owners; $\\frac{7}{15} = \\frac{35}{75}$ uses the 35 who do not own a bike.)' },

  { id: 'GPS2-18', skill: 'psda_prob', difficulty: 3, type: 'mcq',
    stem: 'The two-way table shows the results of a medical test given to 200 patients, grouped by age.\nAge group | Positive | Negative | Total\nUnder 40 | 12 | 88 | 100\n40 or older | 48 | 52 | 100\nTotal | 60 | 140 | 200\nGiven that a randomly selected patient tested positive, what is the probability that the patient is 40 or older?',
    choices: ['$\\frac{6}{25}$', '$\\frac{1}{5}$', '$\\frac{4}{5}$', '$\\frac{12}{25}$'], answer: 'C',
    explanation: 'A positive test restricts attention to the 60 patients who tested positive; of these, 48 are 40 or older: $\\frac{48}{60} = \\frac{4}{5}$. ($\\frac{6}{25} = \\frac{48}{200}$ divides by all 200 patients; $\\frac{12}{25} = \\frac{48}{100}$ divides by the 100 patients who are 40 or older; $\\frac{1}{5} = \\frac{12}{60}$ uses the 12 under-40 positives in the numerator, the complementary group.)' }
);
