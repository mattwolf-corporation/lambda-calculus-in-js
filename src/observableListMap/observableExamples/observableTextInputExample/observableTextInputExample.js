import {
    InitObservable, addListener, setValue, getValue, logListenersToConsole,
    removeListenerByKey, removeListenerByHandler,
    handlerFnLogToConsole, buildHandlerFnInnerText, buildHandlerFnInnerTextOldValue, handlerBuilder, buildHandlerFnInnerTextLength,
    buildHandlerFnValue
} from "../../observableListMap.js";
import { onInputListener } from "../observableUtilities.js";
import {maybe, getSafeElements, getSafeElement} from "../../../maybe/maybe.js";


// Text-Input example
const [inputText, newValue, oldValue, sizes] = getSafeElements("inputText", "newValue", "oldValue", "sizes")

const newValueHandler     = handlerBuilder(1)( buildHandlerFnInnerText          (newValue) )
const oldValueHandler     = handlerBuilder(2)( buildHandlerFnInnerTextOldValue  (oldValue) )
const labelSizeHandler    = handlerBuilder(3)( buildHandlerFnInnerTextLength    (sizes)    )
const consoleHandler      = handlerBuilder(4)( handlerFnLogToConsole                       )

let inputObservable = InitObservable("")
                            (addListener)(newValueHandler)
                            (addListener)(oldValueHandler)
                            (addListener)(labelSizeHandler)
                            (addListener)(consoleHandler)

onInputListener(inputObservable, inputText)



//Toggle (Un/Subscribe)-Handler
const [unsubNewValue,unsubOldValue,unsubSize] = getSafeElements("unsubNewValue", "unsubOldValue", "unsubSize")

unsubNewValue.onclick = _ => {
    inputObservable = unsubNewValue.checked
        ? inputObservable(addListener)(newValueHandler)
        : inputObservable(removeListenerByHandler)(newValueHandler)

    onInputListener(inputObservable, inputText)
}

unsubOldValue.onclick = _ => {
    inputObservable = unsubOldValue.checked
        ? inputObservable(addListener)(oldValueHandler)
        : inputObservable(removeListenerByHandler)(oldValueHandler)

    onInputListener(inputObservable, inputText)
}

unsubSize.onclick = _ => {
    inputObservable = unsubSize.checked
        ? inputObservable(addListener)(labelSizeHandler)
        : inputObservable(removeListenerByHandler)(labelSizeHandler)

    onInputListener(inputObservable, inputText)
}


