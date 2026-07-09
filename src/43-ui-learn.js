/* =========================================================================
   UI — Learn (courses/lessons) and Skill Path.  Full implementation in Phase 2.
   ========================================================================= */
function comingSoon(title, note) {
  return `${pageHeader(title)}<div class="card tac" style="padding:44px">
    <div style="font-size:2.2rem">🚧</div><h3>${esc(title)} is being built.</h3>
    <p class="muted">${esc(note || 'Arriving in an upcoming build phase.')}</p></div>`;
}
registerView('learn', { render: () => comingSoon('Learn', 'Khan-style courses with lessons + checkpoints arrive in Phase 2.') });
registerView('path',  { render: () => comingSoon('Skill Path', 'The winding Duolingo-style path arrives in Phase 2.') });
