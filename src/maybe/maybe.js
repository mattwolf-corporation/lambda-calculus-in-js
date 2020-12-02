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

const maybeHandler = maybeFn => handleGood => handleBad => maybe(maybeFn)(handleBad)(handleGood) // syntactic sugar
const getOrDefault = maybeFn => defaultVal => maybe(maybeFn)
                                                    (() => defaultVal)
                                                    (id)

const safeDivision = num => divisor => maybe(safeDiv(num)(divisor))
                                (() => console.error("divisor is zero"))
                                (id)


const getElementOrDefault = getOrDefault(getMaybeElement('label'))('')

const calcDiv = () => {
    const fstNum = getOrDefault(getMaybeElement('firstNumInput'))(() => console.error('firstNumInput doesnt exist'));
    const sndNum = getOrDefault(getMaybeElement('secondNumInput'))(() => console.error('secondNumInput doesnt exist'));
    const result = getOrDefault(getMaybeElement('result'))(() => console.error('result doesnt exist'));

    const num = Number(fstNum.value);
    const divisor = Number(sndNum.value);

    result.innerText = getOrDefault(safeDiv(num)(divisor))(0);
}