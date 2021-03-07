---
description: >-
  Wie lässt sich ein Wert nach dessen Änderung z.B. auf mehreren Textfeldern
  synchronisiert darstellen?
---

# Observable

#### In  vielen Programmiersprachen bietet sich hierfür das Entwurfsmuster \(Design-Pattern\) des 'Observer-Pattern' an, das in den verschiedenen Sprachen sehr unterschiedlich implementiert wurde. Das Prinzip gestaltet sich allerdings gleich: ein einzelner 'Erzähler' \(Observable\) möchte, dass eine von ihm gesandte Nachricht von einer beliebigen Vielzahl von 'Zuhörern' \(Listeners\) wahrgenommen wird.

### _Ein kleines Beispiel_

Erst wird ein 'Zuhörer' \(Listener\) erstellt, dem gesagt wird, wie er einem 'Erzähler' \(Observable\) zuhören  soll. Mit der Funktion `newListener` wird ein neuer Listener erstellt, dabei muss als Parameter eine Funktion erstellt werden, welche die zwei Callback-Parameter  _newValue_ und _oldValue_  nimmt. Die Parameter _newValue_ und _oldValue_  sind vom Observable so geben. In diesem Beispiel wird die Variable `listenerVariable`  immer mit dem _newValue_-Wert überschrieben, wenn dieser Listener vom Observable etwas neues mitgeteilt bekommt.  


```javascript
let listenerVariable; // undefined
const lisExample = newListener( newValue => oldValue  => listenerVariable = newValue );
```

Nachdem ein  'Zuhörer' \(Listener\) erstellt wurde, braucht es noch ein 'Erzähler' \(Observable\).  
Dabei nutzt man die Funktion `Observable` und gibt als ersten Parameter immer den initialen Wert an.  
Für das Hinzufügen des Listener an einer Observable gibt es die Funktion `addListener` 

```javascript
let obsExample = Observable(42)                 // new Observable with initValue 42
                     (addListener)(lisExample); // add the Listener 'lisExampl' to the Observable
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
obsExample = obsExample( removeListener )( lisExample ); 
```

Von nun an hört der Listener nicht mehr auf den Observable und die Variable listenerVariable wird nicht überschrieben.

```javascript
obsExample = obsExample(setValue)(66);

listenerVariable         // 11 <- variable getting no updates anymore
obsExample( getValue );  // 66
```

Alles zusammen:

```javascript
let listenerVariable; 
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



------

### Text-Input Demo-Example

In dieser Demo wird eine einem 'Observable', genannt _textInputObservable_ welcher auf die Wertänderungen eines Text-Input-Feldes im Html reagiert und dabei alle 'Listeners' mit dem neuen Wert informiert, welche an den Observable hinzugefügt wurden.



```javascript
const [inputText, newValue, oldValue, sizes] = getDomElements("inputText", "newValue", "oldValue", "sizes");

// Create Listener
const listenerNewValue      = newListener(1)( listenerNewValueToDomElementTextContent     (newValue) );
const oldValueHandler       = newListener(2)( listenerOldValueToDomElementTextContent     (oldValue) );
const listenerNewValueSize  = newListener(3)( listenerNewValueLengthToElementTextContent  (sizes)    );
const listenerConsoleLog    = newListener(4)( listenerLogToConsole                                   );

// Create Observable-Object, define the Initial-Value and append the Listeners
let textInputObservables = InitObservable("")
                            (addListener)( listenerNewValue     )
                            (addListener)( oldValueHandler      )
                            (addListener)( listenerNewValueSize )
                            (addListener)( listenerConsoleLog   );

// Connect the Observables with the Input-Text-Field.
// Every change in the Input-Field execute the 'setValue'-Function with the new value from Input-Field.
inputText.oninput = _ =>
    textInputObservables = textInputObservables(setValue)(inputText.value);

```

{% embed url="https://mattwolf-corporation.github.io/ip6\_lambda-calculus-in-js/src/observable/observableExamples/observableTextInputExample/viewTextInputExample.html" %}

  
 

