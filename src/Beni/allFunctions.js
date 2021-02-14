
/*
idea shortcuts:
Shift-Alt I   : inspection window (errors, warning)
Cmd-Shift-I   : quick show implementation
Ctrl-J        : jsdoc quick lookup
Cmd-Hover     : quick info
Cmd-P         : parameter info
Ctrl-Shift-P  : expression type
*/

/**
 * Generic Types
 * @typedef {*} a
 * @typedef {*} b
 * @typedef {*} c
 * @typedef {(a|b|c)} abc
 * @typedef {*} p
 * @typedef {*} q
 * @typedef {*} x
 * @typedef {*} *
 * @typedef {*} y
 * @typedef {function} pair
 * @typedef {function} churchBoolean
 */

/**
 * x -> x ; Identity (id)
 * @lambda λx.x
 * @haskell Identity :: a -> a
 *
 * @function Identity
 * @param   {*} x
 * @returns {*} x
 */
const I = x => x;

const id = x => x;

/**
 * a -> b -> a ; Kestrel (Constant)
 * @lambda λx.y.x
 * @haskell Kestrel :: a -> b -> a
 *
 * @function Konstant
 * @param  {*} x
 * @returns { function(y:*): function(x:*) } a function that ignores its argument and returns x
 */
const K = x => y => x;

/**
 * x -> y -> y ; Kite
 * @lambda λx.y.y
 * @haskell Kite :: a -> b -> b
 *
 * @function Kite
 * @param {*} x
 * @returns { function(y:*): function(y:*) } a function that returns its argument y
 */
const KI = x => y => y;

/**
 * f -> f( f ) ; Mockingbird
 * @lambda λf.ff
 * @haskell Mockingbird :: f -> f
 *
 * @function Mockingbird
 * @param {function} f
 * @returns { function({ f: { f } }) } a self-application combinator
 */
const M = f => f(f);

/**
 * f -> x -> y -> f( x )( y ) ; Cardinal (flip)
 * @lambda λfxy.fxy
 * @haskell Cardinal :: f -> a -> b -> pair
 *
 * @function Cardinal
 * @function flip
 * @param  {function} f
 * @returns { function(x:*): function(y:*): {f: { y x }} } The Cardinal, aka flip, takes two-argument function, and produces a function with reversed argument order.
 *
 * @example
 * C(K) (1)(2)  === 2
 * C(KI)(1)(21) === 1
 */
const C = f => x => y => f(y)(x);


/**
 * f -> g -> x -> f( g( x ) ) ; Bluebird (Function composition)
 *
 * @lambda λfgx.f(gx)
 * @haskell Bluebird :: f -> a -> b -> c
 *
 * @function Bluebird
 * @param {function} f
 * @returns { function(g:function): function(x:*):  {f: { g:{x} } } } two-fold self-application composition
 *
 * @example
 * B(id)(id)(n7)     === n7
 * B(id)(jsnum)(n7)  === 7
 * B(not)(not)(True) == True
 */
const B = f => g => x => f(g(x));


/**
 * x -> f -> f( x ) ; Thrush (hold an argument)
 *
 * @lambda λxf.fx
 * @haskell Thrush :: a -> f -> b
 *
 * @function Thrush
 * @param {*} x
 * @returns { function(f:function): {f: {x} } } self-application with holden argument
 */
const T = x => f => f(x);


/**
 * x -> y -> f -> f (x)(y) ; Vireo (hold pair of args)
 *
 * @lambda λxyf.fxy
 * @haskell Vireo :: a -> b -> f
 *
 * @function Vireo
 * @param {*} x
 * @returns { function(y:*): function(f:function): {f: {x y} } }
 */
const V = x => y => f => f(x)(y);


/**
 * f -> g -> x -> y -> f( g(x)(y) ) ; Blackbird (Function composition with two args)
 *
 * @lambda λfgxy.f(gxy)
 * @haskell Blackbird :: f -> g -> a -> b -> c
 *
 * @function
 * @param {function} f
 * @returns { function(g:function): function(x:*): function(y:*): function({ f:{g: {x y}} }) }
 * @example
 * Blackbird(x => x)(x => y => x + y)(2)(3)     === 5
 * Blackbird(x => x * 2)(x => y => x + y)(2)(3) === 10
 */
const Blackbird = f => g => x => y => f(g(x)(y));

/**
 * x -> y -> y ; {churchBoolean} False Church-Boolean
 * @function
 * @return KI
 */
const False = KI;

/**
 * x -> y -> x ; {churchBoolean} True Church-Boolean
 * @function
 * @return K
 */
const True = K;


/**
 * TODO: Doc IF
 */
const If = condition => truthy => falshy => condition(truthy)(falshy);

const LazyIf = condition => truthy => falshy => (condition(truthy)(falshy))();

/**
 * Syntactic sugar for If-Construct
 */
const Then = I;
const Else = I;

/**
 * f -> x -> y -> f( x )( y ) ; not
 *
 * @function
 * @param {churchBoolean} Church-Boolean
 * @returns {churchBoolean} negation of the insert Church-Boolean
 * @example
 * not(True)      === False;
 * not(False)     === True;
 * not(not(True)) === True;
 * @return Cestral
 */
