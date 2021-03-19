import {id, pair, fst, snd, If, Else, Then, triple} from "../lambda-calculus-library/lambda-calculus.js";
import {n0} from "../lambda-calculus-library/church-numerals.js";
import {stack, size, stackPredecessor, head, reverseStack, hasPre, getPreStack, push, pushToStack, startStack, emptyStack, convertArrayToStack, map, filter, reduce, forEach} from "../stack/stack.js";
export {listMap, emptyListMap, getElementByKey, removeByKey, startListMap, mapListMap, filterListMap, reduceListMap, convertObjToListMap, logListMapToConsole, convertListMapToArray, convertListMapToStack
}

/**
 * Generic Types
 * @typedef {function} pair
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 * @typedef {function} stack
 * @typedef {function} listMap
 */


/**
 * index -> predecessor -> pair -> f -> f(index)(predecessor)(head) ; Triple
 *
 * The listMap is a pure functional data structure and is therefore immutable.
 * The listMap is implemented as a stack aka triplet.
 * So the listMap have all the features and functionality that have the stack too.
 *
 * The first value of the listMap represents the size (number of elements) of the listMap.
 * At the same time the first value represents the index of the head (top value) of the listMap.
 * The second value represents the predecessor listMap
 * The third value represents the head ( top value ) of the listMap
 *
 * @type {function(index:churchNumber): function(predecessor:stack):  function(value:*): function(f:function): ({f: {index value head}}) }
 * @return {triple} listMap as triple aka stack
 */
const listMap = triple;

/**
 * Representation of the empty stack
 * The empty listMap has the size/index zero (has zero elements).
 * The empty listMap has no predecessor stack, but the identity function as placeholder.
 * The empty listMap has no head ( top value ), but a pair of two identity functions as placeholder.
 *
 * @type {function(Function): {f: {index, predecessor, head}}}
 */
const emptyListMap = listMap(n0)(id)( pair(id)(id) );


/**
 * A help function to create a new listMap
 */
const startListMap = f => f(emptyListMap);


/**
 *
 * @param obj
 * @return {*}
 */
const convertObjToListMap = obj => Object.entries(obj).reduce((acc, [key, value]) => push(acc)(pair(key)(value)), emptyListMap);



/**
 * Get the element in the ListMap by the key (Js-Number)
 *
 * @function
 * @param listMap
 * @return {function(key:Number): *} element (value) or id if key not exist
 * @example
 * const testListMap = convertObjToListMap( {1: "Hans", 2: "Peter", 3: 42} )
 *
 * getElementByKey( testListMap )( 1 ) === "Hans"
 * getElementByKey( testListMap )( 2 ) === "Peter"
 * getElementByKey( testListMap )( 3 ) === 42
 */
const getElementByKey = listMap => key => {
    const times         = size(listMap); // TODO: successor of size
    const initArgsPair  = pair(listMap)(id); // TODO: set to undefined

    const getElement = argsPair => {
        const stack             = argsPair(fst);
        const predecessorStack  = (stack)(stackPredecessor);
        const currentKeyValPair = head(stack);
        if (currentKeyValPair(fst) === key) {
            return pair(predecessorStack)(currentKeyValPair(snd));
        }
        return pair(predecessorStack)(argsPair(snd));
    };

    return (times(getElement)(initArgsPair))(snd);
};


/**
 * Remove the element in the ListMap by the key (key could be anything that can be comparable. Hint: Functions are not comparable except they have a notation like n1, n2, id, pair ... etc.)
 *
 * @function
 * @param  {listMap} listMap
 * @return {function(key:*): *} element (value)
 * @example
 * const testListMap = convertObjToListMap( {1: "Hans", 2: "Peter", 3: 42} )
 *
 * jsnum( size(testListMap) ) === 3
 *
 * const listMapOneRemoved = removeByKey(testListMap)(1)
 * jsnum( size(listMapOneRemoved) ) === 2
 */
const removeByKey = listMap => key => {
    const times         = size(listMap);
    const reversedStack = reverseStack(listMap);

    const removeByCon = currentStack => resultStack => key => {
        const currentKeyValPair = head(currentStack);
        const currentElement    = currentKeyValPair(snd);
        const currentKey        = currentKeyValPair(fst);
        const result            =  key === currentKey
            ? resultStack
            : push( resultStack )(pair( currentKey )( currentElement ));

        return pair( getPreStack(currentStack) )(result);
    }

    const iteration = argsPair =>
        If( hasPre(argsPair(fst)) )
            (Then( removeByCon(argsPair(fst))(argsPair(snd))(key) ))
            (Else( argsPair ));


    return (times
                (iteration)
                (pair (reversedStack)(emptyListMap) )
            ) (snd);
}


const mapListMap = f => map(p => pair( p(fst) )( f(p(snd)) ));

const filterListMap = f => filter(p => f(p(snd)) );

const reduceListMap = f => reduce((acc, curr) => f(acc, curr(snd)));

const logListMapToConsole = listMap =>
    forEach(listMap)((element, index) => console.log("At Index " + index + " is  Key and Element " + JSON.stringify(element(fst)) + " | " + JSON.stringify(element(snd)) ));

/**
 *  A function that takes an ListMap, takes the values (ignore the keys) and converts it into an array. The function returns an array
 *
 * @param  {listMap} listMap
 * @return {Array} Array
 * @example
 *
 *
 *
 */
const convertListMapToArray = listMap => reduceListMap((acc, curr) => [...acc, curr])([])(listMap);

const convertListMapToStack = listMap => reduceListMap((acc, curr) => push(acc)(curr))(emptyStack)(listMap);