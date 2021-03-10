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
 * @typedef {function} pair
 * @typedef {function} triple
 * @typedef {function} churchBoolean
 */
const generateRandomKey = (length= 6) => Math.random().toString(36).substr(2, length).split('').map(s => Math.round(Math.random()) ? s.toUpperCase() : s.toLowerCase()).join('');


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

/**
 * a -> b -> a ; Kestrel (Constant)
 * @lambda  λx.y.x
 * @haskell Kestrel :: a -> b -> a
 *
 * @function Konstant
 * @param    {*} x
 * @returns  { function(y:*): function(x:*) } a function that ignores its argument and returns x
 */
const K = x => y => x;

/**
 * x -> y -> y ; Kite
 * @lambda  λx.y.y
 * @haskell Kite :: a -> b -> b
 *
 * @function Kite
 * @param    {*} x
 * @returns  { function(y:*): function(y:*) } a function that returns its argument y
 */
const KI = x => y => y;

/**
 * f -> f( f ) ; Mockingbird
 * @lambda  λf.ff
 * @haskell Mockingbird :: f -> f
 *
 * @function Mockingbird
 * @param   {function} f
 * @returns { function({ f: { f } }) } a self-application combinator
 */
const M = f => f(f);

/**
 * f -> x -> y -> f( x )( y ) ; Cardinal (flip)
 * @lambda  λfxy.fxy
 * @haskell Cardinal :: f -> a -> b -> pair
 *
 * @function Cardinal
 * @function flip
 * @param    {function} f
 * @returns  { function(x:*): function(y:*): {f: { y x }} } The Cardinal, aka flip, takes two-argument function, and produces a function with reversed argument order.
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
 * @param   {function} f
 * @returns { function(g:function): function(x:*):  {f: { g:{x} } } } two-fold self-application composition
 *
 * @example
 * B(id)(id)(n7)     === n7
 * B(id)(jsnum)(n7)  === 7
 * B(not)(not)(True) === True
 */
const B = f => g => x => f(g(x));


/**
 * x -> f -> f( x ) ; Thrush (hold an argument)
 *
 * @lambda  λxf.fx
 * @haskell Thrush :: a -> f -> b
 *
 * @function Thrush
 * @param    {*} x
 * @returns  { function(f:function): {f: {x} } } self-application with holden argument
 */
const T = x => f => f(x);


/**
 * x -> y -> f -> f (x)(y) ; Vireo (hold pair of args)
 *
 * @lambda  λxyf.fxy
 * @haskell Vireo :: a -> b -> f
 *
 * @function Vireo
 * @param    {*} x
 * @returns  { function(y:*): function(f:function): {f: {x y} } }
 */
const V = x => y => f => f(x)(y);


/**
 * f -> g -> x -> y -> f( g(x)(y) ) ; Blackbird (Function composition with two args)
 *
 * @lambda  λfgxy.f(gxy)
 * @haskell Blackbird :: f -> g -> a -> b -> c
 *
 * @function
 * @param   {function} f
 * @returns { function(g:function): function(x:*): function(y:*): function({ f:{g: {x y}} }) }
 * @example
 * Blackbird(x => x)    (x => y => x + y)(2)(3) === 5
 * Blackbird(x => x * 2)(x => y => x + y)(2)(3) === 10
 */
const Blackbird = f => g => x => y => f(g(x)(y));

/**
 * x -> y -> y ; {churchBoolean} False Church-Boolean
 * @function
 * @type    churchBoolean
 * @return  KI
 */
const False = KI;

/**
 * x -> y -> x ; {churchBoolean} True Church-Boolean
 * @function
 * @type    churchBoolean
 * @return  K
 */
const True = K;


/**
 * Syntactic sugar for creating a If-Then-Else-Construct
 * Hint: Better use LazyIf to avoid that JavaScript eagerly evaluate both cases (then and else).
 *
 * @param condition
 * @return {function(truthy:churchBoolean): function(falsy:churchBoolean): *}
 * @constructor
 * @example
 * If( eq(n1)(n1) )
 *    (Then( "same"     ))
 *    (Else( "not same" ))
 */
const If = condition => truthy => falsy => condition(truthy)(falsy);

/**
 * Syntactic sugar for creating a If-Then-Else-Construct for lazy Evaluation - it avoid that JavaScript eagerly evaluate both cases (then and else)
 * Important: Use in 'Then' and 'Else' as function without param: () => "your function"
 *
 *
 * @param condition
 * @return {function(truthy:churchBoolean): function(falsy:churchBoolean): *}
 * @constructor
 * @example
 * LazyIf( eq(n1)(n1) )
 *      (Then( () => "same"     ))
 *      (Else( () => "not same" ))
 */
const LazyIf = condition => truthy => falsy => (condition(truthy)(falsy))();

/**
 * Syntactic sugar for If-Construct
 */
const Then = I;
const Else = I;

