import { App } from "../App";
import { DOMHelper } from "../Utility/DOMHelper";

/**
 * Displays the top level of the navigation.
 */
export class Navigation {
  /**
   * Creates an instance of Navigation.
   */
  constructor() {
    this.nav = document.querySelector("#nav-menu");
  }

  /**
   * Gets the navigation from the router and displays the top level.
   */
  render() {
    if (App.router) {
      const topLevel = App.router.getTopLevel();
      this.nav.replaceChildren();
      topLevel.forEach(this.appendNavItems);
    }
  }

  appendNavItems = (element) => {
    this.nav.appendChild(
      this.createNavListItem(element, ["mb-3", "px-2", "mb-0"])
    );
  };

  /**
   * Creates a new list entry for the passed navigation item.
   *
   * @param {JSON} itemInfo of the navigation point
   * @param {Array} cssClasses
   * @returns {HTMLElement} list entry for the passed nav infos
   */
  createNavListItem(itemInfo, cssClasses) {
    const li = document.createElement("li");
    DOMHelper.setCSSClass(li, cssClasses, []);
    const link = document.createElement("a");
    DOMHelper.setCSSClass(
      link,
      [
        "inline-block",
        "text-sm",
        "text-gray-900",
        "hover:text-pink-900",
        "font-medium",
      ],
      []
    );
    link.href = itemInfo.seoRoute;
    link.innerText = itemInfo.label;
    link.setAttribute("data-link", "");
    li.appendChild(link);
    return li;
  }
}
