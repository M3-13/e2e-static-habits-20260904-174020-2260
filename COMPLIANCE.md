VERDICT: CHANGES_REQUESTED

# Strukturierter Compliance-Bericht

## 1. DSGVO / Datenschutz

### 1.1 Datenschutzerklärung unvollständig – Verantwortlicher und Hosting-Logs fehlen  
**Schweregrad:** high  
**Betroffen:** `datenschutz.html`  
**Befund:** Die Datenschutzerklärung behauptet pauschal, es gebe „keinen Server und keine Datenübertragung ins Internet“. Das ist nur dann zutreffend, wenn die HTML-Datei ausschließlich lokal geöffnet wird. Sobald die statische Seite über einen Webserver ausgeliefert wird, überträgt der Browser technisch notwendige Zugriffsdaten (z. B. IP-Adresse, User-Agent, Zeitstempel) an den Hosting-Provider; dieser verarbeitet sie in Server-Logs. Zudem fehlt die Angabe des datenschutzrechtlich Verantwortlichen (Name und Kontaktdaten), die nach Art. 13 DSGVO erforderlich ist, sobald personenbezogene Daten durch den Anbieter verarbeitet werden.  
**Konkrete Maßnahme:** In `datenschutz.html` folgende Inhalte ergänzen:  
- Abschnitt „Verantwortlicher“ mit vollständigem Namen/Unternehmen, Anschrift und E-Mail.  
- Abschnitt „Hosting und Server-Logfiles“: Klarstellen, dass beim Aufruf der Website durch den Browser technisch notwendige Daten an den Hosting-Provider übermittelt und dort in Server-Logfiles gespeichert werden können; Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Betrieb und Sicherheit), Speicherdauer (z. B. 7 Tage).  
- Die Aussage „keine Daten an einen Server übertragen“ präzisieren: Inhaltsdaten (Gewohnheiten, Häkchen, Einstellungen) bleiben lokal; technische Zugriffsdaten entstehen nur beim Laden der Seite.

### 1.2 Speichern in LocalStorage ohne Fehlerbehandlung  
**Schweregrad:** low  
**Betroffen:** `js/store.js`  
**Befund:** `saveState()` ruft `global.localStorage.setItem(...)` ohne try/catch auf. In privaten Browsermodi oder bei blockiertem Storage kann dies eine Exception werfen und die App zum Absturz bringen; dadurch könnten Nutzerdaten nicht gespeichert werden. Rechtlich ist das primär ein Robustheits- und Transparenzproblem (kein Hinweis auf Speicherhindernis).  
**Konkrete Maßnahme:** In `js/store.js` die `saveState`-Funktion mit try/catch umschließen; im Fehlerfall eine verständliche Meldung an die UI geben (z. B. über das vorhandene `showError`-Muster oder einen Hinweis in `datenschutz.html`). Keine Einschränkung der Kernfunktion, da LocalStorage weiterhin genutzt wird.

## 2. EU Cyber Resilience Act (CRA)

### 2.1 Fehlende dokumentierte Sicherheitseigenschaften und Update-/Patch-Information  
**Schweregrad:** low  
**Betroffen:** `README.md` / Projektdokumentation  
**Befund:** Die App ist ein Produkt mit digitalen Elementen, das ohne Build und ohne externe Abhängigkeiten ausgeliefert wird. Der CRA verlangt für Hersteller dokumentierte Sicherheitseigenschaften, eine Beschreibung des Bedrohungsmodells und transparente Angaben zu Updates. Im sichtbaren Stand fehlt eine solche Dokumentation. Das konkrete Sicherheitsniveau im Code ist gut (Validierung, textContent, kein eval), aber die Nachweispflicht ist nicht erfüllt.  
**Konkrete Maßnahme:** In `README.md` einen kurzen Abschnitt „Security & Updates“ ergänzen:  
- Datenfluss: ausschließlich lokaler LocalStorage, kein Server.  
- Bedrohungsmodell: XSS, manipulierte JSON-Importe, fehlerhafte LocalStorage-Daten.  
- Gegenmaßnahmen: Import- und Storage-Validierung, ausschließlich `textContent` für nutzergenerierte Inhalte, keine Ausführung dynamischen Codes.  
- Update-/Bereitstellungsweg: statische Dateien werden durch Austausch der Dateien aktualisiert; da keine Serverkomponente existiert, erfolgt die Aktualisierung zentral beim Hosting bzw. durch den Nutzer beim lokalen Öffnen.

