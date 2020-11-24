import { emptyListMap, listMap, startListMap, getElementByKey, removeByKey} from "../listMap/listMap.js";
import { push, forEach, reduce } from "../stack/stack.js";
import {pair,showPair,  snd, fst, Else, If, Then} from "../lambda-calculus-library/lambda-calculus.js";

export { InitObservable, addListener, setValue, removeListener, logListenersToConsole, handlerLog, handlerBuilder, handlerInnerText}

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


// Observable Tools

const logListenersToConsole = listeners => _ => {
    const logIteration = (acc, curr) => {
        const index = acc + 1;
        const val = typeof(curr) === 'object' ? JSON.stringify(curr) : curr;
        console.log('element at: ' + index + ': ' + showPair(val));
        return index;
    };
    reduce(listeners)(pair(logIteration)(0));
};


// Observable Listener Utilies
const handlerBuilder = key => handler => pair(key)(handler)

const handlerLog = nVal => oVal => console.log(`Value: new = ${nVal}, old = ${oVal}`)
const handlerInnerText = nVal => oVal => element => element.innerText = nVal
