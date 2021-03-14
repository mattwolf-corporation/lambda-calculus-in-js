import {addListener, newListener, Observable, setValue} from "../../observable.js";
import {eitherDomElement, eitherElementsOrErrorsByFunction} from "../../../maybe/maybe.js";
import {HttpGet} from "../../../IO/http.js";
import {Box, fold, mapf} from "../../../box/box.js";
import {fst, pair, snd} from "../../../lambda-calculus-library/lambda-calculus.js";
import {convertElementsToStack, convertStackToArray, forEach} from "../../../stack/stack.js";
import {convertListMapToArray, convertObjToListMap, getElementByKey} from "../../../listMap/listMap.js";
import {speak} from "../observableUtilities.js";

// Either all the necessary Dom-Element exist and or display all missed Element
eitherElementsOrErrorsByFunction(eitherDomElement)("jokeHistory", "norrisBtn", "nerdyBtn", "trumpBtn")
(err => document.body.innerHTML = Box(err)(mapf)(convertStackToArray)(mapf)(s => s.join(", <br>"))(fold)(txt => `<div style="background: orangered"> <br> ${txt}</div>`))
(result => {

    // receive founded the elements
    const [jokeHistory, norrisBtn, nerdyBtn, trumpBtn] = convertListMapToArray(result)

    // create the Listeners (text-to-speech & display to view)
    const listenerSpeak = newListener(nValue => oValue => speak(nValue(snd)));
    const listenerJokeToDom = newListener(nValue => oValue => {
        const template = document.createElement('fieldset');
        template.className = "joke"
        template.innerHTML = `<legend>${nValue(fst)}</legend>
            <p class="jokeText">${nValue(snd)}</p>`
        jokeHistory.insertAdjacentElement('afterbegin', template)
    });

    // create the Observable with pair data structure ("Title")("Joke")
    const jokePairObserver = Observable( pair("nobody")("tell me a joke") )
                                    (addListener)( listenerSpeak )
                                    (addListener)( listenerJokeToDom )


    // Jokes-API-URLs
    const jokeNorrisUrl = "https://api.chucknorris.io/jokes/random";            // jsonKey: value
    const jokeNerdUrl   = "https://v2.jokeapi.dev/joke/Programming?type=single" // jsonKey: joke
    const trumpTweetUrl = "https://www.tronalddump.io/random/quote";            // jsonKey: value


    // Constructor for a Joke-Object
    const jokeCtor = name => btn => url => jsonKey => convertObjToListMap({name, btn, url, jsonKey});

    // creat Joke-Object
    const norrisJoke = jokeCtor("Chuck Norris - Joke ")(norrisBtn)(jokeNorrisUrl)("value");
    const nerdJoke   = jokeCtor("Nerd - Joke ")(nerdyBtn)(jokeNerdUrl)("joke");
    const trumpTweet = jokeCtor("Trump Tweet")(trumpBtn)(trumpTweetUrl)("value");

    // combine the Joke-Objects into a stack
    const jokes = convertElementsToStack(norrisJoke, nerdJoke, trumpTweet);

    // add the Joke-Buttons a on-click event listener for request the Jokes and update the Observable
    forEach(jokes)((joke, _) =>
        getElementByKey(joke)("btn").onclick = _ =>
            HttpGet( getElementByKey(joke)("url") )(resp =>
                jokePairObserver(setValue)(Box(resp)
                                            (mapf)(JSON.parse)
                                            (fold)(x => pair( getElementByKey(joke )( "name"))( x[getElementByKey(joke)("jsonKey")] )))));
})