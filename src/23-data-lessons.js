/* =========================================================================
   DATA:LESSONS — Khan-style mini-lessons, one per skill.
   Schema:
     { skill, title, concept(html-ish string),
       examples:[{q, work}], traps:[string], checkpoint:[questionIds or inline] }
   Checkpoint questions are pulled live from the bank by skill, so lessons stay
   lean. Populated in Phase 2.
   ========================================================================= */

const LESSONS = [];
