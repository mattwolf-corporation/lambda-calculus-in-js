/**
 * Generic Types
 * @typedef {*} a
 * @typedef {*} b
 * @typedef {*} c
 * @typedef {(a|b|c)} abc
 * @typedef {function} fn
 * @typedef {function} gn
 * @typedef {function} pn
 * @typedef {function} qn
 * @typedef {function} boolean
 * @typedef {function} pair
 * @typedef {function} churchBoolean
 */

/**
 * a -> a ; Identity (id)
 * @function I
 * @param   {a} x
 * @returns {a} the Identity {@link a}
 */
const id = x => x;

/**
 * a -> b -> a ; Kestrel (Constant)
 * @function K
 * @param {a} x
 * @returns { function(y:b): function(x:{a}) } a function that ignores its argument and returns {@link a}
 */
const K = x => y => x;

/**
 * a -> b -> b ; Kite
 * @function KI
 * @param {a} x
 * @returns { function(y:{b}): function(y:{b} } a function that returns its argument {@link a}
 */
const KI = x => y => y;

/**
 * fn -> fn( fn ) ; Mockingbird
 * @function M
 * @param {fn} f
 * @returns { function(f {fn}) } a self-application combinator
 */
const M = f => f(f);

/**
 * fn -> a -> b -> fn( b )( a ) ; Cardinal (flip)
 * @function C
 * @param  {fn} f
 * @returns { function(x:{a}): function(y:{b}): function(fn y:{b} x:{a} ) } The Cardinal, aka flip, takes two-argument function, and produces a function with reversed argument order.
 */
const C = f => x => y => f(y)(x);

/**
 * fn -> gn -> a -> fn( gn( a ) ) ; Bluebird (Function composition)
 * @function B
 * @param {fn} f
 * @returns { function(g:{gn}): function(x:{a}):  function({ fn:{ gn:{a} } } ) } two-fold self-application composition
 *
 * @example
 * B(id)(id)(n7) === n7
 * B(id)(jsnum)(n7) === 7
 * B(not)(not)(True) == True
 */
const B = f => g => x => f(g(x));

/**
 * a -> fn -> fn( a ) ; Thrush (hold an argument)
 * @function T
 * @param {a} x
 * @returns { function(f:{fn}): function(f x:{a} ) } self-application with holden argument
 */
const T = x => f => f(x);


/**
 * a -> b -> fn -> fn(a)(b) ; Vireo (hold pair of args)
 * @function V
 * @param {a} x
 * @returns { function(y:{b}): function(f:{fn}): function(fn x:{a} y:{b} ) }
 */
const V = x => y => f => f(x)(y);

/**
 * fn -> gn -> a -> b -> fn( gn(a)(b) ) ; Blackbird (Function composition with two args)
 * @function Blackbird
 * @param {fn} f
 * @returns { function(g:{gn}): function(x:{a}): function(y:{b}): function({ fn:{gn x:{a} y:{b}} }) }
 * @example
 * Blackbird(x => x)(x => y => x + y)(2)(3)     === 5
 * Blackbird(x => x * 2)(x => y => x + y)(2)(3) === 10
 */
const Blackbird = f => g => x => y => f(g(x)(y));

/**
 * a -> b -> b ; {churchBoolean} False Church-Boolean
 * @function False
 * @type {function(a): function(*): {b}}
 */
const False = KI;

/**
 * a -> b -> a ; {churchBoolean} True Church-Boolean
 * @function True
 * @type {K.props|*}
 */
const True = K;

/**
 * fn -> a -> b -> fn( b )( a ) ; not
 * @function not
 * @param {churchBoolean} Church-Boolean
 * @returns {churchBoolean} negation of the insert Church-Boolean
 * @example
 * not(True)      === False;
 * not(False)     === True;
 * not(not(True)) === True;
 * @type {function(fn): function(*=): function(*=): *}
 */
const not = C;

/**
 * pn -> qn -> pn( qn )(False) ; and
 * @function and
 * @param {pn} p
 * @returns { function(q:{qn}): {churchBoolean} } True or False
 */
const and = p => q => p(q)(False);

/**
 * pn -> qn -> pn( True )(q) ; or
 * @function or
 * @param {pn} p
 * @returns { function(q:{qn}): {churchBoolean} } True or False
 */
const or = p => q => p(True)(q);

/**
 * pn -> qn -> pn( qn )(not( qn)) ; beq (ChurchBoolean-Equality)
 * @function beq
 * @param {pn} p
 * @returns { function(q:{qn}): {churchBoolean} } True or False
 * @example
 * beq(True)(True)   === True;
 * beq(True)(False)  === False;
 * beq(False)(False) === False;
 */
