import {emptyListMap, getElementByKey, removeByKey} from "../listMap/listMap.js";
import {push, forEach, reduce} from "../stack/stack.js";
import {pair, showPair, snd, fst, Else, If, Then, id} from "../lambda-calculus-library/lambda-calculus.js";

export {
    InitObservable, addListener, setValue, getValue, removeListenerByKey, removeListener,
    logListenersToConsole, listenerLogToConsole, newListener,
    listenerNewValueToDomElementTextContent, listenerOldValueToDomElementTextContent, listenerNewValueLengthToElementTextContent, listenerNewValueToElement

}

/**
 * Generic Types
 * @typedef {function} observable
 * @typedef {function} listener
 * @typedef {function} listMap
 */


/**
 * listeners -> value -> observableFunction -> observableFunction
 * Observable - the Body-Observable-Construct. Add Listeners with the Value & append the next Observable-Functions
 *
 * @haskell InitObservable :: [a] -> b -> c -> c
 *
 * @sideeffects
 * @function
 * @param  {listMap} listeners
 * @return {function(value:*): function(obsFn:function): function(obsFn:function)} a Observable-Function
 */
const Observable = listeners => value => obsFn =>
    obsFn(listeners)(value)

/**
 * initialValue -> Observable
 *  InitObservable - create new Observable incl. the initialValue
 *
 * @haskell InitObservable :: a -> Observable
 *
 * @sideeffects
 * @function
 * @param {number|churchNumber|string} initialValue
 * @return {observable} - a Observable with an emptyListMap & the InitialValue
 * @example
 * const obsExample = InitObservable(0)
 *                          (addListener)( listenerLogToConsole      )
 *                          (addListener)( listenerNewValueToElement )
 */
const InitObservable = initialValue =>
    Observable(emptyListMap)(initialValue)(setValue)(initialValue)


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
 * testObs = testObs(setValue)(42)
 * testObs(getValue) === 42
 */
const setValue = listeners => oldValue => newValue => {
    forEach(listeners)((listener, _) => (listener(snd))(newValue)(oldValue))
    return Observable(listeners)(newValue)
}

/**
 * listeners -> value -> newListener -> Observable ; addListener
 * add new Listener to the Observable and pass the current Observable-Value e.g. the initValue
 *
 * @haskell addListener :: [a] -> b -> [a] -> Observable
 *
 * @function
 * @param {listMap} listeners
 * @return {function(value:*): function(newListener:listMap): function(Function) : Observable}
 */
const addListener = listeners => value => newListener => {
    newListener(snd)(value)(value)
    return Observable(push(listeners)(newListener))(value)
}


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
const getValue = listeners => value => value;

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
 * let observedObject = {};
 * const listenerValue = newListener( 42 )( listenerNewValueToElement (valueHolder) );
 *
 * let obsExample = InitObservable(0)
 *                      (addListener)(listenerValue)
 *
 * observedObject.value === 0  // variable "observedObject" get updated from InitialValue
 *
 * obsExample = obsExample(setValue)(11)
 *
 * observedObject.value === 11  // variable "observedObject" get updated
 *
 * obsExample = obsExample(removeListenerByKey)(42)
 *
 * obsExample = obsExample(setValue)(66)
 *
 * observedObject.value === 11  // variable "observedObject" getting no updates anymore
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
 * let observedObject = {};
 * const listenerValue = newListener( 42 )( listenerNewValueToElement (valueHolder) );
 *
 * let obsExample = InitObservable(0)
 *                      (addListener)(listenerValue)
 *
 * observedObject.value === 0  // variable "observedObject" get updated from InitialValue
 *
 * obsExample = obsExample(setValue)(11)
 *
 * observedObject.value === 11  // variable "observedObject" get updated
 *
 * obsExample = obsExample(removeListener)(listenerValue)
 *
 * obsExample = obsExample(setValue)(66)
 *
 * observedObject.value === 11  // variable "observedObject" getting no updates anymore
 */
const removeListener = listeners => value => handler =>
    Observable(removeByKey(listeners)(handler(fst)))(value)

// Observable Tools
const logListenersToConsole = listeners => _ => {
    const logIteration = (acc, curr) => {
        const index = acc + 1;
        const val = typeof (curr) === 'object' ? JSON.stringify(curr) : curr;
        console.log('element at: ' + index + ': ' + showPair(val));
        return index;
    };
    reduce(logIteration)(0)(listeners);
};


// Observable Handler-Utilities

/**
 * Syntactic sugar for creating a pair of Key and Value for the new Listener.
 * The key could be anything that can be comparable. (Hint: Functions are not comparable except they have a notation like n1, n2, id, pair ... etc.)
 * The listenerFn takes two arguments "newValue" and "oldValue" from the the observable. Some Listener-Function are available and ready to use.
 *
 * @function
 * @param {*} key
 * @return {function(listenerFn:function): listener} new listener for the observable
 * @example
 *
 */
const  newListener = key => listenerFn => pair(key)(listenerFn);

/*
    Listener-Functions
 */
const listenerLogToConsole                        =            nVal => oVal => console.log(`Value: new = ${nVal}, old = ${oVal}`)
const listenerNewValueToElement                   = element => nVal => oVal => element.value = nVal
const listenerNewValueToDomElementTextContent     = element => nVal => oVal => element.textContent = nVal
const listenerOldValueToDomElementTextContent     = element => nVal => oVal => element.textContent = oVal
const listenerNewValueLengthToElementTextContent  = element => nVal => oVal => element.textContent = nVal.length
