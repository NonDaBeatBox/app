/* =========================================================================
   DATA:VOCAB — starter word set (the user imports their own 1,500-word list).
   Word schema: { w: word, def: definition, ex: example sentence (optional) }.
   VOCAB_STARTER is declared early (DATA:SKILLS) so generated batches can push
   into it. On first run the engine seeds a "Starter SAT Words" set from it.
   The user imports CSV (word,definition[,example]) or JSON on the Vocab screen.
   ========================================================================= */

/* (words are appended by the generated vocab_starter batch → VOCAB_STARTER) */