## 3. EU AI Act

**Schweregrad:** n/a  
**Befund:** Die App enthält keine KI-Funktion im Sinne des AI Act. Es handelt sich um deterministische JavaScript-Logik. Eine Risikoklassifizierung ist nicht erforderlich; es bestehen keine Kennzeichnungs- oder Transparenzpflichten nach AI Act.

## 4. Pflichttexte & UI

### 4.1 Impressum enthält ausschließlich Platzhalter  
**Schweregrad:** high  
**Betroffen:** `impressum.html`  
**Befund:** Die Seite enthält Platzhalter wie `[Vor- und Nachname bzw. Firmenname]`, `[Straße und Hausnummer]`, `[E-Mail-Adresse]`, `[Umsatzsteuer-Identifikationsnummer …]`. Das erfüllt nicht die Anforderungen an ein Impressum nach § 5 DDG (früher TMG), falls eine Impressumspflicht besteht (bei einem nicht rein privaten Webauftritt, was durch die Verlinkung und die Datenschutzerklärung naheliegt). Die Platzhalter sind unzulässig.  
**Konkrete Maßnahme:** In `impressum.html` alle Platzhalter durch vollständige, korrekte Angaben ersetzen: Name/Unternehmen, ladungsfähige Anschrift, Kontakt, Vertretungsberechtigte/r, USt-IdNr. (falls vorhanden), Registereintrag (falls vorhanden). Falls keine Impressumspflicht besteht (rein private Nutzung, keine geschäftsmäßige Veröffentlichung), die Datei entfernen und den Link in `index.html`, `datenschutz.html` anpassen – dann aber konsistent. Da die Datei aktuell existiert und verlinkt ist, muss sie ausgefüllt sein.

### 4.2 Veraltete Rechtsgrundlage im Impressum  
**Schweregrad:** medium  
**Betroffen:** `impressum.html`  
**Befund:** Die Überschrift lautet „Angaben gemäß § 5 TMG“. Das Telemediengesetz (TMG) wurde zum 14. Mai 2024 durch das Digitale-Dienste-Gesetz (DDG) ersetzt.  
**Konkrete Maßnahme:** In `impressum.html` die Zeile ändern zu „Angaben gemäß § 5 DDG“. 

## 5. Barrierefreiheit (WCAG / BITV / EAA)

### 5.1 Eingabefeld ohne sichtbares Label  
**Schweregrad:** medium  
**Betroffen:** `index.html` (und zugehörige UI)  
**Befund:** Das Eingabefeld `#habit-name` hat nur ein `placeholder`-Attribut, aber kein `<label>`, `aria-label` oder `aria-labelledby`. Placeholder ist kein Ersatz für ein Label und verstößt gegen WCAG 2.1 SC 3.3.2 (Labels or Instructions) sowie SC 4.1.2 (Name, Role, Value). Screenreader-Nutzer können die Funktion nicht eindeutig erkennen.  
**Konkrete Maßnahme:** In `index.html` vor dem Input ein (visuell verstecktes) Label ergänzen, z. B. `<label for="habit-name" class="visually-hidden">Neue Gewohnheit</label>` oder dem Input `aria-label="Neue Gewohnheit"` geben. Bevorzugt ist ein sichtbares Label, das auch die Verständlichkeit für alle verbessert. Die bestehende Klasse `visually-hidden` muss in `css/styles.css` definiert werden, falls nicht vorhanden.

