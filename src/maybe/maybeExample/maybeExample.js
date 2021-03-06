import {maybeDivision, getOrDefault, getDomElement, eitherDomElementOrConsoleError} from "../maybe.js";

const calcDiv = () => {
    const fstNum = eitherDomElementOrConsoleError('firstNumInput')(elem => Number(elem.value))

    const sndNum = eitherDomElementOrConsoleError('secondNumInput')(elem => Number(elem.value))

    getDomElement('result').textContent = getOrDefault(maybeDivision(fstNum)(sndNum))("Can't divide by zero")
}

eitherDomElementOrConsoleError('divisionBtn')(btn => btn.onclick = calcDiv)
