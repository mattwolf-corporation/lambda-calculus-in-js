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

const execute = (...fns) => returnValue => {
    fns.reduce((_, fn) => fn);
    return returnValue
}

// const Box = x =>
//     ({
//         map: f => Box(f(x)),
//         fold: f => f(x),
//         inspect: () => `Box(${x})`
//     })

const nTuple = n =>
        [
            TupleCtor(n)([]),
            ...Array.from({length: n}, (it, idx) => values => values[idx])
        ]

const TupleCtor = n => values =>
    n === 0
        ? selector => selector(values)
        : value => TupleCtor(n - 1)([...values, value])


const tupCtor = n => values =>
    n(value => ([...values, value]))(selector => selector(values))

const Creator = n => {

    return [pair, fst, snd]
}
// https://stackoverflow.com/questions/29257442/is-it-possible-to-implement-a-function-that-returns-an-n-tuple-on-the-lambda-cal
// nTup = (λ n . (n (λ f t k . (f (λ e . (t (e k) )  ))) (λ x . x) (λ x . x)))
const nTup = n => n(f => t => k => f(e => t(e)(k)))

// const foldargs = t => n => f => z => (is0(n))(t(z))(a => foldargs(t)(pred(n))(f(f(a)(z))));
//
// const listofargs = n => foldargs(id)(n)(pair)(n0)

const Y = f => (x => f(x)(x))(x => f(x)(x));
const foldargs = Y(c => t => n => f => z => is0(n)(t(z))(a => c(t)(pred(n))(f(f(a)(z)))));
// const apply = Y(c => f => l)

const prepend = item => list => pair(False)(pair(item)(list))
const nil = pair(True)(True);
const getLeft = p => p(True)
const getRight = p => p(False)
const isEmpty = getLeft;

const headL = list => getLeft(getRight(list))
const tailL = list => getRight(getRight(list))

const checkElementByFunction = f => (...elems) =>
    elems.reduce((acc, curr) => {
        const result = f(curr);
        console.log(result)
        if (acc.isFailed) {
            if (!result) {
                 acc.values.push('element with id: ' + curr + 'not found');
                return acc;
            }
            return acc;
        } else {
            if (result) {
                acc.values.push(result);
                return acc;
            }

            acc.values = [] // clear elements
            acc.values.push('element with id: ' + curr + 'not found');
            acc.isFailed = true;
            return acc;

        }
    }, {values: [], isFailed: false});
