# Church Encodings - Zahlen

## Beschreibung

Nebst den bekannten [Lambda-Kombinatoren](einfache-kombinatoren.md) gibt es noch die Church-Zahlen. Sie sind die bekannteste Form, welche die natürlichen Zahlen repräsentieren. Benannt sind sie nach [Alonzo Church](https://de.wikipedia.org/wiki/Alonzo_Church), Mathematiker und einer der Begründer der theoretischen Informatik.

## Church-Zahlen

Die Church-Zahlen sind keine "echte" Zahlen, sondern Funktionen die n-Mal ein Argument ausführen. Um zum Beispiel die Zahl Eins als eine Church-Zahl \( **`n1`**\) zu repräsentieren muss es eine Funktion geben die ein Argument genau einmal aufruft. 

Implementation der Church-Zahl  **`n1`**  \(Eins\):

```javascript
// Implementation n1
const n1 = f => a => f(a);

// Demonstration
n1(x => x + 1)(0)      // 1

n3(x => x + '!')('λ')  // 'λ!'
```

Das gleiche mit den Zahlen von Zwei bis Neun, welche jeweils n-Mal mehr den Funktion-Aufruf angefügt werden.

```javascript
// Implementation n2...n9
const n2 = f => a => f(f(a));
const n3 = f => a => f(f(f(a)));
const n4 = f => a => f(f(f(f(a))));
const n5 = f => a => f(f(f(f(f(a)))));
const n6 = f => a => f(f(f(f(f(f(a))))));
const n7 = f => a => f(f(f(f(f(f(f(a)))))));
const n8 = f => a => f(f(f(f(f(f(f(f(a))))))));
const n9 = f => a => f(f(f(f(f(f(f(f(f(a)))))))));

// Demonstration
n2(x => x + 1)(0)      // 2
n3(x => x + 1)(0)      // 3
n4(x => x + 1)(0)      // 4

n3(x => x + '!')('λ')  // 'λ!!!'
```

[  
](https://app.gitbook.com/@mattwolf-corporation/s/ip5-lambda-calculus/~/diff/drafts/-LySdvLY72eVAhh8w8A8/docs/forschungsarbeit-ip5-lambda-kalkuel/einfache-kombinatoren)Die Zahl Null  **`n0`**  wird in den Church-Zahlen als einen triviale Funktion implementiert, welche das Argument eben keinmal aufgerufen wird.

Implementation der Church-Zahl  **`n0`**  \(Null\):

```javascript
// Implementation n0
const n0 = f => a => a;

// Demonstration
n0(x => x + 1)(0)      // 0

n0(x => x + '!')('λ')  // 'λ'
```

## Mathematische Operationen  mit Church-Zahlen

### Succesor

Der Successor nimmt eine Church-Zahl und gibt den Nachfolger zurück.

Implementation:

```javascript
const successor = n => f => a => f(n(f)(a));
```

Beispiel:

```javascript
successor(n0)        // n1
successor(n5)        // n6
```





