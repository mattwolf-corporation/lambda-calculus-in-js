# Benchmark Erfahrungen

## forEach-Methode des [Immutable-Stack](../forschungsarbeit-ip5-lambda-kalkuel/immutable-stack.md#foreach-loop)

Bei der Anwendung des Observabes ist uns aufgefallen, dass die Benachrichtigung der Listener viel zu lang ging. Wir haben uns danach gefragt welcher Teil so viel Zeit in anspeucht nimmt für die ausführung. Danach untersuchten wir die forEach Methode, die bei bei der Benachrichtigung der Listener eine zentrale Rolle spielt. Wir haben die Methode analysiert und festgestellt wir in jeder iterationsrundne eine zusätzliche unötige weitere Iteration haben, dies es aber gar nicht benötigt.

Nach dem Refactoring war die forEach Methode massiv viel schneller \(mehr als doppelt so schnell\) . Wir haben einen kleinen Benchmark Test erstellt, der misst wie lange eine Ausführung dauert und konnten so den Unterschied feststellen.

Anstelle den Index jedes mal aus dem Stack via **`jsnum`** zu berechnen, wurde der Index in jeder Iteration nur aufgezählt.  
Das Problem liegt an den [_Churchzahlen_ ](../forschungsarbeit-ip5-lambda-kalkuel/church-encodings-zahlen-und-boolesche-werte.md#church-zahlen)welche im Kern aus rekursiven Funktionen bestehen und bei zu vielen Anwendungen und Verknüpfungen den Stack-Call stark wachsen lässt.



Implementation: `forEach`vor dem Refactoring

```javascript
const forEach = stack => callbackFunc => {
    const times         = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = s => {
        if( convertToJsBool(hasPre(s)) ) {
            const element = head(s);
            const index   = jsnum( succ( churchSubtraction(times)(size(s) )));

            callbackFunc(element, index);

            return ( pop(s) )(fst);
        }
        return s;
    };

    times
        (iteration)
        (reversedStack);
};
```

Implementation: `forEach` nach dem Refactoring

```javascript
const forEach = stack => callbackFunc => {
    const times         = size(stack);
    const reversedStack = reverseStack(stack);

    const invokeCallback = p => {
        const s       = p(fst);
        const index   = p(snd);
        const element = head(s);

        callbackFunc(element, index);

        return pair( getPreStack(s) )( index + 1 );
    }

    const iteration = p =>
        If( hasPre( p(fst) ))
            ( Then( invokeCallback(p) ))
            ( Else(                p  ));

    times
        (iteration)
        (pair( reversedStack)(1) );
};
```

  


