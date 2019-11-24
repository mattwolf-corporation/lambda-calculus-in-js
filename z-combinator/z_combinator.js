

// z-combinator
const Z = f => (x => f(v => x(x)(v)))(x => f(v => x(x)(v)));

// fibonacci function
const F = f => x => (x < 2 ? 1 : f(x - 2) + f(x - 1));

const fibonacci = n => Z(F)(n);

const result = fibonacci(0);
console.log(result);

const $ = 1;