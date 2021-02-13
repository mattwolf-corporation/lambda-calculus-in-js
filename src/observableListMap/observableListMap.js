import {emptyListMap, getElementByKey, removeByKey} from "../listMap/listMap.js";
import {push, forEach, reduce} from "../stack/stack.js";
import {pair, showPair, snd, fst, Else, If, Then} from "../lambda-calculus-library/lambda-calculus.js";

export {
    InitObservable, addListener, setValue, getValue, removeListenerByKey, removeListenerByHandler,
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
 *  InitObservable - create new Observable incl. the initialValue
 *
 * @haskell InitObservable :: a -> Observable
 *
 * @function
 * @param {*} initialValue
 * @return {observable} - a Observable with an emptyListMap & the InitialValue
 * @example
 * const obsExample = InitObservable(0)
 *                 (addListener)(consoleHandler)
 *                 (addListener)(valueHandler)
 */
const InitObservable = initialValue => Observable(emptyListMap)(initialValue)(setValue)(initialValue)


/**
 * listeners -> value -> observableFunction -> observableFunction
 *  Observable - the Body-Observable-Construct. Add Listeners with the Value & append the next Observable-Functions
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
 * set the new value and notify all listeners
 *
 * @extends Observable
 *
 * @haskell setValue :: [a] -> b -> b -> Observable
 *
 * @function
 * @param {listMap} listeners
 * @return {function(oldValue:*): function(newValue:*): function(Function) : Observable}
 * @example
 * let obsExample = InitObservable(0)
 * testObs(getValue) === 0
 *
 * testObs = testObs(setValue)(42)
 * testObs(getValue) === 42
 */
const setValue = listeners => oldValue => newValue => {
    forEach(listeners)((listener, _) => (listener(snd))(newValue)(oldValue))
    return Observable(listeners)(newValue)
}

/**
 * listeners -> value -> newListener -> Observable ; addListener
 * add new Observable to the ListenerList
 *
 * @haskell addListener :: [a] -> b -> [a] -> Observable
 *
 * @function
 * @param {listMap} listeners
 * @return {function(value:*): function(newListener:listMap): function(Function) : Observable}
 *
 */
const addListener = listeners => value => newListener =>
    Observable(push(listeners)(newListener))(value)


/**
 * listeners -> value -> value ; getValue
 *  get the value of Observable
 *
 * @extends Observable
 *
 * @haskell getValue :: [a] -> b -> b
 *
 * @function
 * @param {listMap} listeners
 * @return {function(value:*): function(value:*)}
 * @example
 * let obsExample = InitObservable(0)
 * testObs(getValue) === 0
 *
 * testObs = testObs(setValue)(42)
 * testObs(getValue) === 42
 */
const getValue = listeners => value => value

/**
 * listeners -> value -> listenerKey ; removeListenerByKey
 * Remove a Listener by his key
 * @extends Observable
 *
 * @haskell removeListenerByKey :: [a] -> b -> c
 *
 * @function
 * @param {listMap} listeners
 * @return {function(value:*): function(listenerKey:*)}
 * @example
 * const valueHolder  = {};
 * const valueHandler = handlerBuilder(42)(buildHandlerFnValue(valueHolder))
 *
 * let obsExample = InitObservable(0)
 *                  (addListener)(valueHandler)
 *
 * obsExample = obsExample(setValue)(11)
 *
 * valueHolder.value    === 11
 * obsExample(getValue) === 11
 *
 * obsExample = obsExample(removeListenerByKey)(42)
 *
 * obsExample = obsExample(setValue)(66)
 *
 * valueHolder.value    === 11
 * obsExample(getValue) === 66
 *
 */
const removeListenerByKey = listeners => value => listenerKey =>
    Observable(removeByKey(listeners)(listenerKey))(value)


/**
 * listeners -> value -> listenerKey ; removeListenerByKey
 * Remove a Listener by his key
 * @extends Observable
 *
 * @haskell removeListenerByKey :: [a] -> b -> c
 *
 * @function
 * @param {listMap} listeners
 * @return {function(value:*): function(listenerKey:*)}
 * @example
 * const valueHolder  = {};
 * const valueHandler = handlerBuilder(42)(buildHandlerFnValue(valueHolder))
 *
 * let obsExample = InitObservable(0)
 *                  (addListener)(valueHandler)
 *
 * obsExample = obsExample(setValue)(11)
 *
 * valueHolder.value    === 11
 * obsExample(getValue) === 11
 *
 * obsExample = obsExample(removeListenerByHandler)(valueHandler)
 *
 * obsExample = obsExample(setValue)(66)
 *
 * valueHolder.value    === 11
 * obsExample(getValue) === 66
 *
 */
const removeListenerByHandler = listeners => value => handler =>
    Observable(removeByKey(listeners)(handler(fst)))(value)

// Observable Tools
const logListenersToConsole = listeners => _ => {
    const logIteration = (acc, curr) => {
        const index = acc + 1;
        const val = typeof (curr) === 'object' ? JSON.stringify(curr) : curr;
        console.log('element at: ' + index + ': ' + showPair(val));
        return index;
    };
    reduce(pair(logIteration)(0))(listeners);
};


// Observable Handler-Utilities
const handlerBuilder = key => handlerFn => pair(key)(handlerFn)

const handlerFnLogToConsole = nVal => oVal => console.log(`Value: new = ${nVal}, old = ${oVal}`)
const buildHandlerFnTextContent = element => nVal => oVal => element.textContent = nVal
const buildHandlerFnTextContentOldValue = element => nVal => oVal => element.textContent = oVal
const buildHandlerFnTextContentLength = element => nVal => oVal => element.textContent = nVal.length
const buildHandlerFnValue = element => nVal => oVal => element.value = nVal