const not = C;

/**
 * p -> q -> p( q )(False) ; and
 *
 * @function
 * @param {churchBoolean} p
 * @returns { function(q:churchBoolean): churchBoolean }  True or False
 */
const and = p => q => p(q)(False);

/**
 * p -> q -> p( True )(q) ; or
 *
 * @function
 * @param {churchBoolean} p
 * @returns { function(q:churchBoolean): churchBoolean }  True or False
 */
const or = p => q => p(True)(q);

/**
 * p -> q -> p( q )( not(qn) ) ; beq (ChurchBoolean-Equality)
 *
 * @function
 * @param {churchBoolean} p
 * @returns { function( q:churchBoolean): churchBoolean }  True or False
 * @example
 * beq(True)(True)   === True;
 * beq(True)(False)  === False;
 * beq(False)(False) === False;
 */
const beq = p => q => p(q)(not(q));

/**
 * b -> b("True")("False") ; showBoolean
 * @function
 * @param b {churchBoolean}
 * @return {string} - "True" or "False"
 * @example
 * showBoolean(True)  === "True";
 * showBoolean(False) === "False";
 */
const showBoolean = b => b("True")("False");

/**
 * b -> b(true)(false) ; convertToJsBool
 *
 * @function
 * @param b {churchBoolean}
 * @return {boolean} - true or false
 * @example
 * convertToJsBool(True)  === true;
 * convertToJsBool(False) === false;
 */
const convertToJsBool = b => b(true)(false);

const convertJsBoolToChurchBool = b => b ? True : False;

/**
 * x -> y -> f -> f(x)(y) ; Pair
 *
 * @function
 * @param {*} x:  firstOfPair argument of the pair
 * @returns { function(y:*): function(f:function): {f: {x y} } } - returns a function, that store two value
 */
const pair = V;

/**
 * Get first value of Pair
 *
 * @function
 * @return {function(x:*): function(y:*): x} - pair first stored value
 * @example
 * pair(n2)(n5)(fst) === n2
 */
const fst = K;

/**
 * Get second value of Pair
 *
 * @function
 * @return {function(x:*): function(y:*): y} - pair second stored value
 * @example
 * pair(n2)(n5)(snd) === n5
 */
const snd = KI;


/**
 *  x -> y -> z -> f -> f(x)(y)(z) ; Triple
 *
 * @function
 * @param {*} x - firstOfTriple argument of the Triple
 * @return { function(y:*):  function(z:*): function(f:function): {f: {x y z}} } - returns a function, that storage three arguments
 */
const triple = x => y => z => f => f(x)(y)(z);

/**
 * @haskell firstOfTriple :: a -> b -> c -> a
 *
 * x -> y -> z -> x ; firstOfTriple
 *
 * @function
 * @param {*} x
 * @return { function(y:*): function(z:*): x } - x
 * @example
 * triple(1)(2)(3)(firstOfTriple) === 1
 */
const firstOfTriple = x => y => z => x;

/**
 * x -> y -> z -> y ; secondOfTriple
 *
 * @function
 * @param {a} x
 * @return { function(y:*): function(z:*): y } - y
 * @example
 * triple(1)(2)(3)(firstOfTriple) === 2
 */
const secondOfTriple = x => y => z => y;

/**
 * x -> y -> z -> z ; thirdOfTriple
 *
 * @function
 * @param {*} x
 * @return { function(y:*): function(z:*): z } - z
 * @example
 * triple(1)(2)(3)(firstOfTriple) === 3
 */
const thirdOfTriple = x => y => z => z;

/**
 * function -> pair -> pair
 *
 * @function
 * @param {function} f
 * @return {function(pair): function(Function): {f: {x, y}}} new mapped pair
 * @example
 * mapPair( x => x+3 )( pair(1)(2) ) === pair(4)(5)
 * mapPair( x => x + "!!!" )( pair("Yes")("No") ) === pair("Yes!!!")("No!!!")
 */
const mapPair = f => p => pair(f(p(fst)))(f(p(snd)));

/**
 * p -> p `${p(fst)} | ${p(snd)} ; showPair
 *
 * @function
 * @param {pair} p
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
const jsNum = n => n(x => x + 1)(0);

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
 * @typedef {(function)} churchNumber
 */

/** -----------------------------------------------------
 * --------- Calculator (JS- & Church-Numbers) ----------
 * ------------------------------------------------------
 */

/**
 * operator -> jsChurchNumber -> jsChurchNumber -> fn -> fn( operator(jsChurchNumber)(jsChurchNumber) ) ; CalculatorOperator - handle the arithmetic-operator
 * @param {operator} op
 * @return { function(n:{jsChurchNumber}): function(k:{jsChurchNumber}): function(f:{fn}) : function} JS- or Chruch-Arithmetic-Operation
 */
const calculatorHandler = op => n => k => f => f( op(n)(k) );

