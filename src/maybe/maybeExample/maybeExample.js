import {maybeDiv, getOrDefault, getSafeElement, getSafeElementAbstraction} from "../maybe.js";

const calcDiv = () => {
    const fstNum = getSafeElementAbstraction('firstNumInput')
    (elem => Number(elem.value))

    const sndNum = getSafeElementAbstraction('secondNumInput')
    (elem => Number(elem.value))

    getSafeElement('result').textContent = getOrDefault(maybeDiv(fstNum)(sndNum))("Can't divide by zero")
}

getSafeElementAbstraction('divisionBtn')
(btn => btn.onclick = calcDiv)
