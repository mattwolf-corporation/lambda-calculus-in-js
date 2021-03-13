import {
    Observable,
    addListener,
    removeListener,
    listenerLogToConsole,
    listenerNewValueToDomElementTextContent,
    listenerOldValueToDomElementTextContent,
    newListener,
    listenerNewValueLengthToElementTextContent,
    setValue
}from "../../observable.js";
import {getDomElements, getDomElement, Just, Nothing, Right, Left } from "../../../maybe/maybe.js";
import {HttpGet} from "../../../IO/http.js";
import {Box, mapf, fold} from "../../../box/box.js";
import {pair, fst, snd, showPair, triple, firstOfTriple, secondOfTriple, thirdOfTriple} from "../../../lambda-calculus-library/lambda-calculus.js";
import {convertElementsToStack, logStackToConsole, forEach, map} from "../../../stack/stack.js";
import {convertObjToListMap, getElementByKey} from "../../../listMap/listMap.js";

const speak = txt => {
    const msg = new SpeechSynthesisUtterance(txt);
    msg.lang = "en-US";
    msg.volume = 1; // From 0   to 1    (1)
    msg.rate = 1;   // From 0.1 to 10   (1)
    msg.pitch = 1;  // From 0   to 2    (1)
    speechSynthesis.speak(msg);
}

const Tuple = n =>
    n < 1
        ?  new Error("Tuple must have first argument n > 0")
        : [
            TupleCtor (n) ([]),
            ...Array.from( {length:n}, (it, idx) =>  values => values[idx])
        ]

const TupleCtor = n => values =>
    n === 0
        ? selector => selector(values)
        : value => TupleCtor (n - 1) ([...values, value])



// create Observable

const listenersDiv = getDomElement("listenersDiv");

const listOfJokes = emptyStack;

// Create Listener
const listenerLog      = newListener( nValue => oValue => console.log( showPair(nValue) ) )//listenersDiv.innerText = nValue); // `${n(fst)}: ${n(snd)}`
const listenerSpeak    = newListener( nValue => oValue => speak(nValue(snd))  ); // `${n(fst)}: ${n(snd)}`
const listenerShow     = newListener( nValue => oValue => listenersDiv.innerText =  showPair(nValue)   ); // `${n(fst)}: ${n(snd)}`
const listenerPushList = newListener( nValue => oValue => listOfJokes(push)(nValue))

// Create Observable-Object, define the Initial-Value and append the Listeners
let jokeObserver = Observable( pair("no joke yet")( "tell me one") )
                            (addListener)( listenerLog     )
                            (addListener)( listenerSpeak   )
                            (addListener)( listenerShow    )

const jokeListObserver = Observable(emptyStack)
                            // (addListener)(newListener( n => o => ))

const jokeNorrisUrl = "https://api.chucknorris.io/jokes/random"; //value
const jokeNerdUrl = "https://v2.jokeapi.dev/joke/Programming?type=single" // joke
const jokeTrump = "https://www.tronalddump.io/random/quote"; // value
const delayUrl = (url, delaySeconds = 2) => `http://slowwly.robertomurray.co.uk/delay/${delaySeconds}000/url/${url}`; // delay 2 seconds by default

// Get the elements from the Dom
const [norrisBtn, nerdyBtn, trumpBtn] = getDomElements("norrisBtn", "nerdyBtn", "trumpBtn");
const [norrisDelayBtn, nerdyDelayBtn, trumpDelayBtn] = getDomElements("norrisDelayBtn", "nerdyDelayBtn", "trumpDelayBtn");





// const [Joke, name, btn, url, jsonValue] = Tuple(4)
// const norrisJoke = Joke("Chuck Norris")(norrisBtn)(jokeNorrisUrl)("value")
// const nerdJoke   = Joke("For Nerdy")(nerdyBtn )(jokeNerdUrl)("joke")
//
// const jokesStack = convertElementsToStack(norrisJoke, nerdJoke);
//
// forEach(jokesStack)((joke, _) => {
//     joke(btn).onclick = _ =>
//         HttpGet( joke(url) )(resp =>
//             jokeObserver(setValue)( Box(resp)(mapf)(JSON.parse)(fold)(x => pair( joke(name) )( x[joke(jsonValue)] ))));
// })






const jokeCtor = name => btn => url => jsonValue =>
    convertObjToListMap({  name,  btn,   url,  jsonValue  })

const norrisJoke = jokeCtor("Chuck Norris", norrisBtn, jokeNorrisUrl, "value" );
const nerdJoke   = jokeCtor("For Nerdy",  nerdyBtn,  jokeNerdUrl,  "joke" );


const jokes = convertElementsToStack(norrisJoke, nerdJoke);

forEach(jokes)((joke, _) => {
    getElementByKey(joke)("btn").onclick = _ =>
        HttpGet( getElementByKey(joke)("url"))(resp =>
            jokeObserver(setValue)( Box(resp)(mapf)(JSON.parse)(fold)(x => pair( getElementByKey(joke)("name") )( x[getElementByKey(joke)("jsonValue")] ))));
})