const beq = p => q => p(q)(not(q));

/**
 * b -> b("True")("False") ; showBoolean
 * @function showBoolean
 * @param b {churchBoolean}
 * @return string - "True" or "False"
 * @example
 * showBoolean(True)  === "True";
 * showBoolean(False) === "False";
 */
const showBoolean = b => b("True")("False");

/**
 * b -> b(true)(false) ; convertToJsBool
 * @function convertToJsBool
 * @param b {churchBoolean}
 * @return {boolean} - true or false
 * @example
 * convertToJsBool(True)  === true;
 * convertToJsBool(False) === false;
 */
const convertToJsBool = b => b(true)(false);

/**
 *  a -> b -> fn -> fn(a)(b) ; Pair
 * @function pair
 * @param {a} x:  firstOfPair argument of the pair
 * @returns {pair} - returns a function, that store two value
 */
const pair = V;

/**
 * fst ; Get first value of Pair
 * @function fst
 * @type {K.props|*}
 * @return pair first stored value
 * @example
 * pair(n2)(n5)(fst) === n2
 */
const fst = K;

/**
 * snd ; Get second value of Pair
 * @function snd
 * @type {function(a): function(*): {b}}
 * @return pair second stored value
 * @example
 * pair(n2)(n5)(snd) === n5
 */
const snd = KI;

/**
 *  a -> b -> -> c -> fn -> fn(a)(b)(c) ; Triple
 * @function triple
 * @param {*} x:  firstOfTriple argument of the Triple
 * @returns {function} - returns a function, that storage three arguments
 */
const triple = x => y => z => f => f(x)(y)(z);

/**
 * a -> b -> -> c -> a ; firstOfTriple
 * @function firstOfTriple
 * @param {a} x
 * @return { function(y:{b}): function(z:{c}): a } x
 */
const firstOfTriple = x => y => z => x;

/**
 * a -> b -> -> c -> b ; secondOfTriple
 * @function secondOfTriple
 * @param {a} x
 * @return { function(y:{b}): function(z:{c}): b } y
 */
const secondOfTriple = x => y => z => y;

/**
 * a -> b -> -> c -> b ; thirdOfTriple
 * @function thirdOfTriple
 * @param {a} x
 * @return { function(y:{b}): function(z:{c}): c } z
 */
const thirdOfTriple = x => y => z => z;

/**
 * mapPair
 * @function mapPair
 * @param f {function}
 * @return {function(p:{pair}): pair} pair
 */
const mapPair = f => p => pair(f(p(fst)))(f(p(snd)));

/**
 * p -> p `${p(fst)} | ${p(snd)} ; showPair
 * @function showPair
 * @param p {pair}
 * @return string with first and second value
 * @example
 * const testPair = pair('Erster')('Zweiter');
 * showPair(testPair) === 'Erster | Zweiter'
 */
const showPair = p => `${p(fst)} | ${p(snd)}`;


/**
 * Generic Types
 * @typedef {*} a
 * @typedef {*} b
 * @typedef {*} c
 * @typedef {(a|b|c)} abc
 * @typedef {function} fn
 * @typedef {function} gn
 * @typedef {function} pn
 * @typedef {function} qn
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 */

/**
 *  church numbers 0 - 9
 *  n times application of function f to the argument a
 */
const n0 = f => a => a;
const n1 = f => a => f(a);
const n2 = f => a => f(f(a));
const n3 = f => a => f(f(f(a)));
const n4 = f => a => f(f(f(f(a))));
const n5 = f => a => f(f(f(f(f(a)))));
const n6 = f => a => f(f(f(f(f(f(a))))));
const n7 = f => a => f(f(f(f(f(f(f(a)))))));
const n8 = f => a => f(f(f(f(f(f(f(f(a))))))));
const n9 = f => a => f(f(f(f(f(f(f(f(f(a)))))))));

/**
 * successor of a church number
 * @param {churchNumber} n
 * @returns {churchNumber} successor of n
 */
const successor = n => f => a => f(n(f)(a));

/**
 * successor with bluebird
 * @param {churchNumber} n
 * @returns {churchNumber} successor of n
 */
const succ = n => f => B(f)(n(f));

/**
 * Addition with two Church-Numbers
 * @param n {churchNumber}
 * @returns {function(k:{churchNumber}): churchNumber } Church-Number
 */
const churchAddition = n => k => n(succ)(k);

/**
 * phi combinator ;
 * creates a new pair, replace first value with the second and increase the second value
 * @param {pair} p
 * @returns {pair} pair
 */
const phi = p => pair(p(snd))(succ(p(snd)));

/**
 * predecessor
 * @param {churchNumber} n
 * @returns {churchNumber} predecessor of n
 */
