import { DOMHelper } from "../Utility/DOMHelper";
import { Link } from "./Link";

/**
 * Renders a CMS rich text
 */
export class RichText {
  /**
   * Creates an instance of RichText.
   */
  constructor(data) {
    this.data = data;
  }

  /**
   * Parses the specified Rich Text XML information and generates new HTML elements accordingly.
   * 
   * @returns {HTMLElement} for that rich text
   */
  render() {
    const enhancedData = "<root>" + this.data + "</root>";
    const domParser = new DOMParser();
    const dataXml = domParser.parseFromString(enhancedData, "text/xml");

    const textElements = [];
    if (dataXml.firstChild.hasChildNodes) {
      for (let xmlNode of dataXml.firstChild.childNodes) {
        textElements.push(this.parseNode(xmlNode));
      }
    }
    return textElements;
  }

  /**
   * Creates a new HTML element based on the specified XML.
   * 
   * @param {xmlNode} xmlNode 
   * @returns {HTMLElement}
   */
  parseNode(xmlNode) {
    if (xmlNode instanceof Text) {
      // If it is just text
      return xmlNode.wholeText;
    } else if (xmlNode instanceof Element) {
      // the CMS format template type
      const type =
        xmlNode instanceof Element && xmlNode.hasAttribute("data-fs-type")
          ? xmlNode.getAttribute("data-fs-type")
          : xmlNode.localName;
      // handling of the different types
      switch (type) {
        case "link.internal_link":
        case "link.external_link":
          const linkData = xmlNode.querySelector("script").textContent;
          const link = new Link(type, linkData);
          return link.render();
          break;
        case "p":
        case "u":
          // and maybe more.....
          const childElement = document.createElement(type);
          if (xmlNode.hasChildNodes) {
            for (let child of xmlNode.childNodes) {
              childElement.append(this.parseNode(child));
            }
          }
          return childElement;
          break;
        default:
          // Fallback
          return DOMHelper.htmlToElement(xmlNode.outerHTML);
      }
    }
    return null;
  }
}
