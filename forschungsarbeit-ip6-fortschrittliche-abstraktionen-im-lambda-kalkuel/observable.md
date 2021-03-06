---
description: >-
  Wie lässt sich ein Wert nach dessen Änderung z.B. auf mehreren Textfeldern
  synchronisiert darstellen?
---

# Observable

#### In  vielen Programmiersprachen bietet sich hierfür das Entwurfsmuster \(Design-Pattern\) des 'Observer-Pattern' an, das in den verschiedenen Sprachen sehr unterschiedlich implementiert wurde. Das Prinzip gestaltet sich allerdings gleich: ein einzelner 'Erzähler' \(Observable\) möchte, dass eine von ihm gesandte Nachricht von einer beliebigen Vielzahl von 'Zuhörern' \(Listeners\) wahrgenommen wird.

Ein einfaches Beispiel.  
Erst wird ein 'Zuhörern' \(Listeners\) erstellt, dem gesagt wird, wie er einem 'Erzähler' \(Observable\) zuhören  soll. Dank



```javascript
const listenObject = {};
const listenerValue = newListener( 42 )( listenerNewValueToElement (valueHolder) );

let obsExample = InitObservable(0)
                     (addListener)(listenerValue)

listenObject .value === 0  // variable "observedObject" get updated from InitialValue

obsExample = obsExample(setValue)(11)

listenObject .value === 11  // variable "observedObject" get updated

obsExample = obsExample(removeListener)(listenerValue)

obsExample = obsExample(setValue)(66)

observedObject.value === 11  // variable "observedObject" getting no updates anymore
```

## [Text-Input Demo-Example](https://mattwolf-corporation.github.io/ip6_lambda-calculus-in-js/src/observableListMap/observableExamples/observableTextInputExample/viewTextInputExample.html)

In dieser Demo wird eine einem 'Observable', genannt _textInputObservable_ welcher auf die Wertänderungen eines Text-Input-Feldes im Html reagiert und dabei alle 'Listeners' mit dem neuen Wert informiert, welche am Observable hinzugefügt wurden.

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

