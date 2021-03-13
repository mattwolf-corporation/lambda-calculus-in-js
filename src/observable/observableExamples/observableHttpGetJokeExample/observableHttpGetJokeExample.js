import {
    Observable,
    addListener,
    removeListener,
    listenerLogToConsole,
    listenerNewValueToDomElementTextContent,
    listenerOldValueToDomElementTextContent,
    newListener,
    listenerNewValueLengthToElementTextContent,
    setValue, getValue
}from "../../observable.js";
import {getDomElements, getDomElement, Just, Nothing, Right, Left } from "../../../maybe/maybe.js";
import {HttpGet} from "../../../IO/http.js";
import {Box, mapf, fold} from "../../../box/box.js";
import {pair, fst, snd, showPair, triple, firstOfTriple, secondOfTriple, thirdOfTriple} from "../../../lambda-calculus-library/lambda-calculus.js";
import {convertElementsToStack, logStackToConsole, forEach, map,push, emptyStack, reverseStack} from "../../../stack/stack.js";
import {convertObjToListMap, getElementByKey, logListMapToConsole, listMap, mapListMap} from "../../../listMap/listMap.js";

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

const jokesHistoryDiv = getDomElement("jokeHistory");

let historyOfJokes = emptyStack;



const listenerLog              = newListener( nValue => oValue => console.log( showPair(nValue) ))
const listenerSpeak            = newListener( nValue => oValue => speak(nValue(snd))  );
const listenerJokeToDom        = newListener( nValue => oValue => {  historyOfJokes = push(historyOfJokes)(nValue)
                                                                             forEach(historyOfJokes)((joke, index) => {
                                                                                 const template = document.createElement('div');
                                                                                 template.className = "joke"
                                                                                 template.innerHTML = `<h5>Joke Nr. ${index}</h5>
                                                                                                       <h4>${joke(fst)}</h4>
                                                                                                       <p class="jokeText">${joke(snd)}</p>`

                                                                                 jokesHistoryDiv.insertAdjacentElement('afterbegin', template)
                                                                             })
                                                                            });


let jokePairObserver = Observable(pair("no joke yet")("tell me one"))
                            (addListener)( listenerLog      )
                            (addListener)( listenerSpeak    )
                            (addListener)( listenerJokeToDom)


const jokeNorrisUrl = "https://api.chucknorris.io/jokes/random"; //value
const jokeNerdUrl = "https://v2.jokeapi.dev/joke/Programming?type=single" // joke
const trumpTweetUrl = "https://www.tronalddump.io/random/quote"; // value
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

const jokeCtor = name => jsonValue => btn => url =>
    convertObjToListMap( {name, jsonValue, btn, url} )

const norrisJoke        = jokeCtor("Chuck Norris")("value")
const nerdJoke          = jokeCtor("Nerd")        ("joke")
const trumpTweet        = jokeCtor("Trump")       ("value")
const norrisJokeNorm    = norrisJoke (norrisBtn)      (jokeNorrisUrl);
const nerdJokeNorm      = nerdJoke   (nerdyBtn)       (jokeNerdUrl);
const trumpTweetNorm    = trumpTweet (trumpBtn)       (trumpTweetUrl);
const norrisJokeDelay   = norrisJoke (norrisDelayBtn) (delayUrl(jokeNorrisUrl));
const nerdJokeDelay     = nerdJoke   (nerdyDelayBtn)  (delayUrl(jokeNerdUrl));
const trumpTweetDelay   = trumpTweet (trumpDelayBtn)  (delayUrl(trumpTweetUrl));

const jokes = convertElementsToStack(
    norrisJokeNorm
    , nerdJokeNorm
    , trumpTweetNorm
    , norrisJokeDelay
    , nerdJokeDelay
    , trumpTweetDelay);

forEach(jokes)((joke, _) => {
    getElementByKey(joke)("btn").onclick = _ =>
        HttpGet( getElementByKey(joke)("url"))(resp =>
            jokePairObserver(setValue)( Box(resp)(mapf)(JSON.parse)(fold)(x => pair( getElementByKey(joke)("name") )( x[getElementByKey(joke)("jsonValue")] ))));
})