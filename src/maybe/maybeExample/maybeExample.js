import { maybe, maybeDomElement, maybeDiv, getOrDefault, getSafeElement, getSafeElementAbstraction} from "../maybe.js";
import {id} from "../../lambda-calculus-library/lambda-calculus.js";

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
