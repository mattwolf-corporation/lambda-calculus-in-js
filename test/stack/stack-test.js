import { TestSuite } from "../test.js";

import {id, K, KI, M, C, B, T, fst, snd} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {n1, n2, n3, n4, n5, n6, n7, n8, n9, jsnum} from "../../src/lambda-calculus-library/church-numerals.js";
import { stack, stackIndex, stackPredecessor, stackValue, emptyStack,
    hasPre, push, pop, head, size, lambdaStackReducer, filterStack, mapStack,
    getElementByIndex, logStack} from "../../src/stack/stack.js";
const stackSuite = TestSuite("stack (pure functional data structure)");



stackSuite.report();