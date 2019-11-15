

// export { calc, minus, add, pow, multi, div }

import { id  } from "../LambdaCalculus/lambda.js";


// ------------------------------------------------------
// --------- Calculator with JS arithmetic --------------
// ------------------------------------------------------

// some arithmetic operator
const plus           = n1 => n2 => n1 + n2;
const multiplication = n1 => n2 => n1 * n2;
const subtraction    = n1 => n2 => n1 - n2;
const exponential    = n1 => n2 => n1 ** n2;
const division       = n1 => n2 => n1 / n2;

// how the calculator handle the operator
const calculatorOperator = op => n1 => n2 => f => f(op(n1)(n2));

// combine the calculator with the arithmetic operator via POINT-FREESTYLE
const add = calculatorOperator(plus);
//                        calculatorOperator (plus);
//                        calculatorOperator (n1 => n2 => n1 + n2)
//  op => n1 => n2 => f => f( op (n1) (n2) ) (n1 => n2 => n1 + n2)
//        n1 => n2 => f => f( (n1 => n2 => n1 + n2) (n1) (n2) )
//        n1 => n2 => f => f( (      n2 => (n1) + n2)      (n2) )
//        n1 => n2 => f => f( (            (n1) + (n2) ) )
//        n1 => n2 => f => f( n1 + n2 ) === add

const multi = calculatorOperator(multiplication);
const minus = calculatorOperator(subtraction);
const pow   = calculatorOperator(exponential);
const div   = calculatorOperator(division);

// end the calculator and print the result
const result = id;

// start the Calculator
const calc = num => op => op(num);

// const innerCalc = num => op => op(num);
// const calc = middle => innerCalc(middle)(result);

// demonstration / test
// const number = calc(5)(multi)(4)(minus)(4)(pow)(2)(div)(8)(add)(10)(result);
// document.writeln( number === 42); // true



// calc(2)(add)(3)(minus)(1)(result)
// num => op => op(num) (2) (add) (3) (minus) (1) (result)
//        op => op(2)  (add) (3) (minus) (1) (result)
//              add(2)       (3) (minus) (1) (result)
//   n1 => n2 => f => f(  (n1) + (n2) ) (2) (3) (minus) (1) (result)
//         n2 => f => f(  2 + (n2) )  (3) (minus) (1) (result)
//               f => f(  2 + 3 )       (minus) (1) (result)
//                minus(  5  )      (1) (result)
//      n1 => n2 => f => f(  (n1) - (n2)  ) (5)      (1) (result)
//            n2 => f => f(  5 - (n2)  )       (1) (result)
//                  f => f(  5 - 1  )   (result)
//                       result(  4  )
//                       x => x(  4  )
//                             (  4  )
//                                4


// ------------------------------------------------------
// --------  Calculator with Church-Numerals ------------
// ------------------------------------------------------

// Print the Church-Numbers as JS-Numbers
const jsnum = f => f(x => x + 1)(0);

// Church-Numbers
const n0 = f => x => x;
const n1 = f => x => f(x);
const n2 = f => x => f(f(x));
const n3 = f => x => f(f(f(x)));
const n4 = f => x => f(f(f(f(x))));
const n5 = f => x => f(f(f(f(f(x)))));
const n6 = f => x => f(f(f(f(f(f(x))))));


const succ = nr => ( f => x => f( nr(f)(x) ) );
// succ(n0)
// succ(fnr => fx => fx)
// nr => ( f => x => f( nr(f)(x) ) )  (fNr => xNr => xNr)
//       ( f => x => f( (fNr => xNr => xNr) (f)(x) ) )
//         f => x => f(x)  === n1


// Arithmetic operation with Church-Numbers

const cAdd = n1 => n2 => n1(succ(n2));
// cAdd (n1) (n1)
// n1 => n2 => n1 (succ (n2) ) (n1) (n1)
// (n1)  (succ (n1) )
// (n1)  (nr => ( f => x => f( nr (f) (x) ) ) (n1))
// (n1)  ( f => x => f(  (n1) (f) (x) ) )
// (f => x => f(x))  ( f => x => f(  (f => x => f(x)) (f) (x) ) )
// (f => x => f(x))  ( f => x => f(  (f => x => f(x)) (f) (x) ) )
// (f => x => f(x))  ( f => x => f(  x => (f) (x))  (x) ) )
// (f => x => f(x))  ( f => x => f( (f) (x) ) )
//  x => ( f => x => f( (f) (x) ) ) (x)
//  ( f => x => f( (f) (x) ) ) === n2
