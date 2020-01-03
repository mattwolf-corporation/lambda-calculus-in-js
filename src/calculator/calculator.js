export {
    calc, result, add, multi, sub, pow, div, churchAdd, churchMulti, churchSub, churchPow
}

import {n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, pred, succ, jsnum} from '../lambda-calculus-library/church-numerals.js'
import {id, T, B} from '../lambda-calculus-library/lambda-calculus.js'


// ------------------------------------------------------
// --------  Calculator ------------
// ------------------------------------------------------
// how the calculator handle the operator
const calculatorOperator = op => n1 => n2 => f => f(op(n1)(n2));

// end the calculator and print the result
const result = id;

// start the Calculator_experiment
const calc = num => op => op(num);



// ------------------------------------------------------
// --------  Calculation with JS-Nums ------------
// ------------------------------------------------------
// some arithmetic operator
const plus = n1 => n2 => n1 + n2;
const multiplication = n1 => n2 => n1 * n2;
const subtraction = n1 => n2 => n1 - n2;
const exponentiation = n1 => n2 => n1 ** n2;
const division = n1 => n2 => n1 / n2;

// combine the calculator with the arithmetic operator via POINT-FREESTYLE
const add = calculatorOperator(plus);
const multi = calculatorOperator(multiplication);
const sub = calculatorOperator(subtraction);
const pow = calculatorOperator(exponentiation);
const div = calculatorOperator(division);

// demonstration / test
const number = calc(5)(multi)(4)(sub)(4)(pow)(2)(div)(8)(add)(10)(result);
console.log(number === 42); // true


// ------------------------------------------------------
// --------  Calculation with Church-Numerals ------------
// ------------------------------------------------------


// Arithmetic operation with Church-Numbers
const churchAddition = n1 => n2 => n1(succ)(n2);
const churchSubtraction = n => k => k(pred)(n);
const churchMultiplication = B;
const churchPotency = T;

// combine the calculator with the church arithmetic operator via POINT-FREESTYLE
const churchAdd = calculatorOperator(churchAddition);
const churchMulti = calculatorOperator(churchMultiplication);
const churchPow = calculatorOperator(churchPotency);
const churchSub = calculatorOperator(churchSubtraction);

/**
 * Church calculation  ((((2 + 3) * 2) ^ 2) - 1) = 99
 */
const churchResult = jsnum(calc
(n2)(churchAdd)(n3)
(churchMulti)(n2)
(churchPow)(n2)
(churchSub)(n1)
(result));

const subtractionResult = jsnum(calc
(n9)(churchSub)(n4)
(churchSub)(n2)
(result));

