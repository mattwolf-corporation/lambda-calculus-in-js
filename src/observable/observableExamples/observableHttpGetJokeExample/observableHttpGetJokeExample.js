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
import {pair, fst, snd, showPair} from "../../../lambda-calculus-library/lambda-calculus.js";

const jokeNorrisUrl = "https://api.chucknorris.io/jokes/random"; //value
const jokeNerdUrl = "https://v2.jokeapi.dev/joke/Programming?type=single" // joke
const jokeTrump = "https://www.tronalddump.io/random/quote"; // value
const delayUrl = (url, delaySeconds = 2) => `http://slowwly.robertomurray.co.uk/delay/${delaySeconds}000/url/${url}`; // delay 2 seconds by default

// Get the elements from the Dom
const [norrisBtn, nerdyBtn, trumpBtn] = getDomElements("norrisBtn", "nerdyBtn", "trumpBtn");
const [norrisDelayBtn, nerdyDelayBtn, trumpDelayBtn] = getDomElements("norrisDelayBtn", "nerdyDelayBtn", "trumpDelayBtn");

const listenersDiv = getDomElement("listenersDiv");

// Create Listener
const logListener      = newListener( nValue => oValue => console.log( showPair(nValue) ) )//listenersDiv.innerText = nValue); // `${n(fst)}: ${n(snd)}`
const firstListener    = newListener( nValue => oValue => listenersDiv.innerText =  showPair(nValue)   ); // `${n(fst)}: ${n(snd)}`


// Create Observable-Object, define the Initial-Value and append the Listeners
let jokeObserver = Observable( pair("no joke yet")( "tell me one") )
                            (addListener)( logListener     )
                            (addListener)( firstListener   )



// Connect the Observables with the Input-Text-Field.
// Every change in the Input-Field execute the 'setValue'-Function with the new value from Input-Field.
norrisBtn.onclick = _ =>
    HttpGet(jokeNorrisUrl)(resp => jokeObserver(setValue)( Box(resp)(mapf)(JSON.parse)(fold)(x => pair("Chuck Norris")(x.value) ) ));

trumpBtn.onclick = _ =>
    HttpGet(jokeTrump   )(resp => jokeObserver(setValue)( Box(resp)(mapf)(JSON.parse)(fold)(x =>  pair("Trump Tweet")(x.value)  ) ));
