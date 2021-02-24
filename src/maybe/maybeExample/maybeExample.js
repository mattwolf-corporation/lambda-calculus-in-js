import {maybeDiv, getOrDefault, getDomElement, getDomElementAbstraction} from "../maybe.js";

const calcDiv = () => {
    const fstNum = getDomElementAbstraction('firstNumInput')
    (elem => Number(elem.value))

    const sndNum = getDomElementAbstraction('secondNumInput')
    (elem => Number(elem.value))

    getDomElement('result').textContent = getOrDefault(maybeDiv(fstNum)(sndNum))("Can't divide by zero")
}

getDomElementAbstraction('divisionBtn')
(btn => btn.onclick = calcDiv)
