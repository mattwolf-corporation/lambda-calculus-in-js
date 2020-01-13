# Immutable Stack

### Beschreibung

Der Stack ist eine rein funktionale Datenstruktur und daher unveränderlich. Der Stack ist als [Tripel](einfache-kombinatoren.md) implementiert. Ein Tripel ist eine weitere rein funktionale Datenstruktur, die drei Werte hält. Über "getter"-Funktionen kann auf diese Werte des Tripels zugegriffen werden. Der erste Wert des Tripels stellt die Größe \(Anzahl der Elemente\) des Stacks dar. Gleichzeitig repräsentiert der erste Wert, den Index des Kopfes \(oberster Wert\), des Stacks. Die Grösse/der Index, des Stacks wird als Church-Zahl angegeben. Der zweite Wert repräsentiert den Vorgänger-Stack. Der dritte Wert stellt den Kopf \( oberster Wert \) des Stacks dar.

Stack Implementation:

```javascript
const stack = x => y => z => f => f(x)(y)(z);
```

Zur späteren Verwendung von einem Stack wird der leere Stack als Grundbaustein benötigt. Der leere Stack hat die Grösse/ den Index Null. Der leere Stack hat keinen Vorgänger, stattdessen hat er die [Identitätsfunktion](einfache-kombinatoren.md) als Platzhalter. Ausserdem bestitzt der leere Stack keinen Kopf \(oberster Wert\), sondern hat als Platzhalter die [Identitätsfunktion](einfache-kombinatoren.md). 

Implementation des leeren Stacks:

```javascript
const emptyStack = stack(n0)(id)(id);
```

### Verwendung

Um einen Stack zu erstellen fügt man Elemente, dem leeren Stack hinzu. Dafür gibt es die Push-Funktion. Die Push-Funktion nimmt einen Stack und einen Wert entgegen. Der übergebene Wert, wird auf den übergegebenen Stack hinzugefügt.

Beispiel push:

```javascript
const stackWithOneValue = push(emptyStack)(1);
```

Nun besitzt der Stack von oben den Wert 1.

Um den obersten Wert vom Stack zu entfernen gibt es die pop-Funktion. Die pop-Funktion gibt ein [Pair](einfache-kombinatoren.md) zurück. Dieses Pair besteht aus dem vorgänger-Stack und dem Wert, der vom Stack entfernt wurde. Mit den ["getter"-Funktionen für Pairs](einfache-kombinatoren.md), kann auf die Werte zugegriffen werden.

Beispiel pop:

```javascript
const resultPair = pop(stackWithOneValue); 

const predecessorStack = resultPair(fst);    // empty stack
const poppedValue = resultPair(snd);         // 1    
```

### Weitere Funktionen

Um auf den auf die Grösse eines Stacks zuzugreifen gibt es die Funktion size. Diese Funktion nimmt einen Stack entgegen und gibt die Grösse, des Stacks als Church-Zahl zurück.

Beispiel:

```javascript
const sizeOfStack = size(stackWithOneValue); // n1
```

Um auf den Kopf \(oberster Wert\) des Stacks zuzugreifen gibt es die Funktion head. Diese Funktion nimmt ein Stack entgegen und gibt den Kopf des Stacks zurück.

Beispiel:

```javascript
const headValue = head(stackWithOneValue); // 1
```

Die Funktion hasPre nimmt einen Stack entgegen und gibt ein Church-Boolean zurück, der aussagt ob der übergegebene Stack einen Vorgänger hat oder nicht.

Beispiel:

```javascript
const result = hasPre(stackWithOneValue); // false (as church-boolean)
```

### Element per Index holen

Die Funktion getElementByIndex nimmt einen Stack und eine Church-Zahl, die den Index des Elements, repräsentiert entgegen. Falls an diesem Index ein Element existiert, wird dieses zurückgegeben.

Beispiel:

```javascript
const stackWithTwoElements = push(push(emptyStack)("Hello"))("World");
const element = getElementByIndex(stackWithTwoElements)(n1); // "World"
```

Die Funktion getElementByJsnumIndex nimmt einen Stack und einen Index \(normale Zahl\) entgegen. Falls an diesem Index ein Element existiert, wird dieses zurückgegeben.

```javascript
const element = getElementByJsnumIndex(stackWithTwoElements)(1); // "Hello"
```

### Stack zu einem Array konvertieren und umgekehrt

Die Funktion convertStackToArray nimmt einen Stack entgegen und gibt einen Array mit denselben Elementen zurück.

Beispiel:

```javascript
const stackWithTwoElements = push(push(emptyStack)(1))(2);
const arrayWithTwoElements = convertStackToArray(stackWithTwoElements); // [1, 2] 
```

Die Funktion convertArrayToStack nimmt einen Array entgegen und gibt einen neuen Stack mit den Elementenn vom übergebenen Array zurück.

Beispiel:

```javascript
const array = [1, 2, 3];
const stack = convertArrayToStack(array); // stack with 3 elements: 1, 2, 3
```



