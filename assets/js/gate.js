function gateCheck() {
  if (sessionStorage.getItem('csa_auth') === 'true') {
    document.getElementById('gate').classList.add('hidden');
  }
}

function gateSubmit() {
  const input = document.getElementById('gate-input');
  const err   = document.getElementById('gate-err');
  const val   = input.value.trim();

  if (val === ACCESS_KEY) {
    sessionStorage.setItem('csa_auth', 'true');
    document.getElementById('gate').classList.add('hidden');
    err.textContent = '';
  } else {
    input.classList.remove('shake', 'error');
    void input.offsetWidth;
    input.classList.add('shake', 'error');
    err.textContent = 'Kode akses salah, coba lagi.';
    input.value = '';
    input.focus();
    setTimeout(() => {
      input.classList.remove('error');
      err.textContent = '';
    }, 3000);
  }
}

gateCheck();
