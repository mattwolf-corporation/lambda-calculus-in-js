import {pair, fst, snd, Blackbird, showPair} from '../lambda-calculus-libraray/lambda-calculus.js'
/**
* immutable list of n values
* List constructed of pairs
* first value is the size of the list
*/
const list =
    pair
    (pair
        (pair(0)(1))
        (pair(2)(3))
    )
    (pair
        (pair(4)(5))
        (pair(6)(7))
    );

const list3 =
    pair
    (8)
    (pair
        (pair
            (pair(0)(1))
            (pair(2)(3))
        )
        (pair
            (pair(4)(5))
            (pair(6)(7))
        )
    );

const list2 = pair(8)(pair(pair(pair(0)(1))(pair(2)(3)))(pair(pair(4)(5))(pair(6)(7))
    )
);

/**
 * getter's of list
 */
const get0 = list(fst)(fst)(fst);
const get1 = list(fst)(fst)(snd);
const get2 = list(fst)(snd)(fst);
const get3 = list(fst)(snd)(snd);

const get4 = list(snd)(fst)(fst);
const get5 = list(snd)(fst)(snd);
const get6 = list(snd)(snd)(fst);
const get7 = list(snd)(snd)(snd);

console.log(get0);
console.log(get1);
console.log(get2);
console.log(get3);
console.log(get4);
console.log(get5);
console.log(get6);
console.log(get7);
console.log(showPair(list(fst)(snd)));

// experiment
const build4 = a => b => c => d => Blackbird(pair)(pair)(a)(b) ((pair)(c)(d));
const build222 = Blackbird(pair)(pair);
const shortPair4 = a => b => (build222(a)(b))(pair);

const build22 = Blackbird(pair)(pair);
const shortPair42 = build222(pair);

const build5 = p1 => p2 => Blackbird(pair)(p1)(p2);
const constructPair = 1;

// const listStarter = size => constructPair(size);
//const randomList = list(8)(1)(2)(3)(4)(5)(6)(7)(8);

///// end of experiment