export {
    startTesting, id, fst, snd, T, F, flip, comp, pair, pairEqual
}

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


const pair = a => b => f => f(a)(b);

const pairEqual = p1 => p2 => ( p1(fst) === p2(fst) && p1(snd) === p2(snd) );

// if
// const Left   = x => f => g => f(x);
// const Right  = x => f => g => g(x);
// const either = e => f => g => e (f) (g);

function startTesting() {
    const pair1 = pair(2)(5);
    const pair2 = pair(2)(5);
    document.writeln(pairEqual(pair1)(pair2));
}

