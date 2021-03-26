---
description: >-
  Wie lässt sich ein Wert nach dessen Änderung z.B. auf mehreren Textfeldern
  synchronisiert darstellen?
---

# Observable

#### In  vielen Programmiersprachen bietet sich hierfür das Entwurfsmuster 'Observer-Pattern' an, dass in verschiedenen Sprachen sehr unterschiedlich implementiert wurde. Das Prinzip gestaltet sich allerdings gleich: Der 'Erzähler' \(Observable\) hält Informationen bereit an die sich 'Zuhörer' \(Listener\) registrieren können. Sobald der 'Erzähler' neue Informationen bekommt, benachrichtigt er seine 'Zuhörer'.

## Beispiel

### Listener erstellen

Als erstes wird ein Listener erstellt. Ein Listener ist ein Schlüssel-Wert Paar, dessen Wert eine Funktion ist, die bei einer Wertänderung auf dem Obersvable, aufgerufen wird. Somit kann mit dieser Funktion auf eine Wertänderung reagiert werden. Diese Funktion nimmt zwei Parameter entgegen, als erstes den`newValue` und als zweites den `oldValue`.

In diesem Beispiel wird die Variable `listenerVariable`  immer mit dem `newValue`-Wert überschrieben, wenn der Listener vom Observable über eine Wertänderung benachricht wird. `oldValue` wird in diesem Beispiel nicht verwendet.

```javascript
let listenerVariable; // undefined
const listenerExample = newListener( newValue => oldValue  => listenerVariable = newValue );
```

### Observable erstellen und Listener registrieren

Nachdem ein 'Zuhörer' \(Listener\) erstellt wurde, braucht es noch den 'Erzähler' \(Observable\).  
Dafür gibt es die Funktion `Observable`  welche als ersten Parameter den initialen Wert entgegennimmt.  
Mit der Funktion `addListener` wird der zuvor erstellte Listener registriert.

```javascript
let obsExample = Observable(42)                     // new Observable with initValue 42
                  (addListener)( listenerExample ); // append Listener to the Observable
```

{% hint style="info" %}
Nachdem einer Listener mit einem Observable verknüpft ist, erhält der Listener sofort den aktuellsten Stand \(initialen Wert\) vom Observable. In diesem Beispiel die Zahl '42'. 

```javascript
listenerVariable   // 42
```
{% endhint %}

### Aktueller Wert abfragen

Die Funktion `getValue`  gibt den aktuellen Wert aus dem Observable zurück.

```javascript
obsExample( getValue );  // 42
```

### Wertänderung

Mit der Funktion `setValue` wird dem Observable ein neuer Wert mitgeteilt. Alle verbundene Listener werden benachrichtig und der neue Wert als `newValue` __mitgegeben. Der vorherige Wert als `oldValue`_._ Die Funktionn `setValue` gibt ein neues Observable zurück.

```javascript
obsExample = obsExample( setValue )(11) // set new value and update all listeners

listenerVariable         // 11
obsExample( getValue );  // 11
```

### Listener entfernen

Wenn ein Listener wieder von einem Observable entfernt werden soll, gibt es dafür die Funktion`removeListener`. Diese Funktion gibt wieder ein Observable zurück.

```javascript
obsExample = obsExample( removeListener )( listenerExample ); 
```

Der zuvor entfernte Listener bekommt nun keine Wertänderungen mehr mit.

```javascript
obsExample = obsExample(setValue)(66);

listenerVariable         // 11 <- no updates anymore
obsExample( getValue );  // 66
```

### Zusammenfassung:

```javascript
let listenerVariable; // undefined
const lisExample = newListener( nVal => oVal => listenerVariable = nVal );

// create observable and add listener
let obsExample = Observable(42)
                    (addListener)(lisExample); 

listenerVariable // 42 <- get the value from initialValue

// set new value and update listeners
obsExample = obsExample(setValue)(11) 

// receive the update
listenerVariable // 11 

// remove listener
obsExample = obsExample(removeListener)(lisExample);  

// set new value and update listeners
obsExample = obsExample(setValue)(67); 

// receive no updates anymore 
listenerVariable // 11  
```

## Observable Text-Input Example

In diesem Beispiel-Projekt gibt es ein 'Observable'_,_ welches auf die Wertänderungen eines Text-Input-Feldes auf dem UI reagiert. Dabei werden alle 'Listener' mit dem neuen und alten Wert informiert.

