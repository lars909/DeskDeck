# DeskDeck 3.2 – Loxone-Befehlsdiagnose

Statt `send_control` (fire-and-forget) verwendet `set_scene` nun `send_command` mit `jdev/sps/io/{uuid}/setMoodToId/{id}`. Die echte JSON-Antwort des Miniservers wird geprüft und `Code`/`value` werden im Footer angezeigt. Fehler bleiben sichtbar. Das ermöglicht die Unterscheidung zwischen Versand und Verarbeitung. Der Live-Status bleibt unverändert; eine erfolgreiche Antwort ist kein Beweis für eine physische Änderung.

Das Passwort bleibt im Windows Credential Manager (`keyring` mit `windows-native`). Einstellungen werden ohne Passwort in `settings.json` gespeichert.

Windows-Build und reale Loxone-Hardware konnten hier nicht getestet werden.
