import {InitObservable, addListener, setValue, getValue,
    removeListener, logListenersToConsole,
    handlerFnLogToConsole, buildHandlerFnInnerText, handlerBuilder, buildHandlerFnInnerTextLength,
    buildHandlerFnValue

} from "../observableListMap/observableListMap.js";

import { pair} from "../lambda-calculus-library/lambda-calculus.js";

const getElement  = id => document.getElementById(id); // maybe impl for safety
const getElements = (...id) => id.map(e => getElement(e))

const onInputListener  = (observable, input) => input.oninput = _ => observable = observable(setValue)(input.value) // maybe impl for safety
const onInputListeners = (observable, ...inputs) => inputs.map(input => onInputListener(observable, input))

const [nameInput, label, sizes] = getElements("name", "label", "sizes")

// "let" wenn soll zusätzliche Listener hinzugefügt werden,
// ansonsten, wenn immutable mit "const" vor veränderung schützen

const labelHandler     = handlerBuilder(1)(buildHandlerFnInnerText(label))
const labelSizeHandler = handlerBuilder(2)(buildHandlerFnInnerTextLength(sizes))
const consoleHandler   = handlerBuilder(3)(handlerFnLogToConsole)

const inputObservable = InitObservable(23523523)
(addListener)( labelHandler )
(addListener)( labelSizeHandler )
//(addListener)( consoleHandler )


onInputListener(inputObservable, nameInput)

console.log(inputObservable(getValue))


const toRGBString = (r,g,b) => 'rgb(' + r + ',' + g+ ',' + b + ')'

const toHexString = (r,g,b) => "#" + toHex(r) + toHex(g) + toHex(b)

const toHex = n => {
    if (n === undefined) n = 0
    let hex = n.toString(16);
    if (hex.length === 1) {
        hex = "0" + hex;
    }
    return hex;
}


const [resultColor, rgbValue, hex, hsl] = getElements("resultColor", "rgbValue", "hex", "hsl")
const [inputR, inputG, inputB]          = getElements("inputR", "inputG", "inputB")
const [rangeR, rangeG, rangeB]          = getElements("rangeR", "rangeG", "rangeB")

const valueHandlerInputR          = handlerBuilder(1)(buildHandlerFnValue(inputR))
const valueHandlerRangeR          = handlerBuilder(2)(buildHandlerFnValue(rangeR))
const rgbHandlerR                 = handlerBuilder(3)(nVal => oVal => resultColor.style.backgroundColor = toRGBString(nVal, obsG(getValue), obsB(getValue)))
const valueHandlerRgbTextR        = handlerBuilder(4)(nVal => oVal => rgbValue.value                    = toRGBString(nVal, obsG(getValue), obsB(getValue)))
const valueHandlerHexTextR        = handlerBuilder(5)(nVal => oVal => hex.innerText                     = toHexString(nVal, obsG(getValue), obsB(getValue)))

const obsR = InitObservable("55")
(addListener)(valueHandlerInputR)
(addListener)(valueHandlerRangeR)
(addListener)(rgbHandlerR)
(addListener)(valueHandlerRgbTextR)
(addListener)(valueHandlerHexTextR)




const valueHandlerInputG          = handlerBuilder(1)(buildHandlerFnValue(inputG))
const valueHandlerRangeG          = handlerBuilder(2)(buildHandlerFnValue(rangeG))
const rgbHandlerG                 = handlerBuilder(3)(nVal => oVal => resultColor.style.backgroundColor = toRGBString(obsR(getValue), nVal, obsB(getValue)))
const valueHandlerRgbTextG        = handlerBuilder(4)(nVal => oVal => rgbValue.value                    = toRGBString(obsR(getValue), nVal, obsB(getValue)))
const valueHandlerHexTextG        = handlerBuilder(5)(nVal => oVal => hex.innerText                     = toHexString(obsR(getValue), nVal, obsB(getValue)))

const obsG = InitObservable(34)
(addListener)(valueHandlerInputG)
(addListener)(valueHandlerRangeG)
(addListener)(rgbHandlerG)
(addListener)(valueHandlerRgbTextG)
(addListener)(valueHandlerHexTextG)


const valueHandlerInputB          = handlerBuilder(2)(buildHandlerFnValue(inputB))
const valueHandlerRangeB          = handlerBuilder(2)(buildHandlerFnValue(rangeB))
const rgbHandlerB                 = handlerBuilder(4)(nVal => oVal => resultColor.style.backgroundColor = toRGBString(obsR(getValue), obsG(getValue), nVal))
const valueHandlerRgbTextB        = handlerBuilder(4)(nVal => oVal => rgbValue.value                    = toRGBString(obsR(getValue), obsG(getValue), nVal))
const valueHandlerHexTextB        = handlerBuilder(5)(nVal => oVal => hex.innerText                     = toHexString(obsR(getValue), obsG(getValue), nVal))

const obsB = InitObservable(55)
(addListener)(valueHandlerInputB)
(addListener)(valueHandlerRangeB)
(addListener)(rgbHandlerB)
(addListener)(valueHandlerRgbTextB)
(addListener)(valueHandlerHexTextB)



onInputListeners(obsR, inputR, rangeR)
onInputListeners(obsG, inputG, rangeG)
onInputListeners(obsB, inputB, rangeB)



const notifyListenersWithInitialsValues = (...observables) =>
    observables.forEach(obs => obs(setValue)(obs(getValue)))


notifyListenersWithInitialsValues(obsR, obsG, obsB)

