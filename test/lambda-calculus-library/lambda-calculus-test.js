import { test } from "../test.js";

import * as lambdaCalculus from '../../src/lambda-calculus-library/lambda-calculus.js'
import {id, fst, snd} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {n1} from "../../src/lambda-calculus-library/church-numerals.js";


test("identity", assert => {

    assert.equals(id(1), 10 );
    assert.equals(id(n1), n1 );
    assert.equals(false, true );
    assert.equals(false, true );

});

test("konst", assert => {

    assert.equals(false, true );
    assert.equals(true, true );
    assert.equals(false, true );
    assert.equals(true, true );

});

