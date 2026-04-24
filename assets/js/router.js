const SECTIONS = ['beranda', 'katalog', 'playbook', 'spek', 'profil'];

function navTo(section) {
  closeSidebar();

  SECTIONS.forEach(s => {
    const sec = document.getElementById('sec-' + s);
    const nav = document.getElementById('nav-' + s);
    if (sec) sec.classList.toggle('active', s === section);
    if (nav) nav.classList.toggle('active', s === section);
  });

  const dvt = document.getElementById('dvt');
  const bl  = document.getElementById('bl');

  if (section === 'katalog') {
    dvt.classList.remove('hidden');
    bl.classList.remove('hidden');
  } else {
    dvt.classList.add('hidden');
    bl.classList.add('hidden');
  }

  if (section === 'playbook') loadPlaybookIfNeeded();
  if (section === 'spek')     loadSpekIfNeeded();

  S.curSection = section;
}

let spekLoaded = false;
function loadSpekIfNeeded() {
  if (spekLoaded) return;
  spekLoaded = true;
  loadSpek();
}

async function loadSpek() {
  const body = document.getElementById('spek-body');
  body.innerHTML = '<div class="ldg"><div class="spin"></div></div>';
  let cats = [];
  try {
    const { data, error } = await sb.from('catalogs').select('*')
      .eq('is_active', true).order('sort_order').order('created_at');
    if (!error) cats = data || [];
  } catch (e) {}
  renderSpekBody(cats);
}
