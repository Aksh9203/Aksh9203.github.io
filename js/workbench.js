/**
 * Interactive Systems Workbench (Hero Playable Demos)
 * Three genuine, lightweight, interactive simulations of Aksh's actual backend systems:
 *   1. Distributed Saga Rollback (AWS Step Functions: Flight -> Hotel -> Payment)
 *   2. EventBridge 4-State Billing Reconciler (DynamoDB conditional writes + 7-day TTL dedupe)
 *   3. Uber H3 Hexagonal O(1) Responder Lookup (interactive clickable hex grid + k-ring match)
 * Zero external libraries. Fully keyboard accessible and reduced-motion safe.
 */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reducedMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initSystemsWorkbench() {
  const root = document.getElementById('systems-workbench');
  if (!root) return;

  const tabs = root.querySelectorAll('[data-sim-tab]');
  const panels = root.querySelectorAll('[data-sim-panel]');

  const setTab = (id) => {
    tabs.forEach((btn) => {
      const active = btn.dataset.simTab === id;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    panels.forEach((p) => {
      const active = p.dataset.simPanel === id;
      p.hidden = !active;
    });
  };

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => setTab(btn.dataset.simTab));
  });

  initSagaSim();
  initEventBridgeSim();
  initH3Sim();
}

/* ==========================================================================
   SIM 1: DISTRIBUTED SAGA ORCHESTRATOR (AWS Step Functions)
   ========================================================================== */
function initSagaSim() {
  const runOkBtn = document.getElementById('saga-run-ok');
  const runFailBtn = document.getElementById('saga-run-fail');
  const logEl = document.getElementById('saga-log');
  const nodes = {
    flight: document.getElementById('saga-node-flight'),
    hotel: document.getElementById('saga-node-hotel'),
    payment: document.getElementById('saga-node-payment')
  };
  if (!runOkBtn || !runFailBtn || !logEl) return;

  let busy = false;
  const delay = () => (reducedMotion() ? 40 : 420);

  const setNode = (key, state, badge) => {
    const el = nodes[key];
    if (!el) return;
    el.dataset.state = state;
    const statusSpan = el.querySelector('.sim-node-state');
    if (statusSpan) statusSpan.textContent = badge;
  };

  const appendLog = (text, tone = 'info') => {
    const line = document.createElement('div');
    line.className = `sim-log-line tone-${tone}`;
    line.textContent = text;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  };

  const reset = () => {
    setNode('flight', 'idle', 'IDLE');
    setNode('hotel', 'idle', 'IDLE');
    setNode('payment', 'idle', 'IDLE');
    logEl.innerHTML = '';
  };

  const run = async (failAtPayment) => {
    if (busy) return;
    busy = true;
    runOkBtn.disabled = true;
    runFailBtn.disabled = true;
    reset();

    appendLog('→ Step Functions started · idempotency_key=tx_9203', 'info');
    await sleep(delay());

    setNode('flight', 'ok', 'RESERVED');
    appendLog('✓ Flight Lambda committed + Outbox event recorded', 'ok');
    await sleep(delay());

    setNode('hotel', 'ok', 'RESERVED');
    appendLog('✓ Hotel Lambda committed + Outbox event recorded', 'ok');
    await sleep(delay());

    if (!failAtPayment) {
      setNode('payment', 'ok', 'CHARGED');
      appendLog('✓ Payment Lambda succeeded · Saga COMPLETED (0 dual-writes)', 'ok');
    } else {
      setNode('payment', 'fail', 'DECLINED');
      appendLog('✕ Payment Lambda failed · Triggering compensating rollbacks…', 'fail');
      await sleep(delay());

      setNode('hotel', 'rollback', 'RELEASED');
      appendLog('↺ Compensating Hotel Lambda · Room inventory restored', 'warn');
      await sleep(delay());

      setNode('flight', 'rollback', 'RELEASED');
      appendLog('↺ Compensating Flight Lambda · Seat released · Clean rollback', 'warn');
    }

    busy = false;
    runOkBtn.disabled = false;
    runFailBtn.disabled = false;
  };

  runOkBtn.addEventListener('click', () => run(false));
  runFailBtn.addEventListener('click', () => run(true));
}

/* ==========================================================================
   SIM 2: EVENTBRIDGE 4-STATE BILLING RECONCILER (MindSpark)
   ========================================================================== */
