# Maybe

## Beschreibung

### Maybe Type

Der Maybe Type wird häufig in funktionalen Sprachen wie zum Beispiel Haskell oder Scala eingesetzt. Der Maybe Type ist ein polymorpher Typ, der zwei Zustände anehmen kann. Die Zustände sind es existiert ein Wert, dass wird mit Just\(value\) ausgedrückt oder es existiert kein Wert und dass wird mit Nothing ausgedrückt. Dies ist nützlich um ausdrücken zu können das eine Funktion villeicht einen Wert zurück liefert. Dadurch kann eleganter auf fehlende Werte reagiert werden und der Benutzer weiss schon von Anfang an dass nur villeicht ein Wert da ist und kann dies somit besser Verarbeiten. Der Maybe Type eleichtert das ganze umgehen mit null Values oder ähnlichem.

Maybe Implementation:

```javascript
const Left   = x => f => _ => f (x);
const Right  = x => _ => g => g (x);
const either = id;

const Nothing  = Left();
const Just     = Right ;
```

Left und Right sind die Basis für den Maybe Type. Left und Right bilden zusammen einen weiteren Typ, den Either Type. Left und Right sind zwei Funktionen die jeweils einen Wert und 2 Funktionen entgegen nehmen. Der Unterschied ist, dass die Left Funktion die erste übergebene Funktion f, der zwei übergebenen, auf den Parameter x anwendet. Die Right Funktion wendet die zweite \(rechte\) Funktion g auf den Parameter x an. Somit ignoriert Left und Right immer eine Funktion.

Just ist der Fall bei dem ein Wert vorhanden ist. Dem Just "Konstruktor" kann ein Wert übergeben werden.

