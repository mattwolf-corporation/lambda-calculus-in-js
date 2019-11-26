/**
 * A church number
 * @typedef {church-number} church-number
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
 * Boolean logic
 */
const F = KI;
const True = K;


// Math-Operations
const add = n1 => n2 => n1 + n2;
const multiply = n1 => n2 => n1 * n2;

const multiplyTwo = multiply(2);
const addTen = add(10);

/**
 *
 * ############ purely functional data structures ############
 *
 */

/**
 * Pair Construction
 */
const pair = x => y => f => f(x)(y);
const fst = K;
const snd = KI;

const pairMap = f => p => pair(f(p(fst)))(f(p(snd)));


// Pair-Operation abstraction
const pairOp = op => p => pair(op(p(fst))(p(snd)));

// pair addition: addition of the two values from the pair
const pairAdd = pairOp(add);

// pair multiply: multiply of the two values from the pair
const pairMultiply = pairOp(multiply());

// Test values for debugging
const p1 = pair(3)(5);
const p2 = pair(2)(7);

const g = x => x + 1;
const f = x => x * 2;


const compose = f1 => f2 => n1 =>  f2(f1(n1)); // Plus
const calculatorOperator = op => f1 => f2 => f => f(op(f2(f1)));

const comp = f => compose(f);

const calc = f1 => op => op(f1);


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
const succ = n => f => a => f(n(f)(a));

/**
 * converts a church number to a js number
 * @param n {church-number} -
 * @returns {number} js number of n
 */
const jsnum = n => n(x => x + 1)(0);


/**
 * successor with bluebird
 * @param n {church-number} -
 * @param f {function} -
 * @returns {function(*=): function(*=): *}
 */
const successor = n => f => B(f)(n(f));


/**
 * addition with church number
 * n times successor of k
 * @param n {church-number} - first church number
 * @param k {church-number} - second church number
 * @returns {function(*=): *}
 */
const addition = n => k => n(succ)(k);


/**
 * addition with church numbers (after eta reduction)
 * @param n {church-number} - first church number
 * @returns {*}
 */
const additionShort = n => n(succ);

/**
 * Multiply of two church numbers
 * Multiply of 2 church numbers is just the composition of these functions
 */
const multiplication = B;


/**
 * pow can be done with the trush-combinator
 */
const potency = T;
const zeroPair = pair(n0)(n0);


/**
 * phi combinator -
 * creates a new pair
 * @param p - pair
 */
const phi = p => pair(p(snd))(succ(p(snd)));

/**
 *
 * @param n {church-number}
 * @returns predecessor of n
 */
const pred = n => n(phi)(pair(n0)(n0))(fst);
const subtraction = n => k => k(pred)(n);

const is0 = n => n(K(F))(True);


/**
 * Church Calculation
 */
 const churchOp = op => n1 => n2 => f => f(op(n1)(n2));

 const churchAdd = churchOp(addition);
 const churchMultiply = churchOp(multiplication);
 const churchPow = churchOp(potency);
 const churchSub = churchOp(subtraction);

 const startChurchCalc = n => op => op(n);

/**
 * Church calculation  ((((2 + 3) * 2) ^ 2) - 1) = 99
 */
const churchResult = jsnum(startChurchCalc
                                (n2)(churchAdd)(n3)
                                    (churchMultiply)(n2)
                                    (churchPow)(n2)
                                    (churchSub)(n1)
                                (I));
const subtractionResult = jsnum(startChurchCalc
                                    (n9)(churchSub)(n4)
                                        (churchSub)(n2)
                                    (I));
console.log(churchResult);
console.log(subtractionResult);

const q = x => x + 1;
const k = x => x * 2;
const d = x => x + 10;

const compose2 = f => g => k => k(f(g));
const startCompose = f => g => g(f);

// console.log(startCompose(q)(compose2)(k)(compose2)(d)(I)(2));


const list = n2(pair);
console.log(list(1)(2)(3)(4));

