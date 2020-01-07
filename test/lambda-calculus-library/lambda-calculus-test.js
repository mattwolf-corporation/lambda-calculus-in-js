import { TestSuite } from "../test.js";

import {id, K, KI, M, C, B, T, fst, snd, firstOfTriple, secondOfTriple, thirdOfTriple} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {n1, n2, n3, n4, n5, n6, n7, n8, n9, jsnum} from "../../src/lambda-calculus-library/church-numerals.js";

const lambdaCTest = TestSuite("Lambda Calculus");

lambdaCTest.add("identity", assert => {
    assert.equals(id(1), 1 );
    assert.equals(id(n1), n1 );
    assert.equals(id(true), true );
    assert.equals(id(id), id );
    assert.equals(id === id, true);
});

lambdaCTest.add("kestrel", assert => {
    assert.equals(K(1)(2), 1);
    assert.equals(K(n1)(n2), n1);
    assert.equals(K(id)(KI), id);
    assert.equals(K(K)(id), K);
    assert.equals(K(K)(id) (1)(2), 1);
});

lambdaCTest.add("kite", assert => {
    assert.equals(KI(1)(2), 2);
    assert.equals(KI(n1)(n2), n2);
    assert.equals(KI(id)(KI), KI);
    assert.equals(KI(KI)(id), id);
    assert.equals(KI(id)(KI) (1)(2), 2);
});

lambdaCTest.add("mockingbird", assert => {
    assert.equals(M(id), id);
    assert.equals(M(id)(5), 5);
    assert.equals(M(K)(5), K);
    assert.equals(M(KI)(5), 5);
    assert.equals(M(id)(KI) (2)(7), 7);
});

lambdaCTest.add("cardinal", assert => {
    assert.equals(C(fst)(1)(2), 2);
    assert.equals(C(snd)(1)(2), 1);
    assert.equals((C(snd)(id)(7))(6), 6);
    assert.equals((C(snd)(id)(7))(id), id);
    assert.equals(C(fst)(id)(7), 7);
});

lambdaCTest.add("bluebird", assert => {
    const f = x => x + 1;
    const g = x => x * 2;

    assert.equals(B(f)(g)(4), 9);
    assert.equals(B(g)(f)(4), 10);
    assert.equals(B(id)(id)(5), 5);
    assert.equals(B(f)(id)(5), 6);
    assert.equals(B(id)(g)(5), 10);
});

lambdaCTest.add("thrush", assert => {
    const f = x => x + 1;

    assert.equals(T(2)(f), 3);
    assert.equals(T(2)(id), 2);
    assert.equals(T(id)(id), id);
    assert.equals(jsnum(T(n2)(n3)), 8);
    assert.equals(jsnum(T(n3)(n2)), 9);
});

lambdaCTest.add("firstOfTriple", assert => {
    const testArray = [1, 2];
    const testObject = {name: "test"};

    assert.equals(firstOfTriple(0)(1)(2), 0 );
    assert.equals(firstOfTriple(2)(1)(0), 2 );
    assert.equals(firstOfTriple(id)(1)(2), id );
    assert.equals(firstOfTriple(id(testObject))(1)(2), testObject );
    assert.equals(firstOfTriple(testArray)(1)(2), testArray );
});

lambdaCTest.add("secondOfTriple", assert => {
    const testArray = [1, 2];
    const testObject = {name: "test"};

    assert.equals(secondOfTriple(0)(1)(2), 1 );
    assert.equals(secondOfTriple(2)(1)(0), 1 );
    assert.equals(secondOfTriple(5)(id)(4), id );
    assert.equals(secondOfTriple(2)(id(testArray))(1), testArray );
    assert.equals(secondOfTriple(2)(testObject)(1), testObject );
});

lambdaCTest.add("thirdOfTriple", assert => {
    const testArray = [1, 2];
    const testObject = {name: "test"};

    assert.equals(thirdOfTriple(0)(1)(2), 2 );
    assert.equals(thirdOfTriple(2)(1)(0), 0 );
    assert.equals(thirdOfTriple(5)(4)(id), id );
    assert.equals(thirdOfTriple(2)(1)(id(testObject)), testObject );
    assert.equals(thirdOfTriple(2)({name: "test"})(testArray), testArray );
});

lambdaCTest.report();
