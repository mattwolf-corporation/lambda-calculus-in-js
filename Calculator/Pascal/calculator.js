// Math-Operations
const add = n1 => n2 => n1 + n2;
const multiply = n1 => n2 => n1 * n2;

const multiplyTwo = multiply(2);
const addTen = add(10);

// pair construction
const pair = x => y => selector => selector(x)(y);
const fst = x => y => x;
const snd = x => y => y;

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


