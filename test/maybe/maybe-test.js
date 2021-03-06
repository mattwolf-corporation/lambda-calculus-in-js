import {TestSuite} from "../test.js";

import {id, pair, True, False} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {
    n1,
    n2,
    n3,
    n4,
    n5,
    n6,
    n7,
    n8,
    n9,
    churchMultiplication,
    jsNum
} from "../../src/lambda-calculus-library/church-numerals.js";
import {
    Nothing, Left, Right,
    Just,
    maybeDivision,
    eitherDomElement,
    getOrDefault,
    getDomElement,
    getDomElements,
    eitherDomElementOrConsoleError,
    maybeElement, maybeDomElement,
    eitherNumber,
    eitherElementsOrErrorsByFunction,
    maybeElementsByFunction
} from "../../src/maybe/maybe.js";
import {getElementByIndex, size, logStackToConsole} from "../../src/stack/stack.js";
import {getElementByKey} from "../../src/listMap/listMap.js"

const maybeSuite = TestSuite("Maybe");

const dummyDomElem = document.createElement('div');
const dummyDomElem2 = document.createElement('div');

const setup = () => {
    dummyDomElem.setAttribute('id', 'test');
    dummyDomElem2.setAttribute('id', 'test2');
    document.body.appendChild(dummyDomElem);
    document.body.appendChild(dummyDomElem2);
}

const tearDown = () => {
    const dummyDomElem = document.getElementById('test')
    const dummyDomElem2 = document.getElementById('test2')

    dummyDomElem.remove();
    dummyDomElem2.remove();
}

maybeSuite.add("Nothing", assert => {
    assert.equals( Nothing(() => 12)(() => 15), 12);
    assert.equals( Nothing(() => 15)(() => 12), 15);
    assert.equals( Nothing(() => id(122))(() => id(32)), 122);
    assert.equals( Nothing(() => 12 + 12)(0), 24);
});

maybeSuite.add("Just", assert => {
    assert.equals( Just(10)((val => val + 10))(val => val + 20), 30);
    assert.equals( Just(10)((_ => true))(_ => false), false);
    assert.equals( Just(id)((f => f(false)))(f => f(true)), true);
});

maybeSuite.add("maybeElement", assert => {
    assert.equals( maybeElement(false)(() => 10)(() => 42), 10);
    assert.equals( maybeElement(null)(() => 34)(() => 42), 34);
    assert.equals( maybeElement(undefined)(() => 10)(() => 42), 10);
    assert.equals( maybeElement(true)(() => 10)(() => 42), 42);
    assert.equals( maybeElement(0)(() => 10)(() => 42), 10);
    assert.equals( maybeElement(1)(() => 10)(() => 42), 42);
});

maybeSuite.add("maybeDiv", assert => {
    assert.equals( maybeDivision(10)(2)(val => val + 10)(val => val + 3), 8);
    assert.equals( maybeDivision(10)(0)(_ => "Nothing")(_ => "Just"), "Nothing");
    assert.equals( maybeDivision(10)(3)(_ => "Nothing")(_ => "Just"), "Just");
    assert.equals( maybeDivision("Hello")("World")(_ => "Nothing")(_ => "Just"), "Nothing");
});

maybeSuite.add("eitherJsNumOrOther", assert => {
    assert.equals( eitherNumber(10)(_ => "Nothing")(x => x + 5), 15);
    assert.equals( eitherNumber("Not a Number")(_ => "Nothing")(_ => "Just"), "Nothing");
});

maybeSuite.add("maybeDomElement", assert => {
    setup()
    assert.equals( eitherDomElement("test")(_ => "Nothing")(_ => "Just"), "Just");
    assert.equals( eitherDomElement("Not a Number")(_ => "Nothing")(_ => "Just"), "Nothing");
    tearDown()
});

maybeSuite.add("getDomElementAbstraction", assert => {
    setup();
    assert.equals(eitherDomElementOrConsoleError('test')(id), dummyDomElem);

    const elementNotExistName = "elementNotExist"
    const methodUnderTest = () => eitherDomElementOrConsoleError(elementNotExistName)(id)
    assert.consoleErrorEquals(methodUnderTest, `Error: no element exist with id: ${elementNotExistName}`)

    tearDown()
});

maybeSuite.add("getDomElement", assert => {
    setup()
    assert.equals(getDomElement("test"), dummyDomElem);

    const elementNotExistName = "elementNotExist"
    const methodUnderTest = () => getDomElement(elementNotExistName)
    assert.consoleErrorEquals(methodUnderTest, `Error: no element exist with id: ${elementNotExistName}`)

    tearDown()
});

