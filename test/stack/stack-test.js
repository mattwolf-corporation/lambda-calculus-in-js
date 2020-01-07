import {TestSuite} from "../test.js";

import {id, beq, True, False, showBoolean as show, convertToJsBool , pair, triple, fst, snd, firstOfTriple, secondOfTriple, thirdOfTriple, not} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, pred, succ, jsnum, is0} from '../../src/lambda-calculus-library/church-numerals.js';
import { stack, stackIndex, stackPredecessor, stackValue, emptyStack,
    hasPre, push, pop, head, size, lambdaStackReducer, filterStack, mapStack,
    getElementByIndex, logStack} from "../../src/stack/stack.js";
import {churchAddition} from "../../src/calculator/calculator.js";

const stackSuite = TestSuite("stack (pure functional data structure)");

// Test data
const personList = [
    {firstName: 'Peter', lastName: 'Pan', age: 30, income: 1000},
    {firstName: 'Marc', lastName: 'Hunt', age: 28, income: 2000},
    {firstName: 'Luc', lastName: 'Skywalker', age: 36, income: 3000},
    {firstName: 'Han', lastName: 'Solo', age: 55, income: 4000},
    {firstName: 'Tyrion', lastName: 'Lennister', age: 40, income: 5000}
];
Object.freeze(personList);

stackSuite.add("emptyStack", assert => {
    assert.equals(convertToJsBool(hasPre(emptyStack)), false);
    assert.equals((pop(emptyStack))(fst), id);
    assert.equals((pop(emptyStack))(snd), id);
    assert.equals(size(emptyStack), n0);
    assert.equals(head(emptyStack), id);
});

stackSuite.add("hasPre", assert => {
    const nonEmptyStack = push( push( push(emptyStack)(0) ) (1) ) (2);

    assert.equals(convertToJsBool(hasPre(emptyStack)), false);
    assert.equals(convertToJsBool(hasPre(nonEmptyStack)), true);
    assert.equals(convertToJsBool(hasPre(pop(push(emptyStack)(0))(fst))), false);
});

stackSuite.add("push", assert => {
    const nonEmptyStack = push( push( push(emptyStack)(0) ) (1) ) (2);

    assert.equals(convertToJsBool(hasPre(push(emptyStack)(5))), true);
    assert.equals(head(nonEmptyStack), 2);
    assert.equals(jsnum(size(nonEmptyStack)), 3);
    assert.equals(pop(push(emptyStack)(42))(snd), 42);
});

stackSuite.add("pop", assert => {
    const nonEmptyStack = push( push( push(emptyStack)(0) ) (1) ) (2);

    assert.equals(pop(nonEmptyStack)(snd), 2);
    assert.equals(pop(pop(nonEmptyStack)(fst))(snd), 1);
    assert.equals(pop(pop(pop(nonEmptyStack)(fst))(fst))(snd), 0);
    assert.equals((pop(pop(pop(nonEmptyStack)(fst))(fst))(fst))(snd), id);
    assert.equals(jsnum(size((pop(nonEmptyStack))(fst))), 2);
});

stackSuite.add("head", assert => {
    const nonEmptyStack = push( push(emptyStack)(0) ) (1);

    assert.equals(head(nonEmptyStack), 1);
    assert.equals(head((pop(nonEmptyStack))(fst)), 0);
});

stackSuite.add("size", assert => {
    const nonEmptyStack = push( push(emptyStack)(0) ) (1);

    assert.equals(jsnum(size(nonEmptyStack)), 2);
    assert.equals(jsnum(size(push(nonEmptyStack)(42))), 3);
    assert.equals(jsnum(size(pop(nonEmptyStack)(fst))), 1);
});

stackSuite.add("random", assert => {
    // has empty stack no predecessor
    assert.equals(convertToJsBool
    (beq
        (hasPre(emptyStack))
        (False)
    ), true);

    // has non-empty stack a predecessor
    assert.equals(convertToJsBool
    (beq
        (hasPre(push(emptyStack)(id)))
        (True)
    ), true);

    // pop returns the pushed value
    assert.equals(convertToJsBool
    (beq
        ((pop(push(emptyStack)(id)))(snd) (True))
        (True)
    ), true);

    // pop returns predecessor stack
    assert.equals(pop(push(emptyStack)(id)) (fst) === emptyStack, true);

    // returns head
    assert.equals(convertToJsBool
    (beq
        ((head(push(emptyStack)(id))) (True))
        (True)
    ), true);
});

stackSuite.add("reduce", assert => {
    const stackWithNumbers = push( push( push(emptyStack)(0) ) (1) ) (2);
    const stackWithChurchNumbers = push( push( push(emptyStack)(n9) ) (n2) ) (n3);

    const reduceFunctionSum = (acc, curr) => acc + curr;
    const reduceFunctionChurchNumbersSum = (acc, curr) => churchAddition(acc)(curr);
    const reduceToArray = (acc, curr) => [...acc, curr];

    const personStack = push(push(push( push( push(emptyStack)(personList[0]) ) (personList[1]) ) (personList[2]) )(personList[3]) ) (personList[4]);

    assert.equals(lambdaStackReducer(stackWithNumbers)(0)(reduceFunctionSum), 3);
    assert.equals(lambdaStackReducer(push(stackWithNumbers)(3))(0)(reduceFunctionSum), 6);
    assert.equals(lambdaStackReducer(personStack)(0)((acc, curr) => acc + curr.income), 15000);
    assert.equals(jsnum(lambdaStackReducer(stackWithChurchNumbers)(n0)(reduceFunctionChurchNumbersSum)), 14);
    // TODO: Array & Object equals method
    // assert.equals(lambdaStackReducer(stackWithNumbers)([])(reduceToArray), [2, 1, 0]);
});

stackSuite.add("map", assert => {
});




stackSuite.report();