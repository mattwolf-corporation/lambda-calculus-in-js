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

Implementation:

```javascript
const K = x => y => x;
```

Beispiele:

```javascript
K(1)(2);         // 1
K(8)(id);        // 8
K('q')('t');     // 'q'
```

#### Kite

Der Kite ist eine Funktion, die zwei Parameter entgegennimmt und den zweiten Parameter zurückgibt.

Implementation:

```javascript
const KI = x => y => y;
```

Beispiele:

```javascript
KI(1)(2);                // 2
KI(id)(3);               // 3
KI("Hello")("World");    // "World"
```

#### Mockingbird



