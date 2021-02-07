import {id} from "../lambda-calculus-library/lambda-calculus.js";
import {Just, Nothing, Left, Right} from "../maybe/maybe.js";

export {
    Box, mapf, fold, chain, debug, mapMaybe,
    flatMapMaybe, mapfMaybe, foldMaybe,
    chainMaybe, tryCatch, getContent,
    ap, liftA2, apMaybe, liftA2Maybe
}

// Box === Monade
const Box   = x => mapf(x)(id);                 // Box.of
const mapf  = x => f => g => g(f(x));           // Box.map // the last function is lazy !
const fold  = x => f => f(x);   // T            // map and then get Content out of the box
const chain = x => f => g => g((f(x)(id)));     // Box.flatMap
const ap = x => f => g => g(f(mapf)(x)(id));    // Box Applicative
const getContent = b => b(id)                   // get Content out of the box (unwrap)

const liftA2 = f => fx => fy =>
        fx(mapf)(f)(ap)(fy)                     //

const debug = x => {
    console.log(x);
    return x;
}

const mapMaybe = maybe => f => maybe (() => maybe) (x => Just(f(x))); // maybe.map
const flatMapMaybe = maybe => f => maybe (() => maybe) (x => f(x));   // maybe.flatmap

const mapfMaybe = x => f => g => g(mapMaybe(x)(f));                   // map (returns a box) --> for chaining
const foldMaybe = mapMaybe;                                           // map and then get Content out of the box
const chainMaybe = x => f => g => g(flatMapMaybe(x)(f));              // map ant then flatten (returns a box) --> for chaining
// const apMaybe = x => f => g => g(x(() => x)(func => mapMaybe(f)(func)));
const apMaybe = x => f => g => g(flatMapMaybe(x)(func => mapMaybe(f)(func)));

const liftA2Maybe = f => fx => fy =>
    Box(fx)
        (mapfMaybe)(f)
        (apMaybe)(fy)

// should be the only try and catch in code basis !
const tryCatch = f => {
    try {
        return Right(f());
    } catch (error) {
        return Left(error);
    }
}

