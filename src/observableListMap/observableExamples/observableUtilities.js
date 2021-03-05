import {getDomElement} from "../../maybe/maybe.js";
export {toHexString, toRGBString, creatHtmlUnsubscribeToggle, addUnSubscriberToggle}
import {addListener, getValue, removeListenerByHandler, setValue} from "../observableListMap.js";


const toRGBString = (r, g, b) => 'rgb(' + r + ',' + g + ',' + b + ')'
const toHexString = (r, g, b) => "#" + toHex(r) + toHex(g) + toHex(b)
const toHex = n => {
    const hex = Math.round(n ? n : 0).toString(16)
    return hex.length === 1 ? "0" + hex : hex
}

const creatHtmlUnsubscribeToggle = ( parentElementId, title, appendAsSibling = false) => {
    const parentElement = getDomElement(parentElementId)
    const template      = document.createElement('div');
    template.innerHTML = `<input type = "checkbox" id = "unSub${parentElementId}" name = "unSub${parentElementId}" style = "visibility: hidden">
                          <label for = "unSub${parentElementId}" id="unSub${parentElementId}Label" class="unsubLabel" title="${title}">Unsubscribe ${title}</label>`

    appendAsSibling
        ? parentElement.parentNode.insertBefore( template, parentElement.nextSibling )
        : parentElement.appendChild( template )


    const [toggleElement, labelElement] = template.children;
    return toggleElement
}

const addUnSubscriberToggle = (observable, handlerName, toggleElement) => {
    toggleElement.labels[0].textContent = (toggleElement.checked ? "Subscribe " : "UnSubscribe ") + toggleElement.labels[0].title

    if (toggleElement.checked) {
        return observable(removeListenerByHandler)(handlerName)
    } else {
        return observable(addListener)(handlerName)
    }


}
