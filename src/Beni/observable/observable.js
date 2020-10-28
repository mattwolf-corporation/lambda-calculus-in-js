
const id = x => x;

const addToList = listener => callback => listener.push(callback)
const notify = listener => val => listener.forEach(l => l(val))


const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x)

const execute = (...fns) => returnValue => {
    fns.reduce((_, fn) => fn); // use immutable Stack
    return returnValue
}

const removeFromList = array => index => {
    if(index >= 0) array.splice(index, 1)
}

const ObsObject = listeners => callback => val => obsFn => obsFn(listeners)(callback)(val)

const InitObservable = initVal => ObsObject([])(x => x)(initVal)

const getValue = listeners => callback => val => val

const addListener = listeners => callback => val => newCallback => execute(
    listeners.push(newCallback),
    newCallback(val)
)(ObsObject(listeners)(newCallback)(val))

const setValue = listeners => callback => val => newVal => execute(
    listeners.forEach(callback => callback(newVal))
)()

const removeListener = listeners => callback => val => index => execute(
    removeFromList(listeners)(index), //listeners.splice(index, 1),  //
    logListener(listeners)(callback)(val)
)()

const logListener = listeners => callback => val => execute(
    console.log("Index\t:  Listener"),
    listeners.forEach((l, i) => console.log(i + "\t\t:  " + l))
)()


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