/**
 * f -> x -> y -> f( x )( y ) ; not ; Cardinal
 *
 * @function
 * @param   {churchBoolean} Church-Boolean
 * @returns {churchBoolean} negation of the insert Church-Boolean
 * @example
 * not(True)      === False;
 * not(False)     === True;
 * not(not(True)) === True;
 */
const not = C;

/**
 * p -> q -> p( q )(False) ; and
 *
 * @function
 * @param   {churchBoolean} p
 * @returns { function(q:churchBoolean): churchBoolean }  True or False
 */
const and = p => q => p(q)(False);

/**
 * p -> q -> p( True )(q) ; or
 *
 * @function
 * @param   {churchBoolean} p
 * @returns { function(q:churchBoolean): churchBoolean }  True or False
 */
const or = p => q => p(True)(q);

/**
 * p -> q -> p( q )( not(qn) ) ; beq (ChurchBoolean-Equality)
 *
 * @function
 * @param   {churchBoolean} p
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
 * @param   {churchBoolean} b
 * @return  {boolean} - true or false
 * @example
 * convertToJsBool(True)  === true;
 * convertToJsBool(False) === false;
 */
const convertToJsBool = b => b(true)(false);

/**
 * b => b ? True : False ; convertJsBoolToChurchBool
 *
 * @function
 * @param   {boolean} b
 * @return  {churchBoolean} - True or False
 * @example
 * convertJsBoolToChurchBool(true)  === True;
 * convertJsBoolToChurchBool(false) === False;
 */
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

const id = x => x;

/**
 * Generic Types
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
 * successor of a church number (with bluebird)
 *
 * @lambda λnfa.f(nfa)
 * @haskell successor :: Number -> a -> b -> Number
 *
 * @function successor
 * @param   {churchNumber} n
 * @returns {function(f:function): churchNumber} successor of n
 */
const succ = n => f => B(f)(n(f));

/**
 * Addition with two Church-Numbers
 *
 * @lambda λnk.n( λnfa.f(nfa) )k
 * @haskell churchAddition :: Number -> Number -> Number
 *
 * @function
 * @param   {churchNumber} n
 * @returns {function(k:churchNumber): churchNumber } Church-Number
 */
const churchAddition = n => k => n(succ)(k);

/**
 * phi combinator
 * creates a new pair, replace first value with the second and increase the second value
 *
 * @function
 * @param   {pair} p
 * @returns {pair} pair
 */
const phi = p => pair(p(snd))(succ(p(snd)));

/**
 * predecessor
 * return the predecessor of passed churchNumber (minimum is n0 aka Zero). Is needed for churchSubtraction
 *
 * @function predecessor
 * @param   {churchNumber} n
 * @returns {churchNumber} predecessor of n
 */
const pred = n => n(phi)(pair(n0)(n0))(fst);

/**
 * Subtraction with two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchNumber } Church-Number
 */
const churchSubtraction = n => k => k(pred)(n);

/**
 * Multiplication with two Church-Numbers
 *
 * @function
 * @param   {churchNumber} n
 * @returns {function(k:churchNumber): churchNumber } Church-Number
 */
const churchMultiplication = B;

/**
 * Potency with two Church-Numbers
 *
 * @function
 * @param   {churchNumber} n
 * @returns {function(k:churchNumber): churchNumber } Church-Number
 */
const churchPotency = T;

/**
 * query if the church number is zero (n0)
 *
 * @function
 * @param  {churchNumber} n
 * @return {churchBoolean} True / False
 */
const is0 = n => n(K(False))(True);

/**
 * converts a js number to a church number
 *
 * @function
 * @param   {number} n
 * @returns {churchNumber} church number of n
 */
const toChurchNum = n => n === 0 ? n0 : succ(toChurchNum(n - 1))

/**
 * converts a church number to a js number
 *
 * @function
 * @param   {churchNumber} n
 * @returns {number} js number of n
 * @example
 * jsNum(n0) === 0
 * jsNum(n1) === 1
 * jsNum(n2) === 2
 * jsNum(n3) === 3
 */
const jsNum = n => n(x => x + 1)(0);


/**
 * "less-than-or-equal-to" with Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const leq = n => k => is0(churchSubtraction(n)(k));

/**
 * "equal-to" with Church-Number
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const eq = n => k => and(leq(n)(k))(leq(k)(n));

/**
 * "greater-than" with Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const gt = Blackbird(not)(leq);

/**
 * max of two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} n / k
 */
const max = n => k => gt(n)(k)(n)(k)

/**
 * min of two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} n / k
 */
const min = n => k => leq(n)(k)(n)(k)


// STACK STACK STACK

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
 * @function
 * @type stack
 * @return {triple} stack as triple
 */
const stack = triple;

