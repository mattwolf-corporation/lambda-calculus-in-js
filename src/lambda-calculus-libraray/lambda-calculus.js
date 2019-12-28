export {I as id, M, K, KI, C, B, T, V, Blackbird, fst, snd, True, False, not, beq, showBoolean, pair, pairMap, showPair}

/**
 * Generic Types
 * @typedef {*} a
 * @typedef {*} b
 * @typedef {*} c
 * @typedef {(a|b|c)} abc
 *
 * @typedef {function} fn
 */


/**
 * Combinators
 */

/**
 * a -> a ; Identity
 * @param   {a} x
 * @returns {a} {@link x}
 */
const I = x => x;

/**
 * a -> b -> a ; Constant
 * @param {a} x
 * @returns {function({b}): {a}} a function that ignores its argument and returns {@link x}
 */
const K = x => y => x;

/**
 * a -> b -> b ; Kite
 * @param {a} x
 * @returns {function({b}): {b}} a function that returns its argument {@link y}
 */
const KI = x => y => y;

/**
 * fn -> fn( fn ) ; Mockingbird
 * @param {fn} f
 * @returns TODO
 */
const M = f => f(f);

/**
 * fn -> a -> b -> fn( b )( a ) ; Cardinal
 * @param  {fn} f
 * @returns {function(fst:{a}): function(snd:{b}) } returns a function that hold two arguments
 */
const C = f => x => y => f(x)(y);


const B = f => g => a => f(g(a));
const T = a => f => f(a);
const V = a => b => f => f(a)(b);
const Blackbird = f => g => a => b => f(g(a)(b));

/**
 * Church Encodings: Booleans
 */
const False = KI;
const True = K;

const not = C;
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


