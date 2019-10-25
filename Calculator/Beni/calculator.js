// the identity function
const id = x => x;

// get First of two
const fst = a => b => a;

// get Second of two
const snd = a => b => b;

// True / False
const T = fst;
const F = snd;

// Flip the two params in the function
const flip = f => a => b => f(b)(a);

// Composition two functions
const comp = f1 => f2 => x => f1( f2(x) );


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
const number = calc(5)(multi)(4)(minus)(4)(pow)(2)(div)(8)(add)(10)(result);
document.writeln( number === 42); // true



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





// Recursion

const rec  = f => f ( n => rec(f)(n) ) ;

// rec(konst(1))
// rec (a => b => a)(1)
// rec (b => 1)
// f => f ( n => rec(f) (n) ) (b => 1)
// (b => 1) ( n => rec(f) (n) )
// (b => 1) ( rec(f) )
// (1)



// (b => 1) ( n => f => f ( n => rec(f)(n) ) (f) (n) )
// (b => 1) (  f => f ( n => rec(f)(n) ) (n) )
// (b => 1) (  (n) ( n => rec(f)(n) )  )
// (b => 1) (  (n) ( n => rec(f) (n) )  )



//
//
// ok.push( rec(konst(1))  === 1);
// ok.push( Z(konst(1))    === 1); // the same in terms of the Z combinator
//
// // hand-made recursion
// const triangle = n => n < 1 ? 0 : triangle(n-1) + n;
// ok.push( triangle(10) === 55);
//
// // tail recursion
// const triTail = acc => n => n < 1 ? acc : triTail(acc + n)(n-1);
// ok.push( triTail(0)(10) === 55);
//
// // triFun does not longer appear on the right-hand side of the recursion!
// const triFun = f => acc => n => n < 1 ? acc : f(acc + n)(n-1) ;
// ok.push( rec (triFun)(0)(10) === 55);
// ok.push( Z   (triFun)(0)(10) === 55); // the same in terms of the Z combinator
// ok.push( rec (f => acc => n => n < 1 ? acc : f(acc + n)(n-1)) (0)(10) === 55);
//
// // if even works with non-tail recursion
// ok.push( rec (f => n => n < 1 ? 0 : f(n-1) + n) (10) === 55);
//
// // ideas for more exercises:
// // count, sum, product, (evtl later on array: none, any, every)













// const calc = n1 => op => n2 => cont => cont( calc(op(n1)(n2)) ) ( op(n1)(n2)  );

const operation = a => b => b;
const isResultOrOperation = fn => fn(T)(F);

// const calc = n1 => op => n2 => isResultOrOperation => isResultOrOperation( op(n1)(n2)  ) ( calc(op(n1)(n2)) );
// const startCalc = n1 => op => n2 => cont => cont( op(n1)(n2) )   (   calc(op(n1)(n2))   );

// const calc = n1 => isResultOrOperation => n2  => isResultOrOperation( (n1)(n2)  ) ( calc(n1)(n2) );

// const startCalc = n1 => op => n2 =>   calc(  op("BLA") ( (n1) (n2) ) );
// const calc = num => isResultOrOperation => isResultOrOperation  ( num  ) (  () => num2 => calc(num)(num2) );
// const calc = num => op => op(num) ( num2 => calc( add(num)(num2) ) );  // (2) (add) (3) (result)

// const calc = num => op => op(num) ( num ) ;






// succ(n1)
// succ( f => x => f(x) )    --->  f => x => f(f(x))


// const pairOp = op => p => op(p(fst))(p(snd));
// const pairdAdd = pairOp(add);
// const pairdMulty = pairOp(multi);
//
// const p1 = pair(2)(3);

// (n1)(op)(n2)(op)(n3)(op)(n4)
// (n3)(end)

