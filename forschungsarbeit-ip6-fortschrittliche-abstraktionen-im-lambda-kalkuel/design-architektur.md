# Code Convention

## Naming

Im allgemeinen setzen man auf sprechende Namen, sodass die Funktionen selbsterklärend sind.

Bei Abfragefunktionen, mit welcher der Anwender einen Wert anfordert, gibt der jeweilige Präfix des Funktionsnamens Aufschluss, von welchem Typ der Rückgabewert sein wird.

### get-Präfix

Funktionen die mit einem **get** beginnen, geben wenn möglich den gewünschten Wert ansonsten ein _undefined_ zurück mit einem Error-Log auf der Konsole. 

> Funktion:     **get**XYZ  
> Ergebnis:     **Wert** oder _**undefined**_  ****\(inkl. console.error  \)

Beispiele: [getElementByIndex](immutable-stack-erweiterungen.md#getelementbyindex), [getIndexOfElement](immutable-stack-erweiterungen.md#getindexofelement), getDomElement, 

### maybe-Präfix

Funktionen die mit einem **maybe** beginnen, geben im Erfolgsfall ein [`Just`](maybe.md#maybe-type) mit den gewünschten Wert, ansonsten ein [`Nothing`](maybe.md#maybe-type) zurück.

> Funktion:      **maybe**XYZ  
> Ergebnis:     **Just\(Wert\)** oder **Nothing**

Beispiele: [maybeDivision](maybe.md#maybedivision), [maybeTruthy](maybe.md#maybetruthy), [maybeDomElement](maybe.md#maybedomelement), [maybeNumber](maybe.md#maybenumber)

### either-Präfix

Funktionen die mit einem **either** beginnen, geben im Erfolgsfall ein [`Right`](either.md#either-type) mit dem Resultat, ansonsten ein [`Left`](either.md#either-type) mit einer Fehlermeldung zurück.

> Funktionen: **either**XY   
> Ergebnis:     **Left\(Fehlerbehandlung\)** oder **Right\(Wert\)**

Beispiele: [eitherTruhty](either.md#eithertruthy), [eitherNotNullAndUndefined](either.md#eithernotnullandundefined), [eitherDomElement](either.md#eitherdomelement), [eitherNumber](either.md#eithernumber), [eitherFunction](either.md#eitherfunction)

## Variablen Deklaration

Alle Konstruktionen sind mit dem Keyword `const` definiert. Somit können diese Variablen nicht überschrieben/verändert werden.

## Konstruktionen

### Konstante Konstrukte

Bei Konstruktionen soll darauf geachtet werden, dass diese aus reinen Funktionen bestehen.

### Die Brücken zwischen λ und JS

Objekte und Arrays werden nicht verwendet. Ausnahme sind Funktionen die als Brücke zwischen den Welten Lambda Kalkül und JavaScript dienen.   
Beispiel sind die _Convert_-Funktionen: [convertArrayToStack](../forschungsarbeit-ip5-lambda-kalkuel/immutable-stack.md#convertarraytostack), [converStackToArray](../forschungsarbeit-ip5-lambda-kalkuel/immutable-stack.md#convertstacktoarray), converElementsToStack, [converObjectToListMap](listmap.md#convertobjtolistmap), [convertListMapToArray ](listmap.md#convertlistmaptoarray)etc.

Und die Umwandlungs-Funktionen zwischen Church- und JavaScript-Zahlen: [jsNum](../forschungsarbeit-ip5-lambda-kalkuel/church-encodings-zahlen-und-boolesche-werte.md#jsnum), [churchNum](../forschungsarbeit-ip5-lambda-kalkuel/church-encodings-zahlen-und-boolesche-werte.md#churchnum)

## Formatierung

Mit dem Anwenden der Konstruktionen kommt zu keine Zuweisungen auf jeder Zeile, wie man es von der Prozentualen- oder OOP-Programmiersprachen kennt, sondern zu einer Verkettung von Funktionen. Bei diesen Funktionskompositionen kann schnell die Übersicht verloren gehen. Richtiges formatieren der Funktionen mit Zeilenumbrüche,  Einrückungen und Leerzeichen sind daher sehr wichtig und JavaScript ist dabei ziemlich unempfindlich. So darf der Code schön arrangiert werden, denn gut ausgerichteter Code fördert die Leserlichkeit immens.

### Workflow-Beispiel

Gegeben ist ein nicht formatierter Code: Ein Observable mit ein paar Listeners die hinzugefügt werden. Es ist schwer auf einem Blick zu sehen wieviel und welche Listener es sind.

```javascript
const textInputObservables = Observable("")(addListener)(listenerNewValue)(addListener)(listenerOldValue)(addListener)(listenerNewValueSize)(addListener)(listenerConsoleLog)
```

#### Schritt 1: Zeilenumbrüche 

> Wir sind gewohnt das Codes auf jeder Zeile immer linksbündig ausgerichtet sind. Diese Struktur wird hier neu definiert.  Wenn bei einer Funktion es zu mehrere Funktionsverknüpfungen mit Wertübermittlung kommt, ist es empfehlenswert diese Aufrufe untereinander zu schreiben.

```javascript
const textInputObservables = Observable("")
(addListener)(listenerNewValue)
(addListener)(listenerOldValue)
(addListener)(listenerNewValueSize)
(addListener)(listenerConsoleLog)
```

#### Schritt 2: Einrücken

> Einrücken der Funktion unterhalb der Haupt-Funktion in einer Linie plus einem Leerschlag, mach es erkennbarer, dass sie zueinander gehören und darauf aufbauen.

```javascript
const textInputObservables = Observable("")
                              (addListener)(listenerNewValue)
                              (addListener)(listenerOldValue)
                              (addListener)(listenerNewValueSize)
                              (addListener)(listenerConsoleLog)
```

#### Schritt 3: Leerzeichen \(Padding\)

> Es ist schöner und lesbarer, wenn es zwischen den Werten in den Klammern mindestens ein Leerzeichen gibt. Um allen Werten dieselbe Präsenz zu geben, ist es dabei empfehlenswert die Klammern auf einer Linie untereinander zu bringen.

```javascript
const textInputObservables = Observable("")
                              (addListener)( listenerNewValue     )
                              (addListener)( listenerOldValue     )
                              (addListener)( listenerNewValueSize )
                              (addListener)( listenerConsoleLog   )
```

#### Schritt 4: Semikolon

> JavaScript versucht zwar selber eine Semikolon am Ende einer Anweisung einzufügen, wenn der Programmierer keine gesetzt hat. Hier ist aber nicht klar, ob die Anweisung für JavaScript fertig ist, denn es wäre mittel Funktionskomposition möglich immer weitere Funktionen anzufügen. Es ist darum besser immer ein Semikolon zu setzen, nicht nur um JavaScript zu signalisieren, dass es hier zu ende ist, sondern auch für die Leserlichkeit.

```javascript
const textInputObservables = Observable("")
                              (addListener)( listenerNewValue     )
                              (addListener)( listenerOldValue     )
                              (addListener)( listenerNewValueSize )
                              (addListener)( listenerConsoleLog   );
```



### Vergleichsbeispiele

#### Listeners-Deklaration

```javascript
// unformatiert
const listenerNewValue = newListener(listenerNewValueToDomElementTextContent(newValue));
const listenerOldValue = newListener(listenerOldValueToDomElementTextContent(oldValue));
const listenerNewValueSize = newListener(listenerNewValueLengthToElementTextContent(sizes));
const listenerConsoleLog = newListener(listenerLogToConsole);

// formatiert
const listenerNewValue     = newListener( listenerNewValueToDomElementTextContent    (newValue) );
const listenerOldValue     = newListener( listenerOldValueToDomElementTextContent    (oldValue) );
const listenerNewValueSize = newListener( listenerNewValueLengthToElementTextContent (sizes)    );
const listenerConsoleLog   = newListener( listenerLogToConsole                                  );
```

#### ForEach

```javascript
// unformatiert
forEach(jokes)((joke, _) => getElementByKey(joke)("btn").onclick = _ => HttpGet(getElementByKey(joke)("url"))(resp => jokePairObserver(setValue)(Box(resp)(mapf)(JSON.parse)(fold)(x => pair(getElementByKey(joke)("name"))(x[getElementByKey(joke)("jsonKey")])))));

// formatiert
forEach(jokes)( (joke, _) =>
    getElementByKey(joke)("btn").onclick = _ =>
        HttpGet( getElementByKey(joke)("url") )( resp =>
            jokePairObserver(setValue)( Box(resp)
                                         (mapf)( JSON.parse )
                                         (fold)( x => pair( getElementByKey(joke)("name") )( x[getElementByKey(joke)("jsonKey")] )))));
```

#### Box

```javascript
// unformatiert
const nextCharForNumberString = str =>Box(str)(chain)(s => Box(s)(mapf)(s => s.trim()))(mapf)(r => parseInt(r))(mapf)(i => i + 1)(mapf)(i => String.fromCharCode(i))(fold)(c => c.toLowerCase())

// formatiert
const nextCharForNumberString = str =>
    Box(str)
     (chain)(s => Box(s)
                   (mapf)(s => s.trim()))
     (mapf)(r => parseInt(r))
     (mapf)(i => i + 1)
     (mapf)(i => String.fromCharCode(i))
     (fold)(c => c.toLowerCase());
```

## JS Doc











