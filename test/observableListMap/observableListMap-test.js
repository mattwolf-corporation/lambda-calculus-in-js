import {TestSuite} from "../test.js";

import {id, beq, True, False, showBoolean as show, convertToJsBool, pair, triple, fst, snd, firstOfTriple, secondOfTriple, thirdOfTriple, not} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, pred, succ, jsnum, is0, churchAddition} from '../../src/lambda-calculus-library/church-numerals.js';
import {
    hasPre, push, pop, head, size, startStack, stack,
    pushToStack, convertArrayToStack, getElementByIndex
} from "../../src/stack/stack.js";

import {
    listMap, startListMap, emptyListMap, removeByKey, getElementByKey
}from "../../src/listMap/listMap.js";
import {
    addListener,
    handlerBuilder,
    handlerFnLogToConsole,
    InitObservable, setValue, getValue
} from "../../src/observableListMap/observableListMap.js";

const observableListMapSuite = TestSuite("Observable Pattern with ListMap (pure functional data structure)");


observableListMapSuite.add("setValue", assert => {

    const consoleHandler = handlerBuilder(42)( handlerFnLogToConsole)

    let testObs = InitObservable(0)
                                (addListener)(consoleHandler)



    assert.consoleLogEquals(() => testObs = testObs(setValue)(66), "Value: new = 66, old = 0" )

    assert.consoleLogEquals(() => testObs = testObs(setValue)(96), "Value: new = 96, old = 66" )

});

observableListMapSuite.report();
