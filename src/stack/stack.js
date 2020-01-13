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
 * stack implementation (purely functional)
 */
const stack = x => y => z => f => f(x)(y)(z);

const stackIndex = firstOfTriple;
const stackPredecessor = secondOfTriple;
const stackValue = thirdOfTriple;

const emptyStack = stack(n0)(id)(id);

const hasPre = s => not(is0(s(stackIndex)));
const push   = s => x => stack(succ(s(stackIndex)))(s)(x);
const pop    = s => pair(s(stackPredecessor))(head(s));
const head   = s => s(stackValue);
const size   = s => s(stackIndex);

const getElementByIndex = s => i => {
    const times = churchSubtraction(size(s))(i);
    const getStackPredecessor = s => s(stackPredecessor);

    return head(times(getStackPredecessor)(s));
};

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

const convertStackToArray = s => reduce(s)(pair((acc, curr) => [...acc, curr])(emptyStack));
const convertArrayToStack = array => array.reduce((acc, curr) => push(acc)(curr), emptyStack);

const reverseStack = s => (reduce(s)(pair((acc, curr) => pair(pop(acc(fst))(fst))(push(acc(snd))(pop(acc(fst))(snd))))(pair(s)(emptyStack))))(snd);

const mapWithReduce = s => map => reduce(s)(pair((acc, curr) => push(acc)(map(curr)))(emptyStack));
const filterWithReduce = s => filter => reduce(s)(pair((acc, curr) => filter(curr) ? push(acc)(curr) : acc)(emptyStack));

const reduce = s => argsPair => {
    const times = size(s);
    const reversedStack = times(reduceIteration)(triple(s)((acc, curr) => push(acc)(curr))(emptyStack)) (thirdOfTriple);
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
const startStack = f => f(emptyStack);