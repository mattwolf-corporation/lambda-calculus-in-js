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



## Einleitung

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
> Es werden keine Objektorientierte Konzepte wie Klassen oder Vererbung usw. verwendet.

Die entwickelten Konstruktionen haben das Ziel dem Anwender einen Werkzeugkasten für das Programmieren von Webanwendungen mit JavaScript bereitzustellen. Diese Konstruktionen sollen dem Anwender helfen seine Applikationen wartbarer, robuster und sicherer zu gestalten. Dazu gibt es diverse Funktionen um von der Welt des Lambda Kalküls in die Welt von JavaScript zu wechseln und umgekehrt, wie zum Beispiel `convertArrayToStack` und `convertStackToArray`. Dies erlaubt dem Anwender die Welten zu wechseln und diese zu kombinieren.

Durch den Einsatz von diesem Werzeugkasten sollten weniger Fehler auftauchen, die sonst typischerweise beim Entwickeln mit JavaScript und der Verwendung von Objekten und veränderlichen Werten auftauchen.

### Typische Fehler die beim Entwickeln mit JavaScript auftauchen.

| Fehlermeldung | Grund |
| :--- | :--- |
| Uncaught TypeError: Cannot Read Property | Zugriff auf Objekt das null oder undefined ist |
| ... |  |

## Classic JS vs Lambda JS

### Property Value aus Objekt extrahieren \(null-safe\)

**Gegeben:** Ein verschachteltes User-Objekt mit Street-Property.  
**Ziel:**           Strassenname extrahieren

```javascript
// User-Object
const user = {
    firstName: "Donald",
    lastName: "Duck",
    address: {
        city: "Entenhausen",
        street: {
            name: "WaltStreet",
            nr: 10
        }
    }
}

// Anwendung
streetName(user) // "WALTSTREET"
```

Eine mögliche Implementierung im klassischen JavaScript wäre:

```javascript
const streetName = user => {
    if (user){
        const address = user.address;
        if(address){
            const street = address.street;
            if(street){
                const name = street.name;
                if (name){
                    return name.toUpperCase();
                }
            }
        }
    }
    return "no street"
}
```

Eine gleichwertige Implementierung im Stil der funnktionalen Programmierung.

```javascript
const streetName = user =>
    Box(maybeNotNullAndUndefined(user))
        (chainMaybe)(u => maybeNotNullAndUndefined(u.address))
        (chainMaybe)(a => maybeNotNullAndUndefined(a.street))
        (chainMaybe)(s => maybeNotNullAndUndefined(s.name))
        (foldMaybe)(n => n.toUpperCase())
    (_ => "no street")
    (id)
```

### Vergleich

| Eigenschaften | Classic JS | Lambda JS |
| :--- | :--- | :--- |
| Variablen für Zwischenstände | wird benötigt | keine |
| Verschachtelung von If Statements | wird benötigt | keine |
| Leserlichkeit/Lesefluss | erschwert | klarer |
| Wartbarkeit | schlecht | gut |

### 

### 

```javascript
const checkElementByFunction = f => (...elems) =>
    elems.reduce((acc, curr) => {
        const result = f(curr);
        if (acc.isFailed) {
            if (!result) {
                 acc.values.push('element with id: ' + curr + 'not found');
                return acc;
            }
            return acc;
        } else {
            if (result) {
                acc.values.push(result);
                return acc;
            }
            acc.values = [] // clear elements
            acc.values.push('element with id: ' + curr + 'not found');
            acc.isFailed = true;
            return acc;

        }
    }, {values: [], isFailed: false});
```



```javascript
const eitherElementsOrErrorsByFunction = eitherProducerFn => (...elements) =>
     reduce((acc, curr) => acc
                                ( stack => Left( eitherProducerFn(curr)
                                            (err => push(stack)(err))
                                            (_   => stack))
                                )
                                ( listMap => eitherProducerFn(curr)
                                                (err => Left(  push(emptyStack)(err)           ))
                                                (val => Right( push(listMap)( pair(curr)(val) )))
                                )
        )
        ( Right( emptyListMap) )
        ( convertArrayToStack(elements) );
```

## Fazit / Erkenntnisse

**Wie brauchbar/nützlich ist LK mit JS? Erkenntnisse aus der Arbeit**

#### Konzepte aus der funktionalen Programmierung

Die Konstruktionen beinhalten Ideen und Konzepte aus der funktionalen Programmierung. Mit dem Einsatz dieser Konstruktionen, können JavaScript Applikationen funktionaler gestaltet/implementiert werden. Die Konstruktionen sind so implementiert, dass sie leicht integrierbar und anwendbar sind. Ein JavaScript Programm muss dabei nicht komplett nur aus diesen Konstruktionen bestehen, sondern der Anwender kann hier und dort bestimme Konstrukte in sein Programm einfliessen lassen. 