/**
 * Representation of the empty stack
 * The empty stack has the size/index zero (has zero elements).
 * The empty stack has no predecessor stack, but the identity function as placeholder.
 * The empty stack has no head ( top value ), but the identity function as placeholder.
 *
 * @function
 * @type stack
 * @return {stack} emptyStack
 */
const emptyStack = stack(n0)(id)(id);


/**
 * A help function to create a new stack
 * @function
 * @type function(Function): Stack
 * @param {function} f
 * @return {stack} emptyStack
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
 * A function that takes a stack. The function returns the index (aka stack-size) of the stack
 *
 * @haskell size :: stack -> churchNumber
 * @function
 * @param {stack} s
 * @return {churchNumber} stack-index as church numeral
 */
const getStackIndex = s => s(stackIndex);

/**
 * A function that takes a stack. The function returns the size (number of elements) in the stack
 *
 * @haskell size :: stack -> churchNumber
 * @function
 * @param {stack} s
 * @return {churchNumber} size (stack-index) as church numeral
 */
const size = getStackIndex;

/**
 * A function that takes argument pair and  a stack.
 * The first argument of the pair must be a reducer function.
 * The second argument of the pair must be a start value.
 * The function reduces the stack using the passed reduce function and the passed start value
 *
 * @haskell reduce :: pair -> stack -> a
 * @function
 * @param  {function} reduceFn
 * @return {function(initialValue:*): function(s:stack): function(stack)} reduced value
 * @example
 * const stackWithNumbers  = convertArrayToStack([0,1,2]);
 *
 * const reduceFunctionSum = (acc, curr) => acc + curr;
 * reduce( reduceFunctionSum )( 0 )( stackWithNumbers )          ===  3
 * reduce( reduceFunctionSum )( 0 )( push(stackWithNumbers)(3) ) ===  5
 *
 * reduce( reduceFunctionSum )( 5 )( stackWithNumbers )          ===  8
 * reduce( reduceFunctionSum )( 5 )( push(stackWithNumbers)(3) ) === 10
 *
 * const reduceToArray = (acc, curr) => [...acc, curr];
 * reduce( reduceToArray )( [] )( stackWithNumbers ) === [0, 1, 2]
 */
const reduce = reduceFn => initialValue => s => {

    const reduceIteration = argsTriple => {
        const stack = argsTriple(firstOfTriple);

        const getTriple = argsTriple => {
            const reduceFunction    = argsTriple(secondOfTriple);
            const preAcc            = argsTriple(thirdOfTriple);
            const curr              = head(stack);
            const acc               = reduceFunction(preAcc, curr);
            const preStack          = stack(stackPredecessor);
            return triple(preStack)(reduceFunction)(acc);
        }

        return If( hasPre(stack) )
        (Then( getTriple(argsTriple) ))
        (Else(           argsTriple  ));
    };

    const times = size(s);
    const reversedStack = times
    (reduceIteration)
    (triple
        (s)
        ((acc, curr) => push(acc)(curr))
        (emptyStack)
    )(thirdOfTriple);

    return times
    (reduceIteration)
    (triple
        (reversedStack)
        (reduceFn)
        (initialValue)
    )(thirdOfTriple);
};




const eitherElementByIndex = stack => index =>
    eitherTryCatch(
        () => eitherFunction(stack) // stack value is NOT a stack aka function
            (_ => Left(`getElementByIndex - TypError: stack value '${stack}' (${typeof stack}) is not allowed. Use a Stack (type of function)`))
            (_ => eitherNaturalNumber(index)
                (_ => eitherElementByChurchIndex(stack)(index))
                (_ => eitherElementByJsNumIndex (stack)(index))
            ))
    (_ => Left(`getElementByIndex - TypError: stack value '${stack}' (${typeof stack}) is not a stack.`)) // catch
        (id) // return value

const eitherElementByChurchIndex = stack => index =>
    eitherFunction(index)
    (_ => Left(`getElementByIndex - TypError: index value '${index}' (${typeof index}) is not allowed. Use Js- or Church-Numbers`))
    (_ => eitherNotNullAndUndefined( getElementByChurchNumberIndex(stack)(index) )
    (_ => Left("invalid index"))
    (e => Right(e))                 );

const eitherElementByJsNumIndex = stack => index =>
    eitherNotNullAndUndefined( getElementByJsnumIndex(stack)(index) )
    (_ => Left("invalid index"))
    (e => Right(e)                  );

const getElementByIndex = stack => index =>
    eitherElementByIndex(stack)(index)
    (console.error)
    (id);


/**
 *  A function that takes a stack and an index as churchNumber. The function returns the element at the passed index
 *
 * @function
 * @param {stack} s
 * @return { function(i:churchNumber) : * } stack-value
 */
const getElementByChurchNumberIndex = s => i =>
    If( leq(i)(size(s)))
    (Then( head( ( churchSubtraction(size(s))(i) )(getPreStack)(s))))
    (Else(undefined));


