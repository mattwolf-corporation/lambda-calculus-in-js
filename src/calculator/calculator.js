export {
    calc, result, add, multi, sub, pow, div, churchAdd, churchMulti, churchSub, churchPow
}

import { n0, n1, n2, n3, n4, n5, n6, n7, n8, n9,
    succ, pred, phi, churchAddition, churchSubtraction,
    churchMultiplication, churchPotency, is0, jsnum, eq, leq, gt
} from '../lambda-calculus-library/church-numerals.js'

import {id, T, B, C} from '../lambda-calculus-library/lambda-calculus.js'

/**
 * Generic Types
 * @typedef {function} operator
 * @typedef {*} number
 * @typedef {function} fn
 * @typedef {function} churchBoolean
 * @typedef {(function|number)} churchNumberORjsNumber
 */

// ------------------------------------------------------
// -------------------- Calculator ----------------------
// ------------------------------------------------------

/**
 * operator -> number -> number -> fn -> fn( operator(number)(number) ) ; CalculatorOperator - handle the arithmetic-operator
 * @param {operator} op
 * @return { function(n1:{churchNumberORjsNumber}): function(n2:{churchNumberORjsNumber}):  function(*): *}
 */
const calculatorOperator = op => n1 => n2 => f => f(op(n1)(n2));

// end the calculator and print the result

/**
 * calc ; start the Calculator
 * @example
 * calc(n1)(add)(n2)(result) ==> n3
 *
 * @param {number/churchNumber} number
 * @returns {operator} Operator
 */
const calc = T;

/**
 * result ; end the Calculator
 * @example
 * calc(n1)(add)(n2)(result) ==> n3
 *
 * @type {function(a): I.props|*}
 * @return {churchNumber|number} ChurchNumber / JsNumber
 */
const result = id;

// ------------------------------------------------------
// --------  Calculation with JS-Nums ------------
// ------------------------------------------------------
// some arithmetic operator
const plus              = n1 => n2 => n1 + n2;
const multiplication    = n1 => n2 => n1 * n2;
const subtraction       = n1 => n2 => n1 - n2;
const exponentiation    = n1 => n2 => n1 ** n2;
const division          = n1 => n2 => n1 / n2;

// combine the calculator with the arithmetic operator via POINT-FREESTYLE
const add   = calculatorOperator(plus);
const multi = calculatorOperator(multiplication);
const sub   = calculatorOperator(subtraction);
const pow   = calculatorOperator(exponentiation);
const div   = calculatorOperator(division);

// demonstration / test
const number = calc(5)(multi)(4)(sub)(4)(pow)(2)(div)(8)(add)(10)(result);
console.log(number === 42); // true


// ------------------------------------------------------
// --------  Calculation with Church-Numerals ------------
// ------------------------------------------------------

// combine the calculator with the church arithmetic operator via POINT-FREESTYLE
const churchAdd     = calculatorOperator(churchAddition);
const churchMulti   = calculatorOperator(churchMultiplication);
const churchPow     = calculatorOperator(churchPotency);
const churchSub     = calculatorOperator(churchSubtraction);

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

