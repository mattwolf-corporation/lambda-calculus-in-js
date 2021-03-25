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



### Pure Lambda-JS VS Lambda JS mit mehreren Funktionen

In reinem Lambda Kalkül Code mit JavaScript zu schreiben kann sehr unübersichtlicht werden. Denn bei Funktionen die im kern mehrere Aufgaben erledigen kann die Formel sehr komplex werden.

 Schon kleinere Funktionen wie `push`  der ein Stack erstellt mit einem neuen Wert    
\(`const stackWithOneValue = push(emptyStack)(1);` \) , besteht im kern aus mehreren Funktionen. 

Unserer Implementation sieht dabei so aus: 

```javascript
const push = s => stack( succ( s(stackIndex) ) )(s);
```

`Push` erwartet einen Parameter `s` vom _Typ Stack_ und gibt ein Stack zurück. Dieser Stack ist nichts weiter als ein Platzhalter für ein Triple \(`const triple = x => y => z => f => f(x)(y)(z);`\), dessen erster Parameter die Funktion `succ`aka Successor \( `const succ = n => f => x => (f)(n(f)(x));` \) ist. Der Successor verlangt dabei nach einer Churchzahl um dessen Wert um einen zu erhöhen und zurück zu geben. Um diese Churchzahl überhaupt erst zu erhalten wird mit dem Aufruf der Funktion `stackIndex`  aus dem Stack der Index geholt. Und da der Stack ein Triple ist, ist die Funktion `stackIndex`  \(`const stackIndex = firstOfTriple;`\)  nur eine Funktion um Werte aus einem Triple zu holen \( `const firstOfTriple = x => y => z => x`;  \).  In allem ist das ein Funktionskomposition, dass im Hintergrund, wenn alles zusammen kommt, so aussieht:

```javascript
// in reinem Lambda Kalkül
const push = s => z => f => f( f => x => f( s(x => _ => _ => x)(f)(x) ))(s)(z);
```





```javascript
// reduce in reinem Lambda Kalkül 
const reduce = reduceFn => initialValue => s => s(x => _ => _ => x)(t => t(x => _ => _ => x)(x => _ => _ => x)(_ => (_ => y => y))(x => _ => x)(t)((t => f => f(t(x => _ => _ => x)(_ => y => _ => y))(t(_ => y => _ => y))(t(_ => y => _ => y)(t(_ => _ => z => z))((t(x => _ => _ => x))(_ => _ => z => z))))(t)))(f => f(s(x => _ => _ => x)(t => t(x => _ => _ => x)(x => _ => _ => x)(_ => (_ => y => y))(x => _ => x)(t)((t => f => f(t(x => _ => _ => x)(_ => y => _ => y))(t(_ => y => _ => y))(t(_ => y => _ => y)(t(_ => _ => z => z))((t(x => _ => _ => x))(_ => _ => z => z))))(t)))(f => f(s)(acc => curr =>  f => f( f => x => f(s(x => _ => _ => x)(f)(x)))(acc)(curr))(f => f(_ => a => a)(x => x)(x => x)))(_ => _ => z => z))(reduceFn)(initialValue))(_ => _ => z => z);


// reduce in mehreren Funktionen unterteilt
const reduce = reduceFn => initialValue => s => {

    const reduceIteration = argsTriple => {
        const stack = argsTriple(firstOfTriple);

        const getTriple = argsTriple => {
            const reduceFunction    = argsTriple(secondOfTriple);
            const preAcc            = argsTriple(thirdOfTriple);
            const curr              = head(stack);
            const acc               = reduceFunction(preAcc)(curr);
            const preStack          = stack(stackPredecessor);
            return triple(preStack)(reduceFunction)(acc);
        }

        return If( hasPre(stack) )
                (Then( getTriple(argsTriple) ))
                (Else(           argsTriple  ));
    };

    const times = size(s);
    const reversedStack = times
                            (reduceIteration)
                                (triple
                                  (s)
                                  (acc => curr => push(acc)(curr))
                                  (emptyStack)
                                )
                                (thirdOfTriple);

    return times
            (reduceIteration)
                (triple
                  (reversedStack)
                  (reduceFn)
                  (initialValue)
            )(thirdOfTriple);
};
```

Die Performance leidet wenn eine grössere und komplexere Funktion in einer Linie in reiner mathematischen Lambda Kalkül hinschreibt. Denn sie vollgebackt mit vielen anonymen Funktionen die alles gelesen und evaluiert werden. So werden mehrere Male Funktionen ausgewertet die das gleiche tun, aber da sie anonym sind, weiss das JavaScript nicht.  Darum ist es besser, mehrere Funktionen zu bauen, die nicht zu viel Arbeit verrichten und  zur Wiederverwendbarkeit mehrfach gebraucht werden können. So muss JavaScript eine Funktion die er bereits einmal evaluiert hat nicht unnötigerweise nochmals bearbeiten und die Leistung für redundate Arbeite verbrauchen,.  gebraucht ist nicht nochmal zu auswerten, sondern direkt wiede 





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

\*\*\*\*



Unsere Konstruktionen aus dem Lambda Kalkül bringen folgende Vorteile mit sich:

* Die Verwendung von unveränderlichen Datenstrukturen reduziert Fehler im Code, in dem sie geschützt ist vor Manipulation.
* Reine Funktionen sind wartbarer und erhöhen die Leserlichkeit von Code.
* Die funktionalen Konstruktionen sind einfach zu Testen.
* Funktions-Komposition ist ein sehr mächtiges Werkzeug, weil dadurch rasch nützliche neue Konstruktionen entstehen.

