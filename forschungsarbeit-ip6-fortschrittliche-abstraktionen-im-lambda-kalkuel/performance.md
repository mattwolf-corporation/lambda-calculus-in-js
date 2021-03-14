# Benchmark Erfahrungen

## forEach-Methode des [Immutable-Stack](../forschungsarbeit-ip5-lambda-kalkuel/immutable-stack.md#foreach-loop)

Die Performance der `forEach`-Methode war nicht optimiert und konnte mehr als das 2-Fache verbessert werden. Anstelle den Index jedes mal aus dem Stack via **`jsnum`** zu berechnen, wurde der Index in jeder Iteration nur aufgezählt.  
Das Problem liegt an den [_Churchzahlen_ ](../forschungsarbeit-ip5-lambda-kalkuel/church-encodings-zahlen-und-boolesche-werte.md#church-zahlen)welche im Kern aus rekursiven Funktionen bestehen und bei zu vielen Anwendungen und Verknüpfungen den Stack-Call stark wachsen lässt.

Code: `forEach` \(nicht optimiert\) mit hoher Komplexität:

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

Code: `forEach`  optimiert

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

  


