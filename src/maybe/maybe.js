import { id } from "../lambda-calculus-library/lambda-calculus.js";
export { Nothing, Just, maybe,
        maybeDiv, maybeElement, getOrDefault, getSafeElement, getSafeElements, getSafeElementAbstraction
}


const Nothing  = () => f => _ => f ();
const Just     = x  => _ => g => g (x);
const maybe    = id;

const getOrDefault = maybeFn => defaultVal => maybe(maybeFn)
                                                    (() => defaultVal)
                                                    (id)
const maybeDiv = num => divisor =>
    divisor === 0
        ? Nothing()
        : Just(num / divisor);

const nullSafe = element =>
    element
        ? Just(element)
        : Nothing()

const maybeElement = elemId => nullSafe(document.getElementById(elemId))

const getSafeElementAbstraction = elemId => elementFunction =>
    maybe(maybeElement(elemId)
    (() => console.error(elemId + " doesnt exist") )
    (elementFunction))

const getSafeElement = elemId =>
    getSafeElementAbstraction(elemId)(id)

const getSafeElements = (...elemIds) => elemIds.map(getSafeElement)