maybeSuite.add("getDomElements", assert => {
    setup()
    assert.arrayEquals( getDomElements("test", "test"), [dummyDomElem, dummyDomElem]);

    const elementNotExistName = "elementNotExist"
    const methodUnderTest = () => getDomElements(elementNotExistName, "test")
    assert.consoleErrorEquals(methodUnderTest, `Error: no element exist with id: ${elementNotExistName}`)
    tearDown();
});

maybeSuite.add("getOrDefault", assert => {
    setup()
    assert.equals( getOrDefault(eitherNumber(5))(0), 5);
    assert.equals( getOrDefault(eitherNumber("NaN"))(42), 42);
    assert.equals( getOrDefault(eitherNumber("5"))(42), 42);
    assert.equals( getOrDefault(eitherNumber((() => 5)()))(42), 5);
    tearDown();
});

// maybeSuite.add("getJsNumberOrFunction", assert => {
//     assert.equals( getJsNumberOrFunction(3), 3);
//     assert.equals( getJsNumberOrFunction(42), 42);
//
//     assert.churchNumberEquals( getJsNumberOrFunction(n3) , n3);
//     assert.churchNumberEquals( getJsNumberOrFunction( churchMultiplication(n3)(n2) ), n6);
//
//     assert.equals( getJsNumberOrFunction(id) , id);
//     assert.equals( getJsNumberOrFunction(pair) , pair);
//     assert.equals( getJsNumberOrFunction(True) , True);
//     assert.equals( getJsNumberOrFunction(False) , False);
//
//
//     assert.equals( getJsNumberOrFunction("3") , Nothing);
//     assert.equals( getJsNumberOrFunction(null) , Nothing);
//     assert.equals( getJsNumberOrFunction({}) , Nothing);
//     assert.equals( getJsNumberOrFunction([]) , Nothing);
//
//     const test = index => maybeNumber(index)
//                             ( Left( maybeFunction(index)( v => console.error("Wrong Type " + v)  )( v => console.log("function " + v)) ))
//                             ( () => console.log("number") )
//
//     assert.equals( test(3), 3);
//     assert.equals( test(id), id);
//     assert.equals( test("id"), Nothing);
// });


maybeSuite.add("eitherElementsOrErrors - good case", assert => {
    setup();

    const result = eitherElementsOrErrorsByFunction(eitherDomElement)("test", "test2")
                            (id)
                            (id);

    assert.equals( jsNum(size(result)), 2);

    assert.pairEquals( getElementByIndex(result)(0), pair(id)(id));
    assert.pairEquals( getElementByIndex(result)(1), pair("test")(dummyDomElem));
    assert.pairEquals( getElementByIndex(result)(2), pair("test2")(dummyDomElem2));

    assert.equals( getElementByKey(result)("test"), dummyDomElem);
    assert.equals( getElementByKey(result)("test2"), dummyDomElem2);

    tearDown();
});

maybeSuite.add("eitherElementsOrErrors - bad case", assert => {
    setup();

    const result = eitherElementsOrErrorsByFunction(eitherDomElement)("random1", "random2")
                            (id)
                            (id);

    assert.equals( jsNum(size(result)), 2);

    assert.equals( getElementByIndex(result)(0), id);
    assert.equals( getElementByIndex(result)(1),"no element exist with id: random1");
    assert.equals( getElementByIndex(result)(2), "Error: no element exist with id: random2");

    tearDown();
});


maybeSuite.add("maybeElements", assert => {
    setup();

    const result = maybeElementsByFunction(maybeDomElement)("test", "test2")
                    (id)
                    (id);

    assert.equals( jsNum(size(result)), 2);

    assert.pairEquals( getElementByIndex(result)(0), pair(id)(id));
    assert.pairEquals( getElementByIndex(result)(1), pair("test")(dummyDomElem));
    assert.pairEquals( getElementByIndex(result)(2), pair("test2")(dummyDomElem2));

    assert.equals( getElementByKey(result)("test"), dummyDomElem);
    assert.equals( getElementByKey(result)("test2"), dummyDomElem2);

    const failedResult = maybeElementsByFunction( maybeDomElement )("random1", "random2")
                                (_ => "failed")
                                (_ => "success");

    assert.equals(failedResult, "failed");

    tearDown();
});

maybeSuite.report();
