---
description: Stack mit Key-Value Pairs
---

# Immutable ListMap

## Beschreibung

### [ListMap](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L30)

ListMap ist eine weitere unveränderliche Datenstruktur die auf dem Stack aufbaut. Im Kern ist die ListMap Datenstruktur gleich wie der [Stack](../forschungsarbeit-ip5-lambda-kalkuel/immutable-stack.md), d.h. sie ist auch als Triple implementiert. Der Unterschied zum Stack ist, dass in der ListMap die Einträge Key-Value Paare sind \(wie bei einer Java HashMap\). Alle Werte werden in dieser Datenstruktur mit einem dazugehörigen Schlüssel abgespeichert, somit kann der Anwender einen Wert abfragen mit Hilfe des dazugehörigen Schlüssels. Alle Funktionen vom Stack sind kompatibel mit der ListMap, zusäzlich gibt es noch weitere Funktionen die nur mit einer ListMap verwendet werden können.

```javascript
const listMap = stack; // triple
```

### [Empty-ListMap](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L40)

Die `emptyList` repräsentiert die leere ListMap. Anhand dieser Konstruktion ist zu sehen, dass sie sich nur in einem Punkt zum Stack unterscheidet. Der letzte Parameter des Triples ListMap ist nicht nur `id` wie beim Stack sondern Paar mit `id` als Schlüssel und `id` als dazugehörigen Wert.

```javascript
const emptyListMap = listMap(n0)(id)( pair(id)(id) );
```

## Verwendung

Alle Funktionen vom Stack könne auch für die ListMap verwendet werden. Hier folgt die Auflistung der zusätzlichen Funktionalität, die nur mit der ListMap kompatibel ist.

{% hint style="danger" %}
Bei der Verwendung von Funktionen, des Stacks mit der ListMap muss beachtet werden, dass die Elemente immer Key-Value Paare sind und somit immer mit einem `pair` gearbeitet wird als Eintrag.
{% endhint %}

{% hint style="info" %}
In den folgenden Beispielen wird zur besseren Übersicht, die ListMap Datenstruktur wie folgt dargestellt: ``**`[ (key1, value1), (key2, value2), (key3, value3), ... ]`**
{% endhint %}

### [getElementByKey](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L124)

Mit der `getElementByKey` Funktion kann anhand eines Schlüssel auf den dazugehörigen Wert zugegriffen werden.

```javascript
const p1 = pair(1)("Michael")
const p2 = pair(2)("Peter")
const p3 = pair(3)("Hans")

const testListMap = convertArrayToStack([p1, p2, p3]) // [ ("1", "Michael"), ("2", "Peter"),("3", "Hans") ]

const michael = getElementByKey (testListMap) (1); // "Michael"
const peter   = getElementByKey (testListMap) (2); // "Peter"
const hans    = getElementByKey (testListMap) (3); // "Hans"
```

### [removeByKey](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L155)

Mit der Funktion `removeByKey` kann ein Wert anhand des Schlüssel entfernt werden.

```javascript
const p1 = pair(1)("Michael")
const p2 = pair(2)("Peter")
const p3 = pair(3)("Hans")

const testListMap   = convertArrayToStack( [p1, p2, p3] )
const resultListMap = removeByKey(testListMap)(2); // [ ("1", "Michael"), ("3", "Hans") ]

const michael = getElementByKey (resultListMap) (1); // "Michael"
const hans    = getElementByKey (resultListMap) (3); // "Hans"
```

### [convertObjToListMap](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L194)

Mit der Funktion `convertObjToListMap` kann ein JavaScript Objekt zu einer ListMap konvertiert werden. JavaScript-Objekte sind Container für benannte Werte, die Properties oder Methoden genannt werden. In der Konvertierungsfunktion werden die Namen als String-Schlüssel verwendet.

```javascript
// Implementation
const convertObjToListMap = obj => 
    Object.entries(obj).reduce((acc, [key, value]) => push(acc)(pair(key)(value)), emptyListMap);

// Anwendung
const personObject = {firstName: "George", lastName: "Lucas"}

const result = convertObjToListMap(personObject); // [ ("firstName", "George"), ("lastName","Lucas") ]

const firstName = getElementByKey( result )( "firstName" ); // "George"
const lastName  = getElementByKey( result )( "lastName"  );  // "Lucas"
```

