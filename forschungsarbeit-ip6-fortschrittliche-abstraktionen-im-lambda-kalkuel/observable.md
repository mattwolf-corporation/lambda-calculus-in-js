---
description: >-
  Wie lässt sich ein Wert nach dessen Änderung z.B. auf mehreren Textfeldern
  synchronisiert darstellen?
---

# Observable

#### In  vielen Programmiersprachen bietet sich hierfür das Entwurfsmuster \(Design-Pattern\) des 'Observer-Pattern' an, das in den verschiedenen Sprachen sehr unterschiedlich implementiert wurde. Das Prinzip gestaltet sich allerdings gleich: ein einzelner 'Erzähler' \(Observable\) möchte, dass eine von ihm gesandte Nachricht von einer beliebigen Vielzahl von 'Zuhörern' \(Listeners\) wahrgenommen wird.

## _Ein kleines Beispiel_

Erst wird ein 'Zuhörer' \(Listener\) erstellt, dem gesagt wird, wie er einem 'Erzähler' \(Observable\) zuhören  soll. Mit der Funktion `newListener` wird ein neuer Listener erstellt, dabei muss als Parameter eine Funktion erstellt werden, welche die zwei Callback-Parameter  _newValue_ und _oldValue_  wahr nimmt. Die Parameter _newValue_ und _oldValue_  werden vom Observable bei jeder Wertänderung so mitgeben. In diesem Beispiel wird die Variable `listenerVariable`  immer mit dem _newValue_-Wert überschrieben, wenn dieser Listener vom Observable etwas neues mitgeteilt bekommt.

```javascript
let listenerVariable; // undefined
const listenerExample = newListener( newValue => oldValue  => listenerVariable = newValue );
```

Nachdem ein  'Zuhörer' \(Listener\) erstellt wurde, braucht es noch ein 'Erzähler' \(Observable\).  
Dabei nutzt man die Funktion `Observable` und gibt als ersten Parameter immer den initialen Wert an.  
Für das Hinzufügen des Listener an einer Observable gibt es die Funktion `addListener` 

```javascript
let obsExample = Observable(42)                        // new Observable with initValue 42
                     (addListener)( listenerExample ); // add the Listener 'lisExampl' to the Observable
```

Nachdem der Listener mit der Observable verbunden ist, erhält der Listener den aktuellsten Stand vom Observable. In diesem Fall die Zahl '42'. Zusätzlich kann man mit der Funktion `getValue` den aktuellen Wert aus der Observable erhalten.

```javascript
listenerVariable         // 42 <- variable "listenerVariable" get the value from InitialValue
obsExample( getValue );  // 42
```

Mit der Funktion `setValue` wird der Observable ein neuer Wert gesetzt - welcher er anschliessend alle angehängte Listeners benachrichtig und den neuen Wert als _newValue_ mitteilt und der vorherige Wert als _oldValue_ \(darum ist es notwendig, ein Listener immer mit den Parametern _new_- und _oldValue_ zu bauen\).

```javascript
obsExample = obsExample( setValue )(11) // set new value and update all listeners

listenerVariable         // 11
obsExample( getValue );  // 11
```

Wenn man ein Listener wieder entfernen möchte, so dass er dem Observer nicht mehr zuhört, gibt es die Funktion `removeListener`. und gibt den zu entfernenten Listerner an.

```javascript
obsExample = obsExample( removeListener )( listenerExample ); 
```

Von nun an hört der Listener nicht mehr auf den Observable und die Variable listenerVariable wird nicht überschrieben.

```javascript
obsExample = obsExample(setValue)(66);

listenerVariable         // 11 <- variable getting no updates anymore
obsExample( getValue );  // 66
```

### Alles zusammen:

```javascript
let listenerVariable; // undefined
const lisExample = newListener( nVal => oVal => listenerVariable = nVal );

let obsExample = Observable(42)
                     (addListener)(lisExample);

listenerVariable // 0 <- get the value from InitialValue

obsExample = obsExample(setValue)(11) // set new value and update all listeners

listenerVariable // 0 <- get the value from Observable

obsExample = obsExample(removeListener)(lisExample); 

obsExample = obsExample(setValue)(66);

listenerVariable         // 11 <- variable getting no updates anymore 
obsExample( getValue );  // 66 
```

## Observable Text-Input Example

In diesem Beispiel-Projekt wird eine 'Observable', genannt _textInputObservable,_ welcher auf die Wertänderungen eines Text-Input-Feldes auf dem UI reagiert und dabei alle 'Listeners' mit dem neuen und alten Wert informiert. 

{% hint style="info" %}
In der Demo sind die Checkboxen neben den Labels zum dynamischen entfernen und hinzufügen der Listeners da.
{% endhint %}

![Screenshot Text-Input Example](../.gitbook/assets/image%20%282%29.png)

