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

const maybes = (...ms) => fn => {
    const mayStacks = convertArrayToStack(ms);
    forEach(mayStacks)(m => m()())
}

// variante 1
("inputText", maybe("inputText"))
maybes("inputText", "newValue")(m => document.getElementById(m))
(_ => console.error) //wenn einer failed und erstell eine RIESEN TEXT ERROR PAGE ans DOM BODY
(stack => {           // wenn alle erfolgreich
    // Problem wie weiss man welches element was ist und name ???
    // Lüsung evtl listMap verwenden weil keyValue und dann kann save auf getElment by key zugegegriffen werden

    const inputText = getElementByKey(stack)("inpuText")

    startProgramm(inputText, newValue) // final aus
} )


function startProgramm(...args){
    args === [inputText,newValue  ]
}


//varinate 2

const kmaybes = maybeKaskade
                    (maybeNumber(3))
                    (nextMaybe)
                    (maybeNumber(4))
                    (nextMaybe)
                    (maybeNumber(5))
                    (endMaybe)

kmaybes === ([Just3,Just4,Just5])



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
