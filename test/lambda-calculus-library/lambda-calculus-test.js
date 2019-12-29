import { TestSuite } from "../test.js";

import {id, fst, snd} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {n1} from "../../src/lambda-calculus-library/church-numerals.js";

const lambdaCTest = TestSuite("Lambda Calculus");
lambdaCTest.add("identity", assert => {

    assert.equals(id(1), 1 );
    assert.equals(id(n1), n1 );
    assert.equals(true, true );
    assert.equals(true, true );

});

lambdaCTest.add("konst", assert => {

    assert.equals(true, true );
    assert.equals(true, true );
    assert.equals(true, true );
    assert.equals(true, true );

});
lambdaCTest.report();
