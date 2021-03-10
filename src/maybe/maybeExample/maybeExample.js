import {maybeDivision, getOrDefault, getDomElement, getDomElements} from "../maybe.js";

const calcDiv = () => {
    const [fstNum, sndNum] = getDomElements('firstNumInput', 'secondNumInput').map(e => Number(e.value))
    getDomElement('result').textContent = getOrDefault(maybeDivision(fstNum)(sndNum))("Can't divide by zero")
}
getDomElement('divisionBtn').onclick = calcDiv;
