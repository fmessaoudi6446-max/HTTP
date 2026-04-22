// ── Ajouter une ligne header ──
function addHeader(key = '', val = '') {
  const list = document.getElementById('headersList');
  const row = document.createElement('div');
  row.className = 'header-row';
  row.innerHTML = `
    <input class="hdr-input" placeholder="Header key"   value="${key}" />
    <input class="hdr-input" placeholder="Header value" value="${val}" />
    <button class="remove-btn" onclick="this.parentElement.remove()">×</button>
  `;
  list.appendChild(row);
}

// ── Lire tous les headers saisis ──
function getHeaders() {
  const rows = document.querySelectorAll('.header-row');
  const headers = {};
  rows.forEach(row => {
    const [k, v] = row.querySelectorAll('.hdr-input');
    if (k.value.trim()) {
      headers[k.value.trim()] = v.value.trim();
    }
  });
  return headers;
}

// ── Envoyer la requête HTTP ──
async function sendRequest() {
  const url    = document.getElementById('url').value.trim();
  const method = document.getElementById('method').value;
  const body   = document.getElementById('body').value.trim();

  if (!url) {
    alert('Veuillez entrer une URL.');
    return;
  }

  const btn      = document.getElementById('sendBtn');
  const respBody = document.getElementById('responseBody');
  const meta     = document.getElementById('responseMeta');

  btn.disabled = true;
  respBody.value = '';
  meta.textContent = 'Chargement...';

  const start = Date.now();

  try {
    const options = {
      method,
      headers: getHeaders(),
    };

    // Ajouter le body seulement si ce n'est pas un GET/HEAD
    const hasBody = !['GET', 'HEAD', 'OPTIONS'].includes(method);
    if (hasBody && body) {
      options.body = body;
    }

    // Envoi de la requête
    const response = await fetch(url, options);
    const elapsed  = Date.now() - start;
    const text     = await response.text();

    // Afficher statut + temps
    meta.textContent = `Statut : ${response.status} ${response.statusText}  |  ${elapsed}ms`;

    // Formater en JSON si possible
    let display = text;
    try {
      display = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      // texte brut
    }
    respBody.value = display;

  } catch (err) {
    meta.textContent = 'Erreur réseau';
    respBody.value = `Erreur : ${err.message}\n\nVérifiez :\n• L'URL est correcte\n• CORS est autorisé sur le serveur\n• Votre connexion réseau`;
  } finally {
    btn.disabled = false;
  }
}

// ── Touche Entrée pour envoyer ──
document.getElementById('url').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendRequest();
});

// ── Header par défaut ──
addHeader('Content-Type', 'application/json');
