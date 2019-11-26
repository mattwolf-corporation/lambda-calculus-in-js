export {
     id, konst, fst, snd, T, F, flip, comp, pair, pairEqual, ifels, end
}

// the identity function
const id = x => x;

// the konstant function takes always the first value
const konst = a => b => a;

// get First of two
const fst = a => b => a;
// const fst = konst;

// get Second of two
const snd = a => b => b;

// True / False
const T = fst;
const F = snd;

T.show = "True"
F.show = "False";

// Flip the two params in the function
const flip = f => a => b => f(b)(a);

// Composition two functions
const comp = f => g => x => f( g(x) );



// ----------- Data structures

const pair = a => b => f => f(a)(b);

const pairEqual = p1 => p2 => ( p1(fst) === p2(fst) && p1(snd) === p2(snd) );



// if
// const Left   = x => f => g => f(x);
// const Right  = x => f => g => g(x);
// const either = e => f => g => e (f) (g);



//ifels(lambda)("result")(solve())("clr")(clr())(elsee())
//ifels(boolean) (then) (close)
//ifels(boolean) (then()) (else()) (close)
//
const end = id;
const ifels = ife => then => els => (els === end) ? ( ife ? then : null ) : ( ife ? then : els ) ;