/**
 *  A function that takes a stack and an index as JsNumber. The function returns the element at the passed index
 *
 * @function
 * @param {stack} s
 * @return { function(i:Number) : * } stack-value
 */
const getElementByJsnumIndex = s => i => {
    if (i < 0){ return; } // negativ index are not allowed

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
    return (times
        (getElement)(initArgsPair)
    )(snd);
};


const getIndexOfElement = s => element => {

    const getIndex = argsPair => {
        const stack  = argsPair(fst);
        const result = pair(getPreStack(stack));

        return If( convertJsBoolToChurchBool(head(stack) === element))
        (Then( result(getStackIndex(stack)) ) )
        (Else( result(argsPair(snd))        ) );
    }

    const times        = succ(size(s));
    const initArgsPair = pair(s)(undefined);

    return (times
        (getIndex)(initArgsPair)
    )(snd);
}

/**
 * A function that takes a stack and an element. The function returns a maybe-Monade Just with the index (ChurchNumber) of the element from the passed stack.
 * Returns Nothing when element does not exist in the stack.
 *
 * @function
 * @param {stack} s
 * @return { function(element:*) : Just|Nothing } Just(withIndex) or Nothing
 */
const maybeIndexOfElement = s => element => {
    const result = getIndexOfElement(s)(element)
    return result === undefined
        ? Nothing
        : Just(result)
}


const containsElement = s => element =>
    maybeIndexOfElement(s)(element)
    ( () => False )
    ( () => True  );



const convertStackToArray = reduce((acc, curr) => [...acc, curr])([]);

const convertArrayToStack = array => array.reduce((acc, curr) => push(acc)(curr), emptyStack);

const reverseStack = s => (reduce((acc, curr) => pair(pop(acc(fst))(fst))(push(acc(snd))(pop(acc(fst))(snd))))(pair(s)(emptyStack))(s))(snd);


const mapWithReduce = mapFunc => reduce((acc, curr) => push(acc)(mapFunc(curr)))(emptyStack);


const filterWithReduce = filterFunc => reduce((acc, curr) => filterFunc(curr) ? push(acc)(curr) : acc)(emptyStack);

const map = mapFunction => s => {

    const mapIteration = argsPair => {
        const _stack       = argsPair(snd);
        const _mappedValue = mapFunction(head(_stack));
        const _resultStack = push(argsPair(fst))(_mappedValue);
        return pair(_resultStack)(getPreStack(_stack));
    };

    const times        = size(s);
    const initArgsPair = pair(emptyStack)(reverseStack(s));

    return (times
        (mapIteration)(initArgsPair)
    )(fst);
};

/**
 * A function that accepts a stack and a filter function. The function returns the filtered stack
 *
 * @param  {function} filterFunction
 * @return {function(s:stack): stack} pair
 *
 * @example
 * const stackWithNumbers = convertArrayToStack([42,7,3])
 *
 * filter(x => x < 20 && x > 5)(stackWithNumbers) === convertArrayToStack([7])
 */
const filter = filterFunction => s => {

    const filterIteration = argsPair => {
        const _stackFilter    = argsPair(fst);
        const _stack          = argsPair(snd);
        const _nextValueStack = getPreStack(_stack)
        const _stackCurrValue = head(_stack);

        if (filterFunction(_stackCurrValue)) {
            const resultStack = push(_stackFilter)(_stackCurrValue);
            return pair(resultStack)(_nextValueStack);
        }

        return pair(_stackFilter)(_nextValueStack);
    };

    const times = size(s);
    const initArgsPair = pair(emptyStack)(reverseStack(s));

    return (times
        (filterIteration)(initArgsPair)
    )(fst);
};

/**
 *  A function that accepts a stack. The function performs a side effect. The side effect logs the stack to the console.
 *
 * @param {stack} stack
 */
const logStackToConsole = stack =>
    forEach(stack)((element, index) => console.log("At Index " + index + " is the Element " + JSON.stringify(element)))


/**
 * stackOperationBuilder is the connector for Stack-Operations to have a Builderpattern
 *
 * @function stackOperationBuilder
 * @param   {stackOp} stackOp
 * @returns {function(s:stack):  function(x:*): function(f:function): function(Function) } pushToStack
 */
const stackOpBuilder = stackOp => s => x => f => f(stackOp(s)(x));



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
        if (convertToJsBool(hasPre(s))) {
            const element = head(s);
            const index = jsNum(succ(churchSubtraction(times)(size(s))));

            f(element, index);

            return (pop(s))(fst);
        }
        return s;
    };

    times
    (iteration)(reversedStack);
};


/**
 * Foreach implementation for stack
 * A function that expects a stack and a callback function.
 * The current element of the stack iteration and the index of this element is passed to this callback function
 *
 * @param stack
 * @return {function(callbackFunc:function): void}
 * @example
 * const stackWithNumbers = convertArrayToStack([5,10,15])
 *
 * forEach( stackWithNumbers )( (element, index) => console.log("At Index " + index + " is the Element " + element) );
 *
 * // Console-Output is:
 * // At Index 1 is the Element 5
 * // At Index 2 is the Element 10
 * // At Index 3 is the Element 15
 */
