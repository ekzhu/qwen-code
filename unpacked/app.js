/* =================================================================
   Qwen Code Unpacked — interactivity
   ================================================================= */

// ---------- Agent loop renderer ----------
(function buildLoop() {
  const rail = document.getElementById('loopRail');
  const detail = document.getElementById('loopDetail');
  const counter = document.getElementById('loopCounter');
  const prevBtn = document.getElementById('loopPrev');
  const nextBtn = document.getElementById('loopNext');
  let current = 1;

  function renderRail() {
    rail.innerHTML = '';
    LOOP_STEPS.forEach(step => {
      const el = document.createElement('div');
      el.className = 'loop-step';
      if (step.n === current) el.classList.add('active');
      else if (step.n < current) el.classList.add('done');
      el.innerHTML = `
        <div class="loop-circle">${step.n}</div>
        <div class="loop-label">${step.label}</div>
      `;
      el.addEventListener('click', () => { current = step.n; render(); });
      rail.appendChild(el);
    });
  }

  function renderDetail() {
    const step = LOOP_STEPS.find(s => s.n === current);
    detail.innerHTML = `
      <div class="loop-detail-num">Step ${step.n} of ${LOOP_STEPS.length}</div>
      <h3 class="loop-detail-title">${step.title}</h3>
      <p class="loop-detail-desc">${step.desc}</p>
      <p class="loop-detail-detail">${step.detail}</p>
      <div class="loop-detail-file">${step.file}</div>
    `;
    counter.textContent = `${current} / ${LOOP_STEPS.length}`;
    prevBtn.disabled = current === 1;
    nextBtn.disabled = current === LOOP_STEPS.length;
  }

  function render() { renderRail(); renderDetail(); }

  prevBtn.addEventListener('click', () => { if (current > 1) { current--; render(); } });
  nextBtn.addEventListener('click', () => { if (current < LOOP_STEPS.length) { current++; render(); } });

  document.addEventListener('keydown', e => {
    if (!document.getElementById('agent-loop').contains(document.activeElement) &&
        !isInViewport(document.getElementById('agent-loop'))) return;
    if (e.key === 'ArrowLeft' && current > 1) { current--; render(); }
    if (e.key === 'ArrowRight' && current < LOOP_STEPS.length) { current++; render(); }
  });

  function isInViewport(el) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  render();
})();

// ---------- Architecture explorer ----------
(function buildArch() {
  const grid = document.getElementById('archGrid');
  const detail = document.getElementById('archDetail');
  let active = null;

  ARCH_PACKAGES.forEach(p => {
    const box = document.createElement('div');
    box.className = 'arch-box';
    box.innerHTML = `
      <div class="arch-box-name">${p.name}</div>
      <div class="arch-box-stats">${p.files} files · ${p.loc} LOC</div>
    `;
    box.addEventListener('click', () => {
      if (active) active.classList.remove('active');
      box.classList.add('active');
      active = box;
      detail.innerHTML = `
        <h4>${p.name}</h4>
        <p>${p.desc}</p>
        <span class="path">${p.files} files · ${p.loc} LOC</span>
      `;
    });
    grid.appendChild(box);
  });
})();

// ---------- Tool grid ----------
(function buildTools() {
  const grid = document.getElementById('toolsGrid');
  const detail = document.getElementById('toolDetail');
  let activePill = null;

  TOOL_CATEGORIES.forEach(cat => {
    const cell = document.createElement('div');
    cell.className = 'tool-cat';
    const count = cat.tools.length;
    cell.innerHTML = `
      <div class="tool-cat-h">
        <div class="tool-cat-name">${cat.name}</div>
        <div class="tool-cat-count">${count} tool${count > 1 ? 's' : ''}</div>
      </div>
      <div class="tool-cat-body"></div>
    `;
    const body = cell.querySelector('.tool-cat-body');
    cat.tools.forEach(tool => {
      const pill = document.createElement('div');
      pill.className = 'tool-pill';
      pill.textContent = tool.name;
      pill.addEventListener('click', () => {
        if (activePill) activePill.classList.remove('active');
        pill.classList.add('active');
        activePill = pill;
        detail.innerHTML = `
          <span class="tool-detail-cat">${cat.name}</span>
          <h4>${tool.name} <code>${tool.internal}</code></h4>
          <p class="tool-detail-desc">${tool.desc}</p>
          ${tool.impl ? `<p class="tool-detail-impl">${tool.impl}</p>` : ''}
          <div class="loop-detail-file">${tool.file}</div>
        `;
      });
      body.appendChild(pill);
    });
    grid.appendChild(cell);
  });
})();

// ---------- Command grid ----------
(function buildCommands() {
  const grid = document.getElementById('cmdGrid');
  COMMANDS.forEach(cat => {
    const cell = document.createElement('div');
    cell.className = 'cmd-cat';
    cell.innerHTML = `
      <div class="cmd-cat-h">
        <div class="cmd-cat-name">${cat.name}</div>
        <div class="cmd-cat-count">${cat.items.length}</div>
      </div>
      <div class="cmd-list"></div>
    `;
    const list = cell.querySelector('.cmd-list');
    cat.items.forEach(c => {
      const item = document.createElement('span');
      item.className = 'cmd-item';
      item.textContent = c;
      list.appendChild(item);
    });
    grid.appendChild(cell);
  });
})();

// ---------- Subagents & skills ----------
(function buildAgentsAndSkills() {
  const subWrap = document.getElementById('subagentsList');
  SUBAGENTS.forEach(a => {
    const row = document.createElement('div');
    row.className = 'stack-row';
    row.innerHTML = `
      <div class="stack-name">${a.name}</div>
      <div class="stack-meta">${a.where}</div>
      <div class="stack-desc">${a.desc}</div>
    `;
    subWrap.appendChild(row);
  });

  const skillWrap = document.getElementById('skillsList');
  SKILLS.forEach(s => {
    const row = document.createElement('div');
    row.className = 'stack-row';
    row.innerHTML = `
      <div class="stack-name">${s.name}</div>
      <div class="stack-meta">${s.where}</div>
      <div class="stack-desc">${s.desc}</div>
    `;
    skillWrap.appendChild(row);
  });
})();

// ---------- Notable internals ----------
(function buildNotable() {
  const grid = document.getElementById('hiddenGrid');
  NOTABLE.forEach(n => {
    const card = document.createElement('div');
    card.className = 'hidden-card';
    card.innerHTML = `
      <div class="hidden-name">${n.name}</div>
      <div class="hidden-desc">${n.desc}</div>
    `;
    grid.appendChild(card);
  });
})();