### 5.2 Modaler Löschdialog ohne vollständigen Fokus-Trap  
**Schweregrad:** medium  
**Betroffen:** `js/ui.js` (Funktion `confirmDelete`)  
**Befund:** Der Dialog setzt `role="dialog"`, `aria-modal="true"` und fokussiert initial den Abbrechen-Button, aber es fehlt ein Fokus-Trap. Nutzer können per Tabulator aus dem Dialog in den Hintergrund gelangen. Verstößt gegen WCAG 2.1 SC 2.4.3 (Focus Order) und SC 2.4.7 (Focus Visible).  
**Konkrete Maßnahme:** In `js/ui.js` in der `confirmDelete`-Funktion einen Keydown-Handler für Tab ergänzen, der den Fokus zwischen Cancel- und Lösch-Button zyklisch hält. Beim Schließen den Fokus auf den zuvor aktiven Auslöser (z. B. den Lösch-Button der Karte) zurücksetzen. Das beeinträchtigt die Produktfunktion nicht.

### 5.3 Canvas-Diagramm ohne Textalternative  
**Schweregrad:** medium  
**Betroffen:** `js/chart.js` (Canvas-Darstellung) und die Erzeugung der Canvas-Elemente in `js/ui.js`  
**Befund:** Das 8-Wochen-Balkendiagramm wird ausschließlich als `<canvas>` gezeichnet. Für Screenreader und assistive Technologien sind die Informationen (Wochenquoten, Beschriftungen) nicht zugänglich. Verstoß gegen WCAG 2.1 SC 1.1.1 (Non-text Content).  
**Konkrete Maßnahme:** Jede Canvas-Element mit `role="img"` und einem dynamisch gesetzten `aria-label` versehen, das die dargestellten Wochenquoten zusammenfasst. Alternativ oder ergänzend einen visuell versteckten Text oder eine HTML-Tabelle mit den Daten bereitstellen. In `js/chart.js` kann z. B. eine Funktion die Beschriftung erzeugen und im `renderAll` auf das Canvas setzen. Keine negativen Auswirkungen auf die Produktfunktion.

### 5.4 Kontrast des primären Buttons im hellen Modus möglicherweise unzureichend  
**Schweregrad:** medium  
**Betroffen:** `css/styles.css` (`--color-accent: #1B8A4B` und `.btn-primary` mit weißem Text)  
**Befund:** Weißer Text auf dem hellen Grün `#1B8A4B` erreicht voraussichtlich ein Kontrastverhältnis von knapp unter 4.5:1. Für normalen Text (14px, nicht „large“) verlangt WCAG 2.1 SC 1.4.3 mindestens 4.5:1.  
**Konkrete Maßnahme:** Entweder den Grünwert der Akzentfarbe im hellen Modus abdunkeln (z. B. `#147A3A` oder `#0F6B30`) oder die Textfarbe des primären Buttons im hellen Modus auf einen dunklen Wert (z. B. `#10131A`) umstellen. Vorher den Kontrast mit einem Tool messen. Dies beeinträchtigt die Funktionalität nicht.

## 6. Sonstige Anmerkungen

- **LocalStorage als technisch notwendig:** Die Datenschutzerklärung erwähnt die Speicherung, sollte aber noch einen Satz ergänzen, dass die Nutzung von LocalStorage für die Kernfunktion technisch erforderlich ist und daher keine Einwilligung nach Art. 5 Abs. 3 ePrivacy-Richtlinie erforderlich ist. Dies dient der Rechtssicherheit und Transparenz.
- **Keine Cookie-Einwilligung nötig:** Es werden keine Cookies oder Tracking-Mechanismen eingesetzt. Ein Consent-Banner ist daher nicht erforderlich und wird nicht verlangt.
- **Keine CSP notwendig:** Da die App vollständig ohne externe Ressourcen auskommt und nutzergenerierte Inhalte sicher per `textContent` gerendert werden, ist eine Content Security Policy rechtlich nicht zwingend. Eine CSP könnte als zusätzliche Härtung erwogen werden, ist aber kein Blocker.

**Gesamtbild:** Die Anwendung ist sicher und datenschutzfreundlich gebaut (lokale Speicherung, Validierung, keine Übertragung, textContent statt innerHTML). Die wesentlichen offenen Punkte liegen bei der unvollständigen Datenschutzerklärung und dem unausgefüllten Impressum sowie einigen konkreten Barrierefreiheits-Mängeln. Diese sind allesamt behebbar und erfordern keine grundlegende Überarbeitung der Produktlogik.