import {id} from "../lambda-calculus-library/lambda-calculus.js";

export {
    Nothing, Just, maybeNumber, maybeFunction,
    maybeDiv, eitherDomElement, getOrDefault, getDomElement, getDomElements,
    getDomElementAbstraction, maybeElement, eitherJsNumOrOther, Left, Right,
    getDomElementsAsMaybe, eitherFunctionOrOther,  maybeElementWithCustomErrorMessage, eitherAnyOrError
}

const Left   = x => f => _ => f (x);
const Right  = x => _ => g => g (x);
const either = id;

const Nothing  = Left();
const Just     = Right ;


/**
 * unpacks the Maybe element if it is there, otherwise it returns the default value
 *
 * @param maybeObject
 * @return {function(defaultVal:function): *} maybe value or given default value
 * @example
 * getOrDefault( maybeDiv(6)(2) )( "Can't divide by zero" ) === 3
 * getOrDefault( maybeDiv(6)(0) )( "Can't divide by zero" ) === "Can't divide by zero"
 */
const getOrDefault = maybeObject => defaultVal =>
    maybeObject(() => defaultVal)
    (id)

/**
 *
 * @param  {number} num
 * @return {function(divisor:number): Just|Nothing} a Maybe (Just with the divided value or Nothing)
 */
const maybeDiv = num => divisor =>
    Number.isInteger(num) &&
    Number.isInteger(divisor) &&
    divisor !== 0
        ? Just(num / divisor)
        : Nothing



// const getJsNumberOrFunction = val =>
//     getOrDefault( maybeNumber(val) )( getOrDefault( maybeFunction(val) ) (Nothing) )

/**
 * Take the element as maybe value if the element is a truthy value inclusive number Zero
 * @param  {*} element
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeElement = element =>
    element || element === 0
        ? Just(element)
        : Nothing

const maybeElementWithCustomErrorMessage = errorMessage => element =>
    element || element === 0
        ? Right(element)
        : Left(errorMessage)

/**
 *
 * @param  {string} elemId
 * @return {Left|Right} either Right with HTMLElement or Left with Error
 */
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


/**
 *
 * @param  {string} elemId
 * @return {HTMLElement|undefined} HTMLElement when exist, else undefined
 */
const getDomElement = elemId =>
    getDomElementAbstraction(elemId)(id)

const getDomElements = (...elemIds) =>
    elemIds.map(getDomElement)

const getDomElementsAsMaybe = (...elemIds) =>
    elemIds.map(eitherDomElement)


const maybeNumber = val =>
    eitherJsNumOrOther(val)
    (() => Nothing)
    (() => Just(val))

const maybeFunction = val =>
    eitherFunctionOrOther(val)
    (() => Nothing)
    (() => Just(val))

const eitherJsNumOrOther = val =>
    Number.isInteger(val)
        ? Right(val)
        : Left(`${val}, is not a integer`);

const eitherFunctionOrOther = val =>
    typeof val === "function"
        ? Right(val)
        : Left(`${val}, is not a function`);

const eitherAnyOrError = f => {
    try {
        return Right(f());
    } catch (error) {
        return Left(error);
    }
}

//TODO: get or create method

const testUrl = "https://api.chucknorris.io/jokes/random";

const maybeHttpGet = theUrl =>
    eitherAnyOrError(() => {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            return (xmlHttp.readyState === 4 && xmlHttp.status === 200) ? Just(xmlHttp.responseText) : Nothing
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send();
    })
    (_ => Nothing)
    (id)

