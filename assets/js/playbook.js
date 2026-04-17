function openPlaybook() { openMod('mod-play'); }

function playTab(t, el) {
  document.querySelectorAll('#mod-play .atb').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('.play-panel').forEach(p => p.classList.remove('on'));
  document.getElementById('pp-' + t).classList.add('on');
}
