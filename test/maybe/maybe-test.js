import {TestSuite} from "../test.js";

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
    not
} from "../../src/lambda-calculus-library/lambda-calculus.js";
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
    is0,
    churchAddition
} from '../../src/lambda-calculus-library/church-numerals.js';
import {
    hasPre, push, pop, head, size, startStack, stack,
    pushToStack, convertArrayToStack, getElementByIndex
} from "../../src/stack/stack.js";

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

maybeSuite.add("nullSafe", assert => {
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

maybeSuite.add("getSafeElementAbstraction", assert => {
    const dummyDomElem = document.createElement('div');
    dummyDomElem.setAttribute('id', 'test');
    document.body.appendChild(dummyDomElem);

    const stdErrorlog = console.error.bind(console);

    const result = [];
    console.error = val =>
        result.push(val);

    assert.equals(getSafeElementAbstraction('test')(id), dummyDomElem);
    getSafeElementAbstraction('does not exist')(id);
    assert.equals(result.length, 1);

    console.error = stdErrorlog;
    console.error("test clean up: can be ignored");
    assert.equals(result.length, 1)

});


maybeSuite.report();