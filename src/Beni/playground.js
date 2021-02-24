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
