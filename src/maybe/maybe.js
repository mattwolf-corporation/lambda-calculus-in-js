import {id} from "../lambda-calculus-library/lambda-calculus.js";

export {
    Nothing, Just,
    maybeDiv, eitherDomElement, getOrDefault, getDomElement, getDomElements,
    getDomElementAbstraction, maybeElement, eitherJsNumOrOther, Left, Right,
    getDomElementsAsMaybe, eitherFunctionOrOther,  maybeElementWithCustomErrorMessage, eitherErrorOrAny
}

const Left   = x => f => g => f (x);
const Right  = x => f => g => g (x);
const either = id;

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

const eitherDomElement = elemId =>
    document.getElementById(elemId)
                ? Right(document.getElementById(elemId))
                : Left(new Error(`no element exist with id: ${elemId}`))

const maybeDomElement = elemId =>
    eitherDomElement(elemId)(Nothing)(Just)

const getDomElementAbstraction = elemId => elementFunction =>
    eitherDomElement(elemId)
    (console.error)
    (elementFunction)

const getDomElement = elemId =>
    getDomElementAbstraction(elemId)(id)

const getDomElements = (...elemIds) =>
    elemIds.map(getDomElement)

const getDomElementsAsMaybe = (...elemIds) =>
    elemIds.map(eitherDomElement)

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