const pred = n => n(phi)(pair(n0)(n0))(fst);

/**
 * Subtraction with two Church-Numbers
 * @param n1 {churchNumber}
 * @return {function(n2:{churchNumber}): churchNumber } Church-Number
 */
const churchSubtraction = n => k => k(pred)(n);

/**
 * Multiplication with two Church-Numbers
 * @param n1 {churchNumber}
 * @returns {function(n1:{fn}): function(n2:{gn}): churchNumber } Church-Number
 */
const churchMultiplication = B;

/**
 * Potency with two Church-Numbers
 * @param n1 {churchNumber}
 * @returns {function(n1:{x}): function(n2:{f}): churchNumber } Church-Number
 */
const churchPotency = T;

/**
 * query if the church number is zero (n0)
 * @param n {churchNumber}
 * @return {churchBoolean} True / False
 */
const is0 = n => n(K(False))(True);

/**
 * converts a church number to a js number
 * @param n {churchNumber} -
 * @returns {number} js number of n
 */
const jsnum = n => n(x => x + 1)(0);

/**
 * "less-than-or-equal-to" with Church-Numbers
 * @param n1 {churchNumber} -
 * @return {function(n2:{churchNumber}): churchBoolean} True / False
 */
const leq = n => k => is0(churchSubtraction(n)(k));

/**
 * "equal-to" with Church-Number
 * @param n1 {churchNumber} -
 * @return {function(n2:{churchNumber}): churchBoolean} True / False
 */
const eq = n => k => and(leq(n)(k))(leq(k)(n));


/**
 * "greater-than" with Church-Numbers
 * @param n1 {churchNumber} -
 * @return {function(n2:{churchNumber}): churchBoolean} True / False
 */
const gt = Blackbird(not)(leq);


/**
 * Generic Types
 * @typedef {function} operator
 * @typedef {*} number
 * @typedef {number} jsNumber
 * @typedef {function} fn
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 */

/** -----------------------------------------------------
 * --------- Calculator (JS- & Church-Numbers) ----------
 * ------------------------------------------------------
 */

const calculatorHandler = op => n => k => f => f(op(n)(k));


const calc = T;


const result = id;

const plus = n => k => n + k;
const multiplication = n => k => n * k;
const subtraction = n => k => n - k;
const exponentiation = n => k => n ** k;
const division = n => k => n / k;

const add = calculatorHandler(plus);
const multi = calculatorHandler(multiplication);
const sub = calculatorHandler(subtraction);
const pow = calculatorHandler(exponentiation);
const div = calculatorHandler(division);



const churchAdd = calculatorHandler(churchAddition);
const churchMulti = calculatorHandler(churchMultiplication);
const churchPow = calculatorHandler(churchPotency);
const churchSub = calculatorHandler(churchSubtraction);


const stack = x => y => z => f => f(x)(y)(z);


const stackIndex = firstOfTriple;


const stackPredecessor = secondOfTriple;


const stackValue = thirdOfTriple;


const emptyStack = stack(n0)(id)(id);


const hasPre = s => not(is0(s(stackIndex)));


const push = s => x => stack(succ(s(stackIndex)))(s)(x);


const pop = s => pair(s(stackPredecessor))(head(s));


const head = s => s(stackValue);

const size = s => s(stackIndex);


const getElementByIndex = s => i => {
    const times = churchSubtraction(size(s))(i);
    const getStackPredecessor = s => s(stackPredecessor);

    return head(times(getStackPredecessor)(s));
};

const getElementByJsnumIndex = s => i => {
    const times = size(s);
    const initArgsPair = pair(s)(id);

    const getElement = argsPair => {
        const stack = argsPair(fst);
        const predecessorStack = (stack)(stackPredecessor);

        if (jsnum((stack)(stackIndex)) === i) {

            return pair(predecessorStack)(head(stack));
        }

        return pair(predecessorStack)(argsPair(snd));
    };

    return (times(getElement)(initArgsPair))(snd);
};


const convertStackToArray = s => reduce(s)(pair((acc, curr) => [...acc, curr])([]));


const convertArrayToStack = array => array.reduce((acc, curr) => push(acc)(curr), emptyStack);


const reverseStack = s => (reduce(s)(pair((acc, curr) => pair(pop(acc(fst))(fst))(push(acc(snd))(pop(acc(fst))(snd))))(pair(s)(emptyStack))))(snd);


const mapWithReduce = s => map => reduce(s)(pair((acc, curr) => push(acc)(map(curr)))(emptyStack));

const filterWithReduce = s => filter => reduce(s)(pair((acc, curr) => filter(curr) ? push(acc)(curr) : acc)(emptyStack));


