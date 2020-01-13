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

Beispiel:

```javascript
const stackWithOneValue = push(emptyStack)(1);
```



