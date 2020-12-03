import {
    InitObservable, addListener, setValue, getValue, logListenersToConsole,
    removeListenerByKey, removeListenerByHandler,
    handlerFnLogToConsole, buildHandlerFnInnerText, buildHandlerFnInnerTextOldValue, handlerBuilder, buildHandlerFnInnerTextLength,
    buildHandlerFnValue
} from "../../observableListMap.js";
import { onInputListener } from "../observableUtilities.js";
import {maybe, getSafeElements} from "../../../maybe/maybe.js";


// Text-Input example
const [inputText, newValue, oldValue, sizes] = getSafeElements("inputText", "newValue", "oldValue", "sizes")

const newValueHandler     = handlerBuilder(1)( buildHandlerFnInnerText          (newValue) )
const oldValueHandler     = handlerBuilder(2)( buildHandlerFnInnerTextOldValue  (oldValue) )
const labelSizeHandler    = handlerBuilder(3)( buildHandlerFnInnerTextLength    (sizes)    )
const consoleHandler      = handlerBuilder(4)( handlerFnLogToConsole                       )

const inputObservable = InitObservable("")
                            (addListener)(newValueHandler)
                            (addListener)(oldValueHandler)
                            (addListener)(labelSizeHandler)
                            (addListener)(consoleHandler)

onInputListener(inputObservable, inputText)



// Toggle (Un/Subscribe)-Handler of RGB-Background
// const unsubRgbBg = getSafeElements("unsubRgbBg")
// unsubRgbBg.onclick = e => {
//     console.log(unsubRgbBg.checked)
//
//     if (unsubRgbBg.checked) {
//         rgbObservable = rgbObservable(removeListenerByHandler)(rgbHandlerBgColorRGB)
//         unsubRgbBg.labels[0].innerText = "Subscribe RGB-Background"
//     } else {
//         rgbObservable = rgbObservable(addListener)(rgbHandlerBgColorRGB)
//         unsubRgbBg.labels[0].innerText = "UnSubscribe RGB-Background"
//     }
// }

