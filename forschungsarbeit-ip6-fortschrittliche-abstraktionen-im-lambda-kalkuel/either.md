# Either

## Beschreibung

### Either Type

Der Either Type wird häufig in funktionalen Programmiersprachen wie zum Beispiel Haskell oder Scala eingesetzt für das Error Handling. Der Either Type ist ein polymorpher Typ, der zwei Zustände anehmen kann. Für diese 2 Zustände gibt es die Wert- Konstruktoren `Left` und `Right`. Somit ist ein Either entweder ein `Left` oder ein `Right`. Left und Right tragen beide einen Wert mit sich. `Left` wird verwendet um im Fehlerfall die Fehlermeldung zu kapseln. `Right` wird verwendet um im Erfolgsfall den korrekten Wert zu kapseln. Durch den Either Type kann so elegant auf Fehler reagiert werden, dies in einer rein funktionalen Sprache,  d.h ohne Seiteneffekte \(wie zum Bespiel mit `throw` in Java\) und nur mit reinen Funktionen.

Either Type Implementation:

```javascript
const Left   = x => f => _ => f (x);
const Right  = x => _ => g => g (x);
```

Left und Right sind zwei Funktionen die jeweils einen Wert und 2 Funktionen entgegen nehmen. Beide Funktionen ignorieren eine der beiden übergebenen Funktionen. Die Left Funktion wendet die linke \(erste übergebene\) Funktion auf den Parameter x an und ignoriert die zweite Funktion. Die Right Funktion wendet die rechte \(zweite übergebene\) Funktion auf den Parameter x an und ignoriert die erste Funktion. Left und Right bilden die Basis für einen weiteren Typ, den [Maybe Type](maybe.md).

Beispiel Anwendung:

## Verwendung

Die folgenden Funktion geben alle ein Either zurück und unterstüzen so eine saubere Fehlerbehandhlung mit pure Functions ohne Seiteneffekte. Somit können typische Fehler die zum Beispiel auftreten wenn Werte `null` oder `undefined` sind vermieden werden. Eine Funktion die ein Either zurückliefert hilft dem Anwender an den Fehlerfall zu denken und diesen zu behandeln.

### Allgemeine Anwendung für Funktionen, die ein `either` zurückgeben

Bei Funktionen, die ein either zurückgeben können an den Funktionsaufruf 2 weitere Parameter übergeben werden. Der erste Parameter ist eine Funktion die eine Fehlermeldung entgegen nimmt und dann eine Fehlerbehandlung durchführt. Der zweite Parameter ist eine Funktion für den Erfolgsfall, die das Resultat entgegen nimmt.

Allgemeines Schema:

Eine either Funktion XYZ wird mit einem oder mehreren Parametern aufgerufen. Am Schluss vom Funktionsaufruf werden 2 Funktionen übergeben. Eine Funktion für den Fehlerfall \(Left Case\) und eine für den Erfolgsfall \(Right Case\).

```javascript
// Anwendung        
eitherXYZ(someParam)
    (error => doSomethingInErrorCase(error))      // Left Case
    (result => doSomethingInSuccessCase(result))  // Right Case
```

In diesem Beispiel tritt der Fehlerfall ein und die Funktion `doSomethingInErrorCase(error)` wird aufegrufen. Der Erfolgsfall bzw. die Funktion `doSomethingInSuccessCase(value)` wird ignoriert.

### eitherTruthy

Die **eitherTruthy** Funktion erwartet einen Wert und überprüft ob dieser truthy ist.  Im Erfolgsfall wird ein Right mit dem Element zurückgegben und im Fehlerfall ein Left mit der entsprechenden Fehlermeldung.

{% hint style="info" %}
[Liste mit JavaScript falsy Werten](https://developer.mozilla.org/en-US/docs/Glossary/Falsy).
{% endhint %}

```javascript
const eitherTruthy = value =>
    value
        ? Right(value)
        : Left(`'${value}' is a falsy value`);
```

### eitherNotNullAndUndefined

Die **eitherNotNullAndUndefined** Funktion erwartet einen Wert und überprüft ob dieser nicht **null** oder **undefined** ist.

```javascript
// Implementation
const eitherNotNullAndUndefined = value =>
    value !== null && value !== undefined
        ? Right(value)
        : Left(`element is '${value}'`);
```

### eitherElementOrCustomErrorMessage

Die eitherElementOrCustomErrorMessage Funktion erwartet eine Fehlermeldung und ein Element. Die Funktion überprüft das Element auf `null` oder `undefined` und gibt entweder ein `Right` mit dem Wert oder ein `Left` mit der übergebenen Fehlermeldung zurück.

```javascript
const eitherElementOrCustomErrorMessage = errorMessage => element =>
    eitherNotNullAndUndefined(element)
        (_ => Left(errorMessage))
        (_ => Right(element));
        
eitherElementOrCustomErrorMessage("Der Wert ist Null")(null); // Left ("Der Wert ist null")
```

### eitherDomElement

Die eitherDomElement Funktion nimmt eine Dom-Element-Id entgegen und gibt ein Either Type zurück. Im Erfolgsfall wird das Dom-Element zurückgegeben sonst eine Fehlermeldung, dass ein solches Element nicht existiert.

```javascript
const eitherDomElement = elemId =>
    eitherElementOrCustomErrorMessage
        (`no element exist with id: ${elemId}`)
        (document.getElementById(elemId));
```

### eitherNumber

Die eitherNumber Funktion überprüft ob ein Wert vom Typ Integer ist.

```javascript
const eitherNumber = val =>
    Number.isInteger(val)
        ? Right(val)
        : Left(`'${val}' is not a integer`);
```

### eitherNaturalNumber

Die eitherNaturalNumber Funktion überprüft ob der übergebene Wert eine natürliche Zahl ist.

```javascript
const eitherNaturalNumber = val =>
    Number.isInteger(val) && val >= 0
        ? Right(val)
        : Left(`'${val}' is not a natural number`);
```

### eitherFunction

Die eitherFunction Funktion überprüft ob ein Wert vom Typ function ist.

```javascript
const eitherFunction = val =>
    typeof val === "function"
        ? Right(val)
        : Left(`'${val}' is not a function`);
```

### eitherTryCatch

Die eitherTryCatch Funktion nimmt eine Funktion f entgegen, die schief gehen könnte. Diese Funktion wird in einem try-catch Block ausgeführt. Wenn ein Fehler auftritt während der Funktionsausführung wird dieser gefangen und es wird ein Left mit der Fehlermeldung zurückgegeben, ansonsten ein Right mit dem Resultat.

{% hint style="info" %}
Diese Funktion hat den Zweck bestehende JavaScript Funktionen die noch auf die nicht funktionale Art Fehler mit `throw` werfen abzufangen und diese in die Welt der funktionalen Programmierung einzubetten. Somit fungiert diese Funktion als Brücke von der JavaScript Welt in die Welt der funktionalen Programmiersprachen.
{% endhint %}

```javascript
const eitherTryCatch = f => {
    try {
        return Right(f());
    } catch (error) {
        return Left(error);
    }
}
```

### eitherElementsOrErrorsByFunction

```javascript
const eitherElementsOrErrorsByFunction
```







