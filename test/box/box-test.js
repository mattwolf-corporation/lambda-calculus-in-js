import {TestSuite} from "../test.js";
import {
    Box, fold, mapf, chain, debug, mapMaybe,
    flatMapMaybe, mapfMaybe, foldMaybe,
    chainMaybe, tryCatch, getContent
} from "../../src/box/box.js";
import {maybeDiv, maybeElement, Left, Right, Just, Nothing} from "../../src/maybe/maybe.js";
import {id} from "../../src/lambda-calculus-library/lambda-calculus.js";


const boxSuite = TestSuite("Box");

boxSuite.add("box.of", assert => {
    const p = {firstName: "lukas", lastName: "Mueller"};

    const box1 = Box(10);
    const box2 = Box("Hello World");
    const box3 = Box(p);

    assert.equals(box1(id), 10);
    assert.equals(box2(id), "Hello World");
    assert.equals(box3(id), p);
});

boxSuite.add("box.map", assert => {
    const p = {firstName: "lukas", lastName: "Mueller"};

    const box1 = Box(p);

    const mapped1 = box1(mapf)(p => p.firstName);
    const mapped2 = mapped1(mapf)(firstName => firstName.toUpperCase());
    const mapped3 = mapped2(mapf)(firstNameUpperCase => firstNameUpperCase.slice(1));

    assert.equals(mapped1(id), "lukas");
    assert.equals(mapped2(id), "LUKAS");
    assert.equals(mapped3(id), "UKAS");
});

boxSuite.add("box.getContent", assert => {
    const p = {firstName: "lukas", lastName: "Mueller"};

    const box1 = Box(p);

    const mapped1 = box1(mapf)(p => p.firstName);
    const mapped2 = mapped1(mapf)(firstName => firstName.toUpperCase());
    const mapped3 = mapped2(mapf)(firstNameUpperCase => firstNameUpperCase.slice(1));

    assert.equals(getContent(mapped1), "lukas");
    assert.equals(getContent(mapped2), "LUKAS");
    assert.equals(getContent(mapped3), "UKAS");

    assert.equals(getContent(Box("random")), "random");
    assert.equals(getContent(Box(1234)), 1234);
});

boxSuite.add("box.fold", assert => {
    const p = {firstName: "lukas", lastName: "Mueller"};

    const box1 = Box(p);

    const mappedP = box1
                        (mapf)(p => p.firstName)
                        (mapf)(firstName => firstName.toUpperCase())

    const result1 = mappedP
                        (fold)(firstNameUpperCase => firstNameUpperCase.slice(1))

    const result2 = Box(10)
                            (fold)(num => num * 2);
    const result3 = Box(id)
                        (fold)(f => f("Magic"))

    assert.equals(result1, "UKAS");
    assert.equals(result2, 20);
    assert.equals(result3, "Magic");
});

boxSuite.add("box.chain", assert => {
    const box1 = Box(10)
                    (chain)(num => Box(num * 2))

    const box2 = Box(10)
                        (mapf)(num => num + 5)
                        (chain)(num => Box(num * 2))
                        (chain)(num => Box(num * 3))

    // nested box
    const box3 = Box(10)
                        (chain)(num => Box(num)
                                            (mapf)(num => num + 2)
                                            (mapf)(num => num + 3)
                        )
                        (mapf)(num => num - 15)

    assert.equals(getContent(box1), 20);
    assert.equals(getContent(box2), 90);
    assert.equals(getContent(box3), 0);
});

boxSuite.add("box example", assert => {
    const nextCharForNumberString = str =>
        Box(str)
        (chain)(s =>
            Box(s)
                (mapf)(s => s.trim())
            )
        (mapf)(r => parseInt(r))
        (mapf)(i => i + 1)
        (mapf)(i => String.fromCharCode(i))
        (fold)(c => c.toLowerCase());

    const result1 = nextCharForNumberString(' 64 ');
    const result2 = nextCharForNumberString(' 65 ');

    assert.equals(result1, "a")
    assert.equals(result2, "b")
});

boxSuite.add("box debug", assert => {
    const result2 =  () => Box(10)
                            (mapf)(debug)
                            (mapf)(n => n + 2)
                            (mapf)(debug);

    // TODO: works in other tests
    // TODO: does not work yet -> ???
    assert.consoleLogEquals(result2, ["10", "20"]);
});

boxSuite.add("maybeBox example", assert => {
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

boxSuite.add("readPersonFromApi with left & right", assert => {
    const readPersonFromApiWithError = () => {
          return Left('api error');
    };

    const parseJson = object =>  object !== null
        ? tryCatch(() => JSON.parse(object))
        : Left('parse json failed');

    const debug = x => {
        console.log(x);
        return x;
    }

    const getPerson = lastName =>
        Box(readPersonFromApiWithError())
        (mapfMaybe)(debug)
        (chainMaybe)(parseJson)
            (mapfMaybe)(debug)
            (mapfMaybe)(p => p.name.toUpperCase())
            (mapfMaybe)(name => name + " " + lastName)
            (foldMaybe)
            (id)
            (id);

    const result1 = getPerson("king");

    assert.equals(result1, "api error");
});

boxSuite.report();
