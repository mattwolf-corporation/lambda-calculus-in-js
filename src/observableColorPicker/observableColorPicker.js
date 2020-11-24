import {InitObservable, addListener, setValue,
    removeListener, logListenersToConsole,
    handlerLog, handlerInnerText, handlerBuilder } from "../observableListMap/observableListMap.js";

import { pair} from "../lambda-calculus-library/lambda-calculus.js";

const getElement  = id => document.getElementById(id); // maybe impl for safety
const getElements = (...id) => id.map(e => getElement(e))

const onInputListener  = (observable, input) => input.oninput = _ => observable(setValue)(input.value) // maybe impl for safety
const onInputListeners = (observable, ...inputs) => inputs.map(input => onInputListener(observable, input))

const [nameInput, label, sizes] = getElements("name", "label", "sizes")

const labelHandler = handlerBuilder(1) (nVal => oVal => label.innerText = nVal)
// "let" wenn soll zusätzliche Listener hinzugefügt werden,
// ansonsten, wenn immutable mit "const" vor veränderung schützen
const logHandler = nVal => oVal => console.log(nVal, oVal)
const handlerPair1 = pair(1)(logHandler)


const inputObservable = InitObservable("4")
(addListener)( labelHandler )
// (addListener)( labelHandler )
// (addListener)( handlerBuilder(2)(handlerInnerText(sizes)) )

onInputListener(inputObservable, nameInput)


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

/*
const [resultColor, rgbValue, hex, hsl] = getElements("resultColor", "rgbValue", "hex", "hsl")
const [inputR, inputG, inputB]          = getElements("inputR", "inputG", "inputB")
const [rangeR, rangeG, rangeB]          = getElements("rangeR", "rangeG", "rangeB")

const setElementValue = valuable => x => valuable.value = x




let obsR = null;

let obsRKeys = []
obsR = InitObservable(55)
(addListener)(r => setElementValue( obsR )(r))
(addListener)(r => setElementValue( inputR )(r))
(addListener)(r => setElementValue( rangeR )(r))
(addListener)(r => resultColor.style.backgroundColor = toRGBString(r, obsG.value, obsB.value))
(addListener)(r => rgbValue.value                    = toRGBString(r, obsG.value, obsB.value))
(addListener)(r => hex.innerText                     = toHexString(r, obsG.value, obsB.value))



const obsG = InitObservable(66)
(addListener)(g => obsG.value                        = g )
(addListener)(g => inputG.value                      = g )
(addListener)(g => rangeG.value                      = g )
(addListener)(g => resultColor.style.backgroundColor = toRGBString(obsR.value, g, obsB.value))
(addListener)(g => rgbValue.value                    = toRGBString(obsR.value, g, obsB.value))
(addListener)(g => hex.innerText                     = toHexString(obsR.value, g, obsB.value))


const obsB = InitObservable(77)
(addListener)(b => obsB.value                        = b )
(addListener)(b => inputB.value                      = b )
(addListener)(b => rangeB.value                      = b )
(addListener)(b => resultColor.style.backgroundColor = toRGBString(obsR.value, obsG.value, b))
(addListener)(b => rgbValue.value                    = toRGBString(obsR.value, obsG.value, b))
(addListener)(b => hex.innerText                     = toHexString(obsR.value, obsG.value, b))



onInputListeners(obsR, inputR, rangeR)
onInputListeners(obsG, inputG, rangeG)
onInputListeners(obsB, inputB, rangeB)



const setObservablesValue = (...observables) => value =>
    observables.forEach(obs => obs(setValue)(value))


setObservablesValue(obsR, obsG, obsB)(42)


let testObsVariabel = ""
console.log("testObsVariabel :" + testObsVariabel)



const logHandler = nVal => oVal => console.log(nVal, oVal)
const handlerPair1 = pair(1)(logHandler)
const handlerPair2 = pair(22)(logHandler)
const handlerPair3 = pair(44)(logHandler)
const handlerPair4 = pair(45)(logHandler)

let testObs = InitObsverableVal(null)
(addListenerVal)(handlerPair1)
(addListenerVal)(handlerPair2)
(addListenerVal)(handlerPair3)
(addListenerVal)(handlerPair4)


const changeValue = () =>{

}
*/
