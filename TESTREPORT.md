VERDICT: BUGS_FOUND

Der Browser-Smoke läuft sauber: Die App lädt, zeigt den Leerzustand und stürzt nicht ab. Der `npm install`-Schritt schlägt zwar mit `ENOENT package.json` fehl, ist hier aber Harness-/Stack-Rauschen: Das Produkt ist als rein statische Web-App ohne Build-Schritt spezifiziert und besitzt bewusst keine `package.json`. Er ist kein Produktbug.

Die eigentlichen End-to-End-Tests decken jedoch echte Laufzeitfehler auf: 4 von 24 Tests scheitern. Dabei zeigen zwei strukturell ähnliche Fehler redundante DOM-Container, und der Archiv-Test verfehlt AC-07.

**Bug 1: Doppelte statische Status-/Chart-Container nach dem Anlegen einer Gewohnheit**

- **Symptom:** Nach dem Anlegen einer Gewohnheit existieren `.habit-stats` und `canvas.habit-chart` doppelt: ein leerer statischer Platzhalter aus `index.html` und die dynamisch gerenderte Karte. Dadurch schlagen AC-04, AC-05 und AC-06 fehl; zusätzlich bleiben leere Restcontainer sichtbar im DOM, was den aufgeräumten Zustand untergräbt.
- **Repro:** `e2e/grid.spec.cjs` (AC-04, AC-05) und `e2e/chart.spec.cjs` (AC-06) ausführen, jeweils eine Gewohnheit anlegen.
- **Evidence:**
  - `Error: expect(locator).toHaveCount(expected) failed`
  - `Locator:  locator('canvas.habit-chart')`
  - `Expected: 1`
  - `Received: 2`
  - `Error: strict mode violation: locator('.habit-stats') resolved to 2 elements:`
  - `1) <div class="habit-stats">…</div> aka getByText('Aktuelle Serie0 TageLängste')`
  - `2) <div class="habit-stats"></div> aka locator('#habit-list > div:nth-child(4)')`
- **Severity:** high
- **Suspected file(s):** `index.html` enthält die statischen Platzhalter `<div class="habit-stats"></div>` und `<canvas class="habit-chart"></canvas>`; `js/ui.js` baut die dynamischen Karten-Container daneben auf, ohne die statischen Platzhalter zu entfernen. Die Fehler teilen dieselbe Ursache, nicht die Render-Code-Dateien selbst.

**Bug 2: Archivansicht/AC-07 scheitert im End-to-End-Test**

- **Symptom:** Die Archivfunktion besteht den vorgesehenen Akzeptanztest nicht. Eine archivierte Gewohnheit verlässt entweder die aktive Ansicht nicht, erscheint nicht in der Archivansicht oder kehrt nach dem Wiederherstellen nicht korrekt zurück.
- **Repro:** `e2e/archive.spec.cjs:27` ausführen.
- **Evidence:**
  - `e2e\archive.spec.cjs:27:1 › AC-07: an archived habit leaves the active view and appears in the archive view`
  - Fehlerkontext unter `test-results\archive-AC-07-an-archived--bf18c-appears-in-the-archive-view\error-context.md`
  - Gesamtergebnis: `4 failed`, darunter `e2e\archive.spec.cjs:27:1 …`
- **Severity:** high
- **Suspected file(s):** nicht lokalisiert — der konkrete Assertionsfehler ist im Protokoll abgeschnitten. Kandidaten sind die Archivlogik in `js/archive.js` bzw. deren Zusammenspiel mit dem Filter-Button; der Fehlerkontext enthält einen Screenshot zur genaueren Bestimmung.

Damit sind die Akzeptanzkriterien AC-04, AC-05, AC-06 und AC-07 zur Laufzeit verletzt.