const forEach = stack => callbackFunc => {

    const invokeCallback = p => {
        const _stack   = p(fst);
        const _index   = p(snd);
        const _element = head(_stack);

        callbackFunc(_element, _index);

        return pair( getPreStack(_stack) )(_index + 1 );
    }

    const iteration = p =>
        If( hasPre(p(fst)) )
        (Then( invokeCallback(p) ))
        (Else(                p  ));

    const times         = size(stack);
    const reversedStack = reverseStack(stack);

    times
    (iteration)( pair(reversedStack)(1) );
};

/**
 * Remove element by given Index
 *
 * @param {stack} stack without the element
 * @example
 */
const removeByIndex = stack => index => {
    const times         = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = argsTriple => {
        const currentStack = argsTriple(firstOfTriple)
        const resultStack  = argsTriple(secondOfTriple)
        const currentIndex = argsTriple(thirdOfTriple)

        return If(hasPre(currentStack))
        (Then( removeByCondition(currentStack)(resultStack)(index)(currentIndex) ))
        (Else( argsTriple                                                        ));
    }

    return times
    (iteration)
    (triple
        ( reversedStack )
        ( emptyStack    )
        ( n1            )
    )(secondOfTriple)
}


/**
 *
 * @param  {stack} currentStack
 * @return {function(resultStack:stack): function(index:churchNumber|number): function(currentIndex:churchNumber): triple}
 */
const removeByCondition = currentStack => resultStack => index => currentIndex => {
    const currentElement    = head(currentStack);
    const indexNumber       = typeof index === "number" ? toChurchNum(index) : index;
    const result            = If( eq(indexNumber)(currentIndex) )
    (Then( resultStack ))
    (Else( push( resultStack )( currentElement )));

    return triple
    ( getPreStack(currentStack) )
    ( result                    )
    ( succ(currentIndex)        );
}



const concat = s1 => s2 =>
    s1 === emptyStack
        ? s2
        : s2 === emptyStack
        ? s1
        : reduce((acc, curr) => push(acc) (curr)) (s1) (s2);

const flatten = reduce( (acc, curr) => concat( acc )( curr ) )(emptyStack);



const zipWith = f => s1 => s2 => {

    const zipElements = t => {
        const s1    = t(firstOfTriple);
        const s2    = t(secondOfTriple);
        const acc   = t(thirdOfTriple);

        const element1 = head(s1);
        const element2 = head(s2);

        const result = push(acc)(f(element1)(element2));

        return triple
        (getPreStack(s1))
        (getPreStack(s2))
        (result);
    }

    const iteration = t =>
        If(hasPre(t(firstOfTriple)))
        (Then(zipElements(t)))
        (Else(t));

    const times = min(size(s1))(size(s2));

    return times
    (iteration)
    (triple
        (reverseStack(s1))
        (reverseStack(s2))
        (emptyStack)
    )
    (thirdOfTriple);
}



const zip = zipWith(pair);

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

        return triple
        (getPreStack(s1))
        (getPreStack(s2))
        (result);
    }

    const iteration = t =>
        LazyIf( and( hasPre( t(firstOfTriple)) )( t(thirdOfTriple)) )
        (Then(() => compareElements(t)))
        (Else(() => t));

    return LazyIf( eq(size1)(size2) )
    (Then(() => times                       // should only be executed when needed
        (iteration)
        (triple
        (reverseStack(s1))
        (reverseStack(s2))
        (True))
        (thirdOfTriple))
    )
    (Else(() => False));
};




const Left   = x => f => _ => f (x);
const Right  = x => _ => g => g (x);
const either = id;

const Nothing  = Left();
const Just     = Right ;


/**
 * unpacks the Maybe element if it is there, otherwise it returns the default value
 *
 * @param maybe
 * @return {function(defaultVal:function): *} maybe value or given default value
 * @example
 * getOrDefault( maybeDiv(6)(2) )( "Can't divide by zero" ) === 3
 * getOrDefault( maybeDiv(6)(0) )( "Can't divide by zero" ) === "Can't divide by zero"
 */
const getOrDefault = maybe => defaultVal =>
    maybe
    (() => defaultVal)
    (id);

/**
 *
 * @param  {number} dividend
 * @return {function(divisor:number): function(Just|Nothing)} a Maybe (Just with the divided value or Nothing)
 */
const maybeDivision = dividend => divisor =>
    Number.isInteger(dividend) &&
    Number.isInteger(divisor) &&
    divisor !== 0
        ? Just(dividend / divisor)
        : Nothing;

const eitherTruthy = value =>
    value
        ? Right(value)
        : Left(`'${value}' is a falsy value`);

