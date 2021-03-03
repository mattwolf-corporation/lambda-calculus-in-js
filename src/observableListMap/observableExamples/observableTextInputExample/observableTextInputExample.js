import {
    InitObservable,
    addListener,
    removeListenerByHandler,
    handlerFnLogToConsole,
    buildHandlerFnTextContent,
    buildHandlerFnTextContentOldValue,
    handlerBuilder,
    buildHandlerFnTextContentLength,
    setValue,
    logListenersToConsole
}from "../../observableListMap.js";
import {getDomElements, Just, Nothing, } from "../../../maybe/maybe.js";
import {convertArrayToStack, push, reduce, logStackToConsole, map} from "../../../stack/stack.js";
import {flatMapMaybe, mapMaybe} from "../../../box/box.js";
import {pair, showPair, fst, snd} from "../../../lambda-calculus-library/lambda-calculus.js";
import {emptyListMap} from "../../../listMap/listMap.js";

const maybes = (...ms) => fn => {
    const mayStacks = convertArrayToStack(ms);
    forEach(mayStacks)(m => m()())
}

// variante 1
// ("inputText", maybe("inputText"))
// maybes("inputText", "newValue")(m => document.getElementById(m))
// (_ => console.error) //wenn einer failed und erstell eine RIESEN TEXT ERROR PAGE ans DOM BODY
// (stack => {           // wenn alle erfolgreich
//     // Problem wie weiss man welches element was ist und name ???
//     // Lüsung evtl listMap verwenden weil keyValue und dann kann save auf getElment by key zugegegriffen werden
//
//     const inputText = getElementByKey(stack)("inpuText")
//
//     startProgramm(inputText, newValue) // final aus
// } )

//
// function startProgramm(...args){
//     args === [inputText,newValue  ]
// }

//// Test

const startProgram = param1 => param2 => {};

const t = str => {
    const elem = document.getElementById(str);
    return elem ? Just(elem) : Nothing;
}

const logListMapToConsole = listmap => {
    const logIteration = (acc, curr) => {
        const index = acc + 1;
        const key = curr(fst);
        const val = curr(snd);
        const element = typeof (val) === 'object' ? JSON.stringify(val) : val;
        console.log('element at: ' + index + ': ' + showPair(pair(key)(val)));
        return index;
    };
    reduce(logIteration)(0)(listmap);
};

const eitherElements = maybeFunc => (...elements) => {
    const stackWithElems = convertArrayToStack(elements);
    logStackToConsole(stackWithElems);
    //const values = map(key => maybeFunc(key))(stackWithElems);
    // const pairs = elements.map(key => {
    //     const maybeElem = maybeFunc(key);
    //     return pair(key)(maybeElem);
    // });

    //const listM = zipListMap(stackWithElems)(values);

    // reduce((acc, curr) => mapMaybe(curr)(val => mapMaybe()))(emptyStack)(s)
    return reduce
    ((acc, curr) => flatMapMaybe(acc)(listMap => mapMaybe(maybeFunc(curr))(val => push(listMap)( pair(curr)(val) ) ) )
    )
    (Just(emptyListMap))
    (stackWithElems)
}
// key => maybeFunc(key) ||  [Just(elem1), Just(Elem2), Nothing, Just(Elem3)] => Just([elem1, elem2, Elem3])
eitherElements(str => t(str))("inputText", "newValue")(_ => console.error("wtffff!"))
(listMap => {
        // logListMapToConsole(stack)
        //stack => console.log(stack)
        const inputText = getElementByKey(listMap)("inputText");
        const newValue = getElementByKey(listMap)("newValue");

        startProgram(inputText, newValue);
    }
)



////

//varinate 2

// const kmaybes = maybeKaskade
//                     (maybeNumber(3))
//                     (nextMaybe)
//                     (maybeNumber(4))
//                     (nextMaybe)
//                     (maybeNumber(5))
//                     (endMaybe)
//
// kmaybes === ([Just3,Just4,Just5])



// The Elements from the Dom
const [inputText, newValue, oldValue, sizes] = getDomElements("inputText", "newValue", "oldValue", "sizes");

// Define Observable-Handler
const newValueHandler     = handlerBuilder(1)( buildHandlerFnTextContent          (newValue) );
const oldValueHandler     = handlerBuilder(2)( buildHandlerFnTextContentOldValue  (oldValue) );
const labelSizeHandler    = handlerBuilder(3)( buildHandlerFnTextContentLength    (sizes)    );
const consoleHandler      = handlerBuilder(4)( handlerFnLogToConsole                         );

// Create Observable-Object, define InitVal and append the Observable-Handler as Listener
let valueObservables = InitObservable("")
                            (addListener)( newValueHandler  )
                            (addListener)( oldValueHandler  )
                            (addListener)( labelSizeHandler )
                            (addListener)( consoleHandler   );

// Connect the Observables with the Input-Text-Field
inputText.oninput = _ => valueObservables = valueObservables(setValue)(inputText.value);


//For demonstration, how to Un- & Subscribe the Handler from the Observable-Object
const [unsubNewValue, unsubOldValue, unsubSize] = getDomElements("unsubNewValue", "unsubOldValue", "unsubSize");

unsubNewValue.onclick = _ =>
    valueObservables =
        unsubNewValue.checked
            ? valueObservables(addListener)(newValueHandler)
            : valueObservables(removeListenerByHandler)(newValueHandler);

unsubOldValue.onclick = _ =>
    valueObservables =
        unsubOldValue.checked
            ? valueObservables(addListener)(oldValueHandler)
            : valueObservables(removeListenerByHandler)(oldValueHandler);

unsubSize.onclick = _ =>
    valueObservables =
        unsubSize.checked
            ? valueObservables(addListener)(labelSizeHandler)
            : valueObservables(removeListenerByHandler)(labelSizeHandler);
