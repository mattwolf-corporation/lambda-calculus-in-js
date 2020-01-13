import {B, K, T, True, False, and, or, pair, fst, snd, Blackbird, not} from "./lambda-calculus.js";

export { n0, n1, n2, n3, n4, n5, n6, n7, n8, n9,
    succ, pred, phi, churchAddition, churchSubtraction,
    churchMultiplication, churchPotency, is0, jsnum, eq, leq, gt
}


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
 * @param n {churchNumber} -
 * @returns successor of n
 */
const successor = n => f => a => f(n(f)(a));

/**
 * successor with bluebird
 * @param n {churchNumber} -
 * @returns {function(*=): function(*=): *}
 */
const succ = n => f => B(f)(n(f));

/**
 * phi combinator
 * creates a new pair
 * @param p - pair
 * @returns a pair
 */
const phi = p => pair(p(snd)) (succ(p(snd)));

/**
 * predecessor
 * @param n {churchNumber}
 * @returns predecessor of n
 */
const pred = n => n(phi) (pair(n0)(n0)) (fst);

// Arithmetic operation with Church-Numbers
// TODO: document
const churchAddition        = n1 => n2 => n1(succ)(n2);
const churchSubtraction     = n => k => k(pred)(n);
const churchMultiplication  = B;
const churchPotency         = T;

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
const leq = n1 => n2 => is0(churchSubtraction(n1)(n2));

/**
 * "equal-to" with Church-Number
 * @param n1 {churchNumber} -
 * @return {function(n2:{churchNumber}): churchBoolean} True / False
 */
const eq = n1 => n2 => and(leq(n1)(n2))(leq(n2)(n1));


/**
 * "greater-than" with Church-Numbers
 * @param n1 {churchNumber} -
 * @return {function(n2:{churchNumber}): churchBoolean} True / False
 */
const gt = Blackbird(not)(leq);