function initEventBridgeSim() {
  const states = ['CHECKOUT', 'PENDING', 'ACTIVE', 'SETTLED'];
  let currentIdx = 1; // Starts at PENDING
  const seenEvents = new Set(['evt_001']);

  const advanceBtn = document.getElementById('eb-advance');
  const staleBtn = document.getElementById('eb-stale');
  const dupBtn = document.getElementById('eb-dup');
  const resetBtn = document.getElementById('eb-reset');
  const logEl = document.getElementById('eb-log');
  const stepEls = document.querySelectorAll('[data-eb-step]');

  if (!advanceBtn || !logEl) return;

  const syncSteps = () => {
    stepEls.forEach((el) => {
      const idx = Number(el.dataset.ebStep);
      el.dataset.state = idx < currentIdx ? 'done' : idx === currentIdx ? 'active' : 'idle';
    });
  };

  const log = (msg, tone = 'info') => {
    const line = document.createElement('div');
    line.className = `sim-log-line tone-${tone}`;
    line.textContent = msg;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  };

  advanceBtn.addEventListener('click', () => {
    if (currentIdx >= states.length - 1) {
      log('• State already SETTLED (terminal). Click Reset to replay.', 'info');
      return;
    }
    const nextIdx = currentIdx + 1;
    const evtId = `evt_00${nextIdx + 1}`;
    seenEvents.add(evtId);
    currentIdx = nextIdx;
    syncSteps();
    log(`✓ Conditional write OK · ${states[currentIdx - 1]} → ${states[currentIdx]} (${evtId})`, 'ok');
  });

  staleBtn.addEventListener('click', () => {
    const staleTarget = states[Math.max(0, currentIdx - 1)];
    log(
      `⊘ BLOCKED regression (${states[currentIdx]} ↛ ${staleTarget}) · DynamoDB ConditionExpression rejected stale event`,
      'warn'
    );
  });

  dupBtn.addEventListener('click', () => {
    const dupId = [...seenEvents][seenEvents.size - 1];
    log(`⊘ DEDUPED (${dupId}) · Found in 7-day TTL cache · Zero duplicate write`, 'warn');
  });

  resetBtn.addEventListener('click', () => {
    currentIdx = 1;
    seenEvents.clear();
    seenEvents.add('evt_001');
    logEl.innerHTML = '';
    syncSteps();
    log('↺ Reconciler reset · Current billing state: PENDING', 'info');
  });

  syncSteps();
}

/* ==========================================================================
   SIM 3: UBER H3 HEXAGONAL O(1) RESPONDER LOOKUP (SafeGuard SOS)
   ========================================================================== */
function initH3Sim() {
  const svg = document.getElementById('h3-grid-svg');
  const readout = document.getElementById('h3-readout');
  if (!svg || !readout) return;

  // Compact axial hex grid (radius 2 -> 19 clean hexagons)
  const R = 21;
  const cells = [];
  const responders = new Set(['1,-1', '-2,1', '0,2']);

  for (let q = -2; q <= 2; q++) {
    for (let r = -2; r <= 2; r++) {
      const s = -q - r;
      if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s)) <= 2) {
        const x = 165 + R * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
        const y = 104 + R * (1.5 * r);
        cells.push({ q, r, s, key: `${q},${r}`, x, y, hasResponder: responders.has(`${q},${r}`) });
      }
    }
  }

  const hexDist = (a, b) =>
    Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s));

  const hexPoints = (cx, cy, rad) => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const ang = (Math.PI / 180) * (60 * i - 30);
      pts.push(`${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  let selectedKey = '0,0';

  const render = () => {
    const origin = cells.find((c) => c.key === selectedKey) || cells[0];
    // Find nearest responder via ring distance
    let nearest = null;
    let bestRing = 99;
    cells.forEach((c) => {
      if (c.hasResponder) {
        const d = hexDist(origin, c);
        if (d < bestRing) {
          bestRing = d;
          nearest = c;
        }
      }
    });

    svg.innerHTML = '';
    cells.forEach((cell) => {
      const dist = hexDist(origin, cell);
      const isOrigin = cell.key === origin.key;
      const isMatched = nearest && cell.key === nearest.key;
      const inRing = dist <= bestRing;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'h3-cell');
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute(
        'aria-label',
        `Hex cell ${cell.q},${cell.r}${cell.hasResponder ? ' (Active responder)' : ''}`
      );

      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', hexPoints(cell.x, cell.y, R - 2));
      poly.setAttribute(
        'class',
        `h3-poly${isOrigin ? ' is-origin' : ''}${isMatched ? ' is-match' : ''}${inRing && !isOrigin ? ' is-ring' : ''}`
      );
      g.appendChild(poly);

      if (cell.hasResponder) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', cell.x.toFixed(1));
        dot.setAttribute('cy', cell.y.toFixed(1));
        dot.setAttribute('r', isMatched ? '5.5' : '4');
        dot.setAttribute('class', `h3-responder${isMatched ? ' is-match' : ''}`);
        g.appendChild(dot);
      } else if (isOrigin) {
        const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('x', cell.x.toFixed(1));
        txt.setAttribute('y', (cell.y + 3.5).toFixed(1));
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('class', 'h3-origin-txt');
        txt.textContent = 'SOS';
        g.appendChild(txt);
      }

      const pick = () => {
        selectedKey = cell.key;
        render();
      };
      g.addEventListener('click', pick);
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pick();
        }
      });
      svg.appendChild(g);
    });

    readout.textContent = `H3 Res-9 [${origin.key}] → O(1) Redis k-ring(${bestRing}) matched responder at [${nearest.key}] (0 full-table scans)`;
  };

  render();
}
