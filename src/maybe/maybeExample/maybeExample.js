import {maybeDiv, getOrDefault, getSafeElement, getSafeElementAbstraction} from "../maybe.js";

const calcDiv = () => {
    const fstNum = getSafeElementAbstraction('firstNumInput')
    (elem => Number(elem.value))


    const sndNum = getSafeElementAbstraction('secondNumInput')
    (elem => Number(elem.value))

    const result = getSafeElement('result')

    result.innerText = getOrDefault(maybeDiv(fstNum)(sndNum))(0)
}

getSafeElementAbstraction('divisionBtn')
(btn => btn.onclick = calcDiv)
