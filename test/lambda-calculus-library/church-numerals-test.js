import {TestSuite} from "../test.js";

import { id, True, False, fst, snd, pair } from "../../src/lambda-calculus-library/lambda-calculus.js";
import { n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, succ, pred, phi, is0, jsnum,
    churchAddition, churchSubtraction, churchMultiplication, churchPotency } from "../../src/lambda-calculus-library/church-numerals.js";

const churchTest = TestSuite("Church Numerals");

churchTest.add("numbers", assert => {
    assert.equals(n2(x => x * 2)(1), 4);
    assert.equals(n3(x => x + '!')('Hello World'), 'Hello World!!!');
    // TODO: mehr solche Tests
});

churchTest.add("succ", assert => {
    assert.churchEquals(succ(n0), n1);
    assert.churchEquals(succ(n5), n6);
    assert.equals(jsnum(succ(n9)), 10);
});

churchTest.add("pre", assert => {
    assert.churchEquals( pred(n1), n0 );
    assert.churchEquals( pred(n5), n4 );
    assert.equals( pred(n0), n0);
});

churchTest.add("phi", assert => {
    const testPair      = pair(n1)(n2);
    const testPhiPair   = phi(testPair);

    assert.churchEquals( testPhiPair(fst), n2 );
    assert.churchEquals( testPhiPair(snd), n3 );

    assert.churchEquals( n1(phi) (pair(n0)(n0)) (fst), n0 );
    assert.churchEquals( n1(phi) (pair(n0)(n0)) (snd), n1 );

    assert.churchEquals( n0(phi) (testPair) (fst), n1 );
    assert.churchEquals( n0(phi) (testPair) (snd), n2 );

    assert.churchEquals( n1(phi) (testPair) (fst), n2 );
    assert.churchEquals( n1(phi) (testPair) (snd), n3 );

    assert.churchEquals( n6(phi) (testPair) (fst), n7 );
    assert.churchEquals( n6(phi) (testPair) (snd), n8 );


    const testPair2     = pair(n7)(n3);
    const testPhiPair2  = phi(testPair2);

    assert.churchEquals( testPhiPair2(fst), n3 );
    assert.churchEquals( testPhiPair2(snd), n4 );

    assert.churchEquals( n0(phi) (testPair2) (fst), n7 );
    assert.churchEquals( n0(phi) (testPair2) (snd), n3 );

    assert.churchEquals( n1(phi) (testPair2) (fst), n3 );
    assert.churchEquals( n1(phi) (testPair2) (snd), n4 );

    assert.churchEquals( n6(phi) (testPair2) (fst), n8 );
    assert.churchEquals( n6(phi) (testPair2) (snd), n9 );

    const testPair3     = pair(n9)(n9);
    const testPhiPair3  = phi(testPair3);

    assert.churchEquals( testPhiPair3(fst), n9 );
    assert.equals( jsnum(testPhiPair3(snd)), 10 );
});

churchTest.add("pred", assert => {
    assert.churchEquals( pred(n0), n0 );
    assert.churchEquals( pred(n1), n0 );
    assert.churchEquals( pred(n2), n1 );
    assert.churchEquals( pred(n9), n8 );
});

churchTest.add("isZero", assert => {
    assert.equals( is0(n0), True );
    assert.equals( is0(n1), False );
    assert.equals( is0(n2), False );
    assert.equals( is0(n9), False );
});

churchTest.add("jsNum", assert => {
    assert.equals(jsnum(n0), 0);
    assert.equals(jsnum(n1), 1);
    assert.equals(jsnum(n2), 2);
    assert.equals(jsnum(n3), 3);
    assert.equals(jsnum(n4), 4);
    assert.equals(jsnum(n5), 5);
    assert.equals(jsnum(n6), 6);
    assert.equals(jsnum(n7), 7);
    assert.equals(jsnum(n8), 8);
    assert.equals(jsnum(n9), 9);

    assert.equals(jsnum(churchAddition(n9)(n9)), 18);
    assert.equals(jsnum(churchAddition(n6)(n8)), 14);
    assert.equals(jsnum(churchMultiplication(n9)(n9)), 81);
    assert.equals(jsnum(churchPotency(n2)(n5)), 32);
    assert.equals(jsnum(churchSubtraction(n9)(n4)), 5);
});

churchTest.add("church less or equal", assert => {
    // TODO:
});

churchTest.add("church equal", assert => {
    // TODO:
});

churchTest.add("church greater than", assert => {
    // TODO:
});

churchTest.report();

