import {id} from "../lambda-calculus-library/lambda-calculus.js";

export {
    Nothing, Just, either,
    maybeDiv, maybeDomElement, getOrDefault, getSafeElement, getSafeElements,
    getSafeElementAbstraction, maybeElement, eitherJsNumOrOther, Left, Right, withDomElement,
    getSafeElementsAsMaybe, eitherFunctionOrOther,  maybeElementWithCustomErrorMessage, eitherErrorOrAny
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

// const getJsNumberOrFunction = val =>
//     getOrDefault( maybeNumber(val) )( getOrDefault( maybeFunction(val) ) (Nothing) )


const maybeElement = element =>
    element || element === 0
        ? Just(element)
        : Nothing

const maybeElementWithCustomErrorMessage = errorMessage => element =>
    element || element === 0
        ? Right(element)
        : Left(errorMessage)

const maybeDomElement = elemId => element =>
            element
                ? Just(element)
                : Right(new Error(`no such element with id: ${elemId}`))

// const maybeDomElement = elemId => maybeElement(document.getElementById(elemId))

const withDomElement = elemId => maybeDomElement(elemId)(document.getElementById(elemId))

const getSafeElementAbstraction = elemId => elementFunction =>
    maybeDomElement(elemId)
    (() => console.error(elemId + " doesn't exist"))
    (elementFunction)

const getSafeElement = elemId =>
    getSafeElementAbstraction(elemId)(id)

const getSafeElements = (...elemIds) => elemIds.map(getSafeElement)

const getSafeElementsAsMaybe = (...elemIds) => elemIds.map(withDomElement)

const eitherJsNumOrOther = val =>
    Number.isInteger(val)
        ? Right(val)
        : Left(`${val}, is not a integer`);

const eitherFunctionOrOther = val =>
    typeof val === "function"
        ? Right(val)
        : Left(`${val}, is not a function`);

const eitherErrorOrAny = f => {
    try {
        return Right(f());
    } catch (error) {
        return Left(error);
    }
}

//TODO: get or create method
