function wordCard(word, recite) {
  return `
    <article class="card ${recite ? 'recite' : ''}">
      <div><span class="word">${escapeHtml(word.word)}</span><span class="phonetic">${escapeHtml(word.phonetic)}</span></div>
      <p class="zh">${escapeHtml(word.meaning)}</p>
      <p class="example">${escapeHtml(word.example)}</p>
      <p class="zh">${escapeHtml(word.exampleZh)}</p>
      ${recite ? '<p class="hint closed-only">点击显示中文</p>' : ''}
    </article>
  `;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderPane(payload, recite) {
  const root = document.getElementById('today');
  const cards = payload.words.map((w) => wordCard(w, recite)).join('');
  const fallback = recite
    ? '来自上一学习日 · 现场口头，系统不记分'
    : '';
  root.innerHTML = `
    <h1>${escapeHtml(payload.heading)}</h1>
    <p class="note">${escapeHtml(payload.message || fallback)}</p>
    ${cards}
  `;
  root.querySelectorAll('.card.recite').forEach((card) => {
    card.addEventListener('click', () => card.classList.toggle('open'));
  });
}

function setActiveNav(pane) {
  document.getElementById('nav-recite').classList.toggle('active', pane === 'recite');
  document.getElementById('nav-learn').classList.toggle('active', pane === 'learn');
}

function paneFromHash(defaultPane) {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'recite' || hash === 'learn') return hash;
  return defaultPane;
}

let snapshot = null;

function showPane(pane) {
  if (!snapshot) return;
  setActiveNav(pane);
  if (pane === 'recite') renderPane(snapshot.recite, true);
  else renderPane(snapshot.learn, false);
}

async function loadToday() {
  snapshot = await fetch('/api/today').then((r) => r.json());
  const stamp = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  }).format(new Date());
  document.getElementById('clock').textContent = stamp;
  const pane = paneFromHash(snapshot.defaultPane);
  if (!window.location.hash) {
    history.replaceState(null, '', `#${pane}`);
  }
  showPane(pane);
}

async function loadHistory() {
  const box = document.getElementById('history');
  const data = await fetch('/api/history').then((r) => r.json());
  box.innerHTML = `<ul class="history-list">${data.dates.map((d) => `<li><button type="button" data-date="${d}">${d}</button></li>`).join('')}</ul><div id="history-day"></div>`;
  box.querySelectorAll('button[data-date]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const day = await fetch(`/api/day/${btn.dataset.date}`).then((r) => r.json());
      document.getElementById('history-day').innerHTML = `
        <h1>${escapeHtml(day.date)} · 复习</h1>
        ${day.words.map((w) => wordCard(w, false)).join('')}
      `;
    });
  });
}

document.getElementById('history-toggle').addEventListener('click', async () => {
  const box = document.getElementById('history');
  box.hidden = !box.hidden;
  if (!box.hidden && !box.dataset.loaded) {
    await loadHistory();
    box.dataset.loaded = '1';
  }
});

window.addEventListener('hashchange', () => {
  if (!snapshot) return;
  showPane(paneFromHash(snapshot.defaultPane));
});

loadToday();
