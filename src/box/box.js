import {id} from "../lambda-calculus-library/lambda-calculus.js";
import {Just, Nothing} from "../maybe/maybe.js";

export {
    Box, mapf, fold, debug, mapMaybe,
    flatMapMaybe, mapfMaybe, foldMaybe,
    chainMaybe, tryCatch
}

// Box === Monade
// TODO: Box zurückgeben
const Box  = x => mapf(x)(id);
const mapf = x => f => g => g(f(x));
const fold = x => f => f(x);            // T

const debug = x => {
    console.log(x);
    return x;
}

const mapMaybe = maybe => f => maybe (() => maybe) (x => Just(f(x)));
const flatMapMaybe = maybe => f => maybe (() => maybe) (x => f(x));

const mapfMaybe = x => f => g => g(mapMaybe(x)(f));
const foldMaybe = x => left => right => x(left)(right); // ID
const chainMaybe = x => f => g => g(flatMapMaybe(x)(f));

// should be the only try and catch in code basis !
const tryCatch = f => {
    try {
        return Just(f());
    } catch (_) {
        return Nothing;
    }
}

