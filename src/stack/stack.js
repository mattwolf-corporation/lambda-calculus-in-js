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
    If, Then, Else, K, B, convertJsBoolToChurchBool
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
    jsNum,
    is0, gt, leq, eq, phi, churchAddition, churchSubtraction,
    toChurchNum
} from '../lambda-calculus-library/church-numerals.js'

export {
    stack, stackIndex, stackPredecessor, stackValue, emptyStack,
    hasPre, push, pop, head, size, reduce, filter, map,
    getElementByIndex, logStackToConsole,
    startStack, pushToStack, reverseStack, filterWithReduce,
    mapWithReduce, convertStackToArray, convertArrayToStack, forEach,
    forEachOld, removeByIndex, getPreStack, concat, flatten, zip,
    zipWith, zipWithOneLiner, stackEquals
}

//  {function(index:*): function(value:*):  function(head:*): function(f:function): ({f: {x y z}}) }


/**
 * Generic Types
 * @typedef {*} a
 * @typedef {*} b
 * @typedef {function} pair
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 * @typedef {function} stack
 * @typedef {function} stackOp
 * @typedef {number} JsNumber
 */

/**
 * index -> predecessor -> value -> f -> f(index)(predecessor)(head) ; Triple
 *
 * The stack is a pure functional data structure and is therefore immutable.
 * The stack is implemented as a triplet.
 * The first value of the triple represents the size (number of elements) of the stack.
 * At the same time the first value represents the index of the head (top value) of the stack.
 * The second value represents the predecessor stack
 * The third value represents the head ( top value ) of the stack
 *
 * @function stack
 * @type {function(index:churchNumber): function(predecessor:stack):  function(value:*): function(f:function): ({f: {index value head}}) }
 * @return {triple} stack as triple
 */
const stack = triple;

/**
 * Representation of the empty stack
 * The empty stack has the size/index zero (has zero elements).
 * The empty stack has no predecessor stack, but the identity function as placeholder.
 * The empty stack has no head ( top value ), but the identity function as placeholder.
 *
 * @type {function(Function): {f: {index, predecessor, head}}}
 */
const emptyStack = stack(n0)(id)(id);


/**
 * @haskell stackIndex :: a -> b -> c -> a
 *
 * stack getter function - get the Index (first of a triple)
 *
 * @function stackIndex
 * @return {churchNumber} index/size
 * @example
 * stack(n0)(emptyStack)(42)(stackIndex) === n0
 */
const stackIndex = firstOfTriple;

/**
 * @haskell stackPredecessor :: a -> b -> c -> b
 *
 * stack getter function - get the Predecessor (second of a triple)
 *
 * @function stackPredecessor
 * @return {stack|id} predecessor stack or id if emptyStack
 * @example
 * stack(n0)(emptyStack)(42)(stackPredecessor) === emptyStack
 */
const stackPredecessor = secondOfTriple;


/**
 * @haskell stackValue :: a -> b -> c -> c
 *
 * stack getter function - get the Value (third of a triple)
 *
 * @function stackValue
 * @return {*} value
 * @example
 * stack(n0)(emptyStack)(42)(stackValue) === 42
 */
const stackValue = thirdOfTriple;


/**
 * @haskell: hasPre :: a -> churchBoolean
 *
 * A function that takes a stack and returns a church-boolean, which indicates whether the stack has a predecessor stack
 *
 * @function hasPredecessor
 * @param {stack} s
 * @return {churchBoolean} churchBoolean
 */
const hasPre = s => not(is0(s(stackIndex)));

/**
 * @haskell getPreStack :: stack -> stack
 *
 * A function that takes a stack and returns the predecessor stack
 *
 * @function getPredecessorStack
 * @param {stack} s
 * @return {stack} predecessor of that stack
 */
const getPreStack = s => s(stackPredecessor)


/**
 * @haskell push :: stack -> a -> stack
 *
 * @description A function that takes a stack and a value. The function returns a new stack with the pushed value
 *
 * @param {stack} s
 * @return {stack} stack with value x
 */
const push = s => stack(succ(s(stackIndex)))(s);

