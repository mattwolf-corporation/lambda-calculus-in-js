import {TestSuite} from "../test.js";
import {
    Box, fold, mapf, chain, debug, mapMaybe,
    flatMapMaybe, mapfMaybe, foldMaybe,
    chainMaybe, tryCatch, getContent, ap,
    liftA2, apMaybe, liftA2Maybe
} from "../../src/box/box.js";
import {maybeDiv, maybeElement, Left, Right, Just, Nothing} from "../../src/maybe/maybe.js";
import {id} from "../../src/lambda-calculus-library/lambda-calculus.js";


const boxSuite = TestSuite("Box");

// method to simulate an api call
const readPersonFromApi = () => JSON.stringify({name: "John", age: 30, city: "New York"});

// test method to simulate an api error
const readPersonFromApiWithError = () => {
    throw "read person from api failed";
};

// returns either a parsed object or Nothing
const parseJson = object =>  object !== null ? tryCatch(() => JSON.parse(object)) : Nothing;
const parseJsonWithError = _ =>  tryCatch(() => JSON.parse('{"first": "Jane", last: "Doe"}'))

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
    const result1 =  Box(10)
                                (mapf)(debug)
                                (mapf)(n => n + 2)
                                (mapf)(debug);

    const result2 = () => Box(10)
                            (mapf)(debug)
                            (mapf)(n => n + 2)
                            (fold)(debug);

    const lazyResult = () => Box(10)
                                    (mapf)(debug)
                                    (mapf)(n => n + 2)
                                    (mapf)(debug);

    assert.equals(getContent(result1), 12);
    assert.consoleLogEquals(result2, "10", "12");
    assert.consoleLogEquals(lazyResult, "10");
});

boxSuite.add("mapMaybe", assert => {
    const maybeResult1 = maybeDiv(10)(2);
    const maybeResult2 = maybeDiv(10)(0);

    const maybeResult3 = () => Just(10);
    const maybeResult4 = () => Nothing;

    const resultSuccess = mapMaybe(maybeResult1)(x => x * 10)
    (() => 'error: division by zero')
    (id);

    const resultFailure = mapMaybe(maybeResult2)(x => x * 10)
    (() => 'error: division by zero')
    (id);

    const resultSuccess2 = mapMaybe(maybeResult3())(x => x * 4)(() => "failed")(id)
    const resultFailure2 = mapMaybe(maybeResult4())(x => x * 4)

    assert.equals(resultSuccess, 50);
    assert.equals(resultFailure, "error: division by zero");
    assert.equals(resultSuccess2, 40);
    assert.equals(resultFailure2, Nothing);
    assert.equals(resultFailure2(() => "failed")(id), "failed");
});

boxSuite.add("flatMapMaybe", assert => {
    const maybeFunc1 = () => Just(10);
    const maybeFunc2 = () => Nothing;

    const result1 = flatMapMaybe(maybeFunc1())(num => Just(num * 2));
    const result2 = flatMapMaybe(maybeFunc2())(num => Just(num * 2));
    const result3 = flatMapMaybe(Just("Hello"))(str => Just(str.toUpperCase()));
    const result4 = flatMapMaybe(Nothing)(str => Just(str.toUpperCase()));

    assert.equals(result1(() => "error")(id), 20);
    assert.equals(result2(() => "Nothing")(id), "Nothing");
    assert.equals(result2, Nothing);
    assert.equals(result3(() => "error")(id), "HELLO");
    assert.equals(result4, Nothing);
    assert.equals(result4(() => "error")(id), "error");
});

boxSuite.add("mapfMaybe", assert => {
    const p = () => Just({firstName: "lukas", lastName: "Mueller"});

    const box1 = Box(p());
    const box2 = Box(Nothing);

    const mapped1 = box1(mapfMaybe)(p => p.firstName);
    const mapped2 = mapped1(mapfMaybe)(firstName => firstName.toUpperCase());
    const mapped3 = mapped2(mapfMaybe)(firstNameUpperCase => firstNameUpperCase.slice(1));
    const mapped4 = box2(mapfMaybe)((p => p.firstName));

    assert.equals(getContent(mapped1)(() => "failed")(id), "lukas");
    assert.equals(getContent(mapped2)(() => "failed")(id), "LUKAS");
    assert.equals(getContent(mapped3)(() => "failed")(id), "UKAS");
    assert.equals(getContent(mapped3)(() => "failed")(id), "UKAS");
    assert.equals(getContent(mapped4)(() => "failed")(id), "failed");
    assert.equals(getContent(mapped4), Nothing);
});

boxSuite.add("getContent maybeBox", assert => {
    const p = {firstName: "lukas", lastName: "Mueller"};
    const getPerson = () => Just(p);

    const box1 = Box(getPerson());
    const box2 = Box(Nothing);

    const result1 = getContent(box1)
                            (() => "no person")
                            (id);

    const result2 = getContent(box2);
    const result3 = getContent(box2)
                                (() => "no person")
                                (id);

    assert.equals(result1, p);
    assert.equals(result2, Nothing);
    assert.equals(result3, "no person");
});

boxSuite.add("chainMaybe", assert => {
    const p = () => Just({firstName: "lukas", lastName: "Mueller"});

    const box1 = Box(p());
    const box2 = Box(Just(12));

    const mapped1 = box1(chainMaybe)(p => Just(p.firstName));
    const mapped2 = mapped1(chainMaybe)(firstName => Just(firstName.toUpperCase()));

    const mapped3 = box2(chainMaybe)((_ => Nothing));

    assert.equals(getContent(mapped1)(() => "failed")(id), "lukas");
    assert.equals(getContent(mapped2)(() => "failed")(id), "LUKAS");

    assert.equals(getContent(mapped3)(() => "failed")(id), "failed");
    assert.equals(getContent(mapped3), Nothing);
});

