const Observable = value => {
    const listeners = [];
    return {
        onChange: callback => {
            listeners.push(callback); // callback is a function
            callback(value, value);
        },
        getValue: ()       => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue = value;
            value = newValue;
            listeners.forEach(callback => callback(value, oldValue));
        }
    }
};

const ObsObject = listeners => callback => val => obsFn => obsFn(listeners)(callback)(val) // Triple Vireo

const InitObservable = initVal => ObsObject([])(x => x)(initVal)

const addListener = listeners => callback => val => newCallback => { // lambdafizieren mit compose
    listeners.push(newCallback)
    newCallback(val)
    return ObsObject(listeners)(newCallback)(val)
}

const getValue = listeners => callback => val => val

const setValue = listeners => callback => val => newVal => {
    if (val === newVal) return;
    listeners.forEach(callback => callback(newVal));
    console.log(listeners)
    return ObsObject(listeners)(callback)(newVal)
}




const ObservableList = newList => {
    const list = [...newList]
    const addListeners = [];
    const delListeners = [];
    const removeAt     = array => index => array.splice(index, 1);
    const removeItem   = array => item  => { const i = array.indexOf(item); if (i>=0) removeAt(array)(i); };
    const listRemoveItem     = removeItem(list);
    const delListenersRemove = removeAt(delListeners);
    return {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add: item => {
            list.push(item);
            addListeners.forEach( listener => listener(item))
        },
        del: item => {
            listRemoveItem(item);
            const safeIterate = [...delListeners]; // shallow copy as we might change listeners array while iterating
            safeIterate.forEach( (listener, index) => listener(item, () => delListenersRemove(index) ));
        },
        removeDeleteListener: removeItem(delListeners),
        count:   ()   => list.length,
        countIf: pred => list.reduce( (sum, item) => pred(item) ? sum + 1 : sum, 0),
        getList: () => [...list]
    }
};
