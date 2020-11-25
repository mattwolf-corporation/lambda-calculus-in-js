import { emptyListMap, listMap, startListMap, getElementByKey, removeByKey} from "../listMap/listMap.js";
import { push, forEach, reduce } from "../stack/stack.js";
import {pair,showPair,  snd, fst, Else, If, Then} from "../lambda-calculus-library/lambda-calculus.js";

export { InitObservable, addListener, setValue, getValue, removeListener,
    logListenersToConsole, handlerFnLogToConsole, handlerBuilder,
    buildHandlerFnInnerText, buildHandlerFnInnerTextLength, buildHandlerFnValue

}

const InitObservable = initVal => Observable(emptyListMap)(initVal)(setValue)(initVal)

const Observable = listeners => val => obsFn =>
        obsFn(listeners)(val)

const setValue = listeners => oldVal => newVal => {
    forEach(listeners)((listener, _) => (listener(snd))(newVal)(oldVal) )
    return Observable(listeners)(newVal)
}

const addListener = listeners => val => newListener =>
    Observable( push(listeners) (newListener) ) (val)



const getValue = listeners => val => val

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


// Observable Handler-Utilities
const handlerBuilder = key => handlerFn => pair(key)(handlerFn)

const handlerFnLogToConsole         = nVal => oVal => console.log(`Value: new = ${nVal}, old = ${oVal}`)
const buildHandlerFnInnerText       = element => nVal => oVal => element.innerText = nVal
const buildHandlerFnInnerTextLength = element => nVal => oVal => element.innerText = nVal.length
const buildHandlerFnValue           = element => nVal => oVal => element.value     = nVal
