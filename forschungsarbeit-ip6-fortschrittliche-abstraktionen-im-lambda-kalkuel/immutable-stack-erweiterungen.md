# Immutable Stack Erweiterungen

Die Funktionen auf dieser Seite sind neu zum Immutable Stack hinzugekommen.

{% hint style="danger" %}
Der Index bei einem Stack beginnt bei 1. Der Index 0 ist reserviert für den emptyStack. Am Index 0 steht immer das Element `id`.
{% endhint %}

{% hint style="info" %}
In den folgenden Beispielen wird zur besseren Übersicht, die Stack Datenstruktur wie folgt dargestellt:**`[ element1, element2, element3, ... ]`**
{% endhint %}

### concat

Die Funktion `concat` nimmt zwei Stacks entgegen und konkateniert diese.

```javascript
const stack1  = convertArrayToStack( ["Hello", "Haskell"] );
const stack2  = convertArrayToStack( ["World", "Random"] );

concat(stack1)(stack2); // [ "Hello", "Haskell", "World", "Random" ]


const stack3 = convertArrayToStack( [1, 2, 3] );
const stack4 = convertArrayToStack( [4] );
concat(stack3 )(stack4); // [ 1, 2, 3, 4 ]

```

### flatten

Die Funktion `flatten` nimmt einen Stack entgegen, dessen Einträge Stacks sind. Die Funktion verknüpft diese alle zusammen zu einem Stack. Das Tiefenlevel, bis zu welcher die Struktur abgeflacht wird ist 1.

```javascript
const s1 = convertArrayToStack([1, 2]);
const s2 = convertArrayToStack([3, 4]);
const s3 = convertArrayToStack([5, 6]);

const stackWithStacks = convertArrayToStack([s1, s2, s3]); // [ [1, 2], [3, 4], [5, 6] ]

flatten(stackWithStacks); // [ 1, 2, 3, 4, 5, 6]
```

```javascript
const s1 = convertArrayToStack([1, 2]);
const s2 = convertArrayToStack([3, 4]);

zip(s1)(s2); // [ (1, 3), (2, 4) ]
```

### zipWith

Die `zipWith`Funktion nimmt eine Verknüpfungsfunktion und 2 Stacks entgegen. Anhand der Verknüpfungsfunktion werden die Elemente der beiden übergebenen Stacks paarweise miteinander verknüpft zu einem neuen Stack.

{% hint style="info" %}
Wenn einer der beiden übergebenen Stacks kürzer ist wird nur bis zum letzten Element des kürzeren Stacks verknüpft.
{% endhint %}

```javascript
const add = x => y => x + y;

const s1 = convertArrayToStack([1, 2]);
const s2 = convertArrayToStack([4, 5]);

zipWith(add)(s1)(s2); // [ 5, 7 ]
```

### zip _\(with pair\)_

Die `zip` Funktion nimmt zwei Stacks entgegen und verknüpft die beiden Stacks mit der Funktion `pair`.

{% hint style="info" %}
Wenn einer der beiden übergebenen Stacks kürzer ist wird nur bis zum letzten Element des kürzeren Stacks verknüpft.
{% endhint %}

### stackEquals

Die Funktion `stackEquals` nimmt zwei Stacks entegen und vergleicht alle Elemente mit dem JavaScript `===` Operator auf Gleichheit. Wenn alle Vergleiche `true` ergeben, gibt die Funktion ein Church-Boolean `True` zurück ansonsten ein Church-Boolean `False` zurück.

```javascript
const s1 = convertArrayToStack([1, 2]);
const s2 = convertArrayToStack([1, 2]);

stackEquals(s1)(s2); // True (Church Boolean)
```

### 

### getElementByIndex

Die Funktion `getElementByIndex` nimmt einen Stack und eine [Church-](../forschungsarbeit-ip5-lambda-kalkuel/church-encodings-zahlen-und-boolesche-werte.md#church-zahlen) oder JS-Zahl, die den Index des Elements repräsentiert, entgegen. Falls an diesem Index ein Element existiert, wird dieses zurückgegeben ansonsten wird auf der Console einer Error geloggt und der Rückgabewert ist `undefined`. 

Beispiel:

```javascript
const stackWithTwoElements = push(push(emptyStack)("Hello"))("World");

getElementByIndex(stackWithTwoElements)(n1) // "Hello"
getElementByIndex(stackWithTwoElements)(n2) // "World"

getElementByIndex(stackWithTwoElements)( 1)  // "Hello"
getElementByIndex(stackWithTwoElements)(2)  // "World"

getElementByIndex(stackWithTwoElements)(999) // Error "invalid index"

```

{% hint style="info" %}
Der Anwender muss nicht mehr entscheiden, welche Funktionen er braucht:  `getElementByChurchNumberIndex` oder `getElementByJsNumIndex`.   
Die Funktion `getElementByIndex`wurde erweitert, dass der Index auf den Typ kontrolliert wird mittels `eitherFunction` und `eitherNaturalNumber`. So kann der Anwender eine Church- oder JavaScript-Zahl angeben, die Funktion findet selber heraus, welche Methode er braucht. Bei ungültigen Parametern werden die passende Fehler-Meldungen geloggt

-&gt; [**siehe Implementation** ](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/aa5fce355f2e5786ee8b8948339a0b9706839253/src/stack/stack.js#L293)\*\*\*\*
{% endhint %}

### 

### removeByIndex

Die Funktion `removeByIndex` nimmt einen Stack und eine [Church-](../forschungsarbeit-ip5-lambda-kalkuel/church-encodings-zahlen-und-boolesche-werte.md#church-zahlen) oder JS-Zahl als Index entgegen. Die Funktion löscht das Element am übergebenen Index und gibt den neuen Stack zurück.  
Bei einem nicht existierenden Index erhält man denselben Stack zurück.

```javascript
const stackWithStrings = convertArrayToStack(["Hello", "Haskell", "World"]);

removeByIndex(stackWithStrings)( 2) // [ "Hello", "World" ]
removeByIndex(stackWithStrings)(n2) // [ "Hello", "World" ]
```

### 

### getIndexOfElement

Die Funktion getIndexOfElement nimmt einen Stack und einen Element entgegen und gibt den Index als JavasScript-Zahl von diesem Element zurück. Wenn das Element nicht existiert wird `undefined` zurückgegeben.

```javascript
const stackWithNumbers = convertArrayToStack([7, 34, 10]);

const result1 = getIndexOfElement(stackWithNumbers)(7)    // 1
const result2 = getIndexOfElement(stackWithNumbers)(34)   // 2
const result3 = getIndexOfElement(stackWithNumbers)(10)   // 3
const result4 = getIndexOfElement(stackWithNumbers)(100)  // undefined
```

