# Immutable Stack Erweiterungen

Folgende Funktionen sind neu zum Immutable Stack hinzugekommen.

{% hint style="danger" %}
Der Index bei einem Stack beginnt bei 1. Der Index 0 ist reserviert für den emptyStack. Am Index 0 steht immer das Element `id`.
{% endhint %}

{% hint style="info" %}
In den folgenden Beispielen wird zur besseren Übersicht, die Stack Datenstruktur wie folgt dargestellt:**`[ element1, element2, element3, ... ]`**
{% endhint %}

### removeByIndex

Die Funktion removeByIndex nimmt einen Stack entgegen und einen Index. Die Funktion löscht das Element am übergebenen Index.

```javascript
const stackWithStrings = convertArrayToStack(["Hello", "Haskell", "you", "Rock", "the", "World"]);

const result = removeByIndex(stackWithStrings)(2) // [ "Hello", "you", "Rock", "the", "World" ]
```

### concat

Die Funktion concat nimmt 2 stacks entgegen und konkateniert diese.

```javascript
const stack1  = convertArrayToStack(["Hello", "Haskell"]);
const stack2  = convertArrayToStack(["World", "Random"]);

const result = concat(stack1)(stack2); // [ "Hello", "Haskell", "World", "Random" ]
```

### flatten

Die Funktion flatten nimmt einen Stack entgegen, dessen Einträge Stacks sind. Die Funktion verknüpft diese alle zusammen zu einem Stack.

```javascript
const s1 = convertArrayToStack([1, 2]);
const s2 = convertArrayToStack([3, 4]);
const s3 = convertArrayToStack([5, 6]);

const stackWithStacks = convertArrayToStack([s1, s2, s3]); // [ [1, 2], [3, 4], [5, 6] ]

const result = flatten(stackWithStacks); // [ 1, 2, 3, 4, 5, 6]
```

### zipWith

Die zipWith Funktion nimmt eine Verknüpfungsfunktion und 2 Stacks entgegen. Anhand der Verknüpfungsfunktion werden die Elemente der beiden übergebenen Stacks paarweise miteinander verknüpft zu einem neuen Stack.

{% hint style="info" %}
Wenn einer der beiden übergebenen Stacks kürzer ist wird nur bis zum letzten Element des kürzeren Stacks verknüpft.
{% endhint %}

```javascript
const add = x => y => x + y;

const s1 = convertArrayToStack([1, 2]);
const s2 = convertArrayToStack([4, 5]);

const zippedStack = zipWith(add)(s1)(s2); // [ 5, 7 ]
```

### zip

Die zip Funktion nimmt zwei Stacks entgegen und verknüpft die beiden Stacks mit der Funktion `pair`.

{% hint style="info" %}
Wenn einer der beiden übergebenen Stacks kürzer ist wird nur bis zum letzten Element des kürzeren Stacks verknüpft.
{% endhint %}

```javascript
const s1 = convertArrayToStack([1, 2]);
const s2 = convertArrayToStack([3, 4]);

const zippedStack = zip(s1)(s2); // [ (1, 3), (2, 4) ]
```

### stackEquals

Die Funktion stackEquals nimmt zwei Stacks entegen und vergleicht alle Elemente mit dem JavaScript `===` Operator auf gleicheit. Wenn alle Vergleiche `true` ergeben, gibt die Funktion ein Church-Boolean `True` zurück ansonsten ein Church-Boolean `False`.

```javascript
const s1 = convertArrayToStack([1, 2]);
const s2 = convertArrayToStack([1, 2]);

const r1 = stackEquals(s1)(s2); // True (Church Boolean)
```

### getIndexOfElement

Die Funktion getIndexOfElement ..

```javascript
const ...
```

