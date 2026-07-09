/* =========================================================================
   BOOT — wire everything together and start the app.
   ========================================================================= */

// Expose const-defined singletons so inline onclick="Sable.x()" handlers (which
// run in global scope) can reach them. Top-level function declarations are
// already global; const objects are not, so publish them explicitly.
window.Sable = Sable;
window.CommandBar = CommandBar;
window.AI = AI;

function boot() {
  loadState();
  ensureToday();
  buildBank();
  buildLessons();
  buildPath();
  rolloverWeekIfNeeded();
  generatePlan();          // ensure a plan/quest exists
  save();

  if (S.settings.voice) Sable.initVoice();

  // Global keyboard shortcuts.
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); CommandBar.toggle(); }
    else if (e.key === 'Escape') { CommandBar.close(); }
  });

  window.addEventListener('hashchange', router);
  if (!location.hash) location.hash = '#/home';
  router();

  // Re-typeset math once the deferred KaTeX script is ready.
  if (!katexReady()) {
    let tries = 0;
    const iv = setInterval(() => { if (katexReady() || tries++ > 40) { clearInterval(iv); typeset(document); } }, 150);
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
