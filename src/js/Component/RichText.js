import { DOMHelper } from "../Utility/DOMHelper";
import { Link } from "./Link";
export class RichText {
  constructor(data) {
    this.data = data;
  }

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

  parseNode(xmlNode) {
    if (xmlNode instanceof Text) {
      return xmlNode.wholeText;
    } else if (xmlNode instanceof Element) {
      const type =
        xmlNode instanceof Element && xmlNode.hasAttribute("data-fs-type")
          ? xmlNode.getAttribute("data-fs-type")
          : xmlNode.localName;
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
