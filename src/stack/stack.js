import {
    id,
    beq,
    True,
    False,
    showBoolean as show,
    convertToJsBool,
    pair,
    triple,
    fst,
    snd,
    firstOfTriple,
    secondOfTriple,
    thirdOfTriple,
    not,
    and, or,
    If, Then, Else, K, B
} from '../lambda-calculus-library/lambda-calculus.js'

import {
    n0,
    n1,
    n2,
    n3,
    n4,
    n5,
    n6,
    n7,
    n8,
    n9,
    pred,
    succ,
    jsnum,
    is0, gt, leq, eq, phi, churchAddition, churchSubtraction,
    toChurchNum
} from '../lambda-calculus-library/church-numerals.js'

export {
    stack, stackIndex, stackPredecessor, stackValue, emptyStack,
    hasPre, push, pop, head, size, reduce, filter, map,
    getElementByIndex, getElementByJsnumIndex, logStackToConsole,
    startStack, pushToStack, reverseStack, filterWithReduce,
    mapWithReduce, convertStackToArray, convertArrayToStack, forEach,
    forEachOld, removeByIndex, getPreStack, concat, flatten, zip,
    zipWith, zipWithOneLiner
}
/**
 * Generic Types
 * @typedef {*} a
 * @typedef {*} b
 * @typedef {*} c
 * @typedef {(a|b|c)} abc
 * @typedef {function} fn
 * @typedef {function} gn
 * @typedef {function} pn
 * @typedef {function} qn
 * @typedef {function} boolean
 * @typedef {function} pair
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 * @typedef {function} stack
 * @typedef {number} JsNumber
 * @typedef {*} number
 */

/**
 * The stack is a pure functional data structure and is therefore immutable.
 * The stack is implemented as a triplet.
 * The first value of the triple represents the size (number of elements) of the stack.
 * At the same time the first value represents the index of the head (top value) of the stack.
 * The second value represents the predecessor stack
 * The third value represents the head ( top value ) of the stack
 *
 * @function
 * @param {a} x
 * @return { function(y:b): function(z:c): function(f:function): function(x y z ) }
 */
const stack = x => y => z => f => f(x)(y)(z);

/**
 * getter function - first of a triple
 *
 * @function
 * @type {KI.props|*}
 * @return
 */
const stackIndex = firstOfTriple;

/**
 * getter function - second of a triple
 *
 * @type {function(*): function(*): function(*): *}
 */
const stackPredecessor = secondOfTriple;


/**
 * getter function - third of a triple
 *
 * @type {function(*): function(*): function(*): *}
 */
const stackValue = thirdOfTriple;


/**
 * Representation of the empty stack
 * The empty stack has the size/index zero (has zero elements).
 * The empty stack has no predecessor stack, but the identity function as placeholder.
 * The empty stack has no head ( top value ), but the identity function as placeholder.
 *
 * @type {function({fn}): function(fn, {a}, {b}, {c})}
 */
const emptyStack = stack(n0)(id)(id);

/**
 * A function that takes a stack
 * The function returns a church-boolean, which indicates whether the stack has a predecessor stack
 *
 * @param {stack} s
 * @return {churchBoolean} churchBoolean
 */
const hasPre = s => not(is0(s(stackIndex)));


/**
 * Todo: getPreStack Docu
 */
const getPreStack = s => s(stackPredecessor)


/**
 * A function that takes a stack and a value
 * The function returns a new stack with the pushed value
 *
 * @param {stack} s
 * @return { function(x:{a}): stack } stack with value x
 */
const push = s => x => stack(succ(s(stackIndex)))(s)(x);

/**
 * A function that takes a stack
 * The function returns a value pair.
 * The first element of the pair is the predecessor stack.
 * The second element of the pair is the head (the top element) of the stack
 *
 * @param {stack} s
 * @return {pair} pair
 */
const pop = s => pair(s(stackPredecessor))(head(s));

/**
 * A function that takes a stack
 * The function returns the head (the top value) of the stack
 *
 * @param {stack} s
 * @return {*} stack-value
 */
const head = s => s(stackValue);

/**
 * A function that takes a stack
 * The function returns the size (number of elements) in the stack
 *
 * @param {stack} s
 * @return {*} stack-index as church numeral
 */
const size = s => s(stackIndex);

/**
 * A function that takes a stack and argument pair.
 * The first argument of the pair must be a reducer function.
 * The second argument of the pair must be a start value.
 * The function reduces the stack using the passed reduce function and the passed start value
 *
 * @param {stack} s TODO: Doku anpassen !!
 * @return {function(argsPair:{pair}): * } value
 */
