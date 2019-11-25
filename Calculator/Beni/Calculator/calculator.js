export {
    calc, result, Minus, Add, Pow, Multi, Div,
    jsnum, n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, succ, cAdd, cMulti, cMinus
}
// export { jsnum, n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, succ, cAdd, cMulti, cMinus}
import { id, konst, fst, snd, T, F, comp, pair} from "../LambdaCalculus/lambda.js";
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
const Add = calculatorOperator(plus);
//                        calculatorOperator (plus);
//                        calculatorOperator (n1 => n2 => n1 + n2)
//  op => n1 => n2 => f => f( op (n1) (n2) ) (n1 => n2 => n1 + n2)
//        n1 => n2 => f => f( (n1 => n2 => n1 + n2) (n1) (n2) )
//        n1 => n2 => f => f( (      n2 => (n1) + n2)      (n2) )
//        n1 => n2 => f => f( (            (n1) + (n2) ) )
//        n1 => n2 => f => f( n1 + n2 ) === add

const Multi = calculatorOperator(multiplication);
const Minus = calculatorOperator(subtraction);
const Pow   = calculatorOperator(exponential);
const Div   = calculatorOperator(division);

// end the calculator and print the result
const result = id;

// start the Calculator
const calc = num => op => op(num);

// const innerCalc = num => op => op(num);
// const calc = middle => innerCalc(middle)(result);

// demonstration / test
// const number = calc(5)(multi)(4)(minus)(4)(pow)(2)(div)(8)(add)(10)(result);
// document.writeln( number === 42); // true



// calc(2)(Add)(3)(minus)(1)(result)
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

// Helper-Tool: Print the Church-Numbers as JS-Numbers
const jsnum = f => f(x => x + 1)(0);

// Church-Numbers
const n0 = f => x => x;
const n1 = f => x => f(x);
const n2 = f => x => f(f(x));
const n3 = f => x => f(f(f(x)));

// Church-Numbers +1
const succ = n => f => x => f( n(f)(x) ) ;

// continue Church-Numbers n4...n6
const n4 = succ(n3);
const n5 = succ(succ(n3));
const n6 = succ(n5);

// Arithmetic operation with Church-Numbers
const cPlus = n1 => n2 => n1(succ)(n2);
const cAdd = calculatorOperator(cPlus);

// continue Church-Numbers n7...n9
const n7 = cPlus(n3)(n4);
const n8 = cPlus(n5)(n3);
const n9 = cPlus(n8)(n1);

// check if 0 (Zero)
const is0 = n => n( konst(F) )(T);
// is0(n0).toString === "True"
// is0(n1).toString === "False"
// is0(n6).toString === "False"

const cMultiplication = n1 => n2 => f => n1( n2(f) );
// const cMultiplication = comp;
const cMulti = calculatorOperator(cMultiplication);

const cExponential = n1 => n2 => n2(n1);


// the phi function takes a Pair and give a new Pair back where the
// second Value is on the first place and on the second place +1
const phi = p => pair( p(snd) )( succ( p(snd) ) );

// -1 operator-function
const minus1 = n => n(phi)(pair(n0)(n0))(fst);

const cSubtraction = n1 => n2 => n2(minus1)(n1) ;

const cMinus = calculatorOperator(cSubtraction);