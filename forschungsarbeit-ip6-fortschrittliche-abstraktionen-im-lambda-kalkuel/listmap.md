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

