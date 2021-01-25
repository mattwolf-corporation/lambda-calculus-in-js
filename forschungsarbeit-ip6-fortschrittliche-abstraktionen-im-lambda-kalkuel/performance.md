# Performance

## forEach-Methode des [Immutable-Stack](../forschungsarbeit-ip5-lambda-kalkuel/immutable-stack.md#foreach-loop)

 Die Performance der **`forEach`**-Methode war nicht optimiert und konnte um das 1200-Fache verbessert werden. Anstelle den Index aus dem Stack via **`jsnum`** rekursiv zu berechnen und der interne Iteration hatte die **`forEach`** eine Komplexität von mindestens _0\(n\)^2_, wurde der Index in der Iteration einfach nur aufgezählt.  
Das Problem liegt an den [_Churchzahlen_ ](../forschungsarbeit-ip5-lambda-kalkuel/church-encodings-zahlen-und-boolesche-werte.md#church-zahlen)welche intern aus rekursiven Funktionen besteht und bei zu vielen Kalkulationen und Verknüpfungen mit den [_Churchzahlen_ ](../forschungsarbeit-ip5-lambda-kalkuel/church-encodings-zahlen-und-boolesche-werte.md#church-zahlen)rasch die Komplexität exponentiell wächst.

Code: **`forEach`** \(nicht optimiert\) mit hoher Komplexität:

```javascript
const forEach = stack => callbackFunc => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = s => {
        if(convertToJsBool(hasPre(s))) {
            const element = head(s);
            const index = jsnum(succ(churchSubtraction(times)(size(s))));

            callbackFunc(element, index);

            return (pop(s))(fst);
        }
        return s;
    };

    times(iteration)(reversedStack);
};
```

Code: **`forEach`**\(optimiert\) mit Komplexität von _O\(n\)_

```javascript
const forEach = stack => callbackFunc => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const invokeCallback = p => {
        const s = p(fst);
        const index = p(snd);
        const element = head(s);

        callbackFunc(element, index);

        return pair(getPreStack(s))(index + 1);
    }

    const iteration = p =>
        If(hasPre(p(fst)))
        (Then(invokeCallback(p)))
        (Else(p));

    times(iteration)(pair(reversedStack)(1));
};
```

  


