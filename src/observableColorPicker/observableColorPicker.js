import {InitObservable, addListener, setValue, getValue, logListenersToConsole,
    removeListenerByKey, removeListenerByHandler,
    handlerFnLogToConsole, buildHandlerFnInnerText, handlerBuilder, buildHandlerFnInnerTextLength,
    buildHandlerFnValue

} from "../observableListMap/observableListMap.js";

import { pair, fst, snd} from "../lambda-calculus-library/lambda-calculus.js";

const getElement  = id => document.getElementById(id); // maybe impl for safety
const getElements = (...id) => id.map(e => getElement(e))

const onInputListener  = (observable, input) => input.oninput = _ => observable = observable(setValue)(input.value) // maybe impl for safety
const onInputListeners = (observable, ...inputs) => inputs.map(input => onInputListener(observable, input))


const [nameInput, label, sizes] = getElements("name", "label", "sizes")

// "let" wenn später zusätzliche Listener hinzugefügt oder entfernt werden soll,
// ansonsten, wenn immutable mit "const" vor veränderung schützen

const labelHandler     = handlerBuilder(1)(buildHandlerFnInnerText(label))
const labelSizeHandler = handlerBuilder(2)(buildHandlerFnInnerTextLength(sizes))
const consoleHandler   = handlerBuilder(3)(handlerFnLogToConsole)

const inputObservable = InitObservable(23523523)
(addListener)( labelHandler )
(addListener)( labelSizeHandler )
(addListener)( consoleHandler )


onInputListener(inputObservable, nameInput)

console.log(inputObservable(getValue))


const toRGBString = (r,g,b) => 'rgb(' + r + ',' + g+ ',' + b + ')'

const toHexString = (r,g,b) => "#" + toHex(r) + toHex(g) + toHex(b)

const toHex = n => {
    if (n === undefined) n = 0
    let hex = Math.round(n).toString(16)
    if (hex.length === 1) {
        hex = "0" + hex;
    }
    return hex;
}


const [resultColor, rgbValue, hex, hsl] = getElements("resultColor", "rgbValue", "hex", "hsl")
const [inputR, inputG, inputB]          = getElements("inputR", "inputG", "inputB")
const [rangeR, rangeG, rangeB]          = getElements("rangeR", "rangeG", "rangeB")

// Red
const valueHandlerInputR          = handlerBuilder("inputR"         )(buildHandlerFnValue(inputR))
const valueHandlerRangeR          = handlerBuilder("rangeR"         )(buildHandlerFnValue(rangeR))
const rgbHandlerBgColorR                 = handlerBuilder("rgbColorR"      )(nVal => oVal => resultColor.style.backgroundColor = toRGBString(nVal, obsG(getValue), obsB(getValue)))
const valueHandlerRgbTextR        = handlerBuilder("rgbTextColorR"  )(nVal => oVal => rgbValue.value                    = toRGBString(nVal, obsG(getValue), obsB(getValue)))
const valueHandlerHexTextR        = handlerBuilder("hexTextColorR"  )(nVal => oVal => hex.innerText                     = toHexString(nVal, obsG(getValue), obsB(getValue)))

let obsR = InitObservable(76)
                (addListener)(valueHandlerInputR)
                (addListener)(valueHandlerRangeR)
                (addListener)(rgbHandlerBgColorR)
                (addListener)(valueHandlerRgbTextR)
                (addListener)(valueHandlerHexTextR)

// Green
const valueHandlerInputG          = handlerBuilder("inputG"         )(buildHandlerFnValue(inputG))
const valueHandlerRangeG          = handlerBuilder("rangeG"         )(buildHandlerFnValue(rangeG))
const rgbHandlerBgColorG                 = handlerBuilder("rgbColorG"      )(nVal => oVal => resultColor.style.backgroundColor = toRGBString(obsR(getValue), nVal, obsB(getValue)))
const valueHandlerRgbTextG        = handlerBuilder("rgbTextColorG"  )(nVal => oVal => rgbValue.value                    = toRGBString(obsR(getValue), nVal, obsB(getValue)))
const valueHandlerHexTextG        = handlerBuilder("hexTextColorG"  )(nVal => oVal => hex.innerText                     = toHexString(obsR(getValue), nVal, obsB(getValue)))

let obsG = InitObservable(34)
                (addListener)(valueHandlerInputG)
                (addListener)(valueHandlerRangeG)
                (addListener)(rgbHandlerBgColorG)
                (addListener)(valueHandlerRgbTextG)
                (addListener)(valueHandlerHexTextG)

// Blue
const valueHandlerInputB          = handlerBuilder(1)(buildHandlerFnValue(inputB))
const valueHandlerRangeB          = handlerBuilder(2)(buildHandlerFnValue(rangeB))
const rgbHandlerBgColorB                 = handlerBuilder(3)(nVal => oVal => resultColor.style.backgroundColor = toRGBString(obsR(getValue), obsG(getValue), nVal))
const valueHandlerRgbTextB        = handlerBuilder(4)(nVal => oVal => rgbValue.value                    = toRGBString(obsR(getValue), obsG(getValue), nVal))
const valueHandlerHexTextB        = handlerBuilder(5)(nVal => oVal => hex.innerText                     = toHexString(obsR(getValue), obsG(getValue), nVal))

let obsB = InitObservable(55)
                (addListener)(valueHandlerInputB)
                (addListener)(valueHandlerRangeB)
                (addListener)(rgbHandlerBgColorB)
                (addListener)(valueHandlerRgbTextB)
                (addListener)(valueHandlerHexTextB)



// onInputListeners(obsR, inputR, rangeR)
// onInputListeners(obsG, inputG, rangeG)
// onInputListeners(obsB, inputB, rangeB)

inputR.oninput = _ => obsR = obsR(setValue)(inputR.value)
rangeR.oninput = _ => obsR = obsR(setValue)(rangeR.value)

inputG.oninput = _ => obsG = obsG(setValue)(inputG.value)
rangeG.oninput = _ => obsG = obsG(setValue)(rangeG.value)

inputB.oninput = _ => obsB = obsB(setValue)(inputB.value)
rangeB.oninput = _ => obsB = obsB(setValue)(rangeB.value)

const notifyListenersWithInitialsValues = (...observables) =>
    observables.forEach(obs => obs(setValue)(obs(getValue)))

notifyListenersWithInitialsValues(obsR, obsG, obsB)


const unsubRgbBg = getElement("unsubRgbBg")
unsubRgbBg.onclick = e => {
    console.log(unsubRgbBg.checked)

    if (unsubRgbBg.checked){
        obsR = obsR(removeListenerByHandler)(rgbHandlerBgColorR)
        obsG = obsG(removeListenerByHandler)(rgbHandlerBgColorG)
        obsB = obsB(removeListenerByHandler)(rgbHandlerBgColorB)
        unsubRgbBg.labels[0].innerText = "Subscribe RGB-Background"
    } else {
        obsR = obsR(addListener)(rgbHandlerBgColorR)
        obsG = obsG(addListener)(rgbHandlerBgColorG)
        obsB = obsB(addListener)(rgbHandlerBgColorB)
        unsubRgbBg.labels[0].innerText = "UnSubscribe RGB-Background"
    }

}

