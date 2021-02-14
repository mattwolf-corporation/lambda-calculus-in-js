import {id} from "../lambda-calculus-library/lambda-calculus.js";

export {
    Nothing, Just, either,
    maybeDiv, maybeDomElement, getOrDefault, getSafeElement, getSafeElements,
    getSafeElementAbstraction, maybeElement, maybeNumber, Left, Right, withDomElement,
    getSafeElementsAsMaybe, maybeFunction, getJsNumberOrFunction, maybeElementWithCustomErrorMessage
}

const Left   = x => f => g => f (x);
const Right  = x => f => g => g (x);
const either = e => f => g => e (f) (g); // id

const Nothing  = Left();
const Just     = Right ;

const getOrDefault = maybeFn => defaultVal =>
    maybeFn(() => defaultVal)
    (id)


const maybeDiv = num => divisor =>
    Number.isInteger(num) &&
    Number.isInteger(divisor) &&
    divisor !== 0
        ? Just(num / divisor)
        : Nothing

const maybeNumber = val =>
    Number.isInteger(val)
        ? Just(val)
        : Left(`${val}, is not a integer`);

const maybeFunction = val =>
    typeof val === "function"
        ? Just(val)
        : Left(`${val}, is not a function`);

const getJsNumberOrFunction = val =>
    getOrDefault( maybeNumber(val) )( getOrDefault( maybeFunction(val) ) (Nothing) )


const maybeElement = element =>
    element || element === 0
        ? Just(element)
        : Nothing

const maybeElementWithCustomErrorMessage = errorMessage => element =>
    element || element === 0
        ? Just(element)
        : Left(errorMessage)

const maybeDomElement2 = elemId => element =>
            element
                ? Just(element)
                : Right(new Error(`no such element with id: ${elemId}`))

const maybeDomElement = elemId => maybeElement(document.getElementById(elemId))

const withDomElement = elemId => maybeDomElement2(elemId)(document.getElementById(elemId))

const getSafeElementAbstraction = elemId => elementFunction =>
    maybeDomElement(elemId)
    (() => console.error(elemId + " doesn't exist"))
    (elementFunction)

const getSafeElement = elemId =>
    getSafeElementAbstraction(elemId)(id)

const getSafeElements = (...elemIds) => elemIds.map(getSafeElement)

const getSafeElementsAsMaybe = (...elemIds) => elemIds.map(withDomElement)


//TODO: get or create method
