// const addToList = listener => callback => listener.push(callback)
// const notify = listener => val => listener.forEach(l => l(val))

// const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x)

// const execute = (...fns) => returnValue => {
//     fns.reduce((_, fn) => fn); // use immutable Stack
//     return returnValue
// }


const ObsObject = listeners => obsFn => obsFn(listeners)
const InitObservable = ObsObject(emptyStack)


// Obseverable Functions obsFN
const addListener = listeners => newCallback =>
    (ObsObject(push(listeners)(newCallback)))

const setValue = listeners => newVal =>
    forEach(listeners)((callback, index) => callback(newVal))

const removeListener = listeners => index =>
    (ObsObject(reduce(listeners)(pair( rf(index)  )( emptyStack ))))

const rf = index => (acc, curr) => {
    if(jsnum(size(acc)) === index){
        return acc;
    }
    return push(acc)(curr)
}


const logListener = s => {
    const logIteration = (acc, curr) => {
        const index = acc + 1;
        const val = typeof(curr) === 'object' ? JSON.stringify(curr) : curr;
        console.log('element at: ' + index + ': ' + val);
        return index;
    };
    reduce(s)(pair(logIteration)(0));
};

const Observable = value => {
    const listeners = [];
    return {
        onChange: callback => {
            listeners.push(callback); // callback is a function
            callback(value, value);
        },
        getValue: () => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue = value;
            value = newValue;
            listeners.forEach(callback => callback(value, oldValue));
        }
    }
};

const ObservableList = newList => {
    const list = [...newList]
    const addListeners = [];
    const delListeners = [];
    const removeAt = array => index => array.splice(index, 1);
    const removeItem = array => item => {
        const i = array.indexOf(item);
        if (i >= 0) removeAt(array)(i);
    };
    const listRemoveItem = removeItem(list);
    const delListenersRemove = removeAt(delListeners);
    return {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add: item => {
            list.push(item);
            addListeners.forEach(listener => listener(item))
        },
        del: item => {
            listRemoveItem(item);
            const safeIterate = [...delListeners]; // shallow copy as we might change listeners array while iterating
            safeIterate.forEach((listener, index) => listener(item, () => delListenersRemove(index)));
        },
        removeDeleteListener: removeItem(delListeners),
        count: () => list.length,
        countIf: pred => list.reduce((sum, item) => pred(item) ? sum + 1 : sum, 0),
        getList: () => [...list]
    }
};
