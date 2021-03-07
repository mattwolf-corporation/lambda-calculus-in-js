import {
    Observable,
    addListener,
    setValue,
    getValue,
    removeListener,
    newListener
} from "../../observable.js";
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

// Get the elements from the Dom
const [resultColor, rgbValue, hex, hsl] = getDomElements("resultColor", "rgbValue", "hex", "hsl");
const [inputR, inputG, inputB]          = getDomElements("inputR", "inputG", "inputB");
const [rangeR, rangeG, rangeB]          = getDomElements("rangeR", "rangeG", "rangeB");

// Getter methods for the RPG-Values (triple)
const getRed    = firstOfTriple;
const getGreen  = secondOfTriple;
const getBlue   = thirdOfTriple;

// Create Listeners for every color (red, green, blue) to Text- & Slider-Input
const listenerInputR       = newListener( nVal => _ => inputR.value  =  nVal( getRed   ));
const listenerRangeR       = newListener( nVal => _ => rangeR.value  =  nVal( getRed   ));
const listenerInputG       = newListener( nVal => _ => inputG.value  =  nVal( getGreen ));
const listenerRangeG       = newListener( nVal => _ => rangeG.value  =  nVal( getGreen ));
const listenerInputB       = newListener( nVal => _ => inputB.value  =  nVal( getBlue  ));
const listenerRangeB       = newListener( nVal => _ => rangeB.value  =  nVal( getBlue  ));

// Create Listeners for the Background-Result, RGB- & Hex-Labels
const listenerBgColorRGB   = newListener( nVal => _ => resultColor.style.backgroundColor = toRGBString( nVal(getRed), nVal(getGreen), nVal(getBlue) ));
const listenerRgbTextRGB   = newListener( nVal => _ => rgbValue.value                    = toRGBString( nVal(getRed), nVal(getGreen), nVal(getBlue) ));
const listenerHexTextRGB   = newListener( nVal => _ => hex.textContent                   = toHexString( nVal(getRed), nVal(getGreen), nVal(getBlue) ));

// Create Observable-Object, define the three initial-Values RGB and append the Listeners
let rgbObservable = Observable(triple(55)(215)(150))
                                (addListener)( listenerInputR     )
                                (addListener)( listenerRangeR     )
                                (addListener)( listenerInputG     )
                                (addListener)( listenerRangeG     )
                                (addListener)( listenerInputB     )
                                (addListener)( listenerRangeB     )
                                (addListener)( listenerBgColorRGB )
                                (addListener)( listenerRgbTextRGB )
                                (addListener)( listenerHexTextRGB );

// Connecting the Observables with every Input-Field (Range and Text).
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

