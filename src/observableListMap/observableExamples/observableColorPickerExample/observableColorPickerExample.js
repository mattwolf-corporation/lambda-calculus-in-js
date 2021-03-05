import {
    InitObservable,
    addListener,
    setValue,
    getValue,
    removeListener,
    newListener
} from "../../observableListMap.js";
import {
    firstOfTriple,
    secondOfTriple,
    thirdOfTriple,
    triple
} from "../../../lambda-calculus-library/lambda-calculus.js";
import {
    toHexString,
    toRGBString,
    addUnSubscriberToggle,
    creatHtmlUnsubscribeToggle
} from "../observableUtilities.js";
import {getDomElements} from "../../../maybe/maybe.js";


const [resultColor, rgbValue, hex, hsl] = getDomElements("resultColor", "rgbValue", "hex", "hsl");
const [inputR, inputG, inputB]          = getDomElements("inputR", "inputG", "inputB");
const [rangeR, rangeG, rangeB]          = getDomElements("rangeR", "rangeG", "rangeB");
;
const getRed    = firstOfTriple;
const getGreen  = secondOfTriple;
const getBlue   = thirdOfTriple;

const listenerInputR       = newListener(1)(nVal => oVal => inputR.value                      = nVal( getRed   ));
const listenerRangeR       = newListener(2)(nVal => oVal => rangeR.value                      = nVal( getRed   ));
const listenerInputG       = newListener(3)(nVal => oVal => inputG.value                      = nVal( getGreen ));
const listenerRangeG       = newListener(4)(nVal => oVal => rangeG.value                      = nVal( getGreen ));
const listenerInputB       = newListener(5)(nVal => oVal => inputB.value                      = nVal( getBlue  ));
const listenerRangeB       = newListener(6)(nVal => oVal => rangeB.value                      = nVal( getBlue  ));
const listenerBgColorRGB   = newListener(7)(nVal => oVal => resultColor.style.backgroundColor = toRGBString( nVal(getRed), nVal(getGreen), nVal(getBlue) ));
const listenerRgbTextRGB   = newListener(8)(nVal => oVal => rgbValue.value                    = toRGBString( nVal(getRed), nVal(getGreen), nVal(getBlue) ));
const listenerHexTextRGB   = newListener(9)(nVal => oVal => hex.textContent                   = toHexString( nVal(getRed), nVal(getGreen), nVal(getBlue) ));

let rgbObservable = InitObservable(triple(154)(211)(44))
                                (addListener)( listenerInputR     )
                                (addListener)( listenerRangeR     )
                                (addListener)( listenerInputG     )
                                (addListener)( listenerRangeG     )
                                (addListener)( listenerInputB     )
                                (addListener)( listenerRangeB     )
                                (addListener)( listenerBgColorRGB   )
                                (addListener)( listenerRgbTextRGB )
                                (addListener)( listenerHexTextRGB );

inputR.oninput = _ =>
    rgbObservable = rgbObservable(setValue)(
        triple
        (inputR.value)
        (rgbObservable(getValue)(getGreen))
        (rgbObservable(getValue)(getBlue))
    );

rangeR.oninput = _ =>
    rgbObservable = rgbObservable(setValue)(
        triple
        (rangeR.value)
        (rgbObservable(getValue)(getGreen))
        (rgbObservable(getValue)(getBlue))
    );

inputG.oninput = _ =>
    rgbObservable = rgbObservable(setValue)(
        triple
        (rgbObservable(getValue)(getRed))
        (inputG.value)
        (rgbObservable(getValue)(getBlue))
    );

rangeG.oninput = _ =>
    rgbObservable = rgbObservable(setValue)(
        triple
        (rgbObservable(getValue)(getRed))
        (rangeG.value)
        (rgbObservable(getValue)(getBlue))
    );

inputB.oninput = _ =>
    rgbObservable = rgbObservable(setValue)(
        triple
        (rgbObservable(getValue)(getRed))
        (rgbObservable(getValue)(getGreen))
        (inputB.value)
    );

rangeB.oninput = _ =>
    rgbObservable = rgbObservable(setValue)(
        triple
        (rgbObservable(getValue)(getRed))
        (rgbObservable(getValue)(getGreen))
        (rangeB.value)
    );


// Toggleable Un/Subscribers
const rgbResultElement = creatHtmlUnsubscribeToggle( "resultColor", "RGB-Background");
rgbResultElement.onclick = _ =>
    rgbObservable = addUnSubscriberToggle(rgbObservable, listenerBgColorRGB, rgbResultElement );

const rgbTextElement = creatHtmlUnsubscribeToggle("rgbValue", "RGB", true);
rgbTextElement.onclick = _ =>
    rgbObservable = addUnSubscriberToggle(rgbObservable, listenerRgbTextRGB, rgbTextElement);

const hexTextElement = creatHtmlUnsubscribeToggle("hex", "HEX",true);
hexTextElement.onclick = _ =>
    rgbObservable = addUnSubscriberToggle(rgbObservable, listenerHexTextRGB, hexTextElement);

const inputRTextElement = creatHtmlUnsubscribeToggle("inputR","Input R", true);
inputRTextElement.onclick = _ =>
    rgbObservable = addUnSubscriberToggle(rgbObservable, listenerInputR, inputRTextElement);

const rangeRTextElement = creatHtmlUnsubscribeToggle("rangeR", "Range R", true);
rangeRTextElement.onclick = _ =>
    rgbObservable = addUnSubscriberToggle(rgbObservable, listenerRangeR, rangeRTextElement);

