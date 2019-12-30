import { TestSuite } from "../test.js";

import { calc, result, add, multi, sub, pow, div, churchAdd, churchMulti, churchSub, churchPow} from "../../src/calculator/calculator.js";
import {n0, n1, n2, n3, n4, n5, n6, n7, n8, n9} from "../../src/lambda-calculus-library/church-numerals.js";
import {jsnum} from "../../src/lambda-calculus-library/church-numerals.js";


const calculatorTest = TestSuite("Calculator");
calculatorTest.add("Calculation with JS-Nums", assert => {

    assert.equals(  calc(1)(result), 1 );
    assert.equals(  calc(99)(result), 99 );

    assert.equals(  calc(0)(add)(1)(result), 1);
    assert.equals(  calc(1)(add)(1)(result), 2);
    assert.equals(  calc(5)(add)(2)(add)(8)(result), 15 );

    assert.equals(  calc(1)(sub)(1)(result), 0);
    assert.equals(  calc(1)(sub)(0)(result), 1);
    assert.equals(  calc(10)(sub)(25)(result), -15);
    assert.equals(  calc(20)(sub)(2)(sub)(5)(result), 13);

    assert.equals(  calc(0)(multi)(10)(result), 0);
    assert.equals(  calc(1)(multi)(1)(result), 1);
    assert.equals(  calc(5)(multi)(2)(multi)(5)(result), 50);

    assert.equals(  calc(0)(pow)(10)(result), 0);
    assert.equals(  calc(1)(pow)(1)(result), 1);
    assert.equals(  calc(87)(pow)(0)(result), 1);
    assert.equals(  calc(2)(pow)(1)(result), 2);
    assert.equals(  calc(2)(pow)(2)(result), 4);
    assert.equals(  calc(2)(pow)(5)(result), 32);
    assert.equals(  calc(5)(pow)(2)(result), 25);
    assert.equals(  calc(3)(pow)(2)(pow)(1)(result), 9);

    assert.equals(  calc(0)(div)(10)(result), 0); // 0/10
    assert.equals(  calc(10)(div)(0)(result), Infinity); // 10/0 divide by zero
    assert.equals(  calc(30)(div)(2)(result), 15);
    assert.equals(  calc(30)(div)(2)(div)(5)(result), 3);

    assert.equals(  calc(5)(multi)(4)(sub)(4)(pow)(2)(div)(8)(add)(10)(result), 42 );

});

calculatorTest.add("Calculation with Church-Numerals", assert => {



    assert.equals(  calc(n1)(result), n1 );
    assert.equals(  calc(n9)(result), n9 );

    assert.equals(  calc(n0)(churchAdd)(n1)(result), n1);
    assert.churchNumberEquals( calc(n1)(churchAdd)(n1)(result) , n2);
    assert.churchNumberEquals(  calc(n2)(churchAdd)(n2)(churchAdd)(n4)(result), n8 );

    assert.churchNumberEquals(  calc(n1)(churchSub)(n1)(result), n0);
    assert.churchNumberEquals(  calc(n1)(churchSub)(n3)(result), n0); // church Numerals can't be negativ, so it will be Zero (n0)
    assert.churchNumberEquals(  calc(n7)(churchSub)(n5)(result), n2);
    assert.churchNumberEquals(  calc(n9)(churchSub)(n2)(churchSub)(n5)(result), n2);

    assert.churchNumberEquals(  calc(n0)(churchMulti)(n7)(result), n0);
    assert.churchNumberEquals(  calc(n1)(churchMulti)(n1)(result), n1);
    assert.churchNumberEquals(  calc(n2)(churchMulti)(n2)(churchMulti)(n2)(result), n8);

    assert.churchNumberEquals(  calc(n1)(churchPow)(n1)(result), n1);
    assert.churchNumberEquals(  calc(n6)(churchPow)(n0)(result), n1);
    assert.churchNumberEquals(  calc(n2)(churchPow)(n1)(result), n2);
    assert.churchNumberEquals(  calc(n2)(churchPow)(n2)(result), n4);
    assert.churchNumberEquals(  calc(n2)(churchPow)(n3)(result), n8);
    assert.churchNumberEquals(  calc(n3)(churchPow)(n2)(result), n9);
    assert.churchNumberEquals(  calc(n3)(churchPow)(n2)(churchPow)(n1)(result), n9);


    assert.equals( jsnum( calc(n2)(churchAdd)(n3)(churchMulti)(n2)(churchPow)(n2)(churchSub)(n1)(result)), 99 );

});
calculatorTest.report();
