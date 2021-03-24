import {id} from "../lambda-calculus-library/lambda-calculus.js";
import {Just, Nothing, Left, Right} from "../maybe/maybe.js";

export {
    Box, fmap, fold, chain, debug, mapMaybe,
    flatMapMaybe, fmapMaybe, foldMaybe,
    chainMaybe, getContent,
    app, liftA2, appMaybe, liftA2Maybe, pureMaybe
}

// Box === Monade
const Box   = x => fmap(x)(id);                     // Box.of
const fmap  = x => f => g => g(f(x));               // Box.map
const fold  = x => f =>        f(x);   // T         // map and then get content out of the box
const chain = x => f => g => g((f(x)(id)));         // Box.flatMap
const app = x => f => g => g(f(fmap)(x)(id));     // Box Applicative
const getContent = b => b(id)                       // get Content out of the box (unwrap)

const liftA2 = f => fx => fy =>
        fx(fmap)(f)(app)(fy)

const debug = x => {
    console.log(x);
    return x;
}

const $_$ = 1;


// maybe box methods
const mapMaybe      = maybe => f => maybe (() => maybe) (x => Just(f(x)));  // maybe.map
const flatMapMaybe  = maybe => f => maybe (() => maybe) (x =>       f(x));  // maybe.flatmap

// TODO: rename to fmap
const fmapMaybe     = x => f => g => g(mapMaybe(x)(f));                     // map (returns a box) --> for chaining
const foldMaybe     = mapMaybe;                                             // map and then get Content out of the box
const chainMaybe    = x => f => g => g(flatMapMaybe(x)(f));                 // map ant then flatten (returns a box) --> for chaining
// const apMaybe    = x => f => g => g(x(() => x)(func => mapMaybe(f)(func)));
const appMaybe       = x => f => g => g(flatMapMaybe(x)(func => mapMaybe(f)(func)));

const pureMaybe = f => Just(f);

const liftA2Maybe = f => fx => fy =>
    Box(fx)
        (fmapMaybe)(f)
        (appMaybe)(fy)




