import {getDomElement} from "../../maybe/maybe.js";
export {toHexString, toRGBString, creatHtmlUnsubscribeToggle, addUnSubscriberToggle}
import {addListener, getValue, removeListenerByHandler, setValue} from "../observableListMap.js";


const toRGBString = (r, g, b) => 'rgb(' + r + ',' + g + ',' + b + ')'
const toHexString = (r, g, b) => "#" + toHex(r) + toHex(g) + toHex(b)
const toHex = n => {
    if (n === undefined) n = 0
    let hex = Math.round(n).toString(16)
    return hex.length === 1 ? "0" + hex : hex
}


const creatHtmlUnsubscribeToggle = (parentElementId, appendAsSibling = false) => {
    const parentElement = getDomElement(parentElementId)
    const template = document.createElement('div');
    template.innerHTML = `<input type = "checkbox" id = "unSub${parentElementId}" name = "unSub${parentElementId}" style = "visibility: hidden">
                          <label for = "unSub${parentElementId}" id="unSub${parentElementId}Label" class="unsubLabel">Unsubscribe</label>`

    appendAsSibling
        ? parentElement.parentNode.insertBefore( template, parentElement.nextSibling )
        : parentElement.appendChild( template )


    const [toggleElement, labelElement] = template.children;
    return toggleElement
}

const addUnSubscriberToggle = (observable, handlerName, toggleElement, title) => {
    if (toggleElement.checked) {
        toggleElement.labels[0].textContent = "Subscribe " + title
        return observable(removeListenerByHandler)(handlerName)
    } else {
        toggleElement.labels[0].textContent = "UnSubscribe " + title
        return observable(addListener)(handlerName)
    }
}
