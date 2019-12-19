export { I as id, M, K, KI, C, B, T, V, Blackbird, fst, snd, True, False, not, beq, showBoolean, pair, pairMap, showPair }

/**
 * A selector function
 * @example fst function or snd function to select the first or second argument of the pair
 * @typedef {(fst | snd)} selector-function
 */

/**
 * Function Application
 * @example f(x)(y) - function application of f with x & y
 * @typedef {*} function-application
 */


/**
 * Combinators
 */
const I = a => a;
const M = f => f(f);
const K = a => b => a;
const KI = a => b => b;
const C = f => a => b => f(b)(a);
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
 * @param {*} x:  first argument of the pair
 * @returns {function} - returns a function, that takes an argument y
 */
const pair = x =>
    /**
     * @param {*} y:  second argument of the pair
     * @returns {function} - returns a function, that takes an argument f
     *
     */
        y =>
        /**
         * @param {selector-function} f: function
         * @returns {function-application} f with arguments x & y
         */
            f => f(x)(y);



const fst = K;
const snd = KI;

const pairMap = f => p => pair(f(p(fst)))(f(p(snd)));

const showPair = p => `${p(fst)} | ${p(snd)}`;