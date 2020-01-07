import {B, K, True, False, pair, fst, snd, } from "./lambda-calculus.js";

export { n0, n1, n2, n3, n4, n5, n6, n7, n8, n9,
    succ, pred, phi, is0, jsnum
}

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
 * @param n {church-number} -
 * @returns successor of n
 */
const successor = n => f => a => f(n(f)(a));

/**
 * successor with bluebird
 * @param n {church-number} -
 * @param f {function} -
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
 * @param n {church-number}
 * @returns predecessor of n
 */
const pred = n => n(phi) (pair(n0)(n0)) (fst);


/**
 * query if the church number is zero (n0)
 * @param n {church-number}
 * @return {churchBoolean} True / False
 */
const is0 = n => n(K(False))(True);

/**
 * converts a church number to a js number
 * @param n {church-number} -
 * @returns {number} js number of n
 */
const jsnum = n => n(x => x + 1)(0);