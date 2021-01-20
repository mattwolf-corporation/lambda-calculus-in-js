import {TestSuite} from "../test.js";

import {id} from "../../src/lambda-calculus-library/lambda-calculus.js";


import {
    Nothing,
    Just,
    maybe,
    maybeDiv,
    maybeDomElement,
    getOrDefault,
    getSafeElement,
    getSafeElements,
    getSafeElementAbstraction,
    maybeElement,
    maybeNumber
} from "../../src/maybe/maybe.js";

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
    assert.equals(Nothing()(() => 12)(() => 15), 12);
    assert.equals(Nothing()(() => 15)(() => 12), 15);
    assert.equals(Nothing()(() => id(122))(() => id(32)), 122);
    assert.equals(Nothing()(() => 12 + 12)(0), 24);
});

maybeSuite.add("Just", assert => {
    assert.equals(Just(10)((val => val + 10))(val => val + 20), 30);
    assert.equals(Just(10)((_ => true))(_ => false), false);
    assert.equals(Just(id)((f => f(false)))(f => f(true)), true);
});

maybeSuite.add("maybeElement", assert => {
    assert.equals(maybeElement(false)(() => 10)(() => 42), 10);
    assert.equals(maybeElement(null)(() => 34)(() => 42), 34);
    assert.equals(maybeElement(undefined)(() => 10)(() => 42), 10);
    assert.equals(maybeElement(true)(() => 10)(() => 42), 42);
    assert.equals(maybeElement(0)(() => 10)(() => 42), 10);
    assert.equals(maybeElement(1)(() => 10)(() => 42), 42);
});

maybeSuite.add("maybeDiv", assert => {
    assert.equals(maybeDiv(10)(2)(val => val + 10)(val => val + 3), 8);
    assert.equals(maybeDiv(10)(0)(_ => "Nothing")(_ => "Just"), "Nothing");
    assert.equals(maybeDiv(10)(3)(_ => "Nothing")(_ => "Just"), "Just");
    assert.equals(maybeDiv("Hello")("World")(_ => "Nothing")(_ => "Just"), "Nothing");
});

maybeSuite.add("maybeNumber", assert => {
    assert.equals(maybeNumber(10)(_ => "Nothing")(_ => "Just"), "Just");
    assert.equals(maybeNumber("Not a Number")(_ => "Nothing")(_ => "Just"), "Nothing");
});

maybeSuite.add("maybeDomElement", assert => {
    setup()
    assert.equals(maybeDomElement("test")(_ => "Nothing")(_ => "Just"), "Just");
    assert.equals(maybeDomElement("Not a Number")(_ => "Nothing")(_ => "Just"), "Nothing");
    tearDown()
});

maybeSuite.add("getSafeElementAbstraction", assert => {
    setup();
    assert.equals(getSafeElementAbstraction('test')(id), dummyDomElem);

    const elementNotExistName = "elementNotExist"
    const methodUnderTest = () => getSafeElementAbstraction(elementNotExistName)(id)
    assert.consoleError( methodUnderTest , `${elementNotExistName} doesnt exist` )

    tearDown()
});

maybeSuite.add("getSafeElement", assert => {
    setup()
    assert.equals(getSafeElement("test"), dummyDomElem);
    tearDown()
});

maybeSuite.add("getSafeElements", assert => {
    setup()
    assert.arrayEquals(getSafeElements("test", "test"), [dummyDomElem, dummyDomElem]);
    tearDown();
});

maybeSuite.report();