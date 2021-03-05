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
    maybeDiv,
    eitherDomElement,
    getOrDefault,
    getDomElement,
    getDomElements,
    getDomElementAbstraction,
    maybeElement,
    eitherJsNumOrOther
} from "../../src/maybe/maybe.js";
import {getElementByIndex, size, logStackToConsole} from "../../src/stack/stack.js";
import {getElementByKey} from "../../src/listMap/listMap.js"

const maybeSuite = TestSuite("Maybe");

const dummyDomElem = document.createElement('div');

const setup = () => {
    dummyDomElem.setAttribute('id', 'test');
    document.body.appendChild(dummyDomElem);
}

const tearDown = () => {
    const dummyDomElem = document.getElementById('test')
    dummyDomElem.remove();
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
    assert.equals( maybeElement(0)(() => 10)(() => 42), 42);
    assert.equals( maybeElement(1)(() => 10)(() => 42), 42);
});

maybeSuite.add("maybeDiv", assert => {
    assert.equals( maybeDiv(10)(2)(val => val + 10)(val => val + 3), 8);
    assert.equals( maybeDiv(10)(0)(_ => "Nothing")(_ => "Just"), "Nothing");
    assert.equals( maybeDiv(10)(3)(_ => "Nothing")(_ => "Just"), "Just");
    assert.equals( maybeDiv("Hello")("World")(_ => "Nothing")(_ => "Just"), "Nothing");
});

maybeSuite.add("eitherJsNumOrOther", assert => {
    assert.equals( eitherJsNumOrOther(10)(_ => "Nothing")(x => x + 5), 15);
    assert.equals( eitherJsNumOrOther("Not a Number")(_ => "Nothing")(_ => "Just"), "Nothing");
});

maybeSuite.add("maybeDomElement", assert => {
    setup()
    assert.equals( eitherDomElement("test")(_ => "Nothing")(_ => "Just"), "Just");
    assert.equals( eitherDomElement("Not a Number")(_ => "Nothing")(_ => "Just"), "Nothing");
    tearDown()
});

maybeSuite.add("getDomElementAbstraction", assert => {
    setup();
    assert.equals(getDomElementAbstraction('test')(id), dummyDomElem);

    const elementNotExistName = "elementNotExist"
    const methodUnderTest = () => getDomElementAbstraction(elementNotExistName)(id)
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
    assert.equals( getOrDefault(eitherJsNumOrOther(5))(0), 5);
    assert.equals( getOrDefault(eitherJsNumOrOther("NaN"))(42), 42);
    assert.equals( getOrDefault(eitherJsNumOrOther("5"))(42), 42);
    assert.equals( getOrDefault(eitherJsNumOrOther((() => 5)()))(42), 5);
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

const t2 = str => {
    const elem = document.getElementById(str);
    return elem ? Right(elem) : Left(`element with id: '${str}' does not exist`);
}

// maybeSuite.add("eitherElementsOrErrors", assert => {
//     setup();
//
//     // const result = eitherElementsOrErrors(str => t2(str))("test", "test")
//     // (stackOfErrors => logStackToConsole(stackOfErrors))
//     // (listMapWithElements => { // TODO: array destructuring
//     //     // const [a,b,c] = convertStackToArray(stackOfElements); TODO: work this
//     //     // logListMapToConsole(stack)
//     //     // stack => console.log(stack)
//     //     const inputText = getElementByKey(listMapWithElements)("inputText");
//     //     const newValue = getElementByKey(listMapWithElements)("newValue");
//     //
//     //     console.log(inputText);
//     //     console.log(newValue);
//     //
//     //     // startProgram(inputText, newValue);
//     // });
//     //
//     // assert.equals( jsNum(size(result)), 2);
//
//     // assert.equals(getElementByIndex(zippedStack)(0), id);
//     // assert.equals(getElementByIndex(zippedStack)(1), 5);
//     // assert.equals(getElementByIndex(zippedStack)(2), 7);
//     // assert.equals(getElementByIndex(zippedStack)(3), 9);
//
//     tearDown();
// });

maybeSuite.report();