{% hint style="info" %}
In der Demo sind die Checkboxen neben den Labels zum entfernen und hinzufügen der Listener da.
{% endhint %}

![Screenshot Text-Input Example](../.gitbook/assets/image%20%282%29.png)

### Demo

{% embed url="https://mattwolf-corporation.github.io/ip6\_lambda-calculus-in-js/src/observable/observableExamples/observableTextInputExample/viewTextInputExample.html" %}

{% hint style="info" %}
Es gibt vorgefertigte Listener-Funktionen, welche im Beispiel benutzt werden.

```javascript
/*
    Listener-Functions
 */
const listenerLogToConsole                        =            nVal => oVal => console.log(`Value: new = ${nVal}, old = ${oVal}`)
const listenerNewValueToDomElementTextContent     = element => nVal => oVal => element.textContent = nVal
const listenerOldValueToDomElementTextContent     = element => nVal => oVal => element.textContent = oVal
const listenerNewValueLengthToElementTextContent  = element => nVal => oVal => element.textContent = nVal.length                
```
{% endhint %}

### Implementation

```javascript
// Get the elements from the Dom
const [inputText, newValue, oldValue, sizes] = getDomElements("inputText", "newValue", "oldValue", "sizes");

// Create Listener
const listenerNewValue      = newListener( listenerNewValueToDomElementTextContent     (newValue) );
const listenerOldValue      = newListener( listenerOldValueToDomElementTextContent     (oldValue) );
const listenerNewValueSize  = newListener( listenerNewValueLengthToElementTextContent  (sizes)    );
const listenerConsoleLog    = newListener( listenerLogToConsole                                   );

// Create Observable-Object, define the Initial-Value and append the Listeners
let textInputObservables = Observable("")
                            (addListener)( listenerNewValue     )
                            (addListener)( listenerOldValue     )
                            (addListener)( listenerNewValueSize )
                            (addListener)( listenerConsoleLog   );

// Connect the Observables with the Input-Text-Field.
// Every change in the Input-Field execute the 'setValue'-Function with the new value from Input-Field.
inputText.oninput = _ =>
    textInputObservables = textInputObservables(setValue)(inputText.value);
```

Für den vollen Code: [**observableTextInputExample.js**](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/master/src/observable/observableExamples/observableTextInputExample/observableTextInputExample.js)



## Observable Color-Picker Example

In diesem Beispiel-Projekt wird gezeigt wie ein Color-Picker mit dem Observable gebaut werden kann.  
Es gibt ein Observable das die Farbe verwaltet, an welches sich Listener wie Background, Labels und Inputs registrieren können. Die Input-Felder \(Text-Input und Slider\) sind dabei nicht nur Listener sondern auch gleichzeitig dafür da, dem Observable neue Werte zu übermitteln. Die Elemente Text-Input und Slider-Input sind bidirektional mit dem Observerable verbunden. Um das zu demonstrieren wurden Buttons im UI hinzugefügt zum an- und abmelden der Listener.

![Screenshot Color-Picker Example](../.gitbook/assets/image%20%284%29.png)

### Demo

{% embed url="https://mattwolf-corporation.github.io/ip6\_lambda-calculus-in-js/src/observable/observableExamples/observableColorPickerExample/viewColorPickerExample.html" %}

### Implementation

