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
import {getDomElements, Just, Nothing, mapEither, flatMapEither, Right, Left } from "../../../maybe/maybe.js";
import {convertArrayToStack, push, reduce, logStackToConsole, map, emptyStack} from "../../../stack/stack.js";
import {flatMapMaybe, mapMaybe} from "../../../box/box.js";
import {pair, showPair, fst, snd} from "../../../lambda-calculus-library/lambda-calculus.js";
import {emptyListMap, getElementByKey} from "../../../listMap/listMap.js";


//// Test

const startProgram = param1 => param2 => {};

const t = str => {
    const elem = document.getElementById(str);
    return elem ? Just(elem) : Nothing;
}

const t2 = str => {
    const elem = document.getElementById(str);
    return elem ? Right(elem) : Left(`element with id: '${str}' does not exist`);
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

    return reduce
    ((acc, curr) => flatMapMaybe(acc)(listMap => mapMaybe(maybeFunc(curr))(val => push(listMap)( pair(curr)(val) ) ) ))
    (Just(emptyListMap))
    (stackWithElems)
}

const eitherElements2 = eitherFunc => (...elements) => {
    const stackWithElems = convertArrayToStack(elements);

    return reduce
    ((acc, curr) => acc
                                ( stack => Left( (eitherFunc(curr))
                                                        (err => push(stack)(err))
                                                        (_ => stack) )
                                )
                                ( listMap => (eitherFunc(curr))
                                                    (err => Left(push(emptyStack)(err)) )
                                                    (val => Right(push(listMap)( pair(curr)(val) )) )
                                )
    )
    (Right(emptyListMap))
    (stackWithElems);
}
// key => maybeFunc(key) ||  [Just(elem1), Just(Elem2), Nothing, Just(Elem3)] => Just([elem1, elem2, Elem3])
eitherElements2(str => t2(str))("inputtText", "newVeeealue")
(stackOfErrors => logStackToConsole(stackOfErrors))
(listMapWithElements => { // TODO: array destructuring
        const [a,b,c] = convertStackToArray(stackOfElements);
        // logListMapToConsole(stack)
        // stack => console.log(stack)
        const inputText = getElementByKey(listMapWithElements)("inputText");
        const newValue = getElementByKey(listMapWithElements)("newValue");

        console.log(inputText);
        console.log(newValue);

        startProgram(inputText, newValue);
    }
)
////


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
