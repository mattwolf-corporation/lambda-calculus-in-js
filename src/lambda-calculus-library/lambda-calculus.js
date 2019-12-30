export {I as id, M, K, KI, C, B, T, V, Blackbird, fst, snd, True, False, not, beq, showBoolean, evaluatBoolean, pair, pairMap, showPair}

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
 */

/**
 * a -> a ; Identity (id)
 * @param   {a} x
 * @returns {a} {@link x}
 */
const I = x => x;

/**
 * a -> b -> a ; Kestrel (Constant)
 * @param {a} x
 * @returns { function(y:{b}): {a} } a function that ignores its argument and returns {@link x}
 */
const K = x => y => x;

/**
 * a -> b -> b ; Kite
 * @param {a} x
 * @returns { function(y:{b}): {b} } a function that returns its argument {@link y}
 */
const KI = x => y => y;

/**
 * fn -> fn( fn ) ; Mockingbird
 * @param {fn} f
 * @returns { fn( f:{fn} ) }
 */
const M = f => f(f);

/**
 * fn -> a -> b -> fn( b )( a ) ; Cardinal (flip)
 * @param  {fn} f
 * @returns { function(x:{a}): function(y:{b}): { fn (y:{b}) (x:{a}) } }
 */
const C = f => x => y => f(y)(x);

/**
 * fn -> gn -> a -> fn( gn(a) ) ; Bluebird (Function composition)
 * @param {fn} f
 * @returns { function(g:{gn}): function(x:{a}): { fn( g:{gn}(x:{a}) )} }
 */
const B = f => g => x => f(g(x));

/**
 * a -> fn -> fn( a ) ; Thrush (hold an argument)
 * @param {a} x
 * @returns { function(f:{fn}): { fn( x:{a} )} }
 */
const T = x => f => f(x);

/**
 * a -> b -> fn -> fn(a)(b) ; Vireo (hold pair of args)
 * @param {a} x
 * @returns { function(y:{b}): function(f:{fn})  { fn (x:{a}) (y:{b}) } }
 */
const V = x => y => f => f(x)(y);

/**
 * fn -> gn -> a -> b -> fn( gn(a)(b) ) ; Blackbird (Function composition with two args)
 * @param {fn} f
 * @returns { function(g:{gn}): function(x:{a}): function(y:{b}): { fn( gn (x:{a}) (y:{b}) ) } }
 */
const Blackbird = f => g => x => y => f(g(x)(y));

/**
 * Church Encodings: Booleans
 */
const False = KI;
const True = K;

const not = C;

/**
 * pn -> qn -> pn( qn )(not( qn)) ; Boolean-Equality
 * @param {pn} p
 * @returns { function(q:{qn}): { pn(q:{qn}) (not (q:{qn}) ) } }
 */
const beq = p => q => p(q)(not(q));

const showBoolean = b => b("True")("False");

/**
 *  a -> b -> fn -> fn(a)(b) ; Pair
 * @param {*} x:  first argument of the pair
 * @returns {function} - returns a function, that takes an argument y
 */
const pair = x => y => f => f(x)(y);


const fst = K;
const snd = KI;

const pairMap = f => p => pair(f(p(fst)))(f(p(snd)));

const showPair = p => `${p(fst)} | ${p(snd)}`;


