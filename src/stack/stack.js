import {id, beq, True, False, showBoolean as show, convertToJsBool , pair, triple, fst, snd, first, second, third, not} from '../lambda-calculus-library/lambda-calculus.js'
import {n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, pred, succ, jsnum, is0} from '../lambda-calculus-library/church-numerals.js'
import {churchSubtraction, churchAddition} from "../calculator/calculator.js";


/**
 * stack implementation
 */
const stack = x => y => z => f => f(x)(y)(z);

const stackIndex = x => y => z => x;
const stackPredecessor = x => y => z => y;
const stackValue = x => y => z => z;

const emptyStack = stack (n0) (id) (id);

const hasPre = s => not(is0(s(stackIndex)));  // give true/false (function)
const push = s => x => stack (succ(s(stackIndex))) (s) (x);
const pop = s => pair (s(stackPredecessor)) (head(s));
const head = s => s(stackValue);
const size = s => (s(stackIndex));

/**
 * todo: map, filter, reduce
 */



// Tests
/**
 * has empty stack a predecessor
 */
console.log
("has empty stack no predecessor: ", show
    (beq
        (hasPre(emptyStack))
        (False)
    )
);

console.log
("has non-empty stack a predecessor: ", show
    (beq
        (hasPre(push(emptyStack)(id)))
        (True)
    )
);

console.log
("pop returns the pushed value: ", show
    (beq
        ((pop(push(emptyStack)(id)))(snd) (True))
        (True)
    )
);

console.log
("pop returns predecessor stack: ",
    pop(push(emptyStack)(id)) (fst) === emptyStack
);

console.log
("returns head: ", show
    (beq
        ((head(push(emptyStack)(id))) (True))
        (True)
    )
);


// Experiment: reduce function with lambda stack (reduce with head element of the stack)
// reducePair = pair(stack)(0)(reduce-function)

const testStack = push( push( push(emptyStack)(0) ) (1) ) (2);

console.log('has emptyStack a pre: ' + convertToJsBool(hasPre(emptyStack)));
console.log('has stack with 3 elements a pre: ' + convertToJsBool(hasPre(testStack)));

const reduceFunctionSum = (acc, curr) => acc + curr;

const reduceTripleTest = triple(testStack)(0)(reduceFunctionSum);

const reduceBuilder = reduceTriple => {
    const stack = reduceTriple(first);

    if(convertToJsBool(hasPre(stack))){
        const reduceFunction = reduceTriple(third);
        // const acc = (reducePair)(snd) + (pop(stack))(snd);

        const preAcc = reduceTriple(second);
        console.log("debug: " + preAcc);

        const curr = (pop(stack))(snd);
        console.log("debug: " + curr);

        const acc = reduceFunction( preAcc , curr );
        console.log("debug: " + acc);

        return triple((pop(stack))(fst))(acc)(reduceFunction);
    }
    return reduceTriple;
};

const lambdaStackReducer = s => initValue => reduceFunction=> {
    const times = size(s);
    const t = triple(s)(initValue)(reduceFunction);

    return (times(reduceBuilder)(t))(second);
};

// const result = (n4(reduceBuilder)(reduceTripleTest))(second);
const convertStackToArray = (acc, curr) => [...acc, curr];
const reverseStack = (acc, curr) => push(acc)(curr);

const result = lambdaStackReducer(testStack)(emptyStack)(reverseStack);
console.log('reduce Test: ' + result);
console.log('has result pre: ' + convertToJsBool(result(hasPre)));
console.log('reduce Test: ' + head(result(stackPredecessor)));
console.log('reduce Test: ' + jsnum(size(result)));
console.log('reduce Test: ' + head(result));


const testStackForGetByIndex = push(push(push( push( push(emptyStack)(5) ) (10) ) (45) )(50) ) (51);

const getElementByIndex = s => i => {
    const times = churchSubtraction(size(s))(i);

    const func = s => s(stackPredecessor);

    return head(times(func)(s));
};

console.log('Element at Index 1: ' + getElementByIndex(testStackForGetByIndex)(n1));
console.log('Element at Index 2: ' + getElementByIndex(testStackForGetByIndex)(n2));
console.log('Element at Index 3: ' + getElementByIndex(testStackForGetByIndex)(n3));
console.log('Element at Index 4: ' + getElementByIndex(testStackForGetByIndex)(n4));
console.log('Element at Index 4: ' + getElementByIndex(testStackForGetByIndex)(n5));
console.log('Element at Index 0: ' + (getElementByIndex(testStackForGetByIndex)(n0))(true));


// TODO: function convert js-num in church-num
// TODO: stack erstellen mit schleife & push

const add10 = x => x + 10;

const mapStack = s => mapFunction => {

    const times = size(s);
    const mapPair = pair(emptyStack)(n0);

    const map = mapPair => {

        if(convertToJsBool(is0(churchSubtraction(times)(mapPair(snd))))){
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

const mappedStack = mapStack(testStackForGetByIndex)(add10);

console.log('Element at Index 1: ' + getElementByIndex(mappedStack)(n1));
console.log('Element at Index 2: ' + getElementByIndex(mappedStack)(n2));
console.log('Element at Index 3: ' + getElementByIndex(mappedStack)(n3));
console.log('Element at Index 4: ' + getElementByIndex(mappedStack)(n4));
console.log('Element at Index 4: ' + getElementByIndex(mappedStack)(n5));
console.log('Element at Index 0: ' + (getElementByIndex(mappedStack)(n0))(true));

// TODO: map ausgabe schreiben