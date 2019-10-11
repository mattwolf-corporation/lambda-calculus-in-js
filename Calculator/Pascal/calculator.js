// pair construction
const pair = x => y => selector => selector(x)(y);
const fst = x => y => x;
const snd = x => y => y;
const pairMap = f => p => pair(f(p(fst)))(f(p(snd)));

// Pair-Operation abstraction
const pairOp = op => p => pair(op(p(fst))(p(snd)));

// pair addition: addition of the two values from the pair
const pairAdd = pairOp(add);
const pairMultiply = pairOp(multiply());


// Math-Operations
const add = n1 => n2 => n1 + n2;
const multiply = n1 => n2 => n1 * n2;