const eitherNotNullAndUndefined = value =>
    value !== null && value !== undefined
        ? Right(value)
        : Left(`element is '${value}'`);

/**
 * Take the element as maybe value if the element is a truthy value inclusive number Zero
 * @param  {*} element
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeTruthy = element =>
    eitherTruthy(element)
    (_ => Nothing)
    (_ => Just(element));

const eitherElementOrCustomErrorMessage = errorMessage => element =>
    eitherTruthy(element)
    (_ => Left(errorMessage))
    (_ => Right(element));

/**
 *
 * @param  {string} elemId
 * @return {Left|Right} either Right with HTMLElement or Left with Error
 */
const eitherDomElement = elemId =>
    eitherElementOrCustomErrorMessage(`no element exist with id: ${elemId}`)(document.getElementById(elemId));


const maybeDomElement = elemId =>
    eitherDomElement(elemId)
    (_ => Nothing)
    (e => Just(e));

/**
 *
 * @param  {string} elemId
 * @return {HTMLElement|undefined} HTMLElement when exist, else undefined
 */
const getDomElement = elemId =>
    eitherDomElement(elemId)(console.error)(id);

const getDomElements = (...elemIds) =>
    elemIds.map(getDomElement);

const maybeNumber = val =>
    eitherNumber(val)
    (_ => Nothing)
    (_ => Just(val));

const eitherNumber = val =>
    Number.isInteger(val)
        ? Right(val)
        : Left(`'${val}' is not a integer`);

const maybeFunction = val =>
    eitherFunction(val)
    (_ => Nothing)
    (_ => Just(val))

const eitherFunction = val =>
    typeof val === "function"
        ? Right(val)
        : Left(`'${val}' is not a function`);

const eitherTryCatch = f => {
    try {
        return Right(f());
    } catch (error) {
        return Left(error);
    }
}

const eitherNaturalNumber = val =>
    Number.isInteger(val) && val >= 0
        ? Right(val)
        : Left(`'${val}' is not a natural number`);

// Haskell: (a -> Maybe a) -> [a] -> Maybe [a]
const maybeElementsByFunction = maybeProducerFn => (...elements) =>
    reduce
    ((acc, curr) =>
        flatMapMaybe(acc)(listMap =>
            mapMaybe( maybeProducerFn(curr) )(val => push(listMap)( pair(curr)(val) ))
        )
    )
    ( Just(emptyListMap) )
    ( convertArrayToStack(elements) );


// Beispiel: key => maybeFunc(key) ||  [Just(elem1), Just(Elem2), Nothing, Just(Elem3)] => Just([elem1, elem2, Elem3])
const eitherElementsOrErrorsByFunction = eitherProducerFn => (...elements) =>
    reduce
    ((acc, curr) => acc
        ( stack => Left( (eitherProducerFn(curr))
            (err => push(stack)(err))
            (_   => stack)
            )
        )
        ( listMap => (eitherProducerFn(curr))
            (err => Left(  push(emptyStack)(err)            ) )
            (val => Right( push(listMap)( pair(curr)(val) ) ) )
        )
    )
    ( Right(emptyListMap) )
    ( convertArrayToStack(elements) );



const listMap = stack

/**
 * Representation of the empty stack
 * The empty listMap has the size/index zero (has zero elements).
 * The empty listMap has no predecessor stack, but the identity function as placeholder.
 * The empty listMap has no head ( top value ), but a pair of two identity functions as placeholder.
 *
 * @type {function(Function): {f: {index, predecessor, head}}}
 */
const emptyListMap = listMap(n0)(id)(pair(id)(id));


const startListMap = f => f(emptyListMap);


const convertObjToListMap = obj => Object.entries(obj).reduce((acc, [key, value]) => push(acc)(pair(key)(value)), emptyListMap);


const getElementByKey = listMap => key => {
    const times = size(listMap);
    const initArgsPair = pair(listMap)(id);

    const getElement = argsPair => {
        const stack = argsPair(fst);
        const predecessorStack = (stack)(stackPredecessor);
        const currentKeyValPair = head(stack);
        if (currentKeyValPair(fst) === key) {
            return pair(predecessorStack)(currentKeyValPair(snd));
        }
        return pair(predecessorStack)(argsPair(snd));
    };

    return (times(getElement)(initArgsPair))(snd);
};


const removeByKey = listMap => key => {
    const times = size(listMap);
    const reversedStack = reverseStack(listMap);

    const iteration = argsPair => {
        const currentStack = argsPair(fst)
        const resultStack = argsPair(snd)

        return If(hasPre(currentStack))
        (Then(removeByCon(currentStack)(resultStack)(key)))
        (Else(argsPair));
    }

    return (times
        (iteration)
        (pair(reversedStack)(emptyListMap))
    )(snd);
}