### [convertListMapToArray](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L209)

Mit der Funktion `convertListMapToArray` kann eine ListMap in ein JavaScript-Array konvertiert werden. Dabei werden nur die Werte in der ListMap erfasst.

```javascript
// Implementation
const convertListMapToArray = listMap => 
    reduceListMap((acc, curr) => [...acc, curr])([])(listMap);

// Anwendung
const personObject  = {firstName: "George", lastName: "Lucas"}

const personListMap = convertListMapToArray( personObject ); // [ ("firstName", "George"), ("lastName","Lucas") ]

convertListMapToArray( personListMap ) // [ "George", "Lucas" ]
```

## Higher Order Functions \(HOF's\) speziell für ListMap

Für die HOF's `map`, `filter` und `reduce` wurde noch eine spezifischere Variante für die ListMap Datenstruktur implementiert, dies um die Anwendung nochmals zu vereinfachen. Die HOF's vom Stack können auch benutzt werden, da muss aber immer mit einem pair\(key\)\(value\) gearbeitet werden obwohl der Anwender den Key dabei nicht benötigt bzw. verändern darf \(sollte\). darum wird in den spezifischen HOF's der Key weg abstrahiert und der Anwender kann sich voll und ganz auf das eigentliche Element zu konzentrieren.

### [mapListMap](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L62)

Diese Funktion nimmt eine map-Funktion \(wie bei JavaScript Array `map`\)  und eine listMap entgegen. Zurück gibt die Funktion eine neue listMap mit den "gemappten" Werten.

{% hint style="info" %}
Beim Mapping des Wertes bleibt der dazugehörige Schlüssel unverändert. 
{% endhint %}

```javascript
// Implementation
const mapListMap = f => map(p => pair( p(fst) )( f(p(snd)) ));

// Anwendung
const toUpperCase      = str => str.toUpperCase();
const listMapWithNames = convertObjToListMap({name1: "Peter", name2: "Hans"});

const mappedListMap    = mapListMap(toUpperCase)(listMapWithNames); // [ ("name1", "PETER"), ("name2", "HANS") ]

getElementByKey( mappedListMap )( "name1" ) // "PETER"
getElementByKey( mappedListMap )( "name2" )  // "HANS"
```

### [filterListMap](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L78)

Diese Funktion nimmt eine filter-Funktion \(wie bei JavaScript Array `filter`\) und eine _listMap_ entgegen. Die Funktion gibt die gefilterte _listMap_ zurück. Wenn keine Elemente dem Filter entsprechen wird die leere _listMap_ \([`emptyListMap`](listmap.md#empty-listmap)\) zurückgegeben.

```javascript
// Implementation
const filterListMap    = f => filter(p => f(p(snd)));

// Anwendung
const startsWithP      = str => str.startsWith('P');

const listMapWithNames = convertObjToListMap( {name1: "Peter", name2: "Hans", name3: "Paul"} );
const filteredListMap  = filterListMap( startsWithP )( listMapWithNames ); // [ ("name1", "Peter"), ("name3", "Paul") ]

const peter = getElementByKey( filteredListMap )( "name1" );  // "Peter"
const paul  = getElementByKey( filteredListMap )( "name3" );  // "Paul"
```

### [reduceListMap](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L93)

Diese Funktion nimmt als erstes eine reduce-Funktion entgegen, als zweites einen Startwert und als letzten Parameter eine ListMap. Die Funktion gibt den reduzierten Wert zurück.

```javascript
// Implementation
const reduceListMap = f => reduce((acc, curr) => f(acc, curr(snd)));

// Anwendung
const reduceFunc = (acc, curr) => acc + curr.income;

const listMapWithPersons = convertObjToListMap({
              p1: {firstName: 'Peter', income: 1000},
              p2: {firstName: 'Michael', income: 500}
        });
    
const incomeSum = reduceListMap(reduceFunc)(0)(listMapWithPersons); // 1500
```

## Helferfunktion

### [logListMapToConsole](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L218)

Die Funktion `logListMapToConsole` nimmt eine ListMap entgegen und führt einen Seiteneffekt aus. Der Seiteneffekt loggt die ListMap mit dessen Key und Values auf die JavaScript-Konsole.



