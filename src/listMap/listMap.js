
const listMap = stack

const emptyListMap = listMap(n0)(id)( pair(id)(id) );

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

const removeByKey = stack => key => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = argsPair => {
        const currentStack  = argsPair(fst)
        const resultStack   = argsPair(snd)

        return If( hasPre(currentStack) )
        (Then( removeByCon(currentStack)(resultStack)(key)))
        (Else(argsPair))
    }

    return (times(iteration)(pair(reversedStack)(emptyStack)))(snd)
}

const removeByCon = currentStack => resultStack => key => {
    const currentKeyValPair = head(currentStack)
    const currentElement = currentKeyValPair(snd);

    const currentKey = currentKeyValPair(fst)
    const result = key === currentKey
        ? resultStack
        : push(resultStack)(pair(currentKey)(currentElement));

    return pair(getPreStack(currentStack))(result);
}
