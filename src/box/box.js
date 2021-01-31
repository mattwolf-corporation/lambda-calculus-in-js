import {id} from "../lambda-calculus-library/lambda-calculus.js";

export {
    Box, mapf, fold
}

// Box === Monade
const Box = x => mapf(x)(id);
const mapf = x => f => g => g(f(x));
const fold = x => f => f(x); // T