const removeByCon = currentStack => resultStack => key => {
    const currentKeyValPair = head(currentStack);
    const currentElement = currentKeyValPair(snd);
    const currentKey = currentKeyValPair(fst);
    const result = key === currentKey
        ? resultStack
        : push(resultStack)(pair(currentKey)(currentElement));

    return pair(getPreStack(currentStack))(result);
}

const mapListMap = f => map(p => pair(p(fst))(f(p(snd))));

const filterListMap = f => filter(p => f(p(snd)));

const reduceListMap = f => reduce((acc, curr) => f(acc, curr(snd)));

const observableBody = listeners => value => obsFn =>
    obsFn(listeners)(value)


const Observable = initialValue =>
    observableBody(emptyListMap)(initialValue)(setValue)(initialValue)



const setValue = listeners => oldValue => newValue => {
    forEach(listeners)((listener, _) => (listener(snd))(newValue)(oldValue))
    return observableBody(listeners)(newValue)
}


const addListener = listeners => value => newListener => {
    newListener(snd)(value)(value)
    return observableBody(push(listeners)(newListener))(value)
}



const getValue = listeners => value => value;

/**
 * listeners -> value -> listenerKey ; removeListenerByKey
 * Remove a Listener by his key
 * @extends observableBody
 *
 * @haskell removeListenerByKey :: [a] -> b -> c
 *
 * @function
 * @param {listMap} listeners
 * @return {function(value:*): function(listenerKey:*)}
 * @example
 * let observedObject = {};
 * const listenerValue = newListenerWithCustomKey( 42 )( listenerNewValueToElement (valueHolder) );
 *
 * let obsExample = Observable(0)
 *                      (addListener)(listenerValue)
 *
 * observedObject.value === 0  // variable "observedObject" get updated from InitialValue
 * obsExample = obsExample(setValue)(11)
 * observedObject.value === 11  // variable "observedObject" get updated
 *
 * obsExample = obsExample(removeListenerByKey)(42) // 'listenerValue' is removed as listener
 *
 * obsExample = obsExample(setValue)(66)
 * observedObject.value === 11  // variable "observedObject" getting no updates anymore
 */
const removeListenerByKey = listeners => value => listenerKey =>
    observableBody(removeByKey(listeners)(listenerKey))(value)


/**
 * listeners -> value -> listenerKey ; removeListenerByKey
 * Remove a Listener by his key
 * @extends observableBody
 *
 * @haskell removeListenerByKey :: [a] -> b -> c
 *
 * @function
 * @param {listMap} listeners
 * @return {function(value:*): function(listenerKey:*)}
 * @example
 * let observedObject = {};
 * const listenerValue = newListener( listenerNewValueToElement (valueHolder) );
 *
 * let obsExample = Observable(0)
 *                      (addListener)(listenerValue)
 *
 * observedObject.value === 0  // variable "observedObject" get updated from InitialValue
 *
 * obsExample = obsExample(setValue)(11)
 *
 * observedObject.value === 11  // variable "observedObject" get updated
 *
 * obsExample = obsExample(removeListener)(listenerValue)
 *
 * obsExample = obsExample(setValue)(66)
 *
 * observedObject.value === 11  // variable "observedObject" getting no updates anymore
 */
const removeListener = listeners => value => handler =>
    observableBody(removeByKey(listeners)(handler(fst)))(value)

// Observable Tools
const logListenersToConsole = listeners => _ => {
    const logIteration = (acc, curr) => {
        const index = acc + 1;
        const val = typeof (curr) === 'object' ? JSON.stringify(curr) : curr;
        console.log('element at: ' + index + ': ' + showPair(val));
        return index;
    };
    reduce(logIteration)(0)(listeners);
};

/**
 * Syntactic sugar for creating a pair of Key and Value for the new Listener.
 * The key could be anything that can be comparable. (Hint: Functions are not comparable except they have a notation like n1, n2, id, pair ... etc.)
 * The listenerFn takes two arguments "newValue" and "oldValue" from the the observable. Some Listener-Function are available and ready to use.
 *
 * @function
 * @param  {*} key
 * @return {function(listenerFn:function) : listener} new listener with custom key for the observable
 * @example
 * let listenerLogTest = newListener(nValue => oValue => console.log(nValue, oValue);
 *
 * listenerTest = setListenerKey(42)(listenerTest)
 *
 * getListenerKey(listenerTest) === 42)
 */
const newListenerWithCustomKey = key => listenerFn => pair(key)(listenerFn);

/**
 * Syntactic sugar for creating a pair of Key and Value for the new Listener.
 * The key could be anything that can be comparable. The 'generateRandomKey' generate String with the length of six with random Letters (up-/lowercase) & Numbers.
 * The listenerFn takes two arguments "newValue" and "oldValue" from the the observable. Some Listener-Function are available and ready to use.
 *
 * @function
 * @param  {function} listenerFn
 * @return {listener} new listener with generated key for the observable
 * @example
 * let listenerLogTest = newListener(nValue => oValue => console.log(nValue, oValue);
 *
 * listenerTest = setListenerKey(42)(listenerTest)
 *
 * getListenerKey(listenerTest) === 42)
 */
