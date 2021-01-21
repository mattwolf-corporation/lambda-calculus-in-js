import {
    InitObservable,
    addListener,
    setValue,
    getValue,
    removeListenerByHandler,
    handlerBuilder
} from "../../observableListMap.js";
import {
    firstOfTriple,
    secondOfTriple,
    thirdOfTriple,
    triple
} from "../../../lambda-calculus-library/lambda-calculus.js";
import {
    onInputListener,
    onInputListeners,
    setInitialsValues,
    toHexString,
    toRGBString,
    addUnSubscriberToggle,
    creatToggleElement
} from "../observableUtilities.js";
import {getSafeElement, getSafeElements} from "../../../maybe/maybe.js";


const [resultColor, rgbValue, hex, hsl] = getSafeElements("resultColor", "rgbValue", "hex", "hsl")
const [inputR, inputG, inputB] = getSafeElements("inputR", "inputG", "inputB")
const [rangeR, rangeG, rangeB] = getSafeElements("rangeR", "rangeG", "rangeB")

const getRed = firstOfTriple
const getGreen = secondOfTriple
const getBlue = thirdOfTriple

const valueHandlerInputR = handlerBuilder(1)(nVal => oVal => inputR.value = nVal(getRed))
const valueHandlerRangeR = handlerBuilder(2)(nVal => oVal => rangeR.value = nVal(getRed))
const valueHandlerInputG = handlerBuilder(3)(nVal => oVal => inputG.value = nVal(getGreen))
const valueHandlerRangeG = handlerBuilder(4)(nVal => oVal => rangeG.value = nVal(getGreen))
const valueHandlerInputB = handlerBuilder(5)(nVal => oVal => inputB.value = nVal(getBlue))
const valueHandlerRangeB = handlerBuilder(6)(nVal => oVal => rangeB.value = nVal(getBlue))
const rgbHandlerBgColorRGB = handlerBuilder(7)(nVal => oVal => resultColor.style.backgroundColor = toRGBString(nVal(getRed), nVal(getGreen), nVal(getBlue)))
const valueHandlerRgbTextRGB = handlerBuilder(8)(nVal => oVal => rgbValue.value = toRGBString(nVal(getRed), nVal(getGreen), nVal(getBlue)))
const valueHandlerHexTextRGB = handlerBuilder(9)(nVal => oVal => hex.innerText = toHexString(nVal(getRed), nVal(getGreen), nVal(getBlue)))


let rgbObservable = InitObservable(triple(154)(211)(44))
                                (addListener)(valueHandlerInputR)
                                (addListener)(valueHandlerRangeR)
                                (addListener)(valueHandlerInputG)
                                (addListener)(valueHandlerRangeG)
                                (addListener)(valueHandlerInputB)
                                (addListener)(valueHandlerRangeB)
                                (addListener)(rgbHandlerBgColorRGB)
                                (addListener)(valueHandlerRgbTextRGB)
                                (addListener)(valueHandlerHexTextRGB)


inputR.oninput = _ =>
    rgbObservable = rgbObservable(setValue)(
        triple
        (inputR.value)
        (rgbObservable(getValue)(getGreen))
        (rgbObservable(getValue)(getBlue))
    )

rangeR.oninput = _ =>
    rgbObservable = rgbObservable(setValue)(
        triple
        (rangeR.value)
        (rgbObservable(getValue)(getGreen))
        (rgbObservable(getValue)(getBlue))
    )

inputG.oninput = _ =>
    rgbObservable = rgbObservable(setValue)(
        triple
        (rgbObservable(getValue)(getRed))
        (inputG.value)
        (rgbObservable(getValue)(getBlue))
    )

rangeG.oninput = _ =>
    rgbObservable = rgbObservable(setValue)(
        triple
        (rgbObservable(getValue)(getRed))
        (rangeG.value)
        (rgbObservable(getValue)(getBlue))
    )

inputB.oninput = _ =>
    rgbObservable = rgbObservable(setValue)(
        triple
        (rgbObservable(getValue)(getRed))
        (rgbObservable(getValue)(getGreen))
        (inputB.value)
    )

rangeB.oninput = _ =>
    rgbObservable = rgbObservable(setValue)(
        triple
        (rgbObservable(getValue)(getRed))
        (rgbObservable(getValue)(getGreen))
        (rangeB.value)
    )

setInitialsValues(rgbObservable)





// Toggle Un/Subscribes
const rgbResultElement = creatToggleElement("resultColor")
rgbResultElement.onclick = _ => rgbObservable = addUnSubscriberToggle(rgbObservable, rgbHandlerBgColorRGB, rgbResultElement, "RGB-Background")

const rgbTextElement = creatToggleElement("rgbValue", true)
rgbTextElement.onclick = _ => rgbObservable = addUnSubscriberToggle(rgbObservable, valueHandlerRgbTextRGB, rgbTextElement, "RGB")

const hexTextElement = creatToggleElement("hex", true)
hexTextElement.onclick = _ => rgbObservable = addUnSubscriberToggle(rgbObservable, valueHandlerHexTextRGB, hexTextElement, "HEX")

const inputRTextElement = creatToggleElement("inputR", true)
inputRTextElement.onclick = _ => rgbObservable = addUnSubscriberToggle(rgbObservable, valueHandlerInputR, inputRTextElement, "Input R")

const rangeRTextElement = creatToggleElement("rangeR", true)
rangeRTextElement.onclick = _ => rgbObservable = addUnSubscriberToggle(rgbObservable, valueHandlerRangeR, rangeRTextElement, "Range R")

