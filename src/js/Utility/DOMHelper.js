export class DOMHelper {
  /**
   * @param {HTMLElement} element to remove all listeners
   * @returns {HTMLElement} with no listerners
   */
  static clearEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }

  /**
   * @param {HTMLElement} element to add or remove css classes
   * @param {Array<String>} add css classes to add
   * @param {Array<String>} remove css classes to remove
   */
  static setCSSClass(element, add, remove) {
    element.classList.add(...add);
    element.classList.remove(...remove);
  }

  /**
   * Creats a new HTMLElement based on the given string definition.
   *
   * @param {String} HTML representing a element
   * @return {HTMLElement}
   */
  static htmlToElement(html) {
    var template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstChild;
  }

  /**
   * Creats a list of new HTMLElement based on the given string definition.
   *
   * @param {*} html representing any number of sibling elements
   * @returns {NodeList}
   */
  static htmlToElements(html) {
    var template = document.createElement("template");
    template.innerHTML = html;
    return template.content.childNodes;
  }

  /**
   * Append the given node list to the HTML Element
   *
   * @param {HTMLElement} parent to search in
   * @param {String} selector
   * @param {NodeList} nodeList    
   */
  static appendNodes(parent, selector, nodeList) {
    const element = parent.querySelector(selector);    
    for(let i = 0; i < nodeList.length; i++){
      element.appendChild(nodeList[i]);    
    }    
  }
}
