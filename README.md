# DeskDeck V2.1 – One Page Tray Edition

Einseitiges DeskDeck mit Windows-Tray-Popup (Linksklick auf Tray-Icon). Keine Navigation oder Unterseiten.

- Lichtszene: zwei große Schaltflächen Gaming / Ambient
- Rollladen: Hoch, Runter, Beschatten
- Schlafmodus: reine Statusanzeige (nicht anklickbar), in der Demo über Teststatus simulierbar
- Unraid-Status, Bambu Lab P2S und Miele mit simulierten Werten
- Alle Geräteaktionen sind weiterhin Demo, **keine Loxone-Verbindung**

## Installation über GitHub Desktop

1. ZIP entpacken. **Den Inhalt** des entpackten Ordners (einschließlich `.github`) in das lokale geklonte Repository `DeskDeck` kopieren. Bestehende Dateien überschreiben.
2. In GitHub Desktop `Commit to main` und `Push origin`.
3. In GitHub unter Actions den neuen Workflow abwarten und das Installer-Artifact herunterladen.
4. Installieren. Falls die alte App noch läuft: über den Task-Manager beenden, bevor der Installer gestartet wird.

Der Installer ist nicht codesigniert. Eine Windows-SmartScreen-Warnung ist weiterhin möglich.

## Entwicklung

`npm install` und `npm run desktop:dev`. Der Windows-Installer wird mit `npm run desktop:build` gebaut.