/**
 * calc ; start the Calculator
 * @example
 * calc(n1)(add)(n2)(result) ==> n3
 *
 * @param {jsChurchNumber} number
 * @returns {operator} Operator
 */
const calc = T;

/**
 * result ; end the Calculator
 * @example
 * calc(n1)(add)(n2)(result) ==> n3
 *
 * @type {function(a): I.props|*}
 * @return {churchNumber|number} ChurchNumber / JsNumber
 */
const result = I;

/** ----------------------------------------------------
 * -------------  Calculation with JS-Numbers ----------
 * ------------------------------------------------------
 */

/**
 * JavaScript Arithmetic-Operators
 */
const plus              = n => k => n + k;
const multiplication    = n => k => n * k;
const subtraction       = n => k => n - k;
const exponentiation    = n => k => n ** k;
const division          = n => k => n / k;

/**
 * Combining the JavaScript-Arithmetic to the CalculatorOperator
 * and creating Arithmetic-Function to us with the Calc-Function.
 *
 * @example
 * calc(5)(multi)(4)(sub)(4)(pow)(2)(div)(8)(add)(10)(result) === 42
 */
const add   = calculatorHandler(plus);
const multi = calculatorHandler(multiplication);
const sub   = calculatorHandler(subtraction);
const pow   = calculatorHandler(exponentiation);
const div   = calculatorHandler(division);


/** ----------------------------------------------------
 * ----------  Calculation with Church-Numbers ---------
 * -----------------------------------------------------
 */

/**
 * Combining the Church-Arithmetic to the CalculatorOperator
 * and creating Arithmetic-Function to us with the Calc-Function.
 *
 * @example
 * calc(n2)(churchAdd)(n3)(churchMulti)(n2)(churchPow)(n2)(churchSub)(n1)(result) ==> 99
 */
const churchAdd     = calculatorHandler(churchAddition);
const churchMulti   = calculatorHandler(churchMultiplication);
const churchPow     = calculatorHandler(churchPotency);
const churchSub     = calculatorHandler(churchSubtraction);



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
 * @typedef {function} churchNumber
 * @typedef {function} stack
 * @typedef {number} JsNumber
 * @typedef {*} number
 */



/**
 * Generic Types
 * @typedef {*} a
 * @typedef {*} b
 * @typedef {function} pair
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 * @typedef {function} stack
 * @typedef {function} stackOp
 * @typedef {number} JsNumber
 */

/**
 * index -> predecessor -> value -> f -> f(index)(predecessor)(head) ; Triple
 *
 * The stack is a pure functional data structure and is therefore immutable.
 * The stack is implemented as a triplet.
 * The first value of the triple represents the size (number of elements) of the stack.
 * At the same time the first value represents the index of the head (top value) of the stack.
 * The second value represents the predecessor stack
 * The third value represents the head ( top value ) of the stack
 *
 * @function stack
 * @type {function(index:churchNumber): function(predecessor:stack):  function(value:*): function(f:function): ({f: {index value head}}) }
 * @return {triple} stack as triple
 */
const stack = triple;

/**
 * Representation of the empty stack
 * The empty stack has the size/index zero (has zero elements).
 * The empty stack has no predecessor stack, but the identity function as placeholder.
 * The empty stack has no head ( top value ), but the identity function as placeholder.
 *
 * @type {function(Function): {f: {index, predecessor, head}}}
 */
const emptyStack = stack(n0)(id)(id);


/**
 * A help function to create a new stack
 */
const startStack = f => f(emptyStack);

/**
 * stack getter function - get the Index (first of a triple)
 * @haskell stackIndex :: a -> b -> c -> a
 * @function stackIndex
 * @return {churchNumber} index/size
 * @example
 * stack(n0)(emptyStack)(42)(stackIndex) === n0
 */
const stackIndex = firstOfTriple;

/**
 * @haskell stackPredecessor :: a -> b -> c -> b
 *
 * stack getter function - get the Predecessor (second of a triple)
 *
 * @function stackPredecessor
 * @return {stack|id} predecessor stack or id if emptyStack
 * @example
 * stack(n0)(emptyStack)(42)(stackPredecessor) === emptyStack
 */
const stackPredecessor = secondOfTriple;


/**
 * stack getter function - get the Value (third of a triple)
 *
 * @haskell stackValue :: a -> b -> c -> c
 * @function stackValue
 * @return {*} value
 * @example
 * stack(n0)(emptyStack)(42)(stackValue) === 42
 */
const stackValue = thirdOfTriple;


/**
 * A function that takes a stack and returns a church-boolean, which indicates whether the stack has a predecessor stack
 * @haskell: hasPre :: a -> churchBoolean
 * @function hasPredecessor
 * @param {stack} s
 * @return {churchBoolean} churchBoolean
 */
const hasPre = s => not(is0(s(stackIndex)));

/**
 * A function that takes a stack and returns the predecessor stack
 * @haskell getPreStack :: stack -> stack
 * @function getPredecessorStack
 * @param {stack} s
 * @return {stack} predecessor of that stack
 */
const getPreStack = s => s(stackPredecessor)


