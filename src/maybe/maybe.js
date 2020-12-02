import { id} from "../lambda-calculus-library/lambda-calculus.js";
export { Nothing, Just, maybe,
        maybeDiv, maybeElement, getOrDefault,
}


const Nothing  = () => f => _ => f ();
const Just     = x  => _ => g => g (x);
const maybe    = id;

const maybeDiv = num => divisor =>
    divisor === 0
        ? Nothing()
        : Just(num / divisor);

const maybeElement = elemId => {
    const element = document.getElementById(elemId)
    return element
        ? Just(element)
        : Nothing()
}

const getOrDefault = maybeFn => defaultVal => maybe(maybeFn)
                                                    (() => defaultVal)
                                                    (id)


const calcDiv = () => {
    const fstNum = maybe(maybeElement('firstNumInput'))
                        (() => console.error('firstNumInput doesnt exist'))
                        (elem => Number(elem.value));

    const sndNum = maybe(maybeElement('secondNumInput'))
                        (() => console.error('secondNumInput doesnt exist'))
                        (elem => Number(elem.value));

    const result = maybe(maybeElement('result'))
                        (() => console.error('result doesnt exist'))
                        (id);

    result.innerText = getOrDefault(maybeDiv(fstNum)(sndNum))(0);
}

maybe(  maybeElement('divisionBtn'))
        (() => console.error('divisionBtn doesnt exist'))
        (btn => btn.onclick = calcDiv);
