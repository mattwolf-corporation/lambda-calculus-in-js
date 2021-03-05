import {id, pair} from "../lambda-calculus-library/lambda-calculus.js";
import {convertArrayToStack, emptyStack, logStackToConsole, push, reduce, convertStackToArray} from "../stack/stack.js";
import {mapMaybe, flatMapMaybe} from "../box/box.js";
import {emptyListMap, getElementByKey} from "../listMap/listMap.js";

export {
    Nothing, Just, maybeNumber, maybeFunction,
    maybeDiv, eitherDomElement, getOrDefault, getDomElement, getDomElements,
    getDomElementAbstraction, maybeElement, eitherJsNumOrOther, Left, Right,
    getDomElementsAsMaybe, eitherFunctionOrOther,  maybeElementWithCustomErrorMessage,
    eitherAnyOrError, maybeDomElement, eitherElementsOrErrors, maybeElements
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
    eitherElement(element)
        (() => Nothing)
        (() => Just(element))

const eitherElement = element =>
    element || element === 0
        ? Right(element)
        : Left(`${element} is not found, undefined or a falsy value`)

const maybeElementWithCustomErrorMessage = errorMessage => element =>
    eitherElement(element)
        (() => Left(errorMessage))
        (() => Just(element))



/**
 *
 * @param  {string} elemId
 * @return {Left|Right} either Right with HTMLElement or Left with Error
 */
const eitherDomElement = elemId =>
    document.getElementById(elemId)
                ? Right(document.getElementById(elemId))
                : Left(Error(`no element exist with id: ${elemId}`))

const maybeDomElement = elemId =>
    eitherDomElement(elemId)(Nothing)(Just)

const getDomElementAbstraction = elemId =>
    eitherDomElement(elemId)(console.error)


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

const maybeElements = maybeFunc => (...elements) => {
    const stackWithElems = convertArrayToStack(elements);

    return reduce
    ((acc, curr) => flatMapMaybe(acc)(listMap => mapMaybe(maybeFunc(curr))(val => push(listMap)( pair(curr)(val) ) ) ))
    (Just(emptyListMap))
    (stackWithElems)
}

// key => maybeFunc(key) ||  [Just(elem1), Just(Elem2), Nothing, Just(Elem3)] => Just([elem1, elem2, Elem3])
const eitherElementsOrErrors = eitherFunc => (...elements) => {
    const stackWithElems = convertArrayToStack(elements);

    return reduce
    ((acc, curr) => acc
        ( stack => Left( (eitherFunc(curr))
            (err => push(stack)(err))
            (_ => stack) )
        )
        ( listMap => (eitherFunc(curr))
            (err => Left(push(emptyStack)(err)) )
            (val => Right(push(listMap)( pair(curr)(val) )) )
        )
    )
    (Right(emptyListMap))
    (stackWithElems);
}


// eitherElements2(str => t2(str))("inputtText", "newVeeealue")
// (stackOfErrors => logStackToConsole(stackOfErrors))
// (listMapWithElements => { // TODO: array destructuring
//         // const [a,b,c] = convertStackToArray(stackOfElements); TODO: work this
//         // logListMapToConsole(stack)
//         // stack => console.log(stack)
//         const inputText = getElementByKey(listMapWithElements)("inputText");
//         const newValue = getElementByKey(listMapWithElements)("newValue");
//
//         console.log(inputText);
//         console.log(newValue);
//
//         startProgram(inputText, newValue);
//     }
// )