/**
 *  A function that takes a stack and a value. The function returns a new stack with the pushed value
 * @haskell push :: stack -> a -> stack
 * @param {stack} s
 * @return {stack} stack with value x
 */
const push = s => stack(succ(s(stackIndex)))(s);

/**
 * A function that takes a stack. The function returns a value pair. The first element of the pair is the predecessor stack. The second element of the pair is the head (the top element) of the stack.
 * @haskell pop :: stack -> pair
 * @param {stack} s
 * @return {pair} pair
 */
const pop = s => pair(getPreStack(s))(head(s));

/**
 * A function that takes a stack. The function returns the head (the top value) of the stack.
 *
 * @haskell head :: stack -> a
 * @function
 * @param {stack} s
 * @return {*} stack-value
 */
const head = s => s(stackValue);

/**
 * A function that takes a stack. The function returns the size (number of elements) in the stack
 *
 * @haskell size :: stack -> churchNumber
 * @function
 * @param {stack} s
 * @return {churchNumber} stack-index as church numeral
 */
const size = s => s(stackIndex);

/**
 * A function that takes argument pair and  a stack.
 * The first argument of the pair must be a reducer function.
 * The second argument of the pair must be a start value.
 * The function reduces the stack using the passed reduce function and the passed start value
 *
 * @haskell reduce :: pair -> stack -> a
 * @function
 * @param {function(Function): {f: {x, y}}} argsPair
 * @return {function(s:stack): function(stack)} reduced value
 * @example
 * const stackWithNumbers  = push(push(push(emptyStack)(1))(1))(2);
 *
 * const reduceFunctionSum = (acc, curr) => acc + curr;
 * reduce( pair( reduceFunctionSum )( 0 ))( stackWithNumbers )          === 3
 * reduce( pair( reduceFunctionSum )( 0 ))( push(stackWithNumbers)(3) ) === 10
 *
 * const reduceToArray = (acc, curr) => [...acc, curr];
 * reduce( pair( reduceToArray )( [] ) )( stackWithNumbers ) === [0, 1, 2]
 */
// TODO: remove args pair -> curry function
const reduce = argsPair => s => {
    const times = size(s);

    const reduceIteration = argsTriple => {
        const stack = argsTriple(firstOfTriple);

        const getTriple = argsTriple => {
            const reduceFunction = argsTriple(secondOfTriple);

            const preAcc = argsTriple(thirdOfTriple);

            const curr = head(stack);

            const acc = reduceFunction(preAcc, curr);

            const preStack = stack(stackPredecessor);

            return triple(preStack)(reduceFunction)(acc);
        }

        return If(hasPre(stack))
        (Then(getTriple(argsTriple)))
        (Else(argsTriple));
    };

    const reversedStack = times(reduceIteration)(triple(s)((acc, curr) => push(acc)(curr))(emptyStack))(thirdOfTriple);
    const argsTriple = triple(reversedStack)(argsPair(fst))(argsPair(snd));

    return (times(reduceIteration)(argsTriple))(thirdOfTriple);
};

// const reduce2 = argsPair => s => (size(s)
//                                     ()
//                                 (triple((size(s))(reduceIteration)(triple(s)((acc, curr) => push(acc)(curr))(emptyStack))(thirdOfTriple))(argsPair(fst))(argsPair(snd))))
//                                 (thirdOfTriple);


/**
 * A function that takes a stack and an index (as church number). The function returns the element at the passed index
 * @haskell getElementByIndex :: stack -> churchNumber -> b
 * @function
 * @param {stack} stack
 * @return {function(index:{churchNumber}) : * } stack-value
 * @example
 * const stackWithNumbers = push(push(push(emptyStack)(1))(1))(2);
 *
 * getElementByIndex( stackWithNumbers )( n0 ) === id
 * getElementByIndex( stackWithNumbers )( n1 ) ===  0
 * getElementByIndex( stackWithNumbers )( n2 ) ===  1
 * getElementByIndex( stackWithNumbers )( n3 ) ===  2
 */
const getElementByIndex = stack => index =>
    maybeElementByIndex(stack)(index)
    ( () => {console.warn( new Error(`No Index type of ${typeof index} allowed. Use Js- or Church-Numbers`))} )
    ( id )


const maybeElementByIndex = stack => index =>
    maybeNumber(index)
    ( () => maybeFunction(index)                                    // index is NOT a number, then check if a function aka ChurchNumber
        ( Nothing )
        ( () => Just(getElementByChurchNumberIndex(stack)(index)) ) // index is a Church-Number
    )
    ( () => Just( getElementByJsnumIndex(stack)(index) ) )          // index is a Js-Number


const getElementByIndexOld = stack => index => {
    if (typeof index === "number") {
        return getElementByJsnumIndex(stack)(index)
    } else if (typeof index === "function" ){
        return getElementByChurchNumberIndex(stack)(index)
    }
    console.error( new Error(`No Index type of ${typeof index} allowed. Use a Js- or Church-Number`))
};



