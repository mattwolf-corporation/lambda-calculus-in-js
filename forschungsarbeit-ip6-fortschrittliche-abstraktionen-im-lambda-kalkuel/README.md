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
    
    if
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





### Ausgangslage

IP5 & Lambda Kalkül

### Was wurde erreicht

resultate



### Fazit



