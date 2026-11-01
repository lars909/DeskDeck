# DeskDeck V3 – Loxone Live (Beta)

Ausgangspunkt: DeskDeck V2.1. Tray bleibt erhalten, Layout bleibt einseitig. Gaming-ID **3**, Ambient-ID **99**.

## Installation
ZIP entpacken, den **Inhalt** in das lokale GitHub-Repository kopieren, Commit und Push. GitHub Actions baut den Windows-Installer.

## Einrichtung
1. Zahnrad öffnen, HTTPS-Miniserver-Adresse, Benutzername und Passwort eingeben.
2. Die **UUID des Lichtsteuerungsbausteins Büro** und **UUID seines Statusfelds `states.activeMoods`** eintragen. Beide UUIDs stammen aus `/data/LoxAPP3.json` (Loxone-Strukturdatei). Der sichtbare Name `Büro` allein ist nicht ausreichend.
3. `Speichern & verbinden` wählen. Die App verwendet die Windows Credential Manager API via `keyring`, speichert nur nichtgeheime Einstellungen in der Benutzer-App-Konfiguration.
4. Erst nach `Loxone verbunden · Status live` wird die Szene anhand empfangener `activeMoods`-Daten angezeigt.

## Technische Hinweise
- Verwendet die Rust-Library `loxwebsocket` 0.3.1 für Token-Authentifizierung, verschlüsselte WebSocket-Befehle, Statusupdates und Reconnect. Diese Version zielt auf Miniserver-Firmware 15+.
- HTTPS per IP verwendet **Trust on First Use** (Zertifikatsschlüssel beim Erstkontakt übernommen). Prüfe die Miniserver-Adresse und die Netzwerksicherheit vor der ersten Verbindung. Kein Ausschalten der Zertifikatsprüfung.
- Für Status ist das **Text-Event** des `activeMoods`-Feldes erforderlich. Wenn es nicht im Loxone-UI veröffentlicht wird, muss die Visualisierung des Bausteins aktiviert werden.
- Kein Passwort und keine Tokens in GitHub oder in settings.json. Das Passwort wird bei jedem App-Start aus Windows Credential Manager geladen.
- Rollladen, Unraid, Schlafmodus, Drucker und Waschmaschine bleiben Demo.
- **Beta, nicht gegen einen echten Miniserver getestet.** GitHub-Build und reale Statusübertragung müssen geprüft werden.
- SmartScreen: weiterhin unsigniert.
