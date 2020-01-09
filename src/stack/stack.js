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
    is0, gt, leq, eq, phi
} from '../lambda-calculus-library/church-numerals.js'
import {churchSubtraction, churchAddition} from "../calculator/calculator.js";

export {
    stack, stackIndex, stackPredecessor, stackValue, emptyStack,
    hasPre, push, pop, head, size, lambdaStackReducer, filterStack, mapStack,
    getElementByIndex, getElementByIndexJs, logStackToConsole
}


/**
 * stack implementation (purely functional)
 */
const stack = x => y => z => f => f(x)(y)(z);

const stackIndex = firstOfTriple;
const stackPredecessor = secondOfTriple;
const stackValue = thirdOfTriple;

const emptyStack = stack(n0)(id)(id);

const hasPre = s => not(is0(s(stackIndex)));  // give true/false (function)
const push = s => x => stack(succ(s(stackIndex)))(s)(x);
const pop = s => pair(s(stackPredecessor))(head(s));
const head = s => s(stackValue);
const size = s => (s(stackIndex));

const reduceBuilder = reduceTriple => {
    const stack = reduceTriple(firstOfTriple);

    if (convertToJsBool(hasPre(stack))) {
        const reduceFunction = reduceTriple(thirdOfTriple);
        // const acc = (reducePair)(snd) + (pop(stack))(snd);

        const preAcc = reduceTriple(secondOfTriple);
        // console.log("debug: " + preAcc);

        const curr = (pop(stack))(snd);
        // console.log("debug: " + curr);

        const acc = reduceFunction(preAcc, curr);
        // console.log("debug: " + acc);

        return triple((pop(stack))(fst))(acc)(reduceFunction);
    }
    return reduceTriple;
};

const lambdaStackReducer = s => initValue => reduceFunction => {
    const times = size(s);
    const t = triple(s)(initValue)(reduceFunction);

    return (times(reduceBuilder)(t))(secondOfTriple);
};

const convertStackToArray = (acc, curr) => [...acc, curr];
const reverseStack = (acc, curr) => push(acc)(curr);

const logStackToConsole = s => {
    const reversedStack = lambdaStackReducer(s)(emptyStack)(reverseStack);

    const logStack = (acc, curr) => {
        const index = acc + 1;
        console.log('element at: ' + index + ': ' + JSON.stringify(curr));
        return index;
    };

    lambdaStackReducer(reversedStack)(0)(logStack);
};

const getElementByIndex = s => i => {
    const times = churchSubtraction(size(s))(i);

    const func = s => s(stackPredecessor);

    return head(times(func)(s));
};

const getElementByIndexJs = s => i => {
    const times = size(s);
    const elemPair = pair(s)(id);

    const getElement = getElmPair => {
        const predecessorStack = (getElmPair(fst))(stackPredecessor);

        if (jsnum((getElmPair(fst))(stackIndex)) === i) {
            const stack = getElmPair(fst);

            return pair(predecessorStack)(head(stack));
        }

        return pair(predecessorStack)(getElmPair(snd));
    };

    return (times(getElement)(elemPair))(snd);
};

// TODO: stack erstellen mit schleife & push

const mapStack = s => mapFunction => {

    const times = size(s);
    const mapPair = pair(emptyStack)(n0);

    const map = mapPair => {

        if (convertToJsBool(is0(churchSubtraction(times)(mapPair(snd))))) {
            return mapPair;
        }
        const index = succ(mapPair(snd));
        const valueToMap = getElementByIndex(s)(index);
        const mappedValue = mapFunction(valueToMap);
        const resultStack = push(mapPair(fst))(mappedValue);

        return pair(resultStack)(index);
    };

    return (times(map)(mapPair))(fst);
};

// TODO: was wenn kein element dem Filter entspricht -> empty Stack zurückgeben
const filterStack = s => filterFunction => {
    const times = size(s);
    const filterPair = pair(emptyStack)(n0);

    const filter = filterPair => {
        const index = succ(filterPair(snd));

       //  if(convertToJsBool(e))
        if (convertToJsBool(not(is0(churchSubtraction(times)(filterPair(snd)))))) {
            const value = getElementByIndex(s)(index);

            if (filterFunction(value)) {
                const resultStack = push(filterPair(fst))(value);
                return pair(resultStack)(index);
            }
        }

        return pair(filterPair(fst))(index);
    };

    return (times(filter)(filterPair))(fst);
};