import {Observable, addListener, newListener, setValue }from "../../observable.js";
import {
    getDomElements,
    getDomElement,
    Just,
    Nothing,
    Right,
    Left,
    eitherElementsOrErrorsByFunction,
    eitherDomElement
} from "../../../maybe/maybe.js";
import {HttpGet} from "../../../IO/http.js";
import {Box, mapf, fold} from "../../../box/box.js";
import {pair, fst, snd, showPair, triple, firstOfTriple, secondOfTriple, thirdOfTriple} from "../../../lambda-calculus-library/lambda-calculus.js";
import {convertElementsToStack, logStackToConsole, forEach, map,push, emptyStack, reverseStack} from "../../../stack/stack.js";
import {convertObjToListMap, getElementByKey, logListMapToConsole, listMap, mapListMap} from "../../../listMap/listMap.js";
import { speak } from "../observableUtilities.js";

eitherElementsOrErrorsByFunction(eitherDomElement)("jokeHisstory", "norrisBtn", "nerdyBtn", "trumpBtn")
(mis => {
    logStackToConsole(mis)
    document.getElementsByTagName("body")[0].innerHTML = " ERROR "
})
(e => {

const jokesHistoryDiv = getDomElement("jokeHistory");
// Get the elements from the Dom
const [norrisBtn, nerdyBtn, trumpBtn] = getDomElements("norrisBtn", "nerdyBtn", "trumpBtn");


const listenerSpeak            = newListener( nValue => oValue => speak(nValue(snd))  );
const listenerJokeToDom        = newListener( nValue => oValue => {
                                                                                 const template = document.createElement('fieldset');
                                                                                 template.className = "joke"
                                                                                 template.innerHTML = `<legend>${nValue(fst)}</legend>
                                                                                                       <p class="jokeText">${nValue(snd)}</p>`
                                                                                 jokesHistoryDiv.insertAdjacentElement('afterbegin', template)
                                                                            });


const jokePairObserver = Observable(pair("nobody")("tell me a joke"))
                            (addListener)( listenerSpeak    )
                            (addListener)( listenerJokeToDom)


const jokeNorrisUrl = "https://api.chucknorris.io/jokes/random";            // jsonKey: value
const jokeNerdUrl   = "https://v2.jokeapi.dev/joke/Programming?type=single" // jsonKey: joke
const trumpTweetUrl = "https://www.tronalddump.io/random/quote";            // jsonKey: value



const jokeCtor = name =>  btn => url => jsonKey =>
    convertObjToListMap( {name,  btn, url, jsonKey } );

const norrisJoke   = jokeCtor("Chuck Norris - Joke ")(norrisBtn) (jokeNorrisUrl) ("value");
const nerdJoke     = jokeCtor("Nerd - Joke ")        (nerdyBtn)  (jokeNerdUrl)   ("joke") ;
const trumpTweet   = jokeCtor("Trump Tweet")       (trumpBtn)  (trumpTweetUrl) ("value");

const jokes = convertElementsToStack(norrisJoke, nerdJoke, trumpTweet);

// add the Joke-Buttons the on-click event listener for request the Jokes and update the Observable
forEach(jokes)((joke, _) =>
    getElementByKey(joke)("btn").onclick = _ =>
        HttpGet( getElementByKey(joke)("url") )(resp =>
            jokePairObserver(setValue)( Box(resp)
                                            (mapf)(JSON.parse)
                                            (fold)(x => pair( getElementByKey(joke)("name") )( x[getElementByKey(joke)("jsonKey")] )))));

})