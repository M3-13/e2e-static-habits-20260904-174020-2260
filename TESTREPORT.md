VERDICT: BUGS_FOUND

**Titel**: Nach dem Anlegen einer Gewohnheit werden vier `[data-habit-id]`-Elemente gerendert statt genau einer

**Symptom**:  
Die zentralen E2E-Akzeptanztests schlagen bereits beim Anlegen der ersten Gewohnheit fehl: Der Locator `[data-habit-id]` findet nach „Hinzufügen“ vier Elemente statt eines. Dadurch lassen sich AC-01, AC-02, AC-03, AC-04, AC-05, AC-06 und AC-07 nicht verifizieren — die Kernfunktionen erscheinen aus Tester-Sicht als kaputt, obwohl nur eine Gewohnheit angelegt wurde.

**Repro**:  
`npx playwright test` ausführen, z. B. `e2e/habits.spec.cjs:20:1`: Name eingeben, auf „Hinzufügen“ klicken, dann `await expect(page.locator('[data-habit-id]')).toHaveCount(1);`.

**Evidence**:
```text
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('[data-habit-id]')
Expected: 1
Received: 4
Timeout:  6000ms

16 × locator resolved to 4 elements
  - unexpected value "4"
```
Der identische Fehler tritt in den fehlgeschlagenen Tests auf:
```text
8 failed
  e2e/archive.spec.cjs:27:1 › AC-07: an archived habit leaves the active view and appears in the archive view
  e2e/archive.spec.cjs:46:1 › AC-07: restoring an archived habit returns it to the active view
  e2e/chart.spec.cjs:20:1 › AC-06: each habit renders a canvas bar chart with real dimensions
  e2e/grid.spec.cjs:27:1 › AC-03: clicking a grid cell toggles the check and persists after reload
  e2e/grid.spec.cjs:43:1 › AC-04: current and longest streak update immediately after a check
  e2e/grid.spec.cjs:54:1 › AC-05: weekly rate is shown as a percentage
  e2e/habits.spec.cjs:20:1 › AC-01: a newly created habit appears in the 30-day grid and survives reload
  e2e/habits.spec.cjs:46:1 › AC-02: duplicate names are rejected with a message
```

**Suspected file(s)**:  
Nicht eindeutig auf eine Datei lokalisierbar — alle acht Fehler teilen dieselbe Form und betreffen die Anzahl der `[data-habit-id]`-Treffer. Die gemeinsame Ursache liegt daher vermutlich in der zentralen HabitCard-Erzeugung/Attributvergabe (`js/ui.js`) oder in deren Zusammenspiel mit `js/grid.js`/`js/chart.js`, nicht in den einzelnen Spec-Dateien.

**Severity**: high