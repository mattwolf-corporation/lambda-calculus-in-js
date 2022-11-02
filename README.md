---
description: Benjamin Brodwolf & Pascal Andermatt
---

# Lambda Kalkül für praktisches JavaScript

![](.gitbook/assets/repoimage.png)

### Was ist Lambda Kalkül?

_Lambda Kalkül_ ist ein formales System, in der mathematische Logik zur Berechnung und Untersuchung von Funktionen gilt. Es ist ein universelles Berechnungsmodel , mit dem jede Turing-Maschine simuliert werden kann. Es wurde von dem Mathematiker [Alonzo Church](https://en.wikipedia.org/wiki/Alonzo\_Church) in den 1930er Jahren als Teil seiner Forschung zu den Grundlagen der Mathematik eingeführt.

> Lambda-Kalkül hat im Grunde nichts in sich. Es hat nur drei Dinge: Variablenbindung, einen Weg, Funktionen zu bauen und einen Weg, Funktionen anzuwenden. Es hat keine anderen Kontrollstrukturen, keine anderen Datentypen, gar nichts.

### Was ist JavaScript?

JavaScript ist die Programmiersprache die hauptsächlich im Web verwendet wird und durch den Browser ausgeführt wird. JavaScript integriert dabei viele funktionale Aspekte, stellt aber auch einiges an Funktionalität aus der objektorientierten Programmierung zur Verfügung. Es besteht also die Möglichkeit, in vielen verschiedenen Paradigmen zu programmieren.

### Lambda Kalkül & JavaScript

JavaScript hat den Ruf, eine unsichere Programmiersprache zu sein. Man kann aber auch in JavaScript sichere und belastbare Konstruktionen mit Industriehärte bauen. Ein Weg dazu ist die Anwendung von Erkenntnissen aus den Grundlagen der Informatik, dem untypisierten Lambda-Kalkül. Das Konzept ist, Lambda Kalkül mit der Programmiersprache JavaScript zu verbinden. Das heisst, in nur rein [funktionalen Paradigma](https://de.wikipedia.org/wiki/Funktionale\_Programmierung) Program-Codes zu schreiben (purely functional). JavaScript bietet dazu Sprachelemente wie [Closures](https://developer.mozilla.org/de/docs/Web/JavaScript/Closures) und [Funktionen](https://developer.mozilla.org/de/docs/Web/JavaScript/Guide/Functions). Sie machen es möglich, dass in JavaScript funktional programmiert werden kann. Es gewährleistet die Konzepte der Seiteneffektfreiheit, Zustandslosigkeit, Variablenbindung statt Zuweisung, Funktionskomposition und Funktionen höherer Ordnung (high order functions) zu schreiben.

## Forschungsarbeit

Ziel dieser Forschungsarbeit ist es, neue Konstruktionen aus dem untypisierten Lambda Kalkül, mit der Programmiersprache JavaScript zu entwerfen. Diese Konstruktionen haben das Ziel JavaScript Applikationen robuster, sicherer und wartbarer zu machen. Bei diesen Konstruktionen wird komplett auf die Werte der reinen [funktionalen Programmierung](https://de.wikipedia.org/wiki/Funktionale\_Programmierung) gesetzt:

* **Reinheit** (_pure functions)_: Funktionen ohne Seiteneffekte (wie mathematische Funktionen)
* **Unveränderlichkeit** (_immutable Datastructure)_: \_\_ Unveränderliche Datenstrukturen
* **Iteration**: Eine Iteration ohne Ausdrücke wie _`for`_, _`while`_ oder `do` Schleifen
* **Fehlerbehandlung** ohne `throw` Ausdruck - Errorhandling mit [`Either`](either.md) ``oder [`Maybe`](forschungsarbeit-ip6-fortschrittliche-abstraktionen-im-lambda-kalkuel/maybe.md)``
* **Funktionen höherer Ordnung** (high order functions).
* **Zustandslosigkeit**

> **Abgrenzung von objektorientierter Programmierung:**\
> Es werden keine objektorientierte Konzepte wie Klassen oder Vererbung verwendet.

## Was du hier findest

Eine Sammlung von Konstruktionen heraus:

kleine Bibliothek von Lambda-Kalkül-Konstruktionen zusammengestellt ([Einfache Kombinatoren](einfache-kombinatoren.md))

* kleine Bibliothek von Lambda-Kalkül-Konstruktionen ([Einfache Kombinatoren](einfache-kombinatoren.md))
* Rechnen mit JavaScript- und mit [Church-Zahlen](church-encodings-zahlen-und-boolesche-werte.md#church-zahlen) inklusivem[ lambdafizierter Taschenrechner](der-lambdafizierter-taschenrechner.md)
* Eigene unveränderliche Datenstruktur ([die immutable Stack Datenstruktur](immutable-stack.md))
* [Immutable ListMap](listmap.md) Datenstruktur (Stack mit Schlüssel-Wert Paaren)
* Umsetzung des Observer Pattern ([funktionales Oberservable Konstrukt](observable.md))
* [Maybe ](maybe.md)und [Either](either.md) Type für Fehlerbehandlung
* [Box](box-maybebox.md)-Konstrukt um Werte in einer Pipeline zu verarbeiten
* Eignes [Test-Frameworks](test-framework.md) mit einer Zeitmessung für die Methodenausführung ([Benchmark-Test](performance.md))
* [JsDoc ](./#js-doc-unterstuetzung-fehlendes-typ-system-bei-javascript)(Dokumentation und Typ-Unterstützung für Anwender)
*   Code Convention (Konzepte, Formatierung und Anwendungsbeispiele)



### _Classic JS_ vs _Lambda JS_

#### Property Value aus Objekt extrahieren (null-safe)

**Gegeben:** Ein verschachteltes User-Objekt mit Street-Property.\
**Ziel:** Strassenname extrahieren

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

// Anwendungs Ziel
streetName(user) // "WALTSTREET"
```

#### Eine mögliche Implementierung im klassischen JavaScript _(ohne Optional Chaining)_ wäre:

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

#### Eine gleichwertige Implementierung mit Verwendung des Werkzeugkastens _(Lambda JS)_:

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

#### Vergleich

|                                   |               |             |
| --------------------------------- | ------------- | ----------- |
| Eigenschaften                     | _Classic JS_  | _Lambda JS_ |
| Variablen für Zwischenstände      | wird benötigt | keine       |
| Verschachtelung von If Statements | wird benötigt | keine       |
| Leserlichkeit/Lesefluss           | erschwert     | klarer      |
| Wartbarkeit                       | schlecht      | gut         |

### _Pure Lambda JS_ vs _Lambda JS_

Bereits eine kleine Funktion wie [`push`](immutable-stack.md#push) , die ein Stack mit einem neuen Wert erstellt , besteht im Kern aus mehreren Funktionen.

#### Die Implementation der Funktion `push` sieht wie folgt aus:

```javascript
const push = s => stack( succ( s(stackIndex) ) )(s);
```

Sie besteht aus folgenden Funktionen: `stack`, `succ`, `stackIndex` .Diese Funktionen können in der Funktion push durch ihre Implementation ersetzt werden:

`const stack = triple`

`const triple = x => y => z => f => f(x)(y)(z);`

`const succ = n => f => x => (f)(n(f)(x));`

`const stackIndex = firstOfTriple;`

`const firstOfTriple = x => y => z => x`;

#### Die Funktion `push` würde im reinen Lambda Kalkül _(pure Lambda JS)_ wie folgt aussehen:

```javascript
const push = s => (x => y => z => f => f(x)(y)(z))((n => f => x => (f)(n(f)(x)))(s(x => _ => _ => x)))(s)
```

#### Nach der Eta-Reduktion:

```javascript
const push = s => z => f => f( f => x => f( s(x => _ => _ => x)(f)(x) ))(s)(z);
```

Funktionen in JS im reinen Lambda Kalkül zu schreiben kann schnell unübersichtlich werden weil die Definitionen fehlen. Diese verschachtelten anonymen Funktion werden schnell zu komplex. Darum ist es besser dieses Funktionskonstrukt in mehreren Funktionen aufzuteilen und diesen einen sinnvollen Namen zu geben.

#### Beispiel an der grösseren Funktion `reduce`

#### Implementation von `reduce` in _Lambda JS_:

```javascript
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

#### Implementation in _pure Lambda JS_ (Funktionsdefinitionen ersetzt und ETA reduziert)

```javascript
// reduce in reinem Lambda Kalkül 
const reduce = reduceFn => initialValue => s => s(x => _ => _ => x)(t => t(x => _ => _ => x)(x => _ => _ => x)(_ => (_ => y => y))(x => _ => x)(t)((t => f => f(t(x => _ => _ => x)(_ => y => _ => y))(t(_ => y => _ => y))(t(_ => y => _ => y)(t(_ => _ => z => z))((t(x => _ => _ => x))(_ => _ => z => z))))(t)))(f => f(s(x => _ => _ => x)(t => t(x => _ => _ => x)(x => _ => _ => x)(_ => (_ => y => y))(x => _ => x)(t)((t => f => f(t(x => _ => _ => x)(_ => y => _ => y))(t(_ => y => _ => y))(t(_ => y => _ => y)(t(_ => _ => z => z))((t(x => _ => _ => x))(_ => _ => z => z))))(t)))(f => f(s)(acc => curr =>  f => f( f => x => f(s(x => _ => _ => x)(f)(x)))(acc)(curr))(f => f(_ => a => a)(x => x)(x => x)))(_ => _ => z => z))(reduceFn)(initialValue))(_ => _ => z => z);
```

Die Performance leidet wenn eine grössere, komplexere Funktion in einer reinen Lambda Kalkül Schreibweise definiert ist. Da es keine Definitionen gibt die wiederverwendet werden können muss viel mehr evaluiert werden in JavaScript. Darum ist es für die Performance und für die Leserlichkeit besser die Funktionen nicht in der reinen Lambda Kalkül Schreibweise zu definieren.

## Fazit / Erkenntnisse

#### Konzepte aus der funktionalen Programmierung

Die Konstruktionen beinhalten Ideen und Konzepte aus der funktionalen Programmierung. Mit dem Einsatz dieser Konstruktionen, können JavaScript Applikationen funktionaler implementiert werden. Die Konstruktionen sind so implementiert, dass sie leicht integrierbar und anwendbar sind. Ein JavaScript Programm muss dabei nicht komplett nur aus diesen Konstruktionen bestehen, sondern der Anwender kann hier und dort bestimme Konstrukte in sein Programm einfliessen lassen.

#### Nutzen & Vorteile

In mehreren kleinen Beispielen hat sich gezeigt, dass die Konstruktionen den Code leserlicher, wartbarer und sicherer machen. Ausserdem entstehen weniger typische Fehler, die bei der Programmierung mit JavaScript auftreten.

Da die Konstruktionen aus puren Funktionen bestehen, ist der Programmablauf klarer und Fehler können besser eingegrenzt werden. Bei veränderlichen Daten und Funktionen mit Seiteneffekten, leidet die Übersicht, man verliert die Kontrolle über den Programmablauf und den Abhängigkeiten innerhalb des Programmes. Schon durch einen kleinen Einsatz von diesen Konstruktionen wird diesem Problem entgegenwirkt und die Übersicht wird verbessert.

#### JS Doc Unterstützung - Fehlendes Typ System bei JavaScript

Ein wesentliches Ziel von Typisierung in Programmiersprachen ist die **Vermeidung von Laufzeitfehlern.** JavaScript ist eine _schwach typisierte_ oder _dynamische_ Programmiersprache. Datentypen werden bei einer Variable nicht explizit deklariert und jede Variable kann mit Werten jedes Typen initialisiert werden. Es gibt auch kein Compiler der die Typen überprüfen würde. Die JS Doc unterstützt den Anwender für die korrekte Verwendung der Funktionen. Mit der JS Doc bekommt der Anwender Hinweise auf die korrekten Typ-Parameter.

**‌‌Potenzielle Erweiterungen/Vorschläge für nächste Schritte**

* Für die unveränderlichen Datenstrukturen **Stack** und **ListMap** könnten zusätzliche Funktionen entwickelt werden, sodass ein noch grösseres Anwendungsgebiet entsteht.
* Mögliche Funktionen: findFirst, stream-artige Funktionen
* Weitere Konzepte der funktionalen Programmierung umsetzen

**Was kann verbessert werden?**

* Bei gewissen Funktionen könnte noch mehr Sicherheit eingebaut werden, sodass ungültige Parameter besser abgefangen werden
* Noch mehr Funktionen die auch ein Maybe/Either Type zurückgeben
* Mehr Funktionen mit aussagekräftigen Fehlermeldungen für den Verwender





Diese Arbeit erstanden aus einem Projekt (IP5) und der Bacherlorarbeit (IP6) an der [FHNW](https://www.fhnw.ch/):

* Benjamin Brodwolf [GitHub](http://github.com/BenjaminBrodwolf)
* Pascal Andermatt [GitHub](https://github.com/PascalAndermatt)

Herzlichen Dank an unseren Projektbetreuer und Inspirator [**Prof. Dierk König**](https://dierk.github.io/Home/)
