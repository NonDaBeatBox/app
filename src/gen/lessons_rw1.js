/* gen: lessons rw craft + infoideas */
GEN_LESSONS.push(
  {
    skill: 'rw_vocab',
    concept: [
      'Words-in-context questions give you a blank (or an underlined word) and ask for the word that best fits. Remember that the passage always contains the answer — treat the item like a logic puzzle, not a vocabulary quiz. Before you even look at the choices, read the whole sentence plus the ones around it, then predict your own plain word for the blank.',
      'Hunt for clue words. Signals like “because,” “however,” “although,” and “for example,” along with punctuation like colons and dashes, tell you whether the missing word should agree with the surrounding idea or contrast it. Match the tone, too: if the author clearly admires something, a negative word is out no matter how nice it sounds.',
      'Finally, test each choice by plugging it in. Cross off words that are too strong, too weak, or that only fit one everyday meaning of the sentence. The right answer fits the exact logic the passage builds, even when it is not the fanciest or most advanced-sounding word on the list.'
    ],
    examples: [
      {
        q: 'Passage: “Although the critic usually praised experimental films, she found this one so ______ that she walked out before the ending.” Which fits: (A) inventive (B) tedious (C) charming (D) ambitious?',
        steps: [
          'Spot the clue word “Although” — it signals a contrast with her usual praise, so this time she reacted the opposite way.',
          'Predict a word negative enough to make someone leave early, roughly “boring.”',
          'Test the choices: “inventive,” “charming,” and “ambitious” are all positive, so they clash with walking out.',
          '“Tedious” means tiresomely dull, which matches leaving before the end. The answer is (B).'
        ]
      },
      {
        q: 'Passage: “The new bridge was ______: engineers used a featherlight alloy so the whole span weighs less than a single older girder.” Which fits: (A) sturdy (B) lightweight (C) expensive (D) temporary?',
        steps: [
          'The colon means the second half explains the blank, so the word must be defined by what follows.',
          'What follows stresses a “featherlight alloy” and weighing very little — the whole idea is low weight.',
          'Predict “light,” then check: “sturdy,” “expensive,” and “temporary” are not what the weight detail proves.',
          '“Lightweight” restates that evidence exactly, so (B) is correct.'
        ]
      },
      {
        q: 'Passage: “Far from dismissing the amateur’s theory, the professor treated it with genuine ______, citing it in her own published work.” Which fits: (A) suspicion (B) respect (C) indifference (D) amusement?',
        steps: [
          'The phrase “Far from dismissing” flips the expectation: she did the opposite of brushing it off.',
          'The proof — she cited it in her own published work — shows she valued it.',
          'Predict something like “esteem”; “suspicion,” “indifference,” and “amusement” do not explain citing it seriously.',
          '“Respect” fits both the contrast and the evidence, so (B) is the answer.'
        ]
      }
    ],
    traps: [
      'Picking the word you would use in everyday speech instead of the one the passage’s clues point to.',
      'Choosing a word that fits part of the sentence but ignores a contrast signal like “although” or “but.”',
      'Falling for a hard, fancy-sounding word when a plainer choice matches the logic more precisely.'
    ]
  },
  {
    skill: 'rw_purpose',
    concept: [
      'These questions ask what a sentence “does” or what the author’s “main purpose” is. Your job is to describe the function of the text, not to restate its content. Keep asking: why did the writer include this? Is it setting up a problem, giving an example, answering an objection, or drawing a conclusion?',
      'For a single underlined sentence, read what comes right before and right after it. A sentence often works as a bridge — it may introduce a shift, back up the previous claim with evidence, or qualify it. Name that job in your own words first, then find the choice that says the same thing.',
      'For whole-text purpose, track the passage’s arc from the first sentence to the last. The correct choice has to cover the entire passage, not just one interesting line. Watch the verbs in the choices — “argue,” “describe,” “illustrate,” “criticize” — because the verb must match what the author actually does.'
    ],
    examples: [
      {
        q: 'Passage: “Most people assume bats are blind. In fact, many bat species see quite well, and some rely on vision more than on echolocation to find food.” What is the main purpose of the second sentence?',
        steps: [
          'Read sentence one: it states a common assumption, that bats are blind.',
          'The phrase “In fact” signals the writer is about to correct that assumption.',
          'So sentence two’s job is to overturn the myth with accurate information.',
          'A choice like “to correct a widely held misconception” names that function; a choice that just lists facts about bats misses it.'
        ]
      },
      {
        q: 'Passage: “The company promised the update would speed up phones. Yet after installing it, users reported longer load times, drained batteries, and frequent crashes.” What function does the list in the second sentence serve?',
        steps: [
          'Locate the claim: the company promised faster phones.',
          'The word “Yet” shows the second sentence pushes back against that promise.',
          'The list — load times, batteries, crashes — is evidence that reality contradicted the promise.',
          'The function is to give specific evidence undermining the company’s claim, not merely “to describe phones.”'
        ]
      },
      {
        q: 'Passage: A short text first defines “citizen science,” then describes two projects where volunteers gathered data, then notes that scientists published findings faster as a result. What is the main purpose of the text?',
        steps: [
          'Trace the arc: a definition, then examples, then an outcome.',
          'The examples and the outcome all support one idea: volunteers help science move faster.',
          'The purpose must cover the whole arc, so it is to explain and illustrate a practice and its benefit.',
          'Reject choices that mention only the definition or only one project — those are too narrow.'
        ]
      }
    ],
    traps: [
      'Summarizing what the sentence says instead of naming the job it does in the passage.',
      'Choosing a purpose that fits only one line when the question asks about the whole text.',
      'Ignoring the answer’s verb — for example, picking “criticize” when the author merely “describes.”'
    ]
  },
  {
    skill: 'rw_connections',
    concept: [
      'Cross-text questions give you two short passages, Text 1 and Text 2, and ask how they relate. The key is to pin down each author’s main claim and stance separately before comparing them. Jot a quick label for each: what does this author believe, and how strongly?',
      'Then find the exact relationship the question asks about. Common patterns are that Text 2 agrees with Text 1, disagrees, adds a qualification, offers a counterexample, or explains something Text 1 only observed. The correct answer must be true to both texts at the same time.',
      'Most of these ask how the second author would respond to the first. Anchor your answer in something specific that Text 1 actually said, then confirm that Text 2 gives you evidence for that response. If you cannot point to lines in both texts, the choice is probably wrong.'
    ],
    examples: [
      {
        q: 'Text 1 argues that homework builds discipline and should increase in high school. Text 2 reports a study finding no link between homework amount and long-term achievement. How does Text 2 relate to Text 1?',
        steps: [
          'Label Text 1: pro-homework, wants more of it, values discipline.',
          'Label Text 2: a neutral study showing homework amount does not predict achievement.',
          'Ask the relationship: Text 2’s finding weakens the assumption behind Text 1’s recommendation.',
          'So Text 2 provides evidence that challenges Text 1’s reasoning, without personally attacking it.'
        ]
      },
      {
        q: 'Text 1 claims city trees are mainly decorative. Text 2 explains that urban trees cut cooling costs and filter pollutants. How would the author of Text 2 most likely respond to Text 1?',
        steps: [
          'Fix Text 1’s core claim: trees are “mainly decorative.”',
          'Gather Text 2’s evidence: trees save energy and clean the air — practical, not just pretty.',
          'A good response ties the two together: Text 2’s author would disagree, pointing to functional benefits.',
          'Pick the choice saying trees do more than decorate, citing Text 2’s specific benefits.'
        ]
      },
      {
        q: 'Text 1 says remote work boosts productivity. Text 2 agrees it can, but only when teams have strong communication tools. How would you describe the relationship?',
        steps: [
          'Both texts share the same starting point: remote work can boost productivity.',
          'Text 2 does not reject Text 1; it adds a condition, “only when… tools.”',
          'That is a qualification, not a contradiction.',
          'Choose the answer saying Text 2 supports Text 1 but limits when the claim holds true.'
        ]
      }
    ],
    traps: [
      'Comparing the texts before nailing down what each one actually claims on its own.',
      'Overstating the conflict — treating a mild qualification as a flat disagreement.',
      'Picking a response the second author might hold but that is not grounded in either text.'
    ]
  },
  {
    skill: 'rw_main',
    concept: [
      'Central-idea questions ask for the passage’s main point — the umbrella that covers every sentence. Detail questions ask what the passage specifically states about one thing. Decide which kind you have first, because the right size of answer is different for each.',
      'For a main idea, summarize the whole passage in one sentence of your own before reading the choices. The correct answer is broad enough to include the key points but not so broad that it drifts beyond the text. Be wary of choices that are true but cover only one paragraph.',
      'For a detail question, go back and find the exact line. The answer must be stated or clearly restated in the text, not just something you happen to know. Match the wording to the passage and watch for choices that swap or exaggerate a fact.'
    ],
    examples: [
      {
        q: 'Passage: A paragraph describes how honeybees waggle-dance to share the direction of flowers, adjust the dance for the sun’s position, and teach the route to hivemates. Which choice best states the main idea?',
        steps: [
          'Notice every sentence is about one thing: how bees communicate flower locations.',
          'Summarize it yourself: bees use the waggle dance to tell others where food is.',
          'The main idea must cover all three details — direction, sun, teaching — so it is about the dance as communication.',
          'Reject a choice that mentions only the sun angle; that is one detail, not the whole point.'
        ]
      },
      {
        q: 'Passage: “The observatory opened in 1962, was funded entirely by private donors, and remains the largest in the region.” According to the text, how was the observatory funded?',
        steps: [
          'The question asks for one stated fact: funding.',
          'Scan for the funding line: “funded entirely by private donors.”',
          'Match that to a choice saying private donations paid for it.',
          'Do not pick a choice about the year or the size — those are different details.'
        ]
      },
      {
        q: 'Passage: A text argues that reading fiction improves empathy, citing a study, a novelist’s reflection, and a classroom result. Which choice states the central claim?',
        steps: [
          'See that the three pieces — study, reflection, classroom — are support, not the point itself.',
          'Ask what they are all evidence for: that fiction can strengthen empathy.',
          'The central claim is that reading fiction improves empathy.',
          'A choice naming just the study is a supporting detail, so it is too narrow to be the central claim.'
        ]
      }
    ],
    traps: [
      'Choosing a true detail when the question asks for the passage’s overall main idea.',
      'Picking an answer broader than the passage that adds claims the text never makes.',
      'Relying on outside knowledge instead of what the passage actually states.'
    ]
  },
  {
    skill: 'rw_evidence',
    concept: [
      'Command-of-evidence questions give you a claim, hypothesis, or conclusion and ask which piece of information would best support it — or sometimes weaken it. Start by reading the claim carefully and restating it in your own words, because you can only test support once you know exactly what has to be proved.',
      'A strong supporting choice connects directly to that specific claim, not just to the general topic. Look for a logical match: if the claim is about a cause, the evidence should show that cause producing that effect. If the question asks what would weaken the claim, flip your thinking and hunt for the fact that would make it less likely.',
      'Check each choice against the claim itself, not against the other choices. Eliminate options that are off-topic, that support a different claim, or that merely sound relevant without moving the argument. The best answer makes the claim measurably more (or less) believable.'
    ],
    examples: [
      {
        q: 'Claim: “The café’s new earlier opening hours increased its morning sales.” Which best supports this? (A) The café added pastries. (B) Morning sales rose 30% the month the earlier hours began. (C) A rival café closed. (D) Customers praised the coffee.',
        steps: [
          'Restate the claim: the earlier hours caused higher morning sales.',
          'The best evidence links the timing of the new hours to a rise in sales.',
          'Choice (B) shows sales jumped exactly when the earlier hours started — a direct cause-and-effect match.',
          'New pastries, a rival closing, or praise for coffee could explain sales another way, so they do not isolate the hours. Answer: (B).'
        ]
      },
      {
        q: 'Claim: “Students who sleep more score higher because rest improves memory.” Which would most weaken this? (A) Well-rested students scored the same as tired students. (B) Teachers recommend eight hours of sleep. (C) Sleep matters for health. (D) Memory involves the hippocampus.',
        steps: [
          'The claim says more sleep leads to better scores through improved memory.',
          'To weaken it, find evidence that breaks the sleep-to-score link.',
          'Choice (A) shows rested and tired students scored the same, which directly undercuts the claim.',
          'The others are neutral or supportive, so they do not weaken it. Answer: (A).'
        ]
      },
      {
        q: 'Claim: “This wetland restoration brought back the native frog population.” Which best supports it? (A) Frogs are amphibians. (B) The wetland is now a tourist site. (C) Frog counts tripled in the two years after restoration. (D) Restoration cost less than expected.',
        steps: [
          'Restate: the restoration is what revived the frogs.',
          'Support should tie the restoration to a rise in frogs.',
          'Choice (C) gives a measured increase right after restoration — direct support.',
          'Facts about frog biology, tourism, or cost are true or interesting but do not prove the rebound. Answer: (C).'
        ]
      }
    ],
    traps: [
      'Picking a choice on the same topic that does not actually support the specific claim.',
      'Supporting when the question said weaken, or the reverse — always reread what is asked.',
      'Choosing a true, factual statement that has no logical effect on the claim’s believability.'
    ]
  },
  {
    skill: 'rw_quant',
    concept: [
      'Quantitative-evidence questions pair a short passage with a table, bar graph, or line graph and ask you to finish a sentence using accurate data that supports a point. Read the figure’s title, axis labels, and units first, so you know exactly what the numbers mean. A misread axis is the most common way to miss these.',
      'Next, pin down the claim the sentence is making and locate the matching rows or bars. The correct choice has to do two jobs at once: report the numbers correctly and actually back up the claim. A choice can quote real data yet point the wrong direction or describe the wrong category.',
      'Read every option against the figure. Eliminate any that misstate a value, compare the wrong groups, or cite a true number that does not serve the sentence’s point. The winner is both accurate on the data and relevant to the argument being made.'
    ],
    examples: [
      {
        q: 'A bar graph shows average rainfall: City A = 20 in, City B = 45 in. Sentence: “The data support the claim that City B is far wetter, since ______.” Which completion works?',
        steps: [
          'Check the axis: the values are inches of average rainfall.',
          'Identify the claim: City B is much wetter than City A.',
          'Find supporting numbers: City B’s 45 inches is more than double City A’s 20 inches.',
          'A completion stating “City B receives 45 inches to City A’s 20 inches” is accurate and supports the claim.'
        ]
      },
      {
        q: 'A table lists battery life: Model X = 10 hrs, Model Y = 14 hrs, Model Z = 12 hrs. The sentence claims Model Y lasts longest. Which completion supports it?',
        steps: [
          'Confirm the units: hours of battery life, where higher means longer.',
          'State the claim: Model Y lasts longest.',
          'Compare all three: Y’s 14 hours beats Z’s 12 and X’s 10.',
          'Pick the completion citing Y at 14 hours as the highest; one comparing only X and Z is accurate but does not prove Y is longest.'
        ]
      },
      {
        q: 'A line graph shows website visits falling from 5,000 in January to 2,000 in April. Sentence: “Traffic declined over the period, as ______.” Which completion is correct?',
        steps: [
          'Read the trend: the line drops from January to April.',
          'The claim matches the figure: traffic declined.',
          'Support it with the drop, from 5,000 visits to 2,000 visits.',
          'Avoid a choice saying visits “rose” or one that swaps the start and end numbers — that misreads the direction.'
        ]
      }
    ],
    traps: [
      'Misreading the axis, the units, or which line or bar goes with which category.',
      'Choosing data that is accurate but does not support the sentence’s specific claim.',
      'Reversing a trend — stating an increase when the figure shows a decrease, or swapping two values.'
    ]
  },
  {
    skill: 'rw_inference',
    concept: [
      'Inference questions ask for the conclusion the passage most logically leads to, often phrased as a sentence to complete that “logically completes the text.” The answer is not stated outright, but it must follow from the information given — think one small, safe step beyond the text, never a leap.',
      'Read for the logical setup, paying special attention to the last sentence and to contrast or cause words. Ask yourself, “If everything here is true, what must also be true?” Predict that conclusion in your own words. The right choice is something the passage guarantees, not merely something that could be true.',
      'Then test the choices for support and for overreach. Cross off anything that adds brand-new information, that is too extreme with words like “always,” “never,” or “proves,” or that the passage only faintly hints at. The best inference stays inside the fence the passage builds.'
    ],
    examples: [
      {
        q: 'Passage: “Every fossil found at the site belongs to a marine species, and the rock layers are the kind that form on ocean floors. This strongly suggests that ______.” What logically completes the text?',
        steps: [
          'Gather the facts: only marine fossils, plus ocean-floor rock layers.',
          'Ask what must follow: both clues point to the area once being underwater.',
          'Predict the conclusion: the site was once covered by ocean.',
          'Pick the choice saying the area was once a sea floor; reject one claiming the fossils are the oldest known, which the text never supports.'
        ]
      },
      {
        q: 'Passage: “The medicine reduced symptoms in most patients in the trial, though a few felt no change. Researchers plan larger studies.” Which conclusion is best supported?',
        steps: [
          'List the facts: it helped most but not all, and more studies are planned.',
          'A safe inference respects the “most, not all” and the fact that testing continues.',
          'Predict: the medicine shows promise but is not yet proven for everyone.',
          'Choose the measured statement; avoid “the medicine cures all patients,” which overstates “most.”'
        ]
      },
      {
        q: 'Passage: “Sales of print newspapers keep falling, yet this publisher’s revenue rose last year. The growth came entirely from its digital subscriptions, which ______.” What logically follows?',
        steps: [
          'Note the contrast word “yet”: print is down, but revenue is up.',
          'The text says the growth came entirely from digital subscriptions.',
          'So digital revenue must be offsetting the print losses.',
          'Pick the choice saying digital subscriptions more than made up for declining print sales; do not add unstated claims about future profits.'
        ]
      }
    ],
    traps: [
      'Choosing an answer that could be true but is not guaranteed by the passage.',
      'Picking an extreme statement with words like “always,” “never,” or “proves.”',
      'Bringing in outside facts instead of reasoning only from what the text provides.'
    ]
  }
);
