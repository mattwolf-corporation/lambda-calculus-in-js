# Immutable ListMap

## Beschreibung

### ListMap

ListMap ist eine weitere unveränderliche Datenstruktur die auf dem Stack aufbaut. Im Kern ist die ListMap Datenstruktur gleich wie der Stack, d.h. sie ist auch als Triple implementiert. Der Unterschied zum Stack ist, dass in der ListMap die Einträge Key-Value Paare sind \(wie bei einer Java HashMap\). Alle Werte werden in dieser Datenstruktur mit einem dazugehörigen Schlüssel abgespeichert, somit kann der Anwender einen Wert abfragen mit Hilfe des dazugehörigen Schlüssels. Alle Funktionen vom Stack sind kompatibel mit der ListMap, zusäzlich gibt es noch weitere Funktionen die nur mit einer ListMap verwendet werden können.

ListMap Implementation:

```javascript
const listMap = stack;
```

### Empty-ListMap

Die emptyList repräsentiert die leere ListMap. Anhand dieser Konstruktion ist zu sehen, dass sie sich nur in einem Punkt zum Stack unterscheidet. Der letzte Parameter des Triples listMap ist nicht nur `id` wie beim Stack sondern Paar mit `id` als Schlüssel und `id` als dazugehörigen Wert.

```javascript
const emptyListMap = listMap(n0)(id)( pair(id)(id) );
```

## Verwendung

Alle Funktionen vom Stack könne auch für die ListMap verwendet werden. Hier folgt die Auflistung der zusäzlichen Funktionalität, die nur mit der ListMap kompatibel ist.

{% hint style="danger" %}
Bei der Verwendung von Funktionen, des Stacks mit der ListMap muss beachtet werden, dass die Elemente immer Key-Value Paare sind und somit immer mit einem `pair` gearbeitet wird als Eintrag.
{% endhint %}

### getElementByKey

Mit der getElementByKey Funktion kann anhand eines Schlüssel auf den dazugehörigen Wert zugegriffen werden.

```javascript
const p1 = pair(1)("Michael")
const p2 = pair(2)("Peter")
const p3 = pair(3)("Hans")

const testListMap = convertArrayToStack([p1, p2, p3])

const michael = getElementByKey (testListMap) (1); // "Michael"
const peter   = getElementByKey (testListMap) (2); // "Peter"
const hans    = getElementByKey (testListMap) (3); // "Hans"
```

### removeByKey

Mit der Funktion removeByKey kann ein Wert anhand des Schlüssel entfernt werden.

```javascript
const p1 = pair(1)("Michael")
const p2 = pair(2)("Peter")
const p3 = pair(3)("Hans")

const testListMap = convertArrayToStack([p1, p2, p3])
const resultListMap = removeByKey(testListMap)(2); // "Hans" wird entfernt

const michael = getElementByKey (resultListMap) (1); // "Michael"
const hans    = getElementByKey (resultListMap) (3); // "Hans"

```

### mapListMap

Mit der Funktion mapListMap wird das mapping mit einer ListMap vereinfacht. 

```javascript
const mapListMap = f => map(p => pair( p(fst) )( f(p(snd)) ));
```

### filterListMap

Mit der ...

```javascript
const filterListMap = f => filter(p => f(p(snd)) );
```

### reduceListMap

Mit der ...

```javascript
const reduceListMap = f => reduce((acc, curr) => f(acc, curr(snd)));
```



