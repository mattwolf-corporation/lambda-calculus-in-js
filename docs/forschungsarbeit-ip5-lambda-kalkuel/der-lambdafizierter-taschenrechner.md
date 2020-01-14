# Der lambdafizierter Taschenrechner

Für ein Einstieg-Projekt, um sich am beste einmal mit den [Kombinatoren](einfache-kombinatoren.md) und den [Church-Zahlen](church-encodings-zahlen-und-boolesche-werte.md) auseinander zusetzen, haben wir uns für einen Taschenrechner entschieden.

Die Idee war einen Taschenrechner so zu bauen, der möglichst leicht zu bedienen, und verständlich aufgebaut, ist. Um dies zu erreichen sollte eine einfache Verkettung der arithmetischen Zahlen und Operationen möglich sein. Dafür wurde eine sogenannter _CalculatorOperator_ entwickelt, welche jeweils eine arithmetische Operation \(Addition, Subtraktion, Multiplikation usw.\), zwei Werte und zum Schluss eine Funktion entgegen nimmt.

```javascript
const calculatorOperator = op => n1 => n2 => f => f(op(n1)(n2));
```

Jedoch spektakulärer rechnen kann mit dem alleine noch nicht:

```javascript
calculatorHandler(plus)(1)(2)(id)        === 3
calculatorHandler(subtraction)(5)(1)(id) === 4
```

... ABER! Wenn man via Point-Freestyle neue Rechen-Operatoren mit dem _CalculatorOperator_ erstellt:

```javascript
const add   = calculatorHandler(plus);
const multi = calculatorHandler(multiplication);
const sub   = calculatorHandler(subtraction);
const pow   = calculatorHandler(exponentiation);
const div   = calculatorHandler(division);
```

...und die [Thrush-Funktion](einfache-kombinatoren.md) `T = x => f => f(x)`  als den Taschenrechner-Starter verwendet, kann man eine unendliche Verkettungen von Zahlen und Operationen erstellen:

```javascript
T(1)(add)(2)(pow)(6)(sub)(2)(div)(8)(add)(7)(multi)(4)(sub)...
```

Um diese Verkettung jedoch abzubrechen und das Resultat zu erhalten, braucht man jeglich die [Identity-Funktion](einfache-kombinatoren.md) `id = x => x`  anzuwenden:

```javascript
T(1)(add)(2)(id)                     ===  3
T(1)(sub)(2)(id)                     === -1
T(5)(multi)(4)(add)(2)(id)           ===  42
T(5)(div)(5)(multi)(100)(add)(1)(id) === 101
```

Verständnis halber wird die Trush-Funktion zu einem passenderen Namen  zugewiesen:

```javascript
const calc = T;
```

So kann man mit **JavaScript-Zahlen** und **-Arithmetik** verkettete Berechnungen erstellen:

```javascript
calc(5)(multi)(4)(sub)(4)(pow)(2)(div)(8)(add)(10)(result) === 42
```



### Rechnen mit Church Encodings-Zahlen

Um den Taschenrechner nicht nur mit JavaScript-Zahlen sondern auch mit den Church-Zahlen  analog benutzen zu könnne, wie:



