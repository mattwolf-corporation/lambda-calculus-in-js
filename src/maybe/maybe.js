import { id } from "../lambda-calculus-library/lambda-calculus.js";
export { Nothing, Just, maybe,
        maybeDiv, maybeElement, getOrDefault, getSafeElements
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

const getSafeElements = (...elemIds) =>
     elemIds.map(e => maybe(maybeElement(e))
                             (() => console.error(e + " doesnt exist") )
                             (id))






const getOrDefault = maybeFn => defaultVal => maybe(maybeFn)
                                                    (() => defaultVal)
                                                    (id)


