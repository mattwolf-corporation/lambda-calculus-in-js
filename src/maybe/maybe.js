const Nothing  = () => f => _ => f ();
const Just     = x  => _ => g => g (x);
const maybe    = id;

const safeDiv = num => divisor =>
    divisor === 0
        ? Nothing()
        : Just(num / divisor);

const getMaybeElement = elemId => {
    const element = document.getElementById(elemId)
    return element
        ? Just(element)
        : Nothing()
}

const getOrDefault = maybeFn => defaultVal => maybe(maybeFn)
                                                    (() => defaultVal)
                                                    (id)

const safeDivision = num => divisor => maybe(safeDiv(num)(divisor))
                                (() => console.error("divisor is zero"))
                                (id)


const getElementOrDefault = getOrDefault(getMaybeElement('label'))('')

const calcDiv = () => {
    const fstNum = maybe(getMaybeElement('firstNumInput'))   (() => console.error('firstNumInput doesnt exist'))  (elem => Number(elem.value));
    const sndNum = maybe(getMaybeElement('secondNumInput'))  (() => console.error('secondNumInput doesnt exist')) (elem => Number(elem.value));
    const result = maybe(getMaybeElement('result'))          (() => console.error('result doesnt exist'))         (id);

    result.innerText = getOrDefault(safeDiv(fstNum)(sndNum))(0);
}