{% hint style="info" %}
Es gibt vorgefertigte _Listener-Funktionen_, welche im Beispiel auch benutzt werden.

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

### Code-Beispiel für ein Obsverable Text-Input

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

Für den vollen Code: [**observableTextInputExample.js**](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/master/src/observable/observableExamples/observableTextInputExample/observableTextInputExample.js)\*\*\*\*

### Demo

{% embed url="https://mattwolf-corporation.github.io/ip6\_lambda-calculus-in-js/src/observable/observableExamples/observableTextInputExample/viewTextInputExample.html" %}



## Observable Color-Picker Example

In diesem Beispiel-Projekt wird gezeigt wie ein Color-Picker mit dem Observable gebaut werden kann.  
Es gibt ein Observable an welche alle Listeners \(Background, Labels und Inputs\) hinzugefügt werden. Die Inputs \(Text-Inputs und Sliders\) sind dabei nicht nur Listeners sondern auch gleichzeitig dafür da, dem Observable neue Werte zu übermitteln. Das heisst, das _'Input R'_ \(Text-Input\) und der _'Range R'_ \(Slider-Input\) sind bidirektional durch den Observer verbunden - solange keiner von beidem als Listener entfernt wird. Um das zu Demonstrieren wurde zusätzlich Buttons im UI hinzugefügt zum Un- und Subscribe des dazugehörigen Listener. 

![Screenshot Color-Picker Example](../.gitbook/assets/image%20%284%29.png)

### Code-Beispiel des Obsverable Color-Picker