const getElementByChurchNumberIndex = s => i =>
    If(leq(i)(size(s)))
    (Then(head((churchSubtraction(size(s))(i))(getPreStack)(s))))
    (Else(Nothing));



const getStackIndex = s => s(stackIndex);

/**
 *  A function that takes a stack and an index. The function returns the element at the passed index
 *
 * @function
 * @param {stack} s
 * @return { function(i:Number) : * } stack-value
 */
// This function is save vor any value of i
const getElementByJsnumIndex = s => i => {
    const times = succ(size(s));
    const initArgsPair = pair(s)(undefined); // Nothing or undefined

    const getElement = argsPair => {
        const stack = argsPair(fst);
        const result = pair(getPreStack(stack));

        // was ist aufwändiger toJsnum oder toChurchNum ?? evtl. hier austauschen
        if (jsNum(getStackIndex(stack)) === i) {
            return result(head(stack));
        }
        return result(argsPair(snd));
    };
    return (times(getElement)(initArgsPair))(snd);
};

const maybeElementByJsnumIndex = s => i => {
    const val = getElementByJsnumIndex(s)(i);
    return If(convertJsBoolToChurchBool(val === undefined))
    (Then(Nothing))
    (Else(Just(val)))
}



//
// const getElementByChurchNumberIndex = s => i =>
//     If(leq(i)(size(s)))
//     (Then(head((churchSubtraction(size(s))(i))(getPreStack)(s))))
//     (Else(Nothing));
//
//
// /**
//  *  A function that takes a stack and an index. The function returns the element at the passed index
//  *
//  * @function
//  * @param {stack} s
//  * @return { function(i:Number) : * } stack-value
//  */
// const getElementByJsnumIndex = s => i => {
//     const times = size(s);
//
//     const initArgsPair = pair(s)(id); // set default to Nothing
//
//     const getElement = argsPair => {
//         const stack = argsPair(fst);
//         const predecessorStack = getPreStack(stack);
//
//         // zero does not come in index
//         if (jsNum((stack)(stackIndex)) === i) {
//             return pair(predecessorStack)(head(stack));
//         }
//
//         return pair(predecessorStack)(argsPair(snd));
//     };
//
//     return (times(getElement)(initArgsPair))(snd);
// };


/**
 *  A function that takes an stack and converts the stack into an array. The function returns an array
 *
 * @param {stack} s
 * @return {Array} Array
 */
const convertStackToArray = reduce(pair((acc, curr) => [...acc, curr])([]));

/**
 *  A function that takes an javascript array and converts the array into a stack. The function returns a stack
 *
 * @param {Array} array
 * @return {stack} stack
 */
const convertArrayToStack = array => array.reduce((acc, curr) => push(acc)(curr), emptyStack);

/**
 *  A function that accepts a stack. The function returns the reversed stack.
 *
 * @param {stack} s
 * @return {stack} stack (reversed)
 */
const reverseStack = s => (reduce(pair((acc, curr) => pair(pop(acc(fst))(fst))(push(acc(snd))(pop(acc(fst))(snd)))) (pair(s)(emptyStack)))(s))(snd);

/**
 *  A function that accepts a map function and a stack. The function returns the mapped stack.
 *
 * @param {function} mapFunc
 * @return function(triple): function(triple)
 */
const mapWithReduce = mapFunc => reduce(pair((acc, curr) => push(acc)(mapFunc(curr)))(emptyStack));

/**
 *  A function that accepts a stack and a filter function. The function returns the filtered stack.
 *
 * @param {function} filterFunc
 * @return {function(reduce:stack): function(stack)} stack
 */
const filterWithReduce = filterFunc => reduce(pair((acc, curr) => filterFunc(curr) ? push(acc)(curr) : acc)(emptyStack));

/**
 *  A function that takes a map function and a stack. The function returns the mapped stack
 *
 * @param {function} mapFunction
 * @return {function(s:stack): stack} stack
 * @example
 * const stackWithNumbers = startStack(pushToStack)(2)(pushToStack)(5)(pushToStack)(6)(id)
 *
 * const stackMultiplied  = map( x => x * 2)(stackWithNumbers)
 *
 * getElementByIndex( stackMultiplied )( 1 ) ===  4
 * getElementByIndex( stackMultiplied )( 2 ) === 10
 * getElementByIndex( stackMultiplied )( 3 ) === 12
 */
