//import {id, B, K, T, True, False, and, or, pair, fst, snd, Blackbird, not} from "../lambda-calculus-library/lambda-calculus.js";
const log = console.log

const maybe = pair
const get = snd
const isPresent = fst

const Left = x => f => g => f(x);
const Right = x => f => g => g(x);
const either = id;

const getElement = id => document.getElementById(id); // maybe impl for safety
const getElements = (...id) => id.map(e => getElement(e))

const getMaybeElement = id => {
    const element = getElement(id)
    log(element)
    element
        ? Right(maybe(true)(element))
        : Left(maybe(false)("Error: No element"))
}



const inputElement = getMaybeElement("inputTextElement")
if (inputElement(isPresent)){
    log(inputElement(get))
} else {
    log(inputElement(get))

}



const safeDiv = num => divisor =>
    divisor === 0
        ? Left("schlecht!")
        : Right(num / divisor);

either(safeDiv(1)(4))
(console.error)
(console.log);

const safeGetElementById = element =>
    document.getElementById(element) === null
        ? console.error("element nicht verfügbar!")
        : document.getElementById(element)


const safeNum = val =>
    typeof val === "number" ? val : 0


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

Monad(21).map(x => x * 2).map(console.log)

//


const createEvent = ({
    title: "untitled",
    date: Date.now(),
    description: ""
})

const logs = [console.log, console.log]
const logged = x => logs.reduce((_, fn) => fn(x), x)

const execute = (...fns) => returnValue => {fns.reduce((_, fn) => fn); return returnValue}
