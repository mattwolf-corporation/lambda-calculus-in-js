import {id, beq, True, False, showBoolean as show, pair,fst, snd} from '../lambda-calculus-library/lambda-calculus.js'

/**
 * stack implementation
 */
const stack = x => y => z => f => f(x)(y)(z);

const stackIndex = x => y => z => x;
const stackPredecessor = x => y => z => y;
const stackValue = x => y => z => z;

const emptyStack = stack (False) (id) (id);

const hasPre = s => s(stackIndex); // give true/false (function)
const push = s => x => stack (True) (s) (x);
const pop = s => pair (s(stackPredecessor)) (head(s));
const head = s => s(stackValue);

/**
 * todo: map, filter, reduce
 */



// Tests
/**
 * has empty stack a predecessor
 */
console.log
("has empty stack no predecessor: ", show
    (beq
        (hasPre(emptyStack))
        (False)
    )
);

console.log
("has non-empty stack a predecessor: ", show
    (beq
        (hasPre(push(emptyStack)(id)))
        (True)
    )
);

console.log
("pop returns the pushed value: ", show
    (beq
        ((pop(push(emptyStack)(id)))(snd) (True))
        (True)
    )
);

console.log
("pop returns predecessor stack: ",
    pop(push(emptyStack)(id)) (fst) === emptyStack
);

console.log
("returns head: ", show
    (beq
        ((head(push(emptyStack)(id))) (True))
        (True)
    )
);