{% hint style="info" %}
Der Datentype des Observable ist ein [Triple](../forschungsarbeit-ip5-lambda-kalkuel/einfache-kombinatoren.md#triple), weil die zu behandelte Werte `red, green, blue` sind. 
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

### Demo

{% embed url="https://mattwolf-corporation.github.io/ip6\_lambda-calculus-in-js/src/observable/observableExamples/observableColorPickerExample/viewColorPickerExample.html" %}



## Dokumentation

#### Observable

{% tabs %}
{% tab title="Observable " %}
```javascript
/**
 * initialValue -> observableBody
 * Observable - create observableBody with the initial-value
 *
 * @haskell Observable :: a -> Observable
 *
 * @function
 * @param {number|churchNumber|string} initialValue
 * @return {observable} - a Observable with an emptyListMap & the InitialValue
 * @example
 * const obsExample = Observable(0)
 *                          (addListener)( listenerLogToConsole );
 */
const Observable = initialValue =>
    observableBody(emptyListMap)(initialValue)(setValue)(initialValue)
    
```
{% endtab %}

{% tab title="observableBody " %}
```javascript
/**
 * listeners -> value -> observableFunction -> observableFunction
 * observableBody - the Body-Observable-Construct who for the observableFunctions.
 * observableFunctions are: addListener, removeListener, removeListenerByKey), setValue
 *
 * @haskell observableBody :: [a] -> b -> c -> c
 *
 * @function
 * @param  {listMap} listeners
 * @return {function(value:*): function(obsFn:function): function(obsFn:function)} Observable-Function
 */
const observableBody = listeners => value => obsFn =>
    obsFn(listeners)(value)
```
{% endtab %}

{% tab title="addListener" %}
```javascript
/**
 * listeners -> value -> newListener -> Observable ; addListener
 * add new Listener to the Observable and pass the current Observable-Value e.g. the initValue
 *
 * @haskell addListener :: [a] -> b -> [a] -> Observable
 *
 * @function
 * @param  {listMap} listeners
 * @return {function(value:*): function(newListener:listMap): function(Function) : observableBody}
 */
const addListener = listeners => value => newListener => {
    newListener(snd)(value)(value)
    return observableBody(push(listeners)(newListener))(value)
    
```
{% endtab %}

{% tab title="removeListener" %}
```javascript
/**
 * listeners -> value -> listenerKey ; removeListenerByKey
 * Remove a Listener by his key
 *
 * @haskell removeListenerByKey :: [a] -> b -> c
 *
 * @function
 * @param {listMap} listeners
 * @return {function(value:*): function(listenerKey:*)}
 * @example
 * const listenerLog = newListener( listenerLogToConsole  );
 *
 * let obsExample = Observable(0)
 *                      (addListener)( listenerLog )
 *
 * obsExample = obsExample(removeListener)( listenerLog )
 */
const removeListener = listeners => value => handler =>
    observableBody(removeByKey(listeners)(handler(fst)))(value)
```
{% endtab %}

{% tab title="removeListenerByKey" %}
```javascript
/**
 * listeners -> value -> listenerKey ; removeListenerByKey
 * Remove a Listener by his key
 *
 * @haskell removeListenerByKey :: [a] -> b -> c
 *
 * @function
 * @param  {listMap} listeners
 * @return {function(value:*): function(listenerKey:*)}
 * @example
 * const listenerLog = newListener( listenerLogToConsole  );
 *
 * let obsExample = Observable(0)
 *                      (addListener)( listenerLog )
 *
 * obsExample = obsExample(removeListenerByKey)(42)
 */
const removeListenerByKey = listeners => value => listenerKey =>
    observableBody(removeByKey(listeners)(listenerKey))(value)
```
{% endtab %}

{% tab title="setValue" %}
```javascript
/**
 * listeners -> oldValue -> newValue -> Observable ; setValue
 * set the new value and notify all listenersg
 *
 * @haskell setValue :: [a] -> b -> b -> Observable
 *
 * @sideeffects
 * @function
 * @param {listMap} listeners
 * @return {function(oldValue:*): function(newValue:*): function(Function) : observableBody}
 * @example
 * let obsExample = Observable(0)
 * testObs(getValue) === 0
 * testObs = testObs(setValue)(42)
 * testObs(getValue) === 42
 */
const setValue = listeners => oldValue => newValue => {
    forEach(listeners)((listener, _) => (listener(snd))(newValue)(oldValue))
    return observableBody(listeners)(newValue)
}
```
{% endtab %}

{% tab title="getValue" %}
```javascript
/**
 * listeners -> value -> value ; getValue
 * get the value of Observable
 *
 * @haskell getValue :: [a] -> b -> b
 *
 * @function
 * @param {listMap} listeners
 * @return {function(value:*): function(value:*)}
 * @example
 * let obsExample = Observable(0)
 * testObs(getValue) === 0
 *
 * testObs = testObs(setValue)(42)
 * testObs(getValue) === 42
 */
const getValue = listeners => value => value;

```
{% endtab %}
{% endtabs %}

#### Listener

{% tabs %}
{% tab title="newListener" %}
```javascript
/**
 * Syntactic sugar for creating a pair of Key and Value for the new Listener.
 * The key could be anything that can be comparable. The 'generateRandomKey' generate String with the length of six with random Letters (up-/lowercase) & Numbers.
 * The listenerFn takes two arguments "newValue" and "oldValue" from the the observable. Some Listener-Function are available and ready to use.
 *
 * @function
 * @param  {function} listenerFn
 * @return {listener} new listener with generated key for the observable
 * @example
 * let listenerLogTest = newListener(nValue => oValue => console.log(nValue, oValue);
 *
 * listenerTest = setListenerKey(42)(listenerTest)
 *
 * getListenerKey(listenerTest) === 42)
 */
const newListener = listenerFn => pair(generateRandomKey())(listenerFn);

```
{% endtab %}

{% tab title="newListenerWithCustomKey" %}
```javascript
/**
 * Syntactic sugar for creating a pair of Key and Value for the new Listener.
 * The key could be anything that can be comparable. (Hint: Functions are not comparable except they have a notation like n1, n2, id, pair ... etc.)
 * The listenerFn takes two arguments "newValue" and "oldValue" from the the observable. Some Listener-Function are available and ready to use.
 *
 * @function
 * @param  {*} key
 * @return {function(listenerFn:function) : listener} new listener with custom key for the observable
 * @example
 * let listenerLogTest = newListener(nValue => oValue => console.log(nValue, oValue);
 *
 * listenerTest = setListenerKey(42)(listenerTest)
 *
 * getListenerKey(listenerTest) === 42)
 */
const newListenerWithCustomKey = key => listenerFn => pair(key)(listenerFn);

```
{% endtab %}

{% tab title="setListenerKey" %}
```javascript
/**
 * Set a new Key for the listener
 *
 * @param  {*} newKey
 * @return {function(listener:function) : listener} listener with the key
 * @example
 * let listenerLogTest = newListener(nValue => oValue => console.log(nValue, oValue);
 *
 * listenerTest = setListenerKey(42)(listenerTest)
 *
 * getListenerKey(listenerTest) === 42)
 */
const setListenerKey = newKey => listener => pair(newKey)(listener(snd));

```
{% endtab %}

{% tab title="getListenerKey" %}
```javascript
/**
 * Get the key of listener
 *
 * @param  {function} listener
 * @return {*} key
 * @example
 * let listenerLogTest = newListener(nValue => oValue => console.log(nValue, oValue);
 *
 * listenerTest = setListenerKey(42)(listenerTest)
 *
 * getListenerKey(listenerTest) === 42)
 */
const getListenerKey = listener => listener(fst)

```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
Die Listeners brauchen jeweils einen Unikaten Key, damit sie in der Listeners-Liste im Observable gefunden und entfernt werden kann.
{% endhint %}

{% hint style="info" %}
Mit den Funktionen `newListenerWithCustomKey` und `setListenerKey` kann ein Listenern mit einem gewünschten Key erstellen oder ändern. Ansonsten wird mit eine Key automatisch generiert.  
{% endhint %}

  
 