/*
// function id(x) { return x; }, \x.x
const id = x => x;

const I = id ;          // Identity I, for all a: id(a) == a



// function application, beta reduction
// const beta = f => id(f);
// const beta = f => f;
// beta.toString = () => "beta";
const beta = f => x => f(x);

// self-application, Mockingbird, \x.x x
const M = f => beta(f)(f);  // f(f)
// M is SII
// S(id)(id) (x) = id(x) (id(x))
// S(id)(id) = M

// M, const, first, id2, true
const konst = x => y => x;

const K = konst;        // Kestrel K, \x. \y. x


const flip = f => x => y => f(y)(x);

const C = flip;         // Cardinal C, \fxy.fyx


// const flip = f => g => x => f(x)(g);  // f(x)(g(x)) // konst(g)(x) -> g
// const flip = f => g      => s(f)(konst(g));         // C = \fg.S(f)(Kg)
// const flip = f => g => x => s(f)(konst(g))(x);      // def of S
// const flip = f => g => x => f(x)(konst(g)(x));
// const flip = f => g => x => f(x)(g); // qed.

// Kite
// kite = x => y => y;
// kite = x => y => konst(id)(x)(y);
// const kite = konst(id);
// const kite = x => y => flip(konst)(x)(y);
const kite = flip(konst);

const KI  = kite;

// -----

// Bluebird, composition
const cmp = f => g => x => f(g(x));
// const cmp = f => g      => S(konst(f))(g);
// const cmp = f => g => x => S(konst(f))(g)(x);
// const cmp = f => g => x => (konst(f)(x))(g(x));
// const cmp = f => g => x => (f)(g(x));
// const cmp = f => g => x => f(g(x)); // qed.

const B = cmp; // Bluebird B,  \fg.S(Kf)g


//const cmp2 = f => g => x => y => f(g(x)(y));
const cmp2 = cmp (cmp)(cmp);

const BB = cmp2;        // Blackbird

// Starling, \abc.ac(bc)
const S = f => g => x => f(x)(g(x));

// identity is SKK, S(konst)(konst)
// S(K)(K)(x) = konst(x)( konst(x) )
// S(K)(K)(x) =      (x)
// S(K)(K)(x) =    id(x)
// S(K)(K)    =    id          // qed


// ---- boolean logic

const T   = konst;
const not = flip;
const F   = not(T);             //const F = kite;

const and = x => y => x(y)(x);
// const and = f => g => f(g)(f);
// const and = f => g => S(f)(konst(f))(g)  // \fg.Sf(Kf)g

// const or  = x => y => x(x)(y);
// const or  = x =>  x(x);
const or  = M;

//const beq = x => y => x(y)(not(y));
//const beq = x => y => S(x)(not)(y);
const beq = x => S(x)(not);   // S(x)(K)

//const xor = cmp (cmp(not)) (beq)   ;
const xor =  cmp2 (not) (beq)   ;

//const imp = x => y => x (y) (T);
//const imp = x => y => x (y) ( not(x));
// const imp = x => y => flip(x) (not(x)) (y) ;
// const imp = x => flip(x) (not(x)) ;
// const imp = S(not)(not) ;
const imp = S(C)(C) ;


// ----
// Graham Hutton: https://www.youtube.com/watch?v=9T8A89jgeTI

// Y combinator: \f. (\x.f(x x)) (\x.f(x x))
// Y = f => ( x => f(x(x)) )  ( x => f(x(x)) )
// Y is a fixed point for every f: Y(f) == Y(Y(f))
// \f. M(\x. f(Mx))
// f => M(x => f(M(x)))

// in a non-lazy language, we need the Z fixed-point combinator
// \f. (\x. f(\v.xxv)) (\x. f(\v.xxv))
// \f. M(\x. f(\v. Mxv))
const Z = f => M(x => f(v => M(x)(v) ));

// loop = loop
// loop = (\x. x x) (\x. x x)
// loop = ( x => x(x) ) ( x => x(x) )
// this is self-application applied to self-application, i.e. M(M)
// which we already checked to be endlessly recursive

// rec = f => f (rec (f)) // cannot work, since rec(f) appears in argument position

// define loop in terms of rec:
// const rec = f => f (rec (f));  // y
// const rec = f => M ( x => f(M(x)) )     // s/o

// this works:
// rec :: (a -> a) -> a
const rec  = f => f ( n => rec(f)(n)  ) ;

// ---------- Numbers

const n0 = f => x => x;         // same as konst, F
const n1 = f => x => f(x);      // same as beta, once, lazy
const n2 = f => x => f(f(x));           // twice
const n3 = f => x => f(f(f(x)));        // thrice

//const succ = cn => ( f => x => f( cn(f)(x) ) );
//const succ = cn => ( f => x => f( (cn(f)) (x) ) );
//const succ = cn => ( f => x => cmp(f) (cn(f)) (x)  );
//const succ = cn => ( f => cmp(f) (cn(f)) );
// const succ = cn => ( f => S(cmp)(cn)(f) );
const succ = cn => S(B)(cn);

const n4 = succ(n3);
const n5 = succ(n4);

// addition + n is the nth successor

//const plus = cn1 => cn2 => f => x =>  cn2(succ)(cn1)(f)(x)  ; // eta
const plus = cn1 => cn2 =>  cn2(succ)(cn1)  ;

// multiplication is repeated plus
// const mult = cn1 => cn2 => cn2 (plus(cn1)) (n0) ;
// rolled out example 2 * 3
// const mult = cn1 => cn2 => f => x =>  f f f   f f f   x
// const mult = cn1 => cn2 => f => x =>  cn1 (cn2 (f))  (x); // eta
// const mult = cn1 => cn2 => f =>  cn1 (cn2 (f));  // introduce composition
// const mult = cn1 => cn2 => cmp(cn1)(cn2); // eta
// const mult = cn1 => cmp(cn1); // eta
// const mult = cmp;
const mult = B;

// power is repeated multiplication
// 2 ^ 3 = (2* (2* (2*(1))) ,
// const pow = cn1 => cn2 => cn2 (mult(cn1)) (n1);
// rolled out = f f ( f f ( f f x ))
// const pow = cn1 => cn2 => f => x => cn2 (cn1)(f)(x); // eta
const pow = cn1 => cn2 => cn2 (cn1) ;
// const pow = cn1 => cn2 => beta (cn2) (cn1) ;
// const pow = cn1 => cn2 => flip (beta) (cn1) (cn2) ;
// const pow = flip (beta) ;
// const pow = not(id);       // x^0 = 1

const Th = f => g => g(f);  // Thrush combinator  Th \af.fa ; CI

const isZero = cn =>  cn (konst(F)) (T);

const church = n => n === 0 ? n0 : succ(church(n-1));

// ----------- Data structures

// prototypical Product Type: pair
const pair = a => b => f => f(a)(b);

const V = pair;  // Vireo  V \abf.fab

const fst = p => p(T); // pick first  element from pair
const snd = p => p(F); // pick second element from pair

// prototypical Sum Type: either

const Left   = x => f => g => f (x);
const Right  = x => f => g => g (x);
const either = e => f => g => e (f) (g);

// maybe as a sum type

// const Nothing  = ()=> f => g => f ;        // f is used as a value
// const Just     = x => f => g => g (x);
// const maybe    = m => f => g => m (f) (g);

const Nothing  = Left() ;        // f is used as a value
const Just     = Right  ;
// const maybe    = either ;     // convenience: caller does not need to repeat "konst"
const maybe    = m => f => either (m) (konst(f)) ;

//    bindMaybe :: m a -> (a -> m b) -> mb
const bindMaybe = ma => f => maybe (ma) (ma) (f);

// ---- curry

// curry :: ((a,b)->c) -> a -> b -> c
const curry = f => x => y => f(x,y);

// uncurry :: ( a -> b -> c) -> ((a,b) -> c)
const uncurry = f => (x,y) => f(x)(y);

*/
