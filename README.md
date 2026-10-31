# DeskDeck Desktop V1 – Windows

Eigenständige Tauri-2-Desktop-App mit lokal simulierten Daten. Kein Backend, kein Internetzugriff und keine Geräteverbindung erforderlich. Das Projekt enthält **Quellcode**, noch keine fertig kompilierte `.exe`.

## Voraussetzungen auf Windows 11

- Node.js LTS (npm)
- Rust über rustup (MSVC-Toolchain)
- Microsoft C++ Build Tools / Visual Studio C++ Desktopentwicklung
- WebView2 Runtime (unter Windows 11 normalerweise vorhanden)

## Starten und testen

In PowerShell im Projektordner:

```powershell
npm install
npm run desktop:dev
```

## Windows-Installer erstellen

```powershell
npm run desktop:build
```

Der NSIS-Installer wird unter `src-tauri/target/release/bundle/nsis/` erzeugt. Die Windows-Buildwerkzeuge müssen auf dem PC installiert sein. Die Tauri-CLI lädt bei Bedarf Build-Abhängigkeiten nach.

## Bedienung

- Oben auf `DESKDECK` klicken und ziehen: Fenster verschieben
- `⌖`: Fenster im Vordergrund halten (an/aus)
- `−`: Minimieren; `×`: Beenden
- Links `⌂`: Home mit Gaming/Ambient und Statuskarten
- Links `☷`: Smart Home mit Lichtszene und Raffstore-Presets
- Unten `Teststatus`: simulierte Unraid-, Bambu- und Miele-Zustände ändern

## Noch nicht integriert

Keine Loxone-Steuerung, keine Bambu-MQTT-Anbindung, keine Miele-API, keine Unraid-Warnungen. Alle Aktionen ändern nur lokale Demo-Zustände. Die Werte sind Beispiele, keine Live-Daten. Die Schaltflächen `Auf`, `Beschatten`, `Zu` sind nur Presets in der Simulation.

## Hinweise

- Fenstergröße ist zunächst 680 × 252 Pixel, bewusst etwas größer als das physische 640 × 180 Long-Display, damit die Windows-Fenstersteuerung Platz hat.
- `npm run dev` startet alternativ nur die Browser-Vorschau; `npm run desktop:dev` startet die native Desktop-Hülle.
- Ohne installierte Windows-Rust-/C++-Toolchain kann keine Windows-EXE gebaut werden.