/**
 * @haskell pop :: stack -> pair
 *
 * @description A function that takes a stack. The function returns a value pair. The first element of the pair is the predecessor stack. The second element of the pair is the head (the top element) of the stack.
 *
 * @param {stack} s
 * @return {pair} pair
 */
const pop = s => pair(s(stackPredecessor))(head(s));

/**
 * @haskell head :: stack -> a
 *
 * @descriptionA function that takes a stack. The function returns the head (the top value) of the stack.
 *
 * @function
 * @param {stack} s
 * @return {*} stack-value
 */
const head = s => s(stackValue);

/**
 * @haskell size :: stack -> churchNumber
 *
 * @description A function that takes a stack. The function returns the size (number of elements) in the stack
 *
 * @function
 * @param {stack} s
 * @return {churchNumber} stack-index as church numeral
 */
const size = s => s(stackIndex);

/**
 * @haskell reduce :: pair -> stack -> a
 *
 * @description A function that takes a stack and argument pair.
 * The first argument of the pair must be a reducer function.
 * The second argument of the pair must be a start value.
 * The function reduces the stack using the passed reduce function and the passed start value
 *
 * @function
 * @param {function(Function): {f: {x, y}}} argsPair
 * @return {function(s:stack): function(stack)} reduced value
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
 * @haskell reduceIteration :: triple -> a
 *
 *
 *
 * @function
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
 * @haskell getElementByIndex :: stack -> churchNumber -> b
 *
 * A function that takes a stack and an index (as church number)
 * The function returns the element at the passed index
 *
 * @param {stack} s
 * @return {function(i:{churchNumber}) : * } stack-value
 */
const getElementByIndex = s => i => {
    // TODO: NaN is also of Type Number & infinity usw.
    if (typeof i === "number"){
        return getElementByJsnumIndex(s)(i)
    }
    return getElementByChurchNumberIndex(s)(i)
};

const getElementByChurchNumberIndex = s => i => {
    const times = churchSubtraction(size(s))(i);
    const getStackPredecessor = s => s(stackPredecessor);

    return head(times(getStackPredecessor)(s));
};

/**
 * @description A function that takes a stack and an index. The function returns the element at the passed index
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

        if (jsNum((stack)(stackIndex)) === i) {

            return pair(predecessorStack)(head(stack));
        }

        return pair(predecessorStack)(argsPair(snd));
    };

    return (times(getElement)(initArgsPair))(snd);
};


/**
 * @description A function that takes an stack and converts the stack into an array. The function returns an array
 *
 * @param {stack} s
 * @return {Array} Array
 */
const convertStackToArray = reduce(pair((acc, curr) => [...acc, curr])([]));

/**
 * @description A function that takes an array and converts the array into a stack. The function returns a stack
 *
 * @param {Array} array
 * @return {stack} stack
 */
const convertArrayToStack = array => array.reduce((acc, curr) => push(acc)(curr), emptyStack);

/**
 * @description A function that accepts a stack. The function returns the reversed stack.
 *
 * @param {stack} s
 * @return {stack} stack (reversed)
 */
const reverseStack = s => (reduce(pair((acc, curr) => pair(pop(acc(fst))(fst))(push(acc(snd))(pop(acc(fst))(snd)))) (pair(s)(emptyStack)))(s))(snd);

/**
 * @description A function that accepts a map function and a stack. The function returns the mapped stack.
 *
 * @param {function} mapFunc
 * @return function(triple): function(triple)
 */
const mapWithReduce = mapFunc => reduce(pair((acc, curr) => push(acc)(mapFunc(curr)))(emptyStack));

/**
 * @description A function that accepts a stack and a filter function. The function returns the filtered stack.
 *
 * @param {function} filterFunc
 * @return {function(reduce:stack): function(stack)} stack
 */
const filterWithReduce = filterFunc => reduce(pair((acc, curr) => filterFunc(curr) ? push(acc)(curr) : acc)(emptyStack));