#### Nutzen & Vorteile

In mehreren kleinen Beispielen hat sich gezeigt, dass die Konstruktionen den Code leserlicher, wartbarer und sicherer machen. Ausserdem enstehen weniger typische Fehler, die bei der Programmierung mit JavaScript auftreten. 

Da die Konstruktionen aus puren Funktionen bestehen ist der Programmablauf klarer und Fehler können besser eingegrenzt werden. Bei veränderlichen Daten und Funktionen mit Seiteneffekte leidet die Übersicht von grossen Anwendungen und man hat keine Ahnung mehr was wo genau geschieht. Schon durch einen kleinen Einsatz von diesen Konstruktionen können bestimmte Teile in einer Applikation einfacher und sicherer werden. 

#### JS Doc Unterstüzung - Fehlendes Typ System bei JavaScript

Ein wesentliches Ziel von Typisierung in Programmiersprachen ist die **Vermeidung von Laufzeitfehlern.** JavaScript ist eine _schwach typisierte_ oder _dynamische_ Programmiersprache. Datentypen werden bei einer Variable nicht explizit deklariert und jede Variable kann mit Werten jedes Typen initialisiert werden. Es gibt auch kein Compiler der die Typen überprüfen würde. Die JS Doc unterstützt den Anwender für die korrekte Verwendung der Funktionen und den erwartetetn "Typen". Mit der JS Doc bekommt der Anwender Hinweise  auf die korrekten Typ-Parameter. 

**‌‌Potenzielle Erweiterungen/Vorschläge für nächste Schritte**

* Für die unveränderlichen Datenstrukturen **Stack** und **ListMap** könnten zusätzliche Funktionen entwickelt werden, sodass ein noch grösseres Anwendungsgebiet entsteht.
* Mögliche Funktionen: findFirst, stream artige Funktionen
* Weitere Konzepte der funktionalen Programmierung umsetzen

**Was kann verbessert werden?**

* Bei gewissen Funktionen könnte noch mehr Sicherheit eingebaut werden, sodass spezielle Falsche Parameter besser abgefangen werden
* Noch mehr Funktionen die auch ein Maybe/Either Type zurückgeben
* Mehr Funktionen mit aussagekräftigen Fehlermeldungen für den Verwender

**Was wurde erreicht - Zusammenfassung**

Eine Bibliothek von Konstruktionen aus der funktionalen Programmierung \(lambda Kalkül\) bestehend aus:

* Funktionale Art für die Fehlerbehandlung mit Maybe und Either Type
* Immutable Datenstruktur ListMap
* Observable
* diverse Erweiterungen für die immutable Datenstruktur Stack
* Box/Maybe-Box Pipeline Konstrukt \(Funktor, Applicative, Monade\)

**Reflektion der gewählten Ansätze und Lösungen. «Ansatz X hat nicht funktioniert, weil &lt;sachliche Argumente und nicht persönliche Fehler**

Beim ersten Entwurf des Observables wurde für die Verwaltung der Listener die Stack Datenstruktur verwendet. Bei der Implementierung für das abmelden/entfernen der Listener wurde klar das dies mit einem Stack nicht bzw. nicht elegant gelöst werden kann. Dabei kam die Idee einer HashMap auf umd einen Listener per Schlüssel abzuspeichern und wieder zu entfernen. Das Problem einer HashMap ist das dies ein gute Hash-Funktion voraussetzt und die ist eine bekanntlich Schweres Problem in der Informatik. Auch für den direkten Zugriff auf eine HashMap wussten wir nicht wie wir dies implementieren wolltemn. Da kam uns die Idee das wir eine Liste mit Schlüssel-Wertpaaren entwicklen können ohne diese zu Hashen und für den Zugriff mit Iteration durch die Liste zugreifen. Der Schlüssel sollte eindeutig und mit dem JavaScript === Operator auf Gleichheit verglichen werden können. Eine alternative Implementierung wäre eine Art Binär Baum, dies wäre aber sehr komplex und nicht nötig für unsere Einsatz Zwecke. Vorteil von unsere Implementierung wir verwenden den bereits existierenden Stack und erweitern diesen und so enstand die ListMap Datenstruktur.



Unsere Konstruktionen aus dem Lambda Kalkül bringen folgende Vorteile mit sich:

* Die Verwendung von unveränderlichen Datenstrukturen reduziert Fehler im Code, in dem sie geschützt ist vor Manipulation.
* Reine Funktionen sind wartbarer und erhöhen die Leserlichkeit von Code.
* Die funktionalen Konstruktionen sind einfach zu Testen.
* Funktions-Komposition ist ein sehr mächtiges Werkzeug, weil dadurch rasch nützliche neue Konstruktionen entstehen.

