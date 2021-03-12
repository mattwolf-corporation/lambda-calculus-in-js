# Maybe

## Beschreibung

### Maybe Type

Der Maybe Type baut auf dem Either Type auf und kommt aus der Welt der funktionalen Programmiersprachen. Der Maybe Type ist ein polymorpher Typ, der auch \(wie der Either Type\) zwei Zustände anehmen kann. Die Zustände sind: es existiert ein Wert, dass wird mit `Just(value)` ausgedrückt oder es existiert kein Wert und dass wird mit `Nothing` ausgedrückt. Dies ist nützlich um ausdrücken zu können das eine Funktion villeicht einen Wert zurück liefert. Dadurch kann eleganter auf fehlende, abwesende Werte reagiert werden. Der Benutzer weiss schon von Anfang an, dass nur villeicht ein Wert da ist und kann dies somit besser handhaben. Der Maybe Type eleichtert das ganze umgehen mit null Values oder ähnlichem.

Maybe Implementation:

```javascript
// either type
const Left   = x => f => _ => f (x);
const Right  = x => _ => g => g (x);

// maybe type
const Nothing  = Left();
const Just     = Right ;
```

Anhand der Implementation von Just und Nothing ist erkenbar, dass der Maybe Type auf dem Either Type basiert.

Just ist der Fall bei dem ein Wert vorhanden ist. Dem Just "Konstruktor" kann ein Wert übergeben werden.

