import {
    Observable,
    addListener,
    removeListener,
    listenerLogToConsole,
    listenerNewValueToDomElementTextContent,
    listenerOldValueToDomElementTextContent,
    newListener,
    listenerNewValueLengthToElementTextContent,
    setValue
}from "../../observable.js";
import {getDomElements, Just, Nothing, Right, Left } from "../../../maybe/maybe.js";

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


//For demonstration, how to Un- & Subscribe the Handler from the Observable-Object
const [unsubNewValue, unsubOldValue, unsubSize] = getDomElements("unsubNewValue", "unsubOldValue", "unsubSize");

unsubNewValue.onclick = _ =>
    textInputObservables =
        unsubNewValue.checked
            ? textInputObservables(addListener)(listenerNewValue)
            : textInputObservables(removeListener)(listenerNewValue);

unsubOldValue.onclick = _ =>
    textInputObservables =
        unsubOldValue.checked
            ? textInputObservables(addListener)(listenerOldValue)
            : textInputObservables(removeListener)(listenerOldValue);

unsubSize.onclick = _ =>
    textInputObservables =
        unsubSize.checked
            ? textInputObservables(addListener)(listenerNewValueSize)
            : textInputObservables(removeListener)(listenerNewValueSize);
