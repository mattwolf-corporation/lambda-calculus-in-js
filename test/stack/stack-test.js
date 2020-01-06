import {TestSuite} from "../test.js";

import {id, beq, True, False, showBoolean as show, convertToJsBool , pair, triple, fst, snd, firstOfTriple, secondOfTriple, thirdOfTriple, not} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, pred, succ, jsnum, is0} from '../../src/lambda-calculus-library/church-numerals.js';
import { stack, stackIndex, stackPredecessor, stackValue, emptyStack,
    hasPre, push, pop, head, size, lambdaStackReducer, filterStack, mapStack,
    getElementByIndex, logStack} from "../../src/stack/stack.js";

const stackSuite = TestSuite("stack (pure functional data structure)");

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

stackSuite.add("reduce", assert => {

});








stackSuite.report();