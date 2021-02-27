import {TestSuite} from "../test.js";
import {
    Box, fold, mapf, chain, debug, mapMaybe,
    flatMapMaybe, mapfMaybe, foldMaybe,
    chainMaybe, tryCatch, getContent, ap,
    liftA2, apMaybe, liftA2Maybe
} from "../../src/box/box.js";
import {maybeDiv, maybeElement, maybeFunction, maybeNumber,Left, Right, Just, Nothing} from "../../src/maybe/maybe.js";
import {id, pair, fst, snd} from "../../src/lambda-calculus-library/lambda-calculus.js";


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

    const result1 = Box(p)
                        (mapf)(p => p.firstName)
                        (mapf)(firstName => firstName.toUpperCase())
                        (fold)(firstNameUpperCase => firstNameUpperCase.slice(1))

    const result2 = Box(10)
                        (fold)(num => num * 2);

    const result3 = Box(id)
                        (fold)(f => f("Magic"))


    const result4 = Box("Hello")
                        (fold)(s => s + " World")

    assert.equals(result1, "UKAS");
    assert.equals(result2, 20);
    assert.equals(result3, "Magic");
    assert.equals(result4, "Hello World");
});

boxSuite.add("box.chain", assert => {
    const box1 = Box(10)
                    (chain)(num => Box(num * 2))

    const box2 = Box(1)
                        (mapf)(num => num + 5)
                        (chain)(num => Box(num * 2)
                                            (mapf)(num => num + 1))
                        (chain)(num => Box(num * 3)
                                            (mapf)(num => num + 1))

    const box3 = Box("a")
                        (mapf)(a => a + "b")
                        (chain)(ab => Box(ab + "c")
                                        (mapf)(abc => abc + "d"))
                        (chain)(abcd => Box(abcd + "e")
                                        (mapf)(abcde => abcde + "f"))

    const box4 = Box(10)
                        (chain)(num => Box(num)
                                            (mapf)(num => num + 2)
                                            (mapf)(num => num + 3))
                        (mapf)(num => num - 15)

    assert.equals(getContent(box1), 20);
    assert.equals(getContent(box2), 40);
    assert.equals(getContent(box3), "abcdef");
    assert.equals(getContent(box4), 0);
});

