import {addListener, newListener, Observable, setValue} from "../../observable.js";
import {eitherDomElement, eitherElementsOrErrorsByFunction} from "../../../maybe/maybe.js";
import {HttpGet} from "../../../IO/http.js";
import {Box, fold, mapf} from "../../../box/box.js";
import {fst, pair, snd} from "../../../lambda-calculus-library/lambda-calculus.js";
import {convertElementsToStack, convertStackToArray, forEach, logStackToConsole} from "../../../stack/stack.js";
import {convertObjToListMap, getElementByKey} from "../../../listMap/listMap.js";
import {speak} from "../observableUtilities.js";

eitherElementsOrErrorsByFunction(eitherDomElement)("jokeHistory", "norrisBtn", "nerdyBtn", "trumpBtn")
(mis => {
    logStackToConsole(mis)
    document.getElementsByTagName("body")[0].innerHTML = "ERROR"
})
(e => {

    const [jokeHistory, norrisBtn, nerdyBtn, trumpBtn] = convertStackToArray(e)

    console.log(jokeHistory)

// const jokesHistoryDiv = getDomElement("jokeHistory");
// // Get the elements from the Dom
// const [norrisBtn, nerdyBtn, trumpBtn] = getDomElements("norrisBtn", "nerdyBtn", "trumpBtn");


    const listenerSpeak = newListener(nValue => oValue => speak(nValue(snd)));
    const listenerJokeToDom = newListener(nValue => oValue => {
        const template = document.createElement('fieldset');
        template.className = "joke"
        template.innerHTML = `<legend>${nValue(fst)}</legend>
            <p class="jokeText">${nValue(snd)}</p>`
        jokeHistory.insertAdjacentElement('afterbegin', template)
    });


    const jokePairObserver = Observable( pair("nobody")("tell me a joke") )
                                    (addListener)(listenerSpeak)
                                    (addListener)(listenerJokeToDom)


    const jokeNorrisUrl = "https://api.chucknorris.io/jokes/random";            // jsonKey: value
    const jokeNerdUrl = "https://v2.jokeapi.dev/joke/Programming?type=single" // jsonKey: joke
    const trumpTweetUrl = "https://www.tronalddump.io/random/quote";            // jsonKey: value


    const jokeCtor = name => btn => url => jsonKey => convertObjToListMap({name, btn, url, jsonKey});

    const norrisJoke = jokeCtor("Chuck Norris - Joke ")(norrisBtn)(jokeNorrisUrl)("value");
    const nerdJoke   = jokeCtor("Nerd - Joke ")(nerdyBtn)(jokeNerdUrl)("joke");
    const trumpTweet = jokeCtor("Trump Tweet")(trumpBtn)(trumpTweetUrl)("value");

    const jokes = convertElementsToStack(norrisJoke, nerdJoke, trumpTweet);

// add the Joke-Buttons a on-click event listener for request the Jokes and update the Observable
    forEach(jokes)((joke, _) =>
        getElementByKey(joke)("btn").onclick = _ =>
            HttpGet( getElementByKey(joke)("url") )(resp =>
                jokePairObserver(setValue)(Box(resp)
                                            (mapf)(JSON.parse)
                                            (fold)(x => pair( getElementByKey(joke )( "name"))( x[getElementByKey(joke)("jsonKey")] )))));

})