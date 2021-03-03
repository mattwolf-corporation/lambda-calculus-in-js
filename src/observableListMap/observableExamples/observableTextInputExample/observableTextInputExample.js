import {
    InitObservable,
    addListener,
    removeListenerByHandler,
    handlerFnLogToConsole,
    buildHandlerFnTextContent,
    buildHandlerFnTextContentOldValue,
    handlerBuilder,
    buildHandlerFnTextContentLength,
    setValue
}from "../../observableListMap.js";
import {getDomElements} from "../../../maybe/maybe.js";


// The Elements from the Dom
const [inputText, newValue, oldValue, sizes] = getDomElements("inputText", "newValue", "oldValue", "sizes");

// Define Observable-Handler
const newValueHandler     = handlerBuilder(1)( buildHandlerFnTextContent          (newValue) );
const oldValueHandler     = handlerBuilder(2)( buildHandlerFnTextContentOldValue  (oldValue) );
const labelSizeHandler    = handlerBuilder(3)( buildHandlerFnTextContentLength    (sizes)    );
const consoleHandler      = handlerBuilder(4)( handlerFnLogToConsole                         );

// Create Observable-Object, define InitVal and append the Observable-Handler as Listener
let valueObservables = InitObservable("")
                            (addListener)( newValueHandler  )
                            (addListener)( oldValueHandler  )
                            (addListener)( labelSizeHandler )
                            (addListener)( consoleHandler   );

// Connect the Observables with the Input-Text-Field
inputText.oninput = _ => valueObservables = valueObservables(setValue)(inputText.value);

//For demonstration, how to Un- & Subscribe the Handler from the Observable-Object
const [unsubNewValue, unsubOldValue, unsubSize] = getDomElements("unsubNewValue", "unsubOldValue", "unsubSize");

unsubNewValue.onclick = _ =>
    valueObservables =
        unsubNewValue.checked
            ? valueObservables(addListener)(newValueHandler)
            : valueObservables(removeListenerByHandler)(newValueHandler);

unsubOldValue.onclick = _ =>
    valueObservables =
        unsubOldValue.checked
            ? valueObservables(addListener)(oldValueHandler)
            : valueObservables(removeListenerByHandler)(oldValueHandler);

unsubSize.onclick = _ =>
    valueObservables =
        unsubSize.checked
            ? valueObservables(addListener)(labelSizeHandler)
            : valueObservables(removeListenerByHandler)(labelSizeHandler);
