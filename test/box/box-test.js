import {TestSuite} from "../test.js";
import {
    Box, fold, mapf, debug, mapMaybe,
    flatMapMaybe, mapfMaybe, foldMaybe,
    chainMaybe, tryCatch
} from "../../src/box/box.js";
import {maybeDiv, maybeElement} from "../../src/maybe/maybe.js";
import {id} from "../../src/lambda-calculus-library/lambda-calculus.js";


const boxSuite = TestSuite("Box");

boxSuite.add("box", assert => {
    const nextCharForNumberString = str =>
        Box(str)
        (mapf)(s => s.trim())
        (mapf)(r => parseInt(r))
        (mapf)(i => i + 1)
        (mapf)(i => String.fromCharCode(i))
        (fold)(c => c.toLowerCase())

    const result1 = nextCharForNumberString(' 64 ');
    const result2 = nextCharForNumberString(' 65 ');

    assert.equals(result1, "a")
    assert.equals(result2, "b")
});

boxSuite.add("maybeBox", assert => {
    const maybeBox = num => div =>
        Box(maybeDiv(num)(div))
        (mapfMaybe)(x => x * 10)
        (mapfMaybe)(x => x * 2)
        (foldMaybe)
        (() => 'error: division by zero')
        (id);

    const resultSuccess = maybeBox(10)(2);
    const resultFailure = maybeBox(10)(0);

    assert.equals(resultSuccess, 100);
    assert.equals(resultFailure, 'error: division by zero');
});

boxSuite.add("mapMaybe", assert => {
    const maybeResult1 = maybeDiv(10)(2);

    const resultSuccess = mapMaybe(maybeResult1)(x => x * 10)
                                    (() => 'error: division by zero')
                                    (id);

    const maybeResult2 = maybeDiv(10)(0);
    const resultFailure = mapMaybe(maybeResult2)(x => x * 10)
                                    (() => 'error: division by zero')
                                    (id);

    assert.equals(resultSuccess, 50);
    assert.equals(resultFailure, 'error: division by zero');
});

boxSuite.add("findColor", assert => {
    const findColor = name =>
        maybeElement({red: '#ff4444', blue: '#3b5998', yellow: '#fff68f'}[name]);

    const findCol = c =>
        Box(findColor(c))
        (mapfMaybe)(c => c.slice(1))
        (mapfMaybe)(c => c.toUpperCase())
        (foldMaybe)
            (() => 'no color')
            (id);

    assert.equals(findCol('green'), 'no color');
    assert.equals(findCol('red'), 'FF4444');
    assert.equals(findCol('blue'), '3B5998');
    assert.equals(findCol('yellow'), 'FFF68F');
});

boxSuite.add("readPersonFromApi", assert => {
    // method to simulate an api call
    const readPersonFromApi = () => JSON.stringify({name: "John", age: 30, city: "New York"});

    // test method to simulate an api error
    const readPersonFromApiWithError = () => {
        throw "api call failed";
    };

    // returns either a parsed object or Nothing
    const parseJson = object =>  object !== null ? tryCatch(() => JSON.parse(object)) : Nothing;


    const getPersonWithError = lastName =>
        Box(tryCatch(readPersonFromApiWithError))
        (chainMaybe)(parseJson)                     // if this fail skip the rest (give null val to see failure)
        (mapfMaybe)(name => name.toUpperCase())
        (mapfMaybe)(name => name + " " + lastName)
        (foldMaybe)
                (() => 'get person failed')
                (id);

    const getPerson = lastName =>
        Box(tryCatch(readPersonFromApi))
            (chainMaybe)(parseJson)                     // if this fail skip the rest (give null val to see failure)
            (mapfMaybe)(p => p.name.toUpperCase())
            (mapfMaybe)(name => name + " " + lastName)
            (foldMaybe)
            (() => 'get person failed')
            (id);

    const result2 = getPersonWithError("king");
    const result1 = getPerson("king");

    assert.equals(result1, "JOHN king");
    assert.equals(result2, "get person failed");

});


boxSuite.report();