{% hint style="info" %}
Der observierte Farbwert ist als [Triple](../forschungsarbeit-ip5-lambda-kalkuel/einfache-kombinatoren.md#triple) implementiert:`triple(red, green, blue)`
{% endhint %}

```javascript
// Get the elements from the Dom
const [resultColor, rgbValue, hex, hsl] = getDomElements("resultColor", "rgbValue", "hex", "hsl");
const [inputR, inputG, inputB]          = getDomElements("inputR", "inputG", "inputB");
const [rangeR, rangeG, rangeB]          = getDomElements("rangeR", "rangeG", "rangeB");

// Getter methods for the RPG-Values (triple)
const getRed    = firstOfTriple;
const getGreen  = secondOfTriple;
const getBlue   = thirdOfTriple;

// Create Listeners for every color (red, green, blue) to Text- & Slider-Input
const listenerInputR       = newListener( nVal => _ => inputR.value  =  nVal( getRed   ));
const listenerRangeR       = newListener( nVal => _ => rangeR.value  =  nVal( getRed   ));
const listenerInputG       = newListener( nVal => _ => inputG.value  =  nVal( getGreen ));
const listenerRangeG       = newListener( nVal => _ => rangeG.value  =  nVal( getGreen ));
const listenerInputB       = newListener( nVal => _ => inputB.value  =  nVal( getBlue  ));
const listenerRangeB       = newListener( nVal => _ => rangeB.value  =  nVal( getBlue  ));

// Create Listeners for the Background-Result, RGB- & Hex-Labels
const listenerBgColorRGB   = newListener( nVal => _ => resultColor.style.backgroundColor = toRGBString( nVal(getRed), nVal(getGreen), nVal(getBlue) ));
const listenerRgbTextRGB   = newListener( nVal => _ => rgbValue.value                    = toRGBString( nVal(getRed), nVal(getGreen), nVal(getBlue) ));
const listenerHexTextRGB   = newListener( nVal => _ => hex.textContent                   = toHexString( nVal(getRed), nVal(getGreen), nVal(getBlue) ));

// Create Observable-Object, define the three initial-Values RGB and append the Listeners
let rgbObservable = Observable(triple(55)(215)(150))
                                (addListener)( listenerInputR     )
                                (addListener)( listenerRangeR     )
                                (addListener)( listenerInputG     )
                                (addListener)( listenerRangeG     )
                                (addListener)( listenerInputB     )
                                (addListener)( listenerRangeB     )
                                (addListener)( listenerBgColorRGB )
                                (addListener)( listenerRgbTextRGB )
                                (addListener)( listenerHexTextRGB );
                                
// Connecting the Observables with every Input-Field (Range and Text).
inputR.oninput = _ =>
    rgbObservable = rgbObservable(setValue)(
        triple
            (inputR.value)
            (rgbObservable(getValue)(getGreen))
            (rgbObservable(getValue)(getBlue))
    );

rangeR.oninput = _ =>
    rgbObservable = rgbObservable(setValue)(
        triple
            (rangeR.value)
            (rgbObservable(getValue)(getGreen))
            (rgbObservable(getValue)(getBlue))
    );

...
```

Für den vollen Code: [**observableColorPickerExample.js**](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/master/src/observable/observableExamples/observableColorPickerExample/observableColorPickerExample.js)\*\*\*\*



## Observable HttpGet-Joke Example

In diesem Beispiel-Projekt wird gezeigt, wie Buttons dem Observable neue Jokes, asynchron aus dem Internet geladen, mitgeteilt wird. Mit dabei gibt es zwei Listener wissen mit den Inhalten des Observable umzugehen. Dabei rendert ein Listener die Jokes auf dem UI und der andere löst ein Text-To-Speech-Skript aus. 

![Screenshot Joke-Example](../.gitbook/assets/image%20%285%29.png)

### Demo

{% embed url="https://mattwolf-corporation.github.io/ip6\_lambda-calculus-in-js/src/observable/observableExamples/observableHttpGetJokeExample/viewObservableHttpGetJokeExample.html" %}

### Implementation

```javascript
// Either all the necessary Dom-Element exist and or display all missed Element
eitherElementsOrErrorsByFunction(eitherDomElement)("jokeHistory", "norrisBtn", "nerdyBtn", "trumpBtn")
(err => document.body.innerHTML = Box(err)(mapf)(convertStackToArray)(mapf)(s => s.join(", <br>"))(fold)(txt => `<div style="background: orangered"> <br> ${txt}</div>`))
(result => {

    // receive founded the elements
    const [jokeHistory, norrisBtn, nerdyBtn, trumpBtn] = convertListMapToArray(result)

    // create the Listeners (text-to-speech & display to view)
    const listenerSpeak = newListener(nValue => oValue => speak(nValue(snd)));
    const listenerJokeToDom = newListener(nValue => oValue => {
        const template = document.createElement('fieldset');
        template.className = "joke"
        template.innerHTML = `<legend>${nValue(fst)}</legend><p class="jokeText">${nValue(snd)}</p>`
        jokeHistory.insertAdjacentElement('afterbegin', template)
    });

    // create the Observable with pair data structure ("Title")("Joke")
    const jokePairObserver = Observable( pair("nobody")("tell me a joke") )
                                    (addListener)( listenerSpeak )
                                    (addListener)( listenerJokeToDom )


    // Jokes-API-URLs
    const jokeNorrisUrl = "https://api.chucknorris.io/jokes/random";            // jsonKey: value
    const jokeNerdUrl   = "https://v2.jokeapi.dev/joke/Programming?type=single" // jsonKey: joke
    const trumpTweetUrl = "https://www.tronalddump.io/random/quote";            // jsonKey: value


    // Constructor for a Joke-Object
    const jokeCtor = name => btn => url => jsonKey => convertObjToListMap({name, btn, url, jsonKey});

    // creat Joke-Object
    const norrisJoke = jokeCtor("Chuck Norris - Joke ")(norrisBtn)(jokeNorrisUrl)("value");
    const nerdJoke   = jokeCtor("Nerd - Joke ")(nerdyBtn)(jokeNerdUrl)("joke");
    const trumpTweet = jokeCtor("Trump Tweet")(trumpBtn)(trumpTweetUrl)("value");

    // combine the Joke-Objects into a stack
    const jokes = convertElementsToStack(norrisJoke, nerdJoke, trumpTweet);

    // add the Joke-Buttons a on-click event listener for request the Jokes and update the Observable
    forEach(jokes)((joke, _) =>
        getElementByKey(joke)("btn").onclick = _ =>
            HttpGet( getElementByKey(joke)("url") )(resp =>
                jokePairObserver(setValue)(Box(resp)
                                            (mapf)(JSON.parse)
                                            (fold)(x => pair( getElementByKey(joke )( "name"))( x[getElementByKey(joke)("jsonKey")] )))));
})
```

Für den vollen Code: [**observableHttpGetJokeExample.js**](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/master/src/observable/observableExamples/observableHttpGetJokeExample/observableHttpGetJokeExample.js)\*\*\*\*

> ## \*\*\*\*[**HttpGet** ](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/ba755edca55de9fbf70267e6ecce48ac58fb6512/src/IO/http.js#L13)\*\*\*\*
>
> Mit der Funktion `HttpGet`   werden asynchrone Daten von einem Webserver angefordert. Die Anfrage wird nach 30 Sekunden _Time-out_  automatisch beendet, wenn vom Webserver bis dahin keine Antwort kommt. Die Funktion `HttpGet` erwartet als ersten Parameter eine URL und gibt also zweiten Parameter ein _Callback_ zurück mit der Response vom Server.
>
> ####  Beispiel:
>
> ```javascript
> HttpGet(jokeUrl)
>  (response => getDomElement("joke").textContent = JSON.parse(response).value);
> ```

> ## \*\*\*\*[**HttpGetSync** ](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/ba755edca55de9fbf70267e6ecce48ac58fb6512/src/IO/http.js#L36)\*\*\*\*
>
> Analog zur `HttpGet`  gibt es die Synchrone-Variante ohne Callback: `HttpGetSync`.  
> Denn Callback braucht es nicht, da der Response direkt der Rückgabewert der Funktion ist.
>
> #### Beispiel mit [Box](box-maybebox.md):

> ```javascript
> Box( HttpGet(jokeUrl) )
>  (mapf)( JSON.parse )
>  (fold)( x => getDomElement("joke").textContent = x.value) )
> ```

## Verwendung

{% hint style="success" %}
Die Titel der Funktionen sind mit einem Link zur Implementation verknüpft.
{% endhint %}

### [Observable](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/951d8489290b05391cb71abdfed25bb2666aa76c/src/observable/observable.js#L41)

Der Konstruktor zum erstellen eines Observable mit dem initialen Startwert.

```javascript
// Implementation
const Observable = initialValue =>
    observableBody(emptyListMap)(initialValue)(setValue)(initialValue);
    
// Anwendung
const obsExample = Observable(0)
```

### **Observable-Functions**

#### [observableBody](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/951d8489290b05391cb71abdfed25bb2666aa76c/src/observable/observable.js#L25)

Das Observable-Konstrukt, für das rekursiven Anwenden der **Observable-Functions**

> **Observable-Functions:**

> * [addListener](https://app.gitbook.com/@mattwolf-corporation/s/ip6-lambda-calculus/~/drafts/-MVkfUbGB0l_ujcQeoUn/forschungsarbeit-ip6-fortschrittliche-abstraktionen-im-lambda-kalkuel/observable#addlistener)
> * [removeListener](https://app.gitbook.com/@mattwolf-corporation/s/ip6-lambda-calculus/~/drafts/-MVkfUbGB0l_ujcQeoUn/forschungsarbeit-ip6-fortschrittliche-abstraktionen-im-lambda-kalkuel/observable#removelistener)
> * [removeListenerByKey](https://app.gitbook.com/@mattwolf-corporation/s/ip6-lambda-calculus/~/drafts/-MVkfUbGB0l_ujcQeoUn/forschungsarbeit-ip6-fortschrittliche-abstraktionen-im-lambda-kalkuel/observable#removelistenerbykey)
> * [setValue](https://app.gitbook.com/@mattwolf-corporation/s/ip6-lambda-calculus/~/drafts/-MVkfUbGB0l_ujcQeoUn/forschungsarbeit-ip6-fortschrittliche-abstraktionen-im-lambda-kalkuel/observable#setvalue)

```javascript
// Implementation
const observableBody = listeners => value => observableFn =>
    observableFn(listeners)(value);
```

{% hint style="warning" %}
Nachdem anwenden eines der **Observable-Functions** erhält man den aktuellen Observable zurück. Es ist dabei "best-practices" eine Zuweisung auf dieselbe Observable wieder zu setzen, damit diese die Alte überschreibt. Ansonsten wird das hinzufügen oder entfernen eines Listeners nicht abgeschlossen.

```javascript
let obsExample = Observable(0)

obsExample = obsExample( addListener    )( /* dein Listener   */ )
obsExample = obsExample( removeListener )( /* dein Listener   */ )
obsExample = obsExample( setValue       )( /* dein neuer Wert */ )
```

#### Mit dieser Ausnahme wird gegen die[ Regel der unveränderbaren Datenstruktur](../#forschungsarbeit) verstossen!
{% endhint %}

{% hint style="info" %}
Ein Observable kann _immutable_ sein, wenn man die Observable-Variable mit `const` deklariert.  So kann man die Überschreibung des Observable unterbinden und nachhinein keine Listener mehr hinzufügen oder entfernen.  

```javascript
const listenerLog = newListener( listenerLogToConsole  );

// 'const' deklariert die Observable als eine Konstante (immutable)
const obsExample = Observable(0)
                     (addListener)( listenerLog )

// Die Observable kann nicht mehr verändert werden
obsExample = obsExample( removeListener)( listenerLog ) // entfernen nicht möglich
obsExample = obsExample( addListener   )( listenerLog ) // hinzufügen nicht möglich
```
{% endhint %}

### \*\*\*\*[**addListener**](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/951d8489290b05391cb71abdfed25bb2666aa76c/src/observable/observable.js#L95)\*\*\*\*

Fügt dem Observable einen neuen Listener hinzu und der aktuelle Observable-Wert wird sofort an den Listener übermittelt.

```javascript
// Implementation
const addListener = listeners => value => newListener => {
    newListener(snd)(value)(value)
    return observableBody( push(listeners)(newListener) )(value)
    
// Anwedung
const obsExample = Observable(0)
                    (addListener)( listenerLogToConsole      )
                    (addListener)( listenerNewValueToElement );
```

{% hint style="danger" %}
Das Observable sollte nicht mit mehr als 5'000 Listeners verbunden werden, weil ansonsten ein "Uncaught RangeError: Maximum call stack size exceeded" __auftretten könnte. 
{% endhint %}

{% hint style="info" %}
Mit bis zu 100 Listerners und vielen Wertänderungen \(zb. 100'000\) auf einmal hat der Observable kein Problem.
{% endhint %}

### [removeListener](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/951d8489290b05391cb71abdfed25bb2666aa76c/src/observable/observable.js#L156)

Entfernt ein Listener aus dem Observable. Braucht dazu den **Listener** als Parameter

```javascript
// Implementation
const removeListener = listeners => value => givenListener =>
    observableBody( removeByKey(listeners)(givenListener(fst)) )(value)

  
// Anwendung
const listenerLog = newListener(listenerLogToConsole);

let obsExample = Observable(0)
                     (addListener)( listenerLog );
                     
obsExample = obsExample(removeListener)( listenerLog );    
```

### [removeListenerByKey](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/951d8489290b05391cb71abdfed25bb2666aa76c/src/observable/observable.js#L125)

Entfernt ein Listener aus dem Observable. Braucht dazu den **Key** des Listener ****als Parameter

```javascript
// Implementation
const removeListenerByKey = listeners => value => listenerKey =>
    observableBody(removeByKey(listeners)(listenerKey))(value)

  
// Anwendung
const listenerLog = newListenerWithCustomKey(42)(listenerLogToConsole);

let obsExample = Observable(0)
                     (addListener)( listenerLog );
                     
obsExample = obsExample(removeListenerByKey)(42)   
```

### \*\*\*\*[**setValue**](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/951d8489290b05391cb71abdfed25bb2666aa76c/src/observable/observable.js#L59)\*\*\*\*

Dem Observable ein neuen Wert mitteilen und alle Listeners benachrichtigen.

```javascript
// Implementation
const setValue = listeners => oldValue => newValue => {
    forEach(listeners)((listener, _) => (listener(snd))(newValue)(oldValue))
    return observableBody(listeners)(newValue)
}


// Anwendung
let obsExample = Observable(0)
testObs(getValue)                // 0
testObs = testObs(setValue)(42)
testObs(getValue)                // 42
```

### \*\*\*\*[**getValue**](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/951d8489290b05391cb71abdfed25bb2666aa76c/src/observable/observable.js#L80)\*\*\*\*

Erhalte den aktuellen Wert des Observable.

```javascript
// Implementation
const getValue = listeners => value => value;

  
// Anwendung
let obsExample = Observable(0)
testObs(getValue)                // 0
testObs = testObs(setValue)(42)
testObs(getValue)                // 42
```

### [newListenerWithCustomKey](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/951d8489290b05391cb71abdfed25bb2666aa76c/src/observable/observable.js#L170)

Syntaktischer Zucker zum Erstellen eines Paares aus Schlüssel und Wert für den neuen Listener. Der Key kann alles sein, was vergleichbar ist. 

{% hint style="info" %}
Funktionen sind nicht vergleichbar,  ausser sie haben eine statische Notation wie n1, n2, id, pair ... 
{% endhint %}

{% hint style="info" %}
Die Listeners brauchen jeweils einen Unikaten Key, damit sie in der Listeners-ListMap im Observable gefunden und entfernt werden kann. 
{% endhint %}

```javascript
// Implementation
const newListener = listenerFn => pair(generateRandomKey())(listenerFn);

  
// Anwendung
const listenerLog = newListenerWithCustomKey(42)(listenerLogToConsole);
```

### \*\*\*\*[**newListener**](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/951d8489290b05391cb71abdfed25bb2666aa76c/src/observable/observable.js#L187)\*\*\*\*

Syntaktischer Zucker zum Erstellen eines Paares aus Schlüssel und Wert für den neuen Listener. Der Key muss im vergleich zu `newListenerWithCustomKey` nicht angeben werden.

```javascript
// Implementation
const newListener = listenerFn => pair(generateRandomKey())(listenerFn);

  
// Anwendung
const listenerLog = newListener(listenerLogToConsole);
```

{% hint style="info" %}
Der `generateRandomKey` erzeugt einen String der Länge sechs mit zufälligen Buchstaben \(Gross-/Kleinschreibung\) & Zahlen.  Siehe implementation: [generateRandomKey](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/2f832eda3d66603b5901aaa060baf4e96a514512/src/observable/observableExamples/observableUtilities.js#L11)  
{% endhint %}

### [setListenerKey](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/951d8489290b05391cb71abdfed25bb2666aa76c/src/observable/observable.js#L202)

Geben dem Listener eine neue Key und erhalte den neuen Listener zurück.

```javascript
// Implementation
const setListenerKey = newKey => listener => pair(newKey)(listener(snd));

  
// Anwendung
let listenerLog = newListener(listenerLogToConsole);
listenerLog = setListenerKey( listenerLog  )(42)
```

### [getListenerKey](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/951d8489290b05391cb71abdfed25bb2666aa76c/src/observable/observable.js#L217%20)

Erhalte den Key des Listener.

```javascript
// Implementation
const getListenerKey = listener => listener(fst);

  
// Anwendung
const listenerLog = newListenerWithCustomKey(42)(listenerLogToConsole);
getListenerKey( listenerLog )  // 42
```



## Helferfunktion

### [logListenersToConsole](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/951d8489290b05391cb71abdfed25bb2666aa76c/src/observable/observable.js#L226)

Die Funktion `logListenersToConsole` wird als Parameter von einem Observable übergeben und führt einen Seiteneffekt aus. Der Seiteneffekt protokolliert alle Listener des Observable mit dessen Schlüsseln und Werten auf der Konsole.





