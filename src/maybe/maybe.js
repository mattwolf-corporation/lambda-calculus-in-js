import {id} from "../lambda-calculus-library/lambda-calculus.js";

export {
    Nothing, Just,
    maybeDiv, maybeDomElement, getOrDefault, getSafeElement, getSafeElements,
    getSafeElementAbstraction, maybeElement, maybeNumber
}


const Nothing = (() => f => _ => f())();
const Just = x => _ => g => g(x);

const maybeDiv = num => divisor =>
    isNumber(num) && // TODO: NaN is also of type Number !!
    isNumber(divisor) &&
    divisor !== 0
        ? Just(num / divisor)
        : Nothing

const isNumber = val =>
    typeof val === "number" // TODO: check verbessern
 // TODO: utility Modul mit "type checks"


const maybeNumber = val =>
    isNumber(val)
        ? Just(val)
        : Nothing

const maybeElement = element =>
    element || element === 0
        ? Just(element)
        : Nothing

const maybeDomElement = elemId => maybeElement(document.getElementById(elemId))

const getSafeElementAbstraction = elemId => elementFunction =>
    maybeDomElement(elemId)
    (() => console.error(elemId + " doesn't exist"))
    (elementFunction)

const getSafeElement = elemId =>
    getSafeElementAbstraction(elemId)(id)

const getSafeElements = (...elemIds) => elemIds.map(getSafeElement)

const getOrDefault = maybeFn => defaultVal =>
    maybeFn(() => defaultVal)
    (id)
