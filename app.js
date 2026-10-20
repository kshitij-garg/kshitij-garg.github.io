/**
 * ==========================================================================
 * KSHITIJ GARG - EXECUTIVE PORTFOLIO & LIVE INTERACTIVE SYSTEMS HUB
 * Lead Technical Project & Product Manager
 * Core Interactive Simulators & High-Concurrency Engines
 * ==========================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. WEB AUDIO API - REALISTIC TACTILE ACOUSTIC SOUND SYNTHESIZER
  // ==========================================================================
  let audioCtx = null;
  let isSoundMuted = false; // By default enabled, gentle & soothing volume

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  /**
   * Synthesize gentle wood acoustic tap:
   * 35ms duration, pitch drops 320Hz -> 210Hz, exponential decay
   */
  function playAcousticTap() {
    if (isSoundMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      const now = audioCtx.currentTime;

      // Pitch glide: 320 Hz down to 210 Hz
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(210, now + 0.035);

      // Gentle gain envelope: 0.12 down to 0.001
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.036);
    } catch (e) {
      // AudioContext not allowed before user interaction
    }
  }

  function toggleMute() {
    isSoundMuted = !isSoundMuted;
    updateMuteUI();
    if (!isSoundMuted) {
      playAcousticTap();
    }
  }

  function updateMuteUI() {
    const ccSwitch = document.getElementById('cc-sound-switch');
    const ccLabel = document.getElementById('cc-sound-label');
    const remoteMuteBtn = document.getElementById('remote-btn-mute');
    const tvSoundBadge = document.getElementById('tv-sound-badge');

    if (ccSwitch) {
      if (isSoundMuted) {
        ccSwitch.classList.remove('active');
        if (ccLabel) ccLabel.textContent = 'Navigation Sound (Muted)';
      } else {
        ccSwitch.classList.add('active');
        if (ccLabel) ccLabel.textContent = 'Navigation Sound (Enabled)';
      }
    }

    if (remoteMuteBtn) {
      if (isSoundMuted) {
        remoteMuteBtn.classList.add('active-action');
        remoteMuteBtn.style.color = '#f43f5e';
      } else {
        remoteMuteBtn.classList.remove('active-action');
        remoteMuteBtn.style.color = '';
      }
    }

    if (tvSoundBadge) {
      tvSoundBadge.textContent = isSoundMuted ? 'Muted' : 'Stereo Tap';
      tvSoundBadge.style.color = isSoundMuted ? '#f87171' : '#38bdf8';
    }
  }


  // ==========================================================================
  // 2. UNIFIED TABS & DEEP LINKING
  // ==========================================================================
  function initTabs() {
    const tabButtons = document.querySelectorAll('.app-tab-btn');
    const panels = document.querySelectorAll('.app-panel');

    function activateTab(tabId) {
      tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      panels.forEach(panel => {
        if (panel.id === tabId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      // Trigger canvas re-renders when switching tabs
      if (tabId === 'tab-quant') {
        renderQuantChart();
      } else if (tabId === 'tab-uart') {
        drawUartWaveform();
      }
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        playAcousticTap();
        const targetTab = btn.getAttribute('data-tab');
        activateTab(targetTab);
        history.replaceState(null, null, '#' + targetTab.replace('tab-', ''));
      });
    });

    // Check URL Hash on load
    const hash = window.location.hash.replace('#', '');
    if (hash === 'tv-launcher' || hash === 'tv') {
      activateTab('tab-tv');
    } else if (hash === 'quant-rebalance' || hash === 'quant') {
      activateTab('tab-quant');
    } else if (hash === 'monitorian' || hash === 'monitors') {
      activateTab('tab-monitorian');
    } else if (hash === 'uart' || hash === 'uart-sha1') {
      activateTab('tab-uart');
    }
  }


  // ==========================================================================
  // 3. SONY BRAVIA 4K APPLE TV LAUNCHER SIMULATOR
  // ==========================================================================
  const tvApps = [
    { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#ff0000' },
    { id: 'netflix', name: 'Netflix', icon: '🎬', color: '#e50914' },
    { id: 'prime', name: 'Prime Video', icon: '📦', color: '#00a8e1' },
    { id: 'plex', name: 'Plex TV', icon: '⚡', color: '#e5a00d' },
    { id: 'spotify', name: 'Spotify', icon: '🎵', color: '#1db954' },
    { id: 'twitch', name: 'Twitch', icon: '🎮', color: '#9146ff' },
    { id: 'tvbro', name: 'TV Bro', icon: '🌐', color: '#3b82f6' },
    { id: 'aptoide', name: 'Aptoide TV', icon: '📱', color: '#f97316' },
    { id: 'settings', name: 'Settings', icon: '⚙️', color: '#64748b' },
    { id: 'smarttube', name: 'SmartTube', icon: '📺', color: '#ef4444' },
    { id: 'kodi', name: 'Kodi Media', icon: '🍿', color: '#14b8a6' },
    { id: 'terminal', name: 'Debloat Core', icon: '🛡️', color: '#10b981' }
  ];

  let tvFocusedIndex = 0;
  let isTvMoveMode = false;
  let isTvControlCenterOpen = false;

  function renderTvGrid() {
    const gridEl = document.getElementById('tv-apps-grid');
    if (!gridEl) return;

    gridEl.innerHTML = '';
    tvApps.forEach((app, idx) => {
      const tile = document.createElement('div');
      tile.className = 'tv-app-tile';
      if (idx === tvFocusedIndex) {
        tile.classList.add('focused');
        if (isTvMoveMode) {
          tile.classList.add('moving');
        }
      }

      tile.innerHTML = `
        <div class="tv-app-icon">${app.icon}</div>
        <div class="tv-app-name">${app.name}</div>
      `;

      tile.addEventListener('click', () => {
        playAcousticTap();
        if (isTvMoveMode) {
          dropAppTile();
        } else {
          tvFocusedIndex = idx;
          renderTvGrid();
          showTvToast(`Launching ${app.name} (4K HDR 60fps)...`);
        }
      });

      gridEl.appendChild(tile);
    });
  }

  function moveTvFocus(deltaCol, deltaRow) {
    playAcousticTap();
    const cols = 6;
    const total = tvApps.length;
    let oldIndex = tvFocusedIndex;
    let newIndex = tvFocusedIndex + deltaCol + (deltaRow * cols);

    if (newIndex < 0) newIndex = 0;
    if (newIndex >= total) newIndex = total - 1;

    if (isTvMoveMode && newIndex !== oldIndex) {
      // Swap tiles in move mode
      const temp = tvApps[oldIndex];
      tvApps[oldIndex] = tvApps[newIndex];
      tvApps[newIndex] = temp;
    }

    tvFocusedIndex = newIndex;
    renderTvGrid();
  }

  function toggleTvMoveMode() {
    isTvMoveMode = !isTvMoveMode;
    playAcousticTap();
    const moveBtn = document.getElementById('remote-btn-move');
    if (moveBtn) {
      if (isTvMoveMode) {
        moveBtn.classList.add('active-action');
        showTvToast('Move Mode: Use D-Pad to move tile, press OK to save.');
      } else {
        moveBtn.classList.remove('active-action');
        showTvToast('Tile position saved successfully!');
      }
    }
    renderTvGrid();
  }

  function dropAppTile() {
    if (isTvMoveMode) {
      isTvMoveMode = false;
      playAcousticTap();
      const moveBtn = document.getElementById('remote-btn-move');
      if (moveBtn) moveBtn.classList.remove('active-action');
      showTvToast(`Tile "${tvApps[tvFocusedIndex].name}" placed.`);
      renderTvGrid();
    } else {
      playAcousticTap();
      showTvToast(`Launching ${tvApps[tvFocusedIndex].name} (4K HDR)...`);
    }
  }

  function toggleControlCenter() {
    isTvControlCenterOpen = !isTvControlCenterOpen;
    playAcousticTap();
    const cc = document.getElementById('tv-control-center');
    if (cc) {
      if (isTvControlCenterOpen) {
        cc.classList.add('open');
      } else {
        cc.classList.remove('open');
      }
    }
  }

  function sortTvApps(method) {
    playAcousticTap();
    if (method === 'alpha') {
      tvApps.sort((a, b) => a.name.localeCompare(b.name));
      showTvToast('Sorted: Alphabetical (A-Z)');
    } else if (method === 'reverse') {
      tvApps.reverse();
      showTvToast('Sorted: Reversed Order');
    }
    tvFocusedIndex = 0;
    renderTvGrid();
  }

  function showTvToast(msg) {
    const toast = document.getElementById('tv-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 2800);
  }

  function initTvRemote() {
    renderTvGrid();

    // D-Pad Buttons
    document.getElementById('dpad-up')?.addEventListener('click', () => moveTvFocus(0, -1));
    document.getElementById('dpad-down')?.addEventListener('click', () => moveTvFocus(0, 1));
    document.getElementById('dpad-left')?.addEventListener('click', () => moveTvFocus(-1, 0));
    document.getElementById('dpad-right')?.addEventListener('click', () => moveTvFocus(1, 0));
    document.getElementById('dpad-center')?.addEventListener('click', dropAppTile);

    // Remote Actions
    document.getElementById('remote-btn-home')?.addEventListener('click', () => {
      playAcousticTap();
      tvFocusedIndex = 0;
      if (isTvControlCenterOpen) toggleControlCenter();
      if (isTvMoveMode) toggleTvMoveMode();
      renderTvGrid();
      showTvToast('Home Screen reset');
    });

    document.getElementById('remote-btn-back')?.addEventListener('click', () => {
      playAcousticTap();
      if (isTvControlCenterOpen) {
        toggleControlCenter();
      } else if (isTvMoveMode) {
        toggleTvMoveMode();
      } else {
        showTvToast('Back button pressed');
      }
    });

    document.getElementById('remote-btn-menu')?.addEventListener('click', () => {
      toggleControlCenter();
    });

    document.getElementById('remote-btn-move')?.addEventListener('click', toggleTvMoveMode);
    document.getElementById('remote-btn-sort')?.addEventListener('click', () => sortTvApps('alpha'));
    document.getElementById('remote-btn-mute')?.addEventListener('click', toggleMute);

    // Control Center Mute Switch
    document.getElementById('cc-sound-toggle')?.addEventListener('click', toggleMute);
    document.getElementById('cc-close-btn')?.addEventListener('click', toggleControlCenter);

    // Top status bar click opens CC
    document.getElementById('tv-status-clock')?.addEventListener('click', toggleControlCenter);

    // Keyboard TV Remote Navigation
    window.addEventListener('keydown', (e) => {
      const activeTab = document.querySelector('.app-panel.active');
      if (!activeTab || activeTab.id !== 'tab-tv') return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowUp') moveTvFocus(0, -1);
      else if (e.key === 'ArrowDown') moveTvFocus(0, 1);
      else if (e.key === 'ArrowLeft') moveTvFocus(-1, 0);
      else if (e.key === 'ArrowRight') moveTvFocus(1, 0);
      else if (e.key === 'Enter') dropAppTile();
      else if (e.key === 'Escape') {
        if (isTvControlCenterOpen) toggleControlCenter();
        else if (isTvMoveMode) toggleTvMoveMode();
      } else if (e.key.toLowerCase() === 'm') {
        toggleMute();
      }
    });
  }


  // ==========================================================================
  // 4. QUANTREBALANCE INSTITUTIONAL PORTFOLIO OPTIMIZER SIMULATOR
  // ==========================================================================
  const quantAssets = [
    { id: 'spy', name: 'US Equities (SPY)', expReturn: 0.105, vol: 0.162, weight: 30, color: '#38bdf8' },
    { id: 'qqq', name: 'Tech / Growth (QQQ)', expReturn: 0.138, vol: 0.215, weight: 25, color: '#818cf8' },
    { id: 'eem', name: 'Emerging Markets (EEM)', expReturn: 0.082, vol: 0.198, weight: 10, color: '#f59e0b' },
    { id: 'tlt', name: '20+ Yr US Treasuries (TLT)', expReturn: 0.045, vol: 0.135, weight: 20, color: '#10b981' },
    { id: 'gld', name: 'Physical Gold (GLD)', expReturn: 0.062, vol: 0.142, weight: 10, color: '#fbbf24' },
    { id: 'btc', name: 'Digital Store of Value (BTC)', expReturn: 0.280, vol: 0.580, weight: 5, color: '#a855f7' }
  ];

  // Correlation matrix approximation
  const corrMatrix = [
    [1.00, 0.88, 0.65, -0.25, 0.05, 0.35],
    [0.88, 1.00, 0.62, -0.22, 0.08, 0.42],
    [0.65, 0.62, 1.00, -0.15, 0.18, 0.28],
    [-0.25, -0.22, -0.15, 1.00, 0.32, -0.12],
    [0.05, 0.08, 0.18, 0.32, 1.00, 0.15],
    [0.35, 0.42, 0.28, -0.12, 0.15, 1.00]
  ];

  function calculateQuantMetrics() {
    let sumWeight = 0;
    quantAssets.forEach(a => sumWeight += a.weight);
    if (sumWeight === 0) sumWeight = 1;

    // Normalized weights
    const w = quantAssets.map(a => a.weight / sumWeight);

    // Portfolio Expected Return
    let portReturn = 0;
    for (let i = 0; i < quantAssets.length; i++) {
      portReturn += w[i] * quantAssets[i].expReturn;
    }

    // Portfolio Variance
    let portVar = 0;
    for (let i = 0; i < quantAssets.length; i++) {
      for (let j = 0; j < quantAssets.length; j++) {
        const cov = corrMatrix[i][j] * quantAssets[i].vol * quantAssets[j].vol;
        portVar += w[i] * w[j] * cov;
      }
    }
    const portVol = Math.sqrt(Math.max(0, portVar));

    // Sharpe Ratio (Rf = 4.5% US Treasury Bill rate)
    const rf = 0.045;
    const sharpe = portVol > 0 ? (portReturn - rf) / portVol : 0;

    // 95% Daily VaR (Parametric)
    const zScore = 1.645;
    const dailyVol = portVol / Math.sqrt(252);
    const dailyVaR = zScore * dailyVol * 100; // In %

    // Max Drawdown approximation
    const maxDd = portVol * 2.2 * 100;

    return {
      expReturn: (portReturn * 100).toFixed(2),
      vol: (portVol * 100).toFixed(2),
      sharpe: sharpe.toFixed(2),
      dailyVaR: dailyVaR.toFixed(2),
      maxDd: Math.min(65, maxDd).toFixed(1)
    };
  }

  function renderQuantUI() {
    const metrics = calculateQuantMetrics();

    document.getElementById('quant-metric-return').textContent = `${metrics.expReturn}%`;
    document.getElementById('quant-metric-vol').textContent = `${metrics.vol}%`;
    document.getElementById('quant-metric-sharpe').textContent = metrics.sharpe;
    document.getElementById('quant-metric-var').textContent = `-${metrics.dailyVaR}%`;

    quantAssets.forEach(a => {
      const valEl = document.getElementById(`val-${a.id}`);
      if (valEl) valEl.textContent = `${a.weight}%`;
    });

    renderQuantChart();
  }

  function renderQuantChart() {
    const canvas = document.getElementById('quant-donut-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    let sumWeight = 0;
    quantAssets.forEach(a => sumWeight += a.weight);
    if (sumWeight === 0) sumWeight = 1;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 25;
    const innerRadius = radius * 0.65;

    let startAngle = -Math.PI / 2;

    quantAssets.forEach(a => {
      const sliceAngle = (a.weight / sumWeight) * (Math.PI * 2);
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = a.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#07090e';
      ctx.stroke();

      startAngle = endAngle;
    });

    // Center text
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 1.25rem Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('100%', centerX, centerY - 8);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 0.75rem Inter, sans-serif';
    ctx.fillText('Optimized', centerX, centerY + 12);
  }

  function applyQuantStrategy(strat) {
    playAcousticTap();
    if (strat === 'risk-parity') {
      quantAssets[0].weight = 15; // SPY
      quantAssets[1].weight = 10; // QQQ
      quantAssets[2].weight = 10; // EEM
      quantAssets[3].weight = 40; // TLT
      quantAssets[4].weight = 20; // GLD
      quantAssets[5].weight = 5;  // BTC
    } else if (strat === 'max-sharpe') {
      quantAssets[0].weight = 35;
      quantAssets[1].weight = 30;
      quantAssets[2].weight = 10;
      quantAssets[3].weight = 10;
      quantAssets[4].weight = 5;
      quantAssets[5].weight = 10;
    } else if (strat === 'conservative') {
      quantAssets[0].weight = 20;
      quantAssets[1].weight = 5;
      quantAssets[2].weight = 5;
      quantAssets[3].weight = 50;
      quantAssets[4].weight = 20;
      quantAssets[5].weight = 0;
    } else if (strat === 'equal') {
      quantAssets.forEach(a => a.weight = 16);
      quantAssets[0].weight = 20; // balance to 100
    }

    quantAssets.forEach(a => {
      const slider = document.getElementById(`slider-${a.id}`);
      if (slider) slider.value = a.weight;
    });

    document.querySelectorAll('.strategy-chip').forEach(chip => {
      if (chip.getAttribute('data-strat') === strat) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    renderQuantUI();
  }

  function initQuantSimulator() {
    quantAssets.forEach(a => {
      const slider = document.getElementById(`slider-${a.id}`);
      if (slider) {
        slider.addEventListener('input', (e) => {
          a.weight = parseInt(e.target.value, 10);
          renderQuantUI();
        });
      }
    });

    document.querySelectorAll('.strategy-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        applyQuantStrategy(chip.getAttribute('data-strat'));
      });
    });

    window.addEventListener('resize', renderQuantChart);
    renderQuantUI();
  }


  // ==========================================================================
  // 5. MONITORIAN 2.0 DISPLAY SYSTEMS SIMULATOR
  // ==========================================================================
  const monitors = [
    { id: 1, name: 'LG 32" 4K IPS', vcp: '0x10', brightness: 75, contrast: 70, elementId: 'screen-mon-1' },
    { id: 2, name: 'Dell 27" Vertical QHD', vcp: '0x10', brightness: 60, contrast: 65, elementId: 'screen-mon-2' },
    { id: 3, name: 'ASUS 24" sRGB Reference', vcp: '0x10', brightness: 80, contrast: 75, elementId: 'screen-mon-3' }
  ];

  let isMonitorsBlackout = false;
  let isMonitorsSynced = false;
  let circadianTemp = 6500; // 6500K daylight down to 2700K night

  function updateMonitorVisuals() {
    monitors.forEach(mon => {
      const screenEl = document.getElementById(mon.elementId);
      const valEl = document.getElementById(`mon-val-${mon.id}`);
      if (valEl) valEl.textContent = `${mon.brightness}% (${Math.round(mon.brightness * 3.8)} nits)`;

      if (screenEl) {
        if (isMonitorsBlackout) {
          screenEl.style.filter = 'brightness(0%)';
        } else {
          // Calculate warmth tint from circadianTemp
          const warmthFactor = Math.max(0, (6500 - circadianTemp) / 3800); // 0 to 1
          const sepiaVal = (warmthFactor * 0.45).toFixed(2);
          const brightVal = (mon.brightness / 100).toFixed(2);
          const contVal = (mon.contrast / 100).toFixed(2);

          screenEl.style.filter = `brightness(${brightVal}) contrast(${contVal}) sepia(${sepiaVal})`;
        }
      }
    });

    const blackoutContainer = document.getElementById('monitor-array-container');
    if (blackoutContainer) {
      if (isMonitorsBlackout) {
        blackoutContainer.classList.add('blackout-active');
      } else {
        blackoutContainer.classList.remove('blackout-active');
      }
    }
  }

  function setMonitorBrightness(id, value) {
    const mon = monitors.find(m => m.id === id);
    if (!mon) return;

    if (isMonitorsSynced) {
      const delta = value - mon.brightness;
      monitors.forEach(m => {
        m.brightness = Math.max(0, Math.min(100, m.brightness + delta));
        const slider = document.getElementById(`mon-slider-${m.id}`);
        if (slider) slider.value = m.brightness;
      });
    } else {
      mon.brightness = value;
    }
    updateMonitorVisuals();
  }

  function toggleBlackout() {
    playAcousticTap();
    isMonitorsBlackout = !isMonitorsBlackout;
    const btn = document.getElementById('btn-blackout-toggle');
    if (btn) {
      if (isMonitorsBlackout) {
        btn.classList.add('active-action');
        btn.textContent = '☀️ Wake Monitors (Esc/Click)';
        appendCli('MONITORIAN: DDC/CI Power VCP 0xD6 -> State D3 (Standby 0 Nit)');
      } else {
        btn.classList.remove('active-action');
        btn.textContent = '🌙 Middle-Click Instant Blackout';
        appendCli('MONITORIAN: DDC/CI Power VCP 0xD6 -> State D0 (Active)');
      }
    }
    updateMonitorVisuals();
  }

  function toggleMonitorSync() {
    playAcousticTap();
    isMonitorsSynced = !isMonitorsSynced;
    const syncSwitch = document.getElementById('mon-sync-switch');
    if (syncSwitch) {
      if (isMonitorsSynced) {
        syncSwitch.classList.add('active');
        appendCli('MONITORIAN: Multi-Monitor Proportional Gang mode [ENABLED]');
      } else {
        syncSwitch.classList.remove('active');
        appendCli('MONITORIAN: Independent Display Control mode [ENABLED]');
      }
    }
  }

  function appendCli(text, type = 'info') {
    const history = document.getElementById('monitorian-cli-history');
    if (!history) return;

    const line = document.createElement('div');
    line.className = `cli-line ${type}`;
    line.textContent = `> ${text}`;
    history.appendChild(line);
    history.scrollTop = history.scrollHeight;
  }

  function handleCliCommand(cmd) {
    const cleanCmd = cmd.trim().toLowerCase();
    appendCli(cmd, 'info');

    if (cleanCmd === 'help') {
      appendCli('Available Commands:');
      appendCli('  status               - Dump DDC/CI VCP descriptors for all displays');
      appendCli('  set <id> <0-100>     - Set luminance for display ID (1, 2, 3)');
      appendCli('  blackout             - Instant standby 0-nit mode');
      appendCli('  wake                 - Wake displays from standby');
      appendCli('  sync <on|off>        - Toggle proportional display gang');
      appendCli('  circadian <temp>     - Set color temp (2700K - 6500K)');
      appendCli('  benchmark            - Run P/Invoke dxva2.dll bus latency test');
      appendCli('  clear                - Clear terminal console');
    } else if (cleanCmd === 'status') {
      appendCli('ENUMERATED 3 DDC/CI COMPLIANT MONITORS:');
      monitors.forEach(m => {
        appendCli(`  [Display ${m.id}] ${m.name} | VCP 0x10=${m.brightness}% | VCP 0x12=${m.contrast}% | Bus ACK 0.9ms`, 'success');
      });
    } else if (cleanCmd.startsWith('set ')) {
      const parts = cleanCmd.split(' ');
      const id = parseInt(parts[1], 10);
      const val = parseInt(parts[2], 10);
      if (!isNaN(id) && !isNaN(val) && val >= 0 && val <= 100) {
        setMonitorBrightness(id, val);
        const slider = document.getElementById(`mon-slider-${id}`);
        if (slider) slider.value = val;
        appendCli(`[VCP 0x10] Display ${id} luminance set to ${val}% (Write verified)`, 'success');
      } else {
        appendCli('Syntax error. Usage: set <id> <value 0-100>', 'warn');
      }
    } else if (cleanCmd === 'blackout') {
      if (!isMonitorsBlackout) toggleBlackout();
    } else if (cleanCmd === 'wake') {
      if (isMonitorsBlackout) toggleBlackout();
    } else if (cleanCmd === 'sync on') {
      if (!isMonitorsSynced) toggleMonitorSync();
    } else if (cleanCmd === 'sync off') {
      if (isMonitorsSynced) toggleMonitorSync();
    } else if (cleanCmd.startsWith('circadian ')) {
      const temp = parseInt(cleanCmd.split(' ')[1], 10);
      if (!isNaN(temp) && temp >= 2000 && temp <= 7000) {
        circadianTemp = temp;
        updateMonitorVisuals();
        appendCli(`Solar circadian temperature locked at ${temp}K`, 'success');
      } else {
        appendCli('Usage: circadian <2000-7000>', 'warn');
      }
    } else if (cleanCmd === 'benchmark') {
      appendCli('Running P/Invoke dxva2.dll High-Speed Bus Benchmark...', 'info');
      setTimeout(() => {
        appendCli('  I2C Write [0x37 -> 0x10]: 0.84ms (OK)', 'success');
        appendCli('  I2C Read  [0x37 <- 0x10]: 1.12ms (OK)', 'success');
        appendCli('  Mean Transaction Time: 0.98ms | 0 CRC retries | CPU < 0.15%', 'success');
      }, 300);
    } else if (cleanCmd === 'clear') {
      const history = document.getElementById('monitorian-cli-history');
      if (history) history.innerHTML = '';
      appendCli('Monitorian 2.0 DDC/CI Engine CLI [Ready]');
    } else {
      appendCli(`Unknown command "${cmd}". Type "help" for command list.`, 'warn');
    }
  }

  function initMonitorianSimulator() {
    monitors.forEach(mon => {
      const slider = document.getElementById(`mon-slider-${mon.id}`);
      if (slider) {
        slider.addEventListener('input', (e) => {
          setMonitorBrightness(mon.id, parseInt(e.target.value, 10));
        });
      }
    });

    document.getElementById('btn-blackout-toggle')?.addEventListener('click', toggleBlackout);
    document.getElementById('mon-sync-toggle-row')?.addEventListener('click', toggleMonitorSync);

    const circadianSlider = document.getElementById('slider-circadian');
    if (circadianSlider) {
      circadianSlider.addEventListener('input', (e) => {
        circadianTemp = parseInt(e.target.value, 10);
        document.getElementById('val-circadian').textContent = `${circadianTemp}K`;
        updateMonitorVisuals();
      });
    }

    const cliInput = document.getElementById('monitorian-cli-input');
    if (cliInput) {
      cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && cliInput.value.trim().length > 0) {
          handleCliCommand(cliInput.value);
          cliInput.value = '';
        }
      });
    }

    updateMonitorVisuals();
  }


  // ==========================================================================
  // 6. HARDWARE UART & SHA-1 CRYPTOGRAPHIC ACCELERATOR SIMULATOR
  // ==========================================================================
  let uartMessage = 'KSHITIJ_TPM_2026';
  let uartBaud = 115200;
  let uartParity = 'None';
  let uartScanPos = 0;
  let isWaveformAnimating = false;
  let fsmStateIndex = 0;

  const fsmStates = [
    'IDLE',
    'START_DETECT',
    'SAMPLE_MID',
    'DESERIALIZE',
    'PARITY_CHECK',
    'FIFO_WRITE',
    'DONE'
  ];

  // SHA-1 Implementation
  function sha1(message) {
    function rotateLeft(n, s) {
      return (n << s) | (n >>> (32 - s));
    }

    function toHex(val) {
      let str = '';
      for (let i = 7; i >= 0; i--) {
        const v = (val >>> (i * 4)) & 0x0f;
        str += v.toString(16);
      }
      return str;
    }

    // Convert string to utf-8 bytes
    const msgBytes = [];
    for (let i = 0; i < message.length; i++) {
      msgBytes.push(message.charCodeAt(i) & 0xff);
    }

    const msgBitLen = msgBytes.length * 8;

    // Padding: append 0x80, then 0x00 until len % 64 == 56, then 64-bit bitlen
    msgBytes.push(0x80);
    while ((msgBytes.length % 64) !== 56) {
      msgBytes.push(0);
    }

    // Append 64-bit big endian length
    for (let i = 7; i >= 0; i--) {
      msgBytes.push((msgBitLen >>> (i * 8)) & 0xff);
    }

    // Initial state registers
    let H0 = 0x67452301;
    let H1 = 0xefcdab89;
    let H2 = 0x98badcfe;
    let H3 = 0x10325476;
    let H4 = 0xc3d2e1f0;

    // Process each 512-bit (64-byte) chunk
    for (let chunkStart = 0; chunkStart < msgBytes.length; chunkStart += 64) {
      const W = new Array(80);

      for (let t = 0; t < 16; t++) {
        const idx = chunkStart + t * 4;
        W[t] = ((msgBytes[idx] << 24) |
                (msgBytes[idx + 1] << 16) |
                (msgBytes[idx + 2] << 8) |
                (msgBytes[idx + 3])) >>> 0;
      }

      for (let t = 16; t < 80; t++) {
        W[t] = rotateLeft(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1) >>> 0;
      }

      let A = H0;
      let B = H1;
      let C = H2;
      let D = H3;
      let E = H4;

      for (let t = 0; t < 80; t++) {
        let f, K;
        if (t < 20) {
          f = (B & C) | ((~B) & D);
          K = 0x5a827999;
        } else if (t < 40) {
          f = B ^ C ^ D;
          K = 0x6ed9eba1;
        } else if (t < 60) {
          f = (B & C) | (B & D) | (C & D);
          K = 0x8f1bbcdc;
        } else {
          f = B ^ C ^ D;
          K = 0xca62c1d6;
        }

        const temp = (rotateLeft(A, 5) + f + E + K + W[t]) >>> 0;
        E = D;
        D = C;
        C = rotateLeft(B, 30) >>> 0;
        B = A;
        A = temp;
      }

      H0 = (H0 + A) >>> 0;
      H1 = (H1 + B) >>> 0;
      H2 = (H2 + C) >>> 0;
      H3 = (H3 + D) >>> 0;
      H4 = (H4 + E) >>> 0;
    }

    return {
      H0: toHex(H0),
      H1: toHex(H1),
      H2: toHex(H2),
      H3: toHex(H3),
      H4: toHex(H4),
      fullDigest: toHex(H0) + toHex(H1) + toHex(H2) + toHex(H3) + toHex(H4)
    };
  }

  function getUartBitsForChar(char) {
    const code = char.charCodeAt(0) & 0xff;
    const bits = [0]; // START bit is 0

    // 8 data bits (LSB to MSB)
    let parityCount = 0;
    for (let i = 0; i < 8; i++) {
      const bit = (code >> i) & 1;
      bits.push(bit);
      if (bit === 1) parityCount++;
    }

    // Parity bit
    if (uartParity === 'Even') {
      bits.push(parityCount % 2 === 0 ? 0 : 1);
    } else if (uartParity === 'Odd') {
      bits.push(parityCount % 2 === 0 ? 1 : 0);
    }

    // STOP bit (always 1)
    bits.push(1);
    return bits;
  }

  function drawUartWaveform() {
    const canvas = document.getElementById('uart-waveform-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    // Get bits for first character
    const sampleChar = uartMessage.length > 0 ? uartMessage[0] : 'K';
    const bits = getUartBitsForChar(sampleChar);

    const marginX = 20;
    const plotWidth = width - marginX * 2;
    const bitWidth = plotWidth / (bits.length + 2);

    const highY = 30;
    const lowY = height - 40;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= bits.length + 2; i++) {
      const x = marginX + i * bitWidth;
      ctx.beginPath();
      ctx.moveTo(x, 15);
      ctx.lineTo(x, height - 20);
      ctx.stroke();
    }

    // Draw idle line before start
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(marginX, highY);
    ctx.lineTo(marginX + bitWidth, highY);

    let currX = marginX + bitWidth;
    let currLevel = 1;

    bits.forEach((bit, i) => {
      const nextLevel = bit;
      const nextX = currX + bitWidth;

      if (nextLevel !== currLevel) {
        ctx.lineTo(currX, nextLevel === 1 ? highY : lowY);
      }
      ctx.lineTo(nextX, nextLevel === 1 ? highY : lowY);

      currLevel = nextLevel;
      currX = nextX;
    });

    // Idle high after stop bit
    ctx.lineTo(currX + bitWidth, highY);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 0.72rem "JetBrains Mono", monospace';
    ctx.textAlign = 'center';

    let labelX = marginX + bitWidth * 1.5;
    ctx.fillText('START', labelX, height - 10);

    for (let i = 0; i < 8; i++) {
      labelX = marginX + (2.5 + i) * bitWidth;
      ctx.fillText(`D${i}`, labelX, height - 10);
    }

    if (uartParity !== 'None') {
      labelX += bitWidth;
      ctx.fillText('PAR', labelX, height - 10);
    }

    labelX += bitWidth;
    ctx.fillText('STOP', labelX, height - 10);

    // Timing markers
    ctx.fillStyle = '#38bdf8';
    ctx.font = '500 0.68rem Inter, sans-serif';
    ctx.textAlign = 'left';
    const bitTimeUs = (1000000 / uartBaud).toFixed(2);
    ctx.fillText(`Baud: ${uartBaud} bps | T_bit: ${bitTimeUs} μs | Sampling: 16x Oversampled`, marginX, 15);
  }

  function stepFsm() {
    playAcousticTap();
    fsmStateIndex = (fsmStateIndex + 1) % fsmStates.length;
    updateFsmUI();
  }

  function updateFsmUI() {
    const nodes = document.querySelectorAll('.fsm-node');
    nodes.forEach((node, idx) => {
      if (idx === fsmStateIndex) {
        node.classList.add('active-state');
      } else {
        node.classList.remove('active-state');
      }
    });

    const stateDesc = document.getElementById('fsm-state-desc');
    if (stateDesc) {
      const descMap = [
        'IDLE: RX line high, waiting for falling edge on start bit',
        'START_DETECT: Falling edge validated via 8 consecutive low clock ticks',
        'SAMPLE_MID: Center sampling counter triggered at 8x baud tick',
        'DESERIALIZE: 8-bit shift register actively loading LSB to MSB',
        'PARITY_CHECK: Hardware XOR parity generator verifies checksum',
        'FIFO_WRITE: Byte successfully loaded into 128-byte RX ring buffer',
        'DONE: Interrupt flag INT_RX raised to CPU / DMA controller'
      ];
      stateDesc.textContent = descMap[fsmStateIndex];
    }
  }

  function updateSha1() {
    const input = document.getElementById('uart-input-msg');
    if (input) {
      uartMessage = input.value || 'KSHITIJ_TPM_2026';
    }

    const digestObj = sha1(uartMessage);
    document.getElementById('sha-reg-a').textContent = `0x${digestObj.H0}`;
    document.getElementById('sha-reg-b').textContent = `0x${digestObj.H1}`;
    document.getElementById('sha-reg-c').textContent = `0x${digestObj.H2}`;
    document.getElementById('sha-reg-d').textContent = `0x${digestObj.H3}`;
    document.getElementById('sha-reg-e').textContent = `0x${digestObj.H4}`;

    const fullEl = document.getElementById('sha-full-digest');
    if (fullEl) {
      fullEl.textContent = digestObj.fullDigest;
    }

    drawUartWaveform();
  }

  function initUartSimulator() {
    const input = document.getElementById('uart-input-msg');
    if (input) {
      input.addEventListener('input', () => {
        updateSha1();
      });
    }

    const baudSelect = document.getElementById('uart-baud-select');
    if (baudSelect) {
      baudSelect.addEventListener('change', (e) => {
        uartBaud = parseInt(e.target.value, 10);
        drawUartWaveform();
      });
    }

    const paritySelect = document.getElementById('uart-parity-select');
    if (paritySelect) {
      paritySelect.addEventListener('change', (e) => {
        uartParity = e.target.value;
        drawUartWaveform();
      });
    }

    document.getElementById('btn-fsm-step')?.addEventListener('click', stepFsm);

    window.addEventListener('resize', drawUartWaveform);
    updateSha1();
    updateFsmUI();
  }


  // ==========================================================================
  // INITIALIZE EVERYTHING ON DOM READY
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initTvRemote();
    initQuantSimulator();
    initMonitorianSimulator();
    initUartSimulator();
    updateMuteUI();

    // Enable audio on first user touch / click anywhere
    window.addEventListener('click', () => {
      initAudio();
    }, { once: true });
  });

})();
