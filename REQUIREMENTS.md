# Requirements

> NOTE: currently in german


## Stakeholders

- Sportverband
- Vereine
- Wertungsrichter
- Skippers
- Speaker
- Zuschauer


## Probleme

- zu viele Fehler / Fehlerquellen
- Ineffizienz bei der Auswertung
- grosse Verantwortung / Belastung für die Wertungsrichter
- hoher zeitlicher Druck für die Wertungsrichter
- hohe Anforderungen an das Wertungsbüro
- steigende Komplexität der Wettkampfformen
- Aufwändig, bei Fehlern Resultate zu überprüfen
- zu viel Zeit zwischen den Darbietungen / Für Publikum “viel” Wartezeit zwischen Freestyles bzw. bis zur Rangverkündigung


## Ziele

- Fehler vermeiden
- Fehlerquellen reduzieren
- Vereinfachungen für Wertungsrichter (nutzerfreudlicher)
- Vereinfachungen für das Wertungsbüro
- Übersichtliche Informationen für den Speaker
- Höhere Zufriedenheit der Vereine / Verantwortliche
- Weniger Zeit beim Wechsel
- Professionalität erhöhen
- Höhere Wertschätzung der Leistungen der Skipper
- Besseres Erlebnis für Zuschauer
- Mehr Transparenz
- Live Resultate für Zuschauer
- Attraktivität für Helfer/Verantwortliche steigern
- Anmeldeprozess vereinfachen
- Vereinfachte Erstellung der Startlisten für Ropeskipping Swiss


## Strategie

-> **möglichst viel digitalisieren & schulen**


## Nicht funktionale Anforderungen

- Das System muss robust laufen, auch ohne Internet
- Das System muss einfach aufbaubar sein
- die Wertungsrichter Apps sollen intuitiv bedienbar sein
- Der “Rechenkern” soll eine gute Testabdeckung mit lesbaren Tests haben


## Rahmenbedingungen (Constraints)

- Am Wettkampf werden keine persönlichen Geräte für die Wertung verwendet, um einen stabilen Betrieb zu gewährleisten
- Sämtliche involvierten Komponenten sollen aus einer Hand vorkonfiguriert bereitgestellt werden
- Die Lösung muss auf dem 5 GHz Band laufen, um Störungen im 2.4 GHz Netz vorzubeugen


## Komponenten

**Turner (Skipper) / Verein Verwaltung**

- CSV Import
- evtl. Online Registrierung

**Programm Ablauf (Disziplin / Gruppe / Personen)**

- Queuing System
- mit Steuerung des aktuellen Programms

**Wertung**

- Eingabe via App an Tablet
- Rechnen / Zusammenführen der Ergebnisse auf dem Wettkampfbüro Rechner

**Anzeigen / Auswertungen**

- Ranglisten
- Live Anzeige der Punkte
- Erstellung der Diplome


## Out of Scope

- Live Benachrichtigungen für Zuschauer auf persönlichen Handys


## Ausbaupotentiale

- Mit dem gleichen Programm Startlisten, Wertungsrichterblätter, Ranglisten, Diplome… erstellen
- aktive Springerinnen erfassen → automatische Einteilung in richtige Alterskategorien
- Vereinfachungen für Organisatoren (Werbeanzeigen etc.)
- Möglichkeit von “Zwischen” Siegerehrungen ohne Mehraufwand
- Live Resultate (personalisiert)
- Unmittelbare Anzeige neuer Rekorde nach Durchlauf
- Erinnerungshilfen für Wertungsrichter z.B. Frühstart
