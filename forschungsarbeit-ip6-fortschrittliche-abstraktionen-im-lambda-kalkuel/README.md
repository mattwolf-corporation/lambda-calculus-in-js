# Forschungsarbeit IP6 - Fortschrittliche Abstraktionen im Lambda Kalkül

## Abstract

Was wurde erreicht? Was sind die Ergebnisse?

* Erweiterungen der **immutable Stack** Datenstruktur
* Umsetzung des **Observer Pattern**
* **immutable ListMap** \(Stack mit Schlüssel-&gt;Wert Paaren\) Datenstruktur
* Umsetzung **Maybe** und **Either** Type für eine Fehlerbehandlung nur mit reinen Funktionen , ohne `throw` Statements.
* **Box/MaybeBox** \(Monade\) um Werte in einer Art Pipeline zu verarbeiten
* Erweiterung des Test-Frameworks mit einer Zeitmessung für die Methodenausführung \(Benchmark-Test\)
* JsDoc Ergänzungen
* Dokumentation und Anwendungsbeispiele der Konstruktionen

Warum wurde es gemacht? Was war das Problem?

Wie wurde es gemacht/untersucht/getestet ?



### Einleitung

JavaScript hat den Ruf, eine unsichere Programmiersprache zu sein. Man kann aber auch in JavaScript sichere, belastbare Konstruktionen mit Industriehärte bauen. Ein Weg dazu ist die Anwendung von Erkenntnissen aus den Grundlagen der Informatik, dem untypisierten Lambda-Kalkül. Im Vorgänger Projekt "Lambda Kalkül für praktisches JavaScript" wurde das Fundament für dieses Projekt geschaffen. Ziel dieses Projektes ist es die Konstruktionen aus dem Vorgänger Projekt zu verbessern, zu erweitern und neue zu bauen. Da es bei dieser Forschungsarbeit keine konkrete Aufgabe gibt, sondern nur ein übergeordnetes Ziel, stand folgende Frage stets im Zentrum: Wie können, zum Teil schon existierende, Lösungsansätze für bekannte Probleme in der Programmierung, mittels dem untypisierten Lambda Kalkül in JavaScript umgesetzt werden. Dabei wurde folgendes erreicht:

{% page-ref page="listmap.md" %}

{% page-ref page="observable.md" %}

{% page-ref page="either.md" %}

{% page-ref page="maybe.md" %}

{% page-ref page="immutable-stack-erweiterungen.md" %}

{% page-ref page="box-maybebox.md" %}

Bei diesen Konstruktionen wurde komplett auf die Werte der reinen [funktionalen Programmierung](https://de.wikipedia.org/wiki/Funktionale_Programmierung) gesetzt.

* **Reinheit** \(_pure functions\):_   Funktionen ohne Seiteneffekte \(wie mathematische Funktionen\)
* **Unveränderlichkeit** \(_immutable Datastructure\):_  Unveränderliche Datenstrukturen
* **Iteration**: Eine Iteration ohne Ausdrücke wie _`for`_, _`while`_ oder `do` Schleifen
* **Fehlerbehandlung** ohne `throw` Ausdruck

> **Abgrenzung von imperativer Programmierung:**   
> Es werden keine Objektorientierte Konzepte wie Klassen oder Veerbung usw. verwendet.

Die entwickelten Konstruktionen haben das Ziel dem Anwender einen Werkzeugkasten für das Programmieren von Webanwendungen mit JavaScript bereitzustellen. Diese Konstruktionen sollen dem Anwender helfen seine Applikationen wartbarer und sicherer zu gestalten. Ausserdem sollten weniger Fehler auftauchen die typischerweise mit JavaScript auftauchen.



### Ausgangslage

IP5 & Lambda Kalkül

### Was wurde erreicht

resultate



### Fazit