const map = mapFunction => s => {
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

/**
 * A function that accepts a stack and a filter function. The function returns the filtered stack
 *
 * @param  {function} filterFunction
 * @return {function(s:stack): stack} pair
 *
 * @example
 * const stackWithNumbers = startStack(pushToStack)(42)(pushToStack)(7)(pushToStack)(3)(id)
 * filter(x => x < 5 && x > 2)(stackWithNumbers) === startStack(pushToStack)(3)(id)
 */
const filter = filterFunction => s => {
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

/**
 *  A function that accepts a stack. The function performs a side effect. The side effect logs the stack to the console.
 *
 * @param {stack} stack
 */
const logStackToConsole = stack =>
    forEach(stack)((element, index) => console.log("At Index " + index + " is the Element " + JSON.stringify(element)))

// const logStackToConsole = stack => {
//
//     const logIteration = (acc, curr) => {
//         const index = acc + 1;
//         console.log('element at: ' + index + ': ' + JSON.stringify(curr));
//         return index;
//     };
//
//     reduce(stack)(pair(logIteration)(0));
// };

/**
 * stackOperationBuilder is the connector for Stack-Operations to have a Builderpattern
 *
 * @function stackOperationBuilder
 * @param {stackOp} stackOp
 * @returns {function(s:stack):  function(x:*): function(f:function): function(Function) } pushToStack
 */
const stackOpBuilder = stackOp => s => x => f => f(stackOp(s)(x));

/**
 * pushToStack is a Stack-Builder-Command to push new values to the current stack
 *
 * @param  {stackOpBuilder} stackOp
 * @returns {function(pushToStack)} pushToStack
 *
 * @example
 * const stackOfWords = startStack(pushToStack)("Hello")(pushToStack)("World")(id)
 * getElementByIndex( stackOfWords )( 1 ) === "Hello"
 * getElementByIndex( stackOfWords )( 2 ) === "World"
 */
const pushToStack = stackOpBuilder(push);


/**
 * Foreach implementation for stack
 * A function that expects a stack and a callback function.
 * The current element of the stack iteration and the index of this element is passed to this callback function
 */
const forEachOld = stack => f => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = s => {
        if(convertToJsBool(hasPre(s))) {
            const element = head(s);
            const index = jsNum(succ(churchSubtraction(times)(size(s))));

            f(element, index);

            return (pop(s))(fst);
        }
        return s;
    };

    times(iteration)(reversedStack);
};


/**
 *
 *
 * @param stack
 * @return {function(callbackFunc:function): void}
 * @example
 * const stackWithNumbers = startStack(pushToStack)(5)(pushToStack)(10)(pushToStack)(15)(id);
 *
 * forEach( stackWithNumbers )( (element, index) => console.log("At Index " + index + " is the Element " + element) );
 *
 * // Console-Output is:
 * // At Index 1 is the Element 5
 * // At Index 2 is the Element 10
 * // At Index 3 is the Element 15
 */
const forEach = stack => callbackFunc => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const invokeCallback = p => {
        const s = p(fst);
        const index = p(snd);
        const element = head(s);

        callbackFunc(element, index);

        return pair(getPreStack(s))(index + 1);
    }

    const iteration = p =>
        If(hasPre(p(fst)))
        (Then(invokeCallback(p)))
        (Else(p));

    times(iteration)(pair(reversedStack)(1));
};

/**
 * Remove element by given Index
 *
 * @param {stack} stack without the element
 * @example
 */
const removeByIndex = stack => index => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = argsTriple => {
        const currentStack = argsTriple(firstOfTriple)
        const resultStack = argsTriple(secondOfTriple)
        const currentIndex = argsTriple(thirdOfTriple)

        return If(hasPre(currentStack))
        (Then(removeByCondition(currentStack)(resultStack)(index)(currentIndex)))
        (Else(argsTriple))
    }

    return (times(iteration)(triple(reversedStack)(emptyStack)(n1)))(secondOfTriple)
}


/**
 *
 * @param {stack} currentStack
 * @return {function(resultStack:stack): function(index:churchNumber|number): function(currentIndex:churchNumber): function(Function): triple}
 */
const removeByCondition = currentStack => resultStack => index => currentIndex => {
    const currentElement = head(currentStack);
    const indexNumber = typeof index === "number" ? toChurchNum(index) : index;
    const condition = eq(indexNumber)(currentIndex);
    const result = If(condition)
    (Then(resultStack))
    (Else(push(resultStack)(currentElement)));

    return triple(getPreStack(currentStack))
    (result)
    (succ(currentIndex));
}


/**
 * Takes two stacks and concate it to one. E.g.:  concat( [1,2,3] )( [1,2,3] ) -> [1,2,3,1,2,3]
 *
 * @param {stack} s1
 * @return {function(s2:stack)} a concated stack
 *
 * @haskell concat :: [a] -> [a] -> [a]
 *
 * @example
 * const elements1      = convertArrayToStack( ["Hello", "Haskell"] );
 * const elements2      = convertArrayToStack( ["World", "Random"] );
 * const concatedStacks = concat( elements1 )( elements2 );
 *
 * jsNum( size( concatedStacks ) )          === 4
 * getElementByIndex( concatedStacks )( 0 ) === id
 * getElementByIndex( concatedStacks )( 1 ) === "Hello"
 * getElementByIndex( concatedStacks )( 2 ) === "Haskell"
 * getElementByIndex( concatedStacks )( 3 ) === "World"
 * getElementByIndex( concatedStacks )( 4 ) === "Random"
 */
const concat = s1 => s2 => { // TODO: what happen when stacks not have same size
    if (s1 === emptyStack) {
        return s2;
    } else if (s2 === emptyStack) {
        return s1;
    } else {
        return reduce(pair((acc, curr) => push(acc)(curr))(s1))(s2);
    }
}

