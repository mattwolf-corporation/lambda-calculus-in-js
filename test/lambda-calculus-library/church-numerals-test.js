import {TestSuite} from "../test.js";

import {id, fst, snd} from "../../src/lambda-calculus-library/lambda-calculus.js";
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
    succ,
    pred,
    phi,
    is0,
    jsnum
} from "../../src/lambda-calculus-library/church-numerals.js";

const churchTest = TestSuite("Church Numerals");

churchTest.add("numbers", assert => {

    assert.equals(jsnum(n0), 0);
    assert.equals(jsnum(n1), 1);
    assert.equals(jsnum(n2), 2);
    assert.equals(jsnum(n3), 3);
    assert.equals(jsnum(n4), 4);
    assert.equals(jsnum(n5), 5);


});

churchTest.add("succ", assert => {

    assert.churchNumberEquals(succ(n0), n1);
    assert.churchNumberEquals(succ(n5), n6);
    assert.equals(jsnum(succ(n9)), 10);
});

churchTest.add("pre", assert => {

    assert.churchNumberEquals(pred(n1), n0);
    assert.churchNumberEquals(pred(n5), n4);
    assert.equals(pred(n0), n0);
});

churchTest.report();