const reduce = s => argsPair => {
    const times = size(s);
    const reversedStack = times(reduceIteration)(triple(s)((acc, curr) => push(acc)(curr))(emptyStack))(thirdOfTriple);
    const argsTriple = triple(reversedStack)(argsPair(fst))(argsPair(snd));

    return (times(reduceIteration)(argsTriple))(thirdOfTriple);
};


const reduceIteration = argsTriple => {
    const stack = argsTriple(firstOfTriple);

    if (convertToJsBool(hasPre(stack))) {
        const reduceFunction = argsTriple(secondOfTriple);

        const preAcc = argsTriple(thirdOfTriple);

        const curr = head(stack);

        const acc = reduceFunction(preAcc, curr);

        const preStack = stack(stackPredecessor);

        return triple(preStack)(reduceFunction)(acc);
    }
    return argsTriple;
};

const map = s => mapFunction => {
    const times = size(s);
    const initArgsPair = pair(emptyStack)(n0);

    const mapIteration = argsPair => {
        const index = argsPair(snd);

        if (convertToJsBool(eq(times)(index))) {
            return argsPair;
        }
        const increasedIndex = succ(argsPair(snd));
        const valueToMap = getElementByIndex(s)(increasedIndex);
        const mappedValue = mapFunction(valueToMap);
        const resultStack = push(argsPair(fst))(mappedValue);

        return pair(resultStack)(increasedIndex);
    };

    return (times(mapIteration)(initArgsPair))(fst);
};


const filter = s => filterFunction => {
    const times = size(s);
    const initArgsPair = pair(emptyStack)(n0);

    const filterIteration = argsPair => {
        const stack = argsPair(fst);
        const index = argsPair(snd);
        const increasedIndex = succ(index);

        if (convertToJsBool(not(eq(times)(index)))) {
            const value = getElementByIndex(s)(increasedIndex);

            if (filterFunction(value)) {
                const resultStack = push(stack)(value);
                return pair(resultStack)(increasedIndex);
            }
        }

        return pair(stack)(increasedIndex);
    };

    return (times(filterIteration)(initArgsPair))(fst);
};


const logStackToConsole = s => {

    const logIteration = (acc, curr) => {
        const index = acc + 1;
        console.log('element at: ' + index + ': ' + JSON.stringify(curr));
        return index;
    };

    reduce(s)(pair(logIteration)(0));
};


const stackOp = op => s => x => f => f(op(s)(x));
const pushToStack = stackOp(push);


const startStack = f => f(emptyStack);


const forEach = stack => f => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = s => {
        if (convertToJsBool(hasPre(s))) {
            const element = head(s);
            const index = jsnum(succ(churchSubtraction(times)(size(s))));
            f(element, index);

            return (pop(s))(fst);
        }
        return s;
    };

    times(iteration)(reversedStack);
};


//const Left = x => f => g => f(x);
//const Right = x => f => g => g(x);
const either = e => f => g => e(f)(g);

const either2 = id;

const saveDiv = x => y =>
    y === 0
        ? Left("divisor is zero")
        : Right(x / y)

// either(saveDiv(1)(0))
// (msg => console.log(msg))
// (result => id(result))

const w = boolean => err => calc => boolean ? Left(err) : Right(calc);


const saveCalc = predicate => errorMsg => calcSave =>
    x => y => w((predicate)(x)(y))(errorMsg)(f => f(calcSave(x)(y)))



// const pipe = f => x => t => t(f(x));

const pipe = f => g => x => g(f(x));

const f1 = x => x + 1;
const f2 = x => x * 2;
const f3 = x => x + 10;

// const res = pipe(f1)(f2)(10)


// old box construct with object
const Box = x =>
    ({
        map: f => Box(f(x)),
        fold: f => f(x),
        inspect: () => `Box(${x})`
    })


// new box construct only with pure functions !!
const Box2 = x => mapf(x)(id);
const mapf = x => f => g => g(f(x));
const fold2 = x => f => f(x); // T


const nextCharForNumberString = str =>
    Box(str)
        .map(s => s.trim())
        .map(r => parseInt(r))
        .map(i => i + 1)
        .map(i => String.fromCharCode(i))
        .fold(c => c.toLowerCase())

const nextCharForNumberString2 = str =>
    Box2(str)
    (mapf)(s => s.trim())
    (mapf)(r => parseInt(r))
    (mapf)(i => i + 1)
    (mapf)(i => String.fromCharCode(i))
    (fold2)(c => c.toLowerCase())

const r1 = nextCharForNumberString(' 64 ');
const r2 = nextCharForNumberString2(' 64 ');

//console.log(r1);
//console.log(r2);
//console.log(r1 === r2);