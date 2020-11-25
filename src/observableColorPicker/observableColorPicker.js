import {
    InitObservable, addListener, setValue, getValue, logListenersToConsole,
    removeListenerByKey, removeListenerByHandler,
    handlerFnLogToConsole, buildHandlerFnInnerText, handlerBuilder, buildHandlerFnInnerTextLength,
    buildHandlerFnValue

} from "../observableListMap/observableListMap.js";
import {firstOfTriple, secondOfTriple, thirdOfTriple, triple} from "../lambda-calculus-library/lambda-calculus.js";

const getElement = id => document.getElementById(id); // maybe impl for safety
const getElements = (...id) => id.map(e => getElement(e))

const onInputListener = (observable, input) => input.oninput = _ => observable = observable(setValue)(input.value) // maybe impl for safety
const onInputListeners = (observable, ...inputs) => inputs.map(input => onInputListener(observable, input))


const [nameInput, label, sizes] = getElements("name", "label", "sizes")

// "let" wenn später zusätzliche Listener hinzugefügt oder entfernt werden soll,
// ansonsten, wenn immutable mit "const" vor veränderung schützen

const labelHandler      = handlerBuilder(1)(buildHandlerFnInnerText(label))
const labelSizeHandler  = handlerBuilder(2)(buildHandlerFnInnerTextLength(sizes))
const consoleHandler    = handlerBuilder(3)(handlerFnLogToConsole)

const inputObservable = InitObservable("")
                            (addListener)(labelHandler)
                            (addListener)(labelSizeHandler)
                            (addListener)(consoleHandler)

onInputListener(inputObservable, nameInput)


const toRGBString = (r, g, b) => 'rgb(' + r + ',' + g + ',' + b + ')'
const toHexString = (r, g, b) => "#" + toHex(r) + toHex(g) + toHex(b)
const toHex = n => {
    if (n === undefined) n = 0
    let hex = Math.round(n).toString(16)
    return hex.length === 1 ? "0" + hex : hex
}

const [resultColor, rgbValue, hex, hsl] = getElements("resultColor", "rgbValue", "hex", "hsl")
const [inputR, inputG, inputB] = getElements("inputR", "inputG", "inputB")
const [rangeR, rangeG, rangeB] = getElements("rangeR", "rangeG", "rangeB")

const getRed = firstOfTriple
const getGreen = secondOfTriple
const getBlue = thirdOfTriple

const valueHandlerInputR            = handlerBuilder(1)(nVal => oVal => inputR.value = nVal(getRed))
const valueHandlerRangeR            = handlerBuilder(2)(nVal => oVal => rangeR.value = nVal(getRed))
const valueHandlerInputG            = handlerBuilder(1)(nVal => oVal => inputG.value = nVal(getGreen))
const valueHandlerRangeG            = handlerBuilder(2)(nVal => oVal => rangeG.value = nVal(getGreen))
const valueHandlerInputB            = handlerBuilder(1)(nVal => oVal => inputB.value = nVal(getBlue))
const valueHandlerRangeB            = handlerBuilder(2)(nVal => oVal => rangeB.value = nVal(getBlue))
const rgbHandlerBgColorRGB          = handlerBuilder(3)(nVal => oVal => resultColor.style.backgroundColor = toRGBString(nVal(getRed), nVal(getGreen), nVal(getBlue)))
const valueHandlerRgbTextRGB        = handlerBuilder(4)(nVal => oVal => rgbValue.value = toRGBString(nVal(getRed), nVal(getGreen), nVal(getBlue)))
const valueHandlerHexTextRGB        = handlerBuilder(5)(nVal => oVal => hex.innerText = toHexString(nVal(getRed), nVal(getGreen), nVal(getBlue)))


let rgbObservable = InitObservable(triple(11)(22)(44))
                        (addListener)(valueHandlerInputR)
                        (addListener)(valueHandlerRangeR)
                        (addListener)(valueHandlerInputG)
                        (addListener)(valueHandlerRangeG)
                        (addListener)(valueHandlerInputB)
                        (addListener)(valueHandlerRangeB)
                        (addListener)(rgbHandlerBgColorRGB)
                        (addListener)(valueHandlerRgbTextRGB)
                        (addListener)(valueHandlerHexTextRGB)


inputR.oninput = _ => rgbObservable = rgbObservable(setValue)(
    triple
    (inputR.value)
    (rgbObservable(getValue)(getGreen))
    (rgbObservable(getValue)(getBlue))
)

rangeR.oninput = _ => rgbObservable = rgbObservable(setValue)(
    triple
    (rangeR.value)
    (rgbObservable(getValue)(getGreen))
    (rgbObservable(getValue)(getBlue))
)

inputG.oninput = _ => rgbObservable = rgbObservable(setValue)(
    triple
    (rgbObservable(getValue)(getRed))
    (inputG.value)
    (rgbObservable(getValue)(getBlue))
)

rangeG.oninput = _ => rgbObservable = rgbObservable(setValue)(
    triple
    (rgbObservable(getValue)(getRed))
    (rangeG.value)
    (rgbObservable(getValue)(getBlue))
)

inputB.oninput = _ => rgbObservable = rgbObservable(setValue)(
    triple
    (rgbObservable(getValue)(getRed))
    (rgbObservable(getValue)(getGreen))
    (inputB.value)
)

rangeB.oninput = _ => rgbObservable = rgbObservable(setValue)(
    triple
    (rgbObservable(getValue)(getRed))
    (rgbObservable(getValue)(getGreen))
    (rangeB.value)
)


const notifyListenersWithInitialsValues = (...observables) =>
    observables.forEach(obs => obs(setValue)(obs(getValue)))

notifyListenersWithInitialsValues(rgbObservable)

// Toggle (Un/Subscribe)-Handler of RGB-Background
const unsubRgbBg = getElement("unsubRgbBg")
unsubRgbBg.onclick = e => {
    console.log(unsubRgbBg.checked)

    if (unsubRgbBg.checked) {
        rgbObservable = rgbObservable(removeListenerByHandler)(rgbHandlerBgColorRGB)
        unsubRgbBg.labels[0].innerText = "Subscribe RGB-Background"
    } else {
        rgbObservable = rgbObservable(addListener)(rgbHandlerBgColorRGB)
        unsubRgbBg.labels[0].innerText = "UnSubscribe RGB-Background"
    }

}

