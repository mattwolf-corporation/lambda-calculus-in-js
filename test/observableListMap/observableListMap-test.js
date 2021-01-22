import {TestSuite} from "../test.js";
import {
    addListener,
    handlerBuilder,
    handlerFnLogToConsole,
    InitObservable, setValue, getValue, buildHandlerFnValue, logListenersToConsole, removeListenerByHandler
} from "../../src/observableListMap/observableListMap.js";

const observableListMapSuite = TestSuite("Observable Pattern with ListMap (pure functional data structure)");


observableListMapSuite.add("setValue", assert => {
    const consoleHandler = handlerBuilder(42)(handlerFnLogToConsole)

    const valueHolder = {};
    const valueHandler = handlerBuilder(43)(buildHandlerFnValue(valueHolder))

    let testObs = InitObservable(0)
    (addListener)(consoleHandler)
    (addListener)(valueHandler)

    const methodUnderTest1 = () => testObs = testObs(setValue)(66);
    const methodUnderTest2 = () => testObs = testObs(setValue)(96);

    assert.consoleLogEquals(methodUnderTest1, "Value: new = 66, old = 0")
    assert.equals(valueHolder.value, 66)

    assert.consoleLogEquals(methodUnderTest2, "Value: new = 96, old = 66")
    assert.equals(valueHolder.value, 96)
});

observableListMapSuite.add("getValue", assert => {

    let testObs = InitObservable(0)
    assert.equals(testObs(getValue), 0)

    testObs = testObs(setValue)(66)
    assert.equals(testObs(getValue), 66)

    testObs = testObs(setValue)(42)
    assert.equals(testObs(getValue), 42)
});

observableListMapSuite.add("logListenersToConsole", assert => {
    const consoleHandler = handlerBuilder(42)(handlerFnLogToConsole)

    const valueHolder = {};
    const valueHandler = handlerBuilder(43)(buildHandlerFnValue(valueHolder))

    let testObs = InitObservable(0)
    (addListener)(consoleHandler)
    (addListener)(valueHandler)

    const expectedLogs = [
        "element at: 1: 42 | nVal => oVal => console.log(`Value: new = ${nVal}, old = ${oVal}`)",
        "element at: 2: 43 | nVal => oVal => element.value     = nVal"]

    assert.consoleLogEquals(() => testObs(logListenersToConsole), ...expectedLogs)
});

observableListMapSuite.add("removeListenerByHandler", assert => {
    // given
    const consoleHandler = handlerBuilder(42)(handlerFnLogToConsole)

    const valueHolder = {};
    const valueHandler = handlerBuilder(43)(buildHandlerFnValue(valueHolder))

    // when 1
    let testObs = InitObservable(0)
    (addListener)(consoleHandler)
    (addListener)(valueHandler)

    const methodUnderTest1 = () => testObs = testObs(setValue)(66);

    // then 1
    assert.consoleLogEquals(methodUnderTest1, "Value: new = 66, old = 0")
    assert.equals(valueHolder.value, 66)
    assert.equals(testObs(getValue), 66)

    // when 2
    const methodUnderTest2 = () => testObs = testObs(setValue)(100);

    testObs = testObs(removeListenerByHandler)(consoleHandler)
    testObs = testObs(removeListenerByHandler)(valueHandler)

    // then 2
    assert.consoleLogEquals(methodUnderTest2, ...[])
    assert.equals(valueHolder.value, 66)
    assert.equals(testObs(getValue), 100)
});

observableListMapSuite.report();