/**
 *
 *
 * @param {stack} stack
 * @return {stack} a flatten stack
 *
 * @example
 * const s1 = convertArrayToStack([1, 2]);
 * const s2 = convertArrayToStack([3, 4]);
 * const s3 = convertArrayToStack([5, 6]);
 * const stackWithStacks = convertArrayToStack([s1, s2, s3]);
 *
 * const flattenStack = flatten(stackWithStacks);
 *
 * jsNum( size( flattenStack ) )          ===  6
 *
 * getElementByIndex( flattenStack )( 0 ) === id
 * getElementByIndex( flattenStack )( 1 ) ===  1
 * getElementByIndex( flattenStack )( 2 ) ===  2
 * getElementByIndex( flattenStack )( 3 ) ===  3
 * getElementByIndex( flattenStack )( 4 ) ===  4
 * getElementByIndex( flattenStack )( 5 ) ===  5
 * getElementByIndex( flattenStack )( 6 ) ===  6
 */
const flatten = reduce(pair((acc, curr) => concat(acc)(curr))(emptyStack));


/**
 *  Zip (combine) with two Stacks and apply a function
 *
 * @haskell zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
 *
 * @param {function} f
 * @return { function(s1:stack): function(s2:stack): stack}
 *
 * @example
 * const add = x => y => x + y;
 * const s1 = convertArrayToStack([1, 2, 3]);
 * const s2 = convertArrayToStack([4, 5, 6]);
 *
 * const zippedStack = zipWith(add)(s1)(s2);
 *
 * jsNum( size( zippedStack ) )          ===  3
 *
 * getElementByIndex( zippedStack )( 0 ) === id
 * getElementByIndex( zippedStack )( 1 ) ===  5
 * getElementByIndex( zippedStack )( 2 ) ===  7
 * getElementByIndex( zippedStack )( 3 ) ===  9
 */
const zipWith = f => s1 => s2 => {
    const size1 = size(s1);
    const size2 = size(s2);

    const reversedStack1 = reverseStack(s1);
    const reversedStack2 = reverseStack(s2);

    const zipElements = t => {
        const s1 = t(firstOfTriple);
        const s2 = t(secondOfTriple);
        const acc = t(thirdOfTriple);

        const element1 = head(s1);
        const element2 = head(s2);

        const result = push(acc)(f(element1)(element2));

        return triple(getPreStack(s1))(getPreStack(s2))(result);
    }

    const iteration = t =>
        If(hasPre(t(firstOfTriple)))
        (Then(zipElements(t)))
        (Else(t));

    const times = If(leq(size1)(size2))
    (Then(size1))
    (Else(size2));

    return times(iteration)(triple(reversedStack1)(reversedStack2)(emptyStack))(thirdOfTriple);
}

// const zipWithOneLiner = f => s1 => s2 => If(leq(size(s1))(size(s2)))(Then(size(s1)))(Else(size(s2)))(t => If(hasPre(t(firstOfTriple)))(Then((triple(getPreStack(t(firstOfTriple)))(getPreStack(t(secondOfTriple)))(push(t(thirdOfTriple))(f(head(t(firstOfTriple)))(head(t(secondOfTriple))))))))(Else(t)))(triple(reverseStack(s1))(reverseStack(s2))(emptyStack))(thirdOfTriple);

const zipWithOneLiner = f => s1 => s2 => ((n => k => (n => n((x => y => x)(x => y => y))(x => y => x))((n => k => k(n(p => (x => y => f => f(x)(y))(p(x => y => y))((n => f => (f => g => x => f(g(x)))(f)(n(f)))(p(x => y => y))))((x => y => f => f(x)(y))(f => a => a)(f => a => a))(x => y => x))(n))(n)(k)))
((s => s(x => y => z => x))(s1))((s => s(x => y => z => x))(s2)))(((s => s(x => y => z => x))(s1)))((x => x)((s => s(x => y => z => x))(s2)))(t => ((s => (f => x => y => f(y)(x))((n => n((x => y => x)(x => y => y))(x => y => x))(s(x => y => z => x))))(t(x => y => z => x)))((((x => y => z => f => f(x)(y)(z))((s => s(x => y => z => y))(t(x => y => z => x)))((s => s(x => y => z => y))(t(x => y => z => y)))((s => x => (x => y => z => f => f(x)(y)(z))((n => f => (f => g => x => f(g(x)))(f)(n(f)))(s(x => y => z => x)))(s)(x))(t(x => y => z => z))(f((s => s(x => y => z => z))(t(x => y => z => x)))((s => s(x => y => z => z))
(t(x => y => z => y))))))))((t)))((x => y => z => f => f(x)(y)(z))((s => (reduce((x => y => f => f(x)(y))((acc, curr) => (x => y => f => f(x)(y))((s => (x => y => f => f(x)(y))(s(x => y => z => y))((s => s(x => y => z => z))(s)))(acc(x => y => x))(x => y => x))((s => x => (x => y => z => f => f(x)(y)(z))((n => f => (f => g => x => f(g(x)))(f)(n(f)))
(s(x => y => z => x)))(s)(x))(acc(x => y => y))((s => (x => y => f => f(x)(y))(s(x => y => z => y))((s => s(x => y => z => z))(s)))(acc(x => y => x))(x => y => y))))((x => y => f => f(x)(y))(s)(emptyStack)))(s))(x => y => y))(s1))((s => (reduce((x => y => f => f(x)(y))((acc, curr) => (x => y => f => f(x)(y))((s => (x => y => f => f(x)(y))(s(x => y => z => y))
((s => s(x => y => z => z))(s)))(acc(x => y => x))(x => y => x))((s => x => (x => y => z => f => f(x)(y)(z))((n => f => (f => g => x => f(g(x)))(f)(n(f)))(s(x => y => z => x)))(s)(x))(acc(x => y => y))((s => (x => y => f => f(x)(y))(s(x => y => z => y))((s => s(x => y => z => z))(s)))(acc(x => y => x))(x => y => y))))((x => y => f => f(x)(y))(s)((x => y => z => f => f(x)(y)(z))
(f => a => a)(x => x))))(s))(x => y => y))(s2))((x => y => z => f => f(x)(y)(z))(f => a => a)(x => x)(x => x)))(x => y => z => z);

