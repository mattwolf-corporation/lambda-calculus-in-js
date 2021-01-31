import {TestSuite} from "../test.js";
import {Box, fold, mapf} from "../../src/box/box.js";


const boxSuite = TestSuite("Box");


boxSuite.add("box-tests", assert => {

    const nextCharForNumberString = str =>
        Box(str)
        (mapf)(s => s.trim())
        (mapf)(r => parseInt(r))
        (mapf)(i => i + 1)
        (mapf)(i => String.fromCharCode(i))
        (fold)(c => c.toLowerCase())

    const result = nextCharForNumberString(' 64 ');

    assert.equals(result, "a")
});


boxSuite.report();