const reduce = argsPair => s => {
    const times = size(s);
    const reversedStack = times(reduceIteration)(triple(s)((acc, curr) => push(acc)(curr))(emptyStack))(thirdOfTriple);
    const argsTriple = triple(reversedStack)(argsPair(fst))(argsPair(snd));

    return (times(reduceIteration)(argsTriple))(thirdOfTriple);
};

// const reduce2 = argsPair => s => (size(s)
//                                     ()
//                                 (triple((size(s))(reduceIteration)(triple(s)((acc, curr) => push(acc)(curr))(emptyStack))(thirdOfTriple))(argsPair(fst))(argsPair(snd))))
//                                 (thirdOfTriple);


/**
 * TODO: Description for reduceIteration
 *
 * @param {triple} argsTriple
 * @return {triple } triple or argsTriple
 */
const reduceIteration = argsTriple => {
    const stack = argsTriple(firstOfTriple);

    const getTriple = argsTriple => {
        const reduceFunction = argsTriple(secondOfTriple);

        const preAcc = argsTriple(thirdOfTriple);

        const curr = head(stack);

        const acc = reduceFunction(preAcc, curr);

        const preStack = stack(stackPredecessor);

        return triple(preStack)(reduceFunction)(acc);
    }

    return If(hasPre(stack))
    (Then(getTriple(argsTriple)))
    (Else(argsTriple));
};

/**
 * A function that takes a stack and an index (as church number)
 * The function returns the element at the passed index
 *
 * @param {stack} s
 * @return { function(i:{churchNumber}) : * } stack-value
 */
const getElementByIndex = s => i => {
    const times = churchSubtraction(size(s))(i);
    const getStackPredecessor = s => s(stackPredecessor);

    return head(times(getStackPredecessor)(s));
};

/**
 * A function that takes a stack and an index
 * The function returns the element at the passed index
 *
 *
 * @param {stack} s
 * @return { function(i:{JsNumber}) : * } stack-value
 */
const getElementByJsnumIndex = s => i => {
    const times = size(s);
    const initArgsPair = pair(s)(id);

    const getElement = argsPair => {
        const stack = argsPair(fst);
        const predecessorStack = getPreStack(stack);

        if (jsnum((stack)(stackIndex)) === i) {

            return pair(predecessorStack)(head(stack));
        }

        return pair(predecessorStack)(argsPair(snd));
    };

    return (times(getElement)(initArgsPair))(snd);
};


/**
 * A function that takes an stack and converts the stack into an array.
 * The function returns an array
 *
 * @param {stack} s
 * @return {Array} Array
 */
const convertStackToArray = reduce(pair((acc, curr) => [...acc, curr])([]));

/**
 * A function that takes an array and converts the array into a stack.
 * The function returns a stack
 *
 * @param {Array} array
 * @return {stack} stack
 */
const convertArrayToStack = array => array.reduce((acc, curr) => push(acc)(curr), emptyStack);

/**
 * A function that accepts a stack.
 * The function returns the reversed stack.
 *
 * @param {stack} s
 * @return {stack} stack (reversed)
 */
const reverseStack = s => (reduce(pair((acc, curr) => pair(pop(acc(fst))(fst))(push(acc(snd))(pop(acc(fst))(snd)))) (pair(s)(emptyStack)))(s))(snd);

/**
 * A function that accepts a stack and a map function.
 * The function returns the mapped stack.
 *
 * @param {stack} s
 * @return {function(map:{function}): stack } stack
 */
const mapWithReduce = mapFunc => reduce(pair((acc, curr) => push(acc)(mapFunc(curr)))(emptyStack));

/**
 * A function that accepts a stack and a filter function.
 * The function returns the filtered stack.
 *
 * @param {stack} s
 * @return {function(filter:{function}): stack } stack
 */
const filterWithReduce = filterFunc => reduce(pair((acc, curr) => filterFunc(curr) ? push(acc)(curr) : acc)(emptyStack));

/**
 * A function that takes a stack and a map function.
 * The function returns the mapped stack
 *
 * @param {stack} s TODO: Doku anpassen !!
 * @return {function(mapFunction:{function}): stack / pair } stack / pair
 */
