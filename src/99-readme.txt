═══════════════════════════════════════════════════════════════════════════
  ACE — your personal Digital SAT trainer.  One file. Runs offline. Target: 1600.
═══════════════════════════════════════════════════════════════════════════

  WHAT THIS IS
  A single, self-contained web app (this file) that combines a Khan-style
  course, an IXL-style mastery system, a Duolingo-style skill path, Quizlet-style
  vocabulary games, CookSAT-style strategies + full adaptive mock exams, and
  "Sable" — a JARVIS-style command assistant. Everything is embedded here; there
  is no server, no build step, and no account.

  HOW TO USE IT
  • Just double-click ace.html to open it in any modern browser. That's it.
  • First time: create an account on the sign-up page. The FIRST account
    becomes the teacher and keeps any progress already on this device.
  • All progress is saved automatically in your browser's localStorage, so it
    survives closing and reopening the file. (Keep using the same browser.)

  ACCOUNTS & THE TEACHER CLASSROOM
  • Sign in / sign up is LOCAL only — profiles live in this browser's
    localStorage. It is a lightweight gate, NOT real security; anyone with
    access to this browser can read the data.
  • Each account has its own separate progress. The first account is the
    teacher by default; you can make more accounts from the sign-up page.
  • Classes work like Google Classroom: a teacher CREATES a class and gets a
    join CODE. Students JOIN by entering that code — when they sign up (there's
    an optional "Class code" field for students) or anytime later from
    Settings → Join a class. Being in a class is optional; nobody is forced to
    join, and non-students never need one.
  • Teachers get a Teacher ⇄ Student toggle in the sidebar. In Teacher view,
    the Classroom lists your classes; open a class to see the roster (projected
    scores, weak skills), a class summary, "what the class needs work on," and
    a per-student deep-dive (heatmap, projected trend, pacing, mocks, badges).
  • Add students to a class three ways: share the class code so they self-join,
    create a student login (auto-joined), or import a student's exported
    progress file. A demo student is available to explore the dashboard.
  • "Act as student" lets a teacher step into a student's profile (changes
    save to that student); use "Return to teacher" to switch back.
  • Change password / sign out / join or leave a class live in Settings; sign
    out is also the ⎋ button in the sidebar.
  • Start with the Diagnostic (home screen) — it seeds your mastery heatmap,
    a score estimate, and a study plan. Then follow the daily quest each day.
  • Press Cmd/Ctrl+K anywhere for the command bar; click the glowing orb
    (bottom-right) to talk to Sable.
  • Back up or move your progress: Settings → Data → "Export progress (JSON)",
    and "Import progress" on another machine.

  YOUR ANTHROPIC API KEY  (optional — the app is fully usable without it)
  • Go to Settings → "AI & Sable" and paste your key (from console.anthropic.com).
    It is stored ONLY in this browser's localStorage and is sent only to
    Anthropic's API, directly from your browser, when you use an AI feature.
  • With a key you unlock: freeform chat with Sable (who can start drills, open
    lessons, run mocks, etc.), "Explain it differently", a per-question tutor,
    "Give me 3 similar questions", and the Study Studio (notes → flashcards/quiz).
  • Without a key, everything else works: lessons, drills, mastery, the full
    mock exams, vocab, strategies, gamification, and Sable's rule-based answers
    and daily briefing.

  IMPORTING YOUR 1,500-WORD VOCAB LIST
  • Vocabulary → Import (or Settings). Paste CSV, one word per line:
        word,definition,example
    The example column is optional; a header row is skipped automatically.
  • JSON also works: [{"w":"candid","def":"honest","ex":"a candid reply"}].
  • You can keep multiple named sets, each with its own spaced-repetition
    progress. A 120-word starter set ships so the games work immediately.

  ADDING YOUR OWN QUESTIONS
  • Settings → "Import questions", or edit this file directly. The schema (see
    the DATA:QUESTIONS_MATH section) is:
        { id, skill, difficulty (1|2|3|"extreme"), type ("mcq"|"spr"),
          stem, choices:[4 strings] (mcq only), answer, explanation }
    - answer is the letter "A"–"D" for mcq, or the numeric string for spr.
    - section and domain are derived automatically from `skill` (see DATA:SKILLS
      for the ~30 valid skill ids).
    - Wrap math in $...$ (KaTeX); write literal money as \$ (e.g. \$80).

  VOICE MODE
  • Settings → Gameplay → "Voice mode" turns on spoken replies (speechSynthesis)
    and, where available, the mic button for speech-to-text. NOTE: browsers often
    block SpeechRecognition on file:// pages — if the mic doesn't work, just type;
    spoken replies still work. (Serving the file over http://localhost re-enables
    the mic if you want it.)

  OFFLINE NOTE
  • The only external resource is KaTeX (math rendering) from a CDN. Offline, the
    app falls back to readable plain-text math automatically — nothing breaks.

  EDITING / REBUILDING (for the curious)
  • This file is assembled from tidy source parts in src/ by build.py, but the
    shipped ace.html is fully standalone — you can also just edit it directly.
    The table of contents below maps the sections.

  TABLE OF CONTENTS (search for these markers)
    STYLES · DATA:SKILLS · DATA:QUESTIONS_MATH · DATA:QUESTIONS_RW ·
    DATA:LESSONS · DATA:STRATEGIES · DATA:VOCAB · ENGINE · UI
═══════════════════════════════════════════════════════════════════════════
