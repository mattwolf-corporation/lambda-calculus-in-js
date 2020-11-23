/* ListMap
put
get
size
clear
 */
const listMap = stack
const emptyListMap = listMap(n0)(id)( pair(id)(id) );



const mapFn = p => {
    const mappedValue = p(snd).toUpperCase();
    return pair( p(fst) ) (mappedValue)
}

const getElementByKey = s => key => {
    const times = size(s);
    const initArgsPair = pair(s)(id);

    const getElement = argsPair => {
        const stack = argsPair(fst);
        const predecessorStack = (stack)(stackPredecessor);
        const currentKeyValPair = head(stack);
        if (currentKeyValPair(fst) === key) {
            return pair(predecessorStack)(currentKeyValPair(snd));
        }
        return pair(predecessorStack)(argsPair(snd));
    };

    return (times(getElement)(initArgsPair))(snd);
};



lm = emptyListMap
lm = push(lm)(pair(32)("Pascal"))
lm = push(lm)(pair(15)("Beni"))
lm = push(lm)(pair(12)("Kevin"))
lm = push(lm)(pair(31)("Naida"))


lm2 = map(lm)(mapFn)
forEach(lm2)((p, _) => console.log(showPair(p)) )
