/**
 * ==========================================================================
 * LIVE APPLICATIONS & INTERACTIVE SYSTEMS HUB
 * Core Application Engines & Client-Side Interactive Simulators
 * ==========================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. TACTILE AUDIO SYNTHESIZER (WEB AUDIO API)
  // ==========================================================================
  let audioCtx = null;
  let isSoundMuted = false;

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

  function playAcousticTap() {
    if (isSoundMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      const now = audioCtx.currentTime;

      // 35ms pitch drop: 320 Hz down to 210 Hz
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(210, now + 0.035);

      // Gain envelope: 0.12 down to 0.001
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.036);
    } catch (e) {
      // AudioContext not yet resumed by user gesture
    }
  }

  function toggleMute() {
    isSoundMuted = !isSoundMuted;
    updateMuteUI();
    if (!isSoundMuted) playAcousticTap();
  }

  function updateMuteUI() {
    const remoteMuteBtn = document.getElementById('remote-btn-mute');
    const ccSwitch = document.getElementById('cc-sound-switch');
    const ccLabel = document.getElementById('cc-sound-label');
    const tvSoundBadge = document.getElementById('tv-sound-badge');

    if (remoteMuteBtn) {
      if (isSoundMuted) {
        remoteMuteBtn.classList.add('muted');
        remoteMuteBtn.innerHTML = '🔇';
      } else {
        remoteMuteBtn.classList.remove('muted');
        remoteMuteBtn.innerHTML = '🔊';
      }
    }

    if (ccSwitch) {
      if (isSoundMuted) {
        ccSwitch.classList.remove('active');
        if (ccLabel) ccLabel.textContent = 'Navigation Sound: Muted';
      } else {
        ccSwitch.classList.add('active');
        if (ccLabel) ccLabel.textContent = 'Navigation Sound: Enabled';
      }
    }

    if (tvSoundBadge) {
      tvSoundBadge.textContent = isSoundMuted ? 'Muted' : 'Acoustic Tap';
      tvSoundBadge.style.color = isSoundMuted ? '#f43f5e' : '#00e5ff';
    }
  }


  // ==========================================================================
  // 2. APP SELECTOR NAVIGATION (TABS)
  // ==========================================================================
  function initAppSwitcher() {
    const appCards = document.querySelectorAll('.app-card-btn');
    const appPanels = document.querySelectorAll('.app-view-panel');

    function selectApp(appId) {
      appCards.forEach(card => {
        if (card.getAttribute('data-app') === appId) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });

      appPanels.forEach(panel => {
        if (panel.id === appId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      // Canvas re-renders for newly visible tab
      if (appId === 'panel-quant') {
        renderQuantChart();
      } else if (appId === 'panel-uart') {
        drawUartWaveform();
      }
    }

    appCards.forEach(card => {
      card.addEventListener('click', () => {
        playAcousticTap();
        const targetApp = card.getAttribute('data-app');
        selectApp(targetApp);
        history.replaceState(null, null, '#' + targetApp.replace('panel-', ''));
      });
    });

    // Check hash on load
    const hash = window.location.hash.replace('#', '');
    if (hash === 'quant' || hash === 'quant-rebalance') {
      selectApp('panel-quant');
    } else if (hash === 'monitorian' || hash === 'monitors') {
      selectApp('panel-monitorian');
    } else if (hash === 'uart' || hash === 'uart-sha1') {
      selectApp('panel-uart');
    } else {
      selectApp('panel-tv');
    }
  }


  // ==========================================================================
  // 3. SONY BRAVIA 4K APPLE TV LAUNCHER SIMULATOR
  // ==========================================================================
  const dockApps = [
    { id: 'youtube', name: 'YouTube', icon: '▶️', view: 'tv-view-youtube' },
    { id: 'netflix', name: 'Netflix', icon: '🎬', view: 'tv-view-youtube' },
    { id: 'prime', name: 'Prime Video', icon: '📦', view: 'tv-view-youtube' },
    { id: 'plex', name: 'Plex TV', icon: '⚡', view: 'tv-view-youtube' },
    { id: 'spotify', name: 'Spotify', icon: '🎵', view: 'tv-view-spotify' }
  ];

  const gridApps = [
    { id: 'tvbro', name: 'TV Bro', icon: '🌐', view: 'tv-view-tvbro' },
    { id: 'aptoide', name: 'Aptoide TV', icon: '📱', view: 'tv-view-aptoide' },
    { id: 'smarttube', name: 'SmartTube', icon: '📺', view: 'tv-view-youtube' },
    { id: 'settings', name: 'TV Settings', icon: '⚙️', view: 'tv-view-settings' },
    { id: 'twitch', name: 'Twitch', icon: '🎮', view: 'tv-view-youtube' },
    { id: 'kodi', name: 'Kodi Media', icon: '🍿', view: 'tv-view-youtube' },
    { id: 'debloat', name: 'Debloat Core', icon: '🛡️', view: 'tv-view-settings' }
  ];

  const wallpapers = [
    'radial-gradient(circle at 60% 20%, #1e1b4b 0%, #06080d 80%)',
    'radial-gradient(circle at 20% 40%, #022c22 0%, #06080d 80%)',
    'radial-gradient(circle at 70% 60%, #1e3a8a 0%, #06080d 80%)',
    'radial-gradient(circle at 40% 20%, #3b0764 0%, #06080d 80%)'
  ];

  let currentWallpaperIdx = 0;
  let activeTvFocus = 0; // 0-4 = dock, 5-11 = grid
  let isTvMoveMode = false;
  let isTvControlCenterOpen = false;

  function renderTvHomeScreen() {
    const dockContainer = document.getElementById('tv-dock-container');
    const gridContainer = document.getElementById('tv-grid-container');
    if (!dockContainer || !gridContainer) return;

    dockContainer.innerHTML = '';
    gridContainer.innerHTML = '';

    // Render Dock (Indices 0 to 4)
    dockApps.forEach((app, idx) => {
      const tile = document.createElement('div');
      tile.className = 'tv-tile';
      if (idx === activeTvFocus) {
        tile.classList.add('focused');
        if (isTvMoveMode) tile.classList.add('moving');
      }

      tile.innerHTML = `
        <div class="tv-tile-icon">${app.icon}</div>
        <div class="tv-tile-name">${app.name}</div>
      `;

      tile.addEventListener('click', () => {
        playAcousticTap();
        activeTvFocus = idx;
        renderTvHomeScreen();
        launchTvApp(app);
      });

      dockContainer.appendChild(tile);
    });

    // Render Grid (Indices 5 to 5 + gridApps.length - 1)
    gridApps.forEach((app, idx) => {
      const globalIdx = dockApps.length + idx;
      const tile = document.createElement('div');
      tile.className = 'tv-tile';
      if (globalIdx === activeTvFocus) {
        tile.classList.add('focused');
        if (isTvMoveMode) tile.classList.add('moving');
      }

      tile.innerHTML = `
        <div class="tv-tile-icon">${app.icon}</div>
        <div class="tv-tile-name">${app.name}</div>
      `;

      tile.addEventListener('click', () => {
        playAcousticTap();
        activeTvFocus = globalIdx;
        renderTvHomeScreen();
        launchTvApp(app);
      });

      gridContainer.appendChild(tile);
    });
  }

  function launchTvApp(app) {
    if (isTvMoveMode) {
      toggleTvMoveMode();
      return;
    }

    playAcousticTap();
    const targetViewId = app.view || 'tv-view-youtube';
    switchTvView(targetViewId);
  }

  function switchTvView(viewId) {
    document.querySelectorAll('.tv-view').forEach(view => {
      if (view.id === viewId) {
        view.classList.add('active-view');
      } else {
        view.classList.remove('active-view');
      }
    });

    // If returning home
    if (viewId === 'tv-view-home') {
      renderTvHomeScreen();
    }
  }

  function moveTvFocus(deltaCol, deltaRow) {
    playAcousticTap();
    const totalApps = dockApps.length + gridApps.length;
    let oldIndex = activeTvFocus;
    let newIndex = activeTvFocus + deltaCol;

    if (deltaRow > 0 && activeTvFocus < dockApps.length) {
      newIndex = dockApps.length + Math.min(activeTvFocus, gridApps.length - 1);
    } else if (deltaRow < 0 && activeTvFocus >= dockApps.length) {
      newIndex = Math.min(activeTvFocus - dockApps.length, dockApps.length - 1);
    }

    if (newIndex < 0) newIndex = 0;
    if (newIndex >= totalApps) newIndex = totalApps - 1;

    // Swap in move mode
    if (isTvMoveMode && newIndex !== oldIndex) {
      if (oldIndex < dockApps.length && newIndex < dockApps.length) {
        const tmp = dockApps[oldIndex];
        dockApps[oldIndex] = dockApps[newIndex];
        dockApps[newIndex] = tmp;
      } else if (oldIndex >= dockApps.length && newIndex >= dockApps.length) {
        const gOld = oldIndex - dockApps.length;
        const gNew = newIndex - dockApps.length;
        const tmp = gridApps[gOld];
        gridApps[gOld] = gridApps[gNew];
        gridApps[gNew] = tmp;
      }
    }

    activeTvFocus = newIndex;
    renderTvHomeScreen();
  }

  function toggleTvMoveMode() {
    isTvMoveMode = !isTvMoveMode;
    playAcousticTap();
    const moveBtn = document.getElementById('remote-btn-move');
    if (moveBtn) {
      if (isTvMoveMode) {
        moveBtn.classList.add('active');
        showTvToast('Move Mode: Use D-Pad to move tile, press OK to drop');
      } else {
        moveBtn.classList.remove('active');
        showTvToast('App position saved');
      }
    }
    renderTvHomeScreen();
  }

  function toggleControlCenter() {
    isTvControlCenterOpen = !isTvControlCenterOpen;
    playAcousticTap();
    const cc = document.getElementById('tv-cc-drawer');
    if (cc) {
      if (isTvControlCenterOpen) {
        cc.classList.add('open');
      } else {
        cc.classList.remove('open');
      }
    }
  }

  function cycleTvWallpaper() {
    playAcousticTap();
    currentWallpaperIdx = (currentWallpaperIdx + 1) % wallpapers.length;
    const screen = document.getElementById('tv-screen-box');
    if (screen) {
      screen.style.background = wallpapers[currentWallpaperIdx];
    }
    showTvToast(`Switched to Ambient Dark Gradient #${currentWallpaperIdx + 1}`);
  }

  function runRamCleaner() {
    playAcousticTap();
    const ramNum = document.getElementById('cc-ram-num');
    if (ramNum) {
      ramNum.textContent = 'Cleaning...';
      setTimeout(() => {
        ramNum.textContent = '18 MB (402 MB Freed)';
        showTvToast('RAM Cleaned: 95.7% Memory Restored');
      }, 400);
    }
  }

  function showTvToast(msg) {
    const toast = document.getElementById('tv-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 2500);
  }

  function initTvSimulator() {
    renderTvHomeScreen();

    // D-Pad Remote buttons
    document.getElementById('wheel-up')?.addEventListener('click', () => moveTvFocus(0, -1));
    document.getElementById('wheel-down')?.addEventListener('click', () => moveTvFocus(0, 1));
    document.getElementById('wheel-left')?.addEventListener('click', () => moveTvFocus(-1, 0));
    document.getElementById('wheel-right')?.addEventListener('click', () => moveTvFocus(1, 0));
    document.getElementById('wheel-center')?.addEventListener('click', () => {
      playAcousticTap();
      if (isTvMoveMode) {
        toggleTvMoveMode();
      } else {
        const totalDock = dockApps.length;
        const app = activeTvFocus < totalDock ? dockApps[activeTvFocus] : gridApps[activeTvFocus - totalDock];
        if (app) launchTvApp(app);
      }
    });

    // Remote actions
    document.getElementById('remote-btn-home')?.addEventListener('click', () => {
      playAcousticTap();
      switchTvView('tv-view-home');
      if (isTvControlCenterOpen) toggleControlCenter();
    });

    document.getElementById('remote-btn-back')?.addEventListener('click', () => {
      playAcousticTap();
      if (isTvControlCenterOpen) {
        toggleControlCenter();
      } else {
        switchTvView('tv-view-home');
      }
    });

    document.getElementById('remote-btn-menu')?.addEventListener('click', toggleControlCenter);
    document.getElementById('remote-btn-move')?.addEventListener('click', toggleTvMoveMode);
    document.getElementById('remote-btn-mute')?.addEventListener('click', toggleMute);

    // CC actions
    document.getElementById('cc-sound-toggle')?.addEventListener('click', toggleMute);
    document.getElementById('cc-close-btn')?.addEventListener('click', toggleControlCenter);
    document.getElementById('cc-btn-wallpaper')?.addEventListener('click', cycleTvWallpaper);
    document.getElementById('cc-btn-ram')?.addEventListener('click', runRamCleaner);

    // Inside-app Back Buttons
    document.querySelectorAll('.sim-back-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playAcousticTap();
        switchTvView('tv-view-home');
      });
    });

    // Aptoide Install buttons simulation
    document.querySelectorAll('.install-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        playAcousticTap();
        const b = e.target;
        if (b.classList.contains('installed')) {
          b.textContent = 'Install';
          b.classList.remove('installed');
          showTvToast('App Uninstalled');
        } else {
          b.textContent = 'Installing...';
          setTimeout(() => {
            b.textContent = 'Installed';
            b.classList.add('installed');
            showTvToast('App Installed via ADB APK Engine');
          }, 600);
        }
      });
    });

    // Keyboard TV controls
    window.addEventListener('keydown', (e) => {
      const activePanel = document.querySelector('.app-view-panel.active');
      if (!activePanel || activePanel.id !== 'panel-tv') return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowUp') moveTvFocus(0, -1);
      else if (e.key === 'ArrowDown') moveTvFocus(0, 1);
      else if (e.key === 'ArrowLeft') moveTvFocus(-1, 0);
      else if (e.key === 'ArrowRight') moveTvFocus(1, 0);
      else if (e.key === 'Enter') {
        const totalDock = dockApps.length;
        const app = activeTvFocus < totalDock ? dockApps[activeTvFocus] : gridApps[activeTvFocus - totalDock];
        if (app) launchTvApp(app);
      } else if (e.key === 'Escape') {
        if (isTvControlCenterOpen) toggleControlCenter();
        else switchTvView('tv-view-home');
      } else if (e.key.toLowerCase() === 'm') {
        toggleMute();
      }
    });
  }


  // ==========================================================================
  // 4. QUANTREBALANCE PORTFOLIO REBALANCER SIMULATOR
  // ==========================================================================
  const quantAssets = [
    { id: 'spy', name: 'US Equities (SPY)', expReturn: 0.105, vol: 0.162, weight: 30, color: '#00e5ff' },
    { id: 'qqq', name: 'Tech / Growth (QQQ)', expReturn: 0.138, vol: 0.215, weight: 25, color: '#6366f1' },
    { id: 'eem', name: 'Emerging Markets (EEM)', expReturn: 0.082, vol: 0.198, weight: 10, color: '#f59e0b' },
    { id: 'tlt', name: '20+ Yr US Treasuries (TLT)', expReturn: 0.045, vol: 0.135, weight: 20, color: '#10b981' },
    { id: 'gld', name: 'Physical Gold (GLD)', expReturn: 0.062, vol: 0.142, weight: 10, color: '#fbbf24' },
    { id: 'btc', name: 'Digital Store of Value (BTC)', expReturn: 0.280, vol: 0.580, weight: 5, color: '#a855f7' }
  ];

  const corrMatrix = [
    [1.00, 0.88, 0.65, -0.25, 0.05, 0.35],
    [0.88, 1.00, 0.62, -0.22, 0.08, 0.42],
    [0.65, 0.62, 1.00, -0.15, 0.18, 0.28],
    [-0.25, -0.22, -0.15, 1.00, 0.32, -0.12],
    [0.05, 0.08, 0.18, 0.32, 1.00, 0.15],
    [0.35, 0.42, 0.28, -0.12, 0.15, 1.00]
  ];

  function calculateQuant() {
    let sumW = 0;
    quantAssets.forEach(a => sumW += a.weight);
    if (sumW === 0) sumW = 1;

    const w = quantAssets.map(a => a.weight / sumW);

    let portReturn = 0;
    for (let i = 0; i < quantAssets.length; i++) {
      portReturn += w[i] * quantAssets[i].expReturn;
    }

    let portVar = 0;
    for (let i = 0; i < quantAssets.length; i++) {
      for (let j = 0; j < quantAssets.length; j++) {
        portVar += w[i] * w[j] * (corrMatrix[i][j] * quantAssets[i].vol * quantAssets[j].vol);
      }
    }
    const portVol = Math.sqrt(Math.max(0, portVar));
    const rf = 0.045;
    const sharpe = portVol > 0 ? (portReturn - rf) / portVol : 0;
    const dailyVaR = 1.645 * (portVol / Math.sqrt(252)) * 100;

    return {
      expReturn: (portReturn * 100).toFixed(2),
      vol: (portVol * 100).toFixed(2),
      sharpe: sharpe.toFixed(2),
      dailyVaR: dailyVaR.toFixed(2)
    };
  }

  function renderQuantUI() {
    const res = calculateQuant();
    const retEl = document.getElementById('quant-metric-return');
    const volEl = document.getElementById('quant-metric-vol');
    const shpEl = document.getElementById('quant-metric-sharpe');
    const varEl = document.getElementById('quant-metric-var');

    if (retEl) retEl.textContent = `${res.expReturn}%`;
    if (volEl) volEl.textContent = `${res.vol}%`;
    if (shpEl) shpEl.textContent = res.sharpe;
    if (varEl) varEl.textContent = `-${res.dailyVaR}%`;

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

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    let sumW = 0;
    quantAssets.forEach(a => sumW += a.weight);
    if (sumW === 0) sumW = 1;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const innerRadius = radius * 0.65;

    let startAngle = -Math.PI / 2;

    quantAssets.forEach(a => {
      const sliceAngle = (a.weight / sumW) * (Math.PI * 2);
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = a.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#06080d';
      ctx.stroke();

      startAngle = endAngle;
    });

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 1.2rem Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('100%', centerX, centerY - 6);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 0.72rem Inter, sans-serif';
    ctx.fillText('Optimized', centerX, centerY + 14);
  }

  function applyPreset(preset) {
    playAcousticTap();
    if (preset === 'risk-parity') {
      quantAssets[0].weight = 15;
      quantAssets[1].weight = 10;
      quantAssets[2].weight = 10;
      quantAssets[3].weight = 40;
      quantAssets[4].weight = 20;
      quantAssets[5].weight = 5;
    } else if (preset === 'max-sharpe') {
      quantAssets[0].weight = 35;
      quantAssets[1].weight = 30;
      quantAssets[2].weight = 10;
      quantAssets[3].weight = 10;
      quantAssets[4].weight = 5;
      quantAssets[5].weight = 10;
    } else if (preset === 'conservative') {
      quantAssets[0].weight = 20;
      quantAssets[1].weight = 5;
      quantAssets[2].weight = 5;
      quantAssets[3].weight = 50;
      quantAssets[4].weight = 20;
      quantAssets[5].weight = 0;
    } else if (preset === 'equal') {
      quantAssets.forEach(a => a.weight = 16);
      quantAssets[0].weight = 20;
    }

    quantAssets.forEach(a => {
      const slider = document.getElementById(`slider-${a.id}`);
      if (slider) slider.value = a.weight;
    });

    document.querySelectorAll('.preset-chip').forEach(c => {
      if (c.getAttribute('data-preset') === preset) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });

    renderQuantUI();
  }

  function initQuant() {
    quantAssets.forEach(a => {
      const slider = document.getElementById(`slider-${a.id}`);
      if (slider) {
        slider.addEventListener('input', (e) => {
          a.weight = parseInt(e.target.value, 10);
          renderQuantUI();
        });
      }
    });

    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        applyPreset(chip.getAttribute('data-preset'));
      });
    });

    window.addEventListener('resize', renderQuantChart);
    renderQuantUI();
  }


  // ==========================================================================
  // 5. MONITORIAN 2.0 DISPLAY SYSTEMS SIMULATOR
  // ==========================================================================
  const monitors = [
    { id: 1, name: 'LG 32" 4K UHD', brightness: 75, contrast: 70, screenId: 'mon-screen-1' },
    { id: 2, name: 'Dell 27" Vertical QHD', brightness: 60, contrast: 65, screenId: 'mon-screen-2' },
    { id: 3, name: 'ASUS 24" sRGB Reference', brightness: 80, contrast: 75, screenId: 'mon-screen-3' }
  ];

  let isBlackout = false;
  let isGangSync = false;
  let circadianK = 6500;

  function updateMonitors() {
    monitors.forEach(m => {
      const screen = document.getElementById(m.screenId);
      const valEl = document.getElementById(`mon-val-${m.id}`);
      if (valEl) valEl.textContent = `${m.brightness}% (${Math.round(m.brightness * 3.8)} nits)`;

      if (screen) {
        if (isBlackout) {
          screen.style.filter = 'brightness(0%)';
        } else {
          const warmth = Math.max(0, (6500 - circadianK) / 3800);
          const sepia = (warmth * 0.45).toFixed(2);
          screen.style.filter = `brightness(${(m.brightness / 100).toFixed(2)}) contrast(${(m.contrast / 100).toFixed(2)}) sepia(${sepia})`;
        }
      }
    });

    const blackoutContainer = document.getElementById('monitors-visual-container');
    if (blackoutContainer) {
      if (isBlackout) {
        blackoutContainer.style.boxShadow = 'inset 0 0 50px rgba(0, 0, 0, 0.95)';
      } else {
        blackoutContainer.style.boxShadow = '';
      }
    }
  }

  function setMonitorBrightness(id, val) {
    const mon = monitors.find(m => m.id === id);
    if (!mon) return;

    if (isGangSync) {
      const delta = val - mon.brightness;
      monitors.forEach(m => {
        m.brightness = Math.max(0, Math.min(100, m.brightness + delta));
        const slider = document.getElementById(`mon-slider-${m.id}`);
        if (slider) slider.value = m.brightness;
      });
    } else {
      mon.brightness = val;
    }
    updateMonitors();
  }

  function toggleBlackout() {
    playAcousticTap();
    isBlackout = !isBlackout;
    const btn = document.getElementById('btn-blackout');
    if (btn) {
      if (isBlackout) {
        btn.classList.add('active');
        btn.textContent = '☀️ Wake Displays (Click/Key)';
        appendTerm('DDC/CI Power VCP 0xD6 -> 0x04 (Standby 0 Nit)');
      } else {
        btn.classList.remove('active');
        btn.textContent = '🌙 Middle-Click Instant Blackout';
        appendTerm('DDC/CI Power VCP 0xD6 -> 0x01 (Active State)');
      }
    }
    updateMonitors();
  }

  function toggleGangSync() {
    playAcousticTap();
    isGangSync = !isGangSync;
    const sw = document.getElementById('mon-sync-switch');
    if (sw) {
      if (isGangSync) {
        sw.classList.add('active');
        appendTerm('Multi-Monitor Proportional Gang Sync [ENABLED]');
      } else {
        sw.classList.remove('active');
        appendTerm('Independent Display Mode [ACTIVE]');
      }
    }
  }

  function appendTerm(msg) {
    const history = document.getElementById('term-scroll-box');
    if (!history) return;
    const line = document.createElement('div');
    line.style.lineHeight = '1.4';
    line.style.color = msg.includes('ERROR') ? '#f43f5e' : (msg.includes('ENABLED') || msg.includes('OK') ? '#10b981' : '#00e5ff');
    line.textContent = `> ${msg}`;
    history.appendChild(line);
    history.scrollTop = history.scrollHeight;
  }

  function handleTermCmd(cmd) {
    const clean = cmd.trim().toLowerCase();
    appendTerm(cmd);

    if (clean === 'help') {
      appendTerm('Commands: status, set <1|2|3> <0-100>, blackout, wake, sync on, sync off, benchmark, clear');
    } else if (clean === 'status') {
      monitors.forEach(m => {
        appendTerm(`[Display ${m.id}] ${m.name}: VCP 0x10=${m.brightness}% | Bus ACK 0.8ms (OK)`);
      });
    } else if (clean.startsWith('set ')) {
      const parts = clean.split(' ');
      const id = parseInt(parts[1], 10);
      const val = parseInt(parts[2], 10);
      if (!isNaN(id) && !isNaN(val) && val >= 0 && val <= 100) {
        setMonitorBrightness(id, val);
        const slider = document.getElementById(`mon-slider-${id}`);
        if (slider) slider.value = val;
        appendTerm(`[VCP 0x10] Set Display ${id} to ${val}% (OK)`);
      } else {
        appendTerm('Usage: set <1|2|3> <0-100>');
      }
    } else if (clean === 'blackout') {
      if (!isBlackout) toggleBlackout();
    } else if (clean === 'wake') {
      if (isBlackout) toggleBlackout();
    } else if (clean === 'sync on') {
      if (!isGangSync) toggleGangSync();
    } else if (clean === 'sync off') {
      if (isGangSync) toggleGangSync();
    } else if (clean === 'benchmark') {
      appendTerm('Benchmarking P/Invoke dxva2.dll bus latency...');
      setTimeout(() => {
        appendTerm('Display 1 I2C Write: 0.82ms | Read: 1.05ms (OK)');
        appendTerm('Display 2 I2C Write: 0.91ms | Read: 1.12ms (OK)');
        appendTerm('Display 3 I2C Write: 0.79ms | Read: 0.98ms (OK)');
      }, 250);
    } else if (clean === 'clear') {
      const h = document.getElementById('term-scroll-box');
      if (h) h.innerHTML = '';
      appendTerm('Monitorian 2.0 DDC/CI Engine [Ready]');
    } else {
      appendTerm(`Unknown command "${cmd}". Type "help"`);
    }
  }

  function initMonitorian() {
    monitors.forEach(m => {
      const slider = document.getElementById(`mon-slider-${m.id}`);
      if (slider) {
        slider.addEventListener('input', (e) => {
          setMonitorBrightness(m.id, parseInt(e.target.value, 10));
        });
      }
    });

    document.getElementById('btn-blackout')?.addEventListener('click', toggleBlackout);
    document.getElementById('mon-sync-row')?.addEventListener('click', toggleGangSync);

    const circSlider = document.getElementById('slider-circadian');
    if (circSlider) {
      circSlider.addEventListener('input', (e) => {
        circadianK = parseInt(e.target.value, 10);
        const valEl = document.getElementById('val-circadian');
        if (valEl) valEl.textContent = `${circadianK}K`;
        updateMonitors();
      });
    }

    const termInput = document.getElementById('term-input');
    if (termInput) {
      termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && termInput.value.trim().length > 0) {
          handleTermCmd(termInput.value);
          termInput.value = '';
        }
      });
    }

    updateMonitors();
  }


  // ==========================================================================
  // 6. HARDWARE UART & SHA-1 CRYPTOGRAPHIC ENGINE
  // ==========================================================================
  let uartPayload = 'KSHITIJ_TPM_2026';
  let uartBaud = 115200;
  let uartParity = 'None';
  let fsmState = 0;

  const fsmSteps = ['IDLE', 'START_DETECT', 'SAMPLE_MID', 'DESERIALIZE', 'PARITY_CHECK', 'FIFO_WRITE', 'DONE'];

  function sha1(msg) {
    function rotl(n, s) { return (n << s) | (n >>> (32 - s)); }
    function hex(v) {
      let s = '';
      for (let i = 7; i >= 0; i--) s += ((v >>> (i * 4)) & 0x0f).toString(16);
      return s;
    }

    const bytes = [];
    for (let i = 0; i < msg.length; i++) bytes.push(msg.charCodeAt(i) & 0xff);
    const bitLen = bytes.length * 8;

    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) bytes.push(0);

    for (let i = 7; i >= 0; i--) bytes.push((bitLen >>> (i * 8)) & 0xff);

    let H0 = 0x67452301, H1 = 0xefcdab89, H2 = 0x98badcfe, H3 = 0x10325476, H4 = 0xc3d2e1f0;

    for (let chunk = 0; chunk < bytes.length; chunk += 64) {
      const W = new Array(80);
      for (let t = 0; t < 16; t++) {
        const idx = chunk + t * 4;
        W[t] = ((bytes[idx] << 24) | (bytes[idx + 1] << 16) | (bytes[idx + 2] << 8) | bytes[idx + 3]) >>> 0;
      }
      for (let t = 16; t < 80; t++) {
        W[t] = rotl(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1) >>> 0;
      }

      let A = H0, B = H1, C = H2, D = H3, E = H4;
      for (let t = 0; t < 80; t++) {
        let f, K;
        if (t < 20) { f = (B & C) | ((~B) & D); K = 0x5a827999; }
        else if (t < 40) { f = B ^ C ^ D; K = 0x6ed9eba1; }
        else if (t < 60) { f = (B & C) | (B & D) | (C & D); K = 0x8f1bbcdc; }
        else { f = B ^ C ^ D; K = 0xca62c1d6; }

        const temp = (rotl(A, 5) + f + E + K + W[t]) >>> 0;
        E = D; D = C; C = rotl(B, 30) >>> 0; B = A; A = temp;
      }

      H0 = (H0 + A) >>> 0;
      H1 = (H1 + B) >>> 0;
      H2 = (H2 + C) >>> 0;
      H3 = (H3 + D) >>> 0;
      H4 = (H4 + E) >>> 0;
    }

    return {
      A: hex(H0), B: hex(H1), C: hex(H2), D: hex(H3), E: hex(H4),
      full: hex(H0) + hex(H1) + hex(H2) + hex(H3) + hex(H4)
    };
  }

  function getUartBits(char) {
    const code = char.charCodeAt(0) & 0xff;
    const bits = [0]; // START bit
    let parity = 0;
    for (let i = 0; i < 8; i++) {
      const b = (code >> i) & 1;
      bits.push(b);
      if (b === 1) parity++;
    }
    if (uartParity === 'Even') bits.push(parity % 2 === 0 ? 0 : 1);
    else if (uartParity === 'Odd') bits.push(parity % 2 === 0 ? 1 : 0);
    bits.push(1); // STOP bit
    return bits;
  }

  function drawUartWaveform() {
    const canvas = document.getElementById('uart-canvas');
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

    const sampleChar = uartPayload.length > 0 ? uartPayload[0] : 'K';
    const bits = getUartBits(sampleChar);

    const marginX = 20;
    const plotW = width - marginX * 2;
    const bitW = plotW / (bits.length + 2);
    const highY = 25;
    const lowY = height - 35;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= bits.length + 2; i++) {
      const x = marginX + i * bitW;
      ctx.beginPath();
      ctx.moveTo(x, 15);
      ctx.lineTo(x, height - 15);
      ctx.stroke();
    }

    // Idle high before
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(marginX, highY);
    ctx.lineTo(marginX + bitW, highY);

    let currX = marginX + bitW;
    let currLevel = 1;

    bits.forEach(bit => {
      const nextX = currX + bitW;
      if (bit !== currLevel) {
        ctx.lineTo(currX, bit === 1 ? highY : lowY);
      }
      ctx.lineTo(nextX, bit === 1 ? highY : lowY);
      currLevel = bit;
      currX = nextX;
    });

    ctx.lineTo(currX + bitW, highY);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 0.7rem "JetBrains Mono", monospace';
    ctx.textAlign = 'center';

    let lblX = marginX + bitW * 1.5;
    ctx.fillText('START', lblX, height - 8);

    for (let i = 0; i < 8; i++) {
      lblX = marginX + (2.5 + i) * bitW;
      ctx.fillText(`D${i}`, lblX, height - 8);
    }

    if (uartParity !== 'None') {
      lblX += bitW;
      ctx.fillText('PAR', lblX, height - 8);
    }

    lblX += bitW;
    ctx.fillText('STOP', lblX, height - 8);
  }

  function stepFsm() {
    playAcousticTap();
    fsmState = (fsmState + 1) % fsmSteps.length;
    updateFsmUI();
  }

  function updateFsmUI() {
    const pills = document.querySelectorAll('.fsm-step-pill');
    pills.forEach((p, idx) => {
      if (idx === fsmState) p.classList.add('active');
      else p.classList.remove('active');
    });

    const desc = document.getElementById('fsm-desc');
    if (desc) {
      const textMap = [
        'IDLE: RX pin high (1), awaiting start bit falling edge (0)',
        'START_DETECT: Validated 8x consecutive low clock samples',
        'SAMPLE_MID: Center sampling triggered at middle of bit cell',
        'DESERIALIZE: 8-bit shift register actively latching LSB to MSB',
        'PARITY_CHECK: XOR parity generator verifying data integrity',
        'FIFO_WRITE: Byte successfully pushed to 128-byte hardware FIFO',
        'DONE: Interrupt INT_RX triggered to system bus'
      ];
      desc.textContent = textMap[fsmState];
    }
  }

  function updateSha1Engine() {
    const input = document.getElementById('uart-text-input');
    if (input) uartPayload = input.value || 'KSHITIJ_TPM_2026';

    const d = sha1(uartPayload);
    const regA = document.getElementById('sha-reg-a');
    const regB = document.getElementById('sha-reg-b');
    const regC = document.getElementById('sha-reg-c');
    const regD = document.getElementById('sha-reg-d');
    const regE = document.getElementById('sha-reg-e');
    const full = document.getElementById('sha-digest-hex');

    if (regA) regA.textContent = `0x${d.A}`;
    if (regB) regB.textContent = `0x${d.B}`;
    if (regC) regC.textContent = `0x${d.C}`;
    if (regD) regD.textContent = `0x${d.D}`;
    if (regE) regE.textContent = `0x${d.E}`;
    if (full) full.textContent = d.full;

    drawUartWaveform();
  }

  function initUart() {
    const input = document.getElementById('uart-text-input');
    if (input) input.addEventListener('input', updateSha1Engine);

    const bSelect = document.getElementById('uart-baud');
    if (bSelect) {
      bSelect.addEventListener('change', (e) => {
        uartBaud = parseInt(e.target.value, 10);
        drawUartWaveform();
      });
    }

    const pSelect = document.getElementById('uart-parity');
    if (pSelect) {
      pSelect.addEventListener('change', (e) => {
        uartParity = e.target.value;
        drawUartWaveform();
      });
    }

    document.getElementById('btn-fsm-step')?.addEventListener('click', stepFsm);

    window.addEventListener('resize', drawUartWaveform);
    updateSha1Engine();
    updateFsmUI();
  }


  // ==========================================================================
  // INITIALIZE ON LOAD
  // ==========================================================================
  function onReady() {
    initAppSwitcher();
    initTvSimulator();
    initQuant();
    initMonitorian();
    initUart();
    updateMuteUI();

    window.addEventListener('click', () => {
      initAudio();
    }, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

})();
