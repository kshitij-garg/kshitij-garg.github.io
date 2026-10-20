# Live Applications & Interactive Systems Hub

> **Unified Production Live Apps Hub:** [https://kshitij-garg.github.io/](https://kshitij-garg.github.io/)

A dedicated platform hosting client-side interactive web simulators, open-source utilities, and production systems engineered with the Web Audio API, Canvas, and modern Web APIs:

---

## 🚀 Live Applications & Simulators

| Application / Repository | Stack & Architecture | Production Demo Link |
| :--- | :--- | :--- |
| **[Sony BRAVIA 4K Apple TV Launcher](https://github.com/kshitij-garg/sony-bravia-vh2-debloater)** | Android TV, ADB Engine, Web Audio API acoustic taps, Move Mode | [Live TV Simulator](https://kshitij-garg.github.io/#tv) &bull; [Fullscreen App](https://kshitij-garg.github.io/tv-simulator/) |
| **[QuantRebalance Portfolio Engine](https://github.com/kshitij-garg/quant-rebalance)** | Multi-Asset Covariance Matrix, Risk Parity, Sharpe Ratio, 95% Daily VaR | [Live Rebalance Hub](https://kshitij-garg.github.io/#quant) &bull; [Production App](https://kshitij-garg.github.io/quant-rebalance/) |
| **[Monitorian 2.0 Display Systems](https://github.com/kshitij-garg/Monitorian-2.0)** | Win32 API, P/Invoke `dxva2.dll`, DDC/CI VCP Opcodes, Instant Blackout | [Live Display Simulator](https://kshitij-garg.github.io/#monitorian) &bull; [Fullscreen App](https://kshitij-garg.github.io/monitorian-simulator/) |
| **[Hardware UART & SHA-1 Accelerator](https://github.com/kshitij-garg/UART-Verilog)** | Synthesizable Verilog HDL, 16x Oversampling, 80-round SHA-1, 100MHz FPGA | [Live Hardware Waveform](https://kshitij-garg.github.io/#uart) &bull; [Fullscreen App](https://kshitij-garg.github.io/uart-simulator/) |

---

## ⚡ Features & Capabilities

1. **Sony BRAVIA 4K Apple TV Simulator:**
   - 16:9 widescreen TV interface with authentic Sony BRAVIA status bar.
   - Realistic tactile sound synthesis via **Web Audio API** (35ms pitch drop from 320Hz to 210Hz with exponential decay).
   - Interactive remote control (D-pad Up, Down, Left, Right, OK, Back, Home, Menu, Move Mode, Mute).
   - Real working in-app interfaces:
     - **YouTube TV** with 4K video cards
     - **TV Bro** simulated web browser with address bar and bookmarks
     - **Aptoide TV** store with interactive install/uninstall simulation
     - **Settings** with 4K HDR and eARC audio configs
     - **Spotify** music player overlay
   - **Move Mode** with tile jiggling (`@keyframes tileJiggle`) and real-time tile swap.
   - **Control Center** drawer with working sound mute toggle, dark wallpaper switcher, and RAM cleaner.

2. **QuantRebalance Institutional Portfolio Optimizer:**
   - Real-time multi-asset allocation sliders (SPY, QQQ, EEM, TLT, GLD, BTC).
   - Live recalculation of Expected Return, Volatility ($\sigma$), Sharpe Ratio, and 95% Daily Value-at-Risk (VaR).
   - Dynamic HTML5 Canvas asset donut chart.
   - Strategy presets: Risk Parity (Inverse Volatility), Max Sharpe, Wealth Preservation, and Equal Weight.

3. **Monitorian 2.0 Multi-Monitor Display Systems Simulator:**
   - 3 virtual hardware monitors (32" 4K IPS, 27" Vertical QHD, 24" sRGB Reference).
   - Real-time physical brightness & contrast simulation via dynamic CSS filters.
   - **Middle-Click Instant Blackout** (standby 0-nit mode).
   - **Proportional Gang Sync** across all displays.
   - **Circadian Day/Night Mode** with solar warmth temperature shifting (2700K to 6500K).
   - Embedded interactive **DDC/CI CLI Terminal** with simulated `dxva2.dll` I2C response packets.

4. **Hardware UART & SHA-1 Cryptographic Accelerator:**
   - Real-time digital oscilloscope rendering physical RS-232 bitstream timing waveforms.
   - Step-by-step Finite State Machine (FSM) tracker with clock stepping.
   - Live 80-round SHA-1 engine calculating 512-bit message padding, round-by-round state registers ($A, B, C, D, E$), and final 160-bit hex digest.

---

## 📄 License

- All code in this repository is distributed under the [MIT License](LICENSE).
