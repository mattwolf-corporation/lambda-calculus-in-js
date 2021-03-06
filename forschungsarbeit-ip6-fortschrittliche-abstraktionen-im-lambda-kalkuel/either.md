# Either

## Beschreibung

### Either Type

Der Either Type wird häufig in funktionalen Programmiersprachen wie zum Beispiel Haskell oder Scala eingesetzt für das Error Handling. Der Either Type ist ein polymorpher Typ, der zwei Zustände anehmen kann. Für diese 2 Zustände gibt es die Wert- Konstruktoren **Left** und **Right**. Somit ist ein Either entweder ein Left oder ein Right. Left und Right tragen beide einen Wert mit sich. Left wird verwendet um im Fehlerfall die Fehlermeldung zu kapseln. Right wird verwendet um im Erfolgsfall den korrekten Wert zu kapseln. Durch den Either Type kann so elegant auf Fehler reagiert werden.

Either Type Implementation:

```javascript
const Left   = x => f => _ => f (x);
const Right  = x => _ => g => g (x);
```

Left und Right sind zwei Funktionen die jeweils einen Wert und 2 Funktionen entgegen nehmen. Der Unterschied ist, dass die Left Funktion die erste übergebene Funktion f, der zwei übergebenen, auf den Parameter x anwendet. Die Right Funktion wendet die zweite \(rechte\) Funktion g auf den Parameter x an. Somit ignoriert Left und Right immer eine Funktion. Left und Right sind die Basis für den [Maybe Type](maybe.md).