const map = mapFunction => s => {
    const times = size(s);
    const initArgsPair = pair(emptyStack)(n0);

    const mapIteration = argsPair => {
        const index = argsPair(snd);

        if (convertToJsBool(eq(times)(index))) {
            return argsPair;
        }
        const increasedIndex = succ(argsPair(snd));
        const valueToMap = getElementByIndex(s)(increasedIndex);
        const mappedValue = mapFunction(valueToMap);
        const resultStack = push(argsPair(fst))(mappedValue);

        return pair(resultStack)(increasedIndex);
    };

    return (times(mapIteration)(initArgsPair))(fst);
};

/**
 * A function that accepts a stack and a filter function.
 * The function returns the filtered stack
 *
 * @param {stack} s TODO: Doku anpassen !!
 * @return {function(filterFunction:{function}): stack / pair } stack / pair
 */
const filter = filterFunction => s => {
    const times = size(s);
    const initArgsPair = pair(emptyStack)(n0);

    const filterIteration = argsPair => {
        const stack = argsPair(fst);
        const index = argsPair(snd);
        const increasedIndex = succ(index);

        if (convertToJsBool(not(eq(times)(index)))) {
            const value = getElementByIndex(s)(increasedIndex);

            if (filterFunction(value)) {
                const resultStack = push(stack)(value);
                return pair(resultStack)(increasedIndex);
            }
        }

        return pair(stack)(increasedIndex);
    };

    return (times(filterIteration)(initArgsPair))(fst);
};

/**
 * A function that accepts a stack.
 * The function performs a side effect.
 * The side effect logs the stack to the console.
 *
 * @param {stack} s
 */
const logStackToConsole = s => {

    const logIteration = (acc, curr) => {
        const index = acc + 1;
        console.log('element at: ' + index + ': ' + JSON.stringify(curr));
        return index;
    };

    reduce(s)(pair(logIteration)(0));
};


const stackOp = op => s => x => f => f(op(s)(x));
const pushToStack = stackOp(push);

/**
 * A help function to create a new stack
 */
const startStack = f => f(emptyStack);

/**
 * Foreach implementation for stack
 * A function that expects a stack and a callback function.
 * The current element of the stack iteration and the index of this element is passed to this callback function
 */
const forEachOld = stack => f => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = s => {
        if(convertToJsBool(hasPre(s))) {
            const element = head(s);
            const index = jsnum(succ(churchSubtraction(times)(size(s))));

            f(element, index);

            return (pop(s))(fst);
        }
        return s;
    };

    times(iteration)(reversedStack);
};

const forEach = stack => callbackFunc => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const invokeCallback = p => {
        const s = p(fst);
        const index = p(snd);
        const element = head(s);

        callbackFunc(element, index);

        return pair(getPreStack(s))(index + 1);
    }

    const iteration = p =>
        If(hasPre(p(fst)))
        (Then(invokeCallback(p)))
        (Else(p));

    times(iteration)(pair(reversedStack)(1));
};

/**
 * Remove element by given Index
 *
 * @param {stack} stack without the element
 */
const removeByIndex = stack => index => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = argsTriple => {
        const currentStack = argsTriple(firstOfTriple)
        const resultStack = argsTriple(secondOfTriple)
        const currentIndex = argsTriple(thirdOfTriple)

        return If(hasPre(currentStack))
        (Then(removeByCondition(currentStack)(resultStack)(index)(currentIndex)))
        (Else(argsTriple))
    }

    return (times(iteration)(triple(reversedStack)(emptyStack)(n1)))(secondOfTriple)
}

const removeByCondition = currentStack => resultStack => index => currentIndex => {
    const currentElement = head(currentStack);

    const condition = eq(toChurchNum(index))(currentIndex);
    const result = If(condition)
    (Then(resultStack))
    (Else(push(resultStack)(currentElement)));

    return triple(getPreStack(currentStack))
    (result)
    (succ(currentIndex));
}

const reduceToStack = (acc, curr) => push(acc)(curr);

const concat = s1 => s2 => {
    if(s1 === emptyStack){
        return s2;
    }else if (s2 === emptyStack){
        return s1;
    }
    else {
        return reduce(pair(reduceToStack)(s1))(s2);
    }
}

const reduceConcat = (acc, curr) => concat(acc)(curr);

const flatten = reduce(pair(reduceConcat)(emptyStack));

