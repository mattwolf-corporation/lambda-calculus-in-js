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
import {
    getDomElements,
    eitherElementsOrErrorsByFunction,
    eitherDomElement
} from "../../../maybe/maybe.js";
import {Box, fold, mapf} from "../../../box/box.js";
import {reduce} from "../../../stack/stack.js";
import {convertListMapToArray} from "../../../listMap/listMap.js";

// Either all the necessary Dom-Element exist or display all missed Element
eitherElementsOrErrorsByFunction(eitherDomElement)("inputText", "newValue", "oldValue", "sizes" )
(err => document.body.innerHTML = Box(err)
                                    (mapf)(reduce((acc, curr) => acc + "<br>" + curr )("<h1>Error</h1>"))
                                    (fold)(txt => `<div style="background: #ffcccb; padding: 10px; border-radius: 1rem">${txt}</div>`))
(result => {

    // Get the elements
   const [inputText, newValue, oldValue, sizes] = convertListMapToArray(result);

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

})