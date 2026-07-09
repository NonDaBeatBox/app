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
  // Global, profile-independent data (lessons/path don't depend on the profile).
  loadAccounts();
  buildLessons();
  buildPath();

  // Global keyboard shortcuts.
  document.addEventListener('keydown', (e) => {
    if (!currentUser) return;                 // disabled on the auth screen
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); CommandBar.toggle(); }
    else if (e.key === 'Escape') { CommandBar.close(); }
  });
  window.addEventListener('hashchange', () => { if (currentUser) router(); });

  // Sign-in gate: resume a session, or show the auth screen.
  const sess = localStorage.getItem(LS.session);
  if (sess && ACCOUNTS[sess]) enterApp(sess);
  else renderAuth();

  // Re-typeset math once the deferred KaTeX script is ready.
  if (!katexReady()) {
    let tries = 0;
    const iv = setInterval(() => { if (katexReady() || tries++ > 40) { clearInterval(iv); typeset(document); } }, 150);
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