// (a -> b -> c) -> [a] -> [b] -> [c]
const zipWith = f => s1 => s2 => {
    const size1 = size(s1);
    const size2 = size(s2);

    const reversedStack1 = reverseStack(s1);
    const reversedStack2 = reverseStack(s2);

    const zipElements = t => {
        const s1 = t(firstOfTriple);
        const s2 = t(secondOfTriple);
        const acc = t(thirdOfTriple);

        const element1 = head(s1);
        const element2 = head(s2);

        const result = push(acc)(f(element1)(element2));

        return triple(getPreStack(s1))(getPreStack(s2))(result);
    }

    const iteration = t =>
        If(hasPre(t(firstOfTriple)))
        (Then(zipElements(t)))
        (Else(t));

    const times = If(leq(size1)(size2))
                  (Then(size1))
                  (Else(size2));

    return times(iteration)(triple(reversedStack1)(reversedStack2)(emptyStack))(thirdOfTriple);
}

// const zipWithOneLiner = f => s1 => s2 => If(leq(size(s1))(size(s2)))(Then(size(s1)))(Else(size(s2)))(t => If(hasPre(t(firstOfTriple)))(Then((triple(getPreStack(t(firstOfTriple)))(getPreStack(t(secondOfTriple)))(push(t(thirdOfTriple))(f(head(t(firstOfTriple)))(head(t(secondOfTriple))))))))(Else(t)))(triple(reverseStack(s1))(reverseStack(s2))(emptyStack))(thirdOfTriple);

const zipWithOneLiner = f => s1 => s2 => (condition => truthy => falshy => condition(truthy)(falshy))((n => k => (n => n((x => y => x)(x => y => y))(x => y => x))((n => k => k(n(p => (x => y => f => f(x)(y))(p(x => y => y))((n => f => (f => g => x => f(g(x)))(f)(n(f)))(p(x => y => y))))((x => y => f => f(x)(y))(f => a => a)(f => a => a))(x => y => x))(n))(n)(k)))
((s => s(x => y => z => x))(s1))((s => s(x => y => z => x))(s2)))((x => x)((s => s(x => y => z => x))(s1)))((x => x)((s => s(x => y => z => x))(s2)))(t => (condition => truthy => falshy => condition(truthy)(falshy))((s => (f => x => y => f(y)(x))((n => n((x => y => x)(x => y => y))(x => y => x))(s(x => y => z => x))))(t(x => y => z => x)))((x => x)
(((x => y => z => f => f(x)(y)(z))((s => s(x => y => z => y))(t(x => y => z => x)))((s => s(x => y => z => y))(t(x => y => z => y)))((s => x => (x => y => z => f => f(x)(y)(z))((n => f => (f => g => x => f(g(x)))(f)(n(f)))(s(x => y => z => x)))(s)(x))(t(x => y => z => z))(f((s => s(x => y => z => z))(t(x => y => z => x)))((s => s(x => y => z => z))
(t(x => y => z => y))))))))((x => x)(t)))((x => y => z => f => f(x)(y)(z))((s => (reduce((x => y => f => f(x)(y))((acc, curr) => (x => y => f => f(x)(y))((s => (x => y => f => f(x)(y))(s(x => y => z => y))((s => s(x => y => z => z))(s)))(acc(x => y => x))(x => y => x))((s => x => (x => y => z => f => f(x)(y)(z))((n => f => (f => g => x => f(g(x)))(f)(n(f)))
(s(x => y => z => x)))(s)(x))(acc(x => y => y))((s => (x => y => f => f(x)(y))(s(x => y => z => y))((s => s(x => y => z => z))(s)))(acc(x => y => x))(x => y => y)))) ((x => y => f => f(x)(y))(s)(emptyStack)))(s))(x => y => y))(s1))((s => (reduce((x => y => f => f(x)(y))((acc, curr) => (x => y => f => f(x)(y))((s => (x => y => f => f(x)(y))(s(x => y => z => y))
((s => s(x => y => z => z))(s)))(acc(x => y => x))(x => y => x))((s => x => (x => y => z => f => f(x)(y)(z))((n => f => (f => g => x => f(g(x)))(f)(n(f)))(s(x => y => z => x)))(s)(x))(acc(x => y => y))((s => (x => y => f => f(x)(y))(s(x => y => z => y))((s => s(x => y => z => z))(s)))(acc(x => y => x))(x => y => y)))) ((x => y => f => f(x)(y))(s)((x => y => z => f => f(x)(y)(z))
(f => a => a)(x => x)(x => x))))(s))(x => y => y))(s2))((x => y => z => f => f(x)(y)(z))(f => a => a)(x => x)(x => x)))(x => y => z => z);

// TODO: zip with empyt stacks ?
// [a] -> [b] -> [(a, b)]
const zip = zipWith(pair);