/**
 * @description A function that takes a stack and a map function. The function returns the mapped stack
 *
 * @param {function} mapFunction
 * @return {function(s:stack): stack} stack
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
 * @descriptionA function that accepts a stack and a filter function. The function returns the filtered stack
 *
 * @param  {function} filterFunction
 * @return {function(s:stack): stack} pair
 *
 * @example
 * const stackWithNumbers = startStack(pushToStack)(42)(pushToStack)(7)(pushToStack)(3)(id)
 * filter(x => x < 5 && x > 2)(stackWithNumbers) === startStack(pushToStack)(3)(id)
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
 * @descriptionA function that accepts a stack. The function performs a side effect. The side effect logs the stack to the console.
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


/**
 * @description stackOperationBuilder is the connector for Stack-Operations to have a Builderpattern
 *
 * @function stackOperationBuilder
 * @param {stackOp} stackOp
 * @returns {function(s:stack):  function(x:*): function(f:function): function(Function) } pushToStack
 */
const stackOpBuilder = stackOp => s => x => f => f(stackOp(s)(x));

/**
 * A help function to create a new stack
 */
const startStack = f => f(emptyStack);

/**
 * @description pushToStack is a Stack-Builder-Command to push new values to the current stack
 *
 * @param  {stackOpBuilder} stackOp
 * @returns {function(pushToStack)} pushToStack
 *
 * @example
 * const stackOfWords = startStack(pushToStack)("Hello")(pushToStack)("World")(id)
 * getElementByIndex(stackOfWords)(1) === "Hello"
 * getElementByIndex(stackOfWords)(2) === "World"
 */
const pushToStack = stackOpBuilder(push);



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
            const index = jsNum(succ(churchSubtraction(times)(size(s))));

            f(element, index);

            return (pop(s))(fst);
        }
        return s;
    };

    times(iteration)(reversedStack);
};


/**
 * @description
 *
 * @param stack
 * @return {function(*): void}
 * @example
 */
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
 * @description Remove element by given Index
 *
 * @param {stack} stack without the element
 * @example
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


/**
 *
 * @param {stack} currentStack
 * @return {function(resultStack:stack): function(index:churchNumber|number): function(currentIndex:churchNumber): function(Function): triple}
 */
const removeByCondition = currentStack => resultStack => index => currentIndex => {
    const currentElement = head(currentStack);
    const indexNumber = typeof index === "number" ? toChurchNum(index) : index;
    const condition = eq( indexNumber )(currentIndex);
    const result = If(condition)
    (Then(resultStack))
    (Else(push(resultStack)(currentElement)));

    return triple(getPreStack(currentStack))
    (result)
    (succ(currentIndex));
}

const reduceToStack = (acc, curr) => push(acc)(curr);

/**
 *
 * @param s1
 * @return {function(*=): (*)}
 *
 * @example
 *
 */
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

/**
 *
 * @param acc
 * @param curr
 * @return {*|(function(triple))}
 */
const reduceConcat = (acc, curr) => concat(acc)(curr);

/**
 *
 * @type {function(triple): function(triple)}
 */
const flatten = reduce(pair(reduceConcat)(emptyStack));


/**
 * @description Zip (combine) with two Stacks and apply a function
 *
 * @haskell zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
 *
 * @param {function} f
 * @return { function(s1:stack): function(s2:stack): stack}
 *
 * @example
 * const add = x => y => x + y;
 * const s1 = convertArrayToStack([1, 2, 3]);
 * const s2 = convertArrayToStack([4, 5, 6]);
 *
 * const zippedStack = zipWith(add)(s1)(s2);
 *
 * jsNum(size(zippedStack))          === 3
 * getElementByIndex(zippedStack)(0) === id
 * getElementByIndex(zippedStack)(1) === 5
 * getElementByIndex(zippedStack)(2) === 7
 * getElementByIndex(zippedStack)(3) === 9
 */
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

