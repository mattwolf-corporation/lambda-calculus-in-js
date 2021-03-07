import {id, pair} from "../lambda-calculus-library/lambda-calculus.js";
import {convertArrayToStack, emptyStack, push, reduce} from "../stack/stack.js";
import {mapMaybe, flatMapMaybe} from "../box/box.js";
import {emptyListMap} from "../listMap/listMap.js";

export {
    Nothing, Just, maybeNumber, maybeFunction,
    maybeDivision, eitherDomElement, getOrDefault, getDomElement, getDomElements,
    eitherDomElementOrConsoleError, maybeTruthy, eitherNumber, Left, Right, eitherFunction,
    eitherElementOrCustomErrorMessage, eitherTryCatch, maybeDomElement,
    eitherElementsOrErrorsByFunction, maybeElementsByFunction, eitherNotNullAndUndefined, eitherNaturalNumber
}

const Left   = x => f => _ => f (x);
const Right  = x => _ => g => g (x);
const either = id;

const Nothing  = Left();
const Just     = Right ;


/**
 * unpacks the Maybe element if it is there, otherwise it returns the default value
 *
 * @param maybe
 * @return {function(defaultVal:function): *} maybe value or given default value
 * @example
 * getOrDefault( maybeDiv(6)(2) )( "Can't divide by zero" ) === 3
 * getOrDefault( maybeDiv(6)(0) )( "Can't divide by zero" ) === "Can't divide by zero"
 */
const getOrDefault = maybe => defaultVal =>
    maybe
        (() => defaultVal)
        (id);

/**
 *
 * @param  {number} dividend
 * @return {function(divisor:number): function(Just|Nothing)} a Maybe (Just with the divided value or Nothing)
 */
const maybeDivision = dividend => divisor =>
    Number.isInteger(dividend) &&
    Number.isInteger(divisor) &&
    divisor !== 0
        ? Just(dividend / divisor)
        : Nothing;

const eitherTruthy = value =>
    value
        ? Right(value)
        : Left(`'${value}' is a falsy value`);

const eitherNotNullAndUndefined = value =>
    value !== null && value !== undefined
        ? Right(value)
        : Left(`element is '${value}'`);

/**
 * Take the element as maybe value if the element is a truthy value inclusive number Zero
 * @param  {*} element
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeTruthy = element =>
    eitherTruthy(element)
        (_ => Nothing)
        (_ => Just(element));

const eitherElementOrCustomErrorMessage = errorMessage => element =>
    eitherTruthy(element)
        (_ => Left(errorMessage))
        (_ => Right(element));

/**
 *
 * @param  {string} elemId
 * @return {Left|Right} either Right with HTMLElement or Left with Error
 */
const eitherDomElement = elemId =>
    eitherElementOrCustomErrorMessage(`no element exist with id: ${elemId}`)(document.getElementById(elemId));


const maybeDomElement = elemId =>
    eitherDomElement(elemId)
        (_ => Nothing)
        (e => Just(e));

const eitherDomElementOrConsoleError = elemId =>
    eitherDomElement(elemId)(console.error);

/**
 *
 * @param  {string} elemId
 * @return {HTMLElement|undefined} HTMLElement when exist, else undefined
 */
const getDomElement = elemId =>
    eitherDomElementOrConsoleError(elemId)(id);

const getDomElements = (...elemIds) =>
    elemIds.map(getDomElement);

const maybeNumber = val =>
    eitherNumber(val)
        (_ => Nothing)
        (_ => Just(val));

const eitherNumber = val =>
    Number.isInteger(val)
        ? Right(val)
        : Left(`'${val}' is not a integer`);

const maybeFunction = val =>
    eitherFunction(val)
        (_ => Nothing)
        (_ => Just(val))

const eitherFunction = val =>
    typeof val === "function"
        ? Right(val)
        : Left(`'${val}' is not a function`);

const eitherTryCatch = f => {
    try {
        return Right(f());
    } catch (error) {
        return Left(error);
    }
}

const eitherNaturalNumber = val =>
    Number.isInteger(val) && val >= 0
        ? Right(val)
        : Left(`'${val}' is not a natural number`);

// Haskell: (a -> Maybe a) -> [a] -> Maybe [a]
const maybeElementsByFunction = maybeProducerFn => (...elements) =>
    reduce
        ((acc, curr) =>
                        flatMapMaybe(acc)(listMap =>
                                                mapMaybe( maybeProducerFn(curr) )(val => push(listMap)( pair(curr)(val) ))
                                         )
        )
        ( Just(emptyListMap) )
        ( convertArrayToStack(elements) );


// Beispiel: key => maybeFunc(key) ||  [Just(elem1), Just(Elem2), Nothing, Just(Elem3)] => Just([elem1, elem2, Elem3])
const eitherElementsOrErrorsByFunction = eitherProducerFn => (...elements) =>
     reduce
        ((acc, curr) => acc
                                ( stack => Left( (eitherProducerFn(curr))
                                                    (err => push(stack)(err))
                                                    (_   => stack)
                                                )
                                )
                                ( listMap => (eitherProducerFn(curr))
                                                (err => Left(  push(emptyStack)(err) ) )
                                                (val => Right( push(listMap)( pair(curr)(val) ) ) )
                                )
        )
        ( Right(emptyListMap) )
        ( convertArrayToStack(elements) );


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

