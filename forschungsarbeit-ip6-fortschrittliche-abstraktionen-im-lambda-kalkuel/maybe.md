---
description: Villeicht ist ein Wert vorhanden
---

# Maybe

## Beschreibung

### Maybe Type

Der Maybe Type baut auf dem Either Type auf und kommt aus der Welt der funktionalen Programmiersprachen. Der Maybe Type ist ein polymorpher Typ, der auch \(wie der Either Type\) zwei Zustände annehmen kann. Die Zustände sind: es existiert ein Wert, dass wird mit `Just(value)` ausgedrückt oder es existiert kein Wert und dass wird mit `Nothing` ausgedrückt.

Beispiel Szenario:

Wenn eine Funktion, in einer übergebenen Datenstruktur ein Element anhand einer bestimmten Eigenschaft sucht und ein solches Element existiert nicht, dann kann diese Funktion ein `Nothing` zurückgeben. Dies hat mehrere Vorteile: Der Anwender weiss zu Beginn, dass diese Funktion nur "vielleicht" einen Wert zurück liefert und ist somit auch gezwungen, den Fall zu berücksichtigen wenn kein Wert vorhanden ist.

Durch den Maybe Type kann eleganter auf fehlende, abwesende Werte reagiert werden und dies nur mit Hilfe von pure Functions ohne Seiteneffekte.

Maybe Implementation:

```javascript
// either type
const Left   = x => f => _ => f (x);
const Right  = x => _ => g => g (x);

// maybe type
const Nothing  = Left();
const Just     = Right ;
```

Anhand der Implementation von `Just` und `Nothing` ist erkenbar, dass der Maybe Type auf dem Either Type basiert. Just ist der Fall bei dem ein Wert vorhanden ist. Dem Just "Konstruktor" kann ein Wert übergeben werden. Nothing ist der Fall bei dem kein Wert vorhanden ist.

## Verwendung

### Allgemeine Anwendung für Funktionen, die ein `maybe` zurückgeben

Bei Funktionen, die ein maybe zurückgeben können an den Funktionsaufruf 2 weitere Parameter übergeben werden. Der erste Parameter ist eine Funktion, die keinen Parameter entgegen nimmt und dann Nothing Fall behandelt. Der zweite Parameter ist eine Funktion für den Just Fall, die das Resultat entgegen nimmt.

Allgemeines Schema:

Eine maybe Funktion XYZ wird mit einem oder mehreren Parametern aufgerufen. Am Schluss vom Funktionsaufruf werden 2 Funktionen übergeben. Eine Funktion für den Nothing Fall und eine für den Just Fall.

```javascript
// Anwendung        
maybeXYZ(someParam)
    (()     => doSomethingInNothingCase(error))    // Nothing Case
    (result => doSomethingInJustCase(result))      // Just Case
```

### getOrDefault

Die `getOrDefault` Funktion erwartet ein Maybe und einen default Wert. Der default Wert wird zurückgegeben falls maybe von Typ Nothing ist.

```javascript
// Implementation
const getOrDefault = maybe => defaultVal =>
    maybe
        (() => defaultVal)
        (id);
   
// Anwendung     
const result1 = getOrDefault ( Just(10) )(20) // 10
const result2 = getOrDefault ( Nothing  )(20) // 20
```

### maybeDivision

Die Funktion maybeDivision führt "villeicht" eine Division mit 2 übergeben Parametern durch. Falls die übergeben Zahlen vom Typ Integer sind und der Divisor nicht 0 ist wird die Division durchgeführt und es wird Just mit dem Resultat zurückgegeben.

```javascript
const maybeDivision = dividend => divisor =>
    Number.isInteger(dividend) &&
    Number.isInteger(divisor) &&
    divisor !== 0
        ? Just(dividend / divisor)
        : Nothing;
```

### maybeTruthy

Diese Funktion nimmt einen Wert entgegen und überprfüt ob dieser truthy ist. Falls nicht wird ein Nothing zurückgegeben.

{% hint style="info" %}
[Liste mit JavaScript falsy Werten](https://developer.mozilla.org/en-US/docs/Glossary/Falsy).
{% endhint %}

```javascript
const maybeTruthy = value =>
    eitherTruthy(value)
        (_ => Nothing)
        (_ => Just(value));
```

### maybeDomElement

Diese Funktion nimmt eine Dom-Element-Id als String entgegen. Wenn ein Element mit dieser Id im DOM existiert wird ein Just mit diesem HTML-Element zurückgegeben ansonsten Nothing.

```javascript
const maybeDomElement = elemId =>
    eitherDomElement(elemId)
        (_ => Nothing)
        (e => Just(e));
```

### maybeNumber

Diese Funktion nimmt einen Wert entgegen und prüft ob dieser vom Typ Integer \(JavaScript-Zahl\) ist. Falls es sich nicht um ein Wert vom Typ Integer handelt wird ein Nothing zurückgegeben.

```javascript
const maybeNumber = val =>
    eitherNumber(val)
        (_ => Nothing)
        (_ => Just(val));
```

### maybeFunction

Die `maybeFunction` Funktion überprüft ob ein Wert vom Typ _function_ ist.

```javascript
const eitherFunction = val =>
    typeof val === "function"
        ? Right(val)
        : Left(`'${val}' is not a function`);
```

### mapMaybe

Die Funktion `mapMaybe` wird verwendet um ein Maybe Type zu mappen. Die Funktion nimmt ein Maybe und eine mapping Funktion f entgegen. Die Funktion liefert das gemappte Maybe zurück.

```javascript
// Implementation
const mapMaybe = maybe => f => maybe (() => maybe) (x => Just(f(x)));

// Anwendung
mapMaybe( Just(10) ) (x => x * 4) // Just (40)
mapMaybe( Nothing )  (x => x * 4) // Nothing
```

### flatMapMaybe

Die Funktion `flatMapMaybe` wird verwendet um eine maybe Type zu mappen und anschliessen das Resultat abzuflachen.

```javascript
// Implementation
const flatMapMaybe = maybe => f => maybe (() => maybe) (x => f(x));

// Anwendung
flatMapMaybe( Just(10) )(num => Just(num * 2));    // Just (20)
flatMapMaybe( Just(10) )(num => Nothing      );    // Nothing
flatMapMaybe( Nothing  )(num => Just(num * 2));    // Nothing
```

