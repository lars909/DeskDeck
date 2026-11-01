# DeskDeck V3.1 – Diagnose-Fix

- Basis: V3 mit korrigierter on_text-Signatur.
- Fehlermeldungen bei set_scene bleiben im Dashboard sichtbar, bis eine neue Aktion sie zurücksetzt.
- Beim Speichern wird das Passwort mit `keyring` Windows-native gespeichert und sofort wieder gelesen; bei Fehlschlag wird das Speichern abgebrochen.
- Einstellungen zeigen an, ob ein Tresor-Eintrag vorhanden ist.
- Keine Passwörter in `settings.json` oder Logs.

**Wichtig:** Dies ist ein Diagnose-Build. Er behebt noch nicht nachweislich das Schalt- oder Statusproblem. Bei Fehler bitte die vollständige Meldung aus DeskDeck weitergeben (keine Zugangsdaten). Windows-Build nicht lokal verifiziert.