// TODO: zip with empyt stacks ?
/**
 *  Zip (combine) two Stack to one stack of pairs
 * @haskell zip :: [a] -> [b] -> [(a, b)]
 *
 * @type {function(triple): function(triple): triple}
 * @example
 * const s1 = convertArrayToStack([1, 2]);
 * const s2 = convertArrayToStack([3, 4]);
 *
 * const zippedStack = zip(s1)(s2);
 *
 * jsNum(size(zippedStack))          === 2
 * getElementByIndex(zippedStack)(0) === id
 * getElementByIndex(zippedStack)(1) === pair(1)(3)
 * getElementByIndex(zippedStack)(2) === pair(2)(4)
 */
const zip = zipWith(pair);


/**
 * Check two stacks of equality.
 *
 * @param {stack} s1
 * @return {function(s2:stack): churchBoolean} True / False
 *
 * @example
 * const s1 = convertArrayToStack([1, 2, 7]);
 * const s2 = convertArrayToStack([1, 2, 3]);
 *
 * stackEquals(s1)(s1) === True
 * stackEquals(s1)(s2) === False
 */
const stackEquals = s1 => s2 => {
    const size1 = size(s1);
    const size2 = size(s2);

    const times = size1;

    const compareElements = t => {
        const s1 = t(firstOfTriple);
        const s2 = t(secondOfTriple);

        const element1 = head(s1);
        const element2 = head(s2);

        const result = convertJsBoolToChurchBool(element1 === element2);

        return triple(getPreStack(s1))(getPreStack(s2))(result);
    }

    const iteration = t =>
        LazyIf(and(hasPre(t(firstOfTriple)))(t(thirdOfTriple)))
        (Then(() => compareElements(t)))
        (Else(() => t));

    return LazyIf(eq(size1)(size2))
    (Then(() => times(iteration)(triple(reverseStack(s1))(reverseStack(s2))(True))(thirdOfTriple))) // should only be executed when needed
        (Else(() => False))
}



const Left   = x => f => g => f (x);
const Right  = x => f => g => g (x);
const either = e => f => g => e (f) (g); // id

const Nothing  = Left();
const Just     = Right ;

const getOrDefault = maybeFn => defaultVal =>
    maybeFn(() => defaultVal)
    (id)


const maybeDiv = num => divisor =>
    Number.isInteger(num) &&
    Number.isInteger(divisor) &&
    divisor !== 0
        ? Just(num / divisor)
        : Nothing

const maybeNumber = val =>
    Number.isInteger(val)
        ? Just(val)
        : Nothing

const maybeFunction = val =>
    typeof val === "function"
        ? Just(val)
        : Nothing

const getJsNumberOrFunction = val =>
    getOrDefault( maybeNumber(val) )( getOrDefault( maybeFunction(val) ) (Nothing) )


const maybeElement = element =>
    element || element === 0
        ? Just(element)
        : Nothing

const maybeDomElement2 = elemId => element =>
    element
        ? Just(element)
        : Right(new Error(`no such element with id: ${elemId}`))

const maybeDomElement = elemId => maybeElement(document.getElementById(elemId))

const withDomElement = elemId => maybeDomElement2(elemId)(document.getElementById(elemId))

const getSafeElementAbstraction = elemId => elementFunction =>
    maybeDomElement(elemId)
    (() => console.error(elemId + " doesn't exist"))
    (elementFunction)

const getSafeElement = elemId =>
    getSafeElementAbstraction(elemId)(id)

const getSafeElements = (...elemIds) => elemIds.map(getSafeElement)

const getSafeElementsAsMaybe = (...elemIds) => elemIds.map(withDomElement)


const testStack1 = push(push(push(emptyStack)(0))(1))(2);
const testStack2 = push(push(push(testStack1)(33))(34))(35);