boxSuite.add("maybeBox example", assert => {
    const maybeBox = num => div =>
        Box(maybeDiv(num)(div))
            (mapfMaybe)(x => x * 10)
            (mapfMaybe)(x => x * 2)
            (foldMaybe)(x => x + 2)
                (() => 'error: division by zero')
                (id);

    const resultSuccess = maybeBox(10)(2);
    const resultFailure = maybeBox(10)(0);

    assert.equals(resultSuccess, 102);
    assert.equals(resultFailure, 'error: division by zero');
});

boxSuite.add("findColor maybeBox example", assert => {
    const findColor = name =>
        maybeElement({red: '#ff4444', blue: '#3b5998', yellow: '#fff68f'}[name]);

    const findCol = c =>
        Box(findColor(c))
        (mapfMaybe)(c => c.slice(1))
        (foldMaybe)(c => c.toUpperCase())
            (() => 'no color')
            (id);

    assert.equals(findCol('green'), 'no color');
    assert.equals(findCol('red'), 'FF4444');
    assert.equals(findCol('blue'), '3B5998');
    assert.equals(findCol('yellow'), 'FFF68F');
});

boxSuite.add("readPersonFromApi maybeBox example", assert => {
    const getPerson1 = lastName =>
        Box(tryCatch(readPersonFromApiWithError))
        (chainMaybe)(parseJson)
        (mapfMaybe)(name => name.toUpperCase())
        (mapfMaybe)(name => name + " " + lastName)
        (foldMaybe)(name => "Mr. " + name)
                (id)
                (id);

    const getPerson2 = lastName =>
        Box(tryCatch(readPersonFromApi))
            (chainMaybe)(parseJson)
            (mapfMaybe)(p => p.name.toUpperCase())
            (mapfMaybe)(name => name + " " + lastName)
            (foldMaybe)(name => "Mr. " + name)
                    (id)
                    (id);

    const getPerson3 = lastName =>
        Box(tryCatch(readPersonFromApi))
        (chainMaybe)(parseJsonWithError)                 // if this fail skip the rest (give null val to see failure)
            (mapfMaybe)(name => name + " " + lastName)
            (foldMaybe)(name => "Mr. " + name)
            (id)
            (id);

    const result1 = getPerson1("king");
    const result2 = getPerson2("king");
    const result3 = getPerson3("king");

    assert.equals(result1, "read person from api failed");
    assert.equals(result2, "Mr. JOHN king");
    assert.equals(result3.name, "SyntaxError");

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
            (foldMaybe)(name => "Mr. " + name)
            (id)
            (id);

    const result1 = getPerson("king");

    assert.equals(result1, "api error");
});

boxSuite.add("try catch", assert => {
    const result1 = tryCatch(() => {throw "random error"})
    const result2 = tryCatch(() => 10)
    const result3 = tryCatch(() => "Hello")
    const result4 = tryCatch(() => {throw new TypeError("failed")})


    assert.equals(result1(id)(id), "random error");
    assert.equals(result2(id)(id), 10);
    assert.equals(result3(id)(id), "Hello");
    assert.equals(result1(() => "error")(id), "error");
    assert.equals(result2(() => "error")(() => "success"), "success");
    assert.equals(result3(id)(() => 42), 42);
    assert.equals(result4(e => e.message)(id), "failed");
    assert.equals(result4(e => e.name)(id), "TypeError");
});

boxSuite.add("box.ap", assert => {
    const boxWithFunction1 = Box(x => x + 5);
    const boxWithValue1 = Box(10);

    const result1 = boxWithFunction1(ap)(boxWithValue1);

    assert.equals(getContent(result1), 15);

    const add = x => y => x + y;
    const boxWithFunction2 = Box(add);
    const boxWithValue2 = Box(10);
    const boxWithValue3 = Box(14);

    const result2 = boxWithFunction2
                        (ap)(boxWithValue2)
                        (ap)(boxWithValue3);

    assert.equals(getContent(result2), 24);
});

boxSuite.add("liftA2", assert => {
    const add = x => y => x + y;
    const boxWithValue1 = Box(10);
    const boxWithValue2 = Box(5);

    const result = liftA2(add)(boxWithValue1)(boxWithValue2);

    assert.equals(getContent(result), 15);
});

boxSuite.add("maybe.ap", assert => {
    const maybeWithFunction1 = Box(Just(x => x + 5));
    const maybeWithValue1 = Just(10);

    const result1 = maybeWithFunction1(apMaybe)(maybeWithValue1);
    const content = getContent(result1);
    const res = content
                    (_ => console.error('sdv'))
                    (id)

    assert.equals(res, 15);

    const add = x => y => x + y;
    const maybeWithFunction2 = Box(Just(add));
    const maybeWithValue2 = Just(10);
    const maybeWithValue3 = Just(14);

    const result2 = maybeWithFunction2
                            (apMaybe)(maybeWithValue2)
                            (apMaybe)(maybeWithValue3);

    const content2 = getContent(result2);
    const res2 = content2
                        (_ => console.error('sdv'))
                        (id)

    assert.equals(res2, 24);
});

boxSuite.add("liftA2 maybe", assert => {
    const add = x => y => x + y;
    const boxWithValue1 = Just(10);
    const boxWithValue2 = Just(5);

    const result = liftA2Maybe(add)(boxWithValue1)(boxWithValue2);
    const content = getContent(result)
    const res = content
                    (_ => console.error('error'))
                    (id)

    assert.equals(res, 15);
});

boxSuite.report();
