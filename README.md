# Habit-Tracker

Ein rein statischer Habit-Tracker für den Browser. Gewohnheiten werden angelegt,
täglich im 30-Tage-Raster abgehakt und mit Serien, Wochenquote und einem
Acht-Wochen-Balkendiagramm ausgewertet. Gewohnheiten lassen sich archivieren und
filtern, das Design auf Dark Mode umschalten und der gesamte Datenbestand als
JSON exportieren und wieder importieren. Alle Daten liegen ausschließlich
clientseitig im LocalStorage des Browsers – es gibt keinen Server und keine
externe Datenübertragung.

## Tech-Stack

- **Sprache**: JavaScript (ES6+)
- **Markup**: HTML5
- **Styling**: CSS3 (Custom Properties für Dark Mode, Media Queries für Responsivität)
- **Speicherung**: LocalStorage
- **Diagramm**: Canvas 2D API
- **Build**: keiner (statische Dateien, direkt im Browser zu öffnen)
- **Bibliotheken**: keine

## Installation

Keine. Es gibt weder Build-Schritt noch Abhängigkeiten – die Anwendung besteht
nur aus statischen Dateien, die direkt im Browser laufen.

## Starten

Zwei Möglichkeiten:

1. **Direkt öffnen** – `index.html` im Browser öffnen (z. B. Doppelklick). Es ist
   kein Server und keine Konsole nötig.
2. **Lokaler statischer Server** – im Projektordner:

   ```sh
   python -m http.server 8000
   ```

   und anschließend `http://localhost:8000` im Browser öffnen. (Ein Server ist
   nur für die bequeme Auslieferung nützlich, nicht zwingend erforderlich.)

## Bedienung

- **Gewohnheit anlegen**: Name in das Eingabefeld tippen und „Hinzufügen“ klicken.
- **Häkchen setzen**: In der 30-Tage-Ansicht eine Rasterzelle anklicken, um den
  Tag abzuhaken; erneuter Klick entfernt das Häkchen wieder.
- **Statistik**: Serien (aktuell/längste) und Wochenquote werden pro Gewohnheit
  angezeigt.
- **Diagramm**: Das Acht-Wochen-Balkendiagramm zeigt die abgehakten Tage je Woche.
- **Archivieren & Filtern**: Über die Aktionsschaltfläche eine Gewohnheit
  archivieren oder wiederherstellen; der Filter-Schalter wechselt zwischen
  aktiver und archivierter Ansicht.
- **Export / Import**: Den Datenbestand als JSON-Datei herunterladen und über
  den Import wieder einlesen. Importierte Daten werden vollständig validiert.
- **Dark Mode**: Über den Schalter oben rechts zwischen hellem und dunklem
  Design wechseln; die Auswahl bleibt gespeichert.

## Features

- Gewohnheiten anlegen, umbenennen und löschen
- 30-Tage-Raster mit täglichen Häkchen (persistent im LocalStorage)
- Aktuelle und längste Serie sowie Wochenquote
- Acht-Wochen-Balkendiagramm (Canvas)
- Archivieren, Wiederherstellen und Filteransicht
- Dark Mode mit Speicherung
- JSON-Export und -Import mit vollständiger Schema-Validierung
- Datenschutz- und Impressumsseite (verlinkt im Footer)
- Responsives Layout für Mobilgerät, Tablet und Desktop
