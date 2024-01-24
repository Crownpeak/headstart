import { DOMHelper } from "../Utility/DOMHelper";
import { App } from "../App";

/**
 * Used to create links inside of a rich text.
 */
export class Link {
  /**
   * Creates an instance of Link.
   */
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }

  /**
   * Creates a link, differentiating by type.
   *
   * @returns {HTMLElement} a link
   */
  render() {
    const link = document.createElement("a");
    const linkData = JSON.parse(this.data);
    DOMHelper.setCSSClass(
      link,
      ["inline-block", "text-blue-900", "hover:underline", "font-bold"],
      []
    );

    switch (this.type) {
      case "link.internal_link":
        if (linkData.lt_link?.value?.identifier) {
          const route = App.router.getRouteForId(
            linkData.lt_link?.value?.identifier
          );
          link.href = route.path;
        }
        link.innerText = linkData.lt_text?.value;
        link.setAttribute("data-link", "");
        break;
      case "link.external_link":
        link.href = linkData.lt_link?.value;
        link.innerText = linkData.lt_text?.value;
        link.setAttribute("target", "_blank");
        break;
      default:
        return;
    }
    return link;
  }
}
