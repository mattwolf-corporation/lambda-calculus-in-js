import {
    InitObservable,
    addListener,
    removeListenerByHandler,
    handlerFnLogToConsole,
    buildHandlerFnTextContent,
    buildHandlerFnTextContentOldValue,
    handlerBuilder,
    buildHandlerFnTextContentLength
}
    from "../../observableListMap.js";
import {onInputListener} from "../observableUtilities.js";
import {getSafeElements, maybeDomElement, getSafeElementsAsMaybe} from "../../../maybe/maybe.js";
import {
    Box, fold, mapf, chain, debug, mapMaybe,
    flatMapMaybe, mapfMaybe, foldMaybe,
    chainMaybe, tryCatch, getContent
} from "../../../box/box.js";

// The Elements from the Dom
const [inputText, newValue, oldValue, sizes] = getSafeElements("inputText", "newValue", "oldValue", "sizes")

// Define Observable-Handler
const newValueHandler = handlerBuilder(1)(buildHandlerFnTextContent(newValue))
const oldValueHandler = handlerBuilder(2)(buildHandlerFnTextContentOldValue(oldValue))
const labelSizeHandler = handlerBuilder(3)(buildHandlerFnTextContentLength(sizes))
const consoleHandler = handlerBuilder(4)(handlerFnLogToConsole)

// Create Observable-Object, define InitVal and append the Observable-Handler as Listener
let inputObservable = InitObservable("")
(addListener)(newValueHandler)
(addListener)(oldValueHandler)
(addListener)(labelSizeHandler)
(addListener)(consoleHandler)

// Connect the Observable-Object with the Input-Text-Field
onInputListener(inputObservable, inputText)


//For demonstration, how to Un- & Subscribe the Handler from the Observable-Object
const [unsubNewValue, unsubOldValue, unsubSize] = getSafeElementsAsMaybe("unsubNewValue", "unsubOldValue", "unsubSize")


unsubNewValue(err => console.error(err))(newValueElem =>
    newValueElem.onclick = _ => {

        inputObservable = newValueElem.checked
            ? inputObservable(addListener)(newValueHandler)
            : inputObservable(removeListenerByHandler)(newValueHandler)

        onInputListener(inputObservable, inputText)
    })

unsubOldValue(err => console.error(err))(oldValueElem =>
    oldValueElem.onclick = _ => {

        inputObservable = unsubOldValue.checked
            ? inputObservable(addListener)(oldValueHandler)
            : inputObservable(removeListenerByHandler)(oldValueHandler)

        onInputListener(inputObservable, inputText)
    })


unsubSize(err => console.error(err))(sizeElem =>
    sizeElem.onclick = _ => {
        inputObservable = unsubSize.checked
            ? inputObservable(addListener)(labelSizeHandler)
            : inputObservable(removeListenerByHandler)(labelSizeHandler)

        onInputListener(inputObservable, inputText)
    })


