import { TestSuite } from "../test.js";

import * as lambdaCalculus from '../../src/lambda-calculus-library/lambda-calculus.js'
import {id, fst, snd} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {n1} from "../../src/lambda-calculus-library/church-numerals.js";

const churchTest = TestSuite("Church Numerals");
churchTest.add("numbers", assert => {

    assert.equals(id(1), 1 );
    assert.equals(id(n1), n1 );
    assert.equals(true, false );
    assert.equals(true, true );

});

churchTest.add("pre", assert => {

    assert.equals(false, true );
    assert.equals(true, true );
    assert.equals(false, true );
    assert.equals(true, true );

});
churchTest.report();
