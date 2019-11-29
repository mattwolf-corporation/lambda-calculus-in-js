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
const False = KI;
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
const showPair = p => `${ p(fst) } | ${ p(snd) }`;
/**
 * immutable list of n values
 * List constructed of pairs
 * first value is the size of the list
 */
const list =
        pair
            (pair
                (pair(0)(1))
                (pair(2)(3))
            )
            (pair
                (pair(4)(5))
                (pair(6)(7))
            );

const list3 =
    pair
    (8)
    (pair
        (pair
            (pair(0)(1))
            (pair(2)(3))
        )
        (pair
            (pair(4)(5))
            (pair(6)(7))
        )
    );

const list2 = pair(8)(pair(pair(pair(0)(1))(pair(2)(3)))(pair(pair(4)(5))(pair(6)(7))
        )
    );

/**
 * getter's of list
 */
const get0 = list(fst)(fst)(fst);
const get1 = list(fst)(fst)(snd);
const get2 = list(fst)(snd)(fst);
const get3 = list(fst)(snd)(snd);

const get4 = list(snd)(fst)(fst);
const get5 = list(snd)(fst)(snd);
const get6 = list(snd)(snd)(fst);
const get7 = list(snd)(snd)(snd);

// experiment
const build4 = a => b => c => d => Blackbird(pair)(pair)(a)(b) ((pair)(c)(d));
const build222 = Blackbird(pair)(pair);
const shortPair4 = a => b => (build222(a)(b))(pair);

const build22 = Blackbird(pair)(pair);
const shortPair42 = build222(pair);

const build5 = p1 => p2 => Blackbird(pair)(p1)(p2);
const constructPair = 1;



// const listStarter = size => constructPair(size);
//const randomList = list(8)(1)(2)(3)(4)(5)(6)(7)(8);


// console.log(get0);
// console.log(get1);
// console.log(get2);
// console.log(get3);
// console.log(get4);
// console.log(get5);
// console.log(get6);
// console.log(get7);
// console.log(showPair(list(fst)(snd)));

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
// console.log(churchResult);
// console.log(subtractionResult);

const q = x => x + 1;
const k = x => x * 2;
const d = x => x + 10;

const compose2 = f => g => k => k(f(g));
const startCompose = f => g => g(f);

// console.log(startCompose(q)(compose2)(k)(compose2)(d)(I)(2));


/**
 * stack implementation
 */
const id = I;
const not = C;
const beq = p => q => p(q)(not(q));
const stack = x => y => z => f => f(x)(y)(z);

const show = b => b("True")("False");

const stackHasPred = x => y => z => x;
const stackPredecessor = x => y => z => y;
const stackValue = x => y => z => z;

const emptyStack = stack (False) (id) (id);

const hasPre = s => s(stackHasPred);
const push = s => x => stack (True) (s) (x);

/**
 * has empty stack a predecessor
 */
console.log
            ("has empty stack no predecessor: ", show
                (beq
                    (hasPre(emptyStack))
                    (False)
                )
            );

console.log
("has non-empty stack a predecessor: ", show
    (beq
        (hasPre(push(emptyStack)(id)))
        (True)
    )
);


