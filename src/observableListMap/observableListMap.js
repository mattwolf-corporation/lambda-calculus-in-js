

const InitObservable = initVal => Observable(emptyListMap)(initVal)

const Observable = listeners => val => obsFn =>
        obsFn(listeners)(val)

const addListener = listeners => val => newListener =>
    Observable( push(listeners) (newListener) ) (val)

const setValue = listeners => oldVal => newVal => {
    forEach(listeners)((listener, _) => (listener(snd))(newVal)(oldVal) )
    return Observable(listeners)(newVal)
}

const removeListener = listeners => val => listenerKey =>
    Observable( removeByKey(listeners)(listenerKey) )(val)


const logListenersToConsole = listeners => _ => {
    const logIteration = (acc, curr) => {
        const index = acc + 1;
        const val = typeof(curr) === 'object' ? JSON.stringify(curr) : curr;
        console.log('element at: ' + index + ': ' + showPair(val));
        return index;
    };
    reduce(listeners)(pair(logIteration)(0));
};

