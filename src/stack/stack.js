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
    and, or
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
    is0, gt, leq, eq, phi, churchAddition, churchSubtraction
} from '../lambda-calculus-library/church-numerals.js'

export {
    stack, stackIndex, stackPredecessor, stackValue, emptyStack,
    hasPre, push, pop, head, size, reduce, filter, map,
    getElementByIndex, getElementByJsnumIndex, logStackToConsole,
    startStack, pushToStack, reverseStack, filterWithReduce,
    mapWithReduce, convertStackToArray, convertArrayToStack
}

/**
 * The stack is a pure functional data structure and is therefore immutable.
 * The stack is implemented as a triplet.
 * The first value of the triple represents the size (number of elements) of the stack.
 * At the same time the first value represents the index of the head (top value) of the stack.
 * The second value represents the predecessor stack
 * The third value represents the head ( top value ) of the stack
 */
const stack = x => y => z => f => f(x)(y)(z);

/**
 * getter function - first of a triple
 */
const stackIndex = firstOfTriple;

/**
 * getter function - second of a triple
 */
const stackPredecessor = secondOfTriple;

/**
 * getter function - third of a triple
 */
const stackValue = thirdOfTriple;

/**
 * Representation of the empty stack
 * The empty stack has the size/index zero (has zero elements).
 * The empty stack has no predecessor stack, but the identity function as placeholder.
 * The empty stack has no head ( top value ), but the identity function as placeholder.
 */
const emptyStack = stack(n0)(id)(id);

/**
 * A function that takes a stack
 * The function returns a church-boolean, which indicates whether the stack has a predecessor stack
 */
const hasPre = s => not(is0(s(stackIndex)));

/**
 * A function that takes a stack and a value
 * The function returns a new stack with the pushed value
 */
const push = s => x => stack(succ(s(stackIndex)))(s)(x);

/**
 * A function that takes a stack
 * The function returns a value pair.
 * The first element of the pair is the predecessor stack.
 * The second element of the pair is the head (the top element) of the stack
 */
const pop = s => pair(s(stackPredecessor))(head(s));

/**
 * A function that takes a stack
 * The function returns the head (the top value) of the stack
 */
const head = s => s(stackValue);

/**
 * A function that takes a stack
 * The function returns the size (number of elements) in the stack
 */
const size = s => s(stackIndex);

/**
 * A function that takes a stack and an index (as church number)
 * The function returns the element at the passed index
 */
const getElementByIndex = s => i => {
    const times = churchSubtraction(size(s))(i);
    const getStackPredecessor = s => s(stackPredecessor);

    return head(times(getStackPredecessor)(s));
};

/**
 * A function that takes a stack and an index
 * The function returns the element at the passed index
 */
const getElementByJsnumIndex = s => i => {
    const times = size(s);
    const initArgsPair = pair(s)(id);

    const getElement = argsPair => {
        const stack = argsPair(fst);
        const predecessorStack = (stack)(stackPredecessor);

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
 */
const convertStackToArray = s => reduce(s)(pair((acc, curr) => [...acc, curr])([]));

/**
 * A function that takes an array and converts the array into a stack.
 * The function returns a stack
 */
const convertArrayToStack = array => array.reduce((acc, curr) => push(acc)(curr), emptyStack);

/**
 * A function that accepts a stack.
 * The function returns the reversed stack.
 */
const reverseStack = s => (reduce(s)(pair((acc, curr) => pair(pop(acc(fst))(fst))(push(acc(snd))(pop(acc(fst))(snd))))(pair(s)(emptyStack))))(snd);

/**
 * A function that accepts a stack and a map function.
 * The function returns the mapped stack.
 */
const mapWithReduce = s => map => reduce(s)(pair((acc, curr) => push(acc)(map(curr)))(emptyStack));

/**
 * A function that accepts a stack and a filter function.
 * The function returns the filtered stack.
 */
const filterWithReduce = s => filter => reduce(s)(pair((acc, curr) => filter(curr) ? push(acc)(curr) : acc)(emptyStack));

/**
 * A function that takes a stack and argument pair.
 * The first argument of the pair must be a reducer function.
 * The second argument of the pair must be a start value.
 * The function reduces the stack using the passed reduce function and the passed start value
 */
const reduce = s => argsPair => {
    const times = size(s);
    const reversedStack = (times(reduceIteration)(triple(s)((acc, curr) => push(acc)(curr))(emptyStack)))(thirdOfTriple);
    const argsTriple = triple(reversedStack)(argsPair(fst))(argsPair(snd));

    return (times(reduceIteration)(argsTriple))(thirdOfTriple);
};

const reduceIteration = argsTriple => {
    const stack = argsTriple(firstOfTriple);

    if (convertToJsBool(hasPre(stack))) {
        const reduceFunction = argsTriple(secondOfTriple);

        const preAcc = argsTriple(thirdOfTriple);

        const curr = head(stack);

        const acc = reduceFunction(preAcc, curr);

        const preStack = stack(stackPredecessor);

        return triple(preStack)(reduceFunction)(acc);
    }
    return argsTriple;
};

/**
 * A function that takes a stack and a map function.
 * The function returns the mapped stack
 */
const map = s => mapFunction => {
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
 */
const filter = s => filterFunction => {
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