const zipWithOneLiner = f => s1 => s2 => ((n => k => (n => n((x => y => x)(x => y => y))(x => y => x))((n => k => k(n(p => (x => y => f => f(x)(y))(p(x => y => y))((n => f => (f => g => x => f(g(x)))(f)(n(f)))(p(x => y => y))))((x => y => f => f(x)(y))(f => a => a)(f => a => a))(x => y => x))(n))(n)(k)))
((s => s(x => y => z => x))(s1))((s => s(x => y => z => x))(s2)))(((s => s(x => y => z => x))(s1)))((x => x)((s => s(x => y => z => x))(s2)))(t => ((s => (f => x => y => f(y)(x))((n => n((x => y => x)(x => y => y))(x => y => x))(s(x => y => z => x))))(t(x => y => z => x)))((((x => y => z => f => f(x)(y)(z))((s => s(x => y => z => y))(t(x => y => z => x)))((s => s(x => y => z => y))(t(x => y => z => y)))((s => x => (x => y => z => f => f(x)(y)(z))((n => f => (f => g => x => f(g(x)))(f)(n(f)))(s(x => y => z => x)))(s)(x))(t(x => y => z => z))(f((s => s(x => y => z => z))(t(x => y => z => x)))((s => s(x => y => z => z))
(t(x => y => z => y))))))))((t)))((x => y => z => f => f(x)(y)(z))((s => (reduce((x => y => f => f(x)(y))((acc, curr) => (x => y => f => f(x)(y))((s => (x => y => f => f(x)(y))(s(x => y => z => y))((s => s(x => y => z => z))(s)))(acc(x => y => x))(x => y => x))((s => x => (x => y => z => f => f(x)(y)(z))((n => f => (f => g => x => f(g(x)))(f)(n(f)))
(s(x => y => z => x)))(s)(x))(acc(x => y => y))((s => (x => y => f => f(x)(y))(s(x => y => z => y))((s => s(x => y => z => z))(s)))(acc(x => y => x))(x => y => y)))) ((x => y => f => f(x)(y))(s)(emptyStack)))(s))(x => y => y))(s1))((s => (reduce((x => y => f => f(x)(y))((acc, curr) => (x => y => f => f(x)(y))((s => (x => y => f => f(x)(y))(s(x => y => z => y))
((s => s(x => y => z => z))(s)))(acc(x => y => x))(x => y => x))((s => x => (x => y => z => f => f(x)(y)(z))((n => f => (f => g => x => f(g(x)))(f)(n(f)))(s(x => y => z => x)))(s)(x))(acc(x => y => y))((s => (x => y => f => f(x)(y))(s(x => y => z => y))((s => s(x => y => z => z))(s)))(acc(x => y => x))(x => y => y)))) ((x => y => f => f(x)(y))(s)((x => y => z => f => f(x)(y)(z))
(f => a => a)(x => x))))(s))(x => y => y))(s2))((x => y => z => f => f(x)(y)(z))(f => a => a)(x => x)(x => x)))(x => y => z => z);

// TODO: zip with empyt stacks ?
/**
 *  @description Zip (combine) two Stack to one stack of pairs
 * @haskell zip :: [a] -> [b] -> [(a, b)]
 *
 * @type {function(triple): function(triple): triple}
 * @example
 * const s1 = convertArrayToStack([1, 2]);
 * const s2 = convertArrayToStack([3, 4]);
 *
 * const zippedStack = zip(s1)(s2);
 *
 * jsNum(size(zippedStack))          === 2
 * getElementByIndex(zippedStack)(0) === id
 * getElementByIndex(zippedStack)(1) === pair(1)(3)
 * getElementByIndex(zippedStack)(2) === pair(2)(4)
 */
const zip = zipWith(pair);


/**
 * @description Check two stacks of equality.
 *
 * @param {stack} s1
 * @return {function(s2:stack): churchBoolean} True / False
 *
 * @example
 * const s1 = convertArrayToStack([1, 2, 7]);
 * const s2 = convertArrayToStack([1, 2, 3]);
 *
 * stackEquals(s1)(s1) === True
 * stackEquals(s1)(s2) === False
 */
const stackEquals = s1 => s2 => {
    const size1 = size(s1);
    const size2 = size(s2);

    const times = size1;

    const compareElements = t => {
        const s1 = t(firstOfTriple);
        const s2 = t(secondOfTriple);

        const element1 = head(s1);
        const element2 = head(s2);

        const result = convertJsBoolToChurchBool(element1 === element2);

        return triple(getPreStack(s1))(getPreStack(s2))(result);
    }

    const iteration = t =>
        If(and(hasPre(t(firstOfTriple)))(t(thirdOfTriple)))
        (Then(compareElements(t)))
        (Else(t));

    return If(eq(size1)(size2))
                (Then(times(iteration)(triple(reverseStack(s1))(reverseStack(s2))(True))(thirdOfTriple))) // should only be executed when needed
                (Else(False))
}
