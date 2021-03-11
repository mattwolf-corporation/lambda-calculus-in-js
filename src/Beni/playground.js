const log = console.log


// const mapAll = arr => (...fns) => arr.map( x => pipeAll(fns)(x) )
// const mapAll = arr => (...fns) => x =>  arr.map( fns.reduce((v, fn) => fn(v), x) )
//
// const mapLog = arr => (...fns) => arr.map( log  )

const trim = str => str.trim();
const toUpperCase = str => str.toUpperCase();

const words = ["car ", " boot", " tablet"]

const pipe = (...fns) => x => fns.reduceRight((v, fn) => fn(v), x)

const Monad = value => ({
    flatMap: f => f(value),
    map(f) {
        return this.flatMap(a => Monad(f(a)));
    }
});

// Monad.of = x => Monad(x);

// Monad(21).map(x => x * 2).map(console.log)

// const logs = [console.log, console.log]
const logged = x => logs.reduce((_, fn) => fn(x), x)

const execute = (...fns) => returnValue => {fns.reduce((_, fn) => fn); return returnValue}

// const Box = x =>
//     ({
//         map: f => Box(f(x)),
//         fold: f => f(x),
//         inspect: () => `Box(${x})`
//     })

const Tuple = n =>
    n < 1
    ?  new Error("Tuple must have first argument n > 0")
    : [
        TupleCtor (n) ([]), // ctor curries all values and then waits for the selector
        // every selector is a function that picks the value from the curried ctor at the same position
        ...Array.from( {length:n}, (it, idx) => {
            console.log(it, idx)


            return values => {
                console.log(values)
                console.log(idx)
                console.log(values[idx])
                return values[idx]
            }
        } )
    ];

const TupleCtor = n => values =>
    n === 0                                              // we have curried all ctor args, now
        ? selector => selector(values)        // return a function that waits for the selector
        : value => {
    console.log(value)
    console.log([...values, value])
    return TupleCtor (n - 1) ([...values, value])
        }           // return the ctor for the remaining args



const tupCtor = n => values =>
    n(value => ([...values, value]))(selector => selector(values))

const Creator = n => {

    return [pair, fst, snd]
}
// https://stackoverflow.com/questions/29257442/is-it-possible-to-implement-a-function-that-returns-an-n-tuple-on-the-lambda-cal
// nTup = (λ n . (n (λ f t k . (f (λ e . (t (e k) )  ))) (λ x . x) (λ x . x)))
const nTup = n => n( f => t => k => f( e => t(e)(k) ) )

// const foldargs = t => n => f => z => (is0(n))(t(z))(a => foldargs(t)(pred(n))(f(f(a)(z))));
//
// const listofargs = n => foldargs(id)(n)(pair)(n0)

const Y = f => (x => f(x)(x))(x => f(x)(x));
const foldargs = Y(c => t => n => f => z => is0(n)( t(z) )( a => c(t)( pred(n) )( f(f(a)(z)) )) );
// const apply = Y(c => f => l)

const prepend = item => list => pair(False)(pair(item)(list))
const nil = pair(True)(True);
const getLeft = p => p(True)
const getRight = p => p(False)
const isEmpty = getLeft;

const headL = list => getLeft(getRight(list))
const tailL = list => getRight(getRight(list))