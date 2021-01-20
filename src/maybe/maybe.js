import {id} from "../lambda-calculus-library/lambda-calculus.js";

export {
    Nothing, Just,
    maybeDiv, maybeDomElement, getOrDefault, getSafeElement, getSafeElements,
    getSafeElementAbstraction, maybeElement, maybeNumber
}


const Nothing = (() => f => _ => f())();
const Just = x => _ => g => g(x);

const maybeDiv = num => divisor =>
    isNumber(num) &&
    isNumber(divisor) &&
    divisor !== 0
        ? Just(num / divisor)
        : Nothing

const isNumber = val =>
    typeof val === "number"

const maybeNumber = val =>
    isNumber(val)
        ? Just(val)
        : Nothing

const maybeElement = element =>
    element
        ? Just(element)
        : Nothing

const maybeDomElement = elemId => maybeElement(document.getElementById(elemId))

const getSafeElementAbstraction = elemId => elementFunction =>
    maybeDomElement(elemId)
    (() => console.error(elemId + " doesnt exist"))
    (elementFunction)

const getSafeElement = elemId =>
    getSafeElementAbstraction(elemId)(id)

const getSafeElements = (...elemIds) => elemIds.map(getSafeElement)

const getOrDefault = maybeFn => defaultVal =>
    maybeFn(() => defaultVal)
    (id)