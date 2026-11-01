# DeskDeck V2 – Windows Tray Popup

DeskDeck is a small Windows tray dashboard built with Tauri 2. All device data are **simulated**.

## Install/update via GitHub Desktop

1. Extract `DeskDeck-V2-GitHub.zip`.
2. Copy **the contents** of the extracted folder into your locally cloned `DeskDeck` repository. Merge/replace files when asked. Keep `.github` and `src-tauri` as directories.
3. In GitHub Desktop: **Commit to main** → **Push origin**.
4. Open GitHub → Actions → newest successful `Windows EXE erstellen` → Artifacts → `DeskDeck-Windows-Installer`.
5. Extract the artifact and install the new DeskDeck version. If V1 is running, close it before updating.

## Usage

- After starting DeskDeck from the Start menu, look for the DeskDeck icon in the Windows notification area (possibly under `^`).
- Left click the icon to show/hide the dashboard.
- Click outside the popup to hide it. The application stays running.
- To exit the process completely, use Task Manager for now. A tray right-click Quit menu is planned for a subsequent update.
- The popup is positioned above the bottom-right corner of the **primary monitor's work area**. Multi-monitor and vertical-taskbar refinements are future improvements.
- Buttons and status are demo-only and do not control actual hardware.

## SmartScreen / antivirus

Windows SmartScreen may warn about unsigned or low-reputation binaries. This build is **not code-signed**. A malware scan is not a substitute for code signing or reputation. Only install artifacts from your own GitHub Actions build. To reduce warnings in future, obtain a trusted code-signing certificate and securely configure signing in CI. Do not disable Windows security protections.

## Developer

`npm install` and `npm run desktop:dev` for local development; `npm run desktop:build` to build the NSIS installer. Requires Rust, Node.js and Windows C++ build tools.
