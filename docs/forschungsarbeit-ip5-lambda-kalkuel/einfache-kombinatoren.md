# Einfache Kombinatoren

## Beschreibung

Folgende Konstruktionen dienen als Grundbausteine für unsere späteren Implementation. Diese Grundbausteine kommen zum Teil aus dem Lambda Kalkül.

## Wichtige Funktionen \(Grundbausteine\)

### id - Die Identitätsfunktion

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

### 

### Kestrel - Die Konstante Funktion 

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

#### 

### Kite

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

### 

### Mockingbird

Der Mockingbird nimmt einen Funktion entgegen und wendet die Funktion auf sich selber an. \(English: self-application\)

Implementation:

```javascript
const M = f => f(f);
```

Beispiele:

```javascript
M(id);        // id
M(id)(5);     // 5
M(M);         // stack overflow
```

### 

### Cardinal \(Flip\) - Vertauschungsfunktion

Die Vertauschungsfunktion nimmt eine Funktion und zwei Argumente entgegen und wendet die Argumente in Vertauschter- Reihenfolge auf die übergebene Funktion an.

Implementation:

```javascript
const C = f => x => y => f(y)(x);
```

Beispiel:

```javascript
const diff = x => y => x - y;

C(diff)(2)(3);        //  1
C(diff)(3)(2);        // -1
```

### 

### Bluebird - Funktionskomposition

Der Bluebird nimmt zwei Funktionen und ein Argument entgegen. Zuerst wendet der Bluebird das Argument auf die zweite Funktion an und das Resultat wird auf die erste Funktion angewendet. Der Bluebird funktioniert gleich wie die Funktionskomposition in der Mathematik .

Implementation:

```javascript
const B = f => g => x => f(g(x));
```

Beispiele:

```javascript
    const f = x => x + 1;
    const g = x => x * 2;
    
    B(f)(g)(4);                  // 9
    B(g)(f)(4);                  // 10
    B(id)(id)(5);                // 5
```

### 

### Trush

Der Trush nimmt ein Argument und eine Funktion entgegen. Dieses Argument wendet der Trush auf die übergebene Funktion an.

Implementation:

```javascript
const T = x => f => f(x);
```

Beispiele:

```javascript
const f = x => x + 1;

T(2)(f);                    // 3
T(2)(id);                   // 2 
```

### 

### Vireo

