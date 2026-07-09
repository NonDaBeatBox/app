/* gen: lessons rw conventions + expression */
GEN_LESSONS.push(
  {
    skill: 'rw_boundaries',
    concept: [
      'The most important question in every boundary question is simple: is the group of words on each side of the punctuation a complete sentence — an independent clause with its own subject and verb — or not? Circle the punctuation, then test each side on its own. Two independent clauses can be joined in only four legal ways: a period, a semicolon, a comma plus a FANBOYS conjunction (for, and, nor, but, or, yet, so), or, in the right situation, a colon or a dash. Two independent clauses stitched together with only a comma make a comma splice; with no punctuation at all they make a run-on.',
      'A semicolon behaves exactly like a period — it demands a complete sentence on both sides. That gives you the single most useful test on the exam: if you can swap the mark for a period and still have two grammatical sentences, a semicolon is fine; if either side is a fragment, it is wrong. A colon is different. It also needs a complete sentence in front of it, but what follows can be a list, a single word, a phrase, or another full sentence that explains or delivers what the first half promised.',
      'Commas and dashes also fence off extra, non-essential information from the main sentence. A phrase you could lift out without breaking the sentence must be walled off on both sides — two commas, two dashes, or two parentheses — and you must not mix the pair (a comma on one side and a dash on the other is wrong). When the extra material is essential to identify what you are talking about, use no commas at all.',
    ],
    examples: [
      { q: 'Punctuate the blank: “The museum reopened in May ___ it had been closed for two years of renovations.”', steps: ['Test each side. Left: “The museum reopened in May” has the subject “museum” and verb “reopened” — a complete sentence. Right: “it had been closed for two years of renovations” has “it” and “had been closed” — also complete.', 'Two independent clauses, so a lone comma (comma splice) and no punctuation (run-on) are both out.', 'A period would work here — “The museum reopened in May. It had been closed…” — so a semicolon is correct (a comma plus “and” would work too).'] },
      { q: 'Punctuate the blank: “The recipe calls for three basic ingredients ___ flour, water, and salt.”', steps: ['Test the left side: “The recipe calls for three basic ingredients” is a complete sentence.', 'What follows is a list that specifies those ingredients, not a second independent clause.', 'A colon is built for exactly this — a full sentence that then introduces a list or explanation — so the colon is correct. A semicolon would be wrong because “flour, water, and salt” cannot stand alone.'] },
      { q: 'Punctuate the interruption: “Marie Curie ___ the first person to win two Nobel Prizes ___ conducted much of her research in a converted shed.”', steps: ['The middle chunk, “the first person to win two Nobel Prizes,” is extra information; lift it out and “Marie Curie … conducted much of her research in a converted shed” still stands.', 'Non-essential information must be fenced on both sides with a matching pair of marks.', 'Use two commas or two dashes — but the same mark on each side. Opening with a comma and closing with a dash is a mismatch and is wrong.'] },
    ],
    traps: [
      'Joining two independent clauses with only a comma — a comma alone can never hold two complete sentences together (comma splice).',
      'Placing a colon after an incomplete clause; the words before a colon must form a complete sentence on their own.',
      'Mismatching the fence around an interruption — opening with a comma and closing with a dash, or using only one mark of the pair.',
    ],
  },
  {
    skill: 'rw_sva',
    concept: [
      'A verb must agree in number with its subject: a singular subject takes a singular verb, a plural subject takes a plural verb. The trick the exam plays is distance — it slips a long phrase between the subject and its verb so that a nearby noun tempts you into the wrong match. Your defense is to locate the true subject and mentally delete everything sitting between it and the verb.',
      'The word right before the verb is often not the subject. Prepositional phrases (of the students, in the boxes, with her colleagues), clauses set off by commas, and connectors like “along with” or “as well as” all come between subject and verb without changing the subject’s number. “The box of old photographs is heavy,” not “are,” because the subject is “box,” not “photographs.”',
      'Watch three special patterns. In sentences that open with “There is/are” or “Here is/are,” the subject comes after the verb, so match it there. Subjects joined by “and” are usually plural; but “each,” “every,” “one of,” and indefinite pronouns such as “everyone,” “neither,” and “anybody” are singular. Collective nouns like team, committee, and jury are treated as singular on the exam.',
    ],
    examples: [
      { q: 'Choose the verb: “The collection of rare coins (was / were) donated to the museum.”', steps: ['Find the subject: “collection,” which is singular. “of rare coins” is just a prepositional phrase describing it.', 'Cover up “of rare coins”: “The collection … donated to the museum.”', 'A singular subject needs a singular verb, so “was” is correct.'] },
      { q: 'Choose the verb: “The scientist, along with her three assistants, (plan / plans) to publish the results.”', steps: ['The subject is “scientist,” singular. “along with her three assistants” is a phrase set off by commas, not part of the subject.', 'Connectors like “along with” and “as well as” do not make a singular subject plural.', 'Delete the interrupter: “The scientist … plans.” The singular verb “plans” is correct.'] },
      { q: 'Choose the verb: “There (is / are) several reasons to reconsider the plan.”', steps: ['In “There is/are” sentences, the real subject follows the verb. Here it is “reasons,” which is plural.', 'Match the verb to “reasons,” not to the placeholder “There.”', 'A plural subject needs a plural verb, so “are” is correct.'] },
    ],
    traps: [
      'Matching the verb to the nearest noun inside an interrupting phrase instead of to the real subject.',
      'Assuming “as well as,” “along with,” or “in addition to” turn a singular subject into a plural one — they do not.',
      'Forgetting that “each,” “every,” “everyone,” and “neither” are singular, even before a plural phrase such as “each of the players.”',
    ],
  },
  {
    skill: 'rw_verb',
    concept: [
      'Verb questions test two things: form (is the verb built correctly?) and tense (does its time frame fit the sentence?). Start by reading the whole sentence — and the sentences around it — for time markers such as “yesterday,” “since 1990,” “currently,” “by next year,” or “already” that tell you when the action happens.',
      'Keep tenses consistent unless the meaning demands a shift. If a passage narrates events in the past, a verb in the blank usually stays in the past too; sliding into the present for no reason is the classic error. When two past actions happen in sequence, the earlier one can take the past perfect (“had left”) to show it came first: “By the time we arrived, the train had already left.”',
      'For form, make sure participles keep their helping verbs and irregular verbs use the right shape. “Has wrote” and “had went” are wrong; the past participle needs “has written” and “had gone.” Also match the tense to signal words: “since” and “over the past decade” call for the present perfect (“has increased”), while “currently” calls for the simple present.',
    ],
    examples: [
      { q: 'Choose the verb: “Last summer, the team (travels / traveled) to three countries to study coral reefs.”', steps: ['Find the time marker: “Last summer” places the action firmly in the past.', 'The verb in the blank should match that past time frame.', '“Traveled” is correct; the present-tense “travels” clashes with “last summer.”'] },
      { q: 'Choose the verb: “By the time the rescuers reached the summit, the storm (had passed / passes).”', steps: ['There are two past events: the rescuers reaching the summit and the storm ending — and the storm ended first.', 'To show one past action finished before another, use the past perfect “had passed.”', '“Had passed” is correct; “passes” wrongly jumps to the present.'] },
      { q: 'Choose the verb: “Since 2010, the city (has added / added) more than fifty miles of bike lanes.”', steps: ['“Since 2010” signals an action that began in the past and continues into the present.', 'That time frame calls for the present perfect, “has added.”', '“Has added” is correct; the simple past “added” does not capture the ongoing “since 2010” span.'] },
    ],
    traps: [
      'Shifting tense for no reason — sliding into the present in the middle of a past-tense narration.',
      'Using the simple past where “since” or “over the past decade” calls for the present perfect (has/have plus the past participle).',
      'Pairing a helping verb with the wrong form: “has wrote,” “had went,” or “have ran” instead of “has written,” “had gone,” “have run.”',
    ],
  },
  {
    skill: 'rw_modifiers',
    concept: [
      'This skill has two halves. Pronouns must agree with the noun they stand in for — the antecedent — in number, and they must point clearly to one noun. Modifiers, the descriptive phrases, must sit right next to the word they describe. Both errors spring from the same source: a mismatch between a word and whatever it is supposed to refer to.',
      'For pronouns, find the antecedent and check number: a singular noun needs a singular pronoun. “A student should bring their ID” mismatches “student” (singular) with “their” (plural); the exam wants “his or her ID,” or a plural subject: “Students … their ID.” Also beware a pronoun with no clear antecedent — if “it” or “they” could point to two different nouns, the sentence is ambiguous and wrong.',
      'A modifier that opens a sentence and is followed by a comma must be immediately followed by the noun it describes. “Walking to school, the rain soaked me” absurdly claims the rain was walking. The fix names the right doer right after the comma: “Walking to school, I was soaked by the rain.” Whenever you see an opening “-ing” or “-ed” phrase plus a comma, ask who or what is doing that action — and put that doer next.',
    ],
    examples: [
      { q: 'Choose the pronoun: “Each of the runners must pick up (their / his or her) race number before the start.”', steps: ['Find the antecedent: “Each,” which is singular (“of the runners” is only a modifier of it).', 'A singular antecedent needs a singular pronoun.', '“His or her” agrees with singular “Each”; “their” is plural and mismatches.'] },
      { q: 'Which continuation is correct? “Having studied all night, ___” — (A) “the exam felt easy to Jordan.” (B) “Jordan found the exam easy.”', steps: ['The opening phrase “Having studied all night” needs a doer: who studied? Jordan, not the exam.', 'The noun right after the comma must be that doer.', 'Option (B) puts “Jordan” next to the phrase; option (A) illogically says the exam studied all night, so (B) is correct.'] },
      { q: 'Why is this sentence unclear? “When Maria met Elena, she had just returned from Peru.”', steps: ['“she” could refer to Maria or to Elena — two singular nouns come before it.', 'A pronoun must point unmistakably to a single antecedent.', 'The fix replaces “she” with a name: “…Elena had just returned from Peru,” removing the ambiguity.'] },
    ],
    traps: [
      'Using “they” or “their” to refer back to a singular noun like “a student,” “each,” or “the company.”',
      'Opening with an “-ing” or “-ed” phrase and then naming the wrong subject after the comma (a dangling modifier).',
      'Leaving a pronoun such as “it,” “this,” or “they” that could refer to two different nouns, so its reference is ambiguous.',
    ],
  },
  {
    skill: 'rw_transitions',
    concept: [
      'A transition question is not about grammar — the choices are usually all real, correctly spelled words. It is about logic. Your job is to work out the relationship between the idea before the blank and the idea after it, then pick the transition that names that exact relationship. The reliable method: cover the choices, read both sentences, and predict the relationship in your own words before you look.',
      'Sort transitions by the job they do. Contrast (however, but, nevertheless, on the other hand, by contrast) signals the second idea pushes against the first. Cause and effect (therefore, thus, as a result, consequently) signals the second idea follows from the first. Addition (moreover, furthermore, in addition, also) piles on a similar point. Example (for example, for instance) gives a specific case. Sequence (first, then, meanwhile, finally) orders events in time. Concession (admittedly, granted, of course) grants a point before countering it.',
      'Two cautions. First, direction matters more than flavor: if the ideas clash, you need some contrast word, and any addition or cause word is wrong no matter how nice it sounds. Second, do not be seduced by a transition that would make an elegant sentence if it does not fit these two specific ideas — the exam rewards logical fit, not the fanciest word.',
    ],
    examples: [
      { q: 'Choose the transition: “The new engine is far more efficient than the old one. ___, it costs nearly twice as much to manufacture.”', steps: ['Relationship: the first sentence gives an advantage (more efficient); the second gives a drawback (costs more). The ideas pull in opposite directions.', 'A clash like this calls for a contrast transition.', '“However” fits; a cause word like “therefore” or an addition word like “moreover” would wrongly signal that the ideas agree.'] },
      { q: 'Choose the transition: “Heavy rain had saturated the hillside for days. ___, the slope finally gave way in a mudslide.”', steps: ['Relationship: the saturated hillside is the cause; the mudslide is its result.', 'A cause-and-effect transition is needed.', '“As a result” (or “consequently”) fits; “nevertheless” would wrongly signal contrast, and “for example” would signal an illustration.'] },
      { q: 'Choose the transition: “Many desert plants store water in their stems. ___, the saguaro cactus can hold hundreds of gallons after a single storm.”', steps: ['Relationship: the second sentence gives a specific instance of the general claim in the first.', 'That calls for an example transition.', '“For example” (or “for instance”) fits; “in contrast” or “however” would wrongly signal opposition.'] },
    ],
    traps: [
      'Picking a transition by its general “sound” instead of testing the exact logical link between the two ideas.',
      'Getting the direction backward — using a cause or addition word (therefore, moreover) where the ideas actually contrast.',
      'Reaching for “however” whenever a sentence feels sophisticated, even when the two ideas agree or one causes the other.',
    ],
  },
  {
    skill: 'rw_synthesis',
    concept: [
      'A rhetorical synthesis question hands you a bulleted list of facts about a topic and asks you to write one sentence that uses some of them to accomplish a stated goal. The most important words on the screen sit in that goal line — for instance, “emphasize a difference between the two studies” or “introduce the project to an audience unfamiliar with it.” Read the goal first and keep it in front of you.',
      'The correct answer does two things at once: it is fully supported by the notes (no invented facts) and it satisfies the specific rhetorical purpose. Many wrong choices are perfectly true and lifted straight from the bullets, yet they do the wrong job — they describe when the goal says compare, or state one fact when the goal asks you to highlight a link between two. Match the verb in the goal: “compare” needs both items plus a connecting word; “emphasize” needs the key point front and center.',
      'Work goal-first, not answer-first. Name what the ideal sentence must contain — which bullets, in what relationship — and only then find the choice that matches. Eliminate any option that adds information not in the notes, that mentions only one item when the goal wants two, or that is accurate but serves a different purpose than the one requested.',
    ],
    examples: [
      { q: 'Goal: emphasize a similarity between the two birds. Notes: the robin migrates south in winter; the swallow migrates south in winter; the robin eats worms; the swallow eats insects. Which draft meets the goal?', steps: ['The goal wants a similarity between the two birds, so the sentence must name both birds and a shared trait.', 'Both birds “migrate south in winter” — that is the shared trait; their diets differ, so a diet fact would show contrast, not similarity.', 'A sentence such as “Both the robin and the swallow migrate south in winter” names both and states the shared trait, meeting the goal.'] },
      { q: 'Goal: introduce the sculptor to readers who have never heard of her. Notes: her name is Edmonia Lewis; she was a 19th-century sculptor; she worked in marble; her best-known work is “The Death of Cleopatra.” Which draft meets the goal?', steps: ['The audience is unfamiliar, so the sentence must give basic identifying facts: who she is and what she did.', 'A choice that dives into a narrow detail assumes background the reader does not have yet.', '“Edmonia Lewis was a 19th-century sculptor who worked in marble” introduces her clearly, matching the goal.'] },
      { q: 'Goal: present the second experiment as a response to a limitation of the first. Notes: Experiment 1 tested 10 subjects; Experiment 2 tested 500 subjects; both measured reaction time. Which idea belongs in the answer?', steps: ['The goal asks you to frame Experiment 2 as fixing a shortcoming of Experiment 1.', 'The key contrast is sample size: 10 subjects is a small sample, and 500 addresses that weakness.', 'The sentence should link them with that relationship — “To address the small sample of Experiment 1, Experiment 2 tested 500 subjects” — rather than merely noting that both measured reaction time.'] },
    ],
    traps: [
      'Choosing an option that is true and taken from the notes but does the wrong job — describing when the goal says compare, or vice versa.',
      'Ignoring the goal sentence and picking whatever draft sounds smoothest or packs in the most detail.',
      'Using only one item when the goal asks you to relate two, or slipping in a “fact” that is not in the bullet notes.',
    ],
  }
);
