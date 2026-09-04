VERDICT: BUGS_FOUND

Der Abschnitt `npm install (reuse deps)` ist Harness-Rauschen: Das Projekt ist `web-static` und besitzt bewusst kein `package.json`/keinen Build-Schritt; `npm` sucht vergeblich eine `package.json`. Das ist kein Produktfehler.

**Fehler 1: Archivierte Gewohnheit verschwindet nach dem Archivieren nicht aus der aktiven Ansicht (AC-07)**
- **Symptom**: Der E2E-Test für AC-07 schlägt fehl: Nach dem Klick auf die Archivieren-Aktion erwartet der Test keine sichtbaren Habit-Elemente mehr in der aktiven Ansicht, es bleibt jedoch 1 `[data-habit-id]`-Element im DOM. Zudem wird der Leerzustand `#empty-state` nicht sichtbar. Aus Nutzersicht wirkt die aktive Ansicht nach dem Archivieren nicht geleert; die Karte scheint weiterhin vorhanden zu sein.
- **Repro**: `npx playwright test e2e/archive.spec.cjs` ausführen — Testname `AC-07: an archived habit leaves the active view and appears in the archive view`, Zeile 27. Alternativ manuell: eine Gewohnheit anlegen, deren Archivieren-Aktion anklicken und die aktive Ansicht prüfen.
- **Evidence**:
  - `Error: expect(locator).toHaveCount(expected) failed`
  - `Locator: locator('[data-habit-id]')`
  - `Expected: 0`
  - `Received: 1`
  - `16 × locator resolved to 1 element - unexpected value "1"`
  - `at C:\Users\Anwender\.cache\office-crew\worktrees\tester-gate\e2e\archive.spec.cjs:38:49`
- **Suspected file(s)**: `js/archive.js` (Filterlogik blendet Karten vermutlich nur per `style.display` aus, statt sie aus dem DOM zu entfernen) und/oder `e2e/archive.spec.cjs`, falls dessen Erwartung an die DOM-Struktur zu streng ist. Sollte die Karte tatsächlich sichtbar bleiben, liegt der Kernfehler in `archive.applyFilter`.
- **Severity**: high