const newListener = listenerFn => pair(generateRandomKey())(listenerFn);

/**
 * Set a new Key for the listener.
 * @param  {*} newKey
 * @return {function(listener:function) : listener} listener with the key
 * @example
 * let listenerLogTest = newListener(nValue => oValue => console.log(nValue, oValue);
 *
 * listenerTest = setListenerKey(42)(listenerTest)
 *
 * getListenerKey(listenerTest) === 42)
 */
const setListenerKey = newKey => listener => pair(newKey)(listener(snd));

/**
 * Get the key of a listener
 * @param  {function} listener
 * @return {*} key
 * @example
 * let listenerLogTest = newListener(nValue => oValue => console.log(nValue, oValue);
 *
 * listenerTest = setListenerKey(42)(listenerTest)
 *
 * getListenerKey(listenerTest) === 42)
 */
const getListenerKey = listener => listener(fst)

/*
    Listener-Functions
 */
const listenerLogToConsole                        =            nVal => oVal => console.log(`Value: new = ${nVal}, old = ${oVal}`)
const listenerNewValueToElement                   = element => nVal => oVal => element.value = nVal
const listenerNewValueToDomElementTextContent     = element => nVal => oVal => element.textContent = nVal
const listenerOldValueToDomElementTextContent     = element => nVal => oVal => element.textContent = oVal
const listenerNewValueLengthToElementTextContent  = element => nVal => oVal => element.textContent = nVal.length


// Box === Monade
const Box = x => mapf(x)(id);                     // Box.of
const mapf = x => f => g => g(f(x));               // Box.map
const fold = x => f => f(x);   // T         // map and then get content out of the box
const chain = x => f => g => g((f(x)(id)));         // Box.flatMap
const apply = x => f => g => g(f(mapf)(x)(id));     // Box Applicative
const getContent = b => b(id)                       // get Content out of the box (unwrap)

const liftA2 = f => fx => fy =>
    fx(mapf)(f)(apply)(fy)

const debug = x => {
    console.log(x);
    return x;
}


// maybe box methods
const mapMaybe = maybe => f => maybe(() => maybe)(x => Just(f(x)));  // maybe.map
const flatMapMaybe = maybe => f => maybe(() => maybe)(x => f(x));  // maybe.flatmap

const mapfMaybe = x => f => g => g(mapMaybe(x)(f));                     // map (returns a box) --> for chaining
const foldMaybe = mapMaybe;                                             // map and then get Content out of the box
const chainMaybe = x => f => g => g(flatMapMaybe(x)(f));                 // map ant then flatten (returns a box) --> for chaining
// const apMaybe    = x => f => g => g(x(() => x)(func => mapMaybe(f)(func)));
const apMaybe = x => f => g => g(flatMapMaybe(x)(func => mapMaybe(f)(func)));

const liftA2Maybe = f => fx => fy =>
    Box(fx)
    (mapfMaybe)(f)
    (apMaybe)(fy)

// should be the only try and catch in code basis !
const tryCatch = f => {
    try {
        return Right(f());
    } catch (error) {
        return Left(error);
    }
}


const DataFlowVariable = howto => {
    let value = undefined;
    return () => {
        if (value !== undefined) {
            return value
        }
        value = howto();
        return value;
    }
};

const jokeUrl = "https://api.chucknorris.io/jokes/random";
const jokeUrlDelay = "http://slowwly.robertomurray.co.uk/delay/2000/url/https://api.chucknorris.io/jokes/random"; // delay 2 secons

const HttpGet = url => callback => {
    const xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = () =>
        (xmlHttp.readyState > 1 && xmlHttp.readyState < 4)
            ? (xmlHttp.status < 200 || xmlHttp.status >= 300) ? xmlHttp.abort() : () => console.log("not readystate: " + xmlHttp.readyState)
            : (xmlHttp.readyState === 4 && xmlHttp.status >= 200 && xmlHttp.status < 300) ? callback(xmlHttp.responseText) : () => console.error("error fetch data")


    xmlHttp.open("GET", url, true);
    xmlHttp.timeout = 30 * 1000;                     //30 seconds
    xmlHttp.ontimeout = () => console.error("timeout after 30 seconds");
    xmlHttp.send();
}

const HttpGetAsync = url => callback => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () =>
        (xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === 200)
            ? callback(xmlHttp.response)
            : new Error("god damnit")
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send();
}



const HttpGetSync = url => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send();
    return xmlHttp.response;
}

const logListMapToConsole = listMap =>
    forEach(listMap)((element, index) => console.log("At Index " + index + " is Key and Element " + JSON.stringify(element(fst)) + " | " + JSON.stringify(element(snd)) ));

