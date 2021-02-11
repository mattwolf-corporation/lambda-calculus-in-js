import { emptyListMap, getElementByKey, removeByKey} from "../listMap/listMap.js";
import { push, forEach, reduce } from "../stack/stack.js";
import { pair,showPair,  snd, fst, Else, If, Then} from "../lambda-calculus-library/lambda-calculus.js";

export { InitObservable, addListener, setValue, getValue, removeListenerByKey, removeListenerByHandler,
    logListenersToConsole, handlerFnLogToConsole, handlerBuilder,
    buildHandlerFnTextContent, buildHandlerFnTextContentOldValue, buildHandlerFnTextContentLength, buildHandlerFnValue

}

/**
 * Generic Types
 * @typedef {function} observable
 * @typedef {listMap} listeners
 */


/**
 * initialValue -> Observable
 *
 * @description InitObservable - create new Observable incl. the initialValue
 *
 * @haskell InitObservable :: a -> Observable
 *
 * @function
 * @param {*} initialValue
 * @return {observable} - a Observable with an emptyListMap & the InitialValue
 */
const InitObservable = initialValue => Observable(emptyListMap)(initialValue)(setValue)(initialValue)


/**
 * listeners -> value -> observableFunction -> observableFunction
 * @description Observable - the Body-Observable-Construct. Add Listeners with the Value & append the next Observable-Functions
 *
 * @haskell InitObservable :: [a] -> b -> c -> c
 *
 * @function
 * @param {listMap} listeners
 * @return {function(value:*): function(obsFn:function): *}
 */
const Observable = listeners => value => obsFn =>
        obsFn(listeners)(value)


/**
 * listeners -> oldValue -> newValue -> Observable ; setValue
 * @description set the new value and notify all listeners
 * @extends Observable
 *
 * @haskell setValue :: [a] -> b -> b -> Observable
 *
 * @function
 * @param {listMap} listeners
 * @return {function(oldValue:*): function(newValue:*): function(Function) : Observable}
 */
const setValue = listeners => oldValue => newValue => {
    forEach(listeners)((listener, _) => (listener(snd))(newValue)(oldValue) )
    return Observable(listeners)(newValue)
}

/**
 * listeners -> value -> newListener -> Observable ; addListener
 * @description add new Observable to the ListenerList
 *
 * @haskell addListener :: [a] -> b -> [a] -> Observable
 *
 * @function
 * @param {listMap} listeners
 * @return {function(value:*): function(newListener:listMap): function(Function) : Observable}
 */
const addListener = listeners => value => newListener =>
    Observable( push(listeners) (newListener) ) (value)

const getValue = listeners => val => val

const removeListenerByKey = listeners => val => listenerKey =>
    Observable( removeByKey(listeners)(listenerKey) )(val)

const removeListenerByHandler = listeners => val => handler =>
    Observable( removeByKey(listeners) (handler(fst)) )(val)

// Observable Tools
const logListenersToConsole = listeners => _ => {
    const logIteration = (acc, curr) => {
        const index = acc + 1;
        const val = typeof(curr) === 'object' ? JSON.stringify(curr) : curr;
        console.log('element at: ' + index + ': ' + showPair(val));
        return index;
    };
    reduce(pair(logIteration)(0))(listeners);
};


// Observable Handler-Utilities
const handlerBuilder = key => handlerFn => pair(key)(handlerFn)

const handlerFnLogToConsole             = nVal => oVal => console.log(`Value: new = ${nVal}, old = ${oVal}`)
const buildHandlerFnTextContent           = element => nVal => oVal => element.textContent = nVal
const buildHandlerFnTextContentOldValue   = element => nVal => oVal => element.textContent = oVal
const buildHandlerFnTextContentLength     = element => nVal => oVal => element.textContent = nVal.length
const buildHandlerFnValue               = element => nVal => oVal => element.value     = nVal