Der Vireo ist eine Funktion, die zwei Argumente und eine Funktion entgegen nimmt. Die Funktion wendet die zwei übergebenen Argumente auf die übergebene Funktion an. Der Vireo ist gleichzeitig eine unveränderliche Datenstruktur, siehe [Pair](einfache-kombinatoren.md#pair).

Implementation:

```javascript
const V = x => y => f => f(x)(y);
```

### 

### Pair

Das Pair ist eine unveränderliche Datenstruktur bestehend aus zwei Elementen. Mit sogenannten "getter"-Funktionen kann auf diese Werte zugegriffen werden. Für beide Werte des Pairs gibt es eine "getter"-Funktion. Für den ersten Wert des Pairs gibt es die Funktion fst \(first\), für den zweiten Wert gibt es die Funktion snd \(second\). Für das Pair und die dazugehörigen getter muss nichts neues implementiert werden, sondern es können dafür bereits bestehende Funktionen \(Grundbausteine\) verwendet werden. Das Pair ist gerade der [Vireo](einfache-kombinatoren.md#vireo). Die fst-Funktion ist gerade die [Konstante Funktion](einfache-kombinatoren.md#kestrel-die-konstante-funktion). Die snd-Funktion ist gerade der [Kite](einfache-kombinatoren.md#kite).

Implementation :

```javascript
const pair    =    V;    // immutable datastructure pair

const fst     =    K;    // get first element from pair
const snd     =   KI;    // get second element from pair
```

Beispiele:

```javascript
    const pairOfNumbers = pair(1)(2);
    const pairOfStrings = pair("Hello")("World");
    
    pairOfNumbers(fst);        // 1
    pairOfNumbers(snd);        // 2
    
    pairOfStrings(fst);        // "Hello"
    pairOfStrings(snd);        // "World"
```

### 

### MapPair

Die Funktion mapPair nimmt eine map-Funktion und ein Pair entgegen. Die Funktion gibt ein neues Pair mit den gemappten Werten zurück.

Implementation:

```javascript
const mapPair = f => p => pair(f(p(fst)))(f(p(snd)));
```

Beispiele:

```javascript
const mapFunction = x => x * 2;
const pairOfNNumbers = pair(5)(6);

const mappedPair = mapPair(mapFunction)(pairOfNNumbers); // pair(10)(12)
```

### 

### ShowPair

Die Funktion nimmt ein Pair entgegen und gibt die String Representation des Pairs zurück.

Implementation:

```javascript
const showPair = p => `${p(fst)} | ${p(snd)}`;
```

Beispiele:

```javascript
const pairOfNNumbers = pair(5)(6);

const stringOfPair = showPair(pairOfNNumbers); // '5 | 6'
```

### 

### Triple

Das Triple ist eine unveränderliche Datenstruktur bestehend aus drei Elementen. Mit sogenannten "getter"-Funktionen kann auf diese Werte zugegriffen werden. Für alle Werte des Triple gibt es eine "getter"-Funktion. Ein Triple ist fast wie ein Pair, nur hat es einen Wert mehr.

Implementation:

```javascript
const triple = x => y => z => f => f(x)(y)(z);
```

Beispiele:

```javascript
// getter functions of triple
const firstOfTriple = x => y => z => x;
const secondOfTriple = x => y => z => y;
const thirdOfTriple = x => y => z => z;

// triple with 3 numbers
const tripleOfNumbers = triple(1)(2)(3);

tripleOfNumbers(firstOfTriple);         // 1
tripleOfNumbers(secondOfTriple);        // 2
tripleOfNumbers(thirdOfTriple);         // 3
```

### 

### Blackbird

Der Blackbird ist eine Funktion, die zwei Funktionen und zwei Argumente entgegennimmt. Die zweite Funktion wird auf die zwei übergebenen Argumente angewendet, das Ergebnis wird auf auf die erste Funktion angewendet. Der Blackbird hat ähnlichkeiten mit dem Bluebird.

Implementation:

```javascript
const Blackbird = f => g => x => y => f(g(x)(y));
```

Beispiele:

```javascript
const add = x => y => x + y;
const multiplyWithTwo = x => x * 2;

Blackbird(multiplyWithTwo)(add)(2)(3);      // 10
Blackbird(multiplyWithTwo)(add)(10)(20);    // 60
```



## Church-Boolean

### True & False

Alonzo Church hat einen Weg gefunden um boolesche Logik mit Funktionen auszudrücken. True kann durch die Funktion [Kestrel](einfache-kombinatoren.md#kestrel-die-konstante-funktion) ausgedrückt werden. False kann durch die Funktion [Kite](einfache-kombinatoren.md#kite) ausgedrückt werden.

Implementation

```javascript
const True  = K;
const False = KI;
```

### 

### Not

Der boolesche not Operator kann mit der Funktion [Cardinal](einfache-kombinatoren.md#cardinal-flip-vertauschungsfunktion) ausgedrückt werden.

Implementation & Beispiele:

```javascript
const not = C;

not(True);         // False (Function)
not(False);        // True  (Function)
not(not(True));    // True  (Function)
```



### And

Die And-Funktion nimmt zwei Church-Booleans entgegen und liefert ein Church-Boolean zurück. Die Funktion funktioniert genau gleich wie der and-Operator in der mathematischen Logik.

Implementation:

```javascript
const and = p => q => p(q)(False);
```

Beispiele:

```javascript
and(True)(True)         // True
and(False)(True)        // False
and(True)(False)        // False
and(False)(False)       // False
```

### 

### Or

Die Or-Funktion nimmt zwei Church-Booleans entgegen und liefert ein Church-Boolean zurück. Die Funktion funktioniert genau gleich wie der or-Operator in der mathematischen Logik. 

Implementation:

```javascript
const or = p => q => p(True)(q);
```

Beispiele:

```javascript
or(True)(True)         // True
or(False)(True)        // True
or(True)(False)        // True
or(False)(False)       // False
```

### 

### Boolean Equality

Diese Funktion nimmt zwei Church-Booleans entgegen und vergleicht diese miteinander. Nur wenn beide gleich sind, gibt die Funktion ein Church-True zurück, sonst ein Church-False.

Implementation:

```javascript
const beq = p => q => p(q)(not(q));
```

Beispiele:

```javascript
beq(True)(True)         // True
beq(False)(True)        // False
beq(True)(False)        // False
beq(False)(False)       // True
```

### 

### Show Boolean

Die Funktion showBoolean ist eine Helferfunktion um eine String Representation, eines Church-Boolean zu erhalten. Die Funktion nimmt ein Church-Boolean entgegen und gibt die String Representation davon zurück.

Implementation:

```javascript
const showBoolean = b => b("True")("False");
```

Beispiele:

```javascript
showBoolean(True);        // 'True'
showBoolean(False);       // 'False'
```

### 

### Connvert to js Bool

Die Funktion convertToJsBool nimmt ein Church-Boolean entgegen und liefert die JavaScript Representation davon zurück.

Implementation:

```javascript
const convertToJsBool = b => b(true)(false);
```

Beispiele:

```javascript
convertToJsBool(True)        // true
convertToJsBool(False)       // false
```