boxSuite.add("box example", assert => {
    const nextCharForNumberString = str =>
        Box(str)
        (chain)(s => Box(s)
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

    const result = () => Box(10)
                            (mapf)(debug)
                            (mapf)(n => n + 2)
                            (fold)(debug);

    assert.consoleLogEquals(result, "10", "12");

});

boxSuite.add("mapMaybe", assert => {

    const resultSuccess = mapMaybe(maybeDiv(10)(2))(x => x * 10)
                                    (() => 'error: division by zero')
                                    (id);

    const resultFailure = mapMaybe(maybeDiv(10)(0))(x => x * 10)
                                    (() => 'error: division by zero')
                                    (id);

    assert.equals( resultSuccess, 50);
    assert.equals( resultFailure, "error: division by zero");


    const resultSuccess2 = mapMaybe( Just(10) ) (x => x * 4) (() => "failed")(id)
    const resultFailure2 = mapMaybe(     Nothing ) (x => x * 4) (() => "failed")(id)

    assert.equals( resultSuccess2, 40);
    assert.equals( resultFailure2, "failed");
});

boxSuite.add("flatMapMaybe", assert => {

    const result1 = flatMapMaybe( Just(10) )(num => Just(num * 2));
    const result2 = flatMapMaybe(     Nothing )(num => Just(num * 2));

    assert.equals( result1( () => "error")  (id),        20);
    assert.equals( result2,                                 Nothing);
    assert.equals( result2( () => "Nothing")(id), "Nothing");


    const result3 = flatMapMaybe( Just("Hello"))(str => Just(str.toUpperCase()));
    const result4 = flatMapMaybe(         Nothing )(str => Just(str.toUpperCase()));

    assert.equals( result3( () => "error")(id), "HELLO");
    assert.equals( result4,                             Nothing);
    assert.equals( result4( () => "error")(id), "error");
});

boxSuite.add("mapfMaybe", assert => {
    const p = () => Just({firstName: "lukas", lastName: "Mueller"});

    const mapped1 = Box(p())
                        (mapfMaybe)(p => p.firstName);
    assert.equals( getContent(mapped1)(() => "failed")(id), "lukas");

    const mapped2 = mapped1(mapfMaybe)(firstName => firstName.toUpperCase())
    assert.equals(getContent(mapped2)(() => "failed")(id), "LUKAS");

    const mapped3 = mapped2(mapfMaybe)(firstNameUpperCase => firstNameUpperCase.slice(1));
    assert.equals(getContent(mapped3)(() => "failed")(id), "UKAS");


    const mappedNothing = Box(Nothing)(mapfMaybe)((p => p.firstName));
    assert.equals(getContent(mappedNothing)(() => "failed")(id), "failed");
    assert.equals(getContent(mappedNothing), Nothing);

});

boxSuite.add("getContent maybeBox", assert => {
    const person = {firstName: "lukas", lastName: "Mueller"};
    const maybeJustPerson = () => Just(person);

    const boxJustPerson   = Box(maybeJustPerson())
    const justMaybePerson = getContent(boxJustPerson)

    assert.equals(justMaybePerson( () => "no person" )(id), person);


    const boxNothingMaybe = Box(Nothing);
    const nothingMaybe    = getContent(boxNothingMaybe)

    assert.equals(nothingMaybe, Nothing);
    assert.equals(nothingMaybe( () => "no person" )(id), "no person");
});

boxSuite.add("chainMaybe", assert => {
    const person = {firstName: "lukas", lastName: "Mueller"};
    const maybeJustPerson = () => Just(person);

    const chainedPerson1 = Box(maybeJustPerson())
                            (chainMaybe)(p => Just(p.firstName));
    assert.equals( getContent(chainedPerson1)(() => "failed")(id), "lukas");

    const chainedPerson2 = chainedPerson1
                            (chainMaybe)(firstName => Just(firstName.toUpperCase()));
    assert.equals( getContent(chainedPerson2)(() => "failed")(id), "LUKAS");


    const chainedResultNothing = Box(Just(12))
                                (chainMaybe)(_ => Nothing);

    assert.equals( getContent(chainedResultNothing)(() => "failed")(id), "failed");
    assert.equals( getContent(chainedResultNothing), Nothing);
});

boxSuite.add("maybeBox example", assert => {

    const maybeBoxDivison = num => div =>
        Box(maybeDiv(num)(div))
            (mapfMaybe)(x => x * 10)
            (mapfMaybe)(x => x * 2)
            (foldMaybe)(x => x + 2)
                (() => 'error: division by zero')
                (id);

    const resultSuccess = maybeBoxDivison(10)(2);
    const resultFailure = maybeBoxDivison(10)(0);

    assert.equals(resultSuccess, 102);
    assert.equals(resultFailure, 'error: division by zero');


    const maybeBoxNumberTest = testValue =>
        Box(testValue)
            (mapf)(maybeNumber)
            (foldMaybe)(x => x *2)
                (() => "failed")
                (id)

    assert.equals(maybeBoxNumberTest(4), 8);
    assert.equals(maybeBoxNumberTest("bla"), "failed");
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

    assert.equals( findCol('green'), 'no color');
    assert.equals( findCol('red'), 'FF4444');
    assert.equals( findCol('blue'), '3B5998');
    assert.equals( findCol('yellow'), 'FFF68F');
});

boxSuite.add("try catch", assert => {
    const result1 = tryCatch(() => {throw "random error"})
    const result2 = tryCatch(() => 10)
    const result3 = tryCatch(() => "Hello")
    const result4 = tryCatch(() => {throw new TypeError("failed")})


    assert.equals( result1(id)(id), "random error");
    assert.equals( result2(id)(id), 10);
    assert.equals( result3(id)(id), "Hello");
    assert.equals( result1(() => "error")(id), "error");
    assert.equals( result2(() => "error")(() => "success"), "success");
    assert.equals( result3(id)(() => 42), 42);
    assert.equals( result4(e => e.message)(id), "failed");
    assert.equals( result4(e => e.name)(id), "TypeError");
});

boxSuite.add("readPersonFromApi maybeBox example", assert => {


    // method to simulate an api call
    const readPersonFromApi = () => JSON.stringify({name: "John", age: 30, city: "New York"});

    // test method to simulate an api error
    const readPersonFromApiWithError = () => {
        throw "read person from api failed";
    };

    // returns either a parsed object or Nothing
    const parseJson = object =>  object !== null ? tryCatch(() => JSON.parse(object)) : Nothing;

    const parseJsonWithError = _ =>  tryCatch(() => JSON.parse('{"first": "Jane", last: "Doe"}'))


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

    assert.equals( getPerson1("king"), "read person from api failed");
    assert.equals( getPerson2("king"), "Mr. JOHN king");
    assert.equals( getPerson3("king").name, "SyntaxError");

});

boxSuite.add("readPersonFromApi with left & right", assert => {
    const readPersonFromApiWithError = () => Left('api error');


    const parseJson = object =>
        object !== null
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



boxSuite.add("box.ap", assert => {

    const result1 = Box(x => x + 5)
                        (ap)(Box(10));

    assert.equals(getContent(result1), 15);


    const result2 = Box( x => y => x + y)
                        (ap)(Box(10))
                        (ap)(Box(14));

    assert.equals(getContent(result2), 24);
});

boxSuite.add("liftA2", assert => {
    const result1 = liftA2(x => y => x + y)
                        (Box(10))
                        (Box( 5));

    assert.equals( getContent(result1), 15);


    const result2 = liftA2(x => y => x + " --- " + y)
                        (Box("Hel")
                            (mapf)(x => x + "lo"))
                        (Box( "Wor")
                            (mapf)(x => x + "ld"));

    assert.equals( getContent(result2), "Hello --- World");
});

boxSuite.add("maybe.ap", assert => {

    const result1 = Box(Just(x => x + 5))
                        (apMaybe)(Just(10));

    const res = getContent(result1)
                    (_ => console.error('sdv'))
                    (id)

    assert.equals(res, 15);



    const result2 = Box(Just( x => y => x + y))
                        (apMaybe)(Just(10))
                        (apMaybe)(Just(14));

    const res2 = getContent(result2)
                        (_ => console.error('sdv'))
                        (id)

    assert.equals(res2, 24);
});

boxSuite.add("liftA2 maybe", assert => {

    const result = liftA2Maybe( x => y => x + y) // TODO: maybe better to maybe instead of Box?
                        (Just(10))
                        (Just(5));

    const res = getContent(result)
                    (_ => console.error('error'))
                    (id)

    assert.equals(res, 15);
});

boxSuite.add("lazy Box evaluation", assert => {

    const notLazyResult = Box("a")
                            (mapf)(a   => a   + "b")
                            (mapf)(ab  => ab  + "c")
                            (mapf)(abc => abc + "d")

    assert.equals(getContent(notLazyResult), "abcd");


    const lazyResult = () => Box("a")
                                (mapf)(a   => a   + "b")
                                (mapf)(ab  => ab  + "c")
                                (mapf)(abc => abc + "d")

    assert.equals(getContent(lazyResult()), "abcd");
    assert.equals(getContent(lazyResult()), "abcd");
});



boxSuite.report();
