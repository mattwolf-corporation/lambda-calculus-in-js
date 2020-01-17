# Der lambdafizierter Taschenrechner

Für ein Einstieg-Projekt, um sich am beste einmal mit den [Kombinatoren](einfache-kombinatoren.md) und den [Church-Zahlen](church-encodings-zahlen-und-boolesche-werte.md) auseinander zusetzen, haben wir uns für einen Taschenrechner entschieden.

Die Idee war einen Taschenrechner so zu bauen, der möglichst leicht zu bedienen, und verständlich aufgebaut, ist. Um dies zu erreichen sollte eine einfache Verkettung der arithmetischen Zahlen und Operationen möglich sein. Dafür wurde eine sogenannter _CalculatorHandler_ entwickelt, welche jeweils eine arithmetische Operation \(Addition, Subtraktion, Multiplikation usw.\), zwei Werte und zum Schluss eine Funktion entgegen nimmt:

```javascript
const calculatorHandler = op => n1 => n2 => f => f(op(n1)(n2));
```

Mit den einfachen JavaScript-Operatoren wie: `plus = x => y => x + y`   `substraction = x => y => x - y` etc. und dem _CalculatorHandler_ können zwar berechnungen durchgeführt werden, jedoch unspektakulärer und nicht einfacher bedienbarer, als wenn die  JavaScript-Operatoren direkt benutzt würde:

**Einfach Addition mit JavaScript-Operatoren:**

```javascript
 plus(1)(2)            // 3
 plus(1)( plus(2)(3) ) // 6 
```

**Addition mit JavaScript-Operatoren und** _**CaluclatorHandler**_**:**

```javascript
calculatorHandler(plus)(1)(2)(id)                                    // 3
calculatorHandler(plus)(1)( calculatorHandler(plus)(1)(2)(id) )(id) // 6
```

Wenn man aber via Point-Freestyle neue Rechen-Operatoren mit dem _CalculatorHandler_ erstellt:

```javascript
const add   = calculatorHandler(plus);            // ;
const multi = calculatorHandler(multiplication);  // multiplication = x => y => 2
const sub   = calculatorHandler(subtraction);
const pow   = calculatorHandler(exponentiation);
const div   = calculatorHandler(division);
```

Die [Thrush-Funktion](einfache-kombinatoren.md) `T = x => f => f(x)`  als den Taschenrechner-Starter verwendet, kann eine unendliche Verkettungen von Zahlen und Operationen erstellt werden:

```javascript
T(1)(add)(2)(pow)(6)(sub)(2)(div)(8)(add)(7)(multi)(4)(sub)...
```

Um diese Verkettung jedoch abzubrechen und das Resultat der Berechnung zu erhalten, braucht man jeglich die [Identity-Funktion](einfache-kombinatoren.md) `id = x => x`  als Letztes anzuwenden:

```javascript
T(1)(add)(2)(id)                     //   3
T(1)(sub)(2)(id)                     //  -1
T(5)(multi)(4)(add)(2)(id)           //  22
T(5)(div)(5)(multi)(100)(add)(1)(id) // 101
```

Der Verständlichkeit halber für die Anwendung des Taschenrechner, wird die _Trush_- und _id_-Funktion einer passender Variable zugewiesen:

```javascript
const calc   = T;
const result = id;
```

So werden nun mit **JavaScript-Zahlen** und **-Arithmetik** schöne verkettete Berechnungen erstellt:

```javascript
calc(5)(multi)(4)(sub)(4)(pow)(2)(div)(8)(add)(10)(result) // 42
```



### Rechnen mit Church Encodings-Zahlen

Um den Taschenrechner nicht nur mit JavaScript-Zahlen sondern auch mit den Church-Zahlen  analog benutzen zu könnne, braucht 



