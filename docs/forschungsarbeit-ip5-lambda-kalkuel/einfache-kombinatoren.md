# Einfache Kombinatoren

### Beschreibung

Folgende Konstruktionen dienen als Grundbausteine für unsere späteren Implementation. Diese Grundbausteine kommen zum Teil aus dem Lambda Kalkül.

### Wichtige Funktionen \(Grundbausteine\)

#### Die Identitätsfunktion

Die Identitätsfunktion nimmt einen Wert entgegen und gibt diesen wieder zurück.

Implementation:

```javascript
const id = x => x;
```

Beispiele:

```javascript
id(10);           // 10
id(I);            // I
id("Hello");      // "Hello"
```

#### Die Konstante Funktion \(Kestrel\)

Die Konstante Funktion nimmt zwei Paramter entgegen und gibt den ersten wieder zurück.

```javascript
const K = x => y => x;
```

Beispiele:

```javascript
K(1)(2);        // 1
K(8)(3);        // 8
K('q')('t');    // 'q'
```